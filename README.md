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
  * [2️⃣ `tenant-resolver`](#2-tenant-resolver)
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

## 2️⃣ `tenant-resolver`

This code state includes:
- Prisma client
- DB seed script
- Environment variables validation
- `BASE_HOSTNAME` env var
- `useUrlInfo()` route loader
- `useTenant()` route loader
- Three screens: Base screen + subdomain screens: Tenant not found and tenant found
- `Dockerfile` that generates prisma client
- `fly.toml` with env var section

# 🌩️ Hosting
The app is meant to be hosted on [Fly.io 🔗](https://fly.io).

Therefor, I created the [Dockerfile 🔗](/Dockerfile), so that Fly can build
a working docker image to be used for the Fly app.

I use the [Fastify adapter 🔗](https://qwik.builder.io/docs/deployments/node/#installation)
to host the Qwik app as a server instance.

# 🛠️ Development

## ⚙️ Start locally

```bash
pnpm start
```

## 🏗️ Build + serve via Fastify

```bash
pnpm build
pnpm serve
```

## 💾 Update PlanetScale schema
```bash
pnpm prisma db push
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

3️⃣ Allocate a **dedicated** IP v4 address:
This is necessary, to issue an SSL certificate for the wildcard subdomains.
```bash
fly ips allocate-v4
```

⚠️ A dedicated v4 IP address costs 2$/month (June/2023): [https://fly.io/docs/about/pricing/#anycast-ip-addresses 🔗](https://fly.io/docs/about/pricing/#anycast-ip-addresses)

4️⃣ Issue certificates:
```bash
fly certs add "yourdomain.com"
fly certs add "*.yourdomain.com"
```

⚠️ A wildcard certificate costs 1$/month (June/2023): [https://fly.io/docs/about/pricing/#managed-ssl-certificates 🔗](https://fly.io/docs/about/pricing/#managed-ssl-certificates)