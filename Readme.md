# Interactor

Interactor/organizer pattern for node/javascript.

## Basic Usage

An interactor is an object that manipulates a 'Context' (really, just a hash) during a 'perform' method.

Here is a basic interactor:

```
var perform;
perform = require('interactor');

function Interactor() {}
Interactor.perform = perform;
Interactor.prototype.perform = function() {
  console.log(this.context.input);
}

Interactor.perform({ input: 'Hello, World!' });
// Hello World!
```

Seem like a lot of work for little reward? That's where Organizers come in:

```
Organizer = {};
Organizer.perform = perform;
Organizer.organize = [ Interactor1, Interactor2 ]

Organize.perform();
// Performs Interactor1 and Interactor2
```

## Contexts

When you perform an interactor or an organizer, you will almost definitely pass in a hash. The perform function turns this into a special `Context` object, which is shared across all interactors and organizers performed by the initiating organizer.

```
function FirstInteractor() {}
FirstInteractor.perform = perform;
FirstInteractor.prototype.perform = function() {
  this.context.sum = this.context.num * 2;
}

function SecondInteractor() {}
SecondInteractor.perform = perform;
SecondInteractor.prototype.perform = function() {
  console.log('The sum is ' + this.context.sum);
}

Organizer = {};
Organizer.perform = perform;
Organizer.organize = [ FirstInteractor, SecondInteractor ];

result = Organizer.perform({ num: 1 });
// "The sum is 2"
console.log(result.sum);
// 2
```

## Fail, succeed, skip

At any point during an interactor's perform method, you may call `this.fail`, `this.succeed` and `this.skip` to halt the current interactor.

Succeed and fail also update the context's status to 'failed' and 'succeeded', respectively.

While performing an organizer, if the context's status change to failed or succeeded, the organizer will not perform any remaining interactors. However, skipping an interactor does not halt the organizer, and any remaining interactors will be performed.

Additionally, succeed and fail may be passed a message, which is added as the `message` property of the context.

Here is a failure example:

```
function FirstInteractor() {}
FirstInteractor.perform = perform;
FirstInteractor.prototype.perform = function() {
  this.fail('my message');
}

function SecondInteractor() {}
SecondInteractor.perform = perform;
SecondInteractor.prototype.perform = function() {
  console.log('This never gets logged');
}

Organizer = {};
Organizer.perform = perform;
Organizer.organize = [ FirstInteractor, SecondInteractor ];

result = Organizer.perform();
console.log(result.status);
// "failed"
console.log(result.message);
// 2

