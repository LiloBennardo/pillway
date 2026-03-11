import { useState, useRef, useCallback } from 'react'

export function usePullToRefresh(onRefresh, threshold = 70) {
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const pulling = useRef(false)

  const onTouchStart = useCallback((e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      pulling.current = true
    }
  }, [])

  const onTouchMove = useCallback((e) => {
    if (!pulling.current) return
    const distance = Math.max(0, e.touches[0].clientY - startY.current)
    setPullDistance(Math.min(distance * 0.5, threshold * 1.3))
  }, [threshold])

  const onTouchEnd = useCallback(async () => {
    if (!pulling.current) return
    pulling.current = false

    if (pullDistance >= threshold) {
      setRefreshing(true)
      if (navigator.vibrate) navigator.vibrate(20)
      await onRefresh()
      setRefreshing(false)
    }
    setPullDistance(0)
  }, [pullDistance, threshold, onRefresh])

  return { refreshing, pullDistance, onTouchStart, onTouchMove, onTouchEnd }
}
