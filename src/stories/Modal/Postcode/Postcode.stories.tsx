import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Postcode } from './Postcode';

export default {
  title: 'Molecule/Modal/Postcode',
  component: Postcode,
} as ComponentMeta<typeof Postcode>

const Template: ComponentStory<typeof Postcode> = (args) => <Postcode {...args} />

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
}