import * as React from 'react';
import Button from 'react-bootstrap/Button';
import {Children} from "react";
import Container from "react-bootstrap/Container";
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const Timeline = ({children}) => {
	const circleButton = {width: `30px`, height: `30px`, borderRadius:`15px`};
	return (
		<React.Fragment>
			<ButtonGroup>
				<Container className="d-flex justify-content-between">			
					{Children.map(children, (child, index) => {
						return(<Button style={circleButton} className="btn-circle btn-primary"/>);	
					})}
				</Container>
			</ButtonGroup>
			{children}
		</React.Fragment>
	)
}

export default Timeline;