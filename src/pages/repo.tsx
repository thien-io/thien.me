import { graphql } from '@octokit/graphql'
import Layout from '~/components/ui/Layout'
import type { GetStaticProps } from 'next'
import RepoCard from '~/components/Projects/RepoCard'

const RepoPage = ({ repos }) => (
  <Layout>
    <div>
      {repos.map((repo) => (
        <div key={repo.name} className="repo_card">
          <RepoCard {...repo} />
        </div>
      ))}

      <style jsx>{`
        div {
          display: flex;
          flex-flow: row wrap;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
        }

        div .repo_card {
          flex-grow: 1;
          margin: 0.5em;
          width: 370px;
        }
      `}</style>
    </div>

    <p>
      <a
        href="https://github.com/thienjs?tab=repositories"
        target="_blank"
        rel="noopener noreferrer"
      >
        View more on GitHub...
      </a>

      <style jsx>{`
        p {
          text-align: center;
          margin-bottom: 0;
        }
      `}</style>
    </p>
  </Layout>
)

export const getStaticProps: GetStaticProps = async () => {
  // https://docs.github.com/en/graphql/reference/objects#repository
  const { user } = await graphql(
    `
      query ($username: String!, $sort: String, $limit: Int) {
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
      username: 'thienjs',
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

export default RepoPage
