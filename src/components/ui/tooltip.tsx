'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function Tooltip({ content, children, side = 'right' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      
      let top = 0
      let left = 0
      
      switch (side) {
        case 'right':
          top = rect.top + rect.height / 2
          left = rect.right + 8
          break
        case 'left':
          top = rect.top + rect.height / 2
          left = rect.left - 8
          break
        case 'top':
          top = rect.top - 8
          left = rect.left + rect.width / 2
          break
        case 'bottom':
          top = rect.bottom + 8
          left = rect.left + rect.width / 2
          break
      }
      
      setPosition({ top, left })
    }
  }, [isVisible, side])

  const transformClasses = {
    top: '-translate-x-1/2 -translate-y-full',
    right: '-translate-y-1/2',
    bottom: '-translate-x-1/2',
    left: '-translate-x-full -translate-y-1/2',
  }

  return (
    <>
      <div
        ref={triggerRef}
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && typeof document !== 'undefined' && createPortal(
        <div
          className={`fixed z-[9999] px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap animate-in fade-in-0 zoom-in-95 ${transformClasses[side]}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {content}
          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              side === 'right'
                ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-1'
                : side === 'left'
                ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1'
                : side === 'top'
                ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1'
                : 'top-0 left-1/2 -translate-x-1/2 -translate-y-1'
            }`}
          />
        </div>,
        document.body
      )}
    </>
  )
}

