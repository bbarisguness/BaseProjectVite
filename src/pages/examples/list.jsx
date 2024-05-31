/* eslint-disable prettier/prettier */
import PropTypes from 'prop-types';
import { useMemo, useState, Fragment, useEffect } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
    Chip,
    Divider,
    Stack,
    Button,
    Table,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
    TableContainer,
    Tooltip,
    Typography,
    Box,
    LinearProgress,
    Modal
} from '@mui/material';

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

//import CustomerModal from 'sections/examples/example-list/CustomerModal';
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
import { display, height, width } from '@mui/system';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import Loader from 'components/Loader';
import { Navigate } from 'react-router';
import { useNavigate  } from 'react-router-dom';

// ==============================|| REACT TABLE - LIST ||============================== //
const fallbackData = [];
function ReactTable({ data, columns, modalToggler, pagination, setPagination, setSorting, sorting, globalFilter, setGlobalFilter }) {

    const navigate = useNavigate();


    const table = useReactTable({
        data: data?.data || fallbackData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        pageCount: data?.meta?.pagination?.pageCount || 1,
        autoResetPageIndex: false,
        state: {
            sorting,
            globalFilter,
            pagination
        },
        debugTable: true
    });

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
                    placeholder={`Search ${data?.meta?.pagination?.total} records...`}
                />

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Button variant="contained" startIcon={<Add />} onClick={()=>{navigate("/examples/form");}} size="large">
                        Yeni Ekle
                    </Button>
                </Stack>
            </Stack>
            <ScrollX>
                <Stack>

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
                                                    style={{cursor:'pointer'}}
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
                                    <TableRow
                                        key={row.id}
                                        onClick={() => {
                                            console.log("Kayıt Id => ", row.original.id);
                                            navigate(`/examples/detail/${row.original.id}`)
                                        }}
                                        style={{cursor:'pointer'}}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
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
                                    getPageCount: table.getPageCount,
                                    initialPageSize: pagination.pageSize
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

export default function List() {
    const theme = useTheme();

    const [open, setOpen] = useState(false);

    const [sorting, setSorting] = useState([{ id: 'id', desc: true }]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [customerModal, setCustomerModal] = useState(false);
    const [villaModal, setVillaModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerDeleteId, setCustomerDeleteId] = useState('');
    const [isDeleted, setIsDeleted] = useState(false)

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    const [data, setData] = useState(() => []);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        VillaServices.Villas(pagination.pageIndex + 1, pagination.pageSize, sorting[0]?.desc, sorting[0]?.id.replace('attributes_', ''), globalFilter).then((res) => { setData(res); setLoading(false); });
    }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter]);

    useEffect(() => {
        setPagination({ ...pagination, pageIndex: 0 })
    }, [globalFilter])

    useEffect(() => {
        if (isDeleted) {
            setIsDeleted(false)
            setLoading(true)
            VillaServices.Villas(pagination.pageIndex + 1, pagination.pageSize, sorting[0]?.desc, sorting[0]?.id.replace('attributes_', ''), globalFilter).then((res) => { setData(res); setLoading(false); });
        }
    }, [isDeleted])


    const handleClose = () => {
        setOpen(!open);
    };

    const columns = useMemo(
        () => [
            {
                header: '#',
                cell: ({ row }) => { return row.original.id }
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
                cell: ({ row }) => { return row.original.attributes.region }
            },
            {
                header: 'Kapasite',
                cell: ({ row }) => { return row.original.attributes.person }
            },
            {
                header: 'Oda Sayısı',
                cell: ({ row }) => { return row.original.attributes.room }
            },
            {
                header: 'Online Rez.',
                accessorKey: 'attributes.onlineReservation',
                cell: (cell) => {
                    if (cell.getValue()) return <Chip color="success" label="Aktif" size="small" variant="light" />;
                    else return <Chip color="error" label="Pasif" size="small" variant="light" />;
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
                        <Stack direction="row" spacing={0}>
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

    // if (lists.length < 1) return <EmptyReactTable />;


    if (loading) return (<Loader open={loading} />)

    return (
        <>
            <ReactTable
                {...{
                    data,
                    columns,
                    modalToggler: () => {
                        setVillaModal(true);
                        setSelectedCustomer(null);
                    },
                    pagination,
                    setPagination,
                    setSorting,
                    sorting,
                    globalFilter,
                    setGlobalFilter
                }}
            />
            <AlertCustomerDelete setIsDeleted={setIsDeleted} setLoading={setLoading} id={Number(customerDeleteId)} title={customerDeleteId} open={open} handleClose={handleClose} />
            {/* <CustomerModal open={customerModal} modalToggler={setCustomerModal} customer={selectedCustomer} /> */}

            {/* <VillaModal open={villaModal} modalToggler={setVillaModal}/> */}
            {/* <CustomerModal open={villaModal} modalToggler={setVillaModal} /> */}
        </>
    );
}

ReactTable.propTypes = { data: PropTypes.any, columns: PropTypes.array, modalToggler: PropTypes.func, pagination: PropTypes.object, setPagination: PropTypes.func, setSorting: PropTypes.func, sorting: PropTypes.any, globalFilter: PropTypes.string, setGlobalFilter: PropTypes.func };
