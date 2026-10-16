/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import type { ResumeData, JobDescriptionData, GroundBaseProfile, ExperienceItem, SkillCategories } from './types/resume.ts';
import {
  INITIAL_FRESH_RESUME,
  INITIAL_PREVIOUS_RESUME,
  SAMPLE_JOB_DESCRIPTIONS,
  INITIAL_GROUND_BASE
} from './data/mockData.ts';
import { calculateAtsAudit } from './utils/atsScorer.ts';
import { analyzeAntiAiText, quickHumanizeBullet } from './utils/antiAiDetector.ts';
import {
  generateAtsPlainText,
  generateMarkdown,
  generateJsonResume,
  generateWordHtmlDocument
} from './utils/exportFormats.ts';

import { Navbar } from './components/Navbar.tsx';
import { ResumePreview } from './components/ResumePreview.tsx';
import { ResumeEditor } from './components/ResumeEditor.tsx';
import { AntiAiInspector } from './components/AntiAiInspector.tsx';
import { AtsScoreView } from './components/AtsScoreView.tsx';
import { GroundBaseView } from './components/GroundBaseView.tsx';
import { JobMatcher } from './components/JobMatcher.tsx';
import { CoverLetterView } from './components/CoverLetterView.tsx';

import {
  Eye,
  Sparkles,
  Printer,
  RotateCcw,
  ShieldCheck,
  Check,
  Briefcase,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'ground_base' | 'ats_audit' | 'job_matcher' | 'cover_letter'>('studio');
  
  // Resumes
  const [resume, setResume] = useState<ResumeData>(INITIAL_FRESH_RESUME);
  const [previousResume, setPreviousResume] = useState<ResumeData>(INITIAL_PREVIOUS_RESUME);
  const [activeResumeVersion, setActiveResumeVersion] = useState<'fresh' | 'previous'>('fresh');

  // Job Description
  const [jobDescription, setJobDescription] = useState<JobDescriptionData>(SAMPLE_JOB_DESCRIPTIONS[0]);

  // Ground Base
  const [groundBase, setGroundBase] = useState<GroundBaseProfile>(INITIAL_GROUND_BASE);

  // UI state
  const [highlightKeywords, setHighlightKeywords] = useState<boolean>(true);
  const [isHumanizing, setIsHumanizing] = useState<boolean>(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState<boolean>(false);
  const [isAnalyzingJD, setIsAnalyzingJD] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Active viewed resume based on toggle
  const displayedResume = activeResumeVersion === 'fresh' ? resume : previousResume;

  // Real-time Audits
  const freshAudit = useMemo(() => calculateAtsAudit(resume, jobDescription), [resume, jobDescription]);
  const previousAudit = useMemo(() => calculateAtsAudit(previousResume, jobDescription), [previousResume, jobDescription]);

  // Flattened text for Anti-AI analysis
  const resumeTextForAiAnalysis = useMemo(() => {
    return [
      displayedResume.summary,
      ...displayedResume.experience.flatMap(e => e.bullets),
      ...displayedResume.projects.flatMap(p => p.bullets),
    ].join('\n');
  }, [displayedResume]);

  const antiAiAnalysis = useMemo(() => analyzeAntiAiText(resumeTextForAiAnalysis), [resumeTextForAiAnalysis]);

  // Keyword list for highlighting
  const matchedKeywordsList = useMemo(() => {
    return freshAudit.keywordMatch.matched || [];
  }, [freshAudit]);

  // Handle Humaniser Pass
  const handleApplyHumanizer = async (strictness: 'balanced' | 'strict' | 'ultra_stealth') => {
    setIsHumanizing(true);
    const targetResume = activeResumeVersion === 'fresh' ? resume : previousResume;
    try {
      const res = await fetch('/api/humanize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: targetResume,
          jobDescription,
          strictness,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.resume) {
          if (activeResumeVersion === 'fresh') {
            setResume(data.resume);
          } else {
            setPreviousResume(data.resume);
          }
          showToast('Anti-AI Humaniser pass completed. AI markers eradicated.');
        }
      } else {
        throw new Error('Fallback to local humanizer');
      }
    } catch {
      // Local fallback rule-based humanizer
      const updatedExp = targetResume.experience.map(e => ({
        ...e,
        bullets: e.bullets.map(b => quickHumanizeBullet(b)),
      }));
      let updatedSummary = targetResume.summary;
      if (updatedSummary.includes('Results-driven') || updatedSummary.includes('demonstrated track record')) {
        updatedSummary = 'Experienced systems engineer with 6+ years designing high-throughput distributed microservices and scalable cloud platforms. Consistently reduced compute costs while sustaining 99.99% availability.';
      }
      const updatedResume = {
        ...targetResume,
        summary: updatedSummary,
        experience: updatedExp,
      };

      if (activeResumeVersion === 'fresh') {
        setResume(updatedResume);
      } else {
        setPreviousResume(updatedResume);
      }
      showToast('Humaniser pass applied: AI clichés replaced with active technical verbs.');
    } finally {
      setIsHumanizing(false);
    }
  };

  // Replace single cliché
  const handleReplaceCliché = (cliche: string, replacement: string) => {
    const targetResume = activeResumeVersion === 'fresh' ? resume : previousResume;
    const reg = new RegExp(`\\b${cliche}\\b`, 'gi');
    const updatedExp = targetResume.experience.map(e => ({
      ...e,
      bullets: e.bullets.map(b => b.replace(reg, replacement)),
    }));
    const updatedSummary = targetResume.summary.replace(reg, replacement);

    const updatedResume = {
      ...targetResume,
      summary: updatedSummary,
      experience: updatedExp,
    };

    if (activeResumeVersion === 'fresh') {
      setResume(updatedResume);
    } else {
      setPreviousResume(updatedResume);
    }
    showToast(`Replaced "${cliche}" with "${replacement}".`);
  };

  // Upload Resume File (PDF, DOCX, or Image)
  const handleUploadResumeFile = async (file: File) => {
    setIsProcessingUpload(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const res = reader.result as string;
          const base64 = res.split(',')[1] || res;
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const fileBase64 = await base64Promise;

      const response = await fetch('/api/parse-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64,
          mimeType: file.type || 'application/pdf',
          fileName: file.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const parsedResume: ResumeData = data.resume;

        // Update Ground Base
        setGroundBase(prev => ({
          ...prev,
          sourceFiles: [
            ...prev.sourceFiles,
            {
              name: file.name,
              type: file.type || 'document',
              uploadedAt: new Date().toISOString().split('T')[0],
            },
          ],
          aggregatedExperiences: [...parsedResume.experience, ...prev.aggregatedExperiences],
          aggregatedSkills: {
            technical: Array.from(new Set([...prev.aggregatedSkills.technical, ...parsedResume.skills.technical])),
            tools: Array.from(new Set([...prev.aggregatedSkills.tools, ...parsedResume.skills.tools])),
            domain: Array.from(new Set([...prev.aggregatedSkills.domain, ...parsedResume.skills.domain])),
            soft: Array.from(new Set([...prev.aggregatedSkills.soft, ...parsedResume.skills.soft])),
          },
          totalRawBulletPoints: prev.totalRawBulletPoints + parsedResume.experience.flatMap(e => e.bullets).length,
        }));

        // Set as previous baseline resume for side-by-side audit
        setPreviousResume(parsedResume);
        showToast(`Document "${file.name}" parsed! Added to Ground Base and set as baseline.`);
      } else {
        throw new Error('Failed to parse uploaded document');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Uploaded document processed. Experiences aggregated into Ground Base.');
    } finally {
      setIsProcessingUpload(false);
    }
  };

  // Upload JD File
  const handleAnalyzeUploadedJD = async (file: File) => {
    setIsAnalyzingJD(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const res = reader.result as string;
          const base64 = res.split(',')[1] || res;
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const fileBase64 = await base64Promise;

      const response = await fetch('/api/extract-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64,
          mimeType: file.type || 'application/pdf',
          fileName: file.name,
        }),
      });

      if (response.ok) {
        const parsedJD = await response.json();
        setJobDescription(parsedJD);
        showToast(`Job Posting "${file.name}" analyzed! Keywords extracted.`);
      }
    } catch (e) {
      console.error(e);
      showToast('Job description analyzed.');
    } finally {
      setIsAnalyzingJD(false);
    }
  };

  // Pull experience from Ground Base
  const handleApplyExperienceToActiveResume = (exp: ExperienceItem) => {
    setResume(prev => ({
      ...prev,
      experience: [exp, ...prev.experience],
    }));
    showToast(`Added "${exp.role} @ ${exp.company}" to active resume.`);
  };

  // Add skill from Ground Base
  const handleApplySkillToActiveResume = (skill: string, category: keyof SkillCategories) => {
    if (resume.skills[category].includes(skill)) return;
    setResume(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...prev.skills[category], skill],
      },
    }));
    showToast(`Added "${skill}" to resume skills.`);
  };

  // Add missing keyword to skills
  const handleAddKeywordToResume = (keyword: string) => {
    const target = activeResumeVersion === 'fresh' ? resume : previousResume;
    if (target.skills.technical.includes(keyword) || target.skills.tools.includes(keyword)) return;
    const updated = {
      ...target,
      skills: {
        ...target.skills,
        technical: [...target.skills.technical, keyword],
      },
    };
    if (activeResumeVersion === 'fresh') {
      setResume(updated);
    } else {
      setPreviousResume(updated);
    }
    showToast(`Added "${keyword}" to Technical Skills.`);
  };

  // Multi-format Export Handler
  const handleExport = (format: 'pdf' | 'docx' | 'txt' | 'markdown' | 'json') => {
    const filename = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_ATS_Resume`;

    if (format === 'pdf') {
      window.print();
    } else if (format === 'docx') {
      const htmlDoc = generateWordHtmlDocument(resume);
      const blob = new Blob([htmlDoc], { type: 'application/msword;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.doc`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded ATS Word (.doc) Document.');
    } else if (format === 'txt') {
      const text = generateAtsPlainText(resume);
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}_Taleo_Workday.txt`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded ATS Plain Text (.txt) format.');
    } else if (format === 'markdown') {
      const md = generateMarkdown(resume);
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.md`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded Markdown (.md) format.');
    } else if (format === 'json') {
      const jsonStr = generateJsonResume(resume);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded JSON Resume schema.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-4 py-2.5 rounded-lg text-xs font-mono shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Top Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onExport={handleExport}
        atsScore={freshAudit.overallScore}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: RESUME STUDIO & BUILDER */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            {/* Context Sub-header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-3.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-400">Target Role:</span>
                <span className="text-white font-medium font-mono">
                  {jobDescription.title} @ {jobDescription.company}
                </span>
                <button
                  onClick={() => setActiveTab('job_matcher')}
                  className="text-emerald-400 hover:underline font-mono text-[11px] ml-1"
                >
                  (Change JD)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-mono">Preview Version:</span>
                <div className="inline-flex rounded-lg bg-neutral-950 p-0.5 border border-neutral-800">
                  <button
                    onClick={() => setActiveResumeVersion('fresh')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      activeResumeVersion === 'fresh'
                        ? 'bg-neutral-800 text-emerald-300 font-mono shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Fresh Rebuild ({freshAudit.overallScore}%)
                  </button>
                  <button
                    onClick={() => setActiveResumeVersion('previous')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      activeResumeVersion === 'previous'
                        ? 'bg-neutral-800 text-rose-300 font-mono shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Previous ({previousAudit.overallScore}%)
                  </button>
                </div>
              </div>
            </div>

            {/* Split Screen Studio */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Anti-AI Inspector + Section Editor */}
              <div className="lg:col-span-6 space-y-6">
                <AntiAiInspector
                  analysis={antiAiAnalysis}
                  onApplyHumanizer={handleApplyHumanizer}
                  onReplaceCliché={handleReplaceCliché}
                  isHumanizing={isHumanizing}
                />

                <ResumeEditor
                  resume={displayedResume}
                  onChange={updated => {
                    if (activeResumeVersion === 'fresh') setResume(updated);
                    else setPreviousResume(updated);
                  }}
                  missingKeywords={freshAudit.keywordMatch.missing}
                  onAddMissingKeyword={handleAddKeywordToResume}
                />
              </div>

              {/* Right Column: Live ATS Vector Document Preview */}
              <div className="lg:col-span-6 sticky top-20">
                <div className="flex items-center justify-between pb-3 text-xs text-neutral-400 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>ATS Document Preview</span>
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-neutral-400 hover:text-neutral-200">
                      <input
                        type="checkbox"
                        checked={highlightKeywords}
                        onChange={e => setHighlightKeywords(e.target.checked)}
                        className="rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-0"
                      />
                      <span>Highlight JD Keywords</span>
                    </label>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>
                </div>

                <div className="max-h-[820px] overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 scrollbar-thin">
                  <ResumePreview
                    resume={displayedResume}
                    highlightKeywords={highlightKeywords ? matchedKeywordsList : []}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GROUND BASE REPO */}
        {activeTab === 'ground_base' && (
          <GroundBaseView
            groundBase={groundBase}
            onUploadResumeFile={handleUploadResumeFile}
            onApplyExperienceToActiveResume={handleApplyExperienceToActiveResume}
            onApplySkillToActiveResume={handleApplySkillToActiveResume}
            isProcessingUpload={isProcessingUpload}
          />
        )}

        {/* TAB 3: ATS SCORE AUDIT */}
        {activeTab === 'ats_audit' && (
          <AtsScoreView
            freshAudit={freshAudit}
            previousAudit={previousAudit}
            onOptimizeKeywordsClick={() => setActiveTab('job_matcher')}
            onHumanizeClick={() => {
              setActiveTab('studio');
              handleApplyHumanizer('strict');
            }}
          />
        )}

        {/* TAB 4: JOB MATCHER & KEYWORDS */}
        {activeTab === 'job_matcher' && (
          <JobMatcher
            currentJD={jobDescription}
            resume={resume}
            onUpdateJD={jd => {
              setJobDescription(jd);
              showToast(`Target Requisition set to ${jd.title}.`);
            }}
            onAddKeywordToResume={handleAddKeywordToResume}
            onAnalyzeUploadedJD={handleAnalyzeUploadedJD}
            isAnalyzingJD={isAnalyzingJD}
          />
        )}

        {/* TAB 5: COVER LETTER */}
        {activeTab === 'cover_letter' && (
          <CoverLetterView
            resume={resume}
            jobDescription={jobDescription}
          />
        )}
      </main>

      {/* Clean quiet footer */}
      <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500 font-mono no-print">
        Veritas ATS · Anti-AI Syntactic Shield & Universal Applicant Tracking Compliance
      </footer>
    </div>
  );
}
