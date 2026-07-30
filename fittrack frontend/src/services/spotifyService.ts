import { api } from '../lib/axios';
import { SpotifyTrack } from '../types';

export type { SpotifyTrack };

export interface SpotifyPlaylist {
  id: string;
  name: string;
  genre: string;
  description: string;
  tracks: Array<{
    id: string;
    title: string;
    artist: string;
    duration: string;
  }>;
}

export interface SpotifyState {
  isConnected: boolean;
  activeDevice: string | null;
  isPlaying: boolean;
  currentTrack: SpotifyTrack | null;
}

const MOCK_PLAYLISTS: SpotifyPlaylist[] = [
  {
    id: 'pl-1',
    name: 'Heavy Lifting Metal & Hardcore',
    genre: 'METAL',
    description: 'High gain guitars, aggressive drums, and raw energy for heavy squat & deadlift sets.',
    tracks: [
      { id: '1', title: 'Eye of the Tiger', artist: 'Survivor', duration: '4:05' },
      { id: '2', title: 'Till I Collapse', artist: 'Eminem', duration: '4:58' },
      { id: '3', title: 'Walk', artist: 'Pantera', duration: '5:15' }
    ]
  },
  {
    id: 'pl-2',
    name: 'High BPM Cardio Sprints',
    genre: 'ELECTRONIC',
    description: '140+ BPM driving electronic beats designed for treadmill sprints & HIIT cycles.',
    tracks: [
      { id: '4', title: "Can't Hold Us", artist: 'Macklemore', duration: '4:18' },
      { id: '5', title: 'Stronger', artist: 'Kanye West', duration: '5:12' },
      { id: '6', title: 'Titanium', artist: 'David Guetta', duration: '4:05' }
    ]
  },
  {
    id: 'pl-3',
    name: 'Cyberpunk Workout Beats',
    genre: 'SYNTHWAVE',
    description: 'Dark synthwave grooves for rhythm-focused bodyweight & hypertrophy routines.',
    tracks: [
      { id: '7', title: 'Turbo Killer', artist: 'Carpenter Brut', duration: '3:28' },
      { id: '8', title: 'Tech Noir', artist: 'GUNSHIP', duration: '4:57' }
    ]
  }
];

export const spotifyService = {
  async getTracks(): Promise<SpotifyTrack[]> {
    try {
      const response = await api.get<SpotifyTrack[]>('/spotify');
      return response.data;
    } catch {
      return [];
    }
  },

  async getWorkoutPlaylists(): Promise<SpotifyPlaylist[]> {
    return MOCK_PLAYLISTS;
  },

  async togglePlay(trackUri?: string): Promise<{ playing: boolean }> {
    return { playing: true };
  }
};
