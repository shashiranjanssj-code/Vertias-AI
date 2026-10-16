import type { ResumeData, CoverLetterConfig } from '../types/resume.ts';

/**
 * Generate standard ATS-optimized Plain Text.
 * Designed to parse with 100% fidelity when copy-pasted into Taleo, Workday, or ICIMS textarea fields.
 */
export function generateAtsPlainText(resume: ResumeData): string {
  const lines: string[] = [];

  // Header
  lines.push(resume.personalInfo.fullName.toUpperCase());
  if (resume.personalInfo.jobTitle) lines.push(resume.personalInfo.jobTitle);
  
  const contactParts = [
    resume.personalInfo.email,
    resume.personalInfo.phone,
    resume.personalInfo.location,
    resume.personalInfo.linkedin,
    resume.personalInfo.github
  ].filter(Boolean);
  lines.push(contactParts.join(' | '));
  lines.push('='.repeat(60));
  lines.push('');

  // Summary
  if (resume.summary) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('-'.repeat(40));
    lines.push(resume.summary);
    lines.push('');
  }

  // Experience
  if (resume.experience.length > 0) {
    lines.push('WORK EXPERIENCE');
    lines.push('-'.repeat(40));
    for (const exp of resume.experience) {
      lines.push(`${exp.role.toUpperCase()} | ${exp.company}`);
      lines.push(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate} | ${exp.location}`);
      for (const bullet of exp.bullets) {
        if (bullet.trim()) lines.push(`* ${bullet.trim()}`);
      }
      if (exp.technologies && exp.technologies.length > 0) {
        lines.push(`Technologies: ${exp.technologies.join(', ')}`);
      }
      lines.push('');
    }
  }

  // Skills
  const hasSkills =
    resume.skills.technical.length > 0 ||
    resume.skills.tools.length > 0 ||
    resume.skills.domain.length > 0 ||
    resume.skills.soft.length > 0;

  if (hasSkills) {
    lines.push('TECHNICAL & PROFESSIONAL SKILLS');
    lines.push('-'.repeat(40));
    if (resume.skills.technical.length > 0) {
      lines.push(`Programming & Core: ${resume.skills.technical.join(', ')}`);
    }
    if (resume.skills.tools.length > 0) {
      lines.push(`Tools & Infrastructure: ${resume.skills.tools.join(', ')}`);
    }
    if (resume.skills.domain.length > 0) {
      lines.push(`Domain Expertise: ${resume.skills.domain.join(', ')}`);
    }
    if (resume.skills.soft.length > 0) {
      lines.push(`Leadership & Methods: ${resume.skills.soft.join(', ')}`);
    }
    lines.push('');
  }

  // Projects
  if (resume.projects.length > 0) {
    lines.push('KEY PROJECTS');
    lines.push('-'.repeat(40));
    for (const proj of resume.projects) {
      lines.push(`${proj.name} ${proj.link ? `(${proj.link})` : ''}`);
      if (proj.description) lines.push(proj.description);
      for (const b of proj.bullets) {
        if (b.trim()) lines.push(`* ${b.trim()}`);
      }
      if (proj.technologies.length > 0) {
        lines.push(`Stack: ${proj.technologies.join(', ')}`);
      }
      lines.push('');
    }
  }

  // Education
  if (resume.education.length > 0) {
    lines.push('EDUCATION');
    lines.push('-'.repeat(40));
    for (const edu of resume.education) {
      lines.push(`${edu.degree} in ${edu.field} | ${edu.institution}`);
      lines.push(`Graduation: ${edu.graduationDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`);
      lines.push('');
    }
  }

  // Certifications
  if (resume.certifications.length > 0) {
    lines.push('CERTIFICATIONS');
    lines.push('-'.repeat(40));
    for (const cert of resume.certifications) {
      lines.push(`* ${cert.name} - ${cert.issuer} (${cert.date})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Generate clean Markdown
 */
export function generateMarkdown(resume: ResumeData): string {
  const lines: string[] = [];

  lines.push(`# ${resume.personalInfo.fullName}`);
  if (resume.personalInfo.jobTitle) lines.push(`### ${resume.personalInfo.jobTitle}`);
  
  const contacts = [
    resume.personalInfo.email && `[${resume.personalInfo.email}](mailto:${resume.personalInfo.email})`,
    resume.personalInfo.phone,
    resume.personalInfo.location,
    resume.personalInfo.linkedin && `[LinkedIn](${resume.personalInfo.linkedin})`,
    resume.personalInfo.github && `[GitHub](${resume.personalInfo.github})`
  ].filter(Boolean);
  lines.push(contacts.join(' • '));
  lines.push('');

  if (resume.summary) {
    lines.push('## Professional Summary');
    lines.push(resume.summary);
    lines.push('');
  }

  if (resume.experience.length > 0) {
    lines.push('## Work Experience');
    for (const exp of resume.experience) {
      lines.push(`### ${exp.role} — **${exp.company}**`);
      lines.push(`*${exp.startDate} – ${exp.current ? 'Present' : exp.endDate} | ${exp.location}*`);
      lines.push('');
      for (const bullet of exp.bullets) {
        if (bullet.trim()) lines.push(`- ${bullet.trim()}`);
      }
      if (exp.technologies && exp.technologies.length > 0) {
        lines.push(`\n**Tech:** \`${exp.technologies.join('`, `')}\``);
      }
      lines.push('');
    }
  }

  if (resume.skills.technical.length > 0 || resume.skills.tools.length > 0) {
    lines.push('## Skills');
    if (resume.skills.technical.length > 0) lines.push(`- **Core Technical:** ${resume.skills.technical.join(', ')}`);
    if (resume.skills.tools.length > 0) lines.push(`- **Tools & Platforms:** ${resume.skills.tools.join(', ')}`);
    if (resume.skills.domain.length > 0) lines.push(`- **Domain:** ${resume.skills.domain.join(', ')}`);
    lines.push('');
  }

  if (resume.education.length > 0) {
    lines.push('## Education');
    for (const edu of resume.education) {
      lines.push(`- **${edu.degree} in ${edu.field}**, ${edu.institution} (${edu.graduationDate})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Generate standard JSON Resume schema
 */
export function generateJsonResume(resume: ResumeData): string {
  const jsonResume = {
    basics: {
      name: resume.personalInfo.fullName,
      label: resume.personalInfo.jobTitle,
      email: resume.personalInfo.email,
      phone: resume.personalInfo.phone,
      location: { address: resume.personalInfo.location },
      summary: resume.summary,
      profiles: [
        resume.personalInfo.linkedin ? { network: 'LinkedIn', url: resume.personalInfo.linkedin } : null,
        resume.personalInfo.github ? { network: 'GitHub', url: resume.personalInfo.github } : null
      ].filter(Boolean)
    },
    work: resume.experience.map(exp => ({
      name: exp.company,
      position: exp.role,
      startDate: exp.startDate,
      endDate: exp.current ? 'Present' : exp.endDate,
      summary: exp.bullets.join('\n'),
      highlights: exp.bullets
    })),
    education: resume.education.map(edu => ({
      institution: edu.institution,
      area: edu.field,
      studyType: edu.degree,
      score: edu.gpa,
      endDate: edu.graduationDate
    })),
    skills: [
      { name: 'Technical', keywords: resume.skills.technical },
      { name: 'Tools & Cloud', keywords: resume.skills.tools },
      { name: 'Domain', keywords: resume.skills.domain }
    ],
    projects: resume.projects.map(p => ({
      name: p.name,
      description: p.description,
      highlights: p.bullets,
      keywords: p.technologies
    }))
  };

  return JSON.stringify(jsonResume, null, 2);
}

/**
 * Generate an ATS-Clean Word (.doc) formatted HTML document.
 * Using standard Microsoft Word HTML schema ensures 100% clean opening in Word, Pages, and Google Docs without formatting bugs.
 */
export function generateWordHtmlDocument(resume: ResumeData): string {
  return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${resume.personalInfo.fullName} - ATS Resume</title>
<style>
  body {
    font-family: Calibri, Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.35;
    color: #111111;
    margin: 1in;
  }
  h1 {
    font-size: 18pt;
    font-weight: bold;
    text-align: center;
    margin: 0 0 4pt 0;
    text-transform: uppercase;
    letter-spacing: 0.5pt;
  }
  .job-title {
    font-size: 12pt;
    text-align: center;
    color: #333333;
    font-weight: 600;
    margin: 0 0 4pt 0;
  }
  .contact-bar {
    text-align: center;
    font-size: 9.5pt;
    color: #555555;
    margin-bottom: 14pt;
    border-bottom: 1.5pt solid #111111;
    padding-bottom: 6pt;
  }
  h2 {
    font-size: 12pt;
    font-weight: bold;
    text-transform: uppercase;
    border-bottom: 1pt solid #333333;
    margin-top: 12pt;
    margin-bottom: 6pt;
    padding-bottom: 2pt;
    letter-spacing: 0.5pt;
  }
  .exp-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-top: 6pt;
  }
  .exp-sub {
    font-style: italic;
    color: #444444;
    margin-bottom: 3pt;
  }
  ul {
    margin-top: 2pt;
    margin-bottom: 6pt;
    padding-left: 18pt;
  }
  li {
    margin-bottom: 3pt;
  }
</style>
</head>
<body>
  <h1>${escapeHtml(resume.personalInfo.fullName)}</h1>
  ${resume.personalInfo.jobTitle ? `<div class="job-title">${escapeHtml(resume.personalInfo.jobTitle)}</div>` : ''}
  <div class="contact-bar">
    ${[
      resume.personalInfo.email,
      resume.personalInfo.phone,
      resume.personalInfo.location,
      resume.personalInfo.linkedin,
      resume.personalInfo.github
    ].filter((val): val is string => Boolean(val)).map(escapeHtml).join(' &nbsp;|&nbsp; ')}
  </div>

  ${resume.summary ? `
    <h2>Professional Summary</h2>
    <p>${escapeHtml(resume.summary)}</p>
  ` : ''}

  ${resume.experience.length > 0 ? `
    <h2>Work Experience</h2>
    ${resume.experience.map(exp => `
      <div style="margin-bottom: 8pt;">
        <table style="width:100%; border-collapse:collapse; margin-bottom:2pt;">
          <tr>
            <td style="font-weight:bold; font-size:11pt; text-align:left;">${escapeHtml(exp.role)} &mdash; ${escapeHtml(exp.company)}</td>
            <td style="font-weight:bold; font-size:10pt; text-align:right;">${escapeHtml(exp.startDate)} &ndash; ${exp.current ? 'Present' : escapeHtml(exp.endDate)}</td>
          </tr>
          <tr>
            <td style="font-style:italic; font-size:10pt; color:#555; text-align:left;">${escapeHtml(exp.location)}</td>
            <td style="font-size:9pt; text-align:right;">${exp.technologies ? escapeHtml(exp.technologies.slice(0, 4).join(', ')) : ''}</td>
          </tr>
        </table>
        <ul>
          ${exp.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  ` : ''}

  ${(resume.skills.technical.length > 0 || resume.skills.tools.length > 0) ? `
    <h2>Skills & Competencies</h2>
    <p style="margin: 3pt 0;"><strong>Core Technical:</strong> ${escapeHtml(resume.skills.technical.join(', '))}</p>
    ${resume.skills.tools.length > 0 ? `<p style="margin: 3pt 0;"><strong>Tools & Systems:</strong> ${escapeHtml(resume.skills.tools.join(', '))}</p>` : ''}
    ${resume.skills.domain.length > 0 ? `<p style="margin: 3pt 0;"><strong>Domain Expertise:</strong> ${escapeHtml(resume.skills.domain.join(', '))}</p>` : ''}
  ` : ''}

  ${resume.education.length > 0 ? `
    <h2>Education</h2>
    ${resume.education.map(edu => `
      <table style="width:100%; border-collapse:collapse; margin-bottom:4pt;">
        <tr>
          <td style="font-weight:bold; text-align:left;">${escapeHtml(edu.degree)} in ${escapeHtml(edu.field)} &mdash; ${escapeHtml(edu.institution)}</td>
          <td style="text-align:right; font-weight:bold;">${escapeHtml(edu.graduationDate)}</td>
        </tr>
      </table>
    `).join('')}
  ` : ''}
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
