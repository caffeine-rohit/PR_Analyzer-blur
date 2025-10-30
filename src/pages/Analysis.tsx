import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { parseGitHubPRUrl } from '../utils/urlParser';
import { fetchPRData, fetchPRFiles, PRData, FileData } from '../utils/githubAPI';
import { generateSummary, PRSummary } from '../utils/prAnalyzer';
import { generateAISummary } from '../utils/aiService';
import Navbar from '../components/landing/Navbar';
import LoadingState from '../components/analysis/LoadingState';
import PRInfoCard from '../components/analysis/PRInfoCard';
import SummaryCard from '../components/analysis/SummaryCard';
import FilesSection from '../components/analysis/FilesSection';
import KeyInsights from '../components/analysis/KeyInsights';
import Footer from '../components/landing/Footer';
import GradientButton from '../components/shared/GradientButton';
import GlassCard from '../components/shared/GlassCard';

interface AISummary {
  shortSummary: string;
  technicalSummary: string;
  businessImpact: string;
}

export default function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prData, setPrData] = useState<PRData | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [summary, setSummary] = useState<PRSummary | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const analyzePR = async () => {
      const prUrl = location.state?.prUrl;

      if (!prUrl) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { owner, repo, prNumber } = parseGitHubPRUrl(prUrl);

        const [prDataResponse, filesResponse] = await Promise.all([
          fetchPRData(owner, repo, prNumber),
          fetchPRFiles(owner, repo, prNumber)
        ]);

        setPrData(prDataResponse);
        setFiles(filesResponse);

        const summaryData = generateSummary(prDataResponse, filesResponse);
        setSummary(summaryData);

        // Generate AI summary in background
        setAiLoading(true);
        try {
          const aiSummaryData = await generateAISummary(prDataResponse, filesResponse);
          setAiSummary(aiSummaryData);
        } catch (aiError) {
          console.error('AI Summary generation failed:', aiError);
          // Continue without AI summary - app still works
        } finally {
          setAiLoading(false);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    analyzePR();
  }, [location.state, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4 pt-24">
          <GlassCard className="max-w-md w-full text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Error</h2>
            <p className="text-text-secondary mb-6">{error}</p>
            <Link to="/">
              <GradientButton>
                <span className="flex items-center justify-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  Back to Home
                </span>
              </GradientButton>
            </Link>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (!prData || !summary) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="space-y-8 animate-fade-in">
            <PRInfoCard prData={prData} />
            <SummaryCard 
              summary={summary} 
              aiSummary={aiSummary} 
              aiLoading={aiLoading}
              prBody={prData.body}
            />
            <KeyInsights summary={summary} />
            <FilesSection categories={summary.fileCategories} allFiles={files} />

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link to="/">
                <GradientButton>
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Analyze Another PR
                  </span>
                </GradientButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}