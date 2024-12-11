import { graphql } from '@octokit/graphql'

import type { GetStaticProps } from 'next'
import RepoCard from '~/components/cards/Projects/RepoCard'
import { Title, Description  } from '~/components/ui/typography'
const ProjectsPage = ({ repos }) => (
  <>
    <Title>Projects</Title>
    <Description>what i've worked on</Description>
    <div className="grid grid-rows-1 xl:grid-cols-2 gap-x-2 gap-y-1 ">
      {repos.map((repo) => (
        <div key={repo.name} className="">
          <RepoCard {...repo} />
        </div>
      ))}
    </div>

    <p className="w-max rounded-md border-gray-500 bg-gray-200 p-2 px-4 text-sm dark:bg-gray-700">
      <a
        href="https://github.com/thien-io?tab=repositories"
        target="_blank"
        rel="noopener noreferrer"
      >
        more on github
      </a>
    </p>
  </>
)

export const getStaticProps: GetStaticProps = async () => {
  // https://docs.github.com/en/graphql/reference/objects#repository
  // @ts-ignore
  const { user } = await graphql(
    `
      query ($username: String!, $sort: RepositoryOrderField!, $limit: Int) {
        user(login: $username) {
          repositories(
            first: $limit
            isLocked: false
            isFork: false
            ownerAffiliations: OWNER
            privacy: PUBLIC
            orderBy: { field: $sort, direction: DESC }
          ) {
            edges {
              node {
                name
                url
                description
                pushedAt
                stargazerCount
                forkCount

                primaryLanguage {
                  name
                  color
                }
              }
            }
          }
        }
      }
    `,
    {
      username: 'thien-io',
      limit: 12,
      sort: 'STARGAZERS',
      headers: {
        authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
      },
    }
  )

  const repos = user.repositories.edges.map(({ node: repo }) => ({
    name: repo.name,
    url: repo.url,
    description: repo.description,
    updatedAt: repo.pushedAt,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    language: repo.primaryLanguage,
  }))

  return {
    props: {
      repos,
    },
    // fetch updated data and update page every 10 minutes (as needed)
    // https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration
    revalidate: 600,
  }
}

export default ProjectsPage