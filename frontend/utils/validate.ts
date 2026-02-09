//@gmail.com @yahoo.com @outlook.com @hotmail.com @feu.edu.ph @fit.edu.ph
//accepts uppercase but treated as one in database
//only 1 (.), cannot be at the start or before @
export const validateEmail = (email: string): string [] => {
    const errors: string[] = [];
    if(!email) errors.push("Email is required.");
    // if (!/s/.test())
    const regex = /^[a-zA-Z0-9?/]+\.?[a-zA-Z0-9]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|feu\.edu\.ph|fit\.edu\.ph)$/;
    if(!regex.test(email)) errors.push("Invalid email address.");
    return errors;
}

//Alphanumeric _ . 3-16 chars
export const validateUsername = (username: string): string [] => {
    const errors: string[] = [];
    const regex = /^[a-z0-9_.]+$/;
    if(!username){
        errors.push("Username is required.");
        return errors;
    }
    if(!regex.test(username)) errors.push("Username can only contain letters, numbers, underscore, and dots")
    if(username.length < 3) errors.push("Username must be at least 3 characters.");
    if(username.length > 16) errors.push("Username must not exceed 16 characters.");
    return errors;
}

//Atleast 1 Uppercase, 1 Digit, 1 of !@#$%^&*, 8 characters
export const validatePassword = (password: string): string [] => {
    const errors: string[] = [];
    if(!password){
        errors.push("Password is required.");
        return errors;
    }
    if(!/[A-Z]/.test(password)) errors.push("Must contain at least 1 Uppercase Letter.");
    if(!/[a-z]/.test(password)) errors.push("Must contain at least 1 Lowercase Letter.");
    if(!/[0-9]/.test(password)) errors.push("Must contain at least 1 Numebr.");
    if(!/[!@#$%^&*]/.test(password)) errors.push("Must contain at least 1 Special Character ! @ # $ % ^ & *");
    if(password.length < 8) errors.push("Password must be at least 8 characters.");
    // const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/i;
    // return regex.test(password);
    return errors;
}

//Minimum 1, Max 200 characters for feedback
export const validateText = (text: string): boolean => {
    return typeof text == 'string' && text.length >= 1 && text.length <= 200;
}