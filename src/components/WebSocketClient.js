export default class WebSocketClient {

    constructor(params = {}) {
        this.wsUrl = params.wsUrl || null;
        this.onOpen = params.onOpen || null;
        this.onClose = params.onClose || null;
        this.onMessage = params.onMessage || null;

        this._connection = null;
        this._tryCount = null;

        this._connect = this._connect.bind(this);
        this._onOpen = this._onOpen.bind(this);
        this._onMessage = this._onMessage.bind(this);
        this._onClose = this._onClose.bind(this);
    }

    open() {
        // Close previous
        this.close();

        this._connect();
    }

    close() {
        if (this._connection) {
            this._connection.close();
        }
    }

    _connect() {
        this._connection = new WebSocket(this.wsUrl);
        this._connection.onopen = this._onOpen;
        this._connection.onmessage = this._onMessage;
        this._connection.onclose = this._onClose;
    }

    _reConnect() {
        let delay = 1000;
        if (this._tryCount > 10) {
            delay = 2000;
        }
        if (this._tryCount > 50) {
            delay = 5000;
        }
        if (this._tryCount > 100) {
            delay = 15000;
        }

        this._tryCount++;
        setTimeout(this._connect, delay);
    }

    _onOpen() {
        this._tryCount = 0;

        if (this.onOpen) {
            this.onOpen();
        }
    }

    _onMessage(message) {
        if (this.onMessage) {
            this.onMessage(JSON.parse(message.data));
        }
    }

    _onClose(event) {
        if (this.onClose) {
            this.onClose(event);
        }

        this._reConnect();
    }
};
