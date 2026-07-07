import Script from "next/script";

/** Runs before React so WeixinJSBridge can unlock autoplay ASAP in WeChat */
export function WeChatBridgeScript() {
  return (
    <Script id="wechat-bridge-init" strategy="beforeInteractive">
      {`(function () {
  if (!/MicroMessenger/i.test(navigator.userAgent)) return;
  function ready(fn) {
    if (window.WeixinJSBridge) {
      window.WeixinJSBridge.invoke("getNetworkType", {}, fn);
      return;
    }
    document.addEventListener(
      "WeixinJSBridgeReady",
      function () {
        window.WeixinJSBridge.invoke("getNetworkType", {}, fn);
      },
      false,
    );
  }
  window.__wxVideoReady = ready;
  ready(function () {
    window.dispatchEvent(new Event("wx-video-bridge-ready"));
  });
})();`}
    </Script>
  );
}
