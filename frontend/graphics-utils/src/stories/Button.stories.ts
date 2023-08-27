import type { Meta, StoryObj } from '@storybook/react';

import { Button, ButtonProps, Variant, Size } from '../shared/ui/button';

const meta: Meta<ButtonProps> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: { control: { type: 'radio', options: Object.values(Size) } },
    variant: { control: { type: 'radio', options: Object.values(Variant) } },
    outlined: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary',
    variant: Variant.secondary,
  },
};

export const Large: Story = {
  args: {
    label: 'Large',
    size: Size.large,
  },
};

export const Small: Story = {
  args: {
    label: 'Small',
    size: Size.small,
  },
};

export const Outline: Story = {
  args: {
    label: 'Outline',
    outlined: true,
  },
};
