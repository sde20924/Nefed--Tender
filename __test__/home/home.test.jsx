// HomeSection.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom'
import HomeSection from '../../components/home/home.jsx';

describe('HomeSection Component', () => {
  test('renders the main heading', () => {
    render(<HomeSection />);
    const headingElement = screen.getByText(/Find Opportunities in Open Tender Auctions/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders the subheading', () => {
    render(<HomeSection />);
    const subheadingElement = screen.getByText(/The platform, supported by NAFED, facilitates a comprehensive registration process for tendor./i);
    expect(subheadingElement).toBeInTheDocument();
  });

  test('renders the description paragraph', () => {
    render(<HomeSection />);
    const descriptionElement = screen.getByText(/Discover unparalleled business prospects with our Open Tender Auction platform./i);
    expect(descriptionElement).toBeInTheDocument();
  });

  test('renders the Get Started link', () => {
    render(<HomeSection />);
    const linkElement = screen.getByRole('link', { name: /Get started/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://github.com/creativetimofficial/notus-nextjs?ref=nnjs-index');
  });

  test('renders the image with the correct alt text', () => {
    render(<HomeSection />);
    const imgElement = screen.getByAltText('...');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', '/img/pattern_nextjs.png');
  });
});
