/**
 * audioVoiceService.ts
 * Comprehensive audio and voice synthesis engine for Faris and Noura personas.
 * Features:
 * 1. High-fidelity pre-recorded native Arabic audio for greetings & transitions.
 * 2. Harmonic crystalline/warm chimes via Web Audio API.
 * 3. Robust Web Speech API fallback with Chromium keep-alive heartbeat & GC prevention.
 */

export type AssistantPersona = 'faris' | 'noura';

// Audio assets map
const AUDIO_ASSETS: Record<string, string> = {
  'noura_intro': '/audio/noura_landing_intro.mp3',
  'faris_intro': '/audio/faris_landing_intro.mp3',
  'noura_switch': '/audio/noura_switch.mp3',
  'faris_switch': '/audio/faris_switch.mp3',
  'noura_shelter': '/audio/noura_shelter_intro.mp3',
};

// Global audio state
let currentHtmlAudio: HTMLAudioElement | null = null;
let speechKeepAliveTimer: any = null;

/**
 * Play a signature harmonic chime using the Web Audio API.
 * - Noura: Elegant crystalline bell chord (E5 + A5)
 * - Faris: Warm executive resonant chord (C4 + G4)
 */
export function playPersonaChime(persona: AssistantPersona) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    if (persona === 'noura') {
      // Shimmering feminine bell chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc2.frequency.setValueAtTime(880.0, now);  // A5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.46);
      osc2.stop(now + 0.46);
    } else {
      // Warm executive two-tone chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(261.63, now); // C4
      osc2.frequency.setValueAtTime(392.00, now); // G4

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.46);
      osc2.stop(now + 0.46);
    }

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 600);
  } catch (err) {
    console.debug('Web Audio chime could not play:', err);
  }
}

/**
 * Stop any active audio playback (HTML5 Audio and Web Speech)
 */
export function stopAllAudio() {
  if (currentHtmlAudio) {
    try {
      currentHtmlAudio.pause();
      currentHtmlAudio.currentTime = 0;
    } catch {}
    currentHtmlAudio = null;
  }

  if (speechKeepAliveTimer) {
    clearInterval(speechKeepAliveTimer);
    speechKeepAliveTimer = null;
  }

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Play pre-recorded high fidelity MP3 audio for Faris or Noura
 */
export function playPreRecordedAudio(
  key: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (e: any) => void;
  }
): boolean {
  const url = AUDIO_ASSETS[key];
  if (!url) return false;

  stopAllAudio();

  try {
    const audio = new Audio(url);
    currentHtmlAudio = audio;

    audio.onplay = () => {
      callbacks?.onStart?.();
    };

    audio.onended = () => {
      currentHtmlAudio = null;
      callbacks?.onEnd?.();
    };

    audio.onerror = (e) => {
      console.warn('Audio asset error:', e);
      currentHtmlAudio = null;
      callbacks?.onError?.(e);
      callbacks?.onEnd?.();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio play() rejected:', err);
        currentHtmlAudio = null;
        callbacks?.onError?.(err);
        callbacks?.onEnd?.();
      });
    }
    return true;
  } catch (e) {
    console.warn('HTML Audio instantiation error:', e);
    callbacks?.onError?.(e);
    callbacks?.onEnd?.();
    return false;
  }
}

/**
 * Synthesize speech dynamically using Web Speech API with Chromium SAPI fixes.
 */
