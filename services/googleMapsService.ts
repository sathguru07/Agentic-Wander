declare global {
    interface Window {
        google: any;
    }
}

export interface PlaceResult {
    name: string;
    rating?: number;
    price_level?: number;
    user_ratings_total?: number;
    types?: string[];
}

export const fetchNearbyPlaces = async (
    destination: string,
    type: 'lodging' | 'tourist_attraction' | 'restaurant'
): Promise<PlaceResult[]> => {
    return new Promise((resolve, reject) => {
        if (!window.google || !window.google.maps) {
            console.warn("Google Maps SDK not loaded");
            resolve([]);
            return;
        }

        // Create a dummy map to use PlacesService (required by API)
        const mapDiv = document.createElement('div');
        const map = new google.maps.Map(mapDiv, { center: { lat: 0, lng: 0 }, zoom: 1 });
        const service = new google.maps.places.PlacesService(map);

        // First, find the location (Text Search)
        const request = {
            query: destination,
            fields: ['geometry']
        };

        service.findPlaceFromQuery(request, (results: any, status: any) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0] && results[0].geometry) {
                const location = results[0].geometry.location;

                // Then search for places near that location
                const nearbyRequest = {
                    location: location!,
                    radius: 5000, // 5km radius
                    type: type,
                    rankBy: google.maps.places.RankBy.PROMINENCE
                };

                service.nearbySearch(nearbyRequest, (placeResults: any, placeStatus: any) => {
                    if (placeStatus === google.maps.places.PlacesServiceStatus.OK && placeResults) {
                        const mappedResults = placeResults.slice(0, 10).map((p: any) => ({
                            name: p.name || "Unknown",
                            rating: p.rating,
                            price_level: p.price_level,
                            user_ratings_total: p.user_ratings_total,
                            types: p.types
                        }));
                        resolve(mappedResults);
                    } else {
                        console.warn(`No ${type} found nearby ${destination}`);
                        resolve([]);
                    }
                });
            } else {
                console.warn(`Could not geocode destination: ${destination}`);
                resolve([]);
            }
        });
    });
};
