import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DriftClash — Penthouse TCG",
    short_name: "DriftClash",
    description: "Collect, battle, trade, and forge custom RC drift trading cards in the Penthouse TCG universe.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    theme_color: "#09090b",
    background_color: "#09090b",
    categories: ["games", "entertainment", "sports"],
    icons: [
      { src: "/icons/icon-192.png?v=3", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png?v=3", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-192.png?v=3", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512.png?v=3", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
