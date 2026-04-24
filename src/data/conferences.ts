export interface Conference {
  id: string;
  name: string;
  fullName: string;
  ccfRank: 'A' | 'B' | 'C';
  category: ConferenceCategory;
  website: string;
  deadlines: Deadline[];
  location?: string;
  date?: string;
}

export interface Deadline {
  id: string;
  type: 'abstract' | 'paper' | 'rebuttal' | 'notification' | 'camera';
  date: string;
  timezone: string;
}

export type ConferenceCategory = 
  | '人工智能'
  | '体系结构'
  | '软件工程'
  | '数据库'
  | '计算机网络'
  | '信息安全'
  | '理论计算机'
  | '图形学'
  | '多媒体'
  | '人机交互'
  | '跨学科';

export const CCF_CONFERENCES: Conference[] = [
  // ========== A 类会议 ==========
  // 人工智能
  {
    id: 'neurips',
    name: 'NeurIPS',
    fullName: 'Neural Information Processing Systems',
    ccfRank: 'A',
    category: '人工智能',
    website: 'https://neurips.cc/',
    location: 'Vancouver, Canada',
    date: '2026-12-06',
    deadlines: [
      { id: 'neurips-2026-abstract', type: 'abstract', date: '2026-05-15', timezone: 'UTC-12' },
      { id: 'neurips-2026-paper', type: 'paper', date: '2026-05-22', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'icml',
    name: 'ICML',
    fullName: 'International Conference on Machine Learning',
    ccfRank: 'A',
    category: '人工智能',
    website: 'https://icml.cc/',
    location: 'Vancouver, Canada',
    date: '2026-07-18',
    deadlines: [
      { id: 'icml-2026-abstract', type: 'abstract', date: '2026-01-23', timezone: 'UTC-12' },
      { id: 'icml-2026-paper', type: 'paper', date: '2026-01-30', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'iclr',
    name: 'ICLR',
    fullName: 'International Conference on Learning Representations',
    ccfRank: 'A',
    category: '人工智能',
    website: 'https://iclr.cc/',
    location: 'Singapore',
    date: '2026-04-28',
    deadlines: [
      { id: 'iclr-2026-abstract', type: 'abstract', date: '2025-09-26', timezone: 'UTC-12' },
      { id: 'iclr-2026-paper', type: 'paper', date: '2025-10-03', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'aaai',
    name: 'AAAI',
    fullName: 'AAAI Conference on Artificial Intelligence',
    ccfRank: 'A',
    category: '人工智能',
    website: 'https://aaai.org/',
    location: 'Philadelphia, USA',
    date: '2026-02-21',
    deadlines: [
      { id: 'aaai-2026-abstract', type: 'abstract', date: '2025-08-08', timezone: 'UTC-12' },
      { id: 'aaai-2026-paper', type: 'paper', date: '2025-08-15', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'cvpr',
    name: 'CVPR',
    fullName: 'IEEE/CVF Conference on Computer Vision and Pattern Recognition',
    ccfRank: 'A',
    category: '人工智能',
    website: 'https://cvpr.thecvf.com/',
    location: 'Nashville, USA',
    date: '2026-06-15',
    deadlines: [
      { id: 'cvpr-2026-abstract', type: 'abstract', date: '2025-11-15', timezone: 'UTC-12' },
      { id: 'cvpr-2026-paper', type: 'paper', date: '2025-11-22', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'iccv',
    name: 'ICCV',
    fullName: 'IEEE/CVF International Conference on Computer Vision',
    ccfRank: 'A',
    category: '人工智能',
    website: 'https://iccv.thecvf.com/',
    location: 'Tokyo, Japan',
    date: '2026-10-04',
    deadlines: [
      { id: 'iccv-2026-abstract', type: 'abstract', date: '2026-03-15', timezone: 'UTC-12' },
      { id: 'iccv-2026-paper', type: 'paper', date: '2026-03-22', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'eccv',
    name: 'ECCV',
    fullName: 'European Conference on Computer Vision',
    ccfRank: 'A',
    category: '人工智能',
    website: 'https://eccv.ecva.net/',
    location: 'Milan, Italy',
    date: '2026-09-08',
    deadlines: [
      { id: 'eccv-2026-abstract', type: 'abstract', date: '2026-03-07', timezone: 'UTC-12' },
      { id: 'eccv-2026-paper', type: 'paper', date: '2026-03-14', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'acl',
    name: 'ACL',
    fullName: 'Annual Meeting of the Association for Computational Linguistics',
    ccfRank: 'A',
    category: '人工智能',
    website: 'https://www.aclweb.org/',
    location: 'Vienna, Austria',
    date: '2026-07-20',
    deadlines: [
      { id: 'acl-2026-abstract', type: 'abstract', date: '2026-01-15', timezone: 'UTC-12' },
      { id: 'acl-2026-paper', type: 'paper', date: '2026-01-22', timezone: 'UTC-12' },
    ]
  },

  // 体系结构
  {
    id: 'isca',
    name: 'ISCA',
    fullName: 'International Symposium on Computer Architecture',
    ccfRank: 'A',
    category: '体系结构',
    website: 'https://www.iscaconf.org/',
    location: 'Tokyo, Japan',
    date: '2026-06-14',
    deadlines: [
      { id: 'isca-2026-abstract', type: 'abstract', date: '2025-11-14', timezone: 'UTC-12' },
      { id: 'isca-2026-paper', type: 'paper', date: '2025-11-21', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'micro',
    name: 'MICRO',
    fullName: 'IEEE/ACM International Symposium on Microarchitecture',
    ccfRank: 'A',
    category: '体系结构',
    website: 'https://www.microarch.org/',
    location: 'Chicago, USA',
    date: '2026-10-18',
    deadlines: [
      { id: 'micro-2026-abstract', type: 'abstract', date: '2026-04-04', timezone: 'UTC-12' },
      { id: 'micro-2026-paper', type: 'paper', date: '2026-04-11', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'hpca',
    name: 'HPCA',
    fullName: 'IEEE International Symposium on High-Performance Computer Architecture',
    ccfRank: 'A',
    category: '体系结构',
    website: 'https://hpca-conf.org/',
    location: 'Las Vegas, USA',
    date: '2026-03-01',
    deadlines: [
      { id: 'hpca-2026-abstract', type: 'abstract', date: '2025-07-25', timezone: 'UTC-12' },
      { id: 'hpca-2026-paper', type: 'paper', date: '2025-08-01', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'asplos',
    name: 'ASPLOS',
    fullName: 'International Conference on Architectural Support for Programming Languages and Operating Systems',
    ccfRank: 'A',
    category: '体系结构',
    website: 'https://asplos-conference.org/',
    location: 'San Diego, USA',
    date: '2026-03-01',
    deadlines: [
      { id: 'asplos-2026-fall', type: 'abstract', date: '2025-06-24', timezone: 'UTC-12' },
      { id: 'asplos-2026-spring', type: 'abstract', date: '2025-10-15', timezone: 'UTC-12' },
    ]
  },

  // 软件工程
  {
    id: 'pldi',
    name: 'PLDI',
    fullName: 'ACM SIGPLAN Conference on Programming Language Design and Implementation',
    ccfRank: 'A',
    category: '软件工程',
    website: 'https://pldi.sigplan.org/',
    location: 'Portland, USA',
    date: '2026-06-15',
    deadlines: [
      { id: 'pldi-2026-abstract', type: 'abstract', date: '2025-11-14', timezone: 'UTC-12' },
      { id: 'pldi-2026-paper', type: 'paper', date: '2025-11-21', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'oopsla',
    name: 'OOPSLA',
    fullName: 'ACM SIGPLAN International Conference on Object-Oriented Programming',
    ccfRank: 'A',
    category: '软件工程',
    website: 'https://2026.splashcon.org/',
    location: 'Pasadena, USA',
    date: '2026-11-01',
    deadlines: [
      { id: 'oopsla-2026-paper', type: 'paper', date: '2026-04-05', timezone: 'UTC-12' },
    ]
  },

  // 数据库
  {
    id: 'sigmod',
    name: 'SIGMOD',
    fullName: 'ACM Conference on Management of Data',
    ccfRank: 'A',
    category: '数据库',
    website: 'https://sigmod.org/',
    location: 'Mumbai, India',
    date: '2026-06-14',
    deadlines: [
      { id: 'sigmod-2026-r1', type: 'paper', date: '2025-09-18', timezone: 'UTC-12' },
      { id: 'sigmod-2026-r2', type: 'paper', date: '2026-01-15', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'vldb',
    name: 'VLDB',
    fullName: 'International Conference on Very Large Data Bases',
    ccfRank: 'A',
    category: '数据库',
    website: 'https://vldb.org/',
    location: 'Sydney, Australia',
    date: '2026-08-31',
    deadlines: [
      { id: 'vldb-2026-paper', type: 'paper', date: '2026-03-01', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'icde',
    name: 'ICDE',
    fullName: 'IEEE International Conference on Data Engineering',
    ccfRank: 'A',
    category: '数据库',
    website: 'https://icde2026.github.io/',
    location: 'Montreal, Canada',
    date: '2026-05-04',
    deadlines: [
      { id: 'icde-2026-r1', type: 'paper', date: '2025-08-08', timezone: 'UTC-12' },
      { id: 'icde-2026-r2', type: 'paper', date: '2025-12-12', timezone: 'UTC-12' },
    ]
  },

  // 网络
  {
    id: 'sigcomm',
    name: 'SIGCOMM',
    fullName: 'ACM SIGCOMM Conference',
    ccfRank: 'A',
    category: '计算机网络',
    website: 'https://conferences.sigcomm.org/sigcomm/2026/',
    location: 'Sydney, Australia',
    date: '2026-08-17',
    deadlines: [
      { id: 'sigcomm-2026-abstract', type: 'abstract', date: '2026-01-29', timezone: 'UTC-12' },
      { id: 'sigcomm-2026-paper', type: 'paper', date: '2026-02-05', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'nsdi',
    name: 'NSDI',
    fullName: 'Networked Systems Design and Implementation',
    ccfRank: 'A',
    category: '计算机网络',
    website: 'https://www.usenix.org/conference/nsdi26',
    location: 'Santa Clara, USA',
    date: '2026-05-04',
    deadlines: [
      { id: 'nsdi-2026-fall', type: 'paper', date: '2025-09-19', timezone: 'UTC-12' },
      { id: 'nsdi-2026-spring', type: 'paper', date: '2026-01-16', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'mobicom',
    name: 'MobiCom',
    fullName: 'ACM International Conference on Mobile Computing and Networking',
    ccfRank: 'A',
    category: '计算机网络',
    website: 'https://sigmobile.org/mobicom/2026/',
    location: 'Washington DC, USA',
    date: '2026-10-05',
    deadlines: [
      { id: 'mobicom-2026-paper', type: 'paper', date: '2026-03-20', timezone: 'UTC-12' },
    ]
  },

  // 安全
  {
    id: 'sp',
    name: 'IEEE S&P',
    fullName: 'IEEE Symposium on Security and Privacy',
    ccfRank: 'A',
    category: '信息安全',
    website: 'https://sp2026.ieee-security.org/',
    location: 'San Francisco, USA',
    date: '2026-05-18',
    deadlines: [
      { id: 'sp-2026-paper', type: 'paper', date: '2025-06-05', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'ccs',
    name: 'ACM CCS',
    fullName: 'ACM Conference on Computer and Communications Security',
    ccfRank: 'A',
    category: '信息安全',
    website: 'https://ccs2026.sigsac.org/',
    location: 'Taipei, Taiwan',
    date: '2026-10-26',
    deadlines: [
      { id: 'ccs-2026-paper', type: 'paper', date: '2026-01-15', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'usenix-security',
    name: 'USENIX Security',
    fullName: 'USENIX Security Symposium',
    ccfRank: 'A',
    category: '信息安全',
    website: 'https://www.usenix.org/conference/usenixsecurity26',
    location: 'Boston, USA',
    date: '2026-08-12',
    deadlines: [
      { id: 'usenix-2026-paper', type: 'paper', date: '2026-02-04', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'ndss',
    name: 'NDSS',
    fullName: 'Network and Distributed System Security Symposium',
    ccfRank: 'A',
    category: '信息安全',
    website: 'https://www.ndss-symposium.org/',
    location: 'San Diego, USA',
    date: '2026-02-23',
    deadlines: [
      { id: 'ndss-2026-paper', type: 'paper', date: '2025-07-11', timezone: 'UTC-12' },
    ]
  },

  // ========== B 类会议 ==========
  // 人工智能
  {
    id: 'emnlp',
    name: 'EMNLP',
    fullName: 'Conference on Empirical Methods in Natural Language Processing',
    ccfRank: 'B',
    category: '人工智能',
    website: 'https://2026.emnlp.org/',
    location: 'Miami, USA',
    date: '2026-11-10',
    deadlines: [
      { id: 'emnlp-2026-abstract', type: 'abstract', date: '2026-05-16', timezone: 'UTC-12' },
      { id: 'emnlp-2026-paper', type: 'paper', date: '2026-05-23', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'naacl',
    name: 'NAACL',
    fullName: 'North American Chapter of the Association for Computational Linguistics',
    ccfRank: 'B',
    category: '人工智能',
    website: 'https://2026.naacl.org/',
    location: 'Albuquerque, USA',
    date: '2026-06-28',
    deadlines: [
      { id: 'naacl-2026-paper', type: 'paper', date: '2026-01-15', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'coling',
    name: 'COLING',
    fullName: 'International Conference on Computational Linguistics',
    ccfRank: 'B',
    category: '人工智能',
    website: 'https://coling2026.org/',
    location: 'Barcelona, Spain',
    date: '2026-08-15',
    deadlines: [
      { id: 'coling-2026-paper', type: 'paper', date: '2026-03-06', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'bmvc',
    name: 'BMVC',
    fullName: 'British Machine Vision Conference',
    ccfRank: 'B',
    category: '人工智能',
    website: 'https://bmvc2026.org/',
    location: 'London, UK',
    date: '2026-09-07',
    deadlines: [
      { id: 'bmvc-2026-paper', type: 'paper', date: '2026-04-30', timezone: 'UTC-12' },
    ]
  },

  // 软件工程
  {
    id: 'icse',
    name: 'ICSE',
    fullName: 'International Conference on Software Engineering',
    ccfRank: 'B',
    category: '软件工程',
    website: 'https://conf.researchr.org/home/icse-2026',
    location: 'Rio de Janeiro, Brazil',
    date: '2026-04-14',
    deadlines: [
      { id: 'icse-2026-paper', type: 'paper', date: '2025-08-02', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'fse',
    name: 'FSE/ESEC',
    fullName: 'ACM SIGSOFT Symposium on the Foundation of Software Engineering',
    ccfRank: 'B',
    category: '软件工程',
    website: 'https://conf.researchr.org/home/fse-2026',
    location: 'Lisbon, Portugal',
    date: '2026-11-16',
    deadlines: [
      { id: 'fse-2026-paper', type: 'paper', date: '2026-02-20', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'ase',
    name: 'ASE',
    fullName: 'IEEE/ACM International Conference on Automated Software Engineering',
    ccfRank: 'B',
    category: '软件工程',
    website: 'https://conf.researchr.org/home/ase-2026',
    location: 'Seattle, USA',
    date: '2026-11-08',
    deadlines: [
      { id: 'ase-2026-paper', type: 'paper', date: '2026-05-29', timezone: 'UTC-12' },
    ]
  },

  // ========== C 类会议 ==========
  // 人工智能
  {
    id: 'icpr',
    name: 'ICPR',
    fullName: 'International Conference on Pattern Recognition',
    ccfRank: 'C',
    category: '人工智能',
    website: 'https://icpr2026.org/',
    location: 'Cancun, Mexico',
    date: '2026-08-10',
    deadlines: [
      { id: 'icpr-2026-paper', type: 'paper', date: '2026-03-15', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'iconip',
    name: 'ICONIP',
    fullName: 'International Conference on Neural Information Processing',
    ccfRank: 'C',
    category: '人工智能',
    website: 'https://iconip2026.org/',
    location: 'Bangkok, Thailand',
    date: '2026-11-15',
    deadlines: [
      { id: 'iconip-2026-paper', type: 'paper', date: '2026-06-15', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'acml',
    name: 'ACML',
    fullName: 'Asian Conference on Machine Learning',
    ccfRank: 'C',
    category: '人工智能',
    website: 'https://acml-conf.org/',
    location: 'Seoul, Korea',
    date: '2026-11-18',
    deadlines: [
      { id: 'acml-2026-paper', type: 'paper', date: '2026-06-25', timezone: 'UTC-12' },
    ]
  },
];

// 分类列表
export const CATEGORIES: ConferenceCategory[] = [
  '人工智能',
  '体系结构',
  '软件工程',
  '数据库',
  '计算机网络',
  '信息安全',
  '理论计算机',
  '图形学',
  '多媒体',
  '人机交互',
  '跨学科',
];

// Extended conferences will be merged from conferences-extended.ts

// 获取会议颜色
export function getConferenceColor(rank: 'A' | 'B' | 'C'): string {
  switch (rank) {
    case 'A':
      return '#ef4444'; // red-500
    case 'B':
      return '#f97316'; // orange-500
    case 'C':
      return '#3b82f6'; // blue-500
    default:
      return '#6b7280'; // gray-500
  }
}

// 计算距离 DDL 的天数
export function calculateDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diff = target.getTime() - now.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// 格式化 DDL 显示
export function formatDeadline(days: number): string {
  if (days < 0) return '已截止';
  if (days === 0) return '今天截止';
  if (days === 1) return '明天截止';
  return `${days} 天后`;
}
