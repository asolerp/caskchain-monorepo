export interface FavoriteNftUseCase {
  execute(userId: string, caskId: string): Promise<string>
}
