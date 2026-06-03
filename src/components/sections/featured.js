import React, { useEffect, useRef } from 'react';
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
            I studied actuarial mathematics with minors in statistics and computer science at UCLA.
            All of my experience in ML, data science, and engineering comes from self-study and
            genuine curiosity. I'm constantly seeking to learn and grow.
          </p>
          <p>
            I've completed courses on{' '}
            <a href="https://www.linkedin.com/in/williammaucla/">LinkedIn Learning and Coursera</a>.
            Also check out my{' '}
            <a href="https://www.oreilly.com/playlists/c666e77c-45f7-4275-8678-ce03f0aa1960/">
              O'Reilly account
            </a>{' '}
            for books I'm reading and my{' '}
            <a href="https://www.zotero.org/groups/2583428/williams_reading_list/library">
              Zotero library
            </a>{' '}
            for arXiv papers and research I'm exploring.
          </p>
        </div>
      </StyledText>
    </section>
  );
};

export default Featured;
