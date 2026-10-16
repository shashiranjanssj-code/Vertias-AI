import type { ResumeData, JobDescriptionData, AtsAuditResult } from '../types/resume.ts';
import { analyzeAntiAiText } from './antiAiDetector.ts';

export function calculateAtsAudit(resume: ResumeData, jobDescription?: JobDescriptionData | null): AtsAuditResult {
  // 1. Formatting & ATS Parsing Checks
  const formattingChecks = [
    {
      id: 'contact_name',
      label: 'Prominent Candidate Name',
      passed: Boolean(resume.personalInfo.fullName && resume.personalInfo.fullName.trim().length > 2),
      tip: 'Top-level clear name ensures ATS parser parses applicant ID properly.'
    },
    {
      id: 'contact_email',
      label: 'Standard Email Address Format',
      passed: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.personalInfo.email.trim()),
      tip: 'ATS uses email as primary candidate deduplication key.'
    },
    {
      id: 'contact_phone',
      label: 'Direct Phone Number',
      passed: Boolean(resume.personalInfo.phone && resume.personalInfo.phone.replace(/\D/g, '').length >= 7),
      tip: 'Include standard regional or international telephone format.'
    },
    {
      id: 'job_title_match',
      label: 'Clear Target Job Title',
      passed: Boolean(resume.personalInfo.jobTitle && resume.personalInfo.jobTitle.trim().length > 3),
      tip: 'Target title in header matches candidate profile directly to requisition.'
    },
    {
      id: 'work_history_dates',
      label: 'Chronological Work History Dates',
      passed: resume.experience.length > 0 && resume.experience.every(e => Boolean(e.startDate)),
      tip: 'Clear start/end month and year prevents parser calculation errors.'
    },
    {
      id: 'clean_skills_categorization',
      label: 'Structured Skills Section',
      passed: (resume.skills.technical.length + resume.skills.tools.length) >= 4,
      tip: 'ATS spiders index standard "Skills" or "Technical Skills" labels.'
    },
    {
      id: 'education_details',
      label: 'Standard Degree & Institution',
      passed: resume.education.length > 0 && resume.education.every(ed => Boolean(ed.institution && ed.degree)),
      tip: 'Institution and degree title allow ATS education filter verification.'
    }
  ];

  const passedChecksCount = formattingChecks.filter(c => c.passed).length;
  const formattingScore = Math.round((passedChecksCount / formattingChecks.length) * 100);

  // 2. Quantified Impact Score (Numbers, %, $, metrics in bullets)
  const allBullets = [
    ...resume.experience.flatMap(e => e.bullets),
    ...resume.projects.flatMap(p => p.bullets)
  ].filter(b => b && b.trim().length > 0);

  const metricRegex = /(\b\d+(\.\d+)?%|\$\d+[\d,]*(\.\d+)?(k|m|b)?|\b\d+x\b|\b\d{1,3}(,\d{3})+\b|\b\d+\+\b|\b\d+\s*(users|customers|clients|engineers|teams|million|thousand|seconds|ms|hours))/i;
  
  const metricBulletsCount = allBullets.filter(b => metricRegex.test(b)).length;
  const quantifiedPercentage = allBullets.length > 0 ? Math.round((metricBulletsCount / allBullets.length) * 100) : 0;

  // Scale: 60%+ quantified bullets is considered top 5% executive grade
  const quantifiedScore = Math.min(100, Math.round((quantifiedPercentage / 60) * 100));

  // 3. Keyword Match against Job Description
  let keywordScore = 75; // default benchmark if no JD provided
  let matchedCount = 0;
  let totalRequired = 0;
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];

  // Flatten resume text for keyword search
  const fullResumeText = [
    resume.summary,
    resume.personalInfo.jobTitle,
    ...resume.skills.technical,
    ...resume.skills.tools,
    ...resume.skills.domain,
    ...resume.skills.soft,
    ...resume.experience.map(e => `${e.role} ${e.company} ${e.bullets.join(' ')} ${e.technologies?.join(' ') || ''}`),
    ...resume.projects.map(p => `${p.name} ${p.description} ${p.bullets.join(' ')} ${p.technologies.join(' ')}`)
  ].join(' ').toLowerCase();

  if (jobDescription && (jobDescription.keywords.length > 0 || jobDescription.requiredSkills.length > 0)) {
    const targetKeywords = jobDescription.keywords.length > 0
      ? jobDescription.keywords.map(k => k.word)
      : [...jobDescription.requiredSkills, ...jobDescription.preferredSkills];

    totalRequired = targetKeywords.length;
    for (const kw of targetKeywords) {
      const cleanKw = kw.trim().toLowerCase();
      // Test word boundary or presence
      const kwRegex = new RegExp(`\\b${cleanKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (kwRegex.test(fullResumeText) || fullResumeText.includes(cleanKw)) {
        matchedCount++;
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    }

    keywordScore = totalRequired > 0 ? Math.min(100, Math.round((matchedCount / totalRequired) * 100)) : 80;
  } else {
    // If no JD, score based on sheer richness of technical skills and density
    const skillCount = resume.skills.technical.length + resume.skills.tools.length;
    keywordScore = Math.min(95, 60 + skillCount * 3);
    matchedKeywords = [...resume.skills.technical.slice(0, 5), ...resume.skills.tools.slice(0, 5)];
  }

  // 4. Anti-AI and Authenticity Analysis
  const antiAiResult = analyzeAntiAiText(fullResumeText);
  const antiAiScore = antiAiResult.humanScore;

  // 5. Section Structure Completeness
  const presentSections: string[] = [];
  const missingSections: string[] = [];

  if (resume.personalInfo.fullName) presentSections.push('Contact Information');
  else missingSections.push('Contact Information');

  if (resume.summary && resume.summary.trim().length > 20) presentSections.push('Professional Summary');
  else missingSections.push('Professional Summary');

  if (resume.experience.length > 0) presentSections.push('Work Experience');
  else missingSections.push('Work Experience');

  if (resume.skills.technical.length > 0 || resume.skills.tools.length > 0) presentSections.push('Technical & Core Skills');
  else missingSections.push('Technical & Core Skills');

  if (resume.education.length > 0) presentSections.push('Education');
  else missingSections.push('Education');

  if (resume.projects.length > 0) presentSections.push('Key Projects');
  if (resume.certifications.length > 0) presentSections.push('Certifications');

  const sectionScore = Math.round((presentSections.length / (presentSections.length + missingSections.length)) * 100);

  // Composite ATS Overall Score
  // Weighted:
  // - Keyword Match: 30%
  // - Formatting & ATS Parseability: 25%
  // - Quantified Impact: 20%
  // - Anti-AI Authenticity: 15%
  // - Section Completeness: 10%
  const overallScore = Math.round(
    keywordScore * 0.30 +
    formattingScore * 0.25 +
    quantifiedScore * 0.20 +
    antiAiScore * 0.15 +
    sectionScore * 0.10
  );

  let grade: AtsAuditResult['grade'] = 'Needs Work';
  if (overallScore >= 92) grade = 'A+';
  else if (overallScore >= 85) grade = 'A';
  else if (overallScore >= 78) grade = 'B+';
  else if (overallScore >= 70) grade = 'B';
  else if (overallScore >= 60) grade = 'C';

  const actionItems: string[] = [];
  if (missingKeywords.length > 0) {
    actionItems.push(`Incorporate key job terms: ${missingKeywords.slice(0, 4).join(', ')} into your bullet points.`);
  }
  if (quantifiedPercentage < 40) {
    actionItems.push('Quantify more achievements with measurable outcomes (percentages, dollars saved, speedups, headcount).');
  }
  if (antiAiResult.flaggedPhrases.length > 0) {
    actionItems.push(`Replace generic AI buzzwords (${antiAiResult.flaggedPhrases.slice(0, 2).map(p => `"${p.phrase}"`).join(', ')}) with crisp action verbs.`);
  }
  if (formattingScore < 85) {
    actionItems.push('Verify all dates, titles, and contact information meet clean ATS parsing standards.');
  }

  return {
    overallScore,
    grade,
    keywordMatch: {
      score: keywordScore,
      matchedCount,
      totalRequired,
      matched: matchedKeywords,
      missing: missingKeywords
    },
    formatting: {
      score: formattingScore,
      checks: formattingChecks
    },
    quantifiedImpact: {
      score: quantifiedScore,
      metricBulletsCount,
      totalBulletsCount: allBullets.length,
      percentage: quantifiedPercentage,
      feedback: quantifiedPercentage >= 50
        ? 'Outstanding metric density. Every role demonstrates measurable business outcome.'
        : 'Aim for at least 50% of bullets containing numbers, percentages, or concrete metrics.'
    },
    antiAiAuthenticity: {
      score: antiAiScore,
      humanProbability: antiAiResult.humanScore,
      burstinessScore: antiAiResult.burstinessScore,
      lexicalDiversity: antiAiResult.lexicalDiversity,
      flaggedAiPhrases: antiAiResult.flaggedPhrases.map(f => f.phrase),
      suggestions: antiAiResult.suggestions
    },
    sectionStructure: {
      score: sectionScore,
      presentSections,
      missingSections
    },
    actionItems: actionItems.length > 0 ? actionItems : ['Resume is primed to beat top-tier ATS filters and human recruiters.']
  };
}

/**
 * Compare an original previous resume with a freshly rebuilt resume
 */
export function compareAtsScores(previousResult: AtsAuditResult, freshResult: AtsAuditResult) {
  const delta = freshResult.overallScore - previousResult.overallScore;
  const improvements: string[] = [];

  if (freshResult.keywordMatch.score > previousResult.keywordMatch.score) {
    improvements.push(`Keyword match increased from ${previousResult.keywordMatch.score}% to ${freshResult.keywordMatch.score}%`);
  }
  if (freshResult.quantifiedImpact.score > previousResult.quantifiedImpact.score) {
    improvements.push(`Quantified impact improved from ${previousResult.quantifiedImpact.percentage}% to ${freshResult.quantifiedImpact.percentage}% metrics`);
  }
  if (freshResult.antiAiAuthenticity.score > previousResult.antiAiAuthenticity.score) {
    improvements.push(`Anti-AI human score increased by +${freshResult.antiAiAuthenticity.score - previousResult.antiAiAuthenticity.score} pts (flagged clichés reduced)`);
  }
  if (freshResult.formatting.score > previousResult.formatting.score) {
    improvements.push(`ATS parseability score jumped to ${freshResult.formatting.score}%`);
  }

  return {
    previousScore: previousResult.overallScore,
    freshScore: freshResult.overallScore,
    delta,
    gradeBefore: previousResult.grade,
    gradeAfter: freshResult.grade,
    improvements
  };
}
