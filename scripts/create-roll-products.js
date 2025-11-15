/**
 * Script to create PPF Roll products in Shopify
 * Run with: node scripts/create-roll-products.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const API_VERSION = '2025-01';

if (!ADMIN_API_TOKEN || !STORE_DOMAIN) {
  console.error('❌ Missing environment variables. Make sure SHOPIFY_ADMIN_ACCESS_TOKEN and NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN are set.');
  process.exit(1);
}

const ROLL_PRODUCTS = [
  {
    title: 'Gloss PPF Roll',
    description: 'Premium gloss PPF film roll for professional installation. Crystal-clear optical quality with self-healing technology. Manufactured in the UK for exceptional clarity and long-lasting protection.',
    productType: 'PPF Roll',
    vendor: 'StealthShield',
    tags: 'ppf-roll, gloss, professional',
    variants: [
      { size: '12" x 60"', price: 149, sku: 'PPF-GLOSS-12X60' },
      { size: '24" x 60"', price: 279, sku: 'PPF-GLOSS-24X60' },
      { size: '36" x 60"', price: 399, sku: 'PPF-GLOSS-36X60' },
      { size: '48" x 60"', price: 519, sku: 'PPF-GLOSS-48X60' },
      { size: '60" x 60"', price: 629, sku: 'PPF-GLOSS-60X60' },
    ]
  },
  {
    title: 'Matte PPF Roll',
    description: 'Premium matte PPF film roll for professional installation. Satin finish for a unique look with the same protection as gloss. Manufactured in the UK with self-healing technology.',
    productType: 'PPF Roll',
    vendor: 'StealthShield',
    tags: 'ppf-roll, matte, professional',
    variants: [
      { size: '12" x 60"', price: 169, sku: 'PPF-MATTE-12X60' },
      { size: '24" x 60"', price: 299, sku: 'PPF-MATTE-24X60' },
      { size: '36" x 60"', price: 429, sku: 'PPF-MATTE-36X60' },
      { size: '48" x 60"', price: 559, sku: 'PPF-MATTE-48X60' },
      { size: '60" x 60"', price: 679, sku: 'PPF-MATTE-60X60' },
    ]
  },
  {
    title: 'Gloss PPF Roll - Extended Length',
    description: 'Premium gloss PPF film roll in extended lengths for larger projects. Crystal-clear optical quality with self-healing technology.',
    productType: 'PPF Roll',
    vendor: 'StealthShield',
    tags: 'ppf-roll, gloss, professional, extended',
    variants: [
      { size: '24" x 120"', price: 549, sku: 'PPF-GLOSS-24X120' },
      { size: '48" x 120"', price: 1029, sku: 'PPF-GLOSS-48X120' },
      { size: '60" x 120"', price: 1249, sku: 'PPF-GLOSS-60X120' },
    ]
  },
  {
    title: 'Matte PPF Roll - Extended Length',
    description: 'Premium matte PPF film roll in extended lengths for larger projects. Satin finish with self-healing technology.',
    productType: 'PPF Roll',
    vendor: 'StealthShield',
    tags: 'ppf-roll, matte, professional, extended',
    variants: [
      { size: '24" x 120"', price: 589, sku: 'PPF-MATTE-24X120' },
      { size: '48" x 120"', price: 1109, sku: 'PPF-MATTE-48X120' },
      { size: '60" x 120"', price: 1349, sku: 'PPF-MATTE-60X120' },
    ]
  }
];

async function createProduct(productData) {
  const url = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/products.json`;
  
  // Build variants array
  const variants = productData.variants.map(v => ({
    option1: v.size,
    price: v.price.toString(),
    sku: v.sku,
    inventory_management: null, // Don't track inventory for made-to-order
    inventory_policy: 'continue' // Continue selling when out of stock
  }));

  const payload = {
    product: {
      title: productData.title,
      body_html: `<p>${productData.description}</p>`,
      vendor: productData.vendor,
      product_type: productData.productType,
      tags: productData.tags,
      options: [
        {
          name: 'Size',
          values: productData.variants.map(v => v.size)
        }
      ],
      variants: variants
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_API_TOKEN
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error, null, 2));
    }

    const result = await response.json();
    console.log(`✅ Created: ${productData.title} (${productData.variants.length} variants)`);
    return result.product;
  } catch (error) {
    console.error(`❌ Failed to create ${productData.title}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log('\n🚀 Starting PPF Roll Product Creation\n');
  console.log(`Store: ${STORE_DOMAIN}`);
  console.log(`Creating ${ROLL_PRODUCTS.length} products...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const product of ROLL_PRODUCTS) {
    try {
      await createProduct(product);
      successCount++;
      // Rate limit: wait 500ms between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      failCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Successfully created: ${successCount} products`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount} products`);
  }
  console.log('\n✨ Done! Check your Shopify admin to verify.\n');
}

// Run the script
main().catch(error => {
  console.error('\n❌ Script failed:', error);
  process.exit(1);
});

