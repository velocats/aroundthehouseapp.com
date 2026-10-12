
#!/bin/bash

set -euo pipefail

# Around the House Website Publisher
# Commits local changes and publishes to GitHub Pages via main.

cd "$(dirname "$0")"

echo "========================================"
echo "  Around the House Website Publisher"
echo "========================================"
echo

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "ERROR: Not a Git repository."
    exit 1
fi

# Ensure GitHub is reachable and synchronize remote information.
echo "Checking GitHub..."
git fetch origin main

# Always work on the publishing branch.
if [ "$(git branch --show-current)" != "main" ]; then
    echo "Switching to publishing branch..."

    # Preserve uncommitted changes while switching branches.
    if [ -n "$(git status --porcelain)" ]; then
        git stash push -u -m "git-submit temporary changes"
        RESTORE_STASH=true
    else
        RESTORE_STASH=false
    fi

    git switch main

    if [ "$RESTORE_STASH" = true ]; then
        git stash pop
    fi
fi

# Update main before publishing.
echo "Synchronizing with GitHub..."
git pull --ff-only origin main

# Include completed website redesign commits from the old branch,
# if they have not already been merged.
if git show-ref --verify --quiet \
    refs/heads/codex/website-marketing-redesign; then

    if ! git merge-base --is-ancestor \
        codex/website-marketing-redesign HEAD; then

        echo "Including completed website redesign..."
        git merge --no-edit codex/website-marketing-redesign
    fi
fi

# Stage all website changes.
git add -A

if ! git diff --cached --quiet; then
    echo
    echo "Committing website changes..."

    git commit -m "Website update $(date '+%Y-%m-%d %H:%M:%S')"
else
    echo "No new local changes to commit."
fi

echo
echo "Publishing website to GitHub..."

git push origin main

echo
echo "========================================"
echo "  SUCCESS: Pushed to GitHub!"
echo "========================================"
echo
echo "GitHub Pages should deploy automatically"
echo "if configured to publish from main."
echo
echo "Website: https://aroundthehouseapp.com"
echo "Deployment: https://github.com/velocats/aroundthehouseapp.com/actions"
echo

