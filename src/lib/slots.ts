import type { SlotConfig } from '../types';

const toMinutes = (hhmm: string) => {
  const [h = 0, m = 0] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const toHHMM = (mins: number) => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

/** Every bookable seating from `open` to `close` inclusive, e.g. 19:00, 19:30 … 22:30. */
export function timeSlots({ open, close, stepMinutes }: SlotConfig): string[] {
  const slots: string[] = [];
  for (let t = toMinutes(open); t <= toMinutes(close); t += stepMinutes) slots.push(toHHMM(t));
  return slots;
}
