
export const onlyLetters = {
        format: /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/,
        message: "Solo se permiten letras"
    }
export const email = {
        format: /^[a-zA-Z0-9@._-]+$/,
        message: "No se permite '#', '%', '+'"
    }
export const password = {
        format: /^[a-zA-Z0-9!@#$%^&*()_+=\-{}[\]|:;"'<>,.?/]+$/,
        message: "No están permitidos espacios"
    }
export const onlyEntireNumbers = {
    format: /^[0-9]+$/,
    message: "Solo se permiten números"
}

export const address = {
    format : /^[a-zA-Z0-9#,.-\s]+$/,
    message: "Digite carácteres válidos para una dirección"
}

export const decimalNumber = {
    format : /^[0-9.]*$/,
    message : "Digite un valor númerico válido"
}

export const lenguageLevel = {
    format: /^(A[1-2]|B[1-2]|C[1-2]|TOEFL\s\d{2,3}|IELTS\s\d(\.\d)?)$/,
    message: "Digite caracterés válidos para un nivel de idioma"
}