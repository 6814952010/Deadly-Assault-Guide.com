import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import SoftAurora from './SoftAurora'
import zenlessZoneZeroIcon from './images/Zenless_Zone_Zero_logo.png'
import './StaggeredMenu.css'

export const StaggeredMenu = ({ position = 'right', items = [], socialItems = [], displaySocials = false, displayItemNumbering = false, className, accentColor = '#e0ff38', isFixed = false, closeOnClickAway = true, hideToggle = false, onMenuOpen, onMenuClose }) => {
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const toggleRef = useRef(null)
  const openRef = useRef(false)

  useLayoutEffect(() => {
    if (panelRef.current) gsap.set(panelRef.current, { xPercent: position === 'right' ? 100 : -100 })
  }, [position])

  const closeMenu = useCallback(() => {
    if (!openRef.current) return
    openRef.current = false
    setOpen(false)
    onMenuClose?.()
    gsap.to(panelRef.current, { xPercent: position === 'right' ? 100 : -100, duration: .38, ease: 'power3.inOut' })
  }, [onMenuClose, position])

  const toggleMenu = useCallback(() => {
    const nextOpen = !openRef.current
    openRef.current = nextOpen
    setOpen(nextOpen)
    if (nextOpen) {
      onMenuOpen?.()
      gsap.to(panelRef.current, { xPercent: 0, duration: .48, ease: 'power3.out' })
    } else {
      onMenuClose?.()
      gsap.to(panelRef.current, { xPercent: position === 'right' ? 100 : -100, duration: .38, ease: 'power3.inOut' })
    }
  }, [onMenuClose, onMenuOpen, position])

  useEffect(() => {
    if (!closeOnClickAway || !open) return undefined
    const handleClickOutside = event => {
      if (!panelRef.current?.contains(event.target) && !toggleRef.current?.contains(event.target)) closeMenu()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeOnClickAway, closeMenu, open])

  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = event => { if (event.key === 'Escape') closeMenu() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeMenu, open])

  return <div className={`${className ? `${className} ` : ''}staggered-menu-wrapper${isFixed ? ' fixed-wrapper' : ''}`} style={{ '--sm-accent': accentColor }} data-position={position} data-open={open || undefined}>
    <header className="staggered-menu-header" aria-label="Main navigation header">
      {!hideToggle && <button ref={toggleRef} className="sm-menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="staggered-menu-panel" onClick={toggleMenu} type="button"><img src={zenlessZoneZeroIcon} alt="" /></button>}
    </header>
    <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
      <div className="sm-panel-inner">
        <p className="sm-panel-eyebrow">DEADLY ASSAULT / NAVIGATION</p>
        <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
          {items.map((item, index) => <li className="sm-panel-itemWrap" key={`${item.label}-${index}`}><a className="sm-panel-item" href={item.link || '#'} aria-label={item.ariaLabel} data-index={index + 1} onClick={event => { if (typeof item.onClick === 'function') { event.preventDefault(); item.onClick(); closeMenu() } }}><span>{item.label}</span><b>↗</b></a></li>)}
        </ul>
        {displaySocials && socialItems.length > 0 && <div className="sm-socials"><p>ELSEWHERE</p><div>{socialItems.map(item => <a key={item.label} href={item.link} target="_blank" rel="noreferrer">{item.label}</a>)}</div></div>}
      </div>
      <div className="sm-menu-beam-slot" aria-hidden="true"><SoftAurora speed={5.5} scale={0.5} brightness={1.2} color1="#5ed3fe" color2="#e100ff" noiseFrequency={1} noiseAmplitude={1.2} bandHeight={0.97} bandSpread={0.2} octaveDecay={0.01} layerOffset={0} colorSpeed={0.7} enableMouseInteraction={false} mouseInfluence={0} /></div>
    </aside>
  </div>
}

export default StaggeredMenu
