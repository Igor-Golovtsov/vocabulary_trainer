import { IExerciseStorageData } from "@infrastructure/repositories/TrainingRepository";
import shuffleArray from "@utils/shuffleArray";

export class ExerciseEntity {
  private maxMistakes: number;
  private answers: string[] = [];
  private currentExercise: string[] = [];
  private shuffleExercise: string[] = [];
  private exerciseMistakes: number = 0;

  constructor(
    currentWord: string | null,
    previousExercise: IExerciseStorageData | null,
    maxMistakesInOneExercise: number,
  ) {
    this.maxMistakes = maxMistakesInOneExercise;

    if (currentWord) {
      this.currentExercise = currentWord.split("");
      this.shuffleExercise = shuffleArray(this.currentExercise);
    }

    if (previousExercise) {
      this.answers = previousExercise.answers;
      this.currentExercise = previousExercise.currentExercise;
      this.shuffleExercise = previousExercise.shuffleExercise;
      this.exerciseMistakes = previousExercise.exerciseMistakes;
    }
  }

  getDataForSaving(): IExerciseStorageData {
    return {
      answers: this.answers,
      currentExercise: this.currentExercise,
      shuffleExercise: this.shuffleExercise,
      exerciseMistakes: this.exerciseMistakes,
    };
  }

  getShuffleExercise(): string[] {
    return this.shuffleExercise;
  }

  getCurrentExercise(): string[] {
    return this.currentExercise;
  }

  getCurrentAnswers(): string[] {
    return this.answers;
  }

  getExerciseMistakes(): number {
    return this.exerciseMistakes;
  }

  validateAnswer(currentChar: string): boolean {
    const currenAnswerCharPosition = this.answers.length;
    const correctChar = this.currentExercise[currenAnswerCharPosition];

    if (currentChar === correctChar) {
      this.answers.push(currentChar);

      this.removeCharFromShuffle(currentChar);

      return true;
    } else {
      this.exerciseMistakes += 1;

      return false;
    }
  }

  removeCharFromShuffle(char: string): void {
    const index = this.shuffleExercise.findIndex((x) => x === char);

    if (index !== -1) {
      this.shuffleExercise.splice(index, 1);
    }
  }

  isFailedExercise(): boolean {
    return this.exerciseMistakes >= this.maxMistakes;
  }

  isFinishExercise(): boolean {
    return (
      this.isFailedExercise() ||
      this.answers.length === this.currentExercise.length
    );
  }
}
