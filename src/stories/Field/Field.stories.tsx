import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Field } from './Field';
import { Id, Password } from '../Input/Input.stories';
import {RULE} from "../../common";


export const mockData = {
  idList: ['aaa'],
  emailList: ['bbb'],
}

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
  modalContent: (value: string) => {
    if (!value.match(RULE.ID)) return '6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합';
    if (mockData.idList.find((id) => id === value)) return '이미 존재하는 아이디';

    return '사용 가능';
  },
  inputProps: Id.args
};

export const PasswordField = Template.bind({});
PasswordField.args = {
  ...Default.args,
  label: '비밀번호',
  button: '',
  inputProps: Password.args,
}