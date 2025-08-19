import { Product } from "@/types/product";
import blackTshirt from "@/assets/products/black-tshirt.jpg";
import blueJeans from "@/assets/products/blue-jeans.jpg";
import whiteDress from "@/assets/products/white-dress.jpg";
import leatherJacket from "@/assets/products/leather-jacket.jpg";

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    price: 49,
    originalPrice: 65,
    image: blackTshirt,
    category: "T-Shirts",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Gray", "Navy"],
    description: "Ultra-soft premium cotton t-shirt with a modern fit. Perfect for everyday wear or layering.",
    isNew: true,
    isSale: true
  },
  {
    id: "2",
    name: "Classic Denim Jeans",
    price: 89,
    image: blueJeans,
    category: "Jeans",
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Blue", "Black", "Light Blue", "Dark Blue"],
    description: "Timeless denim jeans crafted from premium cotton blend. Classic fit with modern styling.",
    isNew: false
  },
  {
    id: "3",
    name: "Elegant Summer Dress",
    price: 129,
    originalPrice: 159,
    image: whiteDress,
    category: "Dresses",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Cream", "Light Pink", "Sky Blue"],
    description: "Flowing summer dress perfect for any occasion. Made from breathable fabric with elegant draping.",
    isNew: true,
    isSale: true
  },
  {
    id: "4",
    name: "Luxury Leather Jacket",
    price: 299,
    image: leatherJacket,
    category: "Jackets",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Brown", "Black", "Tan"],
    description: "Handcrafted leather jacket made from premium materials. A timeless piece for your wardrobe.",
    isNew: false
  },
  {
    id: "5",
    name: "Cashmere Sweater",
    price: 159,
    image: blackTshirt, // Reusing for demo
    category: "Sweaters",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Beige", "Gray", "Navy", "Cream"],
    description: "Luxurious cashmere sweater with ribbed details. Soft, warm, and incredibly comfortable.",
    isNew: true
  },
  {
    id: "6",
    name: "Designer Sneakers",
    price: 189,
    originalPrice: 229,
    image: whiteDress, // Reusing for demo
    category: "Shoes",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: ["White", "Black", "Gray"],
    description: "Contemporary designer sneakers with premium materials and superior comfort.",
    isSale: true
  }
];