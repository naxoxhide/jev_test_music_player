"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MediaSlider } from "@/components/media-slider"
import { VolumeControl } from "@/components/volume-control"
import { Playlist } from "@/components/playlist"
import { formatTime, tracks } from "@/lib/tracks"
import { cn } from "@/lib/utils"

type RepeatMode = "off" | "all" | "one"

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState<RepeatMode>("off")

  const currentTrack = tracks[currentIndex]

  const nextIndex = useCallback(() => {
    if (shuffle && tracks.length > 1) {
      let n = currentIndex
      while (n === currentIndex) n = Math.floor(Math.random() * tracks.length)
      return n
    }
    return (currentIndex + 1) % tracks.length
  }, [currentIndex, shuffle])

  const prevIndex = useCallback(
    () => (currentIndex - 1 + tracks.length) % tracks.length,
    [currentIndex],
  )

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => setIsPlaying(false))
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) play()
    else audio.pause()
  }, [play])

  const selectTrack = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsPlaying(true)
  }, [])

  const handleNext = useCallback(() => selectTrack(nextIndex()), [nextIndex, selectTrack])
  const handlePrev = useCallback(() => {
    const audio = audioRef.current
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }
    selectTrack(prevIndex())
  }, [prevIndex, selectTrack])

  // Keep volume/mute in sync with the audio element.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    audio.muted = muted
  }, [volume, muted])

  // When the track changes, load and resume playback if we were playing.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(0)
    if (isPlaying) play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  const handleEnded = useCallback(() => {
    if (repeat === "one") {
      const audio = audioRef.current
      if (audio) {
        audio.currentTime = 0
        play()
      }
      return
    }
    if (repeat === "off" && !shuffle && currentIndex === tracks.length - 1) {
      setIsPlaying(false)
      return
    }
    selectTrack(nextIndex())
  }, [repeat, shuffle, currentIndex, nextIndex, play, selectTrack])

  const cycleRepeat = () =>
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"))

  // Media keys / spacebar support.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("input, textarea, [role='slider']")) return
      if (e.code === "Space") {
        e.preventDefault()
        togglePlay()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [togglePlay])

  return (
    <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-card/80 shadow-2xl backdrop-blur-xl">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
      />

      <div className="p-6">
        {/* Artwork */}
        <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={currentTrack.cover || "/placeholder.svg"}
            alt={`${currentTrack.title} cover art`}
            fill
            priority
            sizes="(max-width: 480px) 90vw, 320px"
            className={cn(
              "object-cover transition-transform duration-700",
              isPlaying ? "scale-105" : "scale-100",
            )}
          />
        </div>

        {/* Track info */}
        <div className="mt-6 text-center">
          <h1 className="text-balance text-xl font-bold text-foreground">{currentTrack.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{currentTrack.artist}</p>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <MediaSlider
            value={currentTime}
            max={duration}
            onChange={(v) => setCurrentTime(v)}
            onCommit={(v) => {
              if (audioRef.current) audioRef.current.currentTime = v
            }}
            ariaLabel="Seek"
          />
          <div className="mt-1.5 flex justify-between text-xs tabular-nums text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShuffle((s) => !s)}
            aria-label="Shuffle"
            aria-pressed={shuffle}
            className={cn("size-9", shuffle ? "text-primary" : "text-foreground/70 hover:text-foreground")}
          >
            <Shuffle className="size-5" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              aria-label="Previous track"
              className="size-11 text-foreground hover:text-foreground"
            >
              <SkipBack className="size-6 fill-current" />
            </Button>

            <Button
              size="icon"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="size-14 rounded-full shadow-lg"
            >
              {isPlaying ? (
                <Pause className="size-7 fill-current" />
              ) : (
                <Play className="size-7 translate-x-0.5 fill-current" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              aria-label="Next track"
              className="size-11 text-foreground hover:text-foreground"
            >
              <SkipForward className="size-6 fill-current" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={cycleRepeat}
            aria-label={`Repeat: ${repeat}`}
            aria-pressed={repeat !== "off"}
            className={cn("size-9", repeat !== "off" ? "text-primary" : "text-foreground/70 hover:text-foreground")}
          >
            {repeat === "one" ? <Repeat1 className="size-5" /> : <Repeat className="size-5" />}
          </Button>
        </div>

        {/* Volume */}
        <div className="mt-4 flex justify-center">
          <VolumeControl
            volume={volume}
            muted={muted}
            onVolumeChange={(v) => {
              setVolume(v)
              if (v > 0) setMuted(false)
            }}
            onToggleMute={() => setMuted((m) => !m)}
          />
        </div>
      </div>

      {/* Playlist */}
      <div className="border-t border-white/10 bg-black/20 p-4">
        <Playlist
          tracks={tracks}
          currentIndex={currentIndex}
          isPlaying={isPlaying}
          onSelect={selectTrack}
        />
      </div>
    </div>
  )
}
