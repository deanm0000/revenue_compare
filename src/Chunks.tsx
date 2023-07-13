import React, { useState, useEffect } from 'react';
import { Text, FontWeights, ITextStyles, Dropdown, IDropdownOption } from '@fluentui/react';
import { ChoiceGroup } from '@fluentui/react/lib/ChoiceGroup';
import { GroupCard, SmCard } from './Cards'
import { DropdownT, NumInput, DateInput } from './Inputs'
import { IconButton } from '@fluentui/react/lib/Button';
import './App.css';

export const boldStyle: Partial<ITextStyles> = { root: { fontWeight: FontWeights.semibold } };

interface paramsprops {
    setAllParams: React.Dispatch<React.SetStateAction<any>>;
    allParams: any;
}

export const ProdLoad: React.FC<paramsprops> = ({ allParams, setAllParams }) => {
    const [availCols, setAvailCols] = useState([{key:'',text:''}]);
    const [initCol, setinitCol] = useState<string | null>(null);
    useEffect(() => {
        fetch("/api/prodfiles", {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*', // Replace with the appropriate origin
            }})
        .then(response=>response.json())
        .then(data=>dropify(data))
        .then(dlist=>setDropFiles(dlist))
      }, [])
    const fileDropPick = (e: React.FormEvent<HTMLDivElement>, i?: IDropdownOption) => {
        if (i !== undefined) {
            fetch("/api/prodcols", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name:i.key})
            })
            .then(response=>response.json())
            .then(data=>dropify(data))
            .then(dlist=>setAvailCols(dlist))
            setinitCol(null)
            setAllParams(Object.fromEntries(
            Object.entries({...allParams, prodfile:i.key}).filter(([key, value]) => key !== 'prodcol')
            ))
        }
    }
    const dropify = (data: string[]) => {
        let droplist=[];
        for (let i=0; i<data.length; i++) {
            droplist.push({key:data[i], text:data[i]});
        }
        return droplist
    }
    const [DropFiles, setDropFiles] = useState([{key:'',text:''}]);
    return (
        <>
            <Text variant="large" styles={boldStyle}>Select Existing 8760</Text>
            <div className="ms-Grid-row">
            <div className='ms-Grid-col ms-sm9'>
                <DropdownT 
                label="Files" 
                tooltip="Choose a file that was previously uploaded"
                onChange={(e, i) => fileDropPick(e,i)}
                placeholder="Select a file"
                options={DropFiles}    
                />                      
            </div>
            <div className='ms-Grid-col ms-sm3'>
            <DropdownT 
                label="Select Output Column" 
                tooltip="For Revenue Summary pick E_Grid, For Ascend export pick EArrMPP"
                onChange={(e, i) => {if (i && typeof i.key==='string') {
                    setAllParams({...allParams, prodcol:i.key});
                    setinitCol(i.key)}}}
                placeholder="Select a file"
                options={availCols}
                selectedKey={initCol}
                usesk={true}
                />                             
            </div>
            </div>
        </>
    )

}
export const ProdSpecs: React.FC<paramsprops> = ({ allParams, setAllParams }) => (
    <>
        <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm4">
            <NumInput
                label="Max Output (MW)"
                tooltip="For Revenue modeling purposes, this is the POI limit and the Volume used for Capacity Revenue. For Ascend conversion it is the inverter MW limit for AC coupled systems of the site"
                onChange={(e,i)=>{setAllParams({...allParams, maxout:i})}}
                min={0} 
                max={1000}
                defaultValue={(allParams.maxout) ? (allParams.maxout): '0'}
                step={1}
                />
            </div>
            <div className="ms-Grid-col ms-sm4">
            <NumInput
                label="Enter Availability (%)"
                tooltip="The haircut taken to production as proxy for availability. For revenue modeling if choosing a PVSYST column where this has already been calculated by enginerring, change this to 100"
                onChange={(e,i)=>{setAllParams({...allParams, availability:i})}}
                min={0} 
                max={100}
                defaultValue={(allParams.availability) ? (allParams.availability): '0'}
                step={1}
                />
            </div>
            <div className="ms-Grid-col ms-sm4">
            <NumInput
                label="Degradation (decimal)"
                tooltip="Annual rate of degradation which will start from the COD"
                onChange={(e,i)=>{setAllParams({...allParams, degradation:i})}}
                min={0} 
                max={1}
                defaultValue={(allParams.degradation) ? (allParams.degradation): '0'}
                step={0.0001}
                />
            </div>                  
        </div>
        <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm4">
            <DateInput
                label="Beginning Date of Report"
                tooltip={`Make this later than COD if you want a shorter report. 
                    "When this is set to earlier than COD, it will have the same effect as being equal to COD`}
                onSelectDate={(date)=>setAllParams({...allParams, reportbegin:date})}
                value={(allParams.reportbegin instanceof Date) ? (allParams.reportbegin) : (new Date(2022,1,1))}
                />
            </div>
            <div className="ms-Grid-col ms-sm4">
            <DateInput
                label="Commercial Operations Date"
                tooltip={`The year that degradation begins (when the site is live).
                The allows a smaller window of results to be returned while still applying degradation and inflation.`}
                onSelectDate={(date)=>setAllParams({...allParams, cod:date})}
                value={(allParams.cod instanceof Date) ? (allParams.cod) : (new Date(2022,1,1))}
                />
            </div>
            <div className="ms-Grid-col ms-sm4">
            <DateInput
                    label="End Date of Report"
                    tooltip={`The last year that results should be returned. If datasets end sooner than this then no extrapolation will happen and results will end when they end.`}
                    onSelectDate={(date)=>setAllParams({...allParams, reportend:date})}
                    value={(allParams.reportend instanceof Date) ? (allParams.reportend) : (new Date(2022,1,1))}
                    />
            </div>                  
        </div>  
    </>
)
export const PPACard: React.FC<paramsprops> = ({ allParams, setAllParams }) => {
    const [showPPAdate, setshowPPAdate] =  useState('block');
    return (
        <GroupCard title="PPA">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm4">
            <NumInput
                label="PPA Price ($/MWh)"
                tooltip="Price is assumed to be nominal"
                onChange={(e,i)=>{setAllParams({...allParams, ppaprice:i})}}
                min={0} 
                max={1000}
                defaultValue={(allParams.ppaprice) ? (allParams.ppaprice): '0'}
                step={0.01}
                />
          </div>
          <div className="ms-Grid-col ms-sm4">
            <NumInput
                label="PPA Portion (%)"
                tooltip="Percent of output dedicated to PPA"
                onChange={(e,i)=>{setAllParams({...allParams, ppaportion:i})}}
                min={0} 
                max={100}
                defaultValue={(allParams.ppaportion) ? (allParams.ppaportion): '0'}
                step={1}
                />
          </div>
        </div>
        <div className='ms-Grid-row'>
          <div className="ms-Grid-col ms-sm4" style={{display: showPPAdate}}>
            <DateInput
                label="First Date with no PPA"
                tooltip="The day after the PPA expires"
                onSelectDate={(date)=>setAllParams({...allParams, ppaend:date})}
                value={(allParams.ppaend instanceof Date) ? (allParams.ppaend) : (new Date(2022,1,1))}
                />
          </div>
          <div className="ms-Grid-col ms-sm4" style={{display: (showPPAdate==='block'?'none':'block')}}>
            <NumInput
                  label="PPA term (years)"
                  tooltip="Will calculate end date as COD + number of years"
                  onChange={(e,i)=>{
                    if (i && allParams.cod) {
                      let newDate=new Date(allParams.cod.getTime());
                      newDate.setFullYear(newDate?.getFullYear()+parseInt(i,10));
                      setAllParams({...allParams, ppaend:newDate})};
                  }}
                  min={0} 
                  max={100}
                  defaultValue={'0'}
                  step={1}
                  />
          </div>
          <div className="ms-Grid-col ms-sm4">
            <ChoiceGroup 
              defaultSelectedKey="D"
              options={[
                {key:'D', text:'Date'},
                {key: 'Y', text:'Term in Years'}
              ]}
              onChange={(e,i)=>((i) && (i.key==='D'))?setshowPPAdate('block'):setshowPPAdate('none')}

              />
          </div>                      
        </div>
      </GroupCard>
    )
}
interface basisType {
    startdate: Date;
    dollar: string;
    perc: string;
}
export const BasisCard: React.FC<paramsprops> = ({ allParams, setAllParams }) => {
    let element_cards: any
    const closeIcon = { iconName: "ChromeClose"}
    const newIcon = { iconName: "BuildQueueNew"}
    if (allParams.basis) {
        element_cards = allParams.basis.map((item: basisType, index: number) => (
            <SmCard key={index}>
                <div className="ms-Grid-row">
                    {(index>0) && <IconButton style={{position:'absolute', top:0, right:0, zIndex:100}} iconProps={closeIcon} onClick={() => {
                        const basiscopy:any = [...allParams.basis]
                        const basisend = basiscopy.splice(index+1)
                        const basisbeg = basiscopy.splice(0, index)
                        setAllParams({...allParams, basis: basisbeg.concat(basisend)})
                    }}/>}
                    <div className="ms-Grid-col ms-sm4">
                    <DateInput
                                label="Date"
                                tooltip="The basis will apply from this date until another preempts it"
                                onSelectDate={(date)=> {
                                    let allcopy:any = Object.fromEntries(Object.entries(allParams))
                                    allcopy.basis[index]['startdate'] = date
                                    setAllParams(allcopy)}
                                }
                                value={allParams.basis[index]['startdate']}
                            />
                    </div>
                    <div className="ms-Grid-col ms-sm4">
                    <NumInput
                        label="Basis $/MWh"
                        tooltip="The basis in terms of $/MWh"
                        onChange={(e,i)=>{
                            let allcopy:any = Object.fromEntries(Object.entries(allParams))
                            allcopy.basis[index]['dollar']=i
                            setAllParams(allcopy)}
                        }
                        min={-100} 
                        max={100}
                        defaultValue={allParams.basis[index]['dollar']}
                        step={0.01}
                        />     
                    </div>
                    <div className="ms-Grid-col ms-sm4">
                    <NumInput
                        label="Basis Percentage"
                        tooltip="The basis expressed as percentage of Hub price. Set to 100 for no percent change."
                        onChange={(e,i)=>{
                            let allcopy:any = Object.fromEntries(Object.entries(allParams))
                            allcopy.basis[index]['perc']=i
                            setAllParams(allcopy)}
                        }
                        min={0} 
                        max={200}
                        defaultValue={allParams.basis[index]['perc']}
                        step={0.01}
                        />                             
                    </div>
                </div>
            </SmCard>
            ))
    }
    return (
    <GroupCard title="Basis">
        {element_cards}
        <IconButton iconProps={newIcon} onClick={() => {
                        const basiscopy:any = [...allParams.basis]
                        let basislast:basisType = basiscopy[basiscopy.length-1]
                        let newDate=new Date(basislast.startdate.getTime());
                        newDate.setFullYear(newDate?.getFullYear()+1);
                        setAllParams({...allParams, basis: basiscopy.concat({...basislast, startdate:newDate})})
                    }}/>
    </GroupCard>
    )
}
interface inflationType {
    startdate: Date;
    rate: string;
}
export const InflationCard: React.FC<paramsprops> = ({ allParams, setAllParams }) => {
    let element_cards: any
    const closeIcon = { iconName: "ChromeClose"}
    const newIcon = { iconName: "BuildQueueNew"}
    if (allParams.inflation) {
        element_cards = allParams.inflation.map((item: inflationType, index: number) => (
            <SmCard key={index}>
                <div className="ms-Grid-row">
                    {(index>0) && <IconButton style={{position:'absolute', top:0, right:0, zIndex:100}} iconProps={closeIcon} onClick={() => {
                        const inflationcopy:any = [...allParams.inflation]
                        const inflationend = inflationcopy.splice(index+1)
                        const inflationbeg = inflationcopy.splice(0, index)
                        setAllParams({...allParams, inflation: inflationbeg.concat(inflationend)})
                    }}/>}
                    <div className="ms-Grid-col ms-sm4">
                    <DateInput
                                label="Date"
                                tooltip="Inflation will apply from this date until another preempts it"
                                onSelectDate={(date)=> {
                                    let allcopy:any = Object.fromEntries(Object.entries(allParams))
                                    allcopy.inflation[index]['startdate'] = date
                                    setAllParams(allcopy)}
                                }
                                value={allParams.inflation[index]['startdate']}
                            />
                    </div>
                    <div className="ms-Grid-col ms-sm4">
                    <NumInput
                        label="Rate %"
                        tooltip="Expected inflation rate from this date until the next one"
                        onChange={(e,i)=>{
                            let allcopy:any = Object.fromEntries(Object.entries(allParams))
                            allcopy.inflation[index]['rate']=i
                            setAllParams(allcopy)}
                        }
                        min={0} 
                        max={20}
                        defaultValue={allParams.inflation[index]['rate']}
                        step={0.1}
                        />                             
                    </div>
                </div>
            </SmCard>
            ))
    }
    return (
    <GroupCard title="Inflation">
        {element_cards}
        <IconButton iconProps={newIcon} onClick={() => {
                        const inflationcopy:any = [...allParams.inflation]
                        let inflationlast:inflationType = inflationcopy[inflationcopy.length-1]
                        let newDate=new Date(inflationlast.startdate.getTime());
                        newDate.setFullYear(newDate?.getFullYear()+1);
                        setAllParams({...allParams, inflation: inflationcopy.concat({...inflationlast, startdate:newDate})})
                    }}/>
    </GroupCard>
    )
}
export const ReactiveCard: React.FC<paramsprops> = ({ allParams, setAllParams }) => (
    <>
    <GroupCard title="Reactive">
        <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm3">
            <NumInput
                        label="Price $/kW-mo"
                        tooltip="This price will be applied to the max output after power factor and losses"
                        onChange={(e,i)=>{setAllParams({...allParams, reactive_price:i})}}
                        min={0} 
                        max={100}
                        defaultValue={allParams.reactive_price}
                        step={0.1}
                        />
            </div>
            <div className="ms-Grid-col ms-sm3">
            <NumInput
                        label="Power Factor"
                        tooltip="What is the power factor expressed as decimal"
                        onChange={(e,i)=>{setAllParams({...allParams, reactive_pf:i})}}
                        min={0} 
                        max={1}
                        defaultValue={allParams.reactive_pf}
                        step={0.01}
                        />
            </div>
            <div className="ms-Grid-col ms-sm3">
            <NumInput
                        label="Reactive Losses"
                        tooltip="The losses for reactive as percent"
                        onChange={(e,i)=>{setAllParams({...allParams, reactive_losses:i})}}
                        min={0} 
                        max={100}
                        defaultValue={allParams.reactive_losses}
                        step={0.01}
                        />
            </div>                         
        </div>
    </GroupCard>
    </>
)
export const DiscountCard: React.FC<paramsprops> = ({ allParams, setAllParams }) => (
    <>
    <GroupCard title="Equity Discounts">
        <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm3">
            <NumInput
                        label="Energy %"
                        tooltip="What percent of energy revenue to discount away. 0 for keep all. 100 is lose all."
                        onChange={(e,i)=>{setAllParams({...allParams, discount_energy:i})}}
                        min={0} 
                        max={100}
                        defaultValue={allParams.discount_energy}
                        step={0.1}
                        />
            </div>
            <div className="ms-Grid-col ms-sm3">
            <NumInput
                        label="Capacity %"
                        tooltip="What percent of capacity revenue to discount away. 0 for keep all. 100 is lose all."
                        onChange={(e,i)=>{setAllParams({...allParams, discount_capacity:i})}}
                        min={0} 
                        max={100}
                        defaultValue={allParams.discount_capacity}
                        step={0.1}
                        />
            </div>
            <div className="ms-Grid-col ms-sm3">
            <NumInput
                        label="Rec %"
                        tooltip="What percent of rec revenue to discount away. 0 for keep all. 100 is lose all."
                        onChange={(e,i)=>{setAllParams({...allParams, discount_recs:i})}}
                        min={0} 
                        max={100}
                        defaultValue={allParams.discount_recs}
                        step={0.1}
                        />
            </div>
            <div className="ms-Grid-col ms-sm3">
            <NumInput
                        label="Reactive %"
                        tooltip="What percent of reactive revenue to discount away. 0 for keep all. 100 is lose all."
                        onChange={(e,i)=>{setAllParams({...allParams, discount_reactive:i})}}
                        min={0} 
                        max={100}
                        defaultValue={allParams.discount_reactive}
                        step={0.1}
                        />
            </div>                              
        </div>
    </GroupCard>
    </>
)

