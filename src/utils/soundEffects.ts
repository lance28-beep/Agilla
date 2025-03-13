'use client';

export type SoundEffect = 'correct' | 'wrong' | 'move' | 'roll' | 'win';

export class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private muted: boolean = false;

  constructor() {
    this.sounds = {
      roll: new Audio('/sounds/roll.mp3'),
      move: new Audio('/sounds/move.mp3'),
      win: new Audio('/sounds/win.mp3'),
      click: new Audio('/sounds/click.mp3'),
      correct: new Audio('/sounds/correct.mp3'),
      wrong: new Audio('/sounds/wrong.mp3'),
    };
  }

  play(soundName: string) {
    if (this.muted || !this.sounds[soundName]) return;
    this.sounds[soundName].currentTime = 0;
    this.sounds[soundName].play().catch(() => {});
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }
}

export const soundManager = new SoundManager(); 