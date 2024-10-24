export const commonMethods = {
    data() {
        return {
            emailError: null,
            passwordError: null,
        };
    },
    methods: {
        validateEmailMixin(email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (email === '') {
                this.errorMessage = 'Поле ввода не может быть пустым';
                return false;
            }

            if (!emailRegex.test(email)) {
                this.errorMessage = 'Email должен быть на домене @gmail.com';
                return false;
            }
            this.errorMessage = null;
            return true;
        },
        validatePasswordMixin(password) {
            /* const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;*/
            const passwordRegexFORTEST = /^[A-Za-z\d]{3,}$/;
            if (password === '') {
                this.errorMessage = 'Поле ввода не может быть пустым';
                return false;
            }

            if (!passwordRegexFORTEST.test(password)) {
                this.errorMessage = 'Пароль был минимум 8 символов и включать хотя бы одну заглавную букву и одну цифру';
                return false;
            }
            this.errorMessage = null;
            return true;
        },
        validateDescriptionMixin(description) {
            const descriptionRegex = /^[A-Za-z\d\s]{3,20}$/;
            if (!descriptionRegex.test(description)) {
                this.errorMessage = 'Максимальное количество знаков 20';
                return false;
            }
            this.errorMessage = null;
            return true;
        }
    }
};
