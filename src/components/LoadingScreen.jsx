import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LoadingScreen = () => {
  const [loadingText, setLoadingText] = useState('Welcome to Bible Quest!')
  const [progress, setProgress] = useState(0)

  const loadingMessages = [
    'Welcome to Bible Quest! 🕊️',
    'Lumo is getting ready... ✨',
    'Preparing your adventure... 🌟',
    'Loading Bible stories... 📖',
    'Almost ready to learn! 🎉'
  ]

  useEffect(() => {
    let messageIndex = 0
    let currentProgress = 0

    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(progressInterval)
      }
      setProgress(currentProgress)
    }, 200)

    const messageInterval = setInterval(() => {
      if (messageIndex < loadingMessages.length - 1) {
        messageIndex++
        setLoadingText(loadingMessages[messageIndex])
      }
    }, 400)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, [])

  return (
    <div className="loading-screen">
      <div className="loading-container">
        {/* Animated Background */}
        <div className="loading-bg">
          <motion.div
            className="bg-circle"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="bg-circle"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        {/* Main Lumo Character */}
        <motion.div
          className="lumo-container"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1
          }}
        >
          <motion.div
            className="lumo-character"
            animate={{
              y: [-10, 10, -10],
              rotate: [-5, 5, -5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="lumo-body">
              <div className="lumo-face">
                <motion.div
                  className="lumo-eyes"
                  animate={{
                    scaleY: [1, 0.1, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <span>👀</span>
                </motion.div>
                <div className="lumo-beak">🐦</div>
              </div>
              <div className="lumo-wings">
                <motion.div
                  className="wing left"
                  animate={{
                    rotate: [-20, 20, -20]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🪶
                </motion.div>
                <motion.div
                  className="wing right"
                  animate={{
                    rotate: [20, -20, 20]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🪶
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          className="loading-text"
          key={loadingText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>{loadingText}</h2>
        </motion.div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <div className="progress-text">{Math.round(progress)}%</div>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-element"
              animate={{
                y: [-20, -60, -20],
                x: [0, Math.sin(i) * 20, 0],
                rotate: [0, 360, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
              style={{
                left: `${15 + i * 12}%`,
                fontSize: '1.5rem'
              }}
            >
              {['✨', '🌟', '💫', '⭐', '🔮', '🌈'][i]}
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          overflow: hidden;
        }

        .loading-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          max-width: 400px;
          width: 90%;
        }

        .loading-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .bg-circle {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          top: -150px;
          left: -150px;
        }

        .lumo-container {
          margin-bottom: 2rem;
          position: relative;
          z-index: 2;
        }

        .lumo-character {
          background: white;
          border-radius: 50%;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-xl);
          position: relative;
          overflow: hidden;
        }

        .lumo-body {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .lumo-face {
          position: relative;
          font-size: 2rem;
        }

        .lumo-eyes {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .lumo-beak {
          font-size: 1.2rem;
        }

        .lumo-wings {
          position: absolute;
          top: 50%;
          width: 140px;
          display: flex;
          justify-content: space-between;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .wing {
          font-size: 1rem;
          opacity: 0.8;
        }

        .wing.left {
          transform-origin: right center;
        }

        .wing.right {
          transform-origin: left center;
        }

        .loading-text {
          margin-bottom: 2rem;
          position: relative;
          z-index: 2;
        }

        .loading-text h2 {
          font-family: var(--font-primary);
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .progress-container {
          width: 100%;
          position: relative;
          z-index: 2;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255,255,255,0.2);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-green), var(--primary-yellow));
          border-radius: var(--radius-full);
          position: relative;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 1.5s infinite;
        }

        .progress-text {
          font-family: var(--font-primary);
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .floating-element {
          position: absolute;
          top: 70%;
          opacity: 0.7;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @media (max-width: 768px) {
          .lumo-character {
            width: 100px;
            height: 100px;
          }

          .loading-text h2 {
            font-size: 1.25rem;
          }

          .lumo-face {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default LoadingScreen