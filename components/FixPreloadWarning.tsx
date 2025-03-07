'use client';

import { useEffect } from 'react';

/**
 * This component fixes the warning about preloaded resources not being used
 * by ensuring that all preloaded CSS files have the correct 'as' attribute.
 */
export default function FixPreloadWarning() {
  useEffect(() => {
    // Function to fix preload links
    const fixPreloadLinks = () => {
      // Find all preload links without an 'as' attribute or with incorrect 'as' attribute
      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      
      preloadLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.endsWith('.css') && link.getAttribute('as') !== 'style') {
          // Set the correct 'as' attribute for CSS files
          link.setAttribute('as', 'style');
          console.log('Fixed preload link:', href);
        }
      });
    };

    // Run once on mount
    fixPreloadLinks();

    // Also set up a MutationObserver to catch dynamically added preload links
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          fixPreloadLinks();
        }
      });
    });

    // Start observing the document head for added nodes
    observer.observe(document.head, { childList: true, subtree: true });

    // Clean up observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
} 