import LoginForm from '../components/auth/LoginForm';
import { TrendingUp } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:block text-center">
          <div className="w-24 h-24 bg-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <TrendingUp className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Stock Market Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Track stocks, manage your portfolio, and trade with confidence
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
