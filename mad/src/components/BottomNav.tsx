import React from 'react';
import { Search, PlusCircle, MessageSquare, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadChatCount?: number;
}

export function BottomNav({ activeTab, onTabChange, unreadChatCount = 0 }: BottomNavProps) {
  const tabs = [
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'sell', icon: PlusCircle, label: 'Sell' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <div key={tab.id} className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                  isActive ? 'text-amber-700' : 'text-muted-foreground'
                }`}
              >
                <Icon className={`size-5 ${isActive ? 'fill-amber-700' : ''}`} />
                <span className="text-xs">{tab.label}</span>
              </Button>
              {tab.id === 'chat' && unreadChatCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 size-5 flex items-center justify-center p-0 text-xs">
                  {unreadChatCount > 9 ? '9+' : unreadChatCount}
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
