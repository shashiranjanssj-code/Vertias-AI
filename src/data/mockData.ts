import { ResumeData, JobDescriptionData, GroundBaseProfile } from '../types/resume';

export const INITIAL_PREVIOUS_RESUME: ResumeData = {
  id: 'res_previous_unoptimized',
  title: 'Previous Resume (Pre-Audit)',
  lastModified: '2024-03-12',
  personalInfo: {
    fullName: 'Jordan K. Miller',
    jobTitle: 'Software Engineer',
    email: 'jordan.miller@email.com',
    phone: '555-019-2834',
    location: 'Austin, TX',
    linkedin: 'linkedin.com/in/jordanmiller',
    github: 'github.com/jordanmiller-dev',
  },
  summary:
    'Results-driven professional with a demonstrated track record of success in software development. Spearheaded cross-functional team initiatives to deliver dynamic solutions. Passionate about leveraging cutting-edge technologies to synergize product workflows and drive holistic business value in today\'s fast-paced world.',
  experience: [
    {
      id: 'prev_exp_1',
      company: 'Apex Cloud Solutions',
      role: 'Senior Software Engineer',
      location: 'Austin, TX',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      bullets: [
        'Spearheaded cross-functional initiatives to optimize web applications for enterprise clients.',
        'Leveraged cutting-edge cloud architectures to synergize database performance.',
        'Demonstrated track record of delivering high-quality sprint deliverables on schedule.',
        'Fostered a culture of innovation across junior developers and participated in code reviews.'
      ],
      technologies: ['React', 'Node.js', 'AWS', 'SQL']
    },
    {
      id: 'prev_exp_2',
      company: 'Catalyst Digital Labs',
      role: 'Software Developer',
      location: 'Dallas, TX',
      startDate: '2020',
      endDate: '2022',
      current: false,
      bullets: [
        'Worked on dynamic multifaceted web components using modern JavaScript frameworks.',
        'Utilized best practices to ensure high maintainability and streamlined end-to-end testing.',
        'Collaborated with stakeholders to gather product requirements and fix reported bugs.'
      ],
      technologies: ['JavaScript', 'HTML/CSS', 'Git', 'REST APIs']
    }
  ],
  education: [
    {
      id: 'prev_edu_1',
      institution: 'University of Texas at Austin',
      degree: 'B.S.',
      field: 'Computer Science',
      graduationDate: '2020',
      location: 'Austin, TX'
    }
  ],
  projects: [],
  skills: {
    technical: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
    tools: ['AWS', 'Docker', 'VS Code', 'Jira'],
    soft: ['Team Player', 'Communication', 'Problem Solving'],
    domain: ['Web Applications']
  },
  certifications: []
};

