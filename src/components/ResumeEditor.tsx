import React, { useState } from 'react';
import type { ResumeData, ExperienceItem, EducationItem, ProjectItem } from '../types/resume.ts';
import { quickHumanizeBullet, AI_FLAGGED_PHRASES } from '../utils/antiAiDetector.ts';
import {
  Plus,
  Trash2,
  Wand2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Check,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderKanban,
  Award,
  Sparkles
} from 'lucide-react';

interface ResumeEditorProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
  missingKeywords?: string[];
  onAddMissingKeyword?: (kw: string) => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resume,
  onChange,
  missingKeywords = [],
  onAddMissingKeyword,
}) => {
  const [activeSection, setActiveSection] = useState<string>('experience');

  const updatePersonalInfo = (field: string, val: string) => {
    onChange({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: val,
      },
    });
  };

  const updateSummary = (val: string) => {
    onChange({
      ...resume,
      summary: val,
    });
  };

  // Experience Handlers
  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: 'exp_' + Date.now(),
      company: 'New Company',
      role: 'Software Engineer',
      location: 'Remote',
      startDate: '2023',
      endDate: 'Present',
      current: true,
      bullets: ['Built scalable services and optimized database queries.'],
      technologies: ['TypeScript', 'Node.js']
    };
    onChange({
      ...resume,
      experience: [newExp, ...resume.experience],
    });
  };

  const handleUpdateExperience = (idx: number, updated: ExperienceItem) => {
    const next = [...resume.experience];
    next[idx] = updated;
    onChange({ ...resume, experience: next });
  };

  const handleDeleteExperience = (idx: number) => {
    const next = resume.experience.filter((_, i) => i !== idx);
    onChange({ ...resume, experience: next });
  };

  const handleUpdateBullet = (expIdx: number, bulletIdx: number, val: string) => {
    const exp = { ...resume.experience[expIdx] };
    const bullets = [...exp.bullets];
    bullets[bulletIdx] = val;
    exp.bullets = bullets;
    handleUpdateExperience(expIdx, exp);
  };

  const handleAddBullet = (expIdx: number) => {
    const exp = { ...resume.experience[expIdx] };
    exp.bullets = [...exp.bullets, 'Delivered measurable improvement across core product metrics.'];
    handleUpdateExperience(expIdx, exp);
  };

  const handleDeleteBullet = (expIdx: number, bulletIdx: number) => {
    const exp = { ...resume.experience[expIdx] };
    exp.bullets = exp.bullets.filter((_, i) => i !== bulletIdx);
    handleUpdateExperience(expIdx, exp);
  };

  const handleHumanizeBullet = (expIdx: number, bulletIdx: number) => {
    const current = resume.experience[expIdx].bullets[bulletIdx];
    const humanized = quickHumanizeBullet(current);
    handleUpdateBullet(expIdx, bulletIdx, humanized);
  };

  // Skills handlers
  const handleAddSkill = (category: 'technical' | 'tools' | 'domain' | 'soft', skillName: string) => {
    if (!skillName.trim()) return;
    const existing = resume.skills[category] || [];
    if (existing.includes(skillName.trim())) return;
    onChange({
      ...resume,
      skills: {
        ...resume.skills,
        [category]: [...existing, skillName.trim()]
      }
    });
  };

  const handleRemoveSkill = (category: 'technical' | 'tools' | 'domain' | 'soft', idx: number) => {
    onChange({
      ...resume,
      skills: {
        ...resume.skills,
        [category]: resume.skills[category].filter((_, i) => i !== idx)
      }
    });
  };

  // Check if bullet contains AI cliché
  const getBulletAiFlag = (bullet: string) => {
    const lower = bullet.toLowerCase();
    return AI_FLAGGED_PHRASES.find(phrase => {
      const reg = new RegExp(`\\b${phrase}\\b`, 'i');
      return reg.test(lower);
    });
  };

  return (
    <div className="space-y-4">
      {/* Missing Keywords Bar */}
      {missingKeywords.length > 0 && onAddMissingKeyword && (
        <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-semibold text-amber-300 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Missing High-Priority Job Keywords
            </span>
            <span className="text-[11px] text-amber-400/80 font-mono">1-Click Insert</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.slice(0, 8).map((kw, i) => (
              <button
                key={i}
                onClick={() => onAddMissingKeyword(kw)}
                className="px-2 py-0.5 text-xs font-mono bg-neutral-900 hover:bg-neutral-800 border border-amber-500/40 text-amber-200 rounded flex items-center gap-1 transition-colors group"
              >
                <span>{kw}</span>
                <Plus className="w-3 h-3 text-amber-400 group-hover:scale-110" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Accordion Navigation */}
      <div className="flex flex-wrap gap-1.5 border-b border-neutral-800 pb-2">
        {[
          { id: 'contact', label: 'Contact Info', icon: User },
          { id: 'summary', label: 'Summary', icon: Sparkles },
          { id: 'experience', label: 'Experience', icon: Briefcase },
          { id: 'skills', label: 'Skills Matrix', icon: Code },
          { id: 'projects', label: 'Key Projects', icon: FolderKanban },
          { id: 'education', label: 'Education', icon: GraduationCap },
          { id: 'certifications', label: 'Certifications', icon: Award },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Contact Info Section */}
      {activeSection === 'contact' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-mono uppercase text-neutral-300 tracking-wider mb-2">
            ATS Contact Identification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-mono text-neutral-400">Full Name</label>
              <input
                type="text"
                value={resume.personalInfo.fullName}
                onChange={e => updatePersonalInfo('fullName', e.target.value)}
                className="w-full mt-1 p-2 rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-neutral-400">Target Job Title</label>
              <input
                type="text"
                value={resume.personalInfo.jobTitle}
                onChange={e => updatePersonalInfo('jobTitle', e.target.value)}
                className="w-full mt-1 p-2 rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-neutral-400">Email Address (ATS Primary Key)</label>
              <input
                type="email"
                value={resume.personalInfo.email}
                onChange={e => updatePersonalInfo('email', e.target.value)}
                className="w-full mt-1 p-2 rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-neutral-400">Direct Phone</label>
              <input
                type="text"
                value={resume.personalInfo.phone}
                onChange={e => updatePersonalInfo('phone', e.target.value)}
                className="w-full mt-1 p-2 rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-neutral-400">Location (City, State / Remote)</label>
              <input
                type="text"
                value={resume.personalInfo.location}
                onChange={e => updatePersonalInfo('location', e.target.value)}
                className="w-full mt-1 p-2 rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-neutral-400">LinkedIn URL</label>
              <input
                type="text"
                value={resume.personalInfo.linkedin || ''}
                onChange={e => updatePersonalInfo('linkedin', e.target.value)}
                className="w-full mt-1 p-2 rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-neutral-400">GitHub Profile</label>
              <input
                type="text"
                value={resume.personalInfo.github || ''}
                onChange={e => updatePersonalInfo('github', e.target.value)}
                className="w-full mt-1 p-2 rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-neutral-400">Portfolio / Web</label>
              <input
                type="text"
                value={resume.personalInfo.portfolio || ''}
                onChange={e => updatePersonalInfo('portfolio', e.target.value)}
                className="w-full mt-1 p-2 rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Professional Summary Section */}
      {activeSection === 'summary' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase text-neutral-300 tracking-wider">
              Professional Summary
            </h3>
            <span className="text-[11px] text-neutral-500 font-mono">
              Word Count: {resume.summary.split(/\s+/).filter(Boolean).length}
            </span>
          </div>
          <textarea
            value={resume.summary}
            onChange={e => updateSummary(e.target.value)}
            rows={5}
            className="w-full p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs font-mono leading-relaxed focus:outline-hidden focus:border-emerald-500"
          />
        </div>
      )}

      {/* 3. Work Experience Section */}
      {activeSection === 'experience' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
              Work Experience ({resume.experience.length})
            </h3>
            <button
              onClick={handleAddExperience}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Role</span>
            </button>
          </div>

          {resume.experience.map((exp, expIdx) => (
            <div
              key={exp.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3"
            >
              {/* Role Header Inputs */}
              <div className="flex items-start justify-between gap-2 border-b border-neutral-800 pb-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 flex-1">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400">Role Title</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={e => handleUpdateExperience(expIdx, { ...exp, role: e.target.value })}
                      className="w-full mt-0.5 p-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={e => handleUpdateExperience(expIdx, { ...exp, company: e.target.value })}
                      className="w-full mt-0.5 p-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400">Date Range</label>
                    <div className="flex items-center gap-1 mt-0.5">
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={e => handleUpdateExperience(expIdx, { ...exp, startDate: e.target.value })}
                        placeholder="Jan 2022"
                        className="w-1/2 p-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-white font-mono"
                      />
                      <span className="text-neutral-500 text-xs">-</span>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={e => handleUpdateExperience(expIdx, { ...exp, endDate: e.target.value })}
                        placeholder="Present"
                        className="w-1/2 p-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={e => handleUpdateExperience(expIdx, { ...exp, location: e.target.value })}
                      className="w-full mt-0.5 p-1.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteExperience(expIdx)}
                  className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors"
                  title="Delete role"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bullet Points with Anti-AI detection badges */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase">
                    Achievements & Responsibilities
                  </span>
                  <button
                    onClick={() => handleAddBullet(expIdx)}
                    className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:underline"
                  >
                    <Plus className="w-3 h-3" /> Add Bullet
                  </button>
                </div>

                {exp.bullets.map((bullet, bulletIdx) => {
                  const flaggedCliche = getBulletAiFlag(bullet);

                  return (
                    <div
                      key={bulletIdx}
                      className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-850 space-y-1.5"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-neutral-600 font-mono text-xs mt-1 shrink-0">
                          {bulletIdx + 1}.
                        </span>
                        <textarea
                          value={bullet}
                          onChange={e => handleUpdateBullet(expIdx, bulletIdx, e.target.value)}
                          rows={2}
                          className="w-full p-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 font-mono leading-relaxed focus:outline-hidden focus:border-emerald-500 resize-none"
                        />
                        <button
                          onClick={() => handleDeleteBullet(expIdx, bulletIdx)}
                          className="p-1 text-neutral-600 hover:text-rose-400 shrink-0"
                          title="Remove bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Anti-AI Flag Callout */}
                      {flaggedCliche && (
                        <div className="flex items-center justify-between bg-rose-950/30 border border-rose-800/40 rounded px-2.5 py-1 text-[11px]">
                          <span className="text-rose-300 font-mono flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> Flagged AI marker: "{flaggedCliche}"
                          </span>
                          <button
                            onClick={() => handleHumanizeBullet(expIdx, bulletIdx)}
                            className="flex items-center gap-1 px-2 py-0.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded font-mono text-[10px] transition-colors"
                          >
                            <Wand2 className="w-3 h-3 text-emerald-400" />
                            <span>Humanise Bullet</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Skills Matrix Section */}
      {activeSection === 'skills' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono uppercase text-neutral-300 tracking-wider">
            Categorized Skills Matrix
          </h3>

          {(['technical', 'tools', 'domain', 'soft'] as const).map(cat => {
            const labels: Record<string, string> = {
              technical: 'Programming Languages & Core Backend/Frontend',
              tools: 'Cloud, Infrastructure & DevOps Tools',
              domain: 'Domain Architecture & System Design',
              soft: 'Engineering Leadership & Methodologies'
            };

            return (
              <div key={cat} className="space-y-1.5">
                <div className="text-xs font-semibold text-neutral-300 font-mono">{labels[cat]}</div>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-neutral-950 border border-neutral-800 min-h-[44px]">
                  {resume.skills[cat].map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono bg-neutral-900 border border-neutral-800 text-neutral-200 rounded"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(cat, i)}
                        className="text-neutral-500 hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="+ Type skill and hit Enter"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        handleAddSkill(cat, input.value);
                        input.value = '';
                      }
                    }}
                    className="flex-1 min-w-[140px] bg-transparent text-xs text-neutral-300 placeholder-neutral-600 focus:outline-hidden font-mono px-2"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Key Projects Section */}
      {activeSection === 'projects' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase text-neutral-300 tracking-wider">
              Featured Technical Projects
            </h3>
            <button
              onClick={() => {
                const newProj: ProjectItem = {
                  id: 'proj_' + Date.now(),
                  name: 'New Project',
                  description: 'Architected high-throughput service.',
                  bullets: ['Handled 10,000+ requests with zero packet drop.'],
                  technologies: ['TypeScript', 'Docker']
                };
                onChange({ ...resume, projects: [...resume.projects, newProj] });
              }}
              className="flex items-center gap-1 text-xs font-mono text-emerald-400 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>

          {resume.projects.map((proj, pIdx) => (
            <div key={proj.id} className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={proj.name}
                  onChange={e => {
                    const next = [...resume.projects];
                    next[pIdx].name = e.target.value;
                    onChange({ ...resume, projects: next });
                  }}
                  className="font-bold text-xs text-white bg-neutral-900 border border-neutral-800 rounded px-2 py-1 flex-1 font-mono"
                />
                <input
                  type="text"
                  value={proj.link || ''}
                  placeholder="github.com/..."
                  onChange={e => {
                    const next = [...resume.projects];
                    next[pIdx].link = e.target.value;
                    onChange({ ...resume, projects: next });
                  }}
                  className="text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 rounded px-2 py-1 flex-1 font-mono"
                />
                <button
                  onClick={() => {
                    const next = resume.projects.filter((_, i) => i !== pIdx);
                    onChange({ ...resume, projects: next });
                  }}
                  className="text-neutral-500 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <textarea
                value={proj.description}
                onChange={e => {
                  const next = [...resume.projects];
                  next[pIdx].description = e.target.value;
                  onChange({ ...resume, projects: next });
                }}
                rows={2}
                placeholder="Brief project architecture summary..."
                className="w-full p-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 font-mono resize-none"
              />
            </div>
          ))}
        </div>
      )}

      {/* 6. Education Section */}
      {activeSection === 'education' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase text-neutral-300 tracking-wider">
              Educational Credentials
            </h3>
            <button
              onClick={() => {
                const newEdu: EducationItem = {
                  id: 'edu_' + Date.now(),
                  institution: 'University Name',
                  degree: 'B.S.',
                  field: 'Computer Science',
                  graduationDate: '2022'
                };
                onChange({ ...resume, education: [...resume.education, newEdu] });
              }}
              className="flex items-center gap-1 text-xs font-mono text-emerald-400 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add Degree
            </button>
          </div>

          {resume.education.map((edu, eIdx) => (
            <div key={edu.id} className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={edu.degree}
                  placeholder="Degree (e.g. B.S.)"
                  onChange={e => {
                    const next = [...resume.education];
                    next[eIdx].degree = e.target.value;
                    onChange({ ...resume, education: next });
                  }}
                  className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-white font-mono"
                />
                <input
                  type="text"
                  value={edu.field}
                  placeholder="Field of Study"
                  onChange={e => {
                    const next = [...resume.education];
                    next[eIdx].field = e.target.value;
                    onChange({ ...resume, education: next });
                  }}
                  className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-white font-mono"
                />
                <input
                  type="text"
                  value={edu.institution}
                  placeholder="Institution"
                  onChange={e => {
                    const next = [...resume.education];
                    next[eIdx].institution = e.target.value;
                    onChange({ ...resume, education: next });
                  }}
                  className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-white font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7. Certifications Section */}
      {activeSection === 'certifications' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase text-neutral-300 tracking-wider">
              Certifications & Accreditations
            </h3>
            <button
              onClick={() => {
                const newCert = {
                  id: 'cert_' + Date.now(),
                  name: 'New Certification',
                  issuer: 'Issuing Body',
                  date: '2024'
                };
                onChange({ ...resume, certifications: [...(resume.certifications || []), newCert] });
              }}
              className="flex items-center gap-1 text-xs font-mono text-emerald-400 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add Certification
            </button>
          </div>

          {(resume.certifications || []).map((cert, cIdx) => (
            <div key={cert.id} className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={cert.name}
                  placeholder="Certificate Name"
                  onChange={e => {
                    const next = [...(resume.certifications || [])];
                    next[cIdx].name = e.target.value;
                    onChange({ ...resume, certifications: next });
                  }}
                  className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-white font-mono"
                />
                <input
                  type="text"
                  value={cert.issuer}
                  placeholder="Issuer (e.g. AWS, CNCF)"
                  onChange={e => {
                    const next = [...(resume.certifications || [])];
                    next[cIdx].issuer = e.target.value;
                    onChange({ ...resume, certifications: next });
                  }}
                  className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-white font-mono"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cert.date}
                    placeholder="Year (e.g. 2024)"
                    onChange={e => {
                      const next = [...(resume.certifications || [])];
                      next[cIdx].date = e.target.value;
                      onChange({ ...resume, certifications: next });
                    }}
                    className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-xs text-white font-mono flex-1"
                  />
                  <button
                    onClick={() => {
                      const next = (resume.certifications || []).filter((_, i) => i !== cIdx);
                      onChange({ ...resume, certifications: next });
                    }}
                    className="text-neutral-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
