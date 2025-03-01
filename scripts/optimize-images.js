const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const HERO_IMAGES = [
  'hero-background.jpg',
  'hero-background2.jpg',
  'hero-background3.jpg',
  'hero-background4.jpg',
  'hero-background5.jpg',
  'hero-background6.jpg',
  'hero-background7.jpg'
];

const SIZES = [640, 750, 828, 1080, 1200, 1920, 2048];
const QUALITY = 80;

async function generateBlurPlaceholder(inputPath) {
  const buffer = await sharp(inputPath)
    .resize(10, 10, { fit: 'inside' })
    .toBuffer();
  
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

async function optimizeImage(filename) {
  const inputPath = path.join(process.cwd(), 'public', 'images', filename);
  const outputDir = path.join(process.cwd(), 'public', 'images', 'optimized');
  
  // Create output directory if it doesn't exist
  await fs.mkdir(outputDir, { recursive: true });
  
  // Generate blur placeholder
  const blurDataURL = await generateBlurPlaceholder(inputPath);
  
  // Generate responsive sizes
  const responsiveImages = await Promise.all(
    SIZES.map(async (width) => {
      const outputPath = path.join(outputDir, `${path.parse(filename).name}-${width}.webp`);
      await sharp(inputPath)
        .resize(width, null, { fit: 'contain' })
        .webp({ quality: QUALITY })
        .toFile(outputPath);
      
      return {
        width,
        path: `/images/optimized/${path.parse(filename).name}-${width}.webp`
      };
    })
  );
  
  return {
    original: `/images/${filename}`,
    blurDataURL,
    responsive: responsiveImages
  };
}

async function main() {
  try {
    const results = await Promise.all(HERO_IMAGES.map(optimizeImage));
    
    // Write the results to a JSON file
    await fs.writeFile(
      path.join(process.cwd(), 'public', 'images', 'hero-images.json'),
      JSON.stringify(results, null, 2)
    );
    
    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

main(); 