interface EnergyColprops {
    setEnPicks: React.Dispatch<React.SetStateAction<any>>;
    enPicks: any;
    }

export const EnergyCol: React.FC<EnergyColprops> = ({ enPicks, setEnPicks }) => {
    const [allChoices, setAllChoices] = useState();
    const defaultEnOpt:Record<string, any[]> = {
        provider: [],
        Reference_Year: [],
        Reference_Season: [],
        Case: [],
        Region: [],
        Area: [],
      };
    const [enOpts, setEnOpts] = useState(defaultEnOpt);
    const OptsDisabled = (Opts:any[]) => {
        if (Opts.length===0 || (Opts.length===1 && Opts[0].key===null)) {
            return true
        } else {
            return false
        }
    }
    useEffect(() => {
        // fetch("/api/choices/energy_choices", {
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Access-Control-Allow-Origin': '*', // Replace with the appropriate origin
        //     }})
        fetch("https://stsynussp.blob.core.windows.net/comparecurves/choices/energy_choices.json?sv=2021-12-02&st=2023-07-13T10%3A54%3A11Z&se=2040-07-14T10%3A54%3A00Z&sr=b&sp=r&sig=Jj4hv4gU2D8jElKzH4hIyhZKU3Iv5G3uUpUB%2BIMyM3o%3D")
        .then(response=>response.json())
        .then(data=>{
            setAllChoices(data)
        })
      }, [])

    useEffect(() => {
        let filt = allChoices === undefined ? [] : allChoices;
        let newopts= defaultEnOpt;
        let newenpicks = enPicks;
        for (let key in enPicks) {
            let temp:any[]=[...new Set(filt.map((item) => item[key]))].sort()
            newopts[key]=temp.map((item) => (
                {key: item, text: item}
            ))

            if (enPicks[key as keyof typeof enPicks]!==null) {
                const curpick = enPicks[key as keyof typeof enPicks]
                if (!temp.includes(curpick)) {
                    newenpicks[key as keyof typeof newenpicks]=null
                }
                filt = filt.filter((item) => item[key]===enPicks[key as keyof typeof enPicks])
            }
        }
        setEnPicks(newenpicks)
        setEnOpts(newopts)
        // eslint-disable-next-line
    }, [allChoices, enPicks])
    
    return (
    <>
    <div className="ms-Grid-row">
        <h3 className="root-141 subtitle">Energy</h3>
        <Dropdown
            label="Provider"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setEnPicks({...enPicks, provider:i.key})
            }}}
            // placeholder="Choose a provider"
            options={enOpts.provider}
            selectedKey={enPicks.provider}
            disabled={OptsDisabled(enOpts.provider)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Reference Year"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setEnPicks({...enPicks, Reference_Year:i.key})
            }}}
            options={enOpts.Reference_Year}
            selectedKey={enPicks.Reference_Year}
            disabled={OptsDisabled(enOpts.Reference_Year)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Reference Season"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setEnPicks({...enPicks, Reference_Season:i.key})
            }}}
            options={enOpts.Reference_Season}
            selectedKey={enPicks.Reference_Season}
            disabled={OptsDisabled(enOpts.Reference_Season)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Case"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setEnPicks({...enPicks, Case:i.key})
            }}}
            options={enOpts.Case}
            selectedKey={enPicks.Case}
            disabled={OptsDisabled(enOpts.Case)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Region"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setEnPicks({...enPicks, Region:i.key})
            }}}
            options={enOpts.Region}
            selectedKey={enPicks.Region}
            disabled={OptsDisabled(enOpts.Region)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Area"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setEnPicks({...enPicks, Area:i.key})
            }}}
            options={enOpts.Area}
            selectedKey={enPicks.Area}
            disabled={OptsDisabled(enOpts.Area)}
            />          
    </div>
    </>
    )
}


