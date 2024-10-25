// src/managers/SoundManager.ts

interface Sound {
    element: HTMLAudioElement;
    volume: number;
    category: 'sfx' | 'music' | 'ui';
  }
  
  interface SoundOptions {
    volume?: number;
    loop?: boolean;
    category?: 'sfx' | 'music' | 'ui';
  }
  
  class SoundManager {
    private sounds: Map<string, Sound>;
    private isMuted: boolean;
    private volumes: {
      master: number;
      sfx: number;
      music: number;
      ui: number;
    };
    private currentMusic?: string;
  
    constructor() {
      this.sounds = new Map();
      this.isMuted = false;
      this.volumes = {
        master: 1,
        sfx: 0.8,
        music: 0.6,
        ui: 0.5
      };
      
      this.initializeSounds();
    }
  
    private async initializeSounds() {
      const soundFiles = {
        // UI Sounds
        click: { path: '/sounds/click.mp3', category: 'ui' as const },
        hover: { path: '/sounds/hover.mp3', category: 'ui' as const },
        
        // Game SFX
        correct: { path: '/sounds/correct.mp3', category: 'sfx' as const },
        wrong: { path: '/sounds/wrong.mp3', category: 'sfx' as const },
        countdown: { path: '/sounds/countdown.mp3', category: 'sfx' as const },
        success: { path: '/sounds/success.mp3', category: 'sfx' as const },
        
        // Background Music
        menuMusic: { path: '/sounds/menu-music.mp3', category: 'music' as const },
        gameMusic: { path: '/sounds/game-music.mp3', category: 'music' as const },
        actionMusic: { path: '/sounds/action-music.mp3', category: 'music' as const }
      };
  
      for (const [name, { path, category }] of Object.entries(soundFiles)) {
        try {
          const audio = new Audio(path);
          audio.preload = 'auto';
          
          this.sounds.set(name, {
            element: audio,
            volume: this.volumes[category],
            category
          });
  
          // Ensure audio is loaded
          await audio.load();
        } catch (error) {
          console.error(`Failed to load sound: ${name}`, error);
        }
      }
    }
  
    play(
      soundName: string, 
      options: SoundOptions = {}
    ): void {
      if (this.isMuted) return;
  
      const sound = this.sounds.get(soundName);
      if (!sound) return;
  
      const { element, category } = sound;
      
      // Set volume based on category and master volume
      const volume = options.volume ?? sound.volume;
      element.volume = this.volumes.master * this.volumes[category] * volume;
      
      // Configure playback
      element.loop = options.loop ?? false;
  
      // Stop any currently playing instance
      element.currentTime = 0;
      
      element.play().catch(error => {
        console.error(`Error playing sound: ${soundName}`, error);
      });
    }
  
    playMusic(musicName: string, fadeTime: number = 1000): void {
      if (this.currentMusic === musicName) return;
  
      // Fade out current music
      const currentMusic = this.currentMusic ? this.sounds.get(this.currentMusic) : null;
      if (currentMusic) {
        this.fadeOut(currentMusic.element, fadeTime);
      }
  
      // Start new music
      const newMusic = this.sounds.get(musicName);
      if (newMusic) {
        newMusic.element.volume = 0;
        newMusic.element.loop = true;
        newMusic.element.play();
        this.fadeIn(newMusic.element, fadeTime);
        this.currentMusic = musicName;
      }
    }
  
    private fadeOut(audio: HTMLAudioElement, duration: number): void {
      const startVolume = audio.volume;
      const steps = 20;
      const volumeStep = startVolume / steps;
      const stepTime = duration / steps;
  
      const fadeInterval = setInterval(() => {
        if (audio.volume > volumeStep) {
          audio.volume -= volumeStep;
        } else {
          audio.pause();
          audio.volume = startVolume;
          clearInterval(fadeInterval);
        }
      }, stepTime);
    }
  
    private fadeIn(audio: HTMLAudioElement, duration: number): void {
      const targetVolume = this.volumes.master * this.volumes.music;
      const steps = 20;
      const volumeStep = targetVolume / steps;
      const stepTime = duration / steps;
  
      const fadeInterval = setInterval(() => {
        if (audio.volume < targetVolume - volumeStep) {
          audio.volume += volumeStep;
        } else {
          audio.volume = targetVolume;
          clearInterval(fadeInterval);
        }
      }, stepTime);
    }
  
    setVolume(category: 'master' | 'sfx' | 'music' | 'ui', level: number): void {
      this.volumes[category] = Math.max(0, Math.min(1, level));
      
      // Update all active sounds in the category
      this.sounds.forEach(sound => {
        if (category === 'master' || sound.category === category) {
          sound.element.volume = this.volumes.master * this.volumes[sound.category];
        }
      });
    }
  
    stopAll(): void {
      this.sounds.forEach(sound => {
        sound.element.pause();
        sound.element.currentTime = 0;
      });
      this.currentMusic = undefined;
    }
  
    toggleMute(): boolean {
      this.isMuted = !this.isMuted;
      
      this.sounds.forEach(sound => {
        sound.element.muted = this.isMuted;
      });
      
      return this.isMuted;
    }
  
    cleanup(): void {
      this.stopAll();
      this.sounds.clear();
    }
  }
  
  export const soundManager = new SoundManager();