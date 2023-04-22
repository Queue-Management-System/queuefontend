import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import "./home.css"
import { IoIosPeople } from 'react-icons/io';
import { RiAdminFill } from 'react-icons/ri';
import { MdLocalHospital } from 'react-icons/md';
import { FaClinicMedical } from 'react-icons/fa';


const Home = () => {
    return (
        <Container fluid>
            <Row>
                <Col md={2} xs={3} style={{ height: '100vh' }} className='sidebar'>
                    <ul className='listItems'>
                        <Link to="/patientInformation" className='links'>
                        <li className='listItem'>
                        <IoIosPeople className='sicon'/> Patient Information</li>
                        </Link>
                        <Link to="/Monitoring" className='links'>
                        <li className='listItem'><MdLocalHospital className='sicon'/> Triage</li>
                        </Link>
                        <li className='listItem'> <FaClinicMedical className='sicon'/> Clinic</li>
                        <li className='listItem'>  
                           <RiAdminFill  className='sicon'/> Admin Panel</li>
                    </ul>
                </Col>
                <Col xs={9} md={10} className='divs'>
                    <Row >
                        <Col className='divItem'>
                            <Link to="/patientInformation" className="links">
                            <div className='svgs'>
                                <IoIosPeople className='svg'/>
                            </div>
                            Patient Information
                            </Link>
                        </Col>

                        <Col className='divItem'>
                            <Link to="/monitoring" className='links'>
                            <div className='svgs'>
                                <MdLocalHospital className='svg'/>
                            </div>
                            Triage
                            </Link>
                        </Col>
                        <Col className='divItem'>
                            <div className='svgs'>
                                <FaClinicMedical className='svg'/>
                            </div>
                            Clinic
                        </Col>
                        <Col className='divItem'>
                            <div className='svgs'>
                                <RiAdminFill  className='svg'/>
                            </div>
                            Admin Panel
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
