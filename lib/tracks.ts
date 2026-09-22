export type Track = {
  id: string
  title: string
  artist: string
  cover: string
  src: string
}

// Royalty-free sample audio from SoundHelix used for demo playback.
export const tracks: Track[] = [
  {
    id: "midnight-drive",
    title: "Midnight Drive",
    artist: "Neon Coast",
    cover: "/covers/midnight-drive.png",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "golden-hour",
    title: "Golden Hour",
    artist: "Sunset Avenue",
    cover: "/covers/golden-hour.png",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "deep-focus",
    title: "Deep Focus",
    artist: "Tidal Waves",
    cover: "/covers/deep-focus.png",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: "forest-echoes",
    title: "Forest Echoes",
    artist: "Green Room",
    cover: "/covers/forest-echoes.png",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: "city-lights",
    title: "City Lights",
    artist: "Metro Bloom",
    cover: "/covers/city-lights.png",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
]

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}
