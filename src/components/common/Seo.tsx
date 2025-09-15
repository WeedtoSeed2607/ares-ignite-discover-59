import { useEffect } from "react";

type SeoProps = {
  title: string;
  description?: string;
  canonical?: string;
  jsonLd?: Record<string, any>;
};

const Seo = ({ title, description, canonical, jsonLd }: SeoProps) => {
  useEffect(() => {
    document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }
    if (jsonLd) {
      let script = document.getElementById('jsonld') as HTMLScriptElement | null;
      if (!script) {
        const newScript = document.createElement('script');
        newScript.type = 'application/ld+json';
        newScript.id = 'jsonld';
        document.head.appendChild(newScript);
        script = newScript as HTMLScriptElement;
      }
      if (script) script.textContent = JSON.stringify(jsonLd);
    }
  }, [title, description, canonical, jsonLd]);

  return null;
};

export default Seo;
