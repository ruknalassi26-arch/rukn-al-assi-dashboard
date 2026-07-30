# Agent Rules & Instructions — Rukn Al Assi

## Package Manager Requirement
- **ALWAYS use Bun (`bun`) instead of `npm`, `pnpm`, or `yarn`.**
- Development server: `bun dev`
- Production build: `bun run build`
- Type checking: `bun run type-check`
- Linting: `bun run lint`
- Install packages: `bun add <package>` or `bun add -d <package>`

## Architecture Rules
- Follow Clean Architecture (Domain / Data / Presentation).
- Feature-first structure inside `src/features/`.
- Reuse components in `src/shared/`.
- Infrastructure in `src/core/`.
