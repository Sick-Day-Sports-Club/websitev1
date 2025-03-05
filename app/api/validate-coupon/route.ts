import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// Test coupons for development
const TEST_COUPONS = {
  'BETA25': {
    id: 'BETA25',
    valid: true,
    percent_off: 25,
    amount_off: null
  },
  'BETA50': {
    id: 'BETA50',
    valid: true,
    percent_off: 50,
    amount_off: null
  },
  'BETA10OFF': {
    id: 'BETA10OFF',
    valid: true,
    percent_off: null,
    amount_off: 1000 // $10 in cents
  }
};

export async function POST(request: Request) {
  try {
    const { code, membershipType } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    // For development: Check test coupons first
    if (process.env.NODE_ENV === 'development' && TEST_COUPONS[code]) {
      const testCoupon = TEST_COUPONS[code];
      return NextResponse.json({
        code: testCoupon.id,
        percentOff: testCoupon.percent_off || 0,
        amountOff: testCoupon.amount_off ? testCoupon.amount_off / 100 : 0,
        valid: true
      });
    }

    // Retrieve the coupon from Stripe
    try {
      const coupon = await stripe.coupons.retrieve(code);
      
      if (!coupon.valid) {
        return NextResponse.json({ error: 'This coupon code is no longer valid' }, { status: 400 });
      }

      return NextResponse.json({
        code: coupon.id,
        percentOff: coupon.percent_off || 0,
        amountOff: coupon.amount_off ? coupon.amount_off / 100 : 0,
        valid: true
      });
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
} 