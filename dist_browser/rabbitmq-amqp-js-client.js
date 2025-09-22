const global$1 = globalThis || void 0 || self;
class AmqpExchange {
  constructor(info) {
    this.info = info;
  }
  get getInfo() {
    return this.info;
  }
}
class AmqpQueue {
  constructor(info) {
    this.info = info;
  }
  get getInfo() {
    return this.info;
  }
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      var isInstance = false;
      try {
        isInstance = this instanceof a2;
      } catch {
      }
      if (isInstance) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var browser$2 = { exports: {} };
var process = browser$2.exports = {};
var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
  throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    if (typeof setTimeout === "function") {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }
  try {
    if (typeof clearTimeout === "function") {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    return setTimeout(fun, 0);
  }
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e2) {
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    return clearTimeout(marker);
  }
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      return cachedClearTimeout.call(null, marker);
    } catch (e2) {
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
process.nextTick = function(fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
};
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function() {
  this.fun.apply(null, this.array);
};
process.title = "browser";
process.browser = true;
process.env = {};
process.argv = [];
process.version = "";
process.versions = {};
function noop() {
}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function(name) {
  return [];
};
process.binding = function(name) {
  throw new Error("process.binding is not supported");
};
process.cwd = function() {
  return "/";
};
process.chdir = function(dir) {
  throw new Error("process.chdir is not supported");
};
process.umask = function() {
  return 0;
};
var browserExports = browser$2.exports;
const process$1 = /* @__PURE__ */ getDefaultExportFromCjs(browserExports);
var buffer = {};
var base64Js = {};
base64Js.byteLength = byteLength;
base64Js.toByteArray = toByteArray;
base64Js.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}
revLookup["-".charCodeAt(0)] = 62;
revLookup["_".charCodeAt(0)] = 63;
function getLens(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }
  var validLen = b64.indexOf("=");
  if (validLen === -1) validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
}
function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0;
  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  var i;
  for (i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 255;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  return arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (uint8[i + 2] & 255);
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}
function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3;
  var parts = [];
  var maxChunkLength = 16383;
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(
      lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
    );
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(
      lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
    );
  }
  return parts.join("");
}
var ieee754 = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
ieee754.read = function(buffer2, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer2[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer2[offset + i], i += d, nBits -= 8) {
  }
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer2[offset + i], i += d, nBits -= 8) {
  }
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};
ieee754.write = function(buffer2, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);
  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer2[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
  }
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer2[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
  }
  buffer2[offset + i - d] |= s * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(exports) {
  const base64 = base64Js;
  const ieee754$1 = ieee754;
  const customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
  exports.Buffer = Buffer2;
  exports.SlowBuffer = SlowBuffer;
  exports.INSPECT_MAX_BYTES = 50;
  const K_MAX_LENGTH = 2147483647;
  exports.kMaxLength = K_MAX_LENGTH;
  const { Uint8Array: GlobalUint8Array, ArrayBuffer: GlobalArrayBuffer, SharedArrayBuffer: GlobalSharedArrayBuffer } = globalThis;
  Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
  if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
    console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
  }
  function typedArraySupport() {
    try {
      const arr = new GlobalUint8Array(1);
      const proto = { foo: function() {
        return 42;
      } };
      Object.setPrototypeOf(proto, GlobalUint8Array.prototype);
      Object.setPrototypeOf(arr, proto);
      return arr.foo() === 42;
    } catch (e) {
      return false;
    }
  }
  Object.defineProperty(Buffer2.prototype, "parent", {
    enumerable: true,
    get: function() {
      if (!Buffer2.isBuffer(this)) return void 0;
      return this.buffer;
    }
  });
  Object.defineProperty(Buffer2.prototype, "offset", {
    enumerable: true,
    get: function() {
      if (!Buffer2.isBuffer(this)) return void 0;
      return this.byteOffset;
    }
  });
  function createBuffer(length) {
    if (length > K_MAX_LENGTH) {
      throw new RangeError('The value "' + length + '" is invalid for option "size"');
    }
    const buf = new GlobalUint8Array(length);
    Object.setPrototypeOf(buf, Buffer2.prototype);
    return buf;
  }
  function Buffer2(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      if (typeof encodingOrOffset === "string") {
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      }
      return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
  }
  Buffer2.poolSize = 8192;
  function from(value, encodingOrOffset, length) {
    if (typeof value === "string") {
      return fromString(value, encodingOrOffset);
    }
    if (GlobalArrayBuffer.isView(value)) {
      return fromArrayView(value);
    }
    if (value == null) {
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    if (isInstance(value, GlobalArrayBuffer) || value && isInstance(value.buffer, GlobalArrayBuffer)) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof GlobalSharedArrayBuffer !== "undefined" && (isInstance(value, GlobalSharedArrayBuffer) || value && isInstance(value.buffer, GlobalSharedArrayBuffer))) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof value === "number") {
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    }
    const valueOf = value.valueOf && value.valueOf();
    if (valueOf != null && valueOf !== value) {
      return Buffer2.from(valueOf, encodingOrOffset, length);
    }
    const b = fromObject(value);
    if (b) return b;
    if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
      return Buffer2.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
    }
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
    );
  }
  Buffer2.from = function(value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length);
  };
  Object.setPrototypeOf(Buffer2.prototype, GlobalUint8Array.prototype);
  Object.setPrototypeOf(Buffer2, GlobalUint8Array);
  function assertSize(size) {
    if (typeof size !== "number") {
      throw new TypeError('"size" argument must be of type number');
    } else if (size < 0) {
      throw new RangeError('The value "' + size + '" is invalid for option "size"');
    }
  }
  function alloc(size, fill, encoding) {
    assertSize(size);
    if (size <= 0) {
      return createBuffer(size);
    }
    if (fill !== void 0) {
      return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
    }
    return createBuffer(size);
  }
  Buffer2.alloc = function(size, fill, encoding) {
    return alloc(size, fill, encoding);
  };
  function allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
  }
  Buffer2.allocUnsafe = function(size) {
    return allocUnsafe(size);
  };
  Buffer2.allocUnsafeSlow = function(size) {
    return allocUnsafe(size);
  };
  function fromString(string, encoding) {
    if (typeof encoding !== "string" || encoding === "") {
      encoding = "utf8";
    }
    if (!Buffer2.isEncoding(encoding)) {
      throw new TypeError("Unknown encoding: " + encoding);
    }
    const length = byteLength2(string, encoding) | 0;
    let buf = createBuffer(length);
    const actual = buf.write(string, encoding);
    if (actual !== length) {
      buf = buf.slice(0, actual);
    }
    return buf;
  }
  function fromArrayLike(array) {
    const length = array.length < 0 ? 0 : checked(array.length) | 0;
    const buf = createBuffer(length);
    for (let i = 0; i < length; i += 1) {
      buf[i] = array[i] & 255;
    }
    return buf;
  }
  function fromArrayView(arrayView) {
    if (isInstance(arrayView, GlobalUint8Array)) {
      const copy = new GlobalUint8Array(arrayView);
      return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
    }
    return fromArrayLike(arrayView);
  }
  function fromArrayBuffer(array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) {
      throw new RangeError('"offset" is outside of buffer bounds');
    }
    if (array.byteLength < byteOffset + (length || 0)) {
      throw new RangeError('"length" is outside of buffer bounds');
    }
    let buf;
    if (byteOffset === void 0 && length === void 0) {
      buf = new GlobalUint8Array(array);
    } else if (length === void 0) {
      buf = new GlobalUint8Array(array, byteOffset);
    } else {
      buf = new GlobalUint8Array(array, byteOffset, length);
    }
    Object.setPrototypeOf(buf, Buffer2.prototype);
    return buf;
  }
  function fromObject(obj) {
    if (Buffer2.isBuffer(obj)) {
      const len = checked(obj.length) | 0;
      const buf = createBuffer(len);
      if (buf.length === 0) {
        return buf;
      }
      obj.copy(buf, 0, 0, len);
      return buf;
    }
    if (obj.length !== void 0) {
      if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
        return createBuffer(0);
      }
      return fromArrayLike(obj);
    }
    if (obj.type === "Buffer" && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data);
    }
  }
  function checked(length) {
    if (length >= K_MAX_LENGTH) {
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
    }
    return length | 0;
  }
  function SlowBuffer(length) {
    if (+length != length) {
      length = 0;
    }
    return Buffer2.alloc(+length);
  }
  Buffer2.isBuffer = function isBuffer(b) {
    return b != null && b._isBuffer === true && b !== Buffer2.prototype;
  };
  Buffer2.compare = function compare(a, b) {
    if (isInstance(a, GlobalUint8Array)) a = Buffer2.from(a, a.offset, a.byteLength);
    if (isInstance(b, GlobalUint8Array)) b = Buffer2.from(b, b.offset, b.byteLength);
    if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    }
    if (a === b) return 0;
    let x = a.length;
    let y = b.length;
    for (let i = 0, len = Math.min(x, y); i < len; ++i) {
      if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break;
      }
    }
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
  };
  Buffer2.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return true;
      default:
        return false;
    }
  };
  Buffer2.concat = function concat(list, length) {
    if (!Array.isArray(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    if (list.length === 0) {
      return Buffer2.alloc(0);
    }
    let i;
    if (length === void 0) {
      length = 0;
      for (i = 0; i < list.length; ++i) {
        length += list[i].length;
      }
    }
    const buffer2 = Buffer2.allocUnsafe(length);
    let pos = 0;
    for (i = 0; i < list.length; ++i) {
      let buf = list[i];
      if (isInstance(buf, GlobalUint8Array)) {
        if (pos + buf.length > buffer2.length) {
          if (!Buffer2.isBuffer(buf)) buf = Buffer2.from(buf);
          buf.copy(buffer2, pos);
        } else {
          GlobalUint8Array.prototype.set.call(
            buffer2,
            buf,
            pos
          );
        }
      } else if (!Buffer2.isBuffer(buf)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      } else {
        buf.copy(buffer2, pos);
      }
      pos += buf.length;
    }
    return buffer2;
  };
  function byteLength2(string, encoding) {
    if (Buffer2.isBuffer(string)) {
      return string.length;
    }
    if (GlobalArrayBuffer.isView(string) || isInstance(string, GlobalArrayBuffer)) {
      return string.byteLength;
    }
    if (typeof string !== "string") {
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
      );
    }
    const len = string.length;
    const mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len === 0) return 0;
    let loweredCase = false;
    for (; ; ) {
      switch (encoding) {
        case "ascii":
        case "latin1":
        case "binary":
          return len;
        case "utf8":
        case "utf-8":
          return utf8ToBytes(string).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return len * 2;
        case "hex":
          return len >>> 1;
        case "base64":
          return base64ToBytes(string).length;
        default:
          if (loweredCase) {
            return mustMatch ? -1 : utf8ToBytes(string).length;
          }
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer2.byteLength = byteLength2;
  function slowToString(encoding, start, end) {
    let loweredCase = false;
    if (start === void 0 || start < 0) {
      start = 0;
    }
    if (start > this.length) {
      return "";
    }
    if (end === void 0 || end > this.length) {
      end = this.length;
    }
    if (end <= 0) {
      return "";
    }
    end >>>= 0;
    start >>>= 0;
    if (end <= start) {
      return "";
    }
    if (!encoding) encoding = "utf8";
    while (true) {
      switch (encoding) {
        case "hex":
          return hexSlice(this, start, end);
        case "utf8":
        case "utf-8":
          return utf8Slice(this, start, end);
        case "ascii":
          return asciiSlice(this, start, end);
        case "latin1":
        case "binary":
          return latin1Slice(this, start, end);
        case "base64":
          return base64Slice(this, start, end);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return utf16leSlice(this, start, end);
        default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = (encoding + "").toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer2.prototype._isBuffer = true;
  function swap(b, n, m) {
    const i = b[n];
    b[n] = b[m];
    b[m] = i;
  }
  Buffer2.prototype.swap16 = function swap16() {
    const len = this.length;
    if (len % 2 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    }
    for (let i = 0; i < len; i += 2) {
      swap(this, i, i + 1);
    }
    return this;
  };
  Buffer2.prototype.swap32 = function swap32() {
    const len = this.length;
    if (len % 4 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    }
    for (let i = 0; i < len; i += 4) {
      swap(this, i, i + 3);
      swap(this, i + 1, i + 2);
    }
    return this;
  };
  Buffer2.prototype.swap64 = function swap64() {
    const len = this.length;
    if (len % 8 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    }
    for (let i = 0; i < len; i += 8) {
      swap(this, i, i + 7);
      swap(this, i + 1, i + 6);
      swap(this, i + 2, i + 5);
      swap(this, i + 3, i + 4);
    }
    return this;
  };
  Buffer2.prototype.toString = function toString() {
    const length = this.length;
    if (length === 0) return "";
    if (arguments.length === 0) return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
  };
  Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
  Buffer2.prototype.equals = function equals(b) {
    if (!Buffer2.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
    if (this === b) return true;
    return Buffer2.compare(this, b) === 0;
  };
  Buffer2.prototype.inspect = function inspect() {
    let str = "";
    const max2 = exports.INSPECT_MAX_BYTES;
    str = this.toString("hex", 0, max2).replace(/(.{2})/g, "$1 ").trim();
    if (this.length > max2) str += " ... ";
    return "<Buffer " + str + ">";
  };
  if (customInspectSymbol) {
    Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
  }
  Buffer2.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (isInstance(target, GlobalUint8Array)) {
      target = Buffer2.from(target, target.offset, target.byteLength);
    }
    if (!Buffer2.isBuffer(target)) {
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
      );
    }
    if (start === void 0) {
      start = 0;
    }
    if (end === void 0) {
      end = target ? target.length : 0;
    }
    if (thisStart === void 0) {
      thisStart = 0;
    }
    if (thisEnd === void 0) {
      thisEnd = this.length;
    }
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
      throw new RangeError("out of range index");
    }
    if (thisStart >= thisEnd && start >= end) {
      return 0;
    }
    if (thisStart >= thisEnd) {
      return -1;
    }
    if (start >= end) {
      return 1;
    }
    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target) return 0;
    let x = thisEnd - thisStart;
    let y = end - start;
    const len = Math.min(x, y);
    const thisCopy = this.slice(thisStart, thisEnd);
    const targetCopy = target.slice(start, end);
    for (let i = 0; i < len; ++i) {
      if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i];
        y = targetCopy[i];
        break;
      }
    }
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
  };
  function bidirectionalIndexOf(buffer2, val, byteOffset, encoding, dir) {
    if (buffer2.length === 0) return -1;
    if (typeof byteOffset === "string") {
      encoding = byteOffset;
      byteOffset = 0;
    } else if (byteOffset > 2147483647) {
      byteOffset = 2147483647;
    } else if (byteOffset < -2147483648) {
      byteOffset = -2147483648;
    }
    byteOffset = +byteOffset;
    if (numberIsNaN(byteOffset)) {
      byteOffset = dir ? 0 : buffer2.length - 1;
    }
    if (byteOffset < 0) byteOffset = buffer2.length + byteOffset;
    if (byteOffset >= buffer2.length) {
      if (dir) return -1;
      else byteOffset = buffer2.length - 1;
    } else if (byteOffset < 0) {
      if (dir) byteOffset = 0;
      else return -1;
    }
    if (typeof val === "string") {
      val = Buffer2.from(val, encoding);
    }
    if (Buffer2.isBuffer(val)) {
      if (val.length === 0) {
        return -1;
      }
      return arrayIndexOf(buffer2, val, byteOffset, encoding, dir);
    } else if (typeof val === "number") {
      val = val & 255;
      if (typeof GlobalUint8Array.prototype.indexOf === "function") {
        if (dir) {
          return GlobalUint8Array.prototype.indexOf.call(buffer2, val, byteOffset);
        } else {
          return GlobalUint8Array.prototype.lastIndexOf.call(buffer2, val, byteOffset);
        }
      }
      return arrayIndexOf(buffer2, [val], byteOffset, encoding, dir);
    }
    throw new TypeError("val must be string, number or Buffer");
  }
  function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    let indexSize = 1;
    let arrLength = arr.length;
    let valLength = val.length;
    if (encoding !== void 0) {
      encoding = String(encoding).toLowerCase();
      if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
        if (arr.length < 2 || val.length < 2) {
          return -1;
        }
        indexSize = 2;
        arrLength /= 2;
        valLength /= 2;
        byteOffset /= 2;
      }
    }
    function read(buf, i2) {
      if (indexSize === 1) {
        return buf[i2];
      } else {
        return buf.readUInt16BE(i2 * indexSize);
      }
    }
    let i;
    if (dir) {
      let foundIndex = -1;
      for (i = byteOffset; i < arrLength; i++) {
        if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
          if (foundIndex === -1) foundIndex = i;
          if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
        } else {
          if (foundIndex !== -1) i -= i - foundIndex;
          foundIndex = -1;
        }
      }
    } else {
      if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
      for (i = byteOffset; i >= 0; i--) {
        let found = true;
        for (let j = 0; j < valLength; j++) {
          if (read(arr, i + j) !== read(val, j)) {
            found = false;
            break;
          }
        }
        if (found) return i;
      }
    }
    return -1;
  }
  Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
  };
  Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
  };
  Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
  };
  function hexWrite(buf, string, offset, length) {
    offset = Number(offset) || 0;
    const remaining = buf.length - offset;
    if (!length) {
      length = remaining;
    } else {
      length = Number(length);
      if (length > remaining) {
        length = remaining;
      }
    }
    const strLen = string.length;
    if (length > strLen / 2) {
      length = strLen / 2;
    }
    let i;
    for (i = 0; i < length; ++i) {
      const parsed = parseInt(string.substr(i * 2, 2), 16);
      if (numberIsNaN(parsed)) return i;
      buf[offset + i] = parsed;
    }
    return i;
  }
  function utf8Write(buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
  }
  function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
  }
  function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
  }
  function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
  }
  Buffer2.prototype.write = function write(string, offset, length, encoding) {
    if (offset === void 0) {
      encoding = "utf8";
      length = this.length;
      offset = 0;
    } else if (length === void 0 && typeof offset === "string") {
      encoding = offset;
      length = this.length;
      offset = 0;
    } else if (isFinite(offset)) {
      offset = offset >>> 0;
      if (isFinite(length)) {
        length = length >>> 0;
        if (encoding === void 0) encoding = "utf8";
      } else {
        encoding = length;
        length = void 0;
      }
    } else {
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    }
    const remaining = this.length - offset;
    if (length === void 0 || length > remaining) length = remaining;
    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
      throw new RangeError("Attempt to write outside buffer bounds");
    }
    if (!encoding) encoding = "utf8";
    let loweredCase = false;
    for (; ; ) {
      switch (encoding) {
        case "hex":
          return hexWrite(this, string, offset, length);
        case "utf8":
        case "utf-8":
          return utf8Write(this, string, offset, length);
        case "ascii":
        case "latin1":
        case "binary":
          return asciiWrite(this, string, offset, length);
        case "base64":
          return base64Write(this, string, offset, length);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return ucs2Write(this, string, offset, length);
        default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  };
  Buffer2.prototype.toJSON = function toJSON() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) {
      return base64.fromByteArray(buf);
    } else {
      return base64.fromByteArray(buf.slice(start, end));
    }
  }
  function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    const res = [];
    let i = start;
    while (i < end) {
      const firstByte = buf[i];
      let codePoint = null;
      let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
      if (i + bytesPerSequence <= end) {
        let secondByte, thirdByte, fourthByte, tempCodePoint;
        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 128) {
              codePoint = firstByte;
            }
            break;
          case 2:
            secondByte = buf[i + 1];
            if ((secondByte & 192) === 128) {
              tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
              if (tempCodePoint > 127) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 3:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
              if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 4:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            fourthByte = buf[i + 3];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
              if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                codePoint = tempCodePoint;
              }
            }
        }
      }
      if (codePoint === null) {
        codePoint = 65533;
        bytesPerSequence = 1;
      } else if (codePoint > 65535) {
        codePoint -= 65536;
        res.push(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      res.push(codePoint);
      i += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
  }
  const MAX_ARGUMENTS_LENGTH = 4096;
  function decodeCodePointsArray(codePoints) {
    const len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints);
    }
    let res = "";
    let i = 0;
    while (i < len) {
      res += String.fromCharCode.apply(
        String,
        codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
      );
    }
    return res;
  }
  function asciiSlice(buf, start, end) {
    let ret = "";
    end = Math.min(buf.length, end);
    for (let i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i] & 127);
    }
    return ret;
  }
  function latin1Slice(buf, start, end) {
    let ret = "";
    end = Math.min(buf.length, end);
    for (let i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i]);
    }
    return ret;
  }
  function hexSlice(buf, start, end) {
    const len = buf.length;
    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;
    let out = "";
    for (let i = start; i < end; ++i) {
      out += hexSliceLookupTable[buf[i]];
    }
    return out;
  }
  function utf16leSlice(buf, start, end) {
    const bytes = buf.slice(start, end);
    let res = "";
    for (let i = 0; i < bytes.length - 1; i += 2) {
      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }
    return res;
  }
  Buffer2.prototype.slice = function slice(start, end) {
    const len = this.length;
    start = ~~start;
    end = end === void 0 ? len : ~~end;
    if (start < 0) {
      start += len;
      if (start < 0) start = 0;
    } else if (start > len) {
      start = len;
    }
    if (end < 0) {
      end += len;
      if (end < 0) end = 0;
    } else if (end > len) {
      end = len;
    }
    if (end < start) end = start;
    const newBuf = this.subarray(start, end);
    Object.setPrototypeOf(newBuf, Buffer2.prototype);
    return newBuf;
  };
  function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
    if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
  }
  Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) checkOffset(offset, byteLength3, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength3 && (mul *= 256)) {
      val += this[offset + i] * mul;
    }
    return val;
  };
  Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      checkOffset(offset, byteLength3, this.length);
    }
    let val = this[offset + --byteLength3];
    let mul = 1;
    while (byteLength3 > 0 && (mul *= 256)) {
      val += this[offset + --byteLength3] * mul;
    }
    return val;
  };
  Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    return this[offset];
  };
  Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
  };
  Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
  };
  Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
  };
  Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
  };
  Buffer2.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
      boundsError(offset, this.length - 8);
    }
    const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
    const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
    return BigInt(lo) + (BigInt(hi) << BigInt(32));
  });
  Buffer2.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
      boundsError(offset, this.length - 8);
    }
    const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
    return (BigInt(hi) << BigInt(32)) + BigInt(lo);
  });
  Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) checkOffset(offset, byteLength3, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength3 && (mul *= 256)) {
      val += this[offset + i] * mul;
    }
    mul *= 128;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength3);
    return val;
  };
  Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) checkOffset(offset, byteLength3, this.length);
    let i = byteLength3;
    let mul = 1;
    let val = this[offset + --i];
    while (i > 0 && (mul *= 256)) {
      val += this[offset + --i] * mul;
    }
    mul *= 128;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength3);
    return val;
  };
  Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    if (!(this[offset] & 128)) return this[offset];
    return (255 - this[offset] + 1) * -1;
  };
  Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    const val = this[offset] | this[offset + 1] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    const val = this[offset + 1] | this[offset] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
  };
  Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
  };
  Buffer2.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
      boundsError(offset, this.length - 8);
    }
    const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
    return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
  });
  Buffer2.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
      boundsError(offset, this.length - 8);
    }
    const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
  });
  Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754$1.read(this, offset, true, 23, 4);
  };
  Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754$1.read(this, offset, false, 23, 4);
  };
  Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754$1.read(this, offset, true, 52, 8);
  };
  Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754$1.read(this, offset, false, 52, 8);
  };
  function checkInt(buf, value, offset, ext, max2, min2) {
    if (!Buffer2.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max2 || value < min2) throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length) throw new RangeError("Index out of range");
  }
  Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      const maxBytes = Math.pow(2, 8 * byteLength3) - 1;
      checkInt(this, value, offset, byteLength3, maxBytes, 0);
    }
    let mul = 1;
    let i = 0;
    this[offset] = value & 255;
    while (++i < byteLength3 && (mul *= 256)) {
      this[offset + i] = value / mul & 255;
    }
    return offset + byteLength3;
  };
  Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      const maxBytes = Math.pow(2, 8 * byteLength3) - 1;
      checkInt(this, value, offset, byteLength3, maxBytes, 0);
    }
    let i = byteLength3 - 1;
    let mul = 1;
    this[offset + i] = value & 255;
    while (--i >= 0 && (mul *= 256)) {
      this[offset + i] = value / mul & 255;
    }
    return offset + byteLength3;
  };
  Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
    this[offset] = value & 255;
    return offset + 1;
  };
  Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };
  Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
  };
  Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 255;
    return offset + 4;
  };
  Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
  };
  function wrtBigUInt64LE(buf, value, offset, min2, max2) {
    checkIntBI(value, min2, max2, buf, offset, 7);
    let lo = Number(value & BigInt(4294967295));
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    let hi = Number(value >> BigInt(32) & BigInt(4294967295));
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    return offset;
  }
  function wrtBigUInt64BE(buf, value, offset, min2, max2) {
    checkIntBI(value, min2, max2, buf, offset, 7);
    let lo = Number(value & BigInt(4294967295));
    buf[offset + 7] = lo;
    lo = lo >> 8;
    buf[offset + 6] = lo;
    lo = lo >> 8;
    buf[offset + 5] = lo;
    lo = lo >> 8;
    buf[offset + 4] = lo;
    let hi = Number(value >> BigInt(32) & BigInt(4294967295));
    buf[offset + 3] = hi;
    hi = hi >> 8;
    buf[offset + 2] = hi;
    hi = hi >> 8;
    buf[offset + 1] = hi;
    hi = hi >> 8;
    buf[offset] = hi;
    return offset + 8;
  }
  Buffer2.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
    return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
  });
  Buffer2.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
    return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
  });
  Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      const limit = Math.pow(2, 8 * byteLength3 - 1);
      checkInt(this, value, offset, byteLength3, limit - 1, -limit);
    }
    let i = 0;
    let mul = 1;
    let sub = 0;
    this[offset] = value & 255;
    while (++i < byteLength3 && (mul *= 256)) {
      if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength3;
  };
  Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      const limit = Math.pow(2, 8 * byteLength3 - 1);
      checkInt(this, value, offset, byteLength3, limit - 1, -limit);
    }
    let i = byteLength3 - 1;
    let mul = 1;
    let sub = 0;
    this[offset + i] = value & 255;
    while (--i >= 0 && (mul *= 256)) {
      if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength3;
  };
  Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
    if (value < 0) value = 255 + value + 1;
    this[offset] = value & 255;
    return offset + 1;
  };
  Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };
  Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
  };
  Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
    return offset + 4;
  };
  Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
    if (value < 0) value = 4294967295 + value + 1;
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
  };
  Buffer2.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
    return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  Buffer2.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
    return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function checkIEEE754(buf, value, offset, ext, max2, min2) {
    if (offset + ext > buf.length) throw new RangeError("Index out of range");
    if (offset < 0) throw new RangeError("Index out of range");
  }
  function writeFloat(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 4);
    }
    ieee754$1.write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
  }
  Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
  };
  Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
  };
  function writeDouble(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 8);
    }
    ieee754$1.write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
  }
  Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
  };
  Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
  };
  Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
    if (!Buffer2.isBuffer(target)) throw new TypeError("argument should be a Buffer");
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start;
    if (end === start) return 0;
    if (target.length === 0 || this.length === 0) return 0;
    if (targetStart < 0) {
      throw new RangeError("targetStart out of bounds");
    }
    if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
    if (end < 0) throw new RangeError("sourceEnd out of bounds");
    if (end > this.length) end = this.length;
    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start;
    }
    const len = end - start;
    if (this === target && typeof GlobalUint8Array.prototype.copyWithin === "function") {
      this.copyWithin(targetStart, start, end);
    } else {
      GlobalUint8Array.prototype.set.call(
        target,
        this.subarray(start, end),
        targetStart
      );
    }
    return len;
  };
  Buffer2.prototype.fill = function fill(val, start, end, encoding) {
    if (typeof val === "string") {
      if (typeof start === "string") {
        encoding = start;
        start = 0;
        end = this.length;
      } else if (typeof end === "string") {
        encoding = end;
        end = this.length;
      }
      if (encoding !== void 0 && typeof encoding !== "string") {
        throw new TypeError("encoding must be a string");
      }
      if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      if (val.length === 1) {
        const code2 = val.charCodeAt(0);
        if (encoding === "utf8" && code2 < 128 || encoding === "latin1") {
          val = code2;
        }
      }
    } else if (typeof val === "number") {
      val = val & 255;
    } else if (typeof val === "boolean") {
      val = Number(val);
    }
    if (start < 0 || this.length < start || this.length < end) {
      throw new RangeError("Out of range index");
    }
    if (end <= start) {
      return this;
    }
    start = start >>> 0;
    end = end === void 0 ? this.length : end >>> 0;
    if (!val) val = 0;
    let i;
    if (typeof val === "number") {
      for (i = start; i < end; ++i) {
        this[i] = val;
      }
    } else {
      const bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
      const len = bytes.length;
      if (len === 0) {
        throw new TypeError('The value "' + val + '" is invalid for argument "value"');
      }
      for (i = 0; i < end - start; ++i) {
        this[i + start] = bytes[i % len];
      }
    }
    return this;
  };
  const errors2 = {};
  function E(sym, getMessage, Base) {
    errors2[sym] = class NodeError extends Base {
      constructor() {
        super();
        Object.defineProperty(this, "message", {
          value: getMessage.apply(this, arguments),
          writable: true,
          configurable: true
        });
        this.name = `${this.name} [${sym}]`;
        this.stack;
        delete this.name;
      }
      get code() {
        return sym;
      }
      set code(value) {
        Object.defineProperty(this, "code", {
          configurable: true,
          enumerable: true,
          value,
          writable: true
        });
      }
      toString() {
        return `${this.name} [${sym}]: ${this.message}`;
      }
    };
  }
  E(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(name) {
      if (name) {
        return `${name} is outside of buffer bounds`;
      }
      return "Attempt to access memory outside buffer bounds";
    },
    RangeError
  );
  E(
    "ERR_INVALID_ARG_TYPE",
    function(name, actual) {
      return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
    },
    TypeError
  );
  E(
    "ERR_OUT_OF_RANGE",
    function(str, range2, input) {
      let msg = `The value of "${str}" is out of range.`;
      let received = input;
      if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
        received = addNumericalSeparator(String(input));
      } else if (typeof input === "bigint") {
        received = String(input);
        if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
          received = addNumericalSeparator(received);
        }
        received += "n";
      }
      msg += ` It must be ${range2}. Received ${received}`;
      return msg;
    },
    RangeError
  );
  function addNumericalSeparator(val) {
    let res = "";
    let i = val.length;
    const start = val[0] === "-" ? 1 : 0;
    for (; i >= start + 4; i -= 3) {
      res = `_${val.slice(i - 3, i)}${res}`;
    }
    return `${val.slice(0, i)}${res}`;
  }
  function checkBounds(buf, offset, byteLength3) {
    validateNumber(offset, "offset");
    if (buf[offset] === void 0 || buf[offset + byteLength3] === void 0) {
      boundsError(offset, buf.length - (byteLength3 + 1));
    }
  }
  function checkIntBI(value, min2, max2, buf, offset, byteLength3) {
    if (value > max2 || value < min2) {
      const n = typeof min2 === "bigint" ? "n" : "";
      let range2;
      {
        if (min2 === 0 || min2 === BigInt(0)) {
          range2 = `>= 0${n} and < 2${n} ** ${(byteLength3 + 1) * 8}${n}`;
        } else {
          range2 = `>= -(2${n} ** ${(byteLength3 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength3 + 1) * 8 - 1}${n}`;
        }
      }
      throw new errors2.ERR_OUT_OF_RANGE("value", range2, value);
    }
    checkBounds(buf, offset, byteLength3);
  }
  function validateNumber(value, name) {
    if (typeof value !== "number") {
      throw new errors2.ERR_INVALID_ARG_TYPE(name, "number", value);
    }
  }
  function boundsError(value, length, type2) {
    if (Math.floor(value) !== value) {
      validateNumber(value, type2);
      throw new errors2.ERR_OUT_OF_RANGE("offset", "an integer", value);
    }
    if (length < 0) {
      throw new errors2.ERR_BUFFER_OUT_OF_BOUNDS();
    }
    throw new errors2.ERR_OUT_OF_RANGE(
      "offset",
      `>= ${0} and <= ${length}`,
      value
    );
  }
  const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
  function base64clean(str) {
    str = str.split("=")[0];
    str = str.trim().replace(INVALID_BASE64_RE, "");
    if (str.length < 2) return "";
    while (str.length % 4 !== 0) {
      str = str + "=";
    }
    return str;
  }
  function utf8ToBytes(string, units) {
    units = units || Infinity;
    let codePoint;
    const length = string.length;
    let leadSurrogate = null;
    const bytes = [];
    for (let i = 0; i < length; ++i) {
      codePoint = string.charCodeAt(i);
      if (codePoint > 55295 && codePoint < 57344) {
        if (!leadSurrogate) {
          if (codePoint > 56319) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
            continue;
          } else if (i + 1 === length) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
            continue;
          }
          leadSurrogate = codePoint;
          continue;
        }
        if (codePoint < 56320) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
          leadSurrogate = codePoint;
          continue;
        }
        codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
      } else if (leadSurrogate) {
        if ((units -= 3) > -1) bytes.push(239, 191, 189);
      }
      leadSurrogate = null;
      if (codePoint < 128) {
        if ((units -= 1) < 0) break;
        bytes.push(codePoint);
      } else if (codePoint < 2048) {
        if ((units -= 2) < 0) break;
        bytes.push(
          codePoint >> 6 | 192,
          codePoint & 63 | 128
        );
      } else if (codePoint < 65536) {
        if ((units -= 3) < 0) break;
        bytes.push(
          codePoint >> 12 | 224,
          codePoint >> 6 & 63 | 128,
          codePoint & 63 | 128
        );
      } else if (codePoint < 1114112) {
        if ((units -= 4) < 0) break;
        bytes.push(
          codePoint >> 18 | 240,
          codePoint >> 12 & 63 | 128,
          codePoint >> 6 & 63 | 128,
          codePoint & 63 | 128
        );
      } else {
        throw new Error("Invalid code point");
      }
    }
    return bytes;
  }
  function asciiToBytes(str) {
    const byteArray = [];
    for (let i = 0; i < str.length; ++i) {
      byteArray.push(str.charCodeAt(i) & 255);
    }
    return byteArray;
  }
  function utf16leToBytes(str, units) {
    let c, hi, lo;
    const byteArray = [];
    for (let i = 0; i < str.length; ++i) {
      if ((units -= 2) < 0) break;
      c = str.charCodeAt(i);
      hi = c >> 8;
      lo = c % 256;
      byteArray.push(lo);
      byteArray.push(hi);
    }
    return byteArray;
  }
  function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
  }
  function blitBuffer(src, dst, offset, length) {
    let i;
    for (i = 0; i < length; ++i) {
      if (i + offset >= dst.length || i >= src.length) break;
      dst[i + offset] = src[i];
    }
    return i;
  }
  function isInstance(obj, type2) {
    return obj instanceof type2 || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type2.name;
  }
  function numberIsNaN(obj) {
    return obj !== obj;
  }
  const hexSliceLookupTable = function() {
    const alphabet = "0123456789abcdef";
    const table = new Array(256);
    for (let i = 0; i < 16; ++i) {
      const i16 = i * 16;
      for (let j = 0; j < 16; ++j) {
        table[i16 + j] = alphabet[i] + alphabet[j];
      }
    }
    return table;
  }();
  function defineBigIntMethod(fn) {
    return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
  }
  function BufferBigIntNotDefined() {
    throw new Error("BigInt not supported");
  }
})(buffer);
const Buffer = buffer.Buffer;
var util = {};
var types = {};
var shams$1;
var hasRequiredShams$1;
function requireShams$1() {
  if (hasRequiredShams$1) return shams$1;
  hasRequiredShams$1 = 1;
  shams$1 = function hasSymbols2() {
    if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
      return false;
    }
    if (typeof Symbol.iterator === "symbol") {
      return true;
    }
    var obj = {};
    var sym = Symbol("test");
    var symObj = Object(sym);
    if (typeof sym === "string") {
      return false;
    }
    if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
      return false;
    }
    if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
      return false;
    }
    var symVal = 42;
    obj[sym] = symVal;
    for (var _ in obj) {
      return false;
    }
    if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
      return false;
    }
    if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
      return false;
    }
    var syms = Object.getOwnPropertySymbols(obj);
    if (syms.length !== 1 || syms[0] !== sym) {
      return false;
    }
    if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
      return false;
    }
    if (typeof Object.getOwnPropertyDescriptor === "function") {
      var descriptor = (
        /** @type {PropertyDescriptor} */
        Object.getOwnPropertyDescriptor(obj, sym)
      );
      if (descriptor.value !== symVal || descriptor.enumerable !== true) {
        return false;
      }
    }
    return true;
  };
  return shams$1;
}
var shams;
var hasRequiredShams;
function requireShams() {
  if (hasRequiredShams) return shams;
  hasRequiredShams = 1;
  var hasSymbols2 = requireShams$1();
  shams = function hasToStringTagShams() {
    return hasSymbols2() && !!Symbol.toStringTag;
  };
  return shams;
}
var esObjectAtoms;
var hasRequiredEsObjectAtoms;
function requireEsObjectAtoms() {
  if (hasRequiredEsObjectAtoms) return esObjectAtoms;
  hasRequiredEsObjectAtoms = 1;
  esObjectAtoms = Object;
  return esObjectAtoms;
}
var esErrors;
var hasRequiredEsErrors;
function requireEsErrors() {
  if (hasRequiredEsErrors) return esErrors;
  hasRequiredEsErrors = 1;
  esErrors = Error;
  return esErrors;
}
var _eval;
var hasRequired_eval;
function require_eval() {
  if (hasRequired_eval) return _eval;
  hasRequired_eval = 1;
  _eval = EvalError;
  return _eval;
}
var range;
var hasRequiredRange;
function requireRange() {
  if (hasRequiredRange) return range;
  hasRequiredRange = 1;
  range = RangeError;
  return range;
}
var ref;
var hasRequiredRef;
function requireRef() {
  if (hasRequiredRef) return ref;
  hasRequiredRef = 1;
  ref = ReferenceError;
  return ref;
}
var syntax;
var hasRequiredSyntax;
function requireSyntax() {
  if (hasRequiredSyntax) return syntax;
  hasRequiredSyntax = 1;
  syntax = SyntaxError;
  return syntax;
}
var type;
var hasRequiredType;
function requireType() {
  if (hasRequiredType) return type;
  hasRequiredType = 1;
  type = TypeError;
  return type;
}
var uri;
var hasRequiredUri;
function requireUri() {
  if (hasRequiredUri) return uri;
  hasRequiredUri = 1;
  uri = URIError;
  return uri;
}
var abs;
var hasRequiredAbs;
function requireAbs() {
  if (hasRequiredAbs) return abs;
  hasRequiredAbs = 1;
  abs = Math.abs;
  return abs;
}
var floor;
var hasRequiredFloor;
function requireFloor() {
  if (hasRequiredFloor) return floor;
  hasRequiredFloor = 1;
  floor = Math.floor;
  return floor;
}
var max;
var hasRequiredMax;
function requireMax() {
  if (hasRequiredMax) return max;
  hasRequiredMax = 1;
  max = Math.max;
  return max;
}
var min;
var hasRequiredMin;
function requireMin() {
  if (hasRequiredMin) return min;
  hasRequiredMin = 1;
  min = Math.min;
  return min;
}
var pow;
var hasRequiredPow;
function requirePow() {
  if (hasRequiredPow) return pow;
  hasRequiredPow = 1;
  pow = Math.pow;
  return pow;
}
var round;
var hasRequiredRound;
function requireRound() {
  if (hasRequiredRound) return round;
  hasRequiredRound = 1;
  round = Math.round;
  return round;
}
var _isNaN;
var hasRequired_isNaN;
function require_isNaN() {
  if (hasRequired_isNaN) return _isNaN;
  hasRequired_isNaN = 1;
  _isNaN = Number.isNaN || function isNaN2(a) {
    return a !== a;
  };
  return _isNaN;
}
var sign;
var hasRequiredSign;
function requireSign() {
  if (hasRequiredSign) return sign;
  hasRequiredSign = 1;
  var $isNaN = /* @__PURE__ */ require_isNaN();
  sign = function sign2(number) {
    if ($isNaN(number) || number === 0) {
      return number;
    }
    return number < 0 ? -1 : 1;
  };
  return sign;
}
var gOPD;
var hasRequiredGOPD;
function requireGOPD() {
  if (hasRequiredGOPD) return gOPD;
  hasRequiredGOPD = 1;
  gOPD = Object.getOwnPropertyDescriptor;
  return gOPD;
}
var gopd;
var hasRequiredGopd;
function requireGopd() {
  if (hasRequiredGopd) return gopd;
  hasRequiredGopd = 1;
  var $gOPD = /* @__PURE__ */ requireGOPD();
  if ($gOPD) {
    try {
      $gOPD([], "length");
    } catch (e) {
      $gOPD = null;
    }
  }
  gopd = $gOPD;
  return gopd;
}
var esDefineProperty;
var hasRequiredEsDefineProperty;
function requireEsDefineProperty() {
  if (hasRequiredEsDefineProperty) return esDefineProperty;
  hasRequiredEsDefineProperty = 1;
  var $defineProperty = Object.defineProperty || false;
  if ($defineProperty) {
    try {
      $defineProperty({}, "a", { value: 1 });
    } catch (e) {
      $defineProperty = false;
    }
  }
  esDefineProperty = $defineProperty;
  return esDefineProperty;
}
var hasSymbols;
var hasRequiredHasSymbols;
function requireHasSymbols() {
  if (hasRequiredHasSymbols) return hasSymbols;
  hasRequiredHasSymbols = 1;
  var origSymbol = typeof Symbol !== "undefined" && Symbol;
  var hasSymbolSham = requireShams$1();
  hasSymbols = function hasNativeSymbols() {
    if (typeof origSymbol !== "function") {
      return false;
    }
    if (typeof Symbol !== "function") {
      return false;
    }
    if (typeof origSymbol("foo") !== "symbol") {
      return false;
    }
    if (typeof Symbol("bar") !== "symbol") {
      return false;
    }
    return hasSymbolSham();
  };
  return hasSymbols;
}
var Reflect_getPrototypeOf;
var hasRequiredReflect_getPrototypeOf;
function requireReflect_getPrototypeOf() {
  if (hasRequiredReflect_getPrototypeOf) return Reflect_getPrototypeOf;
  hasRequiredReflect_getPrototypeOf = 1;
  Reflect_getPrototypeOf = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
  return Reflect_getPrototypeOf;
}
var Object_getPrototypeOf;
var hasRequiredObject_getPrototypeOf;
function requireObject_getPrototypeOf() {
  if (hasRequiredObject_getPrototypeOf) return Object_getPrototypeOf;
  hasRequiredObject_getPrototypeOf = 1;
  var $Object = /* @__PURE__ */ requireEsObjectAtoms();
  Object_getPrototypeOf = $Object.getPrototypeOf || null;
  return Object_getPrototypeOf;
}
var implementation;
var hasRequiredImplementation;
function requireImplementation() {
  if (hasRequiredImplementation) return implementation;
  hasRequiredImplementation = 1;
  var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
  var toStr = Object.prototype.toString;
  var max2 = Math.max;
  var funcType = "[object Function]";
  var concatty = function concatty2(a, b) {
    var arr = [];
    for (var i = 0; i < a.length; i += 1) {
      arr[i] = a[i];
    }
    for (var j = 0; j < b.length; j += 1) {
      arr[j + a.length] = b[j];
    }
    return arr;
  };
  var slicy = function slicy2(arrLike, offset) {
    var arr = [];
    for (var i = offset, j = 0; i < arrLike.length; i += 1, j += 1) {
      arr[j] = arrLike[i];
    }
    return arr;
  };
  var joiny = function(arr, joiner) {
    var str = "";
    for (var i = 0; i < arr.length; i += 1) {
      str += arr[i];
      if (i + 1 < arr.length) {
        str += joiner;
      }
    }
    return str;
  };
  implementation = function bind(that) {
    var target = this;
    if (typeof target !== "function" || toStr.apply(target) !== funcType) {
      throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);
    var bound;
    var binder = function() {
      if (this instanceof bound) {
        var result = target.apply(
          this,
          concatty(args, arguments)
        );
        if (Object(result) === result) {
          return result;
        }
        return this;
      }
      return target.apply(
        that,
        concatty(args, arguments)
      );
    };
    var boundLength = max2(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
      boundArgs[i] = "$" + i;
    }
    bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
    if (target.prototype) {
      var Empty = function Empty2() {
      };
      Empty.prototype = target.prototype;
      bound.prototype = new Empty();
      Empty.prototype = null;
    }
    return bound;
  };
  return implementation;
}
var functionBind;
var hasRequiredFunctionBind;
function requireFunctionBind() {
  if (hasRequiredFunctionBind) return functionBind;
  hasRequiredFunctionBind = 1;
  var implementation2 = requireImplementation();
  functionBind = Function.prototype.bind || implementation2;
  return functionBind;
}
var functionCall;
var hasRequiredFunctionCall;
function requireFunctionCall() {
  if (hasRequiredFunctionCall) return functionCall;
  hasRequiredFunctionCall = 1;
  functionCall = Function.prototype.call;
  return functionCall;
}
var functionApply;
var hasRequiredFunctionApply;
function requireFunctionApply() {
  if (hasRequiredFunctionApply) return functionApply;
  hasRequiredFunctionApply = 1;
  functionApply = Function.prototype.apply;
  return functionApply;
}
var reflectApply;
var hasRequiredReflectApply;
function requireReflectApply() {
  if (hasRequiredReflectApply) return reflectApply;
  hasRequiredReflectApply = 1;
  reflectApply = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
  return reflectApply;
}
var actualApply;
var hasRequiredActualApply;
function requireActualApply() {
  if (hasRequiredActualApply) return actualApply;
  hasRequiredActualApply = 1;
  var bind = requireFunctionBind();
  var $apply = requireFunctionApply();
  var $call = requireFunctionCall();
  var $reflectApply = requireReflectApply();
  actualApply = $reflectApply || bind.call($call, $apply);
  return actualApply;
}
var callBindApplyHelpers;
var hasRequiredCallBindApplyHelpers;
function requireCallBindApplyHelpers() {
  if (hasRequiredCallBindApplyHelpers) return callBindApplyHelpers;
  hasRequiredCallBindApplyHelpers = 1;
  var bind = requireFunctionBind();
  var $TypeError = /* @__PURE__ */ requireType();
  var $call = requireFunctionCall();
  var $actualApply = requireActualApply();
  callBindApplyHelpers = function callBindBasic(args) {
    if (args.length < 1 || typeof args[0] !== "function") {
      throw new $TypeError("a function is required");
    }
    return $actualApply(bind, $call, args);
  };
  return callBindApplyHelpers;
}
var get;
var hasRequiredGet;
function requireGet() {
  if (hasRequiredGet) return get;
  hasRequiredGet = 1;
  var callBind2 = requireCallBindApplyHelpers();
  var gOPD2 = /* @__PURE__ */ requireGopd();
  var hasProtoAccessor;
  try {
    hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
    [].__proto__ === Array.prototype;
  } catch (e) {
    if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
      throw e;
    }
  }
  var desc = !!hasProtoAccessor && gOPD2 && gOPD2(
    Object.prototype,
    /** @type {keyof typeof Object.prototype} */
    "__proto__"
  );
  var $Object = Object;
  var $getPrototypeOf = $Object.getPrototypeOf;
  get = desc && typeof desc.get === "function" ? callBind2([desc.get]) : typeof $getPrototypeOf === "function" ? (
    /** @type {import('./get')} */
    function getDunder(value) {
      return $getPrototypeOf(value == null ? value : $Object(value));
    }
  ) : false;
  return get;
}
var getProto;
var hasRequiredGetProto;
function requireGetProto() {
  if (hasRequiredGetProto) return getProto;
  hasRequiredGetProto = 1;
  var reflectGetProto = requireReflect_getPrototypeOf();
  var originalGetProto = requireObject_getPrototypeOf();
  var getDunderProto = /* @__PURE__ */ requireGet();
  getProto = reflectGetProto ? function getProto2(O) {
    return reflectGetProto(O);
  } : originalGetProto ? function getProto2(O) {
    if (!O || typeof O !== "object" && typeof O !== "function") {
      throw new TypeError("getProto: not an object");
    }
    return originalGetProto(O);
  } : getDunderProto ? function getProto2(O) {
    return getDunderProto(O);
  } : null;
  return getProto;
}
var hasown;
var hasRequiredHasown;
function requireHasown() {
  if (hasRequiredHasown) return hasown;
  hasRequiredHasown = 1;
  var call = Function.prototype.call;
  var $hasOwn = Object.prototype.hasOwnProperty;
  var bind = requireFunctionBind();
  hasown = bind.call(call, $hasOwn);
  return hasown;
}
var getIntrinsic;
var hasRequiredGetIntrinsic;
function requireGetIntrinsic() {
  if (hasRequiredGetIntrinsic) return getIntrinsic;
  hasRequiredGetIntrinsic = 1;
  var undefined$1;
  var $Object = /* @__PURE__ */ requireEsObjectAtoms();
  var $Error = /* @__PURE__ */ requireEsErrors();
  var $EvalError = /* @__PURE__ */ require_eval();
  var $RangeError = /* @__PURE__ */ requireRange();
  var $ReferenceError = /* @__PURE__ */ requireRef();
  var $SyntaxError = /* @__PURE__ */ requireSyntax();
  var $TypeError = /* @__PURE__ */ requireType();
  var $URIError = /* @__PURE__ */ requireUri();
  var abs2 = /* @__PURE__ */ requireAbs();
  var floor2 = /* @__PURE__ */ requireFloor();
  var max2 = /* @__PURE__ */ requireMax();
  var min2 = /* @__PURE__ */ requireMin();
  var pow2 = /* @__PURE__ */ requirePow();
  var round2 = /* @__PURE__ */ requireRound();
  var sign2 = /* @__PURE__ */ requireSign();
  var $Function = Function;
  var getEvalledConstructor = function(expressionSyntax) {
    try {
      return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
    } catch (e) {
    }
  };
  var $gOPD = /* @__PURE__ */ requireGopd();
  var $defineProperty = /* @__PURE__ */ requireEsDefineProperty();
  var throwTypeError = function() {
    throw new $TypeError();
  };
  var ThrowTypeError = $gOPD ? function() {
    try {
      arguments.callee;
      return throwTypeError;
    } catch (calleeThrows) {
      try {
        return $gOPD(arguments, "callee").get;
      } catch (gOPDthrows) {
        return throwTypeError;
      }
    }
  }() : throwTypeError;
  var hasSymbols2 = requireHasSymbols()();
  var getProto2 = requireGetProto();
  var $ObjectGPO = requireObject_getPrototypeOf();
  var $ReflectGPO = requireReflect_getPrototypeOf();
  var $apply = requireFunctionApply();
  var $call = requireFunctionCall();
  var needsEval = {};
  var TypedArray = typeof Uint8Array === "undefined" || !getProto2 ? undefined$1 : getProto2(Uint8Array);
  var INTRINSICS = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError === "undefined" ? undefined$1 : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined$1 : ArrayBuffer,
    "%ArrayIteratorPrototype%": hasSymbols2 && getProto2 ? getProto2([][Symbol.iterator]()) : undefined$1,
    "%AsyncFromSyncIteratorPrototype%": undefined$1,
    "%AsyncFunction%": needsEval,
    "%AsyncGenerator%": needsEval,
    "%AsyncGeneratorFunction%": needsEval,
    "%AsyncIteratorPrototype%": needsEval,
    "%Atomics%": typeof Atomics === "undefined" ? undefined$1 : Atomics,
    "%BigInt%": typeof BigInt === "undefined" ? undefined$1 : BigInt,
    "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined$1 : BigInt64Array,
    "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined$1 : BigUint64Array,
    "%Boolean%": Boolean,
    "%DataView%": typeof DataView === "undefined" ? undefined$1 : DataView,
    "%Date%": Date,
    "%decodeURI%": decodeURI,
    "%decodeURIComponent%": decodeURIComponent,
    "%encodeURI%": encodeURI,
    "%encodeURIComponent%": encodeURIComponent,
    "%Error%": $Error,
    "%eval%": eval,
    // eslint-disable-line no-eval
    "%EvalError%": $EvalError,
    "%Float16Array%": typeof Float16Array === "undefined" ? undefined$1 : Float16Array,
    "%Float32Array%": typeof Float32Array === "undefined" ? undefined$1 : Float32Array,
    "%Float64Array%": typeof Float64Array === "undefined" ? undefined$1 : Float64Array,
    "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined$1 : FinalizationRegistry,
    "%Function%": $Function,
    "%GeneratorFunction%": needsEval,
    "%Int8Array%": typeof Int8Array === "undefined" ? undefined$1 : Int8Array,
    "%Int16Array%": typeof Int16Array === "undefined" ? undefined$1 : Int16Array,
    "%Int32Array%": typeof Int32Array === "undefined" ? undefined$1 : Int32Array,
    "%isFinite%": isFinite,
    "%isNaN%": isNaN,
    "%IteratorPrototype%": hasSymbols2 && getProto2 ? getProto2(getProto2([][Symbol.iterator]())) : undefined$1,
    "%JSON%": typeof JSON === "object" ? JSON : undefined$1,
    "%Map%": typeof Map === "undefined" ? undefined$1 : Map,
    "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols2 || !getProto2 ? undefined$1 : getProto2((/* @__PURE__ */ new Map())[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": $Object,
    "%Object.getOwnPropertyDescriptor%": $gOPD,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise === "undefined" ? undefined$1 : Promise,
    "%Proxy%": typeof Proxy === "undefined" ? undefined$1 : Proxy,
    "%RangeError%": $RangeError,
    "%ReferenceError%": $ReferenceError,
    "%Reflect%": typeof Reflect === "undefined" ? undefined$1 : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set === "undefined" ? undefined$1 : Set,
    "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols2 || !getProto2 ? undefined$1 : getProto2((/* @__PURE__ */ new Set())[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined$1 : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": hasSymbols2 && getProto2 ? getProto2(""[Symbol.iterator]()) : undefined$1,
    "%Symbol%": hasSymbols2 ? Symbol : undefined$1,
    "%SyntaxError%": $SyntaxError,
    "%ThrowTypeError%": ThrowTypeError,
    "%TypedArray%": TypedArray,
    "%TypeError%": $TypeError,
    "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined$1 : Uint8Array,
    "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined$1 : Uint8ClampedArray,
    "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined$1 : Uint16Array,
    "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined$1 : Uint32Array,
    "%URIError%": $URIError,
    "%WeakMap%": typeof WeakMap === "undefined" ? undefined$1 : WeakMap,
    "%WeakRef%": typeof WeakRef === "undefined" ? undefined$1 : WeakRef,
    "%WeakSet%": typeof WeakSet === "undefined" ? undefined$1 : WeakSet,
    "%Function.prototype.call%": $call,
    "%Function.prototype.apply%": $apply,
    "%Object.defineProperty%": $defineProperty,
    "%Object.getPrototypeOf%": $ObjectGPO,
    "%Math.abs%": abs2,
    "%Math.floor%": floor2,
    "%Math.max%": max2,
    "%Math.min%": min2,
    "%Math.pow%": pow2,
    "%Math.round%": round2,
    "%Math.sign%": sign2,
    "%Reflect.getPrototypeOf%": $ReflectGPO
  };
  if (getProto2) {
    try {
      null.error;
    } catch (e) {
      var errorProto = getProto2(getProto2(e));
      INTRINSICS["%Error.prototype%"] = errorProto;
    }
  }
  var doEval = function doEval2(name) {
    var value;
    if (name === "%AsyncFunction%") {
      value = getEvalledConstructor("async function () {}");
    } else if (name === "%GeneratorFunction%") {
      value = getEvalledConstructor("function* () {}");
    } else if (name === "%AsyncGeneratorFunction%") {
      value = getEvalledConstructor("async function* () {}");
    } else if (name === "%AsyncGenerator%") {
      var fn = doEval2("%AsyncGeneratorFunction%");
      if (fn) {
        value = fn.prototype;
      }
    } else if (name === "%AsyncIteratorPrototype%") {
      var gen = doEval2("%AsyncGenerator%");
      if (gen && getProto2) {
        value = getProto2(gen.prototype);
      }
    }
    INTRINSICS[name] = value;
    return value;
  };
  var LEGACY_ALIASES = {
    __proto__: null,
    "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
    "%ArrayPrototype%": ["Array", "prototype"],
    "%ArrayProto_entries%": ["Array", "prototype", "entries"],
    "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
    "%ArrayProto_keys%": ["Array", "prototype", "keys"],
    "%ArrayProto_values%": ["Array", "prototype", "values"],
    "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
    "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
    "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
    "%BooleanPrototype%": ["Boolean", "prototype"],
    "%DataViewPrototype%": ["DataView", "prototype"],
    "%DatePrototype%": ["Date", "prototype"],
    "%ErrorPrototype%": ["Error", "prototype"],
    "%EvalErrorPrototype%": ["EvalError", "prototype"],
    "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
    "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
    "%FunctionPrototype%": ["Function", "prototype"],
    "%Generator%": ["GeneratorFunction", "prototype"],
    "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
    "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
    "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
    "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
    "%JSONParse%": ["JSON", "parse"],
    "%JSONStringify%": ["JSON", "stringify"],
    "%MapPrototype%": ["Map", "prototype"],
    "%NumberPrototype%": ["Number", "prototype"],
    "%ObjectPrototype%": ["Object", "prototype"],
    "%ObjProto_toString%": ["Object", "prototype", "toString"],
    "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
    "%PromisePrototype%": ["Promise", "prototype"],
    "%PromiseProto_then%": ["Promise", "prototype", "then"],
    "%Promise_all%": ["Promise", "all"],
    "%Promise_reject%": ["Promise", "reject"],
    "%Promise_resolve%": ["Promise", "resolve"],
    "%RangeErrorPrototype%": ["RangeError", "prototype"],
    "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
    "%RegExpPrototype%": ["RegExp", "prototype"],
    "%SetPrototype%": ["Set", "prototype"],
    "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
    "%StringPrototype%": ["String", "prototype"],
    "%SymbolPrototype%": ["Symbol", "prototype"],
    "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
    "%TypedArrayPrototype%": ["TypedArray", "prototype"],
    "%TypeErrorPrototype%": ["TypeError", "prototype"],
    "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
    "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
    "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
    "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
    "%URIErrorPrototype%": ["URIError", "prototype"],
    "%WeakMapPrototype%": ["WeakMap", "prototype"],
    "%WeakSetPrototype%": ["WeakSet", "prototype"]
  };
  var bind = requireFunctionBind();
  var hasOwn = /* @__PURE__ */ requireHasown();
  var $concat = bind.call($call, Array.prototype.concat);
  var $spliceApply = bind.call($apply, Array.prototype.splice);
  var $replace = bind.call($call, String.prototype.replace);
  var $strSlice = bind.call($call, String.prototype.slice);
  var $exec = bind.call($call, RegExp.prototype.exec);
  var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
  var reEscapeChar = /\\(\\)?/g;
  var stringToPath = function stringToPath2(string) {
    var first = $strSlice(string, 0, 1);
    var last = $strSlice(string, -1);
    if (first === "%" && last !== "%") {
      throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
    } else if (last === "%" && first !== "%") {
      throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
    }
    var result = [];
    $replace(string, rePropName, function(match, number, quote, subString) {
      result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
    });
    return result;
  };
  var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
    var intrinsicName = name;
    var alias;
    if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
      alias = LEGACY_ALIASES[intrinsicName];
      intrinsicName = "%" + alias[0] + "%";
    }
    if (hasOwn(INTRINSICS, intrinsicName)) {
      var value = INTRINSICS[intrinsicName];
      if (value === needsEval) {
        value = doEval(intrinsicName);
      }
      if (typeof value === "undefined" && !allowMissing) {
        throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
      }
      return {
        alias,
        name: intrinsicName,
        value
      };
    }
    throw new $SyntaxError("intrinsic " + name + " does not exist!");
  };
  getIntrinsic = function GetIntrinsic(name, allowMissing) {
    if (typeof name !== "string" || name.length === 0) {
      throw new $TypeError("intrinsic name must be a non-empty string");
    }
    if (arguments.length > 1 && typeof allowMissing !== "boolean") {
      throw new $TypeError('"allowMissing" argument must be a boolean');
    }
    if ($exec(/^%?[^%]*%?$/, name) === null) {
      throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    }
    var parts = stringToPath(name);
    var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
    var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
    var intrinsicRealName = intrinsic.name;
    var value = intrinsic.value;
    var skipFurtherCaching = false;
    var alias = intrinsic.alias;
    if (alias) {
      intrinsicBaseName = alias[0];
      $spliceApply(parts, $concat([0, 1], alias));
    }
    for (var i = 1, isOwn = true; i < parts.length; i += 1) {
      var part = parts[i];
      var first = $strSlice(part, 0, 1);
      var last = $strSlice(part, -1);
      if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
        throw new $SyntaxError("property names with quotes must have matching quotes");
      }
      if (part === "constructor" || !isOwn) {
        skipFurtherCaching = true;
      }
      intrinsicBaseName += "." + part;
      intrinsicRealName = "%" + intrinsicBaseName + "%";
      if (hasOwn(INTRINSICS, intrinsicRealName)) {
        value = INTRINSICS[intrinsicRealName];
      } else if (value != null) {
        if (!(part in value)) {
          if (!allowMissing) {
            throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
          }
          return void undefined$1;
        }
        if ($gOPD && i + 1 >= parts.length) {
          var desc = $gOPD(value, part);
          isOwn = !!desc;
          if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
            value = desc.get;
          } else {
            value = value[part];
          }
        } else {
          isOwn = hasOwn(value, part);
          value = value[part];
        }
        if (isOwn && !skipFurtherCaching) {
          INTRINSICS[intrinsicRealName] = value;
        }
      }
    }
    return value;
  };
  return getIntrinsic;
}
var callBound;
var hasRequiredCallBound;
function requireCallBound() {
  if (hasRequiredCallBound) return callBound;
  hasRequiredCallBound = 1;
  var GetIntrinsic = /* @__PURE__ */ requireGetIntrinsic();
  var callBindBasic = requireCallBindApplyHelpers();
  var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
  callBound = function callBoundIntrinsic(name, allowMissing) {
    var intrinsic = (
      /** @type {(this: unknown, ...args: unknown[]) => unknown} */
      GetIntrinsic(name, !!allowMissing)
    );
    if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
      return callBindBasic(
        /** @type {const} */
        [intrinsic]
      );
    }
    return intrinsic;
  };
  return callBound;
}
var isArguments;
var hasRequiredIsArguments;
function requireIsArguments() {
  if (hasRequiredIsArguments) return isArguments;
  hasRequiredIsArguments = 1;
  var hasToStringTag = requireShams()();
  var callBound2 = /* @__PURE__ */ requireCallBound();
  var $toString = callBound2("Object.prototype.toString");
  var isStandardArguments = function isArguments2(value) {
    if (hasToStringTag && value && typeof value === "object" && Symbol.toStringTag in value) {
      return false;
    }
    return $toString(value) === "[object Arguments]";
  };
  var isLegacyArguments = function isArguments2(value) {
    if (isStandardArguments(value)) {
      return true;
    }
    return value !== null && typeof value === "object" && "length" in value && typeof value.length === "number" && value.length >= 0 && $toString(value) !== "[object Array]" && "callee" in value && $toString(value.callee) === "[object Function]";
  };
  var supportsStandardArguments = function() {
    return isStandardArguments(arguments);
  }();
  isStandardArguments.isLegacyArguments = isLegacyArguments;
  isArguments = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
  return isArguments;
}
var isRegex;
var hasRequiredIsRegex;
function requireIsRegex() {
  if (hasRequiredIsRegex) return isRegex;
  hasRequiredIsRegex = 1;
  var callBound2 = /* @__PURE__ */ requireCallBound();
  var hasToStringTag = requireShams()();
  var hasOwn = /* @__PURE__ */ requireHasown();
  var gOPD2 = /* @__PURE__ */ requireGopd();
  var fn;
  if (hasToStringTag) {
    var $exec = callBound2("RegExp.prototype.exec");
    var isRegexMarker = {};
    var throwRegexMarker = function() {
      throw isRegexMarker;
    };
    var badStringifier = {
      toString: throwRegexMarker,
      valueOf: throwRegexMarker
    };
    if (typeof Symbol.toPrimitive === "symbol") {
      badStringifier[Symbol.toPrimitive] = throwRegexMarker;
    }
    fn = function isRegex2(value) {
      if (!value || typeof value !== "object") {
        return false;
      }
      var descriptor = (
        /** @type {NonNullable<typeof gOPD>} */
        gOPD2(
          /** @type {{ lastIndex?: unknown }} */
          value,
          "lastIndex"
        )
      );
      var hasLastIndexDataProperty = descriptor && hasOwn(descriptor, "value");
      if (!hasLastIndexDataProperty) {
        return false;
      }
      try {
        $exec(
          value,
          /** @type {string} */
          /** @type {unknown} */
          badStringifier
        );
      } catch (e) {
        return e === isRegexMarker;
      }
    };
  } else {
    var $toString = callBound2("Object.prototype.toString");
    var regexClass = "[object RegExp]";
    fn = function isRegex2(value) {
      if (!value || typeof value !== "object" && typeof value !== "function") {
        return false;
      }
      return $toString(value) === regexClass;
    };
  }
  isRegex = fn;
  return isRegex;
}
var safeRegexTest;
var hasRequiredSafeRegexTest;
function requireSafeRegexTest() {
  if (hasRequiredSafeRegexTest) return safeRegexTest;
  hasRequiredSafeRegexTest = 1;
  var callBound2 = /* @__PURE__ */ requireCallBound();
  var isRegex2 = requireIsRegex();
  var $exec = callBound2("RegExp.prototype.exec");
  var $TypeError = /* @__PURE__ */ requireType();
  safeRegexTest = function regexTester(regex) {
    if (!isRegex2(regex)) {
      throw new $TypeError("`regex` must be a RegExp");
    }
    return function test(s) {
      return $exec(regex, s) !== null;
    };
  };
  return safeRegexTest;
}
var isGeneratorFunction;
var hasRequiredIsGeneratorFunction;
function requireIsGeneratorFunction() {
  if (hasRequiredIsGeneratorFunction) return isGeneratorFunction;
  hasRequiredIsGeneratorFunction = 1;
  var callBound2 = /* @__PURE__ */ requireCallBound();
  var safeRegexTest2 = /* @__PURE__ */ requireSafeRegexTest();
  var isFnRegex = safeRegexTest2(/^\s*(?:function)?\*/);
  var hasToStringTag = requireShams()();
  var getProto2 = requireGetProto();
  var toStr = callBound2("Object.prototype.toString");
  var fnToStr = callBound2("Function.prototype.toString");
  var getGeneratorFunc = function() {
    if (!hasToStringTag) {
      return false;
    }
    try {
      return Function("return function*() {}")();
    } catch (e) {
    }
  };
  var GeneratorFunction;
  isGeneratorFunction = function isGeneratorFunction2(fn) {
    if (typeof fn !== "function") {
      return false;
    }
    if (isFnRegex(fnToStr(fn))) {
      return true;
    }
    if (!hasToStringTag) {
      var str = toStr(fn);
      return str === "[object GeneratorFunction]";
    }
    if (!getProto2) {
      return false;
    }
    if (typeof GeneratorFunction === "undefined") {
      var generatorFunc = getGeneratorFunc();
      GeneratorFunction = generatorFunc ? (
        /** @type {GeneratorFunctionConstructor} */
        getProto2(generatorFunc)
      ) : false;
    }
    return getProto2(fn) === GeneratorFunction;
  };
  return isGeneratorFunction;
}
var isCallable;
var hasRequiredIsCallable;
function requireIsCallable() {
  if (hasRequiredIsCallable) return isCallable;
  hasRequiredIsCallable = 1;
  var fnToStr = Function.prototype.toString;
  var reflectApply2 = typeof Reflect === "object" && Reflect !== null && Reflect.apply;
  var badArrayLike;
  var isCallableMarker;
  if (typeof reflectApply2 === "function" && typeof Object.defineProperty === "function") {
    try {
      badArrayLike = Object.defineProperty({}, "length", {
        get: function() {
          throw isCallableMarker;
        }
      });
      isCallableMarker = {};
      reflectApply2(function() {
        throw 42;
      }, null, badArrayLike);
    } catch (_) {
      if (_ !== isCallableMarker) {
        reflectApply2 = null;
      }
    }
  } else {
    reflectApply2 = null;
  }
  var constructorRegex = /^\s*class\b/;
  var isES6ClassFn = function isES6ClassFunction(value) {
    try {
      var fnStr = fnToStr.call(value);
      return constructorRegex.test(fnStr);
    } catch (e) {
      return false;
    }
  };
  var tryFunctionObject = function tryFunctionToStr(value) {
    try {
      if (isES6ClassFn(value)) {
        return false;
      }
      fnToStr.call(value);
      return true;
    } catch (e) {
      return false;
    }
  };
  var toStr = Object.prototype.toString;
  var objectClass = "[object Object]";
  var fnClass = "[object Function]";
  var genClass = "[object GeneratorFunction]";
  var ddaClass = "[object HTMLAllCollection]";
  var ddaClass2 = "[object HTML document.all class]";
  var ddaClass3 = "[object HTMLCollection]";
  var hasToStringTag = typeof Symbol === "function" && !!Symbol.toStringTag;
  var isIE68 = !(0 in [,]);
  var isDDA = function isDocumentDotAll() {
    return false;
  };
  if (typeof document === "object") {
    var all = document.all;
    if (toStr.call(all) === toStr.call(document.all)) {
      isDDA = function isDocumentDotAll(value) {
        if ((isIE68 || !value) && (typeof value === "undefined" || typeof value === "object")) {
          try {
            var str = toStr.call(value);
            return (str === ddaClass || str === ddaClass2 || str === ddaClass3 || str === objectClass) && value("") == null;
          } catch (e) {
          }
        }
        return false;
      };
    }
  }
  isCallable = reflectApply2 ? function isCallable2(value) {
    if (isDDA(value)) {
      return true;
    }
    if (!value) {
      return false;
    }
    if (typeof value !== "function" && typeof value !== "object") {
      return false;
    }
    try {
      reflectApply2(value, null, badArrayLike);
    } catch (e) {
      if (e !== isCallableMarker) {
        return false;
      }
    }
    return !isES6ClassFn(value) && tryFunctionObject(value);
  } : function isCallable2(value) {
    if (isDDA(value)) {
      return true;
    }
    if (!value) {
      return false;
    }
    if (typeof value !== "function" && typeof value !== "object") {
      return false;
    }
    if (hasToStringTag) {
      return tryFunctionObject(value);
    }
    if (isES6ClassFn(value)) {
      return false;
    }
    var strClass = toStr.call(value);
    if (strClass !== fnClass && strClass !== genClass && !/^\[object HTML/.test(strClass)) {
      return false;
    }
    return tryFunctionObject(value);
  };
  return isCallable;
}
var forEach;
var hasRequiredForEach;
function requireForEach() {
  if (hasRequiredForEach) return forEach;
  hasRequiredForEach = 1;
  var isCallable2 = requireIsCallable();
  var toStr = Object.prototype.toString;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var forEachArray = function forEachArray2(array, iterator, receiver) {
    for (var i = 0, len = array.length; i < len; i++) {
      if (hasOwnProperty.call(array, i)) {
        if (receiver == null) {
          iterator(array[i], i, array);
        } else {
          iterator.call(receiver, array[i], i, array);
        }
      }
    }
  };
  var forEachString = function forEachString2(string, iterator, receiver) {
    for (var i = 0, len = string.length; i < len; i++) {
      if (receiver == null) {
        iterator(string.charAt(i), i, string);
      } else {
        iterator.call(receiver, string.charAt(i), i, string);
      }
    }
  };
  var forEachObject = function forEachObject2(object, iterator, receiver) {
    for (var k in object) {
      if (hasOwnProperty.call(object, k)) {
        if (receiver == null) {
          iterator(object[k], k, object);
        } else {
          iterator.call(receiver, object[k], k, object);
        }
      }
    }
  };
  function isArray(x) {
    return toStr.call(x) === "[object Array]";
  }
  forEach = function forEach2(list, iterator, thisArg) {
    if (!isCallable2(iterator)) {
      throw new TypeError("iterator must be a function");
    }
    var receiver;
    if (arguments.length >= 3) {
      receiver = thisArg;
    }
    if (isArray(list)) {
      forEachArray(list, iterator, receiver);
    } else if (typeof list === "string") {
      forEachString(list, iterator, receiver);
    } else {
      forEachObject(list, iterator, receiver);
    }
  };
  return forEach;
}
var possibleTypedArrayNames;
var hasRequiredPossibleTypedArrayNames;
function requirePossibleTypedArrayNames() {
  if (hasRequiredPossibleTypedArrayNames) return possibleTypedArrayNames;
  hasRequiredPossibleTypedArrayNames = 1;
  possibleTypedArrayNames = [
    "Float16Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Uint16Array",
    "Uint32Array",
    "BigInt64Array",
    "BigUint64Array"
  ];
  return possibleTypedArrayNames;
}
var availableTypedArrays;
var hasRequiredAvailableTypedArrays;
function requireAvailableTypedArrays() {
  if (hasRequiredAvailableTypedArrays) return availableTypedArrays;
  hasRequiredAvailableTypedArrays = 1;
  var possibleNames = /* @__PURE__ */ requirePossibleTypedArrayNames();
  var g = typeof globalThis === "undefined" ? commonjsGlobal : globalThis;
  availableTypedArrays = function availableTypedArrays2() {
    var out = [];
    for (var i = 0; i < possibleNames.length; i++) {
      if (typeof g[possibleNames[i]] === "function") {
        out[out.length] = possibleNames[i];
      }
    }
    return out;
  };
  return availableTypedArrays;
}
var callBind = { exports: {} };
var defineDataProperty;
var hasRequiredDefineDataProperty;
function requireDefineDataProperty() {
  if (hasRequiredDefineDataProperty) return defineDataProperty;
  hasRequiredDefineDataProperty = 1;
  var $defineProperty = /* @__PURE__ */ requireEsDefineProperty();
  var $SyntaxError = /* @__PURE__ */ requireSyntax();
  var $TypeError = /* @__PURE__ */ requireType();
  var gopd2 = /* @__PURE__ */ requireGopd();
  defineDataProperty = function defineDataProperty2(obj, property, value) {
    if (!obj || typeof obj !== "object" && typeof obj !== "function") {
      throw new $TypeError("`obj` must be an object or a function`");
    }
    if (typeof property !== "string" && typeof property !== "symbol") {
      throw new $TypeError("`property` must be a string or a symbol`");
    }
    if (arguments.length > 3 && typeof arguments[3] !== "boolean" && arguments[3] !== null) {
      throw new $TypeError("`nonEnumerable`, if provided, must be a boolean or null");
    }
    if (arguments.length > 4 && typeof arguments[4] !== "boolean" && arguments[4] !== null) {
      throw new $TypeError("`nonWritable`, if provided, must be a boolean or null");
    }
    if (arguments.length > 5 && typeof arguments[5] !== "boolean" && arguments[5] !== null) {
      throw new $TypeError("`nonConfigurable`, if provided, must be a boolean or null");
    }
    if (arguments.length > 6 && typeof arguments[6] !== "boolean") {
      throw new $TypeError("`loose`, if provided, must be a boolean");
    }
    var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
    var nonWritable = arguments.length > 4 ? arguments[4] : null;
    var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
    var loose = arguments.length > 6 ? arguments[6] : false;
    var desc = !!gopd2 && gopd2(obj, property);
    if ($defineProperty) {
      $defineProperty(obj, property, {
        configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
        enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
        value,
        writable: nonWritable === null && desc ? desc.writable : !nonWritable
      });
    } else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) {
      obj[property] = value;
    } else {
      throw new $SyntaxError("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
    }
  };
  return defineDataProperty;
}
var hasPropertyDescriptors_1;
var hasRequiredHasPropertyDescriptors;
function requireHasPropertyDescriptors() {
  if (hasRequiredHasPropertyDescriptors) return hasPropertyDescriptors_1;
  hasRequiredHasPropertyDescriptors = 1;
  var $defineProperty = /* @__PURE__ */ requireEsDefineProperty();
  var hasPropertyDescriptors = function hasPropertyDescriptors2() {
    return !!$defineProperty;
  };
  hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
    if (!$defineProperty) {
      return null;
    }
    try {
      return $defineProperty([], "length", { value: 1 }).length !== 1;
    } catch (e) {
      return true;
    }
  };
  hasPropertyDescriptors_1 = hasPropertyDescriptors;
  return hasPropertyDescriptors_1;
}
var setFunctionLength;
var hasRequiredSetFunctionLength;
function requireSetFunctionLength() {
  if (hasRequiredSetFunctionLength) return setFunctionLength;
  hasRequiredSetFunctionLength = 1;
  var GetIntrinsic = /* @__PURE__ */ requireGetIntrinsic();
  var define = /* @__PURE__ */ requireDefineDataProperty();
  var hasDescriptors = /* @__PURE__ */ requireHasPropertyDescriptors()();
  var gOPD2 = /* @__PURE__ */ requireGopd();
  var $TypeError = /* @__PURE__ */ requireType();
  var $floor = GetIntrinsic("%Math.floor%");
  setFunctionLength = function setFunctionLength2(fn, length) {
    if (typeof fn !== "function") {
      throw new $TypeError("`fn` is not a function");
    }
    if (typeof length !== "number" || length < 0 || length > 4294967295 || $floor(length) !== length) {
      throw new $TypeError("`length` must be a positive 32-bit integer");
    }
    var loose = arguments.length > 2 && !!arguments[2];
    var functionLengthIsConfigurable = true;
    var functionLengthIsWritable = true;
    if ("length" in fn && gOPD2) {
      var desc = gOPD2(fn, "length");
      if (desc && !desc.configurable) {
        functionLengthIsConfigurable = false;
      }
      if (desc && !desc.writable) {
        functionLengthIsWritable = false;
      }
    }
    if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
      if (hasDescriptors) {
        define(
          /** @type {Parameters<define>[0]} */
          fn,
          "length",
          length,
          true,
          true
        );
      } else {
        define(
          /** @type {Parameters<define>[0]} */
          fn,
          "length",
          length
        );
      }
    }
    return fn;
  };
  return setFunctionLength;
}
var applyBind;
var hasRequiredApplyBind;
function requireApplyBind() {
  if (hasRequiredApplyBind) return applyBind;
  hasRequiredApplyBind = 1;
  var bind = requireFunctionBind();
  var $apply = requireFunctionApply();
  var actualApply2 = requireActualApply();
  applyBind = function applyBind2() {
    return actualApply2(bind, $apply, arguments);
  };
  return applyBind;
}
var hasRequiredCallBind;
function requireCallBind() {
  if (hasRequiredCallBind) return callBind.exports;
  hasRequiredCallBind = 1;
  (function(module) {
    var setFunctionLength2 = /* @__PURE__ */ requireSetFunctionLength();
    var $defineProperty = /* @__PURE__ */ requireEsDefineProperty();
    var callBindBasic = requireCallBindApplyHelpers();
    var applyBind2 = requireApplyBind();
    module.exports = function callBind2(originalFunction) {
      var func = callBindBasic(arguments);
      var adjustedLength = originalFunction.length - (arguments.length - 1);
      return setFunctionLength2(
        func,
        1 + (adjustedLength > 0 ? adjustedLength : 0),
        true
      );
    };
    if ($defineProperty) {
      $defineProperty(module.exports, "apply", { value: applyBind2 });
    } else {
      module.exports.apply = applyBind2;
    }
  })(callBind);
  return callBind.exports;
}
var whichTypedArray;
var hasRequiredWhichTypedArray;
function requireWhichTypedArray() {
  if (hasRequiredWhichTypedArray) return whichTypedArray;
  hasRequiredWhichTypedArray = 1;
  var forEach2 = requireForEach();
  var availableTypedArrays2 = /* @__PURE__ */ requireAvailableTypedArrays();
  var callBind2 = requireCallBind();
  var callBound2 = /* @__PURE__ */ requireCallBound();
  var gOPD2 = /* @__PURE__ */ requireGopd();
  var getProto2 = requireGetProto();
  var $toString = callBound2("Object.prototype.toString");
  var hasToStringTag = requireShams()();
  var g = typeof globalThis === "undefined" ? commonjsGlobal : globalThis;
  var typedArrays = availableTypedArrays2();
  var $slice = callBound2("String.prototype.slice");
  var $indexOf = callBound2("Array.prototype.indexOf", true) || function indexOf(array, value) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i] === value) {
        return i;
      }
    }
    return -1;
  };
  var cache = { __proto__: null };
  if (hasToStringTag && gOPD2 && getProto2) {
    forEach2(typedArrays, function(typedArray) {
      var arr = new g[typedArray]();
      if (Symbol.toStringTag in arr && getProto2) {
        var proto = getProto2(arr);
        var descriptor = gOPD2(proto, Symbol.toStringTag);
        if (!descriptor && proto) {
          var superProto = getProto2(proto);
          descriptor = gOPD2(superProto, Symbol.toStringTag);
        }
        cache["$" + typedArray] = callBind2(descriptor.get);
      }
    });
  } else {
    forEach2(typedArrays, function(typedArray) {
      var arr = new g[typedArray]();
      var fn = arr.slice || arr.set;
      if (fn) {
        cache[
          /** @type {`$${import('.').TypedArrayName}`} */
          "$" + typedArray
        ] = /** @type {import('./types').BoundSlice | import('./types').BoundSet} */
        // @ts-expect-error TODO FIXME
        callBind2(fn);
      }
    });
  }
  var tryTypedArrays = function tryAllTypedArrays(value) {
    var found = false;
    forEach2(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      cache,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(getter, typedArray) {
        if (!found) {
          try {
            if ("$" + getter(value) === typedArray) {
              found = /** @type {import('.').TypedArrayName} */
              $slice(typedArray, 1);
            }
          } catch (e) {
          }
        }
      }
    );
    return found;
  };
  var trySlices = function tryAllSlices(value) {
    var found = false;
    forEach2(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      cache,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(getter, name) {
        if (!found) {
          try {
            getter(value);
            found = /** @type {import('.').TypedArrayName} */
            $slice(name, 1);
          } catch (e) {
          }
        }
      }
    );
    return found;
  };
  whichTypedArray = function whichTypedArray2(value) {
    if (!value || typeof value !== "object") {
      return false;
    }
    if (!hasToStringTag) {
      var tag = $slice($toString(value), 8, -1);
      if ($indexOf(typedArrays, tag) > -1) {
        return tag;
      }
      if (tag !== "Object") {
        return false;
      }
      return trySlices(value);
    }
    if (!gOPD2) {
      return null;
    }
    return tryTypedArrays(value);
  };
  return whichTypedArray;
}
var isTypedArray;
var hasRequiredIsTypedArray;
function requireIsTypedArray() {
  if (hasRequiredIsTypedArray) return isTypedArray;
  hasRequiredIsTypedArray = 1;
  var whichTypedArray2 = /* @__PURE__ */ requireWhichTypedArray();
  isTypedArray = function isTypedArray2(value) {
    return !!whichTypedArray2(value);
  };
  return isTypedArray;
}
var hasRequiredTypes$1;
function requireTypes$1() {
  if (hasRequiredTypes$1) return types;
  hasRequiredTypes$1 = 1;
  (function(exports) {
    var isArgumentsObject = /* @__PURE__ */ requireIsArguments();
    var isGeneratorFunction2 = requireIsGeneratorFunction();
    var whichTypedArray2 = /* @__PURE__ */ requireWhichTypedArray();
    var isTypedArray2 = /* @__PURE__ */ requireIsTypedArray();
    function uncurryThis(f) {
      return f.call.bind(f);
    }
    var BigIntSupported = typeof BigInt !== "undefined";
    var SymbolSupported = typeof Symbol !== "undefined";
    var ObjectToString = uncurryThis(Object.prototype.toString);
    var numberValue = uncurryThis(Number.prototype.valueOf);
    var stringValue = uncurryThis(String.prototype.valueOf);
    var booleanValue = uncurryThis(Boolean.prototype.valueOf);
    if (BigIntSupported) {
      var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
    }
    if (SymbolSupported) {
      var symbolValue = uncurryThis(Symbol.prototype.valueOf);
    }
    function checkBoxedPrimitive(value, prototypeValueOf) {
      if (typeof value !== "object") {
        return false;
      }
      try {
        prototypeValueOf(value);
        return true;
      } catch (e) {
        return false;
      }
    }
    exports.isArgumentsObject = isArgumentsObject;
    exports.isGeneratorFunction = isGeneratorFunction2;
    exports.isTypedArray = isTypedArray2;
    function isPromise(input) {
      return typeof Promise !== "undefined" && input instanceof Promise || input !== null && typeof input === "object" && typeof input.then === "function" && typeof input.catch === "function";
    }
    exports.isPromise = isPromise;
    function isArrayBufferView(value) {
      if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        return ArrayBuffer.isView(value);
      }
      return isTypedArray2(value) || isDataView(value);
    }
    exports.isArrayBufferView = isArrayBufferView;
    function isUint8Array(value) {
      return whichTypedArray2(value) === "Uint8Array";
    }
    exports.isUint8Array = isUint8Array;
    function isUint8ClampedArray(value) {
      return whichTypedArray2(value) === "Uint8ClampedArray";
    }
    exports.isUint8ClampedArray = isUint8ClampedArray;
    function isUint16Array(value) {
      return whichTypedArray2(value) === "Uint16Array";
    }
    exports.isUint16Array = isUint16Array;
    function isUint32Array(value) {
      return whichTypedArray2(value) === "Uint32Array";
    }
    exports.isUint32Array = isUint32Array;
    function isInt8Array(value) {
      return whichTypedArray2(value) === "Int8Array";
    }
    exports.isInt8Array = isInt8Array;
    function isInt16Array(value) {
      return whichTypedArray2(value) === "Int16Array";
    }
    exports.isInt16Array = isInt16Array;
    function isInt32Array(value) {
      return whichTypedArray2(value) === "Int32Array";
    }
    exports.isInt32Array = isInt32Array;
    function isFloat32Array(value) {
      return whichTypedArray2(value) === "Float32Array";
    }
    exports.isFloat32Array = isFloat32Array;
    function isFloat64Array(value) {
      return whichTypedArray2(value) === "Float64Array";
    }
    exports.isFloat64Array = isFloat64Array;
    function isBigInt64Array(value) {
      return whichTypedArray2(value) === "BigInt64Array";
    }
    exports.isBigInt64Array = isBigInt64Array;
    function isBigUint64Array(value) {
      return whichTypedArray2(value) === "BigUint64Array";
    }
    exports.isBigUint64Array = isBigUint64Array;
    function isMapToString(value) {
      return ObjectToString(value) === "[object Map]";
    }
    isMapToString.working = typeof Map !== "undefined" && isMapToString(/* @__PURE__ */ new Map());
    function isMap(value) {
      if (typeof Map === "undefined") {
        return false;
      }
      return isMapToString.working ? isMapToString(value) : value instanceof Map;
    }
    exports.isMap = isMap;
    function isSetToString(value) {
      return ObjectToString(value) === "[object Set]";
    }
    isSetToString.working = typeof Set !== "undefined" && isSetToString(/* @__PURE__ */ new Set());
    function isSet(value) {
      if (typeof Set === "undefined") {
        return false;
      }
      return isSetToString.working ? isSetToString(value) : value instanceof Set;
    }
    exports.isSet = isSet;
    function isWeakMapToString(value) {
      return ObjectToString(value) === "[object WeakMap]";
    }
    isWeakMapToString.working = typeof WeakMap !== "undefined" && isWeakMapToString(/* @__PURE__ */ new WeakMap());
    function isWeakMap(value) {
      if (typeof WeakMap === "undefined") {
        return false;
      }
      return isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap;
    }
    exports.isWeakMap = isWeakMap;
    function isWeakSetToString(value) {
      return ObjectToString(value) === "[object WeakSet]";
    }
    isWeakSetToString.working = typeof WeakSet !== "undefined" && isWeakSetToString(/* @__PURE__ */ new WeakSet());
    function isWeakSet(value) {
      return isWeakSetToString(value);
    }
    exports.isWeakSet = isWeakSet;
    function isArrayBufferToString(value) {
      return ObjectToString(value) === "[object ArrayBuffer]";
    }
    isArrayBufferToString.working = typeof ArrayBuffer !== "undefined" && isArrayBufferToString(new ArrayBuffer());
    function isArrayBuffer(value) {
      if (typeof ArrayBuffer === "undefined") {
        return false;
      }
      return isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer;
    }
    exports.isArrayBuffer = isArrayBuffer;
    function isDataViewToString(value) {
      return ObjectToString(value) === "[object DataView]";
    }
    isDataViewToString.working = typeof ArrayBuffer !== "undefined" && typeof DataView !== "undefined" && isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));
    function isDataView(value) {
      if (typeof DataView === "undefined") {
        return false;
      }
      return isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView;
    }
    exports.isDataView = isDataView;
    var SharedArrayBufferCopy = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : void 0;
    function isSharedArrayBufferToString(value) {
      return ObjectToString(value) === "[object SharedArrayBuffer]";
    }
    function isSharedArrayBuffer(value) {
      if (typeof SharedArrayBufferCopy === "undefined") {
        return false;
      }
      if (typeof isSharedArrayBufferToString.working === "undefined") {
        isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
      }
      return isSharedArrayBufferToString.working ? isSharedArrayBufferToString(value) : value instanceof SharedArrayBufferCopy;
    }
    exports.isSharedArrayBuffer = isSharedArrayBuffer;
    function isAsyncFunction(value) {
      return ObjectToString(value) === "[object AsyncFunction]";
    }
    exports.isAsyncFunction = isAsyncFunction;
    function isMapIterator(value) {
      return ObjectToString(value) === "[object Map Iterator]";
    }
    exports.isMapIterator = isMapIterator;
    function isSetIterator(value) {
      return ObjectToString(value) === "[object Set Iterator]";
    }
    exports.isSetIterator = isSetIterator;
    function isGeneratorObject(value) {
      return ObjectToString(value) === "[object Generator]";
    }
    exports.isGeneratorObject = isGeneratorObject;
    function isWebAssemblyCompiledModule(value) {
      return ObjectToString(value) === "[object WebAssembly.Module]";
    }
    exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;
    function isNumberObject(value) {
      return checkBoxedPrimitive(value, numberValue);
    }
    exports.isNumberObject = isNumberObject;
    function isStringObject(value) {
      return checkBoxedPrimitive(value, stringValue);
    }
    exports.isStringObject = isStringObject;
    function isBooleanObject(value) {
      return checkBoxedPrimitive(value, booleanValue);
    }
    exports.isBooleanObject = isBooleanObject;
    function isBigIntObject(value) {
      return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
    }
    exports.isBigIntObject = isBigIntObject;
    function isSymbolObject(value) {
      return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
    }
    exports.isSymbolObject = isSymbolObject;
    function isBoxedPrimitive(value) {
      return isNumberObject(value) || isStringObject(value) || isBooleanObject(value) || isBigIntObject(value) || isSymbolObject(value);
    }
    exports.isBoxedPrimitive = isBoxedPrimitive;
    function isAnyArrayBuffer(value) {
      return typeof Uint8Array !== "undefined" && (isArrayBuffer(value) || isSharedArrayBuffer(value));
    }
    exports.isAnyArrayBuffer = isAnyArrayBuffer;
    ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(method) {
      Object.defineProperty(exports, method, {
        enumerable: false,
        value: function() {
          throw new Error(method + " is not supported in userland");
        }
      });
    });
  })(types);
  return types;
}
var isBufferBrowser;
var hasRequiredIsBufferBrowser;
function requireIsBufferBrowser() {
  if (hasRequiredIsBufferBrowser) return isBufferBrowser;
  hasRequiredIsBufferBrowser = 1;
  isBufferBrowser = function isBuffer(arg) {
    return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
  };
  return isBufferBrowser;
}
var inherits_browser = { exports: {} };
var hasRequiredInherits_browser;
function requireInherits_browser() {
  if (hasRequiredInherits_browser) return inherits_browser.exports;
  hasRequiredInherits_browser = 1;
  if (typeof Object.create === "function") {
    inherits_browser.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    };
  } else {
    inherits_browser.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {
        };
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
    };
  }
  return inherits_browser.exports;
}
var hasRequiredUtil$1;
function requireUtil$1() {
  if (hasRequiredUtil$1) return util;
  hasRequiredUtil$1 = 1;
  (function(exports) {
    var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors2(obj) {
      var keys = Object.keys(obj);
      var descriptors = {};
      for (var i = 0; i < keys.length; i++) {
        descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
      }
      return descriptors;
    };
    var formatRegExp = /%[sdj%]/g;
    exports.format = function(f) {
      if (!isString(f)) {
        var objects = [];
        for (var i = 0; i < arguments.length; i++) {
          objects.push(inspect(arguments[i]));
        }
        return objects.join(" ");
      }
      var i = 1;
      var args = arguments;
      var len = args.length;
      var str = String(f).replace(formatRegExp, function(x2) {
        if (x2 === "%%") return "%";
        if (i >= len) return x2;
        switch (x2) {
          case "%s":
            return String(args[i++]);
          case "%d":
            return Number(args[i++]);
          case "%j":
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return "[Circular]";
            }
          default:
            return x2;
        }
      });
      for (var x = args[i]; i < len; x = args[++i]) {
        if (isNull(x) || !isObject(x)) {
          str += " " + x;
        } else {
          str += " " + inspect(x);
        }
      }
      return str;
    };
    exports.deprecate = function(fn, msg) {
      if (typeof process$1 !== "undefined" && process$1.noDeprecation === true) {
        return fn;
      }
      if (typeof process$1 === "undefined") {
        return function() {
          return exports.deprecate(fn, msg).apply(this, arguments);
        };
      }
      var warned = false;
      function deprecated() {
        if (!warned) {
          if (process$1.throwDeprecation) {
            throw new Error(msg);
          } else if (process$1.traceDeprecation) {
            console.trace(msg);
          } else {
            console.error(msg);
          }
          warned = true;
        }
        return fn.apply(this, arguments);
      }
      return deprecated;
    };
    var debugs = {};
    var debugEnvRegex = /^$/;
    if (process$1.env.NODE_DEBUG) {
      var debugEnv = process$1.env.NODE_DEBUG;
      debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase();
      debugEnvRegex = new RegExp("^" + debugEnv + "$", "i");
    }
    exports.debuglog = function(set) {
      set = set.toUpperCase();
      if (!debugs[set]) {
        if (debugEnvRegex.test(set)) {
          var pid = process$1.pid;
          debugs[set] = function() {
            var msg = exports.format.apply(exports, arguments);
            console.error("%s %d: %s", set, pid, msg);
          };
        } else {
          debugs[set] = function() {
          };
        }
      }
      return debugs[set];
    };
    function inspect(obj, opts) {
      var ctx = {
        seen: [],
        stylize: stylizeNoColor
      };
      if (arguments.length >= 3) ctx.depth = arguments[2];
      if (arguments.length >= 4) ctx.colors = arguments[3];
      if (isBoolean(opts)) {
        ctx.showHidden = opts;
      } else if (opts) {
        exports._extend(ctx, opts);
      }
      if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
      if (isUndefined(ctx.depth)) ctx.depth = 2;
      if (isUndefined(ctx.colors)) ctx.colors = false;
      if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
      if (ctx.colors) ctx.stylize = stylizeWithColor;
      return formatValue(ctx, obj, ctx.depth);
    }
    exports.inspect = inspect;
    inspect.colors = {
      "bold": [1, 22],
      "italic": [3, 23],
      "underline": [4, 24],
      "inverse": [7, 27],
      "white": [37, 39],
      "grey": [90, 39],
      "black": [30, 39],
      "blue": [34, 39],
      "cyan": [36, 39],
      "green": [32, 39],
      "magenta": [35, 39],
      "red": [31, 39],
      "yellow": [33, 39]
    };
    inspect.styles = {
      "special": "cyan",
      "number": "yellow",
      "boolean": "yellow",
      "undefined": "grey",
      "null": "bold",
      "string": "green",
      "date": "magenta",
      // "name": intentionally not styling
      "regexp": "red"
    };
    function stylizeWithColor(str, styleType) {
      var style = inspect.styles[styleType];
      if (style) {
        return "\x1B[" + inspect.colors[style][0] + "m" + str + "\x1B[" + inspect.colors[style][1] + "m";
      } else {
        return str;
      }
    }
    function stylizeNoColor(str, styleType) {
      return str;
    }
    function arrayToHash(array) {
      var hash = {};
      array.forEach(function(val, idx) {
        hash[val] = true;
      });
      return hash;
    }
    function formatValue(ctx, value, recurseTimes) {
      if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
        var ret = value.inspect(recurseTimes, ctx);
        if (!isString(ret)) {
          ret = formatValue(ctx, ret, recurseTimes);
        }
        return ret;
      }
      var primitive = formatPrimitive(ctx, value);
      if (primitive) {
        return primitive;
      }
      var keys = Object.keys(value);
      var visibleKeys = arrayToHash(keys);
      if (ctx.showHidden) {
        keys = Object.getOwnPropertyNames(value);
      }
      if (isError2(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
        return formatError(value);
      }
      if (keys.length === 0) {
        if (isFunction(value)) {
          var name = value.name ? ": " + value.name : "";
          return ctx.stylize("[Function" + name + "]", "special");
        }
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
        }
        if (isDate(value)) {
          return ctx.stylize(Date.prototype.toString.call(value), "date");
        }
        if (isError2(value)) {
          return formatError(value);
        }
      }
      var base = "", array = false, braces = ["{", "}"];
      if (isArray(value)) {
        array = true;
        braces = ["[", "]"];
      }
      if (isFunction(value)) {
        var n = value.name ? ": " + value.name : "";
        base = " [Function" + n + "]";
      }
      if (isRegExp(value)) {
        base = " " + RegExp.prototype.toString.call(value);
      }
      if (isDate(value)) {
        base = " " + Date.prototype.toUTCString.call(value);
      }
      if (isError2(value)) {
        base = " " + formatError(value);
      }
      if (keys.length === 0 && (!array || value.length == 0)) {
        return braces[0] + base + braces[1];
      }
      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
        } else {
          return ctx.stylize("[Object]", "special");
        }
      }
      ctx.seen.push(value);
      var output;
      if (array) {
        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
      } else {
        output = keys.map(function(key) {
          return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
        });
      }
      ctx.seen.pop();
      return reduceToSingleString(output, base, braces);
    }
    function formatPrimitive(ctx, value) {
      if (isUndefined(value))
        return ctx.stylize("undefined", "undefined");
      if (isString(value)) {
        var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
        return ctx.stylize(simple, "string");
      }
      if (isNumber(value))
        return ctx.stylize("" + value, "number");
      if (isBoolean(value))
        return ctx.stylize("" + value, "boolean");
      if (isNull(value))
        return ctx.stylize("null", "null");
    }
    function formatError(value) {
      return "[" + Error.prototype.toString.call(value) + "]";
    }
    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
      var output = [];
      for (var i = 0, l = value.length; i < l; ++i) {
        if (hasOwnProperty(value, String(i))) {
          output.push(formatProperty(
            ctx,
            value,
            recurseTimes,
            visibleKeys,
            String(i),
            true
          ));
        } else {
          output.push("");
        }
      }
      keys.forEach(function(key) {
        if (!key.match(/^\d+$/)) {
          output.push(formatProperty(
            ctx,
            value,
            recurseTimes,
            visibleKeys,
            key,
            true
          ));
        }
      });
      return output;
    }
    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
      var name, str, desc;
      desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
      if (desc.get) {
        if (desc.set) {
          str = ctx.stylize("[Getter/Setter]", "special");
        } else {
          str = ctx.stylize("[Getter]", "special");
        }
      } else {
        if (desc.set) {
          str = ctx.stylize("[Setter]", "special");
        }
      }
      if (!hasOwnProperty(visibleKeys, key)) {
        name = "[" + key + "]";
      }
      if (!str) {
        if (ctx.seen.indexOf(desc.value) < 0) {
          if (isNull(recurseTimes)) {
            str = formatValue(ctx, desc.value, null);
          } else {
            str = formatValue(ctx, desc.value, recurseTimes - 1);
          }
          if (str.indexOf("\n") > -1) {
            if (array) {
              str = str.split("\n").map(function(line) {
                return "  " + line;
              }).join("\n").slice(2);
            } else {
              str = "\n" + str.split("\n").map(function(line) {
                return "   " + line;
              }).join("\n");
            }
          }
        } else {
          str = ctx.stylize("[Circular]", "special");
        }
      }
      if (isUndefined(name)) {
        if (array && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify("" + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.slice(1, -1);
          name = ctx.stylize(name, "name");
        } else {
          name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
          name = ctx.stylize(name, "string");
        }
      }
      return name + ": " + str;
    }
    function reduceToSingleString(output, base, braces) {
      var length = output.reduce(function(prev, cur) {
        if (cur.indexOf("\n") >= 0) ;
        return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
      }, 0);
      if (length > 60) {
        return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
      }
      return braces[0] + base + " " + output.join(", ") + " " + braces[1];
    }
    exports.types = requireTypes$1();
    function isArray(ar) {
      return Array.isArray(ar);
    }
    exports.isArray = isArray;
    function isBoolean(arg) {
      return typeof arg === "boolean";
    }
    exports.isBoolean = isBoolean;
    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    function isNumber(arg) {
      return typeof arg === "number";
    }
    exports.isNumber = isNumber;
    function isString(arg) {
      return typeof arg === "string";
    }
    exports.isString = isString;
    function isSymbol(arg) {
      return typeof arg === "symbol";
    }
    exports.isSymbol = isSymbol;
    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;
    function isRegExp(re) {
      return isObject(re) && objectToString(re) === "[object RegExp]";
    }
    exports.isRegExp = isRegExp;
    exports.types.isRegExp = isRegExp;
    function isObject(arg) {
      return typeof arg === "object" && arg !== null;
    }
    exports.isObject = isObject;
    function isDate(d) {
      return isObject(d) && objectToString(d) === "[object Date]";
    }
    exports.isDate = isDate;
    exports.types.isDate = isDate;
    function isError2(e) {
      return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
    }
    exports.isError = isError2;
    exports.types.isNativeError = isError2;
    function isFunction(arg) {
      return typeof arg === "function";
    }
    exports.isFunction = isFunction;
    function isPrimitive(arg) {
      return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
      typeof arg === "undefined";
    }
    exports.isPrimitive = isPrimitive;
    exports.isBuffer = requireIsBufferBrowser();
    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }
    function pad(n) {
      return n < 10 ? "0" + n.toString(10) : n.toString(10);
    }
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    function timestamp() {
      var d = /* @__PURE__ */ new Date();
      var time = [
        pad(d.getHours()),
        pad(d.getMinutes()),
        pad(d.getSeconds())
      ].join(":");
      return [d.getDate(), months[d.getMonth()], time].join(" ");
    }
    exports.log = function() {
      console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments));
    };
    exports.inherits = requireInherits_browser();
    exports._extend = function(origin, add) {
      if (!add || !isObject(add)) return origin;
      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    };
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    var kCustomPromisifiedSymbol = typeof Symbol !== "undefined" ? Symbol("util.promisify.custom") : void 0;
    exports.promisify = function promisify(original) {
      if (typeof original !== "function")
        throw new TypeError('The "original" argument must be of type Function');
      if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
        var fn = original[kCustomPromisifiedSymbol];
        if (typeof fn !== "function") {
          throw new TypeError('The "util.promisify.custom" argument must be of type Function');
        }
        Object.defineProperty(fn, kCustomPromisifiedSymbol, {
          value: fn,
          enumerable: false,
          writable: false,
          configurable: true
        });
        return fn;
      }
      function fn() {
        var promiseResolve, promiseReject;
        var promise = new Promise(function(resolve, reject) {
          promiseResolve = resolve;
          promiseReject = reject;
        });
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        args.push(function(err, value) {
          if (err) {
            promiseReject(err);
          } else {
            promiseResolve(value);
          }
        });
        try {
          original.apply(this, args);
        } catch (err) {
          promiseReject(err);
        }
        return promise;
      }
      Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
      if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
        value: fn,
        enumerable: false,
        writable: false,
        configurable: true
      });
      return Object.defineProperties(
        fn,
        getOwnPropertyDescriptors(original)
      );
    };
    exports.promisify.custom = kCustomPromisifiedSymbol;
    function callbackifyOnRejected(reason, cb) {
      if (!reason) {
        var newReason = new Error("Promise was rejected with a falsy value");
        newReason.reason = reason;
        reason = newReason;
      }
      return cb(reason);
    }
    function callbackify(original) {
      if (typeof original !== "function") {
        throw new TypeError('The "original" argument must be of type Function');
      }
      function callbackified() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        var maybeCb = args.pop();
        if (typeof maybeCb !== "function") {
          throw new TypeError("The last argument must be of type Function");
        }
        var self2 = this;
        var cb = function() {
          return maybeCb.apply(self2, arguments);
        };
        original.apply(this, args).then(
          function(ret) {
            process$1.nextTick(cb.bind(null, null, ret));
          },
          function(rej) {
            process$1.nextTick(callbackifyOnRejected.bind(null, rej, cb));
          }
        );
      }
      Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
      Object.defineProperties(
        callbackified,
        getOwnPropertyDescriptors(original)
      );
      return callbackified;
    }
    exports.callbackify = callbackify;
  })(util);
  return util;
}
var errors;
var hasRequiredErrors;
function requireErrors() {
  if (hasRequiredErrors) return errors;
  hasRequiredErrors = 1;
  var util2 = requireUtil$1();
  function ProtocolError(message) {
    Error.captureStackTrace(this, ProtocolError);
    this.message = message;
    this.name = "ProtocolError";
  }
  util2.inherits(ProtocolError, Error);
  function TypeError2(message) {
    Error.captureStackTrace(this, TypeError2);
    this.message = message;
    this.name = "TypeError";
  }
  util2.inherits(TypeError2, ProtocolError);
  function ConnectionError(message, condition, connection2) {
    Error.captureStackTrace(this, ConnectionError);
    this.message = message;
    this.name = "ConnectionError";
    this.condition = condition;
    this.description = message;
    Object.defineProperty(this, "connection", { value: connection2 });
  }
  util2.inherits(ConnectionError, Error);
  ConnectionError.prototype.toJSON = function() {
    return {
      type: this.name,
      code: this.condition,
      message: this.description
    };
  };
  errors = {
    ProtocolError,
    TypeError: TypeError2,
    ConnectionError
  };
  return errors;
}
var util_1;
var hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util_1;
  hasRequiredUtil = 1;
  var errors2 = requireErrors();
  var util2 = {};
  util2.allocate_buffer = function(size) {
    return Buffer.alloc ? Buffer.alloc(size) : new Buffer(size);
  };
  util2.generate_uuid = function() {
    return util2.uuid_to_string(util2.uuid4());
  };
  util2.uuid4 = function() {
    var bytes = util2.allocate_buffer(16);
    for (var i = 0; i < bytes.length; i++) {
      bytes[i] = Math.random() * 255 | 0;
    }
    bytes[7] &= 15;
    bytes[7] |= 64;
    bytes[8] &= 63;
    bytes[8] |= 128;
    return bytes;
  };
  util2.uuid_to_string = function(buffer2) {
    if (buffer2.length === 16) {
      var chunks = [buffer2.slice(0, 4), buffer2.slice(4, 6), buffer2.slice(6, 8), buffer2.slice(8, 10), buffer2.slice(10, 16)];
      return chunks.map(function(b) {
        return b.toString("hex");
      }).join("-");
    } else {
      throw new errors2.TypeError("Not a UUID, expecting 16 byte buffer");
    }
  };
  var parse_uuid = /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/;
  util2.string_to_uuid = function(uuid_string) {
    var parts = parse_uuid.exec(uuid_string.toLowerCase());
    if (parts) {
      return Buffer.from(parts.slice(1).join(""), "hex");
    } else {
      throw new errors2.TypeError("Not a valid UUID string: " + uuid_string);
    }
  };
  util2.clone = function(o) {
    var copy = Object.create(o.prototype || {});
    var names = Object.getOwnPropertyNames(o);
    for (var i = 0; i < names.length; i++) {
      var key = names[i];
      copy[key] = o[key];
    }
    return copy;
  };
  util2.and = function(f, g) {
    if (g === void 0) return f;
    return function(o) {
      return f(o) && g(o);
    };
  };
  util2.is_sender = function(o) {
    return o.is_sender();
  };
  util2.is_receiver = function(o) {
    return o.is_receiver();
  };
  util2.sender_filter = function(filter2) {
    return util2.and(util2.is_sender, filter2);
  };
  util2.receiver_filter = function(filter2) {
    return util2.and(util2.is_receiver, filter2);
  };
  util2.is_defined = function(field) {
    return field !== void 0 && field !== null;
  };
  util_1 = util2;
  return util_1;
}
var types_1;
var hasRequiredTypes;
function requireTypes() {
  if (hasRequiredTypes) return types_1;
  hasRequiredTypes = 1;
  var errors2 = requireErrors();
  var util2 = requireUtil();
  var CAT_FIXED = 1;
  var CAT_VARIABLE = 2;
  var CAT_COMPOUND = 3;
  var CAT_ARRAY = 4;
  function Typed(type2, value, code2, descriptor) {
    this.type = type2;
    this.value = value;
    if (code2) {
      this.array_constructor = { "typecode": code2 };
      if (descriptor) {
        this.array_constructor.descriptor = descriptor;
      }
    }
  }
  Typed.prototype.toString = function() {
    return this.value ? this.value.toString() : null;
  };
  Typed.prototype.toLocaleString = function() {
    return this.value ? this.value.toLocaleString() : null;
  };
  Typed.prototype.valueOf = function() {
    return this.value;
  };
  Typed.prototype.toJSON = function() {
    return this.value && this.value.toJSON ? this.value.toJSON() : this.value;
  };
  Typed.prototype.toRheaTyped = function() {
    return this;
  };
  function TypeDesc(name, typecode, props, empty_value) {
    this.name = name;
    this.typecode = typecode;
    var subcategory = typecode >>> 4;
    switch (subcategory) {
      case 4:
        this.width = 0;
        this.category = CAT_FIXED;
        break;
      case 5:
        this.width = 1;
        this.category = CAT_FIXED;
        break;
      case 6:
        this.width = 2;
        this.category = CAT_FIXED;
        break;
      case 7:
        this.width = 4;
        this.category = CAT_FIXED;
        break;
      case 8:
        this.width = 8;
        this.category = CAT_FIXED;
        break;
      case 9:
        this.width = 16;
        this.category = CAT_FIXED;
        break;
      case 10:
        this.width = 1;
        this.category = CAT_VARIABLE;
        break;
      case 11:
        this.width = 4;
        this.category = CAT_VARIABLE;
        break;
      case 12:
        this.width = 1;
        this.category = CAT_COMPOUND;
        break;
      case 13:
        this.width = 4;
        this.category = CAT_COMPOUND;
        break;
      case 14:
        this.width = 1;
        this.category = CAT_ARRAY;
        break;
      case 15:
        this.width = 4;
        this.category = CAT_ARRAY;
        break;
    }
    if (props) {
      if (props.read) {
        this.read = props.read;
      }
      if (props.write) {
        this.write = props.write;
      }
      if (props.encoding) {
        this.encoding = props.encoding;
      }
    }
    var t = this;
    if (subcategory === 4) {
      this.create = function() {
        return new Typed(t, empty_value);
      };
    } else if (subcategory === 14 || subcategory === 15) {
      this.create = function(v, code2, descriptor) {
        return new Typed(t, v, code2, descriptor);
      };
    } else {
      this.create = function(v) {
        return new Typed(t, v);
      };
    }
  }
  TypeDesc.prototype.toString = function() {
    return this.name + "#" + hex(this.typecode);
  };
  function hex(i) {
    return Number(i).toString(16);
  }
  var types2 = { "by_code": {} };
  Object.defineProperty(types2, "MAX_UINT", { value: 4294967295, writable: false, configurable: false });
  Object.defineProperty(types2, "MAX_USHORT", { value: 65535, writable: false, configurable: false });
  function define_type(name, typecode, annotations, empty_value) {
    var t = new TypeDesc(name, typecode, annotations, empty_value);
    t.create.typecode = t.typecode;
    types2.by_code[t.typecode] = t;
    types2[name] = t.create;
  }
  function buffer_uint8_ops() {
    return {
      "read": function(buffer2, offset) {
        return buffer2.readUInt8(offset);
      },
      "write": function(buffer2, value, offset) {
        buffer2.writeUInt8(value, offset);
      }
    };
  }
  function buffer_uint16be_ops() {
    return {
      "read": function(buffer2, offset) {
        return buffer2.readUInt16BE(offset);
      },
      "write": function(buffer2, value, offset) {
        buffer2.writeUInt16BE(value, offset);
      }
    };
  }
  function buffer_uint32be_ops() {
    return {
      "read": function(buffer2, offset) {
        return buffer2.readUInt32BE(offset);
      },
      "write": function(buffer2, value, offset) {
        buffer2.writeUInt32BE(value, offset);
      }
    };
  }
  function buffer_int8_ops() {
    return {
      "read": function(buffer2, offset) {
        return buffer2.readInt8(offset);
      },
      "write": function(buffer2, value, offset) {
        buffer2.writeInt8(value, offset);
      }
    };
  }
  function buffer_int16be_ops() {
    return {
      "read": function(buffer2, offset) {
        return buffer2.readInt16BE(offset);
      },
      "write": function(buffer2, value, offset) {
        buffer2.writeInt16BE(value, offset);
      }
    };
  }
  function buffer_int32be_ops() {
    return {
      "read": function(buffer2, offset) {
        return buffer2.readInt32BE(offset);
      },
      "write": function(buffer2, value, offset) {
        buffer2.writeInt32BE(value, offset);
      }
    };
  }
  function buffer_floatbe_ops() {
    return {
      "read": function(buffer2, offset) {
        return buffer2.readFloatBE(offset);
      },
      "write": function(buffer2, value, offset) {
        buffer2.writeFloatBE(value, offset);
      }
    };
  }
  function buffer_doublebe_ops() {
    return {
      "read": function(buffer2, offset) {
        return buffer2.readDoubleBE(offset);
      },
      "write": function(buffer2, value, offset) {
        buffer2.writeDoubleBE(value, offset);
      }
    };
  }
  var MAX_UINT = 4294967296;
  var MIN_INT = -2147483647;
  function write_ulong(buffer2, value, offset) {
    if (typeof value === "number" || value instanceof Number) {
      var hi = Math.floor(value / MAX_UINT);
      var lo = value % MAX_UINT;
      buffer2.writeUInt32BE(hi, offset);
      buffer2.writeUInt32BE(lo, offset + 4);
    } else {
      value.copy(buffer2, offset);
    }
  }
  function read_ulong(buffer2, offset) {
    var hi = buffer2.readUInt32BE(offset);
    var lo = buffer2.readUInt32BE(offset + 4);
    if (hi < 2097153) {
      return hi * MAX_UINT + lo;
    } else {
      return buffer2.slice(offset, offset + 8);
    }
  }
  function write_long(buffer2, value, offset) {
    if (typeof value === "number" || value instanceof Number) {
      var abs2 = Math.abs(value);
      var hi = Math.floor(abs2 / MAX_UINT);
      var lo = abs2 % MAX_UINT;
      buffer2.writeInt32BE(hi, offset);
      buffer2.writeUInt32BE(lo, offset + 4);
      if (value < 0) {
        var carry = 1;
        for (var i = 0; i < 8; i++) {
          var index = offset + (7 - i);
          var v = (buffer2[index] ^ 255) + carry;
          buffer2[index] = v & 255;
          carry = v >> 8;
        }
      }
    } else {
      value.copy(buffer2, offset);
    }
  }
  function write_timestamp(buffer2, value, offset) {
    if (typeof value === "object" && value !== null && typeof value.getTime === "function") {
      value = value.getTime();
    }
    return write_long(buffer2, value, offset);
  }
  function read_long(buffer2, offset) {
    var hi = buffer2.readInt32BE(offset);
    var lo = buffer2.readUInt32BE(offset + 4);
    if (hi < 2097153 && hi > -2097153) {
      return hi * MAX_UINT + lo;
    } else {
      return buffer2.slice(offset, offset + 8);
    }
  }
  function read_timestamp(buffer2, offset) {
    const l = read_long(buffer2, offset);
    return new Date(l);
  }
  define_type("Null", 64, void 0, null);
  define_type("Boolean", 86, buffer_uint8_ops());
  define_type("True", 65, void 0, true);
  define_type("False", 66, void 0, false);
  define_type("Ubyte", 80, buffer_uint8_ops());
  define_type("Ushort", 96, buffer_uint16be_ops());
  define_type("Uint", 112, buffer_uint32be_ops());
  define_type("SmallUint", 82, buffer_uint8_ops());
  define_type("Uint0", 67, void 0, 0);
  define_type("Ulong", 128, { "write": write_ulong, "read": read_ulong });
  define_type("SmallUlong", 83, buffer_uint8_ops());
  define_type("Ulong0", 68, void 0, 0);
  define_type("Byte", 81, buffer_int8_ops());
  define_type("Short", 97, buffer_int16be_ops());
  define_type("Int", 113, buffer_int32be_ops());
  define_type("SmallInt", 84, buffer_int8_ops());
  define_type("Long", 129, { "write": write_long, "read": read_long });
  define_type("SmallLong", 85, buffer_int8_ops());
  define_type("Float", 114, buffer_floatbe_ops());
  define_type("Double", 130, buffer_doublebe_ops());
  define_type("Decimal32", 116);
  define_type("Decimal64", 132);
  define_type("Decimal128", 148);
  define_type("CharUTF32", 115, buffer_uint32be_ops());
  define_type("Timestamp", 131, { "write": write_timestamp, "read": read_timestamp });
  define_type("Uuid", 152);
  define_type("Vbin8", 160);
  define_type("Vbin32", 176);
  define_type("Str8", 161, { "encoding": "utf8" });
  define_type("Str32", 177, { "encoding": "utf8" });
  define_type("Sym8", 163, { "encoding": "ascii" });
  define_type("Sym32", 179, { "encoding": "ascii" });
  define_type("List0", 69, void 0, []);
  define_type("List8", 192);
  define_type("List32", 208);
  define_type("Map8", 193);
  define_type("Map32", 209);
  define_type("Array8", 224);
  define_type("Array32", 240);
  function is_one_of(o, typelist) {
    for (var i = 0; i < typelist.length; i++) {
      if (o.type.typecode === typelist[i].typecode) return true;
    }
    return false;
  }
  function buffer_zero(b, len, neg) {
    for (var i = 0; i < len && i < b.length; i++) {
      if (b[i] !== (neg ? 255 : 0)) return false;
    }
    return true;
  }
  types2.is_ulong = function(o) {
    return is_one_of(o, [types2.Ulong, types2.Ulong0, types2.SmallUlong]);
  };
  types2.is_string = function(o) {
    return is_one_of(o, [types2.Str8, types2.Str32]);
  };
  types2.is_symbol = function(o) {
    return is_one_of(o, [types2.Sym8, types2.Sym32]);
  };
  types2.is_list = function(o) {
    return is_one_of(o, [types2.List0, types2.List8, types2.List32]);
  };
  types2.is_map = function(o) {
    return is_one_of(o, [types2.Map8, types2.Map32]);
  };
  types2.wrap_boolean = function(v) {
    return v ? types2.True() : types2.False();
  };
  types2.wrap_ulong = function(l) {
    if (Buffer.isBuffer(l)) {
      if (buffer_zero(l, 8, false)) return types2.Ulong0();
      return buffer_zero(l, 7, false) ? types2.SmallUlong(l[7]) : types2.Ulong(l);
    } else {
      if (l === 0) return types2.Ulong0();
      else return l > 255 ? types2.Ulong(l) : types2.SmallUlong(l);
    }
  };
  types2.wrap_uint = function(l) {
    if (l === 0) return types2.Uint0();
    else return l > 255 ? types2.Uint(l) : types2.SmallUint(l);
  };
  types2.wrap_ushort = function(l) {
    return types2.Ushort(l);
  };
  types2.wrap_ubyte = function(l) {
    return types2.Ubyte(l);
  };
  types2.wrap_long = function(l) {
    if (Buffer.isBuffer(l)) {
      var negFlag = (l[0] & 128) !== 0;
      if (buffer_zero(l, 7, negFlag) && (l[7] & 128) === (negFlag ? 128 : 0)) {
        return types2.SmallLong(negFlag ? -((l[7] ^ 255) + 1) : l[7]);
      }
      return types2.Long(l);
    } else {
      return l > 127 || l < -128 ? types2.Long(l) : types2.SmallLong(l);
    }
  };
  types2.wrap_int = function(l) {
    return l > 127 || l < -128 ? types2.Int(l) : types2.SmallInt(l);
  };
  types2.wrap_short = function(l) {
    return types2.Short(l);
  };
  types2.wrap_byte = function(l) {
    return types2.Byte(l);
  };
  types2.wrap_float = function(l) {
    return types2.Float(l);
  };
  types2.wrap_double = function(l) {
    return types2.Double(l);
  };
  types2.wrap_timestamp = function(l) {
    return types2.Timestamp(l);
  };
  types2.wrap_char = function(v) {
    return types2.CharUTF32(v);
  };
  types2.wrap_uuid = function(v) {
    return types2.Uuid(v);
  };
  types2.wrap_binary = function(s) {
    return s.length > 255 ? types2.Vbin32(s) : types2.Vbin8(s);
  };
  types2.wrap_string = function(s) {
    return Buffer.byteLength(s) > 255 ? types2.Str32(s) : types2.Str8(s);
  };
  types2.wrap_symbol = function(s) {
    return Buffer.byteLength(s) > 255 ? types2.Sym32(s) : types2.Sym8(s);
  };
  types2.wrap_list = function(l) {
    if (l.length === 0) return types2.List0();
    var items = l.map(types2.wrap);
    return types2.List32(items);
  };
  types2.wrap_set_as_list = function(l) {
    if (l.size === 0) return types2.List0();
    var items = Array.from(l, types2.wrap);
    return types2.List32(items);
  };
  types2.wrap_map = function(m, key_wrapper) {
    var items = [];
    for (var k in m) {
      items.push(key_wrapper ? key_wrapper(k) : types2.wrap(k));
      items.push(types2.wrap(m[k]));
    }
    return types2.Map32(items);
  };
  types2.wrap_map_as_map = function(m) {
    var items = [];
    for (var [k, v] of m) {
      items.push(types2.wrap(k));
      items.push(types2.wrap(v));
    }
    return types2.Map32(items);
  };
  types2.wrap_symbolic_map = function(m) {
    return types2.wrap_map(m, types2.wrap_symbol);
  };
  types2.wrap_array = function(l, code2, descriptors) {
    if (code2) {
      return types2.Array32(l, code2, descriptors);
    } else {
      console.trace("An array must specify a type for its elements");
      throw new errors2.TypeError("An array must specify a type for its elements");
    }
  };
  types2.wrap = function(o) {
    var t = typeof o;
    if (t === "object" && o !== null && typeof o.toRheaTyped === "function") {
      return o.toRheaTyped();
    } else if (t === "string") {
      return types2.wrap_string(o);
    } else if (t === "boolean") {
      return o ? types2.True() : types2.False();
    } else if (t === "number" || o instanceof Number) {
      if (isNaN(o)) {
        return types2.Null();
      } else if (Math.floor(o) - o !== 0) {
        return types2.Double(o);
      } else if (o > 0) {
        if (o < MAX_UINT) {
          return types2.wrap_uint(o);
        } else {
          return types2.wrap_ulong(o);
        }
      } else {
        if (o > MIN_INT) {
          return types2.wrap_int(o);
        } else {
          return types2.wrap_long(o);
        }
      }
    } else if (o instanceof Date) {
      return types2.wrap_timestamp(o.getTime());
    } else if (o instanceof Buffer || o instanceof Uint8Array) {
      return types2.wrap_binary(o);
    } else if (t === "undefined" || o === null) {
      return types2.Null();
    } else if (Array.isArray(o)) {
      return types2.wrap_list(o);
    } else if (o instanceof Map) {
      return types2.wrap_map_as_map(o);
    } else if (o instanceof Set) {
      return types2.wrap_set_as_list(o);
    } else {
      return types2.wrap_map(o);
    }
  };
  types2.wrap_described = function(value, descriptor) {
    var result = types2.wrap(value);
    if (descriptor) {
      if (typeof descriptor === "string") {
        result = types2.described(types2.wrap_symbol(descriptor), result);
      } else if (typeof descriptor === "number" || descriptor instanceof Number) {
        result = types2.described(types2.wrap_ulong(descriptor), result);
      }
    }
    return result;
  };
  types2.wrap_message_id = function(o) {
    var t = typeof o;
    if (t === "string") {
      return types2.wrap_string(o);
    } else if (t === "number" || o instanceof Number) {
      return types2.wrap_ulong(o);
    } else if (Buffer.isBuffer(o)) {
      return types2.wrap_uuid(o);
    } else if (o instanceof Typed) {
      return o;
    } else {
      throw new errors2.TypeError("invalid message id:" + o);
    }
  };
  function mapify(elements) {
    var result = {};
    for (var i = 0; i + 1 < elements.length; ) {
      result[elements[i++]] = elements[i++];
    }
    return result;
  }
  var by_descriptor = {};
  types2.unwrap_map_simple = function(o) {
    return mapify(o.value.map(function(i) {
      return types2.unwrap(i, true);
    }));
  };
  types2.unwrap = function(o, leave_described) {
    if (o instanceof Typed) {
      if (o.descriptor) {
        var c = by_descriptor[o.descriptor.value];
        if (c) {
          return new c(o.value);
        } else if (leave_described) {
          return o;
        }
      }
      var u = types2.unwrap(o.value, true);
      return types2.is_map(o) ? mapify(u) : u;
    } else if (Array.isArray(o)) {
      return o.map(function(i) {
        return types2.unwrap(i, true);
      });
    } else {
      return o;
    }
  };
  types2.described_nc = function(descriptor, o) {
    if (descriptor.length) {
      o.descriptor = descriptor.shift();
      return types2.described(descriptor, o);
    } else {
      o.descriptor = descriptor;
      return o;
    }
  };
  types2.described = types2.described_nc;
  function get_type(code2) {
    var type2 = types2.by_code[code2];
    if (!type2) {
      throw new errors2.TypeError("Unrecognised typecode: " + hex(code2));
    }
    return type2;
  }
  types2.Reader = function(buffer2) {
    this.buffer = buffer2;
    this.position = 0;
  };
  types2.Reader.prototype.read_typecode = function() {
    return this.read_uint(1);
  };
  types2.Reader.prototype.read_uint = function(width) {
    var current = this.position;
    this.position += width;
    if (width === 1) {
      return this.buffer.readUInt8(current);
    } else if (width === 2) {
      return this.buffer.readUInt16BE(current);
    } else if (width === 4) {
      return this.buffer.readUInt32BE(current);
    } else {
      throw new errors2.TypeError("Unexpected width for uint " + width);
    }
  };
  types2.Reader.prototype.read_fixed_width = function(type2) {
    var current = this.position;
    this.position += type2.width;
    if (type2.read) {
      return type2.read(this.buffer, current);
    } else {
      return this.buffer.slice(current, this.position);
    }
  };
  types2.Reader.prototype.read_variable_width = function(type2) {
    var size = this.read_uint(type2.width);
    var slice = this.read_bytes(size);
    return type2.encoding ? slice.toString(type2.encoding) : slice;
  };
  types2.Reader.prototype.read = function() {
    var constructor = this.read_constructor();
    var value = this.read_value(get_type(constructor.typecode));
    return constructor.descriptor ? types2.described_nc(constructor.descriptor, value) : value;
  };
  types2.Reader.prototype.read_constructor = function(descriptors) {
    var code2 = this.read_typecode();
    if (code2 === 0) {
      if (descriptors === void 0) {
        descriptors = [];
      }
      descriptors.push(this.read());
      return this.read_constructor(descriptors);
    } else {
      if (descriptors === void 0) {
        return { "typecode": code2 };
      } else if (descriptors.length === 1) {
        return { "typecode": code2, "descriptor": descriptors[0] };
      } else {
        return { "typecode": code2, "descriptor": descriptors[0], "descriptors": descriptors };
      }
    }
  };
  types2.Reader.prototype.read_value = function(type2) {
    if (type2.width === 0) {
      return type2.create();
    } else if (type2.category === CAT_FIXED) {
      return type2.create(this.read_fixed_width(type2));
    } else if (type2.category === CAT_VARIABLE) {
      return type2.create(this.read_variable_width(type2));
    } else if (type2.category === CAT_COMPOUND) {
      return this.read_compound(type2);
    } else if (type2.category === CAT_ARRAY) {
      return this.read_array(type2);
    } else {
      throw new errors2.TypeError("Invalid category for type: " + type2);
    }
  };
  types2.Reader.prototype.read_array_items = function(n, type2) {
    var items = [];
    while (items.length < n) {
      items.push(this.read_value(type2));
    }
    return items;
  };
  types2.Reader.prototype.read_n = function(n) {
    var items = new Array(n);
    for (var i = 0; i < n; i++) {
      items[i] = this.read();
    }
    return items;
  };
  types2.Reader.prototype.read_size_count = function(width) {
    return { "size": this.read_uint(width), "count": this.read_uint(width) };
  };
  types2.Reader.prototype.read_compound = function(type2) {
    var limits = this.read_size_count(type2.width);
    return type2.create(this.read_n(limits.count));
  };
  types2.Reader.prototype.read_array = function(type2) {
    var limits = this.read_size_count(type2.width);
    var constructor = this.read_constructor();
    return type2.create(this.read_array_items(limits.count, get_type(constructor.typecode)), constructor.typecode, constructor.descriptor);
  };
  types2.Reader.prototype.toString = function() {
    var s = "buffer@" + this.position;
    if (this.position) s += ": ";
    for (var i = this.position; i < this.buffer.length; i++) {
      if (i > 0) s += ",";
      s += "0x" + Number(this.buffer[i]).toString(16);
    }
    return s;
  };
  types2.Reader.prototype.reset = function() {
    this.position = 0;
  };
  types2.Reader.prototype.skip = function(bytes) {
    this.position += bytes;
  };
  types2.Reader.prototype.read_bytes = function(bytes) {
    var current = this.position;
    this.position += bytes;
    return this.buffer.slice(current, this.position);
  };
  types2.Reader.prototype.remaining = function() {
    return this.buffer.length - this.position;
  };
  types2.Writer = function(buffer2) {
    this.buffer = buffer2 ? buffer2 : util2.allocate_buffer(1024);
    this.position = 0;
  };
  types2.Writer.prototype.toBuffer = function() {
    return this.buffer.slice(0, this.position);
  };
  function max2(a, b) {
    return a > b ? a : b;
  }
  types2.Writer.prototype.ensure = function(length) {
    if (this.buffer.length < length) {
      var bigger = util2.allocate_buffer(max2(this.buffer.length * 2, length));
      this.buffer.copy(bigger);
      this.buffer = bigger;
    }
  };
  types2.Writer.prototype.write_typecode = function(code2) {
    this.write_uint(code2, 1);
  };
  types2.Writer.prototype.write_uint = function(value, width) {
    var current = this.position;
    this.ensure(this.position + width);
    this.position += width;
    if (width === 1) {
      return this.buffer.writeUInt8(value, current);
    } else if (width === 2) {
      return this.buffer.writeUInt16BE(value, current);
    } else if (width === 4) {
      return this.buffer.writeUInt32BE(value, current);
    } else {
      throw new errors2.TypeError("Unexpected width for uint " + width);
    }
  };
  types2.Writer.prototype.write_fixed_width = function(type2, value) {
    var current = this.position;
    this.ensure(this.position + type2.width);
    this.position += type2.width;
    if (type2.write) {
      type2.write(this.buffer, value, current);
    } else if (value.copy) {
      value.copy(this.buffer, current);
    } else {
      throw new errors2.TypeError("Cannot handle write for " + type2);
    }
  };
  types2.Writer.prototype.write_variable_width = function(type2, value) {
    var source = type2.encoding ? Buffer.from(value, type2.encoding) : Buffer.from(value);
    this.write_uint(source.length, type2.width);
    this.write_bytes(source);
  };
  types2.Writer.prototype.write_bytes = function(source) {
    var current = this.position;
    this.ensure(this.position + source.length);
    this.position += source.length;
    source.copy(this.buffer, current);
  };
  types2.Writer.prototype.write_constructor = function(typecode, descriptor) {
    if (descriptor) {
      this.write_typecode(0);
      this.write(descriptor);
    }
    this.write_typecode(typecode);
  };
  types2.Writer.prototype.write = function(o) {
    if (o.type === void 0) {
      if (o.described) {
        this.write(o.described());
      } else {
        throw new errors2.TypeError("Cannot write " + JSON.stringify(o));
      }
    } else {
      this.write_constructor(o.type.typecode, o.descriptor);
      this.write_value(o.type, o.value, o.array_constructor);
    }
  };
  types2.Writer.prototype.write_value = function(type2, value, constructor) {
    if (type2.width === 0) {
      return;
    } else if (type2.category === CAT_FIXED) {
      this.write_fixed_width(type2, value);
    } else if (type2.category === CAT_VARIABLE) {
      this.write_variable_width(type2, value);
    } else if (type2.category === CAT_COMPOUND) {
      this.write_compound(type2, value);
    } else if (type2.category === CAT_ARRAY) {
      this.write_array(type2, value, constructor);
    } else {
      throw new errors2.TypeError("Invalid category " + type2.category + " for type: " + type2);
    }
  };
  types2.Writer.prototype.backfill_size = function(width, saved) {
    var gap = this.position - saved;
    this.position = saved;
    this.write_uint(gap - width, width);
    this.position += gap - width;
  };
  types2.Writer.prototype.write_compound = function(type2, value) {
    var saved = this.position;
    this.position += type2.width;
    this.write_uint(value.length, type2.width);
    for (var i = 0; i < value.length; i++) {
      if (value[i] === void 0 || value[i] === null) {
        this.write(types2.Null());
      } else {
        this.write(value[i]);
      }
    }
    this.backfill_size(type2.width, saved);
  };
  types2.Writer.prototype.write_array = function(type2, value, constructor) {
    var saved = this.position;
    this.position += type2.width;
    this.write_uint(value.length, type2.width);
    this.write_constructor(constructor.typecode, constructor.descriptor);
    var ctype = get_type(constructor.typecode);
    for (var i = 0; i < value.length; i++) {
      this.write_value(ctype, value[i]);
    }
    this.backfill_size(type2.width, saved);
  };
  types2.Writer.prototype.toString = function() {
    var s = "buffer@" + this.position;
    if (this.position) s += ": ";
    for (var i = 0; i < this.position; i++) {
      if (i > 0) s += ",";
      s += ("00" + Number(this.buffer[i]).toString(16)).slice(-2);
    }
    return s;
  };
  types2.Writer.prototype.skip = function(bytes) {
    this.ensure(this.position + bytes);
    this.position += bytes;
  };
  types2.Writer.prototype.clear = function() {
    this.buffer.fill(0);
    this.position = 0;
  };
  types2.Writer.prototype.remaining = function() {
    return this.buffer.length - this.position;
  };
  function get_constructor(typename) {
    if (typename === "symbol") {
      return { typecode: types2.Sym8.typecode };
    }
    throw new errors2.TypeError("TODO: Array of type " + typename + " not yet supported");
  }
  function wrap_field(definition, instance) {
    if (instance !== void 0 && instance !== null) {
      if (Array.isArray(instance)) {
        if (!definition.multiple) {
          throw new errors2.TypeError("Field " + definition.name + " does not support multiple values, got " + JSON.stringify(instance));
        }
        var constructor = get_constructor(definition.type);
        return types2.wrap_array(instance, constructor.typecode, constructor.descriptor);
      } else if (definition.type === "*") {
        return instance;
      } else {
        var wrapper = types2["wrap_" + definition.type];
        if (wrapper) {
          return wrapper(instance);
        } else {
          throw new errors2.TypeError("No wrapper for field " + definition.name + " of type " + definition.type);
        }
      }
    } else if (definition.mandatory) {
      throw new errors2.TypeError("Field " + definition.name + " is mandatory");
    } else {
      return types2.Null();
    }
  }
  function get_accessors(index, field_definition) {
    var getter;
    if (field_definition.type === "*") {
      getter = function() {
        return this.value[index];
      };
    } else {
      getter = function() {
        return types2.unwrap(this.value[index]);
      };
    }
    var setter = function(o) {
      this.value[index] = wrap_field(field_definition, o);
    };
    return { "get": getter, "set": setter, "enumerable": true, "configurable": false };
  }
  types2.define_composite = function(def) {
    var c = function(fields) {
      this.value = fields ? fields : [];
    };
    c.descriptor = {
      numeric: def.code,
      symbolic: "amqp:" + def.name + ":list"
    };
    c.prototype.dispatch = function(target, frame) {
      target["on_" + def.name](frame);
    };
    for (var i = 0; i < def.fields.length; i++) {
      var f = def.fields[i];
      Object.defineProperty(c.prototype, f.name, get_accessors(i, f));
    }
    c.toString = function() {
      return def.name + "#" + Number(def.code).toString(16);
    };
    c.prototype.toJSON = function() {
      var o = {};
      for (var f2 in this) {
        if (f2 !== "value" && this[f2]) {
          o[f2] = this[f2];
        }
      }
      return o;
    };
    c.create = function(fields) {
      var o = new c();
      for (var f2 in fields) {
        o[f2] = fields[f2];
      }
      return o;
    };
    c.prototype.described = function() {
      return types2.described_nc(types2.wrap_ulong(c.descriptor.numeric), types2.wrap_list(this.value));
    };
    return c;
  };
  function add_type(def) {
    var c = types2.define_composite(def);
    types2["wrap_" + def.name] = function(fields) {
      return c.create(fields).described();
    };
    by_descriptor[Number(c.descriptor.numeric).toString(10)] = c;
    by_descriptor[c.descriptor.symbolic] = c;
  }
  add_type({
    name: "error",
    code: 29,
    fields: [
      { name: "condition", type: "symbol", mandatory: true },
      { name: "description", type: "string" },
      { name: "info", type: "map" }
    ]
  });
  types_1 = types2;
  return types_1;
}
var frames_1;
var hasRequiredFrames;
function requireFrames() {
  if (hasRequiredFrames) return frames_1;
  hasRequiredFrames = 1;
  var types2 = requireTypes();
  var errors2 = requireErrors();
  var frames = {};
  var by_descriptor = {};
  frames.read_header = function(buffer2) {
    var offset = 4;
    var header = {};
    var name = buffer2.toString("ascii", 0, offset);
    if (name !== "AMQP") {
      throw new errors2.ProtocolError("Invalid protocol header for AMQP: " + buffer2.toString("hex", 0, offset));
    }
    header.protocol_id = buffer2.readUInt8(offset++);
    header.major = buffer2.readUInt8(offset++);
    header.minor = buffer2.readUInt8(offset++);
    header.revision = buffer2.readUInt8(offset++);
    if (header.protocol_id === 0 && header.major === 0 && header.minor === 9 && header.revision === 1) {
      throw new errors2.ProtocolError("Unsupported AMQP version: 0-9-1");
    }
    if (header.protocol_id === 1 && header.major === 1 && header.minor === 0 && header.revision === 10) {
      throw new errors2.ProtocolError("Unsupported AMQP version: 0-10");
    }
    if (header.major !== 1 || header.minor !== 0) {
      throw new errors2.ProtocolError("Unsupported AMQP version: " + JSON.stringify(header));
    }
    return header;
  };
  frames.write_header = function(buffer2, header) {
    var offset = 4;
    buffer2.write("AMQP", 0, offset, "ascii");
    buffer2.writeUInt8(header.protocol_id, offset++);
    buffer2.writeUInt8(header.major, offset++);
    buffer2.writeUInt8(header.minor, offset++);
    buffer2.writeUInt8(header.revision, offset++);
    return 8;
  };
  frames.TYPE_AMQP = 0;
  frames.TYPE_SASL = 1;
  frames.read_frame = function(buffer2) {
    var reader = new types2.Reader(buffer2);
    var frame = {};
    frame.size = reader.read_uint(4);
    if (reader.remaining() < frame.size - 4) {
      return null;
    }
    var doff = reader.read_uint(1);
    if (doff < 2) {
      throw new errors2.ProtocolError("Invalid data offset, must be at least 2 was " + doff);
    }
    frame.type = reader.read_uint(1);
    if (frame.type === frames.TYPE_AMQP) {
      frame.channel = reader.read_uint(2);
    } else if (frame.type === frames.TYPE_SASL) {
      reader.skip(2);
      frame.channel = 0;
    } else {
      throw new errors2.ProtocolError("Unknown frame type " + frame.type);
    }
    if (doff > 1) {
      reader.skip(doff * 4 - 8);
    }
    if (reader.remaining()) {
      frame.performative = reader.read();
      var c = by_descriptor[frame.performative.descriptor.value];
      if (c) {
        frame.performative = new c(frame.performative.value);
      }
      if (reader.remaining()) {
        frame.payload = reader.read_bytes(reader.remaining());
      }
    }
    return frame;
  };
  frames.write_frame = function(frame) {
    var writer = new types2.Writer();
    writer.skip(4);
    writer.write_uint(2, 1);
    writer.write_uint(frame.type, 1);
    if (frame.type === frames.TYPE_AMQP) {
      writer.write_uint(frame.channel, 2);
    } else if (frame.type === frames.TYPE_SASL) {
      writer.write_uint(0, 2);
    } else {
      throw new errors2.ProtocolError("Unknown frame type " + frame.type);
    }
    if (frame.performative) {
      writer.write(frame.performative);
      if (frame.payload) {
        writer.write_bytes(frame.payload);
      }
    }
    var buffer2 = writer.toBuffer();
    buffer2.writeUInt32BE(buffer2.length, 0);
    return buffer2;
  };
  frames.amqp_frame = function(channel, performative, payload) {
    return { "channel": channel || 0, "type": frames.TYPE_AMQP, "performative": performative, "payload": payload };
  };
  frames.sasl_frame = function(performative) {
    return { "channel": 0, "type": frames.TYPE_SASL, "performative": performative };
  };
  function define_frame(type2, def) {
    var c = types2.define_composite(def);
    frames[def.name] = c.create;
    by_descriptor[Number(c.descriptor.numeric).toString(10)] = c;
    by_descriptor[c.descriptor.symbolic] = c;
  }
  var open = {
    name: "open",
    code: 16,
    fields: [
      { name: "container_id", type: "string", mandatory: true },
      { name: "hostname", type: "string" },
      { name: "max_frame_size", type: "uint", default_value: 4294967295 },
      { name: "channel_max", type: "ushort", default_value: 65535 },
      { name: "idle_time_out", type: "uint" },
      { name: "outgoing_locales", type: "symbol", multiple: true },
      { name: "incoming_locales", type: "symbol", multiple: true },
      { name: "offered_capabilities", type: "symbol", multiple: true },
      { name: "desired_capabilities", type: "symbol", multiple: true },
      { name: "properties", type: "symbolic_map" }
    ]
  };
  var begin = {
    name: "begin",
    code: 17,
    fields: [
      { name: "remote_channel", type: "ushort" },
      { name: "next_outgoing_id", type: "uint", mandatory: true },
      { name: "incoming_window", type: "uint", mandatory: true },
      { name: "outgoing_window", type: "uint", mandatory: true },
      { name: "handle_max", type: "uint", default_value: "4294967295" },
      { name: "offered_capabilities", type: "symbol", multiple: true },
      { name: "desired_capabilities", type: "symbol", multiple: true },
      { name: "properties", type: "symbolic_map" }
    ]
  };
  var attach = {
    name: "attach",
    code: 18,
    fields: [
      { name: "name", type: "string", mandatory: true },
      { name: "handle", type: "uint", mandatory: true },
      { name: "role", type: "boolean", mandatory: true },
      { name: "snd_settle_mode", type: "ubyte", default_value: 2 },
      { name: "rcv_settle_mode", type: "ubyte", default_value: 0 },
      { name: "source", type: "*" },
      { name: "target", type: "*" },
      { name: "unsettled", type: "map" },
      { name: "incomplete_unsettled", type: "boolean", default_value: false },
      { name: "initial_delivery_count", type: "uint" },
      { name: "max_message_size", type: "ulong" },
      { name: "offered_capabilities", type: "symbol", multiple: true },
      { name: "desired_capabilities", type: "symbol", multiple: true },
      { name: "properties", type: "symbolic_map" }
    ]
  };
  var flow = {
    name: "flow",
    code: 19,
    fields: [
      { name: "next_incoming_id", type: "uint" },
      { name: "incoming_window", type: "uint", mandatory: true },
      { name: "next_outgoing_id", type: "uint", mandatory: true },
      { name: "outgoing_window", type: "uint", mandatory: true },
      { name: "handle", type: "uint" },
      { name: "delivery_count", type: "uint" },
      { name: "link_credit", type: "uint" },
      { name: "available", type: "uint" },
      { name: "drain", type: "boolean", default_value: false },
      { name: "echo", type: "boolean", default_value: false },
      { name: "properties", type: "symbolic_map" }
    ]
  };
  var transfer = {
    name: "transfer",
    code: 20,
    fields: [
      { name: "handle", type: "uint", mandatory: true },
      { name: "delivery_id", type: "uint" },
      { name: "delivery_tag", type: "binary" },
      { name: "message_format", type: "uint" },
      { name: "settled", type: "boolean" },
      { name: "more", type: "boolean", default_value: false },
      { name: "rcv_settle_mode", type: "ubyte" },
      { name: "state", type: "delivery_state" },
      { name: "resume", type: "boolean", default_value: false },
      { name: "aborted", type: "boolean", default_value: false },
      { name: "batchable", type: "boolean", default_value: false }
    ]
  };
  var disposition = {
    name: "disposition",
    code: 21,
    fields: [
      { name: "role", type: "boolean", mandatory: true },
      { name: "first", type: "uint", mandatory: true },
      { name: "last", type: "uint" },
      { name: "settled", type: "boolean", default_value: false },
      { name: "state", type: "*" },
      { name: "batchable", type: "boolean", default_value: false }
    ]
  };
  var detach = {
    name: "detach",
    code: 22,
    fields: [
      { name: "handle", type: "uint", mandatory: true },
      { name: "closed", type: "boolean", default_value: false },
      { name: "error", type: "error" }
    ]
  };
  var end = {
    name: "end",
    code: 23,
    fields: [
      { name: "error", type: "error" }
    ]
  };
  var close = {
    name: "close",
    code: 24,
    fields: [
      { name: "error", type: "error" }
    ]
  };
  define_frame(frames.TYPE_AMQP, open);
  define_frame(frames.TYPE_AMQP, begin);
  define_frame(frames.TYPE_AMQP, attach);
  define_frame(frames.TYPE_AMQP, flow);
  define_frame(frames.TYPE_AMQP, transfer);
  define_frame(frames.TYPE_AMQP, disposition);
  define_frame(frames.TYPE_AMQP, detach);
  define_frame(frames.TYPE_AMQP, end);
  define_frame(frames.TYPE_AMQP, close);
  var sasl_mechanisms = {
    name: "sasl_mechanisms",
    code: 64,
    fields: [
      { name: "sasl_server_mechanisms", type: "symbol", multiple: true, mandatory: true }
    ]
  };
  var sasl_init = {
    name: "sasl_init",
    code: 65,
    fields: [
      { name: "mechanism", type: "symbol", mandatory: true },
      { name: "initial_response", type: "binary" },
      { name: "hostname", type: "string" }
    ]
  };
  var sasl_challenge = {
    name: "sasl_challenge",
    code: 66,
    fields: [
      { name: "challenge", type: "binary", mandatory: true }
    ]
  };
  var sasl_response = {
    name: "sasl_response",
    code: 67,
    fields: [
      { name: "response", type: "binary", mandatory: true }
    ]
  };
  var sasl_outcome = {
    name: "sasl_outcome",
    code: 68,
    fields: [
      { name: "code", type: "ubyte", mandatory: true },
      { name: "additional_data", type: "binary" }
    ]
  };
  define_frame(frames.TYPE_SASL, sasl_mechanisms);
  define_frame(frames.TYPE_SASL, sasl_init);
  define_frame(frames.TYPE_SASL, sasl_challenge);
  define_frame(frames.TYPE_SASL, sasl_response);
  define_frame(frames.TYPE_SASL, sasl_outcome);
  frames_1 = frames;
  return frames_1;
}
var browser$1 = { exports: {} };
var ms;
var hasRequiredMs;
function requireMs() {
  if (hasRequiredMs) return ms;
  hasRequiredMs = 1;
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  ms = function(val, options) {
    options = options || {};
    var type2 = typeof val;
    if (type2 === "string" && val.length > 0) {
      return parse(val);
    } else if (type2 === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type2 = (match[2] || "ms").toLowerCase();
    switch (type2) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "weeks":
      case "week":
      case "w":
        return n * w;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return plural(ms2, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms2, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms2, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms2, msAbs, s, "second");
    }
    return ms2 + " ms";
  }
  function plural(ms2, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms2 / n) + " " + name + (isPlural ? "s" : "");
  }
  return ms;
}
var common;
var hasRequiredCommon;
function requireCommon() {
  if (hasRequiredCommon) return common;
  hasRequiredCommon = 1;
  function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = requireMs();
    createDebug.destroy = destroy;
    Object.keys(env).forEach((key) => {
      createDebug[key] = env[key];
    });
    createDebug.names = [];
    createDebug.skips = [];
    createDebug.formatters = {};
    function selectColor(namespace) {
      let hash = 0;
      for (let i = 0; i < namespace.length; i++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      let prevTime;
      let enableOverride = null;
      let namespacesCache;
      let enabledCache;
      function debug(...args) {
        if (!debug.enabled) {
          return;
        }
        const self2 = debug;
        const curr = Number(/* @__PURE__ */ new Date());
        const ms2 = curr - (prevTime || curr);
        self2.diff = ms2;
        self2.prev = prevTime;
        self2.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        let index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
          if (match === "%%") {
            return "%";
          }
          index++;
          const formatter = createDebug.formatters[format];
          if (typeof formatter === "function") {
            const val = args[index];
            match = formatter.call(self2, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        createDebug.formatArgs.call(self2, args);
        const logFn = self2.log || createDebug.log;
        logFn.apply(self2, args);
      }
      debug.namespace = namespace;
      debug.useColors = createDebug.useColors();
      debug.color = createDebug.selectColor(namespace);
      debug.extend = extend;
      debug.destroy = createDebug.destroy;
      Object.defineProperty(debug, "enabled", {
        enumerable: true,
        configurable: false,
        get: () => {
          if (enableOverride !== null) {
            return enableOverride;
          }
          if (namespacesCache !== createDebug.namespaces) {
            namespacesCache = createDebug.namespaces;
            enabledCache = createDebug.enabled(namespace);
          }
          return enabledCache;
        },
        set: (v) => {
          enableOverride = v;
        }
      });
      if (typeof createDebug.init === "function") {
        createDebug.init(debug);
      }
      return debug;
    }
    function extend(namespace, delimiter) {
      const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
      newDebug.log = this.log;
      return newDebug;
    }
    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.namespaces = namespaces;
      createDebug.names = [];
      createDebug.skips = [];
      const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const ns of split) {
        if (ns[0] === "-") {
          createDebug.skips.push(ns.slice(1));
        } else {
          createDebug.names.push(ns);
        }
      }
    }
    function matchesTemplate(search, template) {
      let searchIndex = 0;
      let templateIndex = 0;
      let starIndex = -1;
      let matchIndex = 0;
      while (searchIndex < search.length) {
        if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
          if (template[templateIndex] === "*") {
            starIndex = templateIndex;
            matchIndex = searchIndex;
            templateIndex++;
          } else {
            searchIndex++;
            templateIndex++;
          }
        } else if (starIndex !== -1) {
          templateIndex = starIndex + 1;
          matchIndex++;
          searchIndex = matchIndex;
        } else {
          return false;
        }
      }
      while (templateIndex < template.length && template[templateIndex] === "*") {
        templateIndex++;
      }
      return templateIndex === template.length;
    }
    function disable() {
      const namespaces = [
        ...createDebug.names,
        ...createDebug.skips.map((namespace) => "-" + namespace)
      ].join(",");
      createDebug.enable("");
      return namespaces;
    }
    function enabled(name) {
      for (const skip of createDebug.skips) {
        if (matchesTemplate(name, skip)) {
          return false;
        }
      }
      for (const ns of createDebug.names) {
        if (matchesTemplate(name, ns)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    function destroy() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    createDebug.enable(createDebug.load());
    return createDebug;
  }
  common = setup;
  return common;
}
var hasRequiredBrowser$1;
function requireBrowser$1() {
  if (hasRequiredBrowser$1) return browser$1.exports;
  hasRequiredBrowser$1 = 1;
  (function(module, exports) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process$1 !== "undefined" && "env" in process$1) {
        r = process$1.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = requireCommon()(exports);
    const { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  })(browser$1, browser$1.exports);
  return browser$1.exports;
}
var log;
var hasRequiredLog;
function requireLog() {
  if (hasRequiredLog) return log;
  hasRequiredLog = 1;
  var debug = requireBrowser$1();
  if (debug.formatters) {
    debug.formatters.h = function(v) {
      return v.toString("hex");
    };
  }
  log = {
    "config": debug("rhea:config"),
    "frames": debug("rhea:frames"),
    "raw": debug("rhea:raw"),
    "reconnect": debug("rhea:reconnect"),
    "events": debug("rhea:events"),
    "message": debug("rhea:message"),
    "flow": debug("rhea:flow"),
    "io": debug("rhea:io")
  };
  return log;
}
var transport;
var hasRequiredTransport;
function requireTransport() {
  if (hasRequiredTransport) return transport;
  hasRequiredTransport = 1;
  var errors2 = requireErrors();
  var frames = requireFrames();
  var log2 = requireLog();
  var util2 = requireUtil();
  var Transport = function(identifier, protocol_id, frame_type, handler) {
    this.identifier = identifier;
    this.protocol_id = protocol_id;
    this.frame_type = frame_type;
    this.handler = handler;
    this.pending = [];
    this.header_sent = void 0;
    this.header_received = void 0;
    this.write_complete = false;
    this.read_complete = false;
  };
  Transport.prototype.has_writes_pending = function() {
    return this.pending.length > 0 || !this.header_sent;
  };
  Transport.prototype.encode = function(frame) {
    this.pending.push(frame);
  };
  Transport.prototype.write = function(socket) {
    if (!this.header_sent) {
      var buffer2 = util2.allocate_buffer(8);
      var header = { protocol_id: this.protocol_id, major: 1, minor: 0, revision: 0 };
      log2.frames("[%s] -> %o", this.identifier, header);
      frames.write_header(buffer2, header);
      socket.write(buffer2);
      this.header_sent = header;
    }
    for (var i = 0; i < this.pending.length; i++) {
      var frame = this.pending[i];
      var buffer2 = frames.write_frame(frame);
      socket.write(buffer2);
      if (frame.performative) {
        log2.frames("[%s]:%s -> %s %j", this.identifier, frame.channel, frame.performative.constructor, frame.performative, frame.payload || "");
      } else {
        log2.frames("[%s]:%s -> empty", this.identifier, frame.channel);
      }
      log2.raw("[%s] SENT: %d %h", this.identifier, buffer2.length, buffer2);
    }
    this.pending = [];
  };
  Transport.prototype.peek_size = function(buffer2) {
    log2.frames("[%s] peek_size %o, %d", this.identifier, this.header_received, buffer2.length);
    if (this.header_received && buffer2.length >= 4) {
      return buffer2.readUInt32BE();
    }
    return void 0;
  };
  Transport.prototype.read = function(buffer2) {
    var offset = 0;
    if (!this.header_received) {
      if (buffer2.length < 8) {
        return offset;
      } else {
        this.header_received = frames.read_header(buffer2);
        log2.frames("[%s] <- %o", this.identifier, this.header_received);
        if (this.header_received.protocol_id !== this.protocol_id) {
          if (this.protocol_id === 3 && this.header_received.protocol_id === 0) {
            throw new errors2.ProtocolError("Expecting SASL layer");
          } else if (this.protocol_id === 0 && this.header_received.protocol_id === 3) {
            throw new errors2.ProtocolError("SASL layer not enabled");
          } else {
            throw new errors2.ProtocolError("Invalid AMQP protocol id " + this.header_received.protocol_id + " expecting: " + this.protocol_id);
          }
        }
        offset = 8;
      }
    }
    while (offset < buffer2.length - 4 && !this.read_complete) {
      var frame_size = buffer2.readUInt32BE(offset);
      log2.io("[%s] got frame of size %d", this.identifier, frame_size);
      if (buffer2.length < offset + frame_size) {
        log2.io("[%s] incomplete frame; have only %d of %d", this.identifier, buffer2.length - offset, frame_size);
        break;
      } else {
        var slice = buffer2.slice(offset, offset + frame_size);
        log2.raw("[%s] RECV: %d %h", this.identifier, slice.length, slice);
        var frame = frames.read_frame(slice);
        if (frame.performative) {
          log2.frames("[%s]:%s <- %s %j", this.identifier, frame.channel, frame.performative.constructor, frame.performative, frame.payload || "");
        } else {
          log2.frames("[%s]:%s <- empty", this.identifier, frame.channel);
        }
        if (frame.type !== this.frame_type) {
          throw new errors2.ProtocolError("Invalid frame type: " + frame.type);
        }
        offset += frame_size;
        if (frame.performative) {
          frame.performative.dispatch(this.handler, frame);
        }
      }
    }
    return offset;
  };
  transport = Transport;
  return transport;
}
var sasl;
var hasRequiredSasl;
function requireSasl() {
  if (hasRequiredSasl) return sasl;
  hasRequiredSasl = 1;
  var errors2 = requireErrors();
  var frames = requireFrames();
  var Transport = requireTransport();
  var util2 = requireUtil();
  var sasl_codes = {
    "OK": 0,
    "AUTH": 1,
    "SYS": 2,
    "SYS_PERM": 3,
    "SYS_TEMP": 4
  };
  var SASL_PROTOCOL_ID = 3;
  function extract(buffer2) {
    var results = [];
    var start = 0;
    var i = 0;
    while (i < buffer2.length) {
      if (buffer2[i] === 0) {
        if (i > start) results.push(buffer2.toString("utf8", start, i));
        else results.push(null);
        start = ++i;
      } else {
        ++i;
      }
    }
    if (i > start) results.push(buffer2.toString("utf8", start, i));
    else results.push(null);
    return results;
  }
  var PlainServer = function(callback) {
    this.callback = callback;
    this.outcome = void 0;
    this.username = void 0;
  };
  PlainServer.prototype.start = function(response, hostname) {
    var fields = extract(response);
    if (fields.length !== 3) {
      return Promise.reject("Unexpected response in PLAIN, got " + fields.length + " fields, expected 3");
    }
    var self2 = this;
    return Promise.resolve(this.callback(fields[1], fields[2], hostname)).then(function(result) {
      if (result) {
        self2.outcome = true;
        self2.username = fields[1];
      } else {
        self2.outcome = false;
      }
    });
  };
  var PlainClient = function(username, password) {
    this.username = username;
    this.password = password;
  };
  PlainClient.prototype.start = function(callback) {
    var response = util2.allocate_buffer(1 + this.username.length + 1 + this.password.length);
    response.writeUInt8(0, 0);
    response.write(this.username, 1);
    response.writeUInt8(0, 1 + this.username.length);
    response.write(this.password, 1 + this.username.length + 1);
    callback(void 0, response);
  };
  var AnonymousServer = function() {
    this.outcome = void 0;
    this.username = void 0;
  };
  AnonymousServer.prototype.start = function(response) {
    this.outcome = true;
    this.username = response ? response.toString("utf8") : "anonymous";
  };
  var AnonymousClient = function(name) {
    this.username = name ? name : "anonymous";
  };
  AnonymousClient.prototype.start = function(callback) {
    var response = util2.allocate_buffer(1 + this.username.length);
    response.writeUInt8(0, 0);
    response.write(this.username, 1);
    callback(void 0, response);
  };
  var ExternalServer = function() {
    this.outcome = void 0;
    this.username = void 0;
  };
  ExternalServer.prototype.start = function() {
    this.outcome = true;
  };
  var ExternalClient = function() {
    this.username = void 0;
  };
  ExternalClient.prototype.start = function(callback) {
    callback(void 0, "");
  };
  ExternalClient.prototype.step = function(callback) {
    callback(void 0, "");
  };
  var XOAuth2Client = function(username, token) {
    this.username = username;
    this.token = token;
  };
  XOAuth2Client.prototype.start = function(callback) {
    var response = util2.allocate_buffer(this.username.length + this.token.length + 5 + 12 + 3);
    var count = 0;
    response.write("user=", count);
    count += 5;
    response.write(this.username, count);
    count += this.username.length;
    response.writeUInt8(1, count);
    count += 1;
    response.write("auth=Bearer ", count);
    count += 12;
    response.write(this.token, count);
    count += this.token.length;
    response.writeUInt8(1, count);
    count += 1;
    response.writeUInt8(1, count);
    count += 1;
    callback(void 0, response);
  };
  var SaslServer = function(connection2, mechanisms) {
    this.connection = connection2;
    this.transport = new Transport(connection2.amqp_transport.identifier, SASL_PROTOCOL_ID, frames.TYPE_SASL, this);
    this.next = connection2.amqp_transport;
    this.mechanisms = mechanisms;
    this.mechanism = void 0;
    this.outcome = void 0;
    this.username = void 0;
    var mechlist = Object.getOwnPropertyNames(mechanisms);
    this.transport.encode(frames.sasl_frame(frames.sasl_mechanisms({ sasl_server_mechanisms: mechlist })));
  };
  SaslServer.prototype.do_step = function(challenge) {
    if (this.mechanism.outcome === void 0) {
      this.transport.encode(frames.sasl_frame(frames.sasl_challenge({ "challenge": challenge })));
      this.connection.output();
    } else {
      this.outcome = this.mechanism.outcome ? sasl_codes.OK : sasl_codes.AUTH;
      var frame = frames.sasl_frame(frames.sasl_outcome({ code: this.outcome }));
      this.transport.encode(frame);
      this.connection.output();
      if (this.outcome === sasl_codes.OK) {
        this.username = this.mechanism.username;
        this.transport.write_complete = true;
        this.transport.read_complete = true;
      }
    }
  };
  SaslServer.prototype.on_sasl_init = function(frame) {
    var saslctor = this.mechanisms[frame.performative.mechanism];
    if (saslctor) {
      this.mechanism = saslctor();
      Promise.resolve(this.mechanism.start(frame.performative.initial_response, frame.performative.hostname)).then(this.do_step.bind(this)).catch(this.do_fail.bind(this));
    } else {
      this.outcome = sasl_codes.AUTH;
      this.transport.encode(frames.sasl_frame(frames.sasl_outcome({ code: this.outcome })));
    }
  };
  SaslServer.prototype.on_sasl_response = function(frame) {
    Promise.resolve(this.mechanism.step(frame.performative.response)).then(this.do_step.bind(this)).catch(this.do_fail.bind(this));
  };
  SaslServer.prototype.do_fail = function(e) {
    var frame = frames.sasl_frame(frames.sasl_outcome({ code: sasl_codes.SYS }));
    this.transport.encode(frame);
    this.connection.output();
    try {
      this.connection.sasl_failed("Sasl callback promise failed with " + e, "amqp:internal-error");
    } catch (e2) {
      console.error("Uncaught error: ", e2.message);
    }
  };
  SaslServer.prototype.has_writes_pending = function() {
    return this.transport.has_writes_pending() || this.next.has_writes_pending();
  };
  SaslServer.prototype.write = function(socket) {
    if (this.transport.write_complete && this.transport.pending.length === 0) {
      return this.next.write(socket);
    } else {
      return this.transport.write(socket);
    }
  };
  SaslServer.prototype.peek_size = function(buffer2) {
    if (this.transport.read_complete) {
      return this.next.peek_size(buffer2);
    } else {
      return this.transport.peek_size(buffer2);
    }
  };
  SaslServer.prototype.read = function(buffer2) {
    if (this.transport.read_complete) {
      return this.next.read(buffer2);
    } else {
      return this.transport.read(buffer2);
    }
  };
  var SaslClient = function(connection2, mechanisms, hostname) {
    this.connection = connection2;
    this.transport = new Transport(connection2.amqp_transport.identifier, SASL_PROTOCOL_ID, frames.TYPE_SASL, this);
    this.next = connection2.amqp_transport;
    this.mechanisms = mechanisms;
    this.mechanism = void 0;
    this.mechanism_name = void 0;
    this.hostname = hostname;
    this.failed = false;
  };
  SaslClient.prototype.on_sasl_mechanisms = function(frame) {
    var offered_mechanisms = [];
    if (Array.isArray(frame.performative.sasl_server_mechanisms)) {
      offered_mechanisms = frame.performative.sasl_server_mechanisms;
    } else if (frame.performative.sasl_server_mechanisms) {
      offered_mechanisms = [frame.performative.sasl_server_mechanisms];
    }
    for (var i = 0; this.mechanism === void 0 && i < offered_mechanisms.length; i++) {
      var mech = offered_mechanisms[i];
      var f = this.mechanisms[mech];
      if (f) {
        this.mechanism = typeof f === "function" ? f() : f;
        this.mechanism_name = mech;
      }
    }
    if (this.mechanism) {
      var self2 = this;
      this.mechanism.start(function(err, response) {
        if (err) {
          self2.failed = true;
          self2.connection.sasl_failed("SASL mechanism init failed: " + err);
        } else {
          var init = { "mechanism": self2.mechanism_name, "initial_response": response };
          if (self2.hostname) {
            init.hostname = self2.hostname;
          }
          self2.transport.encode(frames.sasl_frame(frames.sasl_init(init)));
          self2.connection.output();
        }
      });
    } else {
      this.failed = true;
      this.connection.sasl_failed("No suitable mechanism; server supports " + frame.performative.sasl_server_mechanisms);
    }
  };
  SaslClient.prototype.on_sasl_challenge = function(frame) {
    var self2 = this;
    this.mechanism.step(frame.performative.challenge, function(err, response) {
      if (err) {
        self2.failed = true;
        self2.connection.sasl_failed("SASL mechanism challenge failed: " + err);
      } else {
        self2.transport.encode(frames.sasl_frame(frames.sasl_response({ "response": response })));
        self2.connection.output();
      }
    });
  };
  SaslClient.prototype.on_sasl_outcome = function(frame) {
    switch (frame.performative.code) {
      case sasl_codes.OK:
        this.transport.read_complete = true;
        this.transport.write_complete = true;
        break;
      case sasl_codes.SYS:
      case sasl_codes.SYS_PERM:
      case sasl_codes.SYS_TEMP:
        this.transport.write_complete = true;
        this.connection.sasl_failed("Failed to authenticate: " + frame.performative.code, "amqp:internal-error");
        break;
      default:
        this.transport.write_complete = true;
        this.connection.sasl_failed("Failed to authenticate: " + frame.performative.code);
    }
  };
  SaslClient.prototype.has_writes_pending = function() {
    return this.transport.has_writes_pending() || this.next.has_writes_pending();
  };
  SaslClient.prototype.write = function(socket) {
    if (this.transport.write_complete) {
      return this.next.write(socket);
    } else {
      return this.transport.write(socket);
    }
  };
  SaslClient.prototype.peek_size = function(buffer2) {
    if (this.transport.read_complete) {
      return this.next.peek_size(buffer2);
    } else {
      return this.transport.peek_size(buffer2);
    }
  };
  SaslClient.prototype.read = function(buffer2) {
    if (this.transport.read_complete) {
      return this.next.read(buffer2);
    } else {
      return this.transport.read(buffer2);
    }
  };
  var SelectiveServer = function(connection2, mechanisms) {
    this.header_received = false;
    this.transports = {
      0: connection2.amqp_transport,
      3: new SaslServer(connection2, mechanisms)
    };
    this.selected = void 0;
  };
  SelectiveServer.prototype.has_writes_pending = function() {
    return this.header_received && this.selected.has_writes_pending();
  };
  SelectiveServer.prototype.write = function(socket) {
    if (this.selected) {
      return this.selected.write(socket);
    } else {
      return 0;
    }
  };
  SelectiveServer.prototype.peek_size = function(buffer2) {
    if (this.header_received) {
      return this.selected.peek_size(buffer2);
    }
    return void 0;
  };
  SelectiveServer.prototype.read = function(buffer2) {
    if (!this.header_received) {
      if (buffer2.length < 8) {
        return 0;
      } else {
        this.header_received = frames.read_header(buffer2);
        this.selected = this.transports[this.header_received.protocol_id];
        if (this.selected === void 0) {
          throw new errors2.ProtocolError("Invalid AMQP protocol id " + this.header_received.protocol_id);
        }
      }
    }
    return this.selected.read(buffer2);
  };
  var default_server_mechanisms = {
    enable_anonymous: function() {
      this["ANONYMOUS"] = function() {
        return new AnonymousServer();
      };
    },
    enable_plain: function(callback) {
      this["PLAIN"] = function() {
        return new PlainServer(callback);
      };
    }
  };
  var default_client_mechanisms = {
    enable_anonymous: function(name) {
      this["ANONYMOUS"] = function() {
        return new AnonymousClient(name);
      };
    },
    enable_plain: function(username, password) {
      this["PLAIN"] = function() {
        return new PlainClient(username, password);
      };
    },
    enable_external: function() {
      this["EXTERNAL"] = function() {
        return new ExternalClient();
      };
    },
    enable_xoauth2: function(username, token) {
      if (username && token) {
        this["XOAUTH2"] = function() {
          return new XOAuth2Client(username, token);
        };
      } else if (token === void 0) {
        throw Error("token must be specified");
      } else if (username === void 0) {
        throw Error("username must be specified");
      }
    }
  };
  sasl = {
    Client: SaslClient,
    Server: SaslServer,
    Selective: SelectiveServer,
    server_mechanisms: function() {
      return Object.create(default_server_mechanisms);
    },
    client_mechanisms: function() {
      return Object.create(default_client_mechanisms);
    },
    server_add_external: function(mechs) {
      mechs["EXTERNAL"] = function() {
        return new ExternalServer();
      };
      return mechs;
    }
  };
  return sasl;
}
var endpoint;
var hasRequiredEndpoint;
function requireEndpoint() {
  if (hasRequiredEndpoint) return endpoint;
  hasRequiredEndpoint = 1;
  var EndpointState = function() {
    this.init();
  };
  EndpointState.prototype.init = function() {
    this.local_open = false;
    this.remote_open = false;
    this.open_requests = 0;
    this.close_requests = 0;
    this.initialised = false;
    this.marker = void 0;
  };
  EndpointState.prototype.mark = function(o) {
    this.marker = o || Date.now();
    return this.marker;
  };
  EndpointState.prototype.open = function() {
    this.marker = void 0;
    this.initialised = true;
    if (!this.local_open) {
      this.local_open = true;
      this.open_requests++;
      return true;
    } else {
      return false;
    }
  };
  EndpointState.prototype.close = function() {
    this.marker = void 0;
    if (this.local_open) {
      this.local_open = false;
      this.close_requests++;
      return true;
    } else {
      return false;
    }
  };
  EndpointState.prototype.disconnected = function() {
    var was_initialised = this.initialised;
    this.was_open = this.local_open;
    this.init();
    this.initialised = was_initialised;
  };
  EndpointState.prototype.reconnect = function() {
    if (this.was_open) {
      this.open();
      this.was_open = void 0;
    }
  };
  EndpointState.prototype.remote_opened = function() {
    if (!this.remote_open) {
      this.remote_open = true;
      return true;
    } else {
      return false;
    }
  };
  EndpointState.prototype.remote_closed = function() {
    if (this.remote_open) {
      this.remote_open = false;
      return true;
    } else {
      return false;
    }
  };
  EndpointState.prototype.is_open = function() {
    return this.local_open && this.remote_open;
  };
  EndpointState.prototype.is_closed = function() {
    return this.initialised && !(this.local_open || this.was_open) && !this.remote_open;
  };
  EndpointState.prototype.has_settled = function() {
    return this.open_requests === 0 && this.close_requests === 0;
  };
  EndpointState.prototype.need_open = function() {
    if (this.open_requests > 0) {
      this.open_requests--;
      return true;
    } else {
      return false;
    }
  };
  EndpointState.prototype.need_close = function() {
    if (this.close_requests > 0) {
      this.close_requests--;
      return true;
    } else {
      return false;
    }
  };
  endpoint = EndpointState;
  return endpoint;
}
var message_1;
var hasRequiredMessage;
function requireMessage() {
  if (hasRequiredMessage) return message_1;
  hasRequiredMessage = 1;
  var log2 = requireLog();
  var types2 = requireTypes();
  var by_descriptor = {};
  var unwrappers = {};
  var wrappers = [];
  var message = {};
  function define_section(descriptor, unwrap, wrap) {
    unwrap.descriptor = descriptor;
    unwrappers[descriptor.symbolic] = unwrap;
    unwrappers[Number(descriptor.numeric).toString(10)] = unwrap;
    if (wrap) {
      wrappers.push(wrap);
    }
  }
  function define_composite_section(def) {
    var c = types2.define_composite(def);
    message[def.name] = c.create;
    by_descriptor[Number(c.descriptor.numeric).toString(10)] = c;
    by_descriptor[c.descriptor.symbolic] = c;
    var unwrap = function(msg, section) {
      var composite = new c(section.value);
      for (var i = 0; i < def.fields.length; i++) {
        var f = def.fields[i];
        var v = composite[f.name];
        if (v !== void 0 && v !== null) {
          msg[f.name] = v;
        }
      }
    };
    var wrap = function(sections, msg) {
      sections.push(c.create(msg).described());
    };
    define_section(c.descriptor, unwrap, wrap);
  }
  function define_map_section(def, symbolic) {
    var wrapper = symbolic ? types2.wrap_symbolic_map : types2.wrap_map;
    var descriptor = { numeric: def.code };
    descriptor.symbolic = "amqp:" + def.name.replace(/_/g, "-") + ":map";
    var unwrap = function(msg, section) {
      msg[def.name] = types2.unwrap_map_simple(section);
    };
    var wrap = function(sections, msg) {
      if (msg[def.name]) {
        sections.push(types2.described_nc(types2.wrap_ulong(descriptor.numeric), wrapper(msg[def.name])));
      }
    };
    define_section(descriptor, unwrap, wrap);
  }
  function Section(typecode, content, multiple) {
    this.typecode = typecode;
    this.content = content;
    this.multiple = multiple;
  }
  Section.prototype.described = function(item) {
    return types2.described(types2.wrap_ulong(this.typecode), types2.wrap(item || this.content));
  };
  Section.prototype.collect_sections = function(sections) {
    if (this.multiple) {
      for (var i = 0; i < this.content.length; i++) {
        sections.push(this.described(this.content[i]));
      }
    } else {
      sections.push(this.described());
    }
  };
  define_composite_section({
    name: "header",
    code: 112,
    fields: [
      { name: "durable", type: "boolean", default_value: false },
      { name: "priority", type: "ubyte", default_value: 4 },
      { name: "ttl", type: "uint" },
      { name: "first_acquirer", type: "boolean", default_value: false },
      { name: "delivery_count", type: "uint", default_value: 0 }
    ]
  });
  define_map_section({ name: "delivery_annotations", code: 113 }, true);
  define_map_section({ name: "message_annotations", code: 114 }, true);
  define_composite_section({
    name: "properties",
    code: 115,
    fields: [
      { name: "message_id", type: "message_id" },
      { name: "user_id", type: "binary" },
      { name: "to", type: "string" },
      { name: "subject", type: "string" },
      { name: "reply_to", type: "string" },
      { name: "correlation_id", type: "message_id" },
      { name: "content_type", type: "symbol" },
      { name: "content_encoding", type: "symbol" },
      { name: "absolute_expiry_time", type: "timestamp" },
      { name: "creation_time", type: "timestamp" },
      { name: "group_id", type: "string" },
      { name: "group_sequence", type: "uint" },
      { name: "reply_to_group_id", type: "string" }
    ]
  });
  define_map_section({ name: "application_properties", code: 116 });
  function unwrap_body_section(msg, section, typecode) {
    if (msg.body === void 0) {
      msg.body = new Section(typecode, types2.unwrap(section));
    } else if (msg.body.constructor === Section && msg.body.typecode === typecode) {
      if (msg.body.multiple) {
        msg.body.content.push(types2.unwrap(section));
      } else {
        msg.body.multiple = true;
        msg.body.content = [msg.body.content, types2.unwrap(section)];
      }
    }
  }
  define_section({ numeric: 117, symbolic: "amqp:data:binary" }, function(msg, section) {
    unwrap_body_section(msg, section, 117);
  });
  define_section({ numeric: 118, symbolic: "amqp:amqp-sequence:list" }, function(msg, section) {
    unwrap_body_section(msg, section, 118);
  });
  define_section({ numeric: 119, symbolic: "amqp:value:*" }, function(msg, section) {
    msg.body = types2.unwrap(section);
  });
  define_map_section({ name: "footer", code: 120 });
  function wrap_body(sections, msg) {
    if (msg.body && msg.body.collect_sections) {
      msg.body.collect_sections(sections);
    } else {
      sections.push(types2.described(types2.wrap_ulong(119), types2.wrap(msg.body)));
    }
  }
  wrappers.push(wrap_body);
  message.data_section = function(data) {
    return new Section(117, data);
  };
  message.sequence_section = function(list) {
    return new Section(118, list);
  };
  message.data_sections = function(data_elements) {
    return new Section(117, data_elements, true);
  };
  message.sequence_sections = function(lists) {
    return new Section(118, lists, true);
  };
  function copy(src, tgt) {
    for (var k in src) {
      var v = src[k];
      if (typeof v === "object") {
        copy(v, tgt[k]);
      } else {
        tgt[k] = v;
      }
    }
  }
  function Message(o) {
    if (o) {
      copy(o, this);
    }
  }
  Message.prototype.toJSON = function() {
    var o = {};
    for (var key in this) {
      if (typeof this[key] === "function") continue;
      o[key] = this[key];
    }
    return o;
  };
  Message.prototype.toString = function() {
    return JSON.stringify(this.toJSON());
  };
  message.encode = function(msg) {
    var sections = [];
    wrappers.forEach(function(wrapper_fn) {
      wrapper_fn(sections, msg);
    });
    var writer = new types2.Writer();
    for (var i = 0; i < sections.length; i++) {
      log2.message("Encoding section %d of %d: %o", i + 1, sections.length, sections[i]);
      writer.write(sections[i]);
    }
    var data = writer.toBuffer();
    log2.message("encoded %d bytes", data.length);
    return data;
  };
  message.decode = function(buffer2) {
    var msg = new Message();
    var reader = new types2.Reader(buffer2);
    while (reader.remaining()) {
      var s = reader.read();
      log2.message("decoding section: %o of type: %o", s, s.descriptor);
      if (s.descriptor) {
        var unwrap = unwrappers[s.descriptor.value];
        if (unwrap) {
          unwrap(msg, s);
        } else {
          console.warn("WARNING: did not recognise message section with descriptor " + s.descriptor);
        }
      } else {
        console.warn("WARNING: expected described message section got " + JSON.stringify(s));
      }
    }
    return msg;
  };
  var outcomes = {};
  function define_outcome(def) {
    var c = types2.define_composite(def);
    c.composite_type = def.name;
    message[def.name] = c.create;
    outcomes[Number(c.descriptor.numeric).toString(10)] = c;
    outcomes[c.descriptor.symbolic] = c;
    message["is_" + def.name] = function(o) {
      if (o && o.descriptor) {
        var c2 = outcomes[o.descriptor.value];
        if (c2) {
          return c2.descriptor.numeric === def.code;
        }
      }
      return false;
    };
  }
  message.unwrap_outcome = function(outcome) {
    if (outcome && outcome.descriptor) {
      var c = outcomes[outcome.descriptor.value];
      if (c) {
        return new c(outcome.value);
      }
    }
    console.error("unrecognised outcome: " + JSON.stringify(outcome));
    return outcome;
  };
  message.are_outcomes_equivalent = function(a, b) {
    if (a === void 0 && b === void 0) return true;
    else if (a === void 0 || b === void 0) return false;
    else return a.descriptor.value === b.descriptor.value && a.descriptor.value === 36;
  };
  define_outcome({
    name: "received",
    code: 35,
    fields: [
      { name: "section_number", type: "uint", mandatory: true },
      { name: "section_offset", type: "ulong", mandatory: true }
    ]
  });
  define_outcome({ name: "accepted", code: 36, fields: [] });
  define_outcome({ name: "rejected", code: 37, fields: [{ name: "error", type: "error" }] });
  define_outcome({ name: "released", code: 38, fields: [] });
  define_outcome({
    name: "modified",
    code: 39,
    fields: [
      { name: "delivery_failed", type: "boolean" },
      { name: "undeliverable_here", type: "boolean" },
      { name: "message_annotations", type: "symbolic_map" }
    ]
  });
  message_1 = message;
  return message_1;
}
var terminus_1;
var hasRequiredTerminus;
function requireTerminus() {
  if (hasRequiredTerminus) return terminus_1;
  hasRequiredTerminus = 1;
  var types2 = requireTypes();
  var terminus = {};
  var by_descriptor = {};
  function define_terminus(def) {
    var c = types2.define_composite(def);
    terminus[def.name] = c.create;
    by_descriptor[Number(c.descriptor.numeric).toString(10)] = c;
    by_descriptor[c.descriptor.symbolic] = c;
  }
  terminus.unwrap = function(field) {
    if (field && field.descriptor) {
      var c = by_descriptor[field.descriptor.value];
      if (c) {
        return new c(field.value);
      } else {
        console.warn("Unknown terminus: " + field.descriptor);
      }
    }
    return null;
  };
  define_terminus({
    name: "source",
    code: 40,
    fields: [
      { name: "address", type: "string" },
      { name: "durable", type: "uint", default_value: 0 },
      { name: "expiry_policy", type: "symbol", default_value: "session-end" },
      { name: "timeout", type: "uint", default_value: 0 },
      { name: "dynamic", type: "boolean", default_value: false },
      { name: "dynamic_node_properties", type: "symbolic_map" },
      { name: "distribution_mode", type: "symbol" },
      { name: "filter", type: "symbolic_map" },
      { name: "default_outcome", type: "*" },
      { name: "outcomes", type: "symbol", multiple: true },
      { name: "capabilities", type: "symbol", multiple: true }
    ]
  });
  define_terminus({
    name: "target",
    code: 41,
    fields: [
      { name: "address", type: "string" },
      { name: "durable", type: "uint", default_value: 0 },
      { name: "expiry_policy", type: "symbol", default_value: "session-end" },
      { name: "timeout", type: "uint", default_value: 0 },
      { name: "dynamic", type: "boolean", default_value: false },
      { name: "dynamic_node_properties", type: "symbolic_map" },
      { name: "capabilities", type: "symbol", multiple: true }
    ]
  });
  terminus_1 = terminus;
  return terminus_1;
}
var events = { exports: {} };
var hasRequiredEvents;
function requireEvents() {
  if (hasRequiredEvents) return events.exports;
  hasRequiredEvents = 1;
  var R = typeof Reflect === "object" ? Reflect : null;
  var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  };
  var ReflectOwnKeys;
  if (R && typeof R.ownKeys === "function") {
    ReflectOwnKeys = R.ownKeys;
  } else if (Object.getOwnPropertySymbols) {
    ReflectOwnKeys = function ReflectOwnKeys2(target) {
      return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
    };
  } else {
    ReflectOwnKeys = function ReflectOwnKeys2(target) {
      return Object.getOwnPropertyNames(target);
    };
  }
  function ProcessEmitWarning(warning) {
    if (console && console.warn) console.warn(warning);
  }
  var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
    return value !== value;
  };
  function EventEmitter() {
    EventEmitter.init.call(this);
  }
  events.exports = EventEmitter;
  events.exports.once = once;
  EventEmitter.EventEmitter = EventEmitter;
  EventEmitter.prototype._events = void 0;
  EventEmitter.prototype._eventsCount = 0;
  EventEmitter.prototype._maxListeners = void 0;
  var defaultMaxListeners = 10;
  function checkListener(listener) {
    if (typeof listener !== "function") {
      throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
    }
  }
  Object.defineProperty(EventEmitter, "defaultMaxListeners", {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
      }
      defaultMaxListeners = arg;
    }
  });
  EventEmitter.init = function() {
    if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
    }
    this._maxListeners = this._maxListeners || void 0;
  };
  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
      throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
    }
    this._maxListeners = n;
    return this;
  };
  function _getMaxListeners(that) {
    if (that._maxListeners === void 0)
      return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }
  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return _getMaxListeners(this);
  };
  EventEmitter.prototype.emit = function emit(type2) {
    var args = [];
    for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
    var doError = type2 === "error";
    var events2 = this._events;
    if (events2 !== void 0)
      doError = doError && events2.error === void 0;
    else if (!doError)
      return false;
    if (doError) {
      var er;
      if (args.length > 0)
        er = args[0];
      if (er instanceof Error) {
        throw er;
      }
      var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
      err.context = er;
      throw err;
    }
    var handler = events2[type2];
    if (handler === void 0)
      return false;
    if (typeof handler === "function") {
      ReflectApply(handler, this, args);
    } else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        ReflectApply(listeners[i], this, args);
    }
    return true;
  };
  function _addListener(target, type2, listener, prepend) {
    var m;
    var events2;
    var existing;
    checkListener(listener);
    events2 = target._events;
    if (events2 === void 0) {
      events2 = target._events = /* @__PURE__ */ Object.create(null);
      target._eventsCount = 0;
    } else {
      if (events2.newListener !== void 0) {
        target.emit(
          "newListener",
          type2,
          listener.listener ? listener.listener : listener
        );
        events2 = target._events;
      }
      existing = events2[type2];
    }
    if (existing === void 0) {
      existing = events2[type2] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === "function") {
        existing = events2[type2] = prepend ? [listener, existing] : [existing, listener];
      } else if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
      m = _getMaxListeners(target);
      if (m > 0 && existing.length > m && !existing.warned) {
        existing.warned = true;
        var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type2) + " listeners added. Use emitter.setMaxListeners() to increase limit");
        w.name = "MaxListenersExceededWarning";
        w.emitter = target;
        w.type = type2;
        w.count = existing.length;
        ProcessEmitWarning(w);
      }
    }
    return target;
  }
  EventEmitter.prototype.addListener = function addListener(type2, listener) {
    return _addListener(this, type2, listener, false);
  };
  EventEmitter.prototype.on = EventEmitter.prototype.addListener;
  EventEmitter.prototype.prependListener = function prependListener(type2, listener) {
    return _addListener(this, type2, listener, true);
  };
  function onceWrapper() {
    if (!this.fired) {
      this.target.removeListener(this.type, this.wrapFn);
      this.fired = true;
      if (arguments.length === 0)
        return this.listener.call(this.target);
      return this.listener.apply(this.target, arguments);
    }
  }
  function _onceWrap(target, type2, listener) {
    var state = { fired: false, wrapFn: void 0, target, type: type2, listener };
    var wrapped = onceWrapper.bind(state);
    wrapped.listener = listener;
    state.wrapFn = wrapped;
    return wrapped;
  }
  EventEmitter.prototype.once = function once2(type2, listener) {
    checkListener(listener);
    this.on(type2, _onceWrap(this, type2, listener));
    return this;
  };
  EventEmitter.prototype.prependOnceListener = function prependOnceListener(type2, listener) {
    checkListener(listener);
    this.prependListener(type2, _onceWrap(this, type2, listener));
    return this;
  };
  EventEmitter.prototype.removeListener = function removeListener(type2, listener) {
    var list, events2, position, i, originalListener;
    checkListener(listener);
    events2 = this._events;
    if (events2 === void 0)
      return this;
    list = events2[type2];
    if (list === void 0)
      return this;
    if (list === listener || list.listener === listener) {
      if (--this._eventsCount === 0)
        this._events = /* @__PURE__ */ Object.create(null);
      else {
        delete events2[type2];
        if (events2.removeListener)
          this.emit("removeListener", type2, list.listener || listener);
      }
    } else if (typeof list !== "function") {
      position = -1;
      for (i = list.length - 1; i >= 0; i--) {
        if (list[i] === listener || list[i].listener === listener) {
          originalListener = list[i].listener;
          position = i;
          break;
        }
      }
      if (position < 0)
        return this;
      if (position === 0)
        list.shift();
      else {
        spliceOne(list, position);
      }
      if (list.length === 1)
        events2[type2] = list[0];
      if (events2.removeListener !== void 0)
        this.emit("removeListener", type2, originalListener || listener);
    }
    return this;
  };
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
  EventEmitter.prototype.removeAllListeners = function removeAllListeners(type2) {
    var listeners, events2, i;
    events2 = this._events;
    if (events2 === void 0)
      return this;
    if (events2.removeListener === void 0) {
      if (arguments.length === 0) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      } else if (events2[type2] !== void 0) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else
          delete events2[type2];
      }
      return this;
    }
    if (arguments.length === 0) {
      var keys = Object.keys(events2);
      var key;
      for (i = 0; i < keys.length; ++i) {
        key = keys[i];
        if (key === "removeListener") continue;
        this.removeAllListeners(key);
      }
      this.removeAllListeners("removeListener");
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
      return this;
    }
    listeners = events2[type2];
    if (typeof listeners === "function") {
      this.removeListener(type2, listeners);
    } else if (listeners !== void 0) {
      for (i = listeners.length - 1; i >= 0; i--) {
        this.removeListener(type2, listeners[i]);
      }
    }
    return this;
  };
  function _listeners(target, type2, unwrap) {
    var events2 = target._events;
    if (events2 === void 0)
      return [];
    var evlistener = events2[type2];
    if (evlistener === void 0)
      return [];
    if (typeof evlistener === "function")
      return unwrap ? [evlistener.listener || evlistener] : [evlistener];
    return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
  }
  EventEmitter.prototype.listeners = function listeners(type2) {
    return _listeners(this, type2, true);
  };
  EventEmitter.prototype.rawListeners = function rawListeners(type2) {
    return _listeners(this, type2, false);
  };
  EventEmitter.listenerCount = function(emitter, type2) {
    if (typeof emitter.listenerCount === "function") {
      return emitter.listenerCount(type2);
    } else {
      return listenerCount.call(emitter, type2);
    }
  };
  EventEmitter.prototype.listenerCount = listenerCount;
  function listenerCount(type2) {
    var events2 = this._events;
    if (events2 !== void 0) {
      var evlistener = events2[type2];
      if (typeof evlistener === "function") {
        return 1;
      } else if (evlistener !== void 0) {
        return evlistener.length;
      }
    }
    return 0;
  }
  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
  };
  function arrayClone(arr, n) {
    var copy = new Array(n);
    for (var i = 0; i < n; ++i)
      copy[i] = arr[i];
    return copy;
  }
  function spliceOne(list, index) {
    for (; index + 1 < list.length; index++)
      list[index] = list[index + 1];
    list.pop();
  }
  function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }
    return ret;
  }
  function once(emitter, name) {
    return new Promise(function(resolve, reject) {
      function errorListener(err) {
        emitter.removeListener(name, resolver);
        reject(err);
      }
      function resolver() {
        if (typeof emitter.removeListener === "function") {
          emitter.removeListener("error", errorListener);
        }
        resolve([].slice.call(arguments));
      }
      eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
      if (name !== "error") {
        addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
      }
    });
  }
  function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
    if (typeof emitter.on === "function") {
      eventTargetAgnosticAddListener(emitter, "error", handler, flags);
    }
  }
  function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
    if (typeof emitter.on === "function") {
      if (flags.once) {
        emitter.once(name, listener);
      } else {
        emitter.on(name, listener);
      }
    } else if (typeof emitter.addEventListener === "function") {
      emitter.addEventListener(name, function wrapListener(arg) {
        if (flags.once) {
          emitter.removeEventListener(name, wrapListener);
        }
        listener(arg);
      });
    } else {
      throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
    }
  }
  return events.exports;
}
var link_1;
var hasRequiredLink;
function requireLink() {
  if (hasRequiredLink) return link_1;
  hasRequiredLink = 1;
  var frames = requireFrames();
  var log2 = requireLog();
  var message = requireMessage();
  var terminus = requireTerminus();
  var EndpointState = requireEndpoint();
  var FlowController = function(window2) {
    this.window = window2;
  };
  FlowController.prototype.update = function(context) {
    var delta = this.window - context.receiver.credit;
    if (delta >= this.window / 4) {
      context.receiver.flow(delta);
    }
  };
  function auto_settle(context) {
    context.delivery.settled = true;
  }
  function auto_accept(context) {
    context.delivery.update(void 0, message.accepted().described());
  }
  function LinkError(message2, condition, link2) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.message = message2;
    this.condition = condition;
    this.description = message2;
    Object.defineProperty(this, "link", { value: link2 });
  }
  requireUtil$1().inherits(LinkError, Error);
  var EventEmitter = requireEvents().EventEmitter;
  var link = Object.create(EventEmitter.prototype);
  link.dispatch = function(name) {
    log2.events("[%s] Link got event: %s", this.connection.options.id, name);
    EventEmitter.prototype.emit.apply(this.observers, arguments);
    if (this.listeners(name).length) {
      EventEmitter.prototype.emit.apply(this, arguments);
      return true;
    } else {
      return this.session.dispatch.apply(this.session, arguments);
    }
  };
  link.set_source = function(fields) {
    this.local.attach.source = terminus.source(fields).described();
  };
  link.set_target = function(fields) {
    this.local.attach.target = terminus.target(fields).described();
  };
  link.attach = function() {
    if (this.state.open()) {
      this.connection._register();
    }
  };
  link.open = link.attach;
  link.detach = function() {
    this.local.detach.closed = false;
    if (this.state.close()) {
      this.connection._register();
    }
  };
  link.close = function(error) {
    if (error) this.local.detach.error = error;
    this.local.detach.closed = true;
    if (this.state.close()) {
      this.connection._register();
    }
  };
  link.remove = function() {
    this.session.remove_link(this);
  };
  link.is_open = function() {
    return this.session.is_open() && this.state.is_open();
  };
  link.is_remote_open = function() {
    return this.session.is_remote_open() && this.state.remote_open;
  };
  link.is_itself_closed = function() {
    return this.state.is_closed();
  };
  link.is_closed = function() {
    return this.session.is_closed() || this.is_itself_closed();
  };
  link._process = function() {
    do {
      if (this.state.need_open()) {
        this.session.output(this.local.attach);
      }
      if (this.issue_flow && this.state.local_open) {
        this.session._write_flow(this);
        this.issue_flow = false;
      }
      if (this.state.need_close()) {
        this.session.output(this.local.detach);
      }
    } while (!this.state.has_settled());
  };
  link.on_attach = function(frame) {
    if (this.state.remote_opened()) {
      if (!this.remote.handle) {
        this.remote.handle = frame.handle;
      }
      frame.performative.source = terminus.unwrap(frame.performative.source);
      frame.performative.target = terminus.unwrap(frame.performative.target);
      this.remote.attach = frame.performative;
      this.open();
      this.dispatch(this.is_receiver() ? "receiver_open" : "sender_open", this._context());
    } else {
      throw Error("Attach already received");
    }
  };
  link.prefix_event = function(event) {
    return (this.local.attach.role ? "receiver_" : "sender_") + event;
  };
  link.on_detach = function(frame) {
    if (this.state.remote_closed()) {
      if (this._incomplete) {
        this._incomplete.settled = true;
      }
      this.remote.detach = frame.performative;
      var error = this.remote.detach.error;
      if (error) {
        var handled = this.dispatch(this.prefix_event("error"), this._context());
        handled = this.dispatch(this.prefix_event("close"), this._context()) || handled;
        if (!handled) {
          EventEmitter.prototype.emit.call(this.connection.container, "error", new LinkError(error.description, error.condition, this));
        }
      } else {
        this.dispatch(this.prefix_event("close"), this._context());
      }
      var self2 = this;
      var token = this.state.mark();
      process$1.nextTick(function() {
        if (self2.state.marker === token) {
          self2.close();
          process$1.nextTick(function() {
            self2.remove();
          });
        }
      });
    } else {
      throw Error("Detach already received");
    }
  };
  function is_internal(name) {
    switch (name) {
      case "name":
      case "handle":
      case "role":
      case "initial_delivery_count":
        return true;
      default:
        return false;
    }
  }
  var aliases = [
    "snd_settle_mode",
    "rcv_settle_mode",
    "source",
    "target",
    "max_message_size",
    "offered_capabilities",
    "desired_capabilities",
    "properties"
  ];
  function remote_property_shortcut(name) {
    return function() {
      return this.remote.attach ? this.remote.attach[name] : void 0;
    };
  }
  link.init = function(session2, name, local_handle, opts, is_receiver) {
    this.session = session2;
    this.connection = session2.connection;
    this.name = name;
    this.options = opts === void 0 ? {} : opts;
    this.state = new EndpointState();
    this.issue_flow = false;
    this.local = { "handle": local_handle };
    this.local.attach = frames.attach({ "handle": local_handle, "name": name, role: is_receiver });
    for (var field in this.local.attach) {
      if (!is_internal(field) && this.options[field] !== void 0) {
        this.local.attach[field] = this.options[field];
      }
    }
    this.local.detach = frames.detach({ "handle": local_handle, "closed": true });
    this.remote = { "handle": void 0 };
    this.delivery_count = 0;
    this.credit = 0;
    this.observers = new EventEmitter();
    var self2 = this;
    aliases.forEach(function(alias) {
      Object.defineProperty(self2, alias, { get: remote_property_shortcut(alias) });
    });
    Object.defineProperty(this, "error", { get: function() {
      return this.remote.detach ? this.remote.detach.error : void 0;
    } });
  };
  link._disconnect = function() {
    this.state.disconnected();
    if (!this.state.was_open) {
      this.remove();
    }
  };
  link._reconnect = function() {
    this.state.reconnect();
    this.remote = { "handle": void 0 };
    this.delivery_count = 0;
    this.credit = 0;
  };
  link.has_credit = function() {
    return this.credit > 0;
  };
  link.is_receiver = function() {
    return this.local.attach.role;
  };
  link.is_sender = function() {
    return !this.is_receiver();
  };
  link._context = function(c) {
    var context = c ? c : {};
    if (this.is_receiver()) {
      context.receiver = this;
    } else {
      context.sender = this;
    }
    return this.session._context(context);
  };
  link.get_option = function(name, default_value) {
    if (this.options[name] !== void 0) return this.options[name];
    else return this.session.get_option(name, default_value);
  };
  var Sender = function(session2, name, local_handle, opts) {
    this.init(session2, name, local_handle, opts, false);
    this._draining = false;
    this._drained = false;
    this.local.attach.initial_delivery_count = 0;
    this.tag = 0;
    if (this.get_option("autosettle", true)) {
      this.observers.on("settled", auto_settle);
    }
    var sender = this;
    if (this.get_option("treat_modified_as_released", true)) {
      this.observers.on("modified", function(context) {
        sender.dispatch("released", context);
      });
    }
  };
  Sender.prototype = Object.create(link);
  Sender.prototype.constructor = Sender;
  Sender.prototype._get_drain = function() {
    if (this._draining && this._drained && this.credit) {
      while (this.credit) {
        ++this.delivery_count;
        --this.credit;
      }
      return true;
    } else {
      return false;
    }
  };
  Sender.prototype.set_drained = function(drained) {
    this._drained = drained;
    if (this._draining && this._drained) {
      this.issue_flow = true;
    }
  };
  Sender.prototype.next_tag = function() {
    return Buffer.from(new String(this.tag++));
  };
  Sender.prototype.sendable = function() {
    return Boolean(this.credit && this.session.outgoing.available());
  };
  Sender.prototype.on_flow = function(frame) {
    var flow = frame.performative;
    this.credit = flow.delivery_count + flow.link_credit - this.delivery_count;
    this._draining = flow.drain;
    this._drained = this.credit > 0;
    if (this.is_open()) {
      this.dispatch("sender_flow", this._context());
      if (this._draining) {
        this.dispatch("sender_draining", this._context());
      }
      if (this.sendable()) {
        this.dispatch("sendable", this._context());
      }
    }
  };
  Sender.prototype.on_transfer = function() {
    throw Error("got transfer on sending link");
  };
  Sender.prototype.send = function(msg, tag, format) {
    var payload = format === void 0 ? message.encode(msg) : msg;
    var delivery = this.session.send(this, tag ? tag : this.next_tag(), payload, format);
    if (this.local.attach.snd_settle_mode === 1) {
      delivery.settled = true;
    }
    return delivery;
  };
  var Receiver = function(session2, name, local_handle, opts) {
    this.init(session2, name, local_handle, opts, true);
    this.drain = false;
    this.set_credit_window(this.get_option("credit_window", 1e3));
    if (this.get_option("autoaccept", true)) {
      this.observers.on("message", auto_accept);
    }
    if (this.local.attach.rcv_settle_mode === 1 && this.get_option("autosettle", true)) {
      this.observers.on("settled", auto_settle);
    }
  };
  Receiver.prototype = Object.create(link);
  Receiver.prototype.constructor = Receiver;
  Receiver.prototype.on_flow = function(frame) {
    this.dispatch("receiver_flow", this._context());
    if (frame.performative.drain) {
      this.credit = frame.performative.link_credit;
      this.delivery_count = frame.performative.delivery_count;
      if (frame.performative.link_credit > 0) console.error("ERROR: received flow with drain set, but non zero credit");
      else this.dispatch("receiver_drained", this._context());
    }
  };
  Receiver.prototype.flow = function(credit) {
    if (credit > 0) {
      this.credit += credit;
      this.issue_flow = true;
      this.connection._register();
    }
  };
  Receiver.prototype.drain_credit = function() {
    this.drain = true;
    this.issue_flow = true;
    this.connection._register();
  };
  Receiver.prototype.add_credit = Receiver.prototype.flow;
  Receiver.prototype._get_drain = function() {
    return this.drain;
  };
  Receiver.prototype.set_credit_window = function(credit_window) {
    if (credit_window > 0) {
      var flow_controller = new FlowController(credit_window);
      var listener = flow_controller.update.bind(flow_controller);
      this.observers.on("message", listener);
      this.observers.on("receiver_open", listener);
    }
  };
  link_1 = { "Sender": Sender, "Receiver": Receiver };
  return link_1;
}
var session;
var hasRequiredSession;
function requireSession() {
  if (hasRequiredSession) return session;
  hasRequiredSession = 1;
  var frames = requireFrames();
  var link = requireLink();
  var log2 = requireLog();
  var message = requireMessage();
  var types2 = requireTypes();
  var util2 = requireUtil();
  var EndpointState = requireEndpoint();
  var EventEmitter = requireEvents().EventEmitter;
  var DEFAULT_BUFFER_SIZE = 2048;
  function SessionError(message2, condition, session2) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.message = message2;
    this.condition = condition;
    this.description = message2;
    Object.defineProperty(this, "session", { value: session2 });
  }
  requireUtil$1().inherits(SessionError, Error);
  var CircularBuffer = function(capacity) {
    this.capacity = capacity;
    this.size = 0;
    this.head = 0;
    this.tail = 0;
    this.entries = [];
  };
  CircularBuffer.prototype.available = function() {
    return this.capacity - this.size;
  };
  CircularBuffer.prototype.push = function(o) {
    if (this.size < this.capacity) {
      this.entries[this.tail] = o;
      this.tail = (this.tail + 1) % this.capacity;
      this.size++;
    } else {
      throw Error("circular buffer overflow: head=" + this.head + " tail=" + this.tail + " size=" + this.size + " capacity=" + this.capacity);
    }
  };
  CircularBuffer.prototype.pop_if = function(f) {
    var count = 0;
    while (this.size && f(this.entries[this.head])) {
      this.entries[this.head] = void 0;
      this.head = (this.head + 1) % this.capacity;
      this.size--;
      count++;
    }
    return count;
  };
  CircularBuffer.prototype.by_id = function(id) {
    if (this.size > 0) {
      var gap = id - this.entries[this.head].id;
      if (gap < this.size) {
        return this.entries[(this.head + gap) % this.capacity];
      }
    }
    return void 0;
  };
  CircularBuffer.prototype.get_head = function() {
    return this.size > 0 ? this.entries[this.head] : void 0;
  };
  CircularBuffer.prototype.get_tail = function() {
    return this.size > 0 ? this.entries[(this.head + this.size - 1) % this.capacity] : void 0;
  };
  function write_dispositions(deliveries) {
    var first, last, next_id, i, delivery;
    for (i = 0; i < deliveries.length; i++) {
      delivery = deliveries[i];
      if (first === void 0) {
        first = delivery;
        last = delivery;
        next_id = delivery.id;
      }
      if (first !== last && !message.are_outcomes_equivalent(last.state, delivery.state) || last.settled !== delivery.settled || next_id !== delivery.id) {
        first.link.session.output(frames.disposition({ "role": first.link.is_receiver(), "first": first.id, "last": last.id, "state": first.state, "settled": first.settled }));
        first = delivery;
        last = delivery;
        next_id = delivery.id;
      } else {
        if (last.id !== delivery.id) {
          last = delivery;
        }
        next_id++;
      }
    }
    if (first !== void 0 && last !== void 0) {
      first.link.session.output(frames.disposition({ "role": first.link.is_receiver(), "first": first.id, "last": last.id, "state": first.state, "settled": first.settled }));
    }
  }
  function validate_buffer_size(session_buffer_size) {
    if (session_buffer_size && Number.isInteger(Number(session_buffer_size))) {
      return Number(session_buffer_size);
    }
    return DEFAULT_BUFFER_SIZE;
  }
  function get_buffer_size(session_buffer_size, type2) {
    if (!session_buffer_size) {
      return DEFAULT_BUFFER_SIZE;
    }
    if (typeof session_buffer_size === "number") {
      return validate_buffer_size(session_buffer_size);
    }
    return validate_buffer_size(session_buffer_size[type2]);
  }
  var Outgoing = function(connection2, session_buffer_size) {
    this.deliveries = new CircularBuffer(get_buffer_size(session_buffer_size, "outgoing"));
    this.updated = [];
    this.pending_dispositions = [];
    this.next_delivery_id = 0;
    this.next_pending_delivery = 0;
    this.next_transfer_id = 0;
    this.window = types2.MAX_UINT;
    this.remote_next_transfer_id = void 0;
    this.remote_window = void 0;
    this.connection = connection2;
  };
  Outgoing.prototype.available = function() {
    return this.deliveries.available();
  };
  Outgoing.prototype.compute_max_payload = function(tag) {
    if (this.connection.max_frame_size) {
      return this.connection.max_frame_size - (50 + tag.length);
    } else {
      return void 0;
    }
  };
  Outgoing.prototype.send = function(sender, tag, data, format) {
    var fragments = [];
    var max_payload = this.compute_max_payload(tag);
    if (max_payload && data.length > max_payload) {
      var start = 0;
      while (start < data.length) {
        var end = Math.min(start + max_payload, data.length);
        fragments.push(data.slice(start, end));
        start = end;
      }
    } else {
      fragments.push(data);
    }
    var d = {
      "id": this.next_delivery_id++,
      "tag": tag,
      "link": sender,
      "data": fragments,
      "format": format ? format : 0,
      "next_to_send": 0,
      "sent": false,
      "settled": false,
      "state": void 0,
      "remote_settled": false,
      "remote_state": void 0
    };
    var self2 = this;
    d.update = function(settled, state) {
      self2.update(d, settled, state);
    };
    this.deliveries.push(d);
    return d;
  };
  Outgoing.prototype.on_begin = function(fields) {
    this.remote_window = fields.incoming_window;
  };
  Outgoing.prototype.on_flow = function(fields) {
    this.remote_next_transfer_id = fields.next_incoming_id;
    this.remote_window = fields.incoming_window;
  };
  Outgoing.prototype.on_disposition = function(fields) {
    var last = fields.last ? fields.last : fields.first;
    for (var i = fields.first; i <= last; i++) {
      var d = this.deliveries.by_id(i);
      if (d && !d.remote_settled) {
        var updated = false;
        if (fields.settled) {
          d.remote_settled = fields.settled;
          updated = true;
        }
        if (fields.state && fields.state !== d.remote_state) {
          d.remote_state = message.unwrap_outcome(fields.state);
          updated = true;
        }
        if (updated) {
          this.updated.push(d);
        }
      }
    }
  };
  Outgoing.prototype.update = function(delivery, settled, state) {
    if (delivery) {
      delivery.settled = settled;
      if (state !== void 0) delivery.state = state;
      if (!delivery.remote_settled) {
        this.pending_dispositions.push(delivery);
      }
      delivery.link.connection._register();
    }
  };
  Outgoing.prototype.transfer_window = function() {
    if (this.remote_window) {
      return this.remote_window - (this.next_transfer_id - this.remote_next_transfer_id);
    } else {
      return 0;
    }
  };
  Outgoing.prototype.process = function() {
    var d;
    while (this.next_pending_delivery < this.next_delivery_id) {
      d = this.deliveries.by_id(this.next_pending_delivery);
      if (d) {
        if (d.link.has_credit()) {
          const num_to_send = Math.min(this.transfer_window(), d.data.length - d.next_to_send);
          if (num_to_send > 0) {
            this.window -= num_to_send;
            const end_of_send = d.next_to_send + num_to_send;
            for (var i = d.next_to_send; i < end_of_send; i++) {
              this.next_transfer_id++;
              var more = i + 1 < d.data.length;
              var transfer = frames.transfer({ "handle": d.link.local.handle, "message_format": d.format, "delivery_id": d.id, "delivery_tag": d.tag, "settled": d.settled, "more": more });
              d.link.session.output(transfer, d.data[i]);
            }
            if (end_of_send < d.data.length) {
              d.next_to_send = end_of_send;
              break;
            } else {
              if (d.settled) {
                d.remote_settled = true;
              }
              d.link.credit--;
              d.link.delivery_count++;
              this.next_pending_delivery++;
            }
          } else {
            log2.flow(
              "[%s] Incoming window of peer preventing sending further transfers: remote_window=%d, remote_next_transfer_id=%d, next_transfer_id=%d",
              this.connection.options.id,
              this.remote_window,
              this.remote_next_transfer_id,
              this.next_transfer_id
            );
            break;
          }
        } else {
          log2.flow("[%s] Link has no credit", this.connection.options.id);
          break;
        }
      } else {
        console.error("ERROR: Next pending delivery not found: " + this.next_pending_delivery);
        break;
      }
    }
    for (var i = 0; i < this.updated.length; i++) {
      d = this.updated[i];
      if (d.remote_state && d.remote_state.constructor.composite_type) {
        d.link.dispatch(d.remote_state.constructor.composite_type, d.link._context({ "delivery": d }));
      }
      if (d.remote_settled) d.link.dispatch("settled", d.link._context({ "delivery": d }));
    }
    this.updated = [];
    if (this.pending_dispositions.length) {
      write_dispositions(this.pending_dispositions);
      this.pending_dispositions = [];
    }
    this.deliveries.pop_if(function(d2) {
      return d2.settled && d2.remote_settled;
    });
  };
  var Incoming = function(session_buffer_size) {
    this.deliveries = new CircularBuffer(get_buffer_size(session_buffer_size, "incoming"));
    this.updated = [];
    this.next_transfer_id = 0;
    this.next_delivery_id = void 0;
    Object.defineProperty(this, "window", { get: function() {
      return this.deliveries.available();
    } });
    this.remote_next_transfer_id = void 0;
    this.remote_window = void 0;
    this.max_transfer_id = this.next_transfer_id + this.window;
  };
  Incoming.prototype.update = function(delivery, settled, state) {
    if (delivery) {
      delivery.settled = settled;
      if (state !== void 0) delivery.state = state;
      if (!delivery.remote_settled) {
        this.updated.push(delivery);
      }
      delivery.link.connection._register();
    }
  };
  Incoming.prototype.on_transfer = function(frame, receiver) {
    this.next_transfer_id++;
    if (receiver.is_remote_open()) {
      if (this.next_delivery_id === void 0) {
        this.next_delivery_id = frame.performative.delivery_id;
      }
      var current;
      if (receiver._incomplete) {
        current = receiver._incomplete;
        if (util2.is_defined(frame.performative.delivery_id) && current.id !== frame.performative.delivery_id) {
          throw Error("frame sequence error: delivery " + current.id + " not complete, got " + frame.performative.delivery_id);
        }
        if (frame.payload) {
          current.frames.push(frame.payload);
        }
      } else if (this.next_delivery_id === frame.performative.delivery_id) {
        current = {
          "id": frame.performative.delivery_id,
          "tag": frame.performative.delivery_tag,
          "format": frame.performative.message_format,
          "link": receiver,
          "settled": false,
          "state": void 0,
          "remote_settled": frame.performative.settled === void 0 ? false : frame.performative.settled,
          "remote_state": frame.performative.state,
          "frames": [frame.payload]
        };
        var self2 = this;
        current.update = function(settled, state) {
          var settled_ = settled;
          if (settled_ === void 0) {
            settled_ = receiver.local.attach.rcv_settle_mode !== 1;
          }
          self2.update(current, settled_, state);
        };
        current.accept = function() {
          this.update(void 0, message.accepted().described());
        };
        current.release = function(params) {
          if (params) {
            this.update(void 0, message.modified(params).described());
          } else {
            this.update(void 0, message.released().described());
          }
        };
        current.reject = function(error) {
          this.update(void 0, message.rejected({ "error": error }).described());
        };
        current.modified = function(params) {
          this.update(void 0, message.modified(params).described());
        };
        this.deliveries.push(current);
        this.next_delivery_id++;
      } else {
        throw Error("frame sequence error: expected " + this.next_delivery_id + ", got " + frame.performative.delivery_id);
      }
      current.incomplete = frame.performative.more;
      if (current.incomplete) {
        receiver._incomplete = current;
      } else {
        receiver._incomplete = void 0;
        const data = current.frames.length === 1 ? current.frames[0] : Buffer.concat(current.frames);
        delete current.frames;
        if (receiver.credit > 0) receiver.credit--;
        else console.error("Received transfer when credit was %d", receiver.credit);
        receiver.delivery_count++;
        var msgctxt = current.format === 0 ? { "message": message.decode(data), "delivery": current } : { "message": data, "delivery": current, "format": current.format };
        receiver.dispatch("message", receiver._context(msgctxt));
      }
    } else {
      throw Error("transfer after detach");
    }
  };
  Incoming.prototype.process = function(session2) {
    if (this.updated.length > 0) {
      write_dispositions(this.updated);
      this.updated = [];
    }
    this.deliveries.pop_if(function(d) {
      return d.settled;
    });
    if (this.max_transfer_id - this.next_transfer_id < this.window / 2) {
      session2._write_flow();
    }
  };
  Incoming.prototype.on_begin = function(fields) {
    this.next_transfer_id = fields.next_outgoing_id;
    this.remote_window = fields.outgoing_window;
    this.remote_next_transfer_id = fields.next_outgoing_id;
  };
  Incoming.prototype.on_flow = function(fields) {
    this.next_transfer_id = fields.next_outgoing_id;
    this.remote_next_transfer_id = fields.next_outgoing_id;
    this.remote_window = fields.outgoing_window;
  };
  Incoming.prototype.on_disposition = function(fields) {
    var last = fields.last ? fields.last : fields.first;
    for (var i = fields.first; i <= last; i++) {
      var d = this.deliveries.by_id(i);
      if (d && !d.remote_settled) {
        if (fields.state && fields.state !== d.remote_state) {
          d.remote_state = message.unwrap_outcome(fields.state);
        }
        if (fields.settled) {
          d.remote_settled = fields.settled;
          d.link.dispatch("settled", d.link._context({ "delivery": d }));
        }
      }
    }
  };
  var Session = function(connection2, local_channel, session_buffer_size) {
    this.connection = connection2;
    this.session_buffer_size = session_buffer_size;
    this.outgoing = new Outgoing(connection2, session_buffer_size);
    this.incoming = new Incoming(session_buffer_size);
    this.state = new EndpointState();
    this.local = { "channel": local_channel, "handles": {} };
    this.local.begin = frames.begin({ next_outgoing_id: this.outgoing.next_transfer_id, incoming_window: this.incoming.window, outgoing_window: this.outgoing.window });
    this.local.end = frames.end();
    this.remote = { "handles": {} };
    this.links = {};
    this.options = {};
    Object.defineProperty(this, "error", { get: function() {
      return this.remote.end ? this.remote.end.error : void 0;
    } });
    this.observers = new EventEmitter();
  };
  Session.prototype = Object.create(EventEmitter.prototype);
  Session.prototype.constructor = Session;
  Session.prototype._disconnect = function() {
    this.state.disconnected();
    for (var l in this.links) {
      this.links[l]._disconnect();
    }
    if (!this.state.was_open) {
      this.remove();
    }
  };
  Session.prototype._reconnect = function() {
    this.state.reconnect();
    this.outgoing = new Outgoing(this.connection, this.session_buffer_size);
    this.incoming = new Incoming(this.session_buffer_size);
    this.remote = { "handles": {} };
    for (var l in this.links) {
      this.links[l]._reconnect();
    }
  };
  Session.prototype.dispatch = function(name) {
    log2.events("[%s] Session got event: %s", this.connection.options.id, name);
    EventEmitter.prototype.emit.apply(this.observers, arguments);
    if (this.listeners(name).length) {
      EventEmitter.prototype.emit.apply(this, arguments);
      return true;
    } else {
      return this.connection.dispatch.apply(this.connection, arguments);
    }
  };
  Session.prototype.output = function(frame, payload) {
    this.connection._write_frame(this.local.channel, frame, payload);
  };
  Session.prototype.create_sender = function(name, opts) {
    if (!opts) {
      opts = this.get_option("sender_options", {});
    }
    return this.create_link(name, link.Sender, opts);
  };
  Session.prototype.create_receiver = function(name, opts) {
    if (!opts) {
      opts = this.get_option("receiver_options", {});
    }
    return this.create_link(name, link.Receiver, opts);
  };
  function merge(defaults, specific) {
    for (var f in specific) {
      if (f === "properties" && defaults.properties) {
        merge(defaults.properties, specific.properties);
      } else {
        defaults[f] = specific[f];
      }
    }
  }
  function attach(factory, args, remote_terminus, default_args) {
    var opts = Object.create(default_args || {});
    if (typeof args === "string") {
      opts[remote_terminus] = args;
    } else if (args) {
      merge(opts, args);
    }
    if (!opts.name) opts.name = util2.generate_uuid();
    var l = factory(opts.name, opts);
    for (var t in { "source": 0, "target": 0 }) {
      if (opts[t]) {
        if (typeof opts[t] === "string") {
          opts[t] = { "address": opts[t] };
        }
        l["set_" + t](opts[t]);
      }
    }
    if (l.is_sender() && opts.source === void 0) {
      opts.source = l.set_source({});
    }
    if (l.is_receiver() && opts.target === void 0) {
      opts.target = l.set_target({});
    }
    l.attach();
    return l;
  }
  Session.prototype.get_option = function(name, default_value) {
    if (this.options[name] !== void 0) return this.options[name];
    else return this.connection.get_option(name, default_value);
  };
  Session.prototype.attach_sender = function(args) {
    return attach(this.create_sender.bind(this), args, "target", this.get_option("sender_options", {}));
  };
  Session.prototype.open_sender = Session.prototype.attach_sender;
  Session.prototype.attach_receiver = function(args) {
    return attach(this.create_receiver.bind(this), args, "source", this.get_option("receiver_options", {}));
  };
  Session.prototype.open_receiver = Session.prototype.attach_receiver;
  Session.prototype.find_sender = function(filter2) {
    return this.find_link(util2.sender_filter(filter2));
  };
  Session.prototype.find_receiver = function(filter2) {
    return this.find_link(util2.receiver_filter(filter2));
  };
  Session.prototype.find_link = function(filter2) {
    for (var name in this.links) {
      var link2 = this.links[name];
      if (filter2(link2)) return link2;
    }
    return void 0;
  };
  Session.prototype.each_receiver = function(action, filter2) {
    this.each_link(action, util2.receiver_filter(filter2));
  };
  Session.prototype.each_sender = function(action, filter2) {
    this.each_link(action, util2.sender_filter(filter2));
  };
  Session.prototype.each_link = function(action, filter2) {
    for (var name in this.links) {
      var link2 = this.links[name];
      if (filter2 === void 0 || filter2(link2)) action(link2);
    }
  };
  Session.prototype.create_link = function(name, constructor, opts) {
    var i = 0;
    while (this.local.handles[i]) i++;
    var l = new constructor(this, name, i, opts);
    this.links[name] = l;
    this.local.handles[i] = l;
    return l;
  };
  Session.prototype.begin = function() {
    if (this.state.open()) {
      this.connection._register();
    }
  };
  Session.prototype.open = Session.prototype.begin;
  Session.prototype.end = function(error) {
    if (error) this.local.end.error = error;
    if (this.state.close()) {
      this.connection._register();
    }
  };
  Session.prototype.close = Session.prototype.end;
  Session.prototype.is_open = function() {
    return this.connection.is_open() && this.state.is_open();
  };
  Session.prototype.is_remote_open = function() {
    return this.connection.is_remote_open() && this.state.remote_open;
  };
  Session.prototype.is_itself_closed = function() {
    return this.state.is_closed();
  };
  Session.prototype.is_closed = function() {
    return this.connection.is_closed() || this.is_itself_closed();
  };
  function notify_sendable(sender) {
    sender.dispatch("sendable", sender._context());
  }
  function is_sender_sendable(sender) {
    return sender.is_open() && sender.sendable();
  }
  Session.prototype._process = function() {
    do {
      if (this.state.need_open()) {
        this.output(this.local.begin);
      }
      var was_blocked = this.outgoing.deliveries.available() === 0;
      this.outgoing.process();
      if (was_blocked && this.outgoing.deliveries.available()) {
        this.each_sender(notify_sendable, is_sender_sendable);
      }
      this.incoming.process(this);
      for (var k in this.links) {
        this.links[k]._process();
      }
      if (this.state.need_close()) {
        this.output(this.local.end);
      }
    } while (!this.state.has_settled());
  };
  Session.prototype.send = function(sender, tag, data, format) {
    var d = this.outgoing.send(sender, tag, data, format);
    this.connection._register();
    return d;
  };
  Session.prototype._write_flow = function(link2) {
    var fields = {
      "next_incoming_id": this.incoming.next_transfer_id >>> 0,
      "incoming_window": this.incoming.window,
      "next_outgoing_id": this.outgoing.next_transfer_id >>> 0,
      "outgoing_window": this.outgoing.window
    };
    this.incoming.max_transfer_id = fields.next_incoming_id + fields.incoming_window;
    if (link2) {
      if (link2._get_drain()) fields.drain = true;
      fields.delivery_count = link2.delivery_count;
      fields.handle = link2.local.handle;
      fields.link_credit = link2.credit;
    }
    this.output(frames.flow(fields));
  };
  Session.prototype.on_begin = function(frame) {
    if (this.state.remote_opened()) {
      if (!this.remote.channel) {
        this.remote.channel = frame.channel;
      }
      this.remote.begin = frame.performative;
      this.outgoing.on_begin(frame.performative);
      this.incoming.on_begin(frame.performative);
      this.open();
      this.dispatch("session_open", this._context());
    } else {
      throw Error("Begin already received");
    }
  };
  Session.prototype.on_end = function(frame) {
    if (this.state.remote_closed()) {
      this.remote.end = frame.performative;
      var error = this.remote.end.error;
      if (error) {
        var handled = this.dispatch("session_error", this._context());
        handled = this.dispatch("session_close", this._context()) || handled;
        if (!handled) {
          EventEmitter.prototype.emit.call(this.connection.container, "error", new SessionError(error.description, error.condition, this));
        }
      } else {
        this.dispatch("session_close", this._context());
      }
      var self2 = this;
      var token = this.state.mark();
      process$1.nextTick(function() {
        if (self2.state.marker === token) {
          self2.close();
          process$1.nextTick(function() {
            self2.remove();
          });
        }
      });
    } else {
      throw Error("End already received");
    }
  };
  Session.prototype.on_attach = function(frame) {
    var name = frame.performative.name;
    var link2 = this.links[name];
    if (!link2) {
      link2 = frame.performative.role ? this.create_sender(name) : this.create_receiver(name);
    }
    this.remote.handles[frame.performative.handle] = link2;
    link2.on_attach(frame);
    link2.remote.attach = frame.performative;
  };
  Session.prototype.on_disposition = function(frame) {
    if (frame.performative.role) {
      log2.events("[%s] Received disposition for outgoing transfers", this.connection.options.id);
      this.outgoing.on_disposition(frame.performative);
    } else {
      log2.events("[%s] Received disposition for incoming transfers", this.connection.options.id);
      this.incoming.on_disposition(frame.performative);
    }
    this.connection._register();
  };
  Session.prototype.on_flow = function(frame) {
    this.outgoing.on_flow(frame.performative);
    this.incoming.on_flow(frame.performative);
    if (util2.is_defined(frame.performative.handle)) {
      this._get_link(frame).on_flow(frame);
    }
    this.connection._register();
  };
  Session.prototype._context = function(c) {
    var context = c ? c : {};
    context.session = this;
    return this.connection._context(context);
  };
  Session.prototype._get_link = function(frame) {
    var handle = frame.performative.handle;
    var link2 = this.remote.handles[handle];
    if (!link2) {
      throw Error("Invalid handle " + handle);
    }
    return link2;
  };
  Session.prototype.on_detach = function(frame) {
    this._get_link(frame).on_detach(frame);
  };
  Session.prototype.remove_link = function(link2) {
    delete this.remote.handles[link2.remote.handle];
    delete this.local.handles[link2.local.handle];
    delete this.links[link2.name];
  };
  Session.prototype.remove = function() {
    this.connection.remove_session(this);
  };
  Session.prototype.on_transfer = function(frame) {
    this.incoming.on_transfer(frame, this._get_link(frame));
  };
  session = Session;
  return session;
}
var empty = null;
const empty$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: empty
}, Symbol.toStringTag, { value: "Module" }));
const require$$6 = /* @__PURE__ */ getAugmentedNamespace(empty$1);
var browser = {};
var hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser) return browser;
  hasRequiredBrowser = 1;
  browser.endianness = function() {
    return "LE";
  };
  browser.hostname = function() {
    if (typeof location !== "undefined") {
      return location.hostname;
    } else return "";
  };
  browser.loadavg = function() {
    return [];
  };
  browser.uptime = function() {
    return 0;
  };
  browser.freemem = function() {
    return Number.MAX_VALUE;
  };
  browser.totalmem = function() {
    return Number.MAX_VALUE;
  };
  browser.cpus = function() {
    return [];
  };
  browser.type = function() {
    return "Browser";
  };
  browser.release = function() {
    if (typeof navigator !== "undefined") {
      return navigator.appVersion;
    }
    return "";
  };
  browser.networkInterfaces = browser.getNetworkInterfaces = function() {
    return {};
  };
  browser.arch = function() {
    return "javascript";
  };
  browser.platform = function() {
    return "browser";
  };
  browser.tmpdir = browser.tmpDir = function() {
    return "/tmp";
  };
  browser.EOL = "\n";
  browser.homedir = function() {
    return "/";
  };
  return browser;
}
var pathBrowserify;
var hasRequiredPathBrowserify;
function requirePathBrowserify() {
  if (hasRequiredPathBrowserify) return pathBrowserify;
  hasRequiredPathBrowserify = 1;
  function assertPath(path) {
    if (typeof path !== "string") {
      throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
    }
  }
  function normalizeStringPosix(path, allowAboveRoot) {
    var res = "";
    var lastSegmentLength = 0;
    var lastSlash = -1;
    var dots = 0;
    var code2;
    for (var i = 0; i <= path.length; ++i) {
      if (i < path.length)
        code2 = path.charCodeAt(i);
      else if (code2 === 47)
        break;
      else
        code2 = 47;
      if (code2 === 47) {
        if (lastSlash === i - 1 || dots === 1) ;
        else if (lastSlash !== i - 1 && dots === 2) {
          if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
            if (res.length > 2) {
              var lastSlashIndex = res.lastIndexOf("/");
              if (lastSlashIndex !== res.length - 1) {
                if (lastSlashIndex === -1) {
                  res = "";
                  lastSegmentLength = 0;
                } else {
                  res = res.slice(0, lastSlashIndex);
                  lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
                }
                lastSlash = i;
                dots = 0;
                continue;
              }
            } else if (res.length === 2 || res.length === 1) {
              res = "";
              lastSegmentLength = 0;
              lastSlash = i;
              dots = 0;
              continue;
            }
          }
          if (allowAboveRoot) {
            if (res.length > 0)
              res += "/..";
            else
              res = "..";
            lastSegmentLength = 2;
          }
        } else {
          if (res.length > 0)
            res += "/" + path.slice(lastSlash + 1, i);
          else
            res = path.slice(lastSlash + 1, i);
          lastSegmentLength = i - lastSlash - 1;
        }
        lastSlash = i;
        dots = 0;
      } else if (code2 === 46 && dots !== -1) {
        ++dots;
      } else {
        dots = -1;
      }
    }
    return res;
  }
  function _format(sep, pathObject) {
    var dir = pathObject.dir || pathObject.root;
    var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir) {
      return base;
    }
    if (dir === pathObject.root) {
      return dir + base;
    }
    return dir + sep + base;
  }
  var posix = {
    // path.resolve([from ...], to)
    resolve: function resolve() {
      var resolvedPath = "";
      var resolvedAbsolute = false;
      var cwd;
      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path;
        if (i >= 0)
          path = arguments[i];
        else {
          if (cwd === void 0)
            cwd = process$1.cwd();
          path = cwd;
        }
        assertPath(path);
        if (path.length === 0) {
          continue;
        }
        resolvedPath = path + "/" + resolvedPath;
        resolvedAbsolute = path.charCodeAt(0) === 47;
      }
      resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
      if (resolvedAbsolute) {
        if (resolvedPath.length > 0)
          return "/" + resolvedPath;
        else
          return "/";
      } else if (resolvedPath.length > 0) {
        return resolvedPath;
      } else {
        return ".";
      }
    },
    normalize: function normalize(path) {
      assertPath(path);
      if (path.length === 0) return ".";
      var isAbsolute = path.charCodeAt(0) === 47;
      var trailingSeparator = path.charCodeAt(path.length - 1) === 47;
      path = normalizeStringPosix(path, !isAbsolute);
      if (path.length === 0 && !isAbsolute) path = ".";
      if (path.length > 0 && trailingSeparator) path += "/";
      if (isAbsolute) return "/" + path;
      return path;
    },
    isAbsolute: function isAbsolute(path) {
      assertPath(path);
      return path.length > 0 && path.charCodeAt(0) === 47;
    },
    join: function join() {
      if (arguments.length === 0)
        return ".";
      var joined;
      for (var i = 0; i < arguments.length; ++i) {
        var arg = arguments[i];
        assertPath(arg);
        if (arg.length > 0) {
          if (joined === void 0)
            joined = arg;
          else
            joined += "/" + arg;
        }
      }
      if (joined === void 0)
        return ".";
      return posix.normalize(joined);
    },
    relative: function relative(from, to) {
      assertPath(from);
      assertPath(to);
      if (from === to) return "";
      from = posix.resolve(from);
      to = posix.resolve(to);
      if (from === to) return "";
      var fromStart = 1;
      for (; fromStart < from.length; ++fromStart) {
        if (from.charCodeAt(fromStart) !== 47)
          break;
      }
      var fromEnd = from.length;
      var fromLen = fromEnd - fromStart;
      var toStart = 1;
      for (; toStart < to.length; ++toStart) {
        if (to.charCodeAt(toStart) !== 47)
          break;
      }
      var toEnd = to.length;
      var toLen = toEnd - toStart;
      var length = fromLen < toLen ? fromLen : toLen;
      var lastCommonSep = -1;
      var i = 0;
      for (; i <= length; ++i) {
        if (i === length) {
          if (toLen > length) {
            if (to.charCodeAt(toStart + i) === 47) {
              return to.slice(toStart + i + 1);
            } else if (i === 0) {
              return to.slice(toStart + i);
            }
          } else if (fromLen > length) {
            if (from.charCodeAt(fromStart + i) === 47) {
              lastCommonSep = i;
            } else if (i === 0) {
              lastCommonSep = 0;
            }
          }
          break;
        }
        var fromCode = from.charCodeAt(fromStart + i);
        var toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode)
          break;
        else if (fromCode === 47)
          lastCommonSep = i;
      }
      var out = "";
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (i === fromEnd || from.charCodeAt(i) === 47) {
          if (out.length === 0)
            out += "..";
          else
            out += "/..";
        }
      }
      if (out.length > 0)
        return out + to.slice(toStart + lastCommonSep);
      else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === 47)
          ++toStart;
        return to.slice(toStart);
      }
    },
    _makeLong: function _makeLong(path) {
      return path;
    },
    dirname: function dirname(path) {
      assertPath(path);
      if (path.length === 0) return ".";
      var code2 = path.charCodeAt(0);
      var hasRoot = code2 === 47;
      var end = -1;
      var matchedSlash = true;
      for (var i = path.length - 1; i >= 1; --i) {
        code2 = path.charCodeAt(i);
        if (code2 === 47) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          matchedSlash = false;
        }
      }
      if (end === -1) return hasRoot ? "/" : ".";
      if (hasRoot && end === 1) return "//";
      return path.slice(0, end);
    },
    basename: function basename(path, ext) {
      if (ext !== void 0 && typeof ext !== "string") throw new TypeError('"ext" argument must be a string');
      assertPath(path);
      var start = 0;
      var end = -1;
      var matchedSlash = true;
      var i;
      if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) return "";
        var extIdx = ext.length - 1;
        var firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= 0; --i) {
          var code2 = path.charCodeAt(i);
          if (code2 === 47) {
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              if (code2 === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  end = i;
                }
              } else {
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) end = firstNonSlashEnd;
        else if (end === -1) end = path.length;
        return path.slice(start, end);
      } else {
        for (i = path.length - 1; i >= 0; --i) {
          if (path.charCodeAt(i) === 47) {
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
            matchedSlash = false;
            end = i + 1;
          }
        }
        if (end === -1) return "";
        return path.slice(start, end);
      }
    },
    extname: function extname(path) {
      assertPath(path);
      var startDot = -1;
      var startPart = 0;
      var end = -1;
      var matchedSlash = true;
      var preDotState = 0;
      for (var i = path.length - 1; i >= 0; --i) {
        var code2 = path.charCodeAt(i);
        if (code2 === 47) {
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
        if (code2 === 46) {
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
        } else if (startDot !== -1) {
          preDotState = -1;
        }
      }
      if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
      preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        return "";
      }
      return path.slice(startDot, end);
    },
    format: function format(pathObject) {
      if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
      }
      return _format("/", pathObject);
    },
    parse: function parse(path) {
      assertPath(path);
      var ret = { root: "", dir: "", base: "", ext: "", name: "" };
      if (path.length === 0) return ret;
      var code2 = path.charCodeAt(0);
      var isAbsolute = code2 === 47;
      var start;
      if (isAbsolute) {
        ret.root = "/";
        start = 1;
      } else {
        start = 0;
      }
      var startDot = -1;
      var startPart = 0;
      var end = -1;
      var matchedSlash = true;
      var i = path.length - 1;
      var preDotState = 0;
      for (; i >= start; --i) {
        code2 = path.charCodeAt(i);
        if (code2 === 47) {
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
        if (code2 === 46) {
          if (startDot === -1) startDot = i;
          else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
          preDotState = -1;
        }
      }
      if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
      preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
        if (end !== -1) {
          if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);
          else ret.base = ret.name = path.slice(startPart, end);
        }
      } else {
        if (startPart === 0 && isAbsolute) {
          ret.name = path.slice(1, startDot);
          ret.base = path.slice(1, end);
        } else {
          ret.name = path.slice(startPart, startDot);
          ret.base = path.slice(startPart, end);
        }
        ret.ext = path.slice(startDot, end);
      }
      if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
      else if (isAbsolute) ret.dir = "/";
      return ret;
    },
    sep: "/",
    delimiter: ":",
    win32: null,
    posix: null
  };
  posix.posix = posix;
  pathBrowserify = posix;
  return pathBrowserify;
}
var connection;
var hasRequiredConnection;
function requireConnection() {
  if (hasRequiredConnection) return connection;
  hasRequiredConnection = 1;
  var errors2 = requireErrors();
  var frames = requireFrames();
  var log2 = requireLog();
  var sasl2 = requireSasl();
  var util2 = requireUtil();
  var EndpointState = requireEndpoint();
  var Session = requireSession();
  var Transport = requireTransport();
  var fs = require$$6;
  var os = requireBrowser();
  var path = requirePathBrowserify();
  var net = require$$6;
  var tls = require$$6;
  var EventEmitter = requireEvents().EventEmitter;
  var AMQP_PROTOCOL_ID = 0;
  function find_connect_config() {
    var paths;
    if (process$1.env.MESSAGING_CONNECT_FILE) {
      paths = [process$1.env.MESSAGING_CONNECT_FILE];
    } else {
      paths = [process$1.cwd(), path.join(os.homedir(), ".config/messaging"), "/etc/messaging"].map(function(base) {
        return path.join(base, "/connect.json");
      });
    }
    for (var i = 0; i < paths.length; i++) {
      if (fs.existsSync(paths[i])) {
        var obj = JSON.parse(fs.readFileSync(paths[i], "utf8"));
        log2.config("using config from %s: %j", paths[i], obj);
        return obj;
      }
    }
    return {};
  }
  function get_default_connect_config() {
    var config = find_connect_config();
    var options = {};
    if (config.scheme === "amqps") options.transport = "tls";
    if (config.host) options.host = config.host;
    if (config.port === "amqp") options.port = 5672;
    else if (config.port === "amqps") options.port = 5671;
    else options.port = config.port;
    if (!(config.sasl && config.sasl.enabled === false)) {
      if (config.user) options.username = config.user;
      else options.username = "anonymous";
      if (config.password) options.password = config.password;
      if (config.sasl_mechanisms) options.sasl_mechanisms = config.sasl_mechanisms;
    }
    if (config.tls) {
      if (config.tls.key) options.key = fs.readFileSync(config.tls.key);
      if (config.tls.cert) options.cert = fs.readFileSync(config.tls.cert);
      if (config.tls.ca) options.ca = [fs.readFileSync(config.tls.ca)];
      if (config.verify === false || config.tls.verify === false) options.rejectUnauthorized = false;
    }
    if (options.transport === "tls") {
      options.servername = options.host;
    }
    return options;
  }
  function get_socket_id(socket) {
    if (socket.get_id_string) return socket.get_id_string();
    return socket.localAddress + ":" + socket.localPort + " -> " + socket.remoteAddress + ":" + socket.remotePort;
  }
  function session_per_connection(conn, session_buffer_size) {
    var ssn = null;
    return {
      "get_session": function() {
        if (!ssn) {
          ssn = conn.create_session(session_buffer_size);
          ssn.observers.on("session_close", function() {
            ssn = null;
          });
          ssn.begin();
        }
        return ssn;
      }
    };
  }
  function restrict(count, f) {
    if (count) {
      var current = count;
      var reset;
      return function(successful_attempts) {
        if (reset !== successful_attempts) {
          current = count;
          reset = successful_attempts;
        }
        if (current--) return f(successful_attempts);
        else return -1;
      };
    } else {
      return f;
    }
  }
  function backoff(initial, max2) {
    var delay = initial;
    var reset;
    return function(successful_attempts) {
      if (reset !== successful_attempts) {
        delay = initial;
        reset = successful_attempts;
      }
      var current = delay;
      var next = delay * 2;
      delay = max2 > next ? next : max2;
      return current;
    };
  }
  function get_connect_fn(options) {
    if (options.transport === void 0 || options.transport === "tcp") {
      return net.connect;
    } else if (options.transport === "tls" || options.transport === "ssl") {
      return tls.connect;
    } else {
      throw Error("Unrecognised transport: " + options.transport);
    }
  }
  function connection_details(options) {
    var details = {};
    details.connect = options.connect ? options.connect : get_connect_fn(options);
    details.host = options.host ? options.host : "localhost";
    details.port = options.port ? options.port : 5672;
    details.options = options;
    return details;
  }
  var aliases = [
    "container_id",
    "hostname",
    "max_frame_size",
    "channel_max",
    "idle_time_out",
    "outgoing_locales",
    "incoming_locales",
    "offered_capabilities",
    "desired_capabilities",
    "properties"
  ];
  function remote_property_shortcut(name) {
    return function() {
      return this.remote.open ? this.remote.open[name] : void 0;
    };
  }
  function connection_fields(fields) {
    var o = {};
    aliases.forEach(function(name) {
      if (fields[name] !== void 0) {
        o[name] = fields[name];
      }
    });
    return o;
  }
  function set_reconnect(reconnect, connection2) {
    if (typeof reconnect === "boolean") {
      if (reconnect) {
        var initial = connection2.get_option("initial_reconnect_delay", 100);
        var max2 = connection2.get_option("max_reconnect_delay", 6e4);
        connection2.options.reconnect = restrict(
          connection2.get_option("reconnect_limit"),
          backoff(initial, max2)
        );
      } else {
        connection2.options.reconnect = false;
      }
    } else if (typeof reconnect === "number") {
      var fixed = connection2.options.reconnect;
      connection2.options.reconnect = restrict(
        connection2.get_option("reconnect_limit"),
        function() {
          return fixed;
        }
      );
    }
  }
  var conn_counter = 1;
  var Connection = function(options, container2) {
    this.options = {};
    if (options) {
      for (var k in options) {
        this.options[k] = options[k];
      }
      if ((options.transport === "tls" || options.transport === "ssl") && options.servername === void 0 && options.host !== void 0) {
        this.options.servername = options.host;
      }
      this.session_buffer_size = options.session_buffer_size;
    } else {
      this.options = get_default_connect_config();
    }
    this.container = container2;
    if (!this.options.id) {
      this.options.id = "connection-" + conn_counter++;
    }
    if (!this.options.container_id) {
      this.options.container_id = container2 ? container2.id : util2.generate_uuid();
    }
    if (!this.options.connection_details) {
      var self2 = this;
      this.options.connection_details = function() {
        return connection_details(self2.options);
      };
    }
    var reconnect = this.get_option("reconnect", true);
    set_reconnect(reconnect, this);
    this.registered = false;
    this.state = new EndpointState();
    this.local_channel_map = {};
    this.remote_channel_map = {};
    this.local = {};
    this.remote = {};
    this.local.open = frames.open(connection_fields(this.options));
    this.local.close = frames.close({});
    this.session_policy = session_per_connection(this, this.session_buffer_size);
    this.amqp_transport = new Transport(this.options.id, AMQP_PROTOCOL_ID, frames.TYPE_AMQP, this);
    this.sasl_transport = void 0;
    this.transport = this.amqp_transport;
    this.conn_established_counter = 0;
    this.heartbeat_out = void 0;
    this.heartbeat_in = void 0;
    this.abort_idle = void 0;
    this.socket_ready = false;
    this.scheduled_reconnect = void 0;
    this.default_sender = void 0;
    this.closed_with_non_fatal_error = false;
    var self2 = this;
    aliases.forEach(function(alias) {
      Object.defineProperty(self2, alias, { get: remote_property_shortcut(alias) });
    });
    Object.defineProperty(this, "error", { get: function() {
      return this.remote.close ? this.remote.close.error : void 0;
    } });
  };
  Connection.prototype = Object.create(EventEmitter.prototype);
  Connection.prototype.constructor = Connection;
  Connection.prototype.dispatch = function(name) {
    log2.events("[%s] Connection got event: %s", this.options.id, name);
    if (this.listeners(name).length) {
      EventEmitter.prototype.emit.apply(this, arguments);
      return true;
    } else if (this.container) {
      return this.container.dispatch.apply(this.container, arguments);
    } else {
      return false;
    }
  };
  Connection.prototype._disconnect = function() {
    this.state.disconnected();
    for (var k in this.local_channel_map) {
      this.local_channel_map[k]._disconnect();
    }
    this.socket_ready = false;
  };
  Connection.prototype._reconnect = function() {
    if (this.abort_idle) {
      clearTimeout(this.abort_idle);
      this.abort_idle = void 0;
      this.local.close.error = void 0;
      this.state = new EndpointState();
      this.state.open();
    }
    this.state.reconnect();
    this._reset_remote_state();
  };
  Connection.prototype._reset_remote_state = function() {
    this.amqp_transport = new Transport(this.options.id, AMQP_PROTOCOL_ID, frames.TYPE_AMQP, this);
    this.sasl_transport = void 0;
    this.transport = this.amqp_transport;
    this.remote = {};
    this.remote_channel_map = {};
    var localChannelMap = this.local_channel_map;
    for (var k in localChannelMap) {
      localChannelMap[k]._reconnect();
    }
  };
  Connection.prototype.connect = function() {
    this.is_server = false;
    if (this.abort_idle) {
      clearTimeout(this.abort_idle);
      this.abort_idle = void 0;
    }
    this._reset_remote_state();
    this._connect(this.options.connection_details(this.conn_established_counter));
    this.open();
    return this;
  };
  Connection.prototype.reconnect = function() {
    this.scheduled_reconnect = void 0;
    log2.reconnect("[%s] reconnecting...", this.options.id);
    this._reconnect();
    this._connect(this.options.connection_details(this.conn_established_counter));
    process$1.nextTick(this._process.bind(this));
    return this;
  };
  Connection.prototype.set_reconnect = function(reconnect) {
    set_reconnect(reconnect, this);
  };
  Connection.prototype._connect = function(details) {
    if (details.connect) {
      this.init(details.connect(details.port, details.host, details.options, this.connected.bind(this)));
    } else {
      this.init(get_connect_fn(details)(details.port, details.host, details.options, this.connected.bind(this)));
    }
    return this;
  };
  Connection.prototype.accept = function(socket) {
    this.is_server = true;
    log2.io("[%s] client accepted: %s", this.id, get_socket_id(socket));
    this.socket_ready = true;
    return this.init(socket);
  };
  Connection.prototype.abort_socket = function(socket) {
    if (socket === this.socket) {
      this.abort_idle = void 0;
      log2.io("[%s] aborting socket", this.options.id);
      this.socket.end();
      if (this.socket.removeAllListeners) {
        this.socket.removeAllListeners("data");
        this.socket.removeAllListeners("error");
        this.socket.removeAllListeners("end");
      }
      if (typeof this.socket.destroy === "function") {
        this.socket.destroy();
      }
      this._disconnected();
    }
  };
  Connection.prototype.init = function(socket) {
    this.socket = socket;
    if (this.get_option("tcp_no_delay", false) && this.socket.setNoDelay) {
      this.socket.setNoDelay(true);
    }
    this.socket.on("data", this.input.bind(this));
    this.socket.on("error", this.on_error.bind(this));
    this.socket.on("end", this.eof.bind(this));
    if (this.is_server) {
      var mechs;
      if (this.container && Object.getOwnPropertyNames(this.container.sasl_server_mechanisms).length) {
        mechs = this.container.sasl_server_mechanisms;
      }
      if (this.socket.encrypted && this.socket.authorized && this.get_option("enable_sasl_external", false)) {
        mechs = sasl2.server_add_external(mechs ? util2.clone(mechs) : {});
      }
      if (mechs) {
        if (mechs.ANONYMOUS !== void 0 && !this.get_option("require_sasl", false)) {
          this.sasl_transport = new sasl2.Selective(this, mechs);
        } else {
          this.sasl_transport = new sasl2.Server(this, mechs);
        }
      } else {
        if (!this.get_option("disable_sasl", false)) {
          var anon = sasl2.server_mechanisms();
          anon.enable_anonymous();
          this.sasl_transport = new sasl2.Selective(this, anon);
        }
      }
    } else {
      var mechanisms = this.get_option("sasl_mechanisms");
      if (!mechanisms) {
        var username = this.get_option("username");
        var password = this.get_option("password");
        var token = this.get_option("token");
        if (username) {
          mechanisms = sasl2.client_mechanisms();
          if (password) mechanisms.enable_plain(username, password);
          else if (token) mechanisms.enable_xoauth2(username, token);
          else mechanisms.enable_anonymous(username);
        }
      }
      if (this.socket.encrypted && this.options.cert && this.get_option("enable_sasl_external", false)) {
        if (!mechanisms) mechanisms = sasl2.client_mechanisms();
        mechanisms.enable_external();
      }
      if (mechanisms) {
        this.sasl_transport = new sasl2.Client(this, mechanisms, this.options.sasl_init_hostname || this.options.servername || this.options.host);
      }
    }
    this.transport = this.sasl_transport ? this.sasl_transport : this.amqp_transport;
    return this;
  };
  Connection.prototype.attach_sender = function(options) {
    return this.session_policy.get_session().attach_sender(options);
  };
  Connection.prototype.open_sender = Connection.prototype.attach_sender;
  Connection.prototype.attach_receiver = function(options) {
    if (this.get_option("tcp_no_delay", true) && this.socket.setNoDelay) {
      this.socket.setNoDelay(true);
    }
    return this.session_policy.get_session().attach_receiver(options);
  };
  Connection.prototype.open_receiver = Connection.prototype.attach_receiver;
  Connection.prototype.get_option = function(name, default_value) {
    if (this.options[name] !== void 0) return this.options[name];
    else if (this.container) return this.container.get_option(name, default_value);
    else return default_value;
  };
  Connection.prototype.send = function(msg) {
    if (this.default_sender === void 0) {
      this.default_sender = this.open_sender({ target: {} });
    }
    return this.default_sender.send(msg);
  };
  Connection.prototype.connected = function() {
    this.socket_ready = true;
    this.conn_established_counter++;
    log2.io("[%s] connected %s", this.options.id, get_socket_id(this.socket));
    this.output();
  };
  Connection.prototype.sasl_failed = function(text, condition) {
    this.transport_error = new errors2.ConnectionError(text, condition ? condition : "amqp:unauthorized-access", this);
    this._handle_error();
    this.socket.end();
  };
  Connection.prototype._is_fatal = function(error_condition) {
    var all_errors_non_fatal = this.get_option("all_errors_non_fatal", false);
    if (all_errors_non_fatal) {
      return false;
    } else {
      var non_fatal = this.get_option("non_fatal_errors", ["amqp:connection:forced"]);
      return non_fatal.indexOf(error_condition) < 0;
    }
  };
  Connection.prototype._handle_error = function() {
    var error = this.get_error();
    if (error) {
      var handled = this.dispatch("connection_error", this._context({ error }));
      handled = this.dispatch("connection_close", this._context({ error })) || handled;
      if (!this._is_fatal(error.condition)) {
        if (this.state.local_open) {
          this.closed_with_non_fatal_error = true;
        }
      } else if (!handled) {
        this.dispatch("error", new errors2.ConnectionError(error.description, error.condition, this));
      }
      return true;
    } else {
      return false;
    }
  };
  Connection.prototype.get_error = function() {
    if (this.transport_error) return this.transport_error;
    if (this.remote.close && this.remote.close.error) {
      return new errors2.ConnectionError(this.remote.close.error.description, this.remote.close.error.condition, this);
    }
    return void 0;
  };
  Connection.prototype._get_peer_details = function() {
    var s = "";
    if (this.remote.open && this.remote.open.container) {
      s += this.remote.open.container + " ";
    }
    if (this.remote.open && this.remote.open.properties) {
      s += JSON.stringify(this.remote.open.properties);
    }
    return s;
  };
  Connection.prototype.output = function() {
    try {
      if (this.socket && this.socket_ready) {
        if (this.heartbeat_out) clearTimeout(this.heartbeat_out);
        this.transport.write(this.socket);
        if ((this.is_closed() && this.state.has_settled() || this.abort_idle || this.transport_error) && !this.transport.has_writes_pending()) {
          this.socket.end();
        } else if (this.is_open() && this.remote.open.idle_time_out) {
          this.heartbeat_out = setTimeout(this._write_frame.bind(this), this.remote.open.idle_time_out / 2);
        }
        if (this.local.open.idle_time_out && this.heartbeat_in === void 0) {
          this.heartbeat_in = setTimeout(this.idle.bind(this), this.local.open.idle_time_out * 2);
        }
      }
    } catch (e) {
      this.saved_error = e;
      if (e.name === "ProtocolError") {
        console.error("[" + this.options.id + "] error on write: " + e + " " + this._get_peer_details() + " " + e.name);
        this.dispatch("protocol_error", e) || console.error("[" + this.options.id + "] error on write: " + e + " " + this._get_peer_details());
      } else {
        this.dispatch("error", e);
      }
      this.socket.end();
    }
  };
  function byte_to_hex(value) {
    if (value < 16) return "0x0" + Number(value).toString(16);
    else return "0x" + Number(value).toString(16);
  }
  function buffer_to_hex(buffer2) {
    var bytes = [];
    for (var i = 0; i < buffer2.length; i++) {
      bytes.push(byte_to_hex(buffer2[i]));
    }
    return bytes.join(",");
  }
  Connection.prototype.input = function(buff) {
    var buffer2;
    try {
      if (this.heartbeat_in) clearTimeout(this.heartbeat_in);
      log2.io("[%s] read %d bytes", this.options.id, buff.length);
      if (this.frame_size) {
        this.received_bytes += buff.length;
        this.chunks.push(buff);
        if (this.frame_size <= this.received_bytes) {
          buffer2 = Buffer.concat(this.chunks, this.received_bytes);
          this.chunks = null;
          this.frame_size = void 0;
        } else {
          log2.io("[%s] pushed %d bytes", this.options.id, buff.length);
          return;
        }
      } else if (this.previous_input) {
        buffer2 = Buffer.concat([this.previous_input, buff]);
        this.previous_input = null;
      } else {
        buffer2 = buff;
      }
      const read = this.transport.read(buffer2, this);
      if (read < buffer2.length) {
        const previous_input = buffer2.slice(read);
        this.frame_size = this.transport.peek_size(previous_input);
        if (this.frame_size) {
          this.chunks = [previous_input];
          this.received_bytes = previous_input.length;
          log2.io("[%s] waiting frame_size %s", this.options.id, this.frame_size);
        } else {
          this.previous_input = previous_input;
        }
      }
      if (this.local.open.idle_time_out) this.heartbeat_in = setTimeout(this.idle.bind(this), this.local.open.idle_time_out * 2);
      if (this.transport.has_writes_pending()) {
        this.output();
      } else if (this.is_closed() && this.state.has_settled()) {
        this.socket.end();
      } else if (this.is_open() && this.remote.open.idle_time_out && !this.heartbeat_out) {
        this.heartbeat_out = setTimeout(this._write_frame.bind(this), this.remote.open.idle_time_out / 2);
      }
    } catch (e) {
      this.saved_error = e;
      if (e.name === "ProtocolError") {
        this.dispatch("protocol_error", e) || console.error("[" + this.options.id + "] error on read: " + e + " " + this._get_peer_details() + " (buffer:" + buffer_to_hex(buffer2) + ")");
      } else {
        this.dispatch("error", e);
      }
      this.socket.end();
    }
  };
  Connection.prototype.idle = function() {
    if (!this.is_closed()) {
      this.closed_with_non_fatal_error = true;
      this.local.close.error = { condition: "amqp:resource-limit-exceeded", description: "max idle time exceeded" };
      this.close();
      this.abort_idle = setTimeout(this.abort_socket.bind(this, this.socket), 1e3);
    }
  };
  Connection.prototype.on_error = function(e) {
    this._disconnected(e);
  };
  Connection.prototype.eof = function(e) {
    var error = e || this.saved_error;
    this.saved_error = void 0;
    this._disconnected(error);
  };
  Connection.prototype._disconnected = function(error) {
    if (this.heartbeat_out) {
      clearTimeout(this.heartbeat_out);
      this.heartbeat_out = void 0;
    }
    if (this.heartbeat_in) {
      clearTimeout(this.heartbeat_in);
      this.heartbeat_in = void 0;
    }
    if (this.abort_idle) {
      clearTimeout(this.abort_idle);
      this.abort_idle = void 0;
    }
    var was_closed_with_non_fatal_error = this.closed_with_non_fatal_error;
    if (this.closed_with_non_fatal_error) {
      this.closed_with_non_fatal_error = false;
      if (this.options.reconnect) this.open();
    }
    if ((!this.is_closed() || was_closed_with_non_fatal_error) && this.scheduled_reconnect === void 0) {
      this._disconnect();
      var disconnect_ctxt = {};
      if (error) {
        disconnect_ctxt.error = error;
      }
      if (!this.is_server && !this.transport_error && this.options.reconnect) {
        var delay = this.options.reconnect(this.conn_established_counter);
        if (delay >= 0) {
          log2.reconnect("[%s] Scheduled reconnect in " + delay + "ms", this.options.id);
          this.scheduled_reconnect = setTimeout(this.reconnect.bind(this), delay);
          disconnect_ctxt.reconnecting = true;
        } else {
          disconnect_ctxt.reconnecting = false;
        }
      }
      if (!this.dispatch("disconnected", this._context(disconnect_ctxt))) {
        console.warn("[" + this.options.id + "] disconnected %s", disconnect_ctxt.error || "");
      }
    }
  };
  Connection.prototype.open = function() {
    if (this.state.open()) {
      this._register();
    }
  };
  Connection.prototype.close = function(error) {
    if (error) this.local.close.error = error;
    if (this.state.close()) {
      this._register();
    }
  };
  Connection.prototype.is_open = function() {
    return this.state.is_open();
  };
  Connection.prototype.is_remote_open = function() {
    return this.state.remote_open;
  };
  Connection.prototype.is_closed = function() {
    return this.state.is_closed();
  };
  Connection.prototype.create_session = function(session_buffer_size) {
    var i = 0;
    while (this.local_channel_map[i]) i++;
    var session2 = new Session(this, i, session_buffer_size);
    this.local_channel_map[i] = session2;
    return session2;
  };
  Connection.prototype.find_sender = function(filter2) {
    return this.find_link(util2.sender_filter(filter2));
  };
  Connection.prototype.find_receiver = function(filter2) {
    return this.find_link(util2.receiver_filter(filter2));
  };
  Connection.prototype.find_link = function(filter2) {
    for (var channel in this.local_channel_map) {
      var session2 = this.local_channel_map[channel];
      var result = session2.find_link(filter2);
      if (result) return result;
    }
    return void 0;
  };
  Connection.prototype.each_receiver = function(action, filter2) {
    this.each_link(action, util2.receiver_filter(filter2));
  };
  Connection.prototype.each_sender = function(action, filter2) {
    this.each_link(action, util2.sender_filter(filter2));
  };
  Connection.prototype.each_link = function(action, filter2) {
    for (var channel in this.local_channel_map) {
      var session2 = this.local_channel_map[channel];
      session2.each_link(action, filter2);
    }
  };
  Connection.prototype.on_open = function(frame) {
    if (this.state.remote_opened()) {
      this.remote.open = frame.performative;
      this.open();
      this.dispatch("connection_open", this._context());
    } else {
      throw new errors2.ProtocolError("Open already received");
    }
  };
  Connection.prototype.on_close = function(frame) {
    if (this.state.remote_closed()) {
      this.remote.close = frame.performative;
      if (this.remote.close.error) {
        this._handle_error();
      } else {
        this.dispatch("connection_close", this._context());
      }
      if (this.heartbeat_out) clearTimeout(this.heartbeat_out);
      var self2 = this;
      process$1.nextTick(function() {
        self2.close();
      });
    } else {
      throw new errors2.ProtocolError("Close already received");
    }
  };
  Connection.prototype._register = function() {
    if (!this.registered) {
      this.registered = true;
      process$1.nextTick(this._process.bind(this));
    }
  };
  Connection.prototype._process = function() {
    this.registered = false;
    do {
      if (this.state.need_open()) {
        this._write_open();
      }
      var localChannelMap = this.local_channel_map;
      for (var k in localChannelMap) {
        localChannelMap[k]._process();
      }
      if (this.state.need_close()) {
        this._write_close();
      }
    } while (!this.state.has_settled());
  };
  Connection.prototype._write_frame = function(channel, frame, payload) {
    this.amqp_transport.encode(frames.amqp_frame(channel, frame, payload));
    this.output();
  };
  Connection.prototype._write_open = function() {
    this._write_frame(0, this.local.open);
  };
  Connection.prototype._write_close = function() {
    this._write_frame(0, this.local.close);
    this.local.close.error = void 0;
  };
  Connection.prototype.on_begin = function(frame) {
    var session2;
    if (frame.performative.remote_channel === null || frame.performative.remote_channel === void 0) {
      session2 = this.create_session(this.session_buffer_size);
      session2.local.begin.remote_channel = frame.channel;
    } else {
      session2 = this.local_channel_map[frame.performative.remote_channel];
      if (!session2) throw new errors2.ProtocolError("Invalid value for remote channel " + frame.performative.remote_channel);
    }
    session2.on_begin(frame);
    this.remote_channel_map[frame.channel] = session2;
  };
  Connection.prototype.get_peer_certificate = function() {
    if (this.socket && this.socket.getPeerCertificate) {
      return this.socket.getPeerCertificate();
    } else {
      return void 0;
    }
  };
  Connection.prototype.get_tls_socket = function() {
    if (this.socket && (this.options.transport === "tls" || this.options.transport === "ssl")) {
      return this.socket;
    } else {
      return void 0;
    }
  };
  Connection.prototype._context = function(c) {
    var context = c ? c : {};
    context.connection = this;
    if (this.container) context.container = this.container;
    return context;
  };
  Connection.prototype.remove_session = function(session2) {
    if (this.remote_channel_map[session2.remote.channel] === session2) {
      delete this.remote_channel_map[session2.remote.channel];
    }
    if (this.local_channel_map[session2.local.channel] === session2) {
      delete this.local_channel_map[session2.local.channel];
    }
  };
  Connection.prototype.remove_all_sessions = function() {
    clearObject(this.remote_channel_map);
    clearObject(this.local_channel_map);
  };
  function clearObject(obj) {
    for (var k in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, k)) {
        continue;
      }
      delete obj[k];
    }
  }
  function delegate_to_session(name) {
    Connection.prototype["on_" + name] = function(frame) {
      var session2 = this.remote_channel_map[frame.channel];
      if (!session2) {
        throw new errors2.ProtocolError(name + " received on invalid channel " + frame.channel);
      }
      session2["on_" + name](frame);
    };
  }
  delegate_to_session("end");
  delegate_to_session("attach");
  delegate_to_session("detach");
  delegate_to_session("transfer");
  delegate_to_session("disposition");
  delegate_to_session("flow");
  connection = Connection;
  return connection;
}
var eventTypes;
var hasRequiredEventTypes;
function requireEventTypes() {
  if (hasRequiredEventTypes) return eventTypes;
  hasRequiredEventTypes = 1;
  var ReceiverEvents;
  (function(ReceiverEvents2) {
    ReceiverEvents2["message"] = "message";
    ReceiverEvents2["receiverOpen"] = "receiver_open";
    ReceiverEvents2["receiverDrained"] = "receiver_drained";
    ReceiverEvents2["receiverFlow"] = "receiver_flow";
    ReceiverEvents2["receiverError"] = "receiver_error";
    ReceiverEvents2["receiverClose"] = "receiver_close";
    ReceiverEvents2["settled"] = "settled";
  })(ReceiverEvents || (ReceiverEvents = {}));
  var SenderEvents;
  (function(SenderEvents2) {
    SenderEvents2["sendable"] = "sendable";
    SenderEvents2["senderOpen"] = "sender_open";
    SenderEvents2["senderDraining"] = "sender_draining";
    SenderEvents2["senderFlow"] = "sender_flow";
    SenderEvents2["senderError"] = "sender_error";
    SenderEvents2["senderClose"] = "sender_close";
    SenderEvents2["accepted"] = "accepted";
    SenderEvents2["released"] = "released";
    SenderEvents2["rejected"] = "rejected";
    SenderEvents2["modified"] = "modified";
    SenderEvents2["settled"] = "settled";
  })(SenderEvents || (SenderEvents = {}));
  var SessionEvents;
  (function(SessionEvents2) {
    SessionEvents2["sessionOpen"] = "session_open";
    SessionEvents2["sessionError"] = "session_error";
    SessionEvents2["sessionClose"] = "session_close";
    SessionEvents2["settled"] = "settled";
  })(SessionEvents || (SessionEvents = {}));
  var ConnectionEvents;
  (function(ConnectionEvents2) {
    ConnectionEvents2["connectionOpen"] = "connection_open";
    ConnectionEvents2["connectionClose"] = "connection_close";
    ConnectionEvents2["connectionError"] = "connection_error";
    ConnectionEvents2["protocolError"] = "protocol_error", /**
     * @property {string} error Raised when an error is received on the underlying socket.
     */
    ConnectionEvents2["error"] = "error", /**
     * @property {string} disconnected Raised when the underlying tcp connection is lost. The context
     * has a reconnecting property which is true if the library is attempting to automatically reconnect
     * and false if it has reached the reconnect limit. If reconnect has not been enabled or if the connection
     * is a tcp server, then the reconnecting property is undefined. The context may also have an error
     * property giving some information about the reason for the disconnect.
     */
    ConnectionEvents2["disconnected"] = "disconnected";
    ConnectionEvents2["settled"] = "settled";
  })(ConnectionEvents || (ConnectionEvents = {}));
  eventTypes = {
    ReceiverEvents,
    SenderEvents,
    SessionEvents,
    ConnectionEvents
  };
  return eventTypes;
}
var ws;
var hasRequiredWs;
function requireWs() {
  if (hasRequiredWs) return ws;
  hasRequiredWs = 1;
  function nulltransform(data) {
    return data;
  }
  function from_arraybuffer(data) {
    if (data instanceof ArrayBuffer) return Buffer.from(new Uint8Array(data));
    else return Buffer.from(data);
  }
  function to_typedarray(data) {
    return new Uint8Array(data);
  }
  function wrap(ws2) {
    var data_recv = nulltransform;
    var data_send = nulltransform;
    if (ws2.binaryType) {
      ws2.binaryType = "arraybuffer";
      data_recv = from_arraybuffer;
      data_send = to_typedarray;
    }
    return {
      end: function() {
        ws2.close();
      },
      write: function(data) {
        try {
          ws2.send(data_send(data), { binary: true });
        } catch (e) {
          ws2.onerror(e);
        }
      },
      on: function(event, handler) {
        if (event === "data") {
          ws2.onmessage = function(msg_evt) {
            handler(data_recv(msg_evt.data));
          };
        } else if (event === "end") {
          ws2.onclose = handler;
        } else if (event === "error") {
          ws2.onerror = handler;
        } else {
          console.error("ERROR: Attempt to set unrecognised handler on websocket wrapper: " + event);
        }
      },
      get_id_string: function() {
        return ws2.url;
      }
    };
  }
  ws = {
    "connect": function(Impl) {
      return function(url, protocols, options) {
        return function() {
          return {
            connect: function(port_ignore, host_ignore, options_ignore, callback) {
              var c = new Impl(url, protocols, options);
              c.onopen = callback;
              return wrap(c);
            }
          };
        };
      };
    },
    "wrap": wrap
  };
  return ws;
}
var filter;
var hasRequiredFilter;
function requireFilter() {
  if (hasRequiredFilter) return filter;
  hasRequiredFilter = 1;
  var amqp_types = requireTypes();
  filter = {
    selector: function(s) {
      return { "jms-selector": amqp_types.wrap_described(s, 77567109365764) };
    }
  };
  return filter;
}
var container;
var hasRequiredContainer;
function requireContainer() {
  if (hasRequiredContainer) return container;
  hasRequiredContainer = 1;
  var Connection = requireConnection();
  var log2 = requireLog();
  var sasl2 = requireSasl();
  var util2 = requireUtil();
  var eventTypes2 = requireEventTypes();
  var net = require$$6;
  var tls = require$$6;
  var EventEmitter = requireEvents().EventEmitter;
  var Container = function(options) {
    this.options = options ? Object.create(options) : {};
    if (!this.options.id) {
      this.options.id = util2.generate_uuid();
    }
    this.id = this.options.id;
    this.sasl_server_mechanisms = sasl2.server_mechanisms();
  };
  Container.prototype = Object.create(EventEmitter.prototype);
  Container.prototype.constructor = Container;
  Container.prototype.dispatch = function(name) {
    log2.events("[%s] Container got event: " + name, this.id);
    EventEmitter.prototype.emit.apply(this, arguments);
    if (this.listeners(name).length) {
      return true;
    } else {
      return false;
    }
  };
  Container.prototype.connect = function(options) {
    return new Connection(options, this).connect();
  };
  Container.prototype.create_connection = function(options) {
    return new Connection(options, this);
  };
  Container.prototype.listen = function(options) {
    var container2 = this;
    var server;
    if (options.transport === void 0 || options.transport === "tcp") {
      server = net.createServer(options);
      server.on("connection", function(socket) {
        new Connection(options, container2).accept(socket);
      });
    } else if (options.transport === "tls" || options.transport === "ssl") {
      server = tls.createServer(options);
      server.on("secureConnection", function(socket) {
        new Connection(options, container2).accept(socket);
      });
    } else {
      throw Error("Unrecognised transport: " + options.transport);
    }
    if (process$1.version.match(/v0\.10\.\d+/)) {
      server.listen(options.port, options.host);
    } else {
      server.listen(options);
    }
    return server;
  };
  Container.prototype.create_container = function(options) {
    return new Container(options);
  };
  Container.prototype.get_option = function(name, default_value) {
    if (this.options[name] !== void 0) return this.options[name];
    else return default_value;
  };
  Container.prototype.generate_uuid = util2.generate_uuid;
  Container.prototype.string_to_uuid = util2.string_to_uuid;
  Container.prototype.uuid_to_string = util2.uuid_to_string;
  var ws2 = requireWs();
  Container.prototype.websocket_accept = function(socket, options) {
    new Connection(options, this).accept(ws2.wrap(socket));
  };
  Container.prototype.websocket_connect = ws2.connect;
  Container.prototype.filter = requireFilter();
  Container.prototype.types = requireTypes();
  Container.prototype.message = requireMessage();
  Container.prototype.sasl = sasl2;
  Container.prototype.ReceiverEvents = eventTypes2.ReceiverEvents;
  Container.prototype.SenderEvents = eventTypes2.SenderEvents;
  Container.prototype.SessionEvents = eventTypes2.SessionEvents;
  Container.prototype.ConnectionEvents = eventTypes2.ConnectionEvents;
  container = new Container();
  return container;
}
var containerExports = requireContainer();
var AmqpMethods = /* @__PURE__ */ ((AmqpMethods2) => {
  AmqpMethods2["POST"] = "POST";
  AmqpMethods2["PUT"] = "PUT";
  AmqpMethods2["DELETE"] = "DELETE";
  AmqpMethods2["GET"] = "GET";
  return AmqpMethods2;
})(AmqpMethods || {});
var AmqpEndpoints = /* @__PURE__ */ ((AmqpEndpoints2) => {
  AmqpEndpoints2["Queues"] = "queues";
  AmqpEndpoints2["Exchanges"] = "exchanges";
  AmqpEndpoints2["Bindings"] = "bindings";
  return AmqpEndpoints2;
})(AmqpEndpoints || {});
const ME = "$me";
class LinkMessageBuilder {
  messageId = containerExports.generate_uuid();
  to = "";
  replyTo = ME;
  method = "GET";
  body;
  constructor() {
  }
  setMessageId(id) {
    this.messageId = id;
    return this;
  }
  sendTo(to) {
    this.to = to;
    return this;
  }
  setReplyTo(replyTo) {
    this.replyTo = replyTo;
    return this;
  }
  setAmqpMethod(method) {
    this.method = method;
    return this;
  }
  setBody(body) {
    this.body = body;
    return this;
  }
  build() {
    return {
      message_id: this.messageId,
      to: this.to,
      reply_to: this.replyTo,
      subject: this.method,
      body: this.body
    };
  }
}
var OutcomeState = /* @__PURE__ */ ((OutcomeState2) => {
  OutcomeState2["ACCEPTED"] = "ACCEPTED";
  OutcomeState2["REJECTED"] = "REJECTED";
  OutcomeState2["RELEASED"] = "RELEASED";
  return OutcomeState2;
})(OutcomeState || {});
const DURABLE = 1;
const AUTO_DELETE = 1;
const EXCLUSIVE = 1;
const STREAM_FILTER_SPEC = "rabbitmq:stream-filter";
const STREAM_OFFSET_SPEC = "rabbitmq:stream-offset-spec";
const STREAM_FILTER_MATCH_UNFILTERED = "rabbitmq:stream-match-unfiltered";
function isError(message) {
  return message.subject === "400" || message.subject === "404" || message.subject === "409";
}
function queueTypeFromString(queueType) {
  switch (queueType) {
    case "classic":
      return "classic";
    case "quorum":
      return "quorum";
    case "stream":
      return "stream";
    default:
      throw new Error(`Unsupported queue type: ${queueType}`);
  }
}
async function openLink(connection2, successEvent, errorEvent, openMethod, config) {
  return new Promise((res, rej) => {
    connection2.once(successEvent, (context) => {
      return res(context.receiver || context.sender);
    });
    connection2.once(errorEvent, (context) => {
      return rej(context.connection.error);
    });
    openMethod(config);
  });
}
var OffsetType = /* @__PURE__ */ ((OffsetType2) => {
  OffsetType2["first"] = "first";
  OffsetType2["last"] = "last";
  OffsetType2["next"] = "next";
  OffsetType2["numeric"] = "numeric";
  OffsetType2["timestamp"] = "timestamp";
  return OffsetType2;
})(OffsetType || {});
class Offset {
  constructor(type2, value) {
    this.type = type2;
    this.value = value;
  }
  toValue() {
    if (this.value && (this.type === "numeric" || this.type === "timestamp")) return this.value;
    return this.type.toString();
  }
  static first() {
    return new Offset(
      "first"
      /* first */
    );
  }
  static last() {
    return new Offset(
      "last"
      /* last */
    );
  }
  static next() {
    return new Offset(
      "next"
      /* next */
    );
  }
  static offset(offset) {
    return new Offset("numeric", offset);
  }
  static timestamp(date) {
    return new Offset("timestamp", BigInt(date.getTime()));
  }
}
class CreateQueueResponseDecoder {
  decodeFrom(receivedMessage, sentMessageId) {
    if (isError(receivedMessage) || sentMessageId !== receivedMessage.correlation_id) {
      return {
        status: "error",
        error: new Error(`Message Error: ${receivedMessage.subject}; ${receivedMessage.body}`)
      };
    }
    return {
      status: "ok",
      body: {
        name: receivedMessage.body.name,
        durable: receivedMessage.body.durable === DURABLE,
        autoDelete: receivedMessage.body.auto_delete === AUTO_DELETE,
        exclusive: receivedMessage.body.exclusive === EXCLUSIVE,
        type: queueTypeFromString(receivedMessage.body.type),
        arguments: receivedMessage.body.arguments ?? {},
        leader: receivedMessage.body.leader,
        replicas: receivedMessage.body.replicas,
        messageCount: receivedMessage.body.message_count,
        consumerCount: receivedMessage.body.consumer_count
      }
    };
  }
}
class GetQueueInfoResponseDecoder extends CreateQueueResponseDecoder {
}
class DeleteQueueResponseDecoder {
  decodeFrom(receivedMessage, sentMessageId) {
    if (isError(receivedMessage) || sentMessageId !== receivedMessage.correlation_id) {
      return { status: "error", error: new Error(`Message Error: ${receivedMessage.subject}`) };
    }
    return {
      status: "ok",
      body: {
        name: receivedMessage.body.name,
        deleted: true
      }
    };
  }
}
class EmptyBodyResponseDecoder {
  decodeFrom(receivedMessage, sentMessageId) {
    if (isError(receivedMessage) || sentMessageId !== receivedMessage.correlation_id) {
      return { status: "error", error: new Error(`Message Error: ${receivedMessage.subject}`) };
    }
    return {
      status: "ok",
      body: void 0
    };
  }
}
class CreateExchangeResponseDecoder extends EmptyBodyResponseDecoder {
}
class DeleteExchangeResponseDecoder extends EmptyBodyResponseDecoder {
}
class CreateBindingResponseDecoder extends EmptyBodyResponseDecoder {
}
class DeleteBindingResponseDecoder extends EmptyBodyResponseDecoder {
}
class AmqpBinding {
  constructor(info) {
    this.info = info;
  }
  get getInfo() {
    return this.info;
  }
}
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    if (typeof crypto === "undefined" || !crypto.getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
    getRandomValues = crypto.getRandomValues.bind(crypto);
  }
  return getRandomValues(rnds8);
}
const randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
const native = { randomUUID };
function v4(options, buf, offset) {
  if (native.randomUUID && true && !options) {
    return native.randomUUID();
  }
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return unsafeStringify(rnds);
}
const MANAGEMENT_NODE_CONFIGURATION = {
  snd_settle_mode: 1,
  rcv_settle_mode: 0,
  name: "management-link-pair",
  target: { address: "/management", expiry_policy: "LINK_DETACH", timeout: 0, dynamic: false },
  source: { address: "/management", expiry_policy: "LINK_DETACH", timeout: 0, dynamic: false, durable: 0 },
  properties: { paired: true }
};
class AmqpManagement {
  constructor(connection2, senderLink, receiverLink) {
    this.connection = connection2;
    this.senderLink = senderLink;
    this.receiverLink = receiverLink;
  }
  static async create(connection2) {
    const senderLink = await AmqpManagement.openSender(connection2);
    const receiverLink = await AmqpManagement.openReceiver(connection2);
    return new AmqpManagement(connection2, senderLink, receiverLink);
  }
  static async openReceiver(connection2) {
    return openLink(
      connection2,
      containerExports.ReceiverEvents.receiverOpen,
      containerExports.ReceiverEvents.receiverError,
      connection2.open_receiver.bind(connection2),
      MANAGEMENT_NODE_CONFIGURATION
    );
  }
  static async openSender(connection2) {
    return openLink(
      connection2,
      containerExports.SenderEvents.senderOpen,
      containerExports.SenderEvents.senderError,
      connection2.open_sender.bind(connection2),
      MANAGEMENT_NODE_CONFIGURATION
    );
  }
  close() {
    if (this.connection.is_closed()) return;
    this.closeSender();
    this.closeReceiver();
  }
  closeSender() {
    this.senderLink.close();
  }
  closeReceiver() {
    this.senderLink.close();
  }
  async declareQueue(queueName, options = {}) {
    return new Promise((res, rej) => {
      this.receiverLink.once(containerExports.ReceiverEvents.message, (context) => {
        if (!context.message) {
          return rej(new Error("Receiver has not received any message"));
        }
        const response = new CreateQueueResponseDecoder().decodeFrom(context.message, String(message.message_id));
        if (response.status === "error") {
          return rej(response.error);
        }
        return res(new AmqpQueue(response.body));
      });
      const message = new LinkMessageBuilder().sendTo(`/${AmqpEndpoints.Queues}/${encodeURIComponent(queueName)}`).setReplyTo(ME).setAmqpMethod(AmqpMethods.PUT).setBody(buildDeclareQueueBody(options)).build();
      this.senderLink.once("sendable", () => this.senderLink.send(message));
    });
  }
  async deleteQueue(queueName) {
    return new Promise((res, rej) => {
      this.receiverLink.once(containerExports.ReceiverEvents.message, (context) => {
        if (!context.message) {
          return rej(new Error("Receiver has not received any message"));
        }
        const response = new DeleteQueueResponseDecoder().decodeFrom(context.message, String(message.message_id));
        if (response.status === "error") {
          return rej(response.error);
        }
        return res(true);
      });
      const message = new LinkMessageBuilder().sendTo(`/${AmqpEndpoints.Queues}/${encodeURIComponent(queueName)}`).setReplyTo(ME).setAmqpMethod(AmqpMethods.DELETE).build();
      this.senderLink.send(message);
    });
  }
  async getQueueInfo(queueName) {
    return new Promise((res, rej) => {
      this.receiverLink.once(containerExports.ReceiverEvents.message, (context) => {
        if (!context.message) {
          return rej(new Error("Receiver has not received any message"));
        }
        const response = new GetQueueInfoResponseDecoder().decodeFrom(context.message, String(message.message_id));
        if (response.status === "error") {
          return rej(response.error);
        }
        return res(new AmqpQueue(response.body));
      });
      const message = new LinkMessageBuilder().sendTo(`/${AmqpEndpoints.Queues}/${encodeURIComponent(queueName)}`).setReplyTo(ME).setAmqpMethod(AmqpMethods.GET).build();
      this.senderLink.send(message);
    });
  }
  async declareExchange(exchangeName, options = {}) {
    const exchangeInfo = {
      type: options.type ?? "direct",
      arguments: options.arguments ?? {},
      autoDelete: options.auto_delete ?? false,
      durable: options.durable ?? true,
      name: exchangeName
    };
    return new Promise((res, rej) => {
      this.receiverLink.once(containerExports.ReceiverEvents.message, (context) => {
        if (!context.message) {
          return rej(new Error("Receiver has not received any message"));
        }
        const response = new CreateExchangeResponseDecoder().decodeFrom(context.message, String(message.message_id));
        if (response.status === "error") {
          return rej(response.error);
        }
        return res(new AmqpExchange(exchangeInfo));
      });
      const message = new LinkMessageBuilder().sendTo(`/${AmqpEndpoints.Exchanges}/${encodeURIComponent(exchangeName)}`).setReplyTo(ME).setAmqpMethod(AmqpMethods.PUT).setBody({
        type: options.type ?? "direct",
        durable: options.durable ?? true,
        auto_delete: options.auto_delete ?? false,
        arguments: options.arguments ?? {}
      }).build();
      this.senderLink.send(message);
    });
  }
  async deleteExchange(exchangeName) {
    return new Promise((res, rej) => {
      this.receiverLink.once(containerExports.ReceiverEvents.message, (context) => {
        if (!context.message) {
          return rej(new Error("Receiver has not received any message"));
        }
        const response = new DeleteExchangeResponseDecoder().decodeFrom(context.message, String(message.message_id));
        if (response.status === "error") {
          return rej(response.error);
        }
        return res(true);
      });
      const message = new LinkMessageBuilder().sendTo(`/${AmqpEndpoints.Exchanges}/${encodeURIComponent(exchangeName)}`).setReplyTo(ME).setAmqpMethod(AmqpMethods.DELETE).build();
      this.senderLink.send(message);
    });
  }
  async bind(key, options) {
    const bindingInfo = {
      id: v4(),
      source: options.source.getInfo.name,
      destination: options.destination.getInfo.name,
      arguments: options.arguments ?? {}
    };
    return new Promise((res, rej) => {
      this.receiverLink.once(containerExports.ReceiverEvents.message, (context) => {
        if (!context.message) {
          return rej(new Error("Receiver has not received any message"));
        }
        const response = new CreateBindingResponseDecoder().decodeFrom(context.message, String(message.message_id));
        if (response.status === "error") {
          return rej(response.error);
        }
        return res(new AmqpBinding(bindingInfo));
      });
      const message = new LinkMessageBuilder().sendTo(`/${AmqpEndpoints.Bindings}`).setReplyTo(ME).setAmqpMethod(AmqpMethods.POST).setBody({
        source: options.source.getInfo.name,
        binding_key: key,
        arguments: options.arguments ?? {},
        ...buildBindingDestinationFrom(options.destination)
      }).build();
      this.senderLink.send(message);
    });
  }
  async unbind(key, options) {
    return new Promise((res, rej) => {
      this.receiverLink.once(containerExports.ReceiverEvents.message, (context) => {
        if (!context.message) {
          return rej(new Error("Receiver has not received any message"));
        }
        const response = new DeleteBindingResponseDecoder().decodeFrom(context.message, String(message.message_id));
        if (response.status === "error") {
          return rej(response.error);
        }
        return res(true);
      });
      const message = new LinkMessageBuilder().sendTo(
        `/${AmqpEndpoints.Bindings}/${buildUnbindEndpointFrom({ source: options.source, destination: options.destination, key })}`
      ).setReplyTo(ME).setAmqpMethod(AmqpMethods.DELETE).build();
      this.senderLink.send(message);
    });
  }
}
function buildDeclareQueueBody(options) {
  const body = {
    exclusive: options.exclusive ?? false,
    durable: options.durable ?? true,
    // needed at least by quorum queue type
    auto_delete: options.autoDelete ?? false,
    arguments: buildArgumentsFrom(options.type, options.arguments)
  };
  switch (options.type) {
    case "quorum":
      body.arguments = addQuorumArgumentsFrom(body.arguments, options);
      return body;
    case "classic":
      body.arguments = addClassicArgumentsFrom(body.arguments, options);
      return body;
    case "stream":
    default:
      return body;
  }
}
function addQuorumArgumentsFrom(args, options) {
  return {
    ...args,
    ...options.deadLetterStrategy ? { "x-dead-letter-strategy": options.deadLetterStrategy } : {},
    ...options.deliveryLimit ? { "x-max-delivery-limit": options.deliveryLimit } : {},
    ...options.initialGroupSize ? { "x-quorum-initial-group-size": options.initialGroupSize } : {},
    ...options.targetGroupSize ? { "x-quorum-target-group-size": options.targetGroupSize } : {}
  };
}
function addClassicArgumentsFrom(args, options) {
  return {
    ...args,
    ...options.maxPriority ? { "x-max-priority": options.maxPriority } : {},
    ...options.mode ? { "x-queue-mode": options.mode } : {},
    ...options.version ? { "x-queue-version": options.version } : {}
  };
}
function buildArgumentsFrom(queueType, queueOptions) {
  return { ...queueOptions ?? {}, ...queueType ? { "x-queue-type": queueType } : {} };
}
function buildUnbindEndpointFrom({
  source,
  destination,
  key
}) {
  if (destination instanceof AmqpExchange) {
    return `src=${encodeURIComponent(source.getInfo.name)};dste=${encodeURIComponent(destination.getInfo.name)};key=${encodeURIComponent(key)};args=`;
  }
  return `src=${encodeURIComponent(source.getInfo.name)};dstq=${encodeURIComponent(destination.getInfo.name)};key=${encodeURIComponent(key)};args=`;
}
function buildBindingDestinationFrom(destination) {
  if (destination instanceof AmqpExchange) {
    return { destination_exchange: destination.getInfo.name };
  }
  return { destination_queue: destination.getInfo.name };
}
var utilExports = requireUtil$1();
function createAmqpMessage(options) {
  if (options.destination) {
    return {
      message_id: containerExports.generate_uuid(),
      body: options.body,
      to: createPublisherAddressFrom(options.destination),
      durable: true,
      message_annotations: options.annotations
    };
  }
  return { message_id: containerExports.generate_uuid(), body: options.body, durable: true, message_annotations: options.annotations };
}
function createPublisherAddressFrom(options) {
  if (!options) return void 0;
  if ("queue" in options) return `/${AmqpEndpoints.Queues}/${options.queue.name}`;
  if ("exchange" in options) {
    return options.exchange.routingKey ? `/${AmqpEndpoints.Exchanges}/${options.exchange.name}/${options.exchange.routingKey}` : `/${AmqpEndpoints.Exchanges}/${options.exchange.name}`;
  }
  throw new Error(`Unknown publisher options -- ${utilExports.inspect(options)}`);
}
const getPublisherSenderLinkConfigurationFrom = (publisherId, address) => ({
  snd_settle_mode: 0,
  rcv_settle_mode: 0,
  name: publisherId,
  target: { address, expiry_policy: "SESSION_END", durable: 0, dynamic: false },
  source: {
    address: address ?? "",
    expiry_policy: "LINK_DETACH",
    timeout: 0,
    dynamic: false,
    durable: 0
  }
});
class AmqpPublisher {
  constructor(connection2, senderLink, _id, publishersList) {
    this.connection = connection2;
    this.senderLink = senderLink;
    this._id = _id;
    this.publishersList = publishersList;
    console.log(this.connection.container_id);
    this.successMessageHandler = (senderEvent) => {
      return (context) => {
        if (context.delivery) {
          const promise = this.promiseMessagesHandler.get(context.delivery.id);
          if (promise) {
            this.promiseMessagesHandler.delete(context.delivery.id);
            return promise.resolve({ delivery: context.delivery, outcome: getOutcomeStateFrom(senderEvent) });
          }
        }
      };
    };
    this.errorMessageHandler = (context, errorEvent, deliveryId) => {
      const promise = this.promiseMessagesHandler.get(deliveryId);
      if (promise) {
        this.promiseMessagesHandler.delete(deliveryId);
        const error = new Error(`SenderLink error ${errorEvent}: ${utilExports.inspect(context.error)}`);
        return promise.reject(error);
      }
    };
    this.registerEventListeners();
  }
  static async createFrom(connection2, publishersList, options) {
    const address = createPublisherAddressFrom(options);
    const id = v4();
    const senderLink = await AmqpPublisher.openSender(connection2, id, address);
    return new AmqpPublisher(connection2, senderLink, id, publishersList);
  }
  static async openSender(connection2, publisherId, address) {
    return openLink(
      connection2,
      containerExports.SenderEvents.senderOpen,
      containerExports.SenderEvents.senderError,
      connection2.open_sender.bind(connection2),
      getPublisherSenderLinkConfigurationFrom(publisherId, address)
    );
  }
  successMessageHandler;
  errorMessageHandler;
  promiseMessagesHandler = /* @__PURE__ */ new Map();
  registerEventListeners() {
    this.senderLink.on(containerExports.SenderEvents.accepted, this.successMessageHandler(containerExports.SenderEvents.accepted));
    this.senderLink.on(containerExports.SenderEvents.rejected, this.successMessageHandler(containerExports.SenderEvents.rejected));
    this.senderLink.on(containerExports.SenderEvents.released, this.successMessageHandler(containerExports.SenderEvents.released));
    this.senderLink.on(containerExports.SenderEvents.senderError, (context) => {
      for (const id of this.promiseMessagesHandler.keys())
        this.errorMessageHandler(context, containerExports.SenderEvents.senderError, id);
    });
  }
  removeEventListeners() {
    this.senderLink.removeAllListeners();
  }
  async publish(message) {
    return new Promise((res, rej) => {
      const delivery = this.senderLink.send(message);
      this.promiseMessagesHandler.set(delivery.id, {
        resolve: (publishResult) => res(publishResult),
        reject: (error) => rej(error)
      });
    });
  }
  close() {
    this.removeEventListeners();
    if (this.senderLink.is_open()) this.senderLink.close();
    if (this.publishersList.has(this._id)) this.publishersList.delete(this._id);
  }
  get id() {
    return this._id;
  }
}
function getOutcomeStateFrom(event) {
  switch (event) {
    case containerExports.SenderEvents.released:
      return OutcomeState.RELEASED;
    case containerExports.SenderEvents.rejected:
      return OutcomeState.REJECTED;
    case containerExports.SenderEvents.accepted:
      return OutcomeState.ACCEPTED;
  }
}
class AmqpDeliveryContext {
  constructor(delivery, receiverLink) {
    this.delivery = delivery;
    this.receiverLink = receiverLink;
  }
  accept() {
    if (this.receiverLink.is_closed()) throw new Error("Receiver link is closed");
    this.delivery.accept();
  }
  discard(annotations) {
    if (this.receiverLink.is_closed()) throw new Error("Receiver link is closed");
    if (!annotations) {
      this.delivery.reject();
      return;
    }
    this.discardWithAnnotations(annotations);
  }
  discardWithAnnotations(annotations) {
    this.delivery.modified({
      delivery_failed: true,
      undeliverable_here: true,
      message_annotations: annotations
    });
  }
  requeue(annotations) {
    if (this.receiverLink.is_closed()) throw new Error("Receiver link is closed");
    if (!annotations) {
      this.delivery.release();
      return;
    }
    this.requeueWithAnnotations(annotations);
  }
  requeueWithAnnotations(annotations) {
    this.delivery.modified({
      delivery_failed: false,
      undeliverable_here: false,
      message_annotations: annotations
    });
  }
}
const getConsumerReceiverLinkConfigurationFrom = (address, consumerId, filter2) => ({
  snd_settle_mode: 0,
  rcv_settle_mode: 0,
  name: consumerId,
  target: { address, expiry_policy: "SESSION_END", durable: 0, dynamic: false },
  source: {
    address,
    expiry_policy: "LINK_DETACH",
    timeout: 0,
    dynamic: false,
    durable: 0,
    filter: filter2
  }
});
class AmqpConsumer {
  constructor(_id, connection2, consumersList, receiverLink, params) {
    this._id = _id;
    this.connection = connection2;
    this.consumersList = consumersList;
    this.receiverLink = receiverLink;
    this.params = params;
    console.log(this.connection.container_id);
  }
  static async createFrom(connection2, consumersList, params) {
    const id = containerExports.generate_uuid();
    const address = createConsumerAddressFrom(params);
    const filter2 = createConsumerFilterFrom(params);
    if (!address) throw new Error("Consumer must have an address");
    const receiverLink = await AmqpConsumer.openReceiver(connection2, address, id, filter2);
    return new AmqpConsumer(id, connection2, consumersList, receiverLink, params);
  }
  static async openReceiver(connection2, address, consumerId, filter2) {
    return openLink(
      connection2,
      containerExports.ReceiverEvents.receiverOpen,
      containerExports.ReceiverEvents.receiverError,
      connection2.open_receiver.bind(connection2),
      getConsumerReceiverLinkConfigurationFrom(address, consumerId, filter2)
    );
  }
  get id() {
    return this._id;
  }
  start() {
    this.receiverLink.on(containerExports.ReceiverEvents.message, (context) => {
      if (context.message && context.delivery) {
        const deliveryContext = new AmqpDeliveryContext(context.delivery, this.receiverLink);
        this.params.messageHandler(deliveryContext, context.message);
      }
    });
  }
  close() {
    this.receiverLink.removeAllListeners();
    if (this.receiverLink.is_open()) this.receiverLink.close();
    if (this.consumersList.has(this._id)) this.consumersList.delete(this._id);
  }
}
function createConsumerFilterFrom(params) {
  if ("queue" in params) {
    return void 0;
  }
  if (!params.stream.offset && !params.stream.filterValues) {
    throw new Error("At least one between offset and filterValues must be set when using filtering");
  }
  const filters = {};
  if (params.stream.offset) {
    filters[STREAM_OFFSET_SPEC] = params.stream.offset.toValue();
  }
  if (params.stream.filterValues) {
    filters[STREAM_FILTER_SPEC] = params.stream.filterValues;
  }
  if (params.stream.matchUnfiltered) {
    filters[STREAM_FILTER_MATCH_UNFILTERED] = params.stream.matchUnfiltered;
  }
  return filters;
}
function createConsumerAddressFrom(params) {
  if ("queue" in params) return `/${AmqpEndpoints.Queues}/${params.queue.name}`;
  if ("stream" in params) return `/${AmqpEndpoints.Queues}/${params.stream.name}`;
  throw new Error(`Unknown publisher options -- ${utilExports.inspect(params)}`);
}
class AmqpConnection {
  constructor(connection2, topologyManagement) {
    this.connection = connection2;
    this.topologyManagement = topologyManagement;
  }
  _publishers = /* @__PURE__ */ new Map();
  _consumers = /* @__PURE__ */ new Map();
  static async create(envParams, connParams) {
    const connection2 = await AmqpConnection.open(envParams, connParams);
    const topologyManagement = await AmqpManagement.create(connection2);
    return new AmqpConnection(connection2, topologyManagement);
  }
  static async open(envParams, connParams) {
    return new Promise((res, rej) => {
      const container2 = containerExports.create_container();
      container2.once(containerExports.ConnectionEvents.connectionOpen, (context) => {
        return res(context.connection);
      });
      container2.once(containerExports.ConnectionEvents.error, (context) => {
        return rej(context.error ?? new Error("Connection error occurred"));
      });
      container2.connect(buildConnectParams(envParams, connParams));
    });
  }
  async close() {
    return new Promise((res, rej) => {
      this.connection.once(containerExports.ConnectionEvents.connectionClose, () => {
        return res(true);
      });
      this.connection.once(containerExports.ConnectionEvents.connectionError, (context) => {
        return rej(new Error("Connection error: " + context.connection.error));
      });
      this._publishers.forEach((p) => p.close());
      this._consumers.forEach((p) => p.close());
      this.connection.close();
    });
  }
  async createConsumer(params) {
    const consumer = await AmqpConsumer.createFrom(this.connection, this._consumers, params);
    this._consumers.set(consumer.id, consumer);
    return consumer;
  }
  management() {
    return this.topologyManagement;
  }
  async createPublisher(options) {
    const publisher = await AmqpPublisher.createFrom(this.connection, this._publishers, options);
    this._publishers.set(publisher.id, publisher);
    return publisher;
  }
  get publishers() {
    return this._publishers;
  }
  get consumers() {
    return this._consumers;
  }
  isOpen() {
    return this.connection ? this.connection.is_open() : false;
  }
}
function buildConnectParams(envParams, connParams) {
  const reconnectParams = buildReconnectParams(connParams);
  if (envParams.webSocket) {
    const ws2 = containerExports.websocket_connect(envParams.webSocket);
    const wsUrl = envParams.webSocketUrl ?? `ws://${envParams.host}:${envParams.port}/ws`;
    const connectionDetails = ws2(wsUrl, "amqp", {});
    return {
      connection_details: () => {
        return {
          ...connectionDetails(),
          host: envParams.host,
          port: envParams.port
        };
      },
      ...envParams,
      ...reconnectParams
    };
  }
  return {
    ...envParams,
    ...reconnectParams
  };
}
function buildReconnectParams(connParams) {
  if (connParams && connParams.reconnect) {
    return {
      reconnect: connParams.reconnect,
      initial_reconnect_delay: connParams.initialReconnectDelay,
      max_reconnect_delay: connParams.maxReconnectDelay,
      reconnect_limit: connParams.reconnectLimit
    };
  }
  if (connParams && !connParams.reconnect) return { reconnect: false };
  return { reconnect: true };
}
class AmqpEnvironment {
  constructor(params, connections = []) {
    this.params = params;
    this.connections = connections;
  }
  async createConnection(params) {
    const connection2 = await AmqpConnection.create(this.params, params);
    this.connections.push(connection2);
    return connection2;
  }
  async close() {
    await this.closeConnections();
    this.connections.length = 0;
  }
  async closeConnections() {
    await Promise.allSettled(
      this.connections.map(async (c) => {
        if (c.isOpen()) await c.close();
      })
    );
  }
}
function createEnvironment(params) {
  return new AmqpEnvironment(params);
}
global$1.AmqpManagement = AmqpManagement;
global$1.createEnvironment = createEnvironment;
global$1.AmqpEnvironment = AmqpEnvironment;
export {
  AmqpConnection,
  AmqpConsumer,
  AmqpPublisher,
  Offset,
  OffsetType,
  OutcomeState,
  createAmqpMessage
};