export function speakDynamicSpeech(
  text: string,
  persona: AssistantPersona,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
) {
  if (!('speechSynthesis' in window)) {
    callbacks?.onEnd?.();
    return;
  }

  stopAllAudio();

  // Strip markdown, asterisks, bullet points, brackets
  const cleanText = text
    .replace(/[*_#`~]/g, '')
    .replace(/•/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/[\n\r]+/g, ' ')
    .replace(/\+/g, ' زائد ')
    .trim();

  if (!cleanText) {
    callbacks?.onEnd?.();
    return;
  }

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';

    const voices = window.speechSynthesis.getVoices();
    const arabicVoices = voices.filter(v =>
      v.lang && (v.lang.toLowerCase().startsWith('ar') || v.lang.toLowerCase().includes('arabic'))
    );

    if (persona === 'noura') {
      // Look for real female voices
      const femaleVoice = arabicVoices.find(v => {
        const n = (v.name || '').toLowerCase();
        return (
          n.includes('female') || n.includes('woman') ||
          n.includes('salma') || n.includes('zariyah') ||
          n.includes('laila') || n.includes('layla') ||
          n.includes('fatima') || n.includes('zeina') ||
          n.includes('hoda') || n.includes('mariam') ||
          n.includes('maryam') || n.includes('sana') ||
          n.includes('nour') || n.includes('noura') ||
          n.includes('hala') || n.includes('rana') ||
          n.includes('amira') || n.includes('yasmin')
        );
      }) || (arabicVoices.length > 1 ? arabicVoices[1] : arabicVoices[0]);

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      // Keep pitch in stable range to prevent Windows SAPI freeze
      utterance.pitch = femaleVoice && femaleVoice.name.toLowerCase().includes('naayf') ? 1.12 : 1.05;
      utterance.rate = 1.02;
    } else {
      const maleVoice = arabicVoices.find(v => {
        const n = (v.name || '').toLowerCase();
        return (
          n.includes('male') || n.includes('man') ||
          n.includes('maged') || n.includes('naayf') ||
          n.includes('hamed') || n.includes('tarik') ||
          n.includes('tariq') || n.includes('shakir') ||
          n.includes('ahmed') || n.includes('omar')
        );
      }) || arabicVoices[0];

      if (maleVoice) {
        utterance.voice = maleVoice;
      }
      utterance.pitch = 0.96;
      utterance.rate = 0.98;
    }

    let finished = false;
    const cleanup = () => {
      if (finished) return;
      finished = true;
      if (speechKeepAliveTimer) {
        clearInterval(speechKeepAliveTimer);
        speechKeepAliveTimer = null;
      }
      callbacks?.onEnd?.();
    };

    utterance.onstart = () => {
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      cleanup();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      cleanup();
      callbacks?.onError?.(e);
    };

    // Keep global reference on window to prevent Chromium V8 garbage collection mid-speech
    (window as any).__activeSpeechUtterance = utterance;

    // Small delay for browser audio subsystem after cancel()
    setTimeout(() => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);

        // Chromium SAPI heartbeat keep-alive to avoid speech freezing on Windows
        speechKeepAliveTimer = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(speechKeepAliveTimer);
            speechKeepAliveTimer = null;
          } else {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 500);
      } catch (err) {
        console.warn('SpeechSynthesis speak call error:', err);
        cleanup();
      }
    }, 50);

  } catch (err) {
    console.warn('Speech synthesis setup failed:', err);
    callbacks?.onEnd?.();
  }
}

/**
 * High level function to play Persona Introduction (Landing Page / Hero)
 */
export function playPersonaIntroGreeting(
  persona: AssistantPersona,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
  }
) {
  playPersonaChime(persona);
  const audioKey = `${persona}_intro`;
  const played = playPreRecordedAudio(audioKey, {
    onStart: callbacks?.onStart,
    onEnd: callbacks?.onEnd,
    onError: () => {
      // Fallback to dynamic speech synthesis if audio file fails
      const fallbackText = persona === 'noura'
        ? 'أهلاً بكم في مجموعة خالد السليم! أنا نُورة، مرشدتكم الرقمية الذكية. يسعدني مرافقتكم وتوجيهكم للأقسام النسائية ومراكز الإيواء والتسكين وكافة أنظمة شركات المجموعة.'
        : 'أهلاً بكم في مجموعة خالد السليم! أنا فارس، مرشدكم الرقمي الذكي. يسعدني مرافقتكم وتوجيهكم للدخول إلى أنظمة شركات المجموعة أو الإجابة عن أي استفسار.';
      speakDynamicSpeech(fallbackText, persona, callbacks);
    }
  });

  if (!played) {
    const fallbackText = persona === 'noura'
      ? 'أهلاً بكم في مجموعة خالد السليم! أنا نُورة، مرشدتكم الرقمية الذكية.'
      : 'أهلاً بكم في مجموعة خالد السليم! أنا فارس، مرشدكم الرقمي الذكي.';
    speakDynamicSpeech(fallbackText, persona, callbacks);
  }
}

/**
 * High level function to play Persona Switch greeting
 */
export function playPersonaSwitchGreeting(
  persona: AssistantPersona,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
  }
) {
  playPersonaChime(persona);
  const audioKey = `${persona}_switch`;
  const played = playPreRecordedAudio(audioKey, {
    onStart: callbacks?.onStart,
    onEnd: callbacks?.onEnd,
    onError: () => {
      const fallbackText = persona === 'noura'
        ? 'مرحباً بكِ، أنا نُورة معكِ الآن، يسعدني خدمتكِ وتوجيهكِ في المنظومة.'
        : 'أهلاً بك، أنا فارس جاهز لمساعدتك في كل ما تحتاج.';
      speakDynamicSpeech(fallbackText, persona, callbacks);
    }
  });

  if (!played) {
    const fallbackText = persona === 'noura'
      ? 'مرحباً بكِ، أنا نُورة معكِ الآن.'
      : 'أهلاً بك، أنا فارس جاهز لمساعدتك.';
    speakDynamicSpeech(fallbackText, persona, callbacks);
  }
}
