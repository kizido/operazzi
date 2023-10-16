import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import styles from '../../styles/Forms.module.css';
import { useState, useEffect } from "react";
import { ProductPackageType } from "../../models/productPackageType";
import { ProductPackageTypeInput  } from "../../network/products_api";
import * as ProductsApi from "../../network/products_api";


interface PackageTypeInputFieldProps {
    name: string,
    label: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    [x: string]: any,
}

const PackageTypeInputField = ({ name, label, register, registerOptions, error, ...props }: PackageTypeInputFieldProps) => {

    const [packageTypes, setPackageTypes] = useState<ProductPackageType[]>([]);
    // const [brands, setBrands] = useState([]);
    // const [packageType, setPackageTypes] = useState([]);

    const [newOption, setNewOption] = useState<ProductPackageTypeInput>();
    const [addOptionDialog, setAddOptionDialog] = useState(false);

    useEffect(() => {
        async function loadPackageTypes() {
            try {
                const productPackageTypes = await ProductsApi.fetchProductPackageTypes();
                setPackageTypes(productPackageTypes);
            } catch (error) {
                console.error(error);
            }
        }
        loadPackageTypes();
    }, []);


    async function handleAddPackageType(input: ProductPackageTypeInput) {
        try {
            let productPackageTypeResponse: ProductPackageType;
            
            productPackageTypeResponse = await ProductsApi.createProductPackageType(input);
            setPackageTypes([...packageTypes, productPackageTypeResponse]);
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
                        {packageTypes?.map((packageType, index) => (
                            <option key={index}>
                                {packageType.packageType}
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
                <Modal show onHide={() => {setAddOptionDialog(false); setNewOption({packageType: ''})}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add {label}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Control
                                value={newOption?.packageType}
                                onChange={(e) => setNewOption({
                                    packageType: e.target.value,
                                })}
                            />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {setAddOptionDialog(false); setNewOption({packageType: ''})}}>Close</Button>
                        <Button variant="primary" onClick={() => {handleAddPackageType(newOption!); setNewOption({packageType: ''})}}>Add PackageType</Button>
                    </Modal.Footer>
                </Modal>
            }
        </div>
    );
}

export default PackageTypeInputField;