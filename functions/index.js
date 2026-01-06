
const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

// Securely define the secret key. 
// You must set this in your CLI using: firebase functions:secrets:set STRIPE_SECRET_KEY
const stripeSecret = defineSecret("STRIPE_SECRET_KEY");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");

/**
 * Securely creates a Stripe Payment Intent.
 * Only authenticated users can call this function.
 */
exports.createPaymentIntent = onCall(
  { secrets: [stripeSecret] },
  async (request) => {
    // 1. Authenticate the user
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "You must be logged in to initiate a payment."
      );
    }

    const { amount, currency = "usd", planId } = request.data;

    // 2. Validate input
    if (!amount || amount <= 0) {
      throw new HttpsError(
        "invalid-argument",
        "A valid amount greater than zero is required."
      );
    }

    const stripe = require("stripe")(stripeSecret.value());
    const customerId = request.auth.token.stripeCustomerId || null;

    try {
      // 3. Create the Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amounts in cents
        currency: currency.toLowerCase(),
        metadata: {
          firebaseUID: request.auth.uid,
          planId: planId || "standard",
        },
        // In a real app, you'd associate this with a Stripe Customer ID
        // customer: customerId, 
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log(`PaymentIntent created for user ${request.auth.uid}: ${paymentIntent.id}`);

      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
      };
    } catch (error) {
      console.error("Stripe Error:", error);
      throw new HttpsError("internal", error.message);
    }
  }
);

/**
 * Webhook handler to process Stripe events (e.g., successful payments).
 * This ensures your app state is updated even if the user closes the tab.
 */
exports.stripeWebhook = onRequest(
  { secrets: [stripeSecret, stripeWebhookSecret] },
  async (req, res) => {
    const stripe = require("stripe")(stripeSecret.value());
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      // Verify the event came from Stripe
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        stripeWebhookSecret.value()
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the specific event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        const uid = paymentIntent.metadata.firebaseUID;
        
        console.log(`Payment succeeded for user ${uid}! Updating credits...`);
        
        // Update Firestore or Database here
        // await admin.firestore().collection('users').doc(uid).update({
        //   credits: admin.firestore.FieldValue.increment(500),
        //   lastPaymentId: paymentIntent.id
        // });
        
        break;
      
      case "payment_intent.payment_failed":
        console.warn("Payment failed.");
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);
