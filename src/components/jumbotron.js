import * as React from 'react';
import Container from 'react-bootstrap/Container';
import { StaticImage } from "gatsby-plugin-image"
//import {animated, useSpring} from 'react-spring'

const Jumbo = ({img, children}) => {
	return(<React.Fragment>
		<Container fluid className="jumbotron p-5">
			{children}
			<StaticImage src="https://media.geeksforgeeks.org/wp-content/uploads/20210425000233/test-300x297.png"></StaticImage>
		</Container>
	</React.Fragment>)
}

export default Jumbo