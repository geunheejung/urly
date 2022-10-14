import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Check } from './Check';

export default {
  title: 'Molecule/Check',
  component: Check,
} as ComponentMeta<typeof Check>

const Template: ComponentStory<typeof Check> = (args) => <Check {...args} />

export const Primary = Template.bind({});
Primary.args = {
  text: '남자',
  htmlFor: 'gender-man',
  name: 'gender',
  value: 'MALE',
}