import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table';
import mData from './MOCK_DATA.json';
import { useMemo, useState } from 'react';
import { IconButton } from '@mui/material';
import { IconCirclePlus } from '@tabler/icons-react';
import { Form } from 'react-hook-form';
import { Modal } from 'react-bootstrap';
import ScrollableForm from './form/ScrollableForm';
import AddEditProductDialog from './AddEditProductDialog';
import { Product as ProductModel } from '../models/product';

export default function ProductTable() {

    const data = useMemo(() => mData, [])

    /** @type import('@tanstack/react-table').ColumnDef<any>*/
    const columns = [
        {
            header: 'ID',
            accessorKey: 'id',
            footer: 'ID',
        },
        {
            header: 'Product Name',
            accessorKey: 'productName',
            footer: 'Product Name',
        },
        {
            header: 'Manufacturer Sku',
            accessorKey: 'manufacturerSku',
            footer: 'Manufacturer Sku',
        },
        {
            header: 'Barcode',
            accessorKey: 'barcode',
            footer: 'Barcode',
        },
        {
            header: 'Weight',
            accessorKey: 'weight',
            footer: 'Weight',
        },
    ]

    // Sets states for sorting and searching/filtering of the table
    const [sorting, setSorting] = useState([
        // Initial state of table sorting is ascending order by product name
        { id: "productName", desc: false }
    ])
    const [filtering, setFiltering] = useState('')

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting: sorting,
            globalFilter: filtering,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
        sortDescFirst: false,
    })

    const [products, setProducts] = useState<ProductModel[]>([]);
    const [showAddProductDialog, setShowAddProductDialog] = useState(false);

    const openAddProductDialog = () => {
        setShowAddProductDialog(true);
    }
    const closeAddProductDialog = () => {
        setShowAddProductDialog(false);
    }

    return <div className="w3-container">
        {/* Creates global search bar for table */}
        <input type="text" value={filtering} onChange={e => setFiltering(e.target.value)} placeholder='Search...' />
        <table className="w3-table-all">
            <thead>
                {/* Render headers */}
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                            {flexRender(header.column.columnDef.header,
                                header.getContext()
                            )}
                            {
                                header.column.getIsSorted() === 'asc' ? '🔼' : header.column.getIsSorted() === 'desc' ? '🔽' : null
                            }

                        </th>)}
                    </tr>
                ))}
            </thead>
            <tbody>
                {/* Render the rows of the table and their bodies */}
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
        {/* Render pagination guiding */}
        <div>
            <button onClick={() => table.setPageIndex(0)}>First Page</button>
            <button disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>Previous Page</button>
            <button disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>Next Page</button>
            <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>Last Page</button>
        </div>
        <IconButton onClick={() => openAddProductDialog()}>
            <IconCirclePlus size={50} stroke={3} color='#2fb344'></IconCirclePlus>
        </IconButton>
        {showAddProductDialog &&
            <AddEditProductDialog
                onDismiss={() => setShowAddProductDialog(false)}
                onProductSaved={(newProduct) => {
                    setProducts([...products, newProduct]);
                    setShowAddProductDialog(false);
                }}
            />
        }
    </div>
}