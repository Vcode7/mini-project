import { useState, useEffect } from 'react'
import Browser from './components/Browser'
import AiChat from './components/AiChat'
import DownloadPage from './components/DownloadPage'
import { ThemeProvider } from './context/ThemeContext'
import { BrowserProvider } from './context/BrowserContext'
import { isWeb } from './utils/platform'

function App() {
  // Show download page for web browsers
  if (isWeb()) {
    return (
      <ThemeProvider>
        <DownloadPage />
      </ThemeProvider>
    )
  }

  // Show full app for Electron and Capacitor
  return (
    <ThemeProvider>
      <BrowserProvider>
        <div className="h-screen w-screen overflow-hidden bg-background text-foreground">
          <Browser />
          <AiChat />
        </div>
      </BrowserProvider>
    </ThemeProvider>
  )
}

export default App
