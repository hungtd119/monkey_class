import Image from "next/image";
import React, { useEffect, useState } from "react";
import { components } from "react-select";
import CreatableSelect from "react-select/creatable";
import { NOT_VERIFY, VERIFIED } from "src/constant";

interface AddSchoolToSelectAdminProps {
  onSelectSchool: (value: any, section: string) => void;
  selectedSchool: any;
  title: string;
  listSchool: any;
}

const AddSchoolToSelectAdmin = ({
  onSelectSchool,
  selectedSchool,
  title,
  listSchool
}: AddSchoolToSelectAdminProps) => {

  const [value, setValue] = useState<any | null>(selectedSchool);
  const [tempValue, setTempValue] = useState<string>("");

  useEffect(() => {
    setValue(selectedSchool);
  }, [selectedSchool]);

  const getOptionLabel = ({ label }: any) => label;
  const formatOptionLabel = ({ label, address }: any) => (
    <div>
      <p className="fw-bold" style={{ color: "#525252" }}>
        {label}
      </p>
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

  const handleAddTempValue = (inputValue: string) => {
    const newOption = {
      value: inputValue,
      label: inputValue,
      isVerify: NOT_VERIFY,
    };
    setValue(newOption);
    setTempValue("");
    onSelectSchool(
      newOption,
      newOption?.isVerify === VERIFIED ? "requestSchool" : "infoSchool"
    );
  };

  return (
    <>
      <p className="pe-32 py-8 fw-bold fs-3">{title}</p>
      <CreatableSelect
        isClearable
        onChange={(newValue: any) => {
          setValue(newValue);
          if (newValue) { 
            onSelectSchool(
              newValue,
              newValue?.isVerify === VERIFIED ? "requestSchool" : "infoSchool"
            );
          }
        }}
        options={listSchool}
        value={value}
        inputValue={tempValue}
        onInputChange={(input) => setTempValue(input)}
        placeholder="Nhập tên trường của bạn"
        createOptionPosition="first"
        // components={customComponents} 
        formatOptionLabel={formatOptionLabel}
        getOptionLabel={getOptionLabel}
        formatCreateLabel={(inputValue) => (
          <div
            style={{ padding: "8px", cursor: "pointer", color: "#007bff" }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddTempValue(inputValue);
            }}
          >
            <Image
              src={`/assets/svg/plus-circle.svg`}
              width={24}
              height={24}
              alt="plus"
              className="me-2"
            />
            Thêm trường "{inputValue}"
          </div>
        )}
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

export default AddSchoolToSelectAdmin;
