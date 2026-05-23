'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { User, Bell, Palette, Shield, Upload } from 'lucide-react';
import { AccessDenied } from '@/components/layout/permission-guard';

export default function SettingsPage() {
  const { currentUser, theme, setTheme, can } = useAppStore();

  if (!can('settings.view')) {
    return <AppLayout title="Settings"><AccessDenied feature="Settings" /></AppLayout>;
  }

  return (
    <AppLayout title="Settings">
      <div className="p-6 max-w-[700px] mx-auto space-y-4">
        <h2 className="text-lg font-semibold mb-6">Settings</h2>

        {/* Profile */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <CardTitle className="text-sm">Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14">
                <AvatarFallback className="text-lg bg-blue-500 text-white font-semibold">
                  {currentUser.avatar}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <Upload className="w-3.5 h-3.5" /> Change avatar
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Full Name</Label>
                <Input defaultValue={currentUser.name} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input defaultValue={currentUser.email} className="h-9 text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Role</Label>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/10 text-blue-500 border-0 capitalize">{currentUser.role}</Badge>
              </div>
            </div>
            <Button size="sm" className="text-xs">Save Profile</Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-500" />
              <CardTitle className="text-sm">Appearance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Dark Mode</div>
                <div className="text-xs text-muted-foreground">Switch between light and dark theme</div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-500" />
              <CardTitle className="text-sm">Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Issue assignments', desc: 'When you are assigned to an issue' },
              { label: 'Mentions', desc: 'When someone mentions you' },
              { label: 'Sprint updates', desc: 'Sprint start, end, and goal changes' },
              { label: 'Status changes', desc: 'When issue status changes on your issues' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-center justify-between py-1">
                <div>
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <CardTitle className="text-sm">Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Current Password</Label>
              <Input type="password" placeholder="••••••••" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">New Password</Label>
              <Input type="password" placeholder="••••••••" className="h-9 text-sm" />
            </div>
            <Button size="sm" className="text-xs">Update Password</Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