interface CapColprops {
    setCapPicks: React.Dispatch<React.SetStateAction<any>>;
    capPicks: any;
    enPicks: any;
    }

export const CapCol: React.FC<CapColprops> = ({ capPicks, setCapPicks, enPicks }) => {
    const [allChoices, setAllChoices] = useState();
    const defaultCapOpt:Record<string, any[]> = {
        provider: [],
        Reference_Year: [],
        Reference_Season: [],
        Case: [],
        Region: [],
        NERC_Sub_Region: [],
        Area: [],
      };
    const [capOpts, setCapOpts] = useState(defaultCapOpt);
    const OptsDisabled = (Opts:any[]) => {
        if (Opts.length===0 || (Opts.length===1 && Opts[0].key===null)) {
            return true
        } else {
            return false
        }
    }
    useEffect(() => {
        // fetch("/api/choices/cap_choices", {
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Access-Control-Allow-Origin': '*', // Replace with the appropriate origin
        //     }})
        fetch("https://stsynussp.blob.core.windows.net/comparecurves/choices/cap_choices.json?sv=2021-12-02&st=2023-07-13T10%3A54%3A58Z&se=2040-07-14T10%3A54%3A00Z&sr=b&sp=r&sig=Bw7laXtHFn0d65Y49haiYT1ULTf5ugEGbCNe7wjLzmI%3D")
        .then(response=>response.json())
        .then(data=>{
            setAllChoices(data)
        })
      }, [])

    useEffect(() => {
        let filt = allChoices === undefined ? [] : allChoices;
        let newopts= defaultCapOpt;
        let newcappicks = capPicks;
        for (let key in capPicks) {
            let temp:any[]=[...new Set(filt.map((item) => item[key]))].sort()
            newopts[key]=temp.map((item) => (
                {key: item, text: item}
            ))

            if (capPicks[key as keyof typeof capPicks]!==null) {
                const curpick = capPicks[key as keyof typeof capPicks]
                if (!temp.includes(curpick)) {
                    newcappicks[key as keyof typeof newcappicks]=null
                }
                filt = filt.filter((item) => item[key]===capPicks[key as keyof typeof capPicks])
            }
        }
        setCapPicks(newcappicks)
        setCapOpts(newopts)
        // eslint-disable-next-line
    }, [allChoices, capPicks])

    useEffect(() => {
        let updates: any={};
        for (let key in enPicks) {
            if (enPicks[key as keyof typeof enPicks] !== null && 
                capOpts[key as keyof typeof capOpts].map((item) => (item.key)).includes(enPicks[key as keyof typeof enPicks]) && 
                capPicks[key as keyof typeof capPicks]===null) {
                    updates[key as keyof typeof enPicks] = enPicks[key as keyof typeof enPicks]
            }
        }
        setCapPicks({...capPicks, ...updates})
        // eslint-disable-next-line
        }, [enPicks])
    
    return (
    <>
    <div className="ms-Grid-row">
        <h3 className="root-141 subtitle">Cap</h3>
        <Dropdown
            label="Provider"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setCapPicks({...capPicks, provider:i.key})
            }}}
            // placeholder="Choose a provider"
            options={capOpts.provider}
            selectedKey={capPicks.provider}
            disabled={OptsDisabled(capOpts.provider)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Reference Year"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setCapPicks({...capPicks, Reference_Year:i.key})
            }}}
            options={capOpts.Reference_Year}
            selectedKey={capPicks.Reference_Year}
            disabled={OptsDisabled(capOpts.Reference_Year)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Reference Season"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setCapPicks({...capPicks, Reference_Season:i.key})
            }}}
            options={capOpts.Reference_Season}
            selectedKey={capPicks.Reference_Season}
            disabled={OptsDisabled(capOpts.Reference_Season)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Case"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setCapPicks({...capPicks, Case:i.key})
            }}}
            options={capOpts.Case}
            selectedKey={capPicks.Case}
            disabled={OptsDisabled(capOpts.Case)}
            />          
    </div>
    <div className="ms-Grid-row" style={{display: OptsDisabled(capOpts.Region)?('none'):('block')}}>
        <Dropdown
            label="Region"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setCapPicks({...capPicks, Region:i.key})
            }}}
            options={capOpts.Region}
            selectedKey={capPicks.Region}
            disabled={OptsDisabled(capOpts.Region)}
            />          
    </div>
    <div className="ms-Grid-row" style={{display: OptsDisabled(capOpts.Region)?('block'):('none')}}>
        <Dropdown
            label="NERC Sub Region"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setCapPicks({...capPicks, NERC_Sub_Region:i.key})
            }}}
            options={capOpts.NERC_Sub_Region}
            selectedKey={capPicks.NERC_Sub_Region}
            disabled={OptsDisabled(capOpts.NERC_Sub_Region)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Area"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setCapPicks({...capPicks, Area:i.key})
            }}}
            options={capOpts.Area}
            selectedKey={capPicks.Area}
            disabled={OptsDisabled(capOpts.Area)}
            />          
    </div>
    </>
    )
}


