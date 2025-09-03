import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

export default function CategoryTabs({ categorias = [], activa, onChange }) {
  const [isMobile, setIsMobile] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollContainerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const categoryElementsRef = useRef([]);

  // Detecta dispositivo y viewport
  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
    };
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Mostrar hint de scroll en móvil cuando haya contenido scrolleable
  useEffect(() => {
    if (isMobile && categorias.length > 3) {
      setShowScrollHint(true);
      const timer = setTimeout(() => setShowScrollHint(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, categorias.length]);

  // FUNCIÓN MEJORADA: Detectar categoría activa por scroll (solo si usuario está scrolleando)
  const detectActiveCategory = useCallback(() => {
    if (!isMobile || !isUserScrolling) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestElement = null;
    let closestDistance = Infinity;

    categoryElementsRef.current.forEach((element, index) => {
      if (!element) return;
      
      const elementRect = element.getBoundingClientRect();
      const elementCenter = elementRect.left + elementRect.width / 2;
      const distance = Math.abs(containerCenter - elementCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestElement = { element, index };
      }
    });

    if (closestElement && categorias[closestElement.index]) {
      const newActiveCategory = categorias[closestElement.index].id;
      if (newActiveCategory !== activa) {
        onChange?.(newActiveCategory);
      }
    }
  }, [isMobile, categorias, activa, onChange, isUserScrolling]);

  // Actualiza estado de navegación
  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const tolerance = 2;
    
    setCanScrollLeft(scrollLeft > tolerance);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - tolerance);
    
    setIsScrolling(true);
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
      // Solo detectar categoría activa si el usuario estaba scrolleando manualmente
      if (isMobile && isUserScrolling) {
        detectActiveCategory();
        // Reset user scrolling flag después de un momento
        setTimeout(() => setIsUserScrolling(false), 100);
      }
    }, 150);
  }, [isMobile, detectActiveCategory, isUserScrolling]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);
    
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState, categorias]);

  // Navegación mejorada
  const scrollToDirection = useCallback((direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const containerWidth = el.clientWidth;
    const scrollAmount = direction === "left" 
      ? Math.max(containerWidth * 0.7, 200)
      : Math.max(containerWidth * 0.7, 200);

    el.scrollTo({
      left: direction === "left" 
        ? el.scrollLeft - scrollAmount 
        : el.scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  }, []);

  // Auto-scroll para centrar elemento activo (solo cambios programáticos)
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || isScrolling || isUserScrolling) return;

    const activeButton = el.querySelector('[data-active="true"]');
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      });
    }
  }, [activa, isScrolling, isUserScrolling]);

  // GESTIÓN MEJORADA DE EVENTOS TÁCTILES
  const handleTouchStart = useCallback((e) => {
    if (!isMobile) return;
    setShowScrollHint(false);
    setIsUserScrolling(true);
  }, [isMobile]);

  const handleTouchEnd = useCallback((e) => {
    if (!isMobile) return;
    // Mantener la bandera por un momento para detectar la categoría final
    setTimeout(() => {
      if (!isScrolling) {
        setIsUserScrolling(false);
      }
    }, 200);
  }, [isMobile, isScrolling]);

  // FUNCIÓN MEJORADA: Manejar click en categoría
  const handleCategoryClick = useCallback((categoriaId, event) => {
    // Prevenir el comportamiento por defecto
    event.preventDefault();
    event.stopPropagation();
    
    if (isMobile) {
      // En móvil, cambiar categoría inmediatamente al hacer tap
      setIsUserScrolling(false); // Resetear scroll flag
      onChange?.(categoriaId);
      
      // Scroll al elemento después del cambio
      setTimeout(() => {
        const categoryIndex = categorias.findIndex(c => c.id === categoriaId);
        const categoryElement = categoryElementsRef.current[categoryIndex];
        
        if (categoryElement) {
          categoryElement.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest"
          });
        }
      }, 50);
    } else {
      // En escritorio, comportamiento normal
      onChange?.(categoriaId);
    }
  }, [isMobile, categorias, onChange]);

  // Navegación con teclado
  const handleKeyNavigation = useCallback((e) => {
    if (!categorias.length) return;
    
    const currentIndex = categorias.findIndex(c => c.id === activa);
    let newIndex = currentIndex;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : categorias.length - 1;
        break;
      case "ArrowRight":
        e.preventDefault();
        newIndex = currentIndex < categorias.length - 1 ? currentIndex + 1 : 0;
        break;
      case "Home":
        e.preventDefault();
        newIndex = 0;
        break;
      case "End":
        e.preventDefault();
        newIndex = categorias.length - 1;
        break;
      default:
        return;
    }

    onChange?.(categorias[newIndex].id);
  }, [categorias, activa, onChange]);

  // Estilos optimizados
  const containerStyle = {
    marginBottom: 20,
    marginTop: 12,
    position: "relative",
    width: "100%",
  };

  const wrapperStyle = {
    position: "relative",
    padding: isMobile ? 8 : 12,
    backgroundColor: "rgba(248, 250, 252, 0.95)",
    borderRadius: isMobile ? 16 : 20,
    margin: isMobile ? "0 8px" : "0 16px",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(59, 130, 246, 0.15)",
    boxShadow: isMobile 
      ? "0 4px 20px -4px rgba(30, 64, 175, 0.1)"
      : "0 8px 32px -8px rgba(30, 64, 175, 0.12)",
    overflow: "hidden",
    transition: "all 0.3s ease",
  };

  const arrowSize = isMobile ? 44 : 42;
  const railPadding = useMemo(() => {
    const basePadding = isMobile ? 8 : 12;
    const arrowSpace = isMobile ? 52 : arrowSize + 8;
    
    return {
      paddingLeft: (canScrollLeft) ? arrowSpace : basePadding,
      paddingRight: (canScrollRight) ? arrowSpace : basePadding,
    };
  }, [isMobile, canScrollLeft, canScrollRight, arrowSize]);

  const railStyle = {
    display: "flex",
    gap: isMobile ? 8 : 12,
    alignItems: "center",
    overflowX: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    WebkitOverflowScrolling: "touch",
    minWidth: "max-content",
    paddingTop: 8,
    paddingBottom: 8,
    scrollBehavior: "smooth",
    ...railPadding,
  };

  const scrollButtonStyle = (side) => ({
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    [side]: isMobile ? 4 : 8,
    width: arrowSize,
    height: arrowSize,
    borderRadius: isMobile ? "12px" : "50%",
    backgroundColor: isMobile 
      ? "var(--brand-accent)"
      : "rgba(255, 255, 255, 0.98)",
    border: isMobile 
      ? "2px solid rgba(255, 255, 255, 0.9)"
      : "1px solid rgba(59, 130, 246, 0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 10,
    boxShadow: isMobile 
      ? "0 8px 24px rgba(6, 182, 212, 0.4)"
      : "0 6px 20px rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease",
    touchAction: "manipulation",
    opacity: isScrolling ? 0.6 : 1,
  });

  // ESTILOS MEJORADOS PARA CATEGORÍAS MÓVILES
  const buttonStyle = (active) => ({
    padding: isMobile ? "14px 18px" : "14px 20px", // Más padding en móvil
    borderRadius: isMobile ? 12 : 14,
    fontWeight: active ? 700 : 600,
    fontSize: isMobile ? 15 : 15, // Texto ligeramente más grande en móvil
    lineHeight: 1.3,
    cursor: "pointer",
    whiteSpace: "nowrap",
    minWidth: isMobile ? "80px" : "fit-content", // Ancho mínimo en móvil
    minHeight: isMobile ? "48px" : "auto", // Altura mínima táctil
    flexShrink: 0,
    position: "relative",
    background: active
      ? "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)"
      : "rgba(255, 255, 255, 0.9)",
    color: active ? "#ffffff" : "#374151",
    boxShadow: active 
      ? "0 8px 24px -6px rgba(59, 130, 246, 0.4)" 
      : "0 2px 8px rgba(30, 64, 175, 0.08)",
    border: active ? "none" : "1px solid rgba(59, 130, 246, 0.15)",
    transform: "translateY(0)",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    touchAction: "manipulation",
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // Asegurar que es clickeable en móvil
    WebkitTapHighlightColor: "transparent",
  });

  const arrowHoverStyle = {
    transform: "translateY(-50%) scale(1.1)",
    backgroundColor: "rgba(255, 255, 255, 1)",
    boxShadow: "0 8px 28px rgba(0, 0, 0, 0.2)",
  };

  // Agregar estilos CSS optimizados
  useEffect(() => {
    const styleId = 'category-tabs-styles';
    let existingStyle = document.getElementById(styleId);
    
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .category-tabs-rail::-webkit-scrollbar { 
          display: none; 
        }
        
        .category-tabs-rail {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
          -webkit-overflow-scrolling: touch;
        }
        
        @media (max-width: 768px) {
          .category-tabs-rail { 
            scroll-snap-type: x proximity;
            overscroll-behavior-x: contain;
            scroll-padding: 20px;
          }
          .category-tabs-rail button { 
            scroll-snap-align: center;
            scroll-snap-stop: normal;
            /* Mejorar área táctil */
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
          }
          
          /* Asegurar que los botones sean clickeables */
          .category-tabs-rail button:active {
            transform: scale(0.95);
          }
        }
        
        @media (min-width: 769px) {
          .category-tabs-rail {
            justify-content: center;
            flex-wrap: wrap;
            overflow-x: visible;
          }
        }
        
        .scroll-hint-animation {
          animation: scrollHint 2s ease-in-out infinite;
        }
        
        @keyframes scrollHint {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .category-tabs-rail * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .scroll-hint-animation {
            animation: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={containerStyle}>
      {/* Indicador de scroll para móvil */}
      {isMobile && showScrollHint && categorias.length > 3 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{
            position: "absolute",
            top: -8,
            right: 16,
            backgroundColor: "var(--brand-accent)",
            color: "white",
            padding: "4px 12px",
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 600,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            gap: 4,
            boxShadow: "0 4px 12px rgba(6, 182, 212, 0.3)",
          }}
        >
          <span>Toca o desliza</span>
          <motion.div
            className="scroll-hint-animation"
            style={{ display: "flex", alignItems: "center" }}
          >
            👆
          </motion.div>
        </motion.div>
      )}

      {/* Indicadores de scroll lateral en móvil */}
      {isMobile && (
        <>
          <AnimatePresence>
            {canScrollLeft && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 20,
                  height: "60%",
                  background: "linear-gradient(to right, rgba(6, 182, 212, 0.3), transparent)",
                  borderRadius: "0 10px 10px 0",
                  pointerEvents: "none",
                  zIndex: 5,
                }}
              />
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {canScrollRight && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 20,
                  height: "60%",
                  background: "linear-gradient(to left, rgba(6, 182, 212, 0.3), transparent)",
                  borderRadius: "10px 0 0 10px",
                  pointerEvents: "none",
                  zIndex: 5,
                }}
              />
            )}
          </AnimatePresence>
        </>
      )}

      <div 
        style={wrapperStyle}
        onKeyDown={handleKeyNavigation}
        role="tablist"
        aria-label="Categorías del menú"
      >
        {/* Botones de navegación */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={scrollButtonStyle("left")}
              onClick={() => scrollToDirection("left")}
              onMouseEnter={(e) => !isMobile && Object.assign(e.target.style, arrowHoverStyle)}
              onMouseLeave={(e) => !isMobile && Object.assign(e.target.style, scrollButtonStyle("left"))}
              aria-label="Desplazar categorías a la izquierda"
            >
              <svg 
                width={isMobile ? "20" : "16"} 
                height={isMobile ? "20" : "16"} 
                viewBox="0 0 24 24" 
                fill="none"
              >
                <path 
                  d="M15 18L9 12L15 6" 
                  stroke={isMobile ? "#ffffff" : "#3b82f6"} 
                  strokeWidth={isMobile ? "3" : "2.5"} 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={scrollButtonStyle("right")}
              onClick={() => scrollToDirection("right")}
              onMouseEnter={(e) => !isMobile && Object.assign(e.target.style, arrowHoverStyle)}
              onMouseLeave={(e) => !isMobile && Object.assign(e.target.style, scrollButtonStyle("right"))}
              aria-label="Desplazar categorías a la derecha"
            >
              <svg 
                width={isMobile ? "20" : "16"} 
                height={isMobile ? "20" : "16"} 
                viewBox="0 0 24 24" 
                fill="none"
              >
                <path 
                  d="M9 18L15 12L9 6" 
                  stroke={isMobile ? "#ffffff" : "#3b82f6"} 
                  strokeWidth={isMobile ? "3" : "2.5"} 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Contenedor de categorías con interacción mejorada */}
        <motion.div
          ref={scrollContainerRef}
          className="category-tabs-rail"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={railStyle}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {categorias.map((categoria, index) => {
            const isActive = activa === categoria.id;
            const categoryName = categoria.nombre ?? categoria.label;
            
            return (
              <motion.button
                key={categoria.id}
                ref={(el) => categoryElementsRef.current[index] = el}
                data-active={isActive}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.05, 
                  duration: 0.3,
                  ease: "easeOut"
                }}
                whileHover={!isMobile ? { 
                  y: -2,
                  boxShadow: isActive 
                    ? "0 12px 32px -8px rgba(59, 130, 246, 0.5)" 
                    : "0 8px 24px -4px rgba(30, 64, 175, 0.15)"
                } : {}}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleCategoryClick(categoria.id, e)}
                onMouseEnter={() => !isMobile && setShowTooltip(categoria.id)}
                onMouseLeave={() => setShowTooltip(null)}
                style={buttonStyle(isActive)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${categoria.id}`}
                tabIndex={isActive ? 0 : -1}
              >
                {categoryName}
                
                {/* Tooltip para escritorio */}
                {!isMobile && showTooltip === categoria.id && categoryName.length > 15 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: "absolute",
                      bottom: "calc(100% + 8px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      zIndex: 20,
                      pointerEvents: "none",
                    }}
                  >
                    {categoryName}
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
