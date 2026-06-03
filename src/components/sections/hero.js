import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  margin-bottom: 0;

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
    margin: 10px 0 40px 0;
    color: var(--slate);
    line-height: 0.9;
    font-size: clamp(40px, 8vw, 0px);
    opacity: ${({ showTitle }) => (showTitle ? 1 : 0)};
    transition: opacity 0.3s ease-in;
    font-family: var(--font-mono);
  }

  p {
    margin: 0;
    max-width: 540px;
    opacity: ${({ showMessage }) => (showMessage ? 1 : 0)};
    transition: opacity 0.3s ease-in;
    font-family: var(--font-mono);
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

const StyledIntro = styled.div`
  font-size: var(--fz-heading);
  color: var(--green);
  font-family: var(--font-mono);
  font-weight: 400;
  margin: 0 0 10px 4px;

  @media (max-width: 480px) {
    margin: 0 0 5px 2px;
  }
`;

const StyledName = styled.h2`
  margin: 0;
  font-size: clamp(40px, 8vw, 80px);
  font-weight: 700;
  line-height: 1.1;
  color: var(--lightest-slate);
  min-height: 1.2em;
  font-family: var(--font-mono);
`;

const StyledCursor = styled.span`
  color: var(--green);
  animation: ${({ $show }) => ($show ? 'blink 0.6s infinite' : 'none')};
  opacity: ${({ $show }) => ($show ? 1 : 0)};

  @keyframes blink {
    0%,
    49% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0;
    }
  }
`;

const StyledButton = styled.a`
  ${({ theme }) => theme.mixins.bigButton};
  display: inline-block;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transform: ${({ $show }) => ($show ? 'translateY(0)' : 'translateY(10px)')};
  transition: opacity 0.3s ease-in, transform 0.3s ease-in;
  transition-delay: ${({ $delay }) => $delay}ms;
  width: fit-content;
`;

const StyledGithubLink = styled(StyledButton)`
  margin-top: 50px;
`;

const StyledLinkedInLink = styled(StyledButton)`
  margin-top: 10px;
`;

const Hero = ({ onButtonsShow }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [displayIntro, setDisplayIntro] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [displayTitle, setDisplayTitle] = useState('');
  const [displayMessage, setDisplayMessage] = useState('');
  const [showTitle, setShowTitle] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [cursorLine, setCursorLine] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const fullIntro = 'Hi, my name is ';
  const fullName = 'William Ma';
  const fullTitle = 'ML Engineering Manager';
  const fullMessage = 'Thanks for taking a look at my profile!';
  const fullText = fullIntro + fullName + fullTitle + fullMessage;

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isMounted || prefersReducedMotion) {
      setDisplayIntro(fullIntro);
      setDisplayName(fullName);
      setDisplayTitle(fullTitle);
      setDisplayMessage(fullMessage);
      setShowTitle(true);
      setShowMessage(true);
      return;
    }

    let currentIndex = 0;
    let typingTimer = null;

    const scheduleNextChar = () => {
      if (currentIndex < fullText.length) {
        if (currentIndex < fullIntro.length + fullName.length) {
          setDisplayIntro(fullIntro.slice(0, Math.min(currentIndex + 1, fullIntro.length)));
          setDisplayName(fullName.slice(0, Math.max(0, currentIndex + 1 - fullIntro.length)));
          setCursorLine(0);
          setShowTitle(false);
          setShowMessage(false);
        } else if (currentIndex < fullIntro.length + fullName.length + fullTitle.length) {
          setDisplayIntro(fullIntro);
          setDisplayName(fullName);
          setDisplayTitle(
            fullTitle.slice(0, currentIndex + 1 - fullIntro.length - fullName.length),
          );
          setCursorLine(1);
          setShowTitle(true);
          setShowMessage(false);
        } else {
          setDisplayIntro(fullIntro);
          setDisplayName(fullName);
          setDisplayTitle(fullTitle);
          setDisplayMessage(
            fullMessage.slice(
              0,
              currentIndex + 1 - fullIntro.length - fullName.length - fullTitle.length,
            ),
          );
          setCursorLine(2);
          setShowTitle(true);
          setShowMessage(true);
        }
        currentIndex++;

        const isMessageLine = currentIndex > fullIntro.length + fullName.length + fullTitle.length;
        const delay = isMessageLine ? 20 : 80;
        typingTimer = setTimeout(scheduleNextChar, delay);
      } else {
        setIsTypingComplete(true);
        setCursorLine(-1);
        setShowButtons(true);
        if (onButtonsShow) {
          onButtonsShow();
        }
      }
    };

    scheduleNextChar();

    return () => {
      if (typingTimer) {clearTimeout(typingTimer);}
    };
  }, [isMounted, prefersReducedMotion]);

  const one = (
    <div>
      <StyledIntro>
        {displayIntro}
        <StyledCursor
          $show={cursorLine === 0 && !isTypingComplete && displayIntro.length < fullIntro.length}>
          |
        </StyledCursor>
      </StyledIntro>
      <StyledName>
        {displayName}
        <StyledCursor
          $show={
            cursorLine === 0 &&
            !isTypingComplete &&
            displayIntro.length === fullIntro.length &&
            displayName.length > 0
          }>
          |
        </StyledCursor>
      </StyledName>
    </div>
  );
  const two = (
    <h3 className="big-heading">
      {displayTitle}
      <StyledCursor $show={cursorLine === 1 && !isTypingComplete}>|</StyledCursor>
    </h3>
  );
  const three = (
    <>
      <p>
        {displayMessage}
        <StyledCursor $show={cursorLine === 2 && !isTypingComplete}>|</StyledCursor>
      </p>
    </>
  );
  const four = (
    <StyledGithubLink
      href="https://github.com/wmaucla"
      target="_blank"
      rel="noreferrer"
      $show={showButtons}
      $delay={0}>
      Check out my Github!
    </StyledGithubLink>
  );
  const five = (
    <StyledLinkedInLink
      href="https://www.linkedin.com/in/williammaucla/"
      target="_blank"
      rel="noreferrer"
      $show={showButtons}
      $delay={100}>
      Connect on my LinkedIn!
    </StyledLinkedInLink>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection showTitle={showTitle} showMessage={showMessage}>
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

Hero.propTypes = {
  onButtonsShow: PropTypes.func,
};

export default Hero;
