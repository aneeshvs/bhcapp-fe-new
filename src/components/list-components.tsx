'use client';
import 'mantine-datatable/styles.css';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import { DataTable  } from 'mantine-datatable';
import React from 'react';



/* eslint-disable */
interface ChildProps {
    listData: {
        current_page: number,
        data: any[],
        first_page_url: string,
        from: number|null,
        last_page: number|null,
        last_page_url: string,
        links:any[],
        next_page_url:string|null,
        per_page:number,
        to:number|null,
        total:number,
        page:number
    },
    onPageChange: (newPage: number) => void;
    onPerPageChange?: (newPerPage: number) => void;
    columnData?: any[];
    groups?: any[];
  }
/* eslint-enable */


const ListComponents = ({ listData, columnData, groups, onPageChange}: ChildProps) => {
    return (
        <div className="datatables pagination-padding">
            <DataTable
                className="table-hover whitespace-nowrap"
                records={listData.data}
                columns={columnData}
                groups={groups}
                highlightOnHover
                styles={{
                    headerGroup: {
                        backgroundColor: '#ffff00', // Yellow from image
                        color: '#000',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    },
                    header: {
                        backgroundColor: '#87ceeb', // Light Blue from image
                        color: '#000',
                        fontWeight: 'bold'
                    }
                }}
                withTableBorder
                withColumnBorders
                totalRecords={listData.total}
                recordsPerPage={listData.per_page}
                page={listData.current_page}
                onPageChange={onPageChange}
                //onPageChange={(p) => setPage(p)}
                // recordsPerPageOptions={PAGE_SIZES}
                // onRecordsPerPageChange={setPageSize}
                paginationText={({ from, to, totalRecords }) =>
                    `Showing ${from} to ${to} of ${totalRecords} entries` // Fixed parameter names
                }
            />
        </div>
    );
};

export default ListComponents;
