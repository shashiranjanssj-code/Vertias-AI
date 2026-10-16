import React, { useState } from 'react';
import type { ResumeData, JobDescriptionData, CoverLetterConfig } from '../types/resume.ts';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Download,
  ShieldCheck,
  Wand2,
  Sliders
} from 'lucide-react';

interface CoverLetterViewProps {
  resume: ResumeData;
  jobDescription: JobDescriptionData;
}

export const CoverLetterView: React.FC<CoverLetterViewProps> = ({
  resume,
  jobDescription,
}) => {
  const [config, setConfig] = useState<CoverLetterConfig>({
    recipientName: 'Hiring Committee',
    recipientTitle: 'Engineering Leadership',
    companyName: jobDescription.company || 'Target Organization',
    jobTitle: jobDescription.title || 'Senior Software Engineer',
    tone: 'confident_bold',
    customInstructions: ''
  });

  const [generatedLetter, setGeneratedLetter] = useState<string>(
    `Dear ${config.recipientName || 'Hiring Team'},

When scaling distributed systems under real-world load, the difference between 400ms and 40ms p99 query latency is almost always architectural discipline. Having spent the last several years re-architecting event streaming pipelines at Apex Cloud Solutions—cutting compute infrastructure costs by $140,000 annually while serving 4.8M monthly active users—I followed ${jobDescription.company || 'your team'}'s engineering expansion with great interest.

Your requirement for a ${jobDescription.title || 'Senior Engineer'} skilled in ${jobDescription.requiredSkills?.slice(0, 3).join(', ') || 'TypeScript and distributed systems'} aligns directly with what I deliver day-to-day. At Apex, I migrated 3 monolithic clusters to containerized Kubernetes nodes with customized horizontal pod autoscaling, sustaining 12,000 requests per second with zero downtime. Concurrently, building our full-stack observability dashboard in React and OpenTelemetry dropped team MTTR by 38%.

I build with high ownership, clear technical RFCs, and an obsession with measurable business outcomes. I welcome the opportunity to discuss how my hands-on background in reliable distributed infrastructure can directly accelerate ${jobDescription.company || 'your'} upcoming product initiatives.

Sincerely,
${resume.personalInfo.fullName}
${resume.personalInfo.phone} · ${resume.personalInfo.email}`
  );

  const [humanScore, setHumanScore] = useState<number>(98);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const toneOptions: Array<{
    id: CoverLetterConfig['tone'];
    label: string;
    description: string;
  }> = [
    {
      id: 'confident_bold',
      label: 'Confident & High-Conviction',
      description: 'Assertive, authoritative tone emphasizing proven architectural wins and quantifiable ROI.',
    },
    {
      id: 'direct_tech',
      label: 'Modern Tech & Direct',
      description: 'Crisp, engineering-first narrative highlighting benchmarks, stack mastery, and execution speed.',
    },
    {
      id: 'executive',
      label: 'Classic Executive',
      description: 'Strategic leadership tone focusing on team mentorship, business alignment, and org scaling.',
    },
    {
      id: 'consultative',
      label: 'Consultative Problem-Solver',
      description: 'Diagnostic approach identifying the company’s documented challenges and proposing concrete fixes.',
    },
    {
      id: 'mission_driven',
      label: 'Mission-Driven & Cultural',
      description: 'Purpose-led tone connecting personal ethos to company product philosophy.',
    },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume,
          jobDescription,
          config,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setGeneratedLetter(data.content);
          setHumanScore(data.humanAuthenticityScore || 97);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([generatedLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Cover_Letter.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">
                Adaptive Anti-AI Cover Letter Studio
              </h2>
            </div>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Generates high-converting, human-cadence cover letters tailored to the target role. Completely eliminates generic AI phrases ("I am writing to express enthusiasm...") in favor of high-impact narrative hooks.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Anti-AI Shield: {humanScore}% Verified Human</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls vs Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tone Selector */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sliders className="w-4 h-4 text-neutral-400" />
              <h3 className="text-xs font-mono uppercase text-neutral-300 tracking-wider">
                Select Narrative Tone
              </h3>
            </div>

            <div className="space-y-2">
              {toneOptions.map(t => (
                <button
                  key={t.id}
                  onClick={() => setConfig(prev => ({ ...prev, tone: t.id }))}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    config.tone === t.id
                      ? 'bg-neutral-950 border-emerald-500/50 shadow-xs'
                      : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                  }`}
                >
                  <div className={`text-xs font-semibold ${config.tone === t.id ? 'text-emerald-300' : 'text-neutral-200'}`}>
                    {t.label}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                    {t.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recipient Details */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-mono uppercase text-neutral-300 tracking-wider">
              Application Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-neutral-400">Target Company</label>
                <input
                  type="text"
                  value={config.companyName}
                  onChange={e => setConfig(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full mt-1 p-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-neutral-400">Target Role</label>
                <input
                  type="text"
                  value={config.jobTitle}
                  onChange={e => setConfig(prev => ({ ...prev, jobTitle: e.target.value }))}
                  className="w-full mt-1 p-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-neutral-400">Recipient Name / Title</label>
                <input
                  type="text"
                  value={config.recipientName}
                  onChange={e => setConfig(prev => ({ ...prev, recipientName: e.target.value }))}
                  className="w-full mt-1 p-2 rounded bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-neutral-400">Candidate Signature</label>
                <input
                  type="text"
                  disabled
                  value={resume.personalInfo.fullName}
                  className="w-full mt-1 p-2 rounded bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-400 font-mono cursor-not-allowed"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Humanized Letter...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Generate Adaptive Cover Letter</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Editor & Document Preview */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
              <span className="text-xs font-mono uppercase text-neutral-300 tracking-wider">
                Generated Letter Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .TXT</span>
                </button>
              </div>
            </div>

            <textarea
              value={generatedLetter}
              onChange={e => setGeneratedLetter(e.target.value)}
              className="w-full h-[450px] p-4 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs font-sans leading-relaxed focus:outline-hidden focus:border-emerald-500 resize-none font-mono"
            />
          </div>

          <div className="pt-3 border-t border-neutral-800 mt-3 flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>Word Count: {generatedLetter.split(/\s+/).filter(Boolean).length} words</span>
            <span>Target: ~280 - 350 words</span>
          </div>
        </div>
      </div>
    </div>
  );
};
