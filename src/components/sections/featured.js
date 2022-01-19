import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';

const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;

const Featured = () => {
  const data = useStaticQuery(graphql`
    {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/featured/" } }
        sort: { fields: [frontmatter___date], order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              title
              cover {
                childImageSharp {
                  gatsbyImageData(width: 700, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
                }
              }
              tech
              github
              external
              cta
            }
            html
          }
        }
      }
    }
  `);

  const featuredProjects = data.featured.edges.filter(({ node }) => node);
  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  return (
    <section id="projects">
      <h2 className="numbered-heading" ref={revealTitle}>
        Projects, Learnings, and Readings
      </h2>
      <StyledText>
      <div>
        <p>
          I studied actuarial mathematics with a minor in statistics and a minor in computer science and graduated from UCLA. All of my experience in ML, data science, and engineering comes from 
          self-study and my own interest. I am constantly seeking to learn and grow!
        </p>
        <p>
          I have taken many <a href="https://www.linkedin.com/in/williammaucla/"> LinkedIn courses and Coursera courses</a>.  
          Also check out my <a href="https://www.oreilly.com/playlists/c666e77c-45f7-4275-8678-ce03f0aa1960/"> O'Reilly account </a> for books I am reading and my
          <a href="https://www.zotero.org/groups/2583428/williams_reading_list/library"> Zotero </a> library for Arxiv papers and other websites I am browsing, and see below for some projects I have worked on.
        </p>
      </div>
      </StyledText>
    </section>
  );
};

export default Featured;
