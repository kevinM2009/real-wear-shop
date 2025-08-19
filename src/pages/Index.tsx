import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import CartSidebar from "@/components/CartSidebar";
import QuickViewModal from "@/components/QuickViewModal";
import { Product, CartItem } from "@/types/product";
import { products } from "@/data/products";

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const addToCart = (product: Product, size: string, color: string) => {
    const existingItemIndex = cartItems.findIndex(
      item => 
        item.product.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        selectedSize: size,
        selectedColor: color
      };
      setCartItems([...cartItems, newItem]);
    }

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCartItems(prevItems =>
      prevItems.filter(item =>
        !(item.product.id === productId && 
          item.selectedSize === size && 
          item.selectedColor === color)
      )
    );

    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemsCount={totalItems}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <main>
        <Hero />
        <ProductGrid 
          products={products}
          onAddToCart={addToCart}
          onQuickView={setQuickViewProduct}
        />
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
      />

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16 mt-20">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">LUXE</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Premium fashion for the modern lifestyle. Quality, style, and sustainability in every piece.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>New Arrivals</li>
                <li>Women</li>
                <li>Men</li>
                <li>Accessories</li>
                <li>Sale</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Contact Us</li>
                <li>Size Guide</li>
                <li>Shipping Info</li>
                <li>Returns</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Newsletter</li>
                <li>Instagram</li>
                <li>Facebook</li>
                <li>Twitter</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm opacity-60">
            © 2024 LUXE Fashion. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;