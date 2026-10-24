export const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#hobbies', label: 'Hobbies' },
  { href: '#contact', label: 'Contact' },
]

export const hero = {
  title: 'Aaron Chen',
  tagline: 'Materials x Machine Learning x Scientific Software',
  subtitle:
    'Materials scientist and machine learning researcher working on modeling, simulation, and scientific software for materials and molecular systems.',
}

export const researchProjects = [
  {
    title:
      'Transferable Force Field for Gallium Nitride Crystal Growth from the Melt Using On-The-Fly Active Learning',
    summary:
      'Active-learning force-field workflow for gallium nitride crystal growth, linking atomistic simulation with iterative model refinement.',
    tags: ['Machine Learning Force Field', 'GaN', 'Active Learning'],
    link: 'https://pubs.acs.org/doi/abs/10.1021/acs.jctc.3c00587',
    image: '/papers/force field paper.webp',
  },
  {
    title: 'Diffusion-limited crystal growth of gallium nitride using active machine learning',
    summary:
      'Study of how active machine learning can support crystal growth analysis under diffusion-limited conditions.',
    tags: ['Crystal Growth', 'Machine Learning', 'Simulation'],
    link: 'https://pubs.acs.org/doi/abs/10.1021/acs.cgd.3c01504',
    image: '/papers/gan paper.webp',
  },
  {
    title:
      'A comprehensive picture of roughness evolution in organic crystalline growth: the role of molecular aspect ratio',
    summary:
      'Study of roughness evolution in organic crystalline growth, with emphasis on how molecular aspect ratio shapes mesoscale behavior.',
    tags: ['Organic Semiconductors', 'Growth Physics', 'Molecular Dynamics'],
    link: 'https://pubs.rsc.org/en/content/articlehtml/2022/mh/d2mh00854h',
    image: '/papers/esb.png',
  },
  {
    title:
      'A multiscale approach to uncover the self-assembly of ligand-covered palladium nanocubes',
    summary:
      'Multiscale modeling and self-assembly analysis of ligand-covered palladium nanocubes.',
    tags: ['Multiscale Modeling', 'Nanocrystals', 'Self-Assembly'],
    link: 'https://pubs.rsc.org/en/content/articlelanding/2023/sm/d3sm01140b/unauth',
    image: '/papers/pd.jpeg',
  },
  {
    title:
      'Neutrophil membrane-coated nanoparticles inhibit synovial inflammation and alleviate joint damage in inflammatory arthritis',
    summary:
      'Nanoparticle platform for reducing synovial inflammation and limiting joint damage in inflammatory arthritis.',
    tags: ['Nanomedicine', 'Inflammation', 'Drug Delivery'],
    link: 'https://www.nature.com/articles/s41565-018-0254-4',
    image: '/papers/np.png',
  },
  {
    title:
      'Solvent-Molecule Interactions Govern Crystal-Habit Selection in Naphthalene Tetracarboxylic Diimides',
    summary:
      'Study of how solvent-molecule interactions influence crystal-habit selection in naphthalene tetracarboxylic diimides.',
    tags: ['Crystal Habit', 'Organic Crystals', 'Solvent Effects'],
    link: 'https://pubs.acs.org/doi/abs/10.1021/acs.chemmater.9b03142',
    image: '/papers/ntcdi.webp',
  },
  {
    title:
      'Steering Amine-CO2 Chemistry: A Molecular Insight into the Amino Site Relationship of Carbamate and Protonated Amine',
    summary:
      'Molecular analysis of amino-site relationships that control carbamate and protonated-amine formation in amine-CO2 chemistry.',
    tags: ['CO2 Chemistry', 'Molecular Modeling', 'Reaction Mechanisms'],
    link: 'https://pubs.acs.org/doi/abs/10.1021/acsomega.5c03663',
    image: '/papers/solvent.webp',
  },
]

