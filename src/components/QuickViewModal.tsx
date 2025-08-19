import { useState } from "react";
import { X, ShoppingBag, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
}

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }: QuickViewModalProps) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }
    onAddToCart(product, selectedSize, selectedColor);
    onClose();
  };

  // Reset selections when product changes
  if (product && (!selectedSize || !product.sizes.includes(selectedSize))) {
    setSelectedSize(product.sizes[0] || "");
  }
  if (product && (!selectedColor || !product.colors.includes(selectedColor))) {
    setSelectedColor(product.colors[0] || "");
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Quick View - {product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  New
                </Badge>
              )}
              {product.isSale && (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  Sale
                </Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                  className="shrink-0"
                >
                  <Heart 
                    className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">{product.category}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(124 reviews)</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.isSale && (
                  <Badge variant="destructive">
                    Save ${product.originalPrice! - product.price}
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <Label className="text-base font-medium mb-3 block">Size</Label>
              <RadioGroup 
                value={selectedSize} 
                onValueChange={setSelectedSize}
                className="flex flex-wrap gap-2"
              >
                {product.sizes.map((size) => (
                  <div key={size} className="flex items-center">
                    <RadioGroupItem
                      value={size}
                      id={`size-${size}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`size-${size}`}
                      className="flex items-center justify-center w-12 h-12 border rounded-md cursor-pointer hover:border-accent peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-foreground transition-colors"
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Color Selection */}
            <div>
              <Label className="text-base font-medium mb-3 block">Color</Label>
              <RadioGroup 
                value={selectedColor} 
                onValueChange={setSelectedColor}
                className="flex flex-wrap gap-2"
              >
                {product.colors.map((color) => (
                  <div key={color} className="flex items-center">
                    <RadioGroupItem
                      value={color}
                      id={`color-${color}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`color-${color}`}
                      className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:border-accent peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-foreground transition-colors"
                    >
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      {color}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4 pt-4">
              <Button 
                className="w-full btn-hero"
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart - ${product.price}
              </Button>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Free shipping over $75
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  30-day returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;