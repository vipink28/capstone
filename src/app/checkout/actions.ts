"use server";
import { calculateTotal, getCartItems } from "@/lib/cart";
import { parseCheckoutForm } from "@/lib/checkout";
import { formatAddress } from "@/lib/format";
import { requireAuth } from "@/lib/session";
import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addAddress(
  prevState: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const user = await requireAuth();
  const field = (name: string) => String(formData.get(name) ?? "").trim();

  const fullName = field("fullName");
  const line1 = field("line1");
  const line2 = field("line2");
  const city = field("city");
  const state = field("state");
  const postalCode = field("postalCode");
  const phone = field("phone");

  const postalRegex = /^[1-9]\d{2}\d{3}$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  if (!fullName || !line1 || !city || !state) {
    return { error: "Please fill in every address field" };
  }

  if (!postalRegex.test(postalCode)) {
    return { error: "PIN code must be exactly 6 digits" };
  }

  if (!phoneRegex.test(phone)) {
    return { error: "Phone number must be exactly 10 digits" };
  }

  await db.orm.public.Address.create({
    userId: user.id,
    fullName,
    line1,
    line2,
    city,
    state,
    postalCode,
    phone,
  });

  revalidatePath("/checkout");
  return {};
}

export async function placeOrder(
  prevState: { error?: string },
  formData: FormData,
): Promise<{ error?: string; message?: string }> {
  const user = await requireAuth();
  const input = parseCheckoutForm(formData);

  if (!input.ok) {
    return { error: input.error };
  }

  const address = await db.orm.public.Address.where({
    id: input.addressId,
    userId: user.id,
  }).first();

  if (!address) {
    return { error: "Please choose a valid delivery address" };
  }

  const { cart, items } = await getCartItems(user.id);
  if (items.length === 0) {
    return { error: "your cart is empty" };
  }

  const unavailable = items.find((item) => !item.product.inStock);
  if (unavailable) {
    return { error: `${unavailable.product.name} is out of stock` };
  }

  const total = calculateTotal(items);
  const addressText = formatAddress(address);

  const status =
    input.paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "PAID";

  let orderId = 0;
  await db.transaction(async (tx) => {
    const order = await tx.orm.public.Order.create({
      userId: user.id,
      total,
      status,
      addressText,
      PaymentMethod: input.paymentMethod,
    });
    await tx.orm.public.OrderItem.createAll(
      items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      })),
    );
    await tx.orm.public.CartItem.where({ cartId: cart.id }).deleteAndCount();
    orderId = order.id;
  });

  revalidatePath("/", "layout");
  redirect(`/orders/${orderId}`);
}
