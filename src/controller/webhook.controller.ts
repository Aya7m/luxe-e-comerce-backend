import stripe from "../config/stripe.js";
import { Cart } from "../modules/cart/cart.model.js";
import { Order } from "../modules/orders/order.model.js";


export const stripeWebhook = async (req, res) => {
  console.log("🔥 WEBHOOK HIT");
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata?.userId;

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product"
    );

    if (!cart) return res.status(400).send("Cart not found");

    const items = cart.items.map((item: any) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await Order.create({
      user: userId,
      items,
      shippingAddress: {
        fullName: session.metadata?.fullName,
        phone: session.metadata?.phone,
        address: session.metadata?.address,
        city: session.metadata?.city,
      },
      paymentMethod: "card",
      totalPrice,
      status: "confirmed",
    });

const updatedCart = await Cart.findOneAndUpdate(
  { user: userId },
  { items: [] },
  { new: true }
);

console.log("UPDATED CART:", updatedCart);
  }


  res.json({ received: true });
};