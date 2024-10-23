import { useState } from 'react'
import type { FC } from 'react'

interface BackgroundImageProps {
  src: string
  fallbackColor?: string
  className?: string
}

export const BackgroundImage: FC<BackgroundImageProps> = ({
  src,
  fallbackColor = '#1a1a1a',
  className = ''
}) => {
  const [hasError, setHasError] = useState(false)

  return (
    <div
      className={`${className} ${hasError ? 'loading-background' : ''}`}
      style={{
        backgroundImage: hasError ? 'none' : `url(${src})`,
        backgroundColor: hasError ? fallbackColor : 'transparent'
      }}
      onError={() => setHasError(true)}
    />
  )
}
