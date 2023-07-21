import React, {useState} from 'react';
import { Modal, MessageBar, Text, Dropdown, IconButton } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { GroupCard } from './Cards'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
import type {ChartData} from 'chart.js';
import { GraphModalsprops, duckprops, month_summprops } from './interfaces';
import { Bar, Line } from 'react-chartjs-2';
import Lottie from "lottie-react";
import Hamster from "./hamster.json"
import { Toggle } from '@fluentui/react/lib/Toggle';
import { generateContrastingColors } from './color_generator'
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    //TimeScale,
    Title,
    Tooltip,
    Legend
  );

const cumornot = (array: number[], iscum:boolean) => {
    if (iscum) {
        let cumarray=[];
        let cursum=0;
        for (const num of array) {
            cursum+=num;
            cumarray.push(cursum)
        }
        return cumarray
    } else {
        return array
    }
}

// const getFullMonthName = (monthNumber:number) => {
//     const date = new Date(2000, monthNumber - 1); // Create a date with the specified month number (month numbers are zero-based)
//     const fullMonthName = date.toLocaleString('default', { month: 'long' }); // Get the full month name from the date
//     return fullMonthName;
//   }

const MonthNameToNumber = (Month:string) => {
    const date = new Date(`${Month} 1, 2000`); // Create a date with the specified month name and year
    const monthNumber = date.getMonth() + 1; // Get the month number (Note: month numbers are zero-based, so we add 1)
    return monthNumber;
}

const makeDuckData = (monthName:string, rawduck:duckprops|null) => {
    if (rawduck===null) return null as unknown as ChartData<'line'>
    const monnum = MonthNameToNumber(monthName);
    const ducksort = rawduck.filter((item)=>item.month===monnum).sort((a,b) => { 
        if(a.Year<b.Year) return -1;
        if(a.Year>b.Year) return 1;
        return a.Hourend-b.Hourend})
    const Years = [...new Set(ducksort.map((item) => item.Year))]
    const labels:number[] = Array.from({length:24}, (_,index)=>index+1)
    let datasets:any[]=[]
    const somecolors = generateContrastingColors(Years.length)
    const alphaValue = '0.5';
    Years.forEach((Year, index)=> {
        datasets.push({
            label: Year.toString(),
            data: ducksort.filter((item)=>item.Year===Year).map((item)=>item.price),
            borderColor: somecolors[index],
            backgroundColor: `${somecolors[index].slice(0, -1)}, ${alphaValue})`
        })
    })
    if (datasets===undefined) return null as unknown as ChartData<'line'>
    return {
        labels: labels as number[],
        datasets: datasets
    } as ChartData<'line'>
}
const makeTBData = (TBMWh:boolean, sorteddata:month_summprops) => {
    if (sorteddata===null) return null as unknown as ChartData<'line'>
    const labels:string[] = sorteddata.map((item)=> item.Monthly)
    const denom4 = TBMWh?4:1
    const denom2 = TBMWh?2:1
    const somecolors = generateContrastingColors(2)
    const alphaValue = '0.5';
    const datasets = [
        {
            label: "TB2",
            data: sorteddata.map((item)=>item.TB2_Revenue_mw/denom2),
            borderColor: somecolors[0],
            backgroundColor: `${somecolors[0].slice(0, -1)}, ${alphaValue})`            
        },
        {
            label: "TB4",
            data: sorteddata.map((item)=>item.TB4_Revenue_mw/denom4),
            borderColor: somecolors[1],
            backgroundColor: `${somecolors[1].slice(0, -1)}, ${alphaValue})`            
        }        
    ]
    return {
        labels: labels,
        datasets: datasets
    }  as ChartData<'line'>
}


const AllMonths = [
    {
        "key": "January",
        "text": "January"
    },
    {
        "key": "February",
        "text": "February"
    },
    {
        "key": "March",
        "text": "March"
    },
    {
        "key": "April",
        "text": "April"
    },
    {
        "key": "May",
        "text": "May"
    },
    {
        "key": "June",
        "text": "June"
    },
    {
        "key": "July",
        "text": "July"
    },
    {
        "key": "August",
        "text": "August"
    },
    {
        "key": "September",
        "text": "September"
    },
    {
        "key": "October",
        "text": "October"
    },
    {
        "key": "November",
        "text": "November"
    },
    {
        "key": "December",
        "text": "December"
    }
]

