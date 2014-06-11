var Context;

Context = require('./context');

function performOrganizer(organizer, context) {
  var i, ii, currentInteractor;

  interactors = organizer.organize;

  for (i = 0, ii = interactors.length; i < ii; i ++) {
    currentInteractor = interactors[i];
    performInteractor(currentInteractor, context);
    if (context.status === 'failed' || context.status === 'succeeded') break;
  }
}

function performInteractor(interactorClass, context) {
  interactor = new interactorClass();
  interactor.context = context;
  interactor.succeed = succeed;
  interactor.fail = fail;
  interactor.skip = skip;
  try { interactor.perform(); }
  catch (e) { if (e !== 'interactor raised') throw e; }
}

function succeed(message) {
  this.context.succeed(message);
}

function fail(message) {
  this.context.fail(message);
}

function skip() {
  this.context.skip();
}

function perform(hash) {
  var context, interactor;

  context = new Context(hash);
  interactor = this;

  if (interactor.organize) performOrganizer(interactor, context);
  else performInteractor(interactor, context);

  return context;
}

exports.perform = perform;
