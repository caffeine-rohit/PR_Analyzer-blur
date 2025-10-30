import { FileText, Plus, Minus, Clock, Brain, Loader2 } from 'lucide-react';
import { PRSummary } from '../../utils/prAnalyzer';
import GlassCard from '../shared/GlassCard';

interface AISummary {
  shortSummary: string;
  technicalSummary: string;
  businessImpact: string;
}

interface SummaryCardProps {
  summary: PRSummary;
  aiSummary?: AISummary | null;
  aiLoading?: boolean;
  prBody?: string | null;
}

export default function SummaryCard({ summary, aiSummary, aiLoading, prBody }: SummaryCardProps) {
  return (
    <GlassCard>
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6 text-primary" />
        Summary
      </h2>

      {/* AI-Powered Description Section */}
      <div className="mb-6 p-5 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI-Powered Analysis</h3>
        </div>
        
        {aiLoading ? (
          <div className="flex items-center gap-2 text-text-secondary py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating intelligent summary...</span>
          </div>
        ) : aiSummary ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase mb-1.5">Overview</h4>
              <p className="text-text-secondary leading-relaxed">{aiSummary.shortSummary}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase mb-1.5">Technical Approach</h4>
              <p className="text-text-secondary leading-relaxed">{aiSummary.technicalSummary}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-muted uppercase mb-1.5">Business Impact</h4>
              <p className="text-text-secondary leading-relaxed">{aiSummary.businessImpact}</p>
            </div>
          </div>
        ) : (
          <div className="text-text-secondary">
            <p className="leading-relaxed">
              {prBody ? (prBody.slice(0, 300) + (prBody.length > 300 ? '...' : '')) : 'No description provided'}
            </p>
          </div>
        )}
      </div>

      {/* Statistics Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="text-center p-4 bg-surface-elevated rounded-xl">
          <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {summary.totalFiles}
          </div>
          <div className="text-sm text-text-muted mt-1">Files Changed</div>
        </div>

        <div className="text-center p-4 bg-surface-elevated rounded-xl">
          <div className="flex items-center justify-center gap-2">
            <Plus className="w-5 h-5 text-accent" />
            <span className="text-3xl font-bold text-accent">
              {summary.totalAdditions}
            </span>
          </div>
          <div className="text-sm text-text-muted mt-1">Additions</div>
        </div>

        <div className="text-center p-4 bg-surface-elevated rounded-xl">
          <div className="flex items-center justify-center gap-2">
            <Minus className="w-5 h-5 text-destructive" />
            <span className="text-3xl font-bold text-destructive">
              {summary.totalDeletions}
            </span>
          </div>
          <div className="text-sm text-text-muted mt-1">Deletions</div>
        </div>

        <div className="text-center p-4 bg-surface-elevated rounded-xl">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-3xl font-bold text-foreground">
              {summary.estimatedReviewTime}
            </span>
          </div>
          <div className="text-sm text-text-muted mt-1">Est. Review Time</div>
        </div>
      </div>

      {/* Complexity Analysis */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="font-semibold text-foreground mb-3">Complexity Analysis</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-3 bg-surface rounded-full overflow-hidden">
            <div
              className={`h-full ${
                summary.complexity === 'High'
                  ? 'bg-destructive'
                  : summary.complexity === 'Medium'
                  ? 'bg-accent'
                  : 'bg-primary'
              }`}
              style={{
                width:
                  summary.complexity === 'High'
                    ? '100%'
                    : summary.complexity === 'Medium'
                    ? '66%'
                    : '33%',
              }}
            />
          </div>
          <span className="text-sm font-medium text-foreground min-w-[60px]">
            {summary.complexity}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
