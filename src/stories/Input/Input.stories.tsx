import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {Input, InputType, RULE} from './Input';

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

export const Id = Template.bind({});
Id.args = {
  ...Default.args,
  inputType: InputType.Id,
  // 한글 OR 영문
  rule: RULE.ID,
}

export const Password = Template.bind({});
Password.args = {
  ...Default.args,
  type: 'password',
  inputType: InputType.Pw,
  placeholder: '비밀번호를 입력해주세요',
}


