export interface CallFilters {
  dateRange: {
    from: string;
    to: string;
  };
  agentId?: string;
  phoneNumber?: string;
  status?: string[];
}

export interface FilterOption {
  value: string;
  label: string;
}
