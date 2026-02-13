const crypto = require('crypto');

// Configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 12 bytes is recommended for GCM
const KEY_LENGTH = 32; // 32 bytes for AES-256

/**
 * Gets the encryption key from environment variables.
 * Throws an error if missing or invalid.
 */
function getKey() {
    const keyHex = process.env.ENCRYPTION_KEY;
    if (!keyHex) {
        throw new Error('FATAL: ENCRYPTION_KEY is missing in process.env');
    }

    // Convert hex string to buffer
    const key = Buffer.from(keyHex, 'hex');

    if (key.length !== KEY_LENGTH) {
        throw new Error(`FATAL: ENCRYPTION_KEY must be ${KEY_LENGTH} bytes (${KEY_LENGTH * 2} hex chars). Got ${key.length} bytes.`);
    }

    return key;
}

/**
 * Encrypts a plain text string.
 * Returns formatted string: "iv:authTag:encryptedContent"
 * 
 * @param {string} text - The text to encrypt
 * @returns {string} - The encrypted string format
 */
function encrypt(text) {
    if (!text) throw new Error('Input text is required');

    const key = getKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    // Return formatted string: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a formatted encrypted string.
 * Format expected: "iv:authTag:encryptedContent"
 * 
 * @param {string} encryptedString - The formatted string to decrypt
 * @returns {string} - The decrypted plain text
 */
function decrypt(encryptedString) {
    if (!encryptedString) throw new Error('Encrypted string is required');

    const parts = encryptedString.split(':');
    if (parts.length !== 3) {
        throw new Error('Invalid encrypted string format. Expected iv:authTag:content');
    }

    const [ivHex, authTagHex, contentHex] = parts;

    const key = getKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(contentHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

// Export functions
module.exports = {
    encrypt,
    decrypt
};
