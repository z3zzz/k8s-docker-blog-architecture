import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Header from './header';

describe('Header Component', () => {
  it('should render header', async () => {
    const user = userEvent.setup();
    render(<Header color="red" />);

    const basicElement = await screen.findByText('header');
    await user.click(basicElement);

    expect(basicElement).toBeInTheDocument();
  });
});
