declare global {
  interface Window {
    WeixinJSBridge?: {
      invoke: (
        method: string,
        args: Record<string, unknown>,
        callback?: () => void,
      ) => void;
    };
    __wxVideoReady?: (callback: () => void) => void;
  }
}

export const WX_VIDEO_BRIDGE_READY = "wx-video-bridge-ready";

export function isWeChatBrowser() {
  if (typeof navigator === "undefined") return false;
  return /MicroMessenger/i.test(navigator.userAgent);
}

/** Attributes required for inline playback in WeChat / X5 WebView */
export function configureInlineVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "true");
  video.setAttribute("webkit-playsinline", "true");
  video.setAttribute("x5-playsinline", "true");
  video.setAttribute("x-webkit-airplay", "allow");
  video.setAttribute("x5-video-player-type", "h5");
  video.setAttribute("x5-video-orientation", "portrait");
  video.setAttribute("x5-video-player-fullscreen", "false");
}

function invokeWeChatBridge(callback: () => void) {
  if (window.WeixinJSBridge) {
    window.WeixinJSBridge.invoke("getNetworkType", {}, callback);
    return;
  }

  document.addEventListener(
    "WeixinJSBridgeReady",
    () => {
      window.WeixinJSBridge?.invoke("getNetworkType", {}, callback);
    },
    { once: true },
  );
}

export function initWeChatBridgeEarly() {
  if (typeof window === "undefined" || !isWeChatBrowser()) return;

  window.__wxVideoReady = invokeWeChatBridge;
  invokeWeChatBridge(() => {
    window.dispatchEvent(new Event(WX_VIDEO_BRIDGE_READY));
  });
}

/**
 * WeChat only allows autoplay when play() is called inside
 * WeixinJSBridge.invoke('getNetworkType', ...).
 */
export function playVideoInWeChat(video: HTMLVideoElement) {
  const play = () => video.play();

  if (!isWeChatBrowser()) {
    return play();
  }

  return new Promise<void>((resolve) => {
    invokeWeChatBridge(() => {
      void play().finally(() => resolve());
    });
  });
}

export function scheduleWeChatAutoplay(
  video: HTMLVideoElement,
  onNeedTap?: () => void,
) {
  const tryPlay = () => {
    if (!video.paused && video.currentTime > 0 && !video.ended) return;
    void playVideoInWeChat(video);
  };

  if (!isWeChatBrowser()) {
    void video.play().catch(() => onNeedTap?.());
    return () => {};
  }

  const mediaEvents = ["loadedmetadata", "canplay", "canplaythrough"] as const;
  for (const eventName of mediaEvents) {
    video.addEventListener(eventName, tryPlay);
  }

  window.addEventListener(WX_VIDEO_BRIDGE_READY, tryPlay);
  document.addEventListener("WeixinJSBridgeReady", tryPlay);
  window.addEventListener("pageshow", tryPlay);

  tryPlay();

  const retryDelays = [80, 200, 500, 1000, 1800, 3000];
  const retryTimers = retryDelays.map((delay) =>
    window.setTimeout(tryPlay, delay),
  );

  const fallbackTimer = window.setTimeout(() => {
    if (video.paused) onNeedTap?.();
  }, 5000);

  return () => {
    for (const eventName of mediaEvents) {
      video.removeEventListener(eventName, tryPlay);
    }
    window.removeEventListener(WX_VIDEO_BRIDGE_READY, tryPlay);
    document.removeEventListener("WeixinJSBridgeReady", tryPlay);
    window.removeEventListener("pageshow", tryPlay);
    for (const timer of retryTimers) window.clearTimeout(timer);
    window.clearTimeout(fallbackTimer);
  };
}
