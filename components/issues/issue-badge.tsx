import { cn } from '@/lib/utils';
import { Priority, IssueStatus, IssueType } from '@/lib/types';
import {
  AlertCircle, ArrowUp, ArrowRight, ArrowDown, Minus,
  Circle, Clock, Play, Eye, CheckCircle2, XCircle,
  Bug, Sparkles, Zap, CheckSquare, Layers, TestTube,
} from 'lucide-react';

const priorityConfig: Record<Priority, { icon: React.ComponentType<{ className?: string }>, label: string, className: string }> = {
  urgent: { icon: AlertCircle, label: 'Urgent', className: 'text-red-500' },
  high: { icon: ArrowUp, label: 'High', className: 'text-orange-500' },
  medium: { icon: ArrowRight, label: 'Medium', className: 'text-yellow-500' },
  low: { icon: ArrowDown, label: 'Low', className: 'text-blue-400' },
  none: { icon: Minus, label: 'No priority', className: 'text-muted-foreground' },
};

const statusConfig: Record<IssueStatus, { icon: React.ComponentType<{ className?: string }>, label: string, className: string }> = {
  backlog: { icon: Circle, label: 'Backlog', className: 'text-muted-foreground' },
  todo: { icon: Clock, label: 'Todo', className: 'text-muted-foreground' },
  in_progress: { icon: Play, label: 'In Progress', className: 'text-blue-500' },
  in_review: { icon: Eye, label: 'In Review', className: 'text-yellow-500' },
  testing: { icon: TestTube, label: 'Testing', className: 'text-orange-500' },
  done: { icon: CheckCircle2, label: 'Done', className: 'text-green-500' },
  cancelled: { icon: XCircle, label: 'Cancelled', className: 'text-muted-foreground/50' },
};

const typeConfig: Record<IssueType, { icon: React.ComponentType<{ className?: string }>, label: string, className: string }> = {
  bug: { icon: Bug, label: 'Bug', className: 'text-red-500' },
  feature: { icon: Sparkles, label: 'Feature', className: 'text-blue-500' },
  improvement: { icon: Zap, label: 'Improvement', className: 'text-yellow-500' },
  task: { icon: CheckSquare, label: 'Task', className: 'text-muted-foreground' },
  epic: { icon: Layers, label: 'Epic', className: 'text-purple-500' },
};

interface PriorityBadgeProps {
  priority: Priority;
  showLabel?: boolean;
  className?: string;
}

export function PriorityBadge({ priority, showLabel, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority] ?? priorityConfig.none;
  const Icon = config.icon;
  return (
    <span className={cn('flex items-center gap-1', config.className, className)}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {showLabel && <span className="text-xs">{config.label}</span>}
    </span>
  );
}

interface StatusBadgeProps {
  status: IssueStatus;
  showLabel?: boolean;
  className?: string;
}

export function StatusBadge({ status, showLabel, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.backlog;
  const Icon = config.icon;
  return (
    <span className={cn('flex items-center gap-1', config.className, className)}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {showLabel && <span className="text-xs">{config.label}</span>}
    </span>
  );
}

interface TypeBadgeProps {
  type: IssueType;
  showLabel?: boolean;
  className?: string;
}

export function TypeBadge({ type, showLabel, className }: TypeBadgeProps) {
  const config = typeConfig[type] ?? typeConfig.task;
  const Icon = config.icon;
  return (
    <span className={cn('flex items-center gap-1', config.className, className)}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {showLabel && <span className="text-xs">{config.label}</span>}
    </span>
  );
}
