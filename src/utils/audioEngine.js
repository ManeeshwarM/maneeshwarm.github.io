// Web Audio API Synthesizer & Sound Effects, with a real-time analyser so the
// UI can react to actual audio data instead of faking a waveform.
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.osc = null;
    this.gain = null;
    this.analyser = null;
    this.freqData = null;
    this.isPlaying = false;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyser.smoothingTimeConstant = 0.75;
        this.analyser.connect(this.ctx.destination);
        this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Returns a Uint8Array of frequency-bin magnitudes (0-255) for the current
  // frame, or null if audio hasn't been initialized yet (e.g. before first click).
  getFrequencyData() {
    if (!this.analyser || !this.freqData) return null;
    this.analyser.getByteFrequencyData(this.freqData);
    return this.freqData;
  }

  playModelTone(accentColor = "#1db954", epoch = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    this.stopModelTone();

    try {
      this.osc = this.ctx.createOscillator();
      this.gain = this.ctx.createGain();

      // Convert hex color to frequency range (200Hz - 600Hz)
      const colorVal = parseInt(accentColor.replace("#", ""), 16) || 0x1db954;
      const baseFreq = 220 + (colorVal % 280) + epoch * 15;

      this.osc.type = "sine";
      this.osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

      // Low volume ambient drone
      this.gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.gain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 0.3);

      this.osc.connect(this.gain);
      this.gain.connect(this.analyser);

      this.osc.start();
      this.isPlaying = true;
    } catch (e) {
      console.warn("Audio Context init error:", e);
    }
  }

  stopModelTone() {
    if (this.osc) {
      try {
        if (this.gain) {
          this.gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);
        }
        setTimeout(() => {
          this.osc?.stop();
          this.osc?.disconnect();
          this.osc = null;
        }, 200);
      } catch (e) {
        this.osc = null;
      }
    }
    this.isPlaying = false;
  }

  playClickSound() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.analyser || this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }
}

export const audioEngine = new AudioEngine();
