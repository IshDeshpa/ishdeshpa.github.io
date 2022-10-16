import * as React from 'react';
import Button from 'react-bootstrap/Button';
import {Children} from "react";
import Container from "react-bootstrap/Container";

const Timeline = ({children}) => {
	const [compIndex, setIndex] = React.useState(0);
	const circleButton = {width: `30px`, height: `30px`, borderRadius:`15px`};
	
	return(
		<React.Fragment>
			<Container className="d-flex justify-content-between">			
				{Children.map(children, (child, index) => {
					return(<Button style={circleButton} className="btn-circle btn-primary" onClick={()=>{
						setIndex(index);
					}}/>);	
				})}
			</Container>
			{Children.map(children, (child, index) => {
				return(compIndex===index && child);
			})}
		</React.Fragment>
	);
}

export default Timeline;