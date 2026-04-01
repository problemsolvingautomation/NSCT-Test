# Switch to main branch
git checkout main

# Fetch latest changes from remote
git fetch origin

# Pull latest changes to sync local main
git pull origin main

# Create and switch to a new branch
git checkout -b feature/my-new-feature

# Stage all changes
git add .

# Commit with a meaningful message
git commit -m "Implemented skeleton loaders for all pages"

# Push the feature branch to GitHub
git push origin feature/my-new-feature

# Install GitHub CLI if not already
gh pr create --title "Implemented skeleton loaders" --body "Converted all loaders to skeleton screens" --base main --head feature/my-new-feature

# Switch to main
git checkout main

# Pull the latest merged changes
git pull origin main

# Delete local branch
git branch -d feature/my-new-feature

# Delete remote branch
git push origin --delete feature/my-new-feature

# Repeat for next feature
git checkout main
git pull origin main
git checkout -b feature/next-feature