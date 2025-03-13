'use client';

export type SoundEffect = 'correct' | 'wrong' | 'move' | 'roll' | 'win';

export class SoundManager {
  private muted: boolean = false;

  play(soundName: string) {
    // Sound functionality removed
    return;
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