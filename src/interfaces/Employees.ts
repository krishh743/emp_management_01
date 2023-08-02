export interface Employees {
  uniqueId: number;
  name: string;
  subordinates: Employees[];
}
