import { marked } from 'marked';

export const markdownify = (content) => {
  if (!content) return { __html: '' };
  return { __html: marked.parseInline(String(content)) };
};

export const humanize = (content) => {
  if (!content) return '';
  return content
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const plainify = (content) => {
  if (!content) return '';
  return String(content).replace(/<\/?[^>]+(>|$)/g, '').replace(/&[a-z]+;/gi, '');
};
