// Speech recognition utility & intelligent option matching for interactive lesson questions

export interface MatchResult {
  matchedOption: string | null;
  matchType: "letter" | "exact" | "content" | "number" | "boolean" | "none";
  confidenceLabel: string;
}

// Convert common spoken number words into digits
const NUMBER_WORDS: Record<string, string> = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  ten: "10",
  eleven: "11",
  twelve: "12",
  thirteen: "13",
  fourteen: "14",
  fifteen: "15",
  sixteen: "16",
  seventeen: "17",
  eighteen: "18",
  nineteen: "19",
  twenty: "20",
  thirty: "30",
  forty: "40",
  fifty: "50",
  sixty: "60",
  seventy: "70",
  eighty: "80",
  ninety: "90",
  hundred: "100",
};

/**
 * Normalizes text by trimming, lowercasing, and stripping punctuation
 */
export function normalizeSpeech(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Converts speech containing number words into digit equivalents
 */
export function normalizeNumbersInSpeech(text: string): string {
  const words = text.toLowerCase().split(/\s+/);
  const converted = words.map((w) => NUMBER_WORDS[w] || w);
  return converted.join(" ");
}

/**
 * Intelligent matcher that matches spoken speech to one of the question options
 */
export function matchSpeechToOptions(
  transcript: string,
  options: string[]
): MatchResult {
  if (!transcript || !options || options.length === 0) {
    return { matchedOption: null, matchType: "none", confidenceLabel: "" };
  }

  const clean = normalizeSpeech(transcript);
  const cleanWithDigits = normalizeNumbersInSpeech(clean);

  // 1. Check for explicit letter cues: "option A", "choice B", "letter C", "answer D", or isolated letters
  const letterPatterns = [
    { regex: /\b(?:option|choice|letter|answer)\s+([a-d])\b/i, group: 1 },
    { regex: /\b^([a-d])$$i/, group: 1 },
    { regex: /\b(?:the\s+)?(first|second|third|fourth)\s+(?:option|choice|answer|one)\b/i, group: 1 },
  ];

  for (const pattern of letterPatterns) {
    const match = clean.match(pattern.regex);
    if (match) {
      let index = -1;
      const val = match[pattern.group].toLowerCase();
      if (val === "a" || val === "first") index = 0;
      else if (val === "b" || val === "second") index = 1;
      else if (val === "c" || val === "third") index = 2;
      else if (val === "d" || val === "fourth") index = 3;

      if (index >= 0 && index < options.length) {
        return {
          matchedOption: options[index],
          matchType: "letter",
          confidenceLabel: `Matched via "${match[0]}"`,
        };
      }
    }
  }

  // 2. Check for numeric choice cues: "option 1", "number 2", "1st option"
  const numberChoiceMatch = cleanWithDigits.match(
    /\b(?:option|number|choice)\s+([1-4])\b/i
  );
  if (numberChoiceMatch) {
    const idx = parseInt(numberChoiceMatch[1], 10) - 1;
    if (idx >= 0 && idx < options.length) {
      return {
        matchedOption: options[idx],
        matchType: "number",
        confidenceLabel: `Selected Option #${idx + 1}`,
      };
    }
  }

  // 3. Check for boolean cues (True / False / Yes / No)
  const isTrueSpoken = /\b(true|yes|correct|truth)\b/i.test(clean);
  const isFalseSpoken = /\b(false|no|incorrect|wrong|untrue)\b/i.test(clean);

  if (isTrueSpoken || isFalseSpoken) {
    for (const opt of options) {
      const normOpt = opt.toLowerCase();
      if (isTrueSpoken && (normOpt === "true" || normOpt === "yes")) {
        return {
          matchedOption: opt,
          matchType: "boolean",
          confidenceLabel: "Matched 'True'",
        };
      }
      if (isFalseSpoken && (normOpt === "false" || normOpt === "no")) {
        return {
          matchedOption: opt,
          matchType: "boolean",
          confidenceLabel: "Matched 'False'",
        };
      }
    }
  }

  // 4. Check for direct exact match (normalized)
  for (const opt of options) {
    const normOpt = normalizeSpeech(opt);
    const normOptDigits = normalizeNumbersInSpeech(normOpt);
    if (clean === normOpt || cleanWithDigits === normOptDigits) {
      return {
        matchedOption: opt,
        matchType: "exact",
        confidenceLabel: "Exact speech match",
      };
    }
  }

  // 5. Check if transcript contains the entire option or option contains transcript
  for (const opt of options) {
    const normOpt = normalizeSpeech(opt);
    const normOptDigits = normalizeNumbersInSpeech(normOpt);

    if (normOpt.length >= 2 && clean.includes(normOpt)) {
      return {
        matchedOption: opt,
        matchType: "content",
        confidenceLabel: `Heard "${opt}" in speech`,
      };
    }

    if (normOptDigits.length >= 1 && cleanWithDigits.includes(normOptDigits)) {
      return {
        matchedOption: opt,
        matchType: "content",
        confidenceLabel: `Heard "${opt}" in speech`,
      };
    }

    if (clean.length >= 3 && normOpt.includes(clean)) {
      return {
        matchedOption: opt,
        matchType: "content",
        confidenceLabel: `Matched "${opt}"`,
      };
    }
  }

  // 6. Keyword overlap scoring
  let bestOption: string | null = null;
  let highestScore = 0;

  const speechWords = new Set(cleanWithDigits.split(/\s+/).filter((w) => w.length > 2));

  for (const opt of options) {
    const optWords = normalizeNumbersInSpeech(normalizeSpeech(opt))
      .split(/\s+/)
      .filter((w) => w.length > 2);

    let matches = 0;
    for (const w of optWords) {
      if (speechWords.has(w)) {
        matches++;
      }
    }

    const score = optWords.length > 0 ? matches / optWords.length : 0;
    if (score > highestScore && score >= 0.5) {
      highestScore = score;
      bestOption = opt;
    }
  }

  if (bestOption) {
    return {
      matchedOption: bestOption,
      matchType: "content",
      confidenceLabel: `Best keyword match: "${bestOption}"`,
    };
  }

  return { matchedOption: null, matchType: "none", confidenceLabel: "" };
}

/**
 * Play a pleasant browser audio chime feedback on successful match or action
 */
export function playChime(type: "match" | "listening" | "success") {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "match") {
      // Ascending two-tone chime
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === "listening") {
      // Soft single ping
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, now); // E5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "success") {
      // Victory triad
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch {
    // Ignore audio context autoplay restrictions
  }
}
