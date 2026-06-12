import React, { useEffect, useRef } from 'react';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';
import { trackClick } from '@utils';

const Featured = () => {
  const revealTitle = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
  }, []);

  return (
    <section id="projects">
      <h2 className="numbered-heading" ref={revealTitle}>
        Projects, Learnings, and Readings
      </h2>
      <div>
        <p>
          I studied actuarial mathematics with minors in statistics and computer science at UCLA.
          All of my experience in ML, data science, and engineering comes from self-study and
          genuine curiosity. I'm constantly seeking to learn and grow.
        </p>
        <p>
          I've completed courses on{' '}
          <a
            href="https://www.linkedin.com/in/williammaucla/"
            onClick={() =>
              trackClick('about_linkedin_learning', 'https://www.linkedin.com/in/williammaucla/')
            }>
            LinkedIn Learning and Coursera
          </a>
          . Also check out my{' '}
          <a
            href="https://www.oreilly.com/playlists/c666e77c-45f7-4275-8678-ce03f0aa1960/"
            onClick={() =>
              trackClick(
                'about_oreilly',
                'https://www.oreilly.com/playlists/c666e77c-45f7-4275-8678-ce03f0aa1960/',
              )
            }>
            O'Reilly account
          </a>{' '}
          for books I'm reading and my{' '}
          <a
            href="https://www.zotero.org/groups/2583428/williams_reading_list/library"
            onClick={() =>
              trackClick(
                'about_zotero',
                'https://www.zotero.org/groups/2583428/williams_reading_list/library',
              )
            }>
            Zotero library
          </a>{' '}
          for arXiv papers and research I'm exploring.
        </p>
      </div>
    </section>
  );
};

export default Featured;
