const sidebars = {
  // ######################################
  // Basics
  // ######################################

  basics: [
    { type: "doc", label: "Introduction", id: "basics/get-started" },
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
      label: "KDA",
      items: [
        { type: "doc", label: "What is KDA", id: "basics/kda/what-is-kda" },
        { type: "doc", label: "Manage KDA", id: "basics/kda/manage-kda" },
        { type: "doc", label: "Key Concepts", id: "basics/kda/kda-concepts" },
      ],
    },
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
    { type: "doc", label: "Exchanges", id: "basics/exchanges" },
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
    { type: "doc", label: "FAQ", id: "basics/faq" },
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

    { type: "doc", label: "Tools", id: "build/useful-tools" },
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
          label: "A Step-By-Step Guide to Writing Pact Smart Contract",
          id: "build/guides/a-step-by-step-guide-to-writing-pact-smart-contract",
        },
        {
          type: "doc",
          label: "Marmalade Tutorial",
          id: "build/guides/marmalade-tutorial",
        },
        {
          type: "doc",
          label: "Pact Local API Queries",
          id: "build/guides/pact-local-api-queries",
        },
        {
          type: "doc",
          label: "Voting dApp Tutorial",
          id: "build/guides/building-a-voting-dapp",
        },
        {
          type: "doc",
          label: "Safe Rotate and Drain",
          id: "build/guides/safe-rotate-and-drain",
        },
        {
          type: "doc",
          label: "Safe Transfer",
          id: "build/guides/safe-transfer"
        },
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

  learn: [
    { type: "doc", label: "Introduction", id: "learn-pact/intro" },
    { type: "doc", label: "Beginner", id: "learn-pact/beginner/welcome-to-pact" },
    { type: "doc", label: "Intermediate", id: "learn-pact/intermediate/deploy-to-a-local-server" }

  ],
  beginner: [
    { type: "doc", label: "Welcome to Pact", id: "learn-pact/beginner/welcome-to-pact" },
    { type: "doc", label: "Web Editor", id: "learn-pact/beginner/web-editor" },
    { type: "doc", label: "Hello World", id: "learn-pact/beginner/hello-world" },
    { type: "doc", label: "Language Basics", id: "learn-pact/beginner/language-basics" },
    { type: "doc", label: "Modules", id: "learn-pact/beginner/modules" },
    { type: "doc", label: "Keysets", id: "learn-pact/beginner/keysets" },
    { type: "doc", label: "Schemas and Tables", id: "learn-pact/beginner/schemas-and-tables" },
    { type: "doc", label: "Atom SDK", id: "learn-pact/beginner/atom-sdk" },
    { type: "doc", label: "Accounts and Transfers", id: "learn-pact/beginner/accounts-and-transfers" },
    { type: "doc", label: "Contract Interaction", id: "learn-pact/beginner/contract-interaction" },
    { type: "doc", label: "Project: Rotatable Wallet", id: "learn-pact/beginner/rotatable-wallet" },
    { type: "doc", label: "Project: Loans", id: "learn-pact/beginner/loans" },
    { type: "doc", label: "Test in the SDK", id: "learn-pact/beginner/test-in-the-sdk" }
  ],
  intermediate: [
    { type: "doc", label: "Deploy a Local Server", id: "learn-pact/intermediate/deploy-to-a-local-server" },
    { type: "doc", label: "Pact and Javascript", id: "learn-pact/intermediate/pact-and-javascript" },
    { type: "doc", label: "Safety Using Control Flow", id: "learn-pact/intermediate/safety-using-control-flow" },
    { type: "doc", label: "Interfaces with Pact", id: "learn-pact/intermediate/interfaces-with-pact" },
    { type: "doc", label: "Built-in Functions", id: "learn-pact/intermediate/built-in-functions" }
  ],

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
          label: "Moderator",
          id: "contribute/ambassadors/moderator",
        },
        {
          type: "doc",
          label: "Community Channel Leader",
          id: "contribute/ambassadors/community-channel-leader",
        },
      ],
    },
    { type: "doc", label: "Kadena DAO", id: "contribute/kadena-dao" },
    { type: "doc", label: "Contribute to Docs", id: "contribute/docs" },
  ],
};

module.exports = sidebars;
