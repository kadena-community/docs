import React from 'react';
import styles from './PageRef.module.css';

type PageRefProps = {
  url: string,
  pageName: string,
  maxUrlLength?: number,
}

const schemeRegex = /https?:\/\//;

/*
 * Strip URI scheme (http) and www.
 * e.g. `https://www.youtube.com/play` -> `//youtube.com/play`
 */
function stripUriScheme(url: string) {
  if (schemeRegex.test(url)) {
    const strippedScheme = url.slice(url.indexOf(':') + 1);
    if (strippedScheme.startsWith('//www.')) {
      return `//${strippedScheme.slice(6)}`;
    }
    return strippedScheme;
  }
  return url;
}

const upDirRegex = /^(\.\.\/)+/;

/*
 * Prettify URL for display
 * - strip scheme, www. subdomain
 * - strip ../../ prefix
 * - enforce max length
 */
function prettyUrl(url: string, maxUrlLength: number): string {
  let strippedUrl = stripUriScheme(url);
  // remove leading ../../
  while(upDirRegex.test(strippedUrl)) {
    strippedUrl = strippedUrl.replace(upDirRegex, '/');
  }
  // enforce max length
  if (strippedUrl.length > maxUrlLength) {
    return `${strippedUrl.slice(0, maxUrlLength)}...`;
  }
  return strippedUrl;
}

export default function PageRef({ url, pageName, maxUrlLength=48 } : PageRefProps) {
  return (
    <a
      className={styles.pageRef}
      href={url}
    >
      <div className={styles.left}>
        <div className={styles.arrow}>&#8594;</div>
        <div className={styles.pageName}>{pageName}</div>
      </div>
      <div className={styles.url}>{prettyUrl(url, maxUrlLength)}</div>
    </a>
  )
}
