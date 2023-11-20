import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
} from "@tanstack/react-table";
import tableStyles from "../styles/Table.module.css";
import modalStyles from "../styles/Modal.module.css";

type UnitCostModel = {
  perUnitCogs: string;
  unitCost: string;
};

// Create a type that represents the structure of your transposed rows
type TransposedRow = {
  header: string;
  value: string;
};

const defaultData: UnitCostModel = {
  perUnitCogs: "3.50",
  unitCost: "4.00",
};

// Transform your data into the transposed structure
const transposedData: TransposedRow[] = Object.entries(defaultData).map(
  ([key, value]) => ({
    header: key, // These will be your row headers
    value: value, // These will be your row values
  })
);

const columnHelper = createColumnHelper<TransposedRow>();

const columns = [
  columnHelper.accessor("header", {
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor("value", {
    cell: (info) => <span>{info.getValue()}</span>,
  }),
];

export default function Pricing() {
  const [data, setData] = useState(transposedData);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={modalStyles.scrollableTableContainer}>
      <table
        className={`${modalStyles.listingSkuTable} ${tableStyles.listingSkuTable}`}
      >
        <tbody className={modalStyles.listingSkuTableBody}>
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
  );
}
