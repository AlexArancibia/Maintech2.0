"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCardSections, CardSection, CardSectionsOptions } from './cardSectionsAPI';

interface CardSectionsCache {
  [documentId: string]: {
    data: CardSection[];
    loading: boolean;
    error: string | null;
    timestamp: number;
  };
}

interface CardSectionsContextType {
  cache: CardSectionsCache;
  isSessionLoaded: boolean;
  getSection: (documentId: string, options?: CardSectionsOptions) => Promise<CardSection[]>;
  preloadPageSections: (pathname: string) => Promise<void>;
  isLoading: (documentId: string) => boolean;
  hasError: (documentId: string) => boolean;
  getError: (documentId: string) => string | null;
  clearCache: () => void;
}

const CardSectionsContext = createContext<CardSectionsContextType | undefined>(undefined);

// Mapeo de páginas a sus secciones
const PAGE_SECTIONS = {
  '/': [
    { documentId: "ponlmmmda3n3wrhw8ilzau85", options: {} },
    { documentId: "fstrvw9pumbbsvv1qcco52o4", options: { populateCard: true } },
    { documentId: "k1e6obytf5ad5xpzqx1gjgz4", options: { populateCard: true } },
  ],
  '/solutions': [
    { documentId: "smk1j7aokc3y54pbklz4juek", options: {} },
    { documentId: "ekm5113zuc5nz0sgvey4gf8j", options: { populateCard: true } },
    { documentId: "xnz2bemu7o0rqvicpiw21n9x", options: { populateCard: true } },
    { documentId: "z4q87za2zm8o2y1hiz0ouomo", options: { populateCard: true } },
  ],
  '/quienes-somos': [
    { documentId: "bz2dmgrn223q3lxdkyx66nrj", options: { populateCard: true } },
    { documentId: "ixoklgqxn382lxbvyg4aha2x", options: { populateCard: true } },
  ],
  'global': [
    { documentId: "ddby7pqxvqcjsyz67a747c8c", options: { populateCard: true } },
  ]
};

