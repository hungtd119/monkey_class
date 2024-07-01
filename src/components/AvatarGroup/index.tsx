import React from 'react';

const AvatarGroup = (props:any) => {
	const {children} = props
	return (
		<div className={"d-flex"}>
			{children}
		</div>
	);
};

export default AvatarGroup;
