import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

import "./monitoring.scss"
const Monitoring = () => {

    const [patientData, setPatientData] = useState([]);

    useEffect(() => {
        async function getAllPatients() {
            try {
                const patientData = await axios.get(
                    "http://gs1ksa.org:3001/api/listOfAllTikects"
                );
                console.log(patientData.data);
                setPatientData(patientData.data);
            } catch (error) {
                console.log("Something is Wrong");
            }
        }
        getAllPatients();
    }, []);


    return (
        <div className='cntnr'>

            <div style={{ width: '90%', margin: 'auto' }}>
                {/* Waiting patients */}
                <div className='wheader pt-5 pb-3'>
                    <h2>Waiting For Triage</h2>
                    <h5>No. of Patients:  {patientData.length}</h5>
                </div>
                <Container fluid>
                    <Row className="wpatients mb-5">
                        {patientData.map((patient, i) => (
                            <Col lg={2} md={3} xs={5} className="waitingP" key={patient.tblQueueID}>
                       <div className="wnumber">
                        {patient.tblQueueID}
                                    <Link to={`/triage/${patient.tblQueueID}`}>
                                    <h3>{patient.tblQueueID}</h3>
                                    </Link>
                                </div>
                                <h5 className='name'>{patient.name}</h5>
                            </Col>
                        ))}
                    </Row>
                    <Button className='close float-end'>Close <IoMdClose/></Button>
                </Container>
            </div>
        </div>

    );
};

export default Monitoring;
