import React from "react";
import { Form } from "react-bootstrap";

export const Input_element = (props) => {
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
    disabled,
    readOnly,
    minDate, accept, id, checked
  } = props;

  const numberInputOnWheelPreventChange = (e) => {
    e.target.blur()
    e.stopPropagation()
    setTimeout(() => {
      e.target.focus()
    }, 0)
  }
  return (
    <Form.Group className="mb-4">
      <Form.Label className={`${lableClass} text-capitalize`}>{input_label}</Form.Label>
      <Form.Control
        id={id}
        type={type}
        className="form-control"
        placeholder={placeholder}
        name={name}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        readOnly={readOnly}
        min={minDate}
        accept={accept}
        checked={checked}
        onWheel={numberInputOnWheelPreventChange}
      />
      {formikValidation}
    </Form.Group>
  );
};
