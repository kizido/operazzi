import React, { useState, useReducer } from "react";
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

type VendorProductsModel = {
  vendor: string;
  vendorSku: string;
  minOrderQuantity: number;
  leadTime: number;
  vendorRangePrice: PriceRange[];
};
type PriceRange = {
  minUnits: number;
  maxUnits: number;
  price: number;
};

interface ExpandedRowContentProps {
  vendorRangePrice: PriceRange[];
}

const ExpandedRowContent = ({ vendorRangePrice }: ExpandedRowContentProps) => {
  return (
    <table
      className={`${styles.listingSkuTable} ${tableStyles.expandedRowTable}`}
    >
      <thead>
        <tr>
          <th className={styles.listingSkuTableH}></th>
          <th className={styles.listingSkuTableH}>From</th>
          <th className={styles.listingSkuTableH}>To</th>
          <th className={styles.listingSkuTableH}>Price</th>
        </tr>
      </thead>
      <tbody className={styles.listingSkuTableBody}>
        {vendorRangePrice.map((priceRange, index) => (
          <tr key={index} className={tableStyles.tableRow}>
            <td>{index + 1}</td>
            <td>{priceRange.minUnits}</td>
            <td>{priceRange.maxUnits}</td>
            <td>${priceRange.price.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const columnHelper = createColumnHelper<VendorProductsModel>();

const columns = [
  columnHelper.display({
    id: "expander",
    cell: ({ row }) => (
      <button
        type="button"
        onClick={() => row.toggleExpanded()}
        aria-label="Toggle Row Expanded"
      >
        {row.getIsExpanded() ? "-" : "+"}{" "}
        {/* Change the icon based on the row's expanded state */}
      </button>
    ),
  }),
  columnHelper.accessor("vendor", {
    header: () => <span>Vendor</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("vendorSku", {
    header: () => <span>Vendor Sku</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("minOrderQuantity", {
    header: () => <span>Min Order Qty</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("leadTime", {
    header: () => <span>Lead Time</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
];

export default function VendorProductsTable() {
  const [vendorProducts, setVendorProducts] = useState<VendorProductsModel[]>(
    []
  );
  const [vendorPriceRanges, setVendorPriceRanges] = useState<PriceRange[]>([]);
  const rerender = useReducer(() => ({}), {})[1];

  const [showAddVendorProduct, setShowAddVendorProduct] = useState(false);

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const { register, control, handleSubmit } = useForm<VendorProductsModel>({
    defaultValues: {},
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "vendorRangePrice",
  });

  const table = useReactTable({
    data: vendorProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const onSubmit = (input: VendorProductsModel) => {
    console.log(input.vendor);
  };

  return (
    <div>
      <div className={styles.buttonRow}>
        <Button
          onClick={() => setShowAddVendorProduct(true)}
          variant="outline-dark"
          className={styles.grayButton}
        >
          <b>NEW VENDOR PRODUCT</b>
        </Button>
        <Button
          disabled={!selectedRowId}
          variant="outline-dark"
          className={styles.grayButton}
        >
          <b>EDIT</b>
        </Button>
        <Button variant="outline-dark" className={styles.grayButton}>
          <b>SHOW INACTIVE</b>
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
                {row.getIsExpanded() && (
                  <tr>
                    <td colSpan={row.getVisibleCells().length - 1}>
                      <ExpandedRowContent
                        vendorRangePrice={row.original.vendorRangePrice}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {showAddVendorProduct && (
        <Modal
          show
          onHide={() => setShowAddVendorProduct(false)}
          centered
          className={vendorProductStyles.vendorProductModal}
        >
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title>Add Vendor Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={vendorProductStyles.vendorProductGridContainer}>
              <div className={vendorProductStyles.item1}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className={vendorProductStyles.vendorProductForm}
                >
                  <label>Vendor</label>
                  <input type="text" {...register("vendor")}></input>
                  <label>Vendor Sku</label>
                  <input type="text" {...register("vendorSku")}></input>
                  <label>Min Order Quantity</label>
                  <input type="text" {...register("minOrderQuantity")}></input>
                  <label>Lead Time</label>
                  <input type="text" {...register("leadTime")}></input>
                </form>
              </div>
              <div
                className={`${vendorProductStyles.item2} ${vendorProductStyles.priceRangeContainer}`}
              >
                <label>From:</label>
                <input type="number" />
                <label>To:</label>
                <input type="number" />
                <label>Price:</label>
                <input type="number" />
                <button type="submit">Add</button>
              </div>
            </div>
            <input type="submit"></input>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
