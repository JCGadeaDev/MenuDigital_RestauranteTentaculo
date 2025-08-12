import { motion } from "framer-motion"

export default function CategoryTabs({ categorias, activa, onChange }) {
  return (
    <div style={{ 
      marginBottom: '2rem',
      marginTop: '1rem'
    }}>
      <div style={{ 
        padding: '1rem 1.5rem',
        backgroundColor: 'rgba(240, 249, 255, 0.8)',
        borderRadius: '9999px', 
        margin: '0 1rem',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        boxShadow: '0 10px 25px -5px rgba(30, 64, 175, 0.1)'
      }}>
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ 
            display: 'flex', 
            gap: '0.75rem',
            justifyContent: 'center', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          {categorias.map((categoria, index) => {
            const isActive = activa === categoria.id
            return (
              <motion.button
                key={categoria.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange(categoria.id)}
                style={{
                  padding: window.innerWidth <= 640 
                    ? '0.75rem 1rem' 
                    : window.innerWidth <= 1024 
                      ? '0.875rem 1.5rem'
                      : '1rem 2rem',
                  borderRadius: '9999px',
                  fontWeight: 'bold',
                  fontSize: window.innerWidth <= 640 
                    ? '0.875rem' 
                    : window.innerWidth <= 1024 
                      ? '1rem'
                      : '1.125rem',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  minWidth: 'fit-content',
                  background: isActive 
                    ? 'linear-gradient(to right, #1e40af, #3b82f6, #06b6d4)'
                    : 'rgba(224, 242, 254, 0.6)',
                  color: isActive ? 'white' : '#1e293b',
                  boxShadow: isActive 
                    ? '0 10px 25px -5px rgba(59, 130, 246, 0.4)' 
                    : '0 4px 6px -1px rgba(30, 64, 175, 0.1)',
                  border: isActive 
                    ? 'none' 
                    : '1px solid rgba(59, 130, 246, 0.2)'
                }}
              >
                {categoria.nombre}
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}