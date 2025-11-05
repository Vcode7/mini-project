import { useEffect, useRef } from 'react';
import { remote } from 'electron';

function ElectronWebView({
  url,
  tabId,
  onNavigate,
  onTitleUpdate,
  onLoadStart,
  onLoadProgress,
  onLoadStop,
  className,
  style,
}) {
  const webviewRef = useRef(null);
  const lastLoadedUrl = useRef(null);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    /** 🧠 PRECONNECT: speeds up first-time loading */
    try {
      const { session } = remote;
      session.defaultSession.preconnect({ url });
    } catch (err) {
      console.warn('Preconnect not supported:', err);
    }

    /** ✅ Only load if URL actually changes */
    if (url && url !== lastLoadedUrl.current) {
      lastLoadedUrl.current = url;
      webview.loadURL(url);
    }

    /** 🛠 Event handlers */
    const handleDidNavigate = (e) => {
      if (onNavigate && e.url !== url) onNavigate(tabId, e.url);
    };

    const handleDidNavigateInPage = (e) => {
      if (e.isMainFrame && onNavigate && e.url !== url) onNavigate(tabId, e.url);
    };

    const handleDidStartLoading = () => {
      if (onLoadStart) onLoadStart();
      simulateProgress();
    };

    const handleDidStopLoading = () => {
      if (onLoadProgress) onLoadProgress(100);
      if (onLoadStop) onLoadStop();
      webview
        .executeJavaScript('document.title')
        .then((title) => title && onTitleUpdate?.(tabId, title))
        .catch(() => {});
    };

    const handlePageTitleUpdated = (e) => {
      if (e.title && onTitleUpdate) onTitleUpdate(tabId, e.title);
    };

    const handleDidFailLoad = (e) => {
      if (e.errorCode === -3) return; // Ignore ERR_ABORTED
      console.error('WebView failed to load:', e.errorDescription || e.errorCode);
      if (onLoadStop) onLoadStop();
    };

    const handleNewWindow = (e) => {
      e.preventDefault(); // Don’t open popups in new windows
      if (e.url) webview.loadURL(e.url); // Load inside same webview
    };

    /** ⚡ Simulate progress bar */
    let progressInterval;
    const simulateProgress = () => {
      let progress = 10;
      progressInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 90) {
          clearInterval(progressInterval);
        }
        onLoadProgress?.(progress);
      }, 150);
    };

    /** 🧹 Cleanup */
    webview.addEventListener('did-navigate', handleDidNavigate);
    webview.addEventListener('did-navigate-in-page', handleDidNavigateInPage);
    webview.addEventListener('did-start-loading', handleDidStartLoading);
    webview.addEventListener('did-stop-loading', handleDidStopLoading);
    webview.addEventListener('did-fail-load', handleDidFailLoad);
    webview.addEventListener('page-title-updated', handlePageTitleUpdated);
    webview.addEventListener('new-window', handleNewWindow);

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      webview.removeEventListener('did-navigate', handleDidNavigate);
      webview.removeEventListener('did-navigate-in-page', handleDidNavigateInPage);
      webview.removeEventListener('did-start-loading', handleDidStartLoading);
      webview.removeEventListener('did-stop-loading', handleDidStopLoading);
      webview.removeEventListener('did-fail-load', handleDidFailLoad);
      webview.removeEventListener('page-title-updated', handlePageTitleUpdated);
      webview.removeEventListener('new-window', handleNewWindow);
    };
  }, [url]);

  return (
    <webview
      ref={webviewRef}
      className={className}
      style={style}
      allowpopups
      partition="persist:webview"
      preload="./preload.js"
      useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      webpreferences="contextIsolation=yes, nativeWindowOpen=yes, nodeIntegration=no, webSecurity=yes"
    />
  );
}

export default ElectronWebView;
