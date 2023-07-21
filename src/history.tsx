import React, { useEffect, useState, useRef } from 'react';
import { Stack, Text, FontWeights, ITextStyles, initializeIcons, Pivot, PivotItem} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { GroupCard, SmCard } from './Cards'
import { GraphModal } from './graphmodal';
import './App.css';
import { ProdSpecs, ProdLoad, PPACard, BasisCard, InflationCard, DiscountCard, ReactiveCard, EnergyCol, CapCol, RecCol, ElccCol } from './Chunks';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { historyprops } from './interfaces'
import { Route, Routes} from "react-router-dom"
import {
    PresenceBadgeStatus,
    Avatar,
    DataGridBody,
    DataGridRow,
    DataGrid,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridCell,
    TableCellLayout,
    TableColumnDefinition,
    createTableColumn,
    FluentProvider,
    webLightTheme,
    Link
  } from "@fluentui/react-components";

export const History: React.FunctionComponent<historyprops> = ({apiBase}) => {
    type ItemLabel = {
        label: string
    }
        
    type historydatatype = {
        project: ItemLabel;
        jobname: ItemLabel;
        status: ItemLabel;
        excel_link: ItemLabel;
        id: ItemLabel;
        [key: string]: unknown
    }


    const [historydata, setHistorydata] = useState<historydatatype[]>([
        {
            project: {label:'abc'},
            jobname: {label:'bcd'},
            status: {label:'cde'},
            excel_link: {label:'def'},
            id:{label:'edf'}
        }
    ]);
    const apiPollerTimer = useRef<NodeJS.Timeout>()

    const columns: TableColumnDefinition<historydatatype>[] = [
        createTableColumn<historydatatype>({
          columnId: "project",
          renderHeaderCell: () => {
            return "Project";
          },
          renderCell: (item:any) => {
            return (
              <TableCellLayout>
                {item.label}
              </TableCellLayout>
            );
          },
        }),
        createTableColumn<historydatatype>({
            columnId: "jobname",
            renderHeaderCell: () => {
              return "Job Name";
            },
            renderCell: (item:any) => {
              return (
                <TableCellLayout>
                  {item.label}
                </TableCellLayout>
              );
            },
          }),
          createTableColumn<historydatatype>({
            columnId: "status",
            renderHeaderCell: () => {
              return "Status";
            },
            renderCell: (item:any) => {
              return (
                <TableCellLayout>
                  {item.label}
                </TableCellLayout>
              );
            },
          }),
          createTableColumn<historydatatype>({
            columnId: "excel_link",
            renderHeaderCell: () => {
              return "Summary";
            },
            renderCell: (item:any) => {
              return (
                <TableCellLayout>
                    <Link href={item.label}>
                        Excel download
                    </Link>

                </TableCellLayout>
              );
            },
          }),       
    ]



    useEffect(()=> {
        const pollapi = async () => {
          const response = await fetch(apiBase.concat("/history"));
            try {
              if (response.ok) {
                  const jsonresp = await response.json()

                  //console.log("api up", text);
                  setHistorydata(jsonresp)
                } else {
                  console.log("api down");
                }
              } catch (error) {
              console.error("api really down:", error);
            }
        //   apiPollerTimer.current=setTimeout(pollapi, 3000)
        }
        pollapi();
        // return () => {
        //   clearTimeout(apiPollerTimer.current)
        // }
        // eslint-disable-next-line
      }, [])
    

    return (
    <FluentProvider theme={webLightTheme}>
        <DataGrid
            items={historydata }
            columns={columns}
            getRowId={(item) => item.label}
        >
        <DataGridHeader>
            <DataGridRow>
                    {({ renderHeaderCell }) => (
                        <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                     )}
            </DataGridRow>
        </DataGridHeader>
        <DataGridBody<historydatatype>>
            {({ item, rowId }) => (
            <DataGridRow<historydatatype>
                key={rowId}
            >
                {({ renderCell }) => (
                <DataGridCell>{renderCell(item)}</DataGridCell>
                )}
          </DataGridRow>       
                  )}
        </DataGridBody>         
        </DataGrid>

        
    </FluentProvider>)

}