/** @type {import('@docusaurus/types').DocusaurusConfig} */
const path = require("path");
const math = require("remark-math");
const katex = require("rehype-katex");
const { docs, developers } = require("./sidebars");
const DefaultLocale = "en";

module.exports = {
  title: "Kadena Docs",
  tagline: "Explore the latest documentation, tutorials, code, and updates.",
  url: "https://docs.kadena.dev",
  baseUrl: "/",
  trailingSlash: false,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/color-favicon.png",
  organizationName: "kadena", // Usually your GitHub org/user name.
  projectName: "docs", // Usually your repo name.
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
  },
  themes: ["@docusaurus/theme-live-codeblock"],
  scripts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/web3/1.6.0/web3.min.js",
      async: true,
    },
  ],
  plugins: [
    require.resolve("docusaurus-plugin-fathom"),
    path.resolve(__dirname, "src/plugins/aliases.ts"),
  ],
  themeConfig: {
    prism: {
      theme: require("prism-react-renderer/themes/dracula"),
    },
    colorMode: {
      defaultMode: "dark",
    },
    navbar: {
      title: "Kadena Docs",
      logo: {
        alt: "Kadena Logo",
        src: "img/color-logo.png",
      },
      items: [
        // {
        //     "to": "/",
        //     "label": "Basics",
        //     "position": "left"
        // },
        {
          to: "build/introduction",
          label: "Build",
          position: "left",
        },
        {
          to: "contribute/introduction",
          label: "Contribute",
          position: "left",
        },
        {
          to: "/blog",
          label: "Learn",
          position: "left",
        },
        {
          href: "https://medium.com/kadena-io",
          position: "right",
          label: "Blog",
        },
        {
          href: "https://github.com/kadena-io/docs/issues/new",
          position: "right",
          label: "Feedback",
        },
        // {
        //     type: 'localeDropdown',
        //     position: 'right',
        //     dropdownItemsAfter: [
        //       {
        //           to: 'https://kadena.crowdin.com/',
        //           label: 'Help us translate',
        //       },
        //     ]
        // },
        {
          href: "https://github.com/kadena-io",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository",
        },
      ],
    },
    // gtag: {
    //     // You can also use your "G-" Measurement ID here.
    //     trackingID: 'ID',
    //     // Optional fields.
    //     anonymizeIP: true, // Should IPs be anonymized?
    // },
    // algolia: {
    //     appId: '',
    //     apiKey: '',
    //     indexName: 'kadena',
    //     contextualSearch: true,
    //     debug: false
    // },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Home",
              to: "/",
            },
            {
              label: "Blog",
              href: "https://medium.com/kadena-io",
            },
            // {
            //     href: "https://kadena.crowdin.com/kadena-docs",
            //     label: "Help translate"
            // },
            {
              label: "GitHub",
              href: "https://github.com/kadena-io",
            },
          ],
        },
        {
          title: "Community",
          items: [
            // {
            //     href: "/contribute/introduction",
            //     label: "Contribute",
            // },
            // {
            //     label: "Forum",
            //     href: "https://forum.kadena.org/",
            // },
            {
              label: "Discord",
              href: "https://discord.com/invite/bsUcWmX",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/kadena_io",
            },
            {
              label: "YouTube",
              href: "https://www.youtube.com/c/KadenaBlockchain",
            },
          ],
        },
        {
          title: "Website",
          items: [
            {
              label: "About",
              href: "https://kadena.io/about/",
            },
            {
              label: "Contact",
              href: "https://kadena.io/contact/",
            },
            {
              label: "Build",
              href: "https://kadena.io/build/",
            },
            {
              label: "Community",
              href: "https://kadena.io/community/",
            },
          ],
        },
      ],
    },
    fathomAnalytics: {
      siteId: "YHVNQZAL",
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/kadena/kadena-docs/edit/main/",
          editUrl: ({ locale, versionDocsDirPath, docPath }) => {
            // Link to Crowdin for French docs
            if (locale !== DefaultLocale) {
              return `https://kadena.crowdin.com/kadena-docs/${locale}`;
            }
            // Link to Github for English docs
            return `https://github.com/kadenna/kadena-docs/edit/main/docs/${docPath}`;
          },
          routeBasePath: "/",
          remarkPlugins: [
            math,
            [require("@docusaurus/remark-plugin-npm2yarn"), { sync: true }],
          ],
          rehypePlugins: [katex],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        blog: {
          blogTitle: "Kadena Blog",
          blogSidebarTitle: "All posts",
          blogSidebarCount: "ALL",
          showReadingTime: true,
          readingTime: ({ content, frontMatter, defaultReadingTime }) =>
            // allows per post reading time override in frontmatter
            frontMatter.hide_reading_time
              ? undefined
              : defaultReadingTime({
                  content,
                  options: { wordsPerMinute: 300 },
                }),
        },
      },
    ],
  ],
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css",
      integrity:
        "sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc",
      crossorigin: "anonymous",
    },
  ],
};
