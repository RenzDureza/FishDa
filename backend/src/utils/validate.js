const validators = {
    username: (value) => {
        if(!value || typeof value !== 'string') return "Username is required.";
        const trimmed = value.trim();
        const regex = /^[a-zA-Z0-9_.]+$/;
        if(!regex.test(trimmed)) return "Username can only contain letters, numbers, underscores, and dots.";
        if(trimmed.length < 3) return "Username must be at least 3 characters.";
        if(trimmed.length > 16) return "Username must not exceed 16 characters.";
        return null;
    },

    email: (value) => {
        if(!value || typeof value !== 'string') return "Email is required.";
        const trimmed = value.trim();
        const regex = /^[a-zA-Z0-9?/]+\.?[a-zA-Z0-9]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|feu\.edu\.ph|fit\.edu\.ph)$/;
        if(!regex.test(trimmed)) return "Invalid email address.";
        return null;
    },

    password: (value) => {
        if(!value || typeof value !== 'string') return "Password is required.";
        if(!/[A-Z]/.test(value)) return "Must contain at least 1 uppercase letter.";
        if(!/[a-z]/.test(value)) return "Must contain at least 1 lowercase letter.";
        if(!/[0-9]/.test(value)) return "Must contain at least 1 number.";
        if(!/[!@#$%^&*]/.test(value)) return "Must contain at least 1 special character";
        if(value.length < 8) return "Password must be at least 8 characters.";
        return null;
    },
};

export function validate(data, fields){
    const errors = {};
    for (const field of fields){
        const error = validators[field]?.(data[field]);
        if(error) errors[field] = error;
    }
    return errors;
}
