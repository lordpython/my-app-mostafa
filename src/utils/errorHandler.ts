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

export const handleAPIError = (error: any) => {
  if (error.response) {
    const message = error.response.data.message || 'حدث خطأ في الخادم'
    throw new APIError(message, error.response.status, error.response.data.code)
  } else if (error.request) {
    throw new APIError('لم يتم تلقي رد من الخادم')
  } else {
    throw new APIError(error.message || 'فشل الطلب')
  }
}
