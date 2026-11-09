# Stakeholder Status Update: Evergreen Quote

**To:** Priya Ramanathan (Project Sponsor)
**From:** Marc (Delivery Lead)
**Date:** Monday (Day 2) EOD

## What shipped today

- Quote routes assembled and tested end to end. The tests caught a real defect in the AI-drafted create-quote code (a tidy "success" quoting $0.35 a month for $50,000 of coverage). The engineering fix is in and all tests pass.
- Service name and your rate decision configured; auto, age 35, $50,000 now quotes $450.
- GraphQL mounted with its explorer; it returns the same data as the REST routes.
- Risk register and decision memo on file (`risk-register.md`, `decision-memo.md`).

## What slipped (and why)

- Nothing from the plan. Two calls from your note need your confirmation.
- **Renters: no for now, with a clear path to yes.** Today there is no renters rate, and rates are your decision, so we cannot quote it. Adding it is also more than one dropdown option: the allowed coverage types, the rate table, the seed data, the tests, and the site dropdown all change together. The path to yes is: (1) you give me a renters rate by 11:00 Tuesday; (2) the engineering team's patterns for auto, home, and life guide the change, with AI assistance drafting it and a human reviewing it; (3) the tests pass before it counts as done. If that happens, renters could be quotable by Thursday's demo, and the stretch items come out to make room; container and CI work stays protected.
- **Base-image vulnerability:** acknowledged, not fixed. It is moderate severity, the API is not internet-exposed this week, and the patched version arrives next week, so I recommend shipping on the current image. I would hold if exposure changes or severity rises (risk register R3).

## What's next (tomorrow)

- Containerize the API and prove it answers the same as today; enable CI and make the go/no-go call from the run.
- Review the site deploy files.
- **11:00 decision point on renters.** If a rate has arrived, I use the Copilot-assisted step on the renters change, reviewed and gated by green tests. If not, renters is parked as the first item of the next delivery window, with an estimate.

## What I need from you

- **By 11:00 Tuesday:** a renters rate, or confirmation that renters moves to the first item of the next delivery window.
- **By 11:00 Tuesday:** sign-off to ship this week on the current base image, with the rebuild on the patched version scheduled next week.
