# Evergreen Quote: Vision Brief

## Product
**Name:** Evergreen Quote API (Phase 3 service delivery)
**Delivery week:** 3
**Delivery Lead:** Marc
**Engineering team (represented by):** 
**GitHub Project board:** 

## Who is the customer?
Three groups depend on this service. The Evergreen website team needs one dependable place to create and retrieve insurance quotes instead of keeping them inside a single web page. A partner-integration pilot needs to pull quote data into its own systems and choose only the fields it wants. The operations team, who will run it, needs a service that is shippable: packaged in a container, tested automatically on every change, and able to run on the company's Kubernetes platform. Today, none of them has anything to build on or run: quotes are calculated in the browser and then lost, and every new channel would mean rebuilding the same logic.

## What pain does Evergreen Quote remove?
"I got a quote, and now I can't find it." Phases 1 and 2 shipped a page that computes a number and forgets it. A quote service that remembers means a customer's quote can be retrieved by its id, the website and partners see the same answer because one shared calculation prices every new quote, and bad data is rejected before it is stored. For partners, it replaces custom one-off work with a single, flexible endpoint. For operations, it removes "it worked on the developer's machine": the same service runs the same way in a container and on the cluster, and a failing test stops a bad change before it ships.

## What does "good" look like at end of the week?
- Every REST route (list, fetch by id, create) answers with the documented shapes, and invalid quotes are rejected with a clear error before reaching the database.
- The partner GraphQL endpoint returns the same data as REST, and a stakeholder can run a query in the in-browser explorer.
- The test suite is green in CI on every push, and the sponsor's service name and rate decisions are applied and verified by the tests.
- The container answers the same requests with the same results as the dev server.
- The cluster demo shows three healthy pods behind one stable Service.
- Key decisions, risks, and the go/no-go are written down where a VP can read them.

## What are we explicitly NOT doing this week?
- Authentication or user accounts.
- A real rate engine (the premium calculation stays simple and uses the sponsor's rates).
- Multi-region deployment or CloudFront.
- Requiring a live AWS account. The marketing site and S3 deploy folder are reviewed only, and deployed for real only if the instructor decides there is time.
- New features beyond the provided pieces: we assemble, verify, and ship what exists.

## How will we know if it worked?
- Test pass rate: 100% in CI on the delivery branch before merge to `main`.
- API routes matching the spec: all of them, checked against the engineering brief.
- Cluster demo: 3 of 3 pods ready behind one Service, with the same responses as the dev server.