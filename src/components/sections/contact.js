import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { srConfig, email } from '@config';
import sr from '@utils/sr';
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

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
  .button-click {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
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

  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const loadAudio = async () => {
    const importRes = await import('./wedding.mp3'); // make sure the path is correct
    const audioElement = new Audio(importRes.default);
    audioElement.addEventListener('ended', () => {
      setIsPlaying(false);
    });
    setAudio(audioElement);
  };

  const playAudio = async () => {
    if (!audio) {
      await loadAudio();
    }

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      /* eslint-disable no-console */
      console.log(`Failed to play, error: ${err}`);
      /* eslint-enable no-console */
    }
  };

  const resetAudio = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0; // Reset audio to the beginning
      setIsPlaying(false);
    }
  };

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">What’s Next?</h2>
      <h2 className="title">Get In Touch</h2>
      <p>
        Although I’m not currently looking for any new opportunities, my inbox is always open. Or if
        you just want to chat, you deserve the chance - after all, you've made it all the way!
      </p>
      <a className="email-link" href={`mailto:${email}`}>
        Say Hello
      </a>
      <br></br>
      <br></br>
      <br></br>
      Here's something fun I'm whipping up for my wedding!
      <br></br>
      <button className="button-click" onClick={playAudio}>
        {isPlaying ? 'Pause Audio' : 'Play Audio'}
      </button>
      <button className="button-click" onClick={resetAudio}>
        Reset Audio
      </button>
    </StyledContactSection>
  );
};

export default Contact;
