import StarField from './components/StarField';
import AuthContainer from './components/AuthContainer';

export default function SignUpLoginPage() {
  return (
    <main className="cosmic-bg min-h-screen relative overflow-hidden">
      <StarField />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <AuthContainer />
      </div>
    </main>
  );
}