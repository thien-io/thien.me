import { intlFormat, formatDistanceToNowStrict } from "date-fns";
import { StarOcticon, ForkOcticon } from "~/components/icons/octicons";

import styles from "./RepoCard.module.css";

type Props = {
  name: string;
  url: string;
  description?: string;
  language?: {
    name: string;
    color?: string;
  };
  stars?: number;
  forks?: number;
  updatedAt: string;
};

const RepoCard = (props: Props) => (
  <div className="border p-3 rounded-sm w-full text-sm">
    <a
      className={styles.name}
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.name}
    </a>

    {props.description && (
      <p className={styles.description}>{props.description}</p>
    )}

    <div className={styles.meta}>
      {props.language && (
        <div className="text-sm mr-2">
          <span className={styles.language_color}>
            <style jsx>{`
              span {
                background-color: ${props.language.color};
              }
            `}</style>
          </span>
          <span>{props.language.name}</span>
        </div>
      )}

      {props.stars > 0 && (
        <div className="text-sm">
          <div className="">
            <a
              href={`${props.url}/stargazers`}
              title={`${props.stars.toLocaleString('en-US')} ${
                props.stars === 1 ? 'star' : 'stars'
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row mr-2"
            >
              <StarOcticon fill="currentColor" className={styles.octicon} />
              <span>{props.stars.toLocaleString('en-US')}</span>
            </a>
          </div>
        </div>
      )}

      {props.forks > 0 && (
        <div className="text-sm">
          <a
            href={`${props.url}/network/members`}
            title={`${props.forks.toLocaleString('en-US')} ${
              props.forks === 1 ? 'fork' : 'forks'
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ForkOcticon fill="currentColor" className={styles.octicon} />
            <span>{props.forks.toLocaleString('en-US')}</span>
          </a>
        </div>
      )}

      <div
        className={styles.meta_item}
        title={intlFormat(
          new Date(props.updatedAt),
          {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short',
          },
          {
            locale: 'en-US',
          }
        )}
      >
        <span>
          Updated{' '}
          {formatDistanceToNowStrict(new Date(props.updatedAt), {
            addSuffix: true,
          })}
        </span>
      </div>
    </div>
  </div>
)

export default RepoCard;