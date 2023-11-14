import { Checkbox, FormControlLabel, TextField, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { Form } from 'react-hook-form'
import styles from '../styles/Customs.module.css'
import countryList from 'react-select-country-list';
import Select from 'react-select'

export default function Customs() {

    const options = useMemo(() => countryList().getData(), [])
    return (
        <div>
            <div className={styles.explanationBox}>
                <p>If you would like Order Manager to pre-populate customs declarations for international and APO/FPO customs forms for this product, please check the "Include Customs Declaration" check box below and enter the required declaration values. <br></br><br></br>
                    If you do not enter customs declaration presets for this product, you will have to manually enter customs declarations for all orders that contain this product. For more information on customs declarations, please refer to Order Manager's Help Guide.</p>
            </div>

            <div className={styles.customFormBox}>
                <div className={styles.inputContainer}>
                    <div className={styles.inputColumn}>
                        <FormControlLabel
                            control={<Checkbox />}
                            label={<Typography className={styles.checkboxLabelText}>Include Customs Declaration</Typography>} />

                        <label className={styles.descriptionLabel} htmlFor='itemDescription'>Item Description:</label>
                        <textarea id='itemDescription' style={{ resize: 'both' }} rows={5} cols={40}></textarea>
                    </div>
                    <div className={styles.inputColumn}>
                        <label className={styles.descriptionLabel} htmlFor='harmonizationCode'>Harmonization Code:</label>
                        <input type='text' id='harmonizationCode' name='harmonizationCode'></input>

                        <label className={styles.descriptionLabel} htmlFor='originCountry'>Country of Origin:</label>
                        <Select options={options}/>

                        <label className={styles.descriptionLabel} htmlFor='harmonizationCode'>Declared Value:</label>
                        <input type='text' id='harmonizationCode' name='harmonizationCode'></input>
                    </div>
                </div>
            </div>
        </div>
    )
}
