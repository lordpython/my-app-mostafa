import axios from "axios"

export const useAPIRequests = () => {
  const postRequest = async <T>(endpoint: string, data: any): Promise<T> => {
    try {
      const response = await axios.post<T>(`/api/${endpoint}`, data)
      return response.data
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error)
      throw error
    }
  }

  // You can add more request methods (GET, PUT, DELETE) if needed

  return { postRequest }
}
