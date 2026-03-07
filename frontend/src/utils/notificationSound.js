// Notification sound utility for order alerts

class NotificationSound {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.volume = 0.5;
  }

  // Initialize audio context (required for modern browsers)
  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
    }
    return this.audioContext;
  }

  // Play a pleasant notification sound
  playNotification(type = "ready") {
    if (!this.enabled) return;

    try {
      const context = this.initAudioContext();

      // Create oscillator for the sound
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Set volume
      gainNode.gain.value = this.volume;

      // Different sounds for different alert types
      if (type === "ready") {
        // Pleasant two-tone chime for ready orders
        oscillator.frequency.value = 800;
        oscillator.type = "sine";

        oscillator.start(context.currentTime);
        oscillator.frequency.setValueAtTime(800, context.currentTime);
        oscillator.frequency.setValueAtTime(1000, context.currentTime + 0.1);
        oscillator.stop(context.currentTime + 0.3);

        // Second tone
        setTimeout(() => {
          const osc2 = context.createOscillator();
          const gain2 = context.createGain();
          osc2.connect(gain2);
          gain2.connect(context.destination);
          gain2.gain.value = this.volume;
          osc2.frequency.value = 1200;
          osc2.type = "sine";
          osc2.start(context.currentTime);
          osc2.stop(context.currentTime + 0.2);
        }, 150);
      } else if (type === "urgent") {
        // More urgent sound for priority orders
        oscillator.frequency.value = 1200;
        oscillator.type = "square";

        oscillator.start(context.currentTime);
        oscillator.frequency.setValueAtTime(1200, context.currentTime);
        oscillator.frequency.setValueAtTime(1400, context.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(1200, context.currentTime + 0.2);
        oscillator.stop(context.currentTime + 0.4);
      }
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  }

  // Enable/disable sounds
  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem("notificationSoundEnabled", enabled);
  }

  // Set volume (0.0 to 1.0)
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem("notificationVolume", this.volume);
  }

  // Load settings from localStorage
  loadSettings() {
    const enabled = localStorage.getItem("notificationSoundEnabled");
    if (enabled !== null) {
      this.enabled = enabled === "true";
    }

    const volume = localStorage.getItem("notificationVolume");
    if (volume !== null) {
      this.volume = parseFloat(volume);
    }
  }
}

// Create singleton instance
const notificationSound = new NotificationSound();
notificationSound.loadSettings();

export default notificationSound;
