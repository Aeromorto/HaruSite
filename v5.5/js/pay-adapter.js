/**
 * GitHub Pages cannot send verification emails or accept payments.
 * Never report authentication/payment success from this static adapter.
 * See docs/REVIEW.md for the server requirements before enabling checkout.
 * The previous adapter API remains available, and fails closed.
 */
(function (global) {
  'use strict';
  const unavailable = () => Promise.resolve({ ok: false, error: 'NOT_CONNECTED' });
  global.HaruAuth = Object.freeze({ requestCode: unavailable, verifyCode: unavailable });
  global.HaruPay = Object.freeze({ applyCoupon: unavailable, createPayment: unavailable });
})(window);
