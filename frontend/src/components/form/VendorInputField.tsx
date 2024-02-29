import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import styles from "../../styles/Forms.module.css";
import { useState, useEffect, useRef } from "react";
import * as ProductsApi from "../../network/products_api";
import { IconButton } from "@mui/material";
import { IconSettings, IconPlus } from "@tabler/icons-react";
import modalStyles from "../../styles/Modal.module.css";
import { ProductVendor as ProductVendorModel } from "../../models/productVendor";

interface VendorInputFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  [x: string]: any;
}

const VendorInputField = ({
  name,
  label,
  register,
  registerOptions,
  error,
  ...props
}: VendorInputFieldProps) => {
  const [vendors, setVendors] = useState<ProductVendorModel[]>([]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const valueSubmittedRef = useRef(false);
  const [newOption, setNewOption] = useState<string>("");
  const [addOptionDialog, setAddOptionDialog] = useState(false);
  const [editOptionDialog, setEditOptionDialog] = useState(false);

  const [vendorsLoaded, setVendorsLoaded] = useState(false);

  useEffect(() => {
    async function loadVendors() {
      try {
        const productVendors = await ProductsApi.fetchProductVendors();
        setVendors(productVendors);
        setVendorsLoaded(true);
      } catch (error) {
        console.error(error);
      }
    }
    loadVendors();
  }, []);

  async function handleEditVendor(
    vendorInput: string,
    idInput: string
  ) {
    try {
      await ProductsApi.updateProductVendor(vendorInput, idInput);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  // Separate the keydown logic
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      valueSubmittedRef.current = true;
      (e.currentTarget as HTMLInputElement).blur();
    } else if (e.key === "Escape") {
      (e.currentTarget as HTMLInputElement).blur();
    }
  };

  // Handle save of data in the onBlur event
  const handleSave = (index: number) => {
    if (newOption !== "") {
      const updatedVendors = [...vendors];
      updatedVendors[index].vendor = newOption;
      setVendors(updatedVendors);
      handleEditVendor(newOption, updatedVendors[index]._id);
      setEditingIndex(null);
    } else {
      revertSave(index);
    }
    valueSubmittedRef.current = false;
  };

  // Handle revert of data in the onBlur event when input is escaped or clicked out of
  const revertSave = (index: number) => {
    const updatedVendors = [...vendors];
    setNewOption(updatedVendors[index].vendor);
    setVendors(updatedVendors);
    setEditingIndex(null);
  };

  async function handleAddVendor(input: string) {
    try {
      let productVendorResponse: ProductVendorModel;

      productVendorResponse = await ProductsApi.createProductVendor(input);
      setVendors([...vendors, productVendorResponse]);
      setAddOptionDialog(false);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <div>
      <Form.Group controlId={name + "-input"}>
        <Form.Label className={styles.formLabel}>{label}</Form.Label>
        <InputGroup size="sm">
          {vendorsLoaded ? (
            <Form.Select
              size="sm"
              {...props}
              {...register(name, registerOptions)}
              isInvalid={!!error}
            >
              {/* <option></option> */}
              {vendors?.map((vendor, index) => (
                <option key={index}>{vendor.vendor}</option>
              ))}
            </Form.Select>
          ) : (
            <Form.Select size="sm"></Form.Select>
          )}
          <Form.Control.Feedback type="invalid">
            {error?.message}
          </Form.Control.Feedback>
          <IconButton
            onClick={() => {
              setNewOption("");
              setAddOptionDialog(true);
            }}
            className={styles.formButton}
          >
            <IconPlus />
          </IconButton>
          <IconButton
            onClick={() => setEditOptionDialog(true)}
            className={styles.formButton}
          >
            <IconSettings />
          </IconButton>
        </InputGroup>
      </Form.Group>

      {addOptionDialog && (
        <Modal
          show
          onHide={() => {
            setNewOption("");
            setAddOptionDialog(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add {label}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Control
                value={newOption}
                onChange={(e) =>
                  setNewOption(e.target.value)
                }
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setNewOption("");
                setAddOptionDialog(false);
              }}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleAddVendor(newOption!);
                setNewOption("");
              }}
            >
              Add Vendor
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {editOptionDialog && (
        <Modal
          show
          onHide={() => setEditOptionDialog(false)}
          dialogClassName={modalStyles.dropDownEditModalWidth}
          centered={true}
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit {label}</Modal.Title>
          </Modal.Header>
          <Modal.Body className={modalStyles.dropDownEditModalBody}>
            <Col>
              {vendors.map(
                (vendorModel: ProductVendorModel, index: number) => {
                  return (
                    <Row key={index} className={modalStyles.editVendorRow}>
                      {editingIndex === index ? (
                        <input
                          className={modalStyles.editVendorRowText}
                          value={newOption}
                          onChange={(e) =>
                            setNewOption(e.target.value)
                          }
                          onBlur={() => {
                            valueSubmittedRef.current === true
                              ? handleSave(index)
                              : revertSave(index);
                          }}
                          // onBlur={() => revertSave(index)}
                          autoFocus
                          onKeyDown={handleKeyDown}
                        />
                      ) : (
                        <p className={modalStyles.editVendorRowText}>
                          {vendorModel.vendor}
                        </p>
                      )}

                      <Button
                        disabled={editingIndex !== null}
                        className={modalStyles.editVendorRowButton}
                        onClick={() => {
                          setEditingIndex(index);
                          setNewOption(vendorModel.vendor);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        className={modalStyles.editVendorRowButton}
                        onClick={() => deleteProductVendor(vendorModel)}
                      >
                        Delete
                      </Button>
                    </Row>
                  );
                }
              )}
            </Col>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
  async function deleteProductVendor(productVendor: ProductVendorModel) {
    try {
      await ProductsApi.deleteProductVendor(productVendor._id);
      setVendors(
        vendors.filter(
          (existingVendor) => existingVendor._id !== productVendor._id
        )
      );
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }
};

export default VendorInputField;
