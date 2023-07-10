# ⚡️ Multi-tenancy demonstration using Qwik

The goal of this project is to demonstrate how easy it can be
to create a multi-tenant web application using Qwik.js, Prisma,
PlanetScale and Fly.io. 🏎️

# 📚 Table of contents

<!-- TOC -->
* [⚡️ Multi-tenancy demonstration using Qwik](#-multi-tenancy-demonstration-using-qwik)
* [📚 Table of contents](#-table-of-contents)
* [🍭 Blog articles and YouTube videos](#-blog-articles-and-youtube-videos)
  * [2️⃣ Users and sessions (Part 2)](#2-users-and-sessions-part-2)
  * [1️⃣ Tenant resolver (Part 1)](#1-tenant-resolver-part-1)
* [📡 Involved technologies](#-involved-technologies)
* [🏷️ Git tags](#-git-tags)
  * [3️⃣ `users-and-sessions`](#3-users-and-sessions)
  * [2️⃣ `tenant-resolver`](#2-tenant-resolver)
  * [1️⃣ `bootstrapped`](#1-bootstrapped)
* [🌩️ Hosting](#-hosting)
* [✅ Requirements](#-requirements)
* [🛠️ Development](#-development)
  * [🥪 Preparation](#-preparation)
  * [⚙️ Start locally](#-start-locally)
  * [🏗️ Build + serve via Fastify](#-build--serve-via-fastify)
* [🛫 Fly.io deployment](#-flyio-deployment)
  * [🥪 Preparation](#-preparation-1)
  * [⬆️ Deploy app](#-deploy-app)
<!-- TOC -->

# 🍭 Blog articles and YouTube videos
## 2️⃣ Users and sessions (Part 2)
- 📝 Blog article: [https://peter-kuhmann.de/blog/0003](https://peter-kuhmann.de/blog/0003)
- 📽️ YouTube video: [https://youtu.be/dV0Svun5_ws](https://youtu.be/dV0Svun5_ws)

## 1️⃣ Tenant resolver (Part 1)
  - 📝 Blog article: [https://peter-kuhmann.de/blog/0002](https://peter-kuhmann.de/blog/0002)
  - 📽️ YouTube video: [https://youtu.be/Q7nNbJomC0I](https://youtu.be/Q7nNbJomC0I)

# 📡 Involved technologies
- [Qwik 🔗](https://qwik.builder.io/)
- [Prisma 🔗](https://www.prisma.io/)
- [PlanetScale 🔗](https://planetscale.com/)
- [Fly.io 🔗](https://fly.io)

# 🏷️ Git tags

## 3️⃣ `users-and-sessions`
🌰 In a nutshell: User sign-up, login, logout and cookie based sessions.

Details:
- Prisma models `User` and `Session`
- CRUD functions for `User` and `Session`
- Cookie based sessions
- Sign-up screen and flow
- Login screen and flow
- Logged in tenant home screen
- Logout
- Route loaders/hooks `useSession` and `useRequiredSession`
- Sending emails
- New `.env.example`
- `fly.toml` replaced by `fly.toml.example`
- Minor changes:
  - Tenant cache now also caches "not found" state.
  - `Tenant.id` renamed to `Tenant.tenantId`

## 2️⃣ `tenant-resolver`
🌰 In a nutshell: Providing tenant context based on subdomain.

Details:
- Prisma client
- DB seed script
- Environment variables validation
- `BASE_HOSTNAME` env var
- `useUrlInfo()` route loader
- `useTenant()` route loader
- Three screens: Base screen + subdomain screens: Tenant not found and tenant found
- `Dockerfile` that generates prisma client
- `fly.toml` with env var section

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

# ✅ Requirements
- `fly` CLI installed
- `pnpm` installed
- Node 18+ installed
- Docker installed

# 🛠️ Development

## 🥪 Preparation
1️⃣ Copy `.env.example` as `.env` and add all the variable values.

2️⃣ First spin up the local test database (or use PlanetScale):
```bash
./.infra/start.sh
```

3️⃣ Push the database schema:
```bash
pnpm prisma db push
```

## ⚙️ Start locally
Start the dev server:
```bash
pnpm start
```

## 🏗️ Build + serve via Fastify

```bash
pnpm serve:build
```

# 🛫 Fly.io deployment

## 🥪 Preparation
1️⃣ Copy `fly.toml.example` as `fly.toml` and add all the variable values.

__Use your PlanetScale connection string for `DATABASE_URL`!__

2️⃣ First you need to create a new Fly app via:
```bash
fly launch
```

3️⃣ Now, set the following two secrets via `fly`:
```bash
fly secrets set AUTH_FLOW_JWT_PRIVATE_KEY="...add_value..." AUTH_FLOW_JWT_PUBLIC_KEY="...add_value..."
```

4️⃣ Update PlanetScale schema:
```bash
pnpm prisma db push
```

## ⬆️ Deploy app
1️⃣ Deploy the application:
```bash
fly deploy
```

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