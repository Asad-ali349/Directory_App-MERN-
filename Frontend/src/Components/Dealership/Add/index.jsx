import React, { Fragment } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements'
import BasicFormControlClass from './BasicFormControl';


const BaseInput = () => {
  return (
    <Fragment>
      <Breadcrumbs mainTitle='Membres' parent='Ajouter un membre' title='Ajouter un membre' subParent='Membres' />
      <Container fluid={true}>
        <Row>
          <Col sm='12'>
            <BasicFormControlClass />
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default BaseInput;
