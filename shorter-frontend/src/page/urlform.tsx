import { Button, Input, Badge} from "../ui/components";
import { useState } from "react";
import { useClipboard, useUrlShortener } from "./hooks";
import { timeAgo } from "./helper";

interface QRModalProps {
  shortUrl: any;
  onClose: () => void;
}

interface UrlShortenerFormProps {
  onSuccess: any;
  compact: false;
}

interface UrlCardProps {
  url: any;
  onDelete: (id: any) => void;
}

export const QRModal = ({ shortUrl, onClose } : QRModalProps ) => {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent("https://" + shortUrl)}&bgcolor=FFFFFF&color=0D0D0D&margin=8`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0D0D0D]/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4">
        <h3
          className="font-semibold text-[#0D0D0D] text-lg"
          style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}
        >
          QR Code
        </h3>
        <div className="p-3 bg-[#FAF7F3] rounded-xl border border-[#E8E3DA]">
          <img src={qr} alt="QR" className="w-44 h-44 rounded" />
        </div>
        <p className="text-sm text-[#9B9590] font-medium">{shortUrl}</p>
        <div className="flex gap-2">
          <a href={qr} download="qr-code.png">
            <Button size="sm">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21H19.44a2 2 0 001.94-1.515L22 17" />
              </svg>
              Download
            </Button>
          </a>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export const UrlShortenerForm = ({ onSuccess, compact = false } : UrlShortenerFormProps) => {
  const { result, isLoading, error, shorten, reset } = useUrlShortener();
  const { copied, copy } = useClipboard();
  const [url, setUrl] = useState("");
  const [showAdv, setShowAdv] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [title, setTitle] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (!url.trim()) return;
    const r = await shorten({
      originalUrl: url.trim(),
      customCode: customCode || undefined,
      title: title || undefined,
    });
    if (r) {
      onSuccess?.(r);
      setUrl("");
      setCustomCode("");
      setTitle("");
    }
  };
  if (result)
    return (
      <div className="w-full">
        <div className="bg-[#F5F0E8] border border-[#D4CFC6] rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#9B9590] mb-1 uppercase tracking-wider font-medium">
                Your short link
              </p>
              <p className="text-xl font-semibold text-[#0D0D0D] tracking-tight break-all">
                {result.shortUrl}
              </p>
              <p className="text-xs text-[#9B9590] mt-1 truncate">
                {result.originalUrl}
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button size="sm" onClick={() => copy(result.shortUrl)}>
                {copied ? (
                  <>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setQrOpen(true)}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="3" height="3" />
                </svg>
                QR
              </Button>
            </div>
          </div>
        </div>
        <button
          onClick={reset}
          className="mt-3 text-xs text-[#9B9590] hover:text-[#0D0D0D] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12l7-7 7 7" />
          </svg>
          Shorten another
        </button>
        {qrOpen && (
          <QRModal
            shortUrl={result.shortUrl}
            onClose={() => setQrOpen(false)}
          />
        )}
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex gap-2 ${compact ? "" : "flex-col sm:flex-row"}`}>
        <div className="flex-1">
          <Input
            type="url"
            placeholder="Paste a long URL here…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            leftIcon={
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
            }
          />
        </div>
        <Button
          type="submit"
          isLoading={isLoading}
          size={compact ? "md" : "lg"}
          className={
            compact ? "" : "sm:self-start whitespace-nowrap"
          }
        >
          {isLoading ? "Shortening…" : "Shorten →"}
        </Button>
      </div>
      {!compact && (
        <>
          <button
            type="button"
            className="mt-3 text-xs text-[#9B9590] hover:text-[#0D0D0D] transition-colors flex items-center gap-1 cursor-pointer"
            onClick={() => setShowAdv(!showAdv)}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${showAdv ? "rotate-90" : ""}`}
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
            Advanced options
          </button>
          {showAdv && (
            <div className="mt-3 grid grid-cols-2 gap-3 p-4 bg-[#FAF7F3] rounded-xl border border-[#E8E3DA]">
              <Input
                label="Custom alias"
                placeholder="my-link"
                value={customCode}
                onChange={(e) =>
                  setCustomCode(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  )
                }
                hint="snip.ly/my-link"
              />
              <Input
                label="Title"
                placeholder="Optional label"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          )}
        </>
      )}
      {error && <p className="mt-2 text-xs text-[#C0392B]">{error}</p>}
    </form>
  );
};

export const UrlCard = ({ url, onDelete }: UrlCardProps) => {
  const { copied, copy } = useClipboard();
  const [confirm, setConfirm] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent("https://" + url.shortUrl)}&bgcolor=FFFFFF&color=0D0D0D&margin=6`;
  return (
    <div className="group flex items-start gap-3 p-4 bg-white border border-[#E8E3DA] rounded-xl hover:border-[#C4BFB6] transition-all duration-150">
      <div className="shrink-0 w-8 h-8 bg-[#F5F0E8] rounded-lg flex items-center justify-center mt-0.5">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6B6560"
          strokeWidth="2"
        >
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {url.title && (
              <p className="text-xs font-medium text-[#0D0D0D] truncate mb-0.5">
                {url.title}
              </p>
            )}
            <p className="text-sm font-semibold text-[#0D0D0D]">
              {url.shortUrl}
            </p>
            <p className="text-xs text-[#9B9590] truncate mt-0.5">
              {url.originalUrl}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => copy(url.shortUrl)}
              className="p-1.5 text-[#9B9590] hover:text-[#0D0D0D] hover:bg-[#F0EBE3] rounded-lg transition-colors cursor-pointer"
            >
              {copied ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1A7A4A"
                  strokeWidth="2.5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setQrOpen(!qrOpen)}
              className="p-1.5 text-[#9B9590] hover:text-[#0D0D0D] hover:bg-[#F0EBE3] rounded-lg transition-colors cursor-pointer"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="3" height="3" />
              </svg>
            </button>
            {onDelete &&
              (confirm ? (
                <>
                  <button
                    onClick={() => onDelete(url.id)}
                    className="px-2 py-1.5 text-[#C0392B] hover:bg-[#FBEAE8] rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setConfirm(false)}
                    className="px-2 py-1.5 text-[#9B9590] hover:bg-[#F0EBE3] rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setConfirm(true)}
                  className="p-1.5 text-[#9B9590] hover:text-[#C0392B] hover:bg-[#FBEAE8] rounded-lg transition-colors cursor-pointer"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  </svg>
                </button>
              ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-[#9B9590]">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {url.clicks.toLocaleString()} clicks
          </span>
          <span className="text-xs text-[#C4BFB6]">·</span>
          <span className="text-xs text-[#9B9590]">
            {timeAgo(url.createdAt)}
          </span>
          {url.tags?.map((t: any) => (
            <Badge key={t} label={t} />
          ))}
        </div>
        {qrOpen && (
          <div className="mt-3 flex items-center gap-3 p-3 bg-[#FAF7F3] rounded-lg border border-[#E8E3DA]">
            <img src={qr} alt="QR" className="w-16 h-16 rounded" />
            <div>
              <p className="text-xs font-medium text-[#0D0D0D] mb-1">
                Scan to open
              </p>
              <p className="text-xs text-[#9B9590] mb-2">{url.shortUrl}</p>
              <a href={qr} download="qr.png">
                <Button size="sm" variant="secondary">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21H19.44a2 2 0 001.94-1.515L22 17" />
                  </svg>
                  Save
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
