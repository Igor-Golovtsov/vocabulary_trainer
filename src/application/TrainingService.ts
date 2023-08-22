import { TrainingEntity } from "@domain/TrainingEntity";
import {
  ITrainingStorageData,
  TrainingRepository,
} from "@infrastructure/repositories/TrainingRepository";
import { UIManager } from "@ui/UIManager";

export class TrainingService {
  private uiManager: UIManager;
  private training: TrainingEntity;
  private trainingRepository: TrainingRepository;
  private maxExercises: number;
  private maxMistakesInOneExercise: number;

  constructor(maxExercises: number, maxMistakesInOneExercise: number) {
    this.maxExercises = maxExercises;
    this.maxMistakesInOneExercise = maxMistakesInOneExercise;

    this.uiManager = new UIManager(
      this.validateAnswer.bind(this),
      this.modalCallback.bind(this),
      this.popStateCallback.bind(this),
    );
    this.trainingRepository = new TrainingRepository();

    this.uiManager.startListeningPopState();
  }

  initTraining() {
    const hasPreviousTraining = this.trainingRepository.getFromStorage();

    if (hasPreviousTraining) {
      this.uiManager.showPreviousTrainingModal();
    } else {
      this.startTraining();
    }
  }

  modalCallback(action: string) {
    if (action === "cancel") {
      this.removeTrainingFromStorage();

      this.startTraining();
    }

    if (action === "continue") {
      this.restoreTrainingFromStorage();
    }

    this.uiManager.hidePreviousTrainingModal();
  }

  startTraining() {
    const words = this.trainingRepository.fetchWords();
    this.training = new TrainingEntity(
      words,
      null,
      this.maxExercises,
      this.maxMistakesInOneExercise,
    );

    this.setCurrentExerciseNumber();
    this.setMaxExerciseNumber();
    this.setCurrentExerciseWords();
  }

  restoreTraining(previousTraining: ITrainingStorageData) {
    this.training = new TrainingEntity(
      null,
      previousTraining,
      this.maxExercises,
      this.maxMistakesInOneExercise,
    );

    this.setCurrentExerciseNumber();
    this.setMaxExerciseNumber();
    this.setCurrentExerciseAnswerChars();
    this.setCurrentExerciseWords();
  }

  restoreTrainingFromStorage() {
    const previousTraining = this.trainingRepository.getFromStorage();

    if (previousTraining) {
      this.restoreTraining(previousTraining);
    }
  }

  restoreTrainingFromHistory() {
    const previousTraining = this.trainingRepository.getFromHistory();

    if (previousTraining) {
      this.renderStatisticsByHistory(previousTraining);
    }

    this.uiManager.clearAnswer();
    this.uiManager.clearChars();

    if (previousTraining) {
      this.restoreTraining(previousTraining);
    }
  }

  renderStatisticsByHistory(previousTraining: ITrainingStorageData) {
    const isStatisticsBlock =
      previousTraining.currentExerciseIndex + 1 ===
        previousTraining.exercises.length && this.training.isFinishTraining();

    if (isStatisticsBlock) {
      this.uiManager.showRenderedStatistics();
    } else {
      this.uiManager.hideStatistics();
    }
  }

  saveTrainingToStorage() {
    const data = this.training.getDataForSaving();

    this.trainingRepository.saveToStorage(data);
  }

  removeTrainingFromStorage() {
    this.trainingRepository.removeFromStorage();
  }

  saveTrainingToHistory() {
    const data = this.training.getDataForSaving();

    this.trainingRepository.saveToHistory(data);
  }

  updateTrainingInHistory() {
    const data = this.training.getDataForSaving();

    this.trainingRepository.updateHistory(data);
  }

  setCurrentExerciseNumber() {
    const number = this.training.getCurrentExerciseNumber();

    this.uiManager.setCurrentExerciseNumber(number);
  }

  setMaxExerciseNumber() {
    const number = this.training.getMaxExerciseNumber();

    this.uiManager.setMaxExerciseNumber(number);
  }

  setCurrentExerciseWords() {
    const chars = this.training.getCurrentExercise().getShuffleExercise();

    this.uiManager.setExerciseChars(chars);
    this.uiManager.startListeningKeydown();
  }

  setCurrentExerciseAnswerChars() {
    const chars = this.training.getCurrentExercise().getCurrentAnswers();

    this.uiManager.setExerciseAnswerChars(chars);
  }

  popStateCallback() {
    this.restoreTrainingFromHistory();
  }

  validateAnswer(currentChar: string) {
    const result = this.training.validateAnswer(currentChar);

    this.validateHandler();

    return result;
  }

  validateHandler() {
    const isFinishExercise = this.training.isFinishExercise();
    const isFinishTraining = this.training.isFinishTraining();

    if (isFinishExercise) {
      this.uiManager.stopListeningKeydown();

      this.training.updateStatistics();
      this.updateTrainingInHistory();
      this.saveTrainingToHistory();
      this.training.goToNextExercise();

      if (isFinishTraining) {
        const { totalMistakes, wordsWithoutMistakes, wordWithMaxMistakes } =
          this.training.getStatistics();

        this.uiManager.showStatistics(
          totalMistakes,
          wordsWithoutMistakes,
          wordWithMaxMistakes,
        );
        this.removeTrainingFromStorage();
      } else {
        setTimeout(() => {
          this.uiManager.clearAnswer();
          this.uiManager.clearChars();

          this.setCurrentExerciseNumber();
          this.setMaxExerciseNumber();
          this.setCurrentExerciseWords();
        }, 1000);
      }
    }

    if (!isFinishTraining) {
      this.saveTrainingToStorage();
    }
  }
}
