import type { NextConfig } from "next";
import os from "os";

/** Collect LAN IPs so phones on the same WiFi can load dev JS bundles */
function getLocalNetworkOrigins(): string[] {
  const ips: string[] = [];
  const nets = os.networkInterfaces();
  for (const iface of Object.values(nets)) {
    for (const net of iface ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  return ips;
}

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: getLocalNetworkOrigins(),
};

export default nextConfig;
