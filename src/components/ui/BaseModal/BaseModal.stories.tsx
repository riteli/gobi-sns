import { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import BaseModal from './BaseModal';
import AppButton from '../AppButton/AppButton';

const meta = {
  title: 'UI/BaseModal',
  component: BaseModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: false },
    onClose: { control: false },
    children: { control: 'text' },
  },
  args: {
    children: 'これはモーダルの本文です。',
  },
} satisfies Meta<typeof BaseModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClose: () => {},
    children: 'これはモーダルの本文です。',
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <AppButton
          onClick={() => {
            setIsOpen(true);
          }}
        >
          モーダルを開く
        </AppButton>

        <BaseModal
          {...args}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        >
          <p>{args.children}</p>
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <AppButton
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              閉じる
            </AppButton>
          </div>
        </BaseModal>
      </>
    );
  },
};
