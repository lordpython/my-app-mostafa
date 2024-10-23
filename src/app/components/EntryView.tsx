import type React from 'react';
import Button from '../../components/ui/Button';

interface EntryViewProps {
  onProceed: () => void;
}

const EntryView: React.FC<EntryViewProps> = ({ onProceed }) => (
  <div
    className="entry-view h-screen flex flex-col items-center justify-center bg-cover bg-center"
    style={{ backgroundImage: 'url(/images/entry-background.jpg)' }}
  >
    <h2 className="text-3xl font-bold text-white mb-6">Welcome to the Trivia Game!</h2>
    <Button onClick={onProceed} variant="primary" className="text-xl px-8 py-4">
      Proceed to Registration
    </Button>
  </div>
);

export default EntryView;
