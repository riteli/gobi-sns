import { Meta, StoryObj } from '@storybook/nextjs';

import { UserAvatar } from './UserAvatar';

const meta = {
  title: 'UI/UserAvatar',
  component: UserAvatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    avatarUrl: { control: 'text' },
    size: { control: 'number' },
  },
} satisfies Meta<typeof UserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    avatarUrl: null,
    size: 100,
  },
};

export const HasAvatar: Story = {
  args: {
    avatarUrl: 'https://picsum.photos/200/300',
    size: 100,
  },
};
