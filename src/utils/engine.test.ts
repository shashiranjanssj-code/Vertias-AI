import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeAntiAiText, quickHumanizeBullet, getHumanAlternative } from './antiAiDetector.ts';
import { calculateAtsAudit, compareAtsScores } from './atsScorer.ts';
import type { ResumeData, JobDescriptionData } from '../types/resume.ts';

test('antiAiDetector correctly identifies AI clichés', () => {
  const aiHeavyText = 'Spearheaded cross-functional initiatives and synergized dynamic teams with a demonstrated track record of success.';
  const analysis = analyzeAntiAiText(aiHeavyText);
  assert.ok(analysis.flaggedPhrases.length >= 2, 'Should flag multiple AI clichés');
  assert.ok(analysis.flaggedPhrases.some(p => p.phrase === 'spearheaded'));
  assert.ok(analysis.flaggedPhrases.some(p => p.phrase === 'synergized'));
  assert.ok(analysis.humanScore < 70, 'AI heavy text should have depressed human score');
});

test('quickHumanizeBullet replaces robotic cliché with active human verb', () => {
  const bullet = 'Spearheaded customer onboarding process across 4 regions';
  const humanized = quickHumanizeBullet(bullet);
  assert.ok(!humanized.toLowerCase().includes('spearheaded'), 'Should remove spearheaded');
  assert.ok(humanized.length > 5, 'Should maintain sentence structure');
});

test('atsScorer computes accurate keyword match and formatting score', () => {
  const sampleResume: ResumeData = {
    id: 'test-1',
    title: 'Senior Software Engineer',
    lastModified: '2026-10-16',
    personalInfo: {
      fullName: 'Alex Vance',
      jobTitle: 'Senior Full Stack Engineer',
      email: 'alex.vance@example.com',
      phone: '+1 415 555 0199',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexvance',
      github: 'github.com/alexvance'
    },
    summary: 'Senior Software Engineer with 7+ years of experience designing high-throughput distributed systems in TypeScript, Node.js, and React. Cut cloud egress costs by $180,000 annually.',
    experience: [
      {
        id: 'exp-1',
        company: 'Vanguard Systems',
        role: 'Lead Backend Engineer',
        location: 'Remote',
        startDate: 'Jan 2022',
        endDate: 'Present',
        current: true,
        bullets: [
          'Architected event-driven microservices serving 14,000,000 daily API calls with 99.99% uptime.',
          'Reduced p99 query latency by 42% by migrating critical paths to Redis caching and PostgreSQL partitioning.',
          'Led a pod of 6 engineers across bi-weekly sprints, improving delivery velocity by 28%.'
        ],
        technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']
      }
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'University of Washington',
        degree: 'B.S.',
        field: 'Computer Science',
        graduationDate: '2019'
      }
    ],
    projects: [],
    skills: {
      technical: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes'],
      soft: ['Cross-functional Collaboration', 'Sprint Leadership'],
      tools: ['Git', 'AWS', 'Redis', 'Jest'],
      domain: ['Distributed Systems', 'Cloud Architecture']
    },
    certifications: []
  };

  const sampleJD: JobDescriptionData = {
    title: 'Senior Full Stack Engineer',
    company: 'NextGen Cloud',
    rawText: 'Looking for a Senior Full Stack Engineer with strong TypeScript, PostgreSQL, and AWS experience.',
    requiredSkills: ['TypeScript', 'PostgreSQL', 'AWS'],
    preferredSkills: ['Redis', 'Docker'],
    keywords: [
      { word: 'TypeScript', category: 'technical', frequency: 3, required: true },
      { word: 'PostgreSQL', category: 'technical', frequency: 2, required: true },
      { word: 'AWS', category: 'tool', frequency: 2, required: true },
      { word: 'Python', category: 'technical', frequency: 1, required: false }
    ],
    keyResponsibilities: ['Build scalable APIs']
  };

  const audit = calculateAtsAudit(sampleResume, sampleJD);
  assert.ok(audit.overallScore >= 80, `Expected score >= 80, got ${audit.overallScore}`);
  assert.ok(audit.keywordMatch.score >= 70, 'Keyword match should be strong');
  assert.ok(audit.quantifiedImpact.percentage >= 60, 'Quantified metric bullets should be high');
  assert.equal(audit.formatting.score, 100, 'All formatting checks should pass');
});

test('compareAtsScores accurately calculates delta and improvements', () => {
  const previousResult = {
    overallScore: 62,
    grade: 'C' as const,
    keywordMatch: { score: 50, matchedCount: 3, totalRequired: 6, matched: [], missing: [] },
    formatting: { score: 70, checks: [] },
    quantifiedImpact: { score: 30, metricBulletsCount: 1, totalBulletsCount: 5, percentage: 20, feedback: '' },
    antiAiAuthenticity: { score: 65, humanProbability: 65, burstinessScore: 40, lexicalDiversity: 50, flaggedAiPhrases: [], suggestions: [] },
    sectionStructure: { score: 80, presentSections: [], missingSections: [] },
    actionItems: []
  };

  const freshResult = {
    overallScore: 94,
    grade: 'A+' as const,
    keywordMatch: { score: 92, matchedCount: 6, totalRequired: 6, matched: [], missing: [] },
    formatting: { score: 100, checks: [] },
    quantifiedImpact: { score: 90, metricBulletsCount: 5, totalBulletsCount: 5, percentage: 100, feedback: '' },
    antiAiAuthenticity: { score: 96, humanProbability: 96, burstinessScore: 85, lexicalDiversity: 78, flaggedAiPhrases: [], suggestions: [] },
    sectionStructure: { score: 100, presentSections: [], missingSections: [] },
    actionItems: []
  };

  const comp = compareAtsScores(previousResult, freshResult);
  assert.equal(comp.delta, 32);
  assert.equal(comp.gradeBefore, 'C');
  assert.equal(comp.gradeAfter, 'A+');
  assert.ok(comp.improvements.length >= 3);
});
