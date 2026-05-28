export default function LeadLoading() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] px-4 py-6 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="border-b border-zinc-200 pb-6">
          <div className="h-4 w-24 rounded bg-zinc-200" />
          <div className="mt-4 h-8 w-56 rounded bg-zinc-200" />
          <div className="mt-3 h-4 w-72 rounded bg-zinc-100" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-20 rounded-md border border-zinc-200 bg-white"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
