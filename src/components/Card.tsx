import React from 'react';

function Card (props: any) {
	const {header, option, children, footer} = props
	return (
		<div className={ "w-100 my-4 rounded-4" } style={ {border : "1px solid #EAECF0"} }>
			<div className={ "p-4" }>
				{ header }
			</div>
			<hr style={{border:"1px solid #ccc"}}/>
			<div>
				{ option }
			</div>
			<div>
				{ children }
			</div>
			<div>
				{ footer }
			</div>
		</div>
	);
}

export default Card;
