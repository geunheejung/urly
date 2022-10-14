import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Address } from './Address';

export default {
  title: 'Molecule/Field/ShippingAddress',
  component: Address,
} as ComponentMeta<typeof Address>

const Template: ComponentStory<typeof Address> = (args) => <Address {...args} />

export const Default = Template.bind({});
Default.args = {}