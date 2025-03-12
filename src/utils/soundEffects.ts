type SoundEffect = 'roll' | 'correct' | 'incorrect' | 'move' | 'win' | 'click';

class SoundManager {
  private sounds: Map<SoundEffect, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds() {
    const soundFiles: Record<SoundEffect, string> = {
      roll: '/sounds/dice-roll.mp3',
      correct: '/sounds/correct-answer.mp3',
      incorrect: '/sounds/incorrect-answer.mp3',
      move: '/sounds/move.mp3',
      win: '/sounds/win.mp3',
      click: '/sounds/click.mp3'
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds.set(key as SoundEffect, audio);
    });
  }

  play(effect: SoundEffect) {
    if (this.isMuted) return;
    
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

export const soundManager = new SoundManager(); 