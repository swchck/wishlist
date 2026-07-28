import type { APIRoute } from "astro";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: "Вишлист",
      short_name: "Вишлист",
      description: "Список желаемых подарков",
      lang: "ru",
      dir: "ltr",
      start_url: base + "/",
      scope: base + "/",
      display: "standalone",
      background_color: "#f5f5f2",
      theme_color: "#f5f5f2",
      icons: [
        {
          src: base + "/icon-192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: base + "/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: base + "/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    }),
    { headers: { "Content-Type": "application/manifest+json; charset=utf-8" } },
  );
