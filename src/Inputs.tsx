import { Dropdown, IDropdownOption, TooltipHost, DatePicker } from '@fluentui/react';
import { Label } from '@fluentui/react/lib/Label';
import { SpinButton } from '@fluentui/react/lib/SpinButton';
import React from 'react';

interface DropdownTprops {
    label: string,
    tooltip: string,
    options: IDropdownOption<any>[],
    onChange: (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number) => void,
    placeholder: string,
    disabled?: boolean,
    selectedKey?: string | number | null,
    usesk?: boolean
}

const DropdownT: React.FC<DropdownTprops> = ({label, tooltip, options, onChange, placeholder, disabled, selectedKey, usesk}) => {
    let SK = {};
    if (usesk) {
        SK = {selectedKey: selectedKey}
    }
    const dropdown = (
    <Dropdown
        onRenderLabel={() => (
        <TooltipHost content={tooltip}>
            <Label className="droplabel">{label}</Label>
        </TooltipHost>
        )}
        onChange={onChange}
        placeholder={placeholder}
        options={options}
        disabled={disabled}
        {...SK}
    />)
    return dropdown
    }
DropdownT.defaultProps = {
    label: '',
    tooltip: '',
    placeholder: '',
    disabled: false
}

interface NumInputprops {
    label: string,
    tooltip: string,
    onChange: (event: React.SyntheticEvent<HTMLElement>, newValue?: string) => void,
    min: number,
    max: number,
    defaultValue: string,
    step: number,  
}

const NumInput: React.FC<NumInputprops> = ({label, tooltip, onChange, min, max, defaultValue, step}) => (
    <div>
        {(tooltip!=='') ? (
        <TooltipHost content={tooltip}>
            <Label className="droplabel">{label}</Label>
        </TooltipHost>
            ) : (
        <Label className="droplabel">{label}</Label>
        )}
        <SpinButton 
            defaultValue={defaultValue}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
        />
    </div>
)
NumInput.defaultProps = {
    label: '',
    tooltip: '',
    min: 0,
    max: 100,
    defaultValue: '0',
    step: 1
}
interface DateInputprops {
    label: string,
    tooltip: string,
    onSelectDate: (date: Date | null | undefined) => void,
    value: Date
}
const DateInput: React.FC<DateInputprops> = ({label, tooltip, onSelectDate, value}) => {
    const onFormatDate = (date?: Date): string => {
        return !date ? '' : (date.getUTCMonth() + 1)  + '/' + date.getUTCDate() + '/' + (date.getUTCFullYear() % 100);
        };

    const di = (
    <div>
        {(tooltip!=='') ? (
        <TooltipHost content={tooltip}>
            <Label className="droplabel">{label}</Label>
        </TooltipHost>
            ) : (
        <Label className="droplabel">{label}</Label>
        )}
        <DatePicker
            allowTextInput
            value={value}
            onSelectDate={onSelectDate}
            formatDate={onFormatDate}
        />
    </div>)
    return di
}
DateInput.defaultProps = {
    label:'',
    tooltip:''
}

export {DropdownT, NumInput, DateInput}