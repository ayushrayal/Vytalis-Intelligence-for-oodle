import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import GlobalFilterBar from '../common/GlobalFilterBar.jsx';

export default function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas font-sans text-text-primary antialiased transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-y-auto bg-canvas">
        <Header />
        <GlobalFilterBar />
        <main className="flex-1 p-6 bg-canvas">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
