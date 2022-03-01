import Layout from 'components/ui/Layout'
import Title from 'components/ui/typography/Title'
import useSWR from 'swr'

import { fetcher } from '~/lib/fetcher'
import { NowPlayingSong } from '~/lib/types'

export default function Now() {
  const year = new Date().getFullYear()
  const date = new Date().getDate()
  const month = new Date().getMonth()
  const time = new Date().getTime()
  const hour = new Date().getHours()
  const minute = new Date().getMinutes()
  const second = new Date().getSeconds()
  const lokibday = '2021-05-10'
  const birthDate = new Date(lokibday)
  const today = new Date()
  const age = year - birthDate.getFullYear()
  const lokimonth = birthDate.getMonth() - month

  const { data } = useSWR<NowPlayingSong>('/api/now-playing', fetcher)

  return (
    <>
      <div className="min-w-96 text-left">
        <h3 className="mt-20 mb-10 text-sm font-semibold text-neutral-800 dark:text-neutral-300">
          what I'm doing to now:
        </h3>
        <ul className="space-y-3 text-left font-serif text-sm text-neutral-800 dark:text-neutral-300">
          <li>- applying for my first tech job</li>
          <li>- taking more risks</li>
          <li>- walking Loki - my 8 month old puppy</li>

          <li>
            - focusing on getting better at React, Nextjs, Typescript, and
            communicating with backends
          </li>
          <li>- solidifying my fudamentals of javascript, css, and html</li>
          <li>- learning spanish (slowly)</li>
          <li>- reading/listening to books when I can</li>
          <li>- staying active by working on my tennis game</li>
          <li>- starting to write meaningful and helpful blog posts</li>
          <li>
            - listening to :{' '}
            {data?.songUrl ? (
              <a
                className=""
                href={data.songUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.title}
              </a>
            ) : (
              <span className="">a lot of 70's music</span>
            )}
          </li>
        </ul>
        <div className="mt-20 text-sm text-neutral-700 dark:text-neutral-400">
          last updated: {month}.{date}.{year}
          {'   '}@ {hour}:{minute}:{second}
        </div>
      </div>
    </>
  )
}
