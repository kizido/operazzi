import { useState } from "react";
import { Col, Form, InputGroup } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import styles from '../../styles/Forms.module.css';
import { Input } from "@mui/material";


interface DimensionsInputFieldProps {
    name: string,
    label: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    [x: string]: any,
}

const DimensionsInputField = ({ name, label, register, registerOptions, error, ...props }: DimensionsInputFieldProps) => {

    return (
        <Form.Group className={`mb-3`} controlId={name + "-input"}>
            <Form.Label>{label}</Form.Label>
            <InputGroup>
                <Form.Control className={styles.dimensionInput}
                    {...props}
                    {...register(name, registerOptions)}
                    isInvalid={!!error}
                />
                <InputGroup.Text>in.</InputGroup.Text>
                <Form.Control.Feedback type="invalid">
                    {error?.message}
                </Form.Control.Feedback>
            </InputGroup>
        </Form.Group>
    );
}

export default DimensionsInputField;