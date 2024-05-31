// // react
// import { useState, useEffect } from 'react';

// // material-ui
// import Typography from '@mui/material/Typography';

// // project-imports
// import MainCard from 'components/MainCard';
// import { VillaServices } from 'services';

// export default function ExampleList() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     VillaServices.Villas().then((res) => { console.log(res.data); setData(res.data); setIsLoading(false) });
//   }, []);



//   if (isLoading) return <h1>Loading</h1>;
//   else
//     return (
//       <MainCard title="Example List">
//         <h1>Example List</h1>
//         {data.map((item, index) => (
//           <Typography variant="body1" key={index}>
//             {item.attributes.name}
//           </Typography>
//         )
//         )}
//       </MainCard>
//     );
// }





import PropTypes from 'prop-types';
import { useMemo, useState, Fragment, useEffect } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { Chip, Divider, Stack, Button, Table, TableCell, TableBody, TableHead, TableRow, TableContainer, Tooltip, Typography, Box } from '@mui/material';

// third-party
import { PatternFormat } from 'react-number-format';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    useReactTable
} from '@tanstack/react-table';

// project-import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

import CustomerModal from 'sections/examples/example-list/CustomerModal';
import AlertCustomerDelete from 'sections/examples/example-list/AlertCustomerDelete';
import CustomerView from 'sections/examples/example-list/CustomerView';
import EmptyReactTable from 'pages/global-pages/empty-data';

import {
    CSVExport,
    DebouncedInput,
    HeaderSort,
    IndeterminateCheckbox,
    RowSelection,
    SelectColumnSorting,
    TablePagination
} from 'components/third-party/react-table';

import { useGetCustomer } from 'api/customer';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import { Add, Edit, Eye, Trash } from 'iconsax-react';

