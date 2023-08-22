import { BrowserHistoryRepository } from "./BrowserHistoryRepository";
import { LocalStorageRepository } from "./LocalStorageRepository";

export interface IExerciseStorageData {
  answers: string[];
  currentExercise: string[];
  shuffleExercise: string[];
  exerciseMistakes: number;
}

export interface IStatisticsStorageData {
  totalMistakes: number;
  wordsWithoutMistakes: number;
  wordWithMaxMistakes: string;
  maxMistakesInOneExercise: number;
}

export interface ITrainingStorageData {
  exercises: IExerciseStorageData[];
  statistics: IStatisticsStorageData;
  currentExerciseIndex: number;
}

export class TrainingRepository {
  private storageKey = "vocabulary_trainer";

  private localStorageRepository: LocalStorageRepository<ITrainingStorageData>;
  private browserHistoryRepository: BrowserHistoryRepository<ITrainingStorageData>;

  constructor() {
    this.localStorageRepository = new LocalStorageRepository(this.storageKey);
    this.browserHistoryRepository = new BrowserHistoryRepository(
      this.storageKey,
    );
  }

  fetchWords(): string[] {
    return [
      "apple",
      "function",
      "timeout",
      "task",
      "application",
      "data",
      "tragedy",
      "sun",
      "symbol",
      "button",
      "software",
    ];
  }

  getFromStorage(): ITrainingStorageData | null {
    return this.localStorageRepository.get();
  }

  saveToStorage(data: ITrainingStorageData): void {
    this.localStorageRepository.set(data);
  }

  removeFromStorage(): void {
    this.localStorageRepository.remove();
  }

  getFromHistory(): ITrainingStorageData | null {
    return this.browserHistoryRepository.get();
  }

  saveToHistory(data: ITrainingStorageData): void {
    this.browserHistoryRepository.set(data);
  }

  updateHistory(data: ITrainingStorageData): void {
    this.browserHistoryRepository.update(data);
  }
}
