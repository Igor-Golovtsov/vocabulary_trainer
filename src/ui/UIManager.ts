import { UIHTMLRender } from "./UIHTMLRender";

export class UIManager {
  private UIHTMLRender: UIHTMLRender;

  constructor(
    validateCallback: Function,
    modalCallback: Function,
    popStateCallback: Function,
  ) {
    this.UIHTMLRender = new UIHTMLRender(
      validateCallback,
      modalCallback,
      popStateCallback,
    );
  }

  setCurrentExerciseNumber(number: number): void {
    this.UIHTMLRender.setCurrentExerciseNumber(number);
  }

  setMaxExerciseNumber(number: number): void {
    this.UIHTMLRender.setMaxExerciseNumber(number);
  }

  showStatistics(
    wordsWithoutMistakes: number,
    totalMistakes: number,
    wordWithMaxMistakes: string,
  ): void {
    this.UIHTMLRender.showStatistics(
      wordsWithoutMistakes,
      totalMistakes,
      wordWithMaxMistakes,
    );
  }

  showRenderedStatistics() {
    this.UIHTMLRender.showRenderedStatistics();
  }

  hideStatistics() {
    this.UIHTMLRender.hideStatistics();
  }

  setExerciseAnswerChars(chars: string[]): void {
    chars.forEach((char) => {
      this.UIHTMLRender.setAnswerChar(char);
    });
  }

  setExerciseChars(chars: string[]): void {
    this.UIHTMLRender.setChars(chars);
  }

  clearAnswer(): void {
    this.UIHTMLRender.clearAnswer();
  }

  clearChars(): void {
    this.UIHTMLRender.clearChars();
  }

  showPreviousTrainingModal(): void {
    this.UIHTMLRender.showPreviousTrainingModal();
  }

  hidePreviousTrainingModal(): void {
    this.UIHTMLRender.hidePreviousTrainingModal();
  }

  startListeningKeydown(): void {
    this.UIHTMLRender.startListeningKeydown();
  }

  stopListeningKeydown(): void {
    this.UIHTMLRender.stopListeningKeydown();
  }

  startListeningPopState(): void {
    this.UIHTMLRender.startListeningPopState();
  }
}
