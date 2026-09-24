import { useEffect, useMemo, useRef, useState } from 'react'
import './PixelSwap.css'

const buildPixels = (width, height, size, pattern) => {
  const pixels = []
  const columns = Math.ceil(width / size)
  const rows = Math.ceil(height / size)
  const centerX = (columns - 1) / 2
  const centerY = (rows - 1) / 2
  for (let row = 0; row < rows; row += 1) for (let column = 0; column < columns; column += 1) {
    const centerDistance = Math.hypot(column - centerX, row - centerY)
    const maxDistance = Math.hypot(centerX, centerY) || 1
    const order = pattern === 'left-to-right' ? column / columns : pattern === 'center-out' ? centerDistance / maxDistance : row / rows
    pixels.push({ id: `${row}-${column}`, left: column * size, top: row * size, order })
  }
  return pixels
}

// Full-bleed PixelSwap adaptation for route transitions.
export default function PixelSwap({ firstContent, secondContent, active, onComplete, pixelSize = 72, duration = 720, pixelDuration = 260, revealDuration = 560, coverHold = 140, pattern = 'left-to-right' }) {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [isAnimating, setIsAnimating] = useState(false)
  const [phase, setPhase] = useState('idle') // 'idle' | 'cover' | 'hold' | 'reveal'
  const [revealRun, setRevealRun] = useState(0)
  const completeRef = useRef(onComplete)
  const completedRef = useRef(false)
  const timerRef = useRef(null)
  const revealTimerRef = useRef(null)
  const gridRef = useRef(null)
  const finishedRef = useRef(0)
  completeRef.current = onComplete
  useEffect(() => {
    const measure = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    measure(); window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  useEffect(() => {
    // Reset state when not active so the component can run again later
    if (!active) {
      // onComplete changes the route and makes `active` false. Keep the
      // completed cover in place until the opposite-direction reveal finishes.
      if (isAnimating) return
      completedRef.current = false
      setPhase('idle')
      if (timerRef.current) { window.clearTimeout(timerRef.current); timerRef.current = null }
      if (revealTimerRef.current) { window.clearTimeout(revealTimerRef.current); revealTimerRef.current = null }
      setIsAnimating(false)
      return
    }
    if (isAnimating || completedRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { completedRef.current = true; completeRef.current?.(); return }
    // If there's no incoming content, finish immediately to avoid leaving an overlay
    if (!secondContent) { completedRef.current = true; completeRef.current?.(); return }
    // Start cover phase: pixels expand to cover the page
    setPhase('cover')
    setIsAnimating(true)
    // Safety overall timeout in case animations don't complete
    timerRef.current = window.setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true
        setPhase('idle')
        setIsAnimating(false)
        completeRef.current?.()
      }
      timerRef.current = null
    }, duration + 1000)
    return () => { if (timerRef.current) { window.clearTimeout(timerRef.current); timerRef.current = null } }
  }, [active, duration, isAnimating, secondContent])

  // Listen for pixel animationend events — handle cover then reveal phases
  useEffect(() => {
    if (!isAnimating || !gridRef.current) return undefined
    const grid = gridRef.current
    finishedRef.current = 0
    const pixels = grid.querySelectorAll('.pixel-swap__pixel')
    const pixelCount = pixels.length
    const onAnimEnd = (e) => {
      if (!e.target.classList || !e.target.classList.contains('pixel-swap__pixel')) return
      finishedRef.current += 1
      // Keep the entire viewport covered while the new route mounts, then reveal it.
      if (phase === 'cover' && finishedRef.current >= pixelCount) {
        finishedRef.current = 0
        completeRef.current?.()
        setPhase('hold')
        revealTimerRef.current = window.setTimeout(() => {
          setRevealRun(r => r + 1)
          setPhase('reveal')
          revealTimerRef.current = null
        }, coverHold)
        return
      }
      // When reveal phase finishes: cleanup and finish
      if (phase === 'reveal' && finishedRef.current >= pixelCount) {
        if (!completedRef.current) {
          completedRef.current = true
          if (timerRef.current) { window.clearTimeout(timerRef.current); timerRef.current = null }
          setPhase('idle')
          setIsAnimating(false)
        }
      }
    }
    grid.addEventListener('animationend', onAnimEnd)
    // Safety: if animationend doesn't fire (e.g. tab hidden), ensure completion after duration + 1000ms
    const safety = window.setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true
        if (timerRef.current) { window.clearTimeout(timerRef.current); timerRef.current = null }
        setPhase('idle')
        setIsAnimating(false)
      }
    }, duration + 1000)
    return () => { grid.removeEventListener('animationend', onAnimEnd); window.clearTimeout(safety) }
  }, [isAnimating, duration, phase, coverHold])
  const pixels = useMemo(() => buildPixels(size.width, size.height, pixelSize, pattern), [size, pixelSize, pattern])
  const spread = Math.max(0, duration - pixelDuration)
  const revealSpread = Math.round(duration * 0.5)
  return <div className="pixel-swap">
    <div className="pixel-swap__page">{firstContent}</div>
    {/* Render incoming only during reveal so the page change happens after cover completes */}
    {isAnimating && phase === 'reveal' && <div className="pixel-swap__incoming">{secondContent}</div>}
    {isAnimating && phase === 'hold' && <div className="pixel-swap__grid pixel-swap__grid--hold" aria-hidden="true" />}
    {isAnimating && phase !== 'hold' && <div ref={gridRef} className="pixel-swap__grid" aria-hidden="true">{pixels.map(pixel => {
      // Reveal from the same edge and in the same direction as the cover sweep.
      const order = pixel.order
      const delay = Math.round(order * (phase === 'reveal' ? revealSpread : spread))
      const animName = phase === 'cover' ? 'pixel-swap-cover' : 'pixel-swap-reveal'
      // include phase and revealRun in key so reveal remounts elements and restarts animations
      const key = `${pixel.id}-${phase}-${revealRun}`
      const animationDuration = phase === 'reveal' ? revealDuration : pixelDuration
      return <span key={key} className="pixel-swap__pixel" style={{ left: pixel.left, top: pixel.top, width: pixelSize, height: pixelSize, animationDuration: `${animationDuration}ms`, animationDelay: `${delay}ms`, animationName: animName }} />
    })}</div>}
  </div>
}
