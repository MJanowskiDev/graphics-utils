import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonProps } from '../app/components/Button';

const meta: Meta<ButtonProps> = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: { control: { type: 'radio', options: ['small', 'medium', 'large'] } },
    variant: { control: { type: 'radio', options: ['primary', 'secondary'] } },
    outline: { control: 'boolean' },
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
    variant: 'secondary',
  },
};

export const Large: Story = {
  args: {
    label: 'Large',
    size: 'large',
  },
};

export const Small: Story = {
  args: {
    label: 'Small',
    size: 'small',
  },
};

export const Outline: Story = {
  args: {
    label: 'Outline',
    outline: true,
  },
};
