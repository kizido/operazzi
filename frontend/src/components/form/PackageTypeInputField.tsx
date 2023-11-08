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
        packageLength: null,
        packageWidth: null,
        packageHeight: null,
        packageWeight: null,
    });

    const [addOptionDialog, setAddOptionDialog] = useState(false);
    const [packageIdToEdit, setPackageIdToEdit] = useState<string | null>(null);
    const [editOptionMenuDialog, setEditOptionMenuDialog] = useState(false);

    const [errors, setErrors] = useState({
        packageName: false,
        packageLength: false,
        packageWidth: false,
        packageHeight: false,
        packageWeight: false,
    });

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

    const isFormValid = (): boolean => {
        // Create a new object to hold the updated error states
        const newErrors = {
            packageName: packageType.packageName.trim() === '',
            packageLength: packageType.packageLength === null || packageType.packageLength <= 0,
            packageWidth: packageType.packageWidth === null || packageType.packageWidth <= 0,
            packageHeight: packageType.packageHeight === null || packageType.packageHeight <= 0,
            packageWeight: packageType.packageWeight === null || packageType.packageWeight <= 0,
        };

        // Update the errors state with the new error states
        setErrors(newErrors);

        // Determine if the form is valid by checking if any of the error states are true
        return !Object.values(newErrors).some(Boolean);
    };

    async function handleAddPackageType() {
        if (isFormValid()) {
            try {
                let productPackageTypeResponse: ProductPackageTypeModel;
                setAddOptionDialog(false);
                productPackageTypeResponse = await ProductsApi.createProductPackageType(packageType);
                setPackageTypes([...packageTypes, productPackageTypeResponse]);
                resetPackageType();
                resetErrors();
            } catch (error) {
                console.error('Error adding package type:', error);
            }
        }
    }

    async function handleEditPackageType() {
        if (isFormValid()) {
            try {
                let productPackageTypeResponse: ProductPackageTypeModel;

                productPackageTypeResponse = await ProductsApi.updateProductPackageType(packageType, packageIdToEdit!);
                setAddOptionDialog(false);
                resetPackageType();
                updateLoadedPackages(productPackageTypeResponse);
                setPackageIdToEdit(null);
                resetErrors();
            } catch (error) {
                console.error(error);
                alert(error);
            }
        }
    }

    function updateLoadedPackages(newPackage: ProductPackageTypeModel) {
        setPackageTypes(prevPackages =>
            prevPackages.map(curPackage =>
                curPackage._id === newPackage._id ? newPackage : curPackage
            )
        )
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let newValue: string | number | null = value;
      
        // For package name, ensure it is always treated as a string.
        if (name === 'packageName') {
          newValue = value;
        } else {
          // For numeric inputs, convert to a number or null if the input is empty.
          // Additionally, we can trim any white spaces for numeric inputs as well,
          // in case they are entered as text.
          newValue = value.trim() === '' ? null : Number(value.trim());
        }
      
        setPackageType(prev => ({
          ...prev,
          [name]: newValue,
        }));
      };

    const resetPackageType = () => {
        setPackageType({ // Reset the form state
            packageName: '',
            packageLength: null,
            packageWidth: null,
            packageHeight: null,
            packageWeight: null,
        });
    }
    const resetErrors = () => {
        setErrors({
            packageName: false,
            packageLength: false,
            packageWidth: false,
            packageHeight: false,
            packageWeight: false,
        })
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
                                {packageType.packageName + " (" + packageType.packageLength + "\" x " + packageType.packageWidth + "\" x " + packageType.packageHeight + ")"}
                            </option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {error?.message}
                    </Form.Control.Feedback>
                    <IconButton onClick={() => setAddOptionDialog(true)} className={styles.formButton}><IconPlus /></IconButton>
                    <IconButton onClick={() => setEditOptionMenuDialog(true)} className={styles.formButton}><IconSettings /></IconButton>
                </InputGroup>
            </Form.Group>

            {addOptionDialog &&
                <Modal show onHide={() => { setAddOptionDialog(false); resetPackageType(); setPackageIdToEdit(null); resetErrors(); }}>
                    <Modal.Header closeButton>
                        {packageIdToEdit ? (<Modal.Title>Edit {packageType.packageName}</Modal.Title>) : (<Modal.Title>Add {label}</Modal.Title>)}

                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Label>Package Name</Form.Label>
                            <Form.Control
                                name="packageName"
                                type="text"
                                value={packageType.packageName}
                                onChange={handleInputChange}
                                isInvalid={errors.packageName}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.packageName && 'Package name cannot be empty.'}
                            </Form.Control.Feedback>
                            <Form.Label>Package Length (in.)</Form.Label>
                            <Form.Control
                                name="packageLength"
                                type="number"
                                step={0.1}
                                value={packageType.packageLength || ''}
                                onChange={handleInputChange}
                                isInvalid={errors.packageLength}
                            />
                            <Form.Control.Feedback type="invalid">
                            {errors.packageLength && 'Package length cannot be empty.'}
                            </Form.Control.Feedback>
                            <Form.Label>Package Width (in.)</Form.Label>
                            <Form.Control
                                name="packageWidth"
                                type="number"
                                step={0.1}
                                value={packageType.packageWidth || ''}
                                onChange={handleInputChange}
                                isInvalid={errors.packageWidth}
                            />
                            <Form.Control.Feedback type="invalid">
                            {errors.packageWidth && 'Package width cannot be empty.'}
                            </Form.Control.Feedback>
                            <Form.Label>Package Height (in.)</Form.Label>
                            <Form.Control
                                name="packageHeight"
                                type="number"
                                step={0.1}
                                value={packageType.packageHeight || ''}
                                onChange={handleInputChange}
                                isInvalid={errors.packageHeight}
                            />
                            <Form.Control.Feedback type="invalid">
                            {errors.packageHeight && 'Package height cannot be empty.'}
                            </Form.Control.Feedback>
                            <Form.Label>Package Weight (lbs.)</Form.Label>
                            <Form.Control
                                name="packageWeight"
                                type="number"
                                step={0.1}
                                value={packageType.packageWeight || ''}
                                onChange={handleInputChange}
                                isInvalid={errors.packageWeight}
                            />
                            <Form.Control.Feedback type="invalid">
                            {errors.packageWeight && 'Package weight cannot be empty.'}
                            </Form.Control.Feedback>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setAddOptionDialog(false); resetPackageType(); setPackageIdToEdit(null); resetErrors();
                        }}>Close</Button>
                        {/* Add Package Type Button */}
                        {packageIdToEdit ?
                            (<Button variant="primary" onClick={() => handleEditPackageType()}>Apply</Button>) :
                            (<Button variant="primary" onClick={() => handleAddPackageType()}>Add</Button>)}
                    </Modal.Footer>
                </Modal>
            }
            {editOptionMenuDialog &&
                <Modal
                    show onHide={() => setEditOptionMenuDialog(false)}
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
                                        <p className={modalStyles.editCategoryRowText}>{packageTypeModel.packageName + " (" + packageTypeModel.packageLength + "\" x " + packageTypeModel.packageWidth + "\" x " + packageTypeModel.packageHeight + ")"}</p>
                                        <Button
                                            className={modalStyles.editCategoryRowButton}
                                            onClick={() => {
                                                // Update the package type state
                                                setPackageType({
                                                    packageName: packageTypeModel.packageName,
                                                    packageLength: packageTypeModel.packageLength,
                                                    packageWidth: packageTypeModel.packageWidth,
                                                    packageHeight: packageTypeModel.packageHeight,
                                                    packageWeight: packageTypeModel.packageWeight,
                                                });

                                                // Then, set the dialog to open
                                                setPackageIdToEdit(packageTypeModel._id)
                                                setAddOptionDialog(true);
                                            }}>Edit</Button>
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