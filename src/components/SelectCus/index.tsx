import React from 'react'
import Select from 'react-select'
import  styles  from "./SelectCus.module.scss"

const SelectCus = (props: any) => {
    const { options, defaultValue, onChange, placeHolder } = props;
    return (
        <Select
            name="name"
            options={options}
            defaultValue={defaultValue}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder={placeHolder}
            onChange={onChange}
            styles={{
                control:(baseStyles,state) => ({
                    ...baseStyles,
                    borderRadius:"12px",
                    padding:"6px 12px",
                    fontWeight:"800"
                }),
            }}
        />
    )
}

export default SelectCus
