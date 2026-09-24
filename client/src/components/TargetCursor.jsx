import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './TargetCursor.css'

export default function TargetCursor({ targetSelector = 'a, button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"]), .cursor-target', spinDuration = 1.8, hoverDuration = .3, cursorColor = '#ffffff', cursorColorOnTarget = '#e0ff38' }) {
  const cursorRef = useRef(null)
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return
    const cursor = cursorRef.current
    const dot = cursor.querySelector('.target-cursor-dot')
    const corners = [...cursor.querySelectorAll('.target-cursor-corner')]
    document.documentElement.classList.add('target-cursor-enabled')
    document.body.classList.add('target-cursor-enabled')
    gsap.set(cursor, { xPercent: -50, yPercent: -50 })
    const spin = gsap.to(cursor, { rotation: 360, duration: spinDuration, ease: 'none', repeat: -1 })
    let activeTarget = null
    let pointer = { x: 0, y: 0 }
    let targetTween = null
    let targetResizeObserver = null
    const frameSize = 12
    const frameOffset = 0

    const killVisualTweens = () => {
      gsap.killTweensOf(cursor, 'x,y,scale')
      gsap.killTweensOf([dot, ...corners])
    }

    const reset = (x = pointer.x, y = pointer.y) => {
      activeTarget = null
      targetResizeObserver?.disconnect()
      targetResizeObserver = null
      document.documentElement.classList.remove('target-cursor-active')
      document.body.classList.remove('target-cursor-active')
      targetTween?.kill()
      targetTween = null
      killVisualTweens()
      const resetPositions = [[-18, -18], [6, -18], [6, 6], [-18, 6]]
      corners.forEach((corner, index) => gsap.to(corner, { x: resetPositions[index][0], y: resetPositions[index][1], borderColor: cursorColor, duration: .2, ease: 'power3.out' }))
      gsap.to(cursor, { x, y, scale: 1, duration: .12, ease: 'power3.out' })
      gsap.to(dot, { autoAlpha: 0, duration: .12 })
      spin.play()
    }

    // Keep the dot at the pointer while the cursor frame moves to a target.
    // This prevents it from snapping through the frame's centre between targets.
    const syncDotToPointer = () => gsap.set(dot, {
      x: pointer.x - Number(gsap.getProperty(cursor, 'x')),
      y: pointer.y - Number(gsap.getProperty(cursor, 'y')),
    })

    const getTarget = element => element instanceof Element ? element.closest(targetSelector) : null

    const lockFrameToTarget = (target, duration = hoverDuration) => {
      const rect = target.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      // Each corner's resting CSS transform is different. These values cancel
      // that transform, putting the outside edge directly on the target rect.
      const positions = [
        [rect.left - frameOffset - centerX + 18, rect.top - frameOffset - centerY + 18],
        [rect.right + frameOffset - frameSize - centerX - 6, rect.top - frameOffset - centerY + 18],
        [rect.right + frameOffset - frameSize - centerX - 6, rect.bottom + frameOffset - frameSize - centerY - 6],
        [rect.left - frameOffset - centerX + 18, rect.bottom + frameOffset - frameSize - centerY - 6]
      ]
      targetTween?.kill()
      targetTween = gsap.to(cursor, {
        x: centerX,
        y: centerY,
        duration,
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: syncDotToPointer,
        onComplete: syncDotToPointer,
      })
      corners.forEach((corner, index) => gsap.to(corner, { x: positions[index][0], y: positions[index][1], borderColor: cursorColorOnTarget, duration, ease: 'power2.out', overwrite: 'auto' }))
    }

    const move = event => {
      pointer = { x: event.clientX, y: event.clientY }
      const hoveredElement = document.elementFromPoint(event.clientX, event.clientY)
      const hoveredTarget = getTarget(hoveredElement)
      if (hoveredTarget && hoveredTarget !== activeTarget) {
        enter({ target: hoveredElement, clientX: event.clientX, clientY: event.clientY })
        return
      }
      if (!hoveredTarget && activeTarget) {
        reset(event.clientX, event.clientY)
        return
      }
      if (!activeTarget) {
        gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: .1, ease: 'power3.out', overwrite: 'auto' })
      } else {
        syncDotToPointer()
      }
    }
    const enter = event => {
      const target = getTarget(event.target)
      if (!target || target === activeTarget) return
      activeTarget = target
      document.documentElement.classList.add('target-cursor-active')
      document.body.classList.add('target-cursor-active')
      spin.pause()
      targetTween?.kill()
      killVisualTweens()
      pointer = { x: event.clientX, y: event.clientY }
      syncDotToPointer()
      gsap.to(dot, { autoAlpha: 1, duration: .12, overwrite: 'auto' })
      lockFrameToTarget(target)
      if (window.ResizeObserver) {
        targetResizeObserver = new ResizeObserver(() => lockFrameToTarget(target, .12))
        targetResizeObserver.observe(target)
      }
    }
    const leave = event => {
      const target = getTarget(event.target)
      if (!target || target !== activeTarget || target.contains(event.relatedTarget)) return
      const nextTarget = getTarget(event.relatedTarget)
      if (nextTarget && nextTarget !== target) return
      reset(event.clientX, event.clientY)
    }
    const down = () => gsap.to(cursor, { scale: .82, duration: .15 })
    const up = () => gsap.to(cursor, { scale: 1, duration: .15 })
    const handleVisibilityChange = () => {
      if (document.hidden) reset()
    }
    const handleWindowBlur = () => reset()
    const handleWindowLeave = event => reset(event.clientX, event.clientY)
    const refreshTargetFrame = () => { if (activeTarget) lockFrameToTarget(activeTarget, .12) }
    window.addEventListener('mousemove', move); document.addEventListener('mouseover', enter); document.addEventListener('mouseout', leave); window.addEventListener('mouseleave', handleWindowLeave); window.addEventListener('mousedown', down); window.addEventListener('mouseup', up); document.addEventListener('visibilitychange', handleVisibilityChange); window.addEventListener('blur', handleWindowBlur); window.addEventListener('resize', refreshTargetFrame); document.addEventListener('scroll', refreshTargetFrame, true)
    return () => { reset(); document.documentElement.classList.remove('target-cursor-enabled'); document.body.classList.remove('target-cursor-enabled'); spin.kill(); window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', enter); document.removeEventListener('mouseout', leave); window.removeEventListener('mouseleave', handleWindowLeave); window.removeEventListener('mousedown', down); window.removeEventListener('mouseup', up); document.removeEventListener('visibilitychange', handleVisibilityChange); window.removeEventListener('blur', handleWindowBlur); window.removeEventListener('resize', refreshTargetFrame); document.removeEventListener('scroll', refreshTargetFrame, true) }
  }, [targetSelector, spinDuration, hoverDuration, cursorColor, cursorColorOnTarget])
  return <div ref={cursorRef} className="target-cursor-wrapper" aria-hidden="true"><div className="target-cursor-dot" />{['corner-tl', 'corner-tr', 'corner-br', 'corner-bl'].map(name => <div key={name} className={`target-cursor-corner ${name}`} style={{ borderColor: cursorColor }} />)}</div>
}
