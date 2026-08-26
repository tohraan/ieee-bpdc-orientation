// ============================================================
// form.js — IEEE BPDC Site
// Registration form: validation, submission, success state.
// Runs only on register.html.
// ============================================================

(function () {
  const form = document.getElementById('registration-form');
  if (!form) return;

  const submitBtn    = document.getElementById('submit-btn');
  const errorBanner  = document.getElementById('form-error-banner');
  const successState = document.getElementById('success-state');
  const successName  = document.getElementById('success-name');
  const emailWarning = document.getElementById('email-warning');

  const submitBtnDefaultHtml = submitBtn.innerHTML;

  // Field id → { input, error } — the error paragraph is `${id}-error`.
  const FIELDS = ['full-name', 'bits-id', 'email', 'phone-call', 'phone-whatsapp'];

  const BITS_ID_RE = /^[0-9]{4}[A-Z][0-9][A-Z]{2}[0-9]{4}[A-Z]$/i;
  const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const BITS_DOMAIN = 'dubai.bits-pilani.ac.in';

  // ── Data ──────────────────────────────────────────────────
  function collectFormData() {
    const data = {
      full_name:      document.getElementById('full-name').value.trim(),
      bits_id:        document.getElementById('bits-id').value.trim(),
      email:          document.getElementById('email').value.trim(),
      phone_call:     document.getElementById('phone-call').value.trim(),
      phone_whatsapp: document.getElementById('phone-whatsapp').value.trim(),
    };
    // WhatsApp defaults to the calling number when left blank.
    if (!data.phone_whatsapp) data.phone_whatsapp = data.phone_call;
    return data;
  }

  function digitCount(value) {
    return (value.replace(/\D/g, '')).length;
  }

  // ── Validation ────────────────────────────────────────────
  // Runs on submit only — no inline validation while typing.
  function validateForm(data) {
    const errors = [];

    if (!data.full_name) {
      errors.push({ field: 'full-name', message: 'Please enter your full name.' });
    } else if (data.full_name.length < 2) {
      errors.push({ field: 'full-name', message: 'Name must be at least 2 characters.' });
    } else if (data.full_name.length > 100) {
      errors.push({ field: 'full-name', message: 'Name must be 100 characters or fewer.' });
    }

    if (!data.bits_id) {
      errors.push({ field: 'bits-id', message: 'Please enter your BITS ID.' });
    } else if (!BITS_ID_RE.test(data.bits_id)) {
      errors.push({ field: 'bits-id', message: 'That does not look like a BITS ID. Expected format: 2023A7PS0001U' });
    }

    if (!data.email) {
      errors.push({ field: 'email', message: 'Please enter your email address.' });
    } else if (!EMAIL_RE.test(data.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address.' });
    }

    if (!data.phone_call) {
      errors.push({ field: 'phone-call', message: 'Please enter a phone number we can call.' });
    } else if (digitCount(data.phone_call) < 7) {
      errors.push({ field: 'phone-call', message: 'Please enter a valid phone number.' });
    }

    // WhatsApp is optional, but must be valid when the user typed one.
    const rawWhatsapp = document.getElementById('phone-whatsapp').value.trim();
    if (rawWhatsapp && digitCount(rawWhatsapp) < 7) {
      errors.push({ field: 'phone-whatsapp', message: 'Please enter a valid WhatsApp number, or leave it blank.' });
    }

    return errors;
  }

  // A non-BITS address is allowed — just flagged.
  function renderEmailWarning(email) {
    const nonBits = email && EMAIL_RE.test(email) && !email.toLowerCase().endsWith(`@${BITS_DOMAIN}`);
    emailWarning.textContent = nonBits
      ? 'Heads up: this is not a BITS Pilani Dubai address. We will still reach out here.'
      : '';
    emailWarning.hidden = !nonBits;
  }

  // ── Error rendering ───────────────────────────────────────
  function clearErrors() {
    FIELDS.forEach((id) => {
      const input = document.getElementById(id);
      const error = document.getElementById(`${id}-error`);
      if (input) input.classList.remove('has-error');
      if (error) { error.textContent = ''; error.hidden = true; }
    });
    errorBanner.hidden = true;
    errorBanner.textContent = '';
  }

  function renderErrors(errors) {
    errors.forEach(({ field, message }) => {
      const input = document.getElementById(field);
      const error = document.getElementById(`${field}-error`);
      if (input) input.classList.add('has-error');
      if (error) { error.textContent = message; error.hidden = false; }
    });
    // Move the user to the first problem field.
    const first = document.getElementById(errors[0].field);
    if (first) {
      first.focus({ preventScroll: true });
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function showFormError(message) {
    errorBanner.textContent = message;
    errorBanner.hidden = false;
  }

  // ── Submit button state ───────────────────────────────────
  function setSubmitLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.innerHTML = loading
      ? '<span class="spinner" aria-hidden="true"></span> Submitting&hellip;'
      : submitBtnDefaultHtml;
  }

  // ── Success ───────────────────────────────────────────────
  function showSuccessState(fullName) {
    successName.textContent = fullName;
    form.hidden = true;
    successState.hidden = false;
    successState.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ── Submit ────────────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const data = collectFormData();
    renderEmailWarning(data.email);

    const errors = validateForm(data);
    if (errors.length) { renderErrors(errors); return; }

    if (navigator.onLine === false) {
      showFormError('No internet connection detected. Please reconnect and try again.');
      console.warn('Submit blocked: navigator.onLine is false');
      return;
    }

    setSubmitLoading(true);
    try {
      // Supabase is authoritative; the Sheets mirror swallows its own errors.
      await Promise.all([
        Supabase.insertRegistration(data),
        mirrorToSheets(data),
      ]);
      showSuccessState(data.full_name);
    } catch (err) {
      console.error('Registration submit failed:', err);
      showFormError('Something went wrong. Please try again or contact us at ieee_bpdc@dubai.bits-pilani.ac.in');
    } finally {
      setSubmitLoading(false);
    }
  });
})();
