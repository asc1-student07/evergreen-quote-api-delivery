# Delivery Review: Evergreen Quote

## Slide 1: Delivery goal & did we hit it?

- **Goal:** "[paste the one sentence from your delivery-goal.md]"
- **Hit?** ☒ Yes  ☐ Partially  ☐ No
- **Why:** [Full scope shipped, with one deliberate deferral: renters coverage, offered to the partner as the first item of the next delivery window.]

## Slide 2: What shipped

- Curl transcript (inline, from `main`):
  - `GET /` answers `{"message":"Evergreen Quote API","status":"ok"}`
  - `GET /api/quotes/q1` returns the known seeded quote
  - `POST /api/quote` (auto, age 35, $50,000) returns 201 with `"monthlyPremium":450` at the sponsor's rates
- Merged PR: #[__] · CI run on the merge commit: green [link]
  (installs from the lock file, runs the tests against a throwaway database)
- Thursday's cluster demo: three API pods behind one Service. `curl localhost:8080/api/quotes` answered `[]`, then the first POST through the Service worked.
- Same image in three environments (dev server, container, cluster). Only the configuration changed.
![System diagram](./images/pods.png)

## Slide 3: Two key decisions

- **Deferred renters coverage.** It looks like "one more dropdown option," but the database schema is the contract: the enum, rates, seed data, tests, GraphQL schema and site dropdown all have to change together. I rejected pricing it outside the schema and gave the partner a date instead. Memo: `decision-memo.md`.
- **Shipped on the current base image, with the patch scheduled.** The CVE is moderate, the API is not internet-exposed this week, and the patched tag lands next week. An unscheduled base swap mid-delivery was the riskier move. Hold trigger: "if exposure changes before Friday, hold." It never fired.

## Slide 4: Risks & injects

- **Top risk tracked:** the API returns a tidy 201 while a number inside is wrong. It fired Tuesday: a $0.35 monthly premium on $50,000 of coverage. `npm test` caught it, and the kit's one-line fix closed it.
- **Inject #1 (Tue):** the renters request plus the base-image CVE. I re-prioritized, wrote the memo and register row, and the sponsor confirmed both calls Wednesday.
- **Inject #2 (Wed):** customers were being rejected by an age validation while `main` went red after a "validation hotfix." I read the CI log, named the failure in plain English, and routed it to the owning team with two questions: which environment serves customers, and who owns the revert. I did not touch the code. I made the go call from my own branch's green CI, with a written hold condition on `main` (R6).

## Slide 5: What I'd do differently next round

- [Run `npm test` before the celebratory curl tour, not after it.]
- [Put the "seeded quotes are historical" line in the demo script on Monday.]

## Q&A prep: likely questions

- *"The demo returned quotes all week; why does one red test matter?"* Because nothing on the screen looked wrong. The only broken thing was the number inside a successful-looking 201.
- *"Why didn't you ship renters? It's one dropdown option."* The dropdown is the last of six pieces that must agree. The partner got a date and a real estimate instead of quotes our own database can't validate.
- *"Same image in three places; what changed?"* Configuration, never code: `.env`, `--env-file`, and the Deployment's `env` block.