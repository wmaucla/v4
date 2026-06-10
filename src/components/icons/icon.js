import React from 'react';
import PropTypes from 'prop-types';
import {
  IconAirflow,
  IconAppStore,
  IconAWS,
  IconBookmark,
  IconCodepen,
  IconDocker,
  IconEmail,
  IconGCP,
  IconKafka,
  IconExternal,
  IconFolder,
  IconFork,
  IconGitHub,
  IconInstagram,
  IconKubernetes,
  IconLinkedin,
  IconLoader,
  IconLogo,
  IconPlayStore,
  IconPython,
  IconPyTorch,
  IconRust,
  IconSpark,
  IconStar,
  IconTerraform,
  IconTwitter,
  IconZotero,
} from '@components/icons';

const Icon = ({ name }) => {
  switch (name) {
    case 'Airflow':
      return <IconAirflow />;
    case 'AppStore':
      return <IconAppStore />;
    case 'AWS':
      return <IconAWS />;
    case 'Docker':
      return <IconDocker />;
    case 'GCP':
      return <IconGCP />;
    case 'Kafka':
      return <IconKafka />;
    case 'Kubernetes':
      return <IconKubernetes />;
    case 'Python':
      return <IconPython />;
    case 'PyTorch':
      return <IconPyTorch />;
    case 'Rust':
      return <IconRust />;
    case 'Spark':
      return <IconSpark />;
    case 'Terraform':
      return <IconTerraform />;
    case 'Bookmark':
      return <IconBookmark />;
    case 'Codepen':
      return <IconCodepen />;
    case 'External':
      return <IconExternal />;
    case 'Folder':
      return <IconFolder />;
    case 'Fork':
      return <IconFork />;
    case 'GitHub':
      return <IconGitHub />;
    case 'Instagram':
      return <IconInstagram />;
    case 'Email':
      return <IconEmail />;
    case 'Zotero':
      return <IconZotero />;
    case 'Linkedin':
      return <IconLinkedin />;
    case 'Loader':
      return <IconLoader />;
    case 'Logo':
      return <IconLogo />;
    case 'PlayStore':
      return <IconPlayStore />;
    case 'Star':
      return <IconStar />;
    case 'Twitter':
      return <IconTwitter />;
    default:
      return <IconExternal />;
  }
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Icon;
