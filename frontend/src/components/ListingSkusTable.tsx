import { useState, useReducer, useContext, useEffect, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
    header: () => <span>Shipping Window (days)</span>,
    cell: (info) => <i>{info.getValue()}</i>,
  }),
];

interface ListingSkusTableProps {
  onListingSkusDataSubmit: (input: ListingSkusInput, index?: number) => void;
  onListingSkuDelete: (index: number) => void;
}

export default function ListingSkusTable({
  onListingSkusDataSubmit,
  onListingSkuDelete
}: ListingSkusTableProps) {
  const rerender = useReducer(() => ({}), {})[1];
  const [showAddListingSku, setShowAddListingSku] = useState(false);
  const [showEditListingSku, setShowEditListingSku] = useState(false);
  const productToEdit = useContext(ProductContext);

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const [listingSkus, setListingSkus] = useState<ListingSkusInput[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ListingSkusInput>({
    mode: "onChange",
  });

  useEffect(() => {
    setListingSkus(productToEdit?.product?.productListingSkus ?? []);
  }, [productToEdit]);
  useEffect(() => {
    if (showEditListingSku) {
      reset(listingSkus[+selectedRowId!]);
    }
  }, [showEditListingSku]);

  const onSubmit = (input: ListingSkusInput) => {
    if (showEditListingSku && selectedRowId !== null) {
      // If showing edit and selectedRowId is not null, pass it as a second argument
      onListingSkusDataSubmit(input, +selectedRowId);
      setListingSkus((currentData) => {
        const newData = [...currentData!];
        newData[+selectedRowId!] = input;
        return newData;
      });
    } else {
      // In all other cases, pass only the input
      onListingSkusDataSubmit(input);
      setListingSkus((currentData) => {
        return currentData ? [...currentData, input] : [input];
      });
    }
    setShowAddListingSku(false);
    setShowEditListingSku(false);
    reset({
      channel: "",
      listingSku: "",
      pushInventory: false,
      latency: "",
    });
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
          onClick={() => setShowEditListingSku(true)}
        >
          <b>EDIT</b>
        </Button>
        <Button
          onClick={() => {
            onListingSkuDelete(+selectedRowId!);
            setListingSkus(
              listingSkus.filter((sku) => sku !== listingSkus[+selectedRowId!])
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
        <Modal
          show
          onHide={() => {
            setShowAddListingSku(false);
            reset();
          }}
          centered={true}
        >
          <Modal.Header closeButton className={styles.modalHeader}>
            Add Listing Sku
          </Modal.Header>
          <Modal.Body>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={listingSkusStyles.listingSkusForm}
            >
              <label>Channel</label>
              <input
                type="text"
                {...register("channel", {
                  required: "Channel is required.",
                })}
              />
              {errors.channel && (
                <p className={styles.errorMessage}>{errors.channel.message}</p>
              )}
              <label>Listing Sku</label>
              <input
                type="text"
                {...register("listingSku", {
                  required: "Listing Sku is required.",
                })}
              />
              {errors.listingSku && (
                <p className={styles.errorMessage}>
                  {errors.listingSku.message}
                </p>
              )}
              <label>Shipping Window (days)</label>
              <input
                type="text"
                {...register("latency", {
                  required: "Shipping Window is required.",
                })}
              />
              {errors.latency && (
                <p className={styles.errorMessage}>{errors.latency.message}</p>
              )}
              <div className={listingSkusStyles.checkboxSection}>
                <div>
                  <label className={listingSkusStyles.checkboxLabel}>
                    Push Inventory
                  </label>
                  <input
                    type="checkbox"
                    {...register("pushInventory")}
                    className={listingSkusStyles.checkboxLarge}
                  />
                </div>
              </div>
              <button type="submit">Submit</button>
            </form>
          </Modal.Body>
        </Modal>
      )}
      {showEditListingSku && (
        <Modal
          show
          onHide={() => {
            setShowEditListingSku(false);
            reset({
              channel: "",
              listingSku: "",
              pushInventory: false,
              latency: "",
            });
          }}
          centered={true}
        >
          <Modal.Header closeButton className={styles.modalHeader}>
            Edit Listing Sku
          </Modal.Header>
          <Modal.Body>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={listingSkusStyles.listingSkusForm}
            >
              <label>Channel</label>
              <input
                type="text"
                {...register("channel", {
                  required: "Channel is required.",
                })}
              />
              {errors.channel && (
                <p className={styles.errorMessage}>{errors.channel.message}</p>
              )}
              <label>Listing Sku</label>
              <input
                type="text"
                {...register("listingSku", {
                  required: "Listing Sku is required.",
                })}
              />
              {errors.listingSku && (
                <p className={styles.errorMessage}>
                  {errors.listingSku.message}
                </p>
              )}
              <label>Shipping Window (days)</label>
              <input
                type="text"
                {...register("latency", {
                  required: "Shipping Window is required.",
                })}
              />
              {errors.latency && (
                <p className={styles.errorMessage}>{errors.latency.message}</p>
              )}
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
              </div>
              <button type="submit">Submit</button>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
