import loading from './loading/index.js';

export default {
  install(app) {
    app.directive('loading', loading);
  }
};
