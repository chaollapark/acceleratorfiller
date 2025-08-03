# Logo Management System

## What Was Created

✅ **30 placeholder logos** have been created in `public/logos/` directory
✅ **Logo data file** generated at `src/data/logos.json`
✅ **Updated component** to use local logos instead of external URLs
✅ **Download scripts** for future automation

## File Structure

```
public/
├── logos/                    # All logo files (SVG placeholders)
│   ├── y-combinator.svg
│   ├── techstars.svg
│   ├── 500-global.svg
│   └── ... (30 total)
│
src/
├── data/
│   └── logos.json           # Logo metadata and paths
├── components/ui/
│   └── logo-scroller.tsx    # Updated to use local logos
│
scripts/
├── download-logos.js         # Original download script
├── download-logos-improved.js # Improved version with fallbacks
└── create-logo-placeholders.js # Creates placeholder logos
```

## Current Status

### ✅ Working
- All 30 accelerators have placeholder logos
- Component is updated to use local files
- Data structure is consistent
- TypeScript configuration supports JSON imports

### ⚠️ Next Steps
- Replace placeholder logos with actual accelerator logos
- Some logos may need to be converted to appropriate formats (SVG/PNG)

## How to Replace Placeholders with Real Logos

### Option 1: Manual Download (Recommended)
1. Visit each accelerator's website
2. Download their official logo
3. Replace the corresponding file in `public/logos/`
4. Keep the same filename (e.g., `y-combinator.svg`)

### Option 2: Use Original URLs
If you prefer to use external URLs, update `src/data/logos.json`:

```json
{
  "name": "Y Combinator",
  "logo": "https://www.ycombinator.com/static/yc-logo.svg",
  "funding": "$500k for ~7%"
}
```

### Option 3: Automated Download
Run the download scripts, but be aware that many URLs may be outdated:

```bash
# Try the improved version first
node download-logos-improved.js

# Or the original version
node download-logos.js
```

## Component Usage

The `logo-scroller.tsx` component now imports logos from the JSON file:

```typescript
import logos from '@/data/logos.json';
```

This makes it easy to:
- Update logos without changing code
- Add new accelerators
- Modify funding information
- Switch between local and external URLs

## Benefits

1. **Performance**: Local files load faster than external URLs
2. **Reliability**: No dependency on external servers
3. **Maintainability**: Centralized logo management
4. **Flexibility**: Easy to switch between local and external URLs
5. **Type Safety**: TypeScript support for logo data

## Available Scripts

### `create-logo-placeholders.js`
- Creates placeholder SVG logos for all accelerators
- Generates the `logos.json` data file
- Creates instructions for manual logo replacement

### `download-logos.js`
- Attempts to download logos from original URLs
- Many URLs may be outdated (404/301 errors)

### `download-logos-improved.js`
- Includes fallback URLs for some accelerators
- Better error handling and reporting
- Still may have issues with outdated URLs

## Logo Specifications

- **Format**: SVG (preferred) or PNG
- **Size**: 200x100px (placeholder size)
- **Location**: `public/logos/`
- **Naming**: kebab-case (e.g., `y-combinator.svg`)

## Troubleshooting

### TypeScript Errors
If you get import errors, ensure `resolveJsonModule` is enabled in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

### Missing Logos
If logos don't display, check:
1. File exists in `public/logos/`
2. Path in `logos.json` is correct
3. File format is supported (SVG/PNG)

### Performance Issues
- Use SVG format when possible (smaller, scalable)
- Optimize PNG files if needed
- Consider lazy loading for large logo collections

## Future Enhancements

1. **Logo Optimization**: Add image optimization pipeline
2. **Lazy Loading**: Implement lazy loading for better performance
3. **Logo Validation**: Add script to validate logo files
4. **Auto-update**: Create script to check for logo updates
5. **CDN Integration**: Move logos to CDN for better performance 