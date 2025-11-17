import { NextRequest, NextResponse } from 'next/server';
import { lookupVehicleByVRM, extractVehicleYear, UKVDVehicleResponse } from '@/lib/ukvehicledata';

export const runtime = 'edge';

/**
 * POST /api/vehicle-lookup
 * 
 * Lookup vehicle details by UK registration plate
 * Body: { registration: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registration } = body;

    if (!registration || typeof registration !== 'string') {
      return NextResponse.json(
        { error: 'Registration plate is required' },
        { status: 400 }
      );
    }

    // Get API credentials from environment
    const apiKey = process.env.UK_VEHICLE_DATA_API_KEY;
    const packageName = process.env.UK_VEHICLE_DATA_PACKAGE_NAME || 'VehicleDetails';

    if (!apiKey) {
      console.error('UK_VEHICLE_DATA_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Vehicle lookup service is not configured' },
        { status: 500 }
      );
    }

    // Call UK Vehicle Data API
    const data: UKVDVehicleResponse = await lookupVehicleByVRM(
      registration,
      apiKey,
      packageName
    );

    // Extract the relevant vehicle information
    const vehicleDetails = data.Results?.VehicleDetails?.VehicleIdentification;
    const modelDetails = data.Results?.ModelDetails?.ModelIdentification;

    if (!vehicleDetails && !modelDetails) {
      return NextResponse.json(
        { error: 'No vehicle data found for this registration' },
        { status: 404 }
      );
    }

    // Construct the response in the format our app expects
    const vehicleData = {
      registration: registration.toUpperCase().replace(/\s+/g, ''),
      make: modelDetails?.Make || vehicleDetails?.DvlaMake || 'Unknown',
      model: modelDetails?.Model || vehicleDetails?.DvlaModel || 'Unknown',
      year: extractVehicleYear(data),
      variant: modelDetails?.ModelVariant || undefined,
      // Additional data that might be useful
      bodyStyle: data.Results?.ModelDetails?.BodyDetails?.BodyStyle,
      fuelType: vehicleDetails?.DvlaFuelType,
      vin: vehicleDetails?.Vin,
    };

    return NextResponse.json({
      success: true,
      vehicle: vehicleData,
    });

  } catch (error) {
    console.error('Vehicle lookup error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('No vehicle data found')) {
        return NextResponse.json(
          { error: 'Vehicle not found' },
          { status: 404 }
        );
      }

      if (error.message.includes('API error')) {
        return NextResponse.json(
          { error: 'Vehicle lookup service temporarily unavailable' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to lookup vehicle' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/vehicle-lookup
 * 
 * Health check endpoint
 */
export async function GET() {
  const isConfigured = !!process.env.UK_VEHICLE_DATA_API_KEY;

  return NextResponse.json({
    service: 'UK Vehicle Data Lookup',
    status: isConfigured ? 'configured' : 'not configured',
  });
}

