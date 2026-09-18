const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with the SERVICE ROLE KEY to bypass RLS securely
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event) => {
  // 1. Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    // 2. Verify the webhook signature to ensure it's actually from Stripe
    stripeEvent = await stripe.webhooks.constructEventAsync(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // 3. Handle successful checkout sessions
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;

    // Extract the user ID (Payment Links pass this in client_reference_id)
    const userId = session.client_reference_id;
    
    // Extract the amount paid (Stripe returns this in cents, so divide by 100)
    const amountPaidDollars = session.amount_total / 100;

    if (userId) {
      try {
        // A. Add funds to the user's wallet using our safe RPC function
        const { error: rpcError } = await supabase.rpc('increment_wallet_balance', {
          user_id_input: userId,
          amount_to_add: amountPaidDollars
        });

        if (rpcError) throw rpcError;

        // B. Log the transaction in the wallet_transactions table
        const { error: txError } = await supabase
          .from('wallet_transactions')
          .insert({
            user_id: userId,
            amount: amountPaidDollars,
            type: 'deposit', // <--- Fixed to match your DB Check Constraint!
            description: 'Added funds via Stripe',
            status: 'completed',
            external_reference: session.id
          });

        if (txError) throw txError;

        console.log(`Successfully added $${amountPaidDollars} to user ${userId}`);
      } catch (dbError) {
        console.error('Database update failed:', dbError);
        // Return detailed error to Stripe dashboard for easy debugging
        return { 
          statusCode: 500, 
          body: `Database Error: ${dbError.message || dbError.details || JSON.stringify(dbError)}` 
        };
      }
    } else {
      console.warn('No client_reference_id found in the Stripe session. Cannot assign credits.');
    }
  }

  // 4. Return a 200 response to acknowledge receipt of the event
  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};