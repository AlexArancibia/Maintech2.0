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

  useEffect(() => {
    const createMissingUserProgresses = async () => {
      if (!user || !chapters.length) return;

      for (const chapter of chapters) {
        if (chapter.quiz && chapter.quiz.length > 0) {
          const existingProgress =  chapter.user_progresses.find(progress => progress.users_permissions_user.email === user.email)
          if (!existingProgress) {
            try {
              const response = await api.post('/api/user-progresses', {
                data: {
                  isCompleted: false,
                  chapter: chapter.id,
                  users_permissions_user: user.id,
                  quiz_attempt: []
                }
              },  );
              console.log(`Created new user progress for chapter ${chapter.id}:`, response.data.data);
            } catch (error) {
              console.error(`Error creating user progress for chapter ${chapter.id}:`, error);
            }
          }
        }
      }
    };

    createMissingUserProgresses();
  }, [user, chapters]);
  const calculateProgress = () => {
    if (!chapters.length || !user) return 0;
    const completedChapters = chapters.filter(chapter => 
      chapter.user_progresses?.some(progress => 
        progress.isCompleted && progress.users_permissions_user.id === user.id
      )
    ).length;
    return (completedChapters / chapters.length) * 100;
  };

  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  if (isLoading || !isPurchasedCoursesReady) {
 
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container-section p-8 sm:p-16 h-[200px] bg-[url('/curso.png')]">
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
      <div className="container-section p-8 sm:p-16 h-[200px] bg-[url('/curso.png')]">
        <div className="content-section">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-white">{course?.title }</h1>
            <p className="text-xl text-muted-foreground text-white">{course?.category.name || ""}</p>
          </header>
        </div>
      </div>
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 md:sticky md:top-0 md:self-start">
              {user && <CourseProgress progress={calculateProgress()} />}
              <ChapterList
                chapters={chapters} 
                selectedChapter={selectedChapter} 
                onSelectChapter={setSelectedChapter}
                currentUser={user}
              />
            </div>
            <div className="md:w-2/3">
              {selectedChapter && <ChapterContent chapter={selectedChapter} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

