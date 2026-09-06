import React, { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, Sparkles, Check, AlertCircle, Radio, RotateCcw, Keyboard } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { matchSpeechToOptions, playChime } from "../services/speechService";

interface VoiceAnswerControlProps {
  options: string[];
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  onSubmitAnswer?: () => void;
  disabled?: boolean;
  questionPrompt: string;
}

export const VoiceAnswerControl: React.FC<VoiceAnswerControlProps> = ({
  options,
  selectedOption,
  onSelectOption,
  onSubmitAnswer,
  disabled = false,
  questionPrompt,
}) => {
  const [lastMatched, setLastMatched] = useState<{
    option: string;
    label: string;
  } | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [textInputVal, setTextInputVal] = useState<string>("");
  const [showTypeMode, setShowTypeMode] = useState<boolean>(false);

  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    simulateSpeech,
  } = useSpeechRecognition({
    onSpeechResult: (text, isFinal) => {
      handleSpeechResult(text, isFinal);
    },
  });

  const handleSpeechResult = (text: string, isFinal: boolean) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Check for voice commands: "check", "submit", "clear"
    const lower = trimmed.toLowerCase();
    if (lower === "check" || lower === "submit" || lower === "check answer") {
      if (selectedOption && onSubmitAnswer && !disabled) {
        playChime("success");
        setVoiceNotice("Voice command: Submitting answer!");
        onSubmitAnswer();
        return;
      }
    }

    if (lower === "clear" || lower === "reset") {
      onSelectOption("");
      setLastMatched(null);
      setVoiceNotice("Cleared selection via voice.");
      return;
    }

    // Match with options
    const result = matchSpeechToOptions(trimmed, options);
    if (result.matchedOption) {
      onSelectOption(result.matchedOption);
      setTextInputVal(result.matchedOption);
      setLastMatched({
        option: result.matchedOption,
        label: result.confidenceLabel,
      });
      setVoiceNotice(result.confidenceLabel);

      if (isFinal) {
        playChime("match");
      }
    } else if (isFinal) {
      setVoiceNotice(`Heard "${trimmed}" (no direct option match)`);
      // Update text input value anyway so user sees what was transcribed
      setTextInputVal(trimmed);
    }
  };

  // Reset when question changes
  useEffect(() => {
    resetTranscript();
    setLastMatched(null);
    setVoiceNotice(null);
    setTextInputVal("");
  }, [questionPrompt, resetTranscript]);

  const handleMicToggle = () => {
    if (disabled) return;
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleManualTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInputVal.trim() || disabled) return;

    const result = matchSpeechToOptions(textInputVal, options);
    if (result.matchedOption) {
      onSelectOption(result.matchedOption);
      setLastMatched({
        option: result.matchedOption,
        label: "Selected via typed input",
      });
    } else {
      // Find closest or set directly
      onSelectOption(textInputVal.trim());
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-orange-50/70 to-amber-50/40 dark:from-slate-900 dark:to-slate-900/90 border border-orange-200/80 dark:border-slate-800 p-4 shadow-sm space-y-3.5 transition-all">
      {/* Top Header with Mic Button & Listening Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <button
              type="button"
              disabled={disabled}
              onClick={handleMicToggle}
              className={`relative z-10 w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                disabled
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : isListening
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-105"
                  : "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 hover:scale-105"
              }`}
              title={isListening ? "Stop listening" : "Click to speak your answer"}
            >
              {isListening ? (
                <Mic className="w-5 h-5 animate-pulse" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            {/* Pulsing ring when active */}
            {isListening && (
              <span className="absolute -inset-1 rounded-2xl bg-rose-500/30 animate-ping pointer-events-none" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                {isListening ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-rose-600 dark:text-rose-400">Listening... Speak now</span>
                  </>
                ) : (
                  <span>Voice Answer Mode</span>
                )}
              </span>
              <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                Speech-to-Text
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {isListening
                ? "Say option letter (e.g., 'Option A'), words, or numbers"
                : "Click microphone or speak to select your answer hands-free"}
            </p>
          </div>
        </div>

        {/* Action Toggle (Type instead / quick voice test) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowTypeMode(!showTypeMode)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold transition-colors"
          >
            <Keyboard className="w-3.5 h-3.5 text-orange-500" />
            <span>{showTypeMode ? "Hide Input" : "Type/Dictate"}</span>
          </button>
        </div>
      </div>

      {/* Real-time speech transcript & Equalizer Wave */}
      {(isListening || transcript || interimTranscript) && (
        <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {isListening ? (
              <div className="flex items-center gap-0.5 shrink-0 px-1 py-0.5">
                <span className="w-1 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-5 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-2 bg-rose-500 rounded-full animate-bounce" />
                <span className="w-1 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.2s]" />
              </div>
            ) : (
              <Volume2 className="w-4 h-4 text-orange-500 shrink-0" />
            )}

            <div className="truncate">
              <span className="text-slate-400 font-semibold mr-1.5">Heard:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                "{interimTranscript || transcript || "..."}"
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={resetTranscript}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[11px] font-semibold flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      )}

      {/* Matched Pill Notification */}
      {lastMatched && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-bold animate-in fade-in">
          <div className="flex items-center gap-2 truncate">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              Selected: <span className="underline">{lastMatched.option}</span>
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium shrink-0 ml-2">
            {lastMatched.label}
          </span>
        </div>
      )}

      {/* Notice / Error Feedback */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Type / Dictate Input Bar (Optional expansion) */}
      {showTypeMode && (
        <form onSubmit={handleManualTextSubmit} className="flex gap-2 pt-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={textInputVal}
              onChange={(e) => setTextInputVal(e.target.value)}
              placeholder="Speak or type answer here..."
              disabled={disabled}
              className="w-full pl-3 pr-8 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
            {isListening && (
              <span className="absolute right-2.5 top-2.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </div>
          <button
            type="submit"
            disabled={disabled || !textInputVal.trim()}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-sm transition-all disabled:opacity-50"
          >
            Select
          </button>
        </form>
      )}

      {/* Quick Spoken-Choice Emulators (helpful for rapid hands-free testing or when mic is muted) */}
      <div className="pt-1 border-t border-orange-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5">
          <span>Voice Test Chips (Click to simulate speaking):</span>
          <span>Voice Commands: "Submit" / "Clear"</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => simulateSpeech(`Option ${letter}: ${opt}`)}
                className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/60 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1 shadow-xs hover:border-orange-300"
                title={`Simulate speaking "Option ${letter}"`}
              >
                <Mic className="w-2.5 h-2.5 text-orange-500" />
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {letter}:
                </span>
                <span className="truncate max-w-[120px]">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
