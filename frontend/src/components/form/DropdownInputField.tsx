import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import styles from '../../styles/Forms.module.css';
import { useState } from "react";
import TextInputField from "./TextInputField";


interface DropdownInputFieldProps {
    name: string,
    label: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    // options: { value: string, label: string }[]
    [x: string]: any,
}

const DropdownInputField = ({ name, label, register, registerOptions, error, ...props }: DropdownInputFieldProps) => {

    const [options, setOptions] = useState<string[]>([]);
    const [addOptionDialog, setAddOptionDialog] = useState(false);
    const [newOption, setNewOption] = useState('');  // To hold the value of the new option

    const handleAddOption = () => {
        setOptions([...options, newOption]);  // Add the new option to the existing options
        setNewOption('');  // Clear the new option input field
        setAddOptionDialog(false);  // Close the modal
    };

    return (
        <div>
            <Form.Group controlId={name + "-input"}>
                <Form.Label className={styles.formLabel}>{label}</Form.Label>
                <InputGroup>
                    <Form.Select size="sm"
                        {...props}
                        {...register(name, registerOptions)}
                        isInvalid={!!error}
                    >
                        {options.map((option, index) => (
                            <option key={index}>
                                {option}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {error?.message}
                    </Form.Control.Feedback>
                    <Button onClick={() => setAddOptionDialog(true)}>+</Button>
                </InputGroup>
            </Form.Group>

            {addOptionDialog &&
                <Modal show onHide={() => setAddOptionDialog(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add {label}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Control
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                            />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setAddOptionDialog(false)}>Close</Button>
                        <Button variant="primary" onClick={handleAddOption}>Add Option</Button>
                    </Modal.Footer>
                </Modal>
            }
        </div>
    );
}

export default DropdownInputField;