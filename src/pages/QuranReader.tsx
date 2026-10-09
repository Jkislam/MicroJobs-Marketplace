import React, { useEffect, useState, useRef } from "react";
import "./QuranReader.css";
import { PageType } from "../types";

const API = "https://api.alquran.cloud/v1";
const REWARD_INTERVAL_SECONDS = 600; // 10 minutes = 600 seconds
const COINS_PER_REWARD = 10;

interface SurahItem {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface AyahData {
  number: number;
  text: string;
  numberInSurah: number;
  audio?: string;
}

interface QuranReaderProps {
  onNavigate?: (page: PageType) => void;
  onAddCoins?: (coins: number) => void;
}

export default function QuranReader({ onNavigate, onAddCoins }: QuranReaderProps) {
  const [surahs, setSurahs] = useState<SurahItem[]>([]);
  const [surahNumber, setSurahNumber] = useState<number>(1);
  const [arabicAyahs, setArabicAyahs] = useState<AyahData[]>([]);
  const [banglaAyahs, setBanglaAyahs] = useState<AyahData[]>([]);
  const [audioAyahs, setAudioAyahs] = useState<AyahData[]>([]);
  const [search, setSearch] = useState("");
  const [fontSize, setFontSize] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTranslation, setShowTranslation] = useState(true);

