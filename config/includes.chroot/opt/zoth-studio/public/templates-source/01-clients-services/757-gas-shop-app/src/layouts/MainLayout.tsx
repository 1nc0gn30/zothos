import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Wallet, Clock, LogOut, Menu, X, Moon, Sun, Instagram, BookOpen } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useCartStore } from '../store/cartStore';
import { Logo } from '../components/Logo';
import SolanaLogo from '../components/SolanaLogo';
import AudioPlayer from '../components/AudioPlayer';

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const { signOut, profile } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { items } = useCartStore();

  const cartItemCount = items.reduce((acc, item) => acc + (item.quantity || 0), 0);

  const navLinks = [
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
    { name: 'Orders', path: '/orders', icon: Clock },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/shop" className="flex items-center space-x-2">
            <Logo className="h-8 w-8" />
            <span className="font-display font-bold text-xl tracking-tight">757 Gas Shop</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 text-sm font-semibold transition-all duration-300 hover:text-primary ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:scale-105'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <div className="h-4 w-px bg-border mx-2" />
            <Link to="/phantom-guide" className={`text-sm font-semibold transition-all duration-300 hover:text-primary ${location.pathname === '/phantom-guide' ? 'text-primary' : 'text-muted-foreground hover:scale-105'}`}>Phantom Guide</Link>
            <Link to="/solana-guide" className={`text-sm font-semibold transition-all duration-300 hover:text-primary ${location.pathname === '/solana-guide' ? 'text-primary' : 'text-muted-foreground hover:scale-105'}`}>Solana Guide</Link>
            <Link to="/cashapp-guide" className={`text-sm font-semibold transition-all duration-300 hover:text-primary ${location.pathname === '/cashapp-guide' ? 'text-primary' : 'text-muted-foreground hover:scale-105'}`}>Cash App Guide</Link>
            <Link to="/how-to-use" className={`text-sm font-semibold transition-all duration-300 hover:text-primary ${location.pathname === '/how-to-use' ? 'text-primary' : 'text-muted-foreground hover:scale-105'}`}>How to Use</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-all duration-200 hover:scale-110"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link to="/cart" className="relative p-2 rounded-full hover:bg-muted transition-all duration-200 hover:scale-110">
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold leading-none text-primary-foreground transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full glow-primary">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <div className="hidden md:flex items-center space-x-4 ml-4 pl-4 border-l border-border">
              <div className="text-sm font-medium">
                <span className="text-muted-foreground">Bal: </span>
                <span className="text-primary">{profile?.wallet_balance?.toFixed(2) || '0.00'}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 rounded-full hover:bg-destructive/10 transition-all duration-200 text-muted-foreground hover:text-destructive hover:scale-110"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-border space-y-2">
                <Link
                  to="/phantom-guide"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                    location.pathname === '/phantom-guide' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <span className="font-medium">Phantom Guide</span>
                </Link>
                <Link
                  to="/solana-guide"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                    location.pathname === '/solana-guide' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <span className="font-medium">Solana Guide</span>
                </Link>
                <Link
                  to="/cashapp-guide"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                    location.pathname === '/cashapp-guide' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <span className="font-medium">Cash App Guide</span>
                </Link>
                <Link
                  to="/how-to-use"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                    location.pathname === '/how-to-use' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="font-medium">How to Use</span>
                </Link>
              </div>
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="text-sm font-medium">
                  <span className="text-muted-foreground">Wallet Balance: </span>
                  <span className="text-primary">{profile?.wallet_balance?.toFixed(2) || '0.00'}</span>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut();
                  }}
                  className="flex items-center space-x-2 text-sm font-medium text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-10">
        <div className="container mx-auto px-4 flex flex-col items-center text-center text-sm text-muted-foreground">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <Logo className="h-6 w-6" />
            <span className="font-display font-bold text-lg text-foreground">757 Gas Shop</span>
          </div>
          
          <div className="flex items-center space-x-6 mb-6">
            <a href="https://instagram.com/t757gs" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://share.google/oGokRUUhlaPiu8aM0" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors font-bold" aria-label="Google Profile">
              Google
            </a>
            <a href="https://www.tripadvisor.com/Restaurant_Review-g58277-d34283806-Reviews-757_Gas_Shop-Virginia_Beach_Virginia.html" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors font-bold" aria-label="TripAdvisor">
              TripAdvisor
            </a>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mb-6">
            <a href="https://757gas.shop" className="hover:text-primary transition-colors">Main Site</a>
            <span className="text-border hidden sm:inline">•</span>
            <Link to="/support" className="hover:text-primary transition-colors">Support</Link>
            <span className="text-border hidden sm:inline">•</span>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <span className="text-border hidden sm:inline">•</span>
            <Link to="/cashapp-terms" className="hover:text-primary transition-colors">Cash App Terms</Link>
            <span className="text-border hidden sm:inline">•</span>
            <Link to="/phantom-guide" className="hover:text-primary transition-colors">Phantom Guide</Link>
            <span className="text-border hidden sm:inline">•</span>
            <Link to="/solana-guide" className="hover:text-primary transition-colors">Solana Guide</Link>
            <span className="text-border hidden sm:inline">•</span>
            <Link to="/cashapp-guide" className="hover:text-primary transition-colors">Cash App Guide</Link>
            <span className="text-border hidden sm:inline">•</span>
            <Link to="/how-to-use" className="hover:text-primary transition-colors">How to Use</Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <span className="text-xs text-muted-foreground">Powered by</span>
            <div className="flex items-center gap-2">
              <img src="/cashapp-logo.svg" alt="Cash App" className="h-5 w-5 rounded-sm" />
              <span className="text-xs font-bold text-foreground">Cash App</span>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-2">
              <SolanaLogo className="h-5 w-5" />
              <span className="text-xs font-bold text-foreground">Solana</span>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-2">
              <img src="/Phantom-Icon_App.svg" alt="Phantom" className="h-5 w-5" />
              <span className="text-xs font-bold text-foreground">Phantom</span>
            </div>
            <span className="text-border">•</span>
            <span className="text-xs font-bold text-foreground">Web3</span>
          </div>
          <p>&copy; {new Date().getFullYear()} 757 Gas. All rights reserved.</p>
          <p className="mt-2 text-xs">Premium cannabis pickup service in the 757 area.</p>
        </div>
      </footer>
      <AudioPlayer />
    </div>
  );
};

export default MainLayout;
