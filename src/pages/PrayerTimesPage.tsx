import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PageType } from '../types';

interface PrayerTimesPageProps {
  onNavigate: (page: PageType) => void;
  onAddCoins?: (coins: number) => void;
}

interface AlAdhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

interface AlAdhanDate {
  readable: string;
  timestamp: string;
  gregorian: {
    date: string;
    day: string;
    weekday: { en: string };
    month: { en: string; number: number };
    year: string;
  };
  hijri: {
    date: string;
    day: string;
    weekday: { en: string; ar: string };
    month: { en: string; ar: string; number: number };
    year: string;
    designation: { abbreviated: string };
  };
}

interface AlAdhanResponse {
  code: number;
  status: string;
  data: {
    timings: AlAdhanTimings;
    date: AlAdhanDate;
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
      };
      school?: string;
    };
  };
}

interface CalendarDayItem {
  timings: AlAdhanTimings;
  date: AlAdhanDate;
}

// Bangladeshi Major Cities
const BANGLADESH_CITIES = [
  { id: 'dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka', lat: 23.8103, lng: 90.4125 },
  { id: 'chittagong', nameBn: 'চট্টগ্রাম', nameEn: 'Chittagong', lat: 22.3569, lng: 91.7832 },
  { id: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet', lat: 24.8949, lng: 91.8687 },
  { id: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi', lat: 24.3745, lng: 88.6042 },
  { id: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna', lat: 22.8456, lng: 89.5403 },
  { id: 'barisal', nameBn: 'বরিশাল', nameEn: 'Barisal', lat: 22.7010, lng: 90.3535 },
  { id: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur', lat: 25.7439, lng: 89.2752 },
  { id: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', lat: 24.7471, lng: 90.4203 },
  { id: 'cumilla', nameBn: 'কুমিল্লা', nameEn: 'Comilla', lat: 23.4607, lng: 91.1809 },
  { id: 'bogura', nameBn: 'বগুড়া', nameEn: 'Bogra', lat: 24.8465, lng: 89.3770 },
  { id: 'coxsbazar', nameBn: "কক্সবাজার", nameEn: "Cox's Bazar", lat: 21.4272, lng: 92.0058 },
  { id: 'noakhali', nameBn: 'নোয়াখালী', nameEn: 'Noakhali', lat: 22.8696, lng: 91.0994 }
];

// Fallback Dhaka Prayer Timings in case API request is blocked or offline
const FALLBACK_PRAYER_DATA: AlAdhanTimings = {
  Fajr: '04:45',
  Sunrise: '05:58',
  Dhuhr: '11:58',
  Asr: '15:20',
  Sunset: '17:58',
  Maghrib: '17:58',
  Isha: '19:12',
  Imsak: '04:35',
  Midnight: '23:58',
  Firstthird: '21:58',
  Lastthird: '01:58'
};

// Helper: Convert English digits to Bengali digits
function toBengaliDigits(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bnDigits[parseInt(digit, 10)]);
}

// Convert 24-hour "HH:MM" string to 12-hour Bangla formatted string
function formatTimeToBangla(timeStr: string | undefined): string {
  if (!timeStr) return '--:--';
  const clean = timeStr.split(' ')[0];
  const parts = clean.split(':');
  if (parts.length < 2) return clean;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  let period = 'সকাল';

  if (hours === 0) {
    hours = 12;
    period = 'রাত';
  } else if (hours < 5) {
    period = 'রাত / ভোর';
  } else if (hours < 12) {
    period = 'সকাল';
  } else if (hours === 12) {
    period = 'দুপুর';
  } else if (hours < 16) {
    hours = hours - 12;
    period = 'দুপুর';
  } else if (hours < 18) {
    hours = hours - 12;
    period = 'বিকাল';
  } else if (hours < 20) {
    hours = hours - 12;
    period = 'সন্ধ্যা';
  } else {
    hours = hours - 12;
    period = 'রাত';
  }

  const hoursBn = toBengaliDigits(hours);
  const minutesBn = toBengaliDigits(minutes);
  return `${period} ${hoursBn}:${minutesBn}`;
}

export const PrayerTimesPage: React.FC<PrayerTimesPageProps> = ({
  onNavigate,
  onAddCoins
}) => {
  // Settings & state
  const [selectedCity, setSelectedCity] = useState<string>('Dhaka');
  const [selectedCountry, setSelectedCountry] = useState<string>('Bangladesh');
  const [selectedCityLabelBn, setSelectedCityLabelBn] = useState<string>('ঢাকা');
  const [asrMethod, setAsrMethod] = useState<number>(1); // 1 = Hanafi, 0 = Shafi'i/Standard
  const [customCityInput, setCustomCityInput] = useState<string>('');
  const [isUsingLocation, setIsUsingLocation] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  // API Data state
  const [prayerData, setPrayerData] = useState<AlAdhanTimings>(FALLBACK_PRAYER_DATA);
  const [dateInfo, setDateInfo] = useState<AlAdhanDate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Monthly Calendar state
  const [activeTab, setActiveTab] = useState<'today' | 'month' | 'tracker' | 'guide'>('today');
  const [calendarData, setCalendarData] = useState<CalendarDayItem[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState<boolean>(false);

  // Live Clock & Next Prayer Countdown
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [nextPrayerInfo, setNextPrayerInfo] = useState<{
    nameBn: string;
    nameEn: string;
    time: string;
    countdownStr: string;
    progressPercent: number;
    currentWaqtBn: string;
  }>({
    nameBn: 'ফজর',
    nameEn: 'Fajr',
    time: '04:45',
    countdownStr: 'গণনা হচ্ছে...',
    progressPercent: 50,
    currentWaqtBn: 'তাহাজ্জুদ'
  });

  // Daily Prayer Tracker State
  const todayKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const [trackedPrayers, setTrackedPrayers] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem(`namaj_tracker_${todayKey}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [hasClaimedDailyStreak, setHasClaimedDailyStreak] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`namaj_streak_claimed_${todayKey}`) === 'true';
    } catch {
      return false;
    }
  });

  const [claimToast, setClaimToast] = useState<string | null>(null);

  // Audio Azan Player State
  const [isAzanPlaying, setIsAzanPlaying] = useState<boolean>(false);
  const [azanAudioSource, setAzanAudioSource] = useState<string>('/azan-makkah.mp3');
  const [azanType, setAzanType] = useState<'makkah' | 'fajr'>('makkah');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Keep live time ticking every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Prayer Times via AlAdhan API
  useEffect(() => {
    let cancelled = false;

    async function fetchPrayerTimes() {
      setLoading(true);
      setApiError(null);

      try {
        let url = '';
        if (coords) {
          // By Coordinates
          url = `https://api.aladhan.com/v1/timings?latitude=${coords.lat}&longitude=${coords.lng}&method=1&school=${asrMethod}`;
        } else {
          // By City
          url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
            selectedCity
          )}&country=${encodeURIComponent(selectedCountry)}&method=1&school=${asrMethod}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('AlAdhan API থেকে রেসপন্স পাওয়া যায়নি');
        }

        const result: AlAdhanResponse = await response.json();
        if (result.code !== 200 || !result.data) {
          throw new Error('নামাজের সঠিক ডেটা পাওয়া যায়নি');
        }

        if (!cancelled) {
          setPrayerData(result.data.timings);
          setDateInfo(result.data.date);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.warn('AlAdhan API fetch warning, using fallback calculations:', err);
          setApiError('অনলাইনে সংযোগে বিঘ্ন ঘটেছে। স্ট্যান্ডার্ড সময় প্রদর্শিত হচ্ছে।');
          // Keep fallback prayer data intact
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPrayerTimes();

    return () => {
      cancelled = true;
    };
  }, [selectedCity, selectedCountry, asrMethod, coords]);

  // Fetch monthly calendar if user switches to 'month' tab
  useEffect(() => {
    if (activeTab !== 'month' || calendarData.length > 0) return;

    let cancelled = false;
    async function fetchCalendar() {
      setLoadingCalendar(true);
      try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const url = `https://api.aladhan.com/v1/calendarByCity?city=${encodeURIComponent(
          selectedCity
        )}&country=${encodeURIComponent(
          selectedCountry
        )}&method=1&school=${asrMethod}&month=${month}&year=${year}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('মাসিক ক্যালেন্ডার পাওয়া যায়নি');
        const json = await res.json();
        if (json.code === 200 && Array.isArray(json.data) && !cancelled) {
          setCalendarData(json.data);
        }
      } catch (err) {
        console.warn('Calendar fetch error:', err);
      } finally {
        if (!cancelled) setLoadingCalendar(false);
      }
    }

    fetchCalendar();
    return () => {
      cancelled = true;
    };
  }, [activeTab, selectedCity, selectedCountry, asrMethod, calendarData.length]);

  // Handle GPS location
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('আপনার ব্রাউজারে লোকেশন সার্ভিস সাপোর্ট করছে না।');
      return;
    }
    setIsUsingLocation(true);
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setSelectedCityLabelBn('বর্তমান অবস্থান (GPS)');
        setIsUsingLocation(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        alert('লোকেশন পারমিশন পাওয়া যায়নি। ডিফল্ট ঢাকা নির্বাচন করা হলো।');
        setIsUsingLocation(false);
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  // Select predefined Bangladeshi City
  const handleSelectCity = (city: (typeof BANGLADESH_CITIES)[0]) => {
    setCoords(null);
    setSelectedCity(city.nameEn);
    setSelectedCountry('Bangladesh');
    setSelectedCityLabelBn(city.nameBn);
    setCalendarData([]); // refresh calendar
  };

  // Submit custom city search
  const handleCustomCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCityInput.trim()) return;
    setCoords(null);
    setSelectedCity(customCityInput.trim());
    setSelectedCountry('');
    setSelectedCityLabelBn(customCityInput.trim());
    setCalendarData([]);
  };

  // Calculate Next Prayer and Countdown
  useEffect(() => {
    if (!prayerData) return;

    const parseTimeToDate = (timeStr: string) => {
      const clean = timeStr.split(' ')[0];
      const [h, m] = clean.split(':').map((v) => parseInt(v, 10));
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d;
    };

    const fajrTime = parseTimeToDate(prayerData.Fajr);
    const sunriseTime = parseTimeToDate(prayerData.Sunrise);
    const dhuhrTime = parseTimeToDate(prayerData.Dhuhr);
    const asrTime = parseTimeToDate(prayerData.Asr);
    const maghribTime = parseTimeToDate(prayerData.Maghrib);
    const ishaTime = parseTimeToDate(prayerData.Isha);

    const now = currentTime.getTime();

    // Determine current and next prayer
    let nextNameBn = '';
    let nextNameEn = '';
    let nextTarget = fajrTime;
    let prevTarget = ishaTime;
    let currentWaqt = '';

    if (now < fajrTime.getTime()) {
      currentWaqt = 'তাহাজ্জুদ / শেষ রাত';
      nextNameBn = 'ফজর';
      nextNameEn = 'Fajr';
      nextTarget = fajrTime;
      const yesterdayIsha = new Date(ishaTime);
      yesterdayIsha.setDate(yesterdayIsha.getDate() - 1);
      prevTarget = yesterdayIsha;
    } else if (now < sunriseTime.getTime()) {
      currentWaqt = 'ফজর';
      nextNameBn = 'সূর্যোদয় (ফজর শেষ)';
      nextNameEn = 'Sunrise';
      nextTarget = sunriseTime;
      prevTarget = fajrTime;
    } else if (now < dhuhrTime.getTime()) {
      currentWaqt = 'ইশরাক / চাশত';
      nextNameBn = 'যোহর';
      nextNameEn = 'Dhuhr';
      nextTarget = dhuhrTime;
      prevTarget = sunriseTime;
    } else if (now < asrTime.getTime()) {
      currentWaqt = 'যোহর';
      nextNameBn = 'আসর';
      nextNameEn = 'Asr';
      nextTarget = asrTime;
      prevTarget = dhuhrTime;
    } else if (now < maghribTime.getTime()) {
      currentWaqt = 'আসর';
      nextNameBn = 'মাগরিব (ইফতার)';
      nextNameEn = 'Maghrib';
      nextTarget = maghribTime;
      prevTarget = asrTime;
    } else if (now < ishaTime.getTime()) {
      currentWaqt = 'মাগরিব';
      nextNameBn = 'ইশা';
      nextNameEn = 'Isha';
      nextTarget = ishaTime;
      prevTarget = maghribTime;
    } else {
      currentWaqt = 'ইশা / বিতর';
      nextNameBn = 'ফজর (আগামীকাল)';
      nextNameEn = 'Fajr';
      const tomorrowFajr = new Date(fajrTime);
      tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
      nextTarget = tomorrowFajr;
      prevTarget = ishaTime;
    }

    const diffMs = Math.max(0, nextTarget.getTime() - now);
    const totalWaqtMs = Math.max(1, nextTarget.getTime() - prevTarget.getTime());
    const elapsedMs = Math.max(0, now - prevTarget.getTime());
    const progressPercent = Math.min(100, Math.max(0, (elapsedMs / totalWaqtMs) * 100));

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

    const countdownStr = `${toBengaliDigits(hours)} ঘণ্টা ${toBengaliDigits(
      mins
    )} মিনিট ${toBengaliDigits(secs)} সেকেন্ড`;

    setNextPrayerInfo({
      nameBn: nextNameBn,
      nameEn: nextNameEn,
      time: nextTarget.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      countdownStr,
      progressPercent,
      currentWaqtBn: currentWaqt
    });
  }, [currentTime, prayerData]);

  // Prayer Tracker Checkbox toggle
  const togglePrayerTracking = (prayerKey: string) => {
    const updated = {
      ...trackedPrayers,
      [prayerKey]: !trackedPrayers[prayerKey]
    };
    setTrackedPrayers(updated);
    try {
      localStorage.setItem(`namaj_tracker_${todayKey}`, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save tracking to localStorage:', e);
    }
  };

  // Claim Daily Prayer Streak Reward
  const handleClaimStreakReward = () => {
    if (hasClaimedDailyStreak) return;
    const completedCount = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].filter(
      (k) => trackedPrayers[k]
    ).length;

    if (completedCount < 5) {
      setClaimToast('আজকের ৫ ওয়াক্ত নামাজ সম্পূর্ণ করে বোনাস ক্লেইম করুন!');
      setTimeout(() => setClaimToast(null), 3000);
      return;
    }

    if (onAddCoins) {
      onAddCoins(10);
    }
    setHasClaimedDailyStreak(true);
    localStorage.setItem(`namaj_streak_claimed_${todayKey}`, 'true');
    setClaimToast('আলহামদুলিল্লাহ! ৫ ওয়াক্ত নামাজ সম্পন্ন করায় +১০ কয়েন রিওয়ার্ড যোগ হয়েছে!');
    setTimeout(() => setClaimToast(null), 4000);
  };

  // Play / Pause Azan
  const toggleAzan = (selectedSource?: string) => {
    if (!audioRef.current) return;
    if (isAzanPlaying && !selectedSource) {
      audioRef.current.pause();
      setIsAzanPlaying(false);
      return;
    }

    if (selectedSource) {
      setAzanAudioSource(selectedSource);
      audioRef.current.src = selectedSource;
      audioRef.current.load();
    }

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsAzanPlaying(true);
        })
        .catch((e) => {
          // If first URL failed, try fallback
          if (audioRef.current) {
            const fallbackSrc =
              azanType === 'fajr'
                ? 'https://cdn.jsdelivr.net/gh/mohsalvi/adhan-audio@main/fajr/makkah-fajr-01.mp3'
                : 'https://cdn.jsdelivr.net/gh/mohsalvi/adhan-audio@main/general/al-haram-01.mp3';
            if (audioRef.current.src !== fallbackSrc) {
              audioRef.current.src = fallbackSrc;
              audioRef.current.load();
              audioRef.current
                .play()
                .then(() => setIsAzanPlaying(true))
                .catch((err) => {
                  console.warn('Fallback audio playback error:', err);
                  setIsAzanPlaying(false);
                });
              return;
            }
          }
          console.warn('Audio play error:', e);
          setIsAzanPlaying(false);
        });
    }
  };

  const handleAudioError = () => {
    // If local path fails (or vice versa), fall back to jsdelivr CDN
    if (audioRef.current) {
      const fallbackUrl =
        azanType === 'fajr'
          ? 'https://cdn.jsdelivr.net/gh/mohsalvi/adhan-audio@main/fajr/makkah-fajr-01.mp3'
          : 'https://cdn.jsdelivr.net/gh/mohsalvi/adhan-audio@main/general/al-haram-01.mp3';
      if (audioRef.current.currentSrc !== fallbackUrl && audioRef.current.src !== fallbackUrl) {
        audioRef.current.src = fallbackUrl;
        audioRef.current.load();
        if (isAzanPlaying) {
          audioRef.current.play().catch(() => setIsAzanPlaying(false));
        }
      }
    }
  };

  // Format Current Live Time in Bengali
  const liveTimeBn = useMemo(() => {
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    const period = hours >= 12 ? 'অপরাহ্ন / PM' : 'পূর্বাহ্ন / AM';
    const displayHours = hours % 12 || 12;
    return `${toBengaliDigits(displayHours)}:${toBengaliDigits(
      String(minutes).padStart(2, '0')
    )}:${toBengaliDigits(String(seconds).padStart(2, '0'))} ${period}`;
  }, [currentTime]);

  const completedCount = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].filter(
    (k) => trackedPrayers[k]
  ).length;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-800">
      {/* Audio element for Azan */}
      <audio
        ref={audioRef}
        src={azanAudioSource}
        onEnded={() => setIsAzanPlaying(false)}
        onError={handleAudioError}
        preload="auto"
      >
        <source src={azanAudioSource} type="audio/mpeg" />
        <source
          src="https://cdn.jsdelivr.net/gh/mohsalvi/adhan-audio@main/general/al-haram-01.mp3"
          type="audio/mpeg"
        />
      </audio>

      {/* Floating Claim Toast */}
      {claimToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-600 animate-bounce">
          <span className="material-symbols-outlined text-amber-300">verified</span>
          <span className="font-bold text-sm">{claimToast}</span>
        </div>
      )}

      {/* TOP HERO HEADER */}
      <header className="relative bg-gradient-to-b from-[#0F392B] via-[#134636] to-[#0A261C] text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/40 overflow-hidden shadow-lg">
        {/* Subtle decorative Islamic arabesque pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:20px_20px]"
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <button
              onClick={() => onNavigate('find-jobs')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white text-xs font-bold transition-all cursor-pointer border border-white/15"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Find Jobs-এ ফিরে যান</span>
            </button>

            {/* Right status or refresh */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>দৈনিক ওয়াক্ত আপডেট</span>
              </span>
            </div>
          </div>

          {/* Bismillah & Title */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-['Amiri',serif] text-2xl sm:text-3xl text-emerald-200/90 mb-2 tracking-wide select-none">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2 font-display">
              দৈনিক ৫ ওয়াক্ত নামাজের সময়সূচী
            </h1>
            <p className="text-emerald-200/80 text-xs sm:text-sm font-medium">
              সঠিক ভৌগোলিক অবস্থান ও ইসলামিক পদ্ধতি অনুযায়ী নির্ভুল ওয়াক্ত
            </p>
          </div>

          {/* Date & Location Bar */}
          <div className="mt-8 bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
            {/* Left: Location & GPS */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-emerald-300 font-bold bg-emerald-950/70 px-3 py-1.5 rounded-xl border border-emerald-700/50">
                <span className="material-symbols-outlined text-sm text-emerald-400">location_on</span>
                <span>{selectedCityLabelBn}</span>
              </div>

              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isUsingLocation}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all cursor-pointer border border-white/10"
                title="বর্তমান জিপিএস লোকেশন সনাক্ত করুন"
              >
                <span className="material-symbols-outlined text-sm">my_location</span>
                <span>{isUsingLocation ? 'শনাক্ত হচ্ছে...' : 'জিপিএস লোকেশন'}</span>
              </button>

              {/* Asr Juristic Toggle */}
              <div className="inline-flex items-center rounded-xl bg-black/40 p-0.5 border border-white/10">
                <button
                  type="button"
                  onClick={() => setAsrMethod(1)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    asrMethod === 1 ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  আসর (হানাফী)
                </button>
                <button
                  type="button"
                  onClick={() => setAsrMethod(0)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    asrMethod === 0 ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  আসর (শাফেয়ী)
                </button>
              </div>
            </div>

            {/* Right: Hijri & Gregorian Dates */}
            <div className="flex items-center gap-3 text-right text-emerald-100/90 ml-auto flex-wrap">
              {dateInfo ? (
                <>
                  <div className="bg-white/5 px-3 py-1 rounded-xl border border-white/10">
                    <span className="text-[11px] text-emerald-300/80 block">হিজরি সন</span>
                    <span className="font-bold text-xs">
                      {toBengaliDigits(dateInfo.hijri.day)} {dateInfo.hijri.month.en} {toBengaliDigits(dateInfo.hijri.year)} হি.
                    </span>
                  </div>
                  <div className="bg-white/5 px-3 py-1 rounded-xl border border-white/10">
                    <span className="text-[11px] text-emerald-300/80 block">ইংরেজি তারিখ</span>
                    <span className="font-bold text-xs">{dateInfo.readable}</span>
                  </div>
                </>
              ) : (
                <div className="bg-white/5 px-3 py-1 rounded-xl border border-white/10">
                  <span className="font-bold text-xs">
                    {new Date().toLocaleDateString('bn-BD', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* LIVE CURRENT WAQT & NEXT PRAYER COUNTDOWN CARD */}
        <section className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Live Clock & Ongoing Waqt */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-slate-100 pb-5 md:pb-0 md:pr-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>চলমান ওয়াক্ত</span>
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                {nextPrayerInfo.currentWaqtBn}
              </h2>
              <div className="text-sm font-semibold text-slate-500 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-slate-400">schedule</span>
                <span>বর্তমান সময়: <strong className="text-slate-800">{liveTimeBn}</strong></span>
              </div>
            </div>

            {/* Next Prayer & Live Countdown Timer */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    পরবর্তী ওয়াক্ত
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {nextPrayerInfo.nameBn} — <span className="text-emerald-700">{formatTimeToBangla(nextPrayerInfo.time)}</span>
                  </h3>
                </div>

                {/* Audio Azan toggle button with selector */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      if (azanType === 'makkah' && isAzanPlaying) {
                        toggleAzan();
                      } else {
                        setAzanType('makkah');
                        toggleAzan('/azan-makkah.mp3');
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      isAzanPlaying && azanType === 'makkah'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isAzanPlaying && azanType === 'makkah' ? 'pause_circle' : 'volume_up'}
                    </span>
                    <span>
                      {isAzanPlaying && azanType === 'makkah'
                        ? 'আজান বন্ধ করুন'
                        : 'আজান (মক্কা শরিফ)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (azanType === 'fajr' && isAzanPlaying) {
                        toggleAzan();
                      } else {
                        setAzanType('fajr');
                        toggleAzan('/azan-fajr.mp3');
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      isAzanPlaying && azanType === 'fajr'
                        ? 'bg-amber-50 text-amber-700 border border-amber-300 animate-pulse'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {isAzanPlaying && azanType === 'fajr' ? 'pause_circle' : 'play_arrow'}
                    </span>
                    <span>
                      {isAzanPlaying && azanType === 'fajr'
                        ? 'ফজর আজান থামান'
                        : 'ফজরের আজান'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Countdown Display */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-amber-500">hourglass_top</span>
                    <span>বাকি সময়:</span>
                  </span>
                  <span className="text-emerald-700 font-extrabold text-sm">{nextPrayerInfo.countdownStr}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${nextPrayerInfo.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NAVIGATION TABS */}
        <div className="grid grid-cols-2 md:flex md:items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`w-full md:w-auto px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'today'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">today</span>
            <span>আজকের সময়সূচী</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tracker')}
            className={`w-full md:w-auto px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'tracker'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>নামাজ ট্র্যাকার ({toBengaliDigits(completedCount)}/৫)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('month')}
            className={`w-full md:w-auto px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'month'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">calendar_month</span>
            <span>মাসিক ক্যালেন্ডার</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`w-full md:w-auto px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'guide'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 ring-2 ring-emerald-500/20'
            }`}
          >
            <span className="material-symbols-outlined text-base text-emerald-600">menu_book</span>
            <span>রাকাত সংখ্যা ও দোয়া</span>
          </button>
        </div>

        {/* CITY QUICK SELECTOR BAR */}
        <section className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-emerald-600">apartment</span>
              <span>বাংলাদেশ বিভাগ ও প্রধান জেলা নির্বাচন করুন:</span>
            </span>

            {/* Custom City Search Input */}
            <form onSubmit={handleCustomCitySubmit} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="অন্য কোনো শহর (যেমন: Sylhet, Makkah)..."
                value={customCityInput}
                onChange={(e) => setCustomCityInput(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-emerald-600 bg-slate-50 w-44 sm:w-56"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                খুঁজুন
              </button>
            </form>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {BANGLADESH_CITIES.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => handleSelectCity(city)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCity === city.nameEn && !coords
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {city.nameBn}
              </button>
            ))}
          </div>
        </section>

        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600">info</span>
            <span>{apiError}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: TODAY'S PRAYER TIMETABLE CARDS                          */}
        {/* ============================================================== */}
        {activeTab === 'today' && (
          <div className="space-y-8">
            {/* The 5 Main Prayers Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">mosque</span>
                  <span>আজকের ৫ ওয়াক্ত নামাজের সঠিক সময়সূচী</span>
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  {selectedCityLabelBn} অঞ্চল
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. FAJR */}
                <div
                  className={`rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                    nextPrayerInfo.currentWaqtBn === 'ফজর'
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-2 ring-emerald-400/30'
                      : 'bg-white border-slate-100 shadow-xs hover:shadow-md'
                  }`}
                >
                  {nextPrayerInfo.currentWaqtBn === 'ফজর' && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                      চলমান
                    </span>
                  )}
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-xl">wb_twilight</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">১ম ওয়াক্ত</span>
                    <h4 className="text-xl font-black text-slate-900 mb-1">ফজর (Fajr)</h4>
                    <p className="text-[11px] text-slate-500 mb-3">সুবহে সাদিক থেকে সূর্যোদয়ের পূর্ব পর্যন্ত</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400 block font-medium">শুরু সময়:</span>
                    <span className="text-xl font-black text-emerald-800">
                      {formatTimeToBangla(prayerData.Fajr)}
                    </span>
                  </div>
                </div>

                {/* 2. DHUHR */}
                <div
                  className={`rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                    nextPrayerInfo.currentWaqtBn === 'যোহর'
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-2 ring-emerald-400/30'
                      : 'bg-white border-slate-100 shadow-xs hover:shadow-md'
                  }`}
                >
                  {nextPrayerInfo.currentWaqtBn === 'যোহর' && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                      চলমান
                    </span>
                  )}
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-xl">wb_sunny</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">২য় ওয়াক্ত</span>
                    <h4 className="text-xl font-black text-slate-900 mb-1">যোহর (Dhuhr)</h4>
                    <p className="text-[11px] text-slate-500 mb-3">দুপুর দ্বিপ্রহরের পর থেকে আসর পর্যন্ত</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400 block font-medium">শুরু সময়:</span>
                    <span className="text-xl font-black text-emerald-800">
                      {formatTimeToBangla(prayerData.Dhuhr)}
                    </span>
                  </div>
                </div>

                {/* 3. ASR */}
                <div
                  className={`rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                    nextPrayerInfo.currentWaqtBn === 'আসর'
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-2 ring-emerald-400/30'
                      : 'bg-white border-slate-100 shadow-xs hover:shadow-md'
                  }`}
                >
                  {nextPrayerInfo.currentWaqtBn === 'আসর' && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                      চলমান
                    </span>
                  )}
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-xl">flare</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">৩য় ওয়াক্ত</span>
                    <h4 className="text-xl font-black text-slate-900 mb-1">আসর (Asr)</h4>
                    <p className="text-[11px] text-slate-500 mb-3">
                      {asrMethod === 1 ? 'হানাফী (দ্বিগুণ ছায়া)' : 'শাফেয়ী (একগুণ ছায়া)'}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400 block font-medium">শুরু সময়:</span>
                    <span className="text-xl font-black text-emerald-800">
                      {formatTimeToBangla(prayerData.Asr)}
                    </span>
                  </div>
                </div>

                {/* 4. MAGHRIB */}
                <div
                  className={`rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                    nextPrayerInfo.currentWaqtBn === 'মাগরিব'
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-2 ring-emerald-400/30'
                      : 'bg-white border-slate-100 shadow-xs hover:shadow-md'
                  }`}
                >
                  {nextPrayerInfo.currentWaqtBn === 'মাগরিব' && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                      চলমান
                    </span>
                  )}
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-xl">nights_stay</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">৪র্থ ওয়াক্ত</span>
                    <h4 className="text-xl font-black text-slate-900 mb-1">মাগরিব (Maghrib)</h4>
                    <p className="text-[11px] text-slate-500 mb-3">সূর্যাস্তের পরপরই ও ইফতারের সময়</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400 block font-medium">ইফতার / শুরু:</span>
                    <span className="text-xl font-black text-rose-700">
                      {formatTimeToBangla(prayerData.Maghrib)}
                    </span>
                  </div>
                </div>

                {/* 5. ISHA */}
                <div
                  className={`rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                    nextPrayerInfo.currentWaqtBn.includes('ইশা')
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-2 ring-emerald-400/30'
                      : 'bg-white border-slate-100 shadow-xs hover:shadow-md'
                  }`}
                >
                  {nextPrayerInfo.currentWaqtBn.includes('ইশা') && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                      চলমান
                    </span>
                  )}
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-xl">bedtime</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">৫ম ওয়াক্ত</span>
                    <h4 className="text-xl font-black text-slate-900 mb-1">ইশা (Isha)</h4>
                    <p className="text-[11px] text-slate-500 mb-3">রাত্রির অন্ধকার থেকে সুবহে সাদেক পর্যন্ত</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400 block font-medium">শুরু সময়:</span>
                    <span className="text-xl font-black text-emerald-800">
                      {formatTimeToBangla(prayerData.Isha)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SEHRI, IFTAR, SUNRISE & SPECIAL ISLAMIC TIMES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Sehri End */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">restaurant</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block">সেহরি শেষ (ইমসাক)</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {formatTimeToBangla(prayerData.Imsak || prayerData.Fajr)}
                  </span>
                </div>
              </div>

              {/* Sunrise */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">light_mode</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block">সূর্যোদয় (ফজর শেষ)</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {formatTimeToBangla(prayerData.Sunrise)}
                  </span>
                </div>
              </div>

              {/* Iftar / Sunset */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">water_drop</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block">ইফতার ও সূর্যাস্ত</span>
                  <span className="text-base font-extrabold text-rose-700">
                    {formatTimeToBangla(prayerData.Maghrib)}
                  </span>
                </div>
              </div>

              {/* Tahajjud / Last Third */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">stars</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block">তাহাজ্জুদ (রাতের শেষভাগ)</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {formatTimeToBangla(prayerData.Lastthird || '02:00')}
                  </span>
                </div>
              </div>
            </div>

            {/* FORBIDDEN PRAYER TIMES ALERT (মাকরুহ বা নিষিদ্ধ সময়) */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 text-amber-950">
              <h4 className="font-extrabold text-sm flex items-center gap-2 mb-2 text-amber-900">
                <span className="material-symbols-outlined text-amber-700">warning</span>
                <span>নামাজ পড়ার ৩টি নিষিদ্ধ (মাকরুহ) সময়:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60">
                  <strong className="block text-amber-900 mb-0.5">১. সূর্যোদয়ের সময়</strong>
                  <span>সূর্য ওঠার শুরু থেকে পরবর্তী ১৫-২০ মিনিট পর্যন্ত।</span>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60">
                  <strong className="block text-amber-900 mb-0.5">২. ঠিক দ্বিপ্রহরে</strong>
                  <span>সূর্য যখন ঠিক মাথার উপরে থাকে (যাওয়াল হওয়ার পূর্ব পর্যন্ত)।</span>
                </div>
                <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60">
                  <strong className="block text-amber-900 mb-0.5">৩. সূর্যাস্তের সময়</strong>
                  <span>সূর্য ডোবার পূর্ববর্তী ১০-১৫ মিনিট (দিনের আসর বাদে অন্য নামাজ)।</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PRAYER TRACKER & STREAK BONUS                           */}
        {/* ============================================================== */}
        {activeTab === 'tracker' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-1">
                  দৈনিক আমল ও ইবাদত
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  আজকের নামাজ ট্র্যাকার ও রেকর্ড
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  প্রতি ওয়াক্ত নামাজ আদায়ের পর টিক চিহ্ন দিন। ৫ ওয়াক্ত পূর্ণ হলে দৈনিক বোনাস গ্রহণ করুন।
                </p>
              </div>

              {/* Progress Summary Card */}
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-center sm:text-right shrink-0">
                <span className="text-xs font-bold text-emerald-800 block">আদায় সম্পন্ন</span>
                <span className="text-2xl font-black text-emerald-700">
                  {toBengaliDigits(completedCount)} / {toBengaliDigits(5)} ওয়াক্ত
                </span>
              </div>
            </div>

            {/* Prayer Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'fajr', nameBn: 'ফজর', sub: '২ রাকাত সুন্নত, ২ রাকাত ফরজ', time: prayerData.Fajr },
                { key: 'dhuhr', nameBn: 'যোহর', sub: '৪ সুন্নত, ৪ ফরজ, ২ সুন্নত, ২ নফল', time: prayerData.Dhuhr },
                { key: 'asr', nameBn: 'আসর', sub: '৪ রাকাত সুন্নত, ৪ রাকাত ফরজ', time: prayerData.Asr },
                { key: 'maghrib', nameBn: 'মাগরিব', sub: '৩ রাকাত ফরজ, ২ সুন্নত, ২ নফল', time: prayerData.Maghrib },
                { key: 'isha', nameBn: 'ইশা', sub: '৪ সুন্নত, ৪ ফরজ, ২ সুন্নত, ৩ বিতর', time: prayerData.Isha },
                { key: 'tahajjud', nameBn: 'তাহাজ্জুদ ও নফল', sub: 'নফল তাহাজ্জুদ সালাত', time: prayerData.Lastthird || '02:00' }
              ].map((item) => {
                const isChecked = !!trackedPrayers[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => togglePrayerTracking(item.key)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                      isChecked
                        ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                        : 'bg-slate-50/60 hover:bg-slate-100/70 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && (
                          <span className="material-symbols-outlined text-sm font-bold">check</span>
                        )}
                      </div>
                      <div>
                        <h4
                          className={`font-black text-base ${
                            isChecked ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'
                          }`}
                        >
                          {item.nameBn}
                        </h4>
                        <p className="text-[11px] text-slate-500">{item.sub}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      {formatTimeToBangla(item.time)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Daily Streak Bonus Section */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
                  🪙
                </div>
                <div>
                  <h4 className="font-black text-base text-white">দৈনিক নামাজ স্ট্রিক রিওয়ার্ড (+১০ কয়েন)</h4>
                  <p className="text-xs text-emerald-200">
                    আজকের ৫ ওয়াক্ত নামাজ পূর্ণ হয়েছে চিহ্নিত করুন এবং প্রতিদিনের ১০টি কয়েন উপহার সংগ্রহ করুন।
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClaimStreakReward}
                disabled={hasClaimedDailyStreak || completedCount < 5}
                className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm cursor-pointer transition-all shrink-0 shadow-md ${
                  hasClaimedDailyStreak
                    ? 'bg-white/20 text-emerald-200 cursor-not-allowed border border-white/20'
                    : completedCount >= 5
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-900 hover:scale-105 active:scale-95'
                    : 'bg-white/10 text-emerald-300 border border-white/15 hover:bg-white/15'
                }`}
              >
                {hasClaimedDailyStreak
                  ? '✅ আজকের কয়েন নেওয়া হয়েছে'
                  : completedCount >= 5
                  ? 'ক্লেইম করুন (+১০ কয়েন)'
                  : `🔒 বাকি রয়েছে (${toBengaliDigits(5 - completedCount)} ওয়াক্ত)`}
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: MONTHLY CALENDAR TIMETABLE                              */}
        {/* ============================================================== */}
        {activeTab === 'month' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-1">
                  পুরো মাসের সময়সূচী
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {selectedCityLabelBn} - মাসিক নামাজের সময়সূচী ক্যালেন্ডার
                </h3>
                <p className="text-xs text-slate-500">
                  বর্তমান মাসের প্রতিদিনের সেহরি, ফজর, যোহর, আসর, মাগরিব ও ইশার পূর্ণাঙ্গ সময়সূচী
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>প্রিন্ট / সেভ করুন</span>
              </button>
            </div>

            {loadingCalendar ? (
              <div className="text-center py-16 text-slate-500 text-sm">
                <span className="material-symbols-outlined animate-spin text-3xl text-emerald-600 mb-2 block">
                  progress_activity
                </span>
                <span>মাসিক ক্যালেন্ডারের ডেটা লোড হচ্ছে...</span>
              </div>
            ) : calendarData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                      <th className="p-3 rounded-l-xl">তারিখ</th>
                      <th className="p-3">হিজরি</th>
                      <th className="p-3">সেহরি শেষ</th>
                      <th className="p-3">ফজর</th>
                      <th className="p-3">সূর্যোদয়</th>
                      <th className="p-3">যোহর</th>
                      <th className="p-3">আসর</th>
                      <th className="p-3">মাগরিব / ইফতার</th>
                      <th className="p-3 rounded-r-xl">ইশা</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {calendarData.map((dayItem, idx) => {
                      const isToday =
                        dayItem.date.gregorian.day ===
                        String(new Date().getDate()).padStart(2, '0');
                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-slate-50 transition-colors ${
                            isToday ? 'bg-emerald-50/70 font-bold text-emerald-950' : 'text-slate-800'
                          }`}
                        >
                          <td className="p-3 whitespace-nowrap">
                            <span className="font-extrabold">
                              {toBengaliDigits(dayItem.date.gregorian.day)}{' '}
                              {dayItem.date.gregorian.month.en}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {dayItem.date.gregorian.weekday.en}
                            </span>
                          </td>
                          <td className="p-3 whitespace-nowrap text-slate-600">
                            {toBengaliDigits(dayItem.date.hijri.day)}{' '}
                            {dayItem.date.hijri.month.en}
                          </td>
                          <td className="p-3 font-semibold text-slate-600">
                            {dayItem.timings.Imsak ? dayItem.timings.Imsak.split(' ')[0] : dayItem.timings.Fajr.split(' ')[0]}
                          </td>
                          <td className="p-3 font-semibold text-emerald-700">
                            {dayItem.timings.Fajr.split(' ')[0]}
                          </td>
                          <td className="p-3 text-slate-500">
                            {dayItem.timings.Sunrise.split(' ')[0]}
                          </td>
                          <td className="p-3 font-semibold text-slate-700">
                            {dayItem.timings.Dhuhr.split(' ')[0]}
                          </td>
                          <td className="p-3 font-semibold text-slate-700">
                            {dayItem.timings.Asr.split(' ')[0]}
                          </td>
                          <td className="p-3 font-extrabold text-rose-700">
                            {dayItem.timings.Maghrib.split(' ')[0]}
                          </td>
                          <td className="p-3 font-semibold text-slate-700">
                            {dayItem.timings.Isha.split(' ')[0]}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">
                মাসিক ক্যালেন্ডার প্রস্তুত হচ্ছে। অনুগ্রহ করে একটু পর চেষ্টা করুন।
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: RAK'ATS & AZAN DUA GUIDE                                */}
        {/* ============================================================== */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            {/* Azan Dua Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-emerald-600 text-2xl">menu_book</span>
                <h3 className="text-xl font-black text-slate-900">আজানের পরের দোয়া ও ফজিলত</h3>
              </div>

              <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200/60 mb-4">
                <p className="font-['Amiri',serif] text-xl sm:text-2xl text-emerald-950 text-right leading-loose mb-3" dir="rtl">
                  اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ
                </p>
                <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                  <p>
                    <strong className="text-slate-900">বাংলা উচ্চারণ:</strong>{' '}
                    <em>
                      আল্লাহুম্মা রব্বা হাযিহিদ দাওয়াতিত তাম্মাহ, ওয়াস সালাতিল ক্বা-য়িমাহ, আ-তি মুহাম্মাদানিল ওয়াসীলাতা ওয়াল ফাদীলাহ, ওয়াবআছহু মাক্বামাম মাহমূদানিল্লাযী ওয়াআত্তাহ।
                    </em>
                  </p>
                  <p>
                    <strong className="text-slate-900">বাংলা অর্থ:</strong>{' '}
                    হে আল্লাহ! এই পরিপূর্ণ আহ্বান এবং উপস্থিত নামাজের আপনিই প্রতিপালক। আমাদের প্রিয় নবী মুহাম্মদ (সা.)-কে অসীলা এবং সর্বোত্তম মর্যাদা দান করুন, এবং তাঁকে সেই প্রশংসিত স্থানে পৌঁছিয়ে দিন যার প্রতিশ্রুতি আপনি তাঁকে দিয়েছেন।
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-500 italic">
                ফজিলত: হজরত জাবের (রা.) থেকে বর্ণিত, রাসুলুল্লাহ (সা.) বলেছেন, “যে ব্যক্তি আজান শুনে এই দোয়া পড়বে, কিয়ামতের দিন তার জন্য আমার শাফায়াত ওয়াজিব হয়ে যাবে।” (সহিহ বুখারি: ৬১৪)
              </p>
            </div>

            {/* Daily Prayers Rak'ats Chart */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">format_list_numbered</span>
                <span>৫ ওয়াক্ত নামাজের রাকাত সংখ্যা ও বিবরণ</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* Fajr */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-extrabold text-base text-slate-900 mb-1">ফজর (মোট ৪ রাকাত)</h4>
                  <ul className="space-y-1 text-slate-600">
                    <li>• ২ রাকাত সুন্নাতে মুয়াক্কাদা</li>
                    <li>• ২ রাকাত ফরজ</li>
                  </ul>
                </div>

                {/* Dhuhr */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-extrabold text-base text-slate-900 mb-1">যোহর (মোট ১২ রাকাত)</h4>
                  <ul className="space-y-1 text-slate-600">
                    <li>• ৪ রাকাত সুন্নাতে মুয়াক্কাদা</li>
                    <li>• ৪ রাকাত ফরজ</li>
                    <li>• ২ রাকাত সুন্নাতে মুয়াক্কাদা</li>
                    <li>• ২ রাকাত নফল</li>
                  </ul>
                </div>

                {/* Asr */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-extrabold text-base text-slate-900 mb-1">আসর (মোট ৮ রাকাত)</h4>
                  <ul className="space-y-1 text-slate-600">
                    <li>• ৪ রাকাত সুন্নাতে গায়রে মুয়াক্কাদা</li>
                    <li>• ৪ রাকাত ফরজ</li>
                  </ul>
                </div>

                {/* Maghrib */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-extrabold text-base text-slate-900 mb-1">মাগরিব (মোট ৭ রাকাত)</h4>
                  <ul className="space-y-1 text-slate-600">
                    <li>• ৩ রাকাত ফরজ</li>
                    <li>• ২ রাকাত সুন্নাতে মুয়াক্কাদা</li>
                    <li>• ২ রাকাত নফল / আওওয়াবীন</li>
                  </ul>
                </div>

                {/* Isha */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-extrabold text-base text-slate-900 mb-1">ইশা (মোট ১৭ রাকাত)</h4>
                  <ul className="space-y-1 text-slate-600">
                    <li>• ৪ রাকাত সুন্নাতে গায়রে মুয়াক্কাদা</li>
                    <li>• ৪ রাকাত ফরজ</li>
                    <li>• ২ রাকাত সুন্নাতে মুয়াক্কাদা</li>
                    <li>• ২ রাকাত নফল</li>
                    <li>• ৩ রাকাত বিতর (ওয়াজিব)</li>
                    <li>• ২ রাকাত নফল</li>
                  </ul>
                </div>

                {/* Jumu'ah */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <h4 className="font-extrabold text-base text-emerald-950 mb-1">জুমার নামাজ (শুক্রবার)</h4>
                  <ul className="space-y-1 text-slate-700">
                    <li>• ৪ রাকাত কাবলাল জুমা (সুন্নত)</li>
                    <li>• ২ রাকাত জুমার ফরজ সালাত</li>
                    <li>• ৪ রাকাত বাদাল জুমা (সুন্নত)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
