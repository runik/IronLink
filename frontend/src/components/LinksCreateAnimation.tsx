import type { ReactNode } from 'react'
import { motion, type TargetAndTransition, type Transition } from 'framer-motion'
import pressSvg from '@/assets/press.svg'

interface LinksCreateAnimationProps {
  children: ReactNode
  isPressing: boolean
  onPress?: () => void
}

export function LinksCreateAnimation({ children, isPressing, onPress }: LinksCreateAnimationProps) {
  const transition: Transition = {
    type: "tween",
    ease: "easeIn",
    duration: isPressing ? 1.0 : 0.2,
    times: isPressing ? [0, 0.2, 0.5, 1] : undefined
  }

  const animatePress: TargetAndTransition = {
    x: isPressing ? [0, -315, -315, 0] : 0,
  }

  const animateChildren: TargetAndTransition = {
    scaleX: isPressing ? [1, 0.0, 0.0, 1] : 1,
  }

  const handleAnimationUpdate = (latest: any) => {
    // Check if animation has reached the first keyframe (x: -315)
    if (isPressing && latest.x === -315 && onPress) {
      onPress()
    }
  }

  return (
    <div className="relative">
      <motion.div 
        className="absolute top-[10px] right-[-130px] z-10"
        animate={animatePress}
        transition={transition}
        onUpdate={handleAnimationUpdate}
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