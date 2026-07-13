export default function AssetsLoading() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] px-6 py-8 text-[#10224f]">
      <div className="mx-auto grid w-full max-w-7xl animate-pulse gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="h-8 w-44 rounded bg-[#10224f]/10" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-48 rounded-lg bg-white" />
            ))}
          </div>
        </div>
        <div className="h-96 rounded-lg bg-white" />
      </div>
    </main>
  );
}
