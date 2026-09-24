import { useEffect, useRef } from 'react'
import './ShapeGrid.css'

export default function ShapeGrid({ direction = 'diagonal', speed = .35, borderColor = 'rgba(151,83,255,.28)', squareSize = 42, hoverFillColor = 'rgba(205,255,67,.2)', hoverTrailAmount = 5, className = '' }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current, context = canvas.getContext('2d')
    let frame, offset = { x: 0, y: 0 }, hovered = null, trail = []
    const resize = () => { const ratio = window.devicePixelRatio || 1; canvas.width = canvas.offsetWidth * ratio; canvas.height = canvas.offsetHeight * ratio; context.setTransform(ratio, 0, 0, ratio, 0, 0) }
    const draw = () => {
      const width = canvas.offsetWidth, height = canvas.offsetHeight, columns = Math.ceil(width / squareSize) + 3, rows = Math.ceil(height / squareSize) + 3, active = [hovered, ...trail].filter(Boolean)
      context.clearRect(0, 0, width, height)
      for (let column = -1; column < columns; column++) for (let row = -1; row < rows; row++) {
        const x = column * squareSize + offset.x, y = row * squareSize + offset.y, index = active.findIndex(cell => cell.x === column && cell.y === row)
        if (index >= 0) { context.fillStyle = hoverFillColor; context.globalAlpha = 1 - index / (active.length + 1); context.fillRect(x, y, squareSize, squareSize); context.globalAlpha = 1 }
        context.strokeStyle = borderColor; context.strokeRect(x, y, squareSize, squareSize)
      }
      const fade = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * .72)
      fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,.58)'); context.fillStyle = fade; context.fillRect(0, 0, width, height)
    }
    const animate = () => { if (direction === 'left' || direction === 'diagonal') offset.x = (offset.x - speed + squareSize) % squareSize; if (direction === 'right') offset.x = (offset.x + speed) % squareSize; if (direction === 'up' || direction === 'diagonal') offset.y = (offset.y - speed + squareSize) % squareSize; if (direction === 'down') offset.y = (offset.y + speed) % squareSize; draw(); frame = requestAnimationFrame(animate) }
    const move = event => { const rect = canvas.getBoundingClientRect(), x = Math.floor((event.clientX - rect.left - offset.x) / squareSize), y = Math.floor((event.clientY - rect.top - offset.y) / squareSize); if (!hovered || hovered.x !== x || hovered.y !== y) { if (hovered) trail = [hovered, ...trail].slice(0, hoverTrailAmount); hovered = { x, y } } }
    resize(); animate(); window.addEventListener('resize', resize); canvas.addEventListener('mousemove', move); canvas.addEventListener('mouseleave', () => { hovered = null })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); canvas.removeEventListener('mousemove', move) }
  }, [borderColor, direction, hoverFillColor, hoverTrailAmount, speed, squareSize])
  return <canvas ref={canvasRef} className={`shapegrid-canvas ${className}`} />
}
