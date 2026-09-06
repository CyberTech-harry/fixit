const fs = require('fs');
const path = require('path');

const indexTopics = JSON.parse(fs.readFileSync(path.join(__dirname, '../all_topics_from_index.json'), 'utf8'));
const detailTopics = JSON.parse(fs.readFileSync(path.join(__dirname, '../topics_with_details.json'), 'utf8'));

// Build detail map by normalized title
const detailMap = {};
detailTopics.forEach(d => {
  if (d.title && d.details) {
    const key = d.title.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    detailMap[key] = d.details;
  }
});

const categoryMetadata = {
  'Windows OS Tips & Troubleshooting': {
    name: 'Windows OS',
    slug: 'windows-os',
    icon: 'Laptop',
    sortOrder: 1,
    description: 'Startup tweaks, Disk Cleanup, BSOD codes, System Restore, Task Manager diagnostics, and Virtual Desktops.'
  },
  'macOS Tips & Troubleshooting': {
    name: 'macOS',
    slug: 'macos',
    icon: 'Apple',
    sortOrder: 2,
    description: 'Performance optimization, "Other" storage resolution, Time Machine, Activity Monitor, and Wi-Fi drops.'
  },
  'Mobile (Android & iOS) Tips & Troubleshooting': {
    name: 'Mobile Devices',
    slug: 'mobile',
    icon: 'Smartphone',
    sortOrder: 3,
    description: 'Battery telemetry, cache cleanup, app crash isolation, Bluetooth pairing, and malware remediation.'
  },
  'Web Browser Tips & Tricks': {
    name: 'Web Browsers',
    slug: 'web-browsers',
    icon: 'Globe',
    sortOrder: 4,
    description: 'Cache/cookies, DevTools inspection, extension audit, crash fixes ("Aw, Snap!"), and password management.'
  },
  'Software & Application Fixes': {
    name: 'Software & Apps',
    slug: 'software',
    icon: 'AppWindow',
    sortOrder: 5,
    description: 'MS Office freezes, Outlook SMTP/IMAP, file corruption recovery, and clean uninstallation scripts.'
  },
  'Hardware & Peripherals': {
    name: 'Hardware & Peripherals',
    slug: 'hardware',
    icon: 'Cpu',
    sortOrder: 6,
    description: 'Display troubleshooting, USB device descriptor errors, printer spools, and RAM/SSD upgrade paths.'
  },
  'Networking & Internet': {
    name: 'Networking & Internet',
    slug: 'networking',
    icon: 'Wifi',
    sortOrder: 7,
    description: '"No Internet Secured", DNS flushing, gateway diagnosis, Wi-Fi intermittent drops, and VPN tunneling.'
  },
  'Security & Privacy': {
    name: 'Security & Privacy',
    slug: 'security',
    icon: 'ShieldCheck',
    sortOrder: 8,
    description: '2FA configuration, phishing threat identification, browser fingerprinting, and compromised device triage.'
  },
  'Productivity Hacks & General IT Knowledge': {
    name: 'Productivity Hacks',
    slug: 'productivity',
    icon: 'Zap',
    sortOrder: 9,
    description: 'Automation scripts, 3-2-1 backup strategies, digital hygiene, and keyboard navigation mastery.'
  },
  'Emerging Tech & Fun IT': {
    name: 'Emerging Tech & Guides',
    slug: 'emerging-tech',
    icon: 'Sparkles',
    sortOrder: 10,
    description: 'AI tool fundamentals, Cloud storage models, smart home automation protocols, and legacy hardware repurposing.'
  }
};

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function deriveDifficulty(title, solutions) {
  const combined = (title + ' ' + (solutions || []).join(' ')).toLowerCase();
  if (combined.includes('bios') || combined.includes('registry') || combined.includes('terminal') || combined.includes('powershell') || combined.includes('command') || combined.includes('packet') || combined.includes('wireshark') || combined.includes('malware') || combined.includes('script') || combined.includes('vpn') || combined.includes('dns') || combined.includes('bsod')) {
    return 'ADVANCED';
  }
  if (combined.includes('driver') || combined.includes('task manager') || combined.includes('disk cleanup') || combined.includes('cache') || combined.includes('ipconfig') || combined.includes('firewall') || combined.includes('permission') || combined.includes('format') || combined.includes('backup')) {
    return 'INTERMEDIATE';
  }
  return 'BEGINNER';
}

