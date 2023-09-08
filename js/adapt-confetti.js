import components from 'core/js/components';
import ConfettiView from './ConfettiView';
import ConfettiModel from './ConfettiModel';

export default components.register('confetti', {
  model: ConfettiModel,
  view: ConfettiView
});
