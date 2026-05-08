// app/manifest.ts
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Balans Design Brief",
    short_name: "Design Brief",
    description: "Техническое задание на разработку дизайн-проекта",
    start_url: "/",
    display: "standalone", // Убирает интерфейс браузера, делает приложение похожим на нативное
    background_color: "#f3f4f6", // Цвет из вашего tailwind bg-gray-100
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
