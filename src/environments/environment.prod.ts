/**
 * Production environment configuration
 * Keycloak integration settings for production deployment
 */
export const environment = {
  production: true,
  
  // API Configuration - Override with actual production URL
  apiUrl: 'https://api.logistics.example.com/api',
  
  // Keycloak Configuration - Override with actual production Keycloak
  keycloak: {
    url: 'https://auth.logistics.example.com',
    realm: 'logistics',
    clientId: 'logistics-frontend',
  },
  
  // Token Configuration
  tokenRefreshThreshold: 60,
  
  // Feature Flags
  features: {
    enableDevTools: false,
    enableMockData: false,
    enableAnalytics: true,
  },
} as const;

export type Environment = typeof environment;
