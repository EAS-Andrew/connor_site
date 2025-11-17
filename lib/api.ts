import { fetchPreCutKits, ShopifyProduct } from './shopify';

/**
 * UK Vehicle Data API Integration
 * 
 * Live vehicle lookup using UK Vehicle Data API
 * API Documentation: https://cp.ukvehicledata.co.uk/
 */

export interface VehicleData {
  registration: string;
  make: string;
  model: string;
  year: number;
  variant?: string;
  bodyStyle?: string;
  fuelType?: string;
  vin?: string;
}

/**
 * Lookup vehicle by UK registration plate
 * Calls our API route which securely communicates with UK Vehicle Data API
 */
export async function lookupVehicleByRegistration(registration: string): Promise<VehicleData | null> {
  try {
    const response = await fetch('/api/vehicle-lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ registration }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Vehicle lookup failed:', errorData.error);

      // Return null for 404 (vehicle not found)
      if (response.status === 404) {
        return null;
      }

      // For other errors, throw to trigger error handling
      throw new Error(errorData.error || 'Vehicle lookup failed');
    }

    const data = await response.json();
    return data.vehicle as VehicleData;

  } catch (error) {
    console.error('Error looking up vehicle:', error);

    // If the API is unavailable, fall back to mock data for demo purposes
    console.warn('Falling back to mock data due to API error');

    const mockVehicles: Record<string, VehicleData> = {
      'AB12CDE': {
        registration: 'AB12CDE',
        make: 'BMW',
        model: '3 Series',
        year: 2022,
        variant: '320i M Sport'
      },
      'XY34FGH': {
        registration: 'XY34FGH',
        make: 'Audi',
        model: 'A4',
        year: 2021,
        variant: 'S Line'
      },
      'CD56IJK': {
        registration: 'CD56IJK',
        make: 'Mercedes-Benz',
        model: 'C-Class',
        year: 2023,
        variant: 'AMG Line'
      }
    };

    const normalizedReg = registration.toUpperCase().replace(/\s+/g, '');
    return mockVehicles[normalizedReg] || null;
  }
}

/**
 * Material options for PPF
 */
export interface MaterialOption {
  id: string;
  name: string;
  description: string;
  finish: string;
}

export const materialOptions: MaterialOption[] = [
  {
    id: 'gloss',
    name: 'Gloss PPF',
    description: 'Clear, glossy protection with exceptional clarity and durability',
    finish: 'Glossy'
  },
  {
    id: 'matte',
    name: 'Matte PPF',
    description: 'Provides a satin/matte finish for a unique look while protecting',
    finish: 'Satin/Matte'
  }
];

/**
 * Coverage options available for pre-cut kits
 */
export interface CoverageOption {
  id: string;
  name: string;
  description: string;
  price: number;
  includes: string[];
  image?: string;
  variants: Array<{
    id: string;
    title: string;
    price: number;
  }>;
}

/**
 * Transform Shopify product data to CoverageOption format
 */
function transformShopifyProductToCoverageOption(product: ShopifyProduct): CoverageOption {
  // Parse the coverage_includes metafield
  const coverageMetafield = product.metafields.find(
    (m) => m.key === 'coverage_includes'
  );

  let includes: string[] = [];
  if (coverageMetafield && coverageMetafield.value) {
    try {
      // Shopify list metafields are returned as JSON array strings
      includes = JSON.parse(coverageMetafield.value);
    } catch {
      // Fallback if parsing fails
      includes = [coverageMetafield.value];
    }
  }

  // Get price from the first variant or priceRange
  const price = parseFloat(product.priceRange.minVariantPrice.amount);

  // Generate simple ID from title
  const id = product.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  // Get featured image URL
  const image = product.featuredImage?.url;

  return {
    id,
    name: product.title,
    description: product.description,
    price: Math.round(price), // Round to whole number
    includes,
    image,
    variants: product.variants.edges.map((edge) => ({
      id: edge.node.id,
      title: edge.node.title,
      price: Math.round(parseFloat(edge.node.price.amount)),
    })),
  };
}

/**
 * Fetch coverage options from Shopify
 * Falls back to mock data if Shopify fetch fails
 */
export async function getCoverageOptions(): Promise<CoverageOption[]> {
  try {
    const products = await fetchPreCutKits();
    return products.map(transformShopifyProductToCoverageOption);
  } catch (error) {
    console.error('Failed to fetch products from Shopify, using fallback data:', error);

    // Fallback to mock data for development
    return [
      {
        id: 'front-end',
        name: 'Front End PPF',
        description: 'Coverage for specific high-impact areas',
        price: 599,
        includes: [
          'Front Bumper',
          'Bonnet',
          'Headlights',
          'Mirror Caps',
          'Front Wings',
          'Front A Pillar & Edge Of Roof'
        ],
        variants: []
      },
      {
        id: 'extended-front',
        name: 'Extended Front End PPF',
        description: 'Comprehensive front and side protection',
        price: 899,
        includes: [
          'Everything in Front End PPF',
          'Front Doors',
          'Skirts'
        ],
        variants: []
      },
      {
        id: 'premium-full',
        name: 'Premium Full Car Cover',
        description: 'Complete protection for your entire vehicle',
        price: 1599,
        includes: [
          'All Panels Covered',
          '(Excluding Glass)'
        ],
        variants: []
      }
    ];
  }
}

