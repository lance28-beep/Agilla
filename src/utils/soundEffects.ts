'use client';

export type SoundEffect = 'correct' | 'wrong' | 'move' | 'roll';

class SoundManager {
  private sounds: { [key in SoundEffect]: HTMLAudioElement } = {
    correct: new Audio('/sounds/correct.mp3'),
    wrong: new Audio('/sounds/wrong.mp3'),
    move: new Audio('/sounds/move.mp3'),
    roll: new Audio('/sounds/roll.mp3'),
  };

  play(effect: SoundEffect) {
    const sound = this.sounds[effect];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(console.error);
    }
  }
}

export const soundManager = new SoundManager(); 