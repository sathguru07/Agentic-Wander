
import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'agentic-wander-secret-key-2025';

export const encryptData = (data: any): string => {
    try {
        const jsonString = JSON.stringify(data);
        return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    } catch (error) {
        console.error('Encryption failed:', error);
        return '';
    }
};

export const decryptData = (ciphertext: string): any => {
    try {
        if (!ciphertext) return null;

        // Attempt to decrypt
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedData) {
            console.log('Decryption resulted in empty string, trying plain JSON parsing');
            // If decryption yields empty string, it might be plain text
            return JSON.parse(ciphertext);
        }

        console.log('Decryption successful');
        return JSON.parse(decryptedData);
    } catch (error) {
        // Fallback: Try parsing as plain JSON (for old data)
        try {
            return JSON.parse(ciphertext);
        } catch (e) {
            console.error('Failed to parse user data:', e);
            return null;
        }
    }
};
