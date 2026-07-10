#!/bin/bash

set -e

echo "Around the House website Git submit"
echo

if [ ! -d ".git" ]; then
  echo "Error: This directory is not a Git repository."
  echo "Run this script from:"
  echo "/Users/home/Documents/personal/websites/aroundthehouseapp"
  exit 1
fi

echo "Current changes:"
git status --short
echo

if [ -z "$(git status --porcelain)" ]; then
  echo "Nothing to commit. Your working tree is clean."
  exit 0
fi

read -r -p "Enter commit message: " commit_message

if [ -z "$commit_message" ]; then
  echo "Commit message cannot be empty."
  exit 1
fi

git add .
git commit -m "$commit_message"
git push

echo
echo "Successfully committed and pushed to GitHub."