interface RecColprops {
    setRecPicks: React.Dispatch<React.SetStateAction<any>>;
    recPicks: any;
    enPicks: any;
    }

export const RecCol: React.FC<RecColprops> = ({ recPicks, setRecPicks, enPicks }) => {
    const [allChoices, setAllChoices] = useState();
    const defaultRecOpt:Record<string, any[]> = {
        provider: [],
        Reference_Year: [],
        Reference_Season: [],
        Case: [],
        Region: [],
        State: [],
        Area: [],
      };
    const [recOpts, setRecOpts] = useState(defaultRecOpt);
    const OptsDisabled = (Opts:any[]) => {
        if (Opts.length===0 || (Opts.length===1 && Opts[0].key===null)) {
            return true
        } else {
            return false
        }
    }
    useEffect(() => {
        // fetch("/api/choices/rec_choices", {
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Access-Control-Allow-Origin': '*', // Replace with the appropriate origin
        //     }})
        fetch("https://stsynussp.blob.core.windows.net/comparecurves/choices/rec_choices.json?sv=2021-12-02&st=2023-07-13T10%3A55%3A40Z&se=2040-07-14T10%3A55%3A00Z&sr=b&sp=r&sig=GlxnPjF2d69daWv3XaGkR6EtcBw03F8oC9ly%2BMc6wDY%3D")
        .then(response=>response.json())
        .then(data=>{
            setAllChoices(data)
        })
      }, [])

    useEffect(() => {
        let filt = allChoices === undefined ? [] : allChoices;
        let newopts= defaultRecOpt;
        let newrecpicks = recPicks;
        for (let key in recPicks) {
            let temp:any[]=[...new Set(filt.map((item) => item[key]))].sort()
            newopts[key]=temp.map((item) => (
                {key: item, text: item}
            ))
            if (recPicks[key as keyof typeof recPicks]!==null) {
                const curpick = recPicks[key as keyof typeof recPicks]
                if (!temp.includes(curpick)) {
                    newrecpicks[key as keyof typeof newrecpicks]=null
                }
                filt = filt.filter((item) => item[key]===recPicks[key as keyof typeof recPicks])
            }
        }
        setRecPicks(newrecpicks)
        setRecOpts(newopts)
        // eslint-disable-next-line
    }, [allChoices, recPicks])

    useEffect(() => {
        let updates: any={};
        for (let key in enPicks) {
            if (enPicks[key as keyof typeof enPicks] !== null && 
                recOpts[key as keyof typeof recOpts].map((item) => (item.key)).includes(enPicks[key as keyof typeof enPicks]) && 
                recPicks[key as keyof typeof recPicks]===null) {
                    updates[key as keyof typeof enPicks] = enPicks[key as keyof typeof enPicks]

            }
        }
        setRecPicks({...recPicks, ...updates})
        // eslint-disable-next-line
        }, [enPicks])
    
    return (
    <>
    <div className="ms-Grid-row">
        <h3 className="root-141 subtitle">Rec</h3>
        <Dropdown
            label="Provider"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setRecPicks({...recPicks, provider:i.key})
            }}}
            // placeholder="Choose a provider"
            options={recOpts.provider}
            selectedKey={recPicks.provider}
            disabled={OptsDisabled(recOpts.provider)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Reference Year"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setRecPicks({...recPicks, Reference_Year:i.key})
            }}}
            options={recOpts.Reference_Year}
            selectedKey={recPicks.Reference_Year}
            disabled={OptsDisabled(recOpts.Reference_Year)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Reference Season"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setRecPicks({...recPicks, Reference_Season:i.key})
            }}}
            options={recOpts.Reference_Season}
            selectedKey={recPicks.Reference_Season}
            disabled={OptsDisabled(recOpts.Reference_Season)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Case"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setRecPicks({...recPicks, Case:i.key})
            }}}
            options={recOpts.Case}
            selectedKey={recPicks.Case}
            disabled={OptsDisabled(recOpts.Case)}
            />          
    </div>
    <div className="ms-Grid-row" style={{display: OptsDisabled(recOpts.Region)?('none'):('block')}}>
        <Dropdown
            label="Region"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setRecPicks({...recPicks, Region:i.key})
            }}}
            options={recOpts.Region}
            selectedKey={recPicks.Region}
            disabled={OptsDisabled(recOpts.Region)}
            />          
    </div>
    <div className="ms-Grid-row" style={{display: OptsDisabled(recOpts.Region)?('block'):('none')}}>
        <Dropdown
            label="State"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setRecPicks({...recPicks, State:i.key})
            }}}
            options={recOpts.State}
            selectedKey={recPicks.State}
            disabled={OptsDisabled(recOpts.State)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Area"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setRecPicks({...recPicks, Area:i.key})
            }}}
            options={recOpts.Area}
            selectedKey={recPicks.Area}
            disabled={OptsDisabled(recOpts.Area)}
            />          
    </div>
    </>
    )
}

