export interface foodObject {
  id?: string;
  name: string;
  bestBefore: Date;
  class?: string;
  dayLeft?: number;
  itemId: number;
}
export interface Criteria {
  sortedBy: string;
  order: string;
}

export interface Shortcut {
  keys: string[];
  cb: { (): void };
}

export type paginationSchema = {
  type: 'endMore' | 'startMore' | 'symmetrical';
};
