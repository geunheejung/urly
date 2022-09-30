import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Field } from './Field';
import { Password } from '../Input/Input.stories';

export default {
  title: 'Molecule/Field',
  component: Field,
} as ComponentMeta<typeof Field>

const Template: ComponentStory<typeof Field> = args => <Field {...args} />

export const Default = Template.bind({});
Default.args = {
  label: '아이디',
  isRequired: true,
  button: '중복확인',

};

export const PasswordField = Template.bind({});
PasswordField.args = {
  ...Default.args,
  label: '비밀번호',
  button: '',
  inputProps: Password.args,
}