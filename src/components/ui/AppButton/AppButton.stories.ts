import { Meta, StoryObj } from '@storybook/nextjs';

import AppButton from './AppButton';

const meta = {
  title: 'UI/AppButton',
  component: AppButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    variant: { control: 'radio', options: ['primary', 'secondary', 'danger', 'accent'] },
    size: { control: 'radio', options: ['medium', 'small'] },
    href: { control: 'text' },
    onClick: { action: 'clicked', description: 'hrefがない場合のみ有効' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Default Button Text',
    size: 'medium',
    variant: 'primary',
    disabled: false,
  },
} satisfies Meta<typeof AppButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AsButton: Story = {
  name: 'As <button> (default)',
  args: {
    children: 'I am a Button',
    variant: 'primary',
  },
};

export const AsLink: Story = {
  name: 'As <Link> (hrefあり)',
  args: {
    children: 'I am a Link',
    variant: 'accent',
    href: '/',
    onClick: undefined,
  },
  argTypes: {
    onClick: { table: { disable: true } },
    disabled: { table: { disable: true } },
  },
};

export const DisabledButton: Story = {
  name: 'As <button> (disabled)',
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};
