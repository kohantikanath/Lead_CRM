export default function LeadsLoading() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] px-4 py-6 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="border-b border-zinc-200 pb-6">
          <div className="h-4 w-28 rounded bg-zinc-200" />
          <div className="mt-3 h-8 w-40 rounded bg-zinc-200" />
        </div>
        <section className="mt-6 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="h-4 w-24 rounded bg-zinc-200" />
              <div className="mt-2 h-4 w-48 rounded bg-zinc-100" />
            </div>
            <div className="h-10 w-72 rounded-md bg-zinc-100" />
          </div>
          <div className="border-t border-zinc-200">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-4 border-b border-zinc-100 px-5 py-4"
              >
                <div className="col-span-2 h-9 rounded bg-zinc-100" />
                <div className="h-9 rounded bg-zinc-100" />
                <div className="h-9 rounded bg-zinc-100" />
                <div className="h-9 rounded bg-zinc-100" />
                <div className="h-9 rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
