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
import pricingStyles from "../styles/Pricing.module.css";

type UnitCostModel = {
  lcogs: string; //
  opex: string;
  packagingCosts: string; // total packaging cost from packaging page
  shippingWeight: string; // weight (gramss) from basic info
  amazonFees: string;
  growthFund: string;
  marketingBudget: string;
  amazonPrice: string;
  websitePrice: string;
};

// Create a type that represents the structure of your transposed rows
type TransposedRow = {
  header: string;
  value: string;
};

const defaultData: UnitCostModel = {
  lcogs: "3.50",
  opex: "4.00",
  packagingCosts: "5.00",
  shippingWeight: "6.00",
  amazonFees: "7.00",
  growthFund: "3.00", // 10% of cogs
  marketingBudget: "10.00", // sum of other headers * PPC SPEND %
  amazonPrice: "CALCULATED", // lcogs + opex + amazon fees + PPC + net profit + growth
  websitePrice: "CALCULATED", // lcogs + opex + shipping fees + PPC + net profit + growth
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
    <div>
      <div className={pricingStyles.pricingInputContainer}>
          <label>OPEX: <input /></label>
          <label>PPC Spend %: <input /></label>
          <label>Growth %: <input /></label>
          <label>Net Profit Target %: <input /></label>
      </div>
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
    </div>
  );
}
