# UK Vehicle Data API Integration

This document explains how vehicle lookup is integrated into the StealthShield pre-cut flow.

## Overview

We use the **UK Vehicle Data Limited API** to provide real-time vehicle information based on UK registration plates. This allows customers to enter their registration and automatically receive accurate vehicle details for their PPF kit configuration.

## How It Works

### 1. Customer Journey

1. Customer visits `/pre-cut` page
2. Enters their UK registration plate (e.g., "AB12 CDE")
3. System calls our API route `/api/vehicle-lookup`
4. API route securely calls UK Vehicle Data API
5. Vehicle details are returned and displayed for confirmation
6. Customer proceeds to configure their PPF kit

### 2. Technical Flow

```
Pre-Cut Page (Client)
  ↓
  /api/vehicle-lookup (Next.js API Route)
  ↓
  lib/ukvehicledata.ts (API Client)
  ↓
  UK Vehicle Data API (https://uk.api.vehicledataglobal.com)
```

## Files

### Environment Variables (`.env.local`)

```bash
UK_VEHICLE_DATA_API_KEY=ecbc5f64-502b-407b-b138-892cecff1b95
UK_VEHICLE_DATA_PACKAGE_NAME=VehicleDetails
```

### API Client (`lib/ukvehicledata.ts`)

Low-level TypeScript client for communicating with UK Vehicle Data API. Handles:
- API request formatting
- Response parsing
- Type definitions
- Year extraction logic

### API Route (`app/api/vehicle-lookup/route.ts`)

Server-side Next.js API route that:
- Keeps API key secure (never exposed to client)
- Validates incoming requests
- Calls the UK Vehicle Data API
- Transforms responses to our app's format
- Handles errors gracefully

### Frontend Integration (`lib/api.ts`)

The `lookupVehicleByRegistration()` function:
- Called by the pre-cut page
- Fetches from our `/api/vehicle-lookup` route
- Returns standardized `VehicleData` object
- Falls back to mock data if API is unavailable

## Data Returned

The API provides comprehensive vehicle information including:

- **Basic Details**: Make, Model, Year, Variant
- **Registration**: VRM (Vehicle Registration Mark)
- **Technical Details**: Body style, fuel type, VIN
- **Dimensions**: Height, width, length (useful for PPF calculations)
- **Additional Info**: Number of doors, seats, engine capacity

## Error Handling

The integration includes multiple layers of error handling:

1. **API Route Level**: Returns appropriate HTTP status codes
   - `400`: Invalid request (missing registration)
   - `404`: Vehicle not found
   - `500`: API configuration error
   - `503`: API temporarily unavailable

2. **Frontend Level**: Graceful fallback
   - Shows user-friendly error messages
   - Falls back to mock data in development
   - Logs errors for debugging

## Testing

### Test with Real Registrations

Simply enter any valid UK registration plate in the pre-cut flow.

### Test Error Handling

Test with invalid/non-existent plates to see error handling in action.

### Mock Data Fallback

If the API is unavailable, these test registrations will work:
- `AB12CDE` - BMW 3 Series 2022
- `XY34FGH` - Audi A4 2021
- `CD56IJK` - Mercedes-Benz C-Class 2023

## API Documentation

Full API documentation available at:
- **Control Panel**: https://cp.ukvehicledata.co.uk/
- **OpenAPI Spec**: See `VEHICLE_API_SPEC.json` (if needed)

## Rate Limits & Costs

Check your UK Vehicle Data account for:
- Rate limits
- Request quotas
- Per-lookup costs
- Account balance

## Caching Implementation

✅ **Caching is implemented and configured!** Vehicle lookups are cached using Redis for 30 days.

### Benefits:
- **70-90% cost reduction** on repeat lookups
- **Instant responses** from cache (1-5ms vs 500-1000ms API calls)
- **Automatic expiry** after 30 days
- **Graceful fallback** if cache unavailable

### Already Configured:
Your Redis instance is already set up:
- Provider: Redis Labs (EU West 2 - London)
- Free tier: 30 MB storage (~3,000 vehicles)
- Connection configured in `.env.local`

See **[CACHING_SETUP.md](./CACHING_SETUP.md)** for monitoring and management.

### How It Works:
- **First lookup**: Calls API (costs money) → stores in Redis
- **Subsequent lookups**: Served from cache (FREE!)
- Cache key: `vehicle:AB12CDE`
- TTL: 30 days (auto-expires)

## Future Enhancements

Potential improvements:
- Add vehicle images from the API
- Use dimension data for automatic coverage recommendations
- Store historical lookups for analytics
- Add VIN lookup support
- Cache analytics dashboard

## Support

For API issues:
- **UK Vehicle Data Support**: help@ukvehicledata.co.uk
- **Documentation**: https://www.ukvehicledata.co.uk/

## Security Notes

⚠️ **Important**:
- API key is stored server-side only (`.env.local`)
- Never expose the API key in client-side code
- API route runs on the server/edge, keeping credentials secure
- `.env.local` should never be committed to git

