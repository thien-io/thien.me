'use client'

import {
  SiCloudflare,
  SiCss3,
  SiFigma,
  SiFirebase,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiMarkdown,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVisualstudiocode,
  SiVite
} from '@icons-pack/react-simple-icons'
import { ZapIcon } from 'lucide-react'
import * as React from 'react'

const StacksCard = () => {
  return (
    <div className='flex flex-col'>
      <div className='flex items-center gap-2'>
        <ZapIcon className='size-[18px]' />
        <h2 className='text-sm font-light'>Stacks</h2>
      </div>
      <div className='py-4 flex'  >
        <SiHtml5 className='size-10' />
        <SiCss3 className='size-10' />
        <SiJavascript className='size-10' />
        <SiTypescript className='size-10' />
        <SiFigma className='size-10' />
        <SiTailwindcss className='size-10' />
        <SiNextdotjs className='size-10' />
        <SiReact className='size-10' />
        <SiPython className='size-10' />
        <SiPostgresql className='size-10' />
      </div>
      <div className='flex'>
        <SiPrisma className='size-10' />
        <SiMysql className='size-10' />
        <SiFirebase className='size-10' />
        <SiGit className='size-10' />
        <SiVite className='size-10' />
        <SiVisualstudiocode className='size-10' />
        <SiCloudflare className='size-10' />
        <SiMarkdown className='size-10' />
        <SiJest className='size-10' />
        <SiNodedotjs className='size-10' />
      </div>
    </div>
  )
}

export default StacksCard