import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

// Use a specific API version for better security and stability
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
  typescript: true, // Enable TypeScript support
  appInfo: {
    name: 'Sick Day Sports Club',
    version: '1.0.0',
  },
});

// Add security headers for Stripe webhook endpoints
export const stripeWebhookConfig = {
  api: {
    bodyParser: false, // Disable body parsing for webhook endpoints
  },
};

export default stripe;

export async function createReferralCoupon(referralId: string): Promise<string> {
  try {
    // Create a unique coupon for this referral with expiration
    const coupon = await stripe.coupons.create({
      percent_off: 50,
      duration: 'once',
      max_redemptions: 1, // Limit to one use
      redeem_by: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
      metadata: {
        referral_id: referralId,
        type: 'referral_reward'
      },
      name: '50% Off First Monthly Payment - Referral Reward'
    });

    return coupon.id;
  } catch (error) {
    console.error('Error creating Stripe coupon:', error);
    throw error;
  }
}

export async function applyReferralDiscount(customerId: string, couponId: string): Promise<void> {
  try {
    // Retrieve the customer's subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'active'
    });

    if (subscriptions.data.length === 0) {
      throw new Error('No active subscription found');
    }

    // Apply the coupon to the subscription
    await stripe.subscriptions.update(subscriptions.data[0].id, {
      coupon: couponId,
      proration_behavior: 'always_invoice' // Ensure proper proration
    });
  } catch (error) {
    console.error('Error applying referral discount:', error);
    throw error;
  }
} 