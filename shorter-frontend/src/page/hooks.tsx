import { useState, useCallback, useEffect } from "react";
import type { ShortenedUrl, CreateUrlPayload } from "../models/models";
import {
  shortenUrl,
  deleteUrl as deleteUrlService,
  getAllUrl,
  getRecentUrl,
  getStatsUrl,
  getSettings,
  updateSettings,
} from "./services";

export const useUrlShortener = () => {
  const [result, setResult] = useState<ShortenedUrl | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const shorten = useCallback(async (p: CreateUrlPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await shortenUrl(p);
      setResult(res);
      return res;
    } catch (e: any) {
      setError(e?.message || "Unknown error");
      console.error(e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    isLoading,
    error,
    shorten,
    reset,
  };
};

export const useRecentUrls = () => {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecentUrl();
      setUrls(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { urls, isLoading, refetch: fetch };
};

export const useStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getStatsUrl();
        setStats(data);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { stats, isLoading };
};

export const useSettings = () => {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getSettings();
        setSettings(data);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  const update = useCallback(async (u: any) => {
    setSaving(true);
    try {
      const updated = await updateSettings(u);
      setSettings(updated);
    } finally {
      setSaving(false);
    }
  }, []);

  return { settings, isLoading, isSaving, update };
};

export const useClipboard = (timeout: number = 2000) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    },
    [timeout],
  );

  return { copied, copy };
};

export const useUrlHistory = () => {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<{
    search: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
  }>({ search: "", sortBy: "createdAt", sortOrder: "desc" });

  const fetch = useCallback(
    async (f = filters) => {
      setLoading(true);
      try {
        const data = await getAllUrl(f as any); // If getAllUrl eventually accepts UrlFilters, type here
        setUrls(data);
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    fetch(filters);
  }, [fetch, filters]);

  const updateFilters = useCallback(
    (u: Partial<typeof filters>) => setFilters((prev) => ({ ...prev, ...u })),
    [],
  );

  const deleteUrl = useCallback(async (id: string) => {
    await deleteUrlService(id);
    setUrls((prev) => prev.filter((u) => u.id !== id));
  }, []);

  return { urls, isLoading, filters, updateFilters, deleteUrl, refetch: fetch };
};
