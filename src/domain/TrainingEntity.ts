import shuffleArray from "@utils/shuffleArray";
import { ExerciseEntity } from "./ExerciseEntity";
import { StatisticEntity } from "./StatisticEntity";
import {
  IStatisticsStorageData,
  ITrainingStorageData,
} from "@infrastructure/repositories/TrainingRepository";

interface ITrainingValidateData {
  isCorrectAnswer: boolean;
  isFailedExercise: boolean;
  exerciseChars: string[];
}

export class TrainingEntity {
  private exercises: ExerciseEntity[];
  private statistics: StatisticEntity;
  private maxWords: number;
  private currentExerciseIndex = 0;
  private maxMistakesInOneExercise: number;

  constructor(
    words: string[] | null,
    previousTraining: ITrainingStorageData | null,
    maxExercises: number,
    maxMistakesInOneExercise: number,
  ) {
    this.maxWords = maxExercises;
    this.maxMistakesInOneExercise = maxMistakesInOneExercise;

    if (words) {
      this.exercises = this.createExercises(words);
      this.statistics = new StatisticEntity(null);
    }

    if (previousTraining) {
      this.exercises = this.restoreExercises(previousTraining);
      this.currentExerciseIndex = previousTraining.currentExerciseIndex;
      this.statistics = new StatisticEntity(previousTraining.statistics);
    }
  }

  restoreExercises(previousTraining: ITrainingStorageData): ExerciseEntity[] {
    return previousTraining.exercises.map(
      (exercise) =>
        new ExerciseEntity(null, exercise, this.maxMistakesInOneExercise),
    );
  }

  createExercises(words: string[]): ExerciseEntity[] {
    return shuffleArray(words)
      .slice(0, this.maxWords)
      .map(
        (word) => new ExerciseEntity(word, null, this.maxMistakesInOneExercise),
      );
  }

  getDataForSaving(): ITrainingStorageData {
    return {
      statistics: this.statistics.getStatistics(),
      exercises: this.exercises.map((exercise) => exercise.getDataForSaving()),
      currentExerciseIndex: this.currentExerciseIndex,
    };
  }

  getStatistics(): IStatisticsStorageData {
    return this.statistics.getStatistics();
  }

  getCurrentExerciseNumber(): number {
    return this.currentExerciseIndex;
  }

  getMaxExerciseNumber(): number {
    return this.maxWords;
  }

  getCurrentExercise(): ExerciseEntity {
    return this.exercises[this.currentExerciseIndex];
  }

  goToNextExercise(): void {
    this.currentExerciseIndex += 1;
  }

  updateStatistics(): void {
    const exerciseMistakes = this.getCurrentExercise().getExerciseMistakes();
    const currentWord = this.getCurrentExercise().getCurrentExercise().join("");

    this.statistics.updateMistakesCounter(exerciseMistakes, currentWord);
  }

  validateAnswer(currentChar: string): ITrainingValidateData {
    return {
      isCorrectAnswer: this.getCurrentExercise().validateAnswer(currentChar),
      isFailedExercise: this.getCurrentExercise().isFailedExercise(),
      exerciseChars: this.getCurrentExercise().getCurrentExercise(),
    };
  }

  isFinishExercise(): boolean {
    return this.getCurrentExercise().isFinishExercise();
  }

  isFinishTraining(): boolean {
    return this.currentExerciseIndex + 1 === this.maxWords;
  }
}
