import type { NextConfig } from "next";
import * as dotenv from 'dotenv'
dotenv.config()
const nextConfig: NextConfig = {
  env: {
    API_URL: process.env.API_URL,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/api/upload/**",
      },
      {
        protocol: "https",
        hostname: "eduversebackend-w2gk.onrender.com",
        pathname: "/api/upload/**",
      },
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "identity.stanford.edu",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
