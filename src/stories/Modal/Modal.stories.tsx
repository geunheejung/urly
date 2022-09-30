import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Modal } from './Modal';

export default {
  title: 'Molecule/Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>

const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  value: "아이디를 입력해주세요.",
  isOpen: true
}