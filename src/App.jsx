import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Import components (we'll create these next)
import LoadingScreen from './components/LoadingScreen'
import OnboardingFlow from './components/OnboardingFlow'
import HomeScreen from './components/HomeScreen'
import LessonScreen from './components/LessonScreen'
import ProgressScreen from './components/ProgressScreen'
import ProfileScreen from './components/ProfileScreen'
import ParentDashboard from './components/ParentDashboard'
import Navigation from './components/Navigation'
import LumoMascot from './components/LumoMascot'
import NotificationSystem from './components/NotificationSystem'
import SoundManager from './components/SoundManager'

// Context for app state
import { AppProvider } from './contexts/AppContext'
import { UserProvider } from './contexts/UserContext'
import { GameProvider } from './contexts/GameContext'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isOnboarded, setIsOnboarded] = useState(false)

  useEffect(() => {
    // Simulate app initialization
    const initializeApp = async () => {
      // Check if user has completed onboarding
      const onboardingStatus = localStorage.getItem('bible-quest-onboarded')
      setIsOnboarded(!!onboardingStatus)
      
      // Simulate loading time for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsLoading(false)
    }

    initializeApp()
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <AppProvider>
      <UserProvider>
        <GameProvider>
          <Router>
            <div className="app-container">
              <SoundManager />
              <NotificationSystem />
              
              <AnimatePresence mode="wait">
                {!isOnboarded ? (
                  <OnboardingFlow 
                    key="onboarding"
                    onComplete={() => {
                      setIsOnboarded(true)
                      localStorage.setItem('bible-quest-onboarded', 'true')
                    }}
                  />
                ) : (
                  <motion.div
                    key="main-app"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="main-app"
                  >
                    <Routes>
                      <Route path="/" element={<HomeScreen />} />
                      <Route path="/lesson/:lessonId" element={<LessonScreen />} />
                      <Route path="/progress" element={<ProgressScreen />} />
                      <Route path="/profile" element={<ProfileScreen />} />
                      <Route path="/parent-dashboard" element={<ParentDashboard />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    
                    <Navigation />
                    <LumoMascot />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Router>
        </GameProvider>
      </UserProvider>
    </AppProvider>
  )
}

export default App