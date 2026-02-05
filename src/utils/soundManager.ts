/**
 * SoundManager: Centralized audio controller using Web Audio API.
 * Follows Game Audio principles: distinct feedback, non-intrusive, procedural generation.
 */

class SoundManager {
    private context: AudioContext | null = null;
    private isMuted: boolean = false;

    constructor() {
        // Initialize AudioContext lazily on first interaction to allow browser autoplay policies
        window.addEventListener('click', () => this.initContext(), { once: true });
        window.addEventListener('keydown', () => this.initContext(), { once: true });
    }

    private initContext() {
        if (!this.context) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.context = new AudioContextClass();
            }
        }
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    public setMute(muted: boolean) {
        this.isMuted = muted;
    }

    /**
     * Play a specific sound effect type.
     */
    public play(type: 'success' | 'error' | 'pop' | 'coin' | 'unlock') {
        if (this.isMuted) return;
        this.initContext();
        if (!this.context) return;

        switch (type) {
            case 'pop':
                this.playPop();
                break;
            case 'success':
                this.playSuccess();
                break;
            case 'error':
                this.playError();
                break;
            case 'coin':
                this.playCoin();
                break;
            case 'unlock':
                this.playUnlock();
                break;
        }
    }

    // --- Procedural Sound Generators (Synth) ---

    private playPop() {
        const osc = this.context!.createOscillator();
        const gain = this.context!.createGain();

        osc.connect(gain);
        gain.connect(this.context!.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.context!.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.context!.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, this.context!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context!.currentTime + 0.1);

        osc.start();
        osc.stop(this.context!.currentTime + 0.1);
    }

    private playSuccess() {
        const now = this.context!.currentTime;
        this.createNote(660, now, 0.1, 'sine'); // E5
        this.createNote(880, now + 0.1, 0.2, 'sine'); // A5
    }

    private playError() {
        const now = this.context!.currentTime;
        this.createNote(200, now, 0.15, 'sawtooth');
        this.createNote(150, now + 0.15, 0.2, 'sawtooth');
    }

    private playCoin() {
        const now = this.context!.currentTime;
        this.createNote(1200, now, 0.05, 'square', 0.05);
        this.createNote(1600, now + 0.05, 0.2, 'square', 0.05);
    }

    private playUnlock() {
        // A major arpeggio "Tada"
        const now = this.context!.currentTime;
        const volume = 0.1;
        this.createNote(523.25, now, 0.1, 'triangle', volume); // C5
        this.createNote(659.25, now + 0.1, 0.1, 'triangle', volume); // E5
        this.createNote(783.99, now + 0.2, 0.1, 'triangle', volume); // G5
        this.createNote(1046.50, now + 0.3, 0.4, 'triangle', volume); // C6
    }

    // Helper
    private createNote(freq: number, startTime: number, duration: number, type: OscillatorType = 'sine', vol = 0.1) {
        if (!this.context) return;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = type;
        osc.frequency.value = freq;

        osc.connect(gain);
        gain.connect(this.context.destination);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }
}

export const soundManager = new SoundManager();
