export default function JournalLoading(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-obsidian/60 backdrop-blur-lg border-b border-obsidian-300/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div>
            <div className="h-6 w-24 rounded bg-obsidian-300/30 animate-pulse" />
            <div className="h-3 w-16 rounded bg-obsidian-300/20 animate-pulse mt-1.5" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-28 rounded-xl bg-obsidian-300/30 animate-pulse" />
            <div className="h-9 w-9 rounded-lg bg-obsidian-300/20 animate-pulse" />
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="h-3 w-16 rounded bg-obsidian-300/20 animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-obsidian-200/30 border border-obsidian-400/20 rounded-xl p-5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-5 w-48 rounded bg-obsidian-300/30 animate-pulse mb-3" />
              <div className="h-3 w-full rounded bg-obsidian-300/15 animate-pulse mb-2" />
              <div className="h-3 w-2/3 rounded bg-obsidian-300/15 animate-pulse mb-4" />
              <div className="flex items-center gap-2">
                <div className="h-3 w-20 rounded bg-obsidian-300/10 animate-pulse" />
                <div className="h-3 w-12 rounded bg-obsidian-300/10 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
