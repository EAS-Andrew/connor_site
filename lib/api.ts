/**
 * Stubbed Vehicle Smart API Integration
 * 
 * TODO: Replace with actual Vehicle Smart API when ready
 * API Documentation: https://vehiclesmart.com/api/docs
 * Required: API Key and authentication setup
 */

export interface VehicleData {
  registration: string;
  make: string;
  model: string;
  year: number;
  variant?: string;
}

/**
 * Mock vehicle lookup - simulates Vehicle Smart API response
 * In production, this will call the actual API endpoint
 */
export async function lookupVehicleByRegistration(registration: string): Promise<VehicleData | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data for demonstration
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
  
  // Return mock data if found, otherwise return generic data for demo purposes
  if (mockVehicles[normalizedReg]) {
    return mockVehicles[normalizedReg];
  }
  
  // For any other registration, return a generic vehicle for demo
  return {
    registration: normalizedReg,
    make: 'Generic',
    model: 'Vehicle',
    year: 2022
  };
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
    description: 'Clear, glossy protection with high durability',
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
}

export const coverageOptions: CoverageOption[] = [
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
    ]
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
    ]
  },
  {
    id: 'premium-full',
    name: 'Premium Full Car Cover',
    description: 'Complete protection for your entire vehicle',
    price: 1599,
    includes: [
      'All Panels Covered',
      '(Excluding Glass)'
    ]
  }
];

