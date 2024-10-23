// src\app\services\triviaApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Question } from "../../types"

export const triviaApi = createApi({
  reducerPath: "triviaApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }),
  endpoints: builder => ({
    getQuestions: builder.query<Question[], void>({
      query: () => "/questions",
    }),
  }),
})

export const { useGetQuestionsQuery } = triviaApi
