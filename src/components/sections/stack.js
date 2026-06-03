import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const tools = [
  { name: 'Python', icon: 'Python' },
  { name: 'GCP', icon: 'GCP' },
  { name: 'Kubernetes', icon: 'Kubernetes' },
  { name: 'Docker', icon: 'Docker' },
  { name: 'Terraform', icon: 'Terraform' },
  { name: 'Apache Airflow', icon: 'Airflow' },
  { name: 'Apache Kafka', icon: 'Kafka' },
  { name: 'Rust', icon: 'Rust' },
];

const StyledStackSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
    margin-bottom: 10px;
  }

  .subtitle {
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    margin-bottom: 50px;
  }

  .tools-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 32px;
    max-width: 600px;
  }
`;

const StyledTool = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: default;
  transition: var(--transition);

  &:hover {
    transform: translateY(-4px);

    .icon-wrap {
      color: var(--green);
    }

    .tool-name {
      color: var(--green);
    }
  }

  .icon-wrap {
    color: var(--light-slate);
    transition: var(--transition);

    svg {
      width: 42px;
      height: 42px;
    }
  }

  .tool-name {
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    color: var(--slate);
    transition: var(--transition);
  }
`;

const Stack = () => {
  const revealTitle = useRef(null);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {return;}
    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealContainer.current, srConfig(100));
  }, []);

  return (
    <StyledStackSection>
      <h2 ref={revealTitle}>Under the Hood</h2>
      <p className="subtitle">tools &amp; tech I work with</p>

      <div className="tools-grid" ref={revealContainer}>
        {tools.map(({ name, icon }) => (
          <StyledTool key={name}>
            <div className="icon-wrap">
              <Icon name={icon} />
            </div>
            <span className="tool-name">{name}</span>
          </StyledTool>
        ))}
      </div>
    </StyledStackSection>
  );
};

export default Stack;
