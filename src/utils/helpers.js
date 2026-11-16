import { CATEGORIES, STATUSES, SEVERITIES } from './constants';

/**
 * Get a category object by its id.
 * @param {string} id - Category id
 * @returns {object|undefined}
 */
export const getCategoryById = (id) => {
  return CATEGORIES.find((cat) => cat.id === id);
};

/**
 * Get a status object by its id.
 * @param {string} statusId - Status id
 * @returns {object|undefined}
 */
export const getStatusInfo = (statusId) => {
  return STATUSES.find((s) => s.id === statusId);
};

/**
 * Get a severity object by its id.
 * @param {string} severityId - Severity id
 * @returns {object|undefined}
 */
export const getSeverityInfo = (severityId) => {
  return SEVERITIES.find((s) => s.id === severityId);
};

/**
 * Format an ISO date string to "DD Mon YYYY".
 * @param {string} dateString - ISO date string
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * Format an ISO date string to "DD Mon YYYY, HH:MM".
 * @param {string} dateString - ISO date string
 * @returns {string}
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};

/**
 * Returns a human-readable relative time string like "X minutes ago".
 * @param {string} dateString - ISO date string
 * @returns {string}
 */
export const timeAgo = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
};

/**
 * Truncate text to a maximum length and add ellipsis.
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation (default 100)
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '…';
};
