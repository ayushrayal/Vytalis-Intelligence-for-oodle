import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext.jsx';
import { DateFilterProvider } from './context/DateFilterContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DateFilterProvider>
          <AppRoutes />
        </DateFilterProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
