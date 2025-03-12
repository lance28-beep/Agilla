'use client';

type SoundEffect = 'roll' | 'correct' | 'incorrect' | 'move' | 'win' | 'click';

interface ISoundManager {
  play(effect: SoundEffect): void;
  toggleMute(): boolean;
  setMute(mute: boolean): void;
  isSoundMuted(): boolean;
}

class SoundManager implements ISoundManager {
  private sounds: Map<SoundEffect, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSounds();
    }
  }

  private initializeSounds() {
    if (this.isInitialized) return;

    const soundFiles: Record<SoundEffect, string> = {
      roll: '/sounds/dice-roll.mp3',
      correct: '/sounds/correct-answer.mp3',
      incorrect: '/sounds/incorrect-answer.mp3',
      move: '/sounds/move.mp3',
      win: '/sounds/win.mp3',
      click: '/sounds/click.mp3'
    };

    try {
      Object.entries(soundFiles).forEach(([key, path]) => {
        if (typeof Audio !== 'undefined') {
          const audio = new Audio(path);
          audio.preload = 'auto';
          this.sounds.set(key as SoundEffect, audio);
        }
      });
      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize audio:', error);
    }
  }

  play(effect: SoundEffect) {
    if (this.isMuted || typeof window === 'undefined') return;
    
    // Initialize sounds if not already done (in case constructor didn't run on client)
    if (!this.isInitialized) {
      this.initializeSounds();
    }
    
    const sound = this.sounds.get(effect);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.warn('Audio playback failed:', error);
      });
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
  }

  isSoundMuted() {
    return this.isMuted;
  }
}

let soundManager: ISoundManager;

// Create the instance only on the client side
if (typeof window !== 'undefined') {
  soundManager = new SoundManager();
} else {
  // Provide a mock implementation for server-side rendering
  soundManager = {
    play: () => {},
    toggleMute: () => false,
    setMute: () => {},
    isSoundMuted: () => false
  };
}

export { soundManager }; 