await import("./src/env.js");
import withPWA from "next-pwa";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "utfs.io" }],
  },
  ...withPWA({ dest: "public", register: true, skipWaiting: true }),
};

export default config;
