import { Link, useLocation } from 'react-router-dom';
import { Github, Code2 } from 'lucide-react';
import ThemeToggle from '../shared/ThemeToggle';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--glass-bg)] backdrop-blur-glass border-b border-[var(--glass-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-primary rounded-lg group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              PR Analyzer
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/about'
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              About
            </Link>

            <a
              href="https://github.com/caffeine-rohit/PR_Analyzer-blur"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-surface-elevated border border-border hover:scale-110 transition-all duration-300"
            >
              <Github className="w-5 h-5 text-foreground" />
            </a>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
