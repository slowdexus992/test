import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../contexts/GameContext'
import { useApp } from '../contexts/AppContext'

const LumoMascot = () => {
  const { mascotState, updateMascotEmotion, askMascot } = useGame()
  const { triggerHaptic, playSound } = useApp()
  const [isInteracting, setIsInteracting] = useState(false)
  const [speechBubble, setSpeechBubble] = useState('')
  const [showSpeechBubble, setShowSpeechBubble] = useState(false)
  const speechTimeoutRef = useRef(null)

  // Emotion to emoji mapping
  const emotionEmojis = {
    happy: '😊',
    excited: '🤩',
    proud: '😌',
    encouraging: '🥰',
    sympathetic: '😔',
    helpful: '🤗',
    thinking: '🤔',
    surprised: '😲',
    sleepy: '😴',
    love: '😍'
  }

  // Animation variants for different emotions
  const emotionAnimations = {
    idle: {
      y: [0, -5, 0],
      rotate: [0, 2, 0, -2, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    bounce: {
      y: [0, -20, 0, -10, 0],
      scale: [1, 1.1, 1, 1.05, 1],
      transition: { duration: 0.6, ease: "easeOut" }
    },
    celebrate: {
      rotate: [0, -10, 10, -5, 5, 0],
      scale: [1, 1.2, 1, 1.1, 1],
      transition: { duration: 1, ease: "easeInOut" }
    },
    wiggle: {
      rotate: [0, -15, 15, -10, 10, -5, 5, 0],
      transition: { duration: 0.8, ease: "easeInOut" }
    },
    float: {
      y: [0, -15, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    talk: {
      scale: [1, 1.05, 1, 1.02, 1],
      transition: { duration: 0.5, repeat: 3 }
    },
    comfort: {
      x: [-5, 5, -3, 3, 0],
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  }

  // Handle mascot message changes
  useEffect(() => {
    if (mascotState.message) {
      setSpeechBubble(mascotState.message)
      setShowSpeechBubble(true)
      
      // Clear existing timeout
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current)
      }
      
      // Auto-hide speech bubble after 5 seconds
      speechTimeoutRef.current = setTimeout(() => {
        setShowSpeechBubble(false)
      }, 5000)
    }
  }, [mascotState.message])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current)
      }
    }
  }, [])

  const handleMascotClick = async () => {
    if (isInteracting) return
    
    setIsInteracting(true)
    triggerHaptic('light')
    playSound('tap')
    
    // Random interaction responses
    const interactions = [
      { emotion: 'happy', message: 'Hi there! Ready to learn? 🌟', animation: 'bounce' },
      { emotion: 'excited', message: 'Let\'s explore Bible stories together! 📖', animation: 'celebrate' },
      { emotion: 'helpful', message: 'Need help? Just ask me anything! 💡', animation: 'wiggle' },
      { emotion: 'encouraging', message: 'You\'re doing amazing! Keep it up! 💪', animation: 'float' },
      { emotion: 'love', message: 'I love learning with you! ❤️', animation: 'talk' }
    ]
    
    const randomInteraction = interactions[Math.floor(Math.random() * interactions.length)]
    
    updateMascotEmotion(
      randomInteraction.emotion,
      randomInteraction.message,
      randomInteraction.animation
    )
    
    // Reset interaction state after animation
    setTimeout(() => {
      setIsInteracting(false)
    }, 2000)
  }

  const handleSpeechBubbleClick = () => {
    setShowSpeechBubble(false)
  }

  const getCurrentAnimation = () => {
    if (isInteracting) {
      return emotionAnimations[mascotState.animation] || emotionAnimations.bounce
    }
    return emotionAnimations[mascotState.animation] || emotionAnimations.idle
  }

  if (!mascotState.isVisible) return null

  return (
    <div className="lumo-mascot-container">
      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeechBubble && speechBubble && (
          <motion.div
            className="speech-bubble"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={handleSpeechBubbleClick}
          >
            <div className="speech-content">
              {speechBubble}
            </div>
            <div className="speech-tail" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Mascot */}
      <motion.div
        className={`lumo-mascot ${isInteracting ? 'interacting' : ''}`}
        animate={getCurrentAnimation()}
        onClick={handleMascotClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Mascot Body */}
        <div className="mascot-body">
          {/* Background Glow */}
          <div className="mascot-glow" />
          
          {/* Main Character */}
          <div className="mascot-character">
            {/* Face */}
            <div className="mascot-face">
              <div className="mascot-eyes">
                <span className="eye left">👁️</span>
                <span className="eye right">👁️</span>
              </div>
              <div className="mascot-emotion">
                {emotionEmojis[mascotState.emotion] || '😊'}
              </div>
            </div>
            
            {/* Wings */}
            <div className="mascot-wings">
              <motion.div
                className="wing left-wing"
                animate={{
                  rotate: isInteracting ? [-20, 20, -20] : [-10, 10, -10]
                }}
                transition={{
                  duration: isInteracting ? 0.3 : 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🪶
              </motion.div>
              <motion.div
                className="wing right-wing"
                animate={{
                  rotate: isInteracting ? [20, -20, 20] : [10, -10, 10]
                }}
                transition={{
                  duration: isInteracting ? 0.3 : 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🪶
              </motion.div>
            </div>
          </div>

          {/* Interaction Sparkles */}
          <AnimatePresence>
            {isInteracting && (
              <div className="interaction-sparkles">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="sparkle"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, (Math.random() - 0.5) * 40],
                      y: [0, (Math.random() - 0.5) * 40]
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Pulse Ring for Attention */}
        <motion.div
          className="attention-ring"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <style jsx>{`
        .lumo-mascot-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          pointer-events: none;
        }

        .speech-bubble {
          position: absolute;
          bottom: 100px;
          right: 0;
          max-width: 200px;
          background: white;
          border-radius: var(--radius-lg);
          padding: var(--space-md);
          box-shadow: var(--shadow-lg);
          pointer-events: auto;
          cursor: pointer;
          user-select: none;
        }

        .speech-content {
          font-family: var(--font-primary);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gray-800);
          line-height: 1.4;
        }

        .speech-tail {
          position: absolute;
          bottom: -8px;
          right: 20px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid white;
        }

        .lumo-mascot {
          position: relative;
          width: 80px;
          height: 80px;
          cursor: pointer;
          pointer-events: auto;
          user-select: none;
        }

        .mascot-body {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .mascot-glow {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: radial-gradient(circle, rgba(88, 204, 2, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0.6;
        }

        .mascot-character {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
          border: 3px solid var(--primary-green);
          overflow: hidden;
        }

        .mascot-face {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .mascot-eyes {
          display: flex;
          gap: 8px;
          margin-bottom: 4px;
        }

        .eye {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .mascot-emotion {
          font-size: 1.5rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .mascot-wings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          pointer-events: none;
          z-index: 1;
        }

        .wing {
          font-size: 1rem;
          opacity: 0.7;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
        }

        .left-wing {
          transform-origin: right center;
        }

        .right-wing {
          transform-origin: left center;
        }

        .interaction-sparkles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 3;
        }

        .sparkle {
          position: absolute;
          font-size: 0.75rem;
          pointer-events: none;
        }

        .attention-ring {
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border: 2px solid var(--primary-green);
          border-radius: 50%;
          pointer-events: none;
        }

        .lumo-mascot.interacting .mascot-character {
          border-color: var(--primary-yellow);
        }

        .lumo-mascot.interacting .attention-ring {
          border-color: var(--primary-yellow);
        }

        @media (max-width: 768px) {
          .lumo-mascot-container {
            bottom: 90px;
            right: 15px;
          }

          .lumo-mascot {
            width: 70px;
            height: 70px;
          }

          .speech-bubble {
            max-width: 180px;
            bottom: 90px;
            font-size: 0.8rem;
          }

          .mascot-emotion {
            font-size: 1.25rem;
          }
        }

        @media (hover: hover) {
          .lumo-mascot:hover .mascot-glow {
            opacity: 1;
          }

          .lumo-mascot:hover .attention-ring {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  )
}

export default LumoMascot