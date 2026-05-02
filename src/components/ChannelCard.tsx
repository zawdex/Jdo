import React from "react";
import { Channel } from "../types";
import { Tv } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

interface ChannelCardProps {
  channel: Channel;
  safeId?: string;
  key?: React.Key;
}

export default function ChannelCard({ channel, safeId }: ChannelCardProps) {
  const finalSafeId = safeId || btoa(channel.name);
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-neutral-900/50 border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-4 transition-colors hover:border-neon-green/30"
    >
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center p-2">
        <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-bold text-center">{channel.name}</span>
        <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
          <Tv size={10} />
          Live TV
        </div>
      </div>

      <Link 
        to={`/tv/${finalSafeId}`}
        state={{ channel }}
        className="w-full h-10 bg-white/5 text-white/50 hover:bg-neon-green hover:text-black font-bold rounded-lg transition-all flex items-center justify-center text-xs"
      >
        Watch
      </Link>
    </motion.div>
  );
}
