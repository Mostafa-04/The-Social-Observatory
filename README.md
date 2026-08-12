# The Social Observatory

**Independent Research Institute · Est. 2025**
*Think. Observe. Anticipate. Act.*

The Social Observatory turns emerging social signals into rigorous evidence — helping governments, institutions, and communities anticipate change before it arrives, and act on it with confidence.

This repository is the institute's public website and content platform: a public-facing site (research, publications, insights, events, partners, projects across Africa) backed by an admin dashboard for managing that content.

## Stack

- **Backend**: Laravel 12 (PHP 8.2), MySQL 8
- **Frontend**: React via [Inertia.js](https://inertiajs.com), Tailwind CSS, Vite
- **Queue worker**: background jobs (e.g. newsletter sending)
- **Deployment**: Docker (nginx + PHP-FPM app container, queue container, MySQL container)

## Content model

Managed from the admin dashboard (`/dashboard`, behind authentication):

| Entity | Purpose |
|---|---|
| Researches / Publications / Insights | The institute's editorial output |
| Projects / Events | Field activity, linked to a `Country` |
| Countries | Geographic reference data — drives the Africa presence map on the homepage |
| Partners | Organizations the institute works with |
| Contacts / Newsletter subscribers | Inbound messages and mailing list |
| Settings | Site-wide contact info and SMTP configuration |

## Running with Docker

This project ships with a Docker setup: an app container (nginx + PHP-FPM), a queue worker container, and a MySQL 8 container.

### Prerequisites

- Docker and Docker Compose
- A `.env` file (copy it from `.env.example` if you don't have one: `cp .env.example .env`)

### Start the stack

```bash
docker compose up -d --build
```

On first boot, the `app` container automatically runs `composer install`-built code, waits for MySQL, and runs `php artisan migrate --force`. The `queue` container waits until `app` reports healthy (i.e. migrations have run) before starting `php artisan queue:work`.

The app is served on **http://localhost:8080** by default (check `APP_PORT` in your `.env` if you've overridden it). If port 8080 is already taken on your machine, override it:

```bash
APP_PORT=8081 docker compose up -d --build
```

### Services

| Service | Description |
|---|---|
| `app`   | nginx + PHP-FPM serving the Laravel/Inertia app |
| `queue` | `php artisan queue:work` worker (same image as `app`) |
| `mysql` | MySQL 8.0, data persisted in the `mysql_data` volume |

Uploaded files (`storage/app`) persist in the `storage_data` volume across rebuilds.

### Useful commands

```bash
docker compose logs -f app          # tail app logs
docker compose exec app php artisan tinker   # artisan shell
docker compose exec app php artisan migrate  # run migrations manually
docker compose down                 # stop the stack (keeps volumes)
docker compose down -v              # stop the stack and wipe volumes/data
```

### Rebuilding after code changes

The image bundles the application code and built frontend assets at build time (there's no live bind-mount by default), so rebuild after pulling changes:

```bash
docker compose up -d --build
```

## Local development (without Docker)

Requires PHP 8.2+, Composer, Node.js, and a local MySQL instance.

```bash
composer run setup   # composer install, .env, app key, migrate, npm install, npm run build
composer run dev      # runs the PHP server, queue worker, log viewer, and Vite dev server together
```

Run the test suite with:

```bash
composer run test
```

## License

Copyright © 2026 The Social Observatory. All rights reserved.

This is proprietary software. See [LICENSE](LICENSE) for details.
