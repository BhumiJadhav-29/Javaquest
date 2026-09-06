import { useState, useEffect, useRef, useCallback } from "react";
import { playChime } from "../services/speechService";

// Declare interface for window.SpeechRecognition / webkitSpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export interface UseSpeechRecognitionResult {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  simulateSpeech: (text: string) => void;
}

export function useSpeechRecognition(options?: {
  onSpeechResult?: (finalText: string, isFinal: boolean) => void;
  lang?: string;
}): UseSpeechRecognitionResult {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isSupported =
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const onSpeechResultRef = useRef(options?.onSpeechResult);
  useEffect(() => {
    onSpeechResultRef.current = options?.onSpeechResult;
  }, [options?.onSpeechResult]);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = options?.lang || "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        playChime("listening");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        if (event.error === "no-speech") {
          setError("No speech was detected. Please try speaking again.");
        } else if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setError("Microphone access was denied or blocked. Please allow mic permissions in your browser.");
        } else if (event.error === "network") {
          setError("Network issue detected during speech recognition.");
        } else {
          setError(`Speech recognition notice: ${event.error}`);
        }
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentInterim = "";
        let currentFinal = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const text = res[0].transcript;
          if (res.isFinal) {
            currentFinal += text;
          } else {
            currentInterim += text;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
          if (onSpeechResultRef.current) {
            onSpeechResultRef.current(currentInterim, false);
          }
        }

        if (currentFinal) {
          setTranscript(currentFinal);
          setInterimTranscript("");
          if (onSpeechResultRef.current) {
            onSpeechResultRef.current(currentFinal, true);
          }
        }
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn("SpeechRecognition initialization failed:", err);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [isSupported, options?.lang]);

  const startListening = useCallback(() => {
    setError(null);
    setTranscript("");
    setInterimTranscript("");

    if (!recognitionRef.current) {
      if (!isSupported) {
        setError("Web Speech API is not supported in this browser. You can use speech simulation buttons below!");
      }
      return;
    }

    try {
      recognitionRef.current.start();
    } catch {
      // If already started or aborting
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current?.start();
        }, 150);
      } catch (startErr) {
        console.warn("Could not start speech recognition:", startErr);
      }
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setError(null);
  }, []);

  const simulateSpeech = useCallback((text: string) => {
    setError(null);
    setInterimTranscript("");
    setTranscript(text);
    if (onSpeechResultRef.current) {
      onSpeechResultRef.current(text, true);
    }
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    simulateSpeech,
  };
}
