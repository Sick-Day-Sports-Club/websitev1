import { customAlphabet } from 'nanoid';

// Create a custom nanoid generator with only uppercase letters and numbers
const generateId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 3);

export function generateReferralCode(location: string, firstName: string): string {
  // Clean and format the location (take first word, uppercase)
  const cleanLocation = location.split(',')[0].trim().toUpperCase();
  
  // Clean and format the first name (uppercase)
  const cleanFirstName = firstName.trim().toUpperCase();
  
  // Generate random part
  const randomPart = generateId();
  
  // Combine parts
  return `${cleanLocation}-${cleanFirstName}-${randomPart}`;
}

export function isValidReferralCode(code: string): boolean {
  // Basic validation of the format: LOCATION-NAME-XXX
  const parts = code.split('-');
  if (parts.length !== 3) return false;
  
  const [location, name, random] = parts;
  
  // Check if all parts exist and are uppercase
  if (!location || !name || !random) return false;
  if (location !== location.toUpperCase()) return false;
  if (name !== name.toUpperCase()) return false;
  if (random.length !== 3) return false;
  
  // Check if random part contains only valid characters
  const validChars = /^[0-9A-Z]+$/;
  if (!validChars.test(random)) return false;
  
  return true;
}

export function extractLocationFromCode(code: string): string | null {
  if (!isValidReferralCode(code)) return null;
  return code.split('-')[0];
}

export function extractNameFromCode(code: string): string | null {
  if (!isValidReferralCode(code)) return null;
  return code.split('-')[1];
} 