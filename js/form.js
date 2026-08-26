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

  const submitBtnDefaultHtml = submitBtn.innerHTML;

  // Field id → { input, error } — the error paragraph is `${id}-error`.
  const FIELDS = ['full-name', 'bits-id', 'email-local', 'phone-call-number', 'phone-whatsapp-number'];

  const BITS_ID_RE = /^[0-9]{4}[A-Z][0-9][A-Z]{2}[0-9]{4}[A-Z]$/i;
  const EMAIL_LOCAL_RE = /^[a-zA-Z0-9._-]+$/;
  const BITS_DOMAIN = 'dubai.bits-pilani.ac.in';

  // ── Data ──────────────────────────────────────────────────
  function collectFormData() {
    const emailLocal = document.getElementById('email-local').value.trim();

    const callCode   = document.getElementById('phone-call-code').value;
    const callNumber = document.getElementById('phone-call-number').value.trim();

    const waCode     = document.getElementById('phone-whatsapp-code').value;
    const waNumber   = document.getElementById('phone-whatsapp-number').value.trim();

    const data = {
      full_name:      document.getElementById('full-name').value.trim(),
      bits_id:        document.getElementById('bits-id').value.trim(),
      email:          emailLocal ? `${emailLocal}@${BITS_DOMAIN}` : '',
      phone_call:     callNumber ? `${callCode} ${callNumber}` : '',
      phone_whatsapp: waNumber   ? `${waCode} ${waNumber}` : '',
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

    const emailLocal = document.getElementById('email-local').value.trim();
    if (!emailLocal) {
      errors.push({ field: 'email-local', message: 'Please enter your email ID.' });
    } else if (!EMAIL_LOCAL_RE.test(emailLocal)) {
      errors.push({ field: 'email-local', message: 'Email ID can only contain letters, numbers, dots, hyphens, and underscores.' });
    }

    const callNumber = document.getElementById('phone-call-number').value.trim();
    if (!callNumber) {
      errors.push({ field: 'phone-call-number', message: 'Please enter a phone number we can call.' });
    } else if (digitCount(callNumber) < 7) {
      errors.push({ field: 'phone-call-number', message: 'Please enter a valid phone number.' });
    }

    const waNumber = document.getElementById('phone-whatsapp-number').value.trim();
    if (!waNumber) {
      errors.push({ field: 'phone-whatsapp-number', message: 'Please enter your WhatsApp number.' });
    } else if (digitCount(waNumber) < 7) {
      errors.push({ field: 'phone-whatsapp-number', message: 'Please enter a valid WhatsApp number.' });
    }

    return errors;
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
