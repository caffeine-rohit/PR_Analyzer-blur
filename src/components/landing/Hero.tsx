import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import GradientButton from '../shared/GradientButton';
import AnimatedBlob from '../shared/AnimatedBlob';

export default function Hero() {
  const [prUrl, setPrUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prUrl.trim()) {
      navigate('/analyze', { state: { prUrl } });
    }
  };

  const exampleUrl = 'https://github.com/facebook/react/pull/28000';

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <AnimatedBlob color="bg-primary" position="top-0 left-0" delay={0} />
      <AnimatedBlob color="bg-accent" position="top-1/2 right-0" delay={2} />
      <AnimatedBlob color="bg-primary-light" position="bottom-0 left-1/2" delay={4} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          <span className="bg-gradient-hero bg-clip-text text-transparent">
            Analyze GitHub PRs
          </span>
          <br />
          <span className="text-foreground">in Seconds</span>
        </h1>

        <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
          AI-powered summaries, smart insights, zero hassle
        </p>

        <GlassCard className="max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              placeholder="Paste GitHub PR URL"
              className="w-full px-6 py-4 bg-surface-elevated border border-border rounded-xl text-foreground placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <GradientButton
                type="submit"
                className="w-full sm:w-auto"
                variant="primary"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Analyze Now
              </GradientButton>

              <button
                type="button"
                onClick={() => setPrUrl(exampleUrl)}
                className="text-text-secondary hover:text-primary transition-colors text-sm font-medium"
              >
                Try example
              </button>
            </div>
          </form>
        </GlassCard>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {[
            { value: '2.5s', label: 'Avg. Analysis Time' },
            { value: '95%', label: 'Accuracy Rate' },
            { value: '1000+', label: 'PRs Analyzed' },
            { value: 'Free', label: 'Forever' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
