import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"

export default function CategoryTabs({ categorias, activa, onChange }) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width <= 640)
      setIsTablet(width > 640 && width <= 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    const checkScrollButtons = () => {
      if (scrollContainerRef.current && isMobile) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
      }
    }

    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      return () => container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [isMobile, categorias])

  const scrollTo = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  const scrollToActiveTab = () => {
    if (scrollContainerRef.current && isMobile) {
      const activeButton = scrollContainerRef.current.querySelector('[data-active="true"]')
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        })
      }
    }
  }

  useEffect(() => {
    scrollToActiveTab()
  }, [activa, isMobile])

  const containerStyle = {
    marginBottom: '1.5rem',
    marginTop: '1rem',
    position: 'relative'
  }

  const wrapperStyle = {
    padding: isMobile ? '0.5rem' : '1rem 1.5rem',
    backgroundColor: 'rgba(240, 249, 255, 0.9)',
    borderRadius: isMobile ? '16px' : '9999px',
    margin: isMobile ? '0 0.75rem' : '0 1rem',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    boxShadow: '0 8px 25px -5px rgba(30, 64, 175, 0.1)',
    position: 'relative'
  }

  const scrollButtonStyle = (direction) => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    [direction]: '0.25rem',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s ease'
  })

  const flexContainerStyle = {
    display: 'flex',
    gap: isMobile ? '0.5rem' : '0.75rem',
    justifyContent: isMobile ? 'flex-start' : 'center',
    flexWrap: isMobile ? 'nowrap' : 'wrap',
    alignItems: 'center',
    overflowX: isMobile ? 'auto' : 'visible',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
    minWidth: isMobile ? 'max-content' : 'auto',
    padding: isMobile ? '0.5rem 0' : '0.25rem 0'
  }

  const getButtonStyle = (isActive) => ({
    padding: isMobile 
      ? '0.75rem 1.25rem' 
      : isTablet 
        ? '0.875rem 1.5rem'
        : '1rem 2rem',
    borderRadius: isMobile ? '12px' : '9999px',
    fontWeight: isActive ? '700' : '600',
    fontSize: isMobile 
      ? '0.875rem' 
      : isTablet 
        ? '0.95rem'
        : '1.125rem',
    lineHeight: '1.2',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    minWidth: 'fit-content',
    flexShrink: 0,
    background: isActive 
      ? 'linear-gradient(135deg, #1e40af, #3b82f6, #06b6d4)'
      : 'rgba(255, 255, 255, 0.8)',
    color: isActive ? 'white' : '#1e293b',
    boxShadow: isActive 
      ? '0 8px 25px -5px rgba(59, 130, 246, 0.5)' 
      : '0 2px 8px rgba(30, 64, 175, 0.1)',
    border: isActive 
      ? 'none' 
      : '1px solid rgba(59, 130, 246, 0.2)',
    transform: isActive ? 'translateY(-1px)' : 'translateY(0)'
  })

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        {/* Botones de scroll para móvil */}
        {isMobile && canScrollLeft && (
          <button
            onClick={() => scrollTo('left')}
            style={scrollButtonStyle('left')}
            aria-label="Scroll left"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        
        {isMobile && canScrollRight && (
          <button
            onClick={() => scrollTo('right')}
            style={scrollButtonStyle('right')}
            aria-label="Scroll right"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        <motion.div 
          ref={scrollContainerRef}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={flexContainerStyle}
        >
          {categorias.map((categoria, index) => {
            const isActive = activa === categoria.id
            return (
              <motion.button
                key={categoria.id}
                data-active={isActive}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 120,
                  damping: 20
                }}
                whileHover={!isMobile ? { 
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.2 }
                } : {}}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange(categoria.id)}
                style={getButtonStyle(isActive)}
              >
                {categoria.nombre}
              </motion.button>
            )
          })}
        </motion.div>
      </div>
      
      <style jsx>{`
        .category-tabs-wrapper::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 640px) {
          .category-tabs-wrapper {
            -webkit-overflow-scrolling: touch;
            scroll-snap-type: x proximity;
          }
          
          .category-tabs-wrapper button {
            scroll-snap-align: center;
          }
        }
      `}</style>
    </div>
  )
}