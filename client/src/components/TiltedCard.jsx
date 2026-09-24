import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import './TiltedCard.css'

const spring = { damping: 30, stiffness: 180, mass: 1.3 }

export default function TiltedCard({ imageSrc, altText = 'Tilted card image', containerHeight = '300px', containerWidth = '100%', imageHeight = '300px', imageWidth = '300px', scaleOnHover = 1.04, rotateAmplitude = 7, backgroundContent = null }) {
  const ref = useRef(null)
  const rotateX = useSpring(useMotionValue(0), spring)
  const rotateY = useSpring(useMotionValue(0), spring)
  const scale = useSpring(1, spring)

  const handleMouseMove = event => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = event.clientX - rect.left - rect.width / 2
    const offsetY = event.clientY - rect.top - rect.height / 2
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude)
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude)
  }

  const resetTilt = () => {
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
  }

  return <figure ref={ref} className="tilted-card-figure" style={{ height: containerHeight, width: containerWidth }} onMouseMove={handleMouseMove} onMouseEnter={() => scale.set(scaleOnHover)} onMouseLeave={resetTilt}>
    <motion.div className="tilted-card-inner" style={{ width: imageWidth, height: imageHeight, rotateX, rotateY, scale }}>
      {backgroundContent && <div className="tilted-card-background" aria-hidden="true">{backgroundContent}</div>}
      <img src={imageSrc} alt={altText} className="tilted-card-img" />
    </motion.div>
  </figure>
}