function generateCommands(categorySlug, title) {
  const t = title.toLowerCase();
  if (t.includes('startup') || t.includes('boot')) {
    return {
      powershell: 'Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location, User | Format-Table -AutoSize',
      cmd: 'wmic startup get caption,command',
      bash: 'systemctl list-unit-files --type=service --state=enabled'
    };
  }
  if (t.includes('disk') || t.includes('space') || t.includes('clean')) {
    return {
      powershell: 'Get-PSDrive -PSProvider FileSystem | Select-Object Name, @{Name="FreeGB";Expression={[math]::Round($_.Free/1GB,2)}}, @{Name="UsedGB";Expression={[math]::Round($_.Used/1GB,2)}}\ncleanmgr /sageset:1',
      cmd: 'cleanmgr /lowdisk\nchkdsk C: /f /r',
      bash: 'df -h\nsudo du -sh /* 2>/dev/null | sort -hr | head -n 10'
    };
  }
  if (t.includes('dns') || t.includes('internet') || t.includes('network') || t.includes('ip') || t.includes('wifi') || t.includes('connection')) {
    return {
      powershell: 'Clear-DnsClientCache\nTest-NetConnection -ComputerName 8.8.8.8 -Port 53\nGet-NetIPConfiguration',
      cmd: 'ipconfig /flushdns\nipconfig /release\nipconfig /renew\nnetsh winsock reset',
      bash: 'sudo resolvectl flush-caches\nping -c 4 8.8.8.8\nnslookup google.com'
    };
  }
  if (t.includes('process') || t.includes('task') || t.includes('responding') || t.includes('freeze')) {
    return {
      powershell: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 Id, ProcessName, CPU, WorkingSet64 | Format-Table -AutoSize',
      cmd: 'tasklist /v /fi "status eq not responding"\ntaskkill /F /PID <pid>',
      bash: 'top -b -n 1 | head -n 20\nkill -9 <PID>'
    };
  }
  if (t.includes('update') || t.includes('patch')) {
    return {
      powershell: 'Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 10\nInstall-Module PSWindowsUpdate -Force; Get-WindowsUpdate',
      cmd: 'dism /online /cleanup-image /restorehealth\nsfc /scannow',
      bash: 'sudo apt update && sudo apt upgrade -y\n# On macOS:\nsoftwareupdate -l'
    };
  }
  if (t.includes('security') || t.includes('firewall') || t.includes('malware') || t.includes('port')) {
    return {
      powershell: 'Get-NetTCPConnection -State Established, Listen | Select-Object LocalAddress, LocalPort, OwningProcess, State | Format-Table -AutoSize',
      cmd: 'netstat -ano | findstr LISTENING',
      bash: 'sudo ss -tulpn\nsudo ufw status verbose'
    };
  }
  // Default commands
  return {
    powershell: `# Check system diagnostic health\nGet-ComputerInfo | Select-Object WindowsProductName, OsVersion, CsTotalPhysicalMemory\nsfc /scannow`,
    cmd: `systeminfo\nchkdsk /scan`,
    bash: `uname -a\nuptime`
  };
}

