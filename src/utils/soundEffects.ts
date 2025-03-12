'use client';

export type SoundEffect = 'correct' | 'wrong' | 'move' | 'roll';

class SoundManager {
  play(effect: SoundEffect) {
    // Disabled audio for now
    console.log('Sound effect:', effect);
  }
}

export const soundManager = new SoundManager(); 