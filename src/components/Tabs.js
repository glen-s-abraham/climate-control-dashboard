import React, { useState, useEffect } from 'react';
import TabContent from './TabContent';
import { Container, Row, Col, ButtonGroup, Button } from 'react-bootstrap';

const Tabs = () => {
    const [activeTab, setActiveTab] = useState('sensordata');
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/${activeTab}`);
            const result = await res.json();
            setData(result);
        };
        fetchData();
    }, [activeTab]);

    return (
        <Container fluid>
            <Row className="justify-content-center my-3">
                <Col xs="auto">
                    <ButtonGroup>
                        <Button onClick={() => setActiveTab('sensordata')} active={activeTab === 'sensordata'}>
                            Sensor Data
                        </Button>
                        <Button onClick={() => setActiveTab('relaystatus')} active={activeTab === 'relaystatus'}>
                            Relay Status
                        </Button>
                        <Button onClick={() => setActiveTab('errorlogs')} active={activeTab === 'errorlogs'}>
                            Error Logs
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TabContent data={data} type={activeTab} />
                </Col>
            </Row>
        </Container>
    );
};

export default Tabs;