/**
 * Anti-AI Detection & Humaniser Engine
 * Analyzes resumes and bullets for generative AI markers, burstiness,
 * lexical diversity, and cliché syntactic patterns.
 */

export const AI_FLAGGED_PHRASES = [
  'spearheaded',
  'synergized',
  'seamlessly integrated',
  'demonstrated track record',
  'results-driven professional',
  'dynamic multifaceted',
  'catalyst for change',
  'orchestrated cross-functional',
  'delve into',
  'beacon of',
  'testament to',
  'tapestry of',
  'pioneered revolutionary',
  'in today\'s fast-paced world',
  'leveraged cutting-edge',
  'transformative impact',
  'deep dive',
  'game-changing',
  'fostered a culture of innovation',
  'expertly managed',
  'strategic thinker and problem solver',
  'thought leader',
  'passionate about driving',
  'utilized best practices',
  'streamlined end-to-end',
  'holistic approach',
  'proven track record of success'
];

export interface AntiAiAnalysis {
  humanScore: number; // 0 - 100% (higher = more authentically human)
  aiDetectionRisk: 'Low (Safe)' | 'Moderate' | 'High (AI Detected)';
  flaggedPhrases: Array<{ phrase: string; count: number; recommendation: string }>;
  burstinessScore: number; // sentence length variance
  burstinessGrade: 'High Variation (Natural Human)' | 'Moderate' | 'Low Variation (Robotic AI)';
  lexicalDiversity: number; // 0 - 100% (unique words / total words)
  avgWordsPerBullet: number;
  suggestions: string[];
}

export function analyzeAntiAiText(text: string): AntiAiAnalysis {
  if (!text || text.trim().length === 0) {
    return {
      humanScore: 100,
      aiDetectionRisk: 'Low (Safe)',
      flaggedPhrases: [],
      burstinessScore: 50,
      burstinessGrade: 'High Variation (Natural Human)',
      lexicalDiversity: 70,
      avgWordsPerBullet: 0,
      suggestions: ['Add your experience bullets to run real-time Anti-AI detection.']
    };
  }

  const lower = text.toLowerCase();
  const flaggedPhrases: Array<{ phrase: string; count: number; recommendation: string }> = [];

  for (const phrase of AI_FLAGGED_PHRASES) {
    const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches && matches.length > 0) {
      flaggedPhrases.push({
        phrase,
        count: matches.length,
        recommendation: getHumanAlternative(phrase)
      });
    }
  }

  // Split into sentences / bullets
  const sentences = text
    .split(/\n|[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 8);

  const wordCounts = sentences.map(s => s.split(/\s+/).filter(Boolean).length);
  const totalWords = wordCounts.reduce((a, b) => a + b, 0);
  const avgWords = wordCounts.length > 0 ? Math.round((totalWords / wordCounts.length) * 10) / 10 : 0;

  // Burstiness: variance in sentence length. AI has near-zero variance; humans alternate short & long sentences
  let burstinessScore = 50;
  if (wordCounts.length >= 2) {
    const mean = totalWords / wordCounts.length;
    const variance = wordCounts.reduce((acc, len) => acc + Math.pow(len - mean, 2), 0) / wordCounts.length;
    const stdDev = Math.sqrt(variance);
    // stdDev of ~6-12 words indicates great human burstiness
    burstinessScore = Math.min(100, Math.max(10, Math.round((stdDev / 8) * 75)));
  }

  const burstinessGrade =
    burstinessScore >= 65
      ? 'High Variation (Natural Human)'
      : burstinessScore >= 40
      ? 'Moderate'
      : 'Low Variation (Robotic AI)';

  // Lexical diversity (Type-Token Ratio)
  const allTokens = lower.match(/\b[a-z]{3,}\b/g) || [];
  const uniqueTokens = new Set(allTokens);
  const lexicalDiversity =
    allTokens.length > 0 ? Math.min(100, Math.round((uniqueTokens.size / allTokens.length) * 100)) : 70;

  // Calculate composite human score
  // Penalize heavily for flagged AI clichés (-8 per flagged phrase count)
  const totalFlaggedCount = flaggedPhrases.reduce((acc, p) => acc + p.count, 0);
  const clichéPenalty = Math.min(50, totalFlaggedCount * 9);
  
  // Reward burstiness and lexical diversity
  let humanScore = Math.round(
    burstinessScore * 0.35 +
    lexicalDiversity * 0.35 +
    (100 - clichéPenalty * 2) * 0.30
  );

  humanScore = Math.max(12, Math.min(99, humanScore));

  const aiDetectionRisk =
    humanScore >= 78 ? 'Low (Safe)' : humanScore >= 55 ? 'Moderate' : 'High (AI Detected)';

  const suggestions: string[] = [];
  if (flaggedPhrases.length > 0) {
    suggestions.push(
      `Replace ${flaggedPhrases.length} flagged AI clichés (${flaggedPhrases.slice(0, 3).map(p => `"${p.phrase}"`).join(', ')}) with precise action verbs.`
    );
  }
  if (burstinessScore < 50) {
    suggestions.push(
      'Vary your bullet lengths. Mix direct 8-12 word outcome lines with detailed 18-24 word project summaries to reflect human cadence.'
    );
  }
  if (lexicalDiversity < 55) {
    suggestions.push(
      'Enrich vocabulary with industry-specific tooling and operational metrics instead of repeated generic verbs.'
    );
  }
  if (suggestions.length === 0) {
    suggestions.push('High human authenticity detected. Rhythms and vocabulary reflect natural executive writing.');
  }

  return {
    humanScore,
    aiDetectionRisk,
    flaggedPhrases,
    burstinessScore,
    burstinessGrade,
    lexicalDiversity,
    avgWordsPerBullet: avgWords,
    suggestions
  };
}

