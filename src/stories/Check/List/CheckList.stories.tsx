import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CheckList } from './CheckList';
import { man, woman, none } from '../Check.stories';

export default {
  title: 'Molecule/CheckList',
  component: CheckList,
} as ComponentMeta<typeof CheckList>;

const Template: ComponentStory<typeof CheckList> = (args) => <CheckList {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  checkList: [man, woman, none],
};
