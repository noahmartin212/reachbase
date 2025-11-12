# Style Version System

## Quick Start

To switch between different visual style variants:

1. Open `frontend/src/styleVersion.ts`
2. Change the value:
   ```typescript
   export const STYLE_VERSION: 'default' | 'softer' = 'softer';  // ← Change this
   ```
3. Save the file
4. Your browser will automatically reload with the new style!

## Available Versions

### `default`
Your current design with defined structure:
- ✅ Visible borders on all cards (1px gray-200)
- ✅ Small shadows (shadow-sm)
- ✅ Standard rounded corners (rounded-lg)
- ✅ Clear visual separation between elements

### `softer`
Reduced strokes for a gentler feel:
- ❌ No borders on cards
- ✨ Stronger shadows for depth (shadow-md)
- 🔄 Extra rounded corners (rounded-xl)
- 🎨 Lighter divider lines (gray-100 instead of gray-200)
- 📦 Overall softer, more modern appearance

## How It Works

The system uses CSS variables and a data attribute on the `<html>` element:

```html
<html data-style-version="softer">
```

Each version has its own CSS file that targets this attribute:
- `frontend/src/styles/versions/default.css`
- `frontend/src/styles/versions/softer.css`

The CSS uses `!important` to override Tailwind classes, so you don't need to modify any component code.

## Creating New Versions

1. Create a new CSS file: `frontend/src/styles/versions/yourname.css`

2. Copy this template:
```css
/**
 * Your Version Name
 * Brief description
 */

:root[data-style-version="yourname"] {
  /* Override Tailwind border classes */
  .border {
    border-width: 0 !important;
  }

  .border-gray-200 {
    border-color: your-color !important;
  }

  /* Add more overrides as needed */
}
```

3. Import it in `frontend/src/App.tsx`:
```typescript
import './styles/versions/yourname.css';
```

4. Add to the type in `frontend/src/styleVersion.ts`:
```typescript
export const STYLE_VERSION: 'default' | 'softer' | 'yourname' = 'default';
```

## Tips for Experimenting

1. **Keep both versions open**: Open two browser windows side-by-side with different versions
2. **Use git branches**: Create a branch for each major style experiment
3. **Take screenshots**: Document what works and what doesn't
4. **Version naming**: Use descriptive names like `minimal`, `bold`, `rounded`, etc.

## File Locations

- **Config file**: `frontend/src/styleVersion.ts` ← Change this to switch versions
- **Version CSS files**: `frontend/src/styles/versions/`
- **App integration**: `frontend/src/App.tsx`

## Example Workflow

```bash
# 1. Open the config file
code frontend/src/styleVersion.ts

# 2. Change to 'softer'
export const STYLE_VERSION: 'default' | 'softer' = 'softer';

# 3. Save file (Ctrl+S)

# 4. Browser auto-reloads with new style

# 5. Don't like it? Change back to 'default' and save
```

That's it! No complex theme systems, no UI toggles, just change one line and save.
