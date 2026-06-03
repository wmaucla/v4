import React, { useState, useEffect, useLayoutEffect } from 'react';

// useLayoutEffect runs synchronously before paint — eliminates hydration flash.
// Falls back to useEffect on the server (where window doesn't exist).
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Layout,
  Hero,
  About,
  Jobs,
  Featured,
  Projects,
  Stack,
  Contact,
  Readings,
} from '@components';

const SNAPPED_WIDTH = '220px';
const SNAPPED_PERCENT = '22%';
const SNAPPED_LEFT_WIDTH = `max(${SNAPPED_PERCENT}, ${SNAPPED_WIDTH})`;

const StyledFixedHero = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 4;
  display: flex;
  align-items: center;
  background-color: var(--navy);
  overflow: hidden;

  width: ${({ $snapped }) => ($snapped ? SNAPPED_LEFT_WIDTH : '100%')};
  min-width: ${({ $snapped }) => ($snapped ? SNAPPED_WIDTH : 'unset')};
  padding: ${({ $snapped }) => ($snapped ? '0 20px 0 50px' : '0 150px')};
  transition: width 0.7s cubic-bezier(0.645, 0.045, 0.355, 1),
    padding 0.7s cubic-bezier(0.645, 0.045, 0.355, 1);

  @media (max-width: 1080px) {
    padding: ${({ $snapped }) => ($snapped ? '0 14px 0 32px' : '0 100px')};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledContent = styled.div`
  margin-left: ${SNAPPED_LEFT_WIDTH};

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const StyledRightPanel = styled.main`
  padding-top: calc(100vh + 60px);
  padding-right: 50px;
  padding-bottom: 0;
  padding-left: 40px;
  counter-reset: section;

  @media (max-width: 1080px) {
    padding-right: 35px;
    padding-left: 30px;
  }

  @media (max-width: 768px) {
    padding-top: 120px;
    padding-right: 25px;
    padding-left: 25px;
  }
`;

const IndexPage = ({ location }) => {
  const [heroComplete, setHeroComplete] = useState(false);
  const [snapped, setSnapped] = useState(
    typeof window !== 'undefined' && window.scrollY > window.innerHeight * 0.3,
  );

  const handleButtonsShow = () => {
    setHeroComplete(true);
  };

  useIsomorphicLayoutEffect(() => {
    const handleScroll = () => {
      setSnapped(window.scrollY > window.innerHeight * 0.3);
    };
    // Sync immediately before first paint
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout location={location} heroComplete={heroComplete}>
      {/* Fixed hero: transitions from full-screen to left 28% slot */}
      <StyledFixedHero $snapped={snapped}>
        <Hero onButtonsShow={handleButtonsShow} snapped={snapped} />
      </StyledFixedHero>

      {/* Right panel always in normal flow — creates page scroll height */}
      <StyledContent>
        <StyledRightPanel>
          <About />
          <Jobs />
          <Featured />
          <Projects />
          <Stack />
          <Readings />
          <Contact />
        </StyledRightPanel>
      </StyledContent>
    </Layout>
  );
};

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
