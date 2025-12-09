
import { User, Post, NewsItem, Job, Company, Conversation, Notification } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Silicon',
  headline: 'Senior Analog Design Engineer at WaferScale Inc. | 5nm Node Expert',
  avatarUrl: 'https://picsum.photos/150/150?random=1',
  connections: 1543,
  location: 'San Jose, California',
  about: 'Passionate Analog Design Engineer with over 10 years of experience in high-speed SerDes and mixed-signal circuit design. \n\nCurrently leading the 5nm IP development team at WaferScale. Dedicated to solving complex signal integrity challenges and pushing the boundaries of Moore\'s Law.',
  backgroundImageUrl: 'https://picsum.photos/800/200?random=99',
  experience: [
    {
      id: 'e1',
      title: 'Senior Analog Design Engineer',
      company: 'WaferScale Inc.',
      startDate: 'Jan 2019',
      endDate: 'Present',
      description: 'Leading the development of high-speed SerDes IP for 5nm and 3nm process nodes.',
      logoUrl: 'https://logo.clearbit.com/intel.com' // Placeholder
    },
    {
      id: 'e2',
      title: 'Analog Design Engineer',
      company: 'NanoChip Solutions',
      startDate: 'Jun 2014',
      endDate: 'Dec 2018',
      description: 'Designed PLLs and DLLs for automotive microcontrollers.',
      logoUrl: 'https://logo.clearbit.com/amd.com' // Placeholder
    }
  ]
};

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: {
      id: 'u2',
      name: 'Sarah Chen',
      headline: 'Process Integration Lead at NanoFoundry',
      avatarUrl: 'https://picsum.photos/150/150?random=2',
      connections: 890,
      location: 'Hsinchu, Taiwan',
      about: 'Expert in FinFET process integration and yield enhancement.',
      experience: []
    },
    content: 'Just successfully qualified our new EUV lithography process for the 3nm node! Yield rates are looking promising. Huge shoutout to the metrology team for their precision work over the weekend. 🚀 #Semiconductors #EUV #Engineering',
    imageUrl: 'https://picsum.photos/600/300?random=10',
    likes: 423,
    comments: 28,
    timestamp: '2h',
    tags: ['EUV', '3nm', 'Yield']
  },
  {
    id: 'p2',
    author: {
      id: 'u3',
      name: 'David Miller',
      headline: 'Field Applications Engineer at FPGA Systems',
      avatarUrl: 'https://picsum.photos/150/150?random=3',
      connections: 2100,
      location: 'Austin, Texas',
      about: 'Helping customers bridge the gap between hardware and software with advanced FPGA solutions.',
      experience: []
    },
    content: 'The shift to chiplets is undeniable. Seeing incredible performance gains in our latest heterogeneous integration tests. Is standard monolithic design officially dead for high-performance computing? Let’s discuss.',
    likes: 891,
    comments: 156,
    timestamp: '5h',
    tags: ['Chiplets', 'HPC', 'Packaging']
  },
  {
    id: 'p3',
    author: {
      id: 'u4',
      name: 'Dr. Emily Zhang',
      headline: 'Research Scientist | Material Science',
      avatarUrl: 'https://picsum.photos/150/150?random=4',
      connections: 560,
      location: 'Cambridge, MA',
      about: 'PhD in Material Science focusing on wide bandgap semiconductors.',
      experience: []
    },
    content: 'Excited to share our latest paper on Gallium Nitride (GaN) power efficiency. We are seeing a 15% reduction in thermal loss compared to traditional silicon counterparts in EV applications.',
    likes: 1205,
    comments: 45,
    timestamp: '1d',
    tags: ['GaN', 'PowerElectronics', 'EV']
  }
];

