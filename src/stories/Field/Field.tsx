import React from 'react';
import {Label} from "@/stories/Label/Label";
import {Input} from "@/stories/Input/Input";
import {Button} from "@/stories/Button/Button";
import {IField} from "@/stories/Field/Field.stories";
import './field.scss';

interface FieldProps {
  fieldList: Array<IField>
}

export const Field = ({
  fieldList
}: FieldProps) => {
  return (
    <div className="storybook-field-list">
      {fieldList.map((row, index) => {
        const {
          labelValue,
          isRequired,
          placeholder,
          buttonLabel
        } = row;
        return (
          <div key={index} className="storybook-field">
            hello
          </div>
        )
      })}

    </div>
  )
}

