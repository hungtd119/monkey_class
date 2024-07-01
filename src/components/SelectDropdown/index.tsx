import React, { useEffect, useState } from "react";
import Select from "react-select";
import useTrans from "src/hooks/useTrans";
import { getDataModelsStorage } from "src/selection";
import { useAppStore } from "src/stores/appStore";

interface TypeProps {
  dataSelect: any[];
  placeholder: string;
  onChange?: (value: number | null) => void;
  isSelectSchool?: boolean;
  isSelectCourse?: boolean;
  defaultValue?: any;
  isDisabledSelect?: boolean;
}
const SelectDropdown = (props: TypeProps) => {
  const { dataSelect, placeholder, onChange, defaultValue,isSelectSchool, isSelectCourse, isDisabledSelect } = props;
  const trans = useTrans();

  const setSchoolId = useAppStore((state: any) => state.setSchoolId);
  const setCourseId = useAppStore((state: any) => state.setCourseId);
  const [value, setValue]= useState(defaultValue);
  const dataModels =
  useAppStore((state: any) => state.dataModels) ?? getDataModelsStorage();

  useEffect(()=>{
    setValue(defaultValue);
  },[defaultValue])

  // useEffect(()=> {
  //   const formatData = [{
  //     "id": dataModels[0]?.id ?? null,
  //   }]
  //   sessionStorage.setItem("school", JSON.stringify(formatData) ?? "");

  // },[])
  
  const handleChange = (selectedOption: { id: number, value: number; label: string } | null) => {
    setValue(selectedOption)
    if (onChange) {
      // onChange(selectedOption?.value || null);
    }
    // if (isSelectSchool) {
    //   const formatDataSessionStorage = [
    //     {
    //       "id": selectedOption?.value ?? null,
    //   }
    //   ]
    //   sessionStorage.setItem("school", JSON.stringify(formatDataSessionStorage) ?? "");
    //   return setSchoolId(selectedOption?.value || null);
    // }
    if (isSelectCourse) return setCourseId(selectedOption?.value || null);
  };

  return (
    <Select
      name="name"
      value={value}
      isDisabled={isDisabledSelect}
      options={dataSelect}
      className="basic-multi-select"
      classNamePrefix="select"
      placeholder={trans.selectHolder[placeholder]}
      onChange={(selectedOption) => handleChange(selectedOption)}
    />
  );
};

export default SelectDropdown;
