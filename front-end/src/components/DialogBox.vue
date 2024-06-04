<template>
    <div v-if="visible" class="dialog-overlay">
        <div class="dialog-box">
            <div class="dialog-content">
                <slot></slot>
            </div>
            <button class="dialog-close" @click="closeDialog">Close</button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        closeDialog() {
            this.$emit('close');
        }
    }
}
</script>

<style scoped>
.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.dialog-box {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
}
.dialog-content {
    margin-bottom: 20px;
}
.dialog-close {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
}
.dialog-close:hover {
    background-color: #0056b3;
}
</style>
