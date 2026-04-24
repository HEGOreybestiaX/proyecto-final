import { Suspense } from 'react';
import LessonsClient from './components/LessonsClient';
import LessonsStarField from './components/LessonsStarField';

export default function LessonsPage() {
  return (
    <main className="cosmic-bg min-h-screen relative overflow-hidden">
      <LessonsStarField />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Suspense fallback={<div className="min-h-screen" />}>
          <LessonsClient />
        </Suspense>
      </div>
    </main>
  );
}