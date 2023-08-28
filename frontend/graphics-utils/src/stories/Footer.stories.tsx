import type { Meta, StoryObj } from '@storybook/react';

import { Footer } from '../shared/ui/footer';

const meta: Meta = {
  title: 'UI/Footer',
  component: Footer,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultFooter: Story = {};
