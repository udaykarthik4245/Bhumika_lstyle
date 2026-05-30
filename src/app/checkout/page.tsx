'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, MapPin, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useAdminProducts } from '@/context/AdminProductsContext';
import { formatINR } from '@/lib/utils';
import { Address } from '@/lib/types';

type Step = 1 | 2 | 3;

export default function CheckoutPage() {
  const cart = useCart();
  const { user, addAddress, placeOrder } = useAuth();
  const { products } = useAdminProducts();
  const toast = useToast();
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [selectedAddrId, setSelectedAddrId] = useState<string | null>(
    user?.addresses.find((a) => a.isDefault)?.id || user?.addresses[0]?.id || null
  );
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'upi' | 'netbanking'>(
    'cod'
  );
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    name: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home',
  });
  const [showAddrForm, setShowAddrForm] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Please log in to checkout</h1>
        <Link href="/login?next=/checkout" className="btn-primary inline-flex mt-4">
          Login
        </Link>
      </div>
    );
  }

  const items = cart.items
    .map((i) => ({ item: i, product: products.find((p) => p.id === i.productId) }))
    .filter((x): x is { item: typeof x.item; product: NonNullable<typeof x.product> } => !!x.product);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Your cart is empty</h1>
        <Link href="/products" className="btn-primary inline-flex mt-4">
          Shop Now
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((s, { item, product }) => s + product.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handlePlace = () => {
    const addr = user.addresses.find((a) => a.id === selectedAddrId);
    if (!addr) {
      toast.show('Please select a delivery address', 'error');
      return;
    }
    const order = placeOrder({
      items: items.map(({ item, product }) => ({
        productId: product.id,
        quantity: item.quantity,
        name: product.name,
        price: product.price,
        image: product.images[0],
      })),
      subtotal,
      shipping,
      tax,
      total,
      status: 'placed',
      paymentMethod,
      address: addr,
    });
    cart.clear();
    toast.show('Order placed successfully!');
    router.push(`/account/orders?placed=${order.id}`);
  };

  const handleSaveAddr = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.line1 || !newAddress.pincode) {
      toast.show('Please fill all required address fields', 'error');
      return;
    }
    addAddress(newAddress);
    setShowAddrForm(false);
    setNewAddress({ ...newAddress, line1: '', line2: '', city: '', state: '', pincode: '' });
    toast.show('Address saved');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Progress */}
      <div className="flex items-center justify-between mb-8 max-w-2xl">
        {[
          { n: 1, label: 'Address' },
          { n: 2, label: 'Payment' },
          { n: 3, label: 'Review' },
        ].map(({ n, label }, i, arr) => (
          <div key={n} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${step >= n ? 'bg-brand-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}
              >
                {step > n ? <CheckCircle2 className="w-4 h-4" /> : n}
              </div>
              <span className="text-sm">{label}</span>
            </div>
            {i < arr.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-3 ${step > n ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-800'}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-4">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="card p-5 animate-fade-in">
              <h2 className="font-semibold flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4" /> Delivery Address
              </h2>
              <div className="space-y-2">
                {user.addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`block p-3 border rounded cursor-pointer transition ${selectedAddrId === a.id ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
                  >
                    <input
                      type="radio"
                      name="addr"
                      checked={selectedAddrId === a.id}
                      onChange={() => setSelectedAddrId(a.id)}
                      className="mr-2 accent-brand-500"
                    />
                    <span className="font-medium text-sm">{a.name}</span>
                    <span className="ml-2 text-xs uppercase bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                      {a.type}
                    </span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {a.line1}
                      {a.line2 && `, ${a.line2}`}, {a.city}, {a.state} - {a.pincode}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Phone: {a.phone}</p>
                  </label>
                ))}
              </div>
              {!showAddrForm ? (
                <button
                  onClick={() => setShowAddrForm(true)}
                  className="text-sm text-brand-500 hover:underline mt-3"
                >
                  + Add new address
                </button>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <input
                    placeholder="Full Name *"
                    className="input"
                    value={newAddress.name}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, name: e.target.value })
                    }
                  />
                  <input
                    placeholder="Phone *"
                    className="input"
                    value={newAddress.phone}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, phone: e.target.value })
                    }
                  />
                  <input
                    placeholder="Address Line 1 *"
                    className="input col-span-2"
                    value={newAddress.line1}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, line1: e.target.value })
                    }
                  />
                  <input
                    placeholder="Address Line 2"
                    className="input col-span-2"
                    value={newAddress.line2}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, line2: e.target.value })
                    }
                  />
                  <input
                    placeholder="City"
                    className="input"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                  />
                  <input
                    placeholder="State"
                    className="input"
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, state: e.target.value })
                    }
                  />
                  <input
                    placeholder="Pincode *"
                    className="input"
                    value={newAddress.pincode}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, pincode: e.target.value })
                    }
                  />
                  <select
                    className="input"
                    value={newAddress.type}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        type: e.target.value as Address['type'],
                      })
                    }
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="col-span-2 flex gap-2">
                    <button onClick={handleSaveAddr} className="btn-primary">
                      Save Address
                    </button>
                    <button
                      onClick={() => setShowAddrForm(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <button
                onClick={() => setStep(2)}
                disabled={!selectedAddrId}
                className="btn-primary mt-5 w-full md:w-auto"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="card p-5 animate-fade-in">
              <h2 className="font-semibold flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4" /> Payment Method
              </h2>
              <div className="space-y-2">
                {[
                  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when you receive' },
                  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Rupay' },
                  { id: 'upi', label: 'UPI', sub: 'Google Pay, PhonePe, Paytm' },
                  { id: 'netbanking', label: 'Net Banking', sub: 'All major banks' },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`block p-3 border rounded cursor-pointer transition ${paymentMethod === m.id ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
                  >
                    <input
                      type="radio"
                      checked={paymentMethod === m.id}
                      onChange={() => setPaymentMethod(m.id as any)}
                      className="mr-2 accent-brand-500"
                    />
                    <span className="font-medium text-sm">{m.label}</span>
                    <p className="text-xs text-slate-500 ml-6">{m.sub}</p>
                  </label>
                ))}
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setStep(1)} className="btn-outline">
                  Back
                </button>
                <button onClick={() => setStep(3)} className="btn-primary">
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="card p-5 animate-fade-in space-y-4">
              <h2 className="font-semibold">Review Your Order</h2>
              {items.map(({ item, product }) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="w-16 h-20 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/200?text=${encodeURIComponent(product.brand)}`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">{product.brand}</p>
                    <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatINR(product.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="flex gap-2 pt-3">
                <button onClick={() => setStep(2)} className="btn-outline">
                  Back
                </button>
                <button onClick={handlePlace} className="btn-primary flex-1">
                  Place Order ({formatINR(total)})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <aside className="card p-5 h-fit lg:sticky lg:top-32">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Items ({cart.itemCount})</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Shipping</span>
              <span>{shipping === 0 ? 'FREE' : formatINR(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tax</span>
              <span>{formatINR(tax)}</span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
