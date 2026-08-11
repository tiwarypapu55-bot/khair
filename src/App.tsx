import React from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AppointmentModal } from './components/AppointmentModal';
import { FlashAnnouncementModal } from './components/FlashAnnouncementModal';
import { EmployeeLoginModal } from './components/EmployeeLoginModal';
import { EmployeePortal } from './components/EmployeePortal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { GalleryPage } from './pages/GalleryPage';
import { NewsEventsPage } from './pages/NewsEventsPage';
import { ContactPage } from './pages/ContactPage';

// Admin System Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminHome } from './pages/admin/AdminHome';
import { AdminDoctors } from './pages/admin/AdminDoctors';
import { AdminEmployees } from './pages/admin/AdminEmployees';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminNotices } from './pages/admin/AdminNotices';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminFeedback } from './pages/admin/AdminFeedback';
import { AdminSettings } from './pages/admin/AdminSettings';

const MainContent: React.FC = () => {
  const { currentTab, isAdminMode, adminTab, isEmployeePortalOpen, loggedInEmployee } = useHospital();

  if (isEmployeePortalOpen && loggedInEmployee) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans selection:bg-blue-100 selection:text-blue-900">
        <EmployeePortal />
        <EmployeeLoginModal />
      </div>
    );
  }

  if (isAdminMode) {
    return (
      <AdminLayout>
        {adminTab === 'home' && <AdminHome />}
        {adminTab === 'doctor-list' && <AdminDoctors />}
        {adminTab === 'employee' && <AdminEmployees />}
        {adminTab === 'gallery' && <AdminGallery />}
        {adminTab === 'notice' && <AdminNotices />}
        {adminTab === 'events' && <AdminEvents />}
        {adminTab === 'feedback' && <AdminFeedback />}
        {adminTab === 'settings' && <AdminSettings />}
        <EmployeeLoginModal />
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main className="flex-1">
        {currentTab === 'home' && <HomePage />}
        {currentTab === 'departments' && <DepartmentsPage />}
        {currentTab === 'facilities' && <FacilitiesPage />}
        {currentTab === 'doctors' && <DoctorsPage />}
        {currentTab === 'gallery' && <GalleryPage />}
        {currentTab === 'news-events' && <NewsEventsPage />}
        {currentTab === 'contact' && <ContactPage />}
      </main>

      <Footer />
      <AppointmentModal />
      <FlashAnnouncementModal />
      <EmployeeLoginModal />
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <MainContent />
    </HospitalProvider>
  );
}
