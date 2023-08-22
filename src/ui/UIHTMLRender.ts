export class UIHTMLRender {
  private trainerElement: HTMLElement;
  private currentQuestionElement: HTMLElement;
  private totalQuestionsElement: HTMLElement;
  private answerElement: HTMLElement;
  private charsElement: HTMLElement;

  private statisticsElement: HTMLElement;
  private statisticsExercisesWithoutMistakesElement: HTMLElement;
  private statisticsCountMistakesElement: HTMLElement;
  private statisticsWordWithMaxMistakesElement: HTMLElement;

  private previousTrainingModal: HTMLElement;
  private previousTrainingModalBackdrop: HTMLElement;
  private previousTrainingCancel: HTMLElement;
  private previousTrainingContinue: HTMLElement;

  private boundKeyDownHandler: (e: KeyboardEvent) => void;

  private validateCallback: Function;
  private modalCallback: Function;
  private popStateCallback: Function;

  constructor(
    validateCallback: Function,
    modalCallback: Function,
    popStateCallback: Function,
  ) {
    this.trainerElement = this.getElement("trainer");
    this.currentQuestionElement = this.getElement("current_question");
    this.totalQuestionsElement = this.getElement("total_questions");
    this.answerElement = this.getElement("answer");
    this.charsElement = this.getElement("letters");

    this.statisticsElement = this.getElement("statistics");
    this.statisticsExercisesWithoutMistakesElement = this.getElement(
      "statistics-without-mistakes",
    );
    this.statisticsCountMistakesElement = this.getElement(
      "statistics-count-mistakes",
    );
    this.statisticsWordWithMaxMistakesElement = this.getElement(
      "statistics-word-with-max-mistakes",
    );

    this.previousTrainingModal = this.getElement("previous-training-modal");
    this.previousTrainingModalBackdrop = this.getElement(
      "previous-training-modal-backdrop",
    );
    this.previousTrainingCancel = this.getElement("previous-training-cancel");
    this.previousTrainingContinue = this.getElement(
      "previous-training-continue",
    );

    this.validateCallback = validateCallback;
    this.modalCallback = modalCallback;
    this.popStateCallback = popStateCallback;

    this.boundKeyDownHandler = this.keyDownHandler.bind(this);

    this.previousTrainingCancel.addEventListener(
      "click",
      this.modalBtnClickCallback.bind(this),
    );
    this.previousTrainingContinue.addEventListener(
      "click",
      this.modalBtnClickCallback.bind(this),
    );
  }

  private getElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Element with id ${id} not found`);
    }
    return element;
  }

  setCurrentExerciseNumber(number: number): void {
    this.currentQuestionElement.textContent = (number + 1).toString();
  }

  setMaxExerciseNumber(number: number): void {
    this.totalQuestionsElement.textContent = number.toString();
  }

  showStatistics(
    totalMistakes: number,
    wordsWithoutMistakes: number,
    wordWithMaxMistakes: string,
  ): void {
    this.trainerElement.classList.add("d-none");
    this.statisticsElement.classList.add("d-block");

    this.statisticsCountMistakesElement.innerText = totalMistakes.toString();
    this.statisticsExercisesWithoutMistakesElement.innerText =
      wordsWithoutMistakes.toString();
    this.statisticsWordWithMaxMistakesElement.innerHTML = wordWithMaxMistakes;
  }

  showRenderedStatistics() {
    this.trainerElement.classList.add("d-none");
    this.statisticsElement.classList.add("d-block");
  }

  hideStatistics() {
    this.trainerElement.classList.remove("d-none");
    this.statisticsElement.classList.remove("d-block");
  }

  setAnswerChar(char: string, statusClass = "btn-success"): void {
    const btn = document.createElement("button");
    btn.textContent = char;
    btn.classList.add("btn", statusClass, "mx-1");

    this.answerElement.appendChild(btn);
  }

  clearAnswer(): void {
    this.answerElement.innerHTML = "";
  }

  setChars(chars: string[]): void {
    this.charsElement.innerHTML = "";

    chars.forEach((char) => {
      const btn = document.createElement("button");
      btn.textContent = char;
      btn.classList.add("btn", "btn-primary", "mx-1");
      btn.dataset.char = char;

      btn.addEventListener("click", (e) => this.clickHandler(e));

      this.charsElement.appendChild(btn);
    });
  }

  clearChars(): void {
    this.charsElement.innerHTML = "";
  }

  keyDownHandler(e: KeyboardEvent): void {
    if (
      !e.ctrlKey &&
      !e.altKey &&
      !e.shiftKey &&
      !e.metaKey &&
      e.key.match(/^[a-zA-Z]$/)
    ) {
      const char = e.key;

      const { isCorrectAnswer, isFailedExercise, exerciseChars } =
        this.validateCallback(char);

      this.updateUIByValidate(
        char,
        isCorrectAnswer,
        isFailedExercise,
        exerciseChars,
      );
    }
  }

  clickHandler(e: MouseEvent): void {
    const target = e.target as HTMLButtonElement;
    const char = target.innerText;

    const { isCorrectAnswer, isFailedExercise, exerciseChars } =
      this.validateCallback(char);

    this.updateUIByValidate(
      char,
      isCorrectAnswer,
      isFailedExercise,
      exerciseChars,
    );
  }

  updateUIByValidate(
    char: string,
    isCorrectAnswer: boolean,
    isFailedExercise: boolean,
    exerciseChars: string[],
  ): void {
    const target = document.querySelector(
      `[data-char="${char}"]`,
    ) as HTMLButtonElement;
    const currentChar = target?.innerText;

    if (currentChar && isCorrectAnswer) {
      target.remove();

      this.setAnswerChar(currentChar);
    } else {
      if (!isFailedExercise) {
        target?.classList?.add("btn-danger");

        setTimeout(() => {
          target?.classList.remove("btn-danger");
        }, 750);
      } else {
        this.clearAnswer();

        exerciseChars.forEach((char: string) => {
          this.setAnswerChar(char, "btn-danger");
        });

        this.clearChars();
      }
    }
  }

  showPreviousTrainingModal(): void {
    this.previousTrainingModal.style.display = "block";
    this.previousTrainingModalBackdrop.style.display = "block";
  }

  hidePreviousTrainingModal(): void {
    this.previousTrainingModal.style.display = "none";
    this.previousTrainingModalBackdrop.style.display = "none";
  }

  modalBtnClickCallback(e: MouseEvent): void {
    const target = e.target as HTMLButtonElement;
    const action = target.dataset.action;

    this.modalCallback(action);
  }

  startListeningKeydown(): void {
    document.addEventListener("keydown", this.boundKeyDownHandler);
  }

  stopListeningKeydown(): void {
    document.removeEventListener("keydown", this.boundKeyDownHandler);
  }

  startListeningPopState(): void {
    window.addEventListener("popstate", (e) => {
      this.popStateCallback();
    });
  }
}
