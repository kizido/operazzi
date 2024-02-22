import React, { ChangeEvent, FocusEvent, useEffect } from "react";
import vendorProductStyles from "../../styles/VendorProducts.module.css";
import styles from "../../styles/Modal.module.css";
import { Control, Controller, FieldErrors, UseFormHandleSubmit, UseFormRegister, UseFormSetFocus, UseFormSetValue } from "react-hook-form";
import { PackagingModel } from "./PackagingTable";

interface AddEditPackagingFormProps {
  register: UseFormRegister<any>;
  handleSubmit: UseFormHandleSubmit<PackagingModel, undefined>;
  onSubmit: (input: PackagingModel) => void;
  errors: FieldErrors<PackagingModel>;
  control: Control<PackagingModel>;
  setValue: UseFormSetValue<PackagingModel>;
  setFocus: UseFormSetFocus<PackagingModel>;
}

export default function AddEditPackagingForm({
  register,
  handleSubmit,
  onSubmit,
  errors,
  control,
  setValue,
  setFocus
}: AddEditPackagingFormProps) {

  useEffect(() => {
    setFocus("itemName");
  }, [])

  const handleUnitCostChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // Checks if the input is all digits
    if (/^\d*(\.\d{0,2})?$/.test(value)) {
      setValue("perUnitCost", value);
    }
  };
  const handleUnitCostBlur = (e: FocusEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // If there's no decimal or not exactly two digits after the decimal, format it
    if (!/\.\d{2}$/.test(value)) {
      const [whole = "", fractional = ""] = value.split(".");
      const paddedFractional = fractional.padEnd(2, "0");
      value = `${whole}.${paddedFractional}`;
    }

    // If the value starts with a decimal, add a '0' before it
    if (/^\./.test(value)) {
      value = `0${value}`;
    }

    setValue("perUnitCost", value);
  };



  return (
    <form className={vendorProductStyles.vendorProductForm}>
      <div>
        <div className={styles.packagingInputsContainer}>
          <div>
            <label>Item Name:</label>
            <input
              type="text"
              {...register("itemName", {
                required: "Item Name is required.",
              })}
            />
            {errors.itemName && (
              <p className={styles.errorMessage}>{errors.itemName.message}</p>
            )}
          </div>
          <div>
            <label>Per Unit Cost:</label>
            <Controller
              name="perUnitCost"
              control={control}
              rules={{ required: "Per Unit Cost is required" }}
              defaultValue=""
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  onChange={handleUnitCostChange}
                  onBlur={handleUnitCostBlur}
                />
              )}
            />
            {errors.perUnitCost && (
              <p className={styles.errorMessage}>
                {errors.perUnitCost.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <button onClick={handleSubmit(onSubmit)}>Submit</button>
    </form>
  );
}
