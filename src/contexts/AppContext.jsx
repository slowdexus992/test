import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()

const initialState = {
  theme: 'default',
  soundEnabled: true,
  hapticsEnabled: true,
  animationsEnabled: true,
  notifications: [],
  isOffline: false,
  currentStreak: 0,
  totalXP: 0,
  unlockedBadges: [],
  settings: {
    parentalControls: false,
    voiceInteraction: true,
    autoPlay: true,
    difficulty: 'normal' // easy, normal, hard
  }
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_SOUND_ENABLED':
      return { ...state, soundEnabled: action.payload }
    
    case 'SET_HAPTICS_ENABLED':
      return { ...state, hapticsEnabled: action.payload }
    
    case 'SET_ANIMATIONS_ENABLED':
      return { ...state, animationsEnabled: action.payload }
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now(),
          ...action.payload
        }]
      }
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    
    case 'SET_OFFLINE':
      return { ...state, isOffline: action.payload }
    
    case 'UPDATE_STREAK':
      return { ...state, currentStreak: action.payload }
    
    case 'ADD_XP':
      return { ...state, totalXP: state.totalXP + action.payload }
    
    case 'UNLOCK_BADGE':
      if (!state.unlockedBadges.includes(action.payload)) {
        return {
          ...state,
          unlockedBadges: [...state.unlockedBadges, action.payload]
        }
      }
      return state
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      }
    
    case 'LOAD_STATE':
      return { ...state, ...action.payload }
    
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('bible-quest-app-state')
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        dispatch({ type: 'LOAD_STATE', payload: parsedState })
      } catch (error) {
        console.error('Failed to load saved state:', error)
      }
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bible-quest-app-state', JSON.stringify(state))
  }, [state])

  // Check online/offline status
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_OFFLINE', payload: false })
    const handleOffline = () => dispatch({ type: 'SET_OFFLINE', payload: true })

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const value = {
    ...state,
    dispatch,
    
    // Helper functions
    playSound: (soundName) => {
      if (state.soundEnabled) {
        // Sound playing logic will be implemented in SoundManager
        dispatch({ type: 'ADD_NOTIFICATION', payload: { type: 'sound', soundName } })
      }
    },
    
    triggerHaptic: (type = 'light') => {
      if (state.hapticsEnabled && navigator.vibrate) {
        const patterns = {
          light: [10],
          medium: [20],
          heavy: [30],
          success: [10, 50, 10],
          error: [100]
        }
        navigator.vibrate(patterns[type] || patterns.light)
      }
    },
    
    showNotification: (message, type = 'info', duration = 3000) => {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: { message, type, duration }
      })
    },
    
    addXP: (amount) => {
      dispatch({ type: 'ADD_XP', payload: amount })
      // Check for level up or achievements
      const newTotal = state.totalXP + amount
      const currentLevel = Math.floor(newTotal / 100)
      const previousLevel = Math.floor(state.totalXP / 100)
      
      if (currentLevel > previousLevel) {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            type: 'level-up',
            message: `Level ${currentLevel} reached!`,
            duration: 5000
          }
        })
      }
    },
    
    updateStreak: () => {
      const today = new Date().toDateString()
      const lastVisit = localStorage.getItem('bible-quest-last-visit')
      
      if (lastVisit !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        if (lastVisit === yesterday.toDateString()) {
          // Consecutive day - increment streak
          dispatch({ type: 'UPDATE_STREAK', payload: state.currentStreak + 1 })
        } else {
          // Streak broken - reset
          dispatch({ type: 'UPDATE_STREAK', payload: 1 })
        }
        
        localStorage.setItem('bible-quest-last-visit', today)
      }
    }
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}