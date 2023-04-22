import { Form, Row, Col, Container, Button,Modal } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import "./triage.scss"
import axios from "axios";

function Triage() {
    // useState
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const { id } = useParams();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [patientData, setPatientData] = useState({})
    // useEffects

    useEffect(() => {
        async function getAllPatients() {
            try {
                const patientData = await axios.get(
                    `http://gs1ksa.org:3001/api/getQueuPateintById/${id}`
                );
                console.log(patientData.data.recordset[0].tblQueueID);
                setPatientData(patientData.data.recordset[0]);
            } catch (error) {
                console.log("Something is Wrong");
            }
        }
        getAllPatients();
    }, [id]);


    function onTextFieldChange(e) {
        setPatientData({
            ...patientData,
            [e.target.name]: e.target.value,
        });
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        try {
            await axios.put(
                `http://gs1ksa.org:3001/api/updateQueuePateints/${id}`,
                patientData
            );
        } catch (error) {
            console.log("Something is Wrong");
        }
    }

    //   this is for time
    useEffect(() => {
        const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    // Reprint
    const onPrintClick = async (event) => {
        try {
            event.preventDefault();
            const currentDateTime = new Date();
    
            const getdata = await fetch(
                "http://gs1ksa.org:3001/api/getQueuPateintById/1",
                {
                  method: "GET",
                }
            );
            const data = await getdata.json();
    
            if (data) {
                var bar = data.recordset[0].barcode;
                console.log(bar);
    
                const content = `
                  --------------------------
                  <span style="font-size: 24pt;padding-left:80px;font-weight:bold">${patientData.qnumber}TR</span>
                  <span style="font-size: 16pt;padding-left:20px;font-weight:600"> ${patientData.name}</span>
                  Age:${patientData.patient_age}        Category:${patientData.category}
                  <span style="padding-top:50px">${currentDateTime.toLocaleDateString()} ${currentDateTime.toLocaleTimeString()} Waiting:${patientData.waiting}</span>
                  <img style="width:200px;height:40px" src=${bar} />
                  Complain:       ${patientData.complain}
                        Vital Signs
                  BP:${patientData.bp}           SPO2:${patientData.spo2}
                  TEMP:${patientData.temp}      RBS:${patientData.rbs}
                  HR:${patientData.hr}             HT:${patientData.height}
                  RR:${patientData.rr}             WT:${patientData.weight}
                  Time Vs Token${patientData.last_update}
                  --------------------------
                  Thanks you choosing us!
                `;
    
                const printWindow = window.open();
                printWindow.document.write(`
                  <html>
                    <body>
                      <pre>${content}</pre>
    
                      <style>
                        @media print {
                          body {
                            font-size: 12pt;
                          }
                          pre {
                            white-space: pre-wrap;
                          }
                          @page {
                            size: auto;
                            margin: 0;
                          }
                          @page :header {
                            display: none;
                          }
                          @page :footer {
                            display: none;
                          }
                        }
                      </style>
                    </body>
                  </html>
                `);
    
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
                printWindow.close();
            }
        } catch (error) {
            console.error('Error occurred while calling API: ', error);
        }
    };
    
      


    return (
        <div>
            <h2 className='py-4 text-center'>Patient  Information System (Triage)</h2>
            {/* Form */}
            <Container fluid className='pt-4 pcontainer'>
                <Form>
                    {/* ticket , time and call patient button */}
                    <Form.Group as={Row} controlId="formName" className='pb-2'>
                        <Col className="Form" xs={3} >
                            EB TN: 1
                        </Col>
                        <Col className="Form dataTime" xs={6} lg={7} >
                            {currentDateTime.toLocaleDateString()} {currentDateTime.toLocaleTimeString()}
                        </Col>
                        <Col lg={2} xs={3} >
                            <Button className="pbtn greenBtn">Call Patient</Button>
                        </Col>
                    </Form.Group>
                    {/* Name and assign button */}
                    <Form.Group as={Row} controlId="formName" className='pb-2'>
                        <Form.Label column sm={1} xs={2} className="Form">
                            Name:
                        </Form.Label>
                        <Col>
                            <Form.Control
                                autoComplete="name"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                value={patientData.name}
                                onChange={(e) => onTextFieldChange(e)}
                                sm={9}
                            />
                        </Col>
                        <Col xs={3} sm={2}>
        <Button className="pbtn greenBtn" onClick={handleShow}>Assign</Button>
      </Col>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Location</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="formDepartmentCode">
              <Form.Label>Department Code:</Form.Label>
              <Form.Control type="text" placeholder="Enter department code" />
            </Form.Group>

            <Form.Group controlId="formTicketNumber">
              <Form.Label>Ticket Number:</Form.Label>
              <Form.Control type="text" placeholder="Enter ticket number" />
            </Form.Group>

            <Form.Group controlId="formLocation">
              <Form.Label>Location:</Form.Label>
              <Form.Control as="select">
                <option>ACU</option>
                <option>CCU</option>
                <option>OT</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleClose}>Assign</Button>
        </Modal.Footer>
      </Modal>
                    </Form.Group>

                    {/* Id Name and assign button */}
                    <Form.Group as={Row} controlId="formNationality" className='pb-2'>
                        <Form.Label column xs={2} sm={1} className='text Form'>
                            ID:
                        </Form.Label>
                        <Col xs={3} sm={4}>
                            <Form.Control
                                type="Number"
                                autoComplete="name"
                                name="id"
                                variant="outlined"
                                required
                                fullWidth
                                id="id"
                                label="Name"
                                value={patientData.id}
                                onChange={(e) => onTextFieldChange(e)}
                            />
                        </Col>
                        <Form.Label column xs={1} className='text Form'>
                            Gender:
                        </Form.Label>
                        <Col xs={3} sm={4}>
                            <Form.Select defaultValue="Male" >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Non-Binary</option>
                            </Form.Select>
                        </Col>
                        <Col xs={3} sm={2}>
                            <Button className="pbtn blueBtn" onClick={(e) => onFormSubmit(e)}
                            >Save</Button>
                        </Col>
                    </Form.Group>

                    {/* Age Nitionality and save button */}
                    <Form.Group as={Row} controlId="formNationality" className='pb-2'>
                        <Form.Label column xs={2} sm={1} className='text Form'>
                            Age
                        </Form.Label>
                        <Col xs={3} sm={4}>
                        <Form.Control
                  type="Number"
                  placeholder="Enter Age"
                  className="inputText"
                  autoComplete="name"
                  name="patient_age"
                  variant="outlined"
                  required
                  fullWidth
                  id="patient_age"
                  label="Name"
                  value={patientData.patient_age}
                  onChange={(e) => onTextFieldChange(e)}
                />
                        </Col>
                        <Form.Label column xs={1} className='text Form'>
                            Nationality:
                        </Form.Label>
                        <Col xs={3} sm={4}>
                            <Form.Select defaultValue="KSA">
                                <option>KSA</option>
                                <option>USA</option>
                                <option>Canada</option>
                                <option>France</option>
                                <option>Germany</option>
                                <option>Japan</option>
                            </Form.Select>
                        </Col>
                        <Col xs={3} sm={2}>
                            <Button className="pbtn camalBtn"onClick={onPrintClick}>RePrint</Button>
                        </Col>
                    </Form.Group>

                    {/* checkbox Complain and rePrint button */}
                    <Form.Group as={Row} controlId="formName" className='pb-2'>
                        <Col xs={1}>
                            <Form.Check className="check" type="checkbox" label="72Hr" />
                        </Col>
                        <Form.Label column xs={2} md={1} className="Form">
                            Complain:
                        </Form.Label>
                        <Col md={8} sm={7} xs={6}>
                        <Form.Control
                  type="text"
                  placeholder="Enter Complain"
                  className="inputText"
                  autoComplete="name"
                  name="complain"
                  variant="outlined"
                  required
                  fullWidth
                  id="complain"
                  label="Name"
                  value={patientData.complain}
                  onChange={(e) => onTextFieldChange(e)}
                />
                        </Col>
                        <Col xs={3} sm={2}>
                            <Button className="pbtn camalBtn">
                                LAMA
                            </Button>
                        </Col>
                    </Form.Group>
                    {/* PMH  and LAMA button*/}

                    <Form.Group as={Row} controlId="formName" className="pb-2">
                        <Form.Label column xs="2" sm={1} className="Form ">
                            PMH:
                        </Form.Label>
                        <Col>
                        <Form.Control
                  type="text"
                  placeholder="Enter PMH"
                  sm="9"
                  autoComplete="name"
                  name="Pmh"
                  variant="outlined"
                  required
                  fullWidth
                  id="Pmh"
                  label="Name"
                  value={patientData.Pmh}
                  onChange={(e) => onTextFieldChange(e)}
                />
                        </Col>
                        <Col xs={3} sm={2}>
                            <Button className="pbtn camalBtn">
                                DAMA
                            </Button>
                        </Col>
                    </Form.Group>
                    {/* category mobile number and DAMA button */}
                    <Form.Group as={Row} controlId="formName" className="pb-2">
                        <Form.Label column xs={2} sm={1} className='text Form'>
                            Category:
                        </Form.Label>
                        <Col xs={3} sm={4}>
                            <Form.Select defaultValue="First" >
                                <option>Second</option>
                                <option>First</option>
                                <option>Third</option>
                            </Form.Select>
                        </Col>
                        <Form.Label column xs={1} className='text Form'>
                            Mobile:
                        </Form.Label>
                        <Col xs={3} sm={4}>
                        <Form.Control
                  type="Number"
                  placeholder="Mobile Number"
                  sm="9"
                  autoComplete="name"
                  name="mobileno"
                  variant="outlined"
                  required
                  fullWidth
                  id="mobileno"
                  label="Name"
                  value={patientData.mobileno}
                  onChange={(e) => onTextFieldChange(e)}
                />
                        </Col>
                        <Col xs={3} sm={2}>
                            <Button className="pbtn camalBtn">
                                LWBTR
                            </Button>
                        </Col>
                    </Form.Group>


                    {/* BP, SPO2 and close button  */}
                    <Form.Group as={Row} controlId="formNationality" className='pb-2'>
                        <Form.Label column xs={2} sm={1} className='text Form'>
                            BP:
                        </Form.Label>
                        <Col xs={2} sm={3}>
                            <Form.Control type="text"                   autoComplete="name"
                  name="bp"
                  variant="outlined"
                  required
                  id="bp"
                  label="Name"
                  value={patientData.bp}
                  onChange={(e) => onTextFieldChange(e)} />
                        </Col>
                        <Form.Label column xs={2} sm={1} className='text Form'>
                            SPO2:
                        </Form.Label>
                        <Col xs={2} sm={3}>
                            <Form.Control                   type="text"
                  autoComplete="name"
                  name="bp"
                  variant="outlined"
                  required
                  fullWidth
                  id="bp"
                  label="Name"
                  value={patientData.spo2}
                  onChange={(e) => onTextFieldChange(e)}
                 />
                        </Col>
                        <Col xs={1} sm={2}></Col>
                        <Col xs={3} sm={2}>
                            <Button className="pbtn">
                                Close
                            </Button>
                        </Col>
                    </Form.Group>
                    {/* Temp RBS and Start */}
                    <Form.Group as={Row} controlId="formNationality" className='pb-2'>
                        <Form.Label column xs={2} sm={1} className='text Form'>
                            TEMP:
                        </Form.Label>
                        <Col xs={2} sm={3}>
                        <Form.Control
                  type="text"
                  placeholder=""
                  autoComplete="name"
                  name="temp"
                  variant="outlined"
                  required
                  fullWidth
                  id="temp"
                  label="Name"
                  value={patientData.temp}
                  onChange={(e) => onTextFieldChange(e)}
                />
                        </Col>
                        <Form.Label column xs={2} sm={1} className='text Form'>
                            RBS:
                        </Form.Label>
                        <Col xs={2} sm={3}>
                            <Form.Control                   type="text"
                  placeholder=""
                  autoComplete="name"
                  name="rbs"
                  variant="outlined"
                  required
                  fullWidth
                  id="rbs"
                  label="Name"
                  value={patientData.rbs}
                  onChange={(e) => onTextFieldChange(e)}
                />
                        </Col>
                        <Form.Label column xs={2} sm={1} className='text Form'>
                            Start:
                        </Form.Label>
                        <Col xs={2} sm={3}>
                        <Form.Control
                  type="text"
                  placeholder=""
                  autoComplete="name"
                  name="start_dt"
                  variant="outlined"
                  required
                  fullWidth
                  id="start_dt"
                  label="Name"
                  value={patientData.start_dt}
                  onChange={(e) => onTextFieldChange(e)}
                />
                        </Col>
                    </Form.Group>
                    {/* HR, Height and allergies*/}
                    <Form.Group as={Row} controlId="formNationality" className='pb-2'>
                        <Form.Label column xs={2} sm={1} className='text Form'>
                            HR:
                        </Form.Label>
                        <Col xs={2} sm={3}>
                        <Form.Control
                  type="text"
                  placeholder=""
                  autoComplete="name"
                  name="hr"
                  variant="outlined"
                  required
                  fullWidth
                  id="hr"
                  label="Name"
                  value={patientData.hr}
                  onChange={(e) => onTextFieldChange(e)}
                />
                        </Col>
                        <Form.Label column xs={2} sm={1} className='text Form'>
                            HEIGHT:
                        </Form.Label>
                        <Col xs={2} sm={3}>
                        <Form.Control
                  type="text"
                  placeholder=""
                  autoComplete="name"
                  name="height"
                  variant="outlined"
                  required
                  fullWidth
                  id="height"
                  label="Name"
                  value={patientData.height}
                  onChange={(e) => onTextFieldChange(e)}
                />
                        </Col>
                        <Form.Label column xs={2} sm={1} className='text Form allergies'>
                            Allergies:
                        </Form.Label>
                        <Col xs={2} sm={3}>
                            <div>
                                <Form.Check inline type="radio" label="Yes" name="allergies" id="allergies-yes" />
                                <Form.Check inline type="radio" label="No" name="allergies" id="allergies-no" />
                            </div>
                        </Col>
                    </Form.Group>
                    {/* RR, WEIGHT AND SPECIFY */}
                    <Form.Group as={Row} controlId="formNationality" className='pb-2'>
                        <Form.Label column xs={2} sm={1} className='text Form'>
                            RR:
                        </Form.Label>
                        <Col xs={2} sm={3}>
                        <Form.Control
                  type="text"
                  placeholder=""
                  autoComplete="name"
                  name="rr"
                  variant="outlined"
                  required
                  fullWidth
                  id="rr"
                  label="Name"
                  value={patientData.rr}
                  onChange={(e) => onTextFieldChange(e)}
                />
                        </Col>
                        <Form.Label column xs={2} sm={1} className='text Form'>
                            WEIGHT:
                        </Form.Label>
                        <Col xs={2} sm={3}>
                        <Form.Control
                  type="text"
                  placeholder=""
                  autoComplete="name"
                  name="weight"
                  variant="outlined"
                  required
                  fullWidth
                  id="weight"
                  label="Name"
                  value={patientData.weight}
                  onChange={(e) => onTextFieldChange(e)}
                />
                        </Col>
                        <Form.Label column xs={2} sm={1} className='text Form'>
                            SPECIFY:
                        </Form.Label>
                        <Col xs={2} sm={3}>
                        <Form.Control
                  type="text"
                  placeholder=""
                  autoComplete="name"
                  name="consultspecialtyid"
                  variant="outlined"
                  required
                  fullWidth
                  id="consultspecialtyid"
                  label="Name"
                  value={patientData.consultspecialtyid}
                  onChange={(e) => onTextFieldChange(e)}
                />
                        </Col>
                    </Form.Group>
                    {/* ASSIGN TO AND TIME VS */}
                    <Form.Group as={Row} controlId="formNationality" className='pb-2'>
                        <Form.Label column xs={8} className='text Form'>
                            ASSIGN TO :
                        </Form.Label>

                        <Form.Label column xs={2} sm={1} className='text Form'>
                            TIME VS:
                        </Form.Label>
                        <Col xs={2} sm={3}>
                        <Form.Control
                  type="text"
                  placeholder=""
                  autoComplete="name"
                  name="time"
                  variant="outlined"
                  required
                  fullWidth
                  id="timevs"
                  label="Name"
                  value={patientData.last_update}
                  onChange={(e) => onTextFieldChange(e)}
                />
                        </Col>
                    </Form.Group>
                </Form>
            </Container>
        </div>
    )
}

export default Triage