/**
 * TOEIC Mastery Hub — Speech Synthesis Voice Manager
 * Phase 6: Stable Audio Controller & Lifecycle Architecture
 *
 * Responsibilities:
 * - Asynchronous voice discovery with onvoiceschanged event handling.
 * - Heuristic matching for English voices, regional accents (US, UK, AU, CA), and gender.
 * - Persistent preferred voice caching in LocalStorage.
 * - Safe environment checks (browser vs SSR vs tests).
 */

const PREFERRED_VOICE_KEY = 'toeic_preferred_voice_en';

export interface VoiceCriteria {
  accent?: 'US' | 'UK' | 'AU' | 'CA';
  genderHint?: 'male' | 'female';
}

const MALE_NAME_PATTERN = /\b(david|george|james|mark|guy|male|alex|fred|daniel|tom|oliver|arthur|brian|ryan|sean|microsoft mark)\b/i;
const FEMALE_NAME_PATTERN = /\b(zira|susan|samantha|victoria|female|hazel|jenny|ava|karen|catherine|emma|helena|sophia|microsoft zira)\b/i;

class VoiceManager {
  private voices: SpeechSynthesisVoice[] = [];
  private isLoaded: boolean = false;
  private pendingCallbacks: Array<(voices: SpeechSynthesisVoice[]) => void> = [];

  constructor() {
    this.initVoiceListener();
  }

  private isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  private initVoiceListener() {
    if (!this.isSupported()) return;

    // Load initial voices if already available
    const initial = window.speechSynthesis.getVoices();
    if (initial && initial.length > 0) {
      this.voices = initial;
      this.isLoaded = true;
    }

    // Attach onvoiceschanged for async voice population
    window.speechSynthesis.onvoiceschanged = () => {
      this.voices = window.speechSynthesis.getVoices();
      this.isLoaded = true;
      const callbacks = [...this.pendingCallbacks];
      this.pendingCallbacks = [];
      callbacks.forEach((cb) => cb(this.voices));
    };
  }

  /**
   * Returns currently loaded voices synchronously.
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported()) return [];
    if (!this.isLoaded || this.voices.length === 0) {
      this.voices = window.speechSynthesis.getVoices();
      if (this.voices.length > 0) this.isLoaded = true;
    }
    return this.voices;
  }

  /**
   * Asynchronously waits for voices to be loaded (with timeout).
   */
  waitForVoices(timeoutMs: number = 1000): Promise<SpeechSynthesisVoice[]> {
    if (!this.isSupported()) return Promise.resolve([]);

    const current = this.getVoices();
    if (current.length > 0) {
      return Promise.resolve(current);
    }

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve(this.getVoices());
      }, timeoutMs);

      this.pendingCallbacks.push((loaded) => {
        clearTimeout(timer);
        resolve(loaded);
      });
    });
  }

  /**
   * Filters English voices available in the system.
   */
  getEnglishVoices(): SpeechSynthesisVoice[] {
    const all = this.getVoices();
    return all.filter((v) => v.lang.toLowerCase().startsWith('en'));
  }

  /**
   * Finds the best voice matching accent and gender hints.
   */
  findBestEnglishVoice(criteria?: VoiceCriteria): SpeechSynthesisVoice | null {
    const englishVoices = this.getEnglishVoices();
    if (englishVoices.length === 0) {
      // Fallback: return default voice or first available
      const all = this.getVoices();
      return all.find((v) => v.default) || all[0] || null;
    }

    // Check user preference first if no strict gender requirement
    const preferredUri = this.getPreferredVoiceURI();
    if (preferredUri && !criteria?.genderHint) {
      const saved = englishVoices.find((v) => v.voiceURI === preferredUri);
      if (saved) return saved;
    }

    // Determine target lang code prefix
    let targetLangCode = 'en-US';
    if (criteria?.accent === 'UK') targetLangCode = 'en-GB';
    else if (criteria?.accent === 'AU') targetLangCode = 'en-AU';
    else if (criteria?.accent === 'CA') targetLangCode = 'en-CA';

    // Filter by accent first
    const accentMatches = englishVoices.filter((v) =>
      v.lang.toLowerCase().replace('_', '-').startsWith(targetLangCode.toLowerCase())
    );
    const candidatePool = accentMatches.length > 0 ? accentMatches : englishVoices;

    // Filter by gender heuristic if requested
    if (criteria?.genderHint) {
      const pattern = criteria.genderHint === 'female' ? FEMALE_NAME_PATTERN : MALE_NAME_PATTERN;
      const genderMatch = candidatePool.find((v) => pattern.test(v.name));
      if (genderMatch) return genderMatch;

      // Try across all English voices if accent didn't have requested gender
      const globalGenderMatch = englishVoices.find((v) => pattern.test(v.name));
      if (globalGenderMatch) return globalGenderMatch;
    }

    // Return default or first from pool
    return candidatePool.find((v) => v.default) || candidatePool[0] || null;
  }

  /**
   * Returns saved voiceURI from storage.
   */
  getPreferredVoiceURI(): string | null {
    try {
      if (typeof window === 'undefined') return null;
      return window.localStorage?.getItem(PREFERRED_VOICE_KEY) || null;
    } catch {
      return null;
    }
  }

  /**
   * Persists user preferred voiceURI.
   */
  setPreferredVoiceURI(voiceURI: string): void {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage?.setItem(PREFERRED_VOICE_KEY, voiceURI);
    } catch {
      // ignore storage quota error
    }
  }
}

export const voiceManager = new VoiceManager();
