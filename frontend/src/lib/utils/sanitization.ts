import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize user-generated HTML content safely.
 * Works on both client-side and server-side (isomorphic).
 */
export const sanitizeHTML = (html: string): string => {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
            'blockquote', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'span', 'div', 'img'
        ],
        ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'class', 'title'],
    });
};

/**
 * Strictly sanitize content, removing all HTML tags.
 */
export const sanitizeStrict = (text: string): string => {
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
};
