import "./patientInformation.scss";
import { Form, Row, Col, Container, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { FcPrint } from "react-icons/fc";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

function PatientInformation() {
  // UseState
  const [patientName, setPatientName] = useState("");
  const [complain, setComplain] = useState("");
  const [pmh, setPMH] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [idNumber, setIDNumber] = useState("");
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState("");
  const [status, setStatus] = useState("Non-Critical");
  const [nationality, setNationality] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState("");
  const [trNumber, setTrNumber] = useState(1);
  const [tblQueue,setTblQueue] = useState(null);
 

  // Use Effects
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  // useEffect for restarting TR from 1 after when it gets 12:01 am at night
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 1) {
        setTrNumber(1);
      }
    }, 60000); // check every minute

    return () => clearInterval(interval);
  }, []);

  // print button and Api
  const handlePrint = async (event) => {
    event.preventDefault();
    try {
      // Make a POST request to the API endpoint to register the patient.
      const response = await fetch("http://gs1ksa.org:3001/api/tblQueue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nationality: nationality,
          Pmh: pmh,
          gender: gender,
          id: idNumber,
          mobileno: mobileNumber,
          patient_age: age,
          complain: complain,
          name: patientName,
          ticket: trNumber,
          tblQueueID:tblQueue,
        }),
      });
      const post = await response.json()
      setTblQueue(post.recordset[0].tblQueueID)
      console.log(post.recordset[0].tblQueueID);
      const getdata = await fetch(
        `http://gs1ksa.org:3001/api/getQueuPateintById/${tblQueue+1}`,
        {
          method: "GET",
        }
      );
      const data = await getdata.json();
     
      console.log(data.recordset[0]);
      if (data) {
       var bar= data.recordset[0];
        var barr =bar.barcode;
       console.log(barr);
        const content = `
        --------------------------
        <span style="font-size: 24pt;padding-left:80px;font-weight:bold">${trNumber}TR</span>
        <span style="font-size: 16pt;padding-left:20px;font-weight:600"> ${patientName}</span>

        <span style="padding-top:50px">${currentDateTime.toLocaleDateString()}     ${currentDateTime.toLocaleTimeString()}</span>
        <img style="width:200px;height:40px" src=${barr} />
        Complain: ${complain}
        --------------------------
        Thanks you choosing us!
      `;

        setTrNumber(trNumber + 1);
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
      } else {
        setErrorMessage("Registration failed. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2 className="pt-4 pb-4 text-center">
        Patient Information System (Visual Triage)
      </h2>
      <Container className="pt-5 pcontainer">
        <Form onSubmit={handlePrint}>
          <Form.Group as={Row} controlId="formName" className="pb-4">
            <Form.Label column xs="2" className="Form">
              Patient Name:
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                placeholder="Enter Patient Name"
                xs="7"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </Col>
            <Col sm="0"></Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formName" className="pb-4">
            <Form.Label column xs="2" className="Form">
              Complain:
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                placeholder="Enter Complain"
                xs="7"
                required
                value={complain}
                onChange={(e) => setComplain(e.target.value)}
              />
            </Col>
            <Col sm="0"></Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPMH" className="pb-4">
            <Form.Label column xs="2" className="Form">
              PMH:
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                placeholder="Enter PMH"
                xs="7"
                required
                value={pmh}
                onChange={(e) => setPMH(e.target.value)}
              />
            </Col>
            <Col sm="0"></Col>
            {/* Mobile and id */}
          </Form.Group>
          <Form.Group
            as={Row}
            controlId="formMobileNumber"
            className="pb-4 Form"
          >
            <Form.Label column xs={2} className="text">
              Mobile:
            </Form.Label>
            <Col xs={4}>
              <Form.Control
                type="tel"
                placeholder="Enter Mobile Number"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </Col>

            <Form.Label
              column
              xs={2}
              className="Form text"
              controlId="formIDNumber"
            >
              ID :
            </Form.Label>
            <Col xs={4}>
              <Form.Control
                type="text"
                placeholder="Enter ID Number"
                required
                value={idNumber}
                onChange={(e) => setIDNumber(e.target.value)}
              />
            </Col>
          </Form.Group>
          {/* Gender and Age */}
          <Form.Group as={Row} controlId="formGender" className="pb-4">
            <Form.Label column xs={2} className="Form">
              Gender:
            </Form.Label>
            <Col x={4}>
              <Form.Control
                as="select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Form.Control>
            </Col>
            <Form.Label column xs={2} className="Form" controlId="formAge">
              Age:
            </Form.Label>
            <Col>
              <Form.Control
                type="number"
                required
                placeholder="Enter Age"
                xs={4}
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </Col>
          </Form.Group>
          {/* Status and Nitionality  */}
          <Form.Group as={Row} controlId="formStatus" className="pb-4">
            <Form.Label column xs={2} className="Form">
              Status:
            </Form.Label>
            <Col xs={4}>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Non-Critical</option>
                <option>Critical</option>
              </Form.Control>
            </Col>

            <Form.Label
              column
              xs={2}
              className="Form"
              controlId="formNationality"
            >
              Nationality:
            </Form.Label>
            <Col xs={4}>
              <Form.Control
                type="text"
                placeholder="Enter Nationality"
                required
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
              />
            </Col>
          </Form.Group>

          {/* Time and buttons */}
          <Row className="pt-4">
            <Col className="Form " xs={2}>
              {currentDateTime.toLocaleDateString()}
            </Col>

            <Col className="time Form" xs={2}>
              {currentDateTime.toLocaleTimeString()}
            </Col>

            <Col xs={2} md={2} lg={4}>
              <Form.Check
                className="check"
                type="checkbox"
                label="72Hr Return Visit"
              />
            </Col>
            <Col xs={3} md={3} lg={2}>
              <Button className="pbtn" type="submit" >
                Print <FcPrint />
              </Button>
            </Col>
            <Col xs={3} md={3} lg={2}>
              <Link to="/home">
                <Button className="pbtn">
                  Close <IoMdClose />
                </Button>
              </Link>
            </Col>
          </Row>
          {errorMessage && <div className="text-danger">{errorMessage}</div>}
        </Form>
      </Container>
    </div>
  );
}

export default PatientInformation;
