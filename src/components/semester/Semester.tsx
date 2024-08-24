import React from 'react';
import { Accordion } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import extractMetaData, {MDMetadata} from '../../utils/extractMD';
import Markdown from 'react-markdown';

const MySemester: React.FC<{ semester: string, courses: string[] }> = ({ semester, courses }) => {
    return (
        <Col className="col-3">
            <h2>{semester}</h2>
            <Accordion>
                {courses.map((course, index) => {
                    const mdCourseMetadata: MDMetadata = extractMetaData(course);
                    return (
                        <Accordion.Item key={index} eventKey={index.toString()}>
                            <Accordion.Header>
                                <div>
                                    {mdCourseMetadata.metadata['logo'] ? (
                                        <>
                                            <img src={mdCourseMetadata.metadata['logo']} alt={mdCourseMetadata.metadata['utcode']} style={{ height: mdCourseMetadata.metadata['size'] }} />
                                        </>
                                    ) : (
                                        <>
                                            <h3>{mdCourseMetadata.metadata['utcode']}</h3>
                                        </>
                                    )}
                                    <h5><strong>{mdCourseMetadata.metadata['title']}</strong>: {mdCourseMetadata.metadata['professor']}</h5>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Markdown>{mdCourseMetadata.markdown}</Markdown>
                            </Accordion.Body>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        </Col>
    );
};

export default MySemester;