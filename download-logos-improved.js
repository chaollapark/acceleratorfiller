const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Create logos directory if it doesn't exist
const logosDir = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Updated logo data with working URLs
const logos = [
  { name: 'Y Combinator', logo: 'https://www.ycombinator.com/static/yc-logo.svg', funding: '$500k for ~7%' },
  { name: 'Techstars', logo: 'https://www.techstars.com/static/images/techstars-logo.svg', funding: '$220k for ~5–7%' },
  { name: '500 Global', logo: 'https://500.co/wp-content/uploads/2021/03/500-logo.svg', funding: '$112.5k for 6%' },
  { name: 'Antler', logo: 'https://antler.co/static/images/antler-logo.svg', funding: '$200k–$250k for 8–9%' },
  { name: 'Entrepreneur First', logo: 'https://joinef.com/wp-content/uploads/2021/03/ef-logo.svg', funding: '$250k for ~9%' },
  { name: 'a16z Speedrun', logo: 'https://a16z.com/wp-content/uploads/2024/03/logo-speedrun-black.png', funding: '$175k–$1M for ~7–10%' },
  { name: 'South Park Commons', logo: 'https://southparkcommons.com/wp-content/uploads/2022/09/spc_logo_black.svg', funding: '$400k for 7% + $600k guaranteed follow-on' },
  { name: 'HF0 Residency', logo: 'https://hf0.com/static/images/hf0-logo.svg', funding: '$1M uncapped for 5% or $500k uncapped + 3%' },
  { name: 'NEO', logo: 'https://neo.org/static/images/neo-logo.svg', funding: '$600k via uncapped SAFE with $10M floor valuation' },
  { name: 'Sequoia Arc', logo: 'https://sequoiacap.com/wp-content/uploads/sites/6/2022/09/Sequoia-Capital-Logo.svg', funding: '$1M' },
  { name: 'PearX', logo: 'https://pear.vc/static/images/pear-logo.svg', funding: '$250k–$2M' },
  { name: 'Pioneer', logo: 'https://pioneer.app/static/img/logo.svg', funding: '$20k for 1%' },
  { name: 'LAUNCH', logo: 'https://www.launch.co/img/logo-light.svg', funding: '$125k for 6–7%' },
  { name: 'The Mint', logo: 'https://www.themint.com/img/logo.svg', funding: '$500k for 10%' },
  { name: 'AngelPad', logo: 'https://angelpad.org/static/images/angelpad-logo.svg', funding: '$120k for 7%' },
  { name: 'Betaworks AI Camp', logo: 'https://betaworks.com/static/images/betaworks-logo.svg', funding: '$500k' },
  { name: 'Greylock Edge', logo: 'https://greylock.com/static/images/greylock-logo.svg', funding: 'SAFE note + $500k+ in credits' },
  { name: 'Conviction Embed', logo: 'https://conviction.com/static/images/conviction-logo.svg', funding: '$150k uncapped MFN SAFE' },
  { name: 'OpenAI Converge', logo: 'https://openai.com/static/images/openai-logo.svg', funding: '$1M equity investment' },
  { name: 'Startup Wise Guys', logo: 'https://startupwiseguys.com/static/images/swg-logo.svg', funding: 'up to €65k for equity' },
  { name: 'APX', logo: 'https://apx.com/static/images/apx-logo.svg', funding: 'up to €500k, typically €50k for 5%' },
  { name: 'Founders Fellowship', logo: 'https://southparkcommons.com/wp-content/uploads/2022/09/spc_logo_black.svg', funding: '$150k for 5–10%' },
  { name: 'Seedcamp', logo: 'https://seedcamp.com/static/images/seedcamp-logo.svg', funding: '€100k–€200k for 7–7.5%' },
  { name: 'Google for Startups', logo: 'https://developers.google.com/static/startups/images/google-for-startups-logo.svg', funding: 'up to $100k' },
  { name: 'Accel Atoms', logo: 'https://accel.com/static/images/accel-atoms-logo.svg', funding: 'up to $500k–$1M' },
  { name: 'AI Grant', logo: 'https://aigrant.com/static/images/ai-grant-logo.svg', funding: '$250k uncapped' },
  { name: 'AI2 Incubator', logo: 'https://incubator.ai2.org/static/images/ai2-incubator-logo.svg', funding: '$50k–$150k' },
  { name: 'Afore Capital', logo: 'https://afore.vc/static/images/afore-logo.svg', funding: '$100k–$500k' },
  { name: 'Berkeley SkyDeck', logo: 'https://skydeck.berkeley.edu/static/images/berkeley-skydeck-logo.svg', funding: '$200k' },
  { name: 'Soma Capital', logo: 'https://www.somacap.com/soma-logo.svg', funding: '$100k' },
];

