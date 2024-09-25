// Navbar.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '@/components/Navbars/AuthNavbar';
import PagesDropdown from '@/components/Dropdowns/PagesDropdown';

describe('Navbar Component', () => {
  test('renders the Navbar with brand link', () => {
    render(<Navbar />);
    const brandLink = screen.getByText(/Vi Exports/i);
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute('href', '/');
  });




  test('renders social media links', () => {
    render(<Navbar />);
    
    const facebookLink = screen.getByRole('link', { name: /Share/i });
    expect(facebookLink).toBeInTheDocument();
    expect(facebookLink).toHaveAttribute('href', expect.stringContaining('facebook.com'));

    const twitterLink = screen.getByRole('link', { name: /Tweet/i });
    expect(twitterLink).toBeInTheDocument();
    expect(twitterLink).toHaveAttribute('href', expect.stringContaining('twitter.com'));

    const githubLink = screen.getByRole('link', { name: /Star/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', expect.stringContaining('github.com'));
  });
});
