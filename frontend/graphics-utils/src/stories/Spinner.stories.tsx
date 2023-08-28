import type { Meta, StoryObj } from '@storybook/react';

import { Spinner } from '../shared/ui/spinner';

const meta: Meta = {
  title: 'UI/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Rotary: Story = {};