export const INITIAL_FRESH_RESUME: ResumeData = {
  id: 'res_fresh_optimized',
  title: 'Fresh Rebuilt ATS-Beating Resume',
  lastModified: new Date().toISOString().split('T')[0],
  personalInfo: {
    fullName: 'Jordan K. Miller',
    jobTitle: 'Senior Full Stack & Cloud Platform Engineer',
    email: 'jordan.miller@email.com',
    phone: '+1 (512) 555-0192',
    location: 'Austin, TX',
    linkedin: 'linkedin.com/in/jordanmiller-swe',
    github: 'github.com/jordanmiller-dev',
    portfolio: 'jordanmiller.tech'
  },
  summary:
    'Full-stack systems engineer with 6+ years shipping high-throughput distributed microservices and reactive frontend architectures. Built payment and real-time streaming pipelines supporting 4.8M monthly active users while reducing AWS cloud infrastructure spend by $140,000 annually. Deep focus on TypeScript, Go, PostgreSQL clustering, and zero-downtime CI/CD delivery.',
  experience: [
    {
      id: 'fresh_exp_1',
      company: 'Apex Cloud Solutions',
      role: 'Senior Full Stack Platform Engineer',
      location: 'Austin, TX',
      startDate: 'Jan 2022',
      endDate: 'Present',
      current: true,
      bullets: [
        'Re-architected core event ingestion pipeline using TypeScript, Redis streams, and PostgreSQL partitioning, cutting p99 latency from 480ms to 42ms under peak 12,000 req/sec loads.',
        'Eliminated $140,000 in annual AWS compute costs by migrating 3 monolithic clusters to containerized Kubernetes pods with custom horizontal pod autoscaling.',
        'Built full-stack observability dashboard in React, Tailwind, and OpenTelemetry adopted by 45+ engineers, dropping mean time to resolution (MTTR) by 38%.',
        'Directly mentored 4 mid-level engineers through RFC design phases; 3 received mid-cycle promotions within 14 months.'
      ],
      technologies: ['TypeScript', 'React', 'PostgreSQL', 'Kubernetes', 'AWS', 'Redis', 'Docker', 'OpenTelemetry']
    },
    {
      id: 'fresh_exp_2',
      company: 'Catalyst Digital Labs',
      role: 'Full Stack Software Engineer',
      location: 'Dallas, TX',
      startDate: 'May 2020',
      endDate: 'Dec 2021',
      current: false,
      bullets: [
        'Built authenticated customer portal in React and Node.js serving 180,000 active business accounts with 99.98% platform availability.',
        'Engineered automated CI/CD pipeline using GitHub Actions and Docker, accelerating production deployment frequency from bi-weekly releases to 4 deployments per day.',
        'Integrated Stripe Billing and webhook idempotency layer, reducing payment reconciliation discrepancies by 94% across $8.5M quarterly transaction volume.'
      ],
      technologies: ['React', 'Node.js', 'Express', 'Stripe API', 'GitHub Actions', 'Docker', 'PostgreSQL']
    }
  ],
  education: [
    {
      id: 'fresh_edu_1',
      institution: 'University of Texas at Austin',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      graduationDate: 'May 2020',
      gpa: '3.82 / 4.0',
      location: 'Austin, TX'
    }
  ],
  projects: [
    {
      id: 'fresh_proj_1',
      name: 'Chronos Distributed Task Queue',
      description: 'Fault-tolerant distributed job scheduler built with Go, Redis, and raft consensus.',
      link: 'github.com/jordanmiller-dev/chronos',
      bullets: [
        'Implemented Raft leader election and WAL persistence capable of sustaining 25,000 dispatched tasks/sec with zero job loss during simulated node failures.',
        'Featured on GitHub Trending with 1,200+ stars and 18 external contributors.'
      ],
      technologies: ['Go', 'Redis', 'Raft', 'Docker', 'Prometheus']
    }
  ],
  skills: {
    technical: [
      'TypeScript',
      'Go',
      'Node.js',
      'React',
      'PostgreSQL',
      'Redis',
      'GraphQL',
      'REST APIs',
      'Microservices Architecture'
    ],
    tools: [
      'Kubernetes',
      'Docker',
      'AWS (ECS, RDS, S3, CloudFront)',
      'Terraform',
      'GitHub Actions',
      'Datadog',
      'OpenTelemetry'
    ],
    domain: [
      'Distributed Systems',
      'Event-Driven Architecture',
      'Database Sharding & Index Tuning',
      'High-Throughput Ingestion'
    ],
    soft: [
      'Technical RFC Authoring',
      'Cross-functional Engineering Leadership',
      'Incident Post-Mortems',
      'Sprint Planning'
    ]
  },
  certifications: [
    {
      id: 'fresh_cert_1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023'
    },
    {
      id: 'fresh_cert_2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Linux Foundation / CNCF',
      date: '2024'
    }
  ]
};

