'use client'

import { useEffect } from 'react'

/**
 * Suppresses known harmless console warnings/errors in development
 * These are from third-party libraries and browser extensions, not our code
 */
export default function ConsoleSuppressor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return // Only suppress in development
    }

    const originalError = console.error
    const originalWarn = console.warn

    // Suppress known harmless errors
    const errorHandler = (...args: any[]) => {
      const errorString = args.map(arg => 
        typeof arg === 'string' ? arg : 
        arg?.message || arg?.name || arg?.toString() || ''
      ).join(' ')

      // Suppress known harmless errors
      const suppressPatterns = [
        'WalletNotReadyError',
        'Could not establish connection',
        'Receiving end does not exist',
        'moz-extension://',
        'solanaActionsContentScript',
        'contentScript.js',
        'detectStore',
        'h1-check.js',
        'lockdown-install.js',
        'SES Removing unpermitted intrinsics',
      ]

      const shouldSuppress = suppressPatterns.some(pattern => 
        errorString.includes(pattern)
      )

      if (!shouldSuppress) {
        originalError.apply(console, args)
      }
    }

    // Suppress known harmless warnings
    const warnHandler = (...args: any[]) => {
      const warnString = args.map(arg => 
        typeof arg === 'string' ? arg : 
        arg?.message || arg?.name || arg?.toString() || ''
      ).join(' ')

      // Suppress known harmless warnings
      const suppressPatterns = [
        'preloaded with link preload was not used',
        'StreamMiddleware - Unknown response id',
        'solflare-detect-metamask',
        'Phantom was registered as a Standard Wallet',
      ]

      const shouldSuppress = suppressPatterns.some(pattern => 
        warnString.includes(pattern)
      )

      if (!shouldSuppress) {
        originalWarn.apply(console, args)
      }
    }

    console.error = errorHandler
    console.warn = warnHandler

    return () => {
      console.error = originalError
      console.warn = originalWarn
    }
  }, [])

  return null // This component doesn't render anything
}

