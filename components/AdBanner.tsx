interface AdBannerProps {
  size: "banner" | "sidebar" | "leaderboard";
  className?: string;
}

export default function AdBanner({ size, className = "" }: AdBannerProps) {
  const isVertical = size === "sidebar";

  return (
    <aside
      aria-label="Upcoming feature"
      className={`flex flex-col items-center my-2 ${className}`}
    >
      <div
        className={`w-full border border-dashed border-edge rounded-xl flex flex-col items-center justify-center gap-2 bg-surface/50 theme-transition ${
          isVertical ? "p-6" : "px-6 py-5"
        }`}
        style={{
          maxWidth: isVertical ? "300px" : undefined,
          minHeight: isVertical ? "180px" : undefined,
        }}
      >
        {/* Rocket icon */}
        <svg
          width={isVertical ? "32" : "24"}
          height={isVertical ? "32" : "24"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--clr-primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-60"
          aria-hidden="true"
        >
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>

        <div className="text-center">
          <p className="text-sm font-semibold text-ink">Coming Soon</p>
          <p className="text-xs text-muted mt-0.5">
            {isVertical
              ? "Exciting new features are on the way. Stay tuned!"
              : "New features coming soon. Stay tuned!"}
          </p>
        </div>
      </div>
    </aside>
  );
}
