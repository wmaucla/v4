import React, { useState } from 'react';
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

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

const StyledAboutWrapper = styled.div`
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity 0.5s ease-in;
  pointer-events: ${({ $show }) => ($show ? 'auto' : 'none')};
`;

const IndexPage = ({ location }) => {
  const [showAbout, setShowAbout] = useState(false);
  const [heroComplete, setHeroComplete] = useState(false);

  const handleButtonsShow = () => {
    setShowAbout(true);
    setHeroComplete(true);
  };

  return (
    <Layout location={location} heroComplete={heroComplete}>
      <StyledMainContainer className="fillHeight">
        <Hero onButtonsShow={handleButtonsShow} />
        <StyledAboutWrapper $show={showAbout}>
          <About />
        </StyledAboutWrapper>
        <Jobs />
        <Featured />
        <Projects />
        <Stack />
        <Readings />
        <Contact />
      </StyledMainContainer>
    </Layout>
  );
};

IndexPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default IndexPage;
