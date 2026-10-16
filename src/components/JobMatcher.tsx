import React, { useState } from 'react';
import type { JobDescriptionData, ResumeData } from '../types/resume.ts';
import { SAMPLE_JOB_DESCRIPTIONS } from '../data/mockData.ts';
import {
  FileSearch,
  Upload,
  Plus,
  Check,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface JobMatcherProps {
  currentJD: JobDescriptionData;
  resume: ResumeData;
  onUpdateJD: (jd: JobDescriptionData) => void;
  onAddKeywordToResume: (keyword: string) => void;
  onAnalyzeUploadedJD: (file: File) => Promise<void>;
  isAnalyzingJD: boolean;
}

export const JobMatcher: React.FC<JobMatcherProps> = ({
  currentJD,
  resume,
  onUpdateJD,
  onAddKeywordToResume,
  onAnalyzeUploadedJD,
  isAnalyzingJD,
}) => {
  const [pasteText, setPasteText] = useState(currentJD.rawText || '');
  const [addedKeywords, setAddedKeywords] = useState<Record<string, boolean>>({});

  // Flatten resume text to check real-time matches
  const fullResumeText = [
    resume.summary,
    resume.personalInfo.jobTitle,
    ...resume.skills.technical,
    ...resume.skills.tools,
    ...resume.skills.domain,
    ...resume.skills.soft,
    ...resume.experience.map(e => `${e.role} ${e.company} ${e.bullets.join(' ')}`),
    ...resume.projects.map(p => `${p.name} ${p.description} ${p.bullets.join(' ')}`)
  ].join(' ').toLowerCase();

  const handleApplyPastedText = async () => {
    if (!pasteText.trim()) return;
    try {
      const res = await fetch('/api/extract-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pasteText })
      });
      if (res.ok) {
        const data = await res.json();
        onUpdateJD(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAnalyzeUploadedJD(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">
                Job Description Keyword Optimizer
              </h2>
            </div>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Paste or upload job descriptions in <span className="text-neutral-200 font-mono">PDF, DOCX, or screenshot</span> format. Our parser extracts high-impact keywords, monitors density, and guides 1-click insertion.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono">Load Presets:</span>
            {SAMPLE_JOB_DESCRIPTIONS.map((jd, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onUpdateJD(jd);
                  setPasteText(jd.rawText);
                }}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors whitespace-nowrap ${
                  currentJD.title === jd.title
                    ? 'bg-neutral-800 border-emerald-500/50 text-emerald-300'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {jd.company}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input / Upload Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Paste Box */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono uppercase text-neutral-400 tracking-wider mb-2">
              Paste Job Description Text
            </h3>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste full job posting requirements, qualifications, and role responsibilities here..."
              className="w-full h-44 p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 text-xs font-mono focus:outline-hidden focus:border-emerald-500 resize-none"
            />
          </div>
          <button
            onClick={handleApplyPastedText}
            disabled={isAnalyzingJD || !pasteText.trim()}
            className="mt-3 flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg transition-colors"
          >
            {isAnalyzingJD ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Extracting Keywords...</span>
              </>
            ) : (
              <>
                <FileSearch className="w-3.5 h-3.5" />
                <span>Analyze Pasted Job Posting</span>
              </>
            )}
          </button>
        </div>

        {/* Upload Box */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-neutral-800 text-emerald-400 flex items-center justify-center mb-3">
            {isAnalyzingJD ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>
          <h4 className="text-sm font-semibold text-white">Upload Job Description File</h4>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mb-4">
            Upload job spec as <span className="font-mono text-neutral-300">.pdf, .docx</span> or even a screenshot image of the LinkedIn / Greenhouse posting.
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 cursor-pointer rounded-lg transition-colors">
            <span>Browse JD File</span>
            <input
              type="file"
              accept=".pdf,.docx,.doc,image/*"
              onChange={handleFileInput}
              disabled={isAnalyzingJD}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Target Role & Extracted Keywords Matrix */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-800 pb-4 mb-4">
          <div>
            <span className="text-[11px] font-mono text-neutral-500 uppercase">Target Requisition</span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {currentJD.title} {currentJD.company ? `— ${currentJD.company}` : ''}
            </h3>
          </div>
          <div className="text-xs text-neutral-400 font-mono">
            {currentJD.keywords.length} Target Keywords Extracted
          </div>
        </div>

        {/* Keywords Grid */}
        <div className="space-y-4">
          <div>
            <div className="text-xs font-mono uppercase text-neutral-400 tracking-wider mb-2">
              Priority Ranking Keywords
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {currentJD.keywords.map((kw, i) => {
                const isMatched =
                  fullResumeText.includes(kw.word.toLowerCase()) || addedKeywords[kw.word];

                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                      isMatched
                        ? 'bg-neutral-950/80 border-emerald-500/30 text-neutral-200'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        {isMatched ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                        <span className={`font-medium truncate ${isMatched ? 'text-white' : 'text-neutral-300'}`}>
                          {kw.word}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                        Category: {kw.category} · {kw.required ? 'Required' : 'Preferred'}
                      </div>
                    </div>

                    {!isMatched && (
                      <button
                        onClick={() => {
                          onAddKeywordToResume(kw.word);
                          setAddedKeywords(prev => ({ ...prev, [kw.word]: true }));
                        }}
                        className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors shrink-0"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {currentJD.keyResponsibilities && currentJD.keyResponsibilities.length > 0 && (
            <div className="pt-3 border-t border-neutral-800">
              <div className="text-xs font-mono uppercase text-neutral-400 tracking-wider mb-2">
                Core Responsibilities to Mirror in Bullets
              </div>
              <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-neutral-300">
                {currentJD.keyResponsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
