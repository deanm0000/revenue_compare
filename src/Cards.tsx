import React from 'react';
import { useState } from "react";
import { IconButton } from '@fluentui/react/lib/Button';
import {
    DocumentCard,
    DocumentCardDetails,
    DocumentCardTitle,
    DocumentCardType,
  } from '@fluentui/react/lib/DocumentCard';

interface GroupCardProps {
    title:string
  };


export const GroupCard: React.FC<GroupCardProps> = ({title, children}) => {
    const [ cardIcon, setCardIcon] = useState({ iconName: 'CalculatorSubtract'})
    const [showCard, setShowCard] =  useState('block')
    const _consoleclicked = (): void => {
        if (cardIcon.iconName==='CalculatorAddition') {
        setCardIcon({ iconName: 'CalculatorSubtract'})
        setShowCard('block')
        } else {
        setCardIcon({ iconName: 'CalculatorAddition'})
        setShowCard('none')
        }
    }
    return (
        <DocumentCard type={DocumentCardType.normal} className='groupcard ms-depth-8'>
        <IconButton style={{position:'absolute', top:0, right:0, zIndex:100}} iconProps={cardIcon} onClick={_consoleclicked}/>
        <DocumentCardDetails>
        <DocumentCardTitle title={title} className='groupcardtitle'></DocumentCardTitle>
        <div  style={{display: showCard}}>
            {children}
        </div>
        </DocumentCardDetails>
    </DocumentCard>
    )
}

export const SmCard: React.FC = ({children}) => {
    return (
        <DocumentCard type={DocumentCardType.normal} className='smcard ms-depth-4'>
        <DocumentCardDetails>
            {children}
        </DocumentCardDetails>
    </DocumentCard>
    )
}


