import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig, email } from '@config';
import sr from '@utils/sr';
import { trackClick } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto 100px;
  text-align: center;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;

    &:before {
      bottom: 0;
      font-size: var(--fz-sm);
    }

    &:after {
      display: none;
    }
  }

  .title {
    font-size: clamp(40px, 5vw, 60px);
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 50px;
  }

  .cta-link {
    ${({ theme }) => theme.mixins.bigButton};
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">What’s Next?</h2>
      <h2 className="title">Get In Touch</h2>
      <p>
        Please reach out if you're interested in my work! Or if you just want to chat, you deserve
        the chance - after all, you've made it all the way!
      </p>
      <div className="button-group">
        <a
          className="cta-link"
          href={`mailto:${email}`}
          onClick={() => trackClick('contact_email', `mailto:${email}`)}>
          Say Hello!
        </a>
        <a
          className="cta-link"
          href="https://www.linkedin.com/in/williammaucla"
          target="_blank"
          rel="noreferrer"
          onClick={() =>
            trackClick('contact_linkedin', 'https://www.linkedin.com/in/williammaucla')
          }>
          LinkedIn
        </a>
      </div>
    </StyledContactSection>
  );
};

export default Contact;
