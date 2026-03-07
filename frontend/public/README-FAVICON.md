# Alif Restaurant Favicon

## Design

The favicon features:

- **Background**: Restaurant green (#0d5f4e) - represents the brand color
- **Letter 'A'**: Gold (#d4a843) - stands for "Alif" in elegant typography
- **Fork & Spoon**: White icons - symbolizes dining and restaurant service
- **Clean & Modern**: Simple design that scales well at all sizes

## Files

- `favicon.svg` - Main SVG favicon (works in modern browsers)
- `manifest.json` - PWA manifest for mobile devices
- `favicon-generator.html` - Tool to generate PNG/ICO versions if needed

## Browser Support

The SVG favicon works in:

- Chrome/Edge (v80+)
- Firefox (v41+)
- Safari (v9+)
- Opera (v44+)

## Optional: Generate ICO/PNG

If you need ICO or PNG versions for older browsers:

1. Open `favicon-generator.html` in a browser
2. Right-click the canvas and save as PNG
3. Use an online tool like https://favicon.io to convert PNG to ICO
4. Place the ICO file in the `public` folder
5. Add `<link rel="icon" href="/favicon.ico" />` to index.html

## Colors Used

- Primary Green: `#0d5f4e`
- Gold Accent: `#d4a843`
- White: `#ffffff`
