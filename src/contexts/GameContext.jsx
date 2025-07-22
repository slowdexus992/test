import React, { createContext, useContext, useReducer, useEffect } from 'react'

const GameContext = createContext()

const initialState = {
  currentLesson: null,
  currentStory: null,
  lessonProgress: 0,
  isLessonActive: false,
  generatedImages: {},
  aiResponses: [],
  mascotState: {
    emotion: 'happy',
    animation: 'idle',
    message: '',
    isVisible: true
  },
  gameState: {
    score: 0,
    lives: 3,
    hints: 3,
    timeRemaining: 0,
    isGameActive: false
  },
  stories: [
    {
      id: 'noahs-ark',
      title: "Noah's Ark",
      description: 'Learn about Noah and the great flood',
      difficulty: 'easy',
      estimatedTime: 10,
      unlocked: true,
      completed: false,
      icon: '🚢',
      color: '#4facfe',
      lessons: [
        {
          id: 'noah-1',
          title: 'God Speaks to Noah',
          type: 'story',
          content: 'God told Noah to build an ark because a great flood was coming.',
          imagePrompt: 'Noah receiving divine message from God, ancient biblical times, peaceful scene',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What did God tell Noah to build?',
              options: ['A house', 'An ark', 'A tower', 'A bridge'],
              correct: 1,
              explanation: 'God told Noah to build an ark to save his family and the animals!'
            }
          ]
        },
        {
          id: 'noah-2',
          title: 'Building the Ark',
          type: 'interactive',
          content: 'Noah and his family worked hard to build the ark exactly as God instructed.',
          imagePrompt: 'Noah and his family building a large wooden ark, construction scene, biblical times',
          questions: [
            {
              id: 'q2',
              type: 'fill-in-blank',
              question: 'Noah built the ark out of _____ wood.',
              answer: 'gopher',
              hints: ['It\'s a type of wood mentioned in the Bible', 'Starts with "g"'],
              explanation: 'The Bible says Noah used gopher wood to build the ark!'
            }
          ]
        }
      ]
    },
    {
      id: 'david-goliath',
      title: 'David and Goliath',
      description: 'The story of courage and faith',
      difficulty: 'normal',
      estimatedTime: 12,
      unlocked: false,
      completed: false,
      icon: '🗿',
      color: '#ff6b6b',
      lessons: [
        {
          id: 'david-1',
          title: 'The Giant Challenge',
          type: 'story',
          content: 'A giant named Goliath challenged the army of Israel.',
          imagePrompt: 'Giant Goliath challenging Israeli army, dramatic biblical scene',
          questions: [
            {
              id: 'q3',
              type: 'multiple-choice',
              question: 'What was the giant\'s name?',
              options: ['Goliath', 'Samson', 'Saul', 'David'],
              correct: 0,
              explanation: 'The giant was named Goliath, and he was very tall and scary!'
            }
          ]
        }
      ]
    },
    {
      id: 'creation',
      title: 'The Creation Story',
      description: 'How God created the world in seven days',
      difficulty: 'easy',
      estimatedTime: 15,
      unlocked: false,
      completed: false,
      icon: '🌍',
      color: '#51cf66',
      lessons: []
    }
  ]
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_LESSON':
      return {
        ...state,
        currentLesson: action.payload,
        lessonProgress: 0,
        isLessonActive: true,
        gameState: {
          ...state.gameState,
          score: 0,
          lives: 3,
          hints: 3,
          isGameActive: true
        }
      }
    
    case 'END_LESSON':
      return {
        ...state,
        currentLesson: null,
        isLessonActive: false,
        lessonProgress: 0,
        gameState: {
          ...state.gameState,
          isGameActive: false
        }
      }
    
    case 'UPDATE_LESSON_PROGRESS':
      return {
        ...state,
        lessonProgress: Math.min(100, action.payload)
      }
    
    case 'SET_CURRENT_STORY':
      return {
        ...state,
        currentStory: action.payload
      }
    
    case 'UNLOCK_STORY':
      return {
        ...state,
        stories: state.stories.map(story =>
          story.id === action.payload
            ? { ...story, unlocked: true }
            : story
        )
      }
    
    case 'COMPLETE_STORY':
      return {
        ...state,
        stories: state.stories.map(story =>
          story.id === action.payload
            ? { ...story, completed: true }
            : story
        )
      }
    
    case 'ADD_GENERATED_IMAGE':
      return {
        ...state,
        generatedImages: {
          ...state.generatedImages,
          [action.payload.key]: action.payload.imageUrl
        }
      }
    
    case 'ADD_AI_RESPONSE':
      return {
        ...state,
        aiResponses: [...state.aiResponses, {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...action.payload
        }]
      }
    
    case 'UPDATE_MASCOT_STATE':
      return {
        ...state,
        mascotState: {
          ...state.mascotState,
          ...action.payload
        }
      }
    
    case 'UPDATE_GAME_STATE':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          ...action.payload
        }
      }
    
    case 'USE_HINT':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          hints: Math.max(0, state.gameState.hints - 1)
        }
      }
    
    case 'LOSE_LIFE':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          lives: Math.max(0, state.gameState.lives - 1)
        }
      }
    
    case 'ADD_SCORE':
      return {
        ...state,
        gameState: {
          ...state.gameState,
          score: state.gameState.score + action.payload
        }
      }
    
    case 'RESET_GAME_STATE':
      return {
        ...state,
        gameState: {
          score: 0,
          lives: 3,
          hints: 3,
          timeRemaining: 0,
          isGameActive: false
        }
      }
    
    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  // Auto-save game progress
  useEffect(() => {
    const gameData = {
      stories: state.stories,
      generatedImages: state.generatedImages
    }
    localStorage.setItem('bible-quest-game-data', JSON.stringify(gameData))
  }, [state.stories, state.generatedImages])

  // Load saved game data
  useEffect(() => {
    const savedGameData = localStorage.getItem('bible-quest-game-data')
    if (savedGameData) {
      try {
        const gameData = JSON.parse(savedGameData)
        if (gameData.stories) {
          dispatch({ type: 'LOAD_STORIES', payload: gameData.stories })
        }
        if (gameData.generatedImages) {
          dispatch({ type: 'LOAD_IMAGES', payload: gameData.generatedImages })
        }
      } catch (error) {
        console.error('Failed to load game data:', error)
      }
    }
  }, [])

  const value = {
    ...state,
    dispatch,
    
    // Helper functions
    startLesson: (lesson, story) => {
      dispatch({ type: 'START_LESSON', payload: { ...lesson, storyId: story?.id } })
      dispatch({
        type: 'UPDATE_MASCOT_STATE',
        payload: {
          emotion: 'excited',
          animation: 'bounce',
          message: `Let's learn about ${lesson.title}! 🎉`,
          isVisible: true
        }
      })
    },
    
    endLesson: (performance) => {
      dispatch({ type: 'END_LESSON' })
      
      // Update mascot based on performance
      if (performance.score >= 80) {
        dispatch({
          type: 'UPDATE_MASCOT_STATE',
          payload: {
            emotion: 'proud',
            animation: 'celebrate',
            message: 'Amazing work! You did great! 🌟',
            isVisible: true
          }
        })
      } else if (performance.score >= 60) {
        dispatch({
          type: 'UPDATE_MASCOT_STATE',
          payload: {
            emotion: 'happy',
            animation: 'clap',
            message: 'Good job! Keep practicing! 👏',
            isVisible: true
          }
        })
      } else {
        dispatch({
          type: 'UPDATE_MASCOT_STATE',
          payload: {
            emotion: 'encouraging',
            animation: 'pat',
            message: 'That\'s okay! Let\'s try again! 💪',
            isVisible: true
          }
        })
      }
    },
    
    generateImage: async (prompt, key) => {
      try {
        // Simulate AI image generation (replace with actual API call)
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ prompt })
        })
        
        if (response.ok) {
          const { imageUrl } = await response.json()
          dispatch({
            type: 'ADD_GENERATED_IMAGE',
            payload: { key, imageUrl }
          })
          return imageUrl
        }
      } catch (error) {
        console.error('Image generation failed:', error)
        // Return a placeholder image
        const placeholderUrl = `https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(prompt.slice(0, 20))}`
        dispatch({
          type: 'ADD_GENERATED_IMAGE',
          payload: { key, imageUrl: placeholderUrl }
        })
        return placeholderUrl
      }
    },
    
    askMascot: async (question) => {
      try {
        // Simulate AI response (replace with actual API call)
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            message: question,
            context: 'bible-learning',
            age: 'child'
          })
        })
        
        if (response.ok) {
          const { reply } = await response.json()
          dispatch({
            type: 'ADD_AI_RESPONSE',
            payload: {
              question,
              answer: reply,
              type: 'chat'
            }
          })
          
          dispatch({
            type: 'UPDATE_MASCOT_STATE',
            payload: {
              message: reply,
              emotion: 'thoughtful',
              animation: 'talk'
            }
          })
          
          return reply
        }
      } catch (error) {
        console.error('AI chat failed:', error)
        const fallbackReply = "That's a great question! Let me think about that... 🤔"
        dispatch({
          type: 'UPDATE_MASCOT_STATE',
          payload: {
            message: fallbackReply,
            emotion: 'thinking',
            animation: 'scratch'
          }
        })
        return fallbackReply
      }
    },
    
    updateMascotEmotion: (emotion, message = '', animation = 'idle') => {
      dispatch({
        type: 'UPDATE_MASCOT_STATE',
        payload: { emotion, message, animation }
      })
    },
    
    correctAnswer: (points = 10) => {
      dispatch({ type: 'ADD_SCORE', payload: points })
      dispatch({
        type: 'UPDATE_MASCOT_STATE',
        payload: {
          emotion: 'happy',
          animation: 'cheer',
          message: 'Correct! Well done! ✨'
        }
      })
    },
    
    incorrectAnswer: () => {
      dispatch({ type: 'LOSE_LIFE' })
      dispatch({
        type: 'UPDATE_MASCOT_STATE',
        payload: {
          emotion: 'sympathetic',
          animation: 'comfort',
          message: 'Not quite right, but keep trying! 💙'
        }
      })
    },
    
    useHint: () => {
      if (state.gameState.hints > 0) {
        dispatch({ type: 'USE_HINT' })
        dispatch({
          type: 'UPDATE_MASCOT_STATE',
          payload: {
            emotion: 'helpful',
            animation: 'point',
            message: 'Here\'s a hint to help you! 💡'
          }
        })
        return true
      }
      return false
    },
    
    unlockStory: (storyId) => {
      dispatch({ type: 'UNLOCK_STORY', payload: storyId })
      const story = state.stories.find(s => s.id === storyId)
      if (story) {
        dispatch({
          type: 'UPDATE_MASCOT_STATE',
          payload: {
            emotion: 'excited',
            animation: 'celebrate',
            message: `New story unlocked: ${story.title}! 🎉`
          }
        })
      }
    },
    
    completeStory: (storyId) => {
      dispatch({ type: 'COMPLETE_STORY', payload: storyId })
      const story = state.stories.find(s => s.id === storyId)
      if (story) {
        dispatch({
          type: 'UPDATE_MASCOT_STATE',
          payload: {
            emotion: 'proud',
            animation: 'victory',
            message: `You completed ${story.title}! Amazing! 🏆`
          }
        })
        
        // Unlock next story if available
        const currentIndex = state.stories.findIndex(s => s.id === storyId)
        if (currentIndex < state.stories.length - 1) {
          const nextStory = state.stories[currentIndex + 1]
          setTimeout(() => {
            dispatch({ type: 'UNLOCK_STORY', payload: nextStory.id })
          }, 2000)
        }
      }
    },
    
    getStoryById: (storyId) => {
      return state.stories.find(story => story.id === storyId)
    },
    
    getLessonById: (lessonId, storyId) => {
      const story = state.stories.find(s => s.id === storyId)
      return story?.lessons.find(lesson => lesson.id === lessonId)
    }
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}