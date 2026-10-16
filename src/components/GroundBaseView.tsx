import React, { useState } from 'react';
import type { GroundBaseProfile, ExperienceItem, SkillCategories } from '../types/resume.ts';
import {
  Upload,
  FileText,
  Layers,
  Plus,
  Check,
  RefreshCw,
  FolderGit2,
  Trash2,
  Sparkles,
  ArrowRight,
  Database
} from 'lucide-react';

interface GroundBaseViewProps {
  groundBase: GroundBaseProfile;
  onUploadResumeFile: (file: File) => Promise<void>;
  onApplyExperienceToActiveResume: (exp: ExperienceItem) => void;
  onApplySkillToActiveResume: (skill: string, category: keyof SkillCategories) => void;
  isProcessingUpload: boolean;
}

export const GroundBaseView: React.FC<GroundBaseViewProps> = ({
  groundBase,
  onUploadResumeFile,
  onApplyExperienceToActiveResume,
  onApplySkillToActiveResume,
  isProcessingUpload,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedExps, setSelectedExps] = useState<Record<string, boolean>>({});

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadResumeFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">
                Multi-Resume Ground Base Repository
              </h2>
            </div>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Upload past resumes in <span className="text-neutral-200 font-mono">PDF, DOCX, or Image</span> formats to extract and aggregate all past roles, achievements, and technical competencies into a single master profile.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300">
              <span className="text-emerald-400 font-bold tabular-nums">{groundBase.sourceFiles.length}</span> Resumes Aggregated
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300">
              <span className="text-emerald-400 font-bold tabular-nums">{groundBase.aggregatedExperiences.length}</span> Roles Synthesized
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleFileDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragOver
            ? 'border-emerald-500 bg-emerald-950/20'
            : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
        }`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-800 text-emerald-400 flex items-center justify-center mx-auto">
            {isProcessingUpload ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              {isProcessingUpload ? 'Extracting & Parsing Document...' : 'Upload Reference Resume'}
            </h4>
            <p className="text-xs text-neutral-400 mt-1">
              Drop any <span className="font-mono text-neutral-300">.pdf, .docx, .png, .jpg</span> here, or click below. Multimodal AI automatically analyzes layouts and bullets.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 cursor-pointer rounded-lg transition-colors">
            <span>Browse Document File</span>
            <input
              type="file"
              accept=".pdf,.docx,.doc,image/*"
              onChange={handleFileInput}
              disabled={isProcessingUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Uploaded Source Files Strip */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <h3 className="text-xs font-mono uppercase text-neutral-400 tracking-wider mb-3">
          Source Resumes in Ground Base
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {groundBase.sourceFiles.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg bg-neutral-950 border border-neutral-800"
            >
              <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-neutral-200 truncate">{file.name}</div>
                <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                  Uploaded {file.uploadedAt}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aggregated Experience Library */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white font-mono uppercase">
              Master Experience & Bullet Library
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Select any role or bullet point to inject directly into your current active resume.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {groundBase.aggregatedExperiences.map((exp) => (
            <div
              key={exp.id}
              className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-sm font-bold text-white">{exp.role}</span>
                  <span className="text-xs text-neutral-400 ml-2">@ {exp.company}</span>
                  <span className="text-[11px] text-neutral-500 font-mono ml-2">({exp.startDate} – {exp.current ? 'Present' : exp.endDate})</span>
                </div>
                <button
                  onClick={() => {
                    onApplyExperienceToActiveResume(exp);
                    setSelectedExps(prev => ({ ...prev, [exp.id]: true }));
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors shrink-0 self-start sm:self-auto"
                >
                  {selectedExps[exp.id] ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Added to Active Resume</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Pull Into Resume</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bullets */}
              <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-neutral-300">
                {exp.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {exp.technologies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[10.5px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Aggregated Skills Pool */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white font-mono uppercase mb-2">
          Aggregated Competencies Pool
        </h3>
        <p className="text-xs text-neutral-400 mb-4">
          Click any skill below to quickly add it to your active resume's skills matrix.
        </p>

        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-neutral-400 font-mono mb-1.5">Technical & Languages:</div>
            <div className="flex flex-wrap gap-1.5">
              {groundBase.aggregatedSkills.technical.map((skill, i) => (
                <button
                  key={i}
                  onClick={() => onApplySkillToActiveResume(skill, 'technical')}
                  className="px-2.5 py-1 text-xs font-mono bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded transition-colors flex items-center gap-1 group"
                >
                  <span>{skill}</span>
                  <Plus className="w-3 h-3 text-neutral-500 group-hover:text-emerald-400" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-neutral-400 font-mono mb-1.5">Tools & Cloud Systems:</div>
            <div className="flex flex-wrap gap-1.5">
              {groundBase.aggregatedSkills.tools.map((skill, i) => (
                <button
                  key={i}
                  onClick={() => onApplySkillToActiveResume(skill, 'tools')}
                  className="px-2.5 py-1 text-xs font-mono bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded transition-colors flex items-center gap-1 group"
                >
                  <span>{skill}</span>
                  <Plus className="w-3 h-3 text-neutral-500 group-hover:text-emerald-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
