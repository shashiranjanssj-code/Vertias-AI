import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, RefreshCw, Wand2, Info, Check } from 'lucide-react';
import type { AntiAiAnalysis } from '../utils/antiAiDetector.ts';
import { getHumanAlternative } from '../utils/antiAiDetector.ts';

interface AntiAiInspectorProps {
  analysis: AntiAiAnalysis;
  onApplyHumanizer: (strictness: 'balanced' | 'strict' | 'ultra_stealth') => Promise<void>;
  onReplaceCliché?: (cliche: string, replacement: string) => void;
  isHumanizing: boolean;
}

export const AntiAiInspector: React.FC<AntiAiInspectorProps> = ({
  analysis,
  onApplyHumanizer,
  onReplaceCliché,
  isHumanizing,
}) => {
  const [strictness, setStrictness] = useState<'balanced' | 'strict' | 'ultra_stealth'>('strict');
  const [appliedFixes, setAppliedFixes] = useState<Record<string, boolean>>({});

  const {
    humanScore,
    aiDetectionRisk,
    flaggedPhrases,
    burstinessScore,
    burstinessGrade,
    lexicalDiversity,
    avgWordsPerBullet,
    suggestions,
  } = analysis;

  const isSafe = humanScore >= 80;
  const isModerate = humanScore >= 60 && humanScore < 80;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-neutral-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            {isSafe ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            )}
            <h3 className="text-sm font-semibold tracking-wide uppercase text-white font-mono">
              Anti-AI & Humaniser Engine
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time heuristic & syntactic detector simulating Turnitin, GPTZero, and recruiter screening.
          </p>
        </div>

        {/* Human Authenticity Score */}
        <div className="text-right shrink-0">
          <div className="flex items-baseline justify-end gap-1">
            <span
              className={`text-2xl font-bold font-mono tabular-nums ${
                isSafe ? 'text-emerald-400' : isModerate ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              {humanScore}%
            </span>
            <span className="text-xs text-neutral-500 uppercase font-mono">Human</span>
          </div>
          <span className="text-[11px] text-neutral-400 font-mono">
            Risk: <span className={isSafe ? 'text-emerald-400' : 'text-amber-400'}>{aiDetectionRisk}</span>
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        {/* Burstiness */}
        <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800/80">
          <div className="text-[11px] text-neutral-400 font-mono uppercase">Burstiness (Cadence)</div>
          <div className="text-base font-semibold text-white font-mono mt-0.5 tabular-nums">
            {burstinessScore}/100
          </div>
          <div className="text-[11px] text-neutral-400 mt-1 truncate">
            {burstinessGrade}
          </div>
        </div>

        {/* Lexical Diversity */}
        <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800/80">
          <div className="text-[11px] text-neutral-400 font-mono uppercase">Lexical Diversity</div>
          <div className="text-base font-semibold text-white font-mono mt-0.5 tabular-nums">
            {lexicalDiversity}%
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Unique vocabulary ratio
          </div>
        </div>

        {/* Avg Words per bullet */}
        <div className="p-3 bg-neutral-950/60 rounded-lg border border-neutral-800/80">
          <div className="text-[11px] text-neutral-400 font-mono uppercase">Avg Words / Bullet</div>
          <div className="text-base font-semibold text-white font-mono mt-0.5 tabular-nums">
            {avgWordsPerBullet} words
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Target: 14 – 24 words
          </div>
        </div>
      </div>

      {/* Flagged AI Clichés */}
      <div className="my-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
            Flagged AI Clichés ({flaggedPhrases.length})
          </span>
          {flaggedPhrases.length === 0 && (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Zero AI markers found
            </span>
          )}
        </div>

        {flaggedPhrases.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {flaggedPhrases.map(({ phrase, count, recommendation }, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/90 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-rose-300 font-mono">"{phrase}"</span>
                    <span className="text-[10px] text-neutral-500 font-mono tabular-nums">
                      ({count}× occurrence{count > 1 ? 's' : ''})
                    </span>
                  </div>
                  <div className="text-neutral-400 text-[11.5px] mt-0.5">
                    Suggested Human alternative: <span className="text-neutral-200">{recommendation}</span>
                  </div>
                </div>

                {onReplaceCliché && (
                  <button
                    onClick={() => {
                      const firstAlt = recommendation.split(',')[0].trim();
                      onReplaceCliché(phrase, firstAlt);
                      setAppliedFixes(prev => ({ ...prev, [phrase]: true }));
                    }}
                    disabled={appliedFixes[phrase]}
                    className="shrink-0 px-2.5 py-1 text-[11px] font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors whitespace-nowrap self-start sm:self-auto disabled:opacity-50"
                  >
                    {appliedFixes[phrase] ? 'Replaced' : 'Swap First'}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-neutral-400 bg-neutral-950/40 p-3 rounded-lg border border-neutral-800/50">
            No robotic tropes detected. Bullet points read with authentic human sentence structure and natural industry voice.
          </div>
        )}
      </div>

      {/* Humaniser Controls & Strictness */}
      <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 font-mono">Strictness:</span>
          <div className="inline-flex rounded-lg bg-neutral-950 p-0.5 border border-neutral-800">
            <button
              onClick={() => setStrictness('balanced')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                strictness === 'balanced'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Balanced
            </button>
            <button
              onClick={() => setStrictness('strict')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                strictness === 'strict'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Strict Human
            </button>
            <button
              onClick={() => setStrictness('ultra_stealth')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                strictness === 'ultra_stealth'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Stealth Zero-AI
            </button>
          </div>
        </div>

        <button
          onClick={() => onApplyHumanizer(strictness)}
          disabled={isHumanizing}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 active:scale-98 rounded-lg transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isHumanizing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Humanizing Bullets...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5" />
              <span>Apply Anti-AI Humaniser Pass</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
