const sharp = require('sharp');
const fs = require('fs');

async function generateAppleIcon() {
  try {
    const svgBuffer = fs.readFileSync('./public/logo.svg');
    
    // Generate apple-touch-icon (180x180 for iOS)
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile('./app/apple-icon.png');
    
    console.log('✅ Apple touch icon generated (180x180)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

generateAppleIcon();


