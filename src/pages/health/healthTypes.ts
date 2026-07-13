import { HealthRecord, HealthRecordKind, HealthAttachment } from '../../store';

export type { HealthRecord, HealthRecordKind, HealthAttachment };

export interface FilterState {
  search: string;
  kind: HealthRecordKind | 'all';
  sortBy: 'newest' | 'oldest';
  onlyHasFiles: boolean;
}
