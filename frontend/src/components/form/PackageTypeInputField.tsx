import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import styles from '../../styles/Forms.module.css';
import { useState, useEffect, useRef } from "react";
import { ProductPackageType as ProductPackageTypeModel } from "../../models/productPackageType";
import { ProductPackageTypeInput } from "../../network/products_api";
import * as ProductsApi from "../../network/products_api";
import modalStyles from '../../styles/Modal.module.css';
import { IconButton } from "@mui/material";
import { IconPlus, IconSettings } from "@tabler/icons-react";


interface PackageTypeInputFieldProps {
    name: string,
    label: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    [x: string]: any,
}

const PackageTypeInputField = ({ name, label, register, registerOptions, error, ...props }: PackageTypeInputFieldProps) => {

    const [packageTypes, setPackageTypes] = useState<ProductPackageTypeModel[]>([]);
    const [packageType, setPackageType] = useState<ProductPackageTypeInput>({
        packageName: '',
        packageLength: 0,
        packageWidth: 0,
        packageHeight: 0,
        packageWeight: 0,
    });

    const [addOptionDialog, setAddOptionDialog] = useState(false);
    const [editOptionDialog, setEditOptionDialog] = useState(false);

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


    async function handleAddPackageType() {
        try {
            let productPackageTypeResponse: ProductPackageTypeModel;

            productPackageTypeResponse = await ProductsApi.createProductPackageType(packageType);
            setPackageTypes([...packageTypes, productPackageTypeResponse]);
            setPackageType({ // Reset the form state
                packageName: '',
                packageLength: 0,
                packageWidth: 0,
                packageHeight: 0,
                packageWeight: 0,
            });
            setAddOptionDialog(false);
        } catch (error) {
            console.error('Error adding package type:', error);
        }
    }

    async function handleEditPackageType(packageTypeInput: ProductPackageTypeInput, idInput: string) {
        try {
            await ProductsApi.updateProductPackageType(packageTypeInput, idInput);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPackageType((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // // Separate the keydown logic
    // const handleKeyDown = (e: React.KeyboardEvent) => {
    //     if (e.key === 'Enter') {
    //         valueSubmittedRef.current = true;
    //         (e.currentTarget as HTMLInputElement).blur();
    //     }
    //     else if (e.key === 'Escape') {
    //         (e.currentTarget as HTMLInputElement).blur();
    //     }
    // };

    // Handle save of data in the onBlur event
    // const handleSave = (index: number) => {
    //     if (newOption.packageType !== '') {
    //         const updatedPackageTypes = [...packageTypes]
    //         updatedPackageTypes[index].packageType = newOption.packageType
    //         setPackageTypes(updatedPackageTypes)
    //         handleEditPackageType(newOption, updatedPackageTypes[index]._id)
    //         setEditingIndex(null)
    //     } else {
    //         revertSave(index);
    //     }
    //     valueSubmittedRef.current = false;
    // };

    // Handle revert of data in the onBlur event when input is escaped or clicked out of
    // const revertSave = (index: number) => {
    //     const updatedPackageTypes = [...packageTypes];
    //     setNewOption({ packageType: updatedPackageTypes[index].packageType })
    //     setPackageTypes(updatedPackageTypes);
    //     setEditingIndex(null);
    // };

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
                                {packageType.packageName}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {error?.message}
                    </Form.Control.Feedback>
                    <IconButton onClick={() => setAddOptionDialog(true)} className={styles.formButton}><IconPlus /></IconButton>
                    <IconButton onClick={() => setEditOptionDialog(true)} className={styles.formButton}><IconSettings /></IconButton>
                </InputGroup>
            </Form.Group>

            {addOptionDialog &&
                <Modal show onHide={() => setAddOptionDialog(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add {label}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Label>Package Name</Form.Label>
                            <Form.Control
                                name="packageName"
                                type="text"
                                value={packageType.packageName}
                                onChange={handleInputChange}
                            />
                            <Form.Label>Package Length (in.)</Form.Label>
                            <Form.Control
                                name="packageLength"
                                type="number"
                                step={0.1}
                                value={packageType.packageLength}
                                onChange={handleInputChange}
                            />
                            <Form.Label>Package Width (in.)</Form.Label>
                            <Form.Control
                                name="packageWidth"
                                type="number"
                                step={0.1}
                                value={packageType.packageWidth}
                                onChange={handleInputChange}
                            />
                            <Form.Label>Package Height (in.)</Form.Label>
                            <Form.Control
                                name="packageHeight"
                                type="number"
                                step={0.1}
                                value={packageType.packageHeight}
                                onChange={handleInputChange}
                            />
                            <Form.Label>Package Weight (lbs.)</Form.Label>
                            <Form.Control
                                name="packageWeight"
                                type="number"
                                step={0.1}
                                value={packageType.packageWeight}
                                onChange={handleInputChange}
                            />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setAddOptionDialog(false); setPackageType({ // Reset the form state
                                packageName: '',
                                packageLength: 0,
                                packageWidth: 0,
                                packageHeight: 0,
                                packageWeight: 0,
                            })
                        }}>Close</Button>
                        <Button variant="primary" onClick={() => handleAddPackageType}>Add Package Type</Button>
                    </Modal.Footer>
                </Modal>
            }
            {editOptionDialog &&
                <Modal
                    show onHide={() => setEditOptionDialog(false)}
                    dialogClassName={modalStyles.dropDownEditModalWidth}
                    centered={true}
                    keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {label}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={modalStyles.dropDownEditModalBody}>
                        <Col>
                            {packageTypes.map((packageTypeModel: ProductPackageTypeModel, index: number) => {
                                return (
                                    <Row key={index} className={modalStyles.editCategoryRow}>
                                        <p className={modalStyles.editCategoryRowText}>{packageTypeModel.packageName}</p>
                                        <Button
                                            className={modalStyles.editCategoryRowButton}
                                            onClick={() => setPackageType({
                                                packageName: packageTypeModel.packageName,
                                                packageLength: packageTypeModel.packageLength,
                                                packageWidth: packageTypeModel.packageWidth,
                                                packageHeight: packageTypeModel.packageHeight,
                                                packageWeight: packageTypeModel.packageWeight,
                                            })}>Edit</Button>
                                        <Button
                                            className={modalStyles.editCategoryRowButton}
                                            onClick={() => deleteProductPackageType(packageTypeModel)}>Delete</Button>
                                    </Row>
                                );
                            })}
                        </Col>
                    </Modal.Body>
                </Modal>
            }
        </div>
    );

    async function deleteProductPackageType(productPackageType: ProductPackageTypeModel) {
        try {
            await ProductsApi.deleteProductPackageType(productPackageType._id);
            setPackageTypes(packageTypes.filter(existingPackageType => existingPackageType._id !== productPackageType._id));
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }
}

export default PackageTypeInputField;