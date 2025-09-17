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
    command: '/diamond',
    icon: 'construction',
    name: 'DIAMOnD',
    tip: 'Use DIAMOnD',
    explanation: 'Use the DIAMOnD alogrithm',
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
      'Can you perform ORA on the genes A2M, ABCA7, ACE, ADAM10 and APP?',
      'What biological processes, molecular functions, and pathways are enriched in the network formed by the genes APOE, SORL1, BACE1, CLU, \n' +
      'TREM2, BIN1, MAPT, GRN, ABCA7, CD33, and CR1?',
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
      'Can you perform ORA on the genes A2M, ABCA7, ACE, ADAM10 and APP?',
      'What biological processes, molecular functions, and pathways are enriched in the network formed by the genes APOE, SORL1, BACE1, CLU, \n' +
      'TREM2, BIN1, MAPT, GRN, ABCA7, CD33, and CR1?',
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
    name: 'NeDRex',
    tip: 'Ask drug repurposing knowladge graph (NeDRex)',
    explanation: 'Ask drug repurposing knowladge graph (NeDRex)',
    hints: [
      ' what is CF and what has CFTR to do with it?',
      'What are the key genes involved in Parkinson\'s disease?',
      'What are the key genes involved in Parkinson\'s disease?',
      'What are the key genes involved in Parkinson\'s disease?'
    ]
  }
];


