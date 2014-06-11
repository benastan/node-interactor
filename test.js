var chai, Context, expect, perform, sinon;

chai = require('chai');
Context = require('./lib/context');
expect = chai.expect;
perform = require('./');
sinon = require('sinon');

describe('interactor library', function() {
  var FirstInteractor, SecondInteractor, Organizer, performed, firstPerformStub, secondPerformStub;

  beforeEach(function() {
    FirstInteractor = function() {}
    firstPerformStub = sinon.spy();
    FirstInteractor.prototype.perform = firstPerformStub;
    FirstInteractor.perform = perform;

    SecondInteractor = function() {}
    secondPerformStub = sinon.spy();
    SecondInteractor.prototype.perform = secondPerformStub;
    SecondInteractor.perform = perform;

    Organizer = {};
    Organizer.perform = perform;
    Organizer.organize = [ FirstInteractor, SecondInteractor ];
  });

  describe('perform interactor', function() {
    it('performs the interactor', function() {
      FirstInteractor.perform();
      expect(firstPerformStub.called).to.equal(true);
    });

    it('returns the context', function() {
      FirstInteractor.prototype.perform = function() { this.context.key = 'value'; };
      result = FirstInteractor.perform({ originalKey: 'original value' });
      expect(result).to.be.an.instanceof(Context);
      expect(result.key).to.equal('value');
      expect(result.originalKey).to.equal('original value');
    });

    describe('failure', function() {
      it('sets the status to failure', function() {
        FirstInteractor.prototype.perform = function() { this.fail('some failure reason'); }
        result = FirstInteractor.perform();
        expect(result.status).to.equal('failed');
      });

      it('can be passed a message', function() {
        FirstInteractor.prototype.perform = function() { this.fail('some failure reason'); }
        result = FirstInteractor.perform();
        expect(result.message).to.equal('some failure reason');
      });
    });

    describe('success', function() {
      it('sets the status to success', function() {
        FirstInteractor.prototype.perform = function() { this.succeed('some success reason'); }
        result = FirstInteractor.perform();
        expect(result.status).to.equal('succeeded');
      });

      it('can be passed a message', function() {
        FirstInteractor.prototype.perform = function() { this.succeed('some success reason'); }
        result = FirstInteractor.perform();
        expect(result.message).to.equal('some success reason');
      });
    });

    describe('raising an error', function() {
      it('does not catch the error', function() {
        FirstInteractor.prototype.perform = function() { throw 'my other error' };
        try { FirstInteractor.perform(); }
        catch (e) { expect(e).to.equal('my other error'); }
      });
    });
  });

  describe('perform organizer', function() {
    describe('default behavior', function() {
      it('performs all interactors', function() {
        Organizer.perform();
        expect(firstPerformStub.called).to.equal(true);
        expect(secondPerformStub.called).to.equal(true);
      });
    });

    describe('when the first interactor fails', function() {
      it('performs only the first interactor', function() {
        FirstInteractor.prototype.perform = function() {
          this.fail();
          firstPerformStub();
        }
        result = Organizer.perform();
        expect(firstPerformStub.called).to.equal(false);
        expect(secondPerformStub.called).to.equal(false);
        expect(result.status).to.equal('failed');
      });
    });

    describe('when the first interactor succeeds', function() {
      it('performs only the first interactor', function() {
        FirstInteractor.prototype.perform = function() {
          this.succeed();
          firstPerformStub();
        }
        result = Organizer.perform();
        expect(firstPerformStub.called).to.equal(false);
        expect(secondPerformStub.called).to.equal(false);
        expect(result.status).to.equal('succeeded');
      });
    });

    describe('when the first interactor skips', function() {
      it('performs only the first interactor', function() {
        FirstInteractor.prototype.perform = function() {
          this.skip();
          firstPerformStub();
        }
        result = Organizer.perform();
        expect(firstPerformStub.called).to.equal(false);
        expect(secondPerformStub.called).to.equal(true);
        expect(result.status).to.equal(undefined);
      });
    });
  });
});
