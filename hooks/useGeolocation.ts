import { useState } from 'react';

interface GeolocationState {
    loading: boolean;
    error: string | null;
    locationName: string | null;
    coordinates: { lat: number; lng: number } | null;
}

export const useGeolocation = () => {
    const [state, setState] = useState<GeolocationState>({
        loading: false,
        error: null,
        locationName: null,
        coordinates: null
    });

    const getCurrentLocation = () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        if (!navigator.geolocation) {
            setState(prev => ({ ...prev, loading: false, error: 'Geolocation is not supported by your browser.' }));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Reverse geocode using Open Street Map's Nominatim API
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();
                    const cityName = data.address?.city || data.address?.town || data.address?.village || 'Current Location';

                    setState({
                        loading: false,
                        error: null,
                        locationName: cityName,
                        coordinates: { lat: latitude, lng: longitude }
                    });
                } catch (err) {
                    console.error('Error fetching location name:', err);
                    setState({
                        loading: false,
                        error: 'Failed to fetch location name',
                        locationName: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
                        coordinates: { lat: latitude, lng: longitude }
                    });
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                setState(prev => ({ ...prev, loading: false, error: 'Unable to access your location. Please enable location permissions.' }));
            }
        );
    };

    return { ...state, getCurrentLocation };
};
