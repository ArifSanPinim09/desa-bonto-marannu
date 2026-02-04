/**
 * Performance monitoring utilities
 */

/**
 * Report Web Vitals to analytics
 * This can be extended to send data to analytics services
 */
export function reportWebVitals(metric: any) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric)
  }

  // In production, you can send to analytics
  // Example: sendToAnalytics(metric)
}

/**
 * Prefetch critical resources
 */
export function prefetchCriticalResources() {
  if (typeof window === 'undefined') return

  // Prefetch critical fonts
  const fontLinks = document.querySelectorAll('link[rel="preload"][as="font"]')
  fontLinks.forEach((link) => {
    const href = link.getAttribute('href')
    if (href) {
      const prefetchLink = document.createElement('link')
      prefetchLink.rel = 'prefetch'
      prefetchLink.href = href
      document.head.appendChild(prefetchLink)
    }
  })
}

/**
 * Lazy load images below the fold
 */
export function setupLazyLoading() {
  if (typeof window === 'undefined') return
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    return
  }

  // Fallback for browsers that don't support native lazy loading
  const images = document.querySelectorAll('img[loading="lazy"]')
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        const src = img.dataset.src
        if (src) {
          img.src = src
          imageObserver.unobserve(img)
        }
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}
