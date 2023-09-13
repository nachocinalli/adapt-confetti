import Adapt from 'core/js/adapt';
import data from 'core/js/data';
import 'libraries/js-confetti';
class Confetti extends Backbone.Controller {
  initialize() {
    this.listenTo(Adapt, {
      'componentView:postRender': this.onRender
    });
  }

  onRender(view) {
    const model = view.model;
    if (!this.checkIsEnabled(model)) {
      return;
    }
    if (!this.jsConfetti) {
      // eslint-disable-next-line no-undef
      this.jsConfetti = new JSConfetti();
    }
    const confettiModel = model.get('_confetti');
    if (confettiModel._fireOn === 'completed' && !model.get('_isComplete')) {
      this.listenTo(model, 'change:_isComplete', this.addConfetti.bind(this, confettiModel));
    }
    if (confettiModel._fireOn === 'correct') {
      this.listenTo(Adapt, 'questionView:showFeedback', this.onQuestionViewShowFeedback);
    }
    if (confettiModel._fireOn === 'inview') {
      view.$el.on('onscreen.animate', this.checkIfOnScreen.bind(this));
    }
    if (confettiModel._fireOn === 'click') {
      view.$el.find('.fire-confetti').on('click', (e) => {
        e.preventDefault();
        this.addConfetti(confettiModel);
      });
    }
  }

  onQuestionViewShowFeedback(view) {
    const model = view.model;
    if (!this.checkIsEnabled(model)) {
      return;
    }
    const confettiModel = model.get('_confetti');
    if (confettiModel._fireOn === 'correct' && model.get('_isCorrect')) {
      this.addConfetti(confettiModel);
    }
  }

  checkIfOnScreen({ currentTarget }, options) {
    const { onscreen, percentInviewVertical } = options;
    const modelId = $(currentTarget).attr('data-adapt-id');
    const model = data.findById(modelId);

    if (!onscreen || percentInviewVertical < model.get('_confetti')._percentInview) return;

    $(currentTarget).off('onscreen.animate');
    this.addConfetti(model.get('_confetti'));
  }

  addConfetti(model) {
    model.firedTimes = 0;
    this.fireConfetti(model);
  }

  fireConfetti(model) {
    const { _confettiRadius, _confettiNumber, _confettiColors, _emojis, _emojiSize } = model;
    const confettiGlobals = Adapt.course.get('_globals')._extensions._confetti;
    const confettiRadiusGlobal = confettiGlobals?._confettiRadius || 6;
    const confettiNumberGlobal = confettiGlobals?._confettiNumber || 10;
    const confettiEmojiSizeGlobal = confettiGlobals?._emojiSize || 24;
    const _hasEmoji = _emojis.length > 0;
    const _hasConfettiColors = _confettiColors.length > 0;
    const confettiOptions = {
      confettiRadius: _confettiRadius || confettiRadiusGlobal,
      confettiNumber: _confettiNumber || confettiNumberGlobal
    };
    if (_hasConfettiColors) {
      confettiOptions.confettiColors = _confettiColors;
    }
    if (_hasEmoji) {
      confettiOptions.emojis = _emojis;
      confettiOptions.emojiSize = _emojiSize || confettiEmojiSizeGlobal;
    }
    if (_hasEmoji && _hasConfettiColors) {
      const { emojis, ...confettiOptions1 } = confettiOptions;
      const { confettiColors, ...confettiOptions2 } = confettiOptions;
      this.jsConfetti.addConfetti(confettiOptions1).then(() => {
        this.jsConfetti.addConfetti(confettiOptions2).then(() => {
          this.checksLoops(model);
        });
      });
    } else {
      this.jsConfetti.addConfetti(confettiOptions).then(() => {
        this.checksLoops(model);
      });
    }
  }

  checksLoops(model) {
    const { _loops, firedTimes } = model;
    if (_loops === 0) return;
    if (firedTimes < _loops) {
      model.firedTimes++;
      this.fireConfetti(model);
    }
  }

  checkIsEnabled(model) {
    const _model = model.get('_confetti');
    if (!_model || !_model._isEnabled) return false;
    return true;
  }
}

export default new Confetti();
