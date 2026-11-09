# Risk Register

| # | Risk | Owner | Likelihood (L/M/H) | Impact (L/M/H) | Mitigation | Trigger to escalate |
|---|---|---|---|---|---|---|
| R1 | AI-assisted code looks right but calculates wrongly. A bad price returned as a normal "success" can reach customers. | Marc | M | H | Automated tests on the business rules after every change; green pipeline required to merge; human review of AI-written logic touching money. | Any test red at end of day → hold release. |
| R2 | Test coverage is uneven. One interface partners will use has no automated checks, so a defect there goes unseen. | Marc + engineering | M | M | Add the missing tests next window; until then, manually compare both interfaces after any pricing change. | Interfaces disagree, or a partner wants to go live before tests exist → hold the demo, tell the sponsor. |
| R3 | No authentication on open write endpoints. Acceptable locally, a real exposure once anyone outside can reach the service. | Sponsor + security team | L | H | Keep it internal only; record "no authentication" as a deliberate scope decision in the status update. | Any request to expose it beyond the local environment → stop and review with security first. |
| R4 | Mid-sprint scope requests (e.g., a new product line) arrive from stakeholders and quietly displace committed work or break the data contract. | Marc + sponsor | H | M | Size each request before answering; trade it against the plan in writing; say no or "next window" when it doesn't fit, with a short decision memo. | A request would displace committed work, or needs changes across several components → sponsor decides, in writing. |
| R5 | Bad records created before a defect was fixed stay in the data store and can resurface later in demos, reports, or partner data. | Marc | M | M | Don't hand-edit records; clean up through a planned, logged reset; flag known bad records in status updates. | Anyone outside the team is about to see the data before cleanup → reset first. |

## How I'll use this register

I re-read it at each daily check-in and after any change in scope or priorities, updating likelihood and owner as facts change. When a risk fires, it moves to the top of that day's status update with its trigger named. It lives in the repo so stakeholders see what I was watching, not just what went wrong.