export const NEWS_ITEMS: NewsItem[] = [
  { id: 'n1', title: 'Global wafer shipments hit record high', readers: 4532, time: '1d ago' },
  { id: 'n2', title: 'Major GPU maker announces 2nm plans', readers: 12090, time: '3h ago' },
  { id: 'n3', title: 'Supply chain constraints easing for automotive chips', readers: 2300, time: '5h ago' },
  { id: 'n4', title: 'New RISC-V specs ratified', readers: 890, time: '12h ago' },
  { id: 'n5', title: 'Govt announces new subsidies for local fabs', readers: 6700, time: '1d ago' },
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Physical Design Engineer',
    company: 'Nvidia',
    companyLogo: 'https://logo.clearbit.com/nvidia.com',
    location: 'Santa Clara, CA',
    type: 'Hybrid',
    industry: 'IC Design',
    experienceLevel: 'Mid-Senior',
    jobFunction: 'Engineering',
    seniority: 'Senior',
    postedTime: '2 hours ago',
    applicants: 45,
    salaryRange: '$160k - $240k/yr',
    description: 'We are seeking a highly motivated Senior Physical Design Engineer to join our world-class team. You will be responsible for the physical implementation of complex high-performance SoC designs, from netlist to tapeout. You will work closely with architecture, logic design, and CAD teams to optimize performance, power, and area (PPA).',
    requirements: [
      'BS or MS in Electrical Engineering or Computer Engineering',
      '5+ years of experience in physical design (place and route)',
      'Proficiency with Synopsys ICC2 or Cadence Innovus',
      'Strong understanding of timing closure, SI, and power analysis',
      'Experience with advanced FinFET nodes (7nm, 5nm, 3nm)'
    ]
  },
  {
    id: 'j2',
    title: 'Process Engineer (Etch)',
    company: 'TSMC',
    companyLogo: 'https://logo.clearbit.com/tsmc.com',
    location: 'Phoenix, AZ',
    type: 'On-site',
    industry: 'Fab Manufacturing',
    experienceLevel: 'Entry Level',
    jobFunction: 'Operations',
    seniority: 'Junior',
    postedTime: '1 day ago',
    applicants: 12,
    salaryRange: '$85k - $110k/yr',
    description: 'Join TSMC Arizona to help build the most advanced semiconductor fab in the US. As a Process Engineer in the Etch module, you will sustain and improve manufacturing processes, troubleshoot equipment issues, and enhance yield.',
    requirements: [
      'BS in Chemical Engineering, Material Science, or Physics',
      'Understanding of plasma etch fundamentals',
      'Ability to work in a cleanroom environment',
      'Strong data analysis skills (JMP, Python is a plus)',
      'Willingness to travel to Taiwan for training'
    ]
  },
  {
    id: 'j3',
    title: 'Principal RISC-V Architect',
    company: 'SiFive',
    companyLogo: 'https://logo.clearbit.com/sifive.com',
    location: 'Remote',
    type: 'Remote',
    industry: 'IC Design',
    experienceLevel: 'Executive',
    jobFunction: 'Research',
    seniority: 'Principal',
    postedTime: '3 days ago',
    applicants: 89,
    salaryRange: '$220k - $350k/yr',
    description: 'Lead the definition of next-generation RISC-V processor cores. You will drive micro-architecture specification, performance modeling, and collaborate with software teams to ensure optimal ISA extensions for AI and HPC workloads.',
    requirements: [
      '10+ years of CPU architecture experience',
      'Deep knowledge of coherent fabrics, cache hierarchy, and OoO execution',
      'Familiarity with RISC-V ISA and vector extensions',
      'Experience with performance modeling tools (Gem5, etc.)',
      'Proven track record of taping out high-performance processors'
    ]
  },
  {
    id: 'j4',
    title: 'EUV Field Service Engineer',
    company: 'ASML',
    companyLogo: 'https://logo.clearbit.com/asml.com',
    location: 'Hillsboro, OR',
    type: 'On-site',
    industry: 'Equipment',
    experienceLevel: 'Mid-Senior',
    jobFunction: 'Operations',
    seniority: 'Senior',
    postedTime: '5 hours ago',
    applicants: 6,
    salaryRange: '$95k - $135k/yr',
    description: 'Install, maintain, and troubleshoot the world\'s most advanced EUV lithography systems. You will be the primary interface for our customers in the fab, ensuring high machine uptime and performance.',
    requirements: [
      'BS in Mechanical, Electrical, or Optical Engineering',
      '3+ years of hands-on experience with complex semiconductor equipment',
      'Strong troubleshooting and problem-solving skills',
      'Ability to read schematics and technical drawings',
      'Excellent communication skills under pressure'
    ]
  },
  {
    id: 'j5',
    title: 'Technical Product Manager, EDA',
    company: 'Synopsys',
    companyLogo: 'https://logo.clearbit.com/synopsys.com',
    location: 'Sunnyvale, CA',
    type: 'Hybrid',
    industry: 'EDA / Software',
    experienceLevel: 'Director',
    jobFunction: 'Product Management',
    seniority: 'Manager',
    postedTime: '1 week ago',
    applicants: 120,
    salaryRange: '$190k - $275k/yr',
    description: 'Drive the roadmap for our next-generation digital implementation tools. You will work with top-tier customers to understand their design challenges and guide R&D to deliver innovative solutions for multi-die systems and advanced nodes.',
    requirements: [
      'BS/MS in EE/CS or MBA with technical background',
      '7+ years in EDA or semiconductor design',
      'Deep understanding of digital design flow',
      'Strong presentation and customer-facing skills',
      'Strategic thinking and ability to prioritize features'
    ]
  },
  {
    id: 'j6',
    title: 'Senior Deep Learning Architect',
    company: 'Nvidia',
    companyLogo: 'https://logo.clearbit.com/nvidia.com',
    location: 'Austin, TX',
    type: 'Hybrid',
    industry: 'IC Design',
    experienceLevel: 'Director',
    jobFunction: 'Engineering',
    seniority: 'Lead',
    postedTime: '2 days ago',
    applicants: 15,
    salaryRange: '$250k - $400k/yr',
    description: 'Architect the next generation of deep learning accelerators. You will analyze neural network workloads, propose architectural enhancements, and work with hardware and software teams to realize industry-leading performance.',
    requirements: [
      'PhD or MS in CS/EE',
      'Expertise in computer architecture and deep learning algorithms',
      'Experience with CUDA, PyTorch, or TensorFlow',
      'Understanding of numerical precision and sparsity',
      'Strong C++ and Python programming skills'
    ]
  },
  {
    id: 'j7',
    title: 'Hardware Verification Engineer',
    company: 'Nvidia',
    companyLogo: 'https://logo.clearbit.com/nvidia.com',
    location: 'Santa Clara, CA',
    type: 'On-site',
    industry: 'IC Design',
    experienceLevel: 'Mid-Senior',
    jobFunction: 'Engineering',
    seniority: 'Senior',
    postedTime: '3 days ago',
    applicants: 8,
    salaryRange: '$140k - $210k/yr',
    description: 'Verify complex digital logic designs for GPUs and SoCs. You will develop testbenches, verification plans, and covergroups using UVM to ensure functional correctness.',
    requirements: [
      'BS or MS in Electrical Engineering',
      '3+ years of DV experience',
      'Strong SystemVerilog and UVM skills',
      'Experience with formal verification is a plus',
      'Scripting skills in Python or Perl'
    ]
  }
];

