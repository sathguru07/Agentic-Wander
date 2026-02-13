const crypto = require('crypto');
const { encrypt, decrypt } = require('./encryption.cjs');

console.log('--- ENCRYPTION DEMO START ---');

// 1. Generate a temporary key for this demo
const tempKey = crypto.randomBytes(32).toString('hex');
process.env.ENCRYPTION_KEY = tempKey;

console.log('\n[Key Setup]');
console.log('Generated Temporary Key:', tempKey);

// 2. Define sensitive data
const myPassword = "SuperSecretPassword123!";
console.log('\n[Input]');
console.log('Original Text:', myPassword);

// 3. Encrypt
try {
    const encryptedString = encrypt(myPassword);
    console.log('\n[Output - Store this in database]');
    console.log('Encrypted String:', encryptedString);
    console.log('Format:', 'IV : AuthTag : EncryptedContent');

    // 4. Decrypt
    const decryptedString = decrypt(encryptedString);
    console.log('\n[Decryption Verification]');
    console.log('Decrypted Text:', decryptedString);

    if (myPassword === decryptedString) {
        console.log('\n✅ SUCCESS: Decrypted text matches original!');
    } else {
        console.error('\n❌ ERROR: Text mismatch!');
    }
} catch (err) {
    console.error('\n❌ ERROR:', err.message);
}

console.log('\n--- ENCRYPTION DEMO END ---');
