/**
 * Species API Service
 * Handles fetching species and locations data with 4 main endpoints:
 * 1. getAllSpecies() - Lấy thông tin tất cả các loài
 * 2. getAllLocations() - Lấy vị trí của tất cả các loài
 * 3. getLocationsBySpecies(speciesId) - Lấy vị trí của loài cụ thể
 * 4. getSpeciesById(speciesId) - Lấy thông tin của một loài cụ thể
 */

import {
    Species,
    Location,
    SpeciesListResponse,
    LocationsResponse,
    SpeciesDetailResponse,
    SpeciesWithLocations,
    MapOverlay,
    LocationCreate
} from "@/types/api"

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_ENDPOINTS = {
    species: "/api/v1/species/all",
    locations_all: "/api/v1/locations/all",
    locations: "/api/v1/locations",
    speciesDetail: "/api/v1/species",
    speciesLocations: "/api/v1/locations"
}

/**
 * 1. Lấy thông tin tất cả các loài
 */
export async function getAllSpecies(): Promise<Species[]> {
    try {
        // For development, using mock implementation
        return await mockGetAllSpecies()

        // Production implementation (uncomment when backend is ready):
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.species}`)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: SpeciesListResponse = await response.json()
        console.log("Fetched species data:", data)

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch species")
        }
        return data.data
    } catch (error) {
        console.error("Error fetching all species:", error)
        return []
    }
}

/**
 * 2. Lấy vị trí của tất cả các loài
 */
export async function getAllLocations(): Promise<Location[]> {
    try {
        // For development, using mock implementation
        return await mockGetAllLocations()

        // Production implementation (uncomment when backend is ready):
        const response = await fetch(
            `${API_BASE_URL}${API_ENDPOINTS.locations_all}`
        )

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: LocationsResponse = await response.json()
        console.log("Fetched locations data:", data)

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch locations")
        }

        return data.data
    } catch (error) {
        console.error("Error fetching all locations:", error)
        return []
    }
}

/**
 * 3. Lấy vị trí của loài cụ thể
 */
export async function getLocationsBySpecies(
    speciesId: number
): Promise<Location[]> {
    try {
        // For development, using mock implementation
        // return await mockGetLocationsBySpecies(speciesId)

        // Production implementation (uncomment when backend is ready):
        const response = await fetch(
            `${API_BASE_URL}${API_ENDPOINTS.speciesLocations}/${speciesId}`
        )

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: LocationsResponse = await response.json()

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch species locations")
        }

        return data.data
    } catch (error) {
        console.error(
            `Error fetching locations for species ${speciesId}:`,
            error
        )
        return []
    }
}

/**
 * 4. Lấy thông tin của một loài cụ thể
 */
export async function getSpeciesById(
    speciesId: number
): Promise<Species | null> {
    try {
        // For development, using mock implementation
        // return await mockGetSpeciesById(speciesId)

        // Production implementation (uncomment when backend is ready):
        const response = await fetch(
            `${API_BASE_URL}${API_ENDPOINTS.speciesDetail}/${speciesId}`
        )

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: SpeciesDetailResponse = await response.json()

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch species detail")
        }

        return data.data
    } catch (error) {
        console.error(`Error fetching species ${speciesId}:`, error)
        return null
    }
}

/**
 * Helper function: Lấy species và locations kết hợp
 */
export async function getSpeciesWithLocations(
    speciesId: number
): Promise<SpeciesWithLocations | null> {
    try {
        const [species, locations] = await Promise.all([
            getSpeciesById(speciesId),
            getLocationsBySpecies(speciesId)
        ])

        if (!species) {
            return null
        }

        return {
            species,
            locations
        }
    } catch (error) {
        console.error(
            `Error fetching species with locations ${speciesId}:`,
            error
        )
        return null
    }
}

/**
 * Helper function: Lấy tất cả species và locations (cho map view)
 */
export async function getAllSpeciesAndLocations(): Promise<{
    species: Species[]
    locations: Location[]
}> {
    try {
        const [species, locations] = await Promise.all([
            getAllSpecies(),
            getAllLocations()
        ])

        return {
            species,
            locations
        }
    } catch (error) {
        console.error("Error fetching all species and locations:", error)
        return {
            species: [],
            locations: []
        }
    }
}

/**
 * Tạo location mới
 */
export async function createLocation(locationData: LocationCreate): Promise<{
    success: boolean
    data: Location | null
    message: string
}> {
    try {
        // For development, using mock implementation
        return await mockCreateLocation(locationData)

        // Production implementation (uncomment when backend is ready):
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
        return {
            success: true,
            data: result,
            message: result.message || "Location created successfully"
        }
    } catch (error) {
        console.error("Error creating location:", error)
        return {
            success: false,
            data: null,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to create location"
        }
    }
}

// =============================================================================
// MOCK IMPLEMENTATIONS FOR DEVELOPMENT
// =============================================================================

async function mockGetAllSpecies(): Promise<Species[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return [
        {
            id: 59549,
            speciesId: 59549,
            name: "Large-leaved lupine",
            scientificName: "Lupinus polyphyllus",
            description: "http://en.wikipedia.org/wiki/Lupinus_polyphyllus",
            imageUrl:
                "https://inaturalist-open-data.s3.amazonaws.com/photos/135866080/medium.jpg",
            bloomTime: "Late Spring to Summer (May-September)",
            color: "Purple, blue, pink, white, or combinations thereof",
            habitat:
                "Roadsides, meadows, woodland clearings, and disturbed areas. Often found in moist, well-drained soils.",
            characteristics:
                "Tall plant with a prominent flower spike, palmate leaves with 9-17 leaflets, nitrogen-fixing capabilities."
        },
        {
            id: 49564,
            speciesId: 49564,
            name: "Texas bluebonnet",
            scientificName: "Lupinus texensis",
            description: "http://en.wikipedia.org/wiki/Lupinus_texensis",
            imageUrl:
                "https://inaturalist-open-data.s3.amazonaws.com/photos/1447028/medium.JPG",
            bloomTime: "Spring (March-May)",
            color: "Blue, with a white tip (sometimes pink or maroon)",
            habitat:
                "Well-drained sandy or gravelly soils, roadsides, pastures, and open fields of Central Texas",
            characteristics:
                "Showy racemes of blue flowers, five-petaled, the 'banner' petal often having a white tip that may turn reddish-purple with age, important for attracting pollinators, state flower of Texas"
        },
        {
            id: 50614,
            speciesId: 50614,
            name: "Miniature Lupine",
            scientificName: "Lupinus bicolor",
            description: "http://en.wikipedia.org/wiki/Lupinus_bicolor",
            imageUrl:
                "https://inaturalist-open-data.s3.amazonaws.com/photos/184064245/medium.jpg",
            bloomTime: "Spring",
            color: "Blue, Purple, White",
            habitat:
                "Open, disturbed areas, grasslands, coastal scrub, chaparral",
            characteristics:
                "Small annual herb, often with a bicolored flower (standard usually white, wings blue or purple), palmate leaves"
        },
        {
            id: 61010,
            speciesId: 61010,
            name: "coastal bush lupine",
            scientificName: "Lupinus arboreus",
            description: "http://en.wikipedia.org/wiki/Lupinus_arboreus",
            imageUrl:
                "https://inaturalist-open-data.s3.amazonaws.com/photos/120260472/medium.jpg",
            bloomTime: "Spring to Summer",
            color: "Yellow, sometimes cream or blue",
            habitat:
                "Coastal dunes, scrubland, disturbed areas, often near the coast",
            characteristics:
                "Shrubby habit, nitrogen-fixing properties, rapid growth, can be invasive"
        },
        {
            id: 62691,
            speciesId: 62691,
            name: "silvery lupine",
            scientificName: "Lupinus argenteus",
            description: "http://en.wikipedia.org/wiki/Lupinus_argenteus",
            imageUrl:
                "https://inaturalist-open-data.s3.amazonaws.com/photos/18421301/medium.jpg",
            bloomTime: "Late Spring to Late Summer (May-September)",
            color: "Blue, Purple, Pink, White",
            habitat:
                "Sagebrush steppe, Ponderosa Pine forests, Mountain meadows, Dry open areas, Woodlands",
            characteristics:
                "Silvery-green foliage, densely hairy stems and leaves, variable flower color, nitrogen-fixing capabilities"
        },
        {
            id: 48225,
            speciesId: 48225,
            name: "California poppy",
            scientificName: "Eschscholzia californica",
            description:
                "http://en.wikipedia.org/wiki/Eschscholzia_californica",
            imageUrl:
                "https://inaturalist-open-data.s3.amazonaws.com/photos/67227218/medium.jpg",
            bloomTime: "Spring to Summer (February - September)",
            color: "Orange, Yellow, Reddish-Orange, rarely Pink or White",
            habitat:
                "Grasslands, open areas, disturbed sites, chaparral, coastal dunes, and foothills",
            characteristics:
                "Cup-shaped flowers, bluish-green foliage, drought-tolerant, self-seeding"
        },
        {
            id: 50987,
            speciesId: 50987,
            name: "California goldfields",
            scientificName: "Lasthenia californica",
            description: "http://en.wikipedia.org/wiki/Lasthenia_californica",
            imageUrl:
                "https://inaturalist-open-data.s3.amazonaws.com/photos/7229972/medium.jpeg",
            bloomTime: "Spring",
            color: "Yellow",
            habitat:
                "Grasslands, vernal pools, coastal meadows, disturbed areas",
            characteristics:
                "Forms extensive carpets of bright yellow flowers, annual herb, tolerant of serpentine soils."
        },
        {
            id: 542062,
            speciesId: 542062,
            name: "Rock Purslane",
            scientificName: "Cistanthe grandiflora",
            description: "",
            imageUrl:
                "https://inaturalist-open-data.s3.amazonaws.com/photos/355482388/medium.jpg",
            bloomTime: "Summer",
            color: "Rose-pink to magenta",
            habitat:
                "Rocky slopes and cliffs, especially in California and Oregon",
            characteristics:
                "Succulent perennial with large, showy flowers; drought-tolerant"
        },
        {
            id: 76661,
            speciesId: 76661,
            name: "trailing African daisy",
            scientificName: "Dimorphotheca fruticosa",
            description:
                "https://en.wikipedia.org/wiki/Dimorphotheca_fruticosa",
            imageUrl:
                "https://inaturalist-open-data.s3.amazonaws.com/photos/195549687/medium.jpg",
            bloomTime: "Year-round",
            color: "Yellow",
            habitat: "Coastal regions, sand dunes, disturbed areas",
            characteristics:
                "Drought-tolerant, low-growing shrub, suitable for ground cover, attracts pollinators"
        },
        {
            id: 76660,
            speciesId: 76660,
            name: "blue-and-white daisybush",
            scientificName: "Dimorphotheca ecklonis",
            description: "http://en.wikipedia.org/wiki/Dimorphotheca_ecklonis",
            imageUrl:
                "https://inaturalist-open-data.s3.amazonaws.com/photos/15848074/medium.jpg",
            bloomTime: "Spring to Autumn",
            color: "White, Purple, Yellow",
            habitat: "Grasslands, Coastal areas, Disturbed ground",
            characteristics:
                "Drought-tolerant, attracts pollinators, forms a dense shrub"
        },
        {
            id: 76662,
            speciesId: 76662,
            name: "Cape marigold",
            scientificName: "Dimorphotheca sinuata",
            description: "http://en.wikipedia.org/wiki/Dimorphotheca_sinuata",
            imageUrl:
                "https://inaturalist-open-data.s3.amazonaws.com/photos/6486656/medium.jpeg",
            bloomTime: "Spring",
            color: "Orange, Yellow, White (with a dark central disc)",
            habitat:
                "Sandy or gravelly soils, often in disturbed areas or along roadsides",
            characteristics:
                "Annual herb, showy daisy-like flowers, drought-tolerant"
        },
        {
            id: 119207,
            speciesId: 119207,
            name: "rain daisy",
            scientificName: "Dimorphotheca pluvialis",
            description: "http://en.wikipedia.org/wiki/Dimorphotheca_pluvialis",
            imageUrl:
                "https://inaturalist-open-data.s3.amazonaws.com/photos/97754149/medium.jpg",
            bloomTime: "Spring",
            color: "White with a yellow center, sometimes pale yellow or cream",
            habitat:
                "Sandy flats, coastal dunes, and disturbed areas in the Western Cape of South Africa",
            characteristics:
                "Flowers close on cloudy days and at night, ray florets are typically white with purple undersides, disc florets are yellow."
        },
        {
            id: 569596,
            speciesId: 569596,
            name: "Cape daisy",
            scientificName: "Dimorphotheca jucunda",
            description: "https://en.wikipedia.org/wiki/Dimorphotheca_jucunda",
            imageUrl:
                "https://inaturalist-open-data.s3.amazonaws.com/photos/12207464/medium.jpeg",
            bloomTime: "Spring",
            color: "Purple-pink with a darker center",
            habitat: "Rocky slopes and grasslands",
            characteristics:
                "Drought-tolerant, forms mats, flowers open in sunlight and close in shade"
        },
        {
            id: 50164,
            speciesId: 50164,
            name: "desert sand verbena",
            scientificName: "Abronia villosa",
            description: "http://en.wikipedia.org/wiki/Abronia_villosa",
            imageUrl:
                "https://inaturalist-open-data.s3.amazonaws.com/photos/117389013/medium.jpg",
            bloomTime: "Spring (primarily March-May)",
            color: "Magenta to pink, sometimes white or purple",
            habitat: "Sandy deserts, dunes, and washes",
            characteristics:
                "Fragrant, sticky leaves and stems, prostrate growth habit, drought-tolerant, attracts pollinators"
        }
    ]
}

async function mockGetAllLocations(): Promise<Location[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    return [
        // Cherry Blossom locations
        {
            id: 1,
            speciesId: 50164,
            locationName: "Hanoi Cherry Garden",
            coordinates: [-118.44, 34.764],
            bloomingPeriod: {
                start: "2025-03-15",
                peak: "2025-04-05",
                end: "2025-04-25"
            }
        },
        {
            id: 2,
            speciesId: 1,
            locationName: "Hue Imperial City",
            coordinates: [108.2022, 16.0545],
            bloomingPeriod: {
                start: "2025-03-10",
                peak: "2025-03-30",
                end: "2025-04-20"
            }
        },
        {
            id: 3,
            speciesId: 1,
            locationName: "Ho Chi Minh City Park",
            coordinates: [106.6297, 10.8231],
            bloomingPeriod: {
                start: "2025-02-20",
                peak: "2025-03-15",
                end: "2025-04-10"
            }
        },

        // Sunflower locations
        {
            id: 4,
            speciesId: 2,
            locationName: "Dong Anh Sunflower Field",
            coordinates: [105.6189, 21.0245],
            bloomingPeriod: {
                start: "2025-06-01",
                peak: "2025-07-15",
                end: "2025-09-15"
            }
        },
        {
            id: 5,
            speciesId: 2,
            locationName: "Quang Tri Sunflower Valley",
            coordinates: [107.565, 16.4637],
            bloomingPeriod: {
                start: "2025-05-15",
                peak: "2025-07-01",
                end: "2025-08-30"
            }
        },
        {
            id: 6,
            speciesId: 2,
            locationName: "Binh Duong Sunflower Farm",
            coordinates: [106.978, 10.8142],
            bloomingPeriod: {
                start: "2025-06-10",
                peak: "2025-08-01",
                end: "2025-09-20"
            }
        },

        // Lotus locations
        {
            id: 7,
            speciesId: 3,
            locationName: "West Lake Lotus Pond",
            coordinates: [105.8019, 20.9801],
            bloomingPeriod: {
                start: "2025-05-01",
                peak: "2025-07-01",
                end: "2025-08-31"
            }
        },
        {
            id: 8,
            speciesId: 3,
            locationName: "Perfume River Lotus",
            coordinates: [108.1435, 16.4621],
            bloomingPeriod: {
                start: "2025-04-20",
                peak: "2025-06-15",
                end: "2025-08-15"
            }
        },
        {
            id: 9,
            speciesId: 3,
            locationName: "Mekong Delta Lotus Field",
            coordinates: [105.7851, 10.0451],
            bloomingPeriod: {
                start: "2025-05-10",
                peak: "2025-07-20",
                end: "2025-09-05"
            }
        },

        // Lavender locations
        {
            id: 10,
            speciesId: 4,
            locationName: "Da Lat Lavender Farm",
            coordinates: [108.4265, 15.8742],
            bloomingPeriod: {
                start: "2025-06-15",
                peak: "2025-07-20",
                end: "2025-08-30"
            }
        },
        {
            id: 11,
            speciesId: 4,
            locationName: "Sapa Lavender Garden",
            coordinates: [103.97, 22.4856],
            bloomingPeriod: {
                start: "2025-06-01",
                peak: "2025-07-10",
                end: "2025-08-20"
            }
        },

        // Rose locations
        {
            id: 12,
            speciesId: 5,
            locationName: "Hanoi Rose Garden",
            coordinates: [105.8445, 21.0325],
            bloomingPeriod: {
                start: "2025-04-01",
                peak: "2025-06-01",
                end: "2025-10-31"
            }
        },
        {
            id: 13,
            speciesId: 5,
            locationName: "Hue Royal Rose Park",
            coordinates: [108.2208, 16.0578],
            bloomingPeriod: {
                start: "2025-03-20",
                peak: "2025-05-15",
                end: "2025-11-10"
            }
        },
        {
            id: 14,
            speciesId: 5,
            locationName: "Saigon Rose Valley",
            coordinates: [106.7009, 10.7756],
            bloomingPeriod: {
                start: "2025-04-10",
                peak: "2025-06-20",
                end: "2025-10-20"
            }
        },
        {
            id: 15,
            speciesId: 5,
            locationName: "Da Lat Rose Garden",
            coordinates: [108.4582, 15.8654],
            bloomingPeriod: {
                start: "2025-03-25",
                peak: "2025-05-30",
                end: "2025-11-05"
            }
        },

        // Los Angeles Area Locations (within overlay bounds: -118.46 to -118.26, 34.66 to 34.8)
        // Cherry Blossom locations in LA
        {
            id: 16,
            speciesId: 1,
            locationName: "West Hollywood Cherry Park",
            coordinates: [-118.3648, 34.7184],
            bloomingPeriod: {
                start: "2025-03-01",
                peak: "2025-03-20",
                end: "2025-04-15"
            }
        },
        {
            id: 17,
            speciesId: 1,
            locationName: "Beverly Hills Cherry Grove",
            coordinates: [-118.4052, 34.7089],
            bloomingPeriod: {
                start: "2025-02-25",
                peak: "2025-03-18",
                end: "2025-04-10"
            }
        },
        {
            id: 18,
            speciesId: 1,
            locationName: "Sunset Strip Cherry Trees",
            coordinates: [-118.3851, 34.7381],
            bloomingPeriod: {
                start: "2025-03-05",
                peak: "2025-03-25",
                end: "2025-04-20"
            }
        },

        // Sunflower locations in LA
        {
            id: 19,
            speciesId: 2,
            locationName: "Hollywood Hills Sunflower Field",
            coordinates: [-118.3395, 34.7095],
            bloomingPeriod: {
                start: "2025-07-01",
                peak: "2025-08-15",
                end: "2025-09-30"
            }
        },
        {
            id: 20,
            speciesId: 2,
            locationName: "Santa Monica Sunflower Meadow",
            coordinates: [-118.4345, 34.7278],
            bloomingPeriod: {
                start: "2025-06-20",
                peak: "2025-08-01",
                end: "2025-09-20"
            }
        },

        // Lotus locations in LA
        {
            id: 21,
            speciesId: 3,
            locationName: "Century City Lotus Pond",
            coordinates: [-118.4107, 34.7582],
            bloomingPeriod: {
                start: "2025-05-15",
                peak: "2025-07-10",
                end: "2025-09-15"
            }
        },
        {
            id: 22,
            speciesId: 3,
            locationName: "Fairfax Lotus Garden",
            coordinates: [-118.3653, 34.7491],
            bloomingPeriod: {
                start: "2025-05-01",
                peak: "2025-06-25",
                end: "2025-08-30"
            }
        },

        // Lavender locations in LA
        {
            id: 23,
            speciesId: 4,
            locationName: "Melrose Lavender Gardens",
            coordinates: [-118.3712, 34.6895],
            bloomingPeriod: {
                start: "2025-04-15",
                peak: "2025-07-01",
                end: "2025-09-30"
            }
        },
        {
            id: 24,
            speciesId: 4,
            locationName: "West Hollywood Lavender Park",
            coordinates: [-118.3801, 34.7136],
            bloomingPeriod: {
                start: "2025-04-20",
                peak: "2025-06-30",
                end: "2025-10-15"
            }
        },

        // Rose locations in LA
        {
            id: 25,
            speciesId: 5,
            locationName: "Beverly Hills Rose Garden",
            coordinates: [-118.4087, 34.7181],
            bloomingPeriod: {
                start: "2025-04-01",
                peak: "2025-06-15",
                end: "2025-11-30"
            }
        },
        {
            id: 26,
            speciesId: 5,
            locationName: "Hollywood Rose Collection",
            coordinates: [-118.3348, 34.7394],
            bloomingPeriod: {
                start: "2025-03-20",
                peak: "2025-05-25",
                end: "2025-11-15"
            }
        },
        {
            id: 27,
            speciesId: 5,
            locationName: "Santa Monica Rose Gardens",
            coordinates: [-118.4323, 34.7548],
            bloomingPeriod: {
                start: "2025-03-15",
                peak: "2025-05-20",
                end: "2025-11-10"
            }
        }
    ]
}

async function mockGetLocationsBySpecies(
    speciesId: number
): Promise<Location[]> {
    const allLocations = await mockGetAllLocations()
    return allLocations.filter((location) => location.speciesId === speciesId)
}

async function mockGetSpeciesById(speciesId: number): Promise<Species | null> {
    const allSpecies = await mockGetAllSpecies()
    return allSpecies.find((species) => species.speciesId === speciesId) || null
}

/**
 * 5. Lấy thông tin map overlays
 */
export async function getMapOverlays(): Promise<MapOverlay[]> {
    try {
        // For development, using mock implementation
        return await mockGetMapOverlays()

        // Production implementation (uncomment when backend is ready):
        /*
        const response = await fetch(`${API_BASE_URL}/api/overlays`)
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch overlays')
        }
        
        return data.data
        */
    } catch (error) {
        console.error("Error fetching map overlays:", error)
        throw error
    }
}

async function mockGetMapOverlays(): Promise<MapOverlay[]> {
    // Mock data for map overlays
    return [
        {
            id: 1,
            name: "Anza-Borrego Desert State Park, Antelope Valley",
            address: "California, USA",
            imageUrl: "/mask.svg",
            startDate: "2024-04-01",
            endDate: "2024-09-30",
            reportUrl: "/exp.pdf",
            chartUrls: [
                "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600",
                "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600",
                "https://media.giphy.com/media/26BRrSvJUa0crqw4E/giphy.gif",
                "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600"
            ],
            bounds: {
                minLon: -118.44,
                maxLon: -118.38,
                minLat: 34.764,
                maxLat: 34.88
            }
        },
        {
            id: 2,
            name: "Carrizo Plain National Monument",
            address: "California, USA",
            imageUrl: "/mask.svg",
            startDate: "2017-04-01",
            endDate: "2017-04-30",
            reportUrl: "/exp.pdf",
            chartUrls: [
                "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600",
                "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600",
                "https://media.giphy.com/media/26BRrSvJUa0crqw4E/giphy.gif",
                "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600"
            ],
            bounds: {
                minLon: -119.94,
                maxLon: -119.74,
                minLat: 35.08,
                maxLat: 35.18
            }
        },
        {
            id: 3,
            name: "Walker Canyon, Lake Elsinore",
            address: "California, USA",
            imageUrl: "/mask.svg",
            startDate: "2019-03-01",
            endDate: "2019-03-31",
            reportUrl: "/exp.pdf",
            chartUrls: [
                "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600",
                "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600",
                "https://media.giphy.com/media/26BRrSvJUa0crqw4E/giphy.gif",
                "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600"
            ],
            bounds: {
                minLon: -117.41,
                maxLon: -117.39,
                minLat: 33.72,
                maxLat: 33.74
            }
        },
        {
            id: 4,
            name: "Anza-Borrego",
            address: "California, USA",
            imageUrl: "/mask.svg",
            startDate: "2019-02-01",
            endDate: "2019-02-28",
            reportUrl: "/exp.pdf",
            chartUrls: [
                "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600",
                "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600",
                "https://media.giphy.com/media/26BRrSvJUa0crqw4E/giphy.gif",
                "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600"
            ],
            bounds: {
                minLon: -116.42,
                maxLon: -116.38,
                minLat: 33.25,
                maxLat: 33.26
            }
        },
        {
            id: 5,
            name: "Atacama Desert",
            address: "Chile",
            imageUrl: "/mask.svg",
            startDate: "2019-07-01",
            endDate: "2019-07-31",
            reportUrl: "/exp.pdf",
            chartUrls: [
                "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600",
                "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600",
                "https://media.giphy.com/media/26BRrSvJUa0crqw4E/giphy.gif",
                "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600"
            ],
            bounds: {
                minLon: 69.42,
                maxLon: 69.52,
                minLat: 23.84,
                maxLat: 23.94
            }
        },
        {
            id: 6,
            name: "Namaqualand",
            address: "Namibia",
            imageUrl: "/mask.svg",
            startDate: "2019-05-01",
            endDate: "2019-05-31",
            reportUrl: "/exp.pdf",
            chartUrls: [
                "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600",
                "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600",
                "https://media.giphy.com/media/26BRrSvJUa0crqw4E/giphy.gif",
                "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600"
            ],
            bounds: {
                minLon: 15.32,
                maxLon: 15.42,
                minLat: 26.34,
                maxLat: 26.44
            }
        }
    ]
}

async function mockCreateLocation(locationData: Omit<Location, "id">): Promise<{
    success: boolean
    data: Location | null
    message: string
}> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
        // Validate required fields
        if (
            !locationData.speciesId ||
            !locationData.locationName ||
            !locationData.coordinates ||
            !locationData.bloomingPeriod
        ) {
            return {
                success: false,
                data: null,
                message: "Thiếu thông tin bắt buộc"
            }
        }

        // Validate coordinates
        if (
            !Array.isArray(locationData.coordinates) ||
            locationData.coordinates.length !== 2
        ) {
            return {
                success: false,
                data: null,
                message: "Tọa độ không hợp lệ"
            }
        }

        // Validate blooming period
        const { bloomingPeriod } = locationData
        if (
            !bloomingPeriod.start ||
            !bloomingPeriod.peak ||
            !bloomingPeriod.end
        ) {
            return {
                success: false,
                data: null,
                message: "Thời gian nở hoa không hợp lệ"
            }
        }

        // Validate date order
        const startDate = new Date(bloomingPeriod.start)
        const peakDate = new Date(bloomingPeriod.peak)
        const endDate = new Date(bloomingPeriod.end)

        if (peakDate < startDate || endDate < peakDate) {
            return {
                success: false,
                data: null,
                message: "Thứ tự thời gian nở hoa không hợp lệ"
            }
        }

        // Generate new ID (in a real app, this would be handled by the database)
        const newId = Math.floor(Math.random() * 10000) + 1000

        const newLocation: Location = {
            id: newId,
            speciesId: locationData.speciesId,
            locationName: locationData.locationName.trim(),
            coordinates: [
                parseFloat(locationData.coordinates[0].toString()),
                parseFloat(locationData.coordinates[1].toString())
            ],
            bloomingPeriod: {
                start: bloomingPeriod.start,
                peak: bloomingPeriod.peak,
                end: bloomingPeriod.end
            }
        }

        // In a real implementation, you would store this in a database
        // For now, we'll just return the created location
        return {
            success: true,
            data: newLocation,
            message: "Địa điểm đã được tạo thành công"
        }
    } catch (error) {
        console.error("Mock create location error:", error)
        return {
            success: false,
            data: null,
            message: "Lỗi khi tạo địa điểm mới"
        }
    }
}

export type { Species, Location, SpeciesWithLocations, MapOverlay }
