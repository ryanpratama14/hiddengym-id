import withPWA from "next-pwa";

await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: { remotePatterns: [{ protocol: "https", hostname: "utfs.io" }] },
  ...withPWA({ dest: "public", register: true, skipWaiting: true }),
};

export default config;
