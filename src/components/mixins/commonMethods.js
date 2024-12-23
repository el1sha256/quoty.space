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
                const errorMessage = 'Поле ввода не может быть пустым';
                this.$store.dispatch('handleError', { type: 'small', message: errorMessage });
                return false;
            }

            if (!emailRegex.test(email)) {

                const errorMessage = 'Email должен быть на домене @gmail.com';
                this.$store.dispatch('handleError', { type: 'small', message: errorMessage });
                return false;
            }
            this.$store.dispatch('clearError', 'small');

            return true;
        },
        validatePasswordMixin(password) {

            const passwordRegexFORTEST = /^[A-Za-z\d]{3,}$/;
            if (password === '') {
               const errorMessage = 'Поле ввода не может быть пустым';
                this.$store.dispatch('handleError', { type: 'small', message: errorMessage });
                return false;
            }

            if (!passwordRegexFORTEST.test(password)) {
                const errorMessage = 'Пароль был минимум 8 символов и включать хотя бы одну заглавную букву и одну цифру';
                this.$store.dispatch('handleError', { type: 'small', message: errorMessage });
                return false;
            }

            this.$store.dispatch('clearError', 'small');
            return true;
        },
        validateDescriptionMixin(description) {
            const descriptionRegex = /^[A-Za-z\d\s]{3,20}$/;
            if (!descriptionRegex.test(description)) {
               const errorMessage = 'Максимальное количество знаков 20';
                this.$store.dispatch('handleError', { type: 'small', message: errorMessage });
                return false;
            }
            /*this.errorMessage = null;*/
            this.$store.dispatch('clearError', 'small');
            return true;
        },
        handleImageError(event) {

            event.target.style.display = "none"; // Скрыть изображение, если оно не загрузилось
        },

        shortenDescription(description){ //to shorten description
            const maxLength = 10;
            if(description.length > maxLength){
                return description.slice(0, maxLength)+ '...';
            }else{
                return description;
            }
        },

        validatePostMixin(postText){
            const postTextRegex = /^[A-Za-zА-Яа-яЁё\d\s]{3,200}$/;
            if (postText === '') {
                const errorMessage = 'Поле ввода не может быть пустым';
                this.$store.dispatch('handleError', { type: 'small', message: errorMessage });
                return false;
            }
            if (!postTextRegex.test(postText)) {
                const errorMessage = 'Пост должен содержать от 3 до 200 символов';
                this.$store.dispatch('handleError', { type: 'small', message: errorMessage });
                return false;
            }
            this.$store.dispatch('clearError', 'small');
            return true;

        },

    }
};
