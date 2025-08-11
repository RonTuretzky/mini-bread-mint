# Image Requirements for Farcaster Mini App

The following images need to be created/converted from SVG to PNG for production deployment:

## Required Images

### 1. Icon Image (Required)
- **File**: `bread-coop-icon-1024.png`
- **Dimensions**: 1024x1024px
- **Format**: PNG, no alpha channel
- **Source**: Convert from `bread-coop-icon-1024.svg`

### 2. Open Graph Image
- **File**: `og-image.png`
- **Dimensions**: 1200x630px (1.91:1 aspect ratio)
- **Format**: PNG
- **Source**: Convert from `og-image.svg`

### 3. Hero Image
- **File**: `hero-image.png`
- **Dimensions**: 1200x630px (1.91:1 aspect ratio)
- **Format**: PNG
- **Note**: Can be same as OG image or unique promotional image

### 4. Share Image (Deprecated but included)
- **File**: `share-image.png`
- **Dimensions**: 3:2 aspect ratio
- **Format**: PNG

### 5. Screenshots (Optional but recommended)
- **Files**: 
  - `screenshots/screenshot-1.png`
  - `screenshots/screenshot-2.png`
  - `screenshots/screenshot-3.png`
- **Dimensions**: 1284x2778px (portrait)
- **Format**: PNG
- **Content**: Visual previews of the app in action

## Conversion Commands

To convert SVG to PNG, you can use ImageMagick or similar tools:

```bash
# Install ImageMagick if not already installed
brew install imagemagick

# Convert icon
convert -background none bread-coop-icon-1024.svg -resize 1024x1024 bread-coop-icon-1024.png

# Convert OG image
convert og-image.svg og-image.png

# For the icon, ensure no alpha channel:
convert bread-coop-icon-1024.svg -background white -flatten -resize 1024x1024 bread-coop-icon-1024.png
```

## Production Deployment

Before deploying to production:
1. Update all URLs in `farcaster.json` to point to your production domain
2. Generate all required PNG images from the SVG sources
3. Take actual screenshots of the running app
4. Ensure all images are optimized for web delivery