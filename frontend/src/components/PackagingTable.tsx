import React, { useState, useReducer, useEffect, useContext } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useForm, useFieldArray } from "react-hook-form";
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
    cell: (info) => <i>{info.getValue()}</i>,
  }),
];

export default function VendorProductsTable() {
  const [packagingCosts, setPackagingCosts] = useState<PackagingModel[]>([]);
  const rerender = useReducer(() => ({}), {})[1];

  const [showAddPackaging, setShowAddPackaging] = useState(false);
  const [showEditPackaging, setShowEditPackaging] = useState(false);

  const productToEdit = useContext(ProductContext);

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const { register, control, handleSubmit, reset } = useForm<PackagingModel>({
    defaultValues: {
      itemName: "",
      perUnitCost: "",
    },
  });
  useEffect(() => {
    // setPackagingCosts(productToEdit?.product?.productVendorProducts ?? []);
  }, [productToEdit]);
  useEffect(() => {
    if (showEditPackaging) {
      //   reset(vendorProducts[+selectedRowId!]);
    }
  }, [showEditPackaging]);

  const table = useReactTable({
    data: packagingCosts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const onSubmit = (input: PackagingModel) => {
    setPackagingCosts([...packagingCosts, input]);
    setShowAddPackaging(false);

    reset();
    // if (showEditVendorProduct && selectedRowId !== null) {
    //   vendorProductsDataSubmit(input, +selectedRowId);
    //   setVendorProducts((currentData) => {
    //     const newData = [...currentData!];
    //     newData[+selectedRowId!] = input;
    //     return newData;
    //   });
    // } else {
    //   vendorProductsDataSubmit(input);
    //   setVendorProducts((currentData) => {
    //     return currentData ? [...currentData, input] : [input];
    //   });
    // }
    // setShowAddVendorProduct(false);
    // setShowEditVendorProduct(false);
    // reset({
    //   vendor: "",
    //   vendorSku: "",
    //   minOrderQuantity: "",
    //   leadTime: "",
    //   vendorRangePrice: [],
    // });
  };

  return (
    <div>
      <div className={styles.buttonRow}>
        <Button
          onClick={() => setShowAddPackaging(true)}
          variant="outline-dark"
          className={styles.grayButton}
        >
          <b>NEW VENDOR PRODUCT</b>
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
          }}
          disabled={!selectedRowId}
          variant="outline-dark"
          className={styles.grayButton}
        >
          <b>DELETE</b>
        </Button>
      </div>
      <div className={styles.scrollableTableContainer}>
        <table className={`${tableStyles.vendorProductTable}`}>
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
          <tbody className={styles.listingSkuTableBody}>
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
      {showAddPackaging && (
        <Modal
          show
          onHide={() => {setShowAddPackaging(false); reset();}}
          centered
          className={vendorProductStyles.vendorProductModal}
        >
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title>Add Packaging</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className={vendorProductStyles.vendorProductForm}>
              <div>
                <div>
                  <label>Item Name</label>
                  <input type="text" {...register("itemName")}></input>
                  <label>Per Unit Cost</label>
                  <input type="text" {...register("perUnitCost")}></input>
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
              <div className={vendorProductStyles.vendorProductGridContainer}>
                <div className={vendorProductStyles.item1}>
                  <label>Item Name</label>
                  <input type="text" {...register("itemName")}></input>
                  <label>Per Unit Cost</label>
                  <input type="text" {...register("perUnitCost")}></input>
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
