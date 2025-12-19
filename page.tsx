"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, addDays, subDays } from "date-fns";
import { Droplet, Trophy, Sparkles, RefreshCw, ChevronDown, ChevronUp, History, Settings, LogOut, Eye, EyeOff, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
type PlayerType = "husband" | "wife";

interface PlayerData {
  name: string;
  avatar: string; // ID of the avatar
  dailyWater: number; // Current logged amount (oz)
  dailyGoal: number; // Target amount (oz)
  quickAddAmount: number; // Default button size (oz)
  totalWins: number;
}

interface DailyHistory {
  date: string;
  winner: PlayerType | "tie" | null;
  husbandWater: number;
  wifeWater: number;
  husbandGoal: number;
  wifeGoal: number;
}

interface GameState {
  isRegistered: boolean;
  startDate: string; // ISO string
  lastLogDate: string; // YYYY-MM-DD
  husband: PlayerData;
  wife: PlayerData;
  history: DailyHistory[];
}

// --- Constants ---
const GAME_DURATION_DAYS = 90;

const AVATARS = [
  { id: "frog-green", emoji: "🐸", label: "Green Frog" },
  { id: "owl-purple", emoji: "🦉", label: "Purple Owl" },
  { id: "turtle-teal", emoji: "🐢", label: "Teal Turtle" },
  { id: "cat-orange", emoji: "🐱", label: "Orange Cat" },
  { id: "dog-brown", emoji: "🐶", label: "Brown Dog" },
  { id: "rabbit-white", emoji: "🐰", label: "White Rabbit" },
  { id: "bear-blue", emoji: "🐻", label: "Blue Bear" },
  { id: "fox-red", emoji: "🦊", label: "Red Fox" },
];

const FACTS = [
  "Did you know? During pregnancy, blood volume increases by 40-50% to nurture the baby!",
  "Fun Fact: Babies can taste food in the womb starting around 21 weeks.",
  "Joke: I told my wife she should embrace her mistakes. She hugged me.",
  "Geriatric Pregnancy? More like 'Vintage Maternal Glamour'. You're a classic!",
  "Joke: What do you do when your baby cries? You cry too, just to show dominance.",
  "Tip: Hydration helps form the amniotic fluid. Drink up!",
  "Joke: Being pregnant after 35 means you remember life before the internet... and you'll be raising a cyborg.",
  "Fact: Your heart pumps harder during pregnancy. You're literally doing cardio while sitting on the couch.",
  "Joke: 'Eating for two' is fun until you realize the other person only wants pickles and ice cream.",
  "Science: Water helps transport nutrients to your baby and flushes out toxins.",
  "After 35, it's not a 'high risk' pregnancy, it's a 'high experience' pregnancy.",
  "Joke: Why did the baby cross the road? It didn't, it was strapped in a car seat for 20 minutes.",
];

// --- Helper Components ---

const FlipCard = ({ val, label }: { val: number; label: string }) => (
  <div className="flex flex-col items-center mx-1">
    <div className="relative w-12 h-16 sm:w-16 sm:h-20 bg-gray-800 rounded-lg overflow-hidden shadow-md flex items-center justify-center mb-1 border border-gray-600">
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gray-700 border-b border-gray-900 opacity-50"></div>
      <span className="text-2xl sm:text-4xl font-mono font-bold text-white z-10">{String(val).padStart(2, "0")}</span>
    </div>
    <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
  </div>
);

function Countdown({ endDate }: { endDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (now > endDate) {
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        d: differenceInDays(endDate, now),
        h: differenceInHours(endDate, now) % 24,
        m: differenceInMinutes(endDate, now) % 60,
        s: differenceInSeconds(endDate, now) % 60,
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex justify-center p-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200">
      <FlipCard val={timeLeft.d} label="Days" />
      <FlipCard val={timeLeft.h} label="Hrs" />
      <FlipCard val={timeLeft.m} label="Mins" />
      <FlipCard val={timeLeft.s} label="Secs" />
    </div>
  );
}

// --- Main Components ---

function IdentityScreen({ 
  gameState, 
  onSelectIdentity 
}: { 
  gameState: GameState; 
  onSelectIdentity: (role: PlayerType) => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-blue-50 p-6 pattern-bg">
      <h1 className="text-3xl font-black text-gray-800 mb-2 text-center bg-white/80 p-2 rounded-xl backdrop-blur-md">Who is logging in?</h1>
      <p className="text-gray-500 mb-8 text-center bg-white/60 p-1 rounded-lg">Select your profile to track your water.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
        {/* Husband Button */}
        <button
          onClick={() => onSelectIdentity("husband")}
          className="relative group bg-white/90 p-6 rounded-3xl shadow-xl border-4 border-sage-200 hover:border-sage-500 transition-all transform hover:-translate-y-1"
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-6xl drop-shadow-md">
            {AVATARS.find(a => a.id === gameState.husband.avatar)?.emoji}
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-sage-800">{gameState.husband.name}</h2>
            <p className="text-sm font-bold text-sage-500 uppercase tracking-widest mt-1">Husband</p>
          </div>
        </button>

        {/* Wife Button */}
        <button
          onClick={() => onSelectIdentity("wife")}
          className="relative group bg-white/90 p-6 rounded-3xl shadow-xl border-4 border-furman-200 hover:border-furman-500 transition-all transform hover:-translate-y-1"
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-6xl drop-shadow-md">
            {AVATARS.find(a => a.id === gameState.wife.avatar)?.emoji}
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-furman-800">{gameState.wife.name}</h2>
            <p className="text-sm font-bold text-furman-500 uppercase tracking-widest mt-1">Wife</p>
          </div>
        </button>
      </div>
      
      <p className="mt-12 text-xs text-gray-400 bg-white/50 px-2 py-1 rounded">
        Challenge started on {format(new Date(gameState.startDate), "MMMM do, yyyy")}
      </p>
    </div>
  );
}

function Registration({ onRegister }: { onRegister: (hData: any, wData: any) => void }) {
  // Husband State
  const [hName, setHName] = useState("");
  const [hAvatar, setHAvatar] = useState("frog-green");
  const [hGoal, setHGoal] = useState(101); // Approx 3L
  const [hQuick, setHQuick] = useState(16); // Pint glass

  // Wife State
  const [wName, setWName] = useState("");
  const [wAvatar, setWAvatar] = useState("owl-purple");
  const [wGoal, setWGoal] = useState(91); // Approx 2.7L (Pregnant/Nursing recs vary, ~90-100oz is common)
  const [wQuick, setWQuick] = useState(16);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hName && wName) {
      onRegister(
        { name: hName, avatar: hAvatar, dailyGoal: hGoal, quickAddAmount: hQuick },
        { name: wName, avatar: wAvatar, dailyGoal: wGoal, quickAddAmount: wQuick }
      );
    }
  };

  const AvatarSelector = ({ selected, onSelect, color }: any) => (
    <div className="flex gap-2 overflow-x-auto pb-4 pt-2 scrollbar-hide">
      {AVATARS.map((av) => (
        <button
          key={av.id}
          type="button"
          onClick={() => onSelect(av.id)}
          className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-2 transition-all ${
            selected === av.id 
              ? `bg-${color}-100 border-${color}-600 scale-110 shadow-md` 
              : "bg-white border-transparent hover:bg-gray-50"
          }`}
        >
          <span className="text-3xl">{av.emoji}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex justify-center pattern-bg">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center bg-white/80 p-6 rounded-3xl backdrop-blur-md shadow-sm">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Setup Your Challenge</h1>
          <p className="text-gray-500">Customize your profiles for the 90-day hydration war.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Husband Card */}
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-lg border-t-8 border-sage-500">
            <h2 className="text-2xl font-bold text-sage-700 mb-6 flex items-center gap-2">
              <span>🧔</span> Husband Profile
            </h2>
            <div className="space-y-6">
              <div>
                <label className="label-text">Name</label>
                <input required value={hName} onChange={(e) => setHName(e.target.value)} className="input-field" placeholder="e.g. John" />
              </div>
              <div>
                <label className="label-text">Daily Goal (oz)</label>
                <div className="flex items-center gap-2">
                  <input type="number" required value={hGoal} onChange={(e) => setHGoal(Number(e.target.value))} className="input-field w-32" />
                  <span className="text-xs text-gray-400">Rec: ~101oz (39M)</span>
                </div>
              </div>
              <div>
                <label className="label-text">Quick Button Size (oz)</label>
                <input type="number" required value={hQuick} onChange={(e) => setHQuick(Number(e.target.value))} className="input-field w-32" />
              </div>
              <div>
                <label className="label-text mb-2 block">Choose Avatar</label>
                <AvatarSelector selected={hAvatar} onSelect={setHAvatar} color="sage" />
              </div>
            </div>
          </div>

          {/* Wife Card */}
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-lg border-t-8 border-furman-500">
            <h2 className="text-2xl font-bold text-furman-700 mb-6 flex items-center gap-2">
              <span>👩</span> Wife Profile
            </h2>
            <div className="space-y-6">
              <div>
                <label className="label-text">Name</label>
                <input required value={wName} onChange={(e) => setWName(e.target.value)} className="input-field" placeholder="e.g. Jane" />
              </div>
              <div>
                <label className="label-text">Daily Goal (oz)</label>
                <div className="flex items-center gap-2">
                  <input type="number" required value={wGoal} onChange={(e) => setWGoal(Number(e.target.value))} className="input-field w-32" />
                  <span className="text-xs text-gray-400">Rec: ~91oz (35F)</span>
                </div>
              </div>
              <div>
                <label className="label-text">Quick Button Size (oz)</label>
                <input type="number" required value={wQuick} onChange={(e) => setWQuick(Number(e.target.value))} className="input-field w-32" />
              </div>
              <div>
                <label className="label-text mb-2 block">Choose Avatar</label>
                <AvatarSelector selected={wAvatar} onSelect={setWAvatar} color="furman" />
              </div>
            </div>
          </div>

          <button type="submit" className="md:col-span-2 py-5 bg-black text-white text-xl font-bold rounded-2xl hover:scale-[1.01] transition-transform shadow-2xl">
            Start Competition 🚀
          </button>
        </form>
      </div>
    </div>
  );
}

function SettingsModal({ 
  isOpen, 
  onClose, 
  data, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  data: PlayerData; 
  onSave: (updates: Partial<PlayerData>) => void;
}) {
  const [goal, setGoal] = useState(data.dailyGoal);
  const [quick, setQuick] = useState(data.quickAddAmount);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={onClose}><X size={24} className="text-gray-400 hover:text-gray-600" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label-text">Daily Goal (oz)</label>
            <input 
              type="number" 
              value={goal} 
              onChange={(e) => setGoal(Number(e.target.value))} 
              className="input-field" 
            />
          </div>
          <div>
            <label className="label-text">Quick Add Button (oz)</label>
            <input 
              type="number" 
              value={quick} 
              onChange={(e) => setQuick(Number(e.target.value))} 
              className="input-field" 
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
          <button 
            onClick={() => {
              onSave({ dailyGoal: goal, quickAddAmount: quick });
              onClose();
            }}
            className="flex-1 py-3 bg-black text-white font-bold rounded-xl shadow-lg hover:scale-105 transition"
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function WaterTank({
  data,
  isMe,
  onLog,
  color, // 'sage' or 'furman'
}: {
  data: PlayerData;
  isMe: boolean;
  onLog?: (amount: number) => void;
  color: 'sage' | 'furman';
}) {
  const percentage = Math.min((data.dailyWater / data.dailyGoal) * 100, 100);
  const avatarEmoji = AVATARS.find((a) => a.id === data.avatar)?.emoji || "😎";
  const [animating, setAnimating] = useState(false);

  const handleAdd = () => {
    setAnimating(true);
    if (onLog) onLog(data.quickAddAmount);
    setTimeout(() => setAnimating(false), 1000);
  };

  const bgClass = color === 'sage' ? 'bg-sage-100' : 'bg-furman-100';
  const fillClass = color === 'sage' ? 'bg-sage-500' : 'bg-furman-500';
  const textClass = color === 'sage' ? 'text-sage-700' : 'text-furman-700';
  const borderClass = color === 'sage' ? 'border-sage-500' : 'border-furman-500';

  return (
    <div className={`relative flex flex-col items-center p-4 rounded-3xl transition-all ${isMe ? "bg-white/90 backdrop-blur-sm shadow-xl scale-100 z-10" : "bg-gray-50/80 scale-95 opacity-90 grayscale-[0.3]"}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 w-full">
        <div className="text-4xl filter drop-shadow-sm">{avatarEmoji}</div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-lg truncate ${textClass}`}>{data.name}</h3>
          <p className="text-xs text-gray-400 font-mono">
             {data.dailyWater} / {data.dailyGoal} oz
          </p>
        </div>
        {percentage >= 100 && <Trophy className="text-yellow-400 animate-bounce" size={24} fill="currentColor" />}
      </div>

      {/* Tank Container */}
      <div className={`relative w-32 h-64 ${bgClass} rounded-full border-4 border-white shadow-inner overflow-hidden ring-4 ring-opacity-10 ${color === 'sage' ? 'ring-sage-500' : 'ring-furman-500'}`}>
        
        {/* Liquid */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 ${fillClass} opacity-90`}
          initial={{ height: "0%" }}
          animate={{ height: `${percentage}%` }}
          transition={{ type: "spring", bounce: 0, duration: 1.5 }}
        >
          <div className="w-full h-3 bg-white opacity-20 animate-pulse absolute top-0" />
        </motion.div>

        {/* Droplet Animation */}
        <AnimatePresence>
          {animating && (
             <motion.div
               initial={{ y: -50, opacity: 1, scale: 0.5 }}
               animate={{ y: 150, opacity: 0, scale: 1.5 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.8 }}
               className={`absolute left-1/2 transform -translate-x-1/2 text-white z-20`}
             >
               <Droplet size={32} fill="white" />
             </motion.div>
          )}
        </AnimatePresence>

        {/* Percent Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-black text-2xl text-white drop-shadow-md mix-blend-overlay">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>

      {/* Controls (Only if Me) */}
      {isMe && onLog && (
        <button
          onClick={handleAdd}
          className={`mt-6 flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all hover:brightness-110 ${fillClass}`}
        >
          <Droplet size={20} fill="currentColor" />
          <span>Add {data.quickAddAmount}oz</span>
        </button>
      )}
    </div>
  );
}

function HistoryWidget({ history, players }: { history: DailyHistory[], players: { h: PlayerData, w: PlayerData } }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-gray-600 font-bold">
          <History size={18} />
          <span>Competition History</span>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      
      {isOpen && (
        <div className="p-4 max-h-64 overflow-y-auto space-y-2">
          {history.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">No history yet. Day 1 in progress!</p>
          ) : (
            [...history].reverse().map((day, i) => (
              <div key={i} className="flex items-center justify-between text-sm p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="font-mono text-gray-500">{day.date}</span>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-1 ${day.husbandWater >= day.husbandGoal ? "text-sage-600 font-bold" : "text-gray-400"}`}>
                    <span>🧔</span>
                    <span>{Math.min(100, Math.round((day.husbandWater / day.husbandGoal) * 100))}%</span>
                  </div>
                  <div className={`flex items-center gap-1 ${day.wifeWater >= day.wifeGoal ? "text-furman-600 font-bold" : "text-gray-400"}`}>
                    <span>👩</span>
                    <span>{Math.min(100, Math.round((day.wifeWater / day.wifeGoal) * 100))}%</span>
                  </div>
                  <div className="w-6 flex justify-center">
                    {day.winner === 'husband' && <span title="Husband Won">🏆</span>}
                    {day.winner === 'wife' && <span title="Wife Won">🏆</span>}
                    {day.winner === 'tie' && <span title="Tie" className="grayscale">🤝</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// --- Main App Container ---

export default function WaterWars() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentUser, setCurrentUser] = useState<PlayerType | null>(null);
  const [showCompetition, setShowCompetition] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Initial Load
  useEffect(() => {
    const saved = localStorage.getItem("hydration_challenge_state");
    if (saved) {
      const parsed: GameState = JSON.parse(saved);
      // Ensure history exists if loading from old version
      if (!parsed.history) parsed.history = [];
      setGameState(parsed);
    }
    setLoading(false);
    setFactIndex(Math.floor(Math.random() * FACTS.length));
  }, []);

  // Daily Reset & Persistence
  useEffect(() => {
    if (!gameState) return;

    const today = format(new Date(), "yyyy-MM-dd");
    
    // Check for day change
    if (gameState.lastLogDate !== today && gameState.isRegistered) {
      setGameState((prev) => {
        if (!prev) return null;
        
        // Archive yesterday
        const hMet = prev.husband.dailyWater >= prev.husband.dailyGoal;
        const wMet = prev.wife.dailyWater >= prev.wife.dailyGoal;
        let winner: PlayerType | "tie" | null = null;
        if (hMet && wMet) winner = "tie";
        else if (hMet) winner = "husband";
        else if (wMet) winner = "wife";

        const historyEntry: DailyHistory = {
          date: prev.lastLogDate,
          winner,
          husbandWater: prev.husband.dailyWater,
          wifeWater: prev.wife.dailyWater,
          husbandGoal: prev.husband.dailyGoal,
          wifeGoal: prev.wife.dailyGoal,
        };

        return {
          ...prev,
          lastLogDate: today,
          history: [...prev.history, historyEntry],
          husband: {
            ...prev.husband,
            dailyWater: 0,
            totalWins: prev.husband.totalWins + (winner === 'husband' ? 1 : 0),
          },
          wife: {
            ...prev.wife,
            dailyWater: 0,
            totalWins: prev.wife.totalWins + (winner === 'wife' ? 1 : 0),
          },
        };
      });
    }

    // Persist
    localStorage.setItem("hydration_challenge_state", JSON.stringify(gameState));
  }, [gameState]);

  const handleRegister = (hData: any, wData: any) => {
    const newState: GameState = {
      isRegistered: true,
      startDate: new Date().toISOString(),
      lastLogDate: format(new Date(), "yyyy-MM-dd"),
      history: [],
      husband: { ...hData, dailyWater: 0, totalWins: 0 },
      wife: { ...wData, dailyWater: 0, totalWins: 0 },
    };
    setGameState(newState);
    // Don't log in immediately, let them choose
  };

  const handleLog = (amount: number) => {
    if (!currentUser || !gameState) return;
    
    setGameState((prev) => {
      if (!prev) return null;
      const target = prev[currentUser];
      const newValue = target.dailyWater + amount;
      
      // Celebration check
      if (target.dailyWater < target.dailyGoal && newValue >= target.dailyGoal) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: currentUser === "husband" ? ['#557c55', '#a3b18a'] : ['#582c83', '#b49dd5']
        });
      }

      return {
        ...prev,
        [currentUser]: {
          ...target,
          dailyWater: newValue,
        },
      };
    });
  };

  const handleSettingsUpdate = (updates: Partial<PlayerData>) => {
    if (!currentUser || !gameState) return;
    setGameState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [currentUser]: { ...prev[currentUser], ...updates },
      };
    });
  };

  // --- Render Logic ---

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  if (!gameState || !gameState.isRegistered) {
    return <Registration onRegister={handleRegister} />;
  }

  if (!currentUser) {
    return <IdentityScreen gameState={gameState} onSelectIdentity={setCurrentUser} />;
  }

  const endDate = addDays(new Date(gameState.startDate), GAME_DURATION_DAYS);
  const myData = gameState[currentUser];
  const opponentRole = currentUser === 'husband' ? 'wife' : 'husband';
  const opponentData = gameState[opponentRole];

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-500 pattern-bg ${currentUser === 'husband' ? 'pattern-sage' : 'pattern-furman'}`}>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentUser(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Logout">
              <LogOut size={18} className="text-gray-500" />
            </button>
            <h1 className="font-bold text-gray-800">Day {differenceInDays(new Date(), new Date(gameState.startDate)) + 1}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              title="Settings"
            >
              <Settings size={18} />
            </button>
            <div className="text-xs font-mono text-gray-400 border-l pl-2 border-gray-300">
               {currentUser === 'husband' ? 'Husband' : 'Wife'} View
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-6">

        {/* Countdown */}
        <section>
          <Countdown endDate={endDate} />
        </section>

        {/* Knowledge Nugget - MOVED UP */}
        <section className="bg-gradient-to-br from-yellow-50/90 to-orange-50/90 backdrop-blur-sm p-5 rounded-2xl border border-orange-100 shadow-sm">
          <div className="flex items-start gap-3 relative z-10">
            <div className="bg-white p-2 rounded-full shadow-sm flex-shrink-0">
              <Sparkles className="text-yellow-500" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-orange-800 text-sm mb-1 uppercase tracking-wide">Daily Nugget</h3>
              <p className="text-orange-900 leading-relaxed text-sm italic">
                "{FACTS[factIndex]}"
              </p>
            </div>
          </div>
          <button 
             onClick={() => setFactIndex(prev => (prev + 1) % FACTS.length)}
             className="mt-3 ml-auto text-xs font-bold text-orange-400 hover:text-orange-600 flex items-center gap-1 w-max"
          >
            <RefreshCw size={12} /> Next
          </button>
        </section>

        {/* Main Tracker Area */}
        <section className="flex flex-col items-center gap-6">
          
          {/* MY TRACKER (Large) */}
          <div className="w-full">
            <WaterTank 
              data={myData} 
              isMe={true} 
              onLog={handleLog}
              color={currentUser === 'husband' ? 'sage' : 'furman'}
            />
          </div>

          {/* COMPETITION WIDGET */}
          <div className="w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
             <button 
               onClick={() => setShowCompetition(!showCompetition)}
               className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
             >
               <div className="flex items-center gap-2">
                 {showCompetition ? <EyeOff size={18} className="text-gray-500"/> : <Eye size={18} className="text-gray-500"/>}
                 <span className="font-bold text-gray-700">Opponent Status</span>
               </div>
               <div className="text-xs text-gray-400">
                 {showCompetition ? "Hide" : "Reveal"}
               </div>
             </button>

             <AnimatePresence>
               {showCompetition && (
                 <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   className="p-6 bg-gray-50/50 border-t border-gray-200 flex justify-center"
                 >
                   <WaterTank 
                     data={opponentData} 
                     isMe={false} 
                     color={opponentRole === 'husband' ? 'sage' : 'furman'}
                   />
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </section>

        {/* History */}
        <HistoryWidget history={gameState.history} players={{ h: gameState.husband, w: gameState.wife }} />

        {/* Footer Reset */}
        <div className="text-center pt-8 pb-12 flex flex-col items-center gap-4">
           <button 
             onClick={() => {
               if (gameState) {
                  // Manually trigger the "New Day" logic
                  const currentDate = gameState.lastLogDate;
                  const nextDay = format(addDays(new Date(currentDate), 1), "yyyy-MM-dd");

                  const hMet = gameState.husband.dailyWater >= gameState.husband.dailyGoal;
                  const wMet = gameState.wife.dailyWater >= gameState.wife.dailyGoal;
                  let winner: PlayerType | "tie" | null = null;
                  if (hMet && wMet) winner = "tie";
                  else if (hMet) winner = "husband";
                  else if (wMet) winner = "wife";

                  const historyEntry: DailyHistory = {
                    date: currentDate,
                    winner,
                    husbandWater: gameState.husband.dailyWater,
                    wifeWater: gameState.wife.dailyWater,
                    husbandGoal: gameState.husband.dailyGoal,
                    wifeGoal: gameState.wife.dailyGoal,
                  };

                  const newState = {
                    ...gameState,
                    lastLogDate: nextDay,
                    history: [...gameState.history, historyEntry],
                    husband: {
                      ...gameState.husband,
                      dailyWater: 0,
                      totalWins: gameState.husband.totalWins + (winner === 'husband' ? 1 : 0),
                    },
                    wife: {
                      ...gameState.wife,
                      dailyWater: 0,
                      totalWins: gameState.wife.totalWins + (winner === 'wife' ? 1 : 0),
                    },
                  };

                  setGameState(newState);
                  localStorage.setItem("hydration_challenge_state", JSON.stringify(newState));
               }
             }}
             className="text-xs font-mono text-purple-400 hover:text-purple-600 transition-colors bg-purple-50 px-3 py-1 rounded-full border border-purple-100"
           >
             Dev: Fast Forward Day ⏭️
           </button>

           <button 
             onClick={() => {
               if (confirm("Reset the entire game? This deletes all history.")) {
                 localStorage.removeItem("hydration_challenge_state");
                 window.location.reload();
               }
             }}
             className="text-xs text-gray-400 hover:text-red-500 transition-colors bg-white/50 px-3 py-1 rounded-full"
           >
             Reset Game Data
           </button>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        data={myData} 
        onSave={handleSettingsUpdate}
      />

      {/* CSS for input fields (Tailwind helper) */}
      <style jsx global>{`
        .label-text {
          @apply block text-sm font-bold text-gray-600 mb-1 uppercase tracking-wide;
        }
        .input-field {
          @apply w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition bg-gray-50;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .pattern-bg {
          background-image: radial-gradient(#000 0.5px, transparent 0.5px);
          background-size: 20px 20px;
        }
        .pattern-sage {
          background-color: #f4f7f4;
          background-image: radial-gradient(#557c55 0.5px, transparent 0.5px);
        }
        .pattern-furman {
          background-color: #f2f0f9;
          background-image: radial-gradient(#582c83 0.5px, transparent 0.5px);
        }
      `}</style>
    </div>
  );
}