  // Timer & Coins State (10 mins = 10 coins)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    const saved = localStorage.getItem("microjobs_quran_timer_elapsed");
    const num = saved ? parseInt(saved, 10) : 0;
    return isNaN(num) || num < 0 ? 0 : Math.min(num, REWARD_INTERVAL_SECONDS);
  });

  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem("microjobs_quran_coins");
    const num = saved ? parseInt(saved, 10) : 0;
    return isNaN(num) || num < 0 ? 0 : num;
  });

  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [rewardNotice, setRewardNotice] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Soft Islamic pleasant chime sound using Web Audio API
  const playRewardChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + idx * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.5);
      });
    } catch {
      // Audio playback fallback if not permitted
    }
  };

  // Timer interval effect: runs every second
  useEffect(() => {
    if (!isTimerRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        // If 10 minutes already reached, stay at 600 until user claims
        if (prev >= REWARD_INTERVAL_SECONDS) {
          return REWARD_INTERVAL_SECONDS;
        }

        const next = prev + 1;
        if (next >= REWARD_INTERVAL_SECONDS) {
          // Exactly reached 10 minutes (600s)! Unlocks the Claim button!
          localStorage.setItem("microjobs_quran_timer_elapsed", String(REWARD_INTERVAL_SECONDS));
          playRewardChime();
          setRewardNotice("🎉 মাশাআল্লাহ! আপনার ১০ মিনিট অধ্যয়ন সম্পন্ন হয়েছে! এখন 'ক্লেইম করুন (Claim)' বাটনে ক্লিক করে ১০টি কয়েন গ্রহণ করুন।");
          return REWARD_INTERVAL_SECONDS;
        }
        localStorage.setItem("microjobs_quran_timer_elapsed", String(next));
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Can only claim once 10 minutes (600 seconds) are complete!
  const canClaim = elapsedSeconds >= REWARD_INTERVAL_SECONDS;

  // Claim handler: strictly checks that 10 minutes are finished
  const handleClaimReward = () => {
    if (!canClaim) {
      const remainingSecs = Math.max(0, REWARD_INTERVAL_SECONDS - elapsedSeconds);
      const remMins = Math.floor(remainingSecs / 60);
      const remSecs = remainingSecs % 60;
      setRewardNotice(`⚠️ ১০ মিনিট শেষ না হওয়া পর্যন্ত কয়েন ক্লেইম করা যাবে না! আরও ${toBanglaNumber(remMins)} মিনিট ${toBanglaNumber(remSecs)} সেকেন্ড অপেক্ষা করুন।`);
      setTimeout(() => setRewardNotice(null), 4000);
      return;
    }

    // Award 10 coins
    setCoins((currCoins) => {
      const updatedCoins = currCoins + COINS_PER_REWARD;
      localStorage.setItem("microjobs_quran_coins", String(updatedCoins));
      return updatedCoins;
    });

    // Reset timer back to 0 for next 10-minute cycle
    setElapsedSeconds(0);
    localStorage.setItem("microjobs_quran_timer_elapsed", "0");

    // Celebration & sound
    setShowCelebration(true);
    playRewardChime();
    setRewardNotice(`মাশাআল্লাহ! আপনি সফলভাবে ১০টি কয়েন ক্লেইম করেছেন! (+${COINS_PER_REWARD} Coins)`);
    setTimeout(() => setRewardNotice(null), 6000);

    if (onAddCoins) {
      onAddCoins(COINS_PER_REWARD);
    }
  };

  const remainingSeconds = Math.max(0, REWARD_INTERVAL_SECONDS - elapsedSeconds);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedCountdown = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / REWARD_INTERVAL_SECONDS) * 100));

  // Convert numbers to Bengali digits for Bengali UI
  const toBanglaNumber = (num: number | string) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(num).replace(/[0-9]/g, (d) => banglaDigits[parseInt(d, 10)]);
  };

  useEffect(() => {
    async function loadSurahs() {
      try {
        const response = await fetch(`${API}/surah`);
        if (!response.ok) throw new Error("সূরার তালিকা পাওয়া যায়নি");

        const result = await response.json();
        setSurahs(result.data || []);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "সূরার তালিকা লোড করা যায়নি।";
        setError(message);
      }
    }

    loadSurahs();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSurah() {
      setLoading(true);
      setError("");
      setArabicAyahs([]);
      setBanglaAyahs([]);
      setAudioAyahs([]);

      try {
        const endpoints = [
          `${API}/surah/${surahNumber}/quran-uthmani`,
          `${API}/surah/${surahNumber}/bn.bengali`,
          `${API}/surah/${surahNumber}/ar.alafasy`,
        ];

        const responses = await Promise.all(
          endpoints.map((url) => fetch(url))
        );

        if (responses.some((response) => !response.ok)) {
          throw new Error(
            "কোরআনের ডেটা লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।"
          );
        }

        const [arabicResult, banglaResult, audioResult] =
          await Promise.all(responses.map((response) => response.json()));

        if (
          arabicResult.code !== 200 ||
          banglaResult.code !== 200 ||
          audioResult.code !== 200
        ) {
          throw new Error("API থেকে সঠিক ডেটা পাওয়া যায়নি।");
        }

        if (cancelled) return;

        setArabicAyahs(arabicResult.data.ayahs || []);
        setBanglaAyahs(banglaResult.data.ayahs || []);
        setAudioAyahs(audioResult.data.ayahs || []);
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।";
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSurah();

    return () => {
      cancelled = true;
    };
  }, [surahNumber]);

  const selectedSurah = surahs.find(
    (surah) => surah.number === surahNumber
  );

  const filteredSurahs = surahs.filter((surah) => {
    const query = search.trim().toLowerCase();

    return (
      !query ||
      surah.name.includes(query) ||
      surah.englishName.toLowerCase().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      String(surah.number) === query
    );
  });

  return (
    <main className="quran-page">
      {/* Top Navigation Bar / Breadcrumb */}
      {onNavigate && (
        <div className="bg-white border-b border-slate-100 py-3 mb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <button
              onClick={() => onNavigate("find-jobs")}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>ক্যাটাগরি তালিকায় ফিরে যান (Back to Marketplace)</span>
            </button>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              <span>পবিত্র আল কোরআনুল কারীম</span>
            </div>
          </div>
        </div>
      )}


      <div className="quran-container">
        <header className="quran-hero">
          <div className="quran-symbol" aria-hidden="true">
            ﷽
          </div>

          <p className="quran-eyebrow">আল-কোরআনুল কারীম</p>
          <h1>পবিত্র কোরআন শরিফ</h1>
          <p className="quran-subtitle">
            পড়ুন, বাংলা অর্থ বুঝুন এবং তিলাওয়াত শুনুন
          </p>
        </header>

        {/* ============================================================== */}
        {/* REWARD TIMER CARD (প্রতি ১০ মিনিটে ১০টি কয়েন)                   */}
        {/* ============================================================== */}
        <section className="quran-timer-card" aria-label="কোরআন অধ্যয়ন টাইমার ও কয়েন রিওয়ার্ড">
          <div className="quran-timer-card-inner">
            <div className="quran-timer-header">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">timer</span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>কোরআন অধ্যয়ন টাইমার</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 text-[11px] font-black tracking-wide border border-emerald-200">
                      ১০ মিনিটে ১০ কয়েন
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    মনোযোগ দিয়ে কোরআন তিলাওয়াত ও স্টাডি করুন। প্রতি ১০ মিনিটে আপনার একাউন্টে ১০টি কয়েন জমা হবে।
                  </p>
                </div>
              </div>

              {/* Status pill */}
              <div className="flex items-center gap-2">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
                  isTimerRunning
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isTimerRunning ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                  <span>{isTimerRunning ? "টাইমার সচল" : "বিরতিতে আছে"}</span>
                </div>
              </div>
            </div>

            {/* Countdown and Progress */}
            <div className="quran-timer-body">
              <div className="quran-countdown-box">
                <div className="quran-countdown-digits">
                  <span className="font-mono">{canClaim ? "০০:০০" : formattedCountdown}</span>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-700">
                    {canClaim ? "🎉 ১০ মিনিট অধ্যয়ন সম্পন্ন হয়েছে!" : "পরবর্তী রিওয়ার্ড ক্লেইম করতে বাকি সময়"}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    {canClaim ? (
                      <span className="text-amber-800 font-black">
                        মাশাআল্লাহ! নিচের 'ক্লেইম করুন' বাটনে ক্লিক করে ১০টি কয়েন অ্যাকাউন্টে নিন।
                      </span>
                    ) : (
                      <span>
                        আর মাত্র {toBanglaNumber(minutes)} মিনিট {toBanglaNumber(seconds)} সেকেন্ড পর ক্লেইম করতে পারবেন (+১০ কয়েন)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Coins Balance Box */}
              <div className="quran-coins-box">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">মোট অর্জিত কয়েন</div>
                    <div className="text-2xl font-black text-amber-950 flex items-center gap-1.5 font-numeric-stat">
                      <span className="text-2xl animate-bounce">🪙</span>
                      <span>{toBanglaNumber(coins)}</span>
                      <span className="text-xs font-bold text-amber-700">কয়েন</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                      canClaim
                        ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                        : "bg-white/80 text-emerald-800 border-amber-200"
                    }`}>
                      {canClaim ? "🎁 ক্লেইম করার জন্য প্রস্তুত!" : "১০ মিনিট পর ক্লেইমযোগ্য"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="quran-timer-progress-wrapper">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-1">
                <span>
                  ১০ মিনিট প্রগ্রেস: {canClaim ? "১০০% (সম্পূর্ণ)" : `${toBanglaNumber(progressPercent)}%`}
                </span>
                <span>
                  {canClaim ? "১০ মিনিট সম্পূর্ণ" : `${toBanglaNumber(Math.floor(elapsedSeconds / 60))} মিনিট ${toBanglaNumber(elapsedSeconds % 60)} সে / ১০ মিনিট`}
                </span>
              </div>
              <div className="quran-progress-bar-track">
                <div
                  className="quran-progress-bar-fill"
                  style={{ width: `${canClaim ? 100 : progressPercent}%` }}
                />
              </div>
            </div>

            {/* Timer Actions */}
            <div className="quran-timer-actions">
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  isTimerRunning
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isTimerRunning ? "pause" : "play_arrow"}
                </span>
                <span>{isTimerRunning ? "টাইমার পজ করুন" : "টাইমার চালু করুন"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setElapsedSeconds(0);
                  localStorage.setItem("microjobs_quran_timer_elapsed", "0");
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="চলতি ১০ মিনিটের টাইমার শুরু থেকে রিসেট করুন"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>রিসেট</span>
              </button>

              {/* Claim Button: disabled if 10 minutes not completed */}
              <button
                type="button"
                onClick={handleClaimReward}
                disabled={!canClaim}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ml-auto ${
                  canClaim
                    ? "bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-slate-950 shadow-lg shadow-amber-500/30 scale-105 animate-pulse cursor-pointer ring-2 ring-amber-400/50"
                    : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-75"
                }`}
                title={
                  canClaim
                    ? "মাশাআল্লাহ! ১০ মিনিট সম্পন্ন হয়েছে, এখনই ১০ কয়েন ক্লেইম করুন!"
                    : `১০ মিনিট শেষ না হওয়া পর্যন্ত ক্লেইম করা যাবে না (বাকি: ${formattedCountdown})`
                }
              >
                <span className="material-symbols-outlined text-[18px]">
                  {canClaim ? "stars" : "lock"}
                </span>
                <span>
                  {canClaim ? "🎁 ১০ কয়েন ক্লেইম করুন (Claim)" : `🔒 ক্লেইম (বাকি ${formattedCountdown})`}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Live Reward Notification Banner */}
        {rewardNotice && (
          <div className="quran-reward-toast animate-in fade-in slide-in-from-top-3 duration-200" role="alert">
            <span className="text-xl">🎉</span>
            <span className="text-xs font-bold">{rewardNotice}</span>
          </div>
        )}

        <section className="quran-controls" aria-label="কোরআন পড়ার সেটিংস">
          <label className="quran-field">
            <span>সূরা নির্বাচন করুন</span>

            <select
              value={surahNumber}
              onChange={(event) =>
                setSurahNumber(Number(event.target.value))
              }
            >
              {surahs.map((surah) => (
                <option key={surah.number} value={surah.number}>
                  {surah.number}. {surah.englishName} — {surah.name}
                </option>
              ))}
            </select>
          </label>

          <label className="quran-field">
            <span>সূরা খুঁজুন</span>

            <input
              type="search"
              placeholder="সূরার নাম বা নম্বর..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <div className="quran-font-controls">
            <span>আরবি ফন্ট সাইজ</span>

            <div>
              <button
                type="button"
                aria-label="আরবি লেখা ছোট করুন"
                onClick={() => setFontSize((size) => Math.max(22, size - 2))}
              >
                A−
              </button>

              <button
                type="button"
                aria-label="আরবি লেখা বড় করুন"
                onClick={() => setFontSize((size) => Math.min(48, size + 2))}
              >
                A+
              </button>
            </div>
          </div>

          <button
            type="button"
            className="quran-translation-toggle"
            onClick={() => setShowTranslation((value) => !value)}
          >
            {showTranslation ? "অনুবাদ লুকান" : "অনুবাদ দেখুন"}
          </button>
        </section>

        {search.trim() && (
          <section className="quran-search-results">
            <h2>সূরার ফলাফল</h2>

            {filteredSurahs.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">কোনো সূরা পাওয়া যায়নি।</p>
            ) : (
              <div className="quran-surah-results">
                {filteredSurahs.map((surah) => (
                  <button
                    type="button"
                    key={surah.number}
                    onClick={() => {
                      setSurahNumber(surah.number);
                      setSearch("");
                    }}
                  >
                    <span>{surah.number}. {surah.englishName}</span>
                    <span lang="ar" dir="rtl">{surah.name}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {selectedSurah && (
          <section className="quran-surah-heading">
            <p>সূরা {selectedSurah.number}</p>
            <h2 lang="ar" dir="rtl">{selectedSurah.name}</h2>
            <h3>{selectedSurah.englishName}</h3>
            <p>
              {selectedSurah.englishNameTranslation} ·{" "}
              {selectedSurah.numberOfAyahs} আয়াত
            </p>
            <span>
              {selectedSurah.revelationType === "Meccan"
                ? "মাক্কী সূরা"
                : "মাদানী সূরা"}
            </span>
          </section>
        )}

        {loading && (
          <div className="quran-message" role="status">
            কোরআনের আয়াত লোড হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।
          </div>
        )}

        {!loading && error && (
          <div className="quran-error" role="alert">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setSurahNumber((number) => number)}
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {!loading && !error && arabicAyahs.length > 0 && (
          <section className="quran-verses" aria-label="কোরআনের আয়াত">
            {arabicAyahs.map((ayah, index) => {
              const translation = banglaAyahs[index];
              const audio = audioAyahs[index];

              return (
                <article
                  className="quran-verse"
                  key={`${surahNumber}-${ayah.numberInSurah}`}
                >
                  <div className="quran-verse-top">
                    <span className="quran-ayah-number">
                      আয়াত {ayah.numberInSurah}
                    </span>

                    <span className="quran-ayah-reference">
                      {selectedSurah?.englishName} : {ayah.numberInSurah}
                    </span>
                  </div>

                  <p
                    className="quran-arabic-text"
                    lang="ar"
                    dir="rtl"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {ayah.text}
                  </p>

                  {showTranslation && translation && (
                    <div className="quran-bangla-text">
                      <span className="quran-translation-label">
                        বাংলা অর্থ:
                      </span>
                      <p>{translation.text}</p>
                    </div>
                  )}

                  {audio?.audio && (
                    <div className="quran-audio-player">
                      <audio controls preload="none">
                        <source src={audio.audio} type="audio/mpeg" />
                        আপনার ব্রাউজারে অডিও প্লেয়ারটি সাপোর্ট করছে না।
                      </audio>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>

      {/* ============================================================== */}
      {/* 10-MINUTE REWARD CELEBRATION MODAL                             */}
      {/* ============================================================== */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-emerald-100 relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Top decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500" />

            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 shadow-inner ring-4 ring-emerald-50">
              <span className="text-3xl">🕌</span>
            </div>

            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              মাশাআল্লাহ • আলহামদুলিল্লাহ
            </span>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-3 mb-1">
              ১০টি কয়েন ক্লেইম সফল!
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto mb-5">
              মাশাআল্লাহ! আপনি সফলভাবে ১০ মিনিট পবিত্র কোরআন অধ্যয়ন সম্পন্ন করে ১০টি কয়েন ক্লেইম করেছেন।
            </p>

            {/* Glowing Coin Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-amber-200/80 mb-6 flex items-center justify-center gap-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-2xl shadow-md animate-bounce">
                🪙
              </div>
              <div className="text-left">
                <div className="text-xl font-black text-amber-950">
                  +{toBanglaNumber(COINS_PER_REWARD)} টি কয়েন ক্লেইম সম্পন্ন!
                </div>
                <div className="text-xs font-bold text-emerald-800">
                  মোট ব্যালেন্স: {toBanglaNumber(coins)} টি কয়েন
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mb-5">
              পরবর্তী ১০ মিনিট অধ্যয়ন সম্পন্ন করার পর আবার নতুন করে ১০টি কয়েন ক্লেইম করতে পারবেন।
            </p>

            <button
              type="button"
              onClick={() => setShowCelebration(false)}
              className="w-full py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>তিলাওয়াত চালিয়ে যান</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
export { QuranReader };
