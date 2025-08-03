
import React from 'react';

const logos = [
  { name: 'Boost VC', logo: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGx1lAx3yIugoxSfB4mM6N1skfoJrvoOjNT0w_qluR4jldZVJ2QF6nXyIMEitp2efyLoO12hY4oape6NsbMnx8UMua9UikkAnwAQvl-9D-t3thelBcOSdA7KBhd9B_tIOgIaacqu9qIMKnO', funding: 'up to $500k for 15%' },
  { name: 'Antler', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Antler_logo.svg/1952px-Antler_logo.svg.png', funding: '$200k–$250k for 8–9%' },
  { name: 'Y Combinator', logo: 'https://www.ycombinator.com/assets/ycdc/yc-logo-e95e7064b36345c343b48e3c8823e9b3d1562f4a35f0c189d13b9d24153d09ff.svg', funding: '$500k for ~7%' },
  { name: 'Techstars', logo: 'https://brandfolder.com/techstars/logo', funding: '$220k for ~5–7%' },
  { name: '500 Global', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/500_Global_Logo.svg/512px-500_Global_Logo.svg.png', funding: '$112.5k for 6%' },
  { name: 'Entrepreneur First', logo: 'https://storage.googleapis.com/grounding-server-prod-media/images/a44076a2-2b73-4ffe-818d-591a11e3998a.png', funding: '$250k for ~9%' },
  { name: 'a16z Speedrun', logo: 'https://a16z.com/wp-content/uploads/2024/03/logo-speedrun-black.png', funding: '$175k–$1M for ~7–10%' },
  { name: 'South Park Commons', logo: 'https://southparkcommons.com/wp-content/uploads/2022/09/spc_logo_black.svg', funding: '$400k for 7% + $600k guaranteed follow-on' },
  { name: 'HF0 Residency', logo: 'https://ozero.design/hf0/HF0_logo.svg', funding: '$1M uncapped for 5% or $500k uncapped + 3%' },
  { name: 'NEO', logo: 'https://neo.org/img/logo.svg', funding: '$600k via uncapped SAFE with $10M floor valuation' },
  { name: 'Sequoia Arc', logo: 'https://sequoiacap.com/wp-content/uploads/sites/6/2022/09/Sequoia-Capital-Logo.svg', funding: '$1M' },
  { name: 'PearX', logo: 'https://pear.vc/wp-content/uploads/2022/09/pear-logo.svg', funding: '$250k–$2M' },
  { name: 'Pioneer', logo: 'https://global.pioneer/en/img/logo.svg', funding: '$20k for 1%' },
  { name: 'LAUNCH', logo: 'https://www.launch.co/img/logo-light.svg', funding: '$125k for 6–7%' },
  { name: 'The Mint', logo: 'https://www.themint.com/img/logo.svg', funding: '$500k for 10%' },
  { name: 'AngelPad', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Angelpad-small.png/160px-Angelpad-small.png', funding: '$120k for 7%' },
  { name: 'Betaworks AI Camp', logo: 'https://betaworks.com/img/logo.svg', funding: '$500k' },
  { name: 'Greylock Edge', logo: 'https://greylock.com/img/logo.svg', funding: 'SAFE note + $500k+ in credits' },
  { name: 'Conviction Embed', logo: 'https://conviction.com/img/logo.svg', funding: '$150k uncapped MFN SAFE' },
  { name: 'OpenAI Converge', logo: 'https://openai.com/img/logo.svg', funding: '$1M equity investment' },
  { name: 'Startup Wise Guys', logo: 'https://brandfetch.com/brand/startup-wise-guys/logo-29255a28-3521-4592-a04e-6433378762d8', funding: 'up to €65k for equity' },
  { name: 'APX', logo: 'https://apx.com/img/logo.svg', funding: 'up to €500k, typically €50k for 5%' },
  { name: 'Founders Fellowship', logo: 'https://southparkcommons.com/wp-content/uploads/2022/09/spc_logo_black.svg', funding: '$150k for 5–10%' },
  { name: 'Seedcamp', logo: 'https://saasgarage.com/wp-content/uploads/2020/09/seedcamp-logo.svg', funding: '€100k–€200k for 7–7.5%' },
  { name: 'Antler (Europe)', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Antler_logo.svg/1952px-Antler_logo.svg.png', funding: '€100k for 10% + stipend' },
  { name: 'Google for Startups', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_for_Startups_logo.svg/800px-Google_for_Startups_logo.svg.png', funding: 'up to $100k' },
  { name: 'Accel Atoms', logo: 'https://thisislopez.com/wp-content/uploads/2022/09/accel-atoms-logo-black.svg', funding: 'up to $500k–$1M' },
  { name: 'AI Grant', logo: 'https://aigrant.com/img/logo.svg', funding: '$250k uncapped' },
  { name: 'AI2 Incubator', logo: 'https://images.squarespace-cdn.com/content/v1/6230d45f143b523561523355/e02135f2-6333-48a5-882c-23d168603a3e/AI2_Incubator_Logo_Green.png?format=1500w', funding: '$50k–$150k' },
  { name: 'Afore Capital', logo: 'https://images.crunchbase.com/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1472703359/p96z7ub122tnvj46bdfx.png', funding: '$100k–$500k' },
  { name: 'Berkeley SkyDeck', logo: 'https://skydeck.berkeley.edu/wp-content/uploads/2021/01/berkeley-skydeck-logo.svg', funding: '$200k' },
  { name: 'Soma Capital', logo: 'https://www.somacap.com/soma-logo.svg', funding: '$100k' },
];

const LogoScroller: React.FC = () => {
  return (
    <section className="bg-gray-800 py-12">
      <div className="container mx-auto">
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {logos.map((logo, index) => (
              <div key={index} className="flex-shrink-0 mx-4 text-center">
                <img src={logo.logo} alt={logo.name} className="h-12 mx-auto mb-2" />
                <p className="text-white">{logo.name}</p>
                <p className="text-gray-400">{logo.funding}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoScroller;
