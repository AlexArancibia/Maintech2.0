'use client'

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react'
import { getBasicCourses, getDetailedCourses, getPurchasedCourses } from './coursesAPI'
import { getCategories } from './categoriesAPI'
import { Category } from '@/types/CategoryType'
import { BasicCourse, DetailedCourse } from '@/types/CoursesType'
import { useAuth } from './AuthContext'

interface ApiContextType {
  basicCourses: BasicCourse[]
  detailedCourses: DetailedCourse[]
  categories: Category[]
  purchasedCourses: DetailedCourse[]
  isLoading: boolean
  error: string | null
  refreshBasicCourses: () => Promise<void>
  refreshDetailedCourses: () => Promise<void>
  refreshCategories: () => Promise<void>
  refreshPurchasedCourses: () => Promise<void>
  refreshAllData: () => Promise<void>
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export function ApiProvider({ children }: { children: ReactNode }) {
  const [basicCourses, setBasicCourses] = useState<BasicCourse[]>([])
  const [detailedCourses, setDetailedCourses] = useState<DetailedCourse[]>([])
  const [purchasedCourses, setPurchasedCourses] = useState<DetailedCourse[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const refreshBasicCourses = useCallback(async () => {
    try {
      setIsLoading(true)
      const courses = await getBasicCourses()
      setBasicCourses(courses)
    } catch (err) {
      setError('Failed to fetch basic courses')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshDetailedCourses = useCallback(async () => {
    try {
      setIsLoading(true)
      const courses = await getDetailedCourses()
      setDetailedCourses(courses)
    } catch (err) {
      setError('Failed to fetch detailed courses')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshCategories = useCallback(async () => {
    try {
      setIsLoading(true)
      const newCategories = await getCategories()
      setCategories(newCategories)
    } catch (err) {
      setError('Failed to fetch categories')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshPurchasedCourses = useCallback(async () => {
    if (!user?.email) {
      setPurchasedCourses([])
      return
    }
    try {
      setIsLoading(true)
      const courses = await getPurchasedCourses(user.email)
      setPurchasedCourses(courses)
    } catch (err) {
      setError('Failed to fetch purchased courses')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const refreshAllData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      await Promise.all([
        refreshBasicCourses(),
        refreshDetailedCourses(),
        refreshCategories(),
        refreshPurchasedCourses()
      ])
    } catch (err) {
      setError('Failed to refresh all data')
    } finally {
      setIsLoading(false)
    }
  }, [refreshBasicCourses, refreshDetailedCourses, refreshCategories, refreshPurchasedCourses])

  useEffect(() => {
    refreshAllData()
  }, [refreshAllData])

  return (
    <ApiContext.Provider 
      value={{ 
        basicCourses, 
        detailedCourses, 
        categories, 
        purchasedCourses,
        isLoading, 
        error,
        refreshBasicCourses,
        refreshDetailedCourses,
        refreshCategories,
        refreshPurchasedCourses,
        refreshAllData
      }}
    >
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

