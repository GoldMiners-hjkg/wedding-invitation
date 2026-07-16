declare global {
  interface Window {
    WeixinJSBridge?: {
      invoke: (
        method: string,
        args: Record<string, unknown>,
        callback?: () => void,
      ) => void;
    };
  }
}

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

/**
 * WeChat blocks programmatic autoplay unless play() runs inside
 * WeixinJSBridge.invoke('getNetworkType', ...) after bridge ready.
 */
function playInWeChatContext(attemptPlay: () => Promise<unknown>) {
  if (!isWeChatBrowser()) {
    return attemptPlay();
  }

  return new Promise<void>((resolve) => {
    let settled = false;
    const run = () => {
      if (settled) return;
      settled = true;
      void attemptPlay().finally(() => resolve());
    };

    if (window.WeixinJSBridge) {
      window.WeixinJSBridge.invoke("getNetworkType", {}, run);
      return;
    }

    document.addEventListener(
      "WeixinJSBridgeReady",
      () => {
        window.WeixinJSBridge?.invoke("getNetworkType", {}, run);
      },
      { once: true },
    );

    window.setTimeout(run, 1200);
  });
}

export function playVideoInWeChat(video: HTMLVideoElement) {
  return playInWeChatContext(() => video.play());
}

export function playAudioInWeChat(audio: HTMLAudioElement) {
  return playInWeChatContext(() => audio.play());
}
