import { getPublishedArticles, getArticlePage } from '~/lib/notion'
import { Fragment, useEffect } from 'react'
import { Client } from '@notionhq/client'
import siteMetadata from '~/data/siteMetadata'
import slugify from 'slugify'
import { useRouter } from 'next/router'
import {ViewCounter, LikeButton} from '~/components/features'
import { AnchorLink } from '~/components/ui/links/AnchorLink'
import Image from 'next/image'
import { CodeBlock } from '~/components/blog/Codeblock'
import { Callout } from '~/components/ui/Callout'
import { YoutubeEmbed } from '~/components/blog/YoutubeEmbed'
import { GetStaticPaths, GetStaticProps } from 'next'
import {Title} from '~/components/ui/typography'
import ScrollIndicator from '~/components/ui/ScrollIndicator'
import CDbutton from '~/components/ui/CDbutton'
import Link from 'next/link'
export const Text = ({ text }) => {
  if (!text) {
    return null
  }
  return text.map((value, index) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value
    return (
      <span
        key={index}
        className={[
          bold ? 'font-bold' : null,
          italic ? 'italic' : null,
          code
            ? 'mx-1 inline-block rounded-md bg-cyan-200 py-0.5 px-2 align-middle text-base tracking-tight text-indigo-500 dark:bg-cyan-900 dark:bg-opacity-50 dark:text-indigo-200'
            : null,
          strikethrough ? 'line-through' : null,
          underline ? 'underline' : null,
        ].join(' ')}
        style={color !== 'default' ? { color } : {}}
      >
        {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
      </span>
    )
  })
}

export function renderBlocks(block) {
  const { type, id } = block
  const value = block[type]

  switch (type) {
    case 'paragraph':
      return (
        <p className="text-sm text-neutral-800 dark:text-neutral-300">
          <Text text={value.text} />
        </p>
      )
    case 'heading_1':
      return (
        <h1 className="mb-2 text-3xl font-bold text-neutral-800 dark:text-neutral-300">
          <AnchorLink text={value.text[0].text.content}>
            <Text text={value.text} />
          </AnchorLink>
        </h1>
      )
    case 'heading_2':
      return (
        <h2 className="pb-6 text-lg font-semibold text-neutral-800 dark:text-neutral-300">
          <AnchorLink text={value.text[0].text.content}>
            <Text text={value.text} />
          </AnchorLink>
        </h2>
      )
    case 'heading_3':
      return (
        <h3 className="mb-2 text-xl font-semibold text-neutral-800 dark:text-neutral-300">
          <AnchorLink text={value.text[0].text.content}>
            <Text text={value.text} />
          </AnchorLink>
        </h3>
      )
    case 'bulleted_list_item':
      return (
        <li className="ml-4 text-sm text-neutral-800 dark:text-neutral-300">
          <Text text={value.text} />
        </li>
      )
    case 'numbered_list_item':
      return (
        <li>
          <Text text={value.text} />
        </li>
      )
    case 'to_do':
      return (
        <div>
          <label
            htmlFor={id}
            className="flex items-center justify-start space-x-3"
          >
            <input
              id={id}
              aria-describedby={value.text}
              name={id}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
            />
            <Text text={value.text} />
          </label>
        </div>
      )
    case 'toggle':
      return (
        <details>
          <summary>
            <Text text={value.text} />
          </summary>
          {value.children?.map((block) => (
            <Fragment key={block.id}>{renderBlocks(block)}</Fragment>
          ))}
        </details>
      )
    case 'child_page':
      return <p>{value.title}</p>
    case 'image':
      const src =
        value.type === 'external' ? value.external.url : value.file.url
      const caption =
        value.caption.length >= 1 ? value.caption[0].plain_text : ''
      return (
        <figure className="mt-0">
          <Image
            className=""
            objectFit="cover"
            width={500}
            height={500}
            alt={
              caption
                ? caption
                : 'A visual depiction of what is being written about'
            }
            src={src}
          />
          {caption && (
            <figcaption className="text-center">{caption}</figcaption>
          )}
        </figure>
      )
    case 'code':
      return (
        <div>
          <CodeBlock
            language={value.language}
            code={value.text[0].text.content}
          />
        </div>
      )
    case 'bookmark':
      return (
        <div className="flex=col flex">
          <Link href={value.url}>
            <a>{value.url}</a>
          </Link>
        </div>
      )

    case 'callout':
      return (
        <Callout>
          {value.icon && <span>{value.icon.emoji}</span>}
          <div>
            <Text text={value.text} />
          </div>
        </Callout>
      )
    case 'embed':
      const codePenEmbedKey = value.url.slice(value.url.lastIndexOf('/') + 1)
      return (
        <div>
          <iframe
            height="600"
            className="w-full"
            scrolling="no"
            title="Postage from Bag End"
            src={`https://codepen.io/thienjs/embed/preview/${codePenEmbedKey}?default-tab=result`}
            frameBorder="no"
            loading="lazy"
            allowFullScreen={true}
          >
            See the Pen <a href={value.url}></a> by Thien Tran (
            <a href="https://codepen.io/thienjs">@thienjs</a>) on{' '}
            <a href="https://codepen.io">CodePen</a>.
          </iframe>
        </div>
      )
    case 'table_of_contents':
      return <div>TOC</div>
    case 'video':
      return <YoutubeEmbed url={value.external.url} />
    case 'quote':
      return (
        <blockquote className="rounded-r-lg p-4">
          <Text text={value.text} />
        </blockquote>
      )
    case 'divider':
      return (
        <hr className="my-16 h-10 w-full border-none text-center before:text-2xl before:text-[#D1D5DB] before:content-['∿∿∿']"></hr>
      )
    default:
      return `❌ Unsupported block (${
        type === 'unsupported' ? 'unsupported by Notion API' : type
      })`
  }
}

