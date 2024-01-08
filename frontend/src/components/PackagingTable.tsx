import React, {
  useState,
  useReducer,
  useEffect,
  useContext,
  ChangeEvent,
} from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import styles from "../styles/Modal.module.css";
import tableStyles from "../styles/Table.module.css";
import vendorProductStyles from "../styles/VendorProducts.module.css";
import { Button, Modal } from "react-bootstrap";
import { ProductContext } from "../contexts/ProductContext";

export type PackagingModel = {
  itemName: string;
  perUnitCost: string;
};

const columnHelper = createColumnHelper<PackagingModel>();

const columns = [
  columnHelper.accessor("itemName", {
    header: () => <span>Item Name</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("perUnitCost", {
    header: () => <span>Per Unit Cost</span>,
    cell: (info) => <i>${info.getValue()}</i>,
  }),
];
interface PackagingTableProps {
  packagingDataSubmit: (input: PackagingModel, index?: number) => void;
  deletePackaging: (index: number) => void;
}

export default function PackagingTable({
  packagingDataSubmit,
  deletePackaging,
}: PackagingTableProps) {
  const [packagingCosts, setPackagingCosts] = useState<PackagingModel[]>([]);
  const rerender = useReducer(() => ({}), {})[1];

  const [showAddPackaging, setShowAddPackaging] = useState(false);
  const [showEditPackaging, setShowEditPackaging] = useState(false);

  const [totalPackagingCost, setTotalPackagingCost] = useState<string | null>(
    null
  );

  const productToEdit = useContext(ProductContext);

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, control } =
    useForm<PackagingModel>({
      defaultValues: {
        itemName: "",
        perUnitCost: "",
      },
    });
  useEffect(() => {
    setPackagingCosts(productToEdit?.product?.productPackaging ?? []);
  }, [productToEdit]);
  useEffect(() => {
    if (showEditPackaging) {
      reset(packagingCosts[+selectedRowId!]);
    }
    if (showAddPackaging) {
      reset({
        itemName: "",
        perUnitCost: "",
      });
    }
  }, [showEditPackaging, showAddPackaging]);
  useEffect(() => {
    const totalCost = packagingCosts.reduce((acc, curr) => {
      const cleanedCost = curr.perUnitCost.replace(/[^\d.-]/g, "");
      const cost = parseFloat(cleanedCost) || 0;
      return acc + cost;
    }, 0);
    setTotalPackagingCost(totalCost.toFixed(2));
  }, [packagingCosts]);

  const table = useReactTable({
    data: packagingCosts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const handleUnitCostChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d*(\.\d{0,2})?$/.test(value)) {
      // Checks if the input is all digits
      setValue("perUnitCost", value);
    }
  };
  const handleUnitCostBlur = (e: React.FocusEvent<HTMLInputElement>) => {
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

  const onSubmit = (input: PackagingModel) => {
    if (showEditPackaging && selectedRowId) {
      setPackagingCosts((pkgs) => {
        const newPkgs = [...packagingCosts];
        newPkgs[+selectedRowId!] = input;
        return newPkgs;
      });
      packagingDataSubmit(input, +selectedRowId!);
    } else {
      setPackagingCosts([...packagingCosts, input]);
      packagingDataSubmit(input);
    }
    setShowAddPackaging(false);
    setShowEditPackaging(false);
    reset();
  };

  return (
    <div>
      <div className={styles.buttonRow}>
        <Button
          onClick={() => setShowAddPackaging(true)}
          variant="outline-dark"
          className={styles.grayButton}
        >
          <b>NEW PACKAGING</b>
        </Button>
        <Button
          onClick={() => setShowEditPackaging(true)}
          disabled={!selectedRowId}
          variant="outline-dark"
          className={styles.grayButton}
        >
          <b>EDIT</b>
        </Button>
        <Button
          onClick={() => {
            setPackagingCosts((pkgs) =>
              pkgs.filter((_, idx) => idx !== +selectedRowId!)
            );
            deletePackaging(+selectedRowId!);
          }}
          disabled={!selectedRowId}
          variant="outline-dark"
          className={styles.grayButton}
        >
          <b>DELETE</b>
        </Button>
      </div>
      <div className={styles.scrollableTableContainer}>
        <table className={tableStyles.packagingTable}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className={styles.tableRow} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={styles.listingSkuTableH}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <tr
                  className={`${tableStyles.tableRow} ${
                    row.id === selectedRowId ? tableStyles.selected : ""
                  }`}
                  onClick={() =>
                    setSelectedRowId(row.id === selectedRowId ? null : row.id)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <h5>
        Total Packaging Cost:{" "}
        {totalPackagingCost ? "$" + totalPackagingCost : "N/A"}
      </h5>
      {showAddPackaging && (
        <Modal
          show
          onHide={() => {
            setShowAddPackaging(false);
            reset();
          }}
          centered
          className={vendorProductStyles.vendorProductModal}
        >
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title>Add Packaging</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className={vendorProductStyles.vendorProductForm}>
              <div>
                <div className={styles.packagingInputsContainer}>
                  <div>
                    <label>Item Name:</label>
                    <input type="text" {...register("itemName")}></input>
                  </div>
                  <div>
                    <label>Per Unit Cost:</label>
                    <Controller
                      name="perUnitCost"
                      control={control}
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
                  </div>
                </div>
              </div>
              <button onClick={handleSubmit(onSubmit)}>Submit</button>
            </form>
          </Modal.Body>
        </Modal>
      )}
      {showEditPackaging && (
        <Modal
          show
          onHide={() => {
            setShowEditPackaging(false);
            reset({
              itemName: "",
              perUnitCost: "",
            });
          }}
          centered
          className={vendorProductStyles.vendorProductModal}
        >
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title>Edit Packaging</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className={vendorProductStyles.vendorProductForm}>
              <div>
                <div>
                  <label>Item Name</label>
                  <input type="text" {...register("itemName")}></input>
                  <label>Per Unit Cost</label>
                  <Controller
                    name="perUnitCost"
                    control={control}
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
                </div>
              </div>
              <button onClick={handleSubmit(onSubmit)}>Submit</button>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
