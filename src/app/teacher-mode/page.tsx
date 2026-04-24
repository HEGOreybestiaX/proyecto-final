import KingdomStarField from '@/app/kingdom-map-screen/components/KingdomStarField';
import TeacherDashboardClient from './components/TeacherDashboardClient';

export default function TeacherModePage() {
  return (
    <main className="cosmic-bg min-h-screen relative overflow-hidden">
      <KingdomStarField />
      <div className="relative z-10 min-h-screen">
        <TeacherDashboardClient />
      </div>
    </main>
  );
}
