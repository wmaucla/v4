/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

export const onRouteUpdate = ({ location }) => {
  if (typeof window.gtag !== 'function') {return;}
  window.gtag('event', 'page_view', {
    page_path: location.pathname + location.search + location.hash,
  });
};
