import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Quote } from "../../types"

export const quotesApi = createApi({
  reducerPath: "quotesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }), // Update the base URL as needed
  endpoints: (builder) => ({
    getQuotes: builder.query<Quote[], void>({
      query: () => "/quotes",
    }),
  }),
})

export const { useGetQuotesQuery } = quotesApi
