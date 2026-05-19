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
    title: 'Portfolio and Research Chat Surface',
    summary:
      'Portfolio frontend on GitHub Pages with a separate chat API for retrieval-based questions over profile documents and papers.',
    tags: ['React', 'Vite', 'FastAPI', 'RAG UX'],
    link: '#contact',
  },
  {
    title: 'Chat API and Scope Guardrails',
    summary:
      'Separate FastAPI backend with retrieval, streaming responses, and scope controls grounded in profile documents and papers.',
    tags: ['FastAPI', 'SSE', 'Guardrails'],
    link: '#contact',
  },
  {
    title: 'RAG Paper Prototype',
    summary:
      'Local document question-answering workflow using Chroma, sentence-transformer embeddings, and LLM-backed generation over paper PDFs.',
    tags: ['ChromaDB', 'SentenceTransformers', 'OpenRouter'],
    link: '#projects',
  },
  {
    title: 'Corpus Ingestion Pipeline',
    summary:
      'Ingestion workflow for combining authored profile documents with research papers into one retrieval-ready personal corpus.',
    tags: ['Embeddings', 'ChromaDB', 'Data Pipeline'],
    link: '#projects',
  },
  {
    title: 'Scientific Workflow Tooling',
    summary:
      'Software and automation support for simulation-heavy research, including retrieval, data organization, and iteration workflows.',
    tags: ['Automation', 'Scientific Python', 'AI Tooling'],
    link: '#experience',
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

export const contact = {
  email: 'aaronchen0316@gmail.com',
  intro:
    'For materials ML, scientific software, or related collaboration, email is the best way to reach me.',
}

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
