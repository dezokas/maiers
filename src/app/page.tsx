"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Katalog from "@/components/Katalog";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import Toast from "@/components/Toast";
import { siteConfig, Product } from "@/config/site";

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cartCheckoutItem, setCartCheckoutItem] = useState<CartItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleAddToCart = (product: Product, size: number) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    showToast(
      `${product.name} (Ukuran EU ${size}) berhasil ditambahkan ke keranjang!`
    );
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (
    productId: string,
    size: number,
    newQty: number
  ) => {
    if (newQty <= 0) {
      handleRemoveItem(productId, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string, size: number) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.size === size)
      )
    );
    showToast("Item dihapus dari keranjang belanja.");
  };

  const handleHeroQuickOrder = () => {
    // Add default hero shoe (first catalog item) or open catalog
    const heroShoe = siteConfig.catalog[0];
    if (heroShoe) {
      handleAddToCart(heroShoe, heroShoe.sizes[0] || 42);
    }
  };

  const totalCartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutQRIS={(item) => setCartCheckoutItem(item)}
      />

      {/* Checkout Modal from Cart */}
      {cartCheckoutItem && (
        <CheckoutModal
          isOpen={true}
          onClose={() => setCartCheckoutItem(null)}
          product={cartCheckoutItem.product}
          size={cartCheckoutItem.size}
          quantity={cartCheckoutItem.quantity}
        />
      )}

      {/* Top Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero onQuickOrder={handleHeroQuickOrder} />
        <About />
        <Services />
        <Katalog onAddToCart={handleAddToCart} />
        <Testimonials />
        <FAQ />
        <Contact onShowToast={showToast} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
