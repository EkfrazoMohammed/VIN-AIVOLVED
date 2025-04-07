export const validateInput = (input) => {
    const emailPattern = /^[a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    const mobilePattern = /^\+?\d{8,15}$/;
    return emailPattern.test(input) || mobilePattern.test(input);
  };