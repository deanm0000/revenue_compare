import React, { useEffect, useState, useRef } from 'react';
import { Stack, Text, initializeIcons, Pivot, PivotItem, Dropdown} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { GroupCard, SmCard } from './Cards'
import { GraphModal } from './graphmodal';
import './App.css';
import { TextField } from '@fluentui/react/lib/TextField';
import { ProdSpecs, ProdLoad, PPACard, BasisCard, InflationCard, DiscountCard, ReactiveCard, EnergyCol, CapCol, RecCol, ElccCol } from './Chunks';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { allparamstypes, energytypes, captypes, rectypes, elcctypes, month_summprops, duckprops } from './interfaces'
import { History } from './history'
import { Route, Routes, Link } from "react-router-dom"

initializeIcons();


export const App: React.FunctionComponent = () => {
  const pollApiTime = useRef(30000)
  const [monthData, setMonthData] = useState<month_summprops>([])
  const [duckData, setDuckData] = useState<duckprops>([])
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
  const apiBase = process.env.NODE_ENV === "development" ? "http://localhost:7071/api" : "/api"
  const corsmode = process.env.NODE_ENV === "development" ? "no-cors": "cors"
  const waitingOnApi= useRef<string|null>(null)
  const apiPollerTimer = useRef<NodeJS.Timeout>()
  //const [waitingOnApi, setWaitingOnApi] = useState<string|null>(null);
  const [allParams, setAllParams] = useState<allparamstypes>({
    project: 'Prairie',
    maxout: '135',
    availability: '99',
    degradation: '0.004',
    reportbegin: new Date(Date.UTC(2025,11,1)),
    cod: new Date(Date.UTC(2025,11,1)),
    reportend: new Date(Date.UTC(2046,11,31)),
    ppaprice: '55',
    ppaportion: '88',
    ppaend: new Date(Date.UTC(2040,11,1)),
    basis: [
      {startdate:new Date(Date.UTC(2025,11,1)), dollar:'-2', perc:'0'},
    ],
    inflation: [
      {startdate: new Date(Date.UTC(2025,11,1)), rate:'2'}
    ],
    discount_energy:'0',
    discount_capacity:'0',
    discount_recs:'0',
    discount_reactive:'0',
    reactive_price: '5',
    reactive_pf: '0.95',
    reactive_losses: '15'
  })
  const [enPicks, setEnPicks] = useState<energytypes>({
    provider:null,Reference_Year:null, Reference_Season:null,
    Case:null, Region: null, Area:null
  })
  const [capPicks, setCapPicks] = useState<captypes>({
    provider:null,Reference_Year:null, Reference_Season:null,
    Case:null, Region: null, NERC_Sub_Region:null, Area:null
  })
  const [recPicks, setRecPicks] = useState<rectypes>({
    provider:null,Reference_Year:null, Reference_Season:null,
    Case:null, Region: null, State:null, Area:null
  })
  const [elccPicks, setElccPicks] = useState<elcctypes>({
    provider:null,Reference_Year:null, Reference_Season:null,
    Region: null, Area:null
  })
  const [projects, setProjects] = useState([])
  useEffect(()=> {
    const pollapi = async () => {
      if (waitingOnApi.current===null) {
      const response = await fetch(apiBase.concat("/wakeup"));
        try {
          if (response.ok) {
              const projlist = await response.json()
              //console.log("api up", text);
              setProjects(projlist.map((item:string)=>({key:item, text:item})))
            } else {
              console.log("api down");
            }
          } catch (error) {
          console.error("api really down:", error);
        }
      } else if (waitingOnApi.current!==null && isModalOpen) {
        console.log("I see modal is open", waitingOnApi.current)
      // checking if modal is open incase there's a race between closing it and this firing
        const response = await fetch(apiBase.concat("/wakeup/").concat(waitingOnApi.current));
          try {
            if (response.ok) {
                const alldata = await response.json()
                if (alldata.status==="complete" && isModalOpen) {
                  setDuckData(alldata.duck)
                  setMonthData(alldata.month_summ)
                  waitingOnApi.current=null
                  pollApiTime.current=30000
                } else {
                  console.log('Still waiting')
                }
              } else {
                console.log("api down");
              }
            } catch (error) {
            console.error("api really down, or json parsing error:", error);
          }
      } else {
        console.log("modal closed before results")
      }
      apiPollerTimer.current=setTimeout(pollapi, pollApiTime.current)
    }
    pollapi();
    return () => {
      clearTimeout(apiPollerTimer.current)
    }
    // eslint-disable-next-line
  }, [isModalOpen])
  return (
    <>
    <header className="myheader">
      <Stack>
        <Stack.Item align="start"> 
          <img src="/favicon.ico" alt=""/>
          <Text variant="xLarge">Revenue Tool</Text>
        </Stack.Item>
        <Stack.Item align="end">
          <Link to="/">
            <DefaultButton> Home</DefaultButton>
          </Link>  
          <Link to="/history">
            <DefaultButton>History</DefaultButton>
          </Link>
         
        </Stack.Item>
        </Stack>
    </header>
    <Routes>
    <Route path="/" element={
    <>
      <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm12">
            <div className="ms-Grid-row">
              <GroupCard title="Job Name">
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-sm9">
                    <TextField 
                      label="Name of job"
                      placeholder="Type in a name for this job"
                      onChange={(e, text) => setAllParams({...allParams, jobname:text})}
                      />
                  </div>
                  <div className="ms-Grid-col ms-sm3">
                  <Dropdown 
                    label="Project"
                    onChange={(e, i) => {if (i && typeof i.key==='string') {
                        setAllParams({...allParams, project:i.key})
                    }}}
                    options={projects}
                    selectedKey={allParams.project}
                    />
                  </div>
                </div>
              </GroupCard>
              <GroupCard title='Production'>
                <div className="ms-Grid-row">
                  <Text>You can choose to use a PVSYST 8760 for production or run a generic NREL simulation</Text>
                </div>
                <div className="ms-Grid-row">
                  <SmCard>
                    <Pivot>
                      <PivotItem headerText='Load Existing'>
                        <ProdLoad allParams={allParams} setAllParams={setAllParams} apiBase={apiBase} corsmode={corsmode}/>
                      </PivotItem>
                    <PivotItem headerText='New 8760'>
                      <Text>New 8760</Text>
                    </PivotItem>
                    <PivotItem headerText='NREL'>
                      <Text>New NREL</Text>
                    </PivotItem>                
                  </Pivot>
                  </SmCard>
                </div>
                <ProdSpecs allParams={allParams} setAllParams={setAllParams}/>
              </GroupCard>
            </div>
            <div className="ms-Grid-row">
              <PPACard allParams={allParams} setAllParams={setAllParams}/>
            </div>
            <div className="ms-Grid-row">
              <BasisCard allParams={allParams} setAllParams={setAllParams}/>
            </div>
            <div className="ms-Grid-row">
              <InflationCard allParams={allParams} setAllParams={setAllParams}/>
            </div>
            <div className="ms-Grid-row">
              <ReactiveCard allParams={allParams} setAllParams={setAllParams}/>
            </div>                 
            <div className="ms-Grid-row">
              <DiscountCard allParams={allParams} setAllParams={setAllParams}/>
            </div>               
            <div className="ms-Grid-row">
            <GroupCard title="Dataset choosers">
              <div className="ms-Grid-col ms-sm3 bordered">
                <EnergyCol enPicks={enPicks} setEnPicks={setEnPicks}/>
              </div>
              <div className="ms-Grid-col ms-sm3 bordered">
                <CapCol capPicks={capPicks} setCapPicks={setCapPicks} enPicks={enPicks}/>
              </div>
              <div className="ms-Grid-col ms-sm3 bordered">
                <RecCol recPicks={recPicks} setRecPicks={setRecPicks} enPicks={enPicks}/>
              </div>
              <div className="ms-Grid-col ms-sm3 bordered">
                <ElccCol elccPicks={elccPicks} setElccPicks={setElccPicks} enPicks={enPicks}/>
              </div>
            </GroupCard>
            </div>      
            <div className="ms-Grid-row">
              <DefaultButton 
                text="Run"
                onClick = {async () =>  {
                  // waitingOnApi.current='97c9ec4b-c1a0-4283-8d7a-8fd1da232ffd'
                  // pollApiTime.current=3000
                  // showModal()
                  // check dataset params for area being filled in
                  if ((enPicks.Area !== null) && (capPicks.Area !== null) && (recPicks.Area !== null || (recPicks.provider==="woodmac" && recPicks.State!==null)) && 
                      (elccPicks.Area !== null) && (allParams.prodfile !== null) && (allParams.prodcol !== undefined)) {
                    try {
                      const response = await fetch(apiBase.concat("/newjob"), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({...allParams, energy:enPicks, cap:capPicks, rec:recPicks, elcc:elccPicks})
                      })
                      if (response.ok) {
                        let resptext = await response.text()
                        resptext = resptext.replace(/^['"]+|['"]+$/g, '')
                        waitingOnApi.current=resptext
                        pollApiTime.current=3000
                        showModal()
                      } else {
                        alert("Something went wrong, try again")
                      }
                    } catch (error) {
                      alert("An error occurred: ".concat((error as any).message as string))
                    }
                  } else {
                    // make alert more specific
                    alert("Not all dataset and/or production values selected")
                  }
                }}
            />
            </div>                                              
            <div className="ms-Grid-row">
              <Text>{JSON.stringify({...allParams, energy:enPicks, cap:capPicks, rec:recPicks, elcc:elccPicks})}</Text>
            </div>
          </div>          
        </div>
      </div>

    </>}
    />
    <Route path="/history" element = {<History apiBase={apiBase} showModal={showModal} waitingOnApi={waitingOnApi} pollApiTime={pollApiTime}/>}/>
    </Routes>
    <div>
        <GraphModal
          isOpen={isModalOpen}
          onDismiss={hideModal}
          monthData={monthData}
          duckData={duckData}
          hideModal={hideModal}
          waitingOnApi={waitingOnApi}
        />
      </div>
    </>
  );
};
