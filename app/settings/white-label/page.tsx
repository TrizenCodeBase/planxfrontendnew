'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AccessDenied } from '@/components/layout/permission-guard';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Layers, Upload, Palette, Check, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const accentColors = [
  { label: 'Blue', value: '#3b82f6', class: 'bg-blue-500' },
  { label: 'Green', value: '#10b981', class: 'bg-green-500' },
  { label: 'Orange', value: '#f59e0b', class: 'bg-amber-500' },
  { label: 'Red', value: '#ef4444', class: 'bg-red-500' },
  { label: 'Teal', value: '#14b8a6', class: 'bg-teal-500' },
  { label: 'Cyan', value: '#06b6d4', class: 'bg-cyan-500' },
];

const themePresets = [
  { id: 'default', name: 'PlanX Default', bg: '#0f1117', sidebar: '#0a0c12', accent: '#3b82f6' },
  { id: 'slate', name: 'Slate', bg: '#0f172a', sidebar: '#020617', accent: '#38bdf8' },
  { id: 'zinc', name: 'Zinc', bg: '#18181b', sidebar: '#09090b', accent: '#10b981' },
  { id: 'stone', name: 'Stone', bg: '#1c1917', sidebar: '#0c0a09', accent: '#f59e0b' },
];

const sidebarStyles = [
  { id: 'dark', label: 'Dark sidebar', description: 'Traditional dark sidebar' },
  { id: 'colored', label: 'Accent sidebar', description: 'Brand-colored sidebar' },
  { id: 'light', label: 'Light sidebar', description: 'Light sidebar on dark bg' },
];

export default function WhiteLabelPage() {
  const { can } = useAppStore();
  const [workspaceName, setWorkspaceName] = useState('PlanX');

  if (!can('whitelabel.manage')) {
    return <AppLayout title="White Label"><AccessDenied feature="White Label Settings" /></AppLayout>;
  }
  const [workspaceUrl, setWorkspaceUrl] = useState('planx');
  const [selectedAccent, setSelectedAccent] = useState('#3b82f6');
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [selectedSidebar, setSelectedSidebar] = useState('dark');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout title="White Label">
      <div className="p-6 max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">White Label</h2>
            <p className="text-sm text-muted-foreground">Customize your workspace branding and appearance</p>
          </div>
          <Button size="sm" className="text-xs gap-1.5" onClick={handleSave} disabled={saved}>
            {saved ? <><Check className="w-3.5 h-3.5" /> Saved</> : 'Save Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Settings */}
          <div className="lg:col-span-2 space-y-4">
            {/* Branding */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Workspace Identity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Workspace Name</Label>
                  <Input
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Workspace URL</Label>
                  <div className="flex gap-0">
                    <span className="h-9 px-3 text-sm bg-muted border border-border rounded-l-md border-r-0 flex items-center text-muted-foreground">
                      app.planx.io/
                    </span>
                    <Input
                      value={workspaceUrl}
                      onChange={(e) => setWorkspaceUrl(e.target.value)}
                      className="h-9 text-sm rounded-l-none"
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Logo</Label>
                  <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                      <Layers className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm text-muted-foreground text-center">
                      <span className="text-foreground font-medium">Upload logo</span>
                      <br />
                      PNG, SVG, or WebP. Max 2MB.
                    </div>
                    <Button variant="outline" size="sm" className="text-xs gap-1 mt-1">
                      <Upload className="w-3.5 h-3.5" /> Choose file
                    </Button>
                  </div>
                </div>

                {/* Favicon */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Favicon</Label>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4 text-white" />
                    </div>
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      <Upload className="w-3.5 h-3.5" /> Upload favicon
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Colors */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-500" />
                  <CardTitle className="text-sm">Accent Color</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-6 gap-2">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedAccent(color.value)}
                      className={cn(
                        'w-10 h-10 rounded-xl transition-all relative',
                        color.class,
                        selectedAccent === color.value && 'ring-2 ring-white ring-offset-2 ring-offset-background'
                      )}
                    >
                      {selectedAccent === color.value && (
                        <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Custom Color</Label>
                  <div className="flex gap-2">
                    <div
                      className="w-9 h-9 rounded-lg border border-border shrink-0"
                      style={{ backgroundColor: selectedAccent }}
                    />
                    <Input
                      value={selectedAccent}
                      onChange={(e) => setSelectedAccent(e.target.value)}
                      className="h-9 text-sm font-mono"
                      maxLength={7}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theme Presets */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Theme Preset</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {themePresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedTheme(preset.id)}
                      className={cn(
                        'rounded-lg p-3 text-left border transition-all',
                        selectedTheme === preset.id
                          ? 'border-blue-500 bg-blue-500/5'
                          : 'border-border hover:border-blue-500/40'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.bg }} />
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.sidebar }} />
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.accent }} />
                        </div>
                        {selectedTheme === preset.id && (
                          <Check className="w-3 h-3 text-blue-500 ml-auto" />
                        )}
                      </div>
                      <div className="text-xs font-medium">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Style */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Sidebar Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sidebarStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedSidebar(style.id)}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all',
                      selectedSidebar === style.id
                        ? 'border-blue-500 bg-blue-500/5'
                        : 'border-border hover:border-blue-500/40'
                    )}
                  >
                    <div>
                      <div className="text-sm font-medium">{style.label}</div>
                      <div className="text-xs text-muted-foreground">{style.description}</div>
                    </div>
                    {selectedSidebar === style.id && <Check className="w-4 h-4 text-blue-500 shrink-0" />}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right: Preview */}
          <div>
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl overflow-hidden border border-border" style={{ aspectRatio: '3/4' }}>
                  {/* Mock sidebar preview */}
                  <div className="flex h-full" style={{ backgroundColor: '#0a0c12' }}>
                    <div className="w-10 flex flex-col items-center py-3 gap-2" style={{ backgroundColor: '#06080f' }}>
                      <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: selectedAccent }}>
                        <Layers className="w-3 h-3 text-white" />
                      </div>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-4 h-1 rounded-full bg-white/10" />
                      ))}
                    </div>
                    <div className="flex-1 p-2 space-y-1.5" style={{ backgroundColor: '#0a0c12' }}>
                      <div className="text-xs font-semibold text-white/80 truncate">{workspaceName || 'Your Workspace'}</div>
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className={cn('h-2 rounded-full', i === 1 ? 'w-full' : i === 2 ? 'w-3/4' : 'w-5/6')}
                          style={{ backgroundColor: i === 1 ? selectedAccent + '40' : '#ffffff10' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Workspace URL</span>
                    <span className="font-mono text-blue-500">/{workspaceUrl || 'workspace'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Accent</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedAccent }} />
                      <span className="font-mono">{selectedAccent}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
