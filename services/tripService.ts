
import { encryptData, decryptData } from './securityService';
import { TripPlanResponse, UserQuery } from '../types';

export interface SavedTrip {
    id: string;
    createdAt: number;
    query: UserQuery;
    plan: TripPlanResponse;
}

const STORAGE_KEY = 'saved_trips';

export const saveTrip = (query: UserQuery, plan: TripPlanResponse): SavedTrip => {
    const newTrip: SavedTrip = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        query,
        plan
    };

    const existingTrips = getSavedTrips();
    const updatedTrips = [newTrip, ...existingTrips];

    // Encrypt the entire trips array before saving
    localStorage.setItem(STORAGE_KEY, encryptData(updatedTrips));

    return newTrip;
};

export const getSavedTrips = (): SavedTrip[] => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return [];

    const decrypted = decryptData(savedData);
    return Array.isArray(decrypted) ? decrypted : [];
};

export const deleteTrip = (id: string): SavedTrip[] => {
    const existingTrips = getSavedTrips();
    const updatedTrips = existingTrips.filter(t => t.id !== id);

    localStorage.setItem(STORAGE_KEY, encryptData(updatedTrips));
    return updatedTrips;
};
