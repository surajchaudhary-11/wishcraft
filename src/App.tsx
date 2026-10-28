import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishProvider } from './context/WishContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';

// Pages
import { LandingPage } from './pages/LandingPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { TemplateDetailPage } from './pages/TemplateDetailPage';
import { OccasionsPage } from './pages/OccasionsPage';
import { WizardPage } from './pages/WizardPage';
import { EditorPage } from './pages/EditorPage';
import { PublishPage } from './pages/PublishPage';
import { MyCreationsPage } from './pages/MyCreationsPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { PublicWishPage } from './pages/PublicWishPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top automatically when navigating between pages
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Layout wrapper for creator routes that show Navbar and Footer
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5] selection:bg-rosewood-500 selection:text-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <WishProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Creator / Product Routes with full Layout */}
            <Route path="/" element={<Layout><LandingPage /></Layout>} />
            <Route path="/templates" element={<Layout><TemplatesPage /></Layout>} />
            <Route path="/templates/:templateId" element={<Layout><TemplateDetailPage /></Layout>} />
            <Route path="/occasions" element={<Layout><OccasionsPage /></Layout>} />
            <Route path="/create" element={<Layout><WizardPage /></Layout>} />
            <Route path="/editor" element={<Layout><EditorPage /></Layout>} />
            <Route path="/publish" element={<Layout><PublishPage /></Layout>} />
            <Route path="/my-creations" element={<Layout><MyCreationsPage /></Layout>} />
            <Route path="/sign-in" element={<Layout><SignInPage /></Layout>} />
            <Route path="/sign-up" element={<Layout><SignUpPage /></Layout>} />

            {/* Recipient Experience: Standalone celebration route */}
            <Route path="/wish/:slug" element={<PublicWishPage />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
          </Routes>
          <Toast />
        </BrowserRouter>
      </WishProvider>
    </AuthProvider>
  );
};

export default App;
