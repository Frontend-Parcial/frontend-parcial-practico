
export const onlyLetters = {
        regExp: /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/,
        message: "Solo se permiten letras"
    }
export const email = {
        regExp: /^[a-zA-Z0-9@._-]+$/,
        message: "No se permite '#', '%', '+'"
    }
export const password = {
        regExp: /^[a-zA-Z0-9!@#$%^&*()_+=\-{}[\]|:;"'<>,.?/]+$/,
        message: "No están permitidos espacios"
    }
