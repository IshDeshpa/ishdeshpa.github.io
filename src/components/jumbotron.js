import * as React from 'react';
import Container from 'react-bootstrap/Container';
//import {animated, useSpring} from 'react-spring'

const Jumbo = ({children}) => {
	<React.Fragment>
		<Container fluid bg="light" className="p-5 rounded-lg m-3">
			{children}
		</Container>
	</React.Fragment>
}

export default Jumbo