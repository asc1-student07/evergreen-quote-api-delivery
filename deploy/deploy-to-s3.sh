#!/usr/bin/env bash
# deploy-to-s3.sh - deploy the Evergreen static site to an S3 bucket (provided)
# ---------------------------------------------------------------------------
# Two moves: upload the site to the bucket, then list what landed there so the
# deploy verifies itself.
#
# Before you run this: create the bucket, enable static website hosting, apply
# deploy/bucket-policy.json, and connect the AWS CLI (aws configure).

set -euo pipefail

# --- Configuration ---------------------------------------------------------
BUCKET="evergreen-quote-site-CHANGE-ME"   # the bucket you created
REGION="us-east-1"                        # the region you created it in
SITE_DIR="$(dirname "$0")/../site"        # the folder to upload

if [[ "$BUCKET" == *CHANGE-ME* ]]; then
  echo "Set BUCKET at the top of this script to the bucket you created." >&2
  exit 1
fi

echo "Deploying $SITE_DIR to s3://$BUCKET ..."

# TODO 1: upload the site folder to the bucket.
#   Use: aws s3 sync "$SITE_DIR" "s3://$BUCKET" --delete
#   ("--delete" removes files in the bucket that no longer exist locally.)


# TODO 2: list what is now in the bucket, so the deploy checks its own work.
#   Use: aws s3 ls "s3://$BUCKET" --recursive --human-readable


echo
echo "Done. Your site: http://$BUCKET.s3-website-$REGION.amazonaws.com"
