import { PRData, FileData } from './githubAPI';

export interface FileCategory {
  category: string;
  count: number;
  files: string[];
  percentage: number;
}

export interface PRSummary {
  totalFiles: number;
  totalAdditions: number;
  totalDeletions: number;
  estimatedReviewTime: string;
  complexity: 'Low' | 'Medium' | 'High';
  complexityScore: number;
  keyPoints: string[];
  fileCategories: FileCategory[];
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  riskReasons: string[];
  timeBreakdown: {
    readingTime: number;
    reviewTime: number;
    testingTime: number;
  };
}

function categorizeFiles(files: FileData[]): FileCategory[] {
  const categories: Record<string, string[]> = {
    'Source Files': [],
    'Test Files': [],
    'Configuration': [],
    'Documentation': [],
    'Styles': [],
    'Other': []
  };

  files.forEach(file => {
    const filename = file.filename.toLowerCase();

    if (filename.includes('test') || filename.includes('spec') || filename.includes('__tests__')) {
      categories['Test Files'].push(file.filename);
    } else if (filename.endsWith('.md') || filename.includes('doc') || filename.includes('readme')) {
      categories['Documentation'].push(file.filename);
    } else if (
      filename.endsWith('.json') ||
      filename.endsWith('.yml') ||
      filename.endsWith('.yaml') ||
      filename.endsWith('.toml') ||
      filename.includes('config') ||
      filename.includes('.env')
    ) {
      categories['Configuration'].push(file.filename);
    } else if (
      filename.endsWith('.css') ||
      filename.endsWith('.scss') ||
      filename.endsWith('.sass') ||
      filename.includes('styles')
    ) {
      categories['Styles'].push(file.filename);
    } else if (
      filename.endsWith('.js') ||
      filename.endsWith('.ts') ||
      filename.endsWith('.jsx') ||
      filename.endsWith('.tsx') ||
      filename.endsWith('.py') ||
      filename.endsWith('.java') ||
      filename.endsWith('.go') ||
      filename.endsWith('.rs') ||
      filename.endsWith('.rb') ||
      filename.endsWith('.php') ||
      filename.endsWith('.vue')
    ) {
      categories['Source Files'].push(file.filename);
    } else {
      categories['Other'].push(file.filename);
    }
  });

  const totalFiles = files.length;

  return Object.entries(categories)
    .filter(([_, files]) => files.length > 0)
    .map(([category, files]) => ({
      category,
      count: files.length,
      files,
      percentage: Math.round((files.length / totalFiles) * 100)
    }));
}

function extractKeyPoints(prData: PRData, files: FileData[]): string[] {
  const points: string[] = [];

  // PR Size Analysis
  if (files.length > 20) {
    points.push('⚠️ Large PR with ' + files.length + ' files - consider breaking into smaller changes');
  } else if (files.length > 10) {
    points.push('📦 Medium-sized PR with ' + files.length + ' files - may require thorough review');
  } else if (files.length === 1) {
    points.push('🎯 Single file change - minimal scope and easy to review');
  } else {
    points.push('✅ Small, focused PR with ' + files.length + ' files - easier to review and merge');
  }

  // Code Change Pattern with specific numbers
  const totalChanges = prData.additions + prData.deletions;
  const additionRatio = prData.additions / totalChanges;
  
  if (additionRatio > 0.8) {
    points.push('📈 Primarily new code (' + prData.additions + ' additions) - ensure test coverage');
  } else if (additionRatio < 0.3) {
    points.push('🗑️ Removing ' + prData.deletions + ' lines - verify no breaking changes');
  } else if (Math.abs(prData.additions - prData.deletions) < 100) {
    points.push('⚖️ Balanced refactoring (+' + prData.additions + ' / -' + prData.deletions + ')');
  }

  // Test Coverage Check
  const testFiles = files.filter(f =>
    f.filename.toLowerCase().includes('test') ||
    f.filename.toLowerCase().includes('spec') ||
    f.filename.toLowerCase().includes('__tests__')
  );

  if (testFiles.length === 0 && prData.additions > 50) {
    points.push('❗ No tests included - add tests for ' + prData.additions + ' new lines');
  } else if (testFiles.length > 0) {
    points.push('✨ Includes ' + testFiles.length + ' test file(s) - good coverage');
  }

  // Documentation Check
  const hasDocs = files.some(f =>
    f.filename.toLowerCase().endsWith('.md') ||
    f.filename.toLowerCase().includes('doc')
  );

  if (hasDocs) {
    points.push('📚 Documentation updated - helps maintainability');
  } else if (prData.additions > 200) {
    points.push('📝 Consider adding documentation for ' + prData.additions + ' new lines');
  }

  // Critical Files Check with specific types
  const criticalFiles = files.filter(f => {
    const lower = f.filename.toLowerCase();
    return lower.includes('auth') || lower.includes('security') || 
           lower.includes('payment') || lower.includes('database') ||
           lower.includes('migration');
  });

  if (criticalFiles.length > 0) {
    points.push('🔒 Modifies ' + criticalFiles.length + ' critical file(s) - extra review needed');
  }

  // Configuration/Dependency Changes
  const configFiles = files.filter(f =>
    f.filename.match(/package\.json|composer\.json|requirements\.txt|Gemfile|pom\.xml/)
  );

  if (configFiles.length > 0) {
    points.push('⚙️ Updates dependencies in ' + configFiles.map(f => f.filename).join(', '));
  }

  // Full-stack detection
  const hasBackend = files.some(f => 
    f.filename.includes('api/') || f.filename.includes('server/') || f.filename.includes('backend/')
  );
  const hasFrontend = files.some(f =>
    f.filename.match(/\.(tsx|jsx|vue|html)$/) || f.filename.includes('component')
  );

  if (hasBackend && hasFrontend) {
    points.push('🔄 Full-stack changes - test both frontend and backend thoroughly');
  }

  return points.slice(0, 6);
}

