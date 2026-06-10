import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { usePrefersReducedMotion } from '@hooks';

const StyledSideElement = styled.div`
  width: 40px;
  position: fixed;
  bottom: 0;
  left: ${props => (props.orientation === 'left' ? '40px' : 'auto')};
  right: ${props => (props.orientation === 'left' ? 'auto' : '40px')};
  z-index: 10;
  color: var(--light-slate);

  @media (max-width: 1080px) {
    left: ${props => (props.orientation === 'left' ? '20px' : 'auto')};
    right: ${props => (props.orientation === 'left' ? 'auto' : '20px')};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Side = ({ children, isHome, orientation, heroComplete }) => {
  const [isMounted, setIsMounted] = useState(!isHome);
  const prefersReducedMotion = usePrefersReducedMotion();
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!isHome || prefersReducedMotion) {
      return;
    }
    if (heroComplete) {
      setIsMounted(true);
    }
  }, [heroComplete]);

  return (
    <StyledSideElement orientation={orientation}>
      {prefersReducedMotion ? (
        <>{children}</>
      ) : (
        <TransitionGroup component={null}>
          {isMounted && (
            <CSSTransition
              nodeRef={nodeRef}
              classNames={isHome ? 'fade' : ''}
              timeout={isHome ? 2000 : 0}>
              <div ref={nodeRef}>{children}</div>
            </CSSTransition>
          )}
        </TransitionGroup>
      )}
    </StyledSideElement>
  );
};

Side.propTypes = {
  children: PropTypes.node.isRequired,
  isHome: PropTypes.bool,
  orientation: PropTypes.string,
  heroComplete: PropTypes.bool,
};

export default Side;
