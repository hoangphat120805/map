# API Documentation - Location Creation Service

## Overview

This document describes the location creation service that allows users to add new flower locations through the map interface.

## Features Implemented

### 1. API Endpoint

-   **URL**: `POST /api/locations`
-   **Description**: Creates a new flower location
-   **Location**: `src/app/api/locations/route.ts`

### 2. Service Function

-   **Function**: `createLocation(locationData)`
-   **Location**: `src/services/species-api.ts`
-   **Returns**: `Promise<{ success: boolean, data: Location | null, message: string }>`

### 3. Frontend Integration

-   **Form Component**: `AddLocationForm` (`src/components/add-location-form.tsx`)
-   **Map Integration**: Double-click at zoom level 18 to add locations
-   **Parent Handler**: `handleSaveNewLocation` in `src/app/page.tsx`

## Usage

### Adding a New Location via Map

1. Zoom to level 18 on the map
2. Double-click on the desired location
3. Fill out the form with:
    - Species selection
    - Location name
    - Bloom start date
    - Bloom peak date
    - Bloom end date
4. Click "Lưu địa điểm" to save

### API Request Format

```typescript
// POST /api/locations
{
    "speciesId": number,
    "locationName": string,
    "coordinates": [longitude, latitude],
    "bloomingPeriod": {
        "start": "YYYY-MM-DD",
        "peak": "YYYY-MM-DD",
        "end": "YYYY-MM-DD"
    }
}
```

### API Response Format

```typescript
{
    "success": boolean,
    "data": Location | null,
    "message": string
}
```

## Development vs Production

### Current State (Development)

-   Uses mock implementation in `mockCreateLocation()`
-   Stores data in memory (resets on server restart)
-   Simulates API delay for realistic testing

### Production Setup

To switch to production API:

1. **Uncomment production code** in `createLocation()` function:

```typescript
// In src/services/species-api.ts
export async function createLocation(locationData: Omit<Location, "id">) {
    try {
        // Comment out: return await mockCreateLocation(locationData)

        // Uncomment this section:
        const response = await fetch(
            `${API_BASE_URL}${API_ENDPOINTS.locations}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(locationData)
            }
        )

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        return result
    } catch (error) {
        // ... error handling
    }
}
```

2. **Set environment variables**:

```bash
NEXT_PUBLIC_API_URL=https://your-production-api.com
NEXT_PUBLIC_USE_MOCK_DATA=false
```

3. **Setup backend database** with Location table structure matching the TypeScript interface

## Validation Rules

### Frontend Validation

-   Species selection is required
-   Location name is required and trimmed
-   All bloom dates are required
-   Bloom peak must be after start date
-   Bloom end must be after peak date

### Backend Validation

-   Coordinates must be array of 2 numbers [lng, lat]
-   Species ID must be valid integer
-   Date format validation (YYYY-MM-DD)
-   Date sequence validation (start < peak < end)

## Error Handling

### Client-side Errors

-   Form validation errors shown inline
-   Network errors shown via alert (can be replaced with toast notifications)
-   Loading states during API calls

### Server-side Errors

-   400: Bad Request (validation failures)
-   404: Not Found (invalid species ID)
-   500: Internal Server Error

## File Structure

```
src/
├── app/
│   └── api/
│       └── locations/
│           └── route.ts          # API endpoint
├── components/
│   ├── add-location-form.tsx     # Form component
│   └── ol-map.tsx               # Map with double-click handler
├── services/
│   └── species-api.ts           # Service functions
├── types/
│   └── api.ts                   # TypeScript interfaces
└── config/
    └── api.ts                   # API configuration
```

## Testing

### Manual Testing

1. Open the application
2. Navigate to zoom level 18
3. Double-click on the map
4. Fill out and submit the form
5. Verify the new location appears on the map

### Validation Testing

-   Try submitting empty form
-   Try invalid date sequences
-   Try with different species
-   Test coordinate precision

## Future Enhancements

### Planned Features

-   Image upload for locations
-   Location editing/updating
-   Location deletion (admin only)
-   Batch location import
-   Location verification system
-   User authentication for location creation

### Database Considerations

-   Add user_id field for tracking who created locations
-   Add created_at/updated_at timestamps
-   Add status field (pending/approved/rejected)
-   Add image storage paths
-   Consider indexing on coordinates for spatial queries

## Security Notes

-   Currently no authentication required (development)
-   In production, implement user authentication
-   Validate coordinates are within expected geographic bounds
-   Sanitize location names and descriptions
-   Rate limiting for creation requests
-   CSRF protection for form submissions
