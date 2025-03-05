import { NextResponse } from 'next/server';
import supabase from '@/utils/supabase';
import { isValidReferralCode } from '@/utils/referralCode';

export async function POST(req: Request) {
  try {
    const { referralCode } = await req.json();

    // First validate the format
    if (!isValidReferralCode(referralCode)) {
      return NextResponse.json({ isValid: false });
    }

    // Check if the referral code exists and get the discount details
    const { data: referral, error } = await supabase
      .from('referrals')
      .select('reward_constraints')
      .eq('stripe_coupon_id', referralCode)
      .single();

    if (error || !referral) {
      return NextResponse.json({ isValid: false });
    }

    const constraints = JSON.parse(referral.reward_constraints);
    
    // Validate that the referral is still usable
    if (constraints.max_uses && constraints.uses >= constraints.max_uses) {
      return NextResponse.json({ isValid: false });
    }

    return NextResponse.json({
      isValid: true,
      discountAmount: constraints.discount_value // This will be 50 for 50% off
    });

  } catch (error) {
    console.error('Error validating referral:', error);
    return NextResponse.json(
      { error: 'Failed to validate referral code' },
      { status: 500 }
    );
  }
} 