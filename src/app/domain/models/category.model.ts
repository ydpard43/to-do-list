export class Category {
  constructor(
    public readonly id: string,
    public title: string,
    public createdAt: Date = new Date(),
    public date?: string
  ) { }
}
