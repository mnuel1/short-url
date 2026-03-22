import { useUrlHistory } from "../hooks";
import { Button, Input, Spinner } from "../../ui/components";
import { UrlCard } from "../urlform";

const HistoryPage = () => {
  const { urls, isLoading, filters, updateFilters, deleteUrl } =
    useUrlHistory();
  return (
    <div className="max-w-2xl mx-auto px-6 py-8 w-full">
      <div className="mb-7">
        <h1
          className="text-2xl font-semibold text-[#0D0D0D] tracking-tight"
          style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}
        >
          All Links
        </h1>
        <p className="text-sm text-[#9B9590] mt-1">
          {urls.length} link{urls.length !== 1 ? "s" : ""} total
        </p>
      </div>
      <div className="bg-white border border-[#E8E3DA] rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search links, titles, codes…"
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            leftIcon={
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            }
          />
        </div>
        <div className="flex items-end gap-2 shrink-0">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#4A4540] uppercase tracking-wider">
              Sort
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value })}
              className="bg-white border border-[#D4CFC6] rounded-lg px-3 py-2.5 text-sm text-[#0D0D0D] outline-none focus:border-[#0D0D0D] cursor-pointer pr-8"
            >
              <option value="createdAt">Date</option>
              <option value="clicks">Clicks</option>
              <option value="title">Title</option>
            </select>
          </div>
          <button
            onClick={() =>
              updateFilters({
                sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
              })
            }
            className="p-2.5 border border-[#D4CFC6] rounded-lg text-[#6B6560] hover:border-[#0D0D0D] hover:text-[#0D0D0D] transition-colors self-end cursor-pointer"
          >
            {filters.sortOrder === "asc" ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18M3 12h12M3 18h6" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h6M3 12h12M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : urls.length === 0 ? (
        <div className="text-center py-16 text-[#9B9590]">
          <p className="text-sm font-medium mb-1">No links found</p>
          <p className="text-xs">Try adjusting your search.</p>
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-3"
              onClick={() => updateFilters({ search: "" })}
            >
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {urls.map((u) => (
            <UrlCard key={u.id} url={u} onDelete={deleteUrl} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
