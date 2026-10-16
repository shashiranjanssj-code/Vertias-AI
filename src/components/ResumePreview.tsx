import React from 'react';
import type { ResumeData } from '../types/resume.ts';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface ResumePreviewProps {
  resume: ResumeData;
  highlightKeywords?: string[];
  template?: 'classic' | 'modern' | 'minimal';
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  highlightKeywords = [],
  template = 'classic',
}) => {
  const { personalInfo, summary, experience, skills, education, projects, certifications } = resume;

  // Keyword highlighter helper
  const renderHighlighted = (text: string) => {
    if (!text || highlightKeywords.length === 0) return text;

    const regex = new RegExp(`(${highlightKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      highlightKeywords.some(k => k.toLowerCase() === part.toLowerCase()) ? (
        <mark key={i} className="bg-amber-200 text-neutral-900 rounded-xs px-0.5 font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      id="printable-resume"
      className="bg-white text-neutral-900 font-sans p-8 md:p-12 shadow-md border border-neutral-300 w-full max-w-[850px] mx-auto min-h-[1050px] print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none text-[13.5px] leading-relaxed transition-all"
    >
      {/* Header */}
      <header className="border-b border-neutral-900 pb-3 mb-5 text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950 uppercase font-sans">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-sm font-semibold text-neutral-700 tracking-wide mt-0.5 uppercase">
            {personalInfo.jobTitle}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-neutral-600 mt-2 font-mono tabular-nums">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-neutral-500 print:hidden" />
              <span>{personalInfo.email}</span>
            </span>
          )}
          {personalInfo.phone && (
            <>
              <span className="text-neutral-400 print:text-neutral-600">·</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-neutral-500 print:hidden" />
                <span>{personalInfo.phone}</span>
              </span>
            </>
          )}
          {personalInfo.location && (
            <>
              <span className="text-neutral-400 print:text-neutral-600">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-500 print:hidden" />
                <span>{personalInfo.location}</span>
              </span>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span className="text-neutral-400 print:text-neutral-600">·</span>
              <span className="flex items-center gap-1">
                <Linkedin className="w-3 h-3 text-neutral-500 print:hidden" />
                <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </span>
            </>
          )}
          {personalInfo.github && (
            <>
              <span className="text-neutral-400 print:text-neutral-600">·</span>
              <span className="flex items-center gap-1">
                <Github className="w-3 h-3 text-neutral-500 print:hidden" />
                <span>{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </span>
            </>
          )}
          {personalInfo.portfolio && (
            <>
              <span className="text-neutral-400 print:text-neutral-600">·</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-neutral-500 print:hidden" />
                <span>{personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </span>
            </>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2 font-mono">
            Professional Summary
          </h2>
          <p className="text-neutral-800 text-[13px] leading-relaxed text-justify">
            {renderHighlighted(summary)}
          </p>
        </section>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-3 font-mono">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map(exp => (
              <div key={exp.id} className="text-neutral-800">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between font-medium">
                  <div className="font-bold text-neutral-950 text-[14px]">
                    {exp.role} <span className="font-normal text-neutral-600">| {exp.company}</span>
                  </div>
                  <div className="text-xs text-neutral-600 font-mono tabular-nums whitespace-nowrap">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate} {exp.location ? `· ${exp.location}` : ''}
                  </div>
                </div>

                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-[13px] text-neutral-800 leading-normal">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className="pl-0.5">
                        {renderHighlighted(bullet)}
                      </li>
                    ))}
                  </ul>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="mt-1.5 text-xs text-neutral-600 font-mono">
                    <span className="font-semibold text-neutral-700">Tech:</span>{' '}
                    {exp.technologies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {(skills.technical.length > 0 || skills.tools.length > 0 || skills.domain.length > 0) && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2 font-mono">
            Technical & Professional Skills
          </h2>
          <div className="space-y-1.5 text-[13px] text-neutral-800">
            {skills.technical.length > 0 && (
              <div>
                <span className="font-semibold text-neutral-900">Languages & Core:</span>{' '}
                <span className="text-neutral-700">{skills.technical.join(', ')}</span>
              </div>
            )}
            {skills.tools.length > 0 && (
              <div>
                <span className="font-semibold text-neutral-900">Frameworks & Cloud:</span>{' '}
                <span className="text-neutral-700">{skills.tools.join(', ')}</span>
              </div>
            )}
            {skills.domain.length > 0 && (
              <div>
                <span className="font-semibold text-neutral-900">Domain Architecture:</span>{' '}
                <span className="text-neutral-700">{skills.domain.join(', ')}</span>
              </div>
            )}
            {skills.soft.length > 0 && (
              <div>
                <span className="font-semibold text-neutral-900">Leadership & Methods:</span>{' '}
                <span className="text-neutral-700">{skills.soft.join(', ')}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Key Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2 font-mono">
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map(proj => (
              <div key={proj.id} className="text-neutral-800">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <div className="font-bold text-neutral-950 text-[13.5px]">
                    {proj.name} {proj.link && <span className="font-normal text-xs text-neutral-600 font-mono">({proj.link})</span>}
                  </div>
                  {proj.technologies.length > 0 && (
                    <div className="text-xs text-neutral-500 font-mono">
                      {proj.technologies.join(', ')}
                    </div>
                  )}
                </div>
                {proj.description && <p className="text-xs text-neutral-700 mt-0.5">{proj.description}</p>}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-[12.5px] text-neutral-800">
                    {proj.bullets.map((b, i) => (
                      <li key={i}>{renderHighlighted(b)}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2 font-mono">
            Education
          </h2>
          <div className="space-y-2">
            {education.map(edu => (
              <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between text-[13px]">
                <div>
                  <span className="font-bold text-neutral-950">{edu.degree} in {edu.field}</span>
                  <span className="text-neutral-700"> — {edu.institution}</span>
                  {edu.gpa && <span className="text-neutral-600 text-xs ml-2">GPA: {edu.gpa}</span>}
                </div>
                <div className="text-xs text-neutral-600 font-mono tabular-nums whitespace-nowrap">
                  {edu.graduationDate} {edu.location ? `· ${edu.location}` : ''}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2 font-mono">
            Certifications & Licenses
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-800">
            {certifications.map(cert => (
              <div key={cert.id}>
                <span className="font-semibold text-neutral-950">{cert.name}</span>
                <span className="text-neutral-600"> — {cert.issuer} ({cert.date})</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