export const engineeringProjects = [
  {
    title: 'MatSci-Agent',
    image: '/engineering/matsci-agent.svg',
    summary:
      'I built a research prototype that turns a materials question into a traceable shortlist of candidate compounds.',
    description:
      'Materials researchers can spend hours translating an idea into database filters and checking whether the results fit their goal. I built MatSci-Agent to turn a plain language request into a focused screening workflow. It interprets the question as structured constraints, searches Materials Project for candidates, applies chemistry checks, and returns a ranked shortlist with band gaps, stability information, and source properties. I also built a command line interface and API, added detailed traces so each selection can be inspected, and supported optional local model calculations for shortlisted band gaps. It is a research prototype for transparent screening, not a claim that the candidates have been experimentally validated.',
    repository: 'https://github.com/aaronchen0316/MatSci-Agent',
  },
  {
    title: 'Portfolio and Research Chat Surface',
    image: '/engineering/portfolio-chat-surface.png',
    summary:
      'A portfolio where visitors can explore my research and ask questions about my work.',
    description:
      'Research papers and career details are often scattered across different places. I built this React portfolio and connected it to a research assistant so visitors can explore my background and papers in plain language. I designed the interface and prepared the frontend for GitHub Pages.',
  },
  {
    title: 'Chat API and Scope Guardrails',
    image: '/engineering/chat-api-guardrails.png',
    summary:
      'An assistant that searches my documents and papers to answer relevant questions.',
    description:
      'A chat assistant can give a confident answer even when its sources do not support it. I built a FastAPI service that searches my profile and papers, streams responses, and checks whether the retrieved material supports each question. I added scope controls and tests to keep answers focused on my work.',
  },
  {
    title: 'RAG Paper Prototype',
    image: '/engineering/rag-paper-prototype.png',
    summary:
      'A local tool that finds relevant passages in research PDFs and answers questions from them.',
    description:
      'Finding one detail across several papers takes time. I built a local prototype that reads PDFs, finds relevant passages with semantic search, and uses a language model to answer questions from those passages. The work gave me practical experience with document processing, search, and answers grounded in source material.',
  },
]

export const experienceThemes = [
  {
    period: 'Research Focus',
    title: 'Machine learning for materials and molecular systems',
    summary:
      'Research centered on machine learning and simulation for growth, structure, and behavior in complex materials systems.',
    highlights: [
      'Crystal growth and interface evolution',
      'Machine-learned force fields and active learning loops',
      'Scientific modeling with interpretable physical grounding',
    ],
  },
  {
    period: 'Engineering Focus',
    title: 'Applied AI systems and research tooling',
    summary:
      'Engineering work focused on turning research needs into usable systems, from retrieval interfaces to data pipelines and developer tooling.',
    highlights: [
      'RAG pipelines for technical content',
      'Frontend and backend integration for AI products',
      'Pragmatic system design for fast iteration',
    ],
  },
  {
    period: 'Working Style',
    title: 'Cross-disciplinary execution',
    summary:
      'Work typically sits across domain questions, modeling decisions, and implementation details within one workflow.',
    highlights: [
      'Comfort moving between papers, code, and user needs',
      'Preference for clear, testable systems',
      'Iterative development grounded in technical detail',
    ],
  },
]

export const hobbies = [
  {
    title: 'Photography',
    description: 'An ongoing way to pay attention to light, texture, and structure outside research work.',
  },
  {
    title: 'Travel',
    description: 'Time in new places provides perspective and a change of pace from project work.',
  },
  {
    title: 'Home Projects',
    description: 'Hands-on projects are a useful counterpoint to software and research work.',
  },
  {
    title: 'Recreational Sports',
    description: 'Outdoor activity helps balance long stretches of technical work.',
  },
]

export const chatConfig = {
  title: 'Ask About Aaron',
  subtitle: 'Background, papers, projects, and technical focus.',
  starterQuestions: [
    'What kind of research does Aaron work on?',
    'Tell me about the gallium nitride papers.',
    'What engineering projects is Aaron building?',
  ],
  fallbackMessage:
    'Chat is unavailable right now. Start the local chat API or set `VITE_CHAT_API_URL` to connect the live retrieval backend.',
}
