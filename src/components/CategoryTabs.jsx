import { motion } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";

export default function CategoryTabs({ categorias = [], activa, onChange }) {
  const [isMobile, setIsMobile] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);

  // Detecta móvil
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Actualiza estado de flechas
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !isMobile) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [isMobile, categorias]);

  // Scroll a izquierda/derecha
  const scrollByDir = (dir) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const step = Math.min(240, el.clientWidth * 0.75);
    el.scrollTo({
      left: dir === "left" ? el.scrollLeft - step : el.scrollLeft + step,
      behavior: "smooth",
    });
  };

  // Centra activa
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !isMobile) return;
    const activeBtn = el.querySelector('[data-active="true"]');
    if (!activeBtn) return;
    activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activa, isMobile, categorias.length]);

  // ==== ESTILOS
  const containerStyle = {
    marginBottom: 16,
    marginTop: 10,
    position: "relative",
  };

  // Wrapper ahora recorta (overflow hidden) para que nada se “salga”
  const wrapperStyle = {
    position: "relative",
    padding: 8,
    backgroundColor: "rgba(240, 249, 255, 0.9)",
    borderRadius: 16,
    margin: "0 12px",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(59,130,246,0.2)",
    boxShadow: "0 8px 25px -5px rgba(30,64,175,0.1)",
    overflow: "hidden",              // <-- clave
    boxSizing: "border-box",
  };

  const arrowSize = 36;
  const railPadding = useMemo(() => {
    // Reserva espacio cuando hay flechas para que los botones no queden debajo
    const left = isMobile && canScrollLeft ? arrowSize + 8 : 8;
    const right = isMobile && canScrollRight ? arrowSize + 8 : 8;
    return { paddingLeft: left, paddingRight: right };
  }, [isMobile, canScrollLeft, canScrollRight]);

  const railStyle = {
    display: "flex",
    gap: 8,
    alignItems: "center",
    overflowX: isMobile ? "auto" : "visible",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    WebkitOverflowScrolling: "touch",
    minWidth: isMobile ? "max-content" : "auto",
    paddingTop: 6,
    paddingBottom: 6,
    ...railPadding,                  // <-- padding dinámico
  };

  const scrollButtonStyle = (side) => ({
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    [side]: 6,                       // se mantiene dentro del wrapper
    width: arrowSize,
    height: arrowSize,
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.95)",
    border: "1px solid rgba(59,130,246,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 2,
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    touchAction: "manipulation",
  });

  const btnStyle = (active) => ({
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: active ? 700 : 600,
    fontSize: 14,
    lineHeight: 1.2,
    cursor: "pointer",
    whiteSpace: "nowrap",
    minWidth: "fit-content",
    flexShrink: 0,
    background: active
      ? "linear-gradient(135deg,#1e40af,#3b82f6,#06b6d4)"
      : "rgba(255,255,255,0.95)",
    color: active ? "#fff" : "#1f2937",
    boxShadow: active ? "0 6px 18px -6px rgba(59,130,246,0.45)" : "0 1px 6px rgba(30,64,175,0.10)",
    border: active ? "none" : "1px solid rgba(59,130,246,0.2)",
    transform: "translateY(0)",      // sin “saltar” para no romper el recorte
    transition: "box-shadow .2s ease, transform .15s ease",
    touchAction: "manipulation",
  });

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        {/* Flechas (solo móvil y si hacen falta) */}
        {isMobile && canScrollLeft && (
          <button
            style={scrollButtonStyle("left")}
            onClick={() => scrollByDir("left")}
            aria-label="Desplazar a la izquierda"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        {isMobile && canScrollRight && (
          <button
            style={scrollButtonStyle("right")}
            onClick={() => scrollByDir("right")}
            aria-label="Desplazar a la derecha"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <motion.div
          ref={scrollContainerRef}
          className="category-tabs-wrapper"
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
          style={railStyle}
        >
          {categorias.map((c, i) => {
            const active = activa === c.id;
            return (
              <motion.button
                key={c.id}
                data-active={active}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onChange?.(c.id)}
                style={btnStyle(active)}
              >
                {c.nombre ?? c.label}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* CSS extra para snap y ocultar scrollbar */}
      <style jsx>{`
        .category-tabs-wrapper::-webkit-scrollbar { display: none; }
        @media (max-width: 640px) {
          .category-tabs-wrapper { -webkit-overflow-scrolling: touch; scroll-snap-type: x proximity; }
          .category-tabs-wrapper button { scroll-snap-align: center; }
        }
      `}</style>
    </div>
  );
}
