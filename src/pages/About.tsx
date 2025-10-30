import { Link } from 'react-router-dom';
import { ArrowLeft, Code2, Zap, Shield } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import GlassCard from '../components/shared/GlassCard';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            About PR Analyzer
          </h1>

          <div className="space-y-6">
            <GlassCard>
              <p className="text-lg text-text-secondary leading-relaxed">
                PR Analyzer is a modern web application designed to help developers quickly understand
                and review GitHub Pull Requests. Using smart algorithms and pattern recognition, we
                provide instant insights that save you time and improve code quality.
              </p>
            </GlassCard>

            <div className="grid md:grid-cols-3 gap-6">
              <GlassCard hover className="text-center">
                <div className="p-3 bg-gradient-primary rounded-xl w-fit mx-auto mb-4">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Developer First</h3>
                <p className="text-sm text-text-secondary">
                  Built by a developer, for developers
                </p>
              </GlassCard>

              <GlassCard hover className="text-center">
                <div className="p-3 bg-gradient-primary rounded-xl w-fit mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Lightning Fast</h3>
                <p className="text-sm text-text-secondary">
                  Analysis completed in seconds
                </p>
              </GlassCard>

              <GlassCard hover className="text-center">
                <div className="p-3 bg-gradient-primary rounded-xl w-fit mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Privacy First</h3>
                <p className="text-sm text-text-secondary">
                  No data stored, pure analysis
                </p>
              </GlassCard>
            </div>

            <GlassCard>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Our Mission</h2>
              <p className="text-text-secondary leading-relaxed">
                We believe that code review should be fast, insightful, and accessible to everyone.
                Our mission is to empower development teams with tools that enhance productivity
                without compromising on quality. PR Analyzer is completely free and open-source,
                because we believe great developer tools should be available to all.
              </p>
            </GlassCard>

            <GlassCard>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Technology</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Built with modern web technologies:
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  React + TypeScript for robust frontend
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Tailwind CSS for beautiful, responsive design
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  GitHub REST API for PR data access
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Smart algorithms for code analysis
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
