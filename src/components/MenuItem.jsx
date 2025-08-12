import { motion } from "framer-motion"
import { useState, useRef, useEffect } from 'react'

function LazyImage({ src, alt, className }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (!src || src.trim() === '') {
    return (
      <div className={`bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-blue-400 text-3xl sm:text-4xl">🍽️</div>
      </div>
    )
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden rounded-2xl ${className}`}>
      {!isInView ? (
        <div className="animate-pulse bg-gradient-to-br from-sky-50 to-blue-50 w-full h-full rounded-2xl flex items-center justify-center">
          <div className="text-blue-400 text-sm">🍽️</div>
        </div>
      ) : (
        <>
          {!isLoaded && !error && (
            <div className="animate-pulse bg-gradient-to-br from-sky-50 to-blue-50 w-full h-full rounded-2xl flex items-center justify-center absolute inset-0 z-10">
              <div className="text-blue-400 text-xs">Cargando...</div>
            </div>
          )}
          <motion.img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setError(true)}
            loading="lazy"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
        </>
      )}
    </div>
  )
}

export default function MenuItem({ title, price, image, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ 
        y: -12,
        scale: 1.02,
        transition: { duration: 0.4, ease: "easeOut" }
      }}
      style={{
        background: 'rgba(248, 250, 252, 0.95)', // slate-50 con transparencia
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px -12px rgba(30, 64, 175, 0.15)', // sombra azul marina suave
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: '1rem', // Espaciado entre items
        position: 'relative'
      }}
      className="hover:shadow-2xl hover:shadow-blue-200/20"
    >
      {/* Imagen responsiva */}
      <div className="relative">
        <LazyImage
          src={image}
          alt={title || 'Plato del menú'}
          className="w-full h-40 sm:h-48 lg:h-56"
        />
        
        {/* Overlay gradient marino elegante */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent rounded-2xl"></div>
        
        {/* Badge de precio con diseño profesional */}
        {price && (
          <motion.div 
            className="absolute top-3 sm:top-4 right-3 sm:right-4"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '16px',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              boxShadow: '0 8px 16px -4px rgba(30, 64, 175, 0.4)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              {price.startsWith('C$') ? price : `C$${Number(price).toFixed(2)}`}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Contenido con diseño profesional */}
      <div style={{
        padding: '1.5rem',
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.9) 100%)'
      }}>
        <motion.h3 
          style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: '#1e293b', // slate-800
            marginBottom: '0.75rem',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {title || 'Plato delicioso'}
        </motion.h3>
        
        {description && (
          <motion.p 
            style={{
              fontSize: '0.875rem',
              color: '#64748b', // slate-500
              lineHeight: '1.6',
              marginBottom: '1rem',
              flex: '1',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {description}
          </motion.p>
        )}
        
        {/* Footer profesional */}
        <motion.div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(59, 130, 246, 0.1)'
          }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>⭐⭐⭐⭐⭐</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>(4.8)</span>
          </div>
          
          <div style={{
            padding: '0.375rem 0.75rem',
            background: 'rgba(34, 197, 94, 0.1)',
            color: '#059669',
            fontSize: '0.75rem',
            fontWeight: '600',
            borderRadius: '12px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            ✓ Disponible
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}