import type { Meta, StoryObj } from '@storybook/react';
import { AiOutlineDownload } from 'react-icons/ai';

import { Button, ButtonProps, VARIANT_OPTIONS, SIZE_OPTIONS } from '../shared/ui/button';

const meta: Meta<ButtonProps> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: { control: { type: 'radio', options: SIZE_OPTIONS } },
    variant: { control: { type: 'radio', options: VARIANT_OPTIONS } },
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
    outlined: true,
  },
};

export const Loading: Story = {
  args: {
    label: 'Loading',
    loading: true,
  },
};

export const StartIcon: Story = {
  args: {
    label: 'Download',
    startIcon: <AiOutlineDownload />,
  },
};

export const Tertiary: Story = {
  args: {
    label: 'Download',
    variant: 'tertiary',
    startIcon: <AiOutlineDownload />,
  },
};
