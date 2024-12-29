interface ClarityEvent {
  name: string;
  properties?: Record<string, any>;
}

declare global {
  interface Window {
    clarity?: (method: string, ...args: any[]) => void;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const trackEvent = (event: ClarityEvent) => {
  // Track in Clarity
  if (window.clarity) {
    window.clarity('event', event.name, event.properties);
  }
  
  // Track in Google Analytics
  if (window.gtag) {
    window.gtag('event', event.name, event.properties);
  }
};

export const setUserProperties = (properties: Record<string, any>) => {
  // Set in Clarity
  if (window.clarity) {
    window.clarity('set', properties);
  }
  
  // Set in Google Analytics
  if (window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }
};

export const identifyUser = (userId: string) => {
  // Identify in Clarity
  if (window.clarity) {
    window.clarity('identify', userId);
  }
  
  // Identify in Google Analytics
  if (window.gtag) {
    window.gtag('set', 'user_id', userId);
  }
};
