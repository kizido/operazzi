import React from "react";
import { Form, InputGroup, Col } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import styles from '../../styles/Forms.module.css';

interface MasterCaseDimensionsInputFieldProps {
    name: string;
    label: string;
    register: UseFormRegister<any>;
    registerOptions?: RegisterOptions;
    error?: FieldError;
}

const MasterCaseDimensionsInputField: React.FC<MasterCaseDimensionsInputFieldProps> = ({ name, label, register, registerOptions, error }) => {
    return (
        <Form.Group controlId={`${name}-dimensions-input`}>
            <Form.Label className={styles.formLabel}>{label}</Form.Label>
            <InputGroup size="sm">
                <Form.Control
                    placeholder="Length"
                    size="sm"
                    type="number"
                    step={0.1}
                    {...register(`${name}.productLength`, { ...registerOptions })}
                    isInvalid={!!error}
                />
                <InputGroup.Text>in.</InputGroup.Text>
                <Form.Control
                    size="sm"
                    type="number"
                    placeholder="Width"
                    step={0.1}
                    {...register(`${name}.productWidth`, { ...registerOptions })}
                    isInvalid={!!error}
                />
                <InputGroup.Text>in.</InputGroup.Text>
                <Form.Control
                    size="sm"
                    type="number"
                    placeholder="Height"
                    step={0.1}
                    {...register(`${name}.productHeight`, { ...registerOptions })}
                    isInvalid={!!error}
                />
                <InputGroup.Text>in.</InputGroup.Text>
                <Form.Control
                    size="sm"
                    type="number"
                    placeholder="Diameter"
                    step={0.1}
                    {...register(`${name}.productDiameter`, { ...registerOptions })}
                    isInvalid={!!error}
                />
                <InputGroup.Text>mm.</InputGroup.Text>
            </InputGroup>
            <Form.Control.Feedback type="invalid">
                {error?.message}
            </Form.Control.Feedback>
        </Form.Group>
    );
}

export default MasterCaseDimensionsInputField;
