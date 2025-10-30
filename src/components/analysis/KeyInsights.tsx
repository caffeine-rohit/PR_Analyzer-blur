import { Lightbulb, Shield, Clock, AlertTriangle, Activity } from 'lucide-react';
import { PRSummary } from '../../utils/prAnalyzer';
import GlassCard from '../shared/GlassCard';

interface KeyInsightsProps {
  summary: PRSummary;
}

export default function KeyInsights({ summary }: KeyInsightsProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-accent';
      case 'low':
        return 'text-primary';
      default:
        return 'text-text-secondary';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-destructive/10 border-destructive/30';
      case 'medium':
        return 'bg-accent/10 border-accent/30';
      case 'low':
        return 'bg-primary/10 border-primary/30';
      default:
        return 'bg-surface-elevated';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const getComplexityColor = (score: number) => {
    if (score >= 7) return 'text-destructive';
    if (score >= 4) return 'text-accent';
    return 'text-primary';
  };

  return (
    <div className="space-y-6">
      {/* Smart Analysis Card */}
      <GlassCard>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          Smart Analysis
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Risk Assessment */}
          <div className={`p-5 rounded-xl border ${getRiskBgColor(summary.riskLevel)}`}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className={`w-5 h-5 ${getRiskColor(summary.riskLevel)}`} />
              <h3 className="font-semibold text-foreground">Risk Assessment</h3>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{getRiskIcon(summary.riskLevel)}</span>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getRiskColor(summary.riskLevel)} capitalize`}>
                  {summary.riskLevel}
                </div>
                <div className="text-sm text-text-muted">Risk Level</div>
              </div>
            </div>

            {/* Risk Score Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-text-muted mb-1">
                <span>Risk Score</span>
                <span>{summary.riskScore}/100</span>
              </div>
              <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    summary.riskLevel === 'high'
                      ? 'bg-destructive'
                      : summary.riskLevel === 'medium'
                      ? 'bg-accent'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${summary.riskScore}%` }}
                />
              </div>
            </div>

            <div className="mt-4 text-sm text-text-secondary">
              {summary.riskLevel === 'high' && '⚠️ Requires senior developer review'}
              {summary.riskLevel === 'medium' && '✓ Standard review process recommended'}
              {summary.riskLevel === 'low' && '✓ Low risk - quick review possible'}
            </div>
          </div>

          {/* Complexity Score (NEW) */}
          <div className="p-5 rounded-xl bg-surface-elevated border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Complexity</h3>
            </div>

            <div className="text-center mb-4">
              <div className={`text-4xl font-bold ${getComplexityColor(summary.complexityScore)}`}>
                {summary.complexityScore}/10
              </div>
              <div className="text-sm text-text-muted mt-1 capitalize">
                {summary.complexity} Complexity
              </div>
            </div>

            {/* Complexity visualization */}
            <div className="flex gap-1 mb-4">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded ${
                    i < summary.complexityScore
                      ? summary.complexityScore >= 7
                        ? 'bg-destructive'
                        : summary.complexityScore >= 4
                        ? 'bg-accent'
                        : 'bg-primary'
                      : 'bg-surface'
                  }`}
                />
              ))}
            </div>

            <div className="text-xs text-text-secondary text-center">
              {summary.complexity === 'High' && 'Complex changes across multiple areas'}
              {summary.complexity === 'Medium' && 'Moderate complexity with some nuances'}
              {summary.complexity === 'Low' && 'Straightforward implementation'}
            </div>
          </div>

          {/* Review Time Breakdown */}
          <div className="p-5 rounded-xl bg-surface-elevated border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Review Time</h3>
            </div>

            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-primary">
                {summary.estimatedReviewTime}
              </div>
              <div className="text-sm text-text-muted">Estimated Total</div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">📖 Reading</span>
                <span className="font-medium text-foreground">
                  {summary.timeBreakdown.readingTime}m
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">🔍 Review</span>
                <span className="font-medium text-foreground">
                  {summary.timeBreakdown.reviewTime}m
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">🧪 Testing</span>
                <span className="font-medium text-foreground">
                  {summary.timeBreakdown.testingTime}m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Reasons (NEW) */}
        {summary.riskReasons && summary.riskReasons.length > 0 && (
          <div className="mt-6 p-4 bg-surface rounded-xl border border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>🔍</span>
              Risk Factors Detected
            </h4>
            <div className="flex flex-wrap gap-2">
              {summary.riskReasons.map((reason, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-surface-elevated rounded-full text-xs text-text-secondary border border-border"
                >
                  {reason}
                </span>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Key Insights */}
      <GlassCard>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-accent" />
          Key Insights
        </h2>

        <div className="space-y-3">
          {summary.keyPoints.map((insight, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-surface-elevated rounded-xl hover:shadow-md transition-shadow animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-accent flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-text-secondary flex-1">{insight}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}