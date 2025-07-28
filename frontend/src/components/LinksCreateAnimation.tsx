import type { ReactNode } from 'react'
import { motion, type TargetAndTransition, type Transition } from 'framer-motion'
import { useRef, useState, useLayoutEffect } from 'react'
import pressSvg from '@/assets/press.svg'

interface LinksCreateAnimationProps {
  children: ReactNode
  isPressing: boolean
}

export function LinksCreateAnimation({ children, isPressing }: LinksCreateAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [animationDistance, setAnimationDistance] = useState(315)

  useLayoutEffect(() => {
    const updateAnimationDistance = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        // Calculate distance to move the press elements to the center
        // Assuming press elements are positioned at -130px from edges
        const pressOffset = 10
        const distanceToCenter = (containerWidth / 2) + pressOffset
        setAnimationDistance(distanceToCenter)
      }
    }

    updateAnimationDistance()
    
    // Update on window resize
    window.addEventListener('resize', updateAnimationDistance)
    return () => window.removeEventListener('resize', updateAnimationDistance)
  }, [])

  const transition: Transition = {
    type: "tween",
    ease: "easeIn",
    duration: isPressing ? 1.0 : 0.2,
    times: isPressing ? [0, 0.2, 0.5, 1] : undefined
  }

  const animatePress: TargetAndTransition = {
    x: isPressing ? [0, -animationDistance, -animationDistance, 0] : 0,
  }

  const animateChildren: TargetAndTransition = {
    scaleX: isPressing ? [1, 0.0, 0.0, 1] : 1,
  }

  return (
    <div ref={containerRef} className="relative">
      <motion.div 
        className="absolute top-[10px] right-[-130px] z-10"
        animate={animatePress}
        transition={transition}
      >
        <img src={pressSvg} alt="Press" className="h-[180px] w-auto" />
      </motion.div>
      <motion.div 
        className="absolute top-[10px] left-[-130px] z-10 transform -scale-x-100"
        animate={animatePress}
        transition={transition}
      >
        <img src={pressSvg} alt="Press" className="h-[180px] w-auto" />
      </motion.div>

      <motion.div
        animate={animateChildren}
        transition={transition}
      >
        {children}
      </motion.div>
    </div>
  )
} 