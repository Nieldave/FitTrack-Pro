import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, Radio, Sparkles } from 'lucide-react';
import { spotifyService, SpotifyPlaylist, SpotifyTrack } from '../services/spotifyService';

export const SpotifyPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<SpotifyPlaylist | null>(null);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(30);

  useEffect(() => {
    spotifyService.getWorkoutPlaylists().then((data) => {
      setPlaylists(data);
      if (data.length > 0) {
        setActivePlaylist(data[0]);
        setCurrentTrack(data[0].tracks[0]);
      }
    });
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSelectPlaylist = (pl: SpotifyPlaylist) => {
    setActivePlaylist(pl);
    if (pl.tracks.length > 0) {
      setCurrentTrack(pl.tracks[0]);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    if (!activePlaylist) return;
    const currentIndex = activePlaylist.tracks.findIndex((t) => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % activePlaylist.tracks.length;
    setCurrentTrack(activePlaylist.tracks[nextIndex]);
    setProgress(0);
  };

  const handlePrevTrack = () => {
    if (!activePlaylist) return;
    const currentIndex = activePlaylist.tracks.findIndex((t) => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + activePlaylist.tracks.length) % activePlaylist.tracks.length;
    setCurrentTrack(activePlaylist.tracks[prevIndex]);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Spotify Integration
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Music className="w-6 h-6 text-emerald-500" />
          <span>Workout Music Companion</span>
        </h2>
        <p className="text-sm text-zinc-400">
          Sync high-energy Spotify audio streams directly to your training sessions.
        </p>
      </div>

      {/* Active Player Deck */}
      {currentTrack && (
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-zinc-900 border border-emerald-500/30 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                <Radio className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  NOW PLAYING • {activePlaylist?.name}
                </div>
                <h3 className="text-xl font-black text-white">{currentTrack.title}</h3>
                <p className="text-xs text-zinc-400">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Play controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevTrack}
                className="p-3 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold shadow-lg shadow-emerald-500/20"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-zinc-950" /> : <Play className="w-6 h-6 fill-zinc-950" />}
              </button>

              <button
                onClick={handleNextTrack}
                className="p-3 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Track progress bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>0:{progress < 10 ? `0${progress}` : progress}</span>
              <span>{currentTrack.duration}</span>
            </div>
          </div>
        </div>
      )}

      {/* Playlist Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Curated Fitness Playlists</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((pl) => {
            const isSelected = activePlaylist?.id === pl.id;
            return (
              <div
                key={pl.id}
                onClick={() => handleSelectPlaylist(pl)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer shadow-xl ${
                  isSelected
                    ? 'bg-emerald-950/30 border-emerald-500/50'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-base text-white">{pl.name}</h4>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-zinc-800 text-emerald-400 border border-zinc-700">
                    {pl.genre}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mb-4">{pl.description}</p>

                <div className="space-y-2 pt-3 border-t border-zinc-800">
                  {pl.tracks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-zinc-950/60"
                    >
                      <span className="font-semibold text-zinc-300 truncate max-w-[180px]">{t.title}</span>
                      <span className="text-[10px] text-zinc-500">{t.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