function deriveTags(categoryName, title, solutions) {
  const tags = new Set();
  const text = (categoryName + ' ' + title + ' ' + (solutions || []).join(' ')).toLowerCase();
  
  if (text.includes('windows')) tags.add('Windows');
  if (text.includes('mac') || text.includes('apple')) tags.add('macOS');
  if (text.includes('ios') || text.includes('iphone')) tags.add('iOS');
  if (text.includes('android')) tags.add('Android');
  if (text.includes('chrome')) tags.add('Chrome');
  if (text.includes('firefox')) tags.add('Firefox');
  if (text.includes('edge')) tags.add('Edge');
  if (text.includes('wifi') || text.includes('wi-fi')) tags.add('Wi-Fi');
  if (text.includes('dns')) tags.add('DNS');
  if (text.includes('disk') || text.includes('storage') || text.includes('ssd')) tags.add('Storage');
  if (text.includes('security') || text.includes('2fa') || text.includes('password')) tags.add('Security');
  if (text.includes('performance') || text.includes('speed') || text.includes('slow')) tags.add('Performance');
  if (text.includes('troubleshooting') || text.includes('fix') || text.includes('error')) tags.add('Troubleshooting');
  if (text.includes('network') || text.includes('internet')) tags.add('Networking');
  if (text.includes('battery')) tags.add('Battery');
  if (text.includes('backup') || text.includes('restore')) tags.add('Backup');
  if (text.includes('hardware') || text.includes('ram') || text.includes('usb') || text.includes('printer')) tags.add('Hardware');
  if (text.includes('ai') || text.includes('cloud')) tags.add('Cloud & AI');

  if (tags.size === 0) {
    tags.add('General IT');
    tags.add('Diagnostics');
  }
  return Array.from(tags).slice(0, 5);
}

function buildComprehensiveGuide(topic, catMeta) {
  const normKey = topic.title.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (detailMap[normKey]) {
    return detailMap[normKey];
  }

  // Generate a rich, structured guide if not present
  const stepsList = (topic.solutions || []).map((sol, idx) => `
    <div class="mb-6 bg-stone-50 dark:bg-stone-900/60 p-5 rounded-xl border border-stone-200 dark:border-stone-800">
      <h3 class="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
        <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-teal-600 text-white text-sm font-semibold">${idx + 1}</span>
        ${sol.replace(/^(Step \d+:|\d+\.)\s*/, '')}
      </h3>
      <p class="mt-2 text-stone-700 dark:text-stone-300 leading-relaxed">
        Follow this standard operational remediation step to diagnose, isolate, and eliminate root causes associated with this issue. Ensure you verify system logs and telemetry before proceeding.
      </p>
    </div>
  `).join('\n');

  return `
    <h2 class="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">Executive Problem Overview</h2>
    <p class="text-stone-700 dark:text-stone-300 leading-relaxed mb-6">
      ${topic.title} is a common challenge encountered by IT administrators, support technicians, and end-users. 
      In this comprehensive remediation guide, we outline standard operating procedures, root cause analysis, diagnostic commands, and permanent resolution workflows.
    </p>

    <h2 class="text-xl font-bold text-stone-900 dark:text-stone-100 mt-8 mb-4">Step-by-Step Remediation Workflow</h2>
    ${stepsList}

    <h2 class="text-xl font-bold text-stone-900 dark:text-stone-100 mt-8 mb-4">Preventative Best Practices & Maintenance</h2>
    <ul class="list-disc pl-6 space-y-2 text-stone-700 dark:text-stone-300 mb-6">
      <li>Keep operating system binaries and device firmware patched to the latest stable release.</li>
      <li>Audit background startup services and memory allocation regularly to prevent resource starvation.</li>
      <li>Establish automated local and offsite backups prior to performing low-level system configuration changes.</li>
      <li>Monitor system Event Logs and diagnostic telemetry for early warning indicators of hardware or network degradation.</li>
    </ul>
  `;
}

