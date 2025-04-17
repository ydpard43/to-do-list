export class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public completed: boolean = false,
    public categoryId?: string
  ) {}

  toggleCompletion(): void {
    this.completed = !this.completed;
  }
}
