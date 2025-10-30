import { Link2, Cpu, CheckCircle } from 'lucide-react';
import GlassCard from '../shared/GlassCard';

export default function HowItWorks() {
  const steps = [
    {
      icon: Link2,
      title: 'Paste URL',
      description: 'Copy and paste any GitHub PR link',
    },
    {
      icon: Cpu,
      title: 'AI Analysis',
      description: 'Our AI analyzes code changes and patterns',
    },
    {
      icon: CheckCircle,
      title: 'Get Insights',
      description: 'Receive detailed summary and recommendations',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Three simple steps to better PR reviews
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <GlassCard
                hover
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-accent rounded-full flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-text-secondary">{step.description}</p>
              </GlassCard>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-primary" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
