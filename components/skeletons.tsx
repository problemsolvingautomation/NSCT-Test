/**
 * Skeleton screens for all loading states.
 * Uses the `.skeleton` shimmer class from globals.css.
 */

/* ─── Quiz Play Page ─── */
export function PlaySkeleton() {
  return (
    <div className="flex gap-6 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
      <div className="flex-1 min-w-0 max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <div className="skeleton h-4 w-48" />
            <div className="skeleton h-4 w-28" />
          </div>
          <div className="skeleton h-1.5 w-full rounded-full" />
        </div>
        {/* Question counter + Timer */}
        <div className="flex items-center justify-between mb-4">
          <div className="skeleton h-4 w-36" />
          <div className="skeleton h-4 w-16" />
        </div>
        {/* Question card */}
        <div className="bg-surface border border-edge rounded-xl shadow-sm p-5 sm:p-6 mb-5">
          <div className="skeleton h-3 w-20 mb-3" />
          <div className="skeleton h-6 w-full mb-2" />
          <div className="skeleton h-6 w-3/4 mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3.5 p-4 border-[1.5px] border-edge rounded-[10px]">
                <div className="skeleton w-8 h-8 rounded-full shrink-0" />
                <div className="skeleton h-4 flex-1" style={{ maxWidth: `${75 - i * 8}%` }} />
              </div>
            ))}
          </div>
        </div>
        {/* Navigation */}
        <div className="flex items-center gap-3 mb-4">
          <div className="skeleton h-10 w-24 rounded-lg" />
          <div className="flex-1" />
          <div className="skeleton h-10 w-24 rounded-lg" />
        </div>
        {/* Question dots */}
        <div className="flex flex-wrap gap-2 justify-center">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`skeleton h-3 rounded-full ${i === 0 ? "w-7" : "w-3"}`} />
          ))}
        </div>
      </div>
      {/* Sidebar */}
      <aside className="hidden lg:block w-75 shrink-0">
        <div className="sticky top-20 space-y-6">
          <div className="bg-surface border border-edge rounded-xl p-4 shadow-sm">
            <div className="skeleton h-3 w-24 mb-3" />
            <div className="space-y-2.5">
              <div className="flex justify-between"><div className="skeleton h-4 w-20" /><div className="skeleton h-4 w-8" /></div>
              <div className="flex justify-between"><div className="skeleton h-4 w-24" /><div className="skeleton h-4 w-8" /></div>
              <div className="skeleton h-1.5 w-full rounded-full" />
              <div className="flex justify-between pt-1.5 border-t border-edge"><div className="skeleton h-4 w-12" /><div className="skeleton h-4 w-14" /></div>
            </div>
            <div className="skeleton h-10 w-full rounded-lg mt-4" />
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ─── Configure Page ─── */
export function ConfigureSkeleton() {
  return (
    <div className="flex gap-6 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
      <div className="flex-1 min-w-0 max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <div className="skeleton h-5 w-5 rounded" />
          <div className="skeleton h-4 w-12" />
          <div className="skeleton h-4 w-2" />
          <div className="skeleton h-4 w-32" />
        </div>
        {/* Subject header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="skeleton w-14 h-14 rounded-xl shrink-0" />
          <div>
            <div className="skeleton h-7 w-52 mb-2" />
            <div className="skeleton h-4 w-36" />
          </div>
        </div>
        {/* Step 1: Topic */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="skeleton w-7 h-7 rounded-full shrink-0" />
            <div className="skeleton h-4 w-28" />
          </div>
          <div className="bg-surface border border-edge rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <div className="skeleton h-10 w-full rounded-lg" />
            </div>
            <div className="px-2 pb-2 space-y-0.5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <div className="skeleton w-1.5 h-1.5 rounded-full shrink-0" />
                  <div className="skeleton h-4" style={{ width: `${45 + i * 7}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Step 2: Difficulty */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="skeleton w-7 h-7 rounded-full shrink-0" />
            <div className="skeleton h-4 w-24" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl border-[1.5px] border-edge text-center">
                <div className="skeleton h-4 w-16 mx-auto mb-1" />
                <div className="skeleton h-3 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
        {/* Step 3: Count */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="skeleton w-7 h-7 rounded-full shrink-0" />
            <div className="skeleton h-4 w-36" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-xl border-[1.5px] border-edge text-center">
                <div className="skeleton h-8 w-10 mx-auto mb-1" />
                <div className="skeleton h-3 w-14 mx-auto mb-0.5" />
                <div className="skeleton h-3 w-10 mx-auto" />
              </div>
            ))}
          </div>
        </div>
        {/* Start button area */}
        <div className="bg-surface border border-edge rounded-xl shadow-sm p-5">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {[20, 24, 16, 24].map((w, i) => (
              <div key={i} className="skeleton h-7 rounded-full" style={{ width: `${w * 4}px` }} />
            ))}
          </div>
          <div className="skeleton h-14 w-full rounded-lg" />
        </div>
      </div>
      {/* Sidebar */}
      <aside className="hidden lg:block w-75 shrink-0">
        <div className="sticky top-20">
          <div className="skeleton h-64 w-full rounded-xl" />
        </div>
      </aside>
    </div>
  );
}

/* ─── Results Page ─── */
export function ResultsSkeleton() {
  return (
    <div className="flex gap-6 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
      <div className="flex-1 min-w-0 max-w-3xl mx-auto">
        {/* Score Summary Card */}
        <div className="bg-surface border border-edge rounded-xl shadow-sm p-6 sm:p-8 text-center mb-8">
          <div className="skeleton h-7 w-36 mx-auto mb-5" />
          {/* Score ring placeholder */}
          <div className="skeleton w-44 h-44 rounded-full mx-auto" />
          <div className="skeleton h-5 w-72 mx-auto mt-5" />
          {/* Metadata chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {[20, 24, 16, 16].map((w, i) => (
              <div key={i} className="skeleton h-7 rounded-full" style={{ width: `${w * 4}px` }} />
            ))}
          </div>
          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-[1.5px] border-edge rounded-[10px] p-4">
                <div className="skeleton h-8 w-10 mx-auto mb-1" />
                <div className="skeleton h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <div className="skeleton h-12 flex-1 rounded-lg" />
            <div className="skeleton h-12 flex-1 rounded-lg" />
          </div>
        </div>
        {/* Answer Review heading */}
        <div className="flex items-center gap-2 mb-4">
          <div className="skeleton h-6 w-32" />
          <div className="skeleton h-5 w-24 rounded-full" />
        </div>
        {/* Question review cards */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface border border-edge rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="skeleton w-7 h-7 rounded-full shrink-0" />
                <div className="flex-1">
                  <div className="skeleton h-5 w-full mb-1" />
                  <div className="skeleton h-5 w-2/3 mb-2" />
                  <div className="skeleton h-5 w-16 rounded-full" />
                </div>
              </div>
              <div className="space-y-2 ml-10">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center gap-2 py-2 px-3">
                    <div className="skeleton h-4 w-5 shrink-0" />
                    <div className="skeleton h-4" style={{ width: `${60 - j * 6}%` }} />
                  </div>
                ))}
              </div>
              <div className="mt-3 ml-10">
                <div className="skeleton h-20 w-full rounded-r-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Sidebar */}
      <aside className="hidden lg:block w-75 shrink-0">
        <div className="sticky top-20 space-y-6">
          <div className="bg-surface border border-edge rounded-xl p-4 shadow-sm">
            <div className="skeleton h-3 w-24 mb-3" />
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1"><div className="skeleton h-4 w-16" /><div className="skeleton h-4 w-10" /></div>
                <div className="skeleton h-2 w-full rounded-full" />
              </div>
              <div className="flex justify-between"><div className="skeleton h-4 w-20" /><div className="skeleton h-4 w-14" /></div>
              <div className="flex justify-between"><div className="skeleton h-4 w-28" /><div className="skeleton h-4 w-14" /></div>
              <div className="flex justify-between pt-2 border-t border-edge"><div className="skeleton h-4 w-20" /><div className="skeleton h-4 w-6" /></div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
