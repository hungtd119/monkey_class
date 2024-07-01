import React, { useEffect, useState } from "react";
import Select from "react-select";

interface SelectSearchSchoolProps {
  onSelectSchool: (value: any, section: string) => void;
  selectedSchool: any;
  listSchool: any;
}

const SelectSearchSchool = ({
  onSelectSchool,
  selectedSchool,
  listSchool
}: SelectSearchSchoolProps) => {
  const [value, setValue] = useState<any | null>(selectedSchool);

  useEffect(() => {
    setValue(selectedSchool);
  }, [selectedSchool]); 

  const getOptionLabel = ({ label }: any) => label;
  const formatOptionLabel = ({ label, address }: any) => (
    <div>
      <p className="fw-bold" style={{ color: "#525252" }}>{label}</p>
      <p
        style={{
          color: "#D6D6D6",
          fontWeight: 400,
          width: 450,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {address}
      </p>
    </div>
  );

  const onHandleSelectSchool = (value: any) => {
    onSelectSchool(value,'requestSchool')
  }

  return (
    <>
      <p className="pe-32 py-8 fw-bold fs-3">Tìm kiếm trường của bạn</p>
      <Select
        isClearable
        onChange={(newValue: any) => { 
          setValue(newValue);
          onHandleSelectSchool(newValue);
        }}
        options={listSchool}
        value={value}
        placeholder="Nhập tên trường của bạn"
        formatOptionLabel={formatOptionLabel}
        getOptionLabel={getOptionLabel}
        styles={{ 
          control: (baseStyles) => ({
            ...baseStyles,
            borderRadius: "12px",
            padding: "9px 12px",
            fontWeight: "700",
            minWidth: "500px",
          }),
        }}
      />
    </>
  );
};

export default SelectSearchSchool; 
