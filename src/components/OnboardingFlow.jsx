import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '../contexts/UserContext'
import { useApp } from '../contexts/AppContext'

const OnboardingFlow = ({ onComplete }) => {
  const { createUser } = useUser()
  const { triggerHaptic, playSound } = useApp()
  const [currentStep, setCurrentStep] = useState(0)
  const [userData, setUserData] = useState({
    name: '',
    age: null,
    avatar: '👦',
    favoriteColor: '#58cc02',
    parentEmail: ''
  })

  const avatars = ['👦', '👧', '🧒', '👶', '🌟', '🦄', '🐱', '🐶', '🦋', '🌈']
  const colors = [
    { name: 'Green', value: '#58cc02' },
    { name: 'Blue', value: '#1cb0f6' },
    { name: 'Purple', value: '#ce82ff' },
    { name: 'Orange', value: '#ff9600' },
    { name: 'Pink', value: '#ff6b6b' },
    { name: 'Yellow', value: '#ffc800' }
  ]

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Bible Quest! 🕊️',
      subtitle: 'Meet Lumo, your learning companion!'
    },
    {
      id: 'name',
      title: 'What\'s your name?',
      subtitle: 'Lumo wants to know what to call you!'
    },
    {
      id: 'age',
      title: 'How old are you?',
      subtitle: 'This helps us choose the right stories for you!'
    },
    {
      id: 'avatar',
      title: 'Choose your avatar!',
      subtitle: 'Pick one that looks like you or your favorite!'
    },
    {
      id: 'color',
      title: 'What\'s your favorite color?',
      subtitle: 'We\'ll use this to make the app special for you!'
    },
    {
      id: 'parent',
      title: 'Parent\'s Email (Optional)',
      subtitle: 'So parents can see your amazing progress!'
    },
    {
      id: 'ready',
      title: 'You\'re all set! 🎉',
      subtitle: 'Ready to start your Bible adventure?'
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      triggerHaptic('light')
      playSound('success')
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      const user = createUser(userData)
      triggerHaptic('success')
      playSound('celebration')
      onComplete(user)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      triggerHaptic('light')
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case 'name':
        return userData.name.trim().length > 0
      case 'age':
        return userData.age !== null && userData.age >= 3 && userData.age <= 17
      default:
        return true
    }
  }

  const renderStepContent = () => {
    const step = steps[currentStep]

    switch (step.id) {
      case 'welcome':
        return (
          <motion.div
            className="step-content welcome-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="lumo-welcome"
              animate={{
                y: [-10, 10, -10],
                rotate: [-5, 5, -5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="lumo-big">
                <div className="lumo-face-big">
                  <div className="eyes">👀</div>
                  <div className="beak">🐦</div>
                </div>
                <div className="wings-big">
                  <motion.span
                    animate={{ rotate: [-20, 20, -20] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🪶
                  </motion.span>
                  <motion.span
                    animate={{ rotate: [20, -20, 20] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🪶
                  </motion.span>
                </div>
              </div>
            </motion.div>
            <motion.p
              className="welcome-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Hi there! I'm Lumo, and I'm here to help you learn amazing Bible stories through fun games and adventures! ✨
            </motion.p>
          </motion.div>
        )

      case 'name':
        return (
          <div className="step-content">
            <motion.input
              type="text"
              placeholder="Enter your name..."
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="name-input"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileFocus={{ scale: 1.02 }}
              autoFocus
            />
          </div>
        )

      case 'age':
        return (
          <div className="step-content">
            <div className="age-grid">
              {[...Array(15)].map((_, i) => {
                const age = i + 3
                return (
                  <motion.button
                    key={age}
                    className={`age-button ${userData.age === age ? 'selected' : ''}`}
                    onClick={() => setUserData({ ...userData, age })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {age}
                  </motion.button>
                )
              })}
            </div>
          </div>
        )

      case 'avatar':
        return (
          <div className="step-content">
            <div className="avatar-grid">
              {avatars.map((avatar, i) => (
                <motion.button
                  key={avatar}
                  className={`avatar-button ${userData.avatar === avatar ? 'selected' : ''}`}
                  onClick={() => setUserData({ ...userData, avatar })}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="avatar-emoji">{avatar}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )

      case 'color':
        return (
          <div className="step-content">
            <div className="color-grid">
              {colors.map((color, i) => (
                <motion.button
                  key={color.value}
                  className={`color-button ${userData.favoriteColor === color.value ? 'selected' : ''}`}
                  onClick={() => setUserData({ ...userData, favoriteColor: color.value })}
                  style={{ backgroundColor: color.value }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {userData.favoriteColor === color.value && (
                    <motion.div
                      className="checkmark"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        )

      case 'parent':
        return (
          <div className="step-content">
            <motion.input
              type="email"
              placeholder="parent@example.com (optional)"
              value={userData.parentEmail}
              onChange={(e) => setUserData({ ...userData, parentEmail: e.target.value })}
              className="email-input"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileFocus={{ scale: 1.02 }}
            />
            <p className="parent-note">
              Don't worry! We'll only send updates about your child's progress and never share your email. 🔒
            </p>
          </div>
        )

      case 'ready':
        return (
          <motion.div
            className="step-content ready-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="celebration"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🎉
            </motion.div>
            <div className="user-summary">
              <div className="summary-avatar">{userData.avatar}</div>
              <h3>Welcome, {userData.name}!</h3>
              <p>Age: {userData.age} years old</p>
              <div 
                className="color-preview" 
                style={{ backgroundColor: userData.favoriteColor }}
              />
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-background">
        {/* Animated background elements */}
        <div className="bg-elements">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-element"
              animate={{
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 10, 0],
                rotate: [0, 360, 0],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }}
              style={{
                left: `${10 + i * 10}%`,
                top: `${20 + (i % 3) * 20}%`
              }}
            >
              {['✨', '🌟', '💫', '⭐', '🔮', '🌈', '💎', '🎭'][i]}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="onboarding-content">
        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="progress-text">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          className="step-container"
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="step-header">
            <h2 className="step-title">{steps[currentStep].title}</h2>
            <p className="step-subtitle">{steps[currentStep].subtitle}</p>
          </div>

          <div className="step-body">
            {renderStepContent()}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="navigation">
          {currentStep > 0 && (
            <motion.button
              className="btn btn-secondary nav-button"
              onClick={handlePrevious}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back
            </motion.button>
          )}
          
          <motion.button
            className={`btn btn-primary nav-button ${!canProceed() ? 'disabled' : ''}`}
            onClick={handleNext}
            disabled={!canProceed()}
            whileHover={canProceed() ? { scale: 1.05 } : {}}
            whileTap={canProceed() ? { scale: 0.95 } : {}}
          >
            {currentStep === steps.length - 1 ? 'Start Adventure! 🚀' : 'Next →'}
          </motion.button>
        </div>
      </div>

      <style jsx>{`
        .onboarding-container {
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

        .onboarding-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .bg-elements {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .bg-element {
          position: absolute;
          font-size: 1.5rem;
          opacity: 0.5;
        }

        .onboarding-content {
          position: relative;
          width: 90%;
          max-width: 500px;
          background: white;
          border-radius: var(--radius-xl);
          padding: var(--space-2xl);
          box-shadow: var(--shadow-xl);
          z-index: 2;
        }

        .progress-container {
          margin-bottom: var(--space-xl);
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: var(--gray-200);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: var(--space-sm);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-green), var(--primary-blue));
          border-radius: var(--radius-full);
        }

        .progress-text {
          text-align: center;
          font-size: 0.875rem;
          color: var(--gray-600);
          font-weight: 500;
        }

        .step-container {
          margin-bottom: var(--space-xl);
        }

        .step-header {
          text-align: center;
          margin-bottom: var(--space-xl);
        }

        .step-title {
          font-family: var(--font-primary);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--gray-800);
          margin-bottom: var(--space-sm);
        }

        .step-subtitle {
          font-size: 1rem;
          color: var(--gray-600);
          line-height: 1.5;
        }

        .step-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-lg);
        }

        /* Welcome Step */
        .welcome-step {
          text-align: center;
        }

        .lumo-welcome {
          margin-bottom: var(--space-lg);
        }

        .lumo-big {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: var(--shadow-lg);
          border: 4px solid var(--primary-green);
          position: relative;
        }

        .lumo-face-big {
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 2;
        }

        .eyes {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .beak {
          font-size: 1.5rem;
        }

        .wings-big {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 140px;
          display: flex;
          justify-content: space-between;
          font-size: 1.2rem;
          z-index: 1;
        }

        .welcome-message {
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--gray-700);
          max-width: 400px;
        }

        /* Name Input */
        .name-input, .email-input {
          width: 100%;
          max-width: 300px;
          padding: var(--space-lg);
          border: 2px solid var(--gray-300);
          border-radius: var(--radius-lg);
          font-family: var(--font-primary);
          font-size: 1.1rem;
          text-align: center;
          background: white;
          transition: all var(--transition-normal);
        }

        .name-input:focus, .email-input:focus {
          outline: none;
          border-color: var(--primary-green);
          box-shadow: 0 0 0 3px rgba(88, 204, 2, 0.1);
        }

        /* Age Grid */
        .age-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: var(--space-md);
          max-width: 300px;
        }

        .age-button {
          width: 50px;
          height: 50px;
          border: 2px solid var(--gray-300);
          border-radius: var(--radius-lg);
          background: white;
          font-family: var(--font-primary);
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .age-button:hover {
          border-color: var(--primary-green);
        }

        .age-button.selected {
          background: var(--primary-green);
          color: white;
          border-color: var(--primary-green);
        }

        /* Avatar Grid */
        .avatar-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: var(--space-md);
          max-width: 350px;
        }

        .avatar-button {
          width: 60px;
          height: 60px;
          border: 3px solid var(--gray-300);
          border-radius: var(--radius-lg);
          background: white;
          cursor: pointer;
          transition: all var(--transition-normal);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-emoji {
          font-size: 2rem;
        }

        .avatar-button:hover {
          border-color: var(--primary-green);
          transform: scale(1.05);
        }

        .avatar-button.selected {
          border-color: var(--primary-green);
          background: rgba(88, 204, 2, 0.1);
        }

        /* Color Grid */
        .color-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-lg);
          max-width: 250px;
        }

        .color-button {
          width: 60px;
          height: 60px;
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          transition: all var(--transition-normal);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-md);
          position: relative;
        }

        .color-button:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-lg);
        }

        .color-button.selected {
          border-width: 4px;
          transform: scale(1.1);
        }

        .checkmark {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        /* Parent Note */
        .parent-note {
          font-size: 0.875rem;
          color: var(--gray-600);
          text-align: center;
          max-width: 300px;
          line-height: 1.4;
        }

        /* Ready Step */
        .ready-step {
          text-align: center;
        }

        .celebration {
          font-size: 4rem;
          margin-bottom: var(--space-lg);
        }

        .user-summary {
          background: var(--gray-50);
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
        }

        .summary-avatar {
          font-size: 3rem;
        }

        .user-summary h3 {
          font-family: var(--font-primary);
          color: var(--gray-800);
          margin: 0;
        }

        .user-summary p {
          color: var(--gray-600);
          margin: 0;
        }

        .color-preview {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: var(--shadow-sm);
        }

        /* Navigation */
        .navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-md);
        }

        .nav-button {
          flex: 1;
          max-width: 200px;
        }

        .nav-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .onboarding-content {
            width: 95%;
            padding: var(--space-lg);
          }

          .step-title {
            font-size: 1.5rem;
          }

          .age-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .avatar-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .avatar-button {
            width: 50px;
            height: 50px;
          }

          .avatar-emoji {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default OnboardingFlow