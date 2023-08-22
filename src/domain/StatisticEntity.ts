import { IStatisticsStorageData } from "@infrastructure/repositories/TrainingRepository";

export class StatisticEntity {
  private totalMistakes = 0;
  private wordsWithoutMistakes = 0;
  private wordWithMaxMistakes = "-";

  private maxMistakesInOneExercise = 0;

  constructor(previousTrainingStatistics: IStatisticsStorageData | null) {
    if (previousTrainingStatistics) {
      this.totalMistakes = previousTrainingStatistics.totalMistakes;
      this.wordsWithoutMistakes =
        previousTrainingStatistics.wordsWithoutMistakes;
      this.wordWithMaxMistakes = previousTrainingStatistics.wordWithMaxMistakes;
      this.maxMistakesInOneExercise =
        previousTrainingStatistics.maxMistakesInOneExercise;
    }
  }

  getStatistics(): IStatisticsStorageData {
    return {
      totalMistakes: this.totalMistakes,
      wordsWithoutMistakes: this.wordsWithoutMistakes,
      wordWithMaxMistakes: this.wordWithMaxMistakes,
      maxMistakesInOneExercise: this.maxMistakesInOneExercise,
    };
  }

  updateMistakesCounter(mistakes: number, currentWord: string): void {
    this.totalMistakes += mistakes;

    if (!mistakes) {
      this.wordsWithoutMistakes += 1;
    }

    this.updateWordWithMaxMistakes(mistakes, currentWord);
  }

  updateWordWithMaxMistakes(mistakes: number, currentWord: string): void {
    if (mistakes > 0 && mistakes >= this.maxMistakesInOneExercise) {
      this.wordWithMaxMistakes = currentWord;
    }
  }
}
