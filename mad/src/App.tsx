import React from 'react';
import { Toaster } from './components/ui/sonner';
import { AuthScreen } from './components/AuthScreen';
import { SearchScreen } from './components/SearchScreen';
import { ItemDetailScreen } from './components/ItemDetailScreen';
import { ChatScreen } from './components/ChatScreen';
import { SellerDashboard } from './components/SellerDashboard';
import { ProfileScreen } from './components/ProfileScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNav } from './components/BottomNav';
import { Listing } from './lib/mock-data';
import { API_ENDPOINTS } from './config/api';

type Screen =
  | 'auth'
  | 'search'
  | 'itemDetail'
  | 'chat'
  | 'sell'
  | 'profile'
  | 'settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [currentScreen, setCurrentScreen] = React.useState<Screen>('search');
  const [selectedListing, setSelectedListing] = React.useState<Listing | null>(null);
  const [searchCategory, setSearchCategory] = React.useState<string | undefined>();
  const [searchQuery, setSearchQuery] = React.useState<string | undefined>();
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [selectedSellerId, setSelectedSellerId] = React.useState<string | null>(null);
  const [unreadChatCount, setUnreadChatCount] = React.useState(0);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://marketplace-backend-vtqh.onrender.com';

  // Check for existing token on app load
  React.useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verify token is still valid with backend
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (res.ok) {
            // Token is valid, user stays logged in
            setIsAuthenticated(true);
          } else {
            // Token expired or invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          // Network error or backend down, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  // Fetch unread chat count periodically
  React.useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/chats`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const unreadCount = (data.conversations || []).reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
          setUnreadChatCount(unreadCount);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    if (isAuthenticated) {
      fetchUnreadCount();
      // Poll every 5 seconds
      const interval = setInterval(fetchUnreadCount, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen('search');
  };

  const handleLogout = () => {
    // Clear localStorage on logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentScreen('auth');
  };

  const handleSelectListing = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentScreen('itemDetail');
  };

  const handleCategorySelect = (categoryId: string) => {
    setSearchCategory(categoryId);
    setSearchQuery(undefined);
    setCurrentScreen('search');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchCategory(undefined);
    setCurrentScreen('search');
  };

  const handleTabChange = (tab: string) => {
    setCurrentScreen(tab as Screen);
    if (tab !== 'search') {
      setSearchCategory(undefined);
      setSearchQuery(undefined);
    }
    if (tab !== 'itemDetail') {
      setSelectedListing(null);
    }
    // Clear preSelectedSellerId to show conversation list, not auto-open first chat
    if (tab === 'chat') {
      setSelectedSellerId(null);
    }
  };

  const handleBackFromDetail = () => {
    setCurrentScreen('search');
    setSelectedListing(null);
  };

  const handleChatFromDetail = () => {
    if (selectedListing?.sellerId) {
      setSelectedSellerId(selectedListing.sellerId);
    }
    setCurrentScreen('chat');
  };

  const handleBackFromSeller = () => {
    setCurrentScreen('profile');
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-5xl">🏺</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthScreen onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === 'search' && (
        <SearchScreen
          onSelectListing={handleSelectListing}
          initialCategory={searchCategory}
          initialSearch={searchQuery}
        />
      )}

      {currentScreen === 'itemDetail' && selectedListing && (
        <ItemDetailScreen
          listing={selectedListing}
          onBack={handleBackFromDetail}
          onChat={handleChatFromDetail}
        />
      )}

      {currentScreen === 'chat' && (
        <ChatScreen 
          onBack={() => {
            setCurrentScreen('search');
            setSelectedSellerId(null);
          }}
          preSelectedSellerId={selectedSellerId}
        />
      )}

      {currentScreen === 'sell' && <SellerDashboard onBack={handleBackFromSeller} />}

      {currentScreen === 'profile' && (
        <ProfileScreen
          onLogout={handleLogout}
          onSwitchToSeller={() => setCurrentScreen('sell')}
          onOpenSettings={() => setCurrentScreen('settings')}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen onBack={() => setCurrentScreen('profile')} />
      )}

      {currentScreen !== 'itemDetail' && currentScreen !== 'settings' && (
        <BottomNav activeTab={currentScreen} onTabChange={handleTabChange} unreadChatCount={unreadChatCount} />
      )}

      <Toaster />
    </div>
  );
}