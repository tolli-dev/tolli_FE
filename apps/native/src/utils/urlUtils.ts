export const parseIntentUrl = (url: string) => {
  if (!url.startsWith("intent:")) return url;
  const schemeMatch = url.match(/scheme=([^;]+)/);
  if (schemeMatch && schemeMatch[1]) {
    const scheme = schemeMatch[1];
    const path = url.replace("intent://", "").split("#")[0];
    return `${scheme}://${path}`;
  }
  return url;
};
