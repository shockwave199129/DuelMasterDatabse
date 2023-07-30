
import { useState, useEffect } from 'react';

const useForm = (callback, validate, initialValues = {}) => {

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback(values);
    }
  }, [errors]);

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    setErrors(validate(values));
    setIsSubmitting(true);
  };

  const handleChange = (event) => {
    event.persist();
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    setValues(values => ({ ...values, [name]: newValue }));
  };

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
  }
};

export default useForm;