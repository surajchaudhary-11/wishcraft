import { describe, it, expect, vi } from 'vitest';
import { PublicWishPage } from '../pages/PublicWishPage';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TEMPLATES } from '../data/templates';
import { NotFoundPage } from '../pages/NotFoundPage';
import { TemplateDetailPage } from '../pages/TemplateDetailPage';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { AuthProvider } from '../context/AuthContext';
import { WishProvider } from '../context/WishContext';
import { API_BASE_URL, BACKEND_HOST, getPublicWishUrl, api, getGuestToken, saveGuestToken, removeGuestToken } from '../services/api';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { fireEvent } from '@testing-library/react';

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


describe('Public Link and API Base URL Normalization', () => {
  it('ensures API_BASE_URL always includes /api/v1', () => {
    expect(API_BASE_URL).toContain('/api/v1');
    expect(API_BASE_URL.endsWith('/api/v1')).toBe(true);
  });

  it('ensures BACKEND_HOST excludes /api/v1 and trailing slashes', () => {
    expect(BACKEND_HOST).not.toContain('/api/v1');
    expect(BACKEND_HOST.endsWith('/')).toBe(false);
  });

  it('generates valid public celebration URLs without double slashes', () => {
    const url = getPublicWishUrl('sophia-birthday-123');
    expect(url).toContain('/wish/sophia-birthday-123');
    expect(url).not.toContain('//wish/');
    expect(getPublicWishUrl('')).toBe('');
  });
});

describe('Deletion and Confirmation Behavior', () => {
  it('renders confirmation modal and handles confirm / cancel actions', () => {
    let confirmed = false;
    let cancelled = false;
    render(
      <ConfirmationModal
        isOpen={true}
        title="Delete Celebration Website?"
        message="Are you sure you want to delete the celebration? This action cannot be undone and its public link will become permanently inactive."
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => { confirmed = true; }}
        onCancel={() => { cancelled = true; }}
      />
    );
    expect(screen.getByText('Delete Celebration Website?')).toBeInTheDocument();
    expect(screen.getByText(/public link will become permanently inactive/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: /Yes, Delete/i });
    fireEvent.click(confirmBtn);
    expect(confirmed).toBe(true);

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);
    expect(cancelled).toBe(true);
  });

  it('exposes api.creations.delete method for backend deletion', () => {
    expect(typeof api.creations.delete).toBe('function');
  });
});

describe('Guest Ownership Token Security Helpers', () => {
  it('safely stores, retrieves, and removes guest tokens in local storage', () => {
    const testCid = 'test-guest-creation-123';
    const testToken = 'gst_random_high_entropy_secret_abc123';

    expect(getGuestToken(testCid)).toBeNull();

    saveGuestToken(testCid, testToken);
    expect(getGuestToken(testCid)).toBe(testToken);

    removeGuestToken(testCid);
    expect(getGuestToken(testCid)).toBeNull();
  });
});


describe('Public Celebration Page Responsive Footer Layout (Issue #8)', () => {
  it('renders compact responsive footer with no excessive space on mobile and preserved desktop layout', async () => {
    vi.spyOn(api.public, 'getPublicSite').mockResolvedValueOnce({
      is_pin_required: false,
      creation: {
        id: 'test-wish-123',
        occasion: 'Birthday',
        recipient_name: 'Alex',
        sender_name: 'Sam',
        relationship: 'Friend',
        message: 'Happy Birthday Alex!',
        tone: 'Warm',
        template_id: 'midnight-surprise',
        photo_url: '',
        photo_memories: [],
        color_scheme: 'Purple',
        enable_confetti: true,
        enable_floating_hearts: false,
        enable_sound_demo: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });

    const { container } = render(
      <MemoryRouter initialEntries={['/wish/alex-birthday']}>
        <Routes>
          <Route path="/wish/:slug" element={<PublicWishPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the wish content to load
    expect(await screen.findByRole('heading', { name: /Happy Birthday/i })).toBeInTheDocument();

    // Verify main container has responsive flex expansion and mobile bottom padding
    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('flex-1');
    expect(mainElement).toHaveClass('flex');
    expect(mainElement).toHaveClass('flex-col');
    expect(mainElement).toHaveClass('pb-14');
    expect(mainElement).toHaveClass('sm:pb-0');
    expect(mainElement?.className).toContain('[&>*]:flex-1');

    // Verify floating footer watermark badge is compact on mobile and properly aligned
    const footerElement = container.querySelector('footer');
    expect(footerElement).toBeInTheDocument();
    expect(footerElement).toHaveClass('fixed');
    expect(footerElement).toHaveClass('bottom-2.5');
    expect(footerElement).toHaveClass('right-2.5');
    expect(footerElement).toHaveClass('sm:bottom-3');
    expect(footerElement).toHaveClass('sm:right-3');
    expect(footerElement).toHaveClass('z-40');

    // Verify footer link styling
    const badgeLink = screen.getByRole('link', { name: /Made with WishCraft/i });
    expect(badgeLink).toBeInTheDocument();
    expect(badgeLink.className).toContain('text-[11px]');
    expect(badgeLink.className).toContain('sm:text-xs');
    expect(badgeLink.className).toContain('px-3');
    expect(badgeLink.className).toContain('sm:px-3.5');
  });
});
