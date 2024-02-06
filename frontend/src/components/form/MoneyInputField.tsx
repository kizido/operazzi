import { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import {
  Control,
  Controller,
  FieldError,
  RegisterOptions,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import styles from "../../styles/Forms.module.css";

interface MoneyInputFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
  [x: string]: any;
}

const MoneyInputField: React.FC<MoneyInputFieldProps> = ({
  name,
  label,
  register,
  registerOptions,
  error,
  setValue,
  control,
  ...props
}: MoneyInputFieldProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Checks if the input is all digits
    if (/^\d*(\.\d{0,2})?$/.test(value)) {
      // Set the control's value to value
      setValue(name, value);
    }
  };
  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // If there's no decimal or not exactly two digits after the decimal, format it
    if (!/\.\d{2}$/.test(value)) {
      const [whole = "", fractional = ""] = value.split(".");
      const paddedFractional = fractional.padEnd(2, "0");
      value = `${whole}.${paddedFractional}`;
    }

    // If the value starts with a decimal, add a '0' before it
    if (/^\./.test(value)) {
      value = `0${value}`;
    }

    // Set the control's value to value
    setValue(name, value);
  };

  return (
    <Form.Group controlId={name + "-input"}>
      <Form.Label className={styles.formLabel}>{label}</Form.Label>
      <InputGroup size="sm">
        <InputGroup.Text>$</InputGroup.Text>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Form.Control
              type="text"
              {...field}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
            />
          )}
        />
      </InputGroup>
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default MoneyInputField;
