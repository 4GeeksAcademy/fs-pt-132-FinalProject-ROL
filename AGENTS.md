# Code Review Rules

## JavaScript / React
- Use functional components with named exports
- Use const/let, never var
- Use early returns over nested conditionals
- Destructure props at the top of the component
- Use `Link` from react-router-dom for internal navigation
- Use `fetch` with async/await for API calls

## CSS
- Use CSS custom properties from variables.css (`var(--color-*)`, `var(--space-*)`, etc.)
- Follow BEM naming: `.block__element--modifier`
- One component per CSS file, co-located with the component
- No inline styles, no CSS Modules, no preprocessors
- Include responsive breakpoints (@media)

## State Management
- Use the custom store pattern (useGlobalReducer + store.js)
- Use sessionStorage for JWT, not localStorage
- Dispatch actions with `{ type, payload }` convention

## Git
- Use conventional commits: feat:, fix:, refactor:, chore:, docs:
- No "Co-Authored-By" or AI attribution
- Keep commits focused on a single concern
