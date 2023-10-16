import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import styles from '../../styles/Forms.module.css';
import { useState, useEffect } from "react";
import { ProductBrand } from "../../models/productBrand";
import { ProductBrandInput  } from "../../network/products_api";
import * as ProductsApi from "../../network/products_api";


interface BrandInputFieldProps {
    name: string,
    label: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    [x: string]: any,
}

const BrandInputField = ({ name, label, register, registerOptions, error, ...props }: BrandInputFieldProps) => {

    const [brands, setBrands] = useState<ProductBrand[]>([]);
    // const [brands, setBrands] = useState([]);
    // const [packageType, setPackageTypes] = useState([]);

    const [newOption, setNewOption] = useState<ProductBrandInput>();
    const [addOptionDialog, setAddOptionDialog] = useState(false);

    useEffect(() => {
        async function loadBrands() {
            try {
                const productBrands = await ProductsApi.fetchProductBrands();
                setBrands(productBrands);
            } catch (error) {
                console.error(error);
            }
        }
        loadBrands();
    }, []);


    async function handleAddBrand(input: ProductBrandInput) {
        try {
            let productBrandResponse: ProductBrand;
            
            productBrandResponse = await ProductsApi.createProductBrand(input);
            setBrands([...brands, productBrandResponse]);
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
                <InputGroup>
                    <Form.Select size="sm"
                        {...props}
                        {...register(name, registerOptions)}
                        isInvalid={!!error}
                    >
                        {brands?.map((brand, index) => (
                            <option key={index}>
                                {brand.brand}
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
                <Modal show onHide={() => {setAddOptionDialog(false); setNewOption({brand: ''})}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add {label}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Control
                                value={newOption?.brand}
                                onChange={(e) => setNewOption({
                                    brand: e.target.value,
                                })}
                            />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {setAddOptionDialog(false); setNewOption({brand: ''})}}>Close</Button>
                        <Button variant="primary" onClick={() => {handleAddBrand(newOption!); setNewOption({brand: ''})}}>Add Brand</Button>
                    </Modal.Footer>
                </Modal>
            }
        </div>
    );
}

export default BrandInputField;