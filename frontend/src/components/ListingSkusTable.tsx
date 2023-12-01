import { useState, useReducer, useContext, useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import styles from "../styles/Modal.module.css";
import tableStyles from "../styles/Table.module.css";
import listingSkusStyles from "../styles/ListingSkus.module.css";
import { Button, Modal } from "react-bootstrap";
import redToggle from "../assets/icons8-toggle-on-50.png";
import greenToggle from "../assets/icons8-toggle-50.png";
import { useForm } from "react-hook-form";
import { ListingSkusInput } from "../network/products_api";
import { ProductContext } from "../contexts/ProductContext";
import * as ProductsApi from "../network/products_api";

const columnHelper = createColumnHelper<ListingSkusInput>();

const columns = [
  columnHelper.accessor("channel", {
    header: () => <span>Channel</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("listingSku", {
    header: () => <span>Listing Sku</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("pushInventory", {
    header: () => <span>Push Inventory</span>,
    cell: (info) =>
      info.getValue() ? (
        <div>
          <img
            src={greenToggle}
            alt="Green Toggle"
            className={styles.toggleGreen}
          />
          <i>Yes</i>
        </div>
      ) : (
        <div>
          <img src={redToggle} alt="Red Toggle" className={styles.toggleRed} />
          <i>No</i>
        </div>
      ), // Added parentheses to imply return
  }),
  columnHelper.accessor("latency", {
    header: () => <span>Latency</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
  columnHelper.accessor("status", {
    header: () => <span>Status</span>,
    cell: (info) => (info.getValue() ? <i>Active</i> : <i>Inactive</i>), // Added parentheses to imply return
  }),
];

interface ListingSkusTableProps {
  onListingSkusDataSubmit: (input: ListingSkusInput) => void;
}

export default function ListingSkusTable({
  onListingSkusDataSubmit,
}: ListingSkusTableProps) {
  const rerender = useReducer(() => ({}), {})[1];
  const [showAddListingSku, setShowAddListingSku] = useState(false);
  const productToEdit = useContext(ProductContext);

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const [listingSkus, setListingSkus] = useState<ListingSkusInput[]>([]);

  const { register, handleSubmit } = useForm<ListingSkusInput>({
    defaultValues: {},
  });

  useEffect(() => {
    setListingSkus(productToEdit?.product?.productListingSkus ?? []);
    console.log(productToEdit?.product?.productListingSkus)
  }, [productToEdit])

  // useEffect(() => {
  //   console.log(listingSkus);
  // }, [listingSkus])
  const onSubmit = (input: ListingSkusInput) => {
    // possibly use handleListingSku data here.
    // on submit, set producttoedit's listingsku data to include the added listingsku
    onListingSkusDataSubmit(input);
    console.log(listingSkus);
    setListingSkus((currentData) => {
      // If the current state is not null, spread the current data and add the new input
      return currentData ? [...currentData, input] : [input];
    });
    setShowAddListingSku(false);
  };
  const table = useReactTable({
    data: listingSkus,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div>
      <div className={styles.buttonRow}>
        <Button
          variant="outline-dark"
          className={styles.grayButton}
          onClick={() => setShowAddListingSku(true)}
        >
          <b>NEW LISTING SKU</b>
        </Button>
        <Button
          disabled={!selectedRowId}
          variant="outline-dark"
          className={styles.grayButton}
        >
          <b>EDIT</b>
        </Button>
        <Button
          disabled={!selectedRowId}
          variant="outline-dark"
          className={styles.grayButton}
        >
          <b>DEACTIVATE</b>
        </Button>
        <Button variant="outline-dark" className={styles.grayButton}>
          <b>REFRESH CONN.</b>
        </Button>
        <Button variant="outline-dark" className={styles.grayButton}>
          <b>SHOW INACTIVE</b>
        </Button>
      </div>
      <div className={styles.scrollableTableContainer}>
        <table
          className={`${styles.listingSkuTable} ${tableStyles.listingSkuTable}`}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
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
              <tr
                key={row.id}
                className={`${tableStyles.tableRow} ${
                  row.id === selectedRowId ? tableStyles.selected : ""
                }`}
                onClick={() =>
                  setSelectedRowId(row.id === selectedRowId ? null : row.id)
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddListingSku && (
        <Modal show onHide={() => setShowAddListingSku(false)} centered={true}>
          <Modal.Header closeButton className={styles.modalHeader}>
            Add Listing Sku
          </Modal.Header>
          <Modal.Body>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={listingSkusStyles.listingSkusForm}
            >
              <label>Channel</label>
              <input type="text" {...register("channel")}></input>

              <label>Listing Sku</label>
              <input type="text" {...register("listingSku")}></input>

              <label>Latency</label>
              <input type="text" {...register("latency")}></input>

              <div className={listingSkusStyles.checkboxSection}>
                <div>
                  <label className={listingSkusStyles.checkboxLabel}>
                    Push Inventory
                  </label>
                  <input
                    type="checkbox"
                    {...register("pushInventory")}
                    className={listingSkusStyles.checkboxLarge}
                  ></input>
                </div>
                <div>
                  <label className={listingSkusStyles.checkboxLabel}>
                    Status
                  </label>
                  <input
                    type="checkbox"
                    {...register("status")}
                    className={listingSkusStyles.checkboxLarge}
                  ></input>
                </div>
              </div>
              <button type="submit">Submit</button>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
