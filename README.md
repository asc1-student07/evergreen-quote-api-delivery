# Evergreen Quote API: Phase 3 Capstone Starter

This is the engineering team's baseline for the Evergreen Quote API service.
It runs as-is, but it is deliberately not finished: the quote routes, the
GraphQL layer, the container recipe, the pipeline, and the cluster manifests
arrive as provided pieces during the week. You assemble onto this; you never
write code from scratch.

## Run it

```bash
npm install
npm run dev
```

Then, in a second terminal:

```bash
curl http://localhost:3000/
```

You get the health response. Note the service name: that placeholder is a
Day 1 finding and a Day 2 configuration step.

## What is here on Day 1

| Path | What it is |
| --- | --- |
| `src/index.js` | The service shell: health route, error handling, startup. The `INSERT` markers are where Day 2's pieces land. |
| `src/db.js` | The MongoDB connection. Reads `MONGODB_URI` from `.env`. |
| `src/Quote.js` | The Mongoose model: the database contract every write must pass. |
| `src/premium.js` | The shared premium math. The `BASE_RATES` values are Day 2 configuration. |
| `src/seed.js` | `npm run seed` resets the database to the six known quotes. |
| `test/api.test.mjs` | The safety net. Works from Day 2, once the routes piece is in place. |
| `.env` | The service's configuration: name and database address. |

## What is deliberately NOT here yet

`src/routes.js`, `src/graphql.js`, a `Dockerfile`, a CI workflow, `k8s/`
manifests, and the marketing `site/` and `deploy/` folders. Each is a provided
piece in your lab kit, with exact placement instructions in the kit README.
