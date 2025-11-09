# Copilot Instructions - Surprise Timeline App

## Project Overview
This is a romantic timeline React app that displays relationship memories in a beautiful, interactive timeline format. Built with TypeScript and React, it combines date-based photo galleries with detailed memory entries and monthly recaps.

## Architecture & Core Patterns

### Data Structure (`src/types/timeline.ts`)
- **TimelineEntry**: Central data model with rich metadata (memories, songs, movies, photos, location, category)
- **Categories**: `'date' | 'milestone' | 'trip' | 'celebration' | 'everyday' | 'special' | 'vacation'` - each affects UI styling
- **MonthlyRecap**: Month-level summaries with favorite dates and highlights
- All dates use `YYYY-MM-DD` format for consistency

### Photo Management System
- Photos organized in `/public/pictures/YYYY-MM-DD/` folders
- **photo-manifest.json**: Generated at build time by `scripts/generate-photo-manifest.js`
- **photoUtils.ts**: Abstracts photo loading via manifest lookup, not filesystem discovery
- Photos auto-discover from date folders when not explicitly specified in timeline entries

### Component Hierarchy
```
App -> Timeline -> [TimelineEntry, MonthlyRecapCard, AnniversaryCountdown]
```

## Key Development Workflows

### Adding New Memories
1. Add entry to `src/data/data.ts` following TimelineEntry interface
2. If photos exist, create `/public/pictures/YYYY-MM-DD/` folder
3. Run `node scripts/generate-photo-manifest.js` to update manifest
4. Photos auto-appear in timeline without manual linking

### Photo Scripts
- `generate-photo-manifest.js`: Must run after adding photos (creates photo discovery index)
- `show-available-photos.js`: Debug tool to see all discoverable photos
- `sync-photos-with-manifest.js`: Validates photo folder/manifest consistency

### Deployment
- **Local**: `npm start` (standard CRA)
- **Production**: Docker → Google Cloud Run via `./deploy.sh`
- Build generates static assets + photo manifest for containerized deployment

## Component-Specific Patterns

### TimelineEntry
- **Alternating layout**: Uses `isLeft` prop for zigzag timeline appearance
- **Category-based styling**: Vacation entries get special expanded layout
- **Photo modal**: Click thumbnails for full-screen gallery with navigation
- **Conditional sections**: Memories, activities, highlights render only when present

### Date Filtering & Grouping
- Month filter uses `getYear(date)-getMonth(date)` format for grouping
- `date-fns` for all date parsing/formatting (not native Date methods)
- Filter state managed at Timeline level, not individual entries

### Styling Approach
- CSS modules per component (`.css` files alongside `.tsx`)
- Responsive design with alternating timeline entries
- Special styling for vacation entries (expanded cards, activity grids)

## Common Gotchas
- **Photo manifest**: Always regenerate after adding photos to public/pictures/
- **Date format**: Use ISO `YYYY-MM-DD` strings, parse with `date-fns parseISO()`
- **Photo paths**: Start with `/pictures/` for public folder assets
- **Timeline data**: Lives in single data.ts file, not database-driven
- **Category icons**: Mapped in TimelineEntry component, affects visual hierarchy

## File Organization
- `/src/data/data.ts`: All timeline content (single source of truth)
- `/src/types/`: TypeScript interfaces
- `/src/components/`: React components with co-located CSS
- `/src/utils/`: Photo utilities and helpers
- `/scripts/`: Build-time photo management scripts
- `/public/pictures/`: Date-organized photo folders

When adding features, follow the established pattern of rich data models with flexible rendering based on what's present in each entry.