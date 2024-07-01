import React from 'react';
import { globalPath } from "../global";
import Image from "next/image";

const OverviewItem = (props: any) => {
	const {src, title, value} = props;
	return (
		<div className={ "d-flex p-4 rounded-4" } style={ {border : "1px solid #EAECF0"} }>
			<div className={ "me-6" }>
				<div className={ "rounded-50 p-3" } style={ {backgroundColor : "#FFE4E8"} }>
					<Image
						src={ src }
						width={ 26 }
						height={ 28 }
						alt="số lớp học"
					/>
				</div>
			</div>
			<div>
				<div className={ "mb-2" }>{ title }</div>
				<div className={ "fw-bold h2" }>{ value }</div>
			</div>
		</div>
	);
};

export default OverviewItem;
