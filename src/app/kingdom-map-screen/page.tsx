import KingdomMapClient from './components/KingdomMapClient';
import KingdomStarField from './components/KingdomStarField';

export default function KingdomMapPage() {
  return (
    <main className="cosmic-bg min-h-screen relative overflow-hidden">
      <KingdomStarField />
      <div className="relative z-10 min-h-screen flex flex-col">
        <KingdomMapClient />
      </div>
    </main>
  );
}