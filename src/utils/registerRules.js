export const registerValidationRules = {
    nombre: [
        {
            regExp: /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{3,}$/,
            message: 'El nombre solo debe tener letras y deben ser mínimo 3 '
        },
    ],
    email: [
        {
            regExp: /^[a-zA-Z0-9._%+-]+@unicesar\.edu\.co$/,
            message: 'Debe usar un correo institucional válido'
        },
    ],
    password: [
        {
            regExp: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}/,
            message: 'La contraseña debe tener al menos 6 caracteres, una letra y un número',
        }
    ]
}