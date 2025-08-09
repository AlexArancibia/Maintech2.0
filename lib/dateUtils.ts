/**
 * Utilidades para manejo de fechas en Perú (GMT-5)
 */

/**
 * Convierte una fecha a la zona horaria de Perú (GMT-5)
 * @param date - Fecha a convertir
 * @returns Fecha en zona horaria de Perú
 */
export const convertToPeruTime = (date: Date | string): Date => {
  // Si la fecha es solo fecha (sin hora), tratarla como fecha local para evitar problemas de timezone
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    // Para fechas como "2025-08-22", crear la fecha directamente en zona horaria local
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Para fechas con hora, convertir correctamente a zona horaria de Perú
  // Obtener la fecha en timezone de Lima
  const peruTime = new Date(dateObj.toLocaleString("en-US", {
    timeZone: "America/Lima"
  }));
  
  return peruTime;
};

/**
 * Obtiene la fecha y hora actual en Perú
 * @returns Fecha actual en Perú
 */
export const getCurrentPeruTime = (): Date => {
  return new Date(new Date().toLocaleString("en-US", {
    timeZone: "America/Lima"
  }));
};

/**
 * Formatea una fecha para mostrar en español
 * @param date - Fecha a formatear
 * @returns Fecha formateada en español
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Lima'
  });
};

/**
 * Formatea solo la fecha (sin hora) en español
 * @param date - Fecha a formatear
 * @returns Fecha formateada en español
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Lima'
  });
};

/**
 * Formatea solo la hora en formato 24h
 * @param date - Fecha a formatear
 * @returns Hora formateada
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Lima'
  });
};

/**
 * Verifica si una fecha es anterior a un día antes de la fecha actual
 * @param date - Fecha a verificar
 * @returns true si la fecha es anterior a un día antes de hoy
 */
export const isOlderThanOneDay = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const peruDate = convertToPeruTime(dateObj);
  const currentPeruDate = getCurrentPeruTime();
  
  // Restar un día a la fecha actual
  const oneDayAgo = new Date(currentPeruDate);
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
  return peruDate < oneDayAgo;
};

/**
 * Verifica si una fecha es futura (después de ahora)
 * @param date - Fecha a verificar
 * @returns true si la fecha es futura
 */
export const isFutureDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const peruDate = convertToPeruTime(dateObj);
  const currentPeruDate = getCurrentPeruTime();
  
  return peruDate > currentPeruDate;
};

/**
 * Calcula la duración entre dos fechas
 * @param startDate - Fecha de inicio
 * @param endDate - Fecha de fin
 * @returns Duración formateada
 */
export const calculateDuration = (startDate: string | Date, endDate: string | Date): string => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  // Convertir a fecha local sin hora para comparar solo fechas
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
  const diffTime = endDay.getTime() - startDay.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "1 día";
  } else if (diffDays === 1) {
    return "2 días";
  } else {
    return `${diffDays + 1} días`;
  }
};

/**
 * Formatea la fecha de inicio de un curso (maneja fechas sin hora correctamente)
 * @param date - Fecha a formatear
 * @returns Fecha formateada en español
 */
export const formatCourseStartDate = (date: Date | string): string => {
  const peruDate = convertToPeruTime(date);
  return peruDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Lima'
  });
};

/**
 * Formatea la fecha de fin de un curso (maneja fechas sin hora correctamente)
 * @param date - Fecha a formatear
 * @returns Fecha formateada en español
 */
export const formatCourseEndDate = (date: Date | string): string => {
  const peruDate = convertToPeruTime(date);
  return peruDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Lima'
  });
};

/**
 * Función específica para formatear fechas de cursos sin problemas de zona horaria
 * @param date - Fecha a formatear
 * @param options - Opciones de formato
 * @returns Fecha formateada
 */
export const formatCourseDateSafe = (date: Date | string, options: Intl.DateTimeFormatOptions): string => {
  const peruDate = convertToPeruTime(date);
  
  // Asegurar que siempre usemos la zona horaria de Lima
  const formatOptions = {
    ...options,
    timeZone: 'America/Lima'
  };
  
  return peruDate.toLocaleDateString('es-ES', formatOptions);
}; 