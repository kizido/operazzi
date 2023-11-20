import { useState, useReducer, useContext } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import styles from "../styles/Modal.module.css";
import tableStyles from "../styles/Table.module.css";
import { Button, Modal } from "react-bootstrap";
import redToggle from "../assets/icons8-toggle-on-50.png";
import greenToggle from "../assets/icons8-toggle-50.png";
import listingSkusStyles from "../styles/ListingSkus.module.css";
import { Form, useForm } from "react-hook-form";
import { ListingSkusInput } from "../network/products_api";
import { Product } from "../models/product";
import ProductContext from "../contexts/ProductContext";

type ListingSkusTableModel = {
  channel: string;
  listingSku: string;
  pushInventory: boolean;
  latency: number;
  status: boolean;
};

const defaultData: ListingSkusTableModel[] = [
  {
    channel: "Amazon",
    listingSku: "SC-C-QD025-08",
    pushInventory: true,
    latency: 7,
    status: true,
  },
  {
    channel: "Walmart",
    listingSku: "SC-C-QD025-08",
    pushInventory: false,
    latency: 7,
    status: false,
  },
  {
    channel: "Amazon",
    listingSku: "SC-C-QD025-08",
    pushInventory: true,
    latency: 7,
    status: true,
  },
  {
    channel: "Walmart",
    listingSku: "SC-C-QD025-08",
    pushInventory: false,
    latency: 7,
    status: false,
  },
  {
    channel: "Amazon",
    listingSku: "SC-C-QD025-08",
    pushInventory: true,
    latency: 7,
    status: true,
  },
  {
    channel: "Amazon",
    listingSku: "SC-C-QD025-08",
    pushInventory: true,
    latency: 7,
    status: true,
  },
  {
    channel: "Walmart",
    listingSku: "SC-C-QD025-08",
    pushInventory: false,
    latency: 7,
    status: false,
  },
  {
    channel: "Amazon",
    listingSku: "SC-C-QD025-08",
    pushInventory: true,
    latency: 7,
    status: true,
  },
  {
    channel: "Walmart",
    listingSku: "SC-C-QD025-08",
    pushInventory: false,
    latency: 7,
    status: false,
  },
  {
    channel: "Amazon",
    listingSku: "SC-C-QD025-08",
    pushInventory: true,
    latency: 7,
    status: true,
  },
  {
    channel: "Amazon",
    listingSku: "SC-C-QD025-08",
    pushInventory: true,
    latency: 7,
    status: true,
  },
];

const columnHelper = createColumnHelper<ListingSkusTableModel>();

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

export default function ListingSkusTable() {
  const [data, setData] = useState(() => [...defaultData]);
  const rerender = useReducer(() => ({}), {})[1];
  const [showAddListingSku, setShowAddListingSku] = useState(false);
  const productToEdit = useContext(ProductContext);

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const { register } = useForm<ListingSkusInput>({
    defaultValues: {
    }
  });

  const table = useReactTable({
    data,
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
          <Modal.Header closeButton>Add Listing Sku</Modal.Header>
          <Modal.Body>
            <Form>
              <label>Channel</label>

              <label>Listing Sku</label>

              <label>Push Inventory</label>

              <label>Latency</label>

              <label>Status</label>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
