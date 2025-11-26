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
    explanation: 'Ask about possibilities and available tools.',
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
    explanation: 'Use the DIAMOnD algorithm',
    hints: [
      'NLRP3, TYK2, TNFSF14, VDR genes as input',
      'NLRP3, TYK2, TNFSF14, VDR',
      'Can you call diamond with NLRP3, TYK2, TNFSF14, VDR genes as input?',
      'Can you call DIAMOnD with NLRP3, TYK2, TNFSF14, VDR genes as input?'
    ]
  },
  {
    command: '/digest_sub',
    icon: 'construction',
    name: 'DIGEST Network',
    tip: 'Analyzes and in silico validate gene subnetworks for functional coherence',
    explanation: 'Analyzes and in silico validate gene subnetworks for functional coherence, providing a plots, GO/KEGG term enrichment information, and p-values',
    hints: [
      'Can you perform ORA on the genes A2M, ABCA7, ACE, ADAM10 and APP?',
      'What biological processes, molecular functions, and pathways are enriched in the network formed by the genes APOE, SORL1, BACE1, CLU, \n' +
      'TREM2, BIN1, MAPT, GRN, ABCA7, CD33, and CR1?',
      'What is the DIGEST Sub algorithm?',
      'How does the digest Network algorithm work?'
    ]
  },
  {
    command: '/digest_set',
    icon: 'construction',
    name: 'DIGEST Set',
    tip: 'Performs in silico validation of gene sets or disease modules through functional coherence analysis',
    explanation: 'Performs in silico validation of gene sets or disease modules through functional coherence analysis, returning plots and GO/KEGG enrichment annotations and p-values.',
    hints: [
      'Can you perform ORA on the genes A2M, ABCA7, ACE, ADAM10 and APP?',
      'What biological processes, molecular functions, and pathways are enriched in the network formed by the genes APOE, SORL1, BACE1, CLU, \n' +
      'TREM2, BIN1, MAPT, GRN, ABCA7, CD33, and CR1?',
      'What is the digest Set algorithm?',
      'How does the DIGEST Set algorithm work?'
    ]
  },
  {
    command: '/trustrank',
    icon: 'construction',
    name: 'TrustRank',
    tip: 'Use TrustRank',
    explanation: 'Use the TrustRank alogrithm for drug prioritization',
    hints: [
      'NLRP3, TYK2, TNFSF14, VDR genes as input',
      'NLRP3, TYK2, TNFSF14, VDR',
      'Can you call TrustRank with NLRP3, TYK2, TNFSF14, VDR genes as input?',
      'Can you call TrustRank with NLRP3, TYK2, TNFSF14, VDR genes as input?'
    ]
  },
  {
    command: '/nedrex',
    icon: 'account_tree',
    name: 'NeDRex',
    tip: 'Interrogate drug repurposing knowledge graph (NeDRex)',
    explanation: 'Ask drug repurposing knowledge graph (NeDRex)',
    hints: [
      ' what is CF and what has CFTR to do with it?',
      'What are the key genes involved in Parkinson\'s disease?',
      'What are the key genes involved in Parkinson\'s disease?',
      'What are the key genes involved in Parkinson\'s disease?'
    ]
  }
];

//TODO add closeness

