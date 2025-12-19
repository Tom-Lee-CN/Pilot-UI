import PilotSteps from './steps.vue';

PilotSteps.install = (app) => {
  app.component(PilotSteps.name, PilotSteps);
};

export default PilotSteps;
