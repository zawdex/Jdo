import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home as HomeIcon, Tv, Heart, Search, Menu, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Match, TV_CHANNELS, Channel } from "./types";

// Components
import MatchCard from "./components/MatchCard";
import ChannelCard from "./components/ChannelCard";
import HlsPlayer from "./components/HlsPlayer";

function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Live Matches", path: "/", icon: HomeIcon },
    { name: "Live TV", path: "/tv", icon: Tv },
    { name: "Favorites", path: "/favorites", icon: Heart },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-black/80 backdrop-blur-md py-3 border-b border-white/5" : "bg-transparent py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-neon-green rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
            <TrophyIcon className="text-black" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">
            Kick<span className="text-neon-green">Off</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${
                  isActive ? "text-neon-green" : "text-neutral-400 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <button className="md:hidden text-white">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}

function TrophyIcon({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      className={className} 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.44.98.94 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/matches")
      .then(res => res.json())
      .then(data => {
        setMatches(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const safeBtoa = (str: string) => btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) => 
    String.fromCharCode(parseInt(p1, 16))
  ));

  const filteredMatches = matches.filter(m => 
    m.home_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.away_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Live Matches</h1>
          <p className="text-neutral-500 font-medium tracking-tight">Real-time streams from the best leagues around the world.</p>
        </div>
        
        <div className="relative group max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-neon-green transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search teams or leagues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-white/5 py-3 pl-12 pr-6 rounded-2xl focus:outline-none focus:border-neon-green/50 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-neutral-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match, i) => (
            <MatchCard key={i} match={match} />
          ))}
          {filteredMatches.length === 0 && (
            <div className="col-span-full py-20 text-center text-neutral-500 border border-dashed border-white/10 rounded-3xl">
              No matches found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Channels() {
  const safeBtoa = (str: string) => btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) => 
    String.fromCharCode(parseInt(p1, 16))
  ));

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Live TV</h1>
        <p className="text-neutral-500 font-medium tracking-tight">Your favorite local and sports channels, live 24/7.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {TV_CHANNELS.map((channel, i) => (
          <div key={i}>
             <ChannelCard channel={channel} safeId={safeBtoa(channel.name)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchPlayer() {
  const location = useLocation();
  const match: Match = location.state?.match;
  const [activeStream, setActiveStream] = useState(match?.authors[0] || { name: "Default", url: match?.url });

  if (!match) return <div className="pt-32 text-center text-neutral-500">No match data found. Return to Home.</div>;

  return (
    <div className="pt-24 pb-24 px-6 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={match.home_logo} className="w-10 h-10 object-contain" />
          <span className="text-xl font-black italic">{match.home_name.trim()}</span>
          <span className="text-neutral-700 mx-2">vs</span>
          <span className="text-xl font-black italic">{match.away_name.trim()}</span>
          <img src={match.away_logo} className="w-10 h-10 object-contain" />
        </div>
        <div className="px-3 py-1 bg-neon-green/10 text-neon-green text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          Streaming
        </div>
      </div>

      <HlsPlayer src={activeStream.url} />

      <div className="mt-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4">Switch Server</h3>
        <div className="flex flex-wrap gap-3">
          {match.authors.map((author, i) => (
            <button 
              key={i}
              onClick={() => setActiveStream(author)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                activeStream.url === author.url 
                ? "bg-neon-green border-neon-green text-black font-bold" 
                : "bg-neutral-900 border-white/5 text-neutral-400 hover:border-white/20"
              }`}
            >
              <img src={author.logo} className="w-6 h-6 rounded-lg object-cover" referrerPolicy="no-referrer" />
              <span className="text-xs uppercase tracking-tighter">{author.name.trim()}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 p-6 bg-neutral-900 border border-white/5 rounded-2xl flex items-start gap-4">
        <Info className="text-neon-blue mt-1 shrink-0" size={20} />
        <div className="text-sm text-neutral-400 leading-relaxed">
          <strong className="text-white block mb-1">Having trouble with the stream?</strong>
          Try switching to a different server above. Public streams can sometimes lag or expire. Quality is adaptive based on your internet connection.
        </div>
      </div>
    </div>
  );
}

function TVPlayer() {
  const location = useLocation();
  const channel: Channel = location.state?.channel;

  if (!channel) return <div className="pt-32 text-center text-neutral-500">No channel data found. Return to Live TV.</div>;

  return (
    <div className="pt-24 pb-24 px-6 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 rounded-xl p-2">
            <img src={channel.logo} className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">{channel.name}</h1>
        </div>
        <div className="px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2 border border-red-500/20">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Live
        </div>
      </div>

      <HlsPlayer src={channel.url} />
    </div>
  );
}

function Favorites() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl">
        <Heart className="mx-auto mb-4 text-neutral-700" size={48} />
        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">My Favorites</h2>
        <p className="text-neutral-500 font-medium">Your saved teams and matches will appear here.</p>
        <p className="text-xs text-neutral-700 mt-4 uppercase tracking-widest font-bold">(Coming Soon)</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black selection:bg-neon-green selection:text-black">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tv" element={<Channels />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/match/:id" element={<MatchPlayer />} />
            <Route path="/tv/:id" element={<TVPlayer />} />
          </Routes>
        </main>
        
        {/* Mobile Navbar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/5 py-4 px-8 flex justify-between items-center z-50">
          <Link to="/" className="text-neutral-400 p-2"><HomeIcon size={24} /></Link>
          <Link to="/tv" className="text-neutral-400 p-2"><Tv size={24} /></Link>
          <Link to="/favorites" className="text-neutral-400 p-2"><Heart size={24} /></Link>
        </div>
      </div>
    </BrowserRouter>
  );
}
