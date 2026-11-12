# Delivery Goal: Evergreen Quote

## Goal

> By Thursday end of day, the Evergreen Quote API (REST and GraphQL, backed by MongoDB) is merged to `main` through a reviewed pull request with a green CI run, and demonstrated running in a container and on a local Kubernetes cluster.

## "Done" looks like

- The API answers every documented route: list, fetch by id, create with a computed premium.
- The same data answers through GraphQL, with the explorer at `/explorer`.
- `npm test` passes; the safety net holds.
- The containerized API serves the same answers as the dev server, and the CI run on the merge commit is **green**.
- The cluster demo shows three API pods behind one Service.
- A reviewed PR is merged, branch deleted.
- `delivery-leadership-package/` is complete and committed.

## Out of scope (this week)

- Authentication or user accounts.
- A real rate engine (the premium math stays simple and uses the sponsor's rates).
- Multi-region deployment or CloudFront.
- A required live AWS account; the marketing site and S3 deploy folder are reviewed only, unless the instructor decides there is time to deploy them.
- New features beyond the provided pieces: we assemble, verify, and ship what exists.