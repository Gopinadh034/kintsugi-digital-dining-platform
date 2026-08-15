/**
 * sound-effects.js - Web Audio API synthesizer for authentic Japanese zen sound effects
 * Generates soft bamboo chime, koto pluck, water resonance, and subtle gong audio without external audio files.
 */

class ZenAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = true;
        this.ambientOsc = null;
        this.gainNode = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.init();
        this.isMuted = !this.isMuted;
        const btn = document.getElementById('soundToggleBtn');
        if (btn) {
            btn.innerHTML = this.isMuted 
                ? '<i class="fas fa-volume-mute"></i> <span>Audio Off</span>' 
                : '<i class="fas fa-volume-up"></i> <span>Zen Soundscape</span>';
            btn.classList.toggle('active', !this.isMuted);
        }
        if (!this.isMuted) {
            this.playChime();
        }
        return !this.isMuted;
    }

    // Play Japanese Koto / Bamboo Chime pluck
    playChime(freq = 528) {
        if (this.isMuted) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        // Pentatonic Japanese tuning frequencies (Yo scale: D, F, G, A, C)
        const notes = [293.66, 349.23, 392.00, 440.00, 523.25, 587.33, 698.46];
        const randomNote = notes[Math.floor(Math.random() * notes.length)];

        osc.type = 'sine';
        osc.frequency.setValueAtTime(randomNote, this.ctx.currentTime);
        
        // Soft metallic overtone
        const overtone = this.ctx.createOscillator();
        const overtoneGain = this.ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(randomNote * 2.75, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

        overtoneGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        overtone.connect(overtoneGain);
        overtoneGain.connect(this.ctx.destination);

        osc.start();
        overtone.start();
        osc.stop(this.ctx.currentTime + 1.2);
        overtone.stop(this.ctx.currentTime + 0.8);
    }

    // Dish selection resonance
    playDishSwitch() {
        if (this.isMuted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
    }

    // Order add / cart bell sound
    playOrderSuccess() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);
            gain.gain.setValueAtTime(0.1, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.6);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.6);
        });
    }
}

window.zenAudio = new ZenAudioEngine();
