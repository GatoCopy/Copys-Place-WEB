// Hace absolutas las URLs de og:image (las redes sociales lo exigen).
export async function onRequest({ request, next }) {
  const res = await next();
  const type = res.headers.get("Content-Type") || "";
  if (!type.includes("text/html")) return res;
  const origin = new URL(request.url).origin;
  return new HTMLRewriter()
    .on('meta[property="og:image"]', { element(el) { const c = el.getAttribute("content"); if (c && c.startsWith("/")) el.setAttribute("content", origin + c); } })
    .transform(res);
}
