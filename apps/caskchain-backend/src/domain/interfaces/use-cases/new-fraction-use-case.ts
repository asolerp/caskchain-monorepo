export interface NewFractionUseCase {
  execute(id: string, fraction: any): Promise<void>
}
