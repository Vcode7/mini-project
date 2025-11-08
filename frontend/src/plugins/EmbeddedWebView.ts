import { registerPlugin } from '@capacitor/core';

export interface EmbeddedWebViewPlugin {
  create(): Promise<void>;
  loadUrl(options: { url: string }): Promise<void>;
  goBack(): Promise<{ canGoBack: boolean }>;
  goForward(): Promise<{ canGoForward: boolean }>;
  reload(): Promise<void>;
  destroy(): Promise<void>;
  show(): Promise<void>;
  hide(): Promise<void>;
}

const EmbeddedWebView = registerPlugin<EmbeddedWebViewPlugin>('EmbeddedWebView', {
  web: () => import('./web').then(m => new m.EmbeddedWebViewWeb()),
});

export default EmbeddedWebView;
