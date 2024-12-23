export default {
    data() {
        return {
            isDragging: false,
            startX: 0,
            scrollLeft: 0,
        };
    },
    methods: {
        startDrag(event) {
            this.isDragging = true;
            const clientX = event.touches ? event.touches[0].clientX : event.clientX;
            this.startX = clientX - this.$refs.scrollContainer.offsetLeft;
            this.scrollLeft = this.$refs.scrollContainer.scrollLeft;

        },
        dragScroll(event) {
            if (!this.isDragging) return;
            event.preventDefault();
            const clientX = event.touches ? event.touches[0].clientX : event.clientX;
            const x = clientX - this.$refs.scrollContainer.offsetLeft;
            const walk = (x - this.startX) * 1; /*// Скорость прокрутки*/
            this.$refs.scrollContainer.scrollLeft = this.scrollLeft - walk;
        },
        stopDrag() {
            this.isDragging = false;
        },
        onScroll(event) {
            const container = event.target;
            const scrollLeft = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;
            // Добавляем тень в зависимости от прокрутки
            const shadowIntensity = Math.min(scrollLeft / maxScroll, 0.5); // Интенсивность тени


            container.style.boxShadow = `
                inset ${shadowIntensity * 15}px 0 0 0 rgba(0, 0, 0, 0.3),
                inset -${shadowIntensity * 15}px 0 0 0 rgba(0, 0, 0, 0.3)
    `;
        },
    },
};