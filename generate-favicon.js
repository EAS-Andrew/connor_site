const sharp = require('sharp');
const fs = require('fs');

async function generateFavicon() {
  try {
    // Read the SVG logo
    const svgBuffer = fs.readFileSync('./public/logo.svg');
    
    // Generate favicon.ico (32x32 is standard for ico)
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile('./app/favicon-32.png');
    
    console.log('✅ Favicon generated successfully!');
    console.log('Note: Rename favicon-32.png to favicon.ico manually, or use an ICO converter tool.');
    console.log('For best results, you may want to use an online ICO converter for multi-size support.');
    
    // Also generate common favicon sizes
    await sharp(svgBuffer).resize(16, 16).png().toFile('./app/favicon-16.png');
    await sharp(svgBuffer).resize(32, 32).png().toFile('./app/favicon-32.png');
    await sharp(svgBuffer).resize(48, 48).png().toFile('./app/favicon-48.png');
    
    console.log('✅ Generated PNG favicons: 16x16, 32x32, 48x48');
    
  } catch (error) {
    console.error('❌ Error generating favicon:', error.message);
  }
}

generateFavicon();


