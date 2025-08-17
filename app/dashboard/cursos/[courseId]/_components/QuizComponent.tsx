import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import api from "@/lib/axios";
import { DetailedChapter, UserProgress } from "@/types/ChapterType";
import { useApiData } from "@/hooks/ApiContext";
import { getPurchasedCourses } from "@/hooks/coursesAPI";

interface Answer {
  id: number;
  content: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  content: string;
  answer: Answer[];
}

interface QuestionGroup {
  id: number;
  question: Question[];
}

interface QuizAttempt {
  attempt: number;
  qualification: number;
  approved: boolean;
}


interface QuizComponentProps {
  quiz: QuestionGroup[];
  userProgress: UserProgress | undefined;
  chapterId:string;
  initialAttempts?: QuizAttempt[];
  
}

const QUIZ_SETTINGS = {
  PASS_THRESHOLD: 60,
  TIME_LIMIT: 30 * 60,
  MAX_ATTEMPTS: 3,
  BAN_DURATION: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
};

export default function QuizComponent({ quiz, userProgress,chapterId,initialAttempts = []  }: QuizComponentProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_SETTINGS.TIME_LIMIT);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const {refreshPurchasedCourses } = useApiData()
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>(initialAttempts);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [banTimeLeft, setBanTimeLeft] = useState(0);
  
  // Mezclar y limitar preguntas a máximo 10
  const quizQuestions = useMemo(() => {
    const allQuestions = quiz.flatMap(group => group.question);
    
    // Mezclar las preguntas usando el algoritmo Fisher-Yates
    const shuffledQuestions = [...allQuestions];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
    
    // Limitar a máximo 10 preguntas
    return shuffledQuestions.slice(0, 10);
  }, [quiz]);
  
  const totalQuestions = quizQuestions.length;

  // Verificar baneo al cargar el componente
  useEffect(() => {
    const checkBanStatus = () => {
      const banKey = `quiz_ban_${chapterId}`;
      const banData = localStorage.getItem(banKey);
      
      if (banData) {
        const { bannedAt, attempts: banAttempts } = JSON.parse(banData);
        const now = Date.now();
        const timeElapsed = now - bannedAt;
        
        if (timeElapsed < QUIZ_SETTINGS.BAN_DURATION) {
          // Aún está baneado
          setIsBanned(true);
          setBanTimeLeft(QUIZ_SETTINGS.BAN_DURATION - timeElapsed);
        } else {
          // El baneo ha expirado, limpiar localStorage
          localStorage.removeItem(banKey);
          setIsBanned(false);
          setBanTimeLeft(0);
        }
      }
    };

    checkBanStatus();
    
    // Verificar cada minuto si el baneo ha expirado
    const interval = setInterval(checkBanStatus, 60000);
    
    return () => clearInterval(interval);
  }, [chapterId]);

  // Actualizar tiempo restante del baneo
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBanned && banTimeLeft > 0) {
      timer = setInterval(() => {
        setBanTimeLeft(prev => {
          if (prev <= 1000) {
            setIsBanned(false);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBanned, banTimeLeft]);

  useEffect(() => {
    console.log("Quiz component mounted with userProgress:", userProgress);
    
    setIsCompleted(userProgress?.isCompleted || false)
    if (userProgress && userProgress.quiz_attempt) {
      setAttempts(userProgress.quiz_attempt as QuizAttempt[]);
    }
    console.log("Initial attempts:", attempts);
  }, [userProgress,attempts]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && timeLeft > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      console.log("Time's up! Auto-submitting quiz...");
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [isStarted, timeLeft, showResults]);

  const handleStart = () => {
    if (isCompleted) {
      console.log("Quiz already completed. Cannot start again.");
      return;
    }
    console.log("Starting quiz attempt:", attempts.length + 1);
    setIsStarted(true);
  };

  const handleAnswerSelect = (questionId: number, answerId: number) => {
    console.log(`Selected answer ${answerId} for question ${questionId}`);
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const calculateScore = useCallback(() => {
    console.log("Calculating final score...");
    let correctAnswers = 0;
    quizQuestions.forEach((question) => {
      const selectedAnswerId = selectedAnswers[question.id];
      const correctAnswer = question.answer.find(a => a.isCorrect);
      if (correctAnswer && selectedAnswerId === correctAnswer.id) {
        correctAnswers++;
      }
    });
    const scorePercentage = (correctAnswers / totalQuestions) * 100;
    console.log(`Score: ${correctAnswers}/${totalQuestions} (${scorePercentage.toFixed(2)}%)`);
    return { correctAnswers, percentage: scorePercentage };
  }, [quizQuestions, selectedAnswers, totalQuestions]);

  const updateUserProgress = async (scoreData: { correctAnswers: number, percentage: number }) => {
    try {
      console.log("Updating user progress...");
      console.log("Score data:", scoreData);
    
      const isPassed = scoreData.percentage >= QUIZ_SETTINGS.PASS_THRESHOLD;
      console.log(`Quiz ${isPassed ? 'passed' : 'failed'} with ${scoreData.percentage}% (threshold: ${QUIZ_SETTINGS.PASS_THRESHOLD}%)`);

      const newAttempt: QuizAttempt = {
        attempt: attempts.length + 1,
        qualification: scoreData.percentage,
        approved: isPassed
      };

      const updatedAttempts = [...attempts, newAttempt];

      const payload = {
        data: {
          quiz_attempt: updatedAttempts,
          isCompleted: isPassed
        }
      };

      // Check if userProgress exists
      if (!userProgress?.documentId) {
        console.error("No user progress found for this chapter. Cannot update quiz progress.");
        throw new Error("No user progress found for this chapter");
      }

      console.log("Sending update to API:", payload);
      const response = await api.put(
        `/api/user-progresses/${userProgress.documentId}`,
        payload,
      );
      console.log(`/api/user-progresses/${userProgress.documentId}`)
      console.log("API response:", response.data);
      
      setAttempts(updatedAttempts);
      setIsCompleted(isPassed);

      // Si falló y ya tiene 3 intentos, aplicar baneo
      if (!isPassed && updatedAttempts.length >= QUIZ_SETTINGS.MAX_ATTEMPTS) {
        const banKey = `quiz_ban_${chapterId}`;
        const banData = {
          bannedAt: Date.now(),
          attempts: updatedAttempts.length
        };
        localStorage.setItem(banKey, JSON.stringify(banData));
        setIsBanned(true);
        setBanTimeLeft(QUIZ_SETTINGS.BAN_DURATION);
      }
      
      return isPassed;
    } catch (error) {
      console.error("Error updating user progress:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    // Check if userProgress is available
    if (!userProgress?.documentId) {
      console.error("No user progress available. Cannot submit quiz.");
      alert("Error: No se pudo cargar el progreso del usuario. Por favor, recarga la página e intenta nuevamente.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log("Submitting quiz...");
      
      const scoreData = calculateScore();
      setScore(scoreData.correctAnswers);
      setPercentage(scoreData.percentage);

      const isPassed = await updateUserProgress(scoreData);
      console.log(`Quiz submission complete. Passed: ${isPassed}`);
      refreshPurchasedCourses()
      
      setShowResults(true);
    } catch (error) {
      console.error("Error during quiz submission:", error);
      alert("Error al enviar el quiz. Por favor, intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatBanTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Si está baneado, mostrar mensaje de baneo
  if (isBanned) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="text-red-500" />
            Quiz Temporalmente Bloqueado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">Has excedido el límite de intentos</h4>
            <p className="text-red-700 mb-3">
              Has fallado el quiz {attempts.length} veces. Para proteger tu aprendizaje, 
              el quiz se ha bloqueado temporalmente.
            </p>
            <div className="bg-white border border-red-200 rounded-lg p-3">
              <p className="text-red-600 font-medium mb-2">Retoma el contenido, el quiz se habilitará dentro de:</p>
              <p className="text-2xl font-bold text-red-700 text-center">
                {formatBanTime(banTimeLeft)}
              </p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-semibold text-blue-800 mb-2">Recomendaciones:</h5>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Revisa el contenido del capítulo nuevamente</li>
              <li>• Toma notas de los puntos importantes</li>
              <li>• Practica con el material disponible</li>
              <li>• El quiz se desbloqueará automáticamente después de 24 horas</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isStarted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz del Capítulo</CardTitle>
        </CardHeader>
        <CardContent>
          {!userProgress ? (
            <div className="space-y-4">
              <p className="text-yellow-600">Cargando progreso del usuario...</p>
              <p>Por favor espera un momento mientras se prepara el quiz.</p>
            </div>
          ) : isCompleted ? (
            <div className="space-y-4">
              <p className="text-green-600">¡Has completado este quiz exitosamente!</p>
              <p>Ya no puedes volver a tomar este quiz.</p>
              {/* Mostrar nota del quiz completado */}
              {attempts.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Nota del Quiz:</h4>
                  <p className="text-green-700">
                    Puntuación: {attempts[attempts.length - 1].qualification.toFixed(2)}%
                  </p>
                  <p className="text-green-700">
                    Estado: {attempts[attempts.length - 1].approved ? 'Aprobado' : 'Reprobado'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <p>Este quiz contiene {totalQuestions} preguntas seleccionadas aleatoriamente y tienes 30 minutos para completarlo.</p>
                {quiz.flatMap(group => group.question).length > 10 && (
                  <p className="text-blue-600 text-sm">
                    <strong>Nota:</strong> De un total de {quiz.flatMap(group => group.question).length} preguntas disponibles, se han seleccionado aleatoriamente {totalQuestions} para este quiz.
                  </p>
                )}
                <p>Necesitas al menos {QUIZ_SETTINGS.PASS_THRESHOLD}% para aprobar.</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-700 text-sm">
                    <strong>Intentos restantes:</strong> {QUIZ_SETTINGS.MAX_ATTEMPTS - attempts.length} de {QUIZ_SETTINGS.MAX_ATTEMPTS}
                  </p>
                  {attempts.length > 0 && (
                    <p className="text-yellow-600 text-xs mt-1">
                      Este es tu intento #{attempts.length + 1}
                    </p>
                  )}
                </div>
                {attempts.length >= QUIZ_SETTINGS.MAX_ATTEMPTS - 1 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">
                      <strong>⚠️ Último intento:</strong> Si fallas este intento, el quiz se bloqueará por 24 horas.
                    </p>
                  </div>
                )}
              </div>
              <Button onClick={handleStart} className="mt-4">Comenzar Quiz</Button>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const isPassed = percentage >= QUIZ_SETTINGS.PASS_THRESHOLD;
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Resultados del Quiz
            {isPassed ? (
              <CheckCircle className="text-green-500" />
            ) : (
              <XCircle className="text-red-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">Has acertado {score} de {totalQuestions} preguntas.</p>
          <Progress value={percentage} className="w-full" />
          <div className="space-y-2">
            <p className="font-semibold text-lg">
              Nota: {percentage.toFixed(2)}%
            </p>
            <p className={isPassed ? "text-green-600" : "text-red-600"}>
              {isPassed 
                ? "¡Felicitaciones! Has aprobado el quiz." 
                : `No has alcanzado el porcentaje mínimo requerido (${QUIZ_SETTINGS.PASS_THRESHOLD}%).`
              }
            </p>
            {!isPassed && !isCompleted && (
              <Button 
                onClick={() => {
                  setIsStarted(false);
                  setShowResults(false);
                  setSelectedAnswers({});
                  setTimeLeft(QUIZ_SETTINGS.TIME_LIMIT);
                }}
                className="mt-4"
              >
                Intentar Nuevamente
              </Button>
            )}
            {isCompleted && (
              <div className="space-y-2">
                <p className="text-green-600 mt-4">
                  Has completado este quiz. No puedes volver a intentarlo.
                </p>
                {/* Mostrar nota final del quiz */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Nota Final del Quiz:</h4>
                  <p className="text-green-700 text-lg font-bold">
                    {attempts[attempts.length - 1].qualification.toFixed(2)}%
                  </p>
                  <p className="text-green-700">
                    Estado: {attempts[attempts.length - 1].approved ? 'Aprobado' : 'Reprobado'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Quiz del Capítulo</span>
          <span className="flex items-center text-lg font-normal">
            <Clock className="mr-2" />
            {formatTime(timeLeft)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh] pr-4">
          {quizQuestions.map((question, index) => (
            <div key={question.id} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                {index + 1}. {question.content}
              </h3>
              <RadioGroup
                onValueChange={(value) => handleAnswerSelect(question.id, parseInt(value))}
                value={selectedAnswers[question.id]?.toString()}
              >
                {question.answer.map((answer) => (
                  <div key={answer.id} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value={answer.id.toString()} id={`q${question.id}-a${answer.id}`} />
                    <Label htmlFor={`q${question.id}-a${answer.id}`}>{answer.content}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div>
          Preguntas respondidas: {Object.keys(selectedAnswers).length} / {totalQuestions}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Finalizar Quiz"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro de que quieres finalizar el quiz?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Asegúrate de haber respondido todas las preguntas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>Finalizar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

