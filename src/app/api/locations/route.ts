import { NextRequest, NextResponse } from "next/server"
import { Location } from "@/types/api"

// In-memory storage for development (replace with database in production)
let locations: Location[] = [
    {
        id: 1,
        speciesId: 1,
        locationName: "Vườn hoa Nguyễn Huệ",
        coordinates: [106.7008, 10.7769],
        bloomingPeriod: {
            start: "2024-02-01",
            peak: "2024-02-15",
            end: "2024-03-15"
        }
    },
    {
        id: 2,
        speciesId: 2,
        locationName: "Công viên Tao Đàn",
        coordinates: [106.6947, 10.7881],
        bloomingPeriod: {
            start: "2024-01-15",
            peak: "2024-02-01",
            end: "2024-02-28"
        }
    },
    {
        id: 3,
        speciesId: 1,
        locationName: "Vườn hoa Lý Tự Trọng",
        coordinates: [106.692, 10.7756],
        bloomingPeriod: {
            start: "2024-02-10",
            peak: "2024-02-25",
            end: "2024-03-20"
        }
    }
]

// GET - Fetch all locations or filter by species
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const speciesId = searchParams.get("speciesId")

        let filteredLocations = locations

        if (speciesId) {
            filteredLocations = locations.filter(
                (location) => location.speciesId === parseInt(speciesId)
            )
        }

        return NextResponse.json({
            success: true,
            data: filteredLocations,
            message: "Locations retrieved successfully"
        })
    } catch (error) {
        console.error("Error fetching locations:", error)
        return NextResponse.json(
            {
                success: false,
                data: [],
                message: "Failed to fetch locations"
            },
            { status: 500 }
        )
    }
}

// POST - Create a new location
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate required fields
        if (
            !body.speciesId ||
            !body.locationName ||
            !body.coordinates ||
            !body.bloomingPeriod
        ) {
            return NextResponse.json(
                {
                    success: false,
                    data: null,
                    message:
                        "Missing required fields: speciesId, locationName, coordinates, bloomingPeriod"
                },
                { status: 400 }
            )
        }

        // Validate coordinates format
        if (!Array.isArray(body.coordinates) || body.coordinates.length !== 2) {
            return NextResponse.json(
                {
                    success: false,
                    data: null,
                    message:
                        "Coordinates must be an array of [longitude, latitude]"
                },
                { status: 400 }
            )
        }

        // Validate blooming period
        const { bloomingPeriod } = body
        if (
            !bloomingPeriod.start ||
            !bloomingPeriod.peak ||
            !bloomingPeriod.end
        ) {
            return NextResponse.json(
                {
                    success: false,
                    data: null,
                    message:
                        "Blooming period must include start, peak, and end dates"
                },
                { status: 400 }
            )
        }

        // Validate date order
        const startDate = new Date(bloomingPeriod.start)
        const peakDate = new Date(bloomingPeriod.peak)
        const endDate = new Date(bloomingPeriod.end)

        if (peakDate < startDate || endDate < peakDate) {
            return NextResponse.json(
                {
                    success: false,
                    data: null,
                    message:
                        "Invalid date order: start date must be before peak date, and peak date must be before end date"
                },
                { status: 400 }
            )
        }

        // Generate new ID
        const newId = Math.max(...locations.map((l) => l.id), 0) + 1

        // Create new location
        const newLocation: Location = {
            id: newId,
            speciesId: parseInt(body.speciesId),
            locationName: body.locationName.trim(),
            coordinates: [
                parseFloat(body.coordinates[0]),
                parseFloat(body.coordinates[1])
            ],
            bloomingPeriod: {
                start: bloomingPeriod.start,
                peak: bloomingPeriod.peak,
                end: bloomingPeriod.end
            }
        }

        // Add to storage
        locations.push(newLocation)

        return NextResponse.json(
            {
                success: true,
                data: newLocation,
                message: "Location created successfully"
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error creating location:", error)
        return NextResponse.json(
            {
                success: false,
                data: null,
                message: "Failed to create location"
            },
            { status: 500 }
        )
    }
}

// PUT - Update an existing location
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, ...updateData } = body

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    data: null,
                    message: "Location ID is required"
                },
                { status: 400 }
            )
        }

        const locationIndex = locations.findIndex((l) => l.id === parseInt(id))
        if (locationIndex === -1) {
            return NextResponse.json(
                {
                    success: false,
                    data: null,
                    message: "Location not found"
                },
                { status: 404 }
            )
        }

        // Update location
        locations[locationIndex] = {
            ...locations[locationIndex],
            ...updateData
        }

        return NextResponse.json({
            success: true,
            data: locations[locationIndex],
            message: "Location updated successfully"
        })
    } catch (error) {
        console.error("Error updating location:", error)
        return NextResponse.json(
            {
                success: false,
                data: null,
                message: "Failed to update location"
            },
            { status: 500 }
        )
    }
}

// DELETE - Delete a location
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    data: null,
                    message: "Location ID is required"
                },
                { status: 400 }
            )
        }

        const locationIndex = locations.findIndex((l) => l.id === parseInt(id))
        if (locationIndex === -1) {
            return NextResponse.json(
                {
                    success: false,
                    data: null,
                    message: "Location not found"
                },
                { status: 404 }
            )
        }

        // Remove location
        const deletedLocation = locations.splice(locationIndex, 1)[0]

        return NextResponse.json({
            success: true,
            data: deletedLocation,
            message: "Location deleted successfully"
        })
    } catch (error) {
        console.error("Error deleting location:", error)
        return NextResponse.json(
            {
                success: false,
                data: null,
                message: "Failed to delete location"
            },
            { status: 500 }
        )
    }
}
