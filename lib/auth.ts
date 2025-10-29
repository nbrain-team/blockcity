// Simple authentication utilities

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin',
  role: 'admin',
};

export const COMPANY_CREDENTIALS = {
  username: 'client',
  password: 'client',
  role: 'company',
};

export const ROGUE_VANS_CREDENTIALS = {
  username: 'roguevans',
  password: '123456',
  role: 'brand', // Updated to use brand terminology
};

export function validateCredentials(username: string, password: string) {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    return { valid: true, role: 'admin', username };
  }
  
  // Support both 'company' and 'brand' for backward compatibility
  if (username === COMPANY_CREDENTIALS.username && password === COMPANY_CREDENTIALS.password) {
    return { valid: true, role: 'brand', username }; // Return 'brand' role
  }
  
  if (username === ROGUE_VANS_CREDENTIALS.username && password === ROGUE_VANS_CREDENTIALS.password) {
    return { valid: true, role: 'brand', username };
  }
  
  return { valid: false, role: null, username: null };
}

// Helper to check if user is a brand/company
export function isBrandRole(role: string | null) {
  return role === 'brand' || role === 'company';
}

export function setAuthSession(role: string, username: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_role', role);
    localStorage.setItem('auth_username', username);
    localStorage.setItem('auth_timestamp', Date.now().toString());
  }
}

export function getAuthSession() {
  if (typeof window !== 'undefined') {
    const role = localStorage.getItem('auth_role');
    const username = localStorage.getItem('auth_username');
    const timestamp = localStorage.getItem('auth_timestamp');
    
    if (role && username && timestamp) {
      // Session expires after 24 hours
      const age = Date.now() - parseInt(timestamp);
      if (age < 24 * 60 * 60 * 1000) {
        return { role, username };
      }
    }
  }
  return null;
}

export function clearAuthSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_role');
    localStorage.removeItem('auth_username');
    localStorage.removeItem('auth_timestamp');
  }
}

