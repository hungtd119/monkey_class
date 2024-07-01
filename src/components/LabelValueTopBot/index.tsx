import React from 'react'
const LabelValueTopBot = (props:any) => {
    const {label, value, color} = props;
  return (
    <div className='mx-4'>
      <div className='fw-bold' style={{color:"#777777"}}>
        {label}
      </div>
      <div className='fw-bold h3' style={{color}}>
        {value}
      </div>
    </div>
  )
}

export default LabelValueTopBot
