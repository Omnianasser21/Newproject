/**
 * عميل بسيط للتواصل مع الباك إند PHP
 * - نفس النطاق عبر Vite proxy في التطوير (/api و /uploads)
 * - الكوكيز (جلسة الأدمن) بتتبعت تلقائيًا عبر credentials: "include"
 */

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch(path, { method = "GET", body } = {}) {
  const options = {
    method,
    credentials: "include",
    headers: {},
  };

  if (body !== undefined) {
    if (body instanceof FormData) {
      options.body = body; // المتصفح يضبط الـ Content-Type مع الـ boundary
    } else {
      options.body = JSON.stringify(body);
      options.headers["Content-Type"] = "application/json";
    }
  }

  let res;
  try {
    res = await fetch(path, options);
  } catch {
    throw new ApiError("تعذر الاتصال بالسيرفر — تأكد أن الباك إند يعمل (start-api.bat)", 0);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* قد لا يكون الجواب JSON */
  }

  if (!res.ok) {
    throw new ApiError(data?.error || `حدث خطأ في السيرفر (HTTP ${res.status})`, res.status);
  }
  return data;
}

/**
 * رفع ملف مع تتبّع التقدّم — يرجع Promise ويستدعي onProgress({ loaded, total, percent })
 * يستخدم XMLHttpRequest لأن fetch لا يدعم upload.onprogress على كل المتصفحات بشكل بسيط
 */
export function uploadWithProgress(path, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", path);
    xhr.withCredentials = true;
    xhr.responseType = "json";

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percent: Math.round((event.loaded / event.total) * 100),
        });
      }
    };

    xhr.onload = () => {
      const data = xhr.response || (() => {
        try {
          return JSON.parse(xhr.responseText);
        } catch {
          return null;
        }
      })();

      if (xhr.status >= 200 && xhr.status < 300 && data?.success) {
        resolve(data);
      } else {
        reject(new ApiError(data?.error || `فشل الرفع (HTTP ${xhr.status})`, xhr.status));
      }
    };

    xhr.onerror = () => reject(new ApiError("انقطع الاتصال أثناء الرفع — حاول مرة أخرى", 0));
    xhr.onabort = () => reject(new ApiError("تم إلغاء الرفع", 0));

    xhr.send(formData);
  });
}

/** صيغة بايتات مقروءة */
export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}
