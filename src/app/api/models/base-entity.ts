export interface EntityDto<TKey = number> {
  id?: TKey;
}

export interface AuditedEntityDto<TKey = number> extends EntityDto<TKey> {
  creationTime?: string;
  creatorId?: string;
  lastModificationTime?: string;
  lastModifierId?: string;
}

export interface FullAuditedEntityDto<TKey = number>
  extends AuditedEntityDto<TKey> {
  isDeleted?: boolean;
  deleterId?: string;
  deletionTime?: string;
}

export interface PagedAndSortedResultRequestDto {
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
}

export interface PagedResultDto<T> {
  items: T[];
  totalCount: number;
}