// Alternative URLs for some logos that might not work
const alternativeUrls = {
  'Y Combinator': 'https://www.ycombinator.com/assets/ycdc/yc-logo-e95e7064b36345c343b48e3c8823e9b3d1562f4a35f0c189d13b9d24153d09ff.svg',
  'Techstars': 'https://www.techstars.com/static/images/techstars-logo.svg',
  'Antler': 'https://antler.co/static/images/antler-logo.svg',
  'HF0 Residency': 'https://hf0.com/static/images/hf0-logo.svg',
  'NEO': 'https://neo.org/static/images/neo-logo.svg',
  'PearX': 'https://pear.vc/static/images/pear-logo.svg',
  'AngelPad': 'https://angelpad.org/static/images/angelpad-logo.svg',
  'Betaworks AI Camp': 'https://betaworks.com/static/images/betaworks-logo.svg',
  'Greylock Edge': 'https://greylock.com/static/images/greylock-logo.svg',
  'Conviction Embed': 'https://conviction.com/static/images/conviction-logo.svg',
  'OpenAI Converge': 'https://openai.com/static/images/openai-logo.svg',
  'Startup Wise Guys': 'https://startupwiseguys.com/static/images/swg-logo.svg',
  'APX': 'https://apx.com/static/images/apx-logo.svg',
  'Seedcamp': 'https://seedcamp.com/static/images/seedcamp-logo.svg',
  'Google for Startups': 'https://developers.google.com/static/startups/images/google-for-startups-logo.svg',
  'Accel Atoms': 'https://accel.com/static/images/accel-atoms-logo.svg',
  'AI Grant': 'https://aigrant.com/static/images/ai-grant-logo.svg',
  'AI2 Incubator': 'https://incubator.ai2.org/static/images/ai2-incubator-logo.svg',
  'Afore Capital': 'https://afore.vc/static/images/afore-logo.svg',
  'Berkeley SkyDeck': 'https://skydeck.berkeley.edu/static/images/berkeley-skydeck-logo.svg',
};

function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const request = protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const filePath = path.join(logosDir, filename);
      const file = fs.createWriteStream(filePath);
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    });
    
    request.on('error', (err) => {
      reject(err);
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

function getFileExtension(url) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const extension = path.extname(pathname);
  return extension || '.svg'; // Default to .svg if no extension found
}

function sanitizeFilename(name) {
  return name
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

async function downloadLogoWithFallback(logo) {
  const extension = getFileExtension(logo.logo);
  const filename = `${sanitizeFilename(logo.name)}${extension}`;
  
  try {
    await downloadFile(logo.logo, filename);
    return { ...logo, localPath: `/logos/${filename}` };
  } catch (error) {
    console.log(`❌ Failed to download ${logo.name} from primary URL: ${error.message}`);
    
    // Try alternative URL if available
    const alternativeUrl = alternativeUrls[logo.name];
    if (alternativeUrl && alternativeUrl !== logo.logo) {
      try {
        await downloadFile(alternativeUrl, filename);
        console.log(`✅ Downloaded ${logo.name} from alternative URL`);
        return { ...logo, localPath: `/logos/${filename}` };
      } catch (altError) {
        console.log(`❌ Failed to download ${logo.name} from alternative URL: ${altError.message}`);
      }
    }
    
    // If all downloads fail, keep original URL as fallback
    return { ...logo, localPath: logo.logo };
  }
}

async function downloadAllLogos() {
  console.log('🚀 Starting logo downloads with fallback URLs...\n');
  
  const downloadPromises = logos.map(downloadLogoWithFallback);
  const results = await Promise.allSettled(downloadPromises);
  
  // Create updated logos array with local paths
  const updatedLogos = results.map(result => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.log(`❌ Failed to process logo: ${result.reason}`);
      return null;
    }
  }).filter(Boolean);
  
  // Save the updated logos data to a JSON file
  const logosDataPath = path.join(__dirname, 'src', 'data', 'logos.json');
  const dataDir = path.dirname(logosDataPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(logosDataPath, JSON.stringify(updatedLogos, null, 2));
  console.log(`\n📁 Saved logos data to: ${logosDataPath}`);
  
  console.log('\n✨ Download complete!');
  console.log(`📂 Logos saved to: ${logosDir}`);
  console.log(`📊 Total logos processed: ${updatedLogos.length}`);
  
  // Show summary of downloaded vs fallback
  const downloaded = updatedLogos.filter(logo => logo.localPath.startsWith('/logos/'));
  const fallback = updatedLogos.filter(logo => !logo.localPath.startsWith('/logos/'));
  
  console.log(`✅ Successfully downloaded: ${downloaded.length}`);
  console.log(`⚠️  Using fallback URLs: ${fallback.length}`);
}

downloadAllLogos().catch(console.error); 