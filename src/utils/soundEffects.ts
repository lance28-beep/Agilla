'use client';

export type SoundEffect = 'correct' | 'wrong' | 'move' | 'roll' | 'win';

export class SoundManager {
  private muted: boolean = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  play(_soundName: string) {
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