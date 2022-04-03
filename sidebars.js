const sidebars = {
  // ######################################
  // Basics
  // ######################################

  basics: [
    { type: "doc", label: "Get Started", id: "basics/get-started" },
    { type: "doc", label: "Overview", id: "basics/overview" },
    // {
    //   type: "category",
    //   label: "Basics",
    //   items: [
    //     { type: "doc", label: "Overview", id: "basics/overview" },
    //     { type: "doc", label: "Key Concepts", id: "basics/key-concepts" },
    //     { type: "doc", label: "Community", id: "basics/community" },
    //     { type: "doc", label: "Glossary", id: "basics/glossary" },
    //     { type: "doc", label: "FAQ", id: "basics/faq" },
    //   ],
    // },
    {
      type: "category",
      label: "Whitepapers",
      items: [
        { type: "doc", label: "Overview", id: "basics/whitepapers/overview" },
        {
          type: "doc",
          label: "Chainweb",
          id: "basics/whitepapers/chainweb-layer-1",
        },
        {
          type: "doc",
          label: "Pact",
          id: "basics/whitepapers/pact-smart-contract-language",
        },
        { type: "doc", label: "Kuro", id: "basics/whitepapers/kuro-layer-2" },
      ],
    },
    { type: "doc", label: "Exchanges", id: "basics/exchanges" },
    {
      type: "category",
      label: "Wallets",
      items: [
        { type: "doc", label: "Overview", id: "basics/wallets" },
        {
          type: "category",
          label: "Chainweaver",
          items: [
            {
              type: "doc",
              label: "User Guide",
              id: "basics/chainweaver/chainweaver-user-guide",
            },
            {
              type: "doc",
              label: "Troubleshooting",
              id: "basics/chainweaver/chainweaver-troubleshooting",
            },
            {
              type: "doc",
              label: "Terms of Service",
              id: "basics/chainweaver/terms-of-service",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "KDA",
      items: [
        { type: "doc", label: "What is KDA", id: "basics/kda/what-is-kda" },
        { type: "doc", label: "Manage KDA", id: "basics/kda/kda" },
        { type: "doc", label: "Key Concepts", id: "basics/kda/kda-concepts" },
      ],
    },
    { type: "doc", label: "FAQ", id: "basics/faq" },
    { type: "doc", label: "Contribute to Docs", id: "contribute/docs" },
    // {
    //   type: "category",
    //   label: "Resources",
    //   items: [
    //     {
    //       type: "doc",
    //       label: "Public Chain Resources",
    //       id: "basics/resources/public-chain-resources",
    //     },
    //     {
    //       type: "doc",
    //       label: "Private Chain Resources",
    //       id: "basics/resources/private-chain-resources",
    //     },
    //   ],
    // },
  ],

  // ######################################
  // Build
  // ######################################

  build: [
    { type: "doc", label: "Introduction", id: "build/introduction" },
    { type: "doc", label: "Quickstart", id: "basics/quickstart" },
    // {
    //   type: "category",
    //   label: "Basics",
    //   items: [
    //     { type: "doc", label: "Installation", id: "build/basics/installation" },
    //     {
    //       type: "doc",
    //       label: "Set up an editor",
    //       id: "build/basics/set-up-an-editor",
    //     },
    //     {
    //       type: "doc",
    //       label: "Create a dApp",
    //       id: "build/basics/create-a-dapp",
    //     },
    //     { type: "doc", label: "Learn more", id: "build/basics/learn-more" },
    //   ],
    // },
    { type: "doc", label: "Tools", id: "build/resources/useful-tools" },
    {
      type: "category",
      label: "Front-end",
      items: [
        {
          type: "doc",
          label: "Cookbook",
          id: "build/frontend/pact-lang-api-cookbook",
        }
      ],
    },
    {
      type: "category",
      label: "Guides",
      items: [
        {
          type: "doc",
          label: "Pact Local API Queries",
          id: "build/pact-local-api-queries",
        },
        {
          type: "doc",
          label: "Safe Rotate and Drain",
          id: "build/safe-rotate-and-drain",
        },
        { type: "doc", label: "Safe Transfer", id: "build/safe-transfer" },
      ],
    },
    {
      type: "category",
      label: "Support",
      items: [
        {
          type: "doc",
          label: "Developer Program",
          id: "build/resources/developer-program",
        },
        {
          type: "doc",
          label: "Technical Grants",
          id: "build/resources/technical-grants",
        },
      ],
    },
    {
      type: "category",
      label: "Resources",
      items: [
        {
          type: "doc",
          label: "Pact Resources",
          id: "build/resources/pact-resources",
        },
        // {
        //   type: "doc",
        //   label: "Kadena Resources",
        //   id: "build/resources/kadena-resources",
        // },
        {
          type: "doc",
          label: "Kuro Resources",
          id: "build/kuro-layer-2",
        },
      ],
    },
    {
      type: "link",
      label: "Pact Reference",
      href: "https://pact-language.readthedocs.io/en/stable/",
    },
  ],

  // ######################################
  // Learn
  // ######################################

  learn: [{ type: "doc", label: "Introduction", id: "learn/introduction" }],

  // ######################################
  // Contribute
  // ######################################

  contribute: [
    { type: "doc", label: "Introduction", id: "contribute/introduction" },
    {
      type: "category",
      label: "Run a Node",
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "contribute/node/overview",
        },
        {
          type: "doc",
          label: "Start Mining",
          id: "contribute/node/start-mining",
        },
        {
          type: "doc",
          label: "Interact with Nodes",
          id: "contribute/node/interact-with-nodes",
        },
        {
          type: "doc",
          label: "Troubleshooting Chainweb",
          id: "contribute/node/troubleshooting-chainweb",
        },
      ],
    },
    {
      type: "category",
      label: "Ambassadors",
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "contribute/ambassadors/overview",
        },
        {
          type: "doc",
          label: "Content Creator",
          id: "contribute/ambassadors/content-creator",
        },
        {
          type: "doc",
          label: "Technical Writer",
          id: "contribute/ambassadors/moderator",
        },
        {
          type: "doc",
          label: "Channel Leader",
          id: "contribute/ambassadors/community-channel-leader",
        },
      ],
    },
    { type: "doc", label: "Kadena DAO", id: "contribute/kadena-dao" },
  ],
};

module.exports = sidebars;
