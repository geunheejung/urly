import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Field } from './Field';

export default {
  title: 'Molecule/Field',
  component: Field,
  decorators: [
    (Story)   => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Field>

export interface IField {
  labelValue: string;
  isRequired: boolean;
  placeholder: string;
  buttonLabel?: string;
}

const fieldList: Array<IField> = [
  {
    labelValue: '아이디',
    isRequired: true,
    placeholder: '아이디를 입력해주세요',
    buttonLabel: '중복확인',
  },
  {
    labelValue: '비밀번호',
    isRequired: true,
    placeholder: '비밀번호를 입력해주세요',
  },
]

const Template: ComponentStory<typeof Field> = args => <Field {...args} />

export const Primary = Template.bind({});
Primary.args = {
  fieldList
};
