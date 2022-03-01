import { motion } from 'framer-motion'
import { FunctionComponent, ReactChildren } from 'react'

export const Title: FunctionComponent = ({
  children,
}: {
  children: ReactChildren
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.1, duration: 0.9 }}
      variants={{
        hidden: {
          opacity: 0.6,
          y: 5,
        },
        visible: {
          opacity: 1,
          y: 0,
        },
      }}
      className="text-md mt-20 mb-10 font-serif font-semibold text-gray-800 dark:text-gray-300"
    >
      {children}
    </motion.div>
  )
}

export default Title
