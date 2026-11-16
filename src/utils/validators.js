import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from './constants';

/**
 * Validate an email address using regex.
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate a password — minimum 6 characters.
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, message: 'Password is required.' };
  }
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long.' };
  }
  return { valid: true, message: '' };
};

/**
 * Validate a file upload — check type and size.
 * @param {File} file
 * @returns {{ valid: boolean, message: string }}
 */
export const validateFileUpload = (file) => {
  if (!file) {
    return { valid: false, message: 'No file provided.' };
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, message: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.' };
  }
  if (file.size > MAX_FILE_SIZE) {
    const maxMB = MAX_FILE_SIZE / (1024 * 1024);
    return { valid: false, message: `File size exceeds ${maxMB}MB limit.` };
  }
  return { valid: true, message: '' };
};

/**
 * Validate all required fields for a report submission form.
 * @param {object} formData - The report form data
 * @param {string} formData.category - Category id
 * @param {string} formData.issueType - Issue type string
 * @param {string} formData.description - Issue description
 * @param {string} formData.severity - Severity id
 * @param {string} formData.locality - Locality name
 * @param {number} [formData.latitude] - Latitude
 * @param {number} [formData.longitude] - Longitude
 * @returns {{ valid: boolean, errors: object }}
 */
export const validateReportForm = (formData) => {
  const errors = {};

  if (!formData.category) {
    errors.category = 'Please select a category.';
  }

  if (!formData.issueType) {
    errors.issueType = 'Please select an issue type.';
  }

  if (!formData.title || formData.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters long.';
  }

  if (!formData.description || formData.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters long.';
  }

  if (!formData.severity) {
    errors.severity = 'Please select a severity level.';
  }

  if (!formData.locality || formData.locality.trim().length === 0) {
    errors.locality = 'Please enter the locality.';
  }

  if (formData.latitude === undefined || formData.latitude === null ||
      formData.longitude === undefined || formData.longitude === null) {
    errors.location = 'Please select a location on the map.';
  }

  const valid = Object.keys(errors).length === 0;
  return { valid, errors };
};
