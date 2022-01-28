import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Learn the basics',
    Svg: require('../../static/img/home.svg').default,
    description: (
      <>Get the security of Bitcoin, virtually free gas, unparalleled throughput, and smarter contracts.</>
    ),
    link: (
      <a href="/basics/welcome">Get started with Kadena</a>
    ),
  },
  {
    title: 'Explore the protcol',
    Svg: require('../../static/img/blockchain.svg').default,
    description: (
      <>Launch decentralized applications in days instead of months using Kadena's fast & secure blockchain.</>
    ),
    link: (
      <a href="build/introduction">Build the Future on Kadena</a>
    ),
  },
  {
    title: 'Become a developer',
    Svg: require('../../static/img/window-dev.svg').default,
    description: (
      <>Design safer smart contracts with Pact whether you’re brand new or an experienced developer.</>
    ),
    link: (
      <a href="/discover/introduction">Build smarter with Pact</a>
    ),
  },
  {
    title: 'Get KDA',
    Svg: require('../../static/img/pig.svg').default,
    description: (
      <>Buy, sell, and manage your KDA using Chainweaver or any supporting wallet & exchange.</>
    ),
    link: (
      <a href="compose/introduction">Buy & Sell KDA</a>
    ),
  },
  {
    title: 'Contribute to the network',
    Svg: require('../../static/img/nodes.svg').default,
    description: (
      <>Spread the word about Kadena with our passionate community of builders, miners, and advocates.</>
    ),
    link: (
      <a href="/learn/introduction">Help grow Kadena</a>
    ),
  },
  {
    title: 'Join the community',
    Svg: require('../../static/img/b-comment.svg').default,
    description: (
      <>There's always something happening at Kadena. Stay connected and grow your network.</>
    ),
    link: (
      <a href="/contribute/introduction">Build your network</a>
    ),
  },
];

function Feature({Svg, title, description, link}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
        <p>{link}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
