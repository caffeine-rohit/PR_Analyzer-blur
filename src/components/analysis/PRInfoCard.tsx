import { GitPullRequest, User, Calendar, GitBranch } from 'lucide-react';
import { PRData } from '../../utils/githubAPI';
import GlassCard from '../shared/GlassCard';

interface PRInfoCardProps {
  prData: PRData;
}

export default function PRInfoCard({ prData }: PRInfoCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (state: string, merged: boolean) => {
    if (merged) return 'text-primary';
    if (state === 'open') return 'text-accent';
    return 'text-text-muted';
  };

  const getStatusText = (state: string, merged: boolean) => {
    if (merged) return 'Merged';
    if (state === 'open') return 'Open';
    return 'Closed';
  };

  return (
    <GlassCard>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <GitPullRequest className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{prData.title}</h1>
            <p className="text-sm text-text-muted">
              #{prData.number} in {prData.repository}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            prData.state,
            prData.merged
          )} bg-surface-elevated`}
        >
          {getStatusText(prData.state, prData.merged)}
        </span>
      </div>

      {/* {prData.body && (
        <p className="text-text-secondary mb-6 line-clamp-3">{prData.body}</p>
      )} */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs text-text-muted">Author</p>
            <p className="text-sm font-medium text-foreground">{prData.author}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs text-text-muted">Created</p>
            <p className="text-sm font-medium text-foreground">
              {formatDate(prData.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs text-text-muted">Base</p>
            <p className="text-sm font-medium text-foreground">{prData.baseBranch}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-accent" />
          <div>
            <p className="text-xs text-text-muted">Head</p>
            <p className="text-sm font-medium text-foreground">{prData.headBranch}</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
