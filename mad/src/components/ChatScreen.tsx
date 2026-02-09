import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ArrowLeft, Send, Paperclip, MoreVertical } from 'lucide-react';
import { ChatMessage } from './ChatMessage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface ChatScreenProps {
  onBack: () => void;
  preSelectedSellerId?: string | null;
}

interface Conversation {
  user: { _id: string; name: string; email: string; phone: string };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface ChatMessage {
  _id: string;
  sender: { _id: string; name: string };
  receiver: { _id: string; name: string };
  message: string;
  read: boolean;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export function ChatScreen({ onBack, preSelectedSellerId }: ChatScreenProps) {
  const [selectedChat, setSelectedChat] = React.useState<string | null>(preSelectedSellerId || null);
  const [messageText, setMessageText] = React.useState('');
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Get current user from localStorage
  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Fetch conversations on mount
  React.useEffect(() => {
    fetchConversations();
  }, []);

  // Auto-refresh conversations every 3 seconds when viewing conversation list
  React.useEffect(() => {
    if (!selectedChat) {
      const interval = setInterval(() => {
        fetchConversations();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  // Auto-load chat if preSelectedSellerId is provided
  React.useEffect(() => {
    // Only run if we have a preSelectedSellerId (from clicking "Chat" on a product)
    if (!preSelectedSellerId || !currentUser) {
      return; // Don't do anything if no preSelectedSellerId
    }

    // Always open chat view when preSelectedSellerId is provided
    setSelectedChat(preSelectedSellerId);
    
    // Try to find existing conversation with null safety
    const conversation = conversations.find(
      (c) => c.user?._id === preSelectedSellerId
    );
    
    if (conversation && conversation.user) {
      // Existing conversation found
      const otherUser = conversation.user;
      setSelectedUser(otherUser as User);
      fetchChatHistory(otherUser._id);
    } else {
      // No existing conversation - fetch seller info and start new chat
      fetchSellerInfo(preSelectedSellerId);
    }
  }, [preSelectedSellerId, currentUser]);

  const fetchSellerInfo = async (sellerId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // First, try to find seller in existing conversations
      const existingConversation = conversations.find(
        (c) => c.user?._id === sellerId
      );

      if (existingConversation && existingConversation.user) {
        // Use seller info from conversation
        setSelectedUser(existingConversation.user as User);
      } else {
        // No existing conversation - try to fetch chat history to get seller info
        const response = await fetch(`${API_BASE_URL}/api/chats/${sellerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const messages = data.messages || [];

          // Try to get seller info from the chat messages
          let sellerData = null;
          for (const msg of messages) {
            if (msg.sender?._id === sellerId) {
              sellerData = msg.sender;
              break;
            }
            if (msg.receiver?._id === sellerId) {
              sellerData = msg.receiver;
              break;
            }
          }

          if (sellerData) {
            setSelectedUser(sellerData as User);
          } else {
            // No messages found, use placeholder
            setSelectedUser({
              _id: sellerId,
              name: 'Seller',
              email: '',
              phone: '',
            });
          }

          // Load the chat messages
          setChatMessages(messages);
        } else {
          // No chat history found, use placeholder
          setSelectedUser({
            _id: sellerId,
            name: 'Seller',
            email: '',
            phone: '',
          });
          setChatMessages([]);
        }
      }
    } catch (error) {
      console.error('Error fetching seller info:', error);
      setSelectedUser({
        _id: sellerId,
        name: 'Seller',
        email: '',
        phone: '',
      });
      setChatMessages([]);
    }
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/chats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      console.log('Conversations loaded:', data.conversations);
      
      // Sort by most recent conversation first
      const sorted = (data.conversations || []).sort((a, b) => {
        const dateA = new Date(a.timestamp || a.createdAt || 0).getTime();
        const dateB = new Date(b.timestamp || b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      
      setConversations(sorted);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    }
  };

  const fetchChatHistory = async (userId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/chats/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch chat history');
      const data = await response.json();
      console.log('Chat history loaded:', data.messages);
      setChatMessages(data.messages || []);

      // Mark messages as read
      await markAsRead(userId);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setChatMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch(`${API_BASE_URL}/api/chats/${userId}/mark-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSelectChat = async (conversation: Conversation) => {
    if (!conversation.user || !conversation.user._id) {
      console.error('Invalid conversation data');
      return;
    }

    const otherUser = conversation.user as User;
    setSelectedUser(otherUser);
    setSelectedChat(otherUser._id);
    await fetchChatHistory(otherUser._id);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat || !currentUser) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      console.log('Sending message to:', selectedChat);
      const response = await fetch(`${API_BASE_URL}/api/chats/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selectedChat,
          message: messageText,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      const data = await response.json();

      console.log('Message sent:', data);
      
      // Add new message to chat (backend returns "chat" not "message")
      const newMessage = data.chat || data.message;
      setChatMessages([
        ...chatMessages,
        newMessage,
      ]);

      // Update seller name if this is first message
      if (newMessage.receiver && newMessage.receiver.name) {
        setSelectedUser({
          _id: newMessage.receiver._id,
          name: newMessage.receiver.name,
          email: newMessage.receiver.email || '',
          phone: newMessage.receiver.phone || '',
        });
      }

      setMessageText('');
      
      // Refresh conversations immediately to show new/updated conversation
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!selectedChat) {
    return (
      <div className="pb-20">
        <div className="sticky top-0 bg-background z-40 border-b p-4">
          <h2 className="font-semibold">Messages</h2>
        </div>
        {conversations.length === 0 ? (
          <div className="p-8 text-center space-y-4">
            <p className="text-muted-foreground">No conversations yet</p>
            <p className="text-sm text-muted-foreground">
              Click "Chat" on a product to start messaging a seller
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {conversations.map((conv) => {
              // Skip conversation if user not populated
              if (!conv.user) return null;

              const otherUser = conv.user;

              // Format timestamp
              const formatTime = (timestamp) => {
                if (!timestamp) return '';
                const date = new Date(timestamp);
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                if (date.toDateString() === today.toDateString()) {
                  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                } else if (date.toDateString() === yesterday.toDateString()) {
                  return 'Yesterday';
                } else {
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
              };

              return (
                <div
                  key={otherUser._id}
                  className="p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors border-b last:border-b-0"
                  onClick={() => handleSelectChat(conv)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <Avatar className="size-14">
                        <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">
                          {otherUser.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {conv.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-semibold text-sm">{otherUser.name}</p>
                        <p className="text-xs text-muted-foreground flex-shrink-0">
                          {formatTime(conv.timestamp)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {conv.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="sticky top-0 bg-background z-40 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => {
              setSelectedChat(null);
              setChatMessages([]);
              setSelectedUser(null);
            }}>
              <ArrowLeft className="size-5" />
            </Button>
            <Avatar className="size-10">
              <AvatarFallback className="bg-amber-100 text-amber-700">
                {selectedUser?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedUser?.name}</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="size-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-20">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : chatMessages.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          chatMessages.map((message) => (
            <ChatMessage
              key={message._id}
              content={message.message}
              timestamp={new Date(message.createdAt)}
              isSender={message.sender._id === currentUser?._id}
              senderName={message.sender.name}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="fixed bottom-16 left-0 right-0 bg-background border-t p-4">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <Button variant="ghost" size="icon">
            <Paperclip className="size-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            size="icon"
            className="bg-amber-700 hover:bg-amber-800"
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Send className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
