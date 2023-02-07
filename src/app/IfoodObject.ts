export interface foodObject {
  id?: number;
  name: string;
  bestBefore: Date;
  class?: string;
  dayLeft?: number;
  itemId?: number;
}
export interface Icriteria {
  sortedBy: string;
  order: string;
}
