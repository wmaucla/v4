import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import sr from '@utils/sr';
import { trackClick } from '@utils';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const srReveal = (delay = 200) => ({
  origin: 'bottom',
  distance: '20px',
  duration: 500,
  delay,
  rotate: { x: 0, y: 0, z: 0 },
  opacity: 0,
  scale: 1,
  easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  mobile: true,
  reset: false,
  useDelay: 'always',
  viewFactor: 0.25,
  viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
});

const StyledProjectsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .readings-list {
    ${({ theme }) => theme.mixins.resetList};
    width: 100%;
    max-width: 700px;
    margin-top: 30px;
  }
`;

const StyledProject = styled.li`
  border-bottom: 1px solid var(--lightest-navy);

  &:first-child {
    border-top: 1px solid var(--lightest-navy);
  }

  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 4px;
    color: var(--light-slate);
    text-decoration: none;
    transition: var(--transition);

    &:hover {
      color: var(--green);
    }

    .reading-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .reading-type-icon {
      flex-shrink: 0;
      color: var(--green);
      svg {
        width: 18px;
        height: 18px;
      }
    }

    .reading-title {
      font-size: var(--fz-md);
      color: var(--lightest-slate);
      transition: var(--transition);
    }

    &:hover .reading-title {
      color: var(--green);
    }

    &:hover .reading-type-icon {
      color: var(--green);
    }

    .external-icon {
      flex-shrink: 0;
      margin-left: 12px;
      color: var(--light-slate);
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

const Readings = () => {
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [apiData, setAPIData] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Zotero-API-Key': process.env.GATSBY_API_KEY, // yes this is very bad
      },
    };
    fetch('https://api.zotero.org/groups/2583428/items?limit=6', requestOptions)
      .then(response => response.json())
      .then(data => {
        setAPIData(data);
      });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    sr.reveal(revealTitle.current, srReveal());
    sr.reveal(revealArchiveLink.current, srReveal());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srReveal(i * 100)));
  }, []);

  const projectInner = node => {
    const { title, url, itemType } = node;

    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackClick(`reading_${title}`, url)}>
        <div className="reading-left">
          <span className="reading-type-icon">
            <Icon name={itemType === 'journalArticle' ? 'External' : 'Bookmark'} />
          </span>
          <span className="reading-title">{title}</span>
        </div>
        <span className="external-icon">
          <Icon name="External" />
        </span>
      </a>
    );
  };

  return (
    <StyledProjectsSection>
      <h2 ref={revealTitle}> Current Readings </h2>

      <p>
        Readings are fetched automatically from{' '}
        <a
          href="https://www.zotero.org/groups/2583428/williams_reading_list/library"
          onClick={() =>
            trackClick(
              'readings_zotero_library',
              'https://www.zotero.org/groups/2583428/williams_reading_list/library',
            )
          }>
          my Zotero library.
        </a>
      </p>

      <ul className="readings-list">
        <TransitionGroup component={null}>
          {apiData &&
            apiData.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={300} exit={false}>
                <StyledProject
                  key={i}
                  ref={el => (revealProjects.current[i] = el)}
                  style={{
                    transition: `all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;`,
                  }}>
                  {projectInner(item.data)}
                </StyledProject>
              </CSSTransition>
            ))}
        </TransitionGroup>
      </ul>
    </StyledProjectsSection>
  );
};

export default Readings;
