import Stripe from "stripe";
import {onCall} from "firebase-functions/v2/https";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const createPaymentIntent = onCall(
  async (request) => {
    const amount = request.data.amount;
    const currency = request.data.currency;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
      });
      return {
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  }
);
