import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hello from '../../components/Hello/Hello';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: 'Hello, world!' }),
  })
);

describe('Hello Component', () => {
  it('fetches and displays the message', async () => {
    render(<Hello />);

    // Wait for the message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    });

    // Check that fetch was called
    expect(global.fetch).toHaveBeenCalledWith('/api/hello');
  });
});
