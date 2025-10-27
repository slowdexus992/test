import React, { useEffect } from 'react'
import { useApp } from '../contexts/AppContext'

const SoundManager = () => {
  const { soundEnabled, notifications } = useApp()

  useEffect(() => {
    const soundNotifications = notifications.filter(n => n.type === 'sound')
    
    if (soundEnabled && soundNotifications.length > 0) {
      const latestSound = soundNotifications[soundNotifications.length - 1]
      playSound(latestSound.soundName)
    }
  }, [notifications, soundEnabled])

  const playSound = (soundName) => {
    if (!soundEnabled) return

    // Create audio context for Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    // Simple beep sounds using oscillator
    const sounds = {
      tap: { frequency: 800, duration: 0.1 },
      success: { frequency: 1000, duration: 0.2 },
      error: { frequency: 300, duration: 0.3 },
      celebration: { frequency: [800, 1000, 1200], duration: 0.5 }
    }

    const sound = sounds[soundName] || sounds.tap

    if (Array.isArray(sound.frequency)) {
      // Play sequence of tones
      sound.frequency.forEach((freq, index) => {
        setTimeout(() => {
          createBeep(audioContext, freq, sound.duration / sound.frequency.length)
        }, index * (sound.duration / sound.frequency.length) * 1000)
      })
    } else {
      createBeep(audioContext, sound.frequency, sound.duration)
    }
  }

  const createBeep = (audioContext, frequency, duration) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  }

  return null // This component doesn't render anything
}

export default SoundManager