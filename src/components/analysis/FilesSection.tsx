import { useState } from 'react';
import { File, ChevronDown, ChevronRight } from 'lucide-react';
import { FileData } from '../../utils/githubAPI';
import { FileCategory } from '../../utils/prAnalyzer';
import GlassCard from '../shared/GlassCard';

interface FilesSectionProps {
  categories: FileCategory[];
  allFiles: FileData[];
}

export default function FilesSection({ categories, allFiles }: FilesSectionProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map((c) => c.category))
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Source Files': 'text-primary',
      'Test Files': 'text-accent',
      'Configuration': 'text-text-secondary',
      'Documentation': 'text-primary-light',
      'Styles': 'text-accent-light',
      'Other': 'text-text-muted',
    };
    return colors[category] || 'text-text-muted';
  };

  return (
    <GlassCard>
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <File className="w-6 h-6 text-primary" />
        Files Changed
      </h2>

      <div className="space-y-4">
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.category);
          const categoryFiles = allFiles.filter((f) =>
            category.files.includes(f.filename)
          );

          return (
            <div key={category.category} className="bg-surface-elevated rounded-xl overflow-hidden">
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-primary" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-text-muted" />
                  )}
                  <span className={`font-semibold ${getCategoryColor(category.category)}`}>
                    {category.category}
                  </span>
                  <span className="text-sm text-text-muted">
                    ({category.count} file{category.count !== 1 ? 's' : ''})
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {categoryFiles.map((file) => (
                    <div
                      key={file.filename}
                      className="flex items-center justify-between p-3 bg-background rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <File className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground truncate">
                          {file.filename}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        <span className="text-xs text-accent">+{file.additions}</span>
                        <span className="text-xs text-destructive">-{file.deletions}</span>
                        <span className="text-xs text-text-muted">
                          {file.changes} change{file.changes !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