const usedSlugs = new Set();
const compiledTopics = indexTopics.map((topic, index) => {
  const catMeta = categoryMetadata[topic.category] || {
    name: topic.category,
    slug: slugify(topic.category),
    icon: 'Terminal',
    sortOrder: 99,
    description: 'IT troubleshooting tips and guides.'
  };

  let baseSlug = slugify(topic.title);
  if (baseSlug.length > 50) {
    baseSlug = baseSlug.substring(0, 50).replace(/-+$/, '');
  }
  let slug = baseSlug;
  let counter = 1;
  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  usedSlugs.add(slug);

  const difficulty = deriveDifficulty(topic.title, topic.solutions);
  const tags = deriveTags(catMeta.name, topic.title, topic.solutions);
  const commands = generateCommands(catMeta.slug, topic.title);
  const details = buildComprehensiveGuide(topic, catMeta);
  const readTime = Math.max(3, Math.min(12, Math.round((details.length / 500) + 2)));

  return {
    id: `topic-${index + 1}`,
    title: topic.title,
    slug: slug,
    category: catMeta.name,
    categorySlug: catMeta.slug,
    categoryIcon: catMeta.icon,
    difficulty: difficulty,
    estimatedRead: readTime,
    summary: topic.solutions && topic.solutions.length > 0 ? topic.solutions[0] : 'Comprehensive IT remediation and troubleshooting guide.',
    solutions: topic.solutions || [],
    details: details,
    videoUrl: 'https://www.youtube.com/watch?v=p4kQbt0QUkY',
    audioUrl: '/audio/tech-trouble-solved.mp3',
    tags: tags,
    commands: commands,
    checklists: topic.solutions && topic.solutions.length > 0 ? topic.solutions : [
      'Identify symptom and review Event Viewer logs',
      'Execute diagnostic terminal commands',
      'Apply suggested configuration fixes',
      'Verify service connectivity and reboot if required'
    ],
    viewsCount: Math.floor(Math.random() * 850) + 120,
    helpfulness: {
      yes: Math.floor(Math.random() * 95) + 30,
      no: Math.floor(Math.random() * 5) + 1
    }
  };
});

const compiledCategories = Object.values(categoryMetadata).map(cat => {
  const count = compiledTopics.filter(t => t.categorySlug === cat.slug).length;
  return {
    ...cat,
    id: `cat-${cat.slug}`,
    topicCount: count
  };
});

const fileOutput = `// Auto-generated comprehensive topics dataset
import { TopicItem, CategoryInfo } from './types';

export const CATEGORIES: CategoryInfo[] = ${JSON.stringify(compiledCategories, null, 2)};

export const TOPICS_DATA: TopicItem[] = ${JSON.stringify(compiledTopics, null, 2)};

export function getAllCategories(): CategoryInfo[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}

export function getAllTopics(): TopicItem[] {
  return TOPICS_DATA;
}

export function getTopicBySlug(slug: string): TopicItem | undefined {
  return TOPICS_DATA.find(t => t.slug === slug);
}

export function getTopicsByCategory(categorySlug: string): TopicItem[] {
  return TOPICS_DATA.filter(t => t.categorySlug === categorySlug);
}

export function searchTopics(query: string, categoryFilter?: string, difficultyFilter?: string): TopicItem[] {
  const q = (query || '').toLowerCase().trim();
  return TOPICS_DATA.filter(topic => {
    if (categoryFilter && categoryFilter !== 'all' && topic.categorySlug !== categoryFilter) {
      return false;
    }
    if (difficultyFilter && difficultyFilter !== 'all' && topic.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) {
      return false;
    }
    if (!q) return true;
    return (
      topic.title.toLowerCase().includes(q) ||
      topic.summary.toLowerCase().includes(q) ||
      topic.category.toLowerCase().includes(q) ||
      topic.tags.some(tag => tag.toLowerCase().includes(q)) ||
      (topic.solutions && topic.solutions.some(s => s.toLowerCase().includes(q)))
    );
  });
}
`;

fs.writeFileSync(path.join(__dirname, '../lib/topics-data.ts'), fileOutput, 'utf8');
console.log(`Successfully generated lib/topics-data.ts with ${compiledTopics.length} topics and ${compiledCategories.length} categories!`);