export const MOCK_COMPANIES: Company[] = [
  {
    id: 'c1',
    name: 'Nvidia',
    logo: 'https://logo.clearbit.com/nvidia.com',
    banner: 'https://picsum.photos/800/200?random=20',
    description: 'NVIDIA pioneered accelerated computing to tackle challenges no one else can solve. Our work in AI and the metaverse is transforming the world\'s largest industries and profoundly impacting society.',
    headquarters: 'Santa Clara, California',
    website: 'https://www.nvidia.com',
    followers: 4500000,
    industry: 'Semiconductors'
  },
  {
    id: 'c2',
    name: 'TSMC',
    logo: 'https://logo.clearbit.com/tsmc.com',
    banner: 'https://picsum.photos/800/200?random=21',
    description: 'Taiwan Semiconductor Manufacturing Company Limited is the world\'s most valuable semiconductor company, the world\'s largest dedicated independent (pure-play) semiconductor foundry, and one of Taiwan\'s largest companies.',
    headquarters: 'Hsinchu, Taiwan',
    website: 'https://www.tsmc.com',
    followers: 1200000,
    industry: 'Semiconductor Manufacturing'
  },
  {
    id: 'c3',
    name: 'SiFive',
    logo: 'https://logo.clearbit.com/sifive.com',
    banner: 'https://picsum.photos/800/200?random=22',
    description: 'SiFive is the first fabless semiconductor company to build customized silicon based on the free and open RISC-V instruction set architecture.',
    headquarters: 'San Mateo, California',
    website: 'https://www.sifive.com',
    followers: 54000,
    industry: 'Semiconductors'
  },
  {
    id: 'c4',
    name: 'ASML',
    logo: 'https://logo.clearbit.com/asml.com',
    banner: 'https://picsum.photos/800/200?random=23',
    description: 'ASML is an innovation leader in the semiconductor industry. We provide chipmakers with everything they need – hardware, software and services – to mass produce patterns on silicon through lithography.',
    headquarters: 'Veldhoven, Netherlands',
    website: 'https://www.asml.com',
    followers: 890000,
    industry: 'Semiconductor Equipment'
  },
  {
    id: 'c5',
    name: 'Synopsys',
    logo: 'https://logo.clearbit.com/synopsys.com',
    banner: 'https://picsum.photos/800/200?random=24',
    description: 'Synopsys is at the forefront of Smart Everything with the world’s most advanced technologies for chip design, verification, IP integration, and software security and quality testing.',
    headquarters: 'Sunnyvale, California',
    website: 'https://www.synopsys.com',
    followers: 340000,
    industry: 'Software Development'
  }
];

