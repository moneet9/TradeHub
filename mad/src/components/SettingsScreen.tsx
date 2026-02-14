import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import {
  ArrowLeft,
  Bell,
  Lock,
  CreditCard,
  Globe,
  DollarSign,
  Shield,
  Mail,
  MessageSquare,
  Eye,
  ChevronRight,
  User,
  Trash2,
  Camera,
} from 'lucide-react';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '../config/api';

interface SettingsScreenProps {
  onBack: () => void;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [bidAlerts, setBidAlerts] = React.useState(true);
  const [messageAlerts, setMessageAlerts] = React.useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = React.useState(false);
  const [profileVisibility, setProfileVisibility] = React.useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [user, setUser] = React.useState<UserData | null>(null);
  const [editName, setEditName] = React.useState('');
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isChangeEmailDialogOpen, setIsChangeEmailDialogOpen] = React.useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  
  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setEditName(parsed.name);
      if (parsed.avatar) {
        setAvatarPreview(parsed.avatar);
      }
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      // Update user in localStorage
      const updatedUser = {
        ...user,
        name: editName,
        avatar: avatarPreview || user.avatar,
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditDialogOpen(false);
      
      toast.success('Profile updated successfully!');
      
      // Optionally trigger page reload to update profile everywhere
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail) {
      toast.error('Please enter a new email');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Missing auth token');
      }

      const res = await fetch(API_ENDPOINTS.CHANGE_EMAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update email');

      const updatedUser = {
        ...(user || {}),
        email: newEmail,
      } as UserData;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setNewEmail('');
      setIsChangeEmailDialogOpen(false);
      toast.success('Email updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update email');
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Please enter and confirm your new password');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Missing auth token');
      }

      const res = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update password');

      setNewPassword('');
      setConfirmPassword('');
      setIsChangePasswordDialogOpen(false);
      toast.success('Password updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    }
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-amber-50 to-background p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-xl">Settings & Preferences</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Account Settings */}
        <div>
          <h3 className="mb-3 text-amber-700">Account Settings</h3>
          <Card className="divide-y">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent">
                  <div className="flex items-center gap-3">
                    <User className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm">Edit Profile</p>
                      <p className="text-xs text-muted-foreground">
                        Name, photo, bio
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground" />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Update your profile information and avatar
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <Avatar className="size-24 border-2 border-amber-200">
                        <AvatarImage src={avatarPreview || user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-amber-100 text-amber-700 text-2xl">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 rounded-full size-10 p-0"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="size-4" />
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Click the camera icon to change your avatar
                    </p>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Email Display (read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Use the settings below to change your email
                    </p>
                  </div>
                </div>

                {/* Dialog Actions */}
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setEditName(user?.name || '');
                      setAvatarPreview(user?.avatar || '');
                      setAvatarFile(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Change Email */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm">Email Address</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || 'Not set'}
                  </p>
                </div>
              </div>
              <Dialog open={isChangeEmailDialogOpen} onOpenChange={(open) => {
                setIsChangeEmailDialogOpen(open);
                if (!open) {
                  setNewEmail('');
                }
              }}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-amber-700">
                    Change
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Email Address</DialogTitle>
                    <DialogDescription>
                      Update the email address for your account.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-email">New Email Address</Label>
                      <Input
                        id="new-email"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter new email"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsChangeEmailDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleChangeEmail}
                      className="bg-amber-600 hover:bg-amber-700"
                      disabled={!newEmail}
                    >
                      Update Email
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Change Password */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Lock className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm">Password</p>
                  <p className="text-xs text-muted-foreground">
                    Keep your account secure
                  </p>
                </div>
              </div>
              <Dialog open={isChangePasswordDialogOpen} onOpenChange={(open) => {
                setIsChangePasswordDialogOpen(open);
                if (!open) {
                  setNewPassword('');
                  setConfirmPassword('');
                }
              }}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-amber-700">
                    Change
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Set a new password for your account.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 characters)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsChangePasswordDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleChangePassword}
                      className="bg-amber-600 hover:bg-amber-700"
                      disabled={!newPassword || !confirmPassword}
                    >
                      Update Password
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        </div>

        <Separator />

        {/* Notifications */}
        <div>
          <h3 className="mb-3 text-amber-700">Notifications</h3>
          <Card className="divide-y">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="size-5 text-muted-foreground" />
                <Label htmlFor="push-notif" className="cursor-pointer">
                  Push Notifications
                </Label>
              </div>
              <Switch
                id="push-notif"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-muted-foreground" />
                <Label htmlFor="email-notif" className="cursor-pointer">
                  Email Notifications
                </Label>
              </div>
              <Switch
                id="email-notif"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="size-5 flex items-center justify-center text-muted-foreground">
                  🔨
                </div>
                <Label htmlFor="bid-alerts" className="cursor-pointer">
                  Auction Bid Alerts
                </Label>
              </div>
              <Switch
                id="bid-alerts"
                checked={bidAlerts}
                onCheckedChange={setBidAlerts}
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="size-5 text-muted-foreground" />
                <Label htmlFor="message-alerts" className="cursor-pointer">
                  New Message Alerts
                </Label>
              </div>
              <Switch
                id="message-alerts"
                checked={messageAlerts}
                onCheckedChange={setMessageAlerts}
              />
            </div>
          </Card>
        </div>

        <Separator />

        {/* Privacy & Security */}
        <div>
          <h3 className="mb-3 text-amber-700">Privacy & Security</h3>
          <Card className="divide-y">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Shield className="size-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="2fa" className="cursor-pointer">
                      Two-Factor Authentication
                    </Label>
                    {twoFactorAuth && (
                      <Badge variant="outline" className="text-xs">
                        Enabled
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add extra security to your account
                  </p>
                </div>
              </div>
              <Switch
                id="2fa"
                checked={twoFactorAuth}
                onCheckedChange={setTwoFactorAuth}
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Eye className="size-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="profile-visibility" className="cursor-pointer">
                    Public Profile
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Show your profile to others
                  </p>
                </div>
              </div>
              <Switch
                id="profile-visibility"
                checked={profileVisibility}
                onCheckedChange={setProfileVisibility}
              />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Lock className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm">Blocked Users</p>
                  <p className="text-xs text-muted-foreground">
                    Manage blocked accounts
                  </p>
                </div>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </div>
          </Card>
        </div>

        <Separator />

        {/* Payment Settings */}
        <div>
          <h3 className="mb-3 text-amber-700">Payment & Billing</h3>
          <Card className="divide-y">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm">Payment Methods</p>
                  <p className="text-xs text-muted-foreground">
                    2 cards saved
                  </p>
                </div>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm">Currency</p>
                  <p className="text-xs text-muted-foreground">
                    INR - Indian Rupee
                  </p>
                </div>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="size-5 flex items-center justify-center text-muted-foreground">
                  📄
                </div>
                <div>
                  <p className="text-sm">Billing History</p>
                  <p className="text-xs text-muted-foreground">
                    View past transactions
                  </p>
                </div>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </div>
          </Card>
        </div>

        <Separator />

        {/* App Preferences */}
        <div>
          <h3 className="mb-3 text-amber-700">App Preferences</h3>
          <Card className="divide-y">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Globe className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm">Language</p>
                  <p className="text-xs text-muted-foreground">
                    English (US)
                  </p>
                </div>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="size-5 flex items-center justify-center">🌙</div>
                <Label htmlFor="dark-mode" className="cursor-pointer">
                  Dark Mode
                </Label>
              </div>
              <Switch id="dark-mode" />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="size-5 flex items-center justify-center text-muted-foreground">
                  📍
                </div>
                <div>
                  <p className="text-sm">Location Services</p>
                  <p className="text-xs text-muted-foreground">
                    For local listings
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
        </div>

        <Separator />

        {/* Legal & About */}
        <div>
          <h3 className="mb-3 text-amber-700">Legal & About</h3>
          <Card className="divide-y">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="size-5 flex items-center justify-center text-muted-foreground">
                  📋
                </div>
                <p className="text-sm">Terms of Service</p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="size-5 flex items-center justify-center text-muted-foreground">
                  🔒
                </div>
                <p className="text-sm">Privacy Policy</p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="size-5 flex items-center justify-center text-muted-foreground">
                  ℹ️
                </div>
                <div>
                  <p className="text-sm">App Version</p>
                  <p className="text-xs text-muted-foreground">
                    v1.0.0 (Build 100)
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Separator />

        {/* Danger Zone */}
        <div>
          <h3 className="mb-3 text-destructive">Danger Zone</h3>
          <Card className="divide-y">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Trash2 className="size-5 text-destructive" />
                <div>
                  <p className="text-sm text-destructive">Delete Account</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete your account
                  </p>
                </div>
              </div>
              <ChevronRight className="size-5 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* App Info */}
        <div className="text-center text-xs text-muted-foreground pb-4">
          <p>Vintage Marketplace</p>
          <p className="mt-1">Made with ❤️ for antique collectors</p>
        </div>
      </div>
    </div>
  );
}