interface ElccColprops {
    setElccPicks: React.Dispatch<React.SetStateAction<any>>;
    elccPicks: any;
    enPicks: any;
    }

export const ElccCol: React.FC<ElccColprops> = ({ elccPicks, setElccPicks, enPicks }) => {
    const [allChoices, setAllChoices] = useState();
    const defaultElccOpt:Record<string, any[]> = {
        provider: [],
        Reference_Year: [],
        Reference_Season: [],
        Case: [],
        Region: [],
        Area: [],
      };
    const [elccOpts, setElccOpts] = useState(defaultElccOpt);
    const OptsDisabled = (Opts:any[]) => {
        if (Opts.length===0 || (Opts.length===1 && Opts[0].key===null)) {
            return true
        } else {
            return false
        }
    }
    useEffect(() => {
        // fetch("/api/choices/elcc_choices", {
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Access-Control-Allow-Origin': '*', // Replace with the appropriate origin
        //     }})
        fetch("https://stsynussp.blob.core.windows.net/comparecurves/choices/elcc_choices.json?sv=2021-12-02&st=2023-07-13T10%3A56%3A12Z&se=2040-07-14T10%3A56%3A00Z&sr=b&sp=r&sig=XRreoynxStZ13yyCtjHlHpeFgbC%2Bvq9GysV7SFHbxOw%3D")
        .then(response=>response.json())
        .then(data=>{
            setAllChoices(data)
        })
      }, [])

    useEffect(() => {
        let filt = allChoices === undefined ? [] : allChoices;
        let newopts= defaultElccOpt;
        let newelccpicks = elccPicks;
        for (let key in elccPicks) {
            let temp:any[]=[...new Set(filt.map((item) => item[key]))].sort()
            newopts[key]=temp.map((item) => (
                {key: item, text: item}
            ))
            if (elccPicks[key as keyof typeof elccPicks]!==null) {
                const curpick = elccPicks[key as keyof typeof elccPicks]
                if (!temp.includes(curpick)) {
                    newelccpicks[key as keyof typeof newelccpicks]=null
                }
                filt = filt.filter((item) => item[key]===elccPicks[key as keyof typeof elccPicks])
            }
        }
        setElccPicks(newelccpicks)
        setElccOpts(newopts)
        // eslint-disable-next-line
    }, [allChoices, elccPicks])

    useEffect(() => {
        let updates: any={};
        for (let key in enPicks) {
            if (enPicks[key as keyof typeof enPicks] !== null && 
                elccOpts[key as keyof typeof elccOpts].map((item) => (item.key)).includes(enPicks[key as keyof typeof enPicks]) && 
                elccPicks[key as keyof typeof elccPicks]===null) {
                    updates[key as keyof typeof enPicks] = enPicks[key as keyof typeof enPicks]

            }
        }
        setElccPicks({...elccPicks, ...updates})
        // eslint-disable-next-line
        }, [enPicks])
    
    return (
    <>
    <div className="ms-Grid-row">
        <h3 className="root-141 subtitle">Elcc</h3>
        <Dropdown
            label="Provider"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setElccPicks({...elccPicks, provider:i.key})
            }}}
            // placeholder="Choose a provider"
            options={elccOpts.provider}
            selectedKey={elccPicks.provider}
            disabled={OptsDisabled(elccOpts.provider)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Reference Year"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setElccPicks({...elccPicks, Reference_Year:i.key})
            }}}
            options={elccOpts.Reference_Year}
            selectedKey={elccPicks.Reference_Year}
            disabled={OptsDisabled(elccOpts.Reference_Year)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Reference Season"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setElccPicks({...elccPicks, Reference_Season:i.key})
            }}}
            options={elccOpts.Reference_Season}
            selectedKey={elccPicks.Reference_Season}
            disabled={OptsDisabled(elccOpts.Reference_Season)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Case"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setElccPicks({...elccPicks, Case:i.key})
            }}}
            options={elccOpts.Case}
            selectedKey={elccPicks.Case}
            disabled={OptsDisabled(elccOpts.Case)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Region"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setElccPicks({...elccPicks, Region:i.key})
            }}}
            options={elccOpts.Region}
            selectedKey={elccPicks.Region}
            disabled={OptsDisabled(elccOpts.Region)}
            />          
    </div>
    <div className="ms-Grid-row">
        <Dropdown
            label="Area"
            onChange={(e, i) => {if (i && typeof i.key==='string') {
                setElccPicks({...elccPicks, Area:i.key})
            }}}
            options={elccOpts.Area}
            selectedKey={elccPicks.Area}
            disabled={OptsDisabled(elccOpts.Area)}
            />          
    </div>
    </>
    )
}
