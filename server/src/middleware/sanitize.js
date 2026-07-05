function sanitizeValue(value) {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (!value || typeof value !== "object") return value;

  return Object.entries(value).reduce((clean, [key, nestedValue]) => {
    const safeKey = key.replace(/^\$+/g, "").replace(/\./g, "");
    clean[safeKey] = sanitizeValue(nestedValue);
    return clean;
  }, {});
}

export function sanitizeMongoInput(req, _res, next) {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
}
