import React from 'react'
import { Form } from 'react-bootstrap'
import './selectelement.scss'

export const Selectelement = (props) => {
    const { lableClass, id, select_Label, name, handleBlur, handleChange, value, disabled, optionArray, formikValidation } = props
    return (
        <Form.Group className="mb-4">
            <Form.Label className={lableClass}>{select_Label}</Form.Label>
            <Form.Select
                name={name}
                id={id}
                onBlur={handleBlur}
                onChange={handleChange}
                value={value}
                selected={value}
                disabled={disabled}
                placeholder={value}
            >
                <option value="" disabled selected>Select</option>
                {optionArray}
            </Form.Select>
            {formikValidation}
        </Form.Group>
    )
}
