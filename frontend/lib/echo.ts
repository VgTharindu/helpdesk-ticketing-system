import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

// One websocket connection per browser tab, created on first use
let echo: Echo<"pusher"> | null = null;

export function getEcho(): Echo<"pusher"> | null {
  // Server-side render has no websocket
  if (typeof window === "undefined") {
    return null;
  }

  if (echo) {
    return echo;
  }

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!key || !cluster) {
    console.warn("[echo] NEXT_PUBLIC_PUSHER_KEY or NEXT_PUBLIC_PUSHER_CLUSTER is missing");
    return null;
  }

  window.Pusher = Pusher;

  echo = new Echo({
    broadcaster: "pusher",
    key,
    cluster,
    forceTLS: true,
    // Channel authorisation goes through the BFF proxy, which turns the
    // httpOnly cookie into the Bearer token Laravel expects
    authEndpoint: "/api/proxy/broadcasting/auth",
  });

  return echo;
}

export function disconnectEcho(): void {
  echo?.disconnect();
  echo = null;
}
