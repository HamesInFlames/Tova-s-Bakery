# AGENTS.md — project conventions

## Project
- Name: Tova's Bakery (website mockup)
- Developer: James (Kim Consultant)
- Stack: React 19, TypeScript (strict), Vite (rolldown-vite), Tailwind CSS, Motion, react-router-dom
- Content: data-driven from `tovas-content.json`
- Repo: github.com/HamesInFlames/Tova-s-Bakery

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Test: none
- Lint: none
- Typecheck: `npm run typecheck`

## Code conventions
- TypeScript strict mode
- Brand tokens (palette, type) live in `src/styles/tokens.css`; rationale in `design-system/MASTER.md`
- Product and page content comes from `tovas-content.json`
- Contact form uses Web3Forms key from `VITE_WEB3FORMS_ACCESS_KEY` (no backend)

## Workflow
- Read tasks/todo.md before starting work
- Update tasks/status.md after each session
- Log decisions in tasks/decisions.md
- Run `npm run build` before committing

## Do NOT
- Change existing styling, copy or behaviour the task did not ask about
- Install packages without documenting in tasks/decisions.md
- Modify deployment config without approval
- Delete .env files

## Lessons
<!-- added by /kc-workflow:reflect -->
