export interface FilterInputModel {
  fields: {
    searchField: {
      formControlName: string;
    };
    filterField: FilterField[];
  };
}

interface FilterFieldCommon {
  label: string;
  fieldType: 'input' | 'date' | 'select';
  formControlName: string;
  options?: any[];
}

interface FilterFieldDateRange {
  label: string;
  fieldType: 'date-range';
  formControlName: {
    startDate: string;
    endDate: string;
  };
  options?: any[];
}

type FilterField = FilterFieldCommon | FilterFieldDateRange;

interface Option {
  id: number | string;
  name: string;
}
