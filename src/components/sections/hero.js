import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  padding: 0;

  @media (max-width: 480px) and (min-height: 700px) {
    padding-bottom: 10vh;
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 10px;
    color: var(--slate);
    line-height: 0.9;
    font-size: clamp(40px, 8vw, 0px);
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 10px;
  }
  .github-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const StyledTyping = styled.h2`
  margin: 0;
  font-size: clamp(40px, 8vw, 80px);
  font-weight: 700;
  line-height: 1.1;
  color: var(--lightest-slate);
  min-height: 1.2em;
`;

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const prefersReducedMotion = usePrefersReducedMotion();
  const fullText = 'Hi, my name is William Ma';
  const typingTextRef = useRef('');

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isMounted || prefersReducedMotion) {
      setDisplayText(fullText);
      return;
    }

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        typingTextRef.current += fullText[currentIndex];
        setDisplayText(typingTextRef.current);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, [isMounted, prefersReducedMotion]);

  const one = <StyledTyping className="big-heading">{displayText}</StyledTyping>;
  const two = <h3 className="big-heading">ML Engineering Manager</h3>;
  const three = (
    <>
      <p>Thanks for taking a look at my profile!</p>
    </>
  );
  const four = (
    <a className="github-link" href="https://github.com/wmaucla" target="_blank" rel="noreferrer">
      Check out my Github!
    </a>
  );
  const five = (
    <a
      className="email-link"
      href="https://www.linkedin.com/in/williammaucla/"
      target="_blank"
      rel="noreferrer">
      Connect on my LinkedIn!
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
