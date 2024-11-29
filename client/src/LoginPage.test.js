import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { signin } from '../features/authSlice';
import LoginPage from './pages/LoginPage';

const mockStore = configureStore([thunk]);

jest.mock('../features/authSlice', () => ({
  signin: jest.fn(),
}));

describe('LoginPage Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({ auth: { status: 'idle' } });
  });

  it('renders the login page title', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  it('renders email and password input fields', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
  });

  it('renders a login button', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('disables the login button when status is loading', () => {
    store = mockStore({ auth: { status: 'loading' } });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });

  it('displays a success notification on successful login', async () => {
    signin.mockImplementationOnce(() => async () => Promise.resolve());
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/login successful!/i)).toBeInTheDocument();
    });
  });

  it('displays an error notification on login failure', async () => {
    signin.mockImplementationOnce(() => async () => {
      throw new Error('Invalid credentials');
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('redirects to verify email page on email verification error', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    signin.mockImplementationOnce(() => async () => {
      throw new Error('Please verify your email first.');
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/verifyemail');
    });
  });

  it('clears the notification when the alert is dismissed', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/login successful!/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByText(/login successful!/i)).not.toBeInTheDocument();
  });

  it('renders links to "Forgot Password" and "Sign Up"', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/forgot password/i)).toHaveAttribute(
      'href',
      '/forget-password'
    );
    expect(screen.getByText(/sign up/i)).toHaveAttribute('href', '/signup');
  });

  it('does not allow form submission with empty fields', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/enter email/i)).toBeInTheDocument();
    });
  });
});
