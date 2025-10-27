import React, { createContext, useContext, useReducer, useEffect } from 'react'

const UserContext = createContext()

const initialState = {
  user: {
    id: null,
    name: '',
    age: null,
    avatar: '👦',
    favoriteColor: '#58cc02',
    mascotName: 'Lumo',
    parentEmail: '',
    createdAt: null
  },
  progress: {
    currentLevel: 1,
    totalXP: 0,
    lessonsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalTimeSpent: 0, // in minutes
    favoriteStories: [],
    completedStories: [],
    unlockedOutfits: ['default'],
    currentOutfit: 'default'
  },
  achievements: {
    badges: [],
    milestones: [],
    specialRewards: []
  },
  preferences: {
    difficulty: 'normal',
    voiceSpeed: 'normal',
    autoPlay: true,
    showHints: true,
    parentalMode: false
  },
  isAuthenticated: false,
  isLoading: false
}

function userReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        isAuthenticated: true
      }
    
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: { ...state.progress, ...action.payload }
      }
    
    case 'ADD_XP':
      const newXP = state.progress.totalXP + action.payload
      const newLevel = Math.floor(newXP / 100) + 1
      return {
        ...state,
        progress: {
          ...state.progress,
          totalXP: newXP,
          currentLevel: newLevel
        }
      }
    
    case 'COMPLETE_LESSON':
      return {
        ...state,
        progress: {
          ...state.progress,
          lessonsCompleted: state.progress.lessonsCompleted + 1
        }
      }
    
    case 'COMPLETE_STORY':
      const { storyId } = action.payload
      if (!state.progress.completedStories.includes(storyId)) {
        return {
          ...state,
          progress: {
            ...state.progress,
            completedStories: [...state.progress.completedStories, storyId]
          }
        }
      }
      return state
    
    case 'ADD_FAVORITE_STORY':
      const { favoriteStoryId } = action.payload
      if (!state.progress.favoriteStories.includes(favoriteStoryId)) {
        return {
          ...state,
          progress: {
            ...state.progress,
            favoriteStories: [...state.progress.favoriteStories, favoriteStoryId]
          }
        }
      }
      return state
    
    case 'REMOVE_FAVORITE_STORY':
      return {
        ...state,
        progress: {
          ...state.progress,
          favoriteStories: state.progress.favoriteStories.filter(
            id => id !== action.payload
          )
        }
      }
    
    case 'UPDATE_STREAK':
      const newStreak = action.payload
      const longestStreak = Math.max(state.progress.longestStreak, newStreak)
      return {
        ...state,
        progress: {
          ...state.progress,
          currentStreak: newStreak,
          longestStreak
        }
      }
    
    case 'ADD_TIME_SPENT':
      return {
        ...state,
        progress: {
          ...state.progress,
          totalTimeSpent: state.progress.totalTimeSpent + action.payload
        }
      }
    
    case 'UNLOCK_OUTFIT':
      const { outfitId } = action.payload
      if (!state.progress.unlockedOutfits.includes(outfitId)) {
        return {
          ...state,
          progress: {
            ...state.progress,
            unlockedOutfits: [...state.progress.unlockedOutfits, outfitId]
          }
        }
      }
      return state
    
    case 'SET_CURRENT_OUTFIT':
      return {
        ...state,
        progress: {
          ...state.progress,
          currentOutfit: action.payload
        }
      }
    
    case 'ADD_BADGE':
      const { badgeId, badgeData } = action.payload
      if (!state.achievements.badges.find(b => b.id === badgeId)) {
        return {
          ...state,
          achievements: {
            ...state.achievements,
            badges: [...state.achievements.badges, { id: badgeId, ...badgeData }]
          }
        }
      }
      return state
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      }
    
    case 'LOGOUT':
      return {
        ...initialState,
        isAuthenticated: false
      }
    
    case 'LOAD_USER_DATA':
      return { ...state, ...action.payload }
    
    default:
      return state
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState)

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUserData = localStorage.getItem('bible-quest-user-data')
        if (savedUserData) {
          const userData = JSON.parse(savedUserData)
          dispatch({ type: 'LOAD_USER_DATA', payload: userData })
        }
      } catch (error) {
        console.error('Failed to load user data:', error)
      }
    }

    loadUserData()
  }, [])

  // Save user data to localStorage whenever state changes
  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem('bible-quest-user-data', JSON.stringify(state))
    }
  }, [state])

  const value = {
    ...state,
    dispatch,
    
    // Helper functions
    createUser: (userData) => {
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      dispatch({ type: 'SET_USER', payload: newUser })
      return newUser
    },
    
    updateUser: (updates) => {
      dispatch({ type: 'SET_USER', payload: updates })
    },
    
    addExperience: (amount, source = 'lesson') => {
      dispatch({ type: 'ADD_XP', payload: amount })
      
      // Check for level-up achievements
      const currentXP = state.progress.totalXP
      const newXP = currentXP + amount
      const currentLevel = Math.floor(currentXP / 100) + 1
      const newLevel = Math.floor(newXP / 100) + 1
      
      if (newLevel > currentLevel) {
        // Level up! Award bonus XP and unlock rewards
        dispatch({
          type: 'ADD_BADGE',
          payload: {
            badgeId: `level-${newLevel}`,
            badgeData: {
              name: `Level ${newLevel} Hero`,
              description: `Reached level ${newLevel}!`,
              icon: '🏆',
              earnedAt: new Date().toISOString()
            }
          }
        })
        
        // Unlock new outfits at certain levels
        if (newLevel % 5 === 0) {
          dispatch({
            type: 'UNLOCK_OUTFIT',
            payload: { outfitId: `level-${newLevel}-outfit` }
          })
        }
      }
    },
    
    completeLesson: (lessonData) => {
      dispatch({ type: 'COMPLETE_LESSON' })
      dispatch({ type: 'ADD_TIME_SPENT', payload: lessonData.timeSpent || 5 })
      
      // Award XP based on performance
      const baseXP = 10
      const bonusXP = lessonData.perfect ? 5 : 0
      dispatch({ type: 'ADD_XP', payload: baseXP + bonusXP })
    },
    
    completeStory: (storyId, performance) => {
      dispatch({ type: 'COMPLETE_STORY', payload: { storyId } })
      
      // Award story completion badge
      dispatch({
        type: 'ADD_BADGE',
        payload: {
          badgeId: `story-${storyId}`,
          badgeData: {
            name: `${performance.storyName} Master`,
            description: `Completed the story of ${performance.storyName}`,
            icon: '📖',
            earnedAt: new Date().toISOString()
          }
        }
      })
    },
    
    updateStreak: () => {
      const today = new Date().toDateString()
      const lastVisit = localStorage.getItem('bible-quest-last-visit')
      
      if (lastVisit !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        
        let newStreak
        if (lastVisit === yesterday.toDateString()) {
          // Consecutive day
          newStreak = state.progress.currentStreak + 1
        } else {
          // Streak broken
          newStreak = 1
        }
        
        dispatch({ type: 'UPDATE_STREAK', payload: newStreak })
        localStorage.setItem('bible-quest-last-visit', today)
        
        // Award streak badges
        if (newStreak === 7) {
          dispatch({
            type: 'ADD_BADGE',
            payload: {
              badgeId: 'streak-7',
              badgeData: {
                name: 'Weekly Warrior',
                description: '7 day learning streak!',
                icon: '🔥',
                earnedAt: new Date().toISOString()
              }
            }
          })
        } else if (newStreak === 30) {
          dispatch({
            type: 'ADD_BADGE',
            payload: {
              badgeId: 'streak-30',
              badgeData: {
                name: 'Monthly Master',
                description: '30 day learning streak!',
                icon: '🌟',
                earnedAt: new Date().toISOString()
              }
            }
          })
        }
        
        return newStreak
      }
      return state.progress.currentStreak
    },
    
    toggleFavoriteStory: (storyId) => {
      if (state.progress.favoriteStories.includes(storyId)) {
        dispatch({ type: 'REMOVE_FAVORITE_STORY', payload: storyId })
      } else {
        dispatch({ type: 'ADD_FAVORITE_STORY', payload: { favoriteStoryId: storyId } })
      }
    },
    
    logout: () => {
      localStorage.removeItem('bible-quest-user-data')
      dispatch({ type: 'LOGOUT' })
    }
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}