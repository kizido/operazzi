import React, { useState, useReducer } from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table'
import styles from '../styles/Modal.module.css'
import tableStyles from '../styles/Table.module.css'
import { Button } from 'react-bootstrap'

type VendorProductsTableModel = {
    vendor: string
    vendorSku: string
    minOrderQuantity: number
    leadTime: number
}

const defaultData: VendorProductsTableModel[] = [
    {
        vendor: 'Davy',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
    },
    {
        vendor: 'Sally',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
    },
    {
        vendor: 'Peter',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
    },
    {
        vendor: 'Chris',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
    },
    {
        vendor: 'Michael',
        vendorSku: 'SC-C-QD025-08',
        minOrderQuantity: 100,
        leadTime: 30,
    },
]

const columnHelper = createColumnHelper<VendorProductsTableModel>();

const columns = [
    columnHelper.accessor('vendor', {
        header: () => <span>Vendor</span>,
        cell: info => <i>{info.getValue()}</i>,
    }),
    columnHelper.accessor('vendorSku', {
        header: () => <span>Vendor Sku</span>,
        cell: info => <i>{info.getValue()}</i>,
    }),
    columnHelper.accessor('minOrderQuantity', {
        header: () => <span>Min Order Qty</span>,
        cell: info => <i>{info.getValue()}</i>
    }),
    columnHelper.accessor('leadTime', {
        header: () => <span>Lead Time</span>,
        cell: info => <i>{info.getValue()}</i>,
    }),
]

export default function VendorProductsTable() {

    const [data, setData] = useState(() => [...defaultData]);
    const rerender = useReducer(() => ({}), {})[1];

    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    })

    return (
        <div>
            <div className={styles.buttonRow}>
                <Button variant='outline-dark' className={styles.grayButton}><b>NEW VENDOR PRODUCT</b></Button>
                <Button variant='outline-dark' className={styles.grayButton}><b>EDIT</b></Button>
                <Button variant='outline-dark' className={styles.grayButton}><b>SHOW INACTIVE</b></Button>
            </div>
            <div className={styles.scrollableTableContainer}>
                <table className={`${styles.listingSkuTable} ${tableStyles.productTable}`}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className={styles.listingSkuTableH}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className={styles.listingSkuTableBody}>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}
                                className={`${tableStyles.tableRow} ${row.id === selectedRowId ? tableStyles.selected : ''}`}
                                onClick={() => setSelectedRowId(row.id === selectedRowId ? null : row.id)}>
                                {row.getVisibleCells().map(cell => (
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
    )
}
