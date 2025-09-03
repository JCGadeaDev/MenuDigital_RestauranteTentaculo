import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

export default function CategoryTabs({ categorias = [], activa, onChange }) {
  const [isMobile, setIsMobile] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);
  const scrollContainerRef = useRef(null);

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

  // Actualiza estado de navegación
  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const tolerance = 2;
    
    setCanScrollLeft(scrollLeft > tolerance);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - tolerance);
  }, []);

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

  // Auto-scroll para centrar elemento activo
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const activeButton = el.querySelector('[data-active="true"]');
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      });
    }
  }, [activa]);

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

  // MEJORA SOLO PARA LOS BOTONES DE NAVEGACIÓN
  const arrowSize = isMobile ? 44 : 42; // Más grande en móvil
  const railPadding = useMemo(() => {
    const basePadding = isMobile ? 8 : 12;
    const arrowSpace = isMobile ? 52 : arrowSize + 8; // Más espacio en móvil
    
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

  // ESTILO MEJORADO PARA BOTONES DE NAVEGACIÓN
  const scrollButtonStyle = (side) => ({
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    [side]: isMobile ? 4 : 8,
    width: arrowSize,
    height: arrowSize,
    borderRadius: isMobile ? "12px" : "50%",
    backgroundColor: isMobile 
      ? "var(--brand-accent)"  // Usa tu color de marca
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
  });

  const buttonStyle = (active) => ({
    padding: isMobile ? "12px 16px" : "14px 20px",
    borderRadius: isMobile ? 12 : 14,
    fontWeight: active ? 700 : 600,
    fontSize: isMobile ? 14 : 15,
    lineHeight: 1.3,
    cursor: "pointer",
    whiteSpace: "nowrap",
    minWidth: "fit-content",
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
  });

  const arrowHoverStyle = {
    transform: "translateY(-50%) scale(1.1)",
    backgroundColor: "rgba(255, 255, 255, 1)",
    boxShadow: "0 8px 28px rgba(0, 0, 0, 0.2)",
  };

  // Agregar estilos CSS como string para inyección
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
          }
          .category-tabs-rail button { 
            scroll-snap-align: center;
            scroll-snap-stop: normal;
          }
        }
        
        @media (min-width: 769px) {
          .category-tabs-rail {
            justify-content: center;
            flex-wrap: wrap;
            overflow-x: visible;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .category-tabs-rail * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // No remover el estilo al desmontar para evitar parpadeos
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div 
        style={wrapperStyle}
        onKeyDown={handleKeyNavigation}
        role="tablist"
        aria-label="Categorías del menú"
      >
        {/* Botones de navegación MEJORADOS */}
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

        {/* Contenedor de categorías */}
        <motion.div
          ref={scrollContainerRef}
          className="category-tabs-rail"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={railStyle}
        >
          {categorias.map((categoria, index) => {
            const isActive = activa === categoria.id;
            const categoryName = categoria.nombre ?? categoria.label;
            
            return (
              <motion.button
                key={categoria.id}
                data-active={isActive}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.05, 
                  duration: 0.3,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -2,
                  boxShadow: isActive 
                    ? "0 12px 32px -8px rgba(59, 130, 246, 0.5)" 
                    : "0 8px 24px -4px rgba(30, 64, 175, 0.15)"
                }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onChange?.(categoria.id)}
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
