/**
 * UK Vehicle Data API Client
 * 
 * Official API for vehicle lookups by registration plate
 * Documentation: https://cp.ukvehicledata.co.uk/
 */

export interface UKVDVehicleResponse {
  RequestInformation?: {
    PackageName?: string;
    SearchTerm?: string;
    SearchType?: string;
    RequestIp?: string;
  };
  ResponseInformation?: {
    StatusCode: number;
    StatusMessage?: string;
    IsSuccessStatusCode: boolean;
    QueryTimeMs: number;
    ResponseId: string;
  };
  Results?: {
    VehicleDetails?: {
      VehicleIdentification?: {
        Vrm?: string;
        Vin?: string;
        DvlaMake?: string;
        DvlaModel?: string;
        DateFirstRegisteredInUk?: string;
        DateFirstRegistered?: string;
        YearOfManufacture?: number;
        DvlaBodyType?: string;
        DvlaFuelType?: string;
      };
      DvlaTechnicalDetails?: {
        NumberOfSeats?: number;
        EngineCapacityCc?: number;
      };
    };
    ModelDetails?: {
      ModelIdentification?: {
        Make?: string;
        Range?: string;
        Model?: string;
        ModelVariant?: string;
        Series?: string;
      };
      BodyDetails?: {
        BodyStyle?: string;
        NumberOfDoors?: number;
        NumberOfSeats?: number;
      };
      Dimensions?: {
        HeightMm?: number;
        LengthMm?: number;
        WidthMm?: number;
        WheelbaseLengthMm?: number;
      };
    };
  };
}

/**
 * Lookup vehicle by UK registration plate
 */
export async function lookupVehicleByVRM(
  vrm: string,
  apiKey: string,
  packageName: string = 'VehicleDetails'
): Promise<UKVDVehicleResponse> {
  // Clean up registration (remove spaces)
  const cleanVrm = vrm.toUpperCase().replace(/\s+/g, '');

  const url = new URL('https://uk.api.vehicledataglobal.com/r2/lookup');
  url.searchParams.append('ApiKey', apiKey);
  url.searchParams.append('PackageName', packageName);
  url.searchParams.append('Vrm', cleanVrm);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`UK Vehicle Data API error: ${response.status} ${response.statusText}`);
  }

  const data: UKVDVehicleResponse = await response.json();

  // Check if the API returned a successful status
  if (!data.ResponseInformation?.IsSuccessStatusCode) {
    const statusCode = data.ResponseInformation?.StatusCode;
    const statusMessage = data.ResponseInformation?.StatusMessage || 'Unknown error';
    
    // Handle sandbox validation failures with helpful message
    if (statusCode === 6 || statusMessage.includes('SandboxValidationFailure')) {
      throw new Error(
        'Sandbox API key detected. Please use test registrations (e.g., AB12CDE) or upgrade to a production API key for real lookups.'
      );
    }
    
    // Handle other common errors
    if (statusCode === 2 || statusMessage.includes('NoResultsFound')) {
      throw new Error('Vehicle not found');
    }
    
    throw new Error(`Vehicle lookup failed: ${statusMessage}`);
  }

  return data;
}

/**
 * Extract vehicle year from the API response
 */
export function extractVehicleYear(data: UKVDVehicleResponse): number {
  // Try YearOfManufacture first
  const yearOfManufacture = data.Results?.VehicleDetails?.VehicleIdentification?.YearOfManufacture;
  if (yearOfManufacture) {
    return yearOfManufacture;
  }

  // Try parsing DateFirstRegistered
  const dateRegistered = 
    data.Results?.VehicleDetails?.VehicleIdentification?.DateFirstRegistered ||
    data.Results?.VehicleDetails?.VehicleIdentification?.DateFirstRegisteredInUk;

  if (dateRegistered) {
    const year = new Date(dateRegistered).getFullYear();
    if (!isNaN(year)) {
      return year;
    }
  }

  // Default to current year if we can't determine
  return new Date().getFullYear();
}

