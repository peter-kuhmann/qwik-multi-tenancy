# ⚡️ Multi-tenancy demonstration using Qwik

The goal of this project is to demonstrate how easy it can be
to create a multi-tenant web application using Qwik.js, Prisma,
PlanetScale and Fly.io. 🏎️

# 📚 Table of contents

<!-- TOC -->
* [⚡️ Multi-tenancy demonstration using Qwik](#-multi-tenancy-demonstration-using-qwik)
* [📚 Table of contents](#-table-of-contents)
* [📡 Involved technologies](#-involved-technologies)
* [🏷️ Git tags](#-git-tags)
  * [1️⃣ `bootstrapped`](#1-bootstrapped)
* [🌩️ Hosting](#-hosting)
* [🛠️ Development](#-development)
  * [⚙️ Start locally](#-start-locally)
  * [🏗️ Build + serve via Fastify](#-build--serve-via-fastify)
  * [💾 Update PlanetScale schema](#-update-planetscale-schema)
  * [⬆️ Deploying app](#-deploying-app)
* [✅ Fly.io configuration](#-flyio-configuration)
<!-- TOC -->

# 📡 Involved technologies
- [Qwik 🔗](https://qwik.builder.io/)
- [Prisma 🔗](https://www.prisma.io/)
- [PlanetScale 🔗](https://planetscale.com/)
- [Fly.io 🔗](https://fly.io)

# 🏷️ Git tags
## 1️⃣ `bootstrapped`

Bootstrapped project that includes:
- Bootstrapped Qwik app
- Prisma installed
- Fastify adapter configured
- Tailwind + DaisyUI installed
- `fly.toml` created
- `Dockerfile` created
- Initial `README.md`

# 🌩️ Hosting
The app is meant to be hosted on [Fly.io 🔗](https://fly.io).

Therefor, I created the [Dockerfile 🔗](/Dockerfile), so that Fly can build
a working docker image to be used for the Fly app.

I use the [Fastify adapter 🔗](https://qwik.builder.io/docs/deployments/node/#installation)
to host the Qwik app as a server instance.

# 🛠️ Development

## ⚙️ Start locally

```bash
yarn start
```

## 🏗️ Build + serve via Fastify

```bash
yarn build
yarn serve
```

## 💾 Update PlanetScale schema
```bash
yarn prisma db push
```

## ⬆️ Deploying app
```bash
fly deploy
```

# ✅ Fly.io configuration
1️⃣ First you need to create a new Fly app via:
```bash
fly launch
```

Deploy the application afterward.

2️⃣ Configure your DNS records to point to fly:
After deploying your app, you get a `fly.dev` URL.
Create two `CNAME` records:
- `yourdomain.com > your-fly-url.fly.dev`
- `*.yourdomain.com > your-fly-url.fly.dev`

3️⃣ Allocate an IP v4 address:
This is necessary, to issue an SSL certificate for the wildcard subdomains.
```bash
fly ips allocate-v4
```

4️⃣ Issue certificates:
```bash
fly certs add "yourdomain.com"
fly certs add "*.yourdomain.com"
```