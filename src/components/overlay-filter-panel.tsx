"use client"
import { useState, useMemo } from "react"
import {
    Search,
    X,
    MapPin,
    Map as MapIcon,
    Calendar,
    Pin,
    Pi
} from "lucide-react"
import { MapOverlay, Location } from "@/types/api"

interface OverlayFilterPanelProps {
    allOverlays: MapOverlay[]
    allLocations: Location[]
    selectedOverlayIds: number[]
    onOverlayFilter: (overlayIds: number[]) => void
    className?: string
}

export default function OverlayFilterPanel({
    allOverlays,
    allLocations,
    selectedOverlayIds,
    onOverlayFilter,
    className = "w-sm bg-white rounded-lg shadow-lg border border-gray-300"
}: OverlayFilterPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Check if a location is within overlay bounds
    const isLocationInOverlay = (
        location: Location,
        overlay: MapOverlay
    ): boolean => {
        const [lon, lat] = location.coordinates
        return (
            lon >= overlay.bounds.minLon &&
            lon <= overlay.bounds.maxLon &&
            lat >= overlay.bounds.minLat &&
            lat <= overlay.bounds.maxLat
        )
    }

    // Create overlay data with location counts
    const overlaysWithStats = useMemo(() => {
        return allOverlays.map((overlay) => {
            const overlayLocations = allLocations.filter((loc) =>
                isLocationInOverlay(loc, overlay)
            )
            return {
                ...overlay,
                locationCount: overlayLocations.length,
                locations: overlayLocations
            }
        })
    }, [allOverlays, allLocations])

    // Filter overlays by search query
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return overlaysWithStats

        const query = searchQuery.toLowerCase()
        return overlaysWithStats.filter((overlay) =>
            overlay.name.toLowerCase().includes(query)
        )
    }, [overlaysWithStats, searchQuery])

    // Handle individual overlay selection
    const handleOverlayToggle = (overlayId: number) => {
        const newSelection = selectedOverlayIds.includes(overlayId)
            ? selectedOverlayIds.filter((id) => id !== overlayId)
            : [...selectedOverlayIds, overlayId]

        onOverlayFilter(newSelection)
    }

    // Handle select all overlays
    const handleSelectAll = () => {
        if (selectedOverlayIds.length === overlaysWithStats.length) {
            onOverlayFilter([]) // Deselect all if all are selected
        } else {
            onOverlayFilter(overlaysWithStats.map((overlay) => overlay.id))
        }
    }

    // Clear all selections
    const handleClearAll = () => {
        onOverlayFilter([])
        setSearchQuery("")
    }

    const selectedCount = selectedOverlayIds.length
    const totalCount = overlaysWithStats.length
    const totalLocationsInSelected = overlaysWithStats
        .filter((overlay) => selectedOverlayIds.includes(overlay.id))
        .reduce((sum, overlay) => sum + overlay.locationCount, 0)

    return (
        <div className={className}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="w-full items-center justify-between">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-gray-500 hover:text-gray-700 w-full"
                    >
                        <div className="flex items-center gap-2">
                            <MapIcon size={20} className="text-blue-600" />
                            <h3 className="font-semibold text-gray-800">
                                Filter by Region
                            </h3>
                        </div>
                    </button>
                </div>

                {/* Summary */}
                <div className="mt-2 text-sm text-gray-600">
                    <span>
                        {selectedCount} region{selectedCount > 1 ? "s" : ""}{" "}
                        selected ({totalLocationsInSelected} locations)
                    </span>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="p-4">
                    {/* Search */}
                    <div className="relative mb-3">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search regions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Control Buttons */}
                    <div className="flex gap-2 mb-3">
                        <button
                            onClick={handleSelectAll}
                            className="flex-1 px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                            {selectedCount === totalCount
                                ? "Deselect All"
                                : "Select All"}
                        </button>
                        <button
                            onClick={handleClearAll}
                            className="flex-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                            Clear
                        </button>
                    </div>

                    {/* Overlay List */}
                    <div className="max-h-68 overflow-y-auto space-y-3">
                        {searchResults.length > 0 ? (
                            searchResults.map((overlay) => (
                                <div
                                    key={overlay.id}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                        selectedOverlayIds.includes(overlay.id)
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                    }`}
                                    onClick={() =>
                                        handleOverlayToggle(overlay.id)
                                    }
                                >
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedOverlayIds.includes(
                                                overlay.id
                                            )}
                                            onChange={() =>
                                                handleOverlayToggle(overlay.id)
                                            }
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-1"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-gray-800 mb-1">
                                                {overlay.name}
                                            </div>

                                            {/* Address */}
                                            {overlay.address && (
                                                <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                                                    <MapPin
                                                        size={12}
                                                        className="text-gray-400 flex-shrink-0"
                                                    />
                                                    <span className="truncate">
                                                        {overlay.address}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Bloom Period */}
                                            {overlay.startDate &&
                                                overlay.endDate && (
                                                    <div className="flex items-center gap-1 text-xs text-green-700 mb-1">
                                                        <Calendar
                                                            size={12}
                                                            className="text-green-500 flex-shrink-0"
                                                        />
                                                        <span>
                                                            Bloom:{" "}
                                                            {new Date(
                                                                overlay.startDate
                                                            ).toLocaleDateString()}{" "}
                                                            -{" "}
                                                            {new Date(
                                                                overlay.endDate
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}

                                            <div className="flex items-center gap-1 text-xs mb-1">
                                                <Pin
                                                    size={12}
                                                    className="text-gray-400 flex-shrink-0"
                                                />
                                                <div className="text-xs text-gray-500">
                                                    {overlay.locationCount}{" "}
                                                    location
                                                    {overlay.locationCount !== 1
                                                        ? "s"
                                                        : ""}
                                                </div>
                                                {selectedOverlayIds.includes(
                                                    overlay.id
                                                ) && (
                                                    <div className="text-xs text-blue-600 font-medium">
                                                        ✓ Selected
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500 text-sm">
                                {searchQuery
                                    ? "No regions match your search"
                                    : "No regions available"}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
