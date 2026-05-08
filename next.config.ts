import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Отключаем PWA в dev-режиме, чтобы не мешал HMR
  register: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ваши текущие настройки Next.js
};

export default withPWA(nextConfig);
