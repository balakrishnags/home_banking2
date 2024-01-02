import React from 'react'
import { Accordion } from 'react-bootstrap'
import './accordionitem.scss'

export const AccordionItem = (props) => {
    const { accordionKey, acordion_head, acordion_data } = props
    return (
        <Accordion.Item className='accitem' eventKey={accordionKey}>
            <Accordion.Header className='acchead'>{acordion_head}</Accordion.Header>
            <Accordion.Body>
                {acordion_data}
            </Accordion.Body>
        </Accordion.Item>
    )
}
