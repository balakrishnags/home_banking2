import React, { useState } from 'react'
import { Images } from '../../utils/images';
import { Form } from 'react-bootstrap';

export const PasswordShowHide = (props) => {
    const {
        input_label,
        type,
        placeholder,
        name,
        handleBlur,
        handleChange,
        value,
        lableClass,
        formikValidation,
        defaultValue,
        disabled, id, handleFocus
    } = props;
    const [isVisible, setVisible] = useState(false);

    const togglePassword = () => {
        setVisible(!isVisible)
    }

    return (
        <Form.Group className="mb-4 position-relative">
            <Form.Label className={lableClass}>{input_label}</Form.Label>
            <Form.Control
                id={id}
                type={isVisible ? "text" : "password"}
                className="form-control"
                placeholder={placeholder}
                name={name}
                onBlur={handleBlur}
                onChange={handleChange}
                value={value}
                defaultValue={defaultValue}
                disabled={disabled}
                onFocus={handleFocus}
            />
            {formikValidation}
            <div>
                <img src={isVisible ? Images.view_iconBlack : Images.hide_icon} alt="icon" className="eye_icon"
                    onClick={togglePassword} />
            </div>
        </Form.Group>
    )
}
