"use client"

import { useCallback, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type MediaSliderProps = {
  value: number
  max: number
  onChange: (value: number) => void
  onCommit?: (value: number) => void
  ariaLabel: string
  className?: string
}

export function MediaSlider({
  value,
  max,
  onChange,
  onCommit,
  ariaLabel,
  className,
}: MediaSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

  const valueFromPointer = useCallback(
    (clientX: number) => {
      const track = trackRef.current
      if (!track) return 0
      const rect = track.getBoundingClientRect()
      const ratio = (clientX - rect.left) / rect.width
      return Math.min(max, Math.max(0, ratio * max))
    },
    [max],
  )

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    onChange(valueFromPointer(e.clientX))
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    onChange(valueFromPointer(e.clientX))
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    setDragging(false)
    onCommit?.(valueFromPointer(e.clientX))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = max / 20 || 1
    let next = value
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(max, value + step)
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(0, value - step)
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = max
    else return
    e.preventDefault()
    onChange(next)
    onCommit?.(next)
  }

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={Math.round(max)}
      aria-valuenow={Math.round(value)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex h-4 cursor-pointer touch-none items-center outline-none",
        className,
      )}
    >
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div
        className={cn(
          "absolute size-3.5 -translate-x-1/2 rounded-full bg-primary shadow-md ring-2 ring-background transition-opacity",
          dragging ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
        )}
        style={{ left: `${percent}%` }}
      />
    </div>
  )
}
