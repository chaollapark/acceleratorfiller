# Logo Download Instructions

## Current Status
✅ Placeholder logos have been created for all accelerators
✅ Logo data file has been generated at `src/data/logos.json`

## Next Steps

### Option 1: Manual Download (Recommended)
1. Visit each accelerator's website
2. Download their official logo
3. Replace the placeholder files in `public/logos/` with the actual logos
4. Keep the same filenames as the placeholders

### Option 2: Use Original URLs
If you prefer to use the original URLs instead of local files, update the `src/data/logos.json` file to use the original URLs from the `logo-scroller.tsx` component.

### Option 3: Automated Download
Run the `download-logos.js` script to attempt automated downloads, but be aware that many URLs may be outdated.

## File Structure
- Placeholder logos: `public/logos/`
- Logo data: `src/data/logos.json`
- Component using logos: `src/components/ui/logo-scroller.tsx`

## Updating the Component
To use the local logos, update the `logo-scroller.tsx` component to import the logos from the JSON file:

```typescript
import logos from '@/data/logos.json';
```

Then use `logo.logo` instead of the hardcoded URLs.
