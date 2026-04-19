import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import config from '@/config/config.json';
import { plainify } from '@/utils/textConverter';

const SeoMeta = ({ title, meta_title, image, description }) => {
  const { meta_image, meta_author, meta_description } = config.metadata;
  const { base_url } = config.site;
  const { pathname } = useLocation();

  const resolvedTitle = plainify(meta_title || title || config.site.title);
  const resolvedDesc = plainify(description || meta_description);
  const resolvedImage = `${base_url}${image || meta_image}`;

  useEffect(() => {
    document.title = resolvedTitle;

    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', resolvedDesc);
    setMeta('name', 'author', meta_author);
    setMeta('property', 'og:title', resolvedTitle);
    setMeta('property', 'og:description', resolvedDesc);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', `${base_url}/${pathname.replace('/', '')}`);
    setMeta('property', 'og:image', resolvedImage);
    setMeta('name', 'twitter:title', resolvedTitle);
    setMeta('name', 'twitter:description', resolvedDesc);
    setMeta('name', 'twitter:image', resolvedImage);
    setMeta('name', 'twitter:card', 'summary_large_image');
  }, [resolvedTitle, resolvedDesc, resolvedImage, base_url, meta_author, pathname]);

  return null;
};

export default SeoMeta;
