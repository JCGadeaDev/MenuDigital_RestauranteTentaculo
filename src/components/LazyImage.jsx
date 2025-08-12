import { useState, useRef, useEffect } from 'react'

export default function LazyImage({ src, alt, className = '', placeholder = '/placeholder.jpg' }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef} className={`overflow-hidden ${className}`}>
      {isInView && (
        <>
          {!isLoaded && (
            <div className="animate-pulse bg-gray-200 w-full h-full min-h-[200px] flex items-center justify-center">
              <div className="text-gray-400">Cargando...</div>
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
          />
        </>
      )}
    </div>
  )
}