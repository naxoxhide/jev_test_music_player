"use client"

import { Volume, Volume1, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MediaSlider } from "@/components/media-slider"

type VolumeControlProps = {
  volume: number
  muted: boolean
  onVolumeChange: (value: number) => void
  onToggleMute: () => void
}

export function VolumeControl({ volume, muted, onVolumeChange, onToggleMute }: VolumeControlProps) {
  const effective = muted ? 0 : volume

  const Icon = effective === 0 ? VolumeX : effective < 0.34 ? Volume : effective < 0.67 ? Volume1 : Volume2

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="size-9 shrink-0 text-foreground/80 hover:text-foreground"
      >
        <Icon className="size-5" />
      </Button>
      <MediaSlider
        value={effective}
        max={1}
        onChange={onVolumeChange}
        ariaLabel="Volume"
        className="w-24"
      />
    </div>
  )
}
