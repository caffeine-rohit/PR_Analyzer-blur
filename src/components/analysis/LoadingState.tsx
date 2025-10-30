import GlassCard from '../shared/GlassCard';

export default function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24">
      <GlassCard className="max-w-md w-full text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">Analyzing PR</h2>
        <p className="text-text-secondary mb-6">
          Fetching data and generating insights...
        </p>

        <div className="space-y-3">
          {['Fetching PR data', 'Analyzing files', 'Generating insights'].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary animate-loading-bar"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              </div>
              <span className="text-sm text-text-muted w-32 text-left">{step}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
