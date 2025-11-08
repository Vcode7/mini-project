import { useEffect, useState } from 'react';
import EmbeddedWebView from '../plugins/EmbeddedWebView';

/**
 * Capacitor WebView component using native Android WebView
 */
function CapacitorWebView({ url, tabId, onNavigate, className, style }) {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  // ⚡ 1️⃣ Create the WebView on mount (but do NOT show immediately)
  useEffect(() => {
    const initWebView = async () => {
      try {
        console.log('[CapacitorWebView] Creating native WebView...');
        await EmbeddedWebView.create();
        setIsCreated(true);
        console.log('[CapacitorWebView] Native WebView created successfully');
      } catch (error) {
        console.error('[CapacitorWebView] Error creating WebView:', error);
      }
    };

    initWebView();

    // Setup listeners
    const navigationCompleteListener = EmbeddedWebView.addListener?.('navigationComplete', (data) => {
      console.log('[CapacitorWebView] Navigation complete:', data.url);
      setIsLoading(false);
      if (onNavigate && data.url && data.url !== currentUrl) {
        setCurrentUrl(data.url);
        onNavigate(tabId, data.url);
      }
    });

    const navigationStartedListener = EmbeddedWebView.addListener?.('navigationStarted', (data) => {
      console.log('[CapacitorWebView] Navigation started:', data.url);
      setIsLoading(true);
    });

    const loadProgressListener = EmbeddedWebView.addListener?.('loadProgress', (data) => {
      console.log('[CapacitorWebView] Load progress:', data.progress);
    });

    return () => {
      // Cleanup listeners
      navigationCompleteListener?.remove?.();
      navigationStartedListener?.remove?.();
      loadProgressListener?.remove?.();
      EmbeddedWebView.destroy().catch(err => {
        console.error('[CapacitorWebView] Error destroying WebView:', err);
      });
    };
  }, []);

  // ⚡ 2️⃣ Load URL only *after* creation, then show WebView
  useEffect(() => {
    const load = async () => {
      if (!isCreated || !url) return;

      try {
        console.log('[CapacitorWebView] Loading URL:', url);
        setCurrentUrl(url);
        setIsLoading(true);

        // ⚡ Load first
        await EmbeddedWebView.loadUrl({ url });

        // ⚡ Then show the WebView after the URL starts loading
        await EmbeddedWebView.show();
      } catch (err) {
        console.error('[CapacitorWebView] Error loading URL:', err);
        setIsLoading(false);
      }
    };

    load();
  }, [url, isCreated]);

  // ⚡ 3️⃣ (Optional but recommended) Add small delay before load to ensure UI thread ready
  // You can wrap the above load call in setTimeout(() => load(), 300)

  return (
    <div
      className={className}
      style={style || { width: '100%', height: '100%', position: 'relative' }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Loading website...</p>
            <p className="text-xs text-muted-foreground">{currentUrl}</p>
          </div>
        </div>
      )}
      {/* Native WebView rendered by Android plugin */}
      <div className="w-full h-full" id="native-webview-container" />
    </div>
  );
}

export default CapacitorWebView;
