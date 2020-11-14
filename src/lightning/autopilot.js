/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const autopilotrpc = $root.autopilotrpc = (() => {

    /**
     * Namespace autopilotrpc.
     * @exports autopilotrpc
     * @namespace
     */
    const autopilotrpc = {};

    autopilotrpc.Autopilot = (function() {

        /**
         * Constructs a new Autopilot service.
         * @memberof autopilotrpc
         * @classdesc Represents an Autopilot
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function Autopilot(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (Autopilot.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Autopilot;

        /**
         * Creates new Autopilot service using the specified rpc implementation.
         * @function create
         * @memberof autopilotrpc.Autopilot
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {Autopilot} RPC service. Useful where requests and/or responses are streamed.
         */
        Autopilot.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link autopilotrpc.Autopilot#status}.
         * @memberof autopilotrpc.Autopilot
         * @typedef StatusCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {autopilotrpc.StatusResponse} [response] StatusResponse
         */

        /**
         * Status returns whether the daemon's autopilot agent is active.
         * @function status
         * @memberof autopilotrpc.Autopilot
         * @instance
         * @param {autopilotrpc.IStatusRequest} request StatusRequest message or plain object
         * @param {autopilotrpc.Autopilot.StatusCallback} callback Node-style callback called with the error, if any, and StatusResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Autopilot.prototype.status = function status(request, callback) {
            return this.rpcCall(status, $root.autopilotrpc.StatusRequest, $root.autopilotrpc.StatusResponse, request, callback);
        }, "name", { value: "Status" });

        /**
         * Status returns whether the daemon's autopilot agent is active.
         * @function status
         * @memberof autopilotrpc.Autopilot
         * @instance
         * @param {autopilotrpc.IStatusRequest} request StatusRequest message or plain object
         * @returns {Promise<autopilotrpc.StatusResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link autopilotrpc.Autopilot#modifyStatus}.
         * @memberof autopilotrpc.Autopilot
         * @typedef ModifyStatusCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {autopilotrpc.ModifyStatusResponse} [response] ModifyStatusResponse
         */

        /**
         * ModifyStatus is used to modify the status of the autopilot agent, like
         * enabling or disabling it.
         * @function modifyStatus
         * @memberof autopilotrpc.Autopilot
         * @instance
         * @param {autopilotrpc.IModifyStatusRequest} request ModifyStatusRequest message or plain object
         * @param {autopilotrpc.Autopilot.ModifyStatusCallback} callback Node-style callback called with the error, if any, and ModifyStatusResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Autopilot.prototype.modifyStatus = function modifyStatus(request, callback) {
            return this.rpcCall(modifyStatus, $root.autopilotrpc.ModifyStatusRequest, $root.autopilotrpc.ModifyStatusResponse, request, callback);
        }, "name", { value: "ModifyStatus" });

        /**
         * ModifyStatus is used to modify the status of the autopilot agent, like
         * enabling or disabling it.
         * @function modifyStatus
         * @memberof autopilotrpc.Autopilot
         * @instance
         * @param {autopilotrpc.IModifyStatusRequest} request ModifyStatusRequest message or plain object
         * @returns {Promise<autopilotrpc.ModifyStatusResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link autopilotrpc.Autopilot#queryScores}.
         * @memberof autopilotrpc.Autopilot
         * @typedef QueryScoresCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {autopilotrpc.QueryScoresResponse} [response] QueryScoresResponse
         */

        /**
         * QueryScores queries all available autopilot heuristics, in addition to any
         * active combination of these heruristics, for the scores they would give to
         * the given nodes.
         * @function queryScores
         * @memberof autopilotrpc.Autopilot
         * @instance
         * @param {autopilotrpc.IQueryScoresRequest} request QueryScoresRequest message or plain object
         * @param {autopilotrpc.Autopilot.QueryScoresCallback} callback Node-style callback called with the error, if any, and QueryScoresResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Autopilot.prototype.queryScores = function queryScores(request, callback) {
            return this.rpcCall(queryScores, $root.autopilotrpc.QueryScoresRequest, $root.autopilotrpc.QueryScoresResponse, request, callback);
        }, "name", { value: "QueryScores" });

        /**
         * QueryScores queries all available autopilot heuristics, in addition to any
         * active combination of these heruristics, for the scores they would give to
         * the given nodes.
         * @function queryScores
         * @memberof autopilotrpc.Autopilot
         * @instance
         * @param {autopilotrpc.IQueryScoresRequest} request QueryScoresRequest message or plain object
         * @returns {Promise<autopilotrpc.QueryScoresResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link autopilotrpc.Autopilot#setScores}.
         * @memberof autopilotrpc.Autopilot
         * @typedef SetScoresCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {autopilotrpc.SetScoresResponse} [response] SetScoresResponse
         */

        /**
         * SetScores attempts to set the scores used by the running autopilot agent,
         * if the external scoring heuristic is enabled.
         * @function setScores
         * @memberof autopilotrpc.Autopilot
         * @instance
         * @param {autopilotrpc.ISetScoresRequest} request SetScoresRequest message or plain object
         * @param {autopilotrpc.Autopilot.SetScoresCallback} callback Node-style callback called with the error, if any, and SetScoresResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(Autopilot.prototype.setScores = function setScores(request, callback) {
            return this.rpcCall(setScores, $root.autopilotrpc.SetScoresRequest, $root.autopilotrpc.SetScoresResponse, request, callback);
        }, "name", { value: "SetScores" });

        /**
         * SetScores attempts to set the scores used by the running autopilot agent,
         * if the external scoring heuristic is enabled.
         * @function setScores
         * @memberof autopilotrpc.Autopilot
         * @instance
         * @param {autopilotrpc.ISetScoresRequest} request SetScoresRequest message or plain object
         * @returns {Promise<autopilotrpc.SetScoresResponse>} Promise
         * @variation 2
         */

        return Autopilot;
    })();

    autopilotrpc.StatusRequest = (function() {

        /**
         * Properties of a StatusRequest.
         * @memberof autopilotrpc
         * @interface IStatusRequest
         */

        /**
         * Constructs a new StatusRequest.
         * @memberof autopilotrpc
         * @classdesc Represents a StatusRequest.
         * @implements IStatusRequest
         * @constructor
         * @param {autopilotrpc.IStatusRequest=} [properties] Properties to set
         */
        function StatusRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new StatusRequest instance using the specified properties.
         * @function create
         * @memberof autopilotrpc.StatusRequest
         * @static
         * @param {autopilotrpc.IStatusRequest=} [properties] Properties to set
         * @returns {autopilotrpc.StatusRequest} StatusRequest instance
         */
        StatusRequest.create = function create(properties) {
            return new StatusRequest(properties);
        };

        /**
         * Encodes the specified StatusRequest message. Does not implicitly {@link autopilotrpc.StatusRequest.verify|verify} messages.
         * @function encode
         * @memberof autopilotrpc.StatusRequest
         * @static
         * @param {autopilotrpc.IStatusRequest} message StatusRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StatusRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified StatusRequest message, length delimited. Does not implicitly {@link autopilotrpc.StatusRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof autopilotrpc.StatusRequest
         * @static
         * @param {autopilotrpc.IStatusRequest} message StatusRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StatusRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StatusRequest message from the specified reader or buffer.
         * @function decode
         * @memberof autopilotrpc.StatusRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {autopilotrpc.StatusRequest} StatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StatusRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.autopilotrpc.StatusRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StatusRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof autopilotrpc.StatusRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {autopilotrpc.StatusRequest} StatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StatusRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StatusRequest message.
         * @function verify
         * @memberof autopilotrpc.StatusRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StatusRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a StatusRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof autopilotrpc.StatusRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {autopilotrpc.StatusRequest} StatusRequest
         */
        StatusRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.autopilotrpc.StatusRequest)
                return object;
            return new $root.autopilotrpc.StatusRequest();
        };

        /**
         * Creates a plain object from a StatusRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof autopilotrpc.StatusRequest
         * @static
         * @param {autopilotrpc.StatusRequest} message StatusRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StatusRequest.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this StatusRequest to JSON.
         * @function toJSON
         * @memberof autopilotrpc.StatusRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StatusRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return StatusRequest;
    })();

    autopilotrpc.StatusResponse = (function() {

        /**
         * Properties of a StatusResponse.
         * @memberof autopilotrpc
         * @interface IStatusResponse
         * @property {boolean|null} [active] Indicates whether the autopilot is active or not.
         */

        /**
         * Constructs a new StatusResponse.
         * @memberof autopilotrpc
         * @classdesc Represents a StatusResponse.
         * @implements IStatusResponse
         * @constructor
         * @param {autopilotrpc.IStatusResponse=} [properties] Properties to set
         */
        function StatusResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Indicates whether the autopilot is active or not.
         * @member {boolean} active
         * @memberof autopilotrpc.StatusResponse
         * @instance
         */
        StatusResponse.prototype.active = false;

        /**
         * Creates a new StatusResponse instance using the specified properties.
         * @function create
         * @memberof autopilotrpc.StatusResponse
         * @static
         * @param {autopilotrpc.IStatusResponse=} [properties] Properties to set
         * @returns {autopilotrpc.StatusResponse} StatusResponse instance
         */
        StatusResponse.create = function create(properties) {
            return new StatusResponse(properties);
        };

        /**
         * Encodes the specified StatusResponse message. Does not implicitly {@link autopilotrpc.StatusResponse.verify|verify} messages.
         * @function encode
         * @memberof autopilotrpc.StatusResponse
         * @static
         * @param {autopilotrpc.IStatusResponse} message StatusResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StatusResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.active != null && Object.hasOwnProperty.call(message, "active"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.active);
            return writer;
        };

        /**
         * Encodes the specified StatusResponse message, length delimited. Does not implicitly {@link autopilotrpc.StatusResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof autopilotrpc.StatusResponse
         * @static
         * @param {autopilotrpc.IStatusResponse} message StatusResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StatusResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StatusResponse message from the specified reader or buffer.
         * @function decode
         * @memberof autopilotrpc.StatusResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {autopilotrpc.StatusResponse} StatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StatusResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.autopilotrpc.StatusResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.active = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StatusResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof autopilotrpc.StatusResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {autopilotrpc.StatusResponse} StatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StatusResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StatusResponse message.
         * @function verify
         * @memberof autopilotrpc.StatusResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StatusResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.active != null && message.hasOwnProperty("active"))
                if (typeof message.active !== "boolean")
                    return "active: boolean expected";
            return null;
        };

        /**
         * Creates a StatusResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof autopilotrpc.StatusResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {autopilotrpc.StatusResponse} StatusResponse
         */
        StatusResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.autopilotrpc.StatusResponse)
                return object;
            let message = new $root.autopilotrpc.StatusResponse();
            if (object.active != null)
                message.active = Boolean(object.active);
            return message;
        };

        /**
         * Creates a plain object from a StatusResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof autopilotrpc.StatusResponse
         * @static
         * @param {autopilotrpc.StatusResponse} message StatusResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StatusResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.active = false;
            if (message.active != null && message.hasOwnProperty("active"))
                object.active = message.active;
            return object;
        };

        /**
         * Converts this StatusResponse to JSON.
         * @function toJSON
         * @memberof autopilotrpc.StatusResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StatusResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return StatusResponse;
    })();

    autopilotrpc.ModifyStatusRequest = (function() {

        /**
         * Properties of a ModifyStatusRequest.
         * @memberof autopilotrpc
         * @interface IModifyStatusRequest
         * @property {boolean|null} [enable] Whether the autopilot agent should be enabled or not.
         */

        /**
         * Constructs a new ModifyStatusRequest.
         * @memberof autopilotrpc
         * @classdesc Represents a ModifyStatusRequest.
         * @implements IModifyStatusRequest
         * @constructor
         * @param {autopilotrpc.IModifyStatusRequest=} [properties] Properties to set
         */
        function ModifyStatusRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Whether the autopilot agent should be enabled or not.
         * @member {boolean} enable
         * @memberof autopilotrpc.ModifyStatusRequest
         * @instance
         */
        ModifyStatusRequest.prototype.enable = false;

        /**
         * Creates a new ModifyStatusRequest instance using the specified properties.
         * @function create
         * @memberof autopilotrpc.ModifyStatusRequest
         * @static
         * @param {autopilotrpc.IModifyStatusRequest=} [properties] Properties to set
         * @returns {autopilotrpc.ModifyStatusRequest} ModifyStatusRequest instance
         */
        ModifyStatusRequest.create = function create(properties) {
            return new ModifyStatusRequest(properties);
        };

        /**
         * Encodes the specified ModifyStatusRequest message. Does not implicitly {@link autopilotrpc.ModifyStatusRequest.verify|verify} messages.
         * @function encode
         * @memberof autopilotrpc.ModifyStatusRequest
         * @static
         * @param {autopilotrpc.IModifyStatusRequest} message ModifyStatusRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ModifyStatusRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.enable != null && Object.hasOwnProperty.call(message, "enable"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.enable);
            return writer;
        };

        /**
         * Encodes the specified ModifyStatusRequest message, length delimited. Does not implicitly {@link autopilotrpc.ModifyStatusRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof autopilotrpc.ModifyStatusRequest
         * @static
         * @param {autopilotrpc.IModifyStatusRequest} message ModifyStatusRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ModifyStatusRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ModifyStatusRequest message from the specified reader or buffer.
         * @function decode
         * @memberof autopilotrpc.ModifyStatusRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {autopilotrpc.ModifyStatusRequest} ModifyStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ModifyStatusRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.autopilotrpc.ModifyStatusRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.enable = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ModifyStatusRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof autopilotrpc.ModifyStatusRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {autopilotrpc.ModifyStatusRequest} ModifyStatusRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ModifyStatusRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ModifyStatusRequest message.
         * @function verify
         * @memberof autopilotrpc.ModifyStatusRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ModifyStatusRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.enable != null && message.hasOwnProperty("enable"))
                if (typeof message.enable !== "boolean")
                    return "enable: boolean expected";
            return null;
        };

        /**
         * Creates a ModifyStatusRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof autopilotrpc.ModifyStatusRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {autopilotrpc.ModifyStatusRequest} ModifyStatusRequest
         */
        ModifyStatusRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.autopilotrpc.ModifyStatusRequest)
                return object;
            let message = new $root.autopilotrpc.ModifyStatusRequest();
            if (object.enable != null)
                message.enable = Boolean(object.enable);
            return message;
        };

        /**
         * Creates a plain object from a ModifyStatusRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof autopilotrpc.ModifyStatusRequest
         * @static
         * @param {autopilotrpc.ModifyStatusRequest} message ModifyStatusRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ModifyStatusRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.enable = false;
            if (message.enable != null && message.hasOwnProperty("enable"))
                object.enable = message.enable;
            return object;
        };

        /**
         * Converts this ModifyStatusRequest to JSON.
         * @function toJSON
         * @memberof autopilotrpc.ModifyStatusRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ModifyStatusRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ModifyStatusRequest;
    })();

    autopilotrpc.ModifyStatusResponse = (function() {

        /**
         * Properties of a ModifyStatusResponse.
         * @memberof autopilotrpc
         * @interface IModifyStatusResponse
         */

        /**
         * Constructs a new ModifyStatusResponse.
         * @memberof autopilotrpc
         * @classdesc Represents a ModifyStatusResponse.
         * @implements IModifyStatusResponse
         * @constructor
         * @param {autopilotrpc.IModifyStatusResponse=} [properties] Properties to set
         */
        function ModifyStatusResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new ModifyStatusResponse instance using the specified properties.
         * @function create
         * @memberof autopilotrpc.ModifyStatusResponse
         * @static
         * @param {autopilotrpc.IModifyStatusResponse=} [properties] Properties to set
         * @returns {autopilotrpc.ModifyStatusResponse} ModifyStatusResponse instance
         */
        ModifyStatusResponse.create = function create(properties) {
            return new ModifyStatusResponse(properties);
        };

        /**
         * Encodes the specified ModifyStatusResponse message. Does not implicitly {@link autopilotrpc.ModifyStatusResponse.verify|verify} messages.
         * @function encode
         * @memberof autopilotrpc.ModifyStatusResponse
         * @static
         * @param {autopilotrpc.IModifyStatusResponse} message ModifyStatusResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ModifyStatusResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified ModifyStatusResponse message, length delimited. Does not implicitly {@link autopilotrpc.ModifyStatusResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof autopilotrpc.ModifyStatusResponse
         * @static
         * @param {autopilotrpc.IModifyStatusResponse} message ModifyStatusResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ModifyStatusResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ModifyStatusResponse message from the specified reader or buffer.
         * @function decode
         * @memberof autopilotrpc.ModifyStatusResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {autopilotrpc.ModifyStatusResponse} ModifyStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ModifyStatusResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.autopilotrpc.ModifyStatusResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ModifyStatusResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof autopilotrpc.ModifyStatusResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {autopilotrpc.ModifyStatusResponse} ModifyStatusResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ModifyStatusResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ModifyStatusResponse message.
         * @function verify
         * @memberof autopilotrpc.ModifyStatusResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ModifyStatusResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a ModifyStatusResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof autopilotrpc.ModifyStatusResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {autopilotrpc.ModifyStatusResponse} ModifyStatusResponse
         */
        ModifyStatusResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.autopilotrpc.ModifyStatusResponse)
                return object;
            return new $root.autopilotrpc.ModifyStatusResponse();
        };

        /**
         * Creates a plain object from a ModifyStatusResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof autopilotrpc.ModifyStatusResponse
         * @static
         * @param {autopilotrpc.ModifyStatusResponse} message ModifyStatusResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ModifyStatusResponse.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this ModifyStatusResponse to JSON.
         * @function toJSON
         * @memberof autopilotrpc.ModifyStatusResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ModifyStatusResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ModifyStatusResponse;
    })();

    autopilotrpc.QueryScoresRequest = (function() {

        /**
         * Properties of a QueryScoresRequest.
         * @memberof autopilotrpc
         * @interface IQueryScoresRequest
         * @property {Array.<string>|null} [pubkeys] QueryScoresRequest pubkeys
         * @property {boolean|null} [ignoreLocalState] If set, we will ignore the local channel state when calculating scores.
         */

        /**
         * Constructs a new QueryScoresRequest.
         * @memberof autopilotrpc
         * @classdesc Represents a QueryScoresRequest.
         * @implements IQueryScoresRequest
         * @constructor
         * @param {autopilotrpc.IQueryScoresRequest=} [properties] Properties to set
         */
        function QueryScoresRequest(properties) {
            this.pubkeys = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QueryScoresRequest pubkeys.
         * @member {Array.<string>} pubkeys
         * @memberof autopilotrpc.QueryScoresRequest
         * @instance
         */
        QueryScoresRequest.prototype.pubkeys = $util.emptyArray;

        /**
         * If set, we will ignore the local channel state when calculating scores.
         * @member {boolean} ignoreLocalState
         * @memberof autopilotrpc.QueryScoresRequest
         * @instance
         */
        QueryScoresRequest.prototype.ignoreLocalState = false;

        /**
         * Creates a new QueryScoresRequest instance using the specified properties.
         * @function create
         * @memberof autopilotrpc.QueryScoresRequest
         * @static
         * @param {autopilotrpc.IQueryScoresRequest=} [properties] Properties to set
         * @returns {autopilotrpc.QueryScoresRequest} QueryScoresRequest instance
         */
        QueryScoresRequest.create = function create(properties) {
            return new QueryScoresRequest(properties);
        };

        /**
         * Encodes the specified QueryScoresRequest message. Does not implicitly {@link autopilotrpc.QueryScoresRequest.verify|verify} messages.
         * @function encode
         * @memberof autopilotrpc.QueryScoresRequest
         * @static
         * @param {autopilotrpc.IQueryScoresRequest} message QueryScoresRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryScoresRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pubkeys != null && message.pubkeys.length)
                for (let i = 0; i < message.pubkeys.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.pubkeys[i]);
            if (message.ignoreLocalState != null && Object.hasOwnProperty.call(message, "ignoreLocalState"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.ignoreLocalState);
            return writer;
        };

        /**
         * Encodes the specified QueryScoresRequest message, length delimited. Does not implicitly {@link autopilotrpc.QueryScoresRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof autopilotrpc.QueryScoresRequest
         * @static
         * @param {autopilotrpc.IQueryScoresRequest} message QueryScoresRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryScoresRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a QueryScoresRequest message from the specified reader or buffer.
         * @function decode
         * @memberof autopilotrpc.QueryScoresRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {autopilotrpc.QueryScoresRequest} QueryScoresRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryScoresRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.autopilotrpc.QueryScoresRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.pubkeys && message.pubkeys.length))
                        message.pubkeys = [];
                    message.pubkeys.push(reader.string());
                    break;
                case 2:
                    message.ignoreLocalState = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a QueryScoresRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof autopilotrpc.QueryScoresRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {autopilotrpc.QueryScoresRequest} QueryScoresRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryScoresRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a QueryScoresRequest message.
         * @function verify
         * @memberof autopilotrpc.QueryScoresRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        QueryScoresRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.pubkeys != null && message.hasOwnProperty("pubkeys")) {
                if (!Array.isArray(message.pubkeys))
                    return "pubkeys: array expected";
                for (let i = 0; i < message.pubkeys.length; ++i)
                    if (!$util.isString(message.pubkeys[i]))
                        return "pubkeys: string[] expected";
            }
            if (message.ignoreLocalState != null && message.hasOwnProperty("ignoreLocalState"))
                if (typeof message.ignoreLocalState !== "boolean")
                    return "ignoreLocalState: boolean expected";
            return null;
        };

        /**
         * Creates a QueryScoresRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof autopilotrpc.QueryScoresRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {autopilotrpc.QueryScoresRequest} QueryScoresRequest
         */
        QueryScoresRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.autopilotrpc.QueryScoresRequest)
                return object;
            let message = new $root.autopilotrpc.QueryScoresRequest();
            if (object.pubkeys) {
                if (!Array.isArray(object.pubkeys))
                    throw TypeError(".autopilotrpc.QueryScoresRequest.pubkeys: array expected");
                message.pubkeys = [];
                for (let i = 0; i < object.pubkeys.length; ++i)
                    message.pubkeys[i] = String(object.pubkeys[i]);
            }
            if (object.ignoreLocalState != null)
                message.ignoreLocalState = Boolean(object.ignoreLocalState);
            return message;
        };

        /**
         * Creates a plain object from a QueryScoresRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof autopilotrpc.QueryScoresRequest
         * @static
         * @param {autopilotrpc.QueryScoresRequest} message QueryScoresRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        QueryScoresRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.pubkeys = [];
            if (options.defaults)
                object.ignoreLocalState = false;
            if (message.pubkeys && message.pubkeys.length) {
                object.pubkeys = [];
                for (let j = 0; j < message.pubkeys.length; ++j)
                    object.pubkeys[j] = message.pubkeys[j];
            }
            if (message.ignoreLocalState != null && message.hasOwnProperty("ignoreLocalState"))
                object.ignoreLocalState = message.ignoreLocalState;
            return object;
        };

        /**
         * Converts this QueryScoresRequest to JSON.
         * @function toJSON
         * @memberof autopilotrpc.QueryScoresRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        QueryScoresRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return QueryScoresRequest;
    })();

    autopilotrpc.QueryScoresResponse = (function() {

        /**
         * Properties of a QueryScoresResponse.
         * @memberof autopilotrpc
         * @interface IQueryScoresResponse
         * @property {Array.<autopilotrpc.QueryScoresResponse.IHeuristicResult>|null} [results] QueryScoresResponse results
         */

        /**
         * Constructs a new QueryScoresResponse.
         * @memberof autopilotrpc
         * @classdesc Represents a QueryScoresResponse.
         * @implements IQueryScoresResponse
         * @constructor
         * @param {autopilotrpc.IQueryScoresResponse=} [properties] Properties to set
         */
        function QueryScoresResponse(properties) {
            this.results = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * QueryScoresResponse results.
         * @member {Array.<autopilotrpc.QueryScoresResponse.IHeuristicResult>} results
         * @memberof autopilotrpc.QueryScoresResponse
         * @instance
         */
        QueryScoresResponse.prototype.results = $util.emptyArray;

        /**
         * Creates a new QueryScoresResponse instance using the specified properties.
         * @function create
         * @memberof autopilotrpc.QueryScoresResponse
         * @static
         * @param {autopilotrpc.IQueryScoresResponse=} [properties] Properties to set
         * @returns {autopilotrpc.QueryScoresResponse} QueryScoresResponse instance
         */
        QueryScoresResponse.create = function create(properties) {
            return new QueryScoresResponse(properties);
        };

        /**
         * Encodes the specified QueryScoresResponse message. Does not implicitly {@link autopilotrpc.QueryScoresResponse.verify|verify} messages.
         * @function encode
         * @memberof autopilotrpc.QueryScoresResponse
         * @static
         * @param {autopilotrpc.IQueryScoresResponse} message QueryScoresResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryScoresResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.results != null && message.results.length)
                for (let i = 0; i < message.results.length; ++i)
                    $root.autopilotrpc.QueryScoresResponse.HeuristicResult.encode(message.results[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified QueryScoresResponse message, length delimited. Does not implicitly {@link autopilotrpc.QueryScoresResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof autopilotrpc.QueryScoresResponse
         * @static
         * @param {autopilotrpc.IQueryScoresResponse} message QueryScoresResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        QueryScoresResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a QueryScoresResponse message from the specified reader or buffer.
         * @function decode
         * @memberof autopilotrpc.QueryScoresResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {autopilotrpc.QueryScoresResponse} QueryScoresResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryScoresResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.autopilotrpc.QueryScoresResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.results && message.results.length))
                        message.results = [];
                    message.results.push($root.autopilotrpc.QueryScoresResponse.HeuristicResult.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a QueryScoresResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof autopilotrpc.QueryScoresResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {autopilotrpc.QueryScoresResponse} QueryScoresResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        QueryScoresResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a QueryScoresResponse message.
         * @function verify
         * @memberof autopilotrpc.QueryScoresResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        QueryScoresResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.results != null && message.hasOwnProperty("results")) {
                if (!Array.isArray(message.results))
                    return "results: array expected";
                for (let i = 0; i < message.results.length; ++i) {
                    let error = $root.autopilotrpc.QueryScoresResponse.HeuristicResult.verify(message.results[i]);
                    if (error)
                        return "results." + error;
                }
            }
            return null;
        };

        /**
         * Creates a QueryScoresResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof autopilotrpc.QueryScoresResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {autopilotrpc.QueryScoresResponse} QueryScoresResponse
         */
        QueryScoresResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.autopilotrpc.QueryScoresResponse)
                return object;
            let message = new $root.autopilotrpc.QueryScoresResponse();
            if (object.results) {
                if (!Array.isArray(object.results))
                    throw TypeError(".autopilotrpc.QueryScoresResponse.results: array expected");
                message.results = [];
                for (let i = 0; i < object.results.length; ++i) {
                    if (typeof object.results[i] !== "object")
                        throw TypeError(".autopilotrpc.QueryScoresResponse.results: object expected");
                    message.results[i] = $root.autopilotrpc.QueryScoresResponse.HeuristicResult.fromObject(object.results[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a QueryScoresResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof autopilotrpc.QueryScoresResponse
         * @static
         * @param {autopilotrpc.QueryScoresResponse} message QueryScoresResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        QueryScoresResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.results = [];
            if (message.results && message.results.length) {
                object.results = [];
                for (let j = 0; j < message.results.length; ++j)
                    object.results[j] = $root.autopilotrpc.QueryScoresResponse.HeuristicResult.toObject(message.results[j], options);
            }
            return object;
        };

        /**
         * Converts this QueryScoresResponse to JSON.
         * @function toJSON
         * @memberof autopilotrpc.QueryScoresResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        QueryScoresResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        QueryScoresResponse.HeuristicResult = (function() {

            /**
             * Properties of a HeuristicResult.
             * @memberof autopilotrpc.QueryScoresResponse
             * @interface IHeuristicResult
             * @property {string|null} [heuristic] HeuristicResult heuristic
             * @property {Object.<string,number>|null} [scores] HeuristicResult scores
             */

            /**
             * Constructs a new HeuristicResult.
             * @memberof autopilotrpc.QueryScoresResponse
             * @classdesc Represents a HeuristicResult.
             * @implements IHeuristicResult
             * @constructor
             * @param {autopilotrpc.QueryScoresResponse.IHeuristicResult=} [properties] Properties to set
             */
            function HeuristicResult(properties) {
                this.scores = {};
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * HeuristicResult heuristic.
             * @member {string} heuristic
             * @memberof autopilotrpc.QueryScoresResponse.HeuristicResult
             * @instance
             */
            HeuristicResult.prototype.heuristic = "";

            /**
             * HeuristicResult scores.
             * @member {Object.<string,number>} scores
             * @memberof autopilotrpc.QueryScoresResponse.HeuristicResult
             * @instance
             */
            HeuristicResult.prototype.scores = $util.emptyObject;

            /**
             * Creates a new HeuristicResult instance using the specified properties.
             * @function create
             * @memberof autopilotrpc.QueryScoresResponse.HeuristicResult
             * @static
             * @param {autopilotrpc.QueryScoresResponse.IHeuristicResult=} [properties] Properties to set
             * @returns {autopilotrpc.QueryScoresResponse.HeuristicResult} HeuristicResult instance
             */
            HeuristicResult.create = function create(properties) {
                return new HeuristicResult(properties);
            };

            /**
             * Encodes the specified HeuristicResult message. Does not implicitly {@link autopilotrpc.QueryScoresResponse.HeuristicResult.verify|verify} messages.
             * @function encode
             * @memberof autopilotrpc.QueryScoresResponse.HeuristicResult
             * @static
             * @param {autopilotrpc.QueryScoresResponse.IHeuristicResult} message HeuristicResult message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HeuristicResult.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.heuristic != null && Object.hasOwnProperty.call(message, "heuristic"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.heuristic);
                if (message.scores != null && Object.hasOwnProperty.call(message, "scores"))
                    for (let keys = Object.keys(message.scores), i = 0; i < keys.length; ++i)
                        writer.uint32(/* id 2, wireType 2 =*/18).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 1 =*/17).double(message.scores[keys[i]]).ldelim();
                return writer;
            };

            /**
             * Encodes the specified HeuristicResult message, length delimited. Does not implicitly {@link autopilotrpc.QueryScoresResponse.HeuristicResult.verify|verify} messages.
             * @function encodeDelimited
             * @memberof autopilotrpc.QueryScoresResponse.HeuristicResult
             * @static
             * @param {autopilotrpc.QueryScoresResponse.IHeuristicResult} message HeuristicResult message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HeuristicResult.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a HeuristicResult message from the specified reader or buffer.
             * @function decode
             * @memberof autopilotrpc.QueryScoresResponse.HeuristicResult
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {autopilotrpc.QueryScoresResponse.HeuristicResult} HeuristicResult
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HeuristicResult.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.autopilotrpc.QueryScoresResponse.HeuristicResult(), key;
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.heuristic = reader.string();
                        break;
                    case 2:
                        reader.skip().pos++;
                        if (message.scores === $util.emptyObject)
                            message.scores = {};
                        key = reader.string();
                        reader.pos++;
                        message.scores[key] = reader.double();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a HeuristicResult message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof autopilotrpc.QueryScoresResponse.HeuristicResult
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {autopilotrpc.QueryScoresResponse.HeuristicResult} HeuristicResult
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HeuristicResult.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a HeuristicResult message.
             * @function verify
             * @memberof autopilotrpc.QueryScoresResponse.HeuristicResult
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            HeuristicResult.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.heuristic != null && message.hasOwnProperty("heuristic"))
                    if (!$util.isString(message.heuristic))
                        return "heuristic: string expected";
                if (message.scores != null && message.hasOwnProperty("scores")) {
                    if (!$util.isObject(message.scores))
                        return "scores: object expected";
                    let key = Object.keys(message.scores);
                    for (let i = 0; i < key.length; ++i)
                        if (typeof message.scores[key[i]] !== "number")
                            return "scores: number{k:string} expected";
                }
                return null;
            };

            /**
             * Creates a HeuristicResult message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof autopilotrpc.QueryScoresResponse.HeuristicResult
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {autopilotrpc.QueryScoresResponse.HeuristicResult} HeuristicResult
             */
            HeuristicResult.fromObject = function fromObject(object) {
                if (object instanceof $root.autopilotrpc.QueryScoresResponse.HeuristicResult)
                    return object;
                let message = new $root.autopilotrpc.QueryScoresResponse.HeuristicResult();
                if (object.heuristic != null)
                    message.heuristic = String(object.heuristic);
                if (object.scores) {
                    if (typeof object.scores !== "object")
                        throw TypeError(".autopilotrpc.QueryScoresResponse.HeuristicResult.scores: object expected");
                    message.scores = {};
                    for (let keys = Object.keys(object.scores), i = 0; i < keys.length; ++i)
                        message.scores[keys[i]] = Number(object.scores[keys[i]]);
                }
                return message;
            };

            /**
             * Creates a plain object from a HeuristicResult message. Also converts values to other types if specified.
             * @function toObject
             * @memberof autopilotrpc.QueryScoresResponse.HeuristicResult
             * @static
             * @param {autopilotrpc.QueryScoresResponse.HeuristicResult} message HeuristicResult
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            HeuristicResult.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.objects || options.defaults)
                    object.scores = {};
                if (options.defaults)
                    object.heuristic = "";
                if (message.heuristic != null && message.hasOwnProperty("heuristic"))
                    object.heuristic = message.heuristic;
                let keys2;
                if (message.scores && (keys2 = Object.keys(message.scores)).length) {
                    object.scores = {};
                    for (let j = 0; j < keys2.length; ++j)
                        object.scores[keys2[j]] = options.json && !isFinite(message.scores[keys2[j]]) ? String(message.scores[keys2[j]]) : message.scores[keys2[j]];
                }
                return object;
            };

            /**
             * Converts this HeuristicResult to JSON.
             * @function toJSON
             * @memberof autopilotrpc.QueryScoresResponse.HeuristicResult
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            HeuristicResult.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return HeuristicResult;
        })();

        return QueryScoresResponse;
    })();

    autopilotrpc.SetScoresRequest = (function() {

        /**
         * Properties of a SetScoresRequest.
         * @memberof autopilotrpc
         * @interface ISetScoresRequest
         * @property {string|null} [heuristic] The name of the heuristic to provide scores to.
         * @property {Object.<string,number>|null} [scores] A map from hex-encoded public keys to scores. Scores must be in the range
         * [0.0, 1.0].
         */

        /**
         * Constructs a new SetScoresRequest.
         * @memberof autopilotrpc
         * @classdesc Represents a SetScoresRequest.
         * @implements ISetScoresRequest
         * @constructor
         * @param {autopilotrpc.ISetScoresRequest=} [properties] Properties to set
         */
        function SetScoresRequest(properties) {
            this.scores = {};
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * The name of the heuristic to provide scores to.
         * @member {string} heuristic
         * @memberof autopilotrpc.SetScoresRequest
         * @instance
         */
        SetScoresRequest.prototype.heuristic = "";

        /**
         * A map from hex-encoded public keys to scores. Scores must be in the range
         * [0.0, 1.0].
         * @member {Object.<string,number>} scores
         * @memberof autopilotrpc.SetScoresRequest
         * @instance
         */
        SetScoresRequest.prototype.scores = $util.emptyObject;

        /**
         * Creates a new SetScoresRequest instance using the specified properties.
         * @function create
         * @memberof autopilotrpc.SetScoresRequest
         * @static
         * @param {autopilotrpc.ISetScoresRequest=} [properties] Properties to set
         * @returns {autopilotrpc.SetScoresRequest} SetScoresRequest instance
         */
        SetScoresRequest.create = function create(properties) {
            return new SetScoresRequest(properties);
        };

        /**
         * Encodes the specified SetScoresRequest message. Does not implicitly {@link autopilotrpc.SetScoresRequest.verify|verify} messages.
         * @function encode
         * @memberof autopilotrpc.SetScoresRequest
         * @static
         * @param {autopilotrpc.ISetScoresRequest} message SetScoresRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetScoresRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.heuristic != null && Object.hasOwnProperty.call(message, "heuristic"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.heuristic);
            if (message.scores != null && Object.hasOwnProperty.call(message, "scores"))
                for (let keys = Object.keys(message.scores), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 1 =*/17).double(message.scores[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SetScoresRequest message, length delimited. Does not implicitly {@link autopilotrpc.SetScoresRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof autopilotrpc.SetScoresRequest
         * @static
         * @param {autopilotrpc.ISetScoresRequest} message SetScoresRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetScoresRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SetScoresRequest message from the specified reader or buffer.
         * @function decode
         * @memberof autopilotrpc.SetScoresRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {autopilotrpc.SetScoresRequest} SetScoresRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetScoresRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.autopilotrpc.SetScoresRequest(), key;
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.heuristic = reader.string();
                    break;
                case 2:
                    reader.skip().pos++;
                    if (message.scores === $util.emptyObject)
                        message.scores = {};
                    key = reader.string();
                    reader.pos++;
                    message.scores[key] = reader.double();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SetScoresRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof autopilotrpc.SetScoresRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {autopilotrpc.SetScoresRequest} SetScoresRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetScoresRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SetScoresRequest message.
         * @function verify
         * @memberof autopilotrpc.SetScoresRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SetScoresRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.heuristic != null && message.hasOwnProperty("heuristic"))
                if (!$util.isString(message.heuristic))
                    return "heuristic: string expected";
            if (message.scores != null && message.hasOwnProperty("scores")) {
                if (!$util.isObject(message.scores))
                    return "scores: object expected";
                let key = Object.keys(message.scores);
                for (let i = 0; i < key.length; ++i)
                    if (typeof message.scores[key[i]] !== "number")
                        return "scores: number{k:string} expected";
            }
            return null;
        };

        /**
         * Creates a SetScoresRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof autopilotrpc.SetScoresRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {autopilotrpc.SetScoresRequest} SetScoresRequest
         */
        SetScoresRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.autopilotrpc.SetScoresRequest)
                return object;
            let message = new $root.autopilotrpc.SetScoresRequest();
            if (object.heuristic != null)
                message.heuristic = String(object.heuristic);
            if (object.scores) {
                if (typeof object.scores !== "object")
                    throw TypeError(".autopilotrpc.SetScoresRequest.scores: object expected");
                message.scores = {};
                for (let keys = Object.keys(object.scores), i = 0; i < keys.length; ++i)
                    message.scores[keys[i]] = Number(object.scores[keys[i]]);
            }
            return message;
        };

        /**
         * Creates a plain object from a SetScoresRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof autopilotrpc.SetScoresRequest
         * @static
         * @param {autopilotrpc.SetScoresRequest} message SetScoresRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SetScoresRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.objects || options.defaults)
                object.scores = {};
            if (options.defaults)
                object.heuristic = "";
            if (message.heuristic != null && message.hasOwnProperty("heuristic"))
                object.heuristic = message.heuristic;
            let keys2;
            if (message.scores && (keys2 = Object.keys(message.scores)).length) {
                object.scores = {};
                for (let j = 0; j < keys2.length; ++j)
                    object.scores[keys2[j]] = options.json && !isFinite(message.scores[keys2[j]]) ? String(message.scores[keys2[j]]) : message.scores[keys2[j]];
            }
            return object;
        };

        /**
         * Converts this SetScoresRequest to JSON.
         * @function toJSON
         * @memberof autopilotrpc.SetScoresRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SetScoresRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SetScoresRequest;
    })();

    autopilotrpc.SetScoresResponse = (function() {

        /**
         * Properties of a SetScoresResponse.
         * @memberof autopilotrpc
         * @interface ISetScoresResponse
         */

        /**
         * Constructs a new SetScoresResponse.
         * @memberof autopilotrpc
         * @classdesc Represents a SetScoresResponse.
         * @implements ISetScoresResponse
         * @constructor
         * @param {autopilotrpc.ISetScoresResponse=} [properties] Properties to set
         */
        function SetScoresResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new SetScoresResponse instance using the specified properties.
         * @function create
         * @memberof autopilotrpc.SetScoresResponse
         * @static
         * @param {autopilotrpc.ISetScoresResponse=} [properties] Properties to set
         * @returns {autopilotrpc.SetScoresResponse} SetScoresResponse instance
         */
        SetScoresResponse.create = function create(properties) {
            return new SetScoresResponse(properties);
        };

        /**
         * Encodes the specified SetScoresResponse message. Does not implicitly {@link autopilotrpc.SetScoresResponse.verify|verify} messages.
         * @function encode
         * @memberof autopilotrpc.SetScoresResponse
         * @static
         * @param {autopilotrpc.ISetScoresResponse} message SetScoresResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetScoresResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified SetScoresResponse message, length delimited. Does not implicitly {@link autopilotrpc.SetScoresResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof autopilotrpc.SetScoresResponse
         * @static
         * @param {autopilotrpc.ISetScoresResponse} message SetScoresResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SetScoresResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SetScoresResponse message from the specified reader or buffer.
         * @function decode
         * @memberof autopilotrpc.SetScoresResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {autopilotrpc.SetScoresResponse} SetScoresResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetScoresResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.autopilotrpc.SetScoresResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SetScoresResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof autopilotrpc.SetScoresResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {autopilotrpc.SetScoresResponse} SetScoresResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SetScoresResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SetScoresResponse message.
         * @function verify
         * @memberof autopilotrpc.SetScoresResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SetScoresResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a SetScoresResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof autopilotrpc.SetScoresResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {autopilotrpc.SetScoresResponse} SetScoresResponse
         */
        SetScoresResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.autopilotrpc.SetScoresResponse)
                return object;
            return new $root.autopilotrpc.SetScoresResponse();
        };

        /**
         * Creates a plain object from a SetScoresResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof autopilotrpc.SetScoresResponse
         * @static
         * @param {autopilotrpc.SetScoresResponse} message SetScoresResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SetScoresResponse.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this SetScoresResponse to JSON.
         * @function toJSON
         * @memberof autopilotrpc.SetScoresResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SetScoresResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SetScoresResponse;
    })();

    return autopilotrpc;
})();

export { $root as default };
