import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Maximize, Minimize, Play, Pause, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HlsPlayerProps {
  src: string;
  autoPlay?: boolean;
}

export default function HlsPlayer({ src, autoPlay = true }: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const initPlayer = () => {
    if (!videoRef.current) return;
    setIsLoading(true);
    setError(null);

    // Use the backend proxy for the stream
    const safeBtoa = (str: string) => btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) => 
      String.fromCharCode(parseInt(p1, 16))
    ));
    const proxiedUrl = `/api/stream?url=${safeBtoa(src)}`;

    if (Hls.isSupported()) {
      if (hlsRef.current) hlsRef.current.destroy();
      
      const hls = new Hls({
        enableWorker: true,
      });
      hlsRef.current = hls;

      hls.loadSource(proxiedUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (autoPlay) {
          videoRef.current?.play().catch(() => {
             // Autoplay might be blocked by browser
          });
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError("Network error. Retrying...");
              hls.startLoad();
              setRetryCount(prev => prev + 1);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError("Media error. Recovering...");
              hls.recoverMediaError();
              break;
            default:
              setError("Fatal error. Stream might be offline.");
              hls.destroy();
              break;
          }
        }
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari native support
      videoRef.current.src = proxiedUrl;
      videoRef.current.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        if (autoPlay) videoRef.current?.play();
      });
    }
  };

  useEffect(() => {
    initPlayer();
    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [src, retryCount]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative aspect-video bg-neutral-900 rounded-xl overflow-hidden group border border-white/5"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
          >
            <RefreshCw className="w-10 h-10 text-neon-green animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Overlay */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 text-center p-4">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => setRetryCount(prev => prev + 1)}
            className="px-4 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-opacity-80 transition-colors"
          >
            Retry Stream
          </button>
        </div>
      )}

      {/* Custom Controls */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent",
        "transition-opacity duration-300 opacity-0 group-hover:opacity-100",
        isFullscreen && "opacity-100"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-neon-green transition-colors">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button onClick={toggleMute} className="text-white hover:text-neon-green transition-colors">
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-500">Live</span>
            </div>
            <button onClick={toggleFullscreen} className="text-white hover:text-neon-green transition-colors">
              {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
