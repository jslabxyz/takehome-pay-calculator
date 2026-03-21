# Refactor Plan

When asked to refactor or migrate the project, follow this phased approach:

## Phase 1: Research
- Search for the latest stable versions of all relevant packages
- Check for breaking changes and migration guides
- Summarize findings before proceeding

## Phase 2: Plan
- Create a numbered list of specific changes needed
- Identify files that will be modified
- Note any risks or potential issues
- Present the plan to the user for approval before implementing

## Phase 3: Implement (one phase at a time)
- Make changes incrementally, not all at once
- After each logical group of changes, run `npm run build` to verify
- Fix any TypeScript or ESLint errors immediately
- Pin all dependency versions (never use "latest")

## Phase 4: Validate
- Run the full test suite: `npm test`
- Run a production build: `npm run build`
- Fix any failures before proceeding
- Update test expectations if the underlying logic intentionally changed

## Phase 5: Document
- Update CLAUDE.md to reflect any tech stack or convention changes
- Write a clear commit message summarizing all changes
- List the before/after versions of upgraded packages

## Rules
- Never skip the build check between phases
- Never use `ignoreBuildErrors` or `ignoreDuringBuilds` — fix errors properly
- Always pin dependency versions to specific ranges (e.g., `^16.2.0`, not `latest`)
- Update tests when calculation logic changes
- Keep commits atomic — one logical change per commit when possible
