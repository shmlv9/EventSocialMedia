export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};


export const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 11;
};

export const validateName = (name: string): boolean => {
    console.log(name.split(' ').length, name)
    return name.split(' ').length === 2;
}