function Context(hash) {
  var i;
  for (i in hash) {
    if (hash.hasOwnProperty(i)) this[i] = hash[i];
  }
  this.messages = { failure: [], success: [] };
}

Context.prototype.fail = function(message) {
  if (message) this.message = message;
  this.status = 'failed';
  throw 'interactor raised'
}

Context.prototype.succeed = function(message) {
  if (message) this.message = message;
  this.status = 'succeeded';
  throw 'interactor raised'
}

Context.prototype.skip = function() {
  throw 'interactor raised'
}

module.exports = Context;
