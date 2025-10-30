import { Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <h3 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
              PR Analyzer
            </h3>
            <p className="text-text-secondary text-sm max-w-md">
              Analyze GitHub Pull Requests with AI-powered insights. Fast, accurate, and free.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-text-secondary hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-secondary hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/caffeine-rohit/PR_Analyzer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-foreground">Connect</h4>
            <div className="flex space-x-3">
              <a
                href="https://github.com/caffeine-rohit"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-surface-elevated rounded-lg hover:bg-primary hover:text-white transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-surface-elevated rounded-lg hover:bg-primary hover:text-white transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-surface-elevated rounded-lg hover:bg-primary hover:text-white transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-text-muted">
          <p>&copy; {new Date().getFullYear()} PR Analyzer. Built with ❤️ for developers.</p>
        </div>
      </div>
    </footer>
  );
}
