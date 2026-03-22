import { useRecentUrls, useStats } from "../hooks";
import type { ShortenedUrl, UrlStats } from "../../models/models";

import { StatsGrid, Spinner } from "../../ui/components";
import { UrlShortenerForm, UrlCard } from "../urlform";

interface DashboardHomeProps {
  onViewAll: () => void;
}

const DashboardHome = ({ onViewAll }: DashboardHomeProps) => {
  const { urls, isLoading, refetch } = useRecentUrls();
  const { stats, isLoading: sl } = useStats();

  const remove = (id: string) => {
    // if delete functionality exists elsewhere you can wire it here
    console.warn("remove not connected", id);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 w-full">
      <div className="mb-7">
        <h1
          className="text-2xl font-semibold text-[#0D0D0D] tracking-tight"
          style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}
        >
          Shorten a URL
        </h1>

        <p className="text-sm text-[#9B9590] mt-1">
          Paste any link to create a short, shareable URL.
        </p>
      </div>

      <div className="bg-white border border-[#E8E3DA] rounded-2xl p-6 mb-6">
        <UrlShortenerForm onSuccess={() => refetch()} compact={false} />
      </div>

      <StatsGrid stats={stats as UrlStats} isLoading={sl} />

      <div className="mt-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-[#9B9590] uppercase tracking-wider">
            Recent links
          </h2>

          <button
            onClick={onViewAll}
            className="text-xs text-[#9B9590] hover:text-[#0D0D0D] transition-colors flex items-center gap-1 cursor-pointer"
          >
            View all
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : urls.length === 0 ? (
          <div className="text-center py-10 text-[#9B9590]">
            <p className="text-sm">
              No links yet. Shorten your first URL above.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {urls.map((u: ShortenedUrl) => (
              <UrlCard key={u.id} url={u} onDelete={remove} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
