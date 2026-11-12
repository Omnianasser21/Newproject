import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/client";

/**
 * جلب الوسائط (فيديو/PDF) من الـ API
 * @param {string|null} category slug القسم (null = الكل)
 * @param {"video"|"pdf"} type
 * @param {boolean} all true = كل العناصر حتى المخفية (يتطلب جلسة أدمن)
 */
export function useMediaList(category, type, all = false) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (type) params.set("type", type);
      if (all) params.set("all", "1");
      const data = await apiFetch(`/api/media/list.php?${params.toString()}`);
      setMedia(data.media ?? []);
    } catch (err) {
      setError(err.message || "تعذر تحميل البيانات");
      setMedia([]);
    } finally {
      setLoading(false);
    }
  }, [category, type, all]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { media, loading, error, refresh };
}

/** جلب الأقسام من الـ API */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/categories.php");
      setCategories(data.categories ?? []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { categories, loading, refresh };
}
