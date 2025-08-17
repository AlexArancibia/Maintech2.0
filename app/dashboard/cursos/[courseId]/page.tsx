"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getChaptersByCourse } from "@/hooks/chaptersAPI";
import { useAuth } from "@/hooks/AuthContext";
 
import { BasicCourse, DetailedCourse } from "@/types/CoursesType";
import { DetailedChapter } from "@/types/ChapterType";
import { User } from "@/types/StudentType";
import { getCourseBySlug } from "@/hooks/coursesAPI";
import { ChapterContentSkeleton, ChapterListSkeleton, CourseProgressSkeleton } from "./_components/SkeletonComponents";
import CourseProgress from "./_components/CourseProgress";
import ChapterList from "./_components/ChapterList";
import ChapterContent from "./_components/ChapterContent";
import api from "@/lib/axios";
import { useApiData } from "@/hooks/ApiContext";

type Params = { courseId: string };
export default function CourseComponent() {
  const { user } = useAuth();
  const { purchasedCourses ,isLoading} = useApiData()
  const params = useParams<Params>();
  const router = useRouter();
  const [course, setCourse] = useState<DetailedCourse | null>(null);
  const [chapters, setChapters] = useState<DetailedChapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<DetailedChapter | null>(null);
 
  const [error, setError] = useState<string | null>(null);
  const [isPurchasedCoursesReady, setIsPurchasedCoursesReady] = useState(false);
  const [hasCreatedProgresses, setHasCreatedProgresses] = useState(false);

  useEffect(() => {
    if (purchasedCourses.length > 0) {
      setIsPurchasedCoursesReady(true);
    }
  }, [purchasedCourses]);

  useEffect(() => {
    async function fetchCourse() {
      console.log("Iniciando fetchCourse");
      console.log("Estado actual de purchasedCourses:", purchasedCourses);
      if (!isPurchasedCoursesReady) {
        return
      }
      
      try {
        const fetchedCourse = purchasedCourses.find(course => course.titleSlug === params.courseId);
        if (fetchedCourse) {
          setCourse(fetchedCourse);
          const fetchedChapters = fetchedCourse.chapters || [];
          setChapters(fetchedChapters);
          setSelectedChapter(fetchedChapters.length > 0 ? fetchedChapters[0] : null);
          setHasCreatedProgresses(false); // Reset for new course
        } else {
          setError("Course not found");
        }
      } catch (err) {
        console.error("Error al obtener detalles del curso:", err);
        setError("Failed to fetch course details");
      } finally {
        console.log("Finalizando fetchCourse");
      }

    }

    fetchCourse();
  }, [params.courseId, purchasedCourses, router, isPurchasedCoursesReady]);

  // Create user progress for all chapters when entering the course
  useEffect(() => {
    const createMissingUserProgresses = async () => {
      if (!user || !chapters.length || hasCreatedProgresses) return;
      
      console.log('📧 [EMAIL] Iniciando verificación de progresos y envío de emails...');

      console.log(`Checking for missing user progress in course with ${chapters.length} chapters`);

      for (const chapter of chapters) {
        const existingProgress = chapter.user_progresses?.find(progress => 
          progress.users_permissions_user?.email === user.email
        );

        if (!existingProgress) {
          console.log(`Creating user progress for chapter ${chapter.id}`);
          
          try {
            const response = await api.post('/api/user-progresses', {
              data: {
                isCompleted: false,
                chapter: chapter.id,
                users_permissions_user: user.id,
              }
            });
            
            console.log(`Created user progress for chapter ${chapter.id}:`, response.data.data);
            
            // Update the chapter's user_progresses array
            if (chapter.user_progresses) {
              chapter.user_progresses.push(response.data.data);
            } else {
              chapter.user_progresses = [response.data.data];
            }

            // Enviar email de bienvenida solo si es el primer capítulo (inscripción al curso)
            console.log(`📧 [EMAIL] Verificando envío para capítulo ${chapter.id}, posición: ${chapter.position}`);
            if (chapter.position === 1) {
              // Verificar si ya se envió el email de bienvenida para este curso
              const emailSentKey = `welcome_email_sent_${course?.id}_${user.email}`;
              const hasEmailBeenSent = localStorage.getItem(emailSentKey);
              
              if (hasEmailBeenSent) {
                console.log('📧 [EMAIL] Email de bienvenida ya fue enviado para este curso, saltando...');
              } else {
                console.log(`📧 [EMAIL] ¡Es el primer capítulo! Enviando email de bienvenida a: ${user.email}`);
                try {
                  const emailResponse = await fetch('/api/send-course-welcome', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userEmail: user.email,
                      userName: user.username || user.email,
                      courseTitle: course?.title || 'Curso'
                    }),
                  });
                  
                  if (emailResponse.ok) {
                    const emailData = await emailResponse.json();
                    console.log('✅ [EMAIL] Email de bienvenida enviado exitosamente:', emailData);
                    // Marcar como enviado para evitar duplicados
                    localStorage.setItem(emailSentKey, 'true');
                  } else {
                    console.error('❌ [EMAIL] Error en respuesta de API:', emailResponse.status, emailResponse.statusText);
                  }
                } catch (emailError) {
                  console.error('❌ [EMAIL] Error al enviar email de bienvenida:', emailError);
                }
              }
            } else {
              console.log(`📧 [EMAIL] No es el primer capítulo (posición ${chapter.position}), no se envía email`);
            }
          } catch (error: any) {
            console.error(`Error creating user progress for chapter ${chapter.id}:`, error);
            
            // If conflict, the progress already exists, skip
            if (error.response?.status === 409) {
              console.log(`Progress already exists for chapter ${chapter.id}, skipping`);
            }
          }
        } else {
          console.log(`User progress already exists for chapter ${chapter.id}`);
        }
      }

      setHasCreatedProgresses(true);
    };

    createMissingUserProgresses();
  }, [user, chapters, hasCreatedProgresses]);
  const calculateProgress = () => {
    if (!chapters.length || !user) return 0;
    try {
      const completedChapters = chapters.filter(chapter => 
        chapter.user_progresses?.some(progress => 
          progress.isCompleted && progress.users_permissions_user?.id === user.id
        )
      ).length;
      return (completedChapters / chapters.length) * 100;
    } catch (error) {
      console.error("Error calculating progress:", error);
      return 0;
    }
  };

  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  if (isLoading || !isPurchasedCoursesReady) {
 
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container-section p-8 sm:p-16 h-[200px] bg-gradient-to-br ">
          <div className="content-section">
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-white">Cargando curso...</h1>
            </header>
          </div>
        </div>
        <div className="flex-grow bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 md:sticky md:top-0 md:self-start">
                <CourseProgressSkeleton />
                <ChapterListSkeleton />
              </div>
              <div className="md:w-2/3">
                <ChapterContentSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
 
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container-section p-8 sm:p-16 h-[270px] bg-[url('/fondocurso.png')]  bg-center">
        <div className="content-section">
          <header className="mb-8 flex flex-col gap-4">
            <h1 className="text-4xl font-bold  text-white">{course?.title }</h1>
            <p className="text-xl text-muted-foreground text-white">{course?.category.name || ""}</p>
            <div className="max-w-[500px]">
            {user && course && (
              <div key={`${user.id}-${course.id}`}>
                <CourseProgress 
                  progress={calculateProgress()}
                  user={user}
                  course={course}
                />
              </div>
            )}
            </div>
          </header>
        </div>
      </div>
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 md:sticky md:top-0 md:self-start">
              
              <ChapterList
                chapters={chapters} 
                selectedChapter={selectedChapter} 
                onSelectChapter={setSelectedChapter}
                currentUser={user}
                
              />
            </div>
            <div className="md:w-2/3">
              {selectedChapter && <ChapterContent chapter={selectedChapter} courseTitle={course?.title} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

