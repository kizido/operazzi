import React from "react";
import { Form, InputGroup, Col } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import styles from "../../styles/Forms.module.css";

interface MasterCaseDimensionsInputFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
}

const MasterCaseDimensionsInputField: React.FC<
  MasterCaseDimensionsInputFieldProps
> = ({ name, label, register, registerOptions, error }) => {
  return (
    <Form.Group controlId={`${name}-master-case-dimensions-input`}>
      <Form.Label className={styles.formLabel}>{label}</Form.Label>
      <InputGroup size="sm">
        <InputGroup.Text>L</InputGroup.Text>
        <Form.Control
          size="sm"
          type="number"
          placeholder="Length"
          step={0.1}
          {...register(`${name}.masterCaseLength`, { ...registerOptions })}
          isInvalid={!!error}
        />
        <InputGroup.Text>W</InputGroup.Text>
        <Form.Control
          size="sm"
          type="number"
          placeholder="Width"
          step={0.1}
          {...register(`${name}.masterCaseWidth`, { ...registerOptions })}
          isInvalid={!!error}
        />
        <InputGroup.Text>H</InputGroup.Text>
        <Form.Control
          size="sm"
          type="number"
          placeholder="Height"
          step={0.1}
          {...register(`${name}.masterCaseHeight`, { ...registerOptions })}
          isInvalid={!!error}
        />
        <InputGroup.Text>units</InputGroup.Text>
        <Form.Control
          size="sm"
          type="number"
          placeholder="# Units"
          {...register(`${name}.masterCaseQuantity`, { ...registerOptions })}
          isInvalid={!!error}
        />
      </InputGroup>
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default MasterCaseDimensionsInputField;
