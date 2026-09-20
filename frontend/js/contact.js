// contact.js — contact.html form logic
import { submitContactForm } from './api.js';

const form = document.getElementById('contact-form');

if (form) {
  const submitBtn = document.getElementById('contact-submit');
  const submitLabel = document.getElementById('contact-submit-label');
  const statusEl = document.getElementById('form-status');

  const fields = {
    name: { el: document.getElementById('name'), errorEl: document.getElementById('error-name') },
    email: { el: document.getElementById('email'), errorEl: document.getElementById('error-email') },
    message: { el: document.getElementById('message'), errorEl: document.getElementById('error-message') },
  };

  function validate() {
    let isValid = true;

    if (!fields.name.el.value.trim()) {
      fields.name.errorEl.textContent = 'Please enter your name.';
      fields.name.el.setAttribute('aria-invalid', 'true');
      isValid = false;
    } else {
      fields.name.errorEl.textContent = '';
      fields.name.el.removeAttribute('aria-invalid');
    }

    const emailValue = fields.email.el.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue || !emailPattern.test(emailValue)) {
      fields.email.errorEl.textContent = 'Please enter a valid email address.';
      fields.email.el.setAttribute('aria-invalid', 'true');
      isValid = false;
    } else {
      fields.email.errorEl.textContent = '';
      fields.email.el.removeAttribute('aria-invalid');
    }

    if (!fields.message.el.value.trim()) {
      fields.message.errorEl.textContent = 'Please tell us what you want to automate.';
      fields.message.el.setAttribute('aria-invalid', 'true');
      isValid = false;
    } else {
      fields.message.errorEl.textContent = '';
      fields.message.el.removeAttribute('aria-invalid');
    }

    return isValid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    if (!validate()) {
      statusEl.textContent = 'Please fix the highlighted fields.';
      statusEl.classList.add('error');
      return;
    }

    const payload = {
      name: fields.name.el.value.trim(),
      company: document.getElementById('company').value.trim(),
      email: fields.email.el.value.trim(),
      phone: document.getElementById('phone').value.trim(),
      businessType: document.getElementById('businessType').value,
      message: fields.message.el.value.trim(),
    };

    submitBtn.disabled = true;
    submitLabel.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending...';

    try {
      await submitContactForm(payload);
      statusEl.textContent = "Thanks — we've received your message and will be in touch within 1 business day.";
      statusEl.classList.add('success');
      form.reset();
    } catch (err) {
      statusEl.textContent = 'Something went wrong. Please try again or contact us directly.';
      statusEl.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = 'Send Message';
    }
  });
}