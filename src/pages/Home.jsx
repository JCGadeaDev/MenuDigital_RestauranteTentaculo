import MenuItem from "../components/MenuItem"
import CategoryTabs from "../components/CategoryTabs"
import { useState } from "react"
import { categorias, items } from "../data/menu"
import logo from "/logo.png"
import { motion } from "framer-motion"

export default function Home(){
  const [cat, setCat] = useState(categorias[0].id)
  const list = items[cat] ?? []

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex flex-col relative overflow-hidden font-inter">
      {/* Fondo con múltiples capas de degradados pasteles */}
      <div className="absolute inset-0 bg-gradient-to-r from-lavender-100/60 via-transparent to-sky-100/60 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-pink-50/30 via-purple-50/40 to-indigo-50/50 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-100/40 via-transparent to-cyan-50/40 pointer-events-none"></div>
      
      {/* Elementos decorativos con colores pasteles */}
      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-24 sm:w-40 h-24 sm:h-40 bg-pink-200/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 sm:bottom-40 right-10 sm:right-20 w-32 sm:w-56 h-32 sm:h-56 bg-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-indigo-100/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/4 right-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-cyan-100/30 rounded-full blur-3xl animate-pulse"></div>
      
      {/* Patrón de puntos con colores pasteles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(219,39,119,0.2) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>
      
      {/* Líneas de luz sutiles pasteles */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-pink-300/50 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-300/40 to-transparent"></div>
      </div>
      
      <header className="py-4 sm:py-6 text-center flex flex-col items-center gap-3 sm:gap-4 relative z-10 px-4">
        {/* Logo con animación flotante */}
        <motion.img 
          src={logo} 
          alt="El Tentaculo" 
          style={{ 
            width: '300px', 
            height: '300px', 
            objectFit: 'contain',
            filter: 'brightness(1.1) contrast(1.2) drop-shadow(0 8px 16px rgba(59, 130, 246, 0.3))',
            opacity: '0.9'
          }}
          loading="lazy"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ 
            scale: 1, 
            rotate: 0, 
            opacity: 0.9,
            y: [0, -10, 0] // Animación flotante
          }}
          transition={{
            duration: 1.2,
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          whileHover={{ 
            scale: 1.1, 
            rotate: 5,
            transition: { duration: 0.3 }
          }}
        />
        
        {/* H1 con gradiente animado y efectos */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, #1e40af, #3b82f6, #06b6d4, #f59e0b)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: 'clamp(1.5rem, 5vw, 4rem)',
            fontWeight: '900',
            letterSpacing: '-0.02em',
            textShadow: '0 4px 8px rgba(59, 130, 246, 0.2)',
            animation: 'gradientShift 4s ease infinite'
          }}
          className="tracking-tight"
          whileHover={{ scale: 1.05 }}
        >
          Menú Digital
        </motion.h1>
        
        {/* Párrafo con efectos tipográficos */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            background: 'linear-gradient(90deg, #64748b, #475569, #1e293b)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
            fontWeight: '500',
            letterSpacing: '0.025em',
            textShadow: '0 2px 4px rgba(100, 116, 139, 0.2)',
            animation: 'textShimmer 3s ease infinite'
          }}
          className="max-w-xs sm:max-w-md mx-auto px-4"
        >
          🌊 Descubre nuestros deliciosos platos del mar 🍽️
        </motion.p>
      </header>

      {/* Tabs responsivas con más separación */}
      <div className="py-4 sm:py-6">
        <CategoryTabs categorias={categorias} activa={cat} onChange={setCat} />
      </div>

      {/* Grid responsivo con más espaciado entre items */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 flex-1 relative z-10">
        <div style={{
          background: 'rgba(240, 249, 255, 0.4)',
          backdropFilter: 'blur(16px)',
          borderRadius: '32px',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(30, 64, 175, 0.1)'
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
            {list.map((p, i) => (
              <div key={i} className="w-full">
                <MenuItem {...p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center text-xs sm:text-sm text-gray-500 py-4 sm:py-6 bg-white/50 backdrop-blur-md border-t border-pink-200/40 relative z-10">
        <div className="container mx-auto px-4">
          <p className="font-medium">© {new Date().getFullYear()} El Tentaculo - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  )
}