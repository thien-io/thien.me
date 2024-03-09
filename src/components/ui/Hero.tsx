import Image from 'next/image'
import profile from '../../public/notion-me.png'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useThemeContext } from '~/hooks/useTheme';
import TypewriterEffect from '../Typewriter'
import TextScrambler from './TextScrambler'

export default function Hero() {
  const { systemTheme, setTheme } = useThemeContext()
  return (
    <div>
      <div className="flex min-h-screen flex-col justify-center pb-[25vh] lg:mt-6 lg:px-4">
        <div>
          <div
            className=" mb-2 text-4xl font-bold lg:text-4xl"
            style={{
              backgroundColor: systemTheme.background.primary,
              color: systemTheme.text.title,
            }}
          >
            <p className="mt-20 pt-20 text-6xl"> <TextScrambler>
              
            THIEN TRAN
            </TextScrambler>
            </p>
          </div>
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ delay: 1.3, duration: 0.8 }}
            variants={{
              hidden: {
                opacity: 0,
              },
              visible: {
                opacity: 1,
              },
            }}
            className="mb-2 font-mono text-lg"
            style={{ color: systemTheme.text.accent }}
          >
            (tee-en)
          </motion.div>
        </div>

        <div
          className="text-md mt-8   "
          style={{ color: systemTheme.text.secondary }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, duration: 0.6 }}
            variants={{
              hidden: {
                opacity: 0,
                y: 100,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            className="mb-4 text-xl tracking-tight  "
          >
            <TypewriterEffect
              string={`Hello! You've discovered my little slice of the internet.`}
            />
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4, duration: 0.8 }}
            variants={{
              hidden: {
                opacity: 0,
                y: 100,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            className="mb-4 text-xl tracking-tight "
          >
            Get to know{' '}
            <Link legacyBehavior href="/about">
              <a className="relative before:absolute before:bottom-0 before:left-0 before:h-full before:w-full before:origin-bottom before:scale-y-[0.35] before:bg-cyan-500 before:opacity-50 before:transition-transform before:duration-500 before:ease-in-out hover:before:scale-y-100">
                <span className="relative hover:text-gray-800 hover:dark:text-gray-200">
                  me
                </span>
              </a>
            </Link>{' '}
            and what I'm doing{' '}
            <Link legacyBehavior href="/now">
              <a className="relative before:absolute before:bottom-0 before:left-0 before:h-full before:w-full before:origin-bottom before:scale-y-[0.35] before:bg-cyan-500 before:opacity-50 before:transition-transform before:duration-500 before:ease-in-out hover:before:scale-y-100">
                <span className="relative hover:text-gray-800 hover:dark:text-gray-200">
                  now
                </span>
              </a>
            </Link>
            .
          </motion.div>
          <motion.div
            initial="hidden"
            className="text-xl tracking-tight"
            animate="visible"
            transition={{ delay: 0.6, duration: 0.7 }}
            variants={{
              hidden: {
                opacity: 0,
                y: 100,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
          >
            If you want to chat, email me at{' '}
            <a
              href="mailto:hi@thien.me"
              className="relative before:absolute before:bottom-0 before:left-0 before:h-full before:w-full before:origin-bottom before:scale-y-[0.35] before:bg-cyan-500 before:opacity-50 before:transition-transform before:duration-500 before:ease-in-out hover:before:scale-y-100"
            >
              <span className="relative hover:text-gray-800 hover:dark:text-gray-200">
                hi@thien.me
              </span>
            </a>
            .
          </motion.div>
          <div className="mt-8 hidden gap-x-6">
            <Link href="/" className="border px-4 py-0.5">
              github
            </Link>
            <div>linkedin</div>
            <div>email</div>
          </div>
        </div>
      </div>
      <div className="mb-10 hidden flex-shrink-0 lg:mt-12">
        <Image
          src="https://github.com/thienjs.png"
          alt="Profile"
          priority={true}
          className="rounded-full border border-white"
          width={150}
          height={150}
        />
      </div>
    </div>
  )
}
