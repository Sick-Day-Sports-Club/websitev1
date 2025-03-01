const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateBlurPlaceholder(inputPath) {
  const buffer = await sharp(inputPath)
    .resize(8, 8, { fit: 'inside' })
    .toBuffer();
  
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

async function convertToWebP(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const outputPath = path.join(outputDir, `${filename}.webp`);
  
  await sharp(inputPath)
    .webp({ quality: 90 })
    .toFile(outputPath);
  
  // Generate responsive sizes
  const sizes = [640, 750, 828, 1080, 1200, 1920];
  for (const width of sizes) {
    const responsiveOutputPath = path.join(outputDir, `${filename}-${width}.webp`);
    await sharp(inputPath)
      .resize(width)
      .webp({ quality: 90 })
      .toFile(responsiveOutputPath);
  }

  const blurDataURL = await generateBlurPlaceholder(inputPath);
  return { filename, blurDataURL };
}

async function optimizeImages() {
  const inputDir = path.join(process.cwd(), 'public', 'images');
  const outputDir = path.join(process.cwd(), 'public', 'images', 'optimized');
  
  try {
    // Create output directory if it doesn't exist
    await fs.mkdir(outputDir, { recursive: true });
    
    // Get all jpg files in the input directory
    const files = await fs.readdir(inputDir);
    const imageFiles = files.filter(file => /\.(jpg|jpeg)$/i.test(file));
    
    const imageData = [];
    
    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const { filename, blurDataURL } = await convertToWebP(inputPath, outputDir);
      imageData.push({ filename, blurDataURL });
    }
    
    // Generate TypeScript interface file
    const interfaceContent = `export interface HeroImage {
  src: string;
  blurDataURL: string;
}

export const heroImages: HeroImage[] = ${JSON.stringify(imageData, null, 2)
  .replace(/"filename":/g, 'src: "/images/optimized/')
  .replace(/\.jpg"/g, '.webp"')};
`;
    
    await fs.writeFile(
      path.join(process.cwd(), 'types', 'images.ts'),
      interfaceContent
    );
    
    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages(); 