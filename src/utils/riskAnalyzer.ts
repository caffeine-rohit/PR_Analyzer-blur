interface PRData {
  files: Array<{ filename: string; changes: number; additions: number; deletions: number }>;
  additions: number;
  deletions: number;
  changed_files: number;
}

interface RiskAssessment {
  score: number; // 0-100
  level: 'low' | 'medium' | 'high';
  color: string;
  icon: string;
  reasons: string[];
  recommendation: string;
}

export const assessRisk = (prData: PRData): RiskAssessment => {
  let score = 0;
  const reasons: string[] = [];

  // Factor 1: Total lines changed
  const totalChanges = prData.additions + prData.deletions;
  if (totalChanges > 1000) {
    score += 40;
    reasons.push(`Large changeset (${totalChanges} lines)`);
  } else if (totalChanges > 500) {
    score += 25;
    reasons.push(`Moderate changeset (${totalChanges} lines)`);
  } else if (totalChanges > 200) {
    score += 15;
    reasons.push(`Small changeset (${totalChanges} lines)`);
  }

  // Factor 2: Number of files
  if (prData.changed_files > 20) {
    score += 30;
    reasons.push(`Many files affected (${prData.changed_files} files)`);
  } else if (prData.changed_files > 10) {
    score += 20;
    reasons.push(`Multiple files affected (${prData.changed_files} files)`);
  }

  // Factor 3: Critical files
  const criticalPatterns = [
    'auth', 'login', 'security', 'password', 
    'config', 'env', 'database', 'migration',
    'payment', 'api/core', 'main', 'index'
  ];
  
  const hasCriticalFiles = prData.files.some(file => 
    criticalPatterns.some(pattern => 
      file.filename.toLowerCase().includes(pattern)
    )
  );
  
  if (hasCriticalFiles) {
    score += 20;
    reasons.push('Touches critical files (auth/config/db)');
  }

  // Factor 4: Large individual file changes
  const hasLargeFileChanges = prData.files.some(file => file.changes > 300);
  if (hasLargeFileChanges) {
    score += 10;
    reasons.push('Large changes in individual files');
  }

// ADD: Check for deletion-heavy PRs (risky!)
const deletionRatio = prData.deletions / (prData.additions + prData.deletions);
if (deletionRatio > 0.6 && prData.deletions > 100) {
  score += 15;
  reasons.push('High deletion ratio - removing significant code');
}

// ADD: Check for configuration/package files
const configFiles = prData.files.filter(file => 
  file.filename.match(/package\.json|composer\.json|requirements\.txt|Gemfile|pom\.xml|build\.gradle/)
);
if (configFiles.length > 0) {
  score += 15;
  reasons.push('Modifies dependencies/configuration');
}

// ADD: Check for migration/schema files
const hasMigrations = prData.files.some(file =>
  file.filename.includes('migration') || 
  file.filename.includes('schema') ||
  file.filename.match(/\.sql$/)
);
if (hasMigrations) {
  score += 20;
  reasons.push('Contains database migrations/schema changes');
}

  // Determine level
  let level: 'low' | 'medium' | 'high';
  let color: string;
  let icon: string;
  let recommendation: string;

  if (score >= 60) {
    level = 'high';
    color = 'text-red-500';
    icon = '🔴';
    recommendation = 'Requires senior developer review. Consider breaking into smaller PRs.';
  } else if (score >= 30) {
    level = 'medium';
    color = 'text-yellow-500';
    icon = '🟡';
    recommendation = 'Standard review process. Allocate sufficient time for testing.';
  } else {
    level = 'low';
    color = 'text-green-500';
    icon = '🟢';
    recommendation = 'Low risk change. Quick review possible.';
  }

  if (reasons.length === 0) {
    reasons.push('Small, focused change');
  }

  return {
    score: Math.min(score, 100),
    level,
    color,
    icon,
    reasons,
    recommendation
  };
};