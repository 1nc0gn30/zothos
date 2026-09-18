import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

// Mock window.scrollTo
window.scrollTo = jest.fn();

test('renders IT and Cybersecurity Services For Your Business text', () => {
  render(<App />);
  const mainText = screen.getByText(/IT and Cybersecurity Services For Your Business/i);
  expect(mainText).toBeInTheDocument();
});

test('renders Explore Our Services button', () => {
  render(<App />);
  const buttonElement = screen.getByRole('link', { name: /Explore Our Services/i });
  expect(buttonElement).toBeInTheDocument();
});
