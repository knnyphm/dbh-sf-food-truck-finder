// jest.setup.js
global.ResizeObserver = class ResizeObserver {
    constructor(callback) {
        this.callback = callback;
    }
    observe(target) {
        // mock observe
    }
    unobserve(target) {
        // mock unobserve
    }
    disconnect() {
        // mock disconnect
    }
};