export function CardSectionsProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState<CardSectionsCache>({});
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  // Cargar cache desde sessionStorage al inicializar
  useEffect(() => {
    try {
      const savedCache = sessionStorage.getItem('cardSectionsCache');
      if (savedCache) {
        const parsedCache = JSON.parse(savedCache);
        const cacheKeys = Object.keys(parsedCache);
        console.log(`💾 [SESSION] Cache cargado desde sessionStorage: ${cacheKeys.length} secciones`);
        console.log(`📋 [SESSION] Secciones en cache:`, cacheKeys.map(key => key.split('_')[0]));
        setCache(parsedCache);
      } else {
        console.log(`💾 [SESSION] No hay cache en sessionStorage - Iniciando con cache vacío`);
      }
    } catch (error) {
      console.error(`❌ [SESSION] Error al cargar cache desde sessionStorage:`, error);
    } finally {
      setIsSessionLoaded(true);
    }
  }, []);

  // Guardar cache en sessionStorage cuando cambie
  useEffect(() => {
    try {
      const cacheKeys = Object.keys(cache);
      if (cacheKeys.length > 0) {
        sessionStorage.setItem('cardSectionsCache', JSON.stringify(cache));
        console.log(`💾 [SESSION] Cache guardado en sessionStorage: ${cacheKeys.length} secciones`);
      }
    } catch (error) {
      console.error(`❌ [SESSION] Error al guardar cache en sessionStorage:`, error);
    }
  }, [cache]);

  const getSection = async (documentId: string, options: CardSectionsOptions = {}): Promise<CardSection[]> => {
    const cacheKey = `${documentId}_${JSON.stringify(options)}`;
    const cached = cache[cacheKey];

    // Si ya está cargado, retornar datos del cache
    if (cached && !cached.loading && !cached.error) {
      return cached.data;
    }

    // Si ya está cargando, esperar
    if (cached?.loading) {
      return new Promise((resolve, reject) => {
        const checkLoading = () => {
          const currentCache = cache[cacheKey];
          if (currentCache && !currentCache.loading) {
            if (currentCache.error) {
              reject(new Error(currentCache.error));
            } else {
              resolve(currentCache.data);
            }
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    // Marcar como cargando
    setCache(prev => ({
      ...prev,
      [cacheKey]: {
        data: [],
        loading: true,
        error: null,
        timestamp: Date.now()
      }
    }));

    try {
      console.log(`📡 [API] Haciendo fetch a la API para: ${documentId}`);
      const data = await getCardSections({ documentId, ...options });
      console.log(`✅ [API] Datos recibidos de la API para: ${documentId} (${data.length} elementos)`);
      
      // Guardar en cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: {
          data,
          loading: false,
          error: null,
          timestamp: Date.now()
        }
      }));

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error(`❌ [API] Error en fetch para ${documentId}:`, errorMessage);
      
      setCache(prev => ({
        ...prev,
        [cacheKey]: {
          data: [],
          loading: false,
          error: errorMessage,
          timestamp: Date.now()
        }
      }));

      throw error;
    }
  };

  const preloadPageSections = async (pathname: string): Promise<void> => {
    // Esperar a que el sessionStorage se cargue antes de precargar
    if (!isSessionLoaded) {
      console.log(`⏳ [PRELOAD] Esperando a que se cargue el sessionStorage...`);
      return;
    }

    const pageSections = PAGE_SECTIONS[pathname as keyof typeof PAGE_SECTIONS] || [];
    const globalSections = PAGE_SECTIONS.global || [];
    const allSections = [...pageSections, ...globalSections];

    console.log(`🚀 [PRELOAD] Iniciando precarga para página: ${pathname}`);
    console.log(`📋 [PRELOAD] Secciones a precargar:`, allSections.map(s => s.documentId));

    // Precargar solo las que no están cargadas
    const promises = allSections.map(async (section) => {
      const cacheKey = `${section.documentId}_${JSON.stringify(section.options)}`;
      const cached = cache[cacheKey];
      
      // Solo cargar si no está cargado y no está cargando
      if (!cached || (!cached.loading && cached.error)) {
        console.log(`🔄 [PRELOAD] Precargando: ${section.documentId}`);
        try {
          await getSection(section.documentId, section.options);
          console.log(`✅ [PRELOAD] Precargado exitosamente: ${section.documentId}`);
        } catch (error) {
          console.error(`❌ [PRELOAD] Error al precargar ${section.documentId}:`, error);
        }
      } else {
        console.log(`🎯 [PRELOAD] Ya está en cache: ${section.documentId}`);
      }
    });

    await Promise.allSettled(promises);
    console.log(`🎉 [PRELOAD] Precarga completada para: ${pathname}`);
  };

  const isLoading = (documentId: string): boolean => {
    return Object.keys(cache).some(key => 
      key.startsWith(documentId) && cache[key].loading
    );
  };

  const hasError = (documentId: string): boolean => {
    return Object.keys(cache).some(key => 
      key.startsWith(documentId) && cache[key].error !== null
    );
  };

  const getError = (documentId: string): string | null => {
    const cacheKey = Object.keys(cache).find(key => 
      key.startsWith(documentId) && cache[key].error !== null
    );
    return cacheKey ? cache[cacheKey].error : null;
  };

  const clearCache = (): void => {
    setCache({});
    try {
      sessionStorage.removeItem('cardSectionsCache');
    } catch (error) {
      // Error silencioso
    }
  };

  const value: CardSectionsContextType = {
    cache,
    isSessionLoaded,
    getSection,
    preloadPageSections,
    isLoading,
    hasError,
    getError,
    clearCache
  };

  return (
    <CardSectionsContext.Provider value={value}>
      {children}
    </CardSectionsContext.Provider>
  );
}

export function useCardSections() {
  const context = useContext(CardSectionsContext);
  if (context === undefined) {
    throw new Error('useCardSections debe ser usado dentro de un CardSectionsProvider');
  }
  return context;
}

// Hook optimizado para obtener una sección
export function useCardSection(documentId: string, options: CardSectionsOptions = {}) {
  const { cache, isSessionLoaded, getSection, isLoading, hasError, getError } = useCardSections();
  const [data, setData] = useState<CardSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `${documentId}_${JSON.stringify(options)}`;
  const cached = cache[cacheKey];

  useEffect(() => {
    // Esperar a que el sessionStorage se cargue antes de hacer cualquier cosa
    if (!isSessionLoaded) {
      console.log(`⏳ [${documentId}] Esperando a que se cargue el sessionStorage...`);
      return;
    }

    // Si ya está en cache y es válido, usar datos del cache
    if (cached && !cached.loading && !cached.error) {
      console.log(`🎯 [${documentId}] ✅ Datos encontrados en CACHE - Usando datos existentes`);
      setData(cached.data);
      setLoading(false);
      setError(null);
      return;
    }

    // Solo hacer fetch si no está en cache o hay error
    if (!cached || cached.error) {
      console.log(`🔄 [${documentId}] ⏳ Datos NO encontrados en cache - Iniciando carga...`);
      
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
          console.log(`📡 [${documentId}] 🌐 Haciendo fetch a la API...`);
          const result = await getSection(documentId, options);
          console.log(`✅ [${documentId}] 🎉 Datos cargados exitosamente desde API`);
          setData(result);
        } catch (err) {
          console.error(`❌ [${documentId}] 💥 Error al cargar datos:`, err);
          setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [documentId, JSON.stringify(options), cached, isSessionLoaded]);

  // Siempre retornar el mismo objeto con la misma estructura
  return {
    data,
    loading: loading || isLoading(documentId),
    error: error || getError(documentId),
    hasError: hasError(documentId)
  };
}
