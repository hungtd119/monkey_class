import React from 'react';
import Image from "next/image";
import { globalPath } from "../../global";
import styles from "./Avatar.module.scss";

const Avatar = (props: any) => {
	const {src, alt, count} = props
	return (
		<div className={ styles.avatar }
		     style={ {marginLeft : "-12px", borderRadius : "50px", border : "3px solid white"} }>
			{
				count ? <div style={{width:"34px",
						height:"34px",
						backgroundColor:"#F2F4F7", borderRadius:"50%"}} className={"d-flex justify-content-center align-items-center"}>+{ count }</div> :
					<Image src={ src ? src : `${ globalPath.pathImg }/avatar_random1.png` } alt={ alt ? alt : "avatar" }
					       width={ 32 } height={ 32 }/>
			}
		</div>
	);
};

export default Avatar;
