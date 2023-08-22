import { TrainingService } from "@application/TrainingService";

const MAX_EXERCISES = 6;
const MAX_MISTAKES_IN_ONE_EXERCISE = 3;

const initApp = () => {
  const trainingService = new TrainingService(
    MAX_EXERCISES,
    MAX_MISTAKES_IN_ONE_EXERCISE,
  );

  trainingService.initTraining();
};

initApp();
