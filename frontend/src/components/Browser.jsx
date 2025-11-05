import { useState, useEffect } from 'react'
import { useBrowser } from '../context/BrowserContext'
import { useTheme } from '../context/ThemeContext'
import { isElectron, isCapacitor } from '../utils/platform'
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Home,
  Plus,
  X,
  Moon,
  Sun,
  Mic,
  MicOff,
  Settings as SettingsIcon
} from 'lucide-react'
import VoiceRecorder from './VoiceRecorder'
import CapacitorWebView from './CapacitorWebView'
import ElectronWebView from './ElectronWebView'
import HomePage from './HomePage'
import FocusMode from './FocusMode'
import FocusBlockedPage from './FocusBlockedPage'
import Settings from './Settings'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Browser() {
  const {
    tabs,
    activeTab,
    activeTabId,
    addTab,
    closeTab,
    switchTab,
    updateTabUrl,
    updateTabTitle,
    navigateBack,
    navigateForward,
    refresh,
    canGoBack,
    canGoForward
  } = useBrowser()

  const { theme, toggleTheme } = useTheme()
  const [urlInput, setUrlInput] = useState(activeTab?.url || '')
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [focusModeActive, setFocusModeActive] = useState(false)
  const [blockedUrl, setBlockedUrl] = useState(null)
  const [blockReason, setBlockReason] = useState('')
  const [focusTopic, setFocusTopic] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  useEffect(() => {
    setUrlInput(activeTab?.url || '')
  }, [activeTab?.url])

  const handleUrlSubmit = async (e) => {
    e.preventDefault()
    let url = urlInput.trim()
    
    if (!url) return
    
    // Add https:// if no protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Check if it looks like a URL
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url
      } else {
        // Treat as search query
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`
      }
    }
    
    // Check with focus mode if active
    if (focusModeActive) {
      const allowed = await checkUrlWithFocusMode(url)
      if (!allowed) {
        return // URL was blocked
      }
    }
    
    updateTabUrl(activeTabId, url)
  }
  
  const checkUrlWithFocusMode = async (url) => {
    try {
      const response = await axios.post(`${API_URL}/api/focus/check-url`, {
        url: url,
        use_quick_check: false
      })
      
      if (response.data.allowed) {
        // Clear any previous block
        setBlockedUrl(null)
        setBlockReason('')
        return true
      } else {
        // Block the URL
        setBlockedUrl(url)
        setBlockReason(response.data.reason || 'This URL is not relevant to your focus topic')
        setFocusTopic(response.data.topic || '')
        return false
      }
    } catch (error) {
      console.error('Error checking URL with focus mode:', error)
      // On error, allow the URL (fail open)
      return true
    }
  }

  const handleHome = () => {
    updateTabUrl(activeTabId, '')
    updateTabTitle(activeTabId, 'New Tab')
    setUrlInput('')
  }

  const handleWebViewNavigate = (tabId, newUrl) => {
    // Update the tab URL and input when webview navigates
    updateTabUrl(tabId, newUrl)
    if (tabId === activeTabId) {
      setUrlInput(newUrl)
    }
  }

  const handleTitleUpdate = (tabId, title) => {
    // Update the tab title when page title changes
    updateTabTitle(tabId, title || 'New Tab')
  }

  const handleHomePageNavigate = async (url) => {
    // Navigate from home page
    if (focusModeActive) {
      const allowed = await checkUrlWithFocusMode(url)
      if (!allowed) {
        return
      }
    }
    updateTabUrl(activeTabId, url)
    setUrlInput(url)
  }
  
  const handleFocusModeChange = (active) => {
    setFocusModeActive(active)
    if (!active) {
      // Clear any blocks when focus mode is disabled
      setBlockedUrl(null)
      setBlockReason('')
      setFocusTopic('')
    }
  }
  
  const handleGoBack = () => {
    setBlockedUrl(null)
    setBlockReason('')
    navigateBack()
  }
  
  const handleEndFocusFromBlock = async () => {
    try {
      await axios.post(`${API_URL}/api/focus/end`)
      setFocusModeActive(false)
      setBlockedUrl(null)
      setBlockReason('')
      setFocusTopic('')
    } catch (error) {
      console.error('Error ending focus session:', error)
    }
  }

  const handleLoadStart = () => {
    setIsLoading(true)
    setLoadingProgress(10)
  }

  const handleLoadProgress = (progress) => {
    setLoadingProgress(progress)
  }

  const handleLoadStop = () => {
    setLoadingProgress(100)
    setTimeout(() => {
      setIsLoading(false)
      setLoadingProgress(0)
    }, 200)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Loading Bar */}
      {isLoading && (
        <div className="h-1 bg-secondary relative overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      )}
      
      {/* Tabs Bar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-secondary border-b border-border">
        <div className="flex-1 flex items-center gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer
                min-w-[120px] max-w-[200px] group
                ${tab.id === activeTabId
                  ? 'bg-background border border-b-0 border-border'
                  : 'bg-secondary hover:bg-muted'
                }
              `}
              onClick={() => switchTab(tab.id)}
            >
              <span className="flex-1 truncate text-sm">
                {tab.title || 'New Tab'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.id)
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-destructive/20 rounded p-0.5"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => addTab()}
          className="p-1.5 hover:bg-muted rounded"
          title="New Tab"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-background border-b border-border">
        <div className="flex items-center gap-1">
          <button
            onClick={navigateBack}
            disabled={!canGoBack}
            className="p-2 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed"
            title="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={navigateForward}
            disabled={!canGoForward}
            className="p-2 hover:bg-secondary rounded disabled:opacity-30 disabled:cursor-not-allowed"
            title="Forward"
          >
            <ArrowRight size={18} />
          </button>
          <button
            onClick={refresh}
            className="p-2 hover:bg-secondary rounded"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={handleHome}
            className="p-2 hover:bg-secondary rounded"
            title="Home"
          >
            <Home size={18} />
          </button>
        </div>

        {/* URL Bar */}
        <form onSubmit={handleUrlSubmit} className="flex-1">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder="Enter URL or search..."
            className="w-full px-4 py-2 bg-secondary rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </form>

        <div className="flex items-center gap-1">
          <VoiceRecorder
            isActive={isVoiceActive}
            onToggle={() => setIsVoiceActive(!isVoiceActive)}
          />
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-secondary rounded"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-secondary rounded"
            title="Settings"
          >
            <SettingsIcon size={18} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-background">
        {activeTab && (
          <>
            {/* Show blocked page if URL is blocked by focus mode */}
            {blockedUrl ? (
              <FocusBlockedPage
                url={blockedUrl}
                reason={blockReason}
                topic={focusTopic}
                onGoBack={handleGoBack}
                onEndFocus={handleEndFocusFromBlock}
              />
            ) : (
              <>
                {/* Show home page if no URL, otherwise show webview */}
                {!activeTab.url || activeTab.url === '' ? (
                  <HomePage onNavigate={handleHomePageNavigate} />
                ) : (
                  <>
                    {/* Platform-specific rendering - Use webview for both Electron and Capacitor */}
                    {isElectron() ? (
                      // Electron: Use webview with navigation tracking
                      <ElectronWebView
                        key={activeTab.id}
                        url={activeTab.url}
                        tabId={activeTab.id}
                        onNavigate={handleWebViewNavigate}
                        onTitleUpdate={handleTitleUpdate}
                        onLoadStart={handleLoadStart}
                        onLoadProgress={handleLoadProgress}
                        onLoadStop={handleLoadStop}
                        className="w-full h-full"
                        ref={(el) => {
                          if (el) {
                            activeTab.webview = el
                          }
                        }}
                        style={{ display: 'flex', flex: 1 }}
                      />
                    ) : isCapacitor() ? (
                      // Capacitor: Use native webview for better performance
                      <CapacitorWebView
                        key={activeTab.id}
                        url={activeTab.url}
                        tabId={activeTab.id}
                        onNavigate={handleWebViewNavigate}
                        className="w-full h-full"
                        style={{ display: 'flex', flex: 1 }}
                      />
                    ) : (
                      // Fallback: Should not reach here due to platform routing in App.jsx
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Please use the desktop or mobile app</p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
      
      {/* Focus Mode Component */}
      <FocusMode onUrlCheck={handleFocusModeChange} />
      
      {/* Settings Modal */}
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  )
}
