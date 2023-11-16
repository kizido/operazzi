import { Checkbox, FormControlLabel, TextField, Typography } from '@mui/material'
import { FocusEvent, ChangeEvent, useMemo, useEffect, useState } from 'react'
import { Controller, Form, useForm } from 'react-hook-form'
import styles from '../styles/Customs.module.css'
import countryList from 'react-select-country-list';
import Select from 'react-select'
import { Product } from '../models/product';
import * as ProductsApi from '../network/products_api';
import { CustomsInput } from '../network/products_api';
import { ProductCustoms } from '../models/productCustoms';

interface CustomsProps {
    productToEdit?: Product,
    onCustomsDataSubmit: (input: CustomsInput) => void,
}
export default function Customs({ productToEdit, onCustomsDataSubmit }: CustomsProps) {

    const [customsData, setCustomsData] = useState<ProductCustoms | null>(null);

    useEffect(() => {
        console.log("CUSTOMS MODAL STARTING")
        async function getCustoms() {
            if (productToEdit) {
                const customs = await ProductsApi.fetchProductCustoms(productToEdit.productCustomsId);
                setCustomsData(customs);

                reset({
                    customsDeclaration: customs.customsDeclaration,
                    itemDescription: customs.itemDescription,
                    harmonizationCode: customs.harmonizationCode,
                    countryOrigin: customs.countryOrigin,
                    declaredValue: customs.declaredValue,
                })
            }
            else {
                console.log("THERE IS NO PRODUCT TO EDIT")
            }
        }
        getCustoms();
    }, []);

    const { register, handleSubmit, control, reset, setValue } = useForm<ProductsApi.CustomsInput>({
        defaultValues: {
            customsDeclaration: customsData?.customsDeclaration || false,
            itemDescription: customsData?.itemDescription || "",
            harmonizationCode: customsData?.harmonizationCode || "",
            countryOrigin: customsData?.countryOrigin || "",
            declaredValue: customsData?.declaredValue || 0,
        }
    });
    const options = useMemo(() => countryList().getData(), [])

    const onSubmit = async (input: CustomsInput) => {
        try {
            if (productToEdit) {
                // If there is a product already, simply update the customs info
                const response = await ProductsApi.updateProductCustoms(input, productToEdit.productCustomsId);
                setCustomsData(response);
            }
            else {
                // If there is not a product yet, we must store the customs data, and assign it once the
                // customs document is created upon product creation
                onCustomsDataSubmit(input);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // const isValidHarmonizationCode = (code: string): boolean | string => {
    //     // Assuming HS codes are 6, 8, or 10 digits long
    //     const hsCodePattern = /^[0-9]{6}([0-9]{2})?([0-9]{2})?$/;

    //     if (hsCodePattern.test(code)) {
    //         return true; // Valid harmonization code
    //     } else {
    //         return 'Invalid harmonization code'; // Error message
    //     }
    // };

    const handleHarmonizationCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
        // Remove all non-digits from the input
        let input = event.target.value.replace(/\D/g, '');

        // Insert the first decimal after the fourth digit
        if (input.length > 4) {
            input = `${input.slice(0, 4)}.${input.slice(4)}`;
        }

        // Insert the second decimal after the eighth digit (accounting for the decimal added earlier)
        if (input.length > 7) {
            input = `${input.slice(0, 7)}.${input.slice(7, 11)}`;
        }

        // Update the state with the formatted input
        setValue('harmonizationCode', input);
    };

    const handleHarmonizationCodeBlur = (event: FocusEvent<HTMLInputElement>) => {
        const code = event.target.value.replace(/\D/g, ''); // Removes any non-digits
        let paddedCode = code.padEnd(10, '0'); // Pads the code with zeros to make it 10 digits long
        const formattedCode = `${paddedCode.slice(0, 4)}.${paddedCode.slice(4, 6)}.${paddedCode.slice(6)}`;

        setValue('harmonizationCode', formattedCode);
    }

    return (
        <div>
            <div className={styles.explanationBox}>
                <p>If you would like Order Manager to pre-populate customs declarations for international
                    and APO/FPO customs forms for this product, please check the "Include Customs
                    Declaration" check box below and enter the required declaration values.
                    <br></br><br></br>
                    If you do not enter customs declaration presets for this product, you will have to
                    manually enter customs declarations for all orders that contain this product.
                    For more information on customs declarations, please refer to Order Manager's
                    Help Guide.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.customFormBox}>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputColumn}>
                            <Controller
                                name="customsDeclaration" // The name attribute for the form control
                                control={control} // The control object from useForm
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                {...field} // spread the field props onto Checkbox
                                                checked={field.value} // necessary to set the Checkbox's checked state
                                            />
                                        }
                                        label={<Typography className={styles.checkboxLabelText}>Include Customs Declaration</Typography>}
                                    />
                                )}
                            />

                            <label className={styles.descriptionLabel} htmlFor='itemDescription'>Item Description:</label>
                            <textarea {...register('itemDescription')} id='itemDescription' style={{ resize: 'both' }} rows={5} cols={40}></textarea>
                        </div>
                        <div className={styles.inputColumn}>
                            <label className={styles.descriptionLabel} htmlFor='harmonizationCode'>Harmonization Code:</label>
                            <input {...register('harmonizationCode')} type='text' id='harmonizationCode' name='harmonizationCode'
                                onChange={handleHarmonizationCodeChange} onBlur={handleHarmonizationCodeBlur}></input>

                            <label className={styles.descriptionLabel} htmlFor='countryOrigin'>Country of Origin:</label>
                            <Controller
                                name="countryOrigin" // The key for the select data in the form
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={options}
                                        value={options.find(option => option.value === field.value)} // set the selected value
                                        onChange={(option) => field.onChange(option!.value)} // only send the value, not the entire object
                                    />
                                )}
                            />

                            <label className={styles.descriptionLabel} htmlFor='declaredValue'>Declared Value:</label>
                            <input {...register('declaredValue')} type='text' id='declaredValue' name='declaredValue'></input>
                        </div>
                    </div>
                </div>
                <button type="submit" className={styles.applyButton}>Apply</button>
            </form>
        </div>
    )
}
