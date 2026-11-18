/**
 * The gateway's payment methods as shown to donors (footer, checkout payment panel), as text — no third-party images.
 * INFORMATION only: what is actually accepted is decided by the gateway account (Moyasar; Apple Pay is a REVIEW row
 * in DECISIONS). Change it here, and the trust-row text `@@store.home.trust-payment-text` with it.
 */
export const PAYMENT_MARKS: readonly string[] = ['mada', 'Apple Pay', 'VISA', 'Mastercard'];
