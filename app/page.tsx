import { AudioPlayer } from "@/components/audio-player"

export default function Page() {
  return (
    <main className="dark relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-4">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 -top-24 size-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 size-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <AudioPlayer />
    </main>
  )
}
