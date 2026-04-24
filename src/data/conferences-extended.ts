import type { Conference } from './conferences';

// 扩展会议数据库 - 包含CCF全部 + 同类型平台归并的全部计算机会议
export const EXTENDED_CONFERENCES: Conference[] = [
  // ========== A类会议（扩展）==========
  // 人工智能 - 扩展
  {
    id: 'ijcai',
    name: 'IJCAI',
    fullName: 'International Joint Conference on Artificial Intelligence',
    ccfRank: 'A',
    category: '人工智能',
    website: 'https://ijcai-26.org/',
    location: 'Shanghai, China',
    date: '2026-08-16',
    deadlines: [
      { id: 'ijcai-2026-abstract', type: 'abstract', date: '2026-01-16', timezone: 'UTC-12' },
      { id: 'ijcai-2026-paper', type: 'paper', date: '2026-01-23', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'mm',
    name: 'ACM MM',
    fullName: 'ACM International Conference on Multimedia',
    ccfRank: 'A',
    category: '多媒体',
    website: 'https://2026.acmmm.org/',
    location: 'Amsterdam, Netherlands',
    date: '2026-10-12',
    deadlines: [
      { id: 'mm-2026-paper', type: 'paper', date: '2026-04-12', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'sigir',
    name: 'SIGIR',
    fullName: 'International ACM SIGIR Conference on Research and Development in Information Retrieval',
    ccfRank: 'A',
    category: '人工智能',
    website: 'https://sigir-2026.github.io/',
    location: 'Taipei, Taiwan',
    date: '2026-07-19',
    deadlines: [
      { id: 'sigir-2026-abstract', type: 'abstract', date: '2026-01-22', timezone: 'UTC-12' },
      { id: 'sigir-2026-paper', type: 'paper', date: '2026-01-29', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'kdd',
    name: 'KDD',
    fullName: 'ACM SIGKDD Conference on Knowledge Discovery and Data Mining',
    ccfRank: 'A',
    category: '人工智能',
    website: 'https://kdd2026.kdd.org/',
    location: 'San Diego, USA',
    date: '2026-08-09',
    deadlines: [
      { id: 'kdd-2026-abstract', type: 'abstract', date: '2026-02-08', timezone: 'UTC-12' },
      { id: 'kdd-2026-paper', type: 'paper', date: '2026-02-15', timezone: 'UTC-12' },
    ]
  },

  // 软件工程 - 扩展
  {
    id: 'popl',
    name: 'POPL',
    fullName: 'ACM SIGPLAN Symposium on Principles of Programming Languages',
    ccfRank: 'A',
    category: '软件工程',
    website: 'https://popl26.sigplan.org/',
    location: 'Dublin, Ireland',
    date: '2026-01-19',
    deadlines: [
      { id: 'popl-2026-paper', type: 'paper', date: '2025-07-11', timezone: 'UTC-12' },
    ]
  },

  // 计算机网络 - 扩展
  {
    id: 'sensys',
    name: 'SenSys',
    fullName: 'ACM Conference on Embedded Networked Sensor Systems',
    ccfRank: 'A',
    category: '计算机网络',
    website: 'https://sensys.acm.org/2026/',
    location: 'Irvine, USA',
    date: '2026-11-09',
    deadlines: [
      { id: 'sensys-2026-paper', type: 'paper', date: '2026-06-09', timezone: 'UTC-12' },
    ]
  },

  // 体系结构 - 扩展
  {
    id: 'sc',
    name: 'SC',
    fullName: 'International Conference for High Performance Computing',
    ccfRank: 'A',
    category: '体系结构',
    website: 'https://sc26.supercomputing.org/',
    location: 'Atlanta, USA',
    date: '2026-11-15',
    deadlines: [
      { id: 'sc-2026-paper', type: 'paper', date: '2026-04-01', timezone: 'UTC-12' },
    ]
  },

  // ========== B类会议（大幅扩展）==========
  // 人工智能
  {
    id: 'www',
    name: 'WWW',
    fullName: 'The Web Conference',
    ccfRank: 'B',
    category: '人工智能',
    website: 'https://www2026.thewebconf.org/',
    location: 'Seoul, Korea',
    date: '2026-04-20',
    deadlines: [
      { id: 'www-2026-abstract', type: 'abstract', date: '2025-10-15', timezone: 'UTC-12' },
      { id: 'www-2026-paper', type: 'paper', date: '2025-10-22', timezone: 'UTC-12' },
    ]
  },
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
  {
    id: 'wacv',
    name: 'WACV',
    fullName: 'IEEE/CVF Winter Conference on Applications of Computer Vision',
    ccfRank: 'B',
    category: '人工智能',
    website: 'https://wacv2026.thecvf.com/',
    location: 'Tucson, USA',
    date: '2026-02-28',
    deadlines: [
      { id: 'wacv-2026-paper', type: 'paper', date: '2025-08-13', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'accv',
    name: 'ACCV',
    fullName: 'Asian Conference on Computer Vision',
    ccfRank: 'B',
    category: '人工智能',
    website: 'https://accv2026.github.io/',
    location: 'Tokyo, Japan',
    date: '2026-11-30',
    deadlines: [
      { id: 'accv-2026-paper', type: 'paper', date: '2026-07-01', timezone: 'UTC-12' },
    ]
  },

  // 数据库
  {
    id: 'cikm',
    name: 'CIKM',
    fullName: 'ACM International Conference on Information and Knowledge Management',
    ccfRank: 'B',
    category: '数据库',
    website: 'https://cikm2026.org/',
    location: 'Atlanta, USA',
    date: '2026-10-26',
    deadlines: [
      { id: 'cikm-2026-abstract', type: 'abstract', date: '2026-05-13', timezone: 'UTC-12' },
      { id: 'cikm-2026-paper', type: 'paper', date: '2026-05-20', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'dasfaa',
    name: 'DASFAA',
    fullName: 'Database Systems for Advanced Applications',
    ccfRank: 'B',
    category: '数据库',
    website: 'https://dasfaa2026.github.io/',
    location: 'Sydney, Australia',
    date: '2026-04-27',
    deadlines: [
      { id: 'dasfaa-2026-paper', type: 'paper', date: '2025-11-20', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'ecml-pkdd',
    name: 'ECML-PKDD',
    fullName: 'European Conference on Machine Learning and Principles of Knowledge Discovery',
    ccfRank: 'B',
    category: '人工智能',
    website: 'https://ecmlpkdd2026.org/',
    location: 'Milan, Italy',
    date: '2026-09-14',
    deadlines: [
      { id: 'ecml-2026-abstract', type: 'abstract', date: '2026-03-13', timezone: 'UTC-12' },
      { id: 'ecml-2026-paper', type: 'paper', date: '2026-03-20', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'sdm',
    name: 'SDM',
    fullName: 'SIAM International Conference on Data Mining',
    ccfRank: 'B',
    category: '数据库',
    website: 'https://www.siam.org/conferences/cm/conference/sdm26',
    location: 'Alexandria, USA',
    date: '2026-04-30',
    deadlines: [
      { id: 'sdm-2026-paper', type: 'paper', date: '2025-10-03', timezone: 'UTC-12' },
    ]
  },

  // 软件工程
  {
    id: 'icse',
    name: 'ICSE',
    fullName: 'IEEE/ACM International Conference on Software Engineering',
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
  {
    id: 'issta',
    name: 'ISSTA',
    fullName: 'ACM SIGSOFT International Symposium on Software Testing and Analysis',
    ccfRank: 'B',
    category: '软件工程',
    website: 'https://conf.researchr.org/home/issta-2026',
    location: 'Vancouver, Canada',
    date: '2026-07-20',
    deadlines: [
      { id: 'issta-2026-paper', type: 'paper', date: '2026-02-06', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'icsme',
    name: 'ICSME',
    fullName: 'IEEE International Conference on Software Maintenance and Evolution',
    ccfRank: 'B',
    category: '软件工程',
    website: 'https://conf.researchr.org/home/icsme-2026',
    location: 'Madrid, Spain',
    date: '2026-10-05',
    deadlines: [
      { id: 'icsme-2026-paper', type: 'paper', date: '2026-03-20', timezone: 'UTC-12' },
    ]
  },

  // 网络
  {
    id: 'infocom',
    name: 'INFOCOM',
    fullName: 'IEEE International Conference on Computer Communications',
    ccfRank: 'B',
    category: '计算机网络',
    website: 'https://infocom2026.ieee-infocom.org/',
    location: 'Paris, France',
    date: '2026-05-11',
    deadlines: [
      { id: 'infocom-2026-abstract', type: 'abstract', date: '2025-11-11', timezone: 'UTC-12' },
      { id: 'infocom-2026-paper', type: 'paper', date: '2025-11-18', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'icnp',
    name: 'ICNP',
    fullName: 'IEEE International Conference on Network Protocols',
    ccfRank: 'B',
    category: '计算机网络',
    website: 'https://icnp2026.cs.ucr.edu/',
    location: 'Chicago, USA',
    date: '2026-09-08',
    deadlines: [
      { id: 'icnp-2026-paper', type: 'paper', date: '2026-04-08', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'conext',
    name: 'CoNEXT',
    fullName: 'ACM International Conference on Emerging Networking Experiments and Technologies',
    ccfRank: 'B',
    category: '计算机网络',
    website: 'https://conferences.sigcomm.org/co-next/2026/',
    location: 'Milan, Italy',
    date: '2026-12-07',
    deadlines: [
      { id: 'conext-2026-paper', type: 'paper', date: '2026-06-25', timezone: 'UTC-12' },
    ]
  },

  // 安全
  {
    id: 'raid',
    name: 'RAID',
    fullName: 'International Symposium on Research in Attacks, Intrusions and Defenses',
    ccfRank: 'B',
    category: '信息安全',
    website: 'https://raid2026.org/',
    location: 'Prague, Czech Republic',
    date: '2026-10-12',
    deadlines: [
      { id: 'raid-2026-paper', type: 'paper', date: '2026-04-15', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'acsac',
    name: 'ACSAC',
    fullName: 'Annual Computer Security Applications Conference',
    ccfRank: 'B',
    category: '信息安全',
    website: 'https://www.acsac.org/',
    location: 'Austin, USA',
    date: '2026-12-07',
    deadlines: [
      { id: 'acsac-2026-paper', type: 'paper', date: '2026-06-08', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'dsn',
    name: 'DSN',
    fullName: 'IEEE/IFIP International Conference on Dependable Systems and Networks',
    ccfRank: 'B',
    category: '信息安全',
    website: 'https://dsn2026.github.io/',
    location: 'Edinburgh, UK',
    date: '2026-06-22',
    deadlines: [
      { id: 'dsn-2026-paper', type: 'paper', date: '2025-12-04', timezone: 'UTC-12' },
    ]
  },

  // 体系结构
  {
    id: 'dac',
    name: 'DAC',
    fullName: 'Design Automation Conference',
    ccfRank: 'B',
    category: '体系结构',
    website: 'https://www.dac.com/',
    location: 'San Francisco, USA',
    date: '2026-06-21',
    deadlines: [
      { id: 'dac-2026-abstract', type: 'abstract', date: '2025-11-14', timezone: 'UTC-12' },
      { id: 'dac-2026-paper', type: 'paper', date: '2025-11-21', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'date',
    name: 'DATE',
    fullName: 'Design, Automation and Test in Europe',
    ccfRank: 'B',
    category: '体系结构',
    website: 'https://www.date-conference.com/',
    location: 'Grenoble, France',
    date: '2026-03-30',
    deadlines: [
      { id: 'date-2026-abstract', type: 'abstract', date: '2025-09-15', timezone: 'UTC-12' },
      { id: 'date-2026-paper', type: 'paper', date: '2025-09-22', timezone: 'UTC-12' },
    ]
  },

  // 人机交互
  {
    id: 'chi',
    name: 'CHI',
    fullName: 'ACM SIGCHI Conference on Human Factors in Computing Systems',
    ccfRank: 'A',
    category: '人机交互',
    website: 'https://chi2026.acm.org/',
    location: 'San Jose, USA',
    date: '2026-05-02',
    deadlines: [
      { id: 'chi-2026-paper', type: 'paper', date: '2025-09-12', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'uist',
    name: 'UIST',
    fullName: 'ACM User Interface Software and Technology Symposium',
    ccfRank: 'B',
    category: '人机交互',
    website: 'https://uist.acm.org/2026/',
    location: 'Nashville, USA',
    date: '2026-10-11',
    deadlines: [
      { id: 'uist-2026-paper', type: 'paper', date: '2026-04-08', timezone: 'UTC-12' },
    ]
  },

  // ========== C类会议（大幅扩展）==========
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
  {
    id: 'pricai',
    name: 'PRICAI',
    fullName: 'Pacific Rim International Conference on Artificial Intelligence',
    ccfRank: 'C',
    category: '人工智能',
    website: 'https://pricai2026.github.io/',
    location: 'Sydney, Australia',
    date: '2026-11-09',
    deadlines: [
      { id: 'pricai-2026-paper', type: 'paper', date: '2026-06-30', timezone: 'UTC-12' },
    ]
  },

  // 软件工程
  {
    id: 'saner',
    name: 'SANER',
    fullName: 'IEEE International Conference on Software Analysis, Evolution and Reengineering',
    ccfRank: 'C',
    category: '软件工程',
    website: 'https://saner2026.github.io/',
    location: 'Limassol, Cyprus',
    date: '2026-03-03',
    deadlines: [
      { id: 'saner-2026-paper', type: 'paper', date: '2025-10-10', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'msr',
    name: 'MSR',
    fullName: 'IEEE/ACM International Conference on Mining Software Repositories',
    ccfRank: 'C',
    category: '软件工程',
    website: 'https://conf.researchr.org/home/msr-2026',
    location: 'Madrid, Spain',
    date: '2026-04-14',
    deadlines: [
      { id: 'msr-2026-paper', type: 'paper', date: '2025-10-16', timezone: 'UTC-12' },
    ]
  },

  // 数据库
  {
    id: 'wise',
    name: 'WISE',
    fullName: 'Web Information Systems Engineering',
    ccfRank: 'C',
    category: '数据库',
    website: 'https://wise2026.github.io/',
    location: 'Melbourne, Australia',
    date: '2026-10-19',
    deadlines: [
      { id: 'wise-2026-paper', type: 'paper', date: '2026-05-15', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'apweb-waim',
    name: 'APWeb-WAIM',
    fullName: 'Asia-Pacific Web Conference',
    ccfRank: 'C',
    category: '数据库',
    website: 'https://apweb-waim2026.github.io/',
    location: 'Singapore',
    date: '2026-08-03',
    deadlines: [
      { id: 'apweb-2026-paper', type: 'paper', date: '2026-03-01', timezone: 'UTC-12' },
    ]
  },

  // 网络
  {
    id: 'lcn',
    name: 'LCN',
    fullName: 'IEEE Conference on Local Computer Networks',
    ccfRank: 'C',
    category: '计算机网络',
    website: 'https://lcn2026.github.io/',
    location: 'Denver, USA',
    date: '2026-10-12',
    deadlines: [
      { id: 'lcn-2026-paper', type: 'paper', date: '2026-04-15', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'globecom',
    name: 'GLOBECOM',
    fullName: 'IEEE Global Communications Conference',
    ccfRank: 'C',
    category: '计算机网络',
    website: 'https://globecom2026.ieee-globecom.org/',
    location: 'Dallas, USA',
    date: '2026-12-07',
    deadlines: [
      { id: 'globecom-2026-paper', type: 'paper', date: '2026-04-15', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'icc',
    name: 'ICC',
    fullName: 'IEEE International Conference on Communications',
    ccfRank: 'C',
    category: '计算机网络',
    website: 'https://icc2026.ieee-icc.org/',
    location: 'Dallas, USA',
    date: '2026-06-08',
    deadlines: [
      { id: 'icc-2026-paper', type: 'paper', date: '2025-12-10', timezone: 'UTC-12' },
    ]
  },

  // 安全
  {
    id: 'sac',
    name: 'SAC',
    fullName: 'ACM/SIGAPP Symposium on Applied Computing',
    ccfRank: 'C',
    category: '信息安全',
    website: 'https://www.sigapp.org/sac/sac2026/',
    location: 'Braga, Portugal',
    date: '2026-04-06',
    deadlines: [
      { id: 'sac-2026-paper', type: 'paper', date: '2025-09-15', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'trustcom',
    name: 'TrustCom',
    fullName: 'IEEE International Conference on Trust, Security and Privacy',
    ccfRank: 'C',
    category: '信息安全',
    website: 'https://trustcom2026.github.io/',
    location: 'Vienna, Austria',
    date: '2026-08-18',
    deadlines: [
      { id: 'trustcom-2026-paper', type: 'paper', date: '2026-03-30', timezone: 'UTC-12' },
    ]
  },

  // ========== 其他重要会议（非CCF推荐但业界知名）==========
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
    id: 'tacl',
    name: 'TACL',
    fullName: 'Transactions of the ACL',
    ccfRank: 'B',
    category: '人工智能',
    website: 'https://transacl.org/',
    location: 'Online',
    date: '2026-rolling',
    deadlines: [
      { id: 'tacl-2026-paper', type: 'paper', date: '2026-rolling', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'tkde',
    name: 'TKDE',
    fullName: 'IEEE Transactions on Knowledge and Data Engineering',
    ccfRank: 'A',
    category: '数据库',
    website: 'https://www.computer.org/csdl/journal/tk',
    location: 'Online',
    date: '2026-rolling',
    deadlines: [
      { id: 'tkde-2026-paper', type: 'paper', date: '2026-rolling', timezone: 'UTC-12' },
    ]
  },
  {
    id: 'tpami',
    name: 'TPAMI',
    fullName: 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
    ccfRank: 'A',
    category: '人工智能',
    website: 'https://www.computer.org/csdl/journal/tp',
    location: 'Online',
    date: '2026-rolling',
    deadlines: [
      { id: 'tpami-2026-paper', type: 'paper', date: '2026-rolling', timezone: 'UTC-12' },
    ]
  },
];

// 合并基础会议和扩展会议
import { CCF_CONFERENCES, CATEGORIES, calculateDaysUntil, getConferenceColor } from './conferences';
export const ALL_CONFERENCES: Conference[] = [...CCF_CONFERENCES, ...EXTENDED_CONFERENCES];

// 统计数据
export const CONFERENCE_STATS = {
  total: ALL_CONFERENCES.length,
  rankA: ALL_CONFERENCES.filter(c => c.ccfRank === 'A').length,
  rankB: ALL_CONFERENCES.filter(c => c.ccfRank === 'B').length,
  rankC: ALL_CONFERENCES.filter(c => c.ccfRank === 'C').length,
  categories: Array.from(new Set(ALL_CONFERENCES.map(c => c.category))),
};

// 导出所有会议
export { CCF_CONFERENCES };
export { CATEGORIES, calculateDaysUntil, getConferenceColor };
export default ALL_CONFERENCES;
