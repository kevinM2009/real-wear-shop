import { useState } from "react";
import { ShoppingBag, Menu, X, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

const Header = ({ cartItemsCount, onCartClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight">LUXE</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Button variant="ghost" className="font-medium">
            New Arrivals
          </Button>
          <Button variant="ghost" className="font-medium">
            Women
          </Button>
          <Button variant="ghost" className="font-medium">
            Men
          </Button>
          <Button variant="ghost" className="font-medium">
            Accessories
          </Button>
          <Button variant="ghost" className="font-medium">
            Sale
          </Button>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={onCartClick}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground">
                {cartItemsCount}
              </Badge>
            )}
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start font-medium">
              New Arrivals
            </Button>
            <Button variant="ghost" className="w-full justify-start font-medium">
              Women
            </Button>
            <Button variant="ghost" className="w-full justify-start font-medium">
              Men
            </Button>
            <Button variant="ghost" className="w-full justify-start font-medium">
              Accessories
            </Button>
            <Button variant="ghost" className="w-full justify-start font-medium">
              Sale
            </Button>
            <div className="pt-2 border-t">
              <Button variant="ghost" className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Account
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;