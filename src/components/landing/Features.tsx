import { Clock, FileSearch, AlertCircle, TrendingUp } from 'lucide-react';
import GlassCard from '../shared/GlassCard';

export default function Features() {
  const features = [
    {
      icon: Clock,
      title: 'Instant Analysis',
      description: 'Get comprehensive PR insights in seconds, not minutes',
    },
    {
      icon: FileSearch,
      title: 'Smart Categorization',
      description: 'Automatically categorize files by type and importance',
    },
    {
      icon: AlertCircle,
      title: 'Issue Detection',
      description: 'Identify potential problems before they become bugs',
    },
    {
      icon: TrendingUp,
      title: 'Time Estimation',
      description: 'Accurate review time predictions for better planning',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Everything you need to review PRs faster and smarter
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <GlassCard
              key={feature.title}
              hover
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-3 bg-gradient-primary rounded-xl w-fit mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-text-secondary">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
