export default function validate(values) {
    let errors = {};
    if (!values.username || values.username.trim().length == 0) {
        errors.username = 'Username is required';
    }
    if (!values.email || values.email.trim().length == 0) {
        errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Email address is invalid';
    }
    if (!values.password || values.password.trim().length == 0) {
        errors.password = 'Password is required';
    } else if (values.password.length < 8) {
        errors.password = 'Password must be 8 or more characters';
    }
    if (!values.confime_password || values.confime_password.trim().length == 0) {
        errors.confime_password = 'Confirm Password is required';
    } else if (values.confime_password != values.password) {
        errors.confime_password = "Confirm Password didn't  match with Password";
    }
    return errors;
};