export const SAMPLE_JOB_DESCRIPTIONS: JobDescriptionData[] = [
  {
    title: 'Senior Full Stack & Cloud Platform Engineer',
    company: 'Stripe',
    rawText: `About the Role:
We are looking for a Senior Full Stack Platform Engineer to join our Developer Infrastructure & Core Experience organization. You will architect, build, and scale high-throughput internal platforms and distributed systems handling billions of dollars in volume.

Requirements & Core Qualifications:
- 5+ years of software engineering experience shipping resilient web services and user-facing applications.
- Strong proficiency in TypeScript, React, Node.js or Go.
- Hands-on mastery of relational databases (PostgreSQL preferred) including query profiling, indexing, and connection pooling.
- Experience with container orchestration (Kubernetes, Docker) and public cloud infrastructure (AWS or GCP).
- Proven track record with distributed event pipelines, Redis, or Kafka for async processing.
- Demonstrated ability to mentor engineers, write clear architectural RFCs, and drive measurable reliability improvements (SLAs, MTTR).`,
    requiredSkills: [
      'TypeScript',
      'React',
      'PostgreSQL',
      'Kubernetes',
      'AWS',
      'Docker',
      'Distributed Systems'
    ],
    preferredSkills: ['Go', 'Redis', 'OpenTelemetry', 'Terraform', 'Kafka'],
    keywords: [
      { word: 'TypeScript', category: 'technical', frequency: 5, required: true },
      { word: 'PostgreSQL', category: 'technical', frequency: 4, required: true },
      { word: 'React', category: 'technical', frequency: 4, required: true },
      { word: 'Kubernetes', category: 'tool', frequency: 3, required: true },
      { word: 'AWS', category: 'tool', frequency: 3, required: true },
      { word: 'Redis', category: 'tool', frequency: 2, required: false },
      { word: 'Docker', category: 'tool', frequency: 3, required: true },
      { word: 'Distributed Systems', category: 'domain', frequency: 3, required: true },
      { word: 'Microservices', category: 'domain', frequency: 2, required: true },
      { word: 'CI/CD', category: 'tool', frequency: 2, required: false },
      { word: 'Mentorship', category: 'soft', frequency: 2, required: false }
    ],
    keyResponsibilities: [
      'Architect event ingestion systems capable of 10,000+ req/sec',
      'Migrate legacy workloads to scalable Kubernetes clusters',
      'Build internal developer portals in React and TypeScript'
    ]
  },
  {
    title: 'Staff AI & Cloud Systems Architect',
    company: 'Databricks',
    rawText: `Staff Cloud Systems Architect to design enterprise-grade scalable data architectures, LLM inference pipelines, and fault-tolerant infrastructure. Must have expertise in Python, Go/TypeScript, cloud deployment, and high-performance caching.`,
    requiredSkills: ['Cloud Architecture', 'Python', 'Go', 'Kubernetes', 'PostgreSQL', 'Redis'],
    preferredSkills: ['LLM Serving', 'Terraform', 'gRPC'],
    keywords: [
      { word: 'Cloud Architecture', category: 'domain', frequency: 4, required: true },
      { word: 'Kubernetes', category: 'tool', frequency: 4, required: true },
      { word: 'PostgreSQL', category: 'technical', frequency: 3, required: true },
      { word: 'Redis', category: 'tool', frequency: 2, required: true },
      { word: 'Python', category: 'technical', frequency: 3, required: true }
    ],
    keyResponsibilities: ['Scale distributed clusters', 'Reduce cloud egress and compute costs']
  }
];

export const INITIAL_GROUND_BASE: GroundBaseProfile = {
  id: 'master_profile_1',
  sourceFiles: [
    { name: 'Jordan_Miller_OldResume_2023.pdf', type: 'application/pdf', uploadedAt: '2026-02-10' },
    { name: 'Senior_Platform_Engineer_Draft.docx', type: 'application/docx', uploadedAt: '2026-08-14' }
  ],
  masterPersonalInfo: INITIAL_FRESH_RESUME.personalInfo,
  aggregatedExperiences: [
    ...INITIAL_FRESH_RESUME.experience,
    {
      id: 'master_exp_3',
      company: 'TechForward Incubator',
      role: 'Junior Systems Associate',
      location: 'Austin, TX',
      startDate: 'Jan 2019',
      endDate: 'May 2020',
      current: false,
      bullets: [
        'Maintained Linux testing servers and configured Nginx reverse proxies for 12 early-stage startups.',
        'Wrote Bash and Python automation scripts that reduced server provisioning time by 65%.'
      ],
      technologies: ['Linux', 'Bash', 'Python', 'Nginx']
    }
  ],
  aggregatedEducation: INITIAL_FRESH_RESUME.education,
  aggregatedProjects: INITIAL_FRESH_RESUME.projects,
  aggregatedSkills: INITIAL_FRESH_RESUME.skills,
  aggregatedCertifications: INITIAL_FRESH_RESUME.certifications,
  totalRawBulletPoints: 11
};
