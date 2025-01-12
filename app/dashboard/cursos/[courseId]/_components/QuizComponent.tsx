import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from "@/hooks/AuthContext";
import api from "@/lib/axios";
import { getUserProgress } from "@/hooks/chaptersAPI";

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
  userEmail: string;
  chapterId:string;
  initialAttempts?: QuizAttempt[];
}

const QUIZ_SETTINGS = {
  PASS_THRESHOLD: 60,
  TIME_LIMIT: 30 * 60,
};

export default function QuizComponent({ quiz, userEmail,chapterId,initialAttempts = [] }: QuizComponentProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_SETTINGS.TIME_LIMIT);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>(initialAttempts);

  const allQuestions = quiz.flatMap(group => group.question);
  const totalQuestions = allQuestions.length;

  useEffect(() => {
    console.log("Quiz component mounted with userProgressId:", userEmail);
    console.log("Initial attempts:", initialAttempts);
  }, [userEmail, initialAttempts]);

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
    allQuestions.forEach((question) => {
      const selectedAnswerId = selectedAnswers[question.id];
      const correctAnswer = question.answer.find(a => a.isCorrect);
      if (correctAnswer && selectedAnswerId === correctAnswer.id) {
        correctAnswers++;
      }
    });
    const scorePercentage = (correctAnswers / totalQuestions) * 100;
    console.log(`Score: ${correctAnswers}/${totalQuestions} (${scorePercentage.toFixed(2)}%)`);
    return { correctAnswers, percentage: scorePercentage };
  }, [allQuestions, selectedAnswers, totalQuestions]);

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

      console.log("Sending update to API:", payload);
 
      const response = await getUserProgress(chapterId,userEmail)
      console.log("API response:", response);
    
      setAttempts(updatedAttempts);
      return isPassed;
    } catch (error) {
      console.error("Error updating user progress:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      console.log("Submitting quiz...");
      
      const scoreData = calculateScore();
      setScore(scoreData.correctAnswers);
      setPercentage(scoreData.percentage);

      const isPassed = await updateUserProgress(scoreData);
      console.log(`Quiz submission complete. Passed: ${isPassed}`);
      
      setShowResults(true);
    } catch (error) {
      console.error("Error during quiz submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isStarted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz del Capítulo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Este quiz contiene {totalQuestions} preguntas y tienes 30 minutos para completarlo.</p>
            <p>Necesitas al menos {QUIZ_SETTINGS.PASS_THRESHOLD}% para aprobar.</p>
            {attempts.length > 0 && (
              <p className="text-yellow-600">
                Este es tu intento #{attempts.length + 1}
              </p>
            )}
          </div>
          <Button onClick={handleStart} className="mt-4">Comenzar Quiz</Button>
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
            <p className="font-semibold">
              Puntuación: {percentage.toFixed(2)}%
            </p>
            <p className={isPassed ? "text-green-600" : "text-red-600"}>
              {isPassed 
                ? "¡Felicitaciones! Has aprobado el quiz." 
                : `No has alcanzado el porcentaje mínimo requerido (${QUIZ_SETTINGS.PASS_THRESHOLD}%).`
              }
            </p>
            {!isPassed && (
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
          {allQuestions.map((question, index) => (
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

