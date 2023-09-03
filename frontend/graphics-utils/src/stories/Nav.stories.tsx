import type { Meta, StoryObj } from '@storybook/react';

import { Nav } from '../shared/ui/navbar/nav';

const meta: Meta = {
  title: 'UI/Navigation',
  component: Nav,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const NotAuthenticated: Story = {
  args: {
    isLoading: false,
    isLoggedIn: false,
  },
};

export const Authenticated: Story = {
  args: {
    isLoading: false,
    isLoggedIn: true,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    isLoggedIn: true,
  },
};
