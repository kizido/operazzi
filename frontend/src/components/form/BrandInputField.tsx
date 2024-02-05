import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import styles from "../../styles/Forms.module.css";
import { useState, useEffect, useRef } from "react";
import { ProductBrand as ProductBrandModel } from "../../models/productBrand";
import { ProductBrandInput } from "../../network/products_api";
import * as ProductsApi from "../../network/products_api";
import modalStyles from "../../styles/Modal.module.css";
import { IconSettings, IconPlus } from "@tabler/icons-react";
import { IconButton } from "@mui/material";

interface BrandInputFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  [x: string]: any;
}

const BrandInputField = ({
  name,
  label,
  register,
  registerOptions,
  error,
  ...props
}: BrandInputFieldProps) => {
  const [brands, setBrands] = useState<ProductBrandModel[]>([]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const valueSubmittedRef = useRef(false);
  const [newOption, setNewOption] = useState<ProductBrandInput>({ brand: "" });
  const [addOptionDialog, setAddOptionDialog] = useState(false);
  const [editOptionDialog, setEditOptionDialog] = useState(false);

  const [brandsLoaded, setBrandsLoaded] = useState(false);

  useEffect(() => {
    async function loadBrands() {
      try {
        const productBrands = await ProductsApi.fetchProductBrands();
        setBrands(productBrands);
        setBrandsLoaded(true);
      } catch (error) {
        console.error(error);
      }
    }
    loadBrands();
  }, []);

  async function handleAddBrand(input: ProductBrandInput) {
    try {
      let productBrandResponse: ProductBrandModel;

      productBrandResponse = await ProductsApi.createProductBrand(input);
      setBrands([...brands, productBrandResponse]);
      setAddOptionDialog(false);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function handleEditBrand(
    brandInput: ProductBrandInput,
    idInput: string
  ) {
    try {
      await ProductsApi.updateProductBrand(brandInput, idInput);
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
    if (newOption.brand !== "") {
      const updatedBrands = [...brands];
      updatedBrands[index].brand = newOption.brand;
      setBrands(updatedBrands);
      handleEditBrand(newOption, updatedBrands[index]._id);
      setEditingIndex(null);
    } else {
      revertSave(index);
    }
    valueSubmittedRef.current = false;
  };

  // Handle revert of data in the onBlur event when input is escaped or clicked out of
  const revertSave = (index: number) => {
    const updatedBrands = [...brands];
    setNewOption({ brand: updatedBrands[index].brand });
    setBrands(updatedBrands);
    setEditingIndex(null);
  };

  return (
    <div>
      <Form.Group controlId={name + "-input"}>
        <Form.Label className={styles.formLabel}>{label}</Form.Label>
        <InputGroup>
          {brandsLoaded ? (<Form.Select
            size="sm"
            {...props}
            {...register(name, registerOptions)}
            isInvalid={!!error}
          >
            {brands?.map((brand, index) => (
              <option key={index}>{brand.brand}</option>
            ))}
          </Form.Select>) : <Form.Select size="sm"></Form.Select>}
          <Form.Control.Feedback type="invalid">
            {error?.message}
          </Form.Control.Feedback>
          <IconButton
            onClick={() => setAddOptionDialog(true)}
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
            setAddOptionDialog(false);
            setNewOption({ brand: "" });
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add {label}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Control
                value={newOption?.brand}
                onChange={(e) =>
                  setNewOption({
                    brand: e.target.value,
                  })
                }
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setAddOptionDialog(false);
                setNewOption({ brand: "" });
              }}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleAddBrand(newOption!);
                setNewOption({ brand: "" });
              }}
            >
              Add Brand
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
              {brands.map((brandModel: ProductBrandModel, index: number) => {
                return (
                  <Row key={index} className={modalStyles.editCategoryRow}>
                    {editingIndex === index ? (
                      <input
                        className={modalStyles.editCategoryRowText}
                        value={newOption.brand}
                        onChange={(e) =>
                          setNewOption({ brand: e.target.value })
                        }
                        onBlur={() => {
                          valueSubmittedRef.current === true
                            ? handleSave(index)
                            : revertSave(index);
                        }}
                        autoFocus
                        onKeyDown={handleKeyDown}
                      />
                    ) : (
                      <p className={modalStyles.editCategoryRowText}>
                        {brandModel.brand}
                      </p>
                    )}
                    <Button
                      className={modalStyles.editCategoryRowButton}
                      onClick={() => {
                        setEditingIndex(index);
                        setNewOption({ brand: brandModel.brand });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      className={modalStyles.editCategoryRowButton}
                      onClick={() => deleteProductBrand(brandModel)}
                    >
                      Delete
                    </Button>
                  </Row>
                );
              })}
            </Col>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
  async function deleteProductBrand(productBrand: ProductBrandModel) {
    try {
      await ProductsApi.deleteProductBrand(productBrand._id);
      setBrands(
        brands.filter((existingBrand) => existingBrand._id !== productBrand._id)
      );
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }
};

export default BrandInputField;