function calculateComplexity(prData: PRData, files: FileData[]): { level: 'Low' | 'Medium' | 'High'; score: number } {
  let score = 0;

  // Factor 1: Total changes
  const totalChanges = prData.additions + prData.deletions;
  if (totalChanges > 500) score += 3;
  else if (totalChanges > 200) score += 2;
  else if (totalChanges > 100) score += 1;

  // Factor 2: Number of files
  if (files.length > 15) score += 3;
  else if (files.length > 8) score += 2;
  else if (files.length > 3) score += 1;

  // Factor 3: File type diversity
  const fileTypes = new Set(files.map(f => f.filename.split('.').pop()?.toLowerCase()));
  if (fileTypes.size > 5) score += 2;
  else if (fileTypes.size > 3) score += 1;

  // Factor 4: Backend + Frontend
  const hasBackend = files.some(f => 
    f.filename.includes('api/') || f.filename.includes('server/')
  );
  const hasFrontend = files.some(f => f.filename.match(/\.(tsx|jsx|vue)$/));
  if (hasBackend && hasFrontend) score += 2;

  const level = score >= 7 ? 'High' : score >= 4 ? 'Medium' : 'Low';
  return { level, score: Math.min(score, 10) };
}

function calculateRiskScore(prData: PRData, files: FileData[]): { 
  score: number; 
  level: 'low' | 'medium' | 'high';
  reasons: string[];
} {
  let score = 0;
  const reasons: string[] = [];

  // Factor 1: Total lines changed
  const totalChanges = prData.additions + prData.deletions;
  if (totalChanges > 1000) {
    score += 40;
    reasons.push('Very large changeset (' + totalChanges + ' lines)');
  } else if (totalChanges > 500) {
    score += 25;
    reasons.push('Large changeset (' + totalChanges + ' lines)');
  } else if (totalChanges > 200) {
    score += 15;
    reasons.push('Moderate changeset (' + totalChanges + ' lines)');
  }

  // Factor 2: Number of files
  if (files.length > 20) {
    score += 30;
    reasons.push('Many files affected (' + files.length + ' files)');
  } else if (files.length > 10) {
    score += 20;
    reasons.push('Multiple files affected (' + files.length + ' files)');
  }

  // Factor 3: Critical files
  const criticalPatterns = ['auth', 'login', 'security', 'password', 'config', 'env', 'database', 'migration', 'payment'];
  const criticalFiles = files.filter(file =>
    criticalPatterns.some(pattern => file.filename.toLowerCase().includes(pattern))
  );

  if (criticalFiles.length > 0) {
    score += 20;
    reasons.push('Touches ' + criticalFiles.length + ' critical file(s)');
  }

  // Factor 4: Large individual file changes
  const largeFiles = files.filter(file => file.changes > 300);
  if (largeFiles.length > 0) {
    score += 10;
    reasons.push(largeFiles.length + ' file(s) with >300 lines changed');
  }

  // Factor 5: High deletion ratio
  const deletionRatio = prData.deletions / totalChanges;
  if (deletionRatio > 0.6 && prData.deletions > 100) {
    score += 15;
    reasons.push('High deletion ratio (' + Math.round(deletionRatio * 100) + '%)');
  }

  // Factor 6: Dependency changes
  const hasDependencyChanges = files.some(f =>
    f.filename.match(/package\.json|requirements\.txt|Gemfile|composer\.json/)
  );
  if (hasDependencyChanges) {
    score += 10;
    reasons.push('Modifies project dependencies');
  }

  // Factor 7: Database migrations
  const hasMigrations = files.some(f =>
    f.filename.includes('migration') || f.filename.match(/\.sql$/)
  );
  if (hasMigrations) {
    score += 15;
    reasons.push('Contains database migrations');
  }

  // Determine level
  let level: 'low' | 'medium' | 'high';
  if (score >= 60) {
    level = 'high';
  } else if (score >= 30) {
    level = 'medium';
  } else {
    level = 'low';
  }

  if (reasons.length === 0) {
    reasons.push('Small, focused change');
  }

  return { score: Math.min(score, 100), level, reasons };
}

