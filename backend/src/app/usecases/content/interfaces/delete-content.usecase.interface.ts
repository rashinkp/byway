export interface IDeleteLessonContentUseCase {
  execute(id: string): Promise<void>;
}
