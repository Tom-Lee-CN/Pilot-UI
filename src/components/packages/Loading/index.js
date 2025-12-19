import loadingDirective from './directive';

const PilotLoading = {
  install(app) {
    app.directive('loading', loadingDirective);
  },
  directive: loadingDirective,
};

export default PilotLoading;