export const GraphModal: React.FC<GraphModalsprops> = ({isOpen, onDismiss, monthData, duckData, hideModal }) => {
    let modalcontent
    const [TBMWh, {toggle:toggleTBMWh}] = useBoolean(true)
    const [MonthNm, setMonthNm] = useState("July")
    const [useCumulative, { toggle: toggleCum}] = useBoolean(false);
    if (monthData===null || monthData.length===0) {
        modalcontent = (
            <div>
            <Lottie animationData={Hamster} loop={true} style={{width: '80%', height: '80%'}}/>
            <Text>Processing</Text>
            <MessageBar delayedRender={false} role="none">
                You may close this window at any time, the server will keep working regardless.
            </MessageBar>
            </div>
        )
    } else if (monthData!==null && monthData.length>0) {
        
        const sorted_rev = [...monthData].sort((a, b) => a.Monthly.localeCompare(b.Monthly))
        const Revenue_labels = sorted_rev.map((item)=>item.Monthly)
        const Somecolrs=generateContrastingColors(5)
        const Revenue_data = {
            labels: Revenue_labels,
            datasets: [
                {
                    label: "PPA Energy",
                    data: cumornot(sorted_rev.map((item)=>item.ppa_revenue), useCumulative),
                    backgroundColor: Somecolrs[0],
                },
                {
                    label: "Merchant Energy",
                    data: cumornot(sorted_rev.map((item)=> item.merchant_revenue), useCumulative),
                    backgroundColor: Somecolrs[1]
                },
                {
                    label: "REC",
                    data: cumornot(sorted_rev.map((item)=> item.rec_revenue), useCumulative),
                    backgroundColor: Somecolrs[2]
                },
                {
                    label: "Capacity",
                    data: cumornot(sorted_rev.map((item)=> item.cap_revenue), useCumulative),
                    backgroundColor: Somecolrs[3]
                },
                {
                    label: "Reactive",
                    data: cumornot(sorted_rev.map((item)=> item.reactive_rev), useCumulative),
                    backgroundColor: Somecolrs[4]
                }
            ]
        }
        const Revenue_opts = {
            plugins: {
            //   title: {
            //     display: true,
            //     text: 'Revenue Estimate',
            //   },
              legend: {
                position: 'right' as const,
              },
            },
            responsive: true,
            interaction: {
                mode: 'index' as const,
                intersect: false,
              },
            scales: {
              x: {
                //type: 'time' as const,
                stacked: true,
              },
              y: {
                stacked: true,
                ticks: {
                    callback: (tickValue:number|string) => {
                        const value = parseFloat(tickValue as string);
                        return "$" + parseFloat(value.toFixed(0)).toLocaleString();
                    }
                }
                // https://www.chartjs.org/docs/latest/axes/labelling.html
                }
              },
              maintainAspectRatio: false
            }
        const minY = (duckData!==null)?Math.min(...duckData.map((item)=>item.price)):0
        const maxY = (duckData!==null)?Math.max(...duckData.map((item)=>item.price)):100
        const Duck_opts = {
                plugins: {
                //   title: {
                //     display: true,
                //     text: 'Revenue Estimate',
                //   },
                  legend: {
                    position: 'right' as const,
                  },
                },
                responsive: true,
                interaction: {
                    mode: 'index' as const,
                    intersect: false,
                  },
                scales: {
                  x: {
                    //type: 'time' as const,
                    stacked: true,
                  },
                  y: {
                    stacked: false,
                    min:Math.floor(minY/10)*10,
                    max:Math.ceil(maxY/10)*10,
                    ticks: {
                        callback: (tickValue:number|string) => {
                            const value = parseFloat(tickValue as string);
                            return "$" + parseFloat(value.toFixed(2)).toLocaleString();
                        },

                    }
                    // https://www.chartjs.org/docs/latest/axes/labelling.html
                    }
                  },
                  maintainAspectRatio: false
                }

        const TB_opts = {
            plugins: {
            //   title: {
            //     display: true,
            //     text: 'Revenue Estimate',
            //   },
                legend: {
                position: 'right' as const,
                },
            },
            responsive: true,
            interaction: {
                mode: 'index' as const,
                intersect: false,
                },
            scales: {
                x: {
                //type: 'time' as const,
                stacked: true,
                },
                y: {
                stacked: false,
                title: {
                    display: true,
                    text: (TBMWh)?"$/MWh/day Battery Nameplate":"$/MW/day Battery Nameplate"
                },
                ticks: {
                    callback: (tickValue:number|string) => {
                        const value = parseFloat(tickValue as string);
                        return "$" + parseFloat(value.toFixed(2)).toLocaleString();
                    },

                }
                // https://www.chartjs.org/docs/latest/axes/labelling.html
                }
                },
                maintainAspectRatio: false
            }

        modalcontent = (
        <div style={{width: '80dvw', height: '90dvh', margin: '10px'}}>

            <GroupCard title="Revenue Estimates">
                <div style={{height: '32dvh'}}>
                    <Bar options={Revenue_opts} data={Revenue_data}/>
                </div>
                <div style={{height: '3dvh'}}>
                    <Toggle label="Show Cumulative" inlineLabel onChange={toggleCum} checked={useCumulative}/>
                </div>
            </GroupCard>
            <GroupCard title="Duck Curves">
                <div style={{height: '32dvh'}}>
                    <Line options={Duck_opts} data={makeDuckData(MonthNm, duckData)}/>
                </div>
                <div style={{height: '6dvh'}}>
                <Dropdown
                    label="Month"
                    onChange={(e, i) => {if (i && typeof i.key==='string') {
                        setMonthNm(i.key)
                    }}}
                    // placeholder="Choose a provider"
                    options={AllMonths}
                    selectedKey={MonthNm}
            />         
                </div>
            </GroupCard>
            <GroupCard title="TB Estimates">
                <div style={{height: '32dvh'}}>
                    <Line options={TB_opts} data={makeTBData(TBMWh, sorted_rev)}/>
                </div>
                <div style={{height: '3dvh'}}>
                    <Toggle label="Energy or Power" inlineLabel onChange={toggleTBMWh} checked={TBMWh} onText="Energy" offText="Power"/>
                </div>                
            </GroupCard>
        </div>
        )
    };
    return (
    <>
    <Modal
        isOpen={isOpen}
        onDismiss={onDismiss}
        isModeless={true}
    >
        <Text>Results</Text>
        <IconButton style={{position:'absolute', top:0, right:0, zIndex:100}} iconProps={{ iconName: 'ChromeClose'}} onClick={hideModal}/>
        {modalcontent}
    </Modal>
    </>)
}