import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useSEO(title: string, description: string) {
  const location = useLocation();
  const baseUrl = "https://hampton-roads-lawn-care.nealfrazier.tech";
  const canonicalUrl = `${baseUrl}${location.pathname === '/' ? '' : location.pathname}`;

  useEffect(() => {
    const fullTitle = `${title} | HappyLawns Hampton Roads`;
    document.title = fullTitle;
    
    // Update meta description
    const updateMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('description', description);
    
    // OG Tags
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:url', canonicalUrl, true);
    updateMeta('og:image', `${baseUrl}/og-image.svg`, true);

    // Twitter Tags
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:url', canonicalUrl);
    updateMeta('twitter:image', `${baseUrl}/og-image.svg`);

    // Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

  }, [title, description, canonicalUrl]);
}
