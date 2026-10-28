import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TEMPLATES } from '../data/templates';
import { NotFoundPage } from '../pages/NotFoundPage';
import { TemplateDetailPage } from '../pages/TemplateDetailPage';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { AuthProvider } from '../context/AuthContext';
import { WishProvider } from '../context/WishContext';

describe('Templates Gallery Data', () => {
  it('contains exactly 8 unique celebration templates', () => {
    expect(TEMPLATES.length).toBe(8);
    const ids = TEMPLATES.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(8);
  });

  it('verifies essential template identities', () => {
    const ids = TEMPLATES.map(t => t.id);
    expect(ids).toContain('blush-celebration');
    expect(ids).toContain('midnight-surprise');
    expect(ids).toContain('cute-playful');
    expect(ids).toContain('memory-lane');
    expect(ids).toContain('minimal-elegance');
    expect(ids).toContain('love-letter');
    expect(ids).toContain('retro-party');
    expect(ids).toContain('golden-moments');
  });
});

describe('Not Found Page', () => {
  it('renders 404 message and home link', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Error 404/i)).toBeInTheDocument();
    expect(screen.getByText(/Page Wandered Away/i)).toBeInTheDocument();
    expect(screen.getByText(/Return Home/i)).toBeInTheDocument();
  });
});

describe('Template Detail Page', () => {
  it('displays error state for invalid template ID', () => {
    render(
      <AuthProvider>
        <WishProvider>
          <MemoryRouter initialEntries={['/templates/non-existent-template']}>
            <Routes>
              <Route path="/templates/:templateId" element={<TemplateDetailPage />} />
            </Routes>
          </MemoryRouter>
        </WishProvider>
      </AuthProvider>
    );

    expect(screen.getByText(/Template Not Found/i)).toBeInTheDocument();
  });

  it('renders valid template preview header', () => {
    render(
      <AuthProvider>
        <WishProvider>
          <MemoryRouter initialEntries={['/templates/blush-celebration']}>
            <Routes>
              <Route path="/templates/:templateId" element={<TemplateDetailPage />} />
            </Routes>
          </MemoryRouter>
        </WishProvider>
      </AuthProvider>
    );

    expect(screen.getByText('Blush Celebration')).toBeInTheDocument();
  });
});

describe('Authentication Pages', () => {
  it('renders Sign In form with email and password fields', () => {
    render(
      <AuthProvider>
        <WishProvider>
          <MemoryRouter>
            <SignInPage />
          </MemoryRouter>
        </WishProvider>
      </AuthProvider>
    );

    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('renders Sign Up form with name, email, and password fields', () => {
    render(
      <AuthProvider>
        <WishProvider>
          <MemoryRouter>
            <SignUpPage />
          </MemoryRouter>
        </WishProvider>
      </AuthProvider>
    );

    expect(screen.getByPlaceholderText('Marcus Taylor')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('marcus@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Free Account/i })).toBeInTheDocument();
  });
});
