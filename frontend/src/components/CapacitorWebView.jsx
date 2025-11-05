import { useEffect, useRef } from 'react';

/**
 * Capacitor WebView component using native webview
 * This provides better performance and capabilities than iframe
 */
function CapacitorWebView({ url, tabId, onNavigate, className, style }) {
  const containerRef = useRef(null);
  const webviewRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create native webview element
    const webview = document.createElement('webview');
    webview.src = url;
    webview.className = className || '';
    
    // Apply styles
    if (style) {
      Object.assign(webview.style, style);
    }

    // Set webview attributes for Capacitor
    webview.setAttribute('allowpopups', 'true');
    webview.setAttribute('partition', 'persist:webview');
    
    // Add webview to container
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(webview);
    webviewRef.current = webview;

    // Webview event listeners
    const handleLoadStart = () => {
      console.log('WebView load started:', url);
    };

    const handleLoadStop = () => {
      console.log('WebView load completed:', url);
    };

    const handleLoadError = (e) => {
      console.error('WebView load error:', e);
    };

    const handleDidNavigate = (e) => {
      console.log('WebView navigated to:', e.url);
      if (onNavigate && e.url !== url) {
        onNavigate(tabId, e.url);
      }
    };

    const handleDidNavigateInPage = (e) => {
      if (e.isMainFrame && onNavigate && e.url !== url) {
        console.log('WebView in-page navigation:', e.url);
        onNavigate(tabId, e.url);
      }
    };

    webview.addEventListener('loadstart', handleLoadStart);
    webview.addEventListener('loadstop', handleLoadStop);
    webview.addEventListener('loaderror', handleLoadError);
    webview.addEventListener('did-navigate', handleDidNavigate);
    webview.addEventListener('did-navigate-in-page', handleDidNavigateInPage);

    return () => {
      webview.removeEventListener('loadstart', handleLoadStart);
      webview.removeEventListener('loadstop', handleLoadStop);
      webview.removeEventListener('loaderror', handleLoadError);
      webview.removeEventListener('did-navigate', handleDidNavigate);
      webview.removeEventListener('did-navigate-in-page', handleDidNavigateInPage);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [url, tabId, onNavigate, className, style]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={style || { width: '100%', height: '100%' }}
    />
  );
}

export default CapacitorWebView;
