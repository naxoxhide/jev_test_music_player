"use client"

import Image from "next/image"
import { Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Track } from "@/lib/tracks"

type PlaylistProps = {
  tracks: Track[]
  currentIndex: number
  isPlaying: boolean
  onSelect: (index: number) => void
}

export function Playlist({ tracks, currentIndex, isPlaying, onSelect }: PlaylistProps) {
  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center justify-between px-2">
        <h2 className="text-sm font-semibold text-foreground">Up Next</h2>
        <span className="text-xs text-muted-foreground">{tracks.length} tracks</span>
      </div>
      <ul className="flex flex-col gap-1">
        {tracks.map((track, index) => {
          const active = index === currentIndex
          return (
            <li key={track.id}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors",
                  active ? "bg-white/10" : "hover:bg-white/5",
                )}
              >
                <div className="relative size-11 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={track.cover || "/placeholder.svg"}
                    alt={`${track.title} cover art`}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity",
                      active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                    )}
                  >
                    {active && isPlaying ? (
                      <Pause className="size-4 text-white" />
                    ) : (
                      <Play className="size-4 text-white" />
                    )}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm font-medium",
                      active ? "text-primary" : "text-foreground",
                    )}
                  >
                    {track.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
