class Task {
    constructor({ chatId, interval, fn }) {
        this.chatId = chatId;
        this.interval = interval;
        this.fn = fn;
        this._intervalId = undefined;
    }

    run() {
        this._intervalId = setInterval(() => {
            this.fn();
        }, this.interval);
    }

    stop() {
        clearInterval(this._intervalId);
    }
}

module.exports = Task;