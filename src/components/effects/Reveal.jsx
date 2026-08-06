import { motion } from 'framer-motion'

const expo = [0.16, 1, 0.3, 1]

export default function Reveal({ children, delay = 0, y = 40, className = '', once = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: expo }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
