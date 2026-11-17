import crypto from "crypto";

export function toPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

function safeEqualHex(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, "hex");
  const bufferB = Buffer.from(b, "hex");
  return (
    bufferA.length === bufferB.length &&
    crypto.timingSafeEqual(bufferA, bufferB)
  );
}

export function verifyPaymentSignature(
  keySecret: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string,
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  return safeEqualHex(signature, expectedSignature);
}

export function verifyWebhookSignature(
  webHookSecret: string,
  rawBody: string,
  signature: string,
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", webHookSecret)
    .update(rawBody)
    .digest("hex");
  return safeEqualHex(signature, expectedSignature);
}