// custom
import { VillaServices } from 'services';

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, modalToggler }) {


    const theme = useTheme();
    const [sorting, setSorting] = useState([{ id: 'id', desc: false }]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
        data,
        columns,
        state: {
            columnFilters,
            sorting,
            rowSelection,
            globalFilter
        },
        enableRowSelection: true,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        getRowCanExpand: () => true,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true
    });

    const backColor = alpha(theme.palette.primary.lighter, 0.1);

    let headers = [];
    columns.map(
        (columns) =>
            // @ts-ignore
            columns.accessorKey &&
            headers.push({
                label: typeof columns.header === 'string' ? columns.header : '#',
                // @ts-ignore
                key: columns.accessorKey
            })
    );

    return (
        <MainCard content={false}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 3 }}>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onFilterChange={(value) => setGlobalFilter(String(value))}
                    placeholder={`Search ${data.length} records...`}
                />

                {/* <Stack direction="row" alignItems="center" spacing={2}>                    
                    <Button variant="contained" startIcon={<Add />} onClick={modalToggler} size="large">
                        Add Customer
                    </Button>                    
                </Stack> */}
            </Stack>
            <ScrollX>
                <Stack>
                    <RowSelection selected={Object.keys(rowSelection).length} />
                    <TableContainer>
                        <Table>
                            <TableHead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                                                Object.assign(header.column.columnDef.meta, {
                                                    className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                                                });
                                            }

                                            return (
                                                <TableCell
                                                    key={header.id}
                                                    {...header.column.columnDef.meta}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    {...(header.column.getCanSort() &&
                                                        header.column.columnDef.meta === undefined && {
                                                        className: 'cursor-pointer prevent-select'
                                                    })}
                                                >
                                                    {header.isPlaceholder ? null : (
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                                                            {header.column.getCanSort() && <HeaderSort column={header.column} />}
                                                        </Stack>
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHead>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => (
                                    <Fragment key={row.id}>
                                        <TableRow onClick={() => {
                                            console.log(row.id);
                                        }}>
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                        {row.getIsExpanded() && (
                                            <TableRow sx={{ bgcolor: backColor, '&:hover': { bgcolor: `${backColor} !important` }, overflow: 'hidden' }}>
                                                <TableCell colSpan={row.getVisibleCells().length} sx={{ p: 2.5, overflow: 'hidden' }}>
                                                    <CustomerView data={row.original} />
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <>
                        <Divider />
                        <Box sx={{ p: 2 }}>
                            <TablePagination
                                {...{
                                    setPageSize: table.setPageSize,
                                    setPageIndex: table.setPageIndex,
                                    getState: table.getState,
                                    getPageCount: table.getPageCount
                                }}
                            />
                        </Box>
                    </>
                </Stack>
            </ScrollX>
        </MainCard>
    );
}
// ==============================|| CUSTOMER LIST ||============================== //

export default function ExampleBasicList() {
    const theme = useTheme();
    const [lists, setLists] = useState([])

    useEffect(() => {
        VillaServices.Villas().then(res => setLists(res.data))

    }, [])
    //console.log('data : ', lists);

    const [open, setOpen] = useState(false);

    const [customerModal, setCustomerModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerDeleteId, setCustomerDeleteId] = useState('');

    const handleClose = () => {
        setOpen(!open);
    };

    const columns = useMemo(
        () => [

            {
                header: '#',
                accessorKey: 'id',
                meta: {
                    className: 'cell-center'
                }
            },
            {
                header: 'Villa Adı',
                accessorKey: 'attributes.name',
                cell: ({ row, getValue }) => (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                            alt="Avatar"
                            size="sm"
                            src={getImageUrl(`avatar-${!row.original.avatar ? 1 : row.original.avatar}.png`, ImagePath.USERS)}
                        />
                        <Stack spacing={0}>
                            <Typography variant="subtitle1">{getValue()}</Typography>
                        </Stack>
                    </Stack>
                )
            },
            {
                header: 'Bölge',
                accessorKey: 'attributes.region'
              },
              {
                header: 'Kapasite',
                accessorKey: 'attributes.person'
              },
              {
                header: 'Oda Sayısı',
                accessorKey: 'attributes.room'
              },
            {
                header: 'Online Rez.',
                accessorKey: 'attributes.onlineReservation',
                cell: (cell) => {
                    
                    if(cell.getValue())
                        return <Chip color="success" label="Aktif" size="small" variant="light" />;
                    else 
                        return <Chip color="error" label="Pasif" size="small" variant="light" />;    
                    // switch (cell.getValue()) {
                    //     case 3:
                    //         return <Chip color="error" label="Rejected" size="small" variant="light" />;
                    //     case 1:
                    //         return <Chip color="success" label="Verified" size="small" variant="light" />;
                    //     case 2:
                    //     default:
                    //         return <Chip color="info" label="Pending" size="small" variant="light" />;
                    // }
                }
            },
            {
                header: 'Actions',
                meta: {
                    className: 'cell-center'
                },
                disableSortBy: true,
                cell: ({ row }) => {
                    const collapseIcon =
                        row.getCanExpand() && row.getIsExpanded() ? (
                            <Add style={{ color: theme.palette.error.main, transform: 'rotate(45deg)' }} />
                        ) : (
                            <Eye />
                        );
                    return (
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
                            <Tooltip title="View">
                                <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                                    {collapseIcon}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                                <IconButton
                                    color="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCustomer(row.original);
                                        setCustomerModal(true);
                                    }}
                                >
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton
                                    color="error"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClose();
                                        setCustomerDeleteId(Number(row.original.id));
                                    }}
                                >
                                    <Trash />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    );
                }
            }
        ], // eslint-disable-next-line
        [theme]
    );

    if (lists.length < 1) return <EmptyReactTable />;

    return (
        <>
            <ReactTable
                {...{
                    data: lists,
                    columns,
                    modalToggler: () => {
                        setCustomerModal(true);
                        setSelectedCustomer(null);
                    }
                }}
            />
            <AlertCustomerDelete id={Number(customerDeleteId)} title={customerDeleteId} open={open} handleClose={handleClose} />
            <CustomerModal open={customerModal} modalToggler={setCustomerModal} customer={selectedCustomer} />
        </>
    );
}

ReactTable.propTypes = { data: PropTypes.array, columns: PropTypes.array, modalToggler: PropTypes.func };