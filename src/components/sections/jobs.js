import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledJobsSection = styled.section`
  max-width: 900px;
`;

const StyledTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const StyledJobItem = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 40px;
  align-items: flex-start;
  padding: 20px;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;

  @media (prefers-reduced-motion: no-preference) {
    &:hover {
      background-color: rgba(100, 200, 150, 0.05);
      transform: translateX(10px);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 120px 1fr;
    gap: 20px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .date {
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 500;
    color: var(--light-slate);
    text-transform: uppercase;
    letter-spacing: 0.1em;

    @media (max-width: 600px) {
      margin-bottom: 5px;
    }
  }

  .content {
    h3 {
      margin: 0 0 5px 0;
      font-size: var(--fz-xxl);
      font-weight: 600;
      line-height: 1.3;

      .company {
        color: var(--green);
      }
    }

    p {
      margin: 0 0 15px 0;
      color: var(--light-slate);
      line-height: 1.6;
    }

    ul {
      padding: 0;
      margin: 0 0 20px 0;
      list-style: none;

      li {
        position: relative;
        padding-left: 30px;
        margin-bottom: 10px;
        color: var(--light-slate);
        font-size: var(--fz-lg);

        &:before {
          content: '▹';
          position: absolute;
          left: 0;
          color: var(--green);
        }
      }
    }

    .stats-image {
      margin-top: 30px;
      border-radius: var(--border-radius);
      overflow: hidden;

      img {
        max-width: 100%;
        height: auto;
        display: block;
      }

      a {
        display: block;
      }
    }
  }
`;

const Jobs = () => {
  const data = useStaticQuery(graphql`
    query {
      jobs: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/jobs/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              company
              location
              range
              url
            }
            html
          }
        }
      }
    }
  `);

  const jobsData = data.jobs.edges;
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledJobsSection id="jobs" ref={revealContainer}>
      <h2 className="numbered-heading">Where I've Worked</h2>

      <StyledTimeline>
        {jobsData &&
          jobsData.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { title, url, company, range } = frontmatter;

            return (
              <StyledJobItem key={i}>
                <div className="date">{range}</div>
                <div className="content">
                  <h3>
                    <span>{title}</span>
                    <span className="company">
                      {' '}
                      <a href={url} target="_blank" rel="noreferrer" className="inline-link">
                        {company}
                      </a>
                    </span>
                  </h3>

                  <div dangerouslySetInnerHTML={{ __html: html }} />

                  {company === 'Attain' && (
                    <div className="stats-image">
                      <a href="https://gitlab.com/wma7" target="_blank" rel="noreferrer">
                        <StaticImage
                          src="../../images/gitlab-history.png"
                          alt="GitLab History"
                          style={{ cursor: 'pointer' }}
                        />
                      </a>
                    </div>
                  )}

                  {company === 'Shipt' && (
                    <div className="stats-image">
                      <a href="https://git.io/streak-stats">
                        <img
                          height="200"
                          alt="GitHub Streak Stats"
                          src="https://github-readme-streak-stats.herokuapp.com?user=willmashipt&theme=dark&date_format=M%20j%5B%2C%20Y%5D&exclude_days=Sun,Sat"
                        />
                      </a>
                    </div>
                  )}
                </div>
              </StyledJobItem>
            );
          })}
      </StyledTimeline>
    </StyledJobsSection>
  );
};

export default Jobs;
