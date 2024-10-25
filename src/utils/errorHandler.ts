// src/utils/errorHandler.ts

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export const handleAPIError = (error: any): never => {
  if (error.response) {
    const message = error.response.data?.message || 
      error.response.data?.error || 
      'حدث خطأ في الاتصال بالخادم'
    
    throw new APIError(
      message,
      error.response.status,
      error.response.data?.code
    )
  } else if (error.request) {
    throw new APIError('لم يتم تلقي رد من الخادم')
  } else {
    throw new APIError(error.message || 'حدث خطأ غير متوقع')
  }
}

export const logError = (
  error: Error,
  context: string,
  additionalData?: Record<string, any>
): void => {
  console.error(`Error in ${context}:`, {
    message: error.message,
    stack: error.stack,
    ...additionalData
  })
}

export const displayUserError = (error: Error): string => {
  if (error instanceof APIError) {
    return error.message
  }
  
  // Map technical errors to user-friendly messages
  const errorMessages: Record<string, string> = {
    'Network Error': 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.',
    'Timeout': 'انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.',
    'Invalid Input': 'البيانات المدخلة غير صالحة. يرجى التحقق منها.',
    'Not Found': 'لم يتم العثور على المحتوى المطلوب.',
    'Server Error': 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.'
  }

  return errorMessages[error.name] || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
}

export const isNetworkError = (error: any): boolean => {
  return (
    error.message === 'Network Error' ||
    error.code === 'ECONNABORTED' ||
    !error.response
  )
}