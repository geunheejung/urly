import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {Input, InputType} from './Input';

export default {
  title: 'Molecule/Input',
  component: Input,
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  primary: true,
  defaultValue: '',
  placeholder: '글자를 입력해주세요.',
}

export const Validated = Template.bind({});
Validated.args = {
  ...Default.args,
  inputType: InputType.Id,
}