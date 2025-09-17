export interface DigestEntryDTO {
  database: 'GO.MF' | 'GO.CC' | 'GO.BP' | 'KEGG' | string;
  term: string;
  score: number;
  empiricalPValue: number;
  description: string;
  gene?: string;
}

export interface DigestPlotDTO {
  entries: DigestEntryDTO[];
  loopStep?: number;
}
