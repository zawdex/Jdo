import React from "react";
import { Match } from "../types";
import { Play, Calendar, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

interface MatchCardProps {
  match: Match;
  key?: React.Key;
}

export default function MatchCard({ match }: MatchCardProps) {
  const isLive = match.score !== "vs";
  
  const safeBtoa = (str: string) => btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) => 
    String.fromCharCode(parseInt(p1, 16))
  ));

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden relative group"
    >
      <div className="absolute top-4 left-4 z-10">
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
          isLive ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-red-500 animate-pulse" : "bg-blue-500"}`} />
          {isLive ? "Live" : "Upcoming"}
        </div>
      </div>

      <div className="p-6 pt-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col items-center gap-3 flex-1">
            <img src={match.home_logo} alt={match.home_name} className="w-16 h-16 object-contain" referrerPolicy="no-referrer" />
            <span className="text-sm font-semibold text-center line-clamp-1">{match.home_name}</span>
          </div>

          <div className="flex flex-col items-center gap-1 px-4">
            <div className="text-3xl font-black tracking-tighter text-white">
              {match.score === "vs" ? "VS" : match.score}
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 flex-1">
            <img src={match.away_logo} alt={match.away_name} className="w-16 h-16 object-contain" referrerPolicy="no-referrer" />
            <span className="text-sm font-semibold text-center line-clamp-1">{match.away_name}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Trophy size={14} className="text-neon-green" />
            <span className="line-clamp-1 italic">{match.label.trim()}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Calendar size={14} />
            <span>{match.time}</span>
          </div>
        </div>

        <Link 
          to={`/match/${safeBtoa(match.home_name + match.away_name)}`}
          state={{ match }}
          className="mt-6 w-full py-3 bg-neon-green text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all transition-colors active:scale-95"
        >
          <Play size={18} fill="currentColor" />
          Watch Stream
        </Link>
      </div>
    </motion.div>
  );
}
