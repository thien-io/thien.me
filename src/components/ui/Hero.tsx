import Image from 'next/image'
import profile from '../../public/notion-me.png'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useThemeContext } from '~/hooks/useTheme';
import TypewriterEffect from '../Typewriter'
import TextScrambler from './TextScrambler'
import { Description } from './typography';
import TextLoop from './TextLoop'

export default function Hero() {
  const { systemTheme, setTheme } = useThemeContext()
  return (
    <div>
      <div className="flex min-h-screen flex-col justify-center pb-[25vh] lg:mt-6 lg:px-4">
        <div className="relative">
          <div
            className=" mb-2 text-4xl font-bold lg:text-4xl"
            style={{
              backgroundColor: systemTheme.background.primary,
              color: systemTheme.text.title,
            }}
          >
            <p
              className="mt-20 border-8 p-4 pt-10 pb-20 text-8xl "
              style={{
                color: systemTheme.text.title,
                borderColor: systemTheme.text.title,
              }}
            >
              THIEN
              <span className="flex tracking-wider">TRAN.</span>
              <TextLoop />
            </p>
          </div>

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
            className="text-md mb-4 font-mono tracking-normal "
          >
            <span className="font-mono">
<p>Check out my new website, <Link href="https://thientran.io">thientran.io</Link></p>
            </span>
          </motion.div>

          <div className="mt-8  flex flex-row gap-x-2 gap-y-4 ">
            <Link
              href="mailto:hi@thien.me"
              className=" border-2 bg-yellow-600 bg-opacity-60 py-1 px-4 font-mono text-yellow-100"
              style={{
                borderColor: systemTheme.text.accent2,
              }}
            >
              <TextScrambler>email</TextScrambler>
            </Link>

            <Link
              href="https://github.com/thienjs"
              className=" border-2 bg-violet-900 bg-opacity-60 py-1 px-4 font-mono text-violet-100"
              style={{
                borderColor: systemTheme.text.accent2,
              }}
            >
              <TextScrambler>github</TextScrambler>
            </Link>

            <Link
              href="https://linkedin.com/in/thienio"
              className=" border-2 bg-blue-600 bg-opacity-60 py-1 px-4 font-mono text-blue-100"
              style={{
                borderColor: systemTheme.text.accent2,
              }}
            >
              <TextScrambler>linkedin</TextScrambler>
            </Link>

            <Link
              href="https://discordapp.com//users/thien.io"
              className="  border-2 bg-cyan-800 bg-opacity-60 py-1 px-4 font-mono text-cyan-100"
              style={{
                borderColor: systemTheme.text.accent2,
              }}
            >
              <TextScrambler>discord</TextScrambler>
            </Link>
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