function estimateReviewTime(prData: PRData, files: FileData[]): { 
  total: string; 
  breakdown: { readingTime: number; reviewTime: number; testingTime: number } 
} {
  // Categorize files first
  const fileTypes = {
    documentation: 0,
    tests: 0,
    config: 0,
    code: 0
  };

  files.forEach(file => {
    const lower = file.filename.toLowerCase();
    
    // Documentation files
    if (lower.endsWith('.md') || lower.endsWith('.mdx') || lower.endsWith('.txt') || 
        lower.includes('readme') || lower.includes('changelog') || lower.includes('doc/')) {
      fileTypes.documentation++;
    }
    // Test files
    else if (lower.includes('.test.') || lower.includes('.spec.') || 
             lower.includes('__tests__') || lower.includes('/test/')) {
      fileTypes.tests++;
    }
    // Config files
    else if (lower.endsWith('.json') || lower.endsWith('.yml') || lower.endsWith('.yaml') ||
             lower.endsWith('.toml') || lower.endsWith('.env') || lower.includes('config')) {
      fileTypes.config++;
    }
    // Code files
    else {
      fileTypes.code++;
    }
  });

  const totalLines = prData.additions + prData.deletions;
  const totalFiles = files.length;
  
  // Calculate reading time based on file types
  let readingTime = 0;
  
  if (totalFiles > 0) {
    const docRatio = fileTypes.documentation / totalFiles;
    const testRatio = fileTypes.tests / totalFiles;
    const configRatio = fileTypes.config / totalFiles;
    const codeRatio = fileTypes.code / totalFiles;
    
    const docLines = totalLines * docRatio;
    const testLines = totalLines * testRatio;
    const configLines = totalLines * configRatio;
    const codeLines = totalLines * codeRatio;
    
    // Different reading speeds for different file types
    readingTime = Math.ceil(
      docLines / 50 +      // Documentation: 50 lines/min
      testLines / 20 +     // Tests: 20 lines/min
      configLines / 40 +   // Config: 40 lines/min
      codeLines / 15       // Code: 15 lines/min
    );
  }
  
  readingTime = Math.max(1, readingTime);
  
  // Review time based on file complexity
  const reviewTime = Math.ceil(
    fileTypes.code * 3 +           // Code files: 3 min each
    fileTypes.tests * 2 +          // Test files: 2 min each
    fileTypes.config * 1 +         // Config files: 1 min each
    fileTypes.documentation * 0.5  // Docs: 0.5 min each
  );
  
  // Testing time - SMART LOGIC
  let testingTime = 0;
  
  const isOnlyDocs = fileTypes.documentation === totalFiles && totalFiles > 0;
  const isOnlyConfig = fileTypes.config === totalFiles && totalFiles > 0;
  const isOnlyTests = fileTypes.tests === totalFiles && totalFiles > 0;
  const hasCode = fileTypes.code > 0;
  const hasTests = fileTypes.tests > 0;
  
  if (isOnlyDocs) {
    // Pure documentation - NO testing needed
    testingTime = 0;
  } else if (isOnlyConfig) {
    // Config only - minimal verification
    testingTime = 2;
  } else if (isOnlyTests) {
    // Test files only - run tests
    testingTime = 3;
  } else if (hasCode && hasTests) {
    // Code with tests - less manual testing
    testingTime = 5;
  } else if (hasCode && !hasTests) {
    // Code without tests - more testing needed
    testingTime = 10;
  } else {
    // Mixed non-code files
    testingTime = 3;
  }
  
  const totalMinutes = readingTime + reviewTime + testingTime;
  
  let totalFormatted: string;
  if (totalMinutes < 60) {
    totalFormatted = totalMinutes + 'm';
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    totalFormatted = mins > 0 ? hours + 'h ' + mins + 'm' : hours + 'h';
  }
  
  return {
    total: totalFormatted,
    breakdown: {
      readingTime,
      reviewTime,
      testingTime
    }
  };
}

export function generateSummary(prData: PRData, files: FileData[]): PRSummary {
  const riskAssessment = calculateRiskScore(prData, files);
  const complexityAssessment = calculateComplexity(prData, files);
  const timeEstimate = estimateReviewTime(prData, files);
  
  return {
    totalFiles: files.length,
    totalAdditions: prData.additions,
    totalDeletions: prData.deletions,
    estimatedReviewTime: timeEstimate.total,
    complexity: complexityAssessment.level,
    complexityScore: complexityAssessment.score,
    keyPoints: extractKeyPoints(prData, files),
    fileCategories: categorizeFiles(files),
    riskLevel: riskAssessment.level,
    riskScore: riskAssessment.score,
    riskReasons: riskAssessment.reasons,
    timeBreakdown: timeEstimate.breakdown
  };
}
