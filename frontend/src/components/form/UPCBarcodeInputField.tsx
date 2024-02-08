import { IconButton } from "@mui/material";
import { Form, InputGroup } from "react-bootstrap";
import styles from "../../styles/Forms.module.css";
import modalStyles from "../../styles/Modal.module.css";
import {
  Control,
  Controller,
  FieldError,
  RegisterOptions,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { IconBarcode } from "@tabler/icons-react";

interface UPCBarcodeInputFieldProps {
  name: string;
  label: string;
  error?: FieldError;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
  [x: string]: any;
}

export default function UPCBarcodeInputField({
  name,
  label,
  setValue,
  control,
  error,
  ...props
}: UPCBarcodeInputFieldProps) {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,12}$/.test(value)) {
      // Set the control's value to value
      setValue(name, value);
    }
  };

  return (
    <div>
      <Form.Group>
        <Form.Label className={styles.formLabel}>{label}</Form.Label>
        <InputGroup size="sm">
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Form.Control
                type="text"
                {...field}
                onChange={handleOnChange}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {error?.message}
          </Form.Control.Feedback>
          <IconButton className={styles.formButton}>
            <IconBarcode />
          </IconButton>
        </InputGroup>
      </Form.Group>
    </div>
  );
}