const ArticlePage = ({
  content,
  title,
  coverImage,
  slug,
  publishedDate,
  lastEditedAt,
  summary,
}) => {
  const { push } = useRouter()
  const publishedOn = new Date(publishedDate).toLocaleDateString(
    siteMetadata.locale,
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )

  const modifiedDate = new Date(lastEditedAt).toLocaleDateString(
    siteMetadata.locale,
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )

  return (
    <>
      <ScrollIndicator>
        <div className="text-neutral-800 dark:text-neutral-400">
          <article className="col-span-9 mt-12">
            <div className="">
              <div className="">
                <Title>{title}</Title>
                <div className="mb-10 text-left">
                  <div className="mb-2 flex space-x-2 text-sm text-slate-500  dark:text-slate-500">
                    <p className="tx-sm m-0 text-slate-500  dark:text-slate-500">
                      {publishedOn}
                    </p>
                    <p className="m-0  text-sm text-slate-500  dark:text-slate-500">
                      •
                    </p>
                    <ViewCounter slug={slug} />
                  </div>
                  {publishedOn !== modifiedDate && (
                    <p className="mt-0 text-xs text-slate-500  dark:text-slate-500">
                      (Updated on {modifiedDate})
                    </p>
                  )}
                </div>
              </div>
              <div className=" w-full min-w-full space-y-6">
                {content.map((block) => (
                  <Fragment key={block.id}>{renderBlocks(block)}</Fragment>
                ))}
              </div>
            </div>
          </article>
        </div>
        <span className=" mt-12">
          <CDbutton />
        </span>
      </ScrollIndicator>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = []
  const data: any = await getPublishedArticles(process.env.NOTION_DATABASE_ID)

  data.forEach((result) => {
    if (result.object === 'page') {
      paths.push({
        params: {
          slug: slugify(
            result.properties.Name.title[0].plain_text
          ).toLowerCase(),
        },
      })
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params: { slug } }) => {
  let content = []
  let articleTitle = ''
  let publishedDate = null
  let lastEditedAt = null
  let coverImage = null
  let summary = null

  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  })

  const data: any = await getPublishedArticles(process.env.NOTION_DATABASE_ID)

  const page: any = getArticlePage(data, slug)

  articleTitle = page.properties.Name.title[0].plain_text
  publishedDate = page.properties.Published.date.start
  lastEditedAt = page.properties.LastEdited.last_edited_time
  summary = page.properties.Summary?.rich_text[0]?.plain_text
  coverImage =
    page.properties?.coverImage?.files[0]?.file?.url ||
    page.properties.coverImage?.files[0]?.external?.url ||
    'https://via.placeholder.com/600x400.png'

  let blocks = await notion.blocks.children.list({
    block_id: page.id,
  })

  content = [...blocks.results]

  while (blocks.has_more) {
    blocks = await notion.blocks.children.list({
      block_id: page.id,
      start_cursor: blocks.next_cursor,
    })

    content = [...content, ...blocks.results]
  }

  return {
    props: {
      content,
      title: articleTitle,
      publishedDate,
      lastEditedAt,
      slug,
      coverImage,
      summary,
    },
    revalidate: 30,
  }
}

export default ArticlePage
