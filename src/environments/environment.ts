/**
 * Development environment configuration
 * Keycloak integration settings for local development
 */
export const environment = {
  production: false,

  // API Configuration
  apiUrl: 'http://localhost:8081/',

  // Keycloak Configuration
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'logistics',
    clientId: 'logistics-frontend',
  },

  // Token Configuration
  tokenRefreshThreshold: 60, // seconds before expiry to refresh

  // Feature Flags
  features: {
    enableDevTools: true,
    enableMockData: false,
    enableAnalytics: false,
  },
} as const;

export type Environment = typeof environment;
