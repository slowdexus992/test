import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useGame } from '../contexts/GameContext'
import { useApp } from '../contexts/AppContext'
import Confetti from 'react-confetti'

const HomeScreen = () => {
  const navigate = useNavigate()
  const { user, progress, updateStreak } = useUser()
  const { stories, updateMascotEmotion } = useGame()
  const { triggerHaptic, playSound, showNotification } = useApp()
  const [showConfetti, setShowConfetti] = useState(false)
  const [greeting, setGreeting] = useState('')

  // Update streak and show celebration if needed
  useEffect(() => {
    const currentStreak = updateStreak()
    if (currentStreak > progress.currentStreak) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
      
      if (currentStreak === 7) {
        showNotification('🔥 7 day streak! You\'re on fire!', 'success', 5000)
      } else if (currentStreak === 30) {
        showNotification('🌟 30 day streak! Amazing dedication!', 'success', 5000)
      }
    }
  }, [])

  // Set personalized greeting
  useEffect(() => {
    const hour = new Date().getHours()
    let timeGreeting = ''
    
    if (hour < 12) {
      timeGreeting = 'Good morning'
    } else if (hour < 17) {
      timeGreeting = 'Good afternoon'
    } else {
      timeGreeting = 'Good evening'
    }
    
    setGreeting(`${timeGreeting}, ${user.name}!`)
    
    // Set mascot greeting
    updateMascotEmotion('happy', `${timeGreeting}! Ready for today's adventure? ✨`, 'float')
  }, [user.name])

  const handleStoryClick = (story) => {
    if (!story.unlocked) {
      triggerHaptic('error')
      showNotification('Complete previous stories to unlock this one! 🔒', 'info')
      return
    }

    triggerHaptic('light')
    playSound('tap')
    
    if (story.lessons && story.lessons.length > 0) {
      navigate(`/lesson/${story.lessons[0].id}`, { 
        state: { story, lessonIndex: 0 } 
      })
    }
  }

  const getStoryProgress = (story) => {
    const completedLessons = story.lessons?.filter(lesson => 
      progress.completedStories.includes(lesson.id)
    ).length || 0
    const totalLessons = story.lessons?.length || 1
    return Math.round((completedLessons / totalLessons) * 100)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#51cf66'
      case 'normal': return '#ffc800'
      case 'hard': return '#ff6b6b'
      default: return '#51cf66'
    }
  }

  return (
    <div className="home-screen">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={100}
          recycle={false}
          gravity={0.3}
        />
      )}

      <div className="home-content">
        {/* Header Section */}
        <motion.div
          className="home-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="greeting-section">
            <div className="user-avatar">{user.avatar}</div>
            <div className="greeting-text">
              <h1 className="greeting-title">{greeting}</h1>
              <p className="greeting-subtitle">Let's continue your Bible journey! 📖</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="stats-row">
            <motion.div
              className="stat-card streak-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <div className="stat-number">{progress.currentStreak}</div>
                <div className="stat-label">Day Streak</div>
              </div>
            </motion.div>

            <motion.div
              className="stat-card xp-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-number">{progress.totalXP}</div>
                <div className="stat-label">Total XP</div>
              </div>
            </motion.div>

            <motion.div
              className="stat-card level-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <div className="stat-number">{progress.currentLevel}</div>
                <div className="stat-label">Level</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stories Section */}
        <motion.div
          className="stories-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="section-header">
            <h2 className="section-title">Bible Stories</h2>
            <p className="section-subtitle">Choose your next adventure</p>
          </div>

          <div className="stories-grid">
            <AnimatePresence>
              {stories.map((story, index) => {
                const storyProgress = getStoryProgress(story)
                const isCompleted = story.completed
                const isLocked = !story.unlocked

                return (
                  <motion.div
                    key={story.id}
                    className={`story-card ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={!isLocked ? { 
                      scale: 1.02, 
                      boxShadow: "0 8px 30px rgba(0,0,0,0.12)" 
                    } : {}}
                    whileTap={!isLocked ? { scale: 0.98 } : {}}
                    onClick={() => handleStoryClick(story)}
                    style={{ backgroundColor: isLocked ? '#f8f9fa' : 'white' }}
                  >
                    {/* Lock Overlay */}
                    {isLocked && (
                      <div className="lock-overlay">
                        <div className="lock-icon">🔒</div>
                      </div>
                    )}

                    {/* Completion Badge */}
                    {isCompleted && (
                      <motion.div
                        className="completion-badge"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        ✅
                      </motion.div>
                    )}

                    {/* Story Icon */}
                    <motion.div
                      className="story-icon"
                      animate={isLocked ? {} : { 
                        y: [0, -5, 0],
                        rotate: [0, 2, 0, -2, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2
                      }}
                      style={{ 
                        fontSize: '3rem',
                        opacity: isLocked ? 0.4 : 1
                      }}
                    >
                      {story.icon}
                    </motion.div>

                    {/* Story Info */}
                    <div className="story-info">
                      <h3 className="story-title">{story.title}</h3>
                      <p className="story-description">{story.description}</p>
                      
                      <div className="story-meta">
                        <div className="difficulty-badge" style={{ 
                          backgroundColor: getDifficultyColor(story.difficulty),
                          opacity: isLocked ? 0.5 : 1
                        }}>
                          {story.difficulty}
                        </div>
                        <div className="time-estimate">
                          ⏱️ {story.estimatedTime}min
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {!isLocked && (
                      <div className="story-progress">
                        <div className="progress-bar">
                          <motion.div
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${storyProgress}%` }}
                            transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                            style={{ backgroundColor: story.color }}
                          />
                        </div>
                        <div className="progress-text">
                          {storyProgress}% Complete
                        </div>
                      </div>
                    )}

                    {/* Sparkle Effects for Available Stories */}
                    {!isLocked && !isCompleted && (
                      <div className="sparkle-effects">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="sparkle"
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                              y: [0, -20, -40]
                            }}
                            transition={{
                              duration: 2,
                              delay: i * 0.3 + index * 0.1,
                              repeat: Infinity,
                              repeatDelay: 3
                            }}
                            style={{
                              left: `${20 + i * 30}%`,
                              top: '20%'
                            }}
                          >
                            ✨
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="quick-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <motion.button
            className="action-button progress-button"
            onClick={() => navigate('/progress')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="action-icon">📊</span>
            <span className="action-text">View Progress</span>
          </motion.button>

          <motion.button
            className="action-button profile-button"
            onClick={() => navigate('/profile')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="action-icon">👤</span>
            <span className="action-text">My Profile</span>
          </motion.button>
        </motion.div>
      </div>

      <style jsx>{`
        .home-screen {
          min-height: 100vh;
          background: var(--bg-primary);
          padding: var(--space-lg) var(--space-md) 100px;
        }

        .home-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .home-header {
          margin-bottom: var(--space-2xl);
        }

        .greeting-section {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
          background: white;
          padding: var(--space-xl);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
        }

        .user-avatar {
          font-size: 4rem;
          background: linear-gradient(135deg, var(--gray-50), var(--gray-100));
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid var(--primary-green);
        }

        .greeting-text {
          flex: 1;
        }

        .greeting-title {
          font-family: var(--font-primary);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--gray-800);
          margin: 0 0 var(--space-xs) 0;
        }

        .greeting-subtitle {
          font-size: 1rem;
          color: var(--gray-600);
          margin: 0;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-md);
        }

        .stat-card {
          background: white;
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          display: flex;
          align-items: center;
          gap: var(--space-md);
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-family: var(--font-primary);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--gray-800);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin-top: var(--space-xs);
        }

        .streak-card {
          border-left: 4px solid var(--primary-red);
        }

        .xp-card {
          border-left: 4px solid var(--primary-yellow);
        }

        .level-card {
          border-left: 4px solid var(--primary-purple);
        }

        .stories-section {
          margin-bottom: var(--space-2xl);
        }

        .section-header {
          text-align: center;
          margin-bottom: var(--space-xl);
        }

        .section-title {
          font-family: var(--font-primary);
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin: 0 0 var(--space-sm) 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.9);
          margin: 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .stories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-lg);
        }

        .story-card {
          background: white;
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
          box-shadow: var(--shadow-lg);
          cursor: pointer;
          transition: all var(--transition-normal);
          position: relative;
          overflow: hidden;
          border: 2px solid transparent;
        }

        .story-card:hover:not(.locked) {
          border-color: var(--primary-green);
        }

        .story-card.locked {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .story-card.completed {
          border-color: var(--success);
        }

        .lock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255,255,255,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .lock-icon {
          font-size: 3rem;
          opacity: 0.5;
        }

        .completion-badge {
          position: absolute;
          top: var(--space-md);
          right: var(--space-md);
          font-size: 1.5rem;
          z-index: 2;
        }

        .story-icon {
          text-align: center;
          margin-bottom: var(--space-lg);
        }

        .story-info {
          text-align: center;
          margin-bottom: var(--space-lg);
        }

        .story-title {
          font-family: var(--font-primary);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--gray-800);
          margin: 0 0 var(--space-sm) 0;
        }

        .story-description {
          font-size: 1rem;
          color: var(--gray-600);
          line-height: 1.5;
          margin: 0 0 var(--space-lg) 0;
        }

        .story-meta {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--space-md);
        }

        .difficulty-badge {
          padding: var(--space-xs) var(--space-sm);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .time-estimate {
          font-size: 0.875rem;
          color: var(--gray-500);
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }

        .story-progress {
          margin-top: var(--space-lg);
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: var(--gray-200);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: var(--space-sm);
        }

        .progress-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 1s ease-out;
        }

        .progress-text {
          text-align: center;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-600);
        }

        .sparkle-effects {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        .sparkle {
          position: absolute;
          font-size: 1rem;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-md);
        }

        .action-button {
          background: white;
          border: none;
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-md);
          cursor: pointer;
          transition: all var(--transition-normal);
          box-shadow: var(--shadow-md);
          font-family: var(--font-primary);
          font-weight: 600;
          color: var(--gray-800);
        }

        .action-icon {
          font-size: 1.5rem;
        }

        .action-text {
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .home-screen {
            padding: var(--space-md) var(--space-sm) 100px;
          }

          .greeting-section {
            flex-direction: column;
            text-align: center;
            gap: var(--space-md);
          }

          .user-avatar {
            width: 60px;
            height: 60px;
            font-size: 2.5rem;
          }

          .greeting-title {
            font-size: 1.5rem;
          }

          .stats-row {
            grid-template-columns: 1fr;
            gap: var(--space-sm);
          }

          .stories-grid {
            grid-template-columns: 1fr;
            gap: var(--space-md);
          }

          .story-card {
            padding: var(--space-lg);
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default HomeScreen