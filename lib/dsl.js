function interactor(_perform) {
  function _interactor() {}
  _interactor.prototype.perform = _perform;
  _interactor.perform = perform;
  return _interactor;
}

function organizer() {
  var _organizer;
  _organizer = {};
  _organizer.perform = perform;
  _organizer.organize = Array.prototype.slice.apply(arguments);
  return _organizer;
}

global.interactor = interactor;
global.organizer = organizer;
