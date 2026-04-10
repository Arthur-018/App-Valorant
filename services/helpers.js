export function getNestedValue(obj, path) {
  if (!obj || !path) return null;

  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function getFirstValidImage(item, fields = []) {
  for (const field of fields) {
    const value = getNestedValue(item, field);
    if (value) return value;
  }
  return null;
}
