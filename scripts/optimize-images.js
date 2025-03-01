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

// Optimized for modern displays
const SIZES = {
  sm: 640,    // Mobile
  md: 1024,   // Tablet/Small laptop
  lg: 1920,   // Full HD
  xl: 2560,   // 2K/QHD
  '2xl': 3840 // 4K/UHD
};

const QUALITY = 95; // Maximum quality for sharp images

async function generateBlurPlaceholder(inputPath) {
  const buffer = await sharp(inputPath)
    .resize(10, 10, { fit: 'cover' })
    .toBuffer();
  
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

async function optimizeImage(filename) {
  const inputPath = path.join(process.cwd(), 'public', 'images', filename);
  const outputDir = path.join(process.cwd(), 'public', 'images', 'optimized');
  
  // Create output directory if it doesn't exist
  await fs.mkdir(outputDir, { recursive: true });
  
  // Get original image metadata
  const metadata = await sharp(inputPath).metadata();
  
  // Generate blur placeholder
  const blurDataURL = await generateBlurPlaceholder(inputPath);
  
  // Generate responsive sizes
  const responsiveImages = await Promise.all(
    Object.entries(SIZES).map(async ([size, width]) => {
      // Don't upscale images beyond their original size
      const targetWidth = Math.min(width, metadata.width || width);
      
      const outputPath = path.join(outputDir, `${path.parse(filename).name}-${size}.webp`);
      await sharp(inputPath)
        .resize(targetWidth, null, { 
          fit: 'cover',
          withoutEnlargement: true
        })
        .webp({ 
          quality: QUALITY,
          effort: 6 // Maximum compression effort
        })
        .toFile(outputPath);
      
      return {
        size,
        width: targetWidth,
        path: `/images/optimized/${path.parse(filename).name}-${size}.webp`
      };
    })
  );
  
  return {
    original: `/images/${filename}`,
    originalWidth: metadata.width,
    originalHeight: metadata.height,
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