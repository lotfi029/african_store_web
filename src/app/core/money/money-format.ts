import type { Locale } from '../i18n/i18n';
import { type Money, toHalalas } from './money';

/**
 * Display only: `"1750.00"` → `1,750.00` with Western digits in both locales — exactly what
 * `Intl.NumberFormat('ar-SA-u-nu-latn' | 'en-SA')` prints for a money string (money-format.spec compares the two over a
 * wide range), built from the integer halalas: no float is ever made. Whole riyals drop the decimals (`350`, not
 * `350.00`), as in the prototype's prices.
 *
 * W-01: no Intl here. The first `Intl.NumberFormat` for Arabic loads ICU locale data inside the hydration task
 * (~45–60 ms at Lighthouse's 4× CPU on `/ar/` and `/ar/p`), and the format is fixed: `,` thousands, `.` decimals; a
 * negative Arabic amount starts with U+200E (LEFT-TO-RIGHT MARK) before the minus, as ICU writes it.
 */
export function formatAmount(value: Money, locale: Locale): string {
  const halalas = toHalalas(value);
  const abs = Math.abs(halalas);
  const riyals = String(Math.trunc(abs / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const rest = abs % 100;
  const body = rest === 0 ? riyals : `${riyals}.${String(rest).padStart(2, '0')}`;
  if (halalas >= 0) return body;
  return locale === 'ar' ? `\u200E-${body}` : `-${body}`;
}

/** The currency label shown next to an amount (prototype `.cur`). */
export function currencyLabel(locale: Locale): string {
  return locale === 'ar' ? 'ر.س' : 'SAR';
}

export function formatMoney(value: Money, locale: Locale): string {
  return locale === 'ar'
    ? `${formatAmount(value, locale)} ${currencyLabel(locale)}`
    : `${currencyLabel(locale)} ${formatAmount(value, locale)}`;
}
