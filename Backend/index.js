"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
var cors = require("cors");
var openvidu_node_client_1 = require("openvidu-node-client");
require('dotenv').config(!!process.env.CONFIG ? { path: process.env.CONFIG } : {});
var app = express();
// Enable CORS support
app.use(cors({
    origin: '*'
}));
var server = http.createServer(app);
// Allow application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Allow application/json
app.use(bodyParser.json());
// Serve static resources if available
app.use(express.static(__dirname + '/public'));
// Serve application
server.listen(5000, function () {
    console.log('Application started');
});
console.warn('Application server connecting to OpenVidu at ' + process.env.OPENVIDU_URL);
var openvidu = new openvidu_node_client_1.OpenVidu(process.env.OPENVIDU_URL, process.env.OPENVIDU_SECRET);
app.post('/api/sessions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, openvidu.createSession(req.body)];
            case 1:
                session = _a.sent();
                res.send(session.sessionId);
                return [2 /*return*/];
        }
    });
}); });
app.post('/api/sessions/:sessionId/connections', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session, connection;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                session = openvidu.activeSessions.find(function (s) { return s.sessionId === req.params.sessionId; });
                if (!!session) return [3 /*break*/, 1];
                res.status(404).send();
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, session.createConnection(req.body)];
            case 2:
                connection = _a.sent();
                res.send(connection.token);
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
process.on('uncaughtException', function (err) { return console.error(err); });
