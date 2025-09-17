export interface NetdrexAPIInfoDTO {
  primaryDomainId: string | null;
  casNumber: string | null;
  created: string | null;
  dataSources?: string[];
  description: string | null;
  displayName: string | null;
  domainIds?: string[];
  drugCategories?: string[];
  drugGroups?: string[];
  indication: string | null;
  synonyms?: string[];
  type: string | null;
  updated: string | null;
}
