import type React from "react"
import { useGetQuotesQuery } from "./quotesApiSlice"
import type { Quote } from "../../types"

const Quotes: React.FC = () => {
  const { data, error, isLoading } = useGetQuotesQuery()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading quotes.</div>

  return (
    <div>
      {data?.map(({ author, quote, id }: Quote) => (
        <div key={id} className="quote-item">
          <p className="quote-text">"{quote}"</p>
          <p className="quote-author">- {author}</p>
        </div>
      ))}
    </div>
  )
}

export default Quotes
