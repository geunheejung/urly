import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Field } from './Field';

export default {
  title: 'Molecule/Field',
  component: Field,
} as ComponentMeta<typeof Field>

const Template: ComponentStory<typeof Field> = args => <Field {...args} />

export const Default = Template.bind({});
Default.args = {
  field: {
    label: '아이디',
    isRequired: true,
    placeholder: '아이디를 입력해주세요',
    button: '중복확인'
  }
};