export interface IDeleteLessonUseCase {
  execute(id: string): Promise<void>;
}
