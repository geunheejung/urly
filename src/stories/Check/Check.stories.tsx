import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Check, ICheckProps, ToggleType } from './Check';

export default {
  title: 'Molecule/Check',
  component: Check,
} as ComponentMeta<typeof Check>;

const Template: ComponentStory<typeof Check> = (args) => <Check {...args} />;

const common = {
  isChecked: false,
};

export const Man = Template.bind({});
export const man: ICheckProps = {
  ...common,
  isChecked: true,
  text: '남자',
  id: 'gender-man',
  name: 'gender',
  value: 'MALE',
};
Man.args = man;
export const woman: ICheckProps = {
  ...common,
  text: '여자',
  id: 'gender-woman',
  name: 'gender',
  value: 'FEMALE',
};
export const Woman = Template.bind({});
Woman.args = woman;
export const none: ICheckProps = {
  ...common,
  text: '선택 안함',
  id: 'gender-none',
  name: 'gender',
  value: 'NONE',
};

export const None = Template.bind({});
None.args = none;
