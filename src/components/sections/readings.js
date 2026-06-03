import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

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
  const itemRefs = useRef([]);

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Zotero-API-Key': process.env.GATSBY_API_KEY,
      },
    };
    fetch('https://api.zotero.org/groups/2583428/items?limit=5', requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Zotero API error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setAPIData(data))
      .catch(err => console.warn('Could not load readings:', err));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 5;

  const getTypeIcon = itemType => {
    switch (itemType) {
      case 'journalArticle':
        return 'Bookmark';
      case 'blogPost':
        return 'Star';
      case 'webpage':
      default:
        return 'External';
    }
  };

  const projectInner = node => {
    const { title, url, itemType } = node;

    return (
      <a href={url} target="_blank" rel="noreferrer" aria-label={title}>
        <span className="reading-left">
          <span className="reading-type-icon">
            <Icon name={getTypeIcon(itemType)} />
          </span>
          <span className="reading-title">{title}</span>
        </span>
        <span className="external-icon">
          <Icon name="External" />
        </span>
      </a>
    );
  };

  return (
    <StyledProjectsSection>
      <h2 ref={revealTitle}> Current Readings </h2>
      {/*
      <Link className="inline-link archive-link" to="/archive" ref={revealArchiveLink}>
        view the archive
      </Link>
      */}

      <p>
        {' '}
        Readings are fetched automatically from{' '}
        <a href="https://www.zotero.org/groups/2583428/williams_reading_list/library">
          {' '}
          my Zotero library.{' '}
        </a>
      </p>

      <ul className="readings-list">
        <TransitionGroup component={null}>
          {apiData &&
            apiData.map((item, i) => {
              if (!itemRefs.current[i]) {
                itemRefs.current[i] = React.createRef();
              }
              return (
                <CSSTransition
                  key={i}
                  nodeRef={itemRefs.current[i]}
                  classNames="fadeup"
                  timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                  exit={false}>
                  <StyledProject
                    ref={el => {
                      itemRefs.current[i].current = el;
                      revealProjects.current[i] = el;
                    }}
                    style={{
                      transition: `all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1) 0s`,
                    }}>
                    {projectInner(item.data)}
                  </StyledProject>
                </CSSTransition>
              );
            })}
        </TransitionGroup>
      </ul>
    </StyledProjectsSection>
  );
};

export default Readings;
