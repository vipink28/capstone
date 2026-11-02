interface Address {
  id: number;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  phone: string;
  postalCode: string;
}
export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatAddress(a: Address): string {
  return `${a.fullName}, ${a.line1}, ${a.line2}, ${a.city}, ${a.state}, ${a.postalCode}, Phone: ${a.phone}`;
}
