import React, { useState } from 'react';
import {
  Download,
  FileText,
  Printer,
  ChevronDown,
  Check,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'studio' | 'ground_base' | 'ats_audit' | 'job_matcher' | 'cover_letter';
  onSelectTab: (tab: 'studio' | 'ground_base' | 'ats_audit' | 'job_matcher' | 'cover_letter') => void;
  onExport: (format: 'pdf' | 'docx' | 'txt' | 'markdown' | 'json') => void;
  atsScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onExport,
  atsScore,
}) => {
  const [exportOpen, setExportOpen] = useState(false);

  const navLinks: Array<{
    id: 'studio' | 'ground_base' | 'ats_audit' | 'job_matcher' | 'cover_letter';
    label: string;
  }> = [
    { id: 'studio', label: 'Resume Studio' },
    { id: 'ground_base', label: 'Ground Base' },
    { id: 'ats_audit', label: 'ATS Audit' },
    { id: 'job_matcher', label: 'Keywords & JD' },
    { id: 'cover_letter', label: 'Cover Letter' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('studio')}
            className="flex items-center gap-2 text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono text-base">
              V
            </div>
            <span className="text-lg font-bold tracking-tight text-white font-sans whitespace-nowrap">
              Veritas ATS
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-400">
          {navLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`transition-colors whitespace-nowrap py-1 relative ${
                  isActive ? 'text-white font-semibold' : 'hover:text-neutral-200'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action with export format selector */}
        <div className="flex items-center gap-3 shrink-0 relative">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300">
            <span className="text-neutral-500">ATS:</span>
            <span className="text-emerald-400 font-bold tabular-nums">{atsScore}%</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setExportOpen(!exportOpen)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 active:scale-98 rounded-lg transition-all shadow-sm whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Resume</span>
              <ChevronDown className="w-3 h-3 text-neutral-950/70" />
            </button>

            {exportOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setExportOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-neutral-900 border border-neutral-800 p-1.5 shadow-xl z-50 text-xs">
                  <div className="px-2.5 py-1 text-[10px] font-mono text-neutral-500 uppercase">
                    Select Export Format
                  </div>
                  <button
                    onClick={() => {
                      onExport('pdf');
                      setExportOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-neutral-200 hover:bg-neutral-800 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <Printer className="w-3.5 h-3.5 text-emerald-400" />
                        <span>ATS Clean PDF</span>
                      </div>
                      <div className="text-[10px] text-neutral-400">100% Vector Print Layout</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onExport('docx');
                      setExportOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-neutral-200 hover:bg-neutral-800 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-sky-400" />
                        <span>Word (.doc) Document</span>
                      </div>
                      <div className="text-[10px] text-neutral-400">Formatted for MS Word & Docs</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onExport('txt');
                      setExportOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-neutral-200 hover:bg-neutral-800 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <span className="font-mono text-amber-400 text-xs">TXT</span>
                        <span>ATS Plain Text</span>
                      </div>
                      <div className="text-[10px] text-neutral-400">For Taleo/Workday form fields</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onExport('markdown');
                      setExportOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-neutral-200 hover:bg-neutral-800 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-white">Markdown (.md)</div>
                      <div className="text-[10px] text-neutral-400">For GitHub & Developers</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onExport('json');
                      setExportOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-neutral-200 hover:bg-neutral-800 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-white font-mono text-[11px]">JSON Resume</div>
                      <div className="text-[10px] text-neutral-400">Open schema compatible</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav drawer strip */}
      <div className="md:hidden flex items-center overflow-x-auto border-t border-neutral-850 px-4 py-2 gap-4 text-xs font-medium text-neutral-400 scrollbar-none">
        {navLinks.map(link => (
          <button
            key={link.id}
            onClick={() => onSelectTab(link.id)}
            className={`whitespace-nowrap ${activeTab === link.id ? 'text-emerald-400 font-semibold' : ''}`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
};
