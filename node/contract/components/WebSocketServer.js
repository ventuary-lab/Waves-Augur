const webSocketServer = require('websocket').server;

module.exports = class WebSocketServer {

    constructor(params) {
        params = params || {};

        this.httpServer = params.httpServer;
        this.logger = params.logger;

        this._wsServer = null;

        this._onRequest = this._onRequest.bind(this);
    }

    start() {
        this.logger.info(`${this.constructor.name} started...`);

        // Create WS server
        this._wsServer = new webSocketServer({
            httpServer: this.httpServer,
        });

        // Listen requests
        this._wsServer.on('request', this._onRequest);
    }

    stop() {
        if (this._wsServer) {
            this._wsServer.shutDown();
        }
    }

    /**
     * @param {string} message
     * @private
     */
    push(message) {
        // Skip pushes when ws server is not started
        if (!this._wsServer) {
            return;
        }

        this.logger.info('Send message to WebSocket connections... ' + message);

        this._wsServer.connections.forEach(connection => {
            connection.send(message);
        });
    }

    /**
     * @param {object} request
     * @private
     */
    _onRequest(request) {
        const connection = request.accept(null, request.origin);

        // Log client connected
        this.logger.debug(`${this.constructor.name} user '${connection.remoteAddresses.join(', ')}' connected.`);
    }

};
