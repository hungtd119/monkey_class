import classNames from "classnames";
import React, { useState } from "react";
import { Accordion } from "react-bootstrap";

interface TypeLevelMenuItem {
  label: string;
  active: boolean;
  isLock?: boolean;
  id: number;
  handleActive: (id: number) => void;
  isSm?: boolean;
}
const SelectLevelMenuItem = (props: TypeLevelMenuItem) => {
  const { label, active, isLock, id, handleActive,isSm = false } = props;
	return (
    <div className="unit-content">
      <Accordion.Body
        className={classNames("pointer", { 
          disabled: isSm ? false : isLock,
          active: active,
        })}
        onClick={() => handleActive(id)}
      >
        {!isLock ? (
          <span>{label}</span>
        ) : (
          isSm ? (<span>
            {label} <i className="fa fa-lock ms-4" aria-hidden="true" />
          </span>) : (<span>{label}</span>)
        )}
      </Accordion.Body>
    </div>
  );
};

export default SelectLevelMenuItem;
