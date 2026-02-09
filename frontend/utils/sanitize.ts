//Remove whitespaces
export const sanitizeEmail = (value: string = ''): string => {
    return value.trim().toLowerCase().replace(/\s+/g, '');
};

//Enable consistent usernames - lowercase
export const sanitizeUsername = (value: string = ''): string => {
    return value.trim().toLowerCase().replace(/[^a-z0-9_.]/g, '');
};

//Only remove newlines
export const sanitizePassword = (value: string = ''): string => {
    return value.replace(/[\r\n]/g, '');
};

//Remove whitespaces
export const sanitizeText = (value: string = ''): string => {
    return value.replace(/\s+/g, ' ').trim();
}