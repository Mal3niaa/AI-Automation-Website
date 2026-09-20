// api.js — centralized fetch wrapper for backend communication

const API_BASE_URL = window.__API_BASE_URL__ || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_) {
    // no JSON body
  }

  if (!response.ok) {
    const message = (data && data.message) || 'Something went wrong. Please try again or contact us directly.';
    throw new Error(message);
  }

  return data;
}

export function submitContactForm(payload) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function submitAutomationAudit(payload) {
  return request('/audit', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getAuditById(id) {
  return request(`/audit/${id}`, { method: 'GET' });
}

export function submitBooking(payload) {
  return request('/booking', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getServices() {
  return request('/services', { method: 'GET' });
}

export function getCaseStudies() {
  return request('/case-studies', { method: 'GET' });
}

export function login(credentials) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}