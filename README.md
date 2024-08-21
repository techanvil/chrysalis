### Notes

#### Zenhub Dependency Graph

This currently requires the use of `npm link` in order to build with the integrated [Zenhub Dependency Graph](https://github.com/techanvil/zenhub-dependency-graph/).

The `zenhub-dependency-graph` repository is a Git submodule of this repo.

```sh
# Clone the repo with --recurse-submodules
git clone --recurse-submodules https://github.com/techanvil/chrysalis.git
# Or, if you have already cloned it:
git submodule update --init

npm link ./zenhub-dependency-graph
cd ./zenhub-dependency-graph
npm link ./chrysalis/node_modules/react

# Pulling changes for a clone of this repo:
git pull --recurse-submodules

# Pulling zenhub-dependency-graph changes into this repo:
git submodule update --remote
git add zenhub-dependency-graph && git commit
```

#### Docker

```sh
docker build -t chrysalis-docker .
docker run -p 3000:3000 chrysalis-docker
```

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
