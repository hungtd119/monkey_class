import React from 'react';
import Image from "next/image";
import { globalPath } from "../global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const HeaderPage = (props:any) => {
	const {image, title} = props;
	return (
		<div className="d-flex align-items-center">
			{image}
			<FontAwesomeIcon icon={ faChevronRight } className={ "ms-2 me-4" } width={ 8 } height={ 8 }/>
			<p className="m-0 h6 fw-medium">{title}</p>
		</div>
	);
};

export default HeaderPage;
