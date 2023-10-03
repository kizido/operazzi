import { Form } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";


interface DropdownInputFieldProps {
    name: string,
    label: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    options: { value: string, label: string }[]
    [x: string]: any,
}

const DropdownInputField = ({ name, label, register, registerOptions, error, options, ...props }: DropdownInputFieldProps) => {
    return (
        <Form.Group className='mb-3' controlId={name + "-input"}>
            <Form.Label>{label}</Form.Label>
            <Form.Select
                {...props}
                {...register(name, registerOptions)}
                isInvalid={!!error}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
                {error?.message}
            </Form.Control.Feedback>
        </Form.Group>
    );
}

export default DropdownInputField;