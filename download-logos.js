const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Create logos directory if it doesn't exist
const logosDir = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Logo data from the component
const logos = [
  { name: 'Y Combinator', logo: 'https://www.ycombinator.com/assets/ycdc/yc-logo-e95e7064b36345c343b48e3c8823e9b3d1562f4a35f0c189d13b9d24153d09ff.svg', funding: '$500k for ~7%' },
  { name: 'Techstars', logo: 'https://www.techstars.com/static/images/techstars-logo.svg', funding: '$220k for ~5–7%' },
  { name: '500 Global', logo: 'https://500.co/wp-content/uploads/2021/03/500-logo.svg', funding: '$112.5k for 6%' },
  { name: 'Antler', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Antler_logo.svg/1952px-Antler_logo.svg.png', funding: '$200k–$250k for 8–9%' },
  { name: 'Entrepreneur First', logo: 'https://joinef.com/wp-content/uploads/2021/03/ef-logo.svg', funding: '$250k for ~9%' },
  { name: 'a16z Speedrun', logo: 'https://a16z.com/wp-content/uploads/2024/03/logo-speedrun-black.png', funding: '$175k–$1M for ~7–10%' },
  { name: 'South Park Commons', logo: 'https://southparkcommons.com/wp-content/uploads/2022/09/spc_logo_black.svg', funding: '$400k for 7% + $600k guaranteed follow-on' },
  { name: 'HF0 Residency', logo: 'https://ozero.design/hf0/HF0_logo.svg', funding: '$1M uncapped for 5% or $500k uncapped + 3%' },
  { name: 'NEO', logo: 'https://neo.org/img/logo.svg', funding: '$600k via uncapped SAFE with $10M floor valuation' },
  { name: 'Sequoia Arc', logo: 'https://sequoiacap.com/wp-content/uploads/sites/6/2022/09/Sequoia-Capital-Logo.svg', funding: '$1M' },
  { name: 'PearX', logo: 'https://pear.vc/wp-content/uploads/2022/09/pear-logo.svg', funding: '$250k–$2M' },
  { name: 'Pioneer', logo: 'https://pioneer.app/static/img/logo.svg', funding: '$20k for 1%' },
  { name: 'LAUNCH', logo: 'https://www.launch.co/img/logo-light.svg', funding: '$125k for 6–7%' },
  { name: 'The Mint', logo: 'https://www.themint.com/img/logo.svg', funding: '$500k for 10%' },
  { name: 'AngelPad', logo: 'https://angelpad.org/wp-content/uploads/2021/03/angelpad-logo.svg', funding: '$120k for 7%' },
  { name: 'Betaworks AI Camp', logo: 'https://betaworks.com/img/logo.svg', funding: '$500k' },
  { name: 'Greylock Edge', logo: 'https://greylock.com/img/logo.svg', funding: 'SAFE note + $500k+ in credits' },
  { name: 'Conviction Embed', logo: 'https://conviction.com/img/logo.svg', funding: '$150k uncapped MFN SAFE' },
  { name: 'OpenAI Converge', logo: 'https://openai.com/img/logo.svg', funding: '$1M equity investment' },
  { name: 'Startup Wise Guys', logo: 'https://startupwiseguys.com/wp-content/uploads/2021/03/swg-logo.svg', funding: 'up to €65k for equity' },
  { name: 'APX', logo: 'https://apx.com/img/logo.svg', funding: 'up to €500k, typically €50k for 5%' },
  { name: 'Founders Fellowship', logo: 'https://southparkcommons.com/wp-content/uploads/2022/09/spc_logo_black.svg', funding: '$150k for 5–10%' },
  { name: 'Seedcamp', logo: 'https://seedcamp.com/wp-content/uploads/2021/03/seedcamp-logo.svg', funding: '€100k–€200k for 7–7.5%' },
  { name: 'Google for Startups', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_for_Startups_logo.svg/800px-Google_for_Startups_logo.svg.png', funding: 'up to $100k' },
  { name: 'Accel Atoms', logo: 'https://thisislopez.com/wp-content/uploads/2022/09/accel-atoms-logo-black.svg', funding: 'up to $500k–$1M' },
  { name: 'AI Grant', logo: 'https://aigrant.com/img/logo.svg', funding: '$250k uncapped' },
  { name: 'AI2 Incubator', logo: 'https://images.squarespace-cdn.com/content/v1/6230d45f143b523561523355/e02135f2-6333-48a5-882c-23d168603a3e/AI2_Incubator_Logo_Green.png?format=1500w', funding: '$50k–$150k' },
  { name: 'Afore Capital', logo: 'https://images.crunchbase.com/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1472703359/p96z7ub122tnvj46bdfx.png', funding: '$100k–$500k' },
  { name: 'Berkeley SkyDeck', logo: 'https://skydeck.berkeley.edu/wp-content/uploads/2021/01/berkeley-skydeck-logo.svg', funding: '$200k' },
  { name: 'Soma Capital', logo: 'https://www.somacap.com/soma-logo.svg', funding: '$100k' },
];

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

async function downloadAllLogos() {
  console.log('🚀 Starting logo downloads...\n');
  
  const downloadPromises = logos.map(async (logo, index) => {
    const extension = getFileExtension(logo.logo);
    const filename = `${sanitizeFilename(logo.name)}${extension}`;
    
    try {
      await downloadFile(logo.logo, filename);
      return { ...logo, localPath: `/logos/${filename}` };
    } catch (error) {
      console.log(`❌ Failed to download ${logo.name}: ${error.message}`);
      return { ...logo, localPath: logo.logo }; // Keep original URL as fallback
    }
  });
  
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
}

downloadAllLogos().catch(console.error); 