/** Footer newsletter: front-end validation and a success message only (no backend in v1). */
const form = document.getElementById('newsletter') as HTMLFormElement | null;

if (form) {
  const input = form.elements.namedItem('email') as HTMLInputElement;
  const message = document.getElementById('newsletter-msg')!;
  form.noValidate = true;

  const setError = (text: string) => {
    input.setAttribute('aria-invalid', 'true');
    message.className = 'mt-3 min-h-6 text-sm field-error';
    message.textContent = text;
  };

  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') && input.validity.valid) {
      input.removeAttribute('aria-invalid');
      message.textContent = '';
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.validity.valueMissing) return setError('Please enter your email address.');
    if (!input.validity.valid) return setError('That email address doesn’t look quite right.');

    input.removeAttribute('aria-invalid');
    message.className = 'mt-3 min-h-6 text-sm text-saffron';
    message.textContent = 'Thank you. The next letter arrives with the season’s menu.';
    form.reset();
  });
}

export {};
