import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import SelectLevelMenuItem from "./SelecLevelMenuItem";
import { useAppStore } from "src/stores/appStore";
import { getFirstCategoryId } from "src/selection";
import { levelDefault, STATUS_DONE_LESSON, STATUS_LOCK, STATUS_UNLOCK } from "src/constant";
import { da } from "date-fns/locale";

const SelectLevelMenu = (props: any) => {
  const { listHocLieu,isSm = false,currentSchedule = null } = props;
  const [openAccordion, setOpenAccordion] = useState(null);

  const setLevelId = useAppStore((state: any) => state.setLevelId);
  const setUnitLevelId = useAppStore((state: any) => state.setUnitLevelId);
  const unitLevelId = useAppStore((state: any) => state.unitLevelId) || getFirstCategoryId(listHocLieu);

  const handleAccordionToggle = (eventKey: any) => {
    setOpenAccordion((prevAccordion) => (prevAccordion === eventKey ? null : eventKey));
  };
  useEffect(() => {
    setUnitLevelId(getFirstCategoryId(listHocLieu));
    sessionStorage.setItem("unitActive", getFirstCategoryId(listHocLieu));
  }, []);

  const handleActiveUnit = (unitId: any) => {
    setUnitLevelId(unitId);
    sessionStorage.setItem("unitActive", unitId);
  };
  return (
    <>
    {(listHocLieu || []).map((data: any): any => {
        return (
          <Accordion
            key={data.id}
            className="my-3"
            activeKey={openAccordion}
            onSelect={handleAccordionToggle}
          >
            <Accordion.Item eventKey={data.name}>
              <Accordion.Header onClick={() => setLevelId(data.id)}>{isSm ? levelDefault.find((level:any) => level.id === data.id)?.label : data.name}</Accordion.Header> 
              <div className="max-h-300 overflow-auto bg-fff" key={data.id}>
                {(data.game_categories || []).map((unit: any) => (
                  <SelectLevelMenuItem
                    key={unit.id}
                    id={unit.id}
                    label={unit.name}
                    active={unitLevelId === unit.id}
                    isLock={isSm ? (
											unit.id !== currentSchedule?.unit_id && (unit.game_lessons.every((gl:any) => gl.schedule_status === STATUS_LOCK))
                    
                    ) : unit.status === 0}
                    isSm={isSm}
                    handleActive={() => handleActiveUnit(unit.id)}
                  /> 
                ))}
              </div>
            </Accordion.Item>
          </Accordion>
        );
    })}

    </>
  );
};

export default SelectLevelMenu;
