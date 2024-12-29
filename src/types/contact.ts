export interface Contact {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  updated_at: string;
  prospect_group?: {
    id: string;
    name: string;
  };
}

export interface ContactGroup {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  prospectsByProspectGroupId_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

export interface BulkContactInput {
  name: string;
  phone: string;
}

export interface ContactValidationResult {
  validContacts: BulkContactInput[];
  invalidContacts: Array<{
    row: number;
    name: string;
    phone: string;
    reason: string;
  }>;
}
