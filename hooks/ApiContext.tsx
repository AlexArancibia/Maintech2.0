'use client'

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import {  getBasicCourses, getDetailedCourses } from './coursesAPI'
import { getCategories } from './categoriesAPI'
import { Category } from '@/types/CategoryType'
import { BasicCourse, DetailedCourse } from '@/types/CoursesType'
interface ApiContextType  { 
  basicCourses: BasicCourse[]
  detailedCourses: DetailedCourse[]
  categories: Category[]

  isLoading: boolean
  error: string | null
}

const ApiContext = createContext<ApiContextType  | undefined>(undefined)

export function ApiProvider({ children }: { children: ReactNode }) {
  const [basicCourses, setBasicCourses] = useState<BasicCourse[]>([])
  const [detailedCourses, setDetailedCourses] = useState<DetailedCourse[]>([])
    
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const [basic, detailed, cats] = await Promise.all([
          getBasicCourses(),
          getDetailedCourses(),
          getCategories()
        ])
        setBasicCourses(basic)
        setDetailedCourses(detailed)
        setCategories(cats)
      } catch (err) {
        setError('Failed to fetch courses')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return (
    <ApiContext.Provider value={{ basicCourses, detailedCourses, categories, isLoading, error }}>
      {children}
    </ApiContext.Provider>
  )
}


export function useApiData() {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error('useApiData must be used within an ApiProvider')
  }
  return context
}