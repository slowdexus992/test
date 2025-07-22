import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { useUser } from '../contexts/UserContext'

const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { triggerHaptic, playSound } = useApp()
  const { progress } = useUser()

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      activeIcon: '🏡',
      path: '/',
      color: '#58cc02'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: '📊',
      activeIcon: '📈',
      path: '/progress',
      color: '#1cb0f6',
      badge: progress.achievements?.badges?.length > 0 ? progress.achievements.badges.length : null
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      activeIcon: '👨‍🎓',
      path: '/profile',
      color: '#ce82ff'
    }
  ]

  const handleNavClick = (item) => {
    if (location.pathname === item.path) return
    
    triggerHaptic('light')
    playSound('tap')
    navigate(item.path)
  }

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <motion.nav
      className="bottom-navigation"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="nav-container">
        {navItems.map((item, index) => {
          const active = isActive(item.path)
          
          return (
            <motion.button
              key={item.id}
              className={`nav-item ${active ? 'active' : ''}`}
              onClick={() => handleNavClick(item)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Background Glow for Active Item */}
              {active && (
                <motion.div
                  className="active-bg"
                  style={{ backgroundColor: item.color }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                />
              )}

              {/* Icon Container */}
              <div className="icon-container">
                <motion.div
                  className="nav-icon"
                  animate={active ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, 0]
                  } : {
                    scale: 1,
                    rotate: 0
                  }}
                  transition={{
                    duration: active ? 0.6 : 0.3,
                    ease: "easeInOut"
                  }}
                >
                  {active ? item.activeIcon : item.icon}
                </motion.div>

                {/* Badge for notifications */}
                {item.badge && (
                  <motion.div
                    className="nav-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </motion.div>
                )}

                {/* Pulse effect for active item */}
                {active && (
                  <motion.div
                    className="pulse-ring"
                    style={{ borderColor: item.color }}
                    animate={{
                      scale: [1, 1.5],
                      opacity: [0.5, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <motion.span
                className="nav-label"
                style={{ color: active ? item.color : '#6b7280' }}
                animate={{
                  fontWeight: active ? 600 : 500,
                  scale: active ? 1.05 : 1
                }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>

              {/* Active Indicator */}
              {active && (
                <motion.div
                  className="active-indicator"
                  style={{ backgroundColor: item.color }}
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Floating Action Elements */}
      <div className="floating-elements">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-sparkle"
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeInOut"
            }}
            style={{
              left: `${25 + i * 25}%`,
              bottom: '85px'
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .bottom-navigation {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid var(--gray-200);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          padding: var(--space-sm) 0 calc(var(--space-sm) + env(safe-area-inset-bottom));
        }

        .nav-container {
          display: flex;
          justify-content: space-around;
          align-items: center;
          max-width: 500px;
          margin: 0 auto;
          padding: 0 var(--space-md);
        }

        .nav-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xs);
          background: none;
          border: none;
          padding: var(--space-sm);
          cursor: pointer;
          transition: all var(--transition-normal);
          border-radius: var(--radius-lg);
          min-width: 60px;
          min-height: 60px;
          justify-content: center;
        }

        .active-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: var(--radius-lg);
          z-index: 0;
        }

        .icon-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .nav-icon {
          font-size: 1.5rem;
          transition: all var(--transition-normal);
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .nav-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--primary-red);
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          border: 2px solid white;
          box-shadow: var(--shadow-sm);
        }

        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border: 2px solid;
          border-radius: 50%;
          pointer-events: none;
        }

        .nav-label {
          font-family: var(--font-primary);
          font-size: 0.75rem;
          transition: all var(--transition-normal);
          z-index: 1;
          text-align: center;
        }

        .active-indicator {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          z-index: 1;
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
        }

        .floating-sparkle {
          position: absolute;
          font-size: 0.75rem;
          opacity: 0.6;
        }

        /* Hover Effects */
        @media (hover: hover) {
          .nav-item:hover:not(.active) {
            background: var(--gray-50);
          }

          .nav-item:hover .nav-icon {
            transform: scale(1.1);
          }
        }

        /* Active State Animations */
        .nav-item.active .nav-icon {
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
        }

        .nav-item.active .nav-label {
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        /* Touch Feedback */
        .nav-item:active {
          transform: scale(0.95);
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .nav-container {
            padding: 0 var(--space-sm);
          }

          .nav-item {
            min-width: 50px;
            min-height: 50px;
            padding: var(--space-xs);
          }

          .nav-icon {
            font-size: 1.25rem;
          }

          .nav-label {
            font-size: 0.7rem;
          }
        }

        /* Safe Area Support */
        @supports (padding: max(0px)) {
          .bottom-navigation {
            padding-bottom: max(var(--space-sm), env(safe-area-inset-bottom));
          }
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          .bottom-navigation {
            background: var(--gray-900);
            border-top-color: var(--gray-700);
          }

          .nav-item:hover:not(.active) {
            background: var(--gray-800);
          }

          .nav-label {
            color: var(--gray-300);
          }

          .nav-item.active .nav-label {
            color: var(--primary-green);
          }
        }
      `}</style>
    </motion.nav>
  )
}

export default Navigation