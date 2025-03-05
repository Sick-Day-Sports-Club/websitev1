export default function Head() {
  // Get the Stripe publishable key from environment variables
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
  
  return (
    <>
      {/* Inject Stripe key directly into the page */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.STRIPE_PUBLISHABLE_KEY = "${stripeKey}";
            console.log("Injected Stripe key:", window.STRIPE_PUBLISHABLE_KEY ? "Set (value hidden)" : "Not set");
          `
        }}
      />
    </>
  );
} 