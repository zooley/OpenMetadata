/*
 *  Copyright 2022 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import {
  findByTestId,
  findByText,
  render,
  screen,
} from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useAuthContext } from '../../components/Auth/AuthProviders/AuthProvider';
import SignInPage from './SignInPage';

const mockUseAuthContext = useAuthContext as jest.Mock;

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
}));

jest.mock('../../components/Auth/AuthProviders/AuthProvider', () => ({
  useAuthContext: jest.fn(),
}));
jest.mock(
  '../../components/ApplicationConfigProvider/ApplicationConfigProvider',
  () => ({
    useApplicationConfigContext: jest.fn().mockImplementation(() => ({
      customLogoUrlPath: 'https://customlink.source',

      customMonogramUrlPath: 'https://customlink.source',
    })),
  })
);

jest.mock('../../assets/img/login-bg.png', () => 'login-bg.png');

jest.mock('./LoginCarousel', () =>
  jest.fn().mockReturnValue(<p>LoginCarousel</p>)
);

describe('Test SignInPage Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('Component should render', async () => {
    mockUseAuthContext.mockReturnValue({
      isAuthDisabled: false,
      authConfig: { provider: 'google' },
      onLoginHandler: jest.fn(),
      onLogoutHandler: jest.fn(),
    });
    const { container } = render(<SignInPage />, {
      wrapper: MemoryRouter,
    });
    const signInPage = await findByTestId(container, 'signin-page');
    const bgImg = await findByTestId(container, 'bg-image');
    const LoginCarousel = await findByText(container, /LoginCarousel/i);

    expect(signInPage).toBeInTheDocument();
    expect(bgImg).toBeInTheDocument();
    expect(LoginCarousel).toBeInTheDocument();
  });

  it.each([
    ['google', 'Sign in with google'],
    ['okta', 'Sign in with okta'],
    ['auth0', 'Sign in with auth0'],
    ['azure', 'Sign in with azure'],
    ['custom-oidc', 'Sign in with sso'],
    ['aws-cognito', 'Sign in with aws cognito'],
    ['unknown-provider', 'SSO Provider unknown-provider is not supported'],
  ])('Sign in button should render correctly for %s', async (provider) => {
    mockUseAuthContext.mockReturnValue({
      isAuthDisabled: false,
      authConfig: { provider },
      onLoginHandler: jest.fn(),
      onLogoutHandler: jest.fn(),
    });
    const { container } = render(<SignInPage />, {
      wrapper: MemoryRouter,
    });
    const isUnknow = provider === 'unknown-provider';

    const signinButton = await findByText(
      container,
      isUnknow
        ? /message.sso-provider-not-supported/i
        : /label.sign-in-with-sso/i
    );

    expect(signinButton).toBeInTheDocument();
  });

  it('Sign in button should render correctly with custom provider name', async () => {
    mockUseAuthContext.mockReturnValue({
      isAuthDisabled: false,
      authConfig: { provider: 'custom-oidc', providerName: 'Custom OIDC' },
      onLoginHandler: jest.fn(),
      onLogoutHandler: jest.fn(),
    });
    const { container } = render(<SignInPage />, {
      wrapper: MemoryRouter,
    });
    const signinButton = await findByText(container, /label.sign-in-with-sso/i);

    expect(signinButton).toBeInTheDocument();
  });

  it('Page should render the correct logo image', async () => {
    mockUseAuthContext.mockReturnValue({
      isAuthDisabled: false,
      authConfig: { provider: 'custom-oidc', providerName: 'Custom OIDC' },
      onLoginHandler: jest.fn(),
      onLogoutHandler: jest.fn(),
    });
    render(<SignInPage />, {
      wrapper: MemoryRouter,
    });

    const brandLogoImage = await screen.findByTestId('brand-logo-image');

    expect(brandLogoImage).toBeInTheDocument();

    expect(brandLogoImage).toHaveAttribute('src', 'https://customlink.source');
  });
});
