# Evergreen Site: Cloud Architecture (Reference)

How the Evergreen static site reaches users on AWS, and why each piece exists.

```
                                 ┌──────────────────────────┐
  Browser  ──── http ──────────▶ │  S3 bucket               │
  (user)                         │  static website hosting  │
                                 │  index.html, styles.css  │
                                 │  app.js, quotes.json     │
                                 └──────────────────────────┘
```

## The pieces

- **S3 (Simple Storage Service)**: object storage. The bucket holds the static
  files (`index.html`, `styles.css`, `app.js`, `quotes.json`). There is no server
  to patch and nothing to scale by hand.

- **Static website hosting**: a setting on the bucket. It turns the bucket into
  a web server for those files and gives you a public URL, the *bucket website
  endpoint*:
  `http://YOUR-BUCKET-NAME.s3-website-us-east-1.amazonaws.com`

- **Bucket policy** (`bucket-policy.json`): who may *read* the site. It grants
  one action, `s3:GetObject`, to everyone, on the objects in this one bucket.
  Public on purpose, and narrow: a marketing page is meant to be read by
  strangers.

- **Deploy policy** (`iam-policy.json`): who may *write* the site.
  Least-privilege permissions for the deploy role: upload to, delete from, and
  list *this one bucket*, and nothing else. No other buckets, no servers.

## What this architecture is missing

A **CDN**. In production, teams put **CloudFront** in front of the bucket, which
adds three things this lab does without:

- **HTTPS and a custom domain**: the bucket website endpoint is plain `http`
  on an AWS-owned hostname.
- **Caching at the edge**: CloudFront keeps copies at edge locations worldwide,
  so a user in Tokyo loads from nearby instead of from the single S3 region.
- **A cache to invalidate**: the cost of that speed. After every deploy you
  must tell CloudFront to refetch, or users keep seeing the old version.

## Why not just one EC2 server?

For a **static** site, S3 is cheaper, scales automatically, and has no server to
patch. An **EC2** virtual server (or a container, or Lambda) is for the *dynamic*
parts, like the Evergreen API, which needs to run code. A common real
architecture is: static front end on S3 and CloudFront, API on EC2 or
containers, data in a managed database.

## The service-model ladder (from the slides)

- **IaaS** (EC2): you manage the OS and runtime.
- **PaaS** (Elastic Beanstalk): the platform manages the infrastructure.
- **FaaS** (Lambda): run code with no servers to manage.
- **Managed storage/CDN** (S3, CloudFront): fully managed; you just configure.

The trade-off is always control vs. operational burden.
