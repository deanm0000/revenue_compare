import React from 'react';

export interface allparamstypes {
    project?: string | null;
    jobname?: string | null;
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

export interface energytypes {
    provider: string | null;
    Reference_Year: string | null;
    Reference_Season: string | null;
    Case:string | null; 
    Region: string | null; 
    Area:string | null;
  }

export interface captypes {
    provider: null | string,
    Reference_Year: null | string,
    Reference_Season: null | string,
    Case: null | string,
    Region: null | string,
    NERC_Sub_Region: null | string,
    Area: null | string
  }

export interface rectypes {
    provider: null | string,
    Reference_Year: null | string,
    Reference_Season: null | string,
    Case: null | string,
    Region: null | string,
    State: null | string,
    Area: null | string
  }

export interface elcctypes {
    provider: null | string,
    Reference_Year: null | string,
    Reference_Season: null | string,
    Region: null | string,
    Area: null | string
  }

interface month_summraw {
    Monthly: string
    ppa_mwh: number
    merchant_mwh: number
    ppa_revenue: number
    merchant_revenue: number
    rec_revenue: number
    reactive_rev: number
    cap_revenue: number
    TB2_Revenue_mw: number
    TB4_Revenue_mw: number
}

export interface month_summprops extends Array<month_summraw> {}

interface duckpropsraw {
    Year: number
    month: number
    Hourend: number
    price: number
}

export interface duckprops extends Array<duckpropsraw> {}



export interface dataprops {
    status: string
    month_summ: month_summprops
    duck: duckprops
}

export interface GraphModalsprops  {
    isOpen: boolean
    onDismiss: ()=> void
    monthData: month_summprops|null
    duckData: duckprops|null
    hideModal: ()=> void
}

export interface historyprops  {
    apiBase: string

}

export interface paramsprops {
    setAllParams: React.Dispatch<React.SetStateAction<any>>;
    allParams: any;
}

export interface paramspropsapi extends paramsprops {
    apiBase: string
    corsmode: string
}

export interface basisType {
    startdate: Date;
    dollar: string;
    perc: string;
}

export interface inflationType {
    startdate: Date;
    rate: string;
}

export interface EnergyColprops {
    setEnPicks: React.Dispatch<React.SetStateAction<any>>;
    enPicks: any;
    }

export interface CapColprops {
    setCapPicks: React.Dispatch<React.SetStateAction<any>>;
    capPicks: any;
    enPicks: any;
    }

export interface RecColprops {
    setRecPicks: React.Dispatch<React.SetStateAction<any>>;
    recPicks: any;
    enPicks: any;
    }

export interface ElccColprops {
    setElccPicks: React.Dispatch<React.SetStateAction<any>>;
    elccPicks: any;
    enPicks: any;
    }