export function getHumanAlternative(cliche: string): string {
  const map: Record<string, string> = {
    'spearheaded': 'Built, led, directed, launched',
    'synergized': 'Coordinated, aligned, partnered with',
    'seamlessly integrated': 'Connected, migrated, integrated without downtime',
    'demonstrated track record': 'Delivered, achieved, maintained',
    'results-driven professional': 'Engineer/Leader specialized in',
    'dynamic multifaceted': 'Hands-on, cross-functional',
    'catalyst for change': 'Initiated, restructured, transitioned',
    'orchestrated cross-functional': 'Led a team of 8 across design and backend',
    'delve into': 'Analyzed, investigated, profiled',
    'beacon of': 'Standard for, benchmark',
    'testament to': 'Demonstrated by',
    'pioneered revolutionary': 'Architected first iteration of',
    'leveraged cutting-edge': 'Implemented, deployed',
    'transformative impact': 'Cut latency by 45%, saving $120k/yr',
    'deep dive': 'Comprehensive audit, technical review',
    'fostered a culture of innovation': 'Mentored 6 engineers and ran weekly RFC reviews',
    'proven track record of success': 'Consistently exceeded sprint deliverables across 3 quarters'
  };
  return map[cliche.toLowerCase()] || 'Use concrete, observable technical action + metric';
}

/**
 * Humanizer rule engine: Transforms a robotic AI bullet into an authentic human bullet
 */
export function quickHumanizeBullet(bullet: string): string {
  let cleaned = bullet.trim();
  // Remove leading bullet dots or asterisks
  cleaned = cleaned.replace(/^[-*•\d.]\s*/, '');

  for (const phrase of AI_FLAGGED_PHRASES) {
    const reg = new RegExp(`\\b${phrase}\\b`, 'gi');
    if (reg.test(cleaned)) {
      const alt = getHumanAlternative(phrase).split(',')[0].trim();
      cleaned = cleaned.replace(reg, alt);
    }
  }

  // Capitalize first letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}
