# Feature Branch Workflow

Guide for developing new features using feature branches and Pull Requests.

## Branch Naming Convention

Use the format: `{username}/{requirement-id}-{short-description}`

Examples:
- `keokukmusic/REQ-2-multi-agent-architecture-setup-with-lead-architect`
- `keokukmusic/REQ-3-user-authentication-improvements`
- `keokukmusic/REQ-4-performance-optimization`

## Workflow Steps

### 1. Create Feature Branch

```bash
# From main branch
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b keokukmusic/REQ-X-feature-name
```

### 2. Develop Feature

- Make changes
- Commit frequently with descriptive messages
- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`

### 3. Push Branch

```bash
git push -u origin keokukmusic/REQ-X-feature-name
```

### 4. Create Pull Request

**Via GitHub CLI:**
```bash
gh pr create \
  --title "feat: implement Feature Name" \
  --body "Implements REQ-X

## Changes
- Feature description
- List of changes

Closes REQ-X" \
  --head keokukmusic/REQ-X-feature-name \
  --base main
```

**Via GitHub Web Interface:**
1. Visit: https://github.com/keokukzh/AIDevelo-Braingrid
2. Click "Compare & pull request"
3. Fill in title and description
4. Link to requirement: REQ-X

### 5. Validate PR Against Acceptance Criteria

```bash
acceptance review https://github.com/keokukzh/AIDevelo-Braingrid/pull/{PR_NUMBER} against REQ-X
```

### 6. Code Review & Merge

- Wait for review approval
- Address any feedback
- Merge PR to main
- Delete feature branch after merge

## Commit Message Format

Use conventional commits:

```
feat: add new feature
fix: fix bug
docs: update documentation
refactor: refactor code
test: add tests
chore: maintenance tasks
```

Examples:
- `feat: add user authentication`
- `fix: resolve timeout error in RAG endpoint`
- `docs: update deployment guide`

## Best Practices

1. **Keep branches focused**: One feature per branch
2. **Commit often**: Small, logical commits
3. **Write clear commit messages**: Explain what and why
4. **Update documentation**: Keep docs in sync with code
5. **Test before PR**: Ensure code builds and tests pass
6. **Link to requirements**: Always reference REQ-X in PR

## Branch Protection

- Main branch should be protected
- Require PR reviews before merge
- Require status checks to pass
- No direct pushes to main

## Merging Strategies

### Merge Commit (Default)
- Preserves full history
- Shows feature branch clearly

### Squash and Merge
- Cleaner history
- Single commit per feature
- Good for small features

### Rebase and Merge
- Linear history
- No merge commits
- Use with caution on shared branches

