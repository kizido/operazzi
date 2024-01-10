import { Form } from "react-bootstrap";
import styles from '../../styles/Forms.module.css';


interface TextDisplayFieldProps {
    name: string,
    label: string,
    [x: string]: any,
    value: string,
}

const TextDisplayField = ({ name, label, value, ...props }: TextDisplayFieldProps) => {
    return (
        <Form.Group controlId={name + "-input"}>
            <Form.Label className={styles.formLabel}>{label}</Form.Label>
            <Form.Control
                size="sm"
                step={0.1}
                {...props}
                readOnly
                value={value}
            />
        </Form.Group>
    );
}

export default TextDisplayField;