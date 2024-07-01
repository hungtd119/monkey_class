import React from 'react';
import Image from "next/image";
import { globalPath } from "../../../global";
import HeaderPage from "../../../components/HeaderPage";
import OverviewItem from "../../../components/OverviewItem";
import { Button, Col } from "react-bootstrap";
import { OverViewItem } from "../../../types/global";
import Card from "../../../components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function CardCustom (props: any) {
	const {title, overview, children,actions,count,headerTitle} = props
	return (
		<div className={ "p-6" }>
			<header>
				<HeaderPage image={ <Image
					src={ `${ globalPath.pathSvg }/home-line.svg` }
					width={ 20 }
					height={ 20 }
					alt="school"
				/> } title={ title }/>
			</header>
			<div className={ "h3 fw-bold my-6" }>{ title }</div>
			<div className={ "d-flex flex-row gap-6" }>
				{
					overview?.map ((item: OverViewItem) => <Col>
							<OverviewItem
								src={ item.src }
								title={ item.title }
								value={ item.value }
							></OverviewItem>
						</Col>
					)
				}
			</div>
			<div>
				<Card
					header={
						<div className={ "d-flex justify-content-between w-100" }>
							<div className={ "d-flex" }>
								<p className={ "h5 fw-bold" }>{headerTitle}</p>
								<div className={
									"ms-2"
								}>
									<span className={ "rounded-4 px-1" } style={ {
										border : "1px solid #EAECF0", fontSize : "12px"
									} }>{count}</span>
								</div>
							</div>
							<div>
								{actions}
							</div>
						</div>
					}
					option={ <div className={ "p-4" }>option</div> }
				>
					<hr className={ "m-0" } style={ {border : "1px solid #ccc"} }/>
					{ children }
				</Card>
			</div>
		</div>
	);
}

export default CardCustom;
