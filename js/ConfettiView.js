import ComponentView from 'core/js/views/componentView';
import 'libraries/js-confetti';
class ConfettiView extends ComponentView {
  preRender() {
    // eslint-disable-next-line no-undef
    this.jsConfetti = new JSConfetti();
    this.onClick = this.onClick.bind(this);
  }

  postRender() {
    this.setReadyStatus();
    if (this.model.get('_setCompletionOn') !== 'inview') return;
    this.setupInviewCompletion('.component__inner', this.onInViewHandler.bind(this));
  }

  onInViewHandler() {
    if (this.model.get('isComplete')) return;
    this.setCompletionStatus();
    this.addConfetti();
  }

  addConfetti() {
    const confettiRadius = this.model.get('_confettiRadius');
    const confettiNumber = this.model.get('_confettiNumber');
    const emojiSize = this.model.get('_emojiSize');
    let emojis = this.model.get('_emojis');
    if (emojis.length === 0) {
      emojis = ['🎉', '🥳', '🎈'];
    }

    this.jsConfetti.addConfetti({
      confettiRadius,
      confettiNumber,
      emojis,
      emojiSize
    });
  }

  onClick() {
    if (!this.model.get('isComplete')) {
      this.setCompletionStatus();
    }
    this.addConfetti();
  }
}

ConfettiView.template = 'confetti.jsx';

export default ConfettiView;
