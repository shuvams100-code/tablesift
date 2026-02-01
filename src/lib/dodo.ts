import DodoPayments from 'dodopayments';

const isLiveMode = process.env.DODO_PAYMENTS_MODE === 'live_mode';

export const dodoClient = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    environment: isLiveMode ? 'live_mode' : 'test_mode',
});

export const DODO_BASE_URL = isLiveMode
    ? 'https://live.dodopayments.com'
    : 'https://test.dodopayments.com';
