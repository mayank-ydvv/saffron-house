/**
 * Reservation form: native constraint validation first, then business rules (closed days,
 * booking window, past times). Errors are inline with aria-invalid + aria-describedby, and
 * submit moves focus to the first invalid field.
 *
 * Persistence is isolated in `submitReservation`, so a Supabase insert can drop in later.
 */

export interface Reservation {
  name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
  occasion: string;
  requests: string;
}

type SubmitResult = { ok: true; reference: string } | { ok: false; message: string };

/** v1 has no backend. Replace this body with e.g. `supabase.from('reservations').insert(data)`. */
async function submitReservation(_data: Reservation): Promise<SubmitResult> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { ok: true, reference: `SH-${Math.random().toString(36).slice(2, 7).toUpperCase()}` };
}

const MESSAGES: Record<string, Partial<Record<keyof ValidityState, string>>> = {
  name: { valueMissing: 'Please tell us your name.', tooShort: 'Please enter your full name.' },
  email: { valueMissing: 'Please enter your email address.', typeMismatch: 'That email address doesn’t look quite right.' },
  phone: {
    valueMissing: 'Please enter a mobile number.',
    patternMismatch: 'Please enter a 10-digit Indian mobile number, for example +91 98765 43210.',
  },
  date: {
    valueMissing: 'Please choose a date.',
    rangeUnderflow: 'Please choose today or a later date.',
    badInput: 'Please enter a valid date.',
  },
  time: { valueMissing: 'Please choose a time.' },
  guests: { valueMissing: 'Please choose the number of guests.' },
};
const DAY_NAMES = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];

const form = document.getElementById('reserve-form') as HTMLFormElement | null;

if (form) {
  form.noValidate = true; // we render our own messages, after native checks
  const root = form.closest<HTMLElement>('[data-reserve-root]')!;
  const field = <T extends HTMLElement = HTMLInputElement>(name: string) => form.elements.namedItem(name) as unknown as T;
  const date = field('date');
  const time = field<HTMLSelectElement>('time');
  const requests = field<HTMLTextAreaElement>('requests');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const closedDays = new Set((form.dataset.closedDays ?? '').split(',').filter(Boolean).map(Number));
  const windowDays = Number(form.dataset.windowDays);
  MESSAGES.date!.rangeOverflow = `We take bookings up to ${windowDays} days ahead. For later dates, please call us.`;

  const iso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  /** Parse YYYY-MM-DD as a LOCAL date (new Date('2026-10-12') would be UTC and can shift a day). */
  const parseLocal = (value: string) => {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y!, m! - 1, d!);
  };

  const today = new Date();
  date.min = iso(today);
  date.max = iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + windowDays));

  /** Rules native validation can't express. */
  const businessError = (el: HTMLInputElement | HTMLSelectElement): string => {
    if (el === date && date.value) {
      const day = parseLocal(date.value).getDay();
      if (closedDays.has(day)) return `We are closed on ${DAY_NAMES[day]}. Please choose another day.`;
    }
    if (el === time && time.value && date.value === iso(new Date())) {
      const [h, m] = time.value.split(':').map(Number);
      const now = new Date();
      if (h! * 60 + m! <= now.getHours() * 60 + now.getMinutes() + 60) {
        return 'That seating is too soon for today. Please choose a later time or another day.';
      }
    }
    return '';
  };

  const messageFor = (el: HTMLInputElement | HTMLSelectElement): string => {
    if (!el.validity.valid) {
      const messages = MESSAGES[el.name] ?? {};
      for (const key in messages) {
        if (el.validity[key as keyof ValidityState]) return messages[key as keyof ValidityState]!;
      }
      return el.validationMessage;
    }
    return businessError(el);
  };

  const show = (el: HTMLInputElement | HTMLSelectElement, message: string) => {
    const error = root.querySelector<HTMLElement>(`[data-error-for="${el.name}"]`);
    if (!error) return;
    error.textContent = message;
    if (message) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
  };

  const validated = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select')].filter((el) =>
    root.querySelector(`[data-error-for="${el.name}"]`),
  );

  const validate = (el: HTMLInputElement | HTMLSelectElement) => {
    const message = messageFor(el);
    show(el, message);
    return !message;
  };

  // Validate a field when the visitor leaves it; clear errors as soon as it becomes valid.
  form.addEventListener('focusout', (e) => {
    const el = e.target as HTMLInputElement;
    if (validated.includes(el) && el.value) validate(el);
  });
  form.addEventListener('input', (e) => {
    const el = e.target as HTMLInputElement;
    if (el.getAttribute('aria-invalid') && !messageFor(el)) show(el, '');
  });
  // Dates and times are checked immediately: native date pickers can't disable weekdays.
  form.addEventListener('change', (e) => {
    const el = e.target as HTMLInputElement;
    if (el === date) {
      validate(date);
      if (time.value) validate(time);
    } else if (el === time) validate(time);
  });

  // Character counter: visible count every keystroke; screen readers hear it only near the limit.
  const count = root.querySelector<HTMLElement>('[data-char-count]')!;
  const live = root.querySelector<HTMLElement>('[data-char-live]')!;
  requests.addEventListener('input', () => {
    const used = requests.value.length;
    const left = requests.maxLength - used;
    count.textContent = String(used);
    if (left <= 30 && left % 10 === 0) live.textContent = `${left} characters left.`;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const invalid = validated.filter((el) => !validate(el));
    if (invalid.length) {
      invalid[0]!.focus();
      status.textContent = `Please check ${invalid.length === 1 ? 'one field' : `${invalid.length} fields`}.`;
      return;
    }

    const data: Reservation = {
      name: field('name').value.trim(),
      email: field('email').value.trim(),
      phone: field('phone').value.trim(),
      date: date.value,
      time: time.value,
      guests: Number(field<HTMLSelectElement>('guests').value),
      occasion: field<HTMLSelectElement>('occasion').value,
      requests: requests.value.trim(),
    };

    submit.disabled = true;
    status.textContent = 'Sending your request…';
    const result = await submitReservation(data);
    submit.disabled = false;

    if (!result.ok) {
      status.textContent = result.message;
      return;
    }
    confirm(data, result.reference, time.selectedOptions[0]?.textContent ?? data.time);
  });

  function confirm(data: Reservation, reference: string, timeLabel: string) {
    const panel = root.querySelector<HTMLElement>('[data-confirmation]')!;
    const when = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(
      parseLocal(data.date),
    );
    const occasion = field<HTMLSelectElement>('occasion').selectedOptions[0]?.textContent ?? '';
    const rows: [string, string][] = [
      ['Reference', reference],
      ['Name', data.name],
      ['Date', when],
      ['Time', timeLabel],
      ['Guests', String(data.guests)],
      ['Occasion', data.occasion === 'none' ? '—' : occasion],
    ];
    if (data.requests) rows.push(['Requests', data.requests]);

    const list = panel.querySelector('[data-confirm-list]')!;
    list.replaceChildren(
      ...rows.map(([term, value]) => {
        const wrap = document.createElement('div');
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.className = 'text-sm text-muted';
        dd.className = 'mt-1 text-cream break-words';
        dt.textContent = term;
        dd.textContent = value; // textContent: visitor input is never parsed as HTML
        wrap.append(dt, dd);
        return wrap;
      }),
    );
    panel.querySelector('[data-confirm-lead]')!.textContent =
      `Thank you, ${data.name.split(' ')[0]}. We will confirm by email at ${data.email} within a few hours.`;

    form!.hidden = true;
    panel.hidden = false;
    panel.querySelector<HTMLElement>('#confirm-title')!.focus();
  }
}
