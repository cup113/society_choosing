# Agent Development Guidelines

## Build/Test Commands
- **Client dev**: `cd client && pnpm run dev` (port 5175)
- **Client build**: `cd client && pnpm run build`
- **Client test**: `cd client && pnpm run test:unit` (single test: `pnpm run test:unit filename.test.ts`)
- **Client type-check**: `cd client && pnpm run type-check`
- **Server build**: `cd server && pnpm run build`
- **Full dev**: `python run_dev.py`

## Code Style
- **TypeScript**: Strict mode enabled, use proper types
- **Vue 3**: Composition API with `<script setup>`, single quotes
- **Imports**: Use `@/*` alias for client src imports
- **Styling**: Tailwind CSS with clsx/twMerge utility
- **Components**: Radix Vue/Reka UI patterns
- **State**: Pinia stores, avoid direct mutations
- **Error handling**: Use try/catch with proper error types