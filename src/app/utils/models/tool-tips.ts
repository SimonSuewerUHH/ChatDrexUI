export interface ToolTip {
  icon: string;
  command: string;
  name: string;
  tip: string;
  explanation: string;
  hints: string[];
}

export const toolTips: ToolTip[] = [
  {
    command: '/chat',
    icon: 'chat',
    name: 'Chat',
    tip: 'Chat with the AI',
    explanation: 'Ask about possibilietes',
    hints: [
      'What can I do?',
      'What are my options?',
      'What can I ask?',
      'What can i do next?'
    ]
  },
  {
    command: '/research',
    icon: 'science',
    name: 'Research',
    tip: 'Use remote academic research',
    explanation: 'Ask current Research question against academic papers',
    hints: [
      'What is cancer?',
      'What is diabetes?',
      'What is the latest found genes?',
      'What is the latest drug on cancer?'
    ]
  },
  {
    command: '/diamond',
    icon: 'construction',
    name: 'Diamond',
    tip: 'Use Diamond',
    explanation: 'Use the Diamond alogrithm',
    hints: [
      'NLRP3, TYK2, TNFSF14, VDR genes as input',
      'NLRP3, TYK2, TNFSF14, VDR',
      'Can you call Diamond with NLRP3, TYK2, TNFSF14, VDR genes as input?',
      'Can you call Diamond with NLRP3, TYK2, TNFSF14, VDR genes as input?'
    ]
  },
  {
    command: '/digest_sub',
    icon: 'construction',
    name: 'Digest Sub',
    tip: 'Analyzes gene subnetworks for enrichment',
    explanation: 'Analyzes gene subnetworks for enrichment, providing a plot and GO/KEGG term descriptions',
    hints: [
      'What is the Digest Sub algorithm?',
      'How does the Digest Sub algorithm work?',
      'What is the Digest Sub algorithm?',
      'How does the Digest Sub algorithm work?'
    ]
  },
  {
    command: '/digest_set',
    icon: 'construction',
    name: 'Digest Set',
    tip: 'Performs gene set Representation Analysis',
    explanation: 'Performs Over Representation Analysis on a gene set, returning a plot and GO/KEGG term descriptions.',
    hints: [
      'What is the Digest Set algorithm?',
      'How does the Digest Set algorithm work?',
      'What is the Digest Set algorithm?',
      'How does the Digest Set algorithm work?'
    ]
  },
  {
    command: '/trustrank',
    icon: 'construction',
    name: 'Trustrank',
    tip: 'Use Trustrank',
    explanation: 'Use the Trustrank alogrithm',
    hints: [
      'NLRP3, TYK2, TNFSF14, VDR genes as input',
      'NLRP3, TYK2, TNFSF14, VDR',
      'Can you call Diamond with NLRP3, TYK2, TNFSF14, VDR genes as input?',
      'Can you call Diamond with NLRP3, TYK2, TNFSF14, VDR genes as input?'
    ]
  },
  {
    command: '/netdrex',
    icon: 'account_tree',
    name: 'Netdrex',
    tip: 'Ask drug repurposing knowladge graph (Netdrex)',
    explanation: 'sk drug repurposing knowladge graph (Netdrex)',
    hints: [
      'What are the key genes involved in Parkinson\'s disease?',
      'What are the key genes involved in Parkinson\'s disease?',
      'What are the key genes involved in Parkinson\'s disease?',
      'What are the key genes involved in Parkinson\'s disease?'
    ]
  }
];