export const MOCK_INVITATIONS: User[] = [
  {
    id: 'i1',
    name: 'Michael Chang',
    headline: 'Technical Recruiter at Intel | Hiring for Foundry Services',
    avatarUrl: 'https://picsum.photos/150/150?random=30',
    connections: 4500,
    mutualConnections: 12,
    location: 'Portland, Oregon',
    about: 'Connecting top talent with the world\'s leading semiconductor company.',
    experience: []
  },
  {
    id: 'i2',
    name: 'Jessica Lee',
    headline: 'Graduate Student at UC Berkeley | VLSI & Computer Arch',
    avatarUrl: 'https://picsum.photos/150/150?random=31',
    connections: 150,
    mutualConnections: 3,
    location: 'Berkeley, CA',
    experience: []
  }
];

export const MOCK_SUGGESTIONS: User[] = [
  {
    id: 's1',
    name: 'Robert Fox',
    headline: 'Principal Engineer at AMD | GPU Architecture',
    avatarUrl: 'https://picsum.photos/150/150?random=40',
    connections: 2300,
    mutualConnections: 45,
    location: 'Orlando, FL'
  },
  {
    id: 's2',
    name: 'Anita Patel',
    headline: 'Director of Operations at Qualcomm',
    avatarUrl: 'https://picsum.photos/150/150?random=41',
    connections: 3100,
    mutualConnections: 28,
    location: 'San Diego, CA'
  },
  {
    id: 's3',
    name: 'Dr. James Wilson',
    headline: 'Analog Design Lead at Texas Instruments',
    avatarUrl: 'https://picsum.photos/150/150?random=42',
    connections: 980,
    mutualConnections: 15,
    location: 'Dallas, TX'
  },
  {
    id: 's4',
    name: 'Maria Garcia',
    headline: 'Process Integration Engineer at GlobalFoundries',
    avatarUrl: 'https://picsum.photos/150/150?random=43',
    connections: 670,
    mutualConnections: 8,
    location: 'Malta, NY'
  },
  {
    id: 's5',
    name: 'Kevin Liu',
    headline: 'Account Executive at Cadence Design Systems',
    avatarUrl: 'https://picsum.photos/150/150?random=44',
    connections: 1800,
    mutualConnections: 62,
    location: 'Shanghai, China'
  },
  {
    id: 's6',
    name: 'Linda Kim',
    headline: 'Verification Engineer at Apple Silicon',
    avatarUrl: 'https://picsum.photos/150/150?random=45',
    connections: 1100,
    mutualConnections: 34,
    location: 'Cupertino, CA'
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    contact: MOCK_POSTS[0].author, // Sarah Chen
    unreadCount: 2,
    lastMessageTimestamp: '10:30 AM',
    isOnline: true,
    messages: [
      { id: 'm1', senderId: 'u2', content: 'Hi Alex! Saw your comment on the EUV post. Are you attending the lithography workshop next week?', timestamp: '10:25 AM', isRead: true },
      { id: 'm2', senderId: 'me', content: 'Hey Sarah, yes I am planning to. The new overlay control techniques sound really interesting.', timestamp: '10:28 AM', isRead: true },
      { id: 'm3', senderId: 'u2', content: 'Great! Let\'s grab coffee during the break. I\'d love to hear your thoughts on the new metrology tools.', timestamp: '10:30 AM', isRead: false }
    ]
  },
  {
    id: 'conv2',
    contact: MOCK_POSTS[1].author, // David Miller
    unreadCount: 0,
    lastMessageTimestamp: 'Yesterday',
    isOnline: false,
    messages: [
      { id: 'm4', senderId: 'me', content: 'David, regarding the chiplet integration paper - did you use standard UCIe interface?', timestamp: 'Yesterday', isRead: true },
      { id: 'm5', senderId: 'u3', content: 'Yes, we stuck to UCIe 1.1 for this iteration. Performance overhead was minimal.', timestamp: 'Yesterday', isRead: true },
    ]
  },
  {
    id: 'conv3',
    contact: MOCK_INVITATIONS[0], // Michael Chang (Recruiter)
    unreadCount: 0,
    lastMessageTimestamp: 'Oct 24',
    isOnline: true,
    messages: [
      { id: 'm6', senderId: 'i1', content: 'Hi Alex, your profile looks impressive. We have a lead role opening up in our Foundry Services division.', timestamp: 'Oct 24', isRead: true },
      { id: 'm7', senderId: 'me', content: 'Thanks Michael, I\'m currently happy at WaferScale but always open to hearing about new opportunities.', timestamp: 'Oct 24', isRead: true },
      { id: 'm8', senderId: 'i1', content: 'Understood. Let\'s keep in touch!', timestamp: 'Oct 24', isRead: true }
    ]
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    actor: {
      name: 'Sarah Chen',
      avatarUrl: 'https://picsum.photos/150/150?random=2',
      type: 'user'
    },
    content: 'liked your post',
    targetContext: 'about 5nm process node challenges',
    timestamp: '2h',
    isRead: false
  },
  {
    id: 'n2',
    type: 'view',
    actor: {
      name: 'Dr. James Wilson',
      avatarUrl: 'https://picsum.photos/150/150?random=42',
      type: 'user'
    },
    content: 'viewed your profile',
    timestamp: '4h',
    isRead: false
  },
  {
    id: 'n3',
    type: 'job',
    actor: {
      name: 'Nvidia',
      avatarUrl: 'https://logo.clearbit.com/nvidia.com',
      type: 'company'
    },
    content: 'posted a new job:',
    targetContext: 'Senior Deep Learning Architect',
    timestamp: '1d',
    isRead: true
  },
  {
    id: 'n4',
    type: 'comment',
    actor: {
      name: 'David Miller',
      avatarUrl: 'https://picsum.photos/150/150?random=3',
      type: 'user'
    },
    content: 'commented on your post:',
    targetContext: '"This is a game changer for heterogeneous integration..."',
    timestamp: '1d',
    isRead: true
  },
  {
    id: 'n5',
    type: 'connection',
    actor: {
      name: 'Michael Chang',
      avatarUrl: 'https://picsum.photos/150/150?random=30',
      type: 'user'
    },
    content: 'accepted your connection request',
    timestamp: '2d',
    isRead: true
  },
  {
    id: 'n6',
    type: 'mention',
    actor: {
      name: 'Kevin Liu',
      avatarUrl: 'https://picsum.photos/150/150?random=44',
      type: 'user'
    },
    content: 'mentioned you in a post',
    targetContext: 'about RISC-V Summit speakers',
    timestamp: '3d',
    isRead: true
  },
  {
    id: 'n7',
    type: 'job',
    actor: {
      name: 'TSMC',
      avatarUrl: 'https://logo.clearbit.com/tsmc.com',
      type: 'company'
    },
    content: 'is looking for a Process Engineer. You appear to be a top match.',
    timestamp: '4d',
    isRead: true
  }
];
