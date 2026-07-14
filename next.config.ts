import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "mammoth", "tesseract.js"],
  devIndicators: false,
};

export default nextConfig;
