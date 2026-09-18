import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Deseo Media Company branding or loading state', () => {
  render(<App />);
  const headingElement = screen.getByRole('status');
  expect(headingElement).toBeInTheDocument();
});
