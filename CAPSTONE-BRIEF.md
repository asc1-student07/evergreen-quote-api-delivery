# Engineering brief: Evergreen Quote API, Phase 3 delivery

> You are reading the brief the engineering team worked from. You are not being
> asked to build this; the pieces are built. You are being asked to lead its
> delivery. Form opinions as you read: what is the user value? What is risky?
> What would you cut if Thursday came early?

## The product

Evergreen Insurance Quote has run as a web page all program: first static,
then live, then rebuilt in React. This phase the product grows a back end: the
**Evergreen Quote API**, the service that will hold quotes for every channel
(the website today; partner integrations tomorrow). It speaks REST for the
website, GraphQL for partners who want to pick their fields, and stores quotes
in MongoDB so they survive restarts.

## Who it's for

The website team (REST), a partner-integration pilot (GraphQL), and the
operations team, who need the service to be shippable: containerized, tested
in a pipeline, and runnable on the company's Kubernetes platform.

## What you'll assemble

1. The **quote routes**: list quotes, fetch one by id, create one with a
   computed premium.
2. The **GraphQL layer**: the same data through one flexible endpoint, with an
   in-browser explorer.
3. The **seed data**: six known quotes, loaded through the database shell.
4. The **container recipe**: a Dockerfile that packages the API into the
   `evergreen-quote-api` image.
5. The **pipeline**: a CI workflow that installs from the lock file and runs
   the test suite against a throwaway database on every push.
6. The **cluster manifests**: three replicas behind a stable Service, plus a
   database, demonstrated on a local Kubernetes cluster.

Two review-first artifacts ride along: the marketing `site/` and its `deploy/`
folder (script and policies for S3). Reviewing them is required; deploying
them for real happens only if the instructor decides the week has time for it.

## What is explicitly out of scope

No authentication, no real rate engine, no multi-region story, no CloudFront,
no requirement for a live AWS account. Quote ids are readable strings such as
`q1` so they stay easy to talk about in a review.

## What "good" looks like

The API answers every route with the documented shapes; invalid quotes are
rejected by the schema before they reach the database; the test suite is green
in CI; the container serves the same answers as the dev server; the cluster
demo shows three pods behind one Service; and the delivery decisions along the
way are written down where a VP could read them.

## Known risks to watch

- One of the provided pieces was drafted with an AI assistant on a busy
  afternoon. The demo can look right while a number is wrong; the tests are
  the team member that does the math.
- The container is a different environment from your VM, and the cluster is a
  third. Configuration travels by environment variable; assumptions do not.
- A dry run proves the manifests parse, not that the release is right.

These are exactly the kinds of tradeoffs you will lead this week.
