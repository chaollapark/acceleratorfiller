const fs = require('fs');
const path = require('path');

// Create logos directory if it doesn't exist
const logosDir = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Logo data with local paths
const logos = [
  { name: 'Y Combinator', logo: '/logos/y-combinator.svg', funding: '$500k for ~7%' },
  { name: 'Techstars', logo: '/logos/techstars.svg', funding: '$220k for ~5–7%' },
  { name: '500 Global', logo: '/logos/500-global.svg', funding: '$112.5k for 6%' },
  { name: 'Antler', logo: '/logos/antler.svg', funding: '$200k–$250k for 8–9%' },
  { name: 'Entrepreneur First', logo: '/logos/entrepreneur-first.svg', funding: '$250k for ~9%' },
  { name: 'a16z Speedrun', logo: '/logos/a16z-speedrun.png', funding: '$175k–$1M for ~7–10%' },
  { name: 'South Park Commons', logo: '/logos/south-park-commons.svg', funding: '$400k for 7% + $600k guaranteed follow-on' },
  { name: 'HF0 Residency', logo: '/logos/hf0-residency.svg', funding: '$1M uncapped for 5% or $500k uncapped + 3%' },
  { name: 'NEO', logo: '/logos/neo.svg', funding: '$600k via uncapped SAFE with $10M floor valuation' },
  { name: 'Sequoia Arc', logo: '/logos/sequoia-arc.svg', funding: '$1M' },
  { name: 'PearX', logo: '/logos/pearx.svg', funding: '$250k–$2M' },
  { name: 'Pioneer', logo: '/logos/pioneer.svg', funding: '$20k for 1%' },
  { name: 'LAUNCH', logo: '/logos/launch.svg', funding: '$125k for 6–7%' },
  { name: 'The Mint', logo: '/logos/the-mint.svg', funding: '$500k for 10%' },
  { name: 'AngelPad', logo: '/logos/angelpad.svg', funding: '$120k for 7%' },
  { name: 'Betaworks AI Camp', logo: '/logos/betaworks-ai-camp.svg', funding: '$500k' },
  { name: 'Greylock Edge', logo: '/logos/greylock-edge.svg', funding: 'SAFE note + $500k+ in credits' },
  { name: 'Conviction Embed', logo: '/logos/conviction-embed.svg', funding: '$150k uncapped MFN SAFE' },
  { name: 'OpenAI Converge', logo: '/logos/openai-converge.svg', funding: '$1M equity investment' },
  { name: 'Startup Wise Guys', logo: '/logos/startup-wise-guys.svg', funding: 'up to €65k for equity' },
  { name: 'APX', logo: '/logos/apx.svg', funding: 'up to €500k, typically €50k for 5%' },
  { name: 'Founders Fellowship', logo: '/logos/founders-fellowship.svg', funding: '$150k for 5–10%' },
  { name: 'Seedcamp', logo: '/logos/seedcamp.svg', funding: '€100k–€200k for 7–7.5%' },
  { name: 'Google for Startups', logo: '/logos/google-for-startups.svg', funding: 'up to $100k' },
  { name: 'Accel Atoms', logo: '/logos/accel-atoms.svg', funding: 'up to $500k–$1M' },
  { name: 'AI Grant', logo: '/logos/ai-grant.svg', funding: '$250k uncapped' },
  { name: 'AI2 Incubator', logo: '/logos/ai2-incubator.svg', funding: '$50k–$150k' },
  { name: 'Afore Capital', logo: '/logos/afore-capital.svg', funding: '$100k–$500k' },
  { name: 'Berkeley SkyDeck', logo: '/logos/berkeley-skydeck.svg', funding: '$200k' },
  { name: 'Soma Capital', logo: '/logos/soma-capital.svg', funding: '$100k' },
];

// Create a simple SVG placeholder for each logo
function createPlaceholderSVG(name) {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
  
  return `<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="100" fill="#f3f4f6" stroke="#d1d5db" stroke-width="1"/>
  <text x="100" y="55" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#6b7280">${initials}</text>
  <text x="100" y="75" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#9ca3af">${name}</text>
</svg>`;
}

// Create placeholder PNG for a16z (since it's a PNG)
function createPlaceholderPNG(name) {
  // For now, we'll create an SVG and you can convert it to PNG manually
  return createPlaceholderSVG(name);
}

async function createPlaceholders() {
  console.log('🎨 Creating logo placeholders...\n');
  
  for (const logo of logos) {
    const filename = logo.logo.split('/').pop();
    const filePath = path.join(logosDir, filename);
    
    let content;
    if (filename.endsWith('.png')) {
      content = createPlaceholderPNG(logo.name);
      // Save as SVG for now, you can convert to PNG later
      const svgFilename = filename.replace('.png', '.svg');
      const svgPath = path.join(logosDir, svgFilename);
      fs.writeFileSync(svgPath, content);
      console.log(`✅ Created placeholder: ${svgFilename}`);
    } else {
      content = createPlaceholderSVG(logo.name);
      fs.writeFileSync(filePath, content);
      console.log(`✅ Created placeholder: ${filename}`);
    }
  }
  
  // Save the logos data to JSON
  const logosDataPath = path.join(__dirname, 'src', 'data', 'logos.json');
  fs.writeFileSync(logosDataPath, JSON.stringify(logos, null, 2));
  console.log(`\n📁 Saved logos data to: ${logosDataPath}`);
  
  console.log('\n✨ Placeholder creation complete!');
  console.log(`📂 Placeholders saved to: ${logosDir}`);
  console.log(`📊 Total placeholders created: ${logos.length}`);
  
  // Create instructions file
  const instructions = `# Logo Download Instructions

## Current Status
✅ Placeholder logos have been created for all accelerators
✅ Logo data file has been generated at \`src/data/logos.json\`

## Next Steps

### Option 1: Manual Download (Recommended)
1. Visit each accelerator's website
2. Download their official logo
3. Replace the placeholder files in \`public/logos/\` with the actual logos
4. Keep the same filenames as the placeholders

### Option 2: Use Original URLs
If you prefer to use the original URLs instead of local files, update the \`src/data/logos.json\` file to use the original URLs from the \`logo-scroller.tsx\` component.

### Option 3: Automated Download
Run the \`download-logos.js\` script to attempt automated downloads, but be aware that many URLs may be outdated.

## File Structure
- Placeholder logos: \`public/logos/\`
- Logo data: \`src/data/logos.json\`
- Component using logos: \`src/components/ui/logo-scroller.tsx\`

## Updating the Component
To use the local logos, update the \`logo-scroller.tsx\` component to import the logos from the JSON file:

\`\`\`typescript
import logos from '@/data/logos.json';
\`\`\`

Then use \`logo.logo\` instead of the hardcoded URLs.
`;

  const instructionsPath = path.join(__dirname, 'LOGO_INSTRUCTIONS.md');
  fs.writeFileSync(instructionsPath, instructions);
  console.log(`📝 Created instructions file: ${instructionsPath}`);
}

createPlaceholders().catch(console.error); 