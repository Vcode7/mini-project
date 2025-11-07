import { useEffect, useRef } from 'react';

/**
 * Capacitor WebView component using native webview
 * This provides better performance and capabilities than iframe
 */
function CapacitorWebView({ url, tabId, onNavigate, className, style }) {
  const containerRef = useRef(null);
  const webviewRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !url) return;

    // Create native webview element
    const webview = document.createElement('webview');
    webview.className = className || '';
    
    // Apply styles
    if (style) {
      Object.assign(webview.style, style);
    } else {
      webview.style.width = '100%';
      webview.style.height = '100%';
    }

    // Set webview attributes for Capacitor
    webview.setAttribute('allowpopups', 'true');
    webview.setAttribute('partition', 'persist:webview');
    webview.setAttribute('webpreferences', 'allowRunningInsecureContent, javascript=yes');
    
    // Add webview to container
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(webview);
    webviewRef.current = webview;

    // Set src after adding to DOM for better compatibility
    webview.src = url;

    // Webview event listeners - using standard webview events
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
      const newUrl = e.url || webview.src;
      console.log('WebView navigated to:', newUrl);
      if (onNavigate && newUrl && newUrl !== url) {
        onNavigate(tabId, newUrl);
      }
    };

    const handleDidNavigateInPage = (e) => {
      if (e.isMainFrame && onNavigate && e.url && e.url !== url) {
        console.log('WebView in-page navigation:', e.url);
        onNavigate(tabId, e.url);
      }
    };

    // Wait for webview to be ready before adding event listeners
    const setupListeners = () => {
      webview.addEventListener('loadstart', handleLoadStart);
      webview.addEventListener('loadstop', handleLoadStop);
      webview.addEventListener('loaderror', handleLoadError);
      webview.addEventListener('did-navigate', handleDidNavigate);
      webview.addEventListener('did-navigate-in-page', handleDidNavigateInPage);
    };

    // Setup listeners after a short delay to ensure webview is initialized
    setTimeout(setupListeners, 100);

    return () => {
      if (webview) {
        webview.removeEventListener('loadstart', handleLoadStart);
        webview.removeEventListener('loadstop', handleLoadStop);
        webview.removeEventListener('loaderror', handleLoadError);
        webview.removeEventListener('did-navigate', handleDidNavigate);
        webview.removeEventListener('did-navigate-in-page', handleDidNavigateInPage);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [url, tabId, onNavigate]);

  // Update webview src when URL changes
  useEffect(() => {
    if (webviewRef.current && url) {
      const currentSrc = webviewRef.current.getAttribute('src');
      if (currentSrc !== url) {
        console.log('Updating webview URL to:', url);
        webviewRef.current.src = url;
      }
    }
  }, [url]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={style || { width: '100%', height: '100%' }}
    />
  );
}

export default CapacitorWebView;
