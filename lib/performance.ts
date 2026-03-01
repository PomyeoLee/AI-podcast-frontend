/**
 * Utility functions for performance optimization
 */

/**
 * Dynamically load a script with defer attribute
 * @param src Script URL
 * @param id Optional ID for the script tag
 */
export function loadScriptDeferred(src: string, id?: string): void {
  if (typeof window === 'undefined') return;
  
  // Check if script already exists
  if (id && document.getElementById(id)) return;
  
  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  if (id) script.id = id;
  
  document.body.appendChild(script);
}

/**
 * Preconnect to a domain to establish early connection
 * @param domain Domain to preconnect to
 * @param crossOrigin Whether to include crossorigin attribute
 */
export function preconnect(domain: string, crossOrigin = true): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = domain;
  if (crossOrigin) link.crossOrigin = 'anonymous';
  
  document.head.appendChild(link);
}

/**
 * Prefetch a resource that will likely be needed soon
 * @param href URL to prefetch
 * @param as Resource type (e.g., 'image', 'script', 'style', 'font')
 */
export function prefetch(href: string, as?: string): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  if (as) link.setAttribute('as', as);
  
  document.head.appendChild(link);
}

/**
 * Lazy load images when they enter the viewport
 * This function sets up IntersectionObserver for all images with data-src attribute
 */
export function setupLazyLoading(): void {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.getAttribute('data-src');
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        
        observer.unobserve(img);
      }
    });
  });
  
  // Observe all images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach(img => {
    observer.observe(img);
  });
}

/**
 * Initialize performance optimizations
 * Call this function on the client side to set up all optimizations
 */
export function initPerformanceOptimizations(): void {
  if (typeof window === 'undefined') return;
  
  // Preconnect to API domain
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  if (apiUrl) {
    try {
      const url = new URL(apiUrl);
      preconnect(url.origin);
    } catch (e) {
      console.error('Invalid API URL for preconnect:', apiUrl);
    }
  }
  
  // Setup lazy loading for images
  if (document.readyState === 'complete') {
    setupLazyLoading();
  } else {
    window.addEventListener('load', setupLazyLoading);
  }
}
