// src/utils/normalizeProduct.js
// Prefer app-level id (product.id). Fallback to _id only if app id is missing.
export default function normalizeProduct(raw) {
  if (!raw) return { id: null, _id: null, urlId: null, title: "", images: "" };

  if (typeof raw === "string") {
    return { id: raw, _id: raw, urlId: raw, title: "", images: "" };
  }

  const obj = raw || {};

  // app-level id from your schema. Also accept other names if you have them (productId).
  const appId =
    obj.id !== undefined && obj.id !== null && String(obj.id).trim() !== ""
      ? String(obj.id)
      : obj.productId
      ? String(obj.productId)
      : null;

  // mongo internal id
  const mongoId =
    obj._id !== undefined && obj._id !== null ? String(obj._id) : null;

  // urlId: **prefer the app-level id only** (this makes the URL show your defined id)
  const urlId = appId || null;

  return {
    ...obj,
    id: appId || null, // canonical app id (null if not provided)
    _id: mongoId,
    urlId, // used for building URLs; will be null if no app id
  };
}
