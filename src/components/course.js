import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Col from "react-bootstrap/Col"

const Course = ({children, courseName, subtitle, width, theme}) => {
	return(
		<React.Fragment>
			<Col className={"py-3 col-xs-12 col-md-"+width}>
				<Card className="px-3" bg={theme.toLowerCase()} text={theme.toLowerCase()==='dark'?'light':'dark'}>
					<Card.Header>
						<Card.Title as="h2" className="text-uppercase fw-bolder">
							{courseName}
						</Card.Title>
						<Card.Subtitle as="h4">
							{subtitle}
						</Card.Subtitle>
					</Card.Header>
					<Card.Body>
						<Card.Text>
							{children}
						</Card.Text>
					</Card.Body>
				</Card>
			</Col>
		</React.Fragment>
	)
}

export default Course;