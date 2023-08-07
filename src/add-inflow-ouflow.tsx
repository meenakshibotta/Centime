import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField, Tooltip } from "@material-ui/core";
import { Delete, Edit } from "@mui/icons-material";
import MaterialReactTable, { MRT_Cell, MRT_ColumnDef, MaterialReactTableProps, } from "material-react-table";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "./store/state";
import { actions } from "./store/reducer";
import { useTranslation } from "react-i18next";
import { Link, Node } from "./type";

export default function Inflow_outflow() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const { t } = useTranslation();
    const tabledata = useSelector((state: State) => state.inflowOutFlowData?.links ?? []);
    const nodes = useSelector((state: State) => state.inflowOutFlowData?.nodes ?? []);
    const dispatch = useDispatch<any>();
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});
    const handleCreateNewRow = (values: any) => {
        const node = addNodes(values, nodes);
        dispatch(actions.addIlowOutFlowData({ values, node }))
    };
    const handleSaveRowEdits: MaterialReactTableProps<any>['onEditingRowSave'] =
        async ({ exitEditingMode, row, values }) => {
            if (!Object.keys(validationErrors).length && tabledata) {
                const node = addNodes(values as Link, nodes);
                dispatch(actions.updatedata({ rowIndex: row.index, value: values, nodes: node }));
                exitEditingMode(); //required to exit editing mode and close modal
            }
        };
    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };
    const handleDeleteRow = useCallback(
        (row: any) => {
            dispatch(actions.deleteData({ rowIndex: row.index }));
        },
        [tabledata],
    );
    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<any>,
        ): MRT_ColumnDef<any>['muiTableBodyCellEditTextFieldProps'] => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
                onBlur: (event: any) => {
                    if (!event.target!.value) {
                        setValidationErrors({
                            ...validationErrors,
                            [cell.id]: `${cell.column.columnDef.header} is required`,
                        });
                    } else {
                        delete validationErrors[cell.id];
                        setValidationErrors({
                            ...validationErrors,
                        });
                    }
                },
            };
        },
        [validationErrors],
    );
    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'source',
                header: 'Source From',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'target',
                header: 'Expenditure',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'value',
                header: 'Value',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
        ],
        [getCommonEditTextFieldProps],
    )
    return <>
        <MaterialReactTable
            displayColumnDefOptions={{
                'mrt-row-actions': {
                    muiTableHeadCellProps: {
                        align: 'center',
                    },
                    size: 120,
                },
            }}
            columns={columns}
            data={tabledata as any[]}
            editingMode="modal" //default
            enableColumnFilterModes={false}
            enableEditing
            enableColumnActions={false}
            enableFilterMatchHighlighting={false}
            onEditingRowSave={handleSaveRowEdits}
            onEditingRowCancel={handleCancelRowEdits}
            renderRowActions={({ row, table }) => (
                <Box >
                    <Tooltip arrow placement="left" title="Edit">
                        <IconButton onClick={() => table.setEditingRow(row)}>
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip arrow placement="right" title="Delete">
                        <IconButton onClick={() => handleDeleteRow(row)}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
            enableGlobalFilter={false}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            enableColumnFilters={false}
            renderTopToolbarCustomActions={() => (
                <Button
                    color="secondary"
                    onClick={() => setCreateModalOpen(true)}
                    variant="contained"
                >
                    {t('main.addExpenditure')}
                </Button>
            )}
        />
        <CreateNewAccountModal
            columns={columns}
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateNewRow}
        />
    </>
}

interface CreateModalProps {
    columns: MRT_ColumnDef<any>[];
    onClose: () => void;
    onSubmit: (values: any) => void;
    open: boolean;
}

export const CreateNewAccountModal = ({
    open,
    columns,
    onClose,
    onSubmit,
}: CreateModalProps) => {
    const [values, setValues] = useState<any>(() =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {} as any),
    );

    const handleSubmit = () => {
        //put your validation logic here
        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle >Create New Account</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div
                    >
                        {columns.map((column) => (
                            <TextField
                                key={column.accessorKey as any}
                                label={column.header}
                                name={column.accessorKey as any}
                                onChange={(e) =>
                                    setValues({ ...values, [e.target.name]: e.target.value })
                                }
                            />
                        ))}
                    </div>
                </form>
            </DialogContent>
            <DialogActions >
                <Button onClick={onClose}>Cancel</Button>
                <Button color="secondary" onClick={handleSubmit} variant="contained">
                    Add Expenditure
                </Button>
            </DialogActions>
        </Dialog>
    );
};

function addNodes(values: Link, nodes: Node[]) {
    const node: Node[] = JSON.parse(JSON.stringify(nodes))
    const source = node.some((n) => n.name === values.source);
    const target = node.some((n) => n.name === values.target);
    if (!source) {
        node.push({ name: values.source, category: 'outflow' })
    }
    if (!target) {
        node.push({ name: values.target, category: 'outflow' })
    }
    return node;
}