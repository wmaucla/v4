import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
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
    font-size: ${({ $snapped }) =>
    $snapped ? 'clamp(16px, 3.5vw, 46px)' : 'clamp(40px, 8vw, 80px)'};
    opacity: ${({ showTitle }) => (showTitle ? 1 : 0)};
    transition: opacity 0.3s ease-in, font-size 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
    font-family: var(--font-mono);

    @media (max-width: 768px) {
      font-size: clamp(28px, 8vw, 56px);
    }
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

const StyledCollapsible = styled.div`
  overflow: hidden;
  max-height: ${({ $snapped }) => ($snapped ? '0' : '120px')};
  opacity: ${({ $snapped }) => ($snapped ? 0 : 1)};
  transition: max-height 0.5s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 0.4s ease;

  @media (max-width: 768px) {
    max-height: 120px;
    opacity: 1;
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
  font-size: ${({ $snapped }) =>
    $snapped ? 'clamp(20px, 3.5vw, 56px)' : 'clamp(40px, 8vw, 80px)'};
  font-weight: 700;
  line-height: 1.1;
  color: var(--lightest-slate);
  min-height: 1.2em;
  font-family: var(--font-mono);
  white-space: normal;
  word-break: break-word;
  transition: font-size 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);

  @media (max-width: 768px) {
    font-size: clamp(36px, 10vw, 64px);
  }
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

const Hero = ({ onButtonsShow, snapped }) => {
  // textSnapped lags behind snapped when unsnapping — waits for the panel
  // to finish expanding (0.7s) before swapping "ML Engineer" → "ML Engineering Manager"
  const [textSnapped, setTextSnapped] = useState(snapped);

  useIsomorphicLayoutEffect(() => {
    if (snapped) {
      setTextSnapped(true);
    } else {
      const timer = setTimeout(() => setTextSnapped(false), 700);
      return () => clearTimeout(timer);
    }
  }, [snapped]);

  const [isMounted, setIsMounted] = useState(false);
  const [displayIntro, setDisplayIntro] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [displayTitle, setDisplayTitle] = useState('');
  const [displayMessage, setDisplayMessage] = useState('');
  const [showTitle, setShowTitle] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [cursorLine, setCursorLine] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const itemRefs = useRef([...Array(3)].map(() => React.createRef()));

  const fullIntro = 'Hi, my name is ';
  const fullName = 'William Ma';
  const fullTitle = snapped ? 'ML Engineer' : 'ML Engineering Manager';
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
    // Pre-mount: just wait, don't show anything yet
    if (!isMounted) {
      return;
    }

    // Reduced motion: skip animation, show everything immediately
    if (prefersReducedMotion) {
      setDisplayIntro(fullIntro);
      setDisplayName(fullName);
      setDisplayTitle(fullTitle);
      setDisplayMessage(fullMessage);
      setShowTitle(true);
      setShowMessage(true);
      if (onButtonsShow) {
        onButtonsShow();
      }
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
        const delay = isMessageLine ? 12 : 48;
        typingTimer = setTimeout(scheduleNextChar, delay);
      } else {
        setIsTypingComplete(true);
        setCursorLine(-1);
        if (onButtonsShow) {
          onButtonsShow();
        }
      }
    };

    scheduleNextChar();

    return () => {
      if (typingTimer) {
        clearTimeout(typingTimer);
      }
    };
  }, [isMounted, prefersReducedMotion]);

  // Derive the visible title — textSnapped delays the swap back to avoid
  // showing "ML Engineering Manager" while the panel is still narrow
  const isDesktopSnapped = textSnapped && typeof window !== 'undefined' && window.innerWidth > 768;

  const visibleTitle = isDesktopSnapped ? 'MLE' : displayTitle;
  const visibleName = isDesktopSnapped ? 'William' : displayName;

  const one = (
    <div>
      <StyledCollapsible $snapped={snapped}>
        <StyledIntro>
          {displayIntro}
          <StyledCursor
            $show={cursorLine === 0 && !isTypingComplete && displayIntro.length < fullIntro.length}>
            |
          </StyledCursor>
        </StyledIntro>
      </StyledCollapsible>
      <StyledName $snapped={snapped}>
        {visibleName}
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
      {visibleTitle}
      <StyledCursor $show={cursorLine === 1 && !isTypingComplete}>|</StyledCursor>
    </h3>
  );
  const three = (
    <StyledCollapsible $snapped={snapped}>
      <p>
        {displayMessage}
        <StyledCursor $show={cursorLine === 2 && !isTypingComplete}>|</StyledCursor>
      </p>
    </StyledCollapsible>
  );
  const items = [one, two, three];

  return (
    <StyledHeroSection showTitle={showTitle} showMessage={showMessage} $snapped={snapped}>
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
              <CSSTransition
                key={i}
                nodeRef={itemRefs.current[i]}
                classNames="fadeup"
                timeout={loaderDelay}>
                <div ref={itemRefs.current[i]} style={{ transitionDelay: `${i + 1}00ms` }}>
                  {item}
                </div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

Hero.propTypes = {
  onButtonsShow: PropTypes.func,
  snapped: PropTypes.bool,
};

export default Hero;
