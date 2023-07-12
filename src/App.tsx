import React, { useEffect, useState } from 'react';
import { Stack, Text, FontWeights, ITextStyles, initializeIcons, Pivot, PivotItem } from '@fluentui/react';
import { Nav} from '@fluentui/react/lib/Nav';
import { GroupCard, SmCard } from './Cards'
import './App.css';
import { ProdSpecs, ProdLoad, PPACard, BasisCard, InflationCard, DiscountCard, ReactiveCard, EnergyCol, CapCol, RecCol, ElccCol } from './Chunks';

const boldStyle: Partial<ITextStyles> = { root: { fontWeight: FontWeights.semibold } };

const links = [
  {
    links: [
      {
        name: 'Dashboard',
        url: '/',
        key: 'key1',
        iconProps: {
          iconName: 'News',

        }
      },
      {
        name: 'Settings',
        url: '/',
        key: 'key2',
        iconProps: {
          iconName: 'StackedLineChart',

        }
      },
      {
        name: 'Stats',
        url: '/',
        key: 'key3',
        iconProps: {
          iconName: 'News',
        }
      },
    ]
  }
]
initializeIcons();


const Navigation = () => {
  
  return (
    <Nav 
    groups={links}
    selectedKey="key1"
    />
  )
}

interface allparamstypes {
  prodfile?: string | null;
  prodcol?: string | null;
  maxout?: string | null;
  availability?: string | null;
  degradation?: string | null;
  reportbegin?: Date | null;
  cod?: Date | null;
  reportend?: Date | null;
  ppaprice?: string | null;
  ppaportion?: string | null;
  ppaend?: Date | null;
  basis?: any;
  inflation?: any;
  discount_energy: string | null;
  discount_capacity: string | null;
  discount_recs: string | null;
  discount_reactive: string | null;
  reactive_price: string | null;
  reactive_pf: string | null;
  reactive_losses: string | null;
}

interface energytypes {
  provider: string | null;
  Reference_Year: string | null;
  Reference_Season: string | null;
  Case:string | null; 
  Region: string | null; 
  Area:string | null;
}

interface captypes {
  provider: null | string,
  Reference_Year: null | string,
  Reference_Season: null | string,
  Case: null | string,
  Region: null | string,
  NERC_Sub_Region: null | string,
  Area: null | string
}

interface rectypes {
  provider: null | string,
  Reference_Year: null | string,
  Reference_Season: null | string,
  Case: null | string,
  Region: null | string,
  State: null | string,
  Area: null | string
}

interface elcctypes {
  provider: null | string,
  Reference_Year: null | string,
  Reference_Season: null | string,
  Region: null | string,
  Area: null | string
}



export const App: React.FunctionComponent = () => {

  const [allParams, setAllParams] = useState<allparamstypes>({
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
      {startdate:new Date(Date.UTC(2025,11,1)), dollar:'-2', perc:'100'},
      {startdate:new Date(Date.UTC(2026,11,1)), dollar:'-2.5', perc:'105'},
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

  useEffect(()=> {
    const pollapi = async () => {
      fetch("/api/wakeup")
      .then(response => {
        if (response.ok) {
          console.log("api up", response.text());
        } else {
          console.log("api down");
        }
      })
      .catch(error => {
        console.error("api really down:", error);
      })
      setTimeout(pollapi, 5000)
    }
    pollapi();
  }, [])
  return (
    <div>
      <Stack horizontalAlign="center" verticalAlign="start">
        <Text variant="xxLarge" styles={boldStyle}>
          The header
        </Text>
      </Stack>
      <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm2 ms-depth-4">
            <Navigation/>
          </div>
          <div className="ms-Grid-col ms-sm10">
            <div className="ms-Grid-row">
              <GroupCard title='Production'>
                <div className="ms-Grid-row">
                  <Text>You can choose to use a PVSYST 8760 for production or run a generic NREL simulation</Text>
                </div>
                <div className="ms-Grid-row">
                  <SmCard>
                    <Pivot>
                      <PivotItem headerText='Load Existing'>
                        <ProdLoad allParams={allParams} setAllParams={setAllParams}/>
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
              <Text>{JSON.stringify(allParams)}</Text>
            </div>
            <div className="ms-Grid-row">
              <Text>{JSON.stringify(enPicks)}</Text>
            </div>
            <div className="ms-Grid-row">
              <Text>{JSON.stringify(capPicks)}</Text>
            </div>
            <div className="ms-Grid-row">
              <Text>{JSON.stringify(recPicks)}</Text>
            </div>
            <div className="ms-Grid-row">
              <Text>{JSON.stringify(elccPicks)}</Text>
            </div>

          </div>          
        </div>
      </div>
    </div>
  );
};
