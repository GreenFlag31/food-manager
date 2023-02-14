export interface foodObject {
  id?: string;
  name: string;
  bestBefore: Date;
  class?: string;
  dayLeft?: number;
  itemId: number;
}
export interface Icriteria {
  sortedBy: string;
  order: string;
}
