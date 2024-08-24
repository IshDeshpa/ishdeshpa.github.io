import React from "react";

import MySemester from "../semester/Semester";
import Row from 'react-bootstrap/Row';

import './experience.scss';

const MyExperience: React.FC = () => {
    // Get all coursework from courses directory
    const courses : any = import.meta.glob("./experience/**/*.md", {eager: true, query: "?raw"});

    // Organize coursework by semester
    const coursesBySemester : { [key : string] : string[]} = {};
    Object.keys(courses).forEach((path) => {
        const semester : string = path.split('/')[2];
        const semesterFormatted : string = semester[0].toUpperCase() + semester.slice(1).replace(/(\d+)/i, ' $1')

        if (!coursesBySemester[semesterFormatted]) {
            coursesBySemester[semesterFormatted] = [];
        }
        coursesBySemester[semesterFormatted].push(courses[path].default as string);
    });
    
    return (
        <div className="m-2 p-2 experience" id="Experience">
            <h1 className="fw-bold text-decoration-underline">Experience</h1>
            <Row className="scrollable flex-row flex-nowrap mt-4 pb-4 pt-2">
                {Object.keys(coursesBySemester).sort((a, b) => {
                    // Convert semester strings to date objects for comparison
                    const sortOrder = ['Spring', 'Summer', 'Fall'];

                    const semesterA = a.split(' ')[0];
                    const semesterB = b.split(' ')[0];
                    const yearA = parseInt(a.split(' ')[1]);
                    const yearB = parseInt(b.split(' ')[1]);

                    if (yearA === yearB) {
                        // If the years are the same, use the sort order
                        return sortOrder.indexOf(semesterB) - sortOrder.indexOf(semesterA);
                    } else {
                        // Sort by year in descending order
                        return yearB - yearA;
                    }
                }).map((semester, index) => (
                    <MySemester key={index} semester={semester} courses={coursesBySemester[semester]}></MySemester>
                ))}
            </Row>
        </div>
    );
};

export default MyExperience;