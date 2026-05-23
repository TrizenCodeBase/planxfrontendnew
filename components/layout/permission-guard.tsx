'use client';

import { useAppStore } from '@/lib/store';
import { Permission, ACCESS_SYMBOLS } from '@/lib/permissions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft, Eye, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface PermissionGuardProps {
  permission: Permission | Permission[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  readOnlyFallback?: React.ReactNode;
  ownOnlyFallback?: React.ReactNode;
}

export function PermissionGuard({
  permission,
  requireAll = false,
  children,
  fallback,
  readOnlyFallback,
  ownOnlyFallback,
}: PermissionGuardProps) {
  const { can, isReadOnly, isOwnOnly } = useAppStore();
  const perms = Array.isArray(permission) ? permission : [permission];

  const hasAccess = requireAll
    ? perms.every((p) => can(p))
    : perms.some((p) => can(p));

  if (hasAccess) return <>{children}</>;

  // Check if it's read-only instead of fully denied
  if (readOnlyFallback && perms.some((p) => isReadOnly(p))) {
    return <>{readOnlyFallback}</>;
  }

  if (ownOnlyFallback && perms.some((p) => isOwnOnly(p))) {
    return <>{ownOnlyFallback}</>;
  }

  if (fallback) return <>{fallback}</>;

  return null;
}

export function AccessDenied({ feature }: { feature: string }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px] p-8">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-1">
            You don&apos;t have permission to access <span className="font-medium text-foreground">{feature}</span>.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Contact your workspace admin to request access or a role upgrade.
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Button variant="outline" className="gap-2 text-xs">
              Request Access
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ReadOnlyBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
      <Eye className="w-3 h-3" />
      Read-only
    </span>
  );
}

export function OwnOnlyBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md">
      <Lock className="w-3 h-3" />
      Own items only
    </span>
  );
}

export function LimitedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md">
      ~ Limited access
    </span>
  );
}

export function AccessLevelBadge({ permission }: { permission: Permission }) {
  const { isReadOnly: checkRO, isOwnOnly: checkOO, isLimited, can } = useAppStore();

  if (can(permission) && !checkRO(permission) && !checkOO(permission) && !isLimited(permission)) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-md">
        {ACCESS_SYMBOLS.full} Full access
      </span>
    );
  }

  if (checkRO(permission)) return <ReadOnlyBadge />;
  if (checkOO(permission)) return <OwnOnlyBadge />;
  if (isLimited(permission)) return <LimitedBadge />;

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/40 bg-muted px-2 py-1 rounded-md">
      {ACCESS_SYMBOLS.none} No access
    </span>
  );
}
