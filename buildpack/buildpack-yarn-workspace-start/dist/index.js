/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 9076:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => /* binding */ BuildContext
});

// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(5747);
var external_fs_default = /*#__PURE__*/__webpack_require__.n(external_fs_);

// EXTERNAL MODULE: ../../.yarn/cache/@iarna-toml-npm-2.2.5-6da1399e8e-929a8516a2.zip/node_modules/@iarna/toml/toml.js
var toml = __webpack_require__(8292);

// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(5622);

// CONCATENATED MODULE: ../buildpack-core/src/cnb/launch.ts



class Launch {
    constructor() {
        this.processes = [];
    }
    addWebProcess([command, ...args]) {
        this.processes.push({ type: 'web', command, direct: true, args });
    }
    save(layersPath) {
        if (this.processes.length > 0) {
            const launchPath = (0,external_path_.join)(layersPath, 'launch.toml');
            external_fs_default().writeFileSync(launchPath, (0,toml.stringify)({
                processes: this.processes,
            }));
        }
    }
}

// CONCATENATED MODULE: ../buildpack-core/src/cnb/build.context.ts

class BuildContext {
    constructor(workingDir, buildpackPath, layers, plan) {
        this.workingDir = workingDir;
        this.buildpackPath = buildpackPath;
        this.layers = layers;
        this.plan = plan;
        this.launch = new Launch();
    }
    addWebProcess(command) {
        this.launch.addWebProcess(command);
    }
}


/***/ }),

/***/ 6315:
/***/ (() => {



/***/ }),

/***/ 3543:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "R": () => /* binding */ BuildpackPlanEntry
/* harmony export */ });
class BuildpackPlanEntry {
    constructor(name, version = null, metadata = {}) {
        this.name = name;
        this.version = version;
        this.metadata = metadata;
    }
}


/***/ }),

/***/ 2453:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "D": () => /* binding */ BuildpackPlan
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5747);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _iarna_toml__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8292);
/* harmony import */ var _buildpack_plan_entry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3543);



class BuildpackPlan {
    constructor(entries) {
        this.entries = entries;
    }
    static load(planPath) {
        const { entries = [] } = (0,_iarna_toml__WEBPACK_IMPORTED_MODULE_1__.parse)(fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(planPath).toString());
        return new BuildpackPlan(entries.map((entry) => new _buildpack_plan_entry__WEBPACK_IMPORTED_MODULE_2__/* .BuildpackPlanEntry */ .R(entry.name, entry.version, entry.metadata)));
    }
    getEntry(name) {
        return this.entries.find((entry) => entry.name === name);
    }
}


/***/ }),

/***/ 4983:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "D": () => /* binding */ Config
/* harmony export */ });
class Config {
    constructor(args) {
        this.args = args;
    }
    get arguments() {
        return this.args;
    }
}


/***/ }),

/***/ 6804:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "a": () => /* binding */ DetectContext
/* harmony export */ });
class DetectContext {
    constructor(workingDir, buildpackPath) {
        this.workingDir = workingDir;
        this.buildpackPath = buildpackPath;
    }
}


/***/ }),

/***/ 6479:
/***/ (() => {



/***/ }),

/***/ 7236:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "t": () => /* binding */ ExitHandler
/* harmony export */ });
class ExitHandler {
    static pass() {
        process.exit(ExitHandler.PassStatusCode);
    }
    static fail() {
        process.exit(ExitHandler.FailStatusCode);
    }
    static error(error) {
        console.error(error);
        process.exit(ExitHandler.ErrorStatusCode);
    }
}
ExitHandler.ErrorStatusCode = 1;
ExitHandler.FailStatusCode = 100;
ExitHandler.PassStatusCode = 0;


/***/ }),

/***/ 5808:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BuildpackPlanEntry": () => /* reexport safe */ _buildpack_plan_entry__WEBPACK_IMPORTED_MODULE_0__.R,
/* harmony export */   "BuildpackPlan": () => /* reexport safe */ _buildpack_plan__WEBPACK_IMPORTED_MODULE_1__.D,
/* harmony export */   "DetectContext": () => /* reexport safe */ _detect_context__WEBPACK_IMPORTED_MODULE_2__.a,
/* harmony export */   "BuildContext": () => /* reexport safe */ _build_context__WEBPACK_IMPORTED_MODULE_3__.Z,
/* harmony export */   "ExitHandler": () => /* reexport safe */ _exit_handler__WEBPACK_IMPORTED_MODULE_4__.t,
/* harmony export */   "Config": () => /* reexport safe */ _config__WEBPACK_IMPORTED_MODULE_7__.D,
/* harmony export */   "Layers": () => /* reexport safe */ _layers__WEBPACK_IMPORTED_MODULE_8__.S,
/* harmony export */   "Layer": () => /* reexport safe */ _layer__WEBPACK_IMPORTED_MODULE_9__.m
/* harmony export */ });
/* harmony import */ var _buildpack_plan_entry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3543);
/* harmony import */ var _buildpack_plan__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2453);
/* harmony import */ var _detect_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6804);
/* harmony import */ var _build_context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9076);
/* harmony import */ var _exit_handler__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7236);
/* harmony import */ var _detector__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6479);
/* harmony import */ var _detector__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_detector__WEBPACK_IMPORTED_MODULE_5__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _detector__WEBPACK_IMPORTED_MODULE_5__) if(["default","BuildpackPlanEntry","BuildpackPlan","DetectContext","BuildContext","ExitHandler"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _detector__WEBPACK_IMPORTED_MODULE_5__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _builder__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6315);
/* harmony import */ var _builder__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_builder__WEBPACK_IMPORTED_MODULE_6__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _builder__WEBPACK_IMPORTED_MODULE_6__) if(["default","BuildpackPlanEntry","BuildpackPlan","DetectContext","BuildContext","ExitHandler"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _builder__WEBPACK_IMPORTED_MODULE_6__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(4983);
/* harmony import */ var _layers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(6981);
/* harmony import */ var _layer__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(5171);












/***/ }),

/***/ 5171:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "m": () => /* binding */ Layer
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5747);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _iarna_toml__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8292);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5622);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);



class Layer {
    constructor(name, path, build, cache, launch) {
        this.name = name;
        this.path = path;
        this.build = build;
        this.cache = cache;
        this.launch = launch;
        this.metadata = {};
    }
    reset() {
        this.metadata = {};
        if (fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(this.path)) {
            fs__WEBPACK_IMPORTED_MODULE_0___default().rmdirSync(this.path);
        }
        fs__WEBPACK_IMPORTED_MODULE_0___default().mkdirSync(this.path);
    }
    load(layersPath) {
        const metadataPath = (0,path__WEBPACK_IMPORTED_MODULE_2__.join)(layersPath, `${this.name}.toml`);
        if (fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(metadataPath)) {
            try {
                const parsed = (0,_iarna_toml__WEBPACK_IMPORTED_MODULE_1__.parse)(fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(metadataPath).toString());
                this.metadata = parsed.metadata || {};
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    save(layersPath) {
        const metadataPath = (0,path__WEBPACK_IMPORTED_MODULE_2__.join)(layersPath, `${this.name}.toml`);
        fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(metadataPath, (0,_iarna_toml__WEBPACK_IMPORTED_MODULE_1__.stringify)({
            metadata: this.metadata,
            build: this.build,
            cache: this.cache,
            launch: this.launch,
        }));
    }
}


/***/ }),

/***/ 6981:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "S": () => /* binding */ Layers
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5622);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _layer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5171);


class Layers {
    constructor(path) {
        this.path = path;
        this.layers = new Map();
    }
    get(name, build = false, cache = false, launch = false) {
        if (this.layers.has(name)) {
            return this.layers.get(name);
        }
        const layer = new _layer__WEBPACK_IMPORTED_MODULE_1__/* .Layer */ .m(name, (0,path__WEBPACK_IMPORTED_MODULE_0__.join)(this.path, name), build, cache, launch);
        layer.load(this.path);
        this.layers.set(name, layer);
        return layer;
    }
    save() {
        for (const layer of this.layers.values()) {
            layer.save(this.path);
        }
    }
}


/***/ }),

/***/ 6774:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "run": () => /* reexport safe */ _run__WEBPACK_IMPORTED_MODULE_1__.K
/* harmony export */ });
/* harmony import */ var _cnb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5808);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _cnb__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _cnb__WEBPACK_IMPORTED_MODULE_0__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _run__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5425);




/***/ }),

/***/ 5425:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "K": () => /* binding */ run
});

// EXTERNAL MODULE: ../buildpack-core/src/cnb/index.ts
var cnb = __webpack_require__(5808);

// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(5747);
var external_fs_default = /*#__PURE__*/__webpack_require__.n(external_fs_);

// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(5622);
var external_path_default = /*#__PURE__*/__webpack_require__.n(external_path_);

// EXTERNAL MODULE: ../../.yarn/cache/@iarna-toml-npm-2.2.5-6da1399e8e-929a8516a2.zip/node_modules/@iarna/toml/toml.js
var toml = __webpack_require__(8292);

// CONCATENATED MODULE: ../buildpack-core/src/build.ts




const build = async (builder, config) => {
    if (config.arguments.length !== 4) {
        cnb.ExitHandler.error(new Error(`Expected 3 arguments and received ${config.arguments.length - 1}`));
    }
    try {
        const context = new cnb.BuildContext(process.cwd(), process.env.CNB_BUILDPACK_DIR
            ? process.env.CNB_BUILDPACK_DIR
            : config.arguments[0].replace('/bin/build', ''), new cnb.Layers(config.arguments[1]), cnb.BuildpackPlan.load(config.arguments[3]));
        await builder.build(context);
        context.layers.save();
        context.launch.save(context.layers.path);
    }
    catch (error) {
        cnb.ExitHandler.error(error);
    }
};

// CONCATENATED MODULE: ../buildpack-core/src/detect.ts




const detect = async (detector, config) => {
    if (config.arguments.length !== 3) {
        cnb.ExitHandler.error(new Error(`Expected 2 arguments and received ${config.arguments.length - 1}`));
    }
    const context = new cnb.DetectContext(process.cwd(), process.env.CNB_BUILDPACK_DIR
        ? process.env.CNB_BUILDPACK_DIR
        : config.arguments[0].replace('/bin/detect', ''));
    try {
        const result = await detector.detect(context);
        if (result) {
            external_fs_default().writeFileSync(config.arguments[2], (0,toml.stringify)(result));
        }
        else {
            cnb.ExitHandler.fail();
        }
    }
    catch (error) {
        cnb.ExitHandler.error(error);
    }
};

// CONCATENATED MODULE: ../buildpack-core/src/run.ts





const run = async (detector, builder) => {
    const config = new cnb.Config(process.argv.slice(1, process.argv.length));
    const phase = external_path_default().basename(config.arguments[0]);
    if (phase === 'detect') {
        await detect(detector, config);
    }
    else if (phase === 'build') {
        if (builder) {
            await build(builder, config);
        }
    }
    else {
        cnb.ExitHandler.error(new Error(`Unsupported phase ${phase}`));
    }
};


/***/ }),

/***/ 3424:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const f = __webpack_require__(8428)
const DateTime = global.Date

class Date extends DateTime {
  constructor (value) {
    super(value)
    this.isDate = true
  }
  toISOString () {
    return `${this.getUTCFullYear()}-${f(2, this.getUTCMonth() + 1)}-${f(2, this.getUTCDate())}`
  }
}

module.exports = value => {
  const date = new Date(value)
  /* istanbul ignore if */
  if (isNaN(date)) {
    throw new TypeError('Invalid Datetime')
  } else {
    return date
  }
}


/***/ }),

/***/ 1121:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const f = __webpack_require__(8428)

class FloatingDateTime extends Date {
  constructor (value) {
    super(value + 'Z')
    this.isFloating = true
  }
  toISOString () {
    const date = `${this.getUTCFullYear()}-${f(2, this.getUTCMonth() + 1)}-${f(2, this.getUTCDate())}`
    const time = `${f(2, this.getUTCHours())}:${f(2, this.getUTCMinutes())}:${f(2, this.getUTCSeconds())}.${f(3, this.getUTCMilliseconds())}`
    return `${date}T${time}`
  }
}

module.exports = value => {
  const date = new FloatingDateTime(value)
  /* istanbul ignore if */
  if (isNaN(date)) {
    throw new TypeError('Invalid Datetime')
  } else {
    return date
  }
}


/***/ }),

/***/ 1530:
/***/ ((module) => {

"use strict";

module.exports = value => {
  const date = new Date(value)
  /* istanbul ignore if */
  if (isNaN(date)) {
    throw new TypeError('Invalid Datetime')
  } else {
    return date
  }
}


/***/ }),

/***/ 2210:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const f = __webpack_require__(8428)

class Time extends Date {
  constructor (value) {
    super(`0000-01-01T${value}Z`)
    this.isTime = true
  }
  toISOString () {
    return `${f(2, this.getUTCHours())}:${f(2, this.getUTCMinutes())}:${f(2, this.getUTCSeconds())}.${f(3, this.getUTCMilliseconds())}`
  }
}

module.exports = value => {
  const date = new Time(value)
  /* istanbul ignore if */
  if (isNaN(date)) {
    throw new TypeError('Invalid Datetime')
  } else {
    return date
  }
}


/***/ }),

/***/ 8428:
/***/ ((module) => {

"use strict";

module.exports = (d, num) => {
  num = String(num)
  while (num.length < d) num = '0' + num
  return num
}


/***/ }),

/***/ 3870:
/***/ ((module) => {

"use strict";

const ParserEND = 0x110000
class ParserError extends Error {
  /* istanbul ignore next */
  constructor (msg, filename, linenumber) {
    super('[ParserError] ' + msg, filename, linenumber)
    this.name = 'ParserError'
    this.code = 'ParserError'
    if (Error.captureStackTrace) Error.captureStackTrace(this, ParserError)
  }
}
class State {
  constructor (parser) {
    this.parser = parser
    this.buf = ''
    this.returned = null
    this.result = null
    this.resultTable = null
    this.resultArr = null
  }
}
class Parser {
  constructor () {
    this.pos = 0
    this.col = 0
    this.line = 0
    this.obj = {}
    this.ctx = this.obj
    this.stack = []
    this._buf = ''
    this.char = null
    this.ii = 0
    this.state = new State(this.parseStart)
  }

  parse (str) {
    /* istanbul ignore next */
    if (str.length === 0 || str.length == null) return

    this._buf = String(str)
    this.ii = -1
    this.char = -1
    let getNext
    while (getNext === false || this.nextChar()) {
      getNext = this.runOne()
    }
    this._buf = null
  }
  nextChar () {
    if (this.char === 0x0A) {
      ++this.line
      this.col = -1
    }
    ++this.ii
    this.char = this._buf.codePointAt(this.ii)
    ++this.pos
    ++this.col
    return this.haveBuffer()
  }
  haveBuffer () {
    return this.ii < this._buf.length
  }
  runOne () {
    return this.state.parser.call(this, this.state.returned)
  }
  finish () {
    this.char = ParserEND
    let last
    do {
      last = this.state.parser
      this.runOne()
    } while (this.state.parser !== last)

    this.ctx = null
    this.state = null
    this._buf = null

    return this.obj
  }
  next (fn) {
    /* istanbul ignore next */
    if (typeof fn !== 'function') throw new ParserError('Tried to set state to non-existent state: ' + JSON.stringify(fn))
    this.state.parser = fn
  }
  goto (fn) {
    this.next(fn)
    return this.runOne()
  }
  call (fn, returnWith) {
    if (returnWith) this.next(returnWith)
    this.stack.push(this.state)
    this.state = new State(fn)
  }
  callNow (fn, returnWith) {
    this.call(fn, returnWith)
    return this.runOne()
  }
  return (value) {
    /* istanbul ignore next */
    if (this.stack.length === 0) throw this.error(new ParserError('Stack underflow'))
    if (value === undefined) value = this.state.buf
    this.state = this.stack.pop()
    this.state.returned = value
  }
  returnNow (value) {
    this.return(value)
    return this.runOne()
  }
  consume () {
    /* istanbul ignore next */
    if (this.char === ParserEND) throw this.error(new ParserError('Unexpected end-of-buffer'))
    this.state.buf += this._buf[this.ii]
  }
  error (err) {
    err.line = this.line
    err.col = this.col
    err.pos = this.pos
    return err
  }
  /* istanbul ignore next */
  parseStart () {
    throw new ParserError('Must declare a parseStart method')
  }
}
Parser.END = ParserEND
Parser.Error = ParserError
module.exports = Parser


/***/ }),

/***/ 9010:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable no-new-wrappers, no-eval, camelcase, operator-linebreak */
module.exports = makeParserClass(__webpack_require__(3870))
module.exports.makeParserClass = makeParserClass

class TomlError extends Error {
  constructor (msg) {
    super(msg)
    this.name = 'TomlError'
    /* istanbul ignore next */
    if (Error.captureStackTrace) Error.captureStackTrace(this, TomlError)
    this.fromTOML = true
    this.wrapped = null
  }
}
TomlError.wrap = err => {
  const terr = new TomlError(err.message)
  terr.code = err.code
  terr.wrapped = err
  return terr
}
module.exports.TomlError = TomlError

const createDateTime = __webpack_require__(1530)
const createDateTimeFloat = __webpack_require__(1121)
const createDate = __webpack_require__(3424)
const createTime = __webpack_require__(2210)

const CTRL_I = 0x09
const CTRL_J = 0x0A
const CTRL_M = 0x0D
const CTRL_CHAR_BOUNDARY = 0x1F // the last non-character in the latin1 region of unicode, except DEL
const CHAR_SP = 0x20
const CHAR_QUOT = 0x22
const CHAR_NUM = 0x23
const CHAR_APOS = 0x27
const CHAR_PLUS = 0x2B
const CHAR_COMMA = 0x2C
const CHAR_HYPHEN = 0x2D
const CHAR_PERIOD = 0x2E
const CHAR_0 = 0x30
const CHAR_1 = 0x31
const CHAR_7 = 0x37
const CHAR_9 = 0x39
const CHAR_COLON = 0x3A
const CHAR_EQUALS = 0x3D
const CHAR_A = 0x41
const CHAR_E = 0x45
const CHAR_F = 0x46
const CHAR_T = 0x54
const CHAR_U = 0x55
const CHAR_Z = 0x5A
const CHAR_LOWBAR = 0x5F
const CHAR_a = 0x61
const CHAR_b = 0x62
const CHAR_e = 0x65
const CHAR_f = 0x66
const CHAR_i = 0x69
const CHAR_l = 0x6C
const CHAR_n = 0x6E
const CHAR_o = 0x6F
const CHAR_r = 0x72
const CHAR_s = 0x73
const CHAR_t = 0x74
const CHAR_u = 0x75
const CHAR_x = 0x78
const CHAR_z = 0x7A
const CHAR_LCUB = 0x7B
const CHAR_RCUB = 0x7D
const CHAR_LSQB = 0x5B
const CHAR_BSOL = 0x5C
const CHAR_RSQB = 0x5D
const CHAR_DEL = 0x7F
const SURROGATE_FIRST = 0xD800
const SURROGATE_LAST = 0xDFFF

const escapes = {
  [CHAR_b]: '\u0008',
  [CHAR_t]: '\u0009',
  [CHAR_n]: '\u000A',
  [CHAR_f]: '\u000C',
  [CHAR_r]: '\u000D',
  [CHAR_QUOT]: '\u0022',
  [CHAR_BSOL]: '\u005C'
}

function isDigit (cp) {
  return cp >= CHAR_0 && cp <= CHAR_9
}
function isHexit (cp) {
  return (cp >= CHAR_A && cp <= CHAR_F) || (cp >= CHAR_a && cp <= CHAR_f) || (cp >= CHAR_0 && cp <= CHAR_9)
}
function isBit (cp) {
  return cp === CHAR_1 || cp === CHAR_0
}
function isOctit (cp) {
  return (cp >= CHAR_0 && cp <= CHAR_7)
}
function isAlphaNumQuoteHyphen (cp) {
  return (cp >= CHAR_A && cp <= CHAR_Z)
      || (cp >= CHAR_a && cp <= CHAR_z)
      || (cp >= CHAR_0 && cp <= CHAR_9)
      || cp === CHAR_APOS
      || cp === CHAR_QUOT
      || cp === CHAR_LOWBAR
      || cp === CHAR_HYPHEN
}
function isAlphaNumHyphen (cp) {
  return (cp >= CHAR_A && cp <= CHAR_Z)
      || (cp >= CHAR_a && cp <= CHAR_z)
      || (cp >= CHAR_0 && cp <= CHAR_9)
      || cp === CHAR_LOWBAR
      || cp === CHAR_HYPHEN
}
const _type = Symbol('type')
const _declared = Symbol('declared')

const hasOwnProperty = Object.prototype.hasOwnProperty
const defineProperty = Object.defineProperty
const descriptor = {configurable: true, enumerable: true, writable: true, value: undefined}

function hasKey (obj, key) {
  if (hasOwnProperty.call(obj, key)) return true
  if (key === '__proto__') defineProperty(obj, '__proto__', descriptor)
  return false
}

const INLINE_TABLE = Symbol('inline-table')
function InlineTable () {
  return Object.defineProperties({}, {
    [_type]: {value: INLINE_TABLE}
  })
}
function isInlineTable (obj) {
  if (obj === null || typeof (obj) !== 'object') return false
  return obj[_type] === INLINE_TABLE
}

const TABLE = Symbol('table')
function Table () {
  return Object.defineProperties({}, {
    [_type]: {value: TABLE},
    [_declared]: {value: false, writable: true}
  })
}
function isTable (obj) {
  if (obj === null || typeof (obj) !== 'object') return false
  return obj[_type] === TABLE
}

const _contentType = Symbol('content-type')
const INLINE_LIST = Symbol('inline-list')
function InlineList (type) {
  return Object.defineProperties([], {
    [_type]: {value: INLINE_LIST},
    [_contentType]: {value: type}
  })
}
function isInlineList (obj) {
  if (obj === null || typeof (obj) !== 'object') return false
  return obj[_type] === INLINE_LIST
}

const LIST = Symbol('list')
function List () {
  return Object.defineProperties([], {
    [_type]: {value: LIST}
  })
}
function isList (obj) {
  if (obj === null || typeof (obj) !== 'object') return false
  return obj[_type] === LIST
}

// in an eval, to let bundlers not slurp in a util proxy
let _custom
try {
  const utilInspect = eval("require('util').inspect")
  _custom = utilInspect.custom
} catch (_) {
  /* eval require not available in transpiled bundle */
}
/* istanbul ignore next */
const _inspect = _custom || 'inspect'

class BoxedBigInt {
  constructor (value) {
    try {
      this.value = global.BigInt.asIntN(64, value)
    } catch (_) {
      /* istanbul ignore next */
      this.value = null
    }
    Object.defineProperty(this, _type, {value: INTEGER})
  }
  isNaN () {
    return this.value === null
  }
  /* istanbul ignore next */
  toString () {
    return String(this.value)
  }
  /* istanbul ignore next */
  [_inspect] () {
    return `[BigInt: ${this.toString()}]}`
  }
  valueOf () {
    return this.value
  }
}

const INTEGER = Symbol('integer')
function Integer (value) {
  let num = Number(value)
  // -0 is a float thing, not an int thing
  if (Object.is(num, -0)) num = 0
  /* istanbul ignore else */
  if (global.BigInt && !Number.isSafeInteger(num)) {
    return new BoxedBigInt(value)
  } else {
    /* istanbul ignore next */
    return Object.defineProperties(new Number(num), {
      isNaN: {value: function () { return isNaN(this) }},
      [_type]: {value: INTEGER},
      [_inspect]: {value: () => `[Integer: ${value}]`}
    })
  }
}
function isInteger (obj) {
  if (obj === null || typeof (obj) !== 'object') return false
  return obj[_type] === INTEGER
}

const FLOAT = Symbol('float')
function Float (value) {
  /* istanbul ignore next */
  return Object.defineProperties(new Number(value), {
    [_type]: {value: FLOAT},
    [_inspect]: {value: () => `[Float: ${value}]`}
  })
}
function isFloat (obj) {
  if (obj === null || typeof (obj) !== 'object') return false
  return obj[_type] === FLOAT
}

function tomlType (value) {
  const type = typeof value
  if (type === 'object') {
    /* istanbul ignore if */
    if (value === null) return 'null'
    if (value instanceof Date) return 'datetime'
    /* istanbul ignore else */
    if (_type in value) {
      switch (value[_type]) {
        case INLINE_TABLE: return 'inline-table'
        case INLINE_LIST: return 'inline-list'
        /* istanbul ignore next */
        case TABLE: return 'table'
        /* istanbul ignore next */
        case LIST: return 'list'
        case FLOAT: return 'float'
        case INTEGER: return 'integer'
      }
    }
  }
  return type
}

function makeParserClass (Parser) {
  class TOMLParser extends Parser {
    constructor () {
      super()
      this.ctx = this.obj = Table()
    }

    /* MATCH HELPER */
    atEndOfWord () {
      return this.char === CHAR_NUM || this.char === CTRL_I || this.char === CHAR_SP || this.atEndOfLine()
    }
    atEndOfLine () {
      return this.char === Parser.END || this.char === CTRL_J || this.char === CTRL_M
    }

    parseStart () {
      if (this.char === Parser.END) {
        return null
      } else if (this.char === CHAR_LSQB) {
        return this.call(this.parseTableOrList)
      } else if (this.char === CHAR_NUM) {
        return this.call(this.parseComment)
      } else if (this.char === CTRL_J || this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) {
        return null
      } else if (isAlphaNumQuoteHyphen(this.char)) {
        return this.callNow(this.parseAssignStatement)
      } else {
        throw this.error(new TomlError(`Unknown character "${this.char}"`))
      }
    }

    // HELPER, this strips any whitespace and comments to the end of the line
    // then RETURNS. Last state in a production.
    parseWhitespaceToEOL () {
      if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) {
        return null
      } else if (this.char === CHAR_NUM) {
        return this.goto(this.parseComment)
      } else if (this.char === Parser.END || this.char === CTRL_J) {
        return this.return()
      } else {
        throw this.error(new TomlError('Unexpected character, expected only whitespace or comments till end of line'))
      }
    }

    /* ASSIGNMENT: key = value */
    parseAssignStatement () {
      return this.callNow(this.parseAssign, this.recordAssignStatement)
    }
    recordAssignStatement (kv) {
      let target = this.ctx
      let finalKey = kv.key.pop()
      for (let kw of kv.key) {
        if (hasKey(target, kw) && (!isTable(target[kw]) || target[kw][_declared])) {
          throw this.error(new TomlError("Can't redefine existing key"))
        }
        target = target[kw] = target[kw] || Table()
      }
      if (hasKey(target, finalKey)) {
        throw this.error(new TomlError("Can't redefine existing key"))
      }
      // unbox our numbers
      if (isInteger(kv.value) || isFloat(kv.value)) {
        target[finalKey] = kv.value.valueOf()
      } else {
        target[finalKey] = kv.value
      }
      return this.goto(this.parseWhitespaceToEOL)
    }

    /* ASSSIGNMENT expression, key = value possibly inside an inline table */
    parseAssign () {
      return this.callNow(this.parseKeyword, this.recordAssignKeyword)
    }
    recordAssignKeyword (key) {
      if (this.state.resultTable) {
        this.state.resultTable.push(key)
      } else {
        this.state.resultTable = [key]
      }
      return this.goto(this.parseAssignKeywordPreDot)
    }
    parseAssignKeywordPreDot () {
      if (this.char === CHAR_PERIOD) {
        return this.next(this.parseAssignKeywordPostDot)
      } else if (this.char !== CHAR_SP && this.char !== CTRL_I) {
        return this.goto(this.parseAssignEqual)
      }
    }
    parseAssignKeywordPostDot () {
      if (this.char !== CHAR_SP && this.char !== CTRL_I) {
        return this.callNow(this.parseKeyword, this.recordAssignKeyword)
      }
    }

    parseAssignEqual () {
      if (this.char === CHAR_EQUALS) {
        return this.next(this.parseAssignPreValue)
      } else {
        throw this.error(new TomlError('Invalid character, expected "="'))
      }
    }
    parseAssignPreValue () {
      if (this.char === CHAR_SP || this.char === CTRL_I) {
        return null
      } else {
        return this.callNow(this.parseValue, this.recordAssignValue)
      }
    }
    recordAssignValue (value) {
      return this.returnNow({key: this.state.resultTable, value: value})
    }

    /* COMMENTS: #...eol */
    parseComment () {
      do {
        if (this.char === Parser.END || this.char === CTRL_J) {
          return this.return()
        }
      } while (this.nextChar())
    }

    /* TABLES AND LISTS, [foo] and [[foo]] */
    parseTableOrList () {
      if (this.char === CHAR_LSQB) {
        this.next(this.parseList)
      } else {
        return this.goto(this.parseTable)
      }
    }

    /* TABLE [foo.bar.baz] */
    parseTable () {
      this.ctx = this.obj
      return this.goto(this.parseTableNext)
    }
    parseTableNext () {
      if (this.char === CHAR_SP || this.char === CTRL_I) {
        return null
      } else {
        return this.callNow(this.parseKeyword, this.parseTableMore)
      }
    }
    parseTableMore (keyword) {
      if (this.char === CHAR_SP || this.char === CTRL_I) {
        return null
      } else if (this.char === CHAR_RSQB) {
        if (hasKey(this.ctx, keyword) && (!isTable(this.ctx[keyword]) || this.ctx[keyword][_declared])) {
          throw this.error(new TomlError("Can't redefine existing key"))
        } else {
          this.ctx = this.ctx[keyword] = this.ctx[keyword] || Table()
          this.ctx[_declared] = true
        }
        return this.next(this.parseWhitespaceToEOL)
      } else if (this.char === CHAR_PERIOD) {
        if (!hasKey(this.ctx, keyword)) {
          this.ctx = this.ctx[keyword] = Table()
        } else if (isTable(this.ctx[keyword])) {
          this.ctx = this.ctx[keyword]
        } else if (isList(this.ctx[keyword])) {
          this.ctx = this.ctx[keyword][this.ctx[keyword].length - 1]
        } else {
          throw this.error(new TomlError("Can't redefine existing key"))
        }
        return this.next(this.parseTableNext)
      } else {
        throw this.error(new TomlError('Unexpected character, expected whitespace, . or ]'))
      }
    }

    /* LIST [[a.b.c]] */
    parseList () {
      this.ctx = this.obj
      return this.goto(this.parseListNext)
    }
    parseListNext () {
      if (this.char === CHAR_SP || this.char === CTRL_I) {
        return null
      } else {
        return this.callNow(this.parseKeyword, this.parseListMore)
      }
    }
    parseListMore (keyword) {
      if (this.char === CHAR_SP || this.char === CTRL_I) {
        return null
      } else if (this.char === CHAR_RSQB) {
        if (!hasKey(this.ctx, keyword)) {
          this.ctx[keyword] = List()
        }
        if (isInlineList(this.ctx[keyword])) {
          throw this.error(new TomlError("Can't extend an inline array"))
        } else if (isList(this.ctx[keyword])) {
          const next = Table()
          this.ctx[keyword].push(next)
          this.ctx = next
        } else {
          throw this.error(new TomlError("Can't redefine an existing key"))
        }
        return this.next(this.parseListEnd)
      } else if (this.char === CHAR_PERIOD) {
        if (!hasKey(this.ctx, keyword)) {
          this.ctx = this.ctx[keyword] = Table()
        } else if (isInlineList(this.ctx[keyword])) {
          throw this.error(new TomlError("Can't extend an inline array"))
        } else if (isInlineTable(this.ctx[keyword])) {
          throw this.error(new TomlError("Can't extend an inline table"))
        } else if (isList(this.ctx[keyword])) {
          this.ctx = this.ctx[keyword][this.ctx[keyword].length - 1]
        } else if (isTable(this.ctx[keyword])) {
          this.ctx = this.ctx[keyword]
        } else {
          throw this.error(new TomlError("Can't redefine an existing key"))
        }
        return this.next(this.parseListNext)
      } else {
        throw this.error(new TomlError('Unexpected character, expected whitespace, . or ]'))
      }
    }
    parseListEnd (keyword) {
      if (this.char === CHAR_RSQB) {
        return this.next(this.parseWhitespaceToEOL)
      } else {
        throw this.error(new TomlError('Unexpected character, expected whitespace, . or ]'))
      }
    }

    /* VALUE string, number, boolean, inline list, inline object */
    parseValue () {
      if (this.char === Parser.END) {
        throw this.error(new TomlError('Key without value'))
      } else if (this.char === CHAR_QUOT) {
        return this.next(this.parseDoubleString)
      } if (this.char === CHAR_APOS) {
        return this.next(this.parseSingleString)
      } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
        return this.goto(this.parseNumberSign)
      } else if (this.char === CHAR_i) {
        return this.next(this.parseInf)
      } else if (this.char === CHAR_n) {
        return this.next(this.parseNan)
      } else if (isDigit(this.char)) {
        return this.goto(this.parseNumberOrDateTime)
      } else if (this.char === CHAR_t || this.char === CHAR_f) {
        return this.goto(this.parseBoolean)
      } else if (this.char === CHAR_LSQB) {
        return this.call(this.parseInlineList, this.recordValue)
      } else if (this.char === CHAR_LCUB) {
        return this.call(this.parseInlineTable, this.recordValue)
      } else {
        throw this.error(new TomlError('Unexpected character, expecting string, number, datetime, boolean, inline array or inline table'))
      }
    }
    recordValue (value) {
      return this.returnNow(value)
    }

    parseInf () {
      if (this.char === CHAR_n) {
        return this.next(this.parseInf2)
      } else {
        throw this.error(new TomlError('Unexpected character, expected "inf", "+inf" or "-inf"'))
      }
    }
    parseInf2 () {
      if (this.char === CHAR_f) {
        if (this.state.buf === '-') {
          return this.return(-Infinity)
        } else {
          return this.return(Infinity)
        }
      } else {
        throw this.error(new TomlError('Unexpected character, expected "inf", "+inf" or "-inf"'))
      }
    }

    parseNan () {
      if (this.char === CHAR_a) {
        return this.next(this.parseNan2)
      } else {
        throw this.error(new TomlError('Unexpected character, expected "nan"'))
      }
    }
    parseNan2 () {
      if (this.char === CHAR_n) {
        return this.return(NaN)
      } else {
        throw this.error(new TomlError('Unexpected character, expected "nan"'))
      }
    }

    /* KEYS, barewords or basic, literal, or dotted */
    parseKeyword () {
      if (this.char === CHAR_QUOT) {
        return this.next(this.parseBasicString)
      } else if (this.char === CHAR_APOS) {
        return this.next(this.parseLiteralString)
      } else {
        return this.goto(this.parseBareKey)
      }
    }

    /* KEYS: barewords */
    parseBareKey () {
      do {
        if (this.char === Parser.END) {
          throw this.error(new TomlError('Key ended without value'))
        } else if (isAlphaNumHyphen(this.char)) {
          this.consume()
        } else if (this.state.buf.length === 0) {
          throw this.error(new TomlError('Empty bare keys are not allowed'))
        } else {
          return this.returnNow()
        }
      } while (this.nextChar())
    }

    /* STRINGS, single quoted (literal) */
    parseSingleString () {
      if (this.char === CHAR_APOS) {
        return this.next(this.parseLiteralMultiStringMaybe)
      } else {
        return this.goto(this.parseLiteralString)
      }
    }
    parseLiteralString () {
      do {
        if (this.char === CHAR_APOS) {
          return this.return()
        } else if (this.atEndOfLine()) {
          throw this.error(new TomlError('Unterminated string'))
        } else if (this.char === CHAR_DEL || (this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I)) {
          throw this.errorControlCharInString()
        } else {
          this.consume()
        }
      } while (this.nextChar())
    }
    parseLiteralMultiStringMaybe () {
      if (this.char === CHAR_APOS) {
        return this.next(this.parseLiteralMultiString)
      } else {
        return this.returnNow()
      }
    }
    parseLiteralMultiString () {
      if (this.char === CTRL_M) {
        return null
      } else if (this.char === CTRL_J) {
        return this.next(this.parseLiteralMultiStringContent)
      } else {
        return this.goto(this.parseLiteralMultiStringContent)
      }
    }
    parseLiteralMultiStringContent () {
      do {
        if (this.char === CHAR_APOS) {
          return this.next(this.parseLiteralMultiEnd)
        } else if (this.char === Parser.END) {
          throw this.error(new TomlError('Unterminated multi-line string'))
        } else if (this.char === CHAR_DEL || (this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I && this.char !== CTRL_J && this.char !== CTRL_M)) {
          throw this.errorControlCharInString()
        } else {
          this.consume()
        }
      } while (this.nextChar())
    }
    parseLiteralMultiEnd () {
      if (this.char === CHAR_APOS) {
        return this.next(this.parseLiteralMultiEnd2)
      } else {
        this.state.buf += "'"
        return this.goto(this.parseLiteralMultiStringContent)
      }
    }
    parseLiteralMultiEnd2 () {
      if (this.char === CHAR_APOS) {
        return this.return()
      } else {
        this.state.buf += "''"
        return this.goto(this.parseLiteralMultiStringContent)
      }
    }

    /* STRINGS double quoted */
    parseDoubleString () {
      if (this.char === CHAR_QUOT) {
        return this.next(this.parseMultiStringMaybe)
      } else {
        return this.goto(this.parseBasicString)
      }
    }
    parseBasicString () {
      do {
        if (this.char === CHAR_BSOL) {
          return this.call(this.parseEscape, this.recordEscapeReplacement)
        } else if (this.char === CHAR_QUOT) {
          return this.return()
        } else if (this.atEndOfLine()) {
          throw this.error(new TomlError('Unterminated string'))
        } else if (this.char === CHAR_DEL || (this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I)) {
          throw this.errorControlCharInString()
        } else {
          this.consume()
        }
      } while (this.nextChar())
    }
    recordEscapeReplacement (replacement) {
      this.state.buf += replacement
      return this.goto(this.parseBasicString)
    }
    parseMultiStringMaybe () {
      if (this.char === CHAR_QUOT) {
        return this.next(this.parseMultiString)
      } else {
        return this.returnNow()
      }
    }
    parseMultiString () {
      if (this.char === CTRL_M) {
        return null
      } else if (this.char === CTRL_J) {
        return this.next(this.parseMultiStringContent)
      } else {
        return this.goto(this.parseMultiStringContent)
      }
    }
    parseMultiStringContent () {
      do {
        if (this.char === CHAR_BSOL) {
          return this.call(this.parseMultiEscape, this.recordMultiEscapeReplacement)
        } else if (this.char === CHAR_QUOT) {
          return this.next(this.parseMultiEnd)
        } else if (this.char === Parser.END) {
          throw this.error(new TomlError('Unterminated multi-line string'))
        } else if (this.char === CHAR_DEL || (this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I && this.char !== CTRL_J && this.char !== CTRL_M)) {
          throw this.errorControlCharInString()
        } else {
          this.consume()
        }
      } while (this.nextChar())
    }
    errorControlCharInString () {
      let displayCode = '\\u00'
      if (this.char < 16) {
        displayCode += '0'
      }
      displayCode += this.char.toString(16)

      return this.error(new TomlError(`Control characters (codes < 0x1f and 0x7f) are not allowed in strings, use ${displayCode} instead`))
    }
    recordMultiEscapeReplacement (replacement) {
      this.state.buf += replacement
      return this.goto(this.parseMultiStringContent)
    }
    parseMultiEnd () {
      if (this.char === CHAR_QUOT) {
        return this.next(this.parseMultiEnd2)
      } else {
        this.state.buf += '"'
        return this.goto(this.parseMultiStringContent)
      }
    }
    parseMultiEnd2 () {
      if (this.char === CHAR_QUOT) {
        return this.return()
      } else {
        this.state.buf += '""'
        return this.goto(this.parseMultiStringContent)
      }
    }
    parseMultiEscape () {
      if (this.char === CTRL_M || this.char === CTRL_J) {
        return this.next(this.parseMultiTrim)
      } else if (this.char === CHAR_SP || this.char === CTRL_I) {
        return this.next(this.parsePreMultiTrim)
      } else {
        return this.goto(this.parseEscape)
      }
    }
    parsePreMultiTrim () {
      if (this.char === CHAR_SP || this.char === CTRL_I) {
        return null
      } else if (this.char === CTRL_M || this.char === CTRL_J) {
        return this.next(this.parseMultiTrim)
      } else {
        throw this.error(new TomlError("Can't escape whitespace"))
      }
    }
    parseMultiTrim () {
      // explicitly whitespace here, END should follow the same path as chars
      if (this.char === CTRL_J || this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) {
        return null
      } else {
        return this.returnNow()
      }
    }
    parseEscape () {
      if (this.char in escapes) {
        return this.return(escapes[this.char])
      } else if (this.char === CHAR_u) {
        return this.call(this.parseSmallUnicode, this.parseUnicodeReturn)
      } else if (this.char === CHAR_U) {
        return this.call(this.parseLargeUnicode, this.parseUnicodeReturn)
      } else {
        throw this.error(new TomlError('Unknown escape character: ' + this.char))
      }
    }
    parseUnicodeReturn (char) {
      try {
        const codePoint = parseInt(char, 16)
        if (codePoint >= SURROGATE_FIRST && codePoint <= SURROGATE_LAST) {
          throw this.error(new TomlError('Invalid unicode, character in range 0xD800 - 0xDFFF is reserved'))
        }
        return this.returnNow(String.fromCodePoint(codePoint))
      } catch (err) {
        throw this.error(TomlError.wrap(err))
      }
    }
    parseSmallUnicode () {
      if (!isHexit(this.char)) {
        throw this.error(new TomlError('Invalid character in unicode sequence, expected hex'))
      } else {
        this.consume()
        if (this.state.buf.length >= 4) return this.return()
      }
    }
    parseLargeUnicode () {
      if (!isHexit(this.char)) {
        throw this.error(new TomlError('Invalid character in unicode sequence, expected hex'))
      } else {
        this.consume()
        if (this.state.buf.length >= 8) return this.return()
      }
    }

    /* NUMBERS */
    parseNumberSign () {
      this.consume()
      return this.next(this.parseMaybeSignedInfOrNan)
    }
    parseMaybeSignedInfOrNan () {
      if (this.char === CHAR_i) {
        return this.next(this.parseInf)
      } else if (this.char === CHAR_n) {
        return this.next(this.parseNan)
      } else {
        return this.callNow(this.parseNoUnder, this.parseNumberIntegerStart)
      }
    }
    parseNumberIntegerStart () {
      if (this.char === CHAR_0) {
        this.consume()
        return this.next(this.parseNumberIntegerExponentOrDecimal)
      } else {
        return this.goto(this.parseNumberInteger)
      }
    }
    parseNumberIntegerExponentOrDecimal () {
      if (this.char === CHAR_PERIOD) {
        this.consume()
        return this.call(this.parseNoUnder, this.parseNumberFloat)
      } else if (this.char === CHAR_E || this.char === CHAR_e) {
        this.consume()
        return this.next(this.parseNumberExponentSign)
      } else {
        return this.returnNow(Integer(this.state.buf))
      }
    }
    parseNumberInteger () {
      if (isDigit(this.char)) {
        this.consume()
      } else if (this.char === CHAR_LOWBAR) {
        return this.call(this.parseNoUnder)
      } else if (this.char === CHAR_E || this.char === CHAR_e) {
        this.consume()
        return this.next(this.parseNumberExponentSign)
      } else if (this.char === CHAR_PERIOD) {
        this.consume()
        return this.call(this.parseNoUnder, this.parseNumberFloat)
      } else {
        const result = Integer(this.state.buf)
        /* istanbul ignore if */
        if (result.isNaN()) {
          throw this.error(new TomlError('Invalid number'))
        } else {
          return this.returnNow(result)
        }
      }
    }
    parseNoUnder () {
      if (this.char === CHAR_LOWBAR || this.char === CHAR_PERIOD || this.char === CHAR_E || this.char === CHAR_e) {
        throw this.error(new TomlError('Unexpected character, expected digit'))
      } else if (this.atEndOfWord()) {
        throw this.error(new TomlError('Incomplete number'))
      }
      return this.returnNow()
    }
    parseNoUnderHexOctBinLiteral () {
      if (this.char === CHAR_LOWBAR || this.char === CHAR_PERIOD) {
        throw this.error(new TomlError('Unexpected character, expected digit'))
      } else if (this.atEndOfWord()) {
        throw this.error(new TomlError('Incomplete number'))
      }
      return this.returnNow()
    }
    parseNumberFloat () {
      if (this.char === CHAR_LOWBAR) {
        return this.call(this.parseNoUnder, this.parseNumberFloat)
      } else if (isDigit(this.char)) {
        this.consume()
      } else if (this.char === CHAR_E || this.char === CHAR_e) {
        this.consume()
        return this.next(this.parseNumberExponentSign)
      } else {
        return this.returnNow(Float(this.state.buf))
      }
    }
    parseNumberExponentSign () {
      if (isDigit(this.char)) {
        return this.goto(this.parseNumberExponent)
      } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
        this.consume()
        this.call(this.parseNoUnder, this.parseNumberExponent)
      } else {
        throw this.error(new TomlError('Unexpected character, expected -, + or digit'))
      }
    }
    parseNumberExponent () {
      if (isDigit(this.char)) {
        this.consume()
      } else if (this.char === CHAR_LOWBAR) {
        return this.call(this.parseNoUnder)
      } else {
        return this.returnNow(Float(this.state.buf))
      }
    }

    /* NUMBERS or DATETIMES  */
    parseNumberOrDateTime () {
      if (this.char === CHAR_0) {
        this.consume()
        return this.next(this.parseNumberBaseOrDateTime)
      } else {
        return this.goto(this.parseNumberOrDateTimeOnly)
      }
    }
    parseNumberOrDateTimeOnly () {
      // note, if two zeros are in a row then it MUST be a date
      if (this.char === CHAR_LOWBAR) {
        return this.call(this.parseNoUnder, this.parseNumberInteger)
      } else if (isDigit(this.char)) {
        this.consume()
        if (this.state.buf.length > 4) this.next(this.parseNumberInteger)
      } else if (this.char === CHAR_E || this.char === CHAR_e) {
        this.consume()
        return this.next(this.parseNumberExponentSign)
      } else if (this.char === CHAR_PERIOD) {
        this.consume()
        return this.call(this.parseNoUnder, this.parseNumberFloat)
      } else if (this.char === CHAR_HYPHEN) {
        return this.goto(this.parseDateTime)
      } else if (this.char === CHAR_COLON) {
        return this.goto(this.parseOnlyTimeHour)
      } else {
        return this.returnNow(Integer(this.state.buf))
      }
    }
    parseDateTimeOnly () {
      if (this.state.buf.length < 4) {
        if (isDigit(this.char)) {
          return this.consume()
        } else if (this.char === CHAR_COLON) {
          return this.goto(this.parseOnlyTimeHour)
        } else {
          throw this.error(new TomlError('Expected digit while parsing year part of a date'))
        }
      } else {
        if (this.char === CHAR_HYPHEN) {
          return this.goto(this.parseDateTime)
        } else {
          throw this.error(new TomlError('Expected hyphen (-) while parsing year part of date'))
        }
      }
    }
    parseNumberBaseOrDateTime () {
      if (this.char === CHAR_b) {
        this.consume()
        return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerBin)
      } else if (this.char === CHAR_o) {
        this.consume()
        return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerOct)
      } else if (this.char === CHAR_x) {
        this.consume()
        return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerHex)
      } else if (this.char === CHAR_PERIOD) {
        return this.goto(this.parseNumberInteger)
      } else if (isDigit(this.char)) {
        return this.goto(this.parseDateTimeOnly)
      } else {
        return this.returnNow(Integer(this.state.buf))
      }
    }
    parseIntegerHex () {
      if (isHexit(this.char)) {
        this.consume()
      } else if (this.char === CHAR_LOWBAR) {
        return this.call(this.parseNoUnderHexOctBinLiteral)
      } else {
        const result = Integer(this.state.buf)
        /* istanbul ignore if */
        if (result.isNaN()) {
          throw this.error(new TomlError('Invalid number'))
        } else {
          return this.returnNow(result)
        }
      }
    }
    parseIntegerOct () {
      if (isOctit(this.char)) {
        this.consume()
      } else if (this.char === CHAR_LOWBAR) {
        return this.call(this.parseNoUnderHexOctBinLiteral)
      } else {
        const result = Integer(this.state.buf)
        /* istanbul ignore if */
        if (result.isNaN()) {
          throw this.error(new TomlError('Invalid number'))
        } else {
          return this.returnNow(result)
        }
      }
    }
    parseIntegerBin () {
      if (isBit(this.char)) {
        this.consume()
      } else if (this.char === CHAR_LOWBAR) {
        return this.call(this.parseNoUnderHexOctBinLiteral)
      } else {
        const result = Integer(this.state.buf)
        /* istanbul ignore if */
        if (result.isNaN()) {
          throw this.error(new TomlError('Invalid number'))
        } else {
          return this.returnNow(result)
        }
      }
    }

    /* DATETIME */
    parseDateTime () {
      // we enter here having just consumed the year and about to consume the hyphen
      if (this.state.buf.length < 4) {
        throw this.error(new TomlError('Years less than 1000 must be zero padded to four characters'))
      }
      this.state.result = this.state.buf
      this.state.buf = ''
      return this.next(this.parseDateMonth)
    }
    parseDateMonth () {
      if (this.char === CHAR_HYPHEN) {
        if (this.state.buf.length < 2) {
          throw this.error(new TomlError('Months less than 10 must be zero padded to two characters'))
        }
        this.state.result += '-' + this.state.buf
        this.state.buf = ''
        return this.next(this.parseDateDay)
      } else if (isDigit(this.char)) {
        this.consume()
      } else {
        throw this.error(new TomlError('Incomplete datetime'))
      }
    }
    parseDateDay () {
      if (this.char === CHAR_T || this.char === CHAR_SP) {
        if (this.state.buf.length < 2) {
          throw this.error(new TomlError('Days less than 10 must be zero padded to two characters'))
        }
        this.state.result += '-' + this.state.buf
        this.state.buf = ''
        return this.next(this.parseStartTimeHour)
      } else if (this.atEndOfWord()) {
        return this.returnNow(createDate(this.state.result + '-' + this.state.buf))
      } else if (isDigit(this.char)) {
        this.consume()
      } else {
        throw this.error(new TomlError('Incomplete datetime'))
      }
    }
    parseStartTimeHour () {
      if (this.atEndOfWord()) {
        return this.returnNow(createDate(this.state.result))
      } else {
        return this.goto(this.parseTimeHour)
      }
    }
    parseTimeHour () {
      if (this.char === CHAR_COLON) {
        if (this.state.buf.length < 2) {
          throw this.error(new TomlError('Hours less than 10 must be zero padded to two characters'))
        }
        this.state.result += 'T' + this.state.buf
        this.state.buf = ''
        return this.next(this.parseTimeMin)
      } else if (isDigit(this.char)) {
        this.consume()
      } else {
        throw this.error(new TomlError('Incomplete datetime'))
      }
    }
    parseTimeMin () {
      if (this.state.buf.length < 2 && isDigit(this.char)) {
        this.consume()
      } else if (this.state.buf.length === 2 && this.char === CHAR_COLON) {
        this.state.result += ':' + this.state.buf
        this.state.buf = ''
        return this.next(this.parseTimeSec)
      } else {
        throw this.error(new TomlError('Incomplete datetime'))
      }
    }
    parseTimeSec () {
      if (isDigit(this.char)) {
        this.consume()
        if (this.state.buf.length === 2) {
          this.state.result += ':' + this.state.buf
          this.state.buf = ''
          return this.next(this.parseTimeZoneOrFraction)
        }
      } else {
        throw this.error(new TomlError('Incomplete datetime'))
      }
    }

    parseOnlyTimeHour () {
      /* istanbul ignore else */
      if (this.char === CHAR_COLON) {
        if (this.state.buf.length < 2) {
          throw this.error(new TomlError('Hours less than 10 must be zero padded to two characters'))
        }
        this.state.result = this.state.buf
        this.state.buf = ''
        return this.next(this.parseOnlyTimeMin)
      } else {
        throw this.error(new TomlError('Incomplete time'))
      }
    }
    parseOnlyTimeMin () {
      if (this.state.buf.length < 2 && isDigit(this.char)) {
        this.consume()
      } else if (this.state.buf.length === 2 && this.char === CHAR_COLON) {
        this.state.result += ':' + this.state.buf
        this.state.buf = ''
        return this.next(this.parseOnlyTimeSec)
      } else {
        throw this.error(new TomlError('Incomplete time'))
      }
    }
    parseOnlyTimeSec () {
      if (isDigit(this.char)) {
        this.consume()
        if (this.state.buf.length === 2) {
          return this.next(this.parseOnlyTimeFractionMaybe)
        }
      } else {
        throw this.error(new TomlError('Incomplete time'))
      }
    }
    parseOnlyTimeFractionMaybe () {
      this.state.result += ':' + this.state.buf
      if (this.char === CHAR_PERIOD) {
        this.state.buf = ''
        this.next(this.parseOnlyTimeFraction)
      } else {
        return this.return(createTime(this.state.result))
      }
    }
    parseOnlyTimeFraction () {
      if (isDigit(this.char)) {
        this.consume()
      } else if (this.atEndOfWord()) {
        if (this.state.buf.length === 0) throw this.error(new TomlError('Expected digit in milliseconds'))
        return this.returnNow(createTime(this.state.result + '.' + this.state.buf))
      } else {
        throw this.error(new TomlError('Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z'))
      }
    }

    parseTimeZoneOrFraction () {
      if (this.char === CHAR_PERIOD) {
        this.consume()
        this.next(this.parseDateTimeFraction)
      } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
        this.consume()
        this.next(this.parseTimeZoneHour)
      } else if (this.char === CHAR_Z) {
        this.consume()
        return this.return(createDateTime(this.state.result + this.state.buf))
      } else if (this.atEndOfWord()) {
        return this.returnNow(createDateTimeFloat(this.state.result + this.state.buf))
      } else {
        throw this.error(new TomlError('Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z'))
      }
    }
    parseDateTimeFraction () {
      if (isDigit(this.char)) {
        this.consume()
      } else if (this.state.buf.length === 1) {
        throw this.error(new TomlError('Expected digit in milliseconds'))
      } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
        this.consume()
        this.next(this.parseTimeZoneHour)
      } else if (this.char === CHAR_Z) {
        this.consume()
        return this.return(createDateTime(this.state.result + this.state.buf))
      } else if (this.atEndOfWord()) {
        return this.returnNow(createDateTimeFloat(this.state.result + this.state.buf))
      } else {
        throw this.error(new TomlError('Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z'))
      }
    }
    parseTimeZoneHour () {
      if (isDigit(this.char)) {
        this.consume()
        // FIXME: No more regexps
        if (/\d\d$/.test(this.state.buf)) return this.next(this.parseTimeZoneSep)
      } else {
        throw this.error(new TomlError('Unexpected character in datetime, expected digit'))
      }
    }
    parseTimeZoneSep () {
      if (this.char === CHAR_COLON) {
        this.consume()
        this.next(this.parseTimeZoneMin)
      } else {
        throw this.error(new TomlError('Unexpected character in datetime, expected colon'))
      }
    }
    parseTimeZoneMin () {
      if (isDigit(this.char)) {
        this.consume()
        if (/\d\d$/.test(this.state.buf)) return this.return(createDateTime(this.state.result + this.state.buf))
      } else {
        throw this.error(new TomlError('Unexpected character in datetime, expected digit'))
      }
    }

    /* BOOLEAN */
    parseBoolean () {
      /* istanbul ignore else */
      if (this.char === CHAR_t) {
        this.consume()
        return this.next(this.parseTrue_r)
      } else if (this.char === CHAR_f) {
        this.consume()
        return this.next(this.parseFalse_a)
      }
    }
    parseTrue_r () {
      if (this.char === CHAR_r) {
        this.consume()
        return this.next(this.parseTrue_u)
      } else {
        throw this.error(new TomlError('Invalid boolean, expected true or false'))
      }
    }
    parseTrue_u () {
      if (this.char === CHAR_u) {
        this.consume()
        return this.next(this.parseTrue_e)
      } else {
        throw this.error(new TomlError('Invalid boolean, expected true or false'))
      }
    }
    parseTrue_e () {
      if (this.char === CHAR_e) {
        return this.return(true)
      } else {
        throw this.error(new TomlError('Invalid boolean, expected true or false'))
      }
    }

    parseFalse_a () {
      if (this.char === CHAR_a) {
        this.consume()
        return this.next(this.parseFalse_l)
      } else {
        throw this.error(new TomlError('Invalid boolean, expected true or false'))
      }
    }

    parseFalse_l () {
      if (this.char === CHAR_l) {
        this.consume()
        return this.next(this.parseFalse_s)
      } else {
        throw this.error(new TomlError('Invalid boolean, expected true or false'))
      }
    }

    parseFalse_s () {
      if (this.char === CHAR_s) {
        this.consume()
        return this.next(this.parseFalse_e)
      } else {
        throw this.error(new TomlError('Invalid boolean, expected true or false'))
      }
    }

    parseFalse_e () {
      if (this.char === CHAR_e) {
        return this.return(false)
      } else {
        throw this.error(new TomlError('Invalid boolean, expected true or false'))
      }
    }

    /* INLINE LISTS */
    parseInlineList () {
      if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M || this.char === CTRL_J) {
        return null
      } else if (this.char === Parser.END) {
        throw this.error(new TomlError('Unterminated inline array'))
      } else if (this.char === CHAR_NUM) {
        return this.call(this.parseComment)
      } else if (this.char === CHAR_RSQB) {
        return this.return(this.state.resultArr || InlineList())
      } else {
        return this.callNow(this.parseValue, this.recordInlineListValue)
      }
    }
    recordInlineListValue (value) {
      if (this.state.resultArr) {
        const listType = this.state.resultArr[_contentType]
        const valueType = tomlType(value)
        if (listType !== valueType) {
          throw this.error(new TomlError(`Inline lists must be a single type, not a mix of ${listType} and ${valueType}`))
        }
      } else {
        this.state.resultArr = InlineList(tomlType(value))
      }
      if (isFloat(value) || isInteger(value)) {
        // unbox now that we've verified they're ok
        this.state.resultArr.push(value.valueOf())
      } else {
        this.state.resultArr.push(value)
      }
      return this.goto(this.parseInlineListNext)
    }
    parseInlineListNext () {
      if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M || this.char === CTRL_J) {
        return null
      } else if (this.char === CHAR_NUM) {
        return this.call(this.parseComment)
      } else if (this.char === CHAR_COMMA) {
        return this.next(this.parseInlineList)
      } else if (this.char === CHAR_RSQB) {
        return this.goto(this.parseInlineList)
      } else {
        throw this.error(new TomlError('Invalid character, expected whitespace, comma (,) or close bracket (])'))
      }
    }

    /* INLINE TABLE */
    parseInlineTable () {
      if (this.char === CHAR_SP || this.char === CTRL_I) {
        return null
      } else if (this.char === Parser.END || this.char === CHAR_NUM || this.char === CTRL_J || this.char === CTRL_M) {
        throw this.error(new TomlError('Unterminated inline array'))
      } else if (this.char === CHAR_RCUB) {
        return this.return(this.state.resultTable || InlineTable())
      } else {
        if (!this.state.resultTable) this.state.resultTable = InlineTable()
        return this.callNow(this.parseAssign, this.recordInlineTableValue)
      }
    }
    recordInlineTableValue (kv) {
      let target = this.state.resultTable
      let finalKey = kv.key.pop()
      for (let kw of kv.key) {
        if (hasKey(target, kw) && (!isTable(target[kw]) || target[kw][_declared])) {
          throw this.error(new TomlError("Can't redefine existing key"))
        }
        target = target[kw] = target[kw] || Table()
      }
      if (hasKey(target, finalKey)) {
        throw this.error(new TomlError("Can't redefine existing key"))
      }
      if (isInteger(kv.value) || isFloat(kv.value)) {
        target[finalKey] = kv.value.valueOf()
      } else {
        target[finalKey] = kv.value
      }
      return this.goto(this.parseInlineTableNext)
    }
    parseInlineTableNext () {
      if (this.char === CHAR_SP || this.char === CTRL_I) {
        return null
      } else if (this.char === Parser.END || this.char === CHAR_NUM || this.char === CTRL_J || this.char === CTRL_M) {
        throw this.error(new TomlError('Unterminated inline array'))
      } else if (this.char === CHAR_COMMA) {
        return this.next(this.parseInlineTable)
      } else if (this.char === CHAR_RCUB) {
        return this.goto(this.parseInlineTable)
      } else {
        throw this.error(new TomlError('Invalid character, expected whitespace, comma (,) or close bracket (])'))
      }
    }
  }
  return TOMLParser
}


/***/ }),

/***/ 556:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = parseAsync

const TOMLParser = __webpack_require__(9010)
const prettyError = __webpack_require__(8107)

function parseAsync (str, opts) {
  if (!opts) opts = {}
  const index = 0
  const blocksize = opts.blocksize || 40960
  const parser = new TOMLParser()
  return new Promise((resolve, reject) => {
    setImmediate(parseAsyncNext, index, blocksize, resolve, reject)
  })
  function parseAsyncNext (index, blocksize, resolve, reject) {
    if (index >= str.length) {
      try {
        return resolve(parser.finish())
      } catch (err) {
        return reject(prettyError(err, str))
      }
    }
    try {
      parser.parse(str.slice(index, index + blocksize))
      setImmediate(parseAsyncNext, index + blocksize, blocksize, resolve, reject)
    } catch (err) {
      reject(prettyError(err, str))
    }
  }
}


/***/ }),

/***/ 8107:
/***/ ((module) => {

"use strict";

module.exports = prettyError

function prettyError (err, buf) {
  /* istanbul ignore if */
  if (err.pos == null || err.line == null) return err
  let msg = err.message
  msg += ` at row ${err.line + 1}, col ${err.col + 1}, pos ${err.pos}:\n`

  /* istanbul ignore else */
  if (buf && buf.split) {
    const lines = buf.split(/\n/)
    const lineNumWidth = String(Math.min(lines.length, err.line + 3)).length
    let linePadding = ' '
    while (linePadding.length < lineNumWidth) linePadding += ' '
    for (let ii = Math.max(0, err.line - 1); ii < Math.min(lines.length, err.line + 2); ++ii) {
      let lineNum = String(ii + 1)
      if (lineNum.length < lineNumWidth) lineNum = ' ' + lineNum
      if (err.line === ii) {
        msg += lineNum + '> ' + lines[ii] + '\n'
        msg += linePadding + '  '
        for (let hh = 0; hh < err.col; ++hh) {
          msg += ' '
        }
        msg += '^\n'
      } else {
        msg += lineNum + ': ' + lines[ii] + '\n'
      }
    }
  }
  err.message = msg + '\n'
  return err
}


/***/ }),

/***/ 6053:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = parseStream

const stream = __webpack_require__(2413)
const TOMLParser = __webpack_require__(9010)

function parseStream (stm) {
  if (stm) {
    return parseReadable(stm)
  } else {
    return parseTransform(stm)
  }
}

function parseReadable (stm) {
  const parser = new TOMLParser()
  stm.setEncoding('utf8')
  return new Promise((resolve, reject) => {
    let readable
    let ended = false
    let errored = false
    function finish () {
      ended = true
      if (readable) return
      try {
        resolve(parser.finish())
      } catch (err) {
        reject(err)
      }
    }
    function error (err) {
      errored = true
      reject(err)
    }
    stm.once('end', finish)
    stm.once('error', error)
    readNext()

    function readNext () {
      readable = true
      let data
      while ((data = stm.read()) !== null) {
        try {
          parser.parse(data)
        } catch (err) {
          return error(err)
        }
      }
      readable = false
      /* istanbul ignore if */
      if (ended) return finish()
      /* istanbul ignore if */
      if (errored) return
      stm.once('readable', readNext)
    }
  })
}

function parseTransform () {
  const parser = new TOMLParser()
  return new stream.Transform({
    objectMode: true,
    transform (chunk, encoding, cb) {
      try {
        parser.parse(chunk.toString(encoding))
      } catch (err) {
        this.emit('error', err)
      }
      cb()
    },
    flush (cb) {
      try {
        this.push(parser.finish())
      } catch (err) {
        this.emit('error', err)
      }
      cb()
    }
  })
}


/***/ }),

/***/ 9777:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = parseString

const TOMLParser = __webpack_require__(9010)
const prettyError = __webpack_require__(8107)

function parseString (str) {
  if (global.Buffer && global.Buffer.isBuffer(str)) {
    str = str.toString('utf8')
  }
  const parser = new TOMLParser()
  try {
    parser.parse(str)
    return parser.finish()
  } catch (err) {
    throw prettyError(err, str)
  }
}


/***/ }),

/***/ 87:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = __webpack_require__(9777)
module.exports.async = __webpack_require__(556)
module.exports.stream = __webpack_require__(6053)
module.exports.prettyError = __webpack_require__(8107)


/***/ }),

/***/ 9517:
/***/ ((module) => {

"use strict";

module.exports = stringify
module.exports.value = stringifyInline

function stringify (obj) {
  if (obj === null) throw typeError('null')
  if (obj === void (0)) throw typeError('undefined')
  if (typeof obj !== 'object') throw typeError(typeof obj)

  if (typeof obj.toJSON === 'function') obj = obj.toJSON()
  if (obj == null) return null
  const type = tomlType(obj)
  if (type !== 'table') throw typeError(type)
  return stringifyObject('', '', obj)
}

function typeError (type) {
  return new Error('Can only stringify objects, not ' + type)
}

function arrayOneTypeError () {
  return new Error("Array values can't have mixed types")
}

function getInlineKeys (obj) {
  return Object.keys(obj).filter(key => isInline(obj[key]))
}
function getComplexKeys (obj) {
  return Object.keys(obj).filter(key => !isInline(obj[key]))
}

function toJSON (obj) {
  let nobj = Array.isArray(obj) ? [] : Object.prototype.hasOwnProperty.call(obj, '__proto__') ? {['__proto__']: undefined} : {}
  for (let prop of Object.keys(obj)) {
    if (obj[prop] && typeof obj[prop].toJSON === 'function' && !('toISOString' in obj[prop])) {
      nobj[prop] = obj[prop].toJSON()
    } else {
      nobj[prop] = obj[prop]
    }
  }
  return nobj
}

function stringifyObject (prefix, indent, obj) {
  obj = toJSON(obj)
  var inlineKeys
  var complexKeys
  inlineKeys = getInlineKeys(obj)
  complexKeys = getComplexKeys(obj)
  var result = []
  var inlineIndent = indent || ''
  inlineKeys.forEach(key => {
    var type = tomlType(obj[key])
    if (type !== 'undefined' && type !== 'null') {
      result.push(inlineIndent + stringifyKey(key) + ' = ' + stringifyAnyInline(obj[key], true))
    }
  })
  if (result.length > 0) result.push('')
  var complexIndent = prefix && inlineKeys.length > 0 ? indent + '  ' : ''
  complexKeys.forEach(key => {
    result.push(stringifyComplex(prefix, complexIndent, key, obj[key]))
  })
  return result.join('\n')
}

function isInline (value) {
  switch (tomlType(value)) {
    case 'undefined':
    case 'null':
    case 'integer':
    case 'nan':
    case 'float':
    case 'boolean':
    case 'string':
    case 'datetime':
      return true
    case 'array':
      return value.length === 0 || tomlType(value[0]) !== 'table'
    case 'table':
      return Object.keys(value).length === 0
    /* istanbul ignore next */
    default:
      return false
  }
}

function tomlType (value) {
  if (value === undefined) {
    return 'undefined'
  } else if (value === null) {
    return 'null'
  /* eslint-disable valid-typeof */
  } else if (typeof value === 'bigint' || (Number.isInteger(value) && !Object.is(value, -0))) {
    return 'integer'
  } else if (typeof value === 'number') {
    return 'float'
  } else if (typeof value === 'boolean') {
    return 'boolean'
  } else if (typeof value === 'string') {
    return 'string'
  } else if ('toISOString' in value) {
    return isNaN(value) ? 'undefined' : 'datetime'
  } else if (Array.isArray(value)) {
    return 'array'
  } else {
    return 'table'
  }
}

function stringifyKey (key) {
  var keyStr = String(key)
  if (/^[-A-Za-z0-9_]+$/.test(keyStr)) {
    return keyStr
  } else {
    return stringifyBasicString(keyStr)
  }
}

function stringifyBasicString (str) {
  return '"' + escapeString(str).replace(/"/g, '\\"') + '"'
}

function stringifyLiteralString (str) {
  return "'" + str + "'"
}

function numpad (num, str) {
  while (str.length < num) str = '0' + str
  return str
}

function escapeString (str) {
  return str.replace(/\\/g, '\\\\')
    .replace(/[\b]/g, '\\b')
    .replace(/\t/g, '\\t')
    .replace(/\n/g, '\\n')
    .replace(/\f/g, '\\f')
    .replace(/\r/g, '\\r')
    /* eslint-disable no-control-regex */
    .replace(/([\u0000-\u001f\u007f])/, c => '\\u' + numpad(4, c.codePointAt(0).toString(16)))
    /* eslint-enable no-control-regex */
}

function stringifyMultilineString (str) {
  let escaped = str.split(/\n/).map(str => {
    return escapeString(str).replace(/"(?="")/g, '\\"')
  }).join('\n')
  if (escaped.slice(-1) === '"') escaped += '\\\n'
  return '"""\n' + escaped + '"""'
}

function stringifyAnyInline (value, multilineOk) {
  let type = tomlType(value)
  if (type === 'string') {
    if (multilineOk && /\n/.test(value)) {
      type = 'string-multiline'
    } else if (!/[\b\t\n\f\r']/.test(value) && /"/.test(value)) {
      type = 'string-literal'
    }
  }
  return stringifyInline(value, type)
}

function stringifyInline (value, type) {
  /* istanbul ignore if */
  if (!type) type = tomlType(value)
  switch (type) {
    case 'string-multiline':
      return stringifyMultilineString(value)
    case 'string':
      return stringifyBasicString(value)
    case 'string-literal':
      return stringifyLiteralString(value)
    case 'integer':
      return stringifyInteger(value)
    case 'float':
      return stringifyFloat(value)
    case 'boolean':
      return stringifyBoolean(value)
    case 'datetime':
      return stringifyDatetime(value)
    case 'array':
      return stringifyInlineArray(value.filter(_ => tomlType(_) !== 'null' && tomlType(_) !== 'undefined' && tomlType(_) !== 'nan'))
    case 'table':
      return stringifyInlineTable(value)
    /* istanbul ignore next */
    default:
      throw typeError(type)
  }
}

function stringifyInteger (value) {
  /* eslint-disable security/detect-unsafe-regex */
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '_')
}

function stringifyFloat (value) {
  if (value === Infinity) {
    return 'inf'
  } else if (value === -Infinity) {
    return '-inf'
  } else if (Object.is(value, NaN)) {
    return 'nan'
  } else if (Object.is(value, -0)) {
    return '-0.0'
  }
  var chunks = String(value).split('.')
  var int = chunks[0]
  var dec = chunks[1] || 0
  return stringifyInteger(int) + '.' + dec
}

function stringifyBoolean (value) {
  return String(value)
}

function stringifyDatetime (value) {
  return value.toISOString()
}

function isNumber (type) {
  return type === 'float' || type === 'integer'
}
function arrayType (values) {
  var contentType = tomlType(values[0])
  if (values.every(_ => tomlType(_) === contentType)) return contentType
  // mixed integer/float, emit as floats
  if (values.every(_ => isNumber(tomlType(_)))) return 'float'
  return 'mixed'
}
function validateArray (values) {
  const type = arrayType(values)
  if (type === 'mixed') {
    throw arrayOneTypeError()
  }
  return type
}

function stringifyInlineArray (values) {
  values = toJSON(values)
  const type = validateArray(values)
  var result = '['
  var stringified = values.map(_ => stringifyInline(_, type))
  if (stringified.join(', ').length > 60 || /\n/.test(stringified)) {
    result += '\n  ' + stringified.join(',\n  ') + '\n'
  } else {
    result += ' ' + stringified.join(', ') + (stringified.length > 0 ? ' ' : '')
  }
  return result + ']'
}

function stringifyInlineTable (value) {
  value = toJSON(value)
  var result = []
  Object.keys(value).forEach(key => {
    result.push(stringifyKey(key) + ' = ' + stringifyAnyInline(value[key], false))
  })
  return '{ ' + result.join(', ') + (result.length > 0 ? ' ' : '') + '}'
}

function stringifyComplex (prefix, indent, key, value) {
  var valueType = tomlType(value)
  /* istanbul ignore else */
  if (valueType === 'array') {
    return stringifyArrayOfTables(prefix, indent, key, value)
  } else if (valueType === 'table') {
    return stringifyComplexTable(prefix, indent, key, value)
  } else {
    throw typeError(valueType)
  }
}

function stringifyArrayOfTables (prefix, indent, key, values) {
  values = toJSON(values)
  validateArray(values)
  var firstValueType = tomlType(values[0])
  /* istanbul ignore if */
  if (firstValueType !== 'table') throw typeError(firstValueType)
  var fullKey = prefix + stringifyKey(key)
  var result = ''
  values.forEach(table => {
    if (result.length > 0) result += '\n'
    result += indent + '[[' + fullKey + ']]\n'
    result += stringifyObject(fullKey + '.', indent, table)
  })
  return result
}

function stringifyComplexTable (prefix, indent, key, value) {
  var fullKey = prefix + stringifyKey(key)
  var result = ''
  if (getInlineKeys(value).length > 0) {
    result += indent + '[' + fullKey + ']\n'
  }
  return result + stringifyObject(fullKey + '.', indent, value)
}


/***/ }),

/***/ 8292:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

exports.parse = __webpack_require__(87)
exports.stringify = __webpack_require__(9517)


/***/ }),

/***/ 1905:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const cp = __webpack_require__(3129);
const parse = __webpack_require__(6067);
const enoent = __webpack_require__(2256);

function spawn(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

module.exports = spawn;
module.exports.spawn = spawn;
module.exports.sync = spawnSync;

module.exports._parse = parse;
module.exports._enoent = enoent;


/***/ }),

/***/ 2256:
/***/ ((module) => {

"use strict";


const isWin = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed, 'spawn');

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

module.exports = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};


/***/ }),

/***/ 6067:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const path = __webpack_require__(5622);
const resolveCommand = __webpack_require__(9403);
const escape = __webpack_require__(4706);
const readShebang = __webpack_require__(7905);

const isWin = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

function detectShebang(parsed) {
    parsed.file = resolveCommand(parsed);

    const shebang = parsed.file && readShebang(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path.normalize(parsed.command);

        // Escape command & arguments
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parsed : parseNonShell(parsed);
}

module.exports = parse;


/***/ }),

/***/ 4706:
/***/ ((module) => {

"use strict";


// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

module.exports.command = escapeCommand;
module.exports.argument = escapeArgument;


/***/ }),

/***/ 7905:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const fs = __webpack_require__(5747);
const shebangCommand = __webpack_require__(1470);

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    const buffer = Buffer.alloc(size);

    let fd;

    try {
        fd = fs.openSync(command, 'r');
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

module.exports = readShebang;


/***/ }),

/***/ 9403:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const path = __webpack_require__(5622);
const which = __webpack_require__(7945);
const pathKey = __webpack_require__(7127)();

function resolveCommandAttempt(parsed, withoutPathExt) {
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;
    // Worker threads do not have process.chdir()
    const shouldSwitchCwd = hasCustomCwd && process.chdir !== undefined && !process.chdir.disabled;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (shouldSwitchCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which.sync(parsed.command, {
            path: (parsed.options.env || process.env)[pathKey],
            pathExt: withoutPathExt ? path.delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        if (shouldSwitchCwd) {
            process.chdir(cwd);
        }
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

module.exports = resolveCommand;


/***/ }),

/***/ 5939:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var once = __webpack_require__(7180);

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		process.nextTick(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;


/***/ }),

/***/ 1115:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const path = __webpack_require__(5622);
const childProcess = __webpack_require__(3129);
const crossSpawn = __webpack_require__(1905);
const stripFinalNewline = __webpack_require__(3097);
const npmRunPath = __webpack_require__(5847);
const onetime = __webpack_require__(834);
const makeError = __webpack_require__(9072);
const normalizeStdio = __webpack_require__(8379);
const {spawnedKill, spawnedCancel, setupTimeout, setExitHandler} = __webpack_require__(6350);
const {handleInput, getSpawnedResult, makeAllStream, validateInputSync} = __webpack_require__(4142);
const {mergePromise, getSpawnedPromise} = __webpack_require__(959);
const {joinCommand, parseCommand} = __webpack_require__(3234);

const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;

const getEnv = ({env: envOption, extendEnv, preferLocal, localDir, execPath}) => {
	const env = extendEnv ? {...process.env, ...envOption} : envOption;

	if (preferLocal) {
		return npmRunPath.env({env, cwd: localDir, execPath});
	}

	return env;
};

const handleArguments = (file, args, options = {}) => {
	const parsed = crossSpawn._parse(file, args, options);
	file = parsed.command;
	args = parsed.args;
	options = parsed.options;

	options = {
		maxBuffer: DEFAULT_MAX_BUFFER,
		buffer: true,
		stripFinalNewline: true,
		extendEnv: true,
		preferLocal: false,
		localDir: options.cwd || process.cwd(),
		execPath: process.execPath,
		encoding: 'utf8',
		reject: true,
		cleanup: true,
		all: false,
		windowsHide: true,
		...options
	};

	options.env = getEnv(options);

	options.stdio = normalizeStdio(options);

	if (process.platform === 'win32' && path.basename(file, '.exe') === 'cmd') {
		// #116
		args.unshift('/q');
	}

	return {file, args, options, parsed};
};

const handleOutput = (options, value, error) => {
	if (typeof value !== 'string' && !Buffer.isBuffer(value)) {
		// When `execa.sync()` errors, we normalize it to '' to mimic `execa()`
		return error === undefined ? undefined : '';
	}

	if (options.stripFinalNewline) {
		return stripFinalNewline(value);
	}

	return value;
};

const execa = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);

	let spawned;
	try {
		spawned = childProcess.spawn(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		// Ensure the returned error is always both a promise and a child process
		const dummySpawned = new childProcess.ChildProcess();
		const errorPromise = Promise.reject(makeError({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		}));
		return mergePromise(dummySpawned, errorPromise);
	}

	const spawnedPromise = getSpawnedPromise(spawned);
	const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
	const processDone = setExitHandler(spawned, parsed.options, timedPromise);

	const context = {isCanceled: false};

	spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
	spawned.cancel = spawnedCancel.bind(null, spawned, context);

	const handlePromise = async () => {
		const [{error, exitCode, signal, timedOut}, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
		const stdout = handleOutput(parsed.options, stdoutResult);
		const stderr = handleOutput(parsed.options, stderrResult);
		const all = handleOutput(parsed.options, allResult);

		if (error || exitCode !== 0 || signal !== null) {
			const returnedError = makeError({
				error,
				exitCode,
				signal,
				stdout,
				stderr,
				all,
				command,
				parsed,
				timedOut,
				isCanceled: context.isCanceled,
				killed: spawned.killed
			});

			if (!parsed.options.reject) {
				return returnedError;
			}

			throw returnedError;
		}

		return {
			command,
			exitCode: 0,
			stdout,
			stderr,
			all,
			failed: false,
			timedOut: false,
			isCanceled: false,
			killed: false
		};
	};

	const handlePromiseOnce = onetime(handlePromise);

	crossSpawn._enoent.hookChildProcess(spawned, parsed.parsed);

	handleInput(spawned, parsed.options.input);

	spawned.all = makeAllStream(spawned, parsed.options);

	return mergePromise(spawned, handlePromiseOnce);
};

module.exports = execa;

module.exports.sync = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);

	validateInputSync(parsed.options);

	let result;
	try {
		result = childProcess.spawnSync(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		throw makeError({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		});
	}

	const stdout = handleOutput(parsed.options, result.stdout, result.error);
	const stderr = handleOutput(parsed.options, result.stderr, result.error);

	if (result.error || result.status !== 0 || result.signal !== null) {
		const error = makeError({
			stdout,
			stderr,
			error: result.error,
			signal: result.signal,
			exitCode: result.status,
			command,
			parsed,
			timedOut: result.error && result.error.code === 'ETIMEDOUT',
			isCanceled: false,
			killed: result.signal !== null
		});

		if (!parsed.options.reject) {
			return error;
		}

		throw error;
	}

	return {
		command,
		exitCode: 0,
		stdout,
		stderr,
		failed: false,
		timedOut: false,
		isCanceled: false,
		killed: false
	};
};

module.exports.command = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa(file, args, options);
};

module.exports.commandSync = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa.sync(file, args, options);
};

module.exports.node = (scriptPath, args, options = {}) => {
	if (args && !Array.isArray(args) && typeof args === 'object') {
		options = args;
		args = [];
	}

	const stdio = normalizeStdio.node(options);

	const {nodePath = process.execPath, nodeOptions = process.execArgv} = options;

	return execa(
		nodePath,
		[
			...nodeOptions,
			scriptPath,
			...(Array.isArray(args) ? args : [])
		],
		{
			...options,
			stdin: undefined,
			stdout: undefined,
			stderr: undefined,
			stdio,
			shell: false
		}
	);
};


/***/ }),

/***/ 3234:
/***/ ((module) => {

"use strict";

const SPACES_REGEXP = / +/g;

const joinCommand = (file, args = []) => {
	if (!Array.isArray(args)) {
		return file;
	}

	return [file, ...args].join(' ');
};

// Allow spaces to be escaped by a backslash if not meant as a delimiter
const handleEscaping = (tokens, token, index) => {
	if (index === 0) {
		return [token];
	}

	const previousToken = tokens[tokens.length - 1];

	if (previousToken.endsWith('\\')) {
		return [...tokens.slice(0, -1), `${previousToken.slice(0, -1)} ${token}`];
	}

	return [...tokens, token];
};

// Handle `execa.command()`
const parseCommand = command => {
	return command
		.trim()
		.split(SPACES_REGEXP)
		.reduce(handleEscaping, []);
};

module.exports = {
	joinCommand,
	parseCommand
};


/***/ }),

/***/ 9072:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const {signalsByName} = __webpack_require__(4552);

const getErrorPrefix = ({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled}) => {
	if (timedOut) {
		return `timed out after ${timeout} milliseconds`;
	}

	if (isCanceled) {
		return 'was canceled';
	}

	if (errorCode !== undefined) {
		return `failed with ${errorCode}`;
	}

	if (signal !== undefined) {
		return `was killed with ${signal} (${signalDescription})`;
	}

	if (exitCode !== undefined) {
		return `failed with exit code ${exitCode}`;
	}

	return 'failed';
};

const makeError = ({
	stdout,
	stderr,
	all,
	error,
	signal,
	exitCode,
	command,
	timedOut,
	isCanceled,
	killed,
	parsed: {options: {timeout}}
}) => {
	// `signal` and `exitCode` emitted on `spawned.on('exit')` event can be `null`.
	// We normalize them to `undefined`
	exitCode = exitCode === null ? undefined : exitCode;
	signal = signal === null ? undefined : signal;
	const signalDescription = signal === undefined ? undefined : signalsByName[signal].description;

	const errorCode = error && error.code;

	const prefix = getErrorPrefix({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled});
	const execaMessage = `Command ${prefix}: ${command}`;
	const isError = Object.prototype.toString.call(error) === '[object Error]';
	const shortMessage = isError ? `${execaMessage}\n${error.message}` : execaMessage;
	const message = [shortMessage, stderr, stdout].filter(Boolean).join('\n');

	if (isError) {
		error.originalMessage = error.message;
		error.message = message;
	} else {
		error = new Error(message);
	}

	error.shortMessage = shortMessage;
	error.command = command;
	error.exitCode = exitCode;
	error.signal = signal;
	error.signalDescription = signalDescription;
	error.stdout = stdout;
	error.stderr = stderr;

	if (all !== undefined) {
		error.all = all;
	}

	if ('bufferedData' in error) {
		delete error.bufferedData;
	}

	error.failed = true;
	error.timedOut = Boolean(timedOut);
	error.isCanceled = isCanceled;
	error.killed = killed && !timedOut;

	return error;
};

module.exports = makeError;


/***/ }),

/***/ 6350:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const os = __webpack_require__(2087);
const onExit = __webpack_require__(4168);

const DEFAULT_FORCE_KILL_TIMEOUT = 1000 * 5;

// Monkey-patches `childProcess.kill()` to add `forceKillAfterTimeout` behavior
const spawnedKill = (kill, signal = 'SIGTERM', options = {}) => {
	const killResult = kill(signal);
	setKillTimeout(kill, signal, options, killResult);
	return killResult;
};

const setKillTimeout = (kill, signal, options, killResult) => {
	if (!shouldForceKill(signal, options, killResult)) {
		return;
	}

	const timeout = getForceKillAfterTimeout(options);
	const t = setTimeout(() => {
		kill('SIGKILL');
	}, timeout);

	// Guarded because there's no `.unref()` when `execa` is used in the renderer
	// process in Electron. This cannot be tested since we don't run tests in
	// Electron.
	// istanbul ignore else
	if (t.unref) {
		t.unref();
	}
};

const shouldForceKill = (signal, {forceKillAfterTimeout}, killResult) => {
	return isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
};

const isSigterm = signal => {
	return signal === os.constants.signals.SIGTERM ||
		(typeof signal === 'string' && signal.toUpperCase() === 'SIGTERM');
};

const getForceKillAfterTimeout = ({forceKillAfterTimeout = true}) => {
	if (forceKillAfterTimeout === true) {
		return DEFAULT_FORCE_KILL_TIMEOUT;
	}

	if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
		throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
	}

	return forceKillAfterTimeout;
};

// `childProcess.cancel()`
const spawnedCancel = (spawned, context) => {
	const killResult = spawned.kill();

	if (killResult) {
		context.isCanceled = true;
	}
};

const timeoutKill = (spawned, signal, reject) => {
	spawned.kill(signal);
	reject(Object.assign(new Error('Timed out'), {timedOut: true, signal}));
};

// `timeout` option handling
const setupTimeout = (spawned, {timeout, killSignal = 'SIGTERM'}, spawnedPromise) => {
	if (timeout === 0 || timeout === undefined) {
		return spawnedPromise;
	}

	if (!Number.isFinite(timeout) || timeout < 0) {
		throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
	}

	let timeoutId;
	const timeoutPromise = new Promise((resolve, reject) => {
		timeoutId = setTimeout(() => {
			timeoutKill(spawned, killSignal, reject);
		}, timeout);
	});

	const safeSpawnedPromise = spawnedPromise.finally(() => {
		clearTimeout(timeoutId);
	});

	return Promise.race([timeoutPromise, safeSpawnedPromise]);
};

// `cleanup` option handling
const setExitHandler = async (spawned, {cleanup, detached}, timedPromise) => {
	if (!cleanup || detached) {
		return timedPromise;
	}

	const removeExitHandler = onExit(() => {
		spawned.kill();
	});

	return timedPromise.finally(() => {
		removeExitHandler();
	});
};

module.exports = {
	spawnedKill,
	spawnedCancel,
	setupTimeout,
	setExitHandler
};


/***/ }),

/***/ 959:
/***/ ((module) => {

"use strict";


const nativePromisePrototype = (async () => {})().constructor.prototype;
const descriptors = ['then', 'catch', 'finally'].map(property => [
	property,
	Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
]);

// The return value is a mixin of `childProcess` and `Promise`
const mergePromise = (spawned, promise) => {
	for (const [property, descriptor] of descriptors) {
		// Starting the main `promise` is deferred to avoid consuming streams
		const value = typeof promise === 'function' ?
			(...args) => Reflect.apply(descriptor.value, promise(), args) :
			descriptor.value.bind(promise);

		Reflect.defineProperty(spawned, property, {...descriptor, value});
	}

	return spawned;
};

// Use promises instead of `child_process` events
const getSpawnedPromise = spawned => {
	return new Promise((resolve, reject) => {
		spawned.on('exit', (exitCode, signal) => {
			resolve({exitCode, signal});
		});

		spawned.on('error', error => {
			reject(error);
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', error => {
				reject(error);
			});
		}
	});
};

module.exports = {
	mergePromise,
	getSpawnedPromise
};



/***/ }),

/***/ 8379:
/***/ ((module) => {

"use strict";

const aliases = ['stdin', 'stdout', 'stderr'];

const hasAlias = opts => aliases.some(alias => opts[alias] !== undefined);

const normalizeStdio = opts => {
	if (!opts) {
		return;
	}

	const {stdio} = opts;

	if (stdio === undefined) {
		return aliases.map(alias => opts[alias]);
	}

	if (hasAlias(opts)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map(alias => `\`${alias}\``).join(', ')}`);
	}

	if (typeof stdio === 'string') {
		return stdio;
	}

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const length = Math.max(stdio.length, aliases.length);
	return Array.from({length}, (value, index) => stdio[index]);
};

module.exports = normalizeStdio;

// `ipc` is pushed unless it is already present
module.exports.node = opts => {
	const stdio = normalizeStdio(opts);

	if (stdio === 'ipc') {
		return 'ipc';
	}

	if (stdio === undefined || typeof stdio === 'string') {
		return [stdio, stdio, stdio, 'ipc'];
	}

	if (stdio.includes('ipc')) {
		return stdio;
	}

	return [...stdio, 'ipc'];
};


/***/ }),

/***/ 4142:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const isStream = __webpack_require__(1200);
const getStream = __webpack_require__(8764);
const mergeStream = __webpack_require__(446);

// `input` option
const handleInput = (spawned, input) => {
	// Checking for stdin is workaround for https://github.com/nodejs/node/issues/26852
	// TODO: Remove `|| spawned.stdin === undefined` once we drop support for Node.js <=12.2.0
	if (input === undefined || spawned.stdin === undefined) {
		return;
	}

	if (isStream(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
};

// `all` interleaves `stdout` and `stderr`
const makeAllStream = (spawned, {all}) => {
	if (!all || (!spawned.stdout && !spawned.stderr)) {
		return;
	}

	const mixed = mergeStream();

	if (spawned.stdout) {
		mixed.add(spawned.stdout);
	}

	if (spawned.stderr) {
		mixed.add(spawned.stderr);
	}

	return mixed;
};

// On failure, `result.stdout|stderr|all` should contain the currently buffered stream
const getBufferedData = async (stream, streamPromise) => {
	if (!stream) {
		return;
	}

	stream.destroy();

	try {
		return await streamPromise;
	} catch (error) {
		return error.bufferedData;
	}
};

const getStreamPromise = (stream, {encoding, buffer, maxBuffer}) => {
	if (!stream || !buffer) {
		return;
	}

	if (encoding) {
		return getStream(stream, {encoding, maxBuffer});
	}

	return getStream.buffer(stream, {maxBuffer});
};

// Retrieve result of child process: exit code, signal, error, streams (stdout/stderr/all)
const getSpawnedResult = async ({stdout, stderr, all}, {encoding, buffer, maxBuffer}, processDone) => {
	const stdoutPromise = getStreamPromise(stdout, {encoding, buffer, maxBuffer});
	const stderrPromise = getStreamPromise(stderr, {encoding, buffer, maxBuffer});
	const allPromise = getStreamPromise(all, {encoding, buffer, maxBuffer: maxBuffer * 2});

	try {
		return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
	} catch (error) {
		return Promise.all([
			{error, signal: error.signal, timedOut: error.timedOut},
			getBufferedData(stdout, stdoutPromise),
			getBufferedData(stderr, stderrPromise),
			getBufferedData(all, allPromise)
		]);
	}
};

const validateInputSync = ({input}) => {
	if (isStream(input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}
};

module.exports = {
	handleInput,
	makeAllStream,
	getSpawnedResult,
	validateInputSync
};



/***/ }),

/***/ 2137:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const {PassThrough: PassThroughStream} = __webpack_require__(2413);

module.exports = options => {
	options = {...options};

	const {array} = options;
	let {encoding} = options;
	const isBuffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || isBuffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (isBuffer) {
		encoding = null;
	}

	const stream = new PassThroughStream({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	let length = 0;
	const chunks = [];

	stream.on('data', chunk => {
		chunks.push(chunk);

		if (objectMode) {
			length = chunks.length;
		} else {
			length += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return chunks;
		}

		return isBuffer ? Buffer.concat(chunks, length) : chunks.join('');
	};

	stream.getBufferedLength = () => length;

	return stream;
};


/***/ }),

/***/ 8764:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const pump = __webpack_require__(372);
const bufferStream = __webpack_require__(2137);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

async function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = {
		maxBuffer: Infinity,
		...options
	};

	const {maxBuffer} = options;

	let stream;
	await new Promise((resolve, reject) => {
		const rejectPromise = error => {
			if (error) { // A null check
				error.bufferedData = stream.getBufferedValue();
			}

			reject(error);
		};

		stream = pump(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	});

	return stream.getBufferedValue();
}

module.exports = getStream;
// TODO: Remove this for the next major release
module.exports.default = getStream;
module.exports.buffer = (stream, options) => getStream(stream, {...options, encoding: 'buffer'});
module.exports.array = (stream, options) => getStream(stream, {...options, array: true});
module.exports.MaxBufferError = MaxBufferError;


/***/ }),

/***/ 8450:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.SIGNALS=void 0;

const SIGNALS=[
{
name:"SIGHUP",
number:1,
action:"terminate",
description:"Terminal closed",
standard:"posix"},

{
name:"SIGINT",
number:2,
action:"terminate",
description:"User interruption with CTRL-C",
standard:"ansi"},

{
name:"SIGQUIT",
number:3,
action:"core",
description:"User interruption with CTRL-\\",
standard:"posix"},

{
name:"SIGILL",
number:4,
action:"core",
description:"Invalid machine instruction",
standard:"ansi"},

{
name:"SIGTRAP",
number:5,
action:"core",
description:"Debugger breakpoint",
standard:"posix"},

{
name:"SIGABRT",
number:6,
action:"core",
description:"Aborted",
standard:"ansi"},

{
name:"SIGIOT",
number:6,
action:"core",
description:"Aborted",
standard:"bsd"},

{
name:"SIGBUS",
number:7,
action:"core",
description:
"Bus error due to misaligned, non-existing address or paging error",
standard:"bsd"},

{
name:"SIGEMT",
number:7,
action:"terminate",
description:"Command should be emulated but is not implemented",
standard:"other"},

{
name:"SIGFPE",
number:8,
action:"core",
description:"Floating point arithmetic error",
standard:"ansi"},

{
name:"SIGKILL",
number:9,
action:"terminate",
description:"Forced termination",
standard:"posix",
forced:true},

{
name:"SIGUSR1",
number:10,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGSEGV",
number:11,
action:"core",
description:"Segmentation fault",
standard:"ansi"},

{
name:"SIGUSR2",
number:12,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGPIPE",
number:13,
action:"terminate",
description:"Broken pipe or socket",
standard:"posix"},

{
name:"SIGALRM",
number:14,
action:"terminate",
description:"Timeout or timer",
standard:"posix"},

{
name:"SIGTERM",
number:15,
action:"terminate",
description:"Termination",
standard:"ansi"},

{
name:"SIGSTKFLT",
number:16,
action:"terminate",
description:"Stack is empty or overflowed",
standard:"other"},

{
name:"SIGCHLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"posix"},

{
name:"SIGCLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"other"},

{
name:"SIGCONT",
number:18,
action:"unpause",
description:"Unpaused",
standard:"posix",
forced:true},

{
name:"SIGSTOP",
number:19,
action:"pause",
description:"Paused",
standard:"posix",
forced:true},

{
name:"SIGTSTP",
number:20,
action:"pause",
description:"Paused using CTRL-Z or \"suspend\"",
standard:"posix"},

{
name:"SIGTTIN",
number:21,
action:"pause",
description:"Background process cannot read terminal input",
standard:"posix"},

{
name:"SIGBREAK",
number:21,
action:"terminate",
description:"User interruption with CTRL-BREAK",
standard:"other"},

{
name:"SIGTTOU",
number:22,
action:"pause",
description:"Background process cannot write to terminal output",
standard:"posix"},

{
name:"SIGURG",
number:23,
action:"ignore",
description:"Socket received out-of-band data",
standard:"bsd"},

{
name:"SIGXCPU",
number:24,
action:"core",
description:"Process timed out",
standard:"bsd"},

{
name:"SIGXFSZ",
number:25,
action:"core",
description:"File too big",
standard:"bsd"},

{
name:"SIGVTALRM",
number:26,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGPROF",
number:27,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGWINCH",
number:28,
action:"ignore",
description:"Terminal window size changed",
standard:"bsd"},

{
name:"SIGIO",
number:29,
action:"terminate",
description:"I/O is available",
standard:"other"},

{
name:"SIGPOLL",
number:29,
action:"terminate",
description:"Watched event",
standard:"other"},

{
name:"SIGINFO",
number:29,
action:"ignore",
description:"Request for process information",
standard:"other"},

{
name:"SIGPWR",
number:30,
action:"terminate",
description:"Device running out of power",
standard:"systemv"},

{
name:"SIGSYS",
number:31,
action:"core",
description:"Invalid system call",
standard:"other"},

{
name:"SIGUNUSED",
number:31,
action:"terminate",
description:"Invalid system call",
standard:"other"}];exports.SIGNALS=SIGNALS;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 4552:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.signalsByNumber=exports.signalsByName=void 0;var _os=__webpack_require__(2087);

var _signals=__webpack_require__(6652);
var _realtime=__webpack_require__(9910);



const getSignalsByName=function(){
const signals=(0,_signals.getSignals)();
return signals.reduce(getSignalByName,{});
};

const getSignalByName=function(
signalByNameMemo,
{name,number,description,supported,action,forced,standard})
{
return{
...signalByNameMemo,
[name]:{name,number,description,supported,action,forced,standard}};

};

const signalsByName=getSignalsByName();exports.signalsByName=signalsByName;




const getSignalsByNumber=function(){
const signals=(0,_signals.getSignals)();
const length=_realtime.SIGRTMAX+1;
const signalsA=Array.from({length},(value,number)=>
getSignalByNumber(number,signals));

return Object.assign({},...signalsA);
};

const getSignalByNumber=function(number,signals){
const signal=findSignalByNumber(number,signals);

if(signal===undefined){
return{};
}

const{name,description,supported,action,forced,standard}=signal;
return{
[number]:{
name,
number,
description,
supported,
action,
forced,
standard}};


};



const findSignalByNumber=function(number,signals){
const signal=signals.find(({name})=>_os.constants.signals[name]===number);

if(signal!==undefined){
return signal;
}

return signals.find(signalA=>signalA.number===number);
};

const signalsByNumber=getSignalsByNumber();exports.signalsByNumber=signalsByNumber;
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 9910:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.SIGRTMAX=exports.getRealtimeSignals=void 0;
const getRealtimeSignals=function(){
const length=SIGRTMAX-SIGRTMIN+1;
return Array.from({length},getRealtimeSignal);
};exports.getRealtimeSignals=getRealtimeSignals;

const getRealtimeSignal=function(value,index){
return{
name:`SIGRT${index+1}`,
number:SIGRTMIN+index,
action:"terminate",
description:"Application-specific signal (realtime)",
standard:"posix"};

};

const SIGRTMIN=34;
const SIGRTMAX=64;exports.SIGRTMAX=SIGRTMAX;
//# sourceMappingURL=realtime.js.map

/***/ }),

/***/ 6652:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.getSignals=void 0;var _os=__webpack_require__(2087);

var _core=__webpack_require__(8450);
var _realtime=__webpack_require__(9910);



const getSignals=function(){
const realtimeSignals=(0,_realtime.getRealtimeSignals)();
const signals=[..._core.SIGNALS,...realtimeSignals].map(normalizeSignal);
return signals;
};exports.getSignals=getSignals;







const normalizeSignal=function({
name,
number:defaultNumber,
description,
action,
forced=false,
standard})
{
const{
signals:{[name]:constantSignal}}=
_os.constants;
const supported=constantSignal!==undefined;
const number=supported?constantSignal:defaultNumber;
return{name,number,description,supported,action,forced,standard};
};
//# sourceMappingURL=signals.js.map

/***/ }),

/***/ 1200:
/***/ ((module) => {

"use strict";


const isStream = stream =>
	stream !== null &&
	typeof stream === 'object' &&
	typeof stream.pipe === 'function';

isStream.writable = stream =>
	isStream(stream) &&
	stream.writable !== false &&
	typeof stream._write === 'function' &&
	typeof stream._writableState === 'object';

isStream.readable = stream =>
	isStream(stream) &&
	stream.readable !== false &&
	typeof stream._read === 'function' &&
	typeof stream._readableState === 'object';

isStream.duplex = stream =>
	isStream.writable(stream) &&
	isStream.readable(stream);

isStream.transform = stream =>
	isStream.duplex(stream) &&
	typeof stream._transform === 'function' &&
	typeof stream._transformState === 'object';

module.exports = isStream;


/***/ }),

/***/ 4151:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var fs = __webpack_require__(5747)
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = __webpack_require__(3202)
} else {
  core = __webpack_require__(2151)
}

module.exports = isexe
isexe.sync = sync

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er)
        } else {
          resolve(is)
        }
      })
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null
        is = false
      }
    }
    cb(er, is)
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}


/***/ }),

/***/ 2151:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(5747)

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode
  var uid = stat.uid
  var gid = stat.gid

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid()
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid()

  var u = parseInt('100', 8)
  var g = parseInt('010', 8)
  var o = parseInt('001', 8)
  var ug = u | g

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret
}


/***/ }),

/***/ 3202:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(5747)

function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';')
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}


/***/ }),

/***/ 446:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { PassThrough } = __webpack_require__(2413);

module.exports = function (/*streams...*/) {
  var sources = []
  var output  = new PassThrough({objectMode: true})

  output.setMaxListeners(0)

  output.add = add
  output.isEmpty = isEmpty

  output.on('unpipe', remove)

  Array.prototype.slice.call(arguments).forEach(add)

  return output

  function add (source) {
    if (Array.isArray(source)) {
      source.forEach(add)
      return this
    }

    sources.push(source);
    source.once('end', remove.bind(null, source))
    source.once('error', output.emit.bind(output, 'error'))
    source.pipe(output, {end: false})
    return this
  }

  function isEmpty () {
    return sources.length == 0;
  }

  function remove (source) {
    sources = sources.filter(function (it) { return it !== source })
    if (!sources.length && output.readable) { output.end() }
  }
}


/***/ }),

/***/ 1573:
/***/ ((module) => {

"use strict";


const mimicFn = (to, from) => {
	for (const prop of Reflect.ownKeys(from)) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	}

	return to;
};

module.exports = mimicFn;
// TODO: Remove this for the next major release
module.exports.default = mimicFn;


/***/ }),

/***/ 5847:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const path = __webpack_require__(5622);
const pathKey = __webpack_require__(7127);

const npmRunPath = options => {
	options = {
		cwd: process.cwd(),
		path: process.env[pathKey()],
		execPath: process.execPath,
		...options
	};

	let previous;
	let cwdPath = path.resolve(options.cwd);
	const result = [];

	while (previous !== cwdPath) {
		result.push(path.join(cwdPath, 'node_modules/.bin'));
		previous = cwdPath;
		cwdPath = path.resolve(cwdPath, '..');
	}

	// Ensure the running `node` binary is used
	const execPathDir = path.resolve(options.cwd, options.execPath, '..');
	result.push(execPathDir);

	return result.concat(options.path).join(path.delimiter);
};

module.exports = npmRunPath;
// TODO: Remove this for the next major release
module.exports.default = npmRunPath;

module.exports.env = options => {
	options = {
		env: process.env,
		...options
	};

	const env = {...options.env};
	const path = pathKey({env});

	options.path = env[path];
	env[path] = module.exports(options);

	return env;
};


/***/ }),

/***/ 7180:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wrappy = __webpack_require__(8984)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 834:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const mimicFn = __webpack_require__(1573);

const calledFunctions = new WeakMap();

const oneTime = (fn, options = {}) => {
	if (typeof fn !== 'function') {
		throw new TypeError('Expected a function');
	}

	let ret;
	let isCalled = false;
	let callCount = 0;
	const functionName = fn.displayName || fn.name || '<anonymous>';

	const onetime = function (...args) {
		calledFunctions.set(onetime, ++callCount);

		if (isCalled) {
			if (options.throw === true) {
				throw new Error(`Function \`${functionName}\` can only be called once`);
			}

			return ret;
		}

		isCalled = true;
		ret = fn.apply(this, args);
		fn = null;

		return ret;
	};

	mimicFn(onetime, fn);
	calledFunctions.set(onetime, callCount);

	return onetime;
};

module.exports = oneTime;
// TODO: Remove this for the next major release
module.exports.default = oneTime;

module.exports.callCount = fn => {
	if (!calledFunctions.has(fn)) {
		throw new Error(`The given function \`${fn.name}\` is not wrapped by the \`onetime\` package`);
	}

	return calledFunctions.get(fn);
};


/***/ }),

/***/ 7127:
/***/ ((module) => {

"use strict";


const pathKey = (options = {}) => {
	const environment = options.env || process.env;
	const platform = options.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(environment).reverse().find(key => key.toUpperCase() === 'PATH') || 'Path';
};

module.exports = pathKey;
// TODO: Remove this for the next major release
module.exports.default = pathKey;


/***/ }),

/***/ 372:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var once = __webpack_require__(7180)
var eos = __webpack_require__(5939)
var fs = __webpack_require__(5747) // we only need fs to get the ReadStream and WriteStream prototypes

var noop = function () {}
var ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump


/***/ }),

/***/ 1470:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const shebangRegex = __webpack_require__(7719);

module.exports = (string = '') => {
	const match = string.match(shebangRegex);

	if (!match) {
		return null;
	}

	const [path, argument] = match[0].replace(/#! ?/, '').split(' ');
	const binary = path.split('/').pop();

	if (binary === 'env') {
		return argument;
	}

	return argument ? `${binary} ${argument}` : binary;
};


/***/ }),

/***/ 7719:
/***/ ((module) => {

"use strict";

module.exports = /^#!(.*)/;


/***/ }),

/***/ 4168:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
var assert = __webpack_require__(2357)
var signals = __webpack_require__(667)
var isWin = /^win/i.test(process.platform)

var EE = __webpack_require__(8614)
/* istanbul ignore if */
if (typeof EE !== 'function') {
  EE = EE.EventEmitter
}

var emitter
if (process.__signal_exit_emitter__) {
  emitter = process.__signal_exit_emitter__
} else {
  emitter = process.__signal_exit_emitter__ = new EE()
  emitter.count = 0
  emitter.emitted = {}
}

// Because this emitter is a global, we have to check to see if a
// previous version of this library failed to enable infinite listeners.
// I know what you're about to say.  But literally everything about
// signal-exit is a compromise with evil.  Get used to it.
if (!emitter.infinite) {
  emitter.setMaxListeners(Infinity)
  emitter.infinite = true
}

module.exports = function (cb, opts) {
  assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler')

  if (loaded === false) {
    load()
  }

  var ev = 'exit'
  if (opts && opts.alwaysLast) {
    ev = 'afterexit'
  }

  var remove = function () {
    emitter.removeListener(ev, cb)
    if (emitter.listeners('exit').length === 0 &&
        emitter.listeners('afterexit').length === 0) {
      unload()
    }
  }
  emitter.on(ev, cb)

  return remove
}

module.exports.unload = unload
function unload () {
  if (!loaded) {
    return
  }
  loaded = false

  signals.forEach(function (sig) {
    try {
      process.removeListener(sig, sigListeners[sig])
    } catch (er) {}
  })
  process.emit = originalProcessEmit
  process.reallyExit = originalProcessReallyExit
  emitter.count -= 1
}

function emit (event, code, signal) {
  if (emitter.emitted[event]) {
    return
  }
  emitter.emitted[event] = true
  emitter.emit(event, code, signal)
}

// { <signal>: <listener fn>, ... }
var sigListeners = {}
signals.forEach(function (sig) {
  sigListeners[sig] = function listener () {
    // If there are no other listeners, an exit is coming!
    // Simplest way: remove us and then re-send the signal.
    // We know that this will kill the process, so we can
    // safely emit now.
    var listeners = process.listeners(sig)
    if (listeners.length === emitter.count) {
      unload()
      emit('exit', null, sig)
      /* istanbul ignore next */
      emit('afterexit', null, sig)
      /* istanbul ignore next */
      if (isWin && sig === 'SIGHUP') {
        // "SIGHUP" throws an `ENOSYS` error on Windows,
        // so use a supported signal instead
        sig = 'SIGINT'
      }
      process.kill(process.pid, sig)
    }
  }
})

module.exports.signals = function () {
  return signals
}

module.exports.load = load

var loaded = false

function load () {
  if (loaded) {
    return
  }
  loaded = true

  // This is the number of onSignalExit's that are in play.
  // It's important so that we can count the correct number of
  // listeners on signals, and don't wait for the other one to
  // handle it instead of us.
  emitter.count += 1

  signals = signals.filter(function (sig) {
    try {
      process.on(sig, sigListeners[sig])
      return true
    } catch (er) {
      return false
    }
  })

  process.emit = processEmit
  process.reallyExit = processReallyExit
}

var originalProcessReallyExit = process.reallyExit
function processReallyExit (code) {
  process.exitCode = code || 0
  emit('exit', process.exitCode, null)
  /* istanbul ignore next */
  emit('afterexit', process.exitCode, null)
  /* istanbul ignore next */
  originalProcessReallyExit.call(process, process.exitCode)
}

var originalProcessEmit = process.emit
function processEmit (ev, arg) {
  if (ev === 'exit') {
    if (arg !== undefined) {
      process.exitCode = arg
    }
    var ret = originalProcessEmit.apply(this, arguments)
    emit('exit', process.exitCode, null)
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null)
    return ret
  } else {
    return originalProcessEmit.apply(this, arguments)
  }
}


/***/ }),

/***/ 667:
/***/ ((module) => {

// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
]

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  )
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  )
}


/***/ }),

/***/ 3097:
/***/ ((module) => {

"use strict";


module.exports = input => {
	const LF = typeof input === 'string' ? '\n' : '\n'.charCodeAt();
	const CR = typeof input === 'string' ? '\r' : '\r'.charCodeAt();

	if (input[input.length - 1] === LF) {
		input = input.slice(0, input.length - 1);
	}

	if (input[input.length - 1] === CR) {
		input = input.slice(0, input.length - 1);
	}

	return input;
};


/***/ }),

/***/ 7945:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

const path = __webpack_require__(5622)
const COLON = isWindows ? ';' : ':'
const isexe = __webpack_require__(4151)

const getNotFoundError = (cmd) =>
  Object.assign(new Error(`not found: ${cmd}`), { code: 'ENOENT' })

const getPathInfo = (cmd, opt) => {
  const colon = opt.colon || COLON

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? ['']
    : (
      [
        // windows always checks the cwd first
        ...(isWindows ? [process.cwd()] : []),
        ...(opt.path || process.env.PATH ||
          /* istanbul ignore next: very unusual */ '').split(colon),
      ]
    )
  const pathExtExe = isWindows
    ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM'
    : ''
  const pathExt = isWindows ? pathExtExe.split(colon) : ['']

  if (isWindows) {
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  return {
    pathEnv,
    pathExt,
    pathExtExe,
  }
}

const which = (cmd, opt, cb) => {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }
  if (!opt)
    opt = {}

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt)
  const found = []

  const step = i => new Promise((resolve, reject) => {
    if (i === pathEnv.length)
      return opt.all && found.length ? resolve(found)
        : reject(getNotFoundError(cmd))

    const ppRaw = pathEnv[i]
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw

    const pCmd = path.join(pathPart, cmd)
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd

    resolve(subStep(p, i, 0))
  })

  const subStep = (p, i, ii) => new Promise((resolve, reject) => {
    if (ii === pathExt.length)
      return resolve(step(i + 1))
    const ext = pathExt[ii]
    isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
      if (!er && is) {
        if (opt.all)
          found.push(p + ext)
        else
          return resolve(p + ext)
      }
      return resolve(subStep(p, i, ii + 1))
    })
  })

  return cb ? step(0).then(res => cb(null, res), cb) : step(0)
}

const whichSync = (cmd, opt) => {
  opt = opt || {}

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt)
  const found = []

  for (let i = 0; i < pathEnv.length; i ++) {
    const ppRaw = pathEnv[i]
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw

    const pCmd = path.join(pathPart, cmd)
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd

    for (let j = 0; j < pathExt.length; j ++) {
      const cur = p + pathExt[j]
      try {
        const is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}

module.exports = which
which.sync = whichSync


/***/ }),

/***/ 8984:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 3129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 8614:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
(() => {
"use strict";

// EXTERNAL MODULE: ../../.yarn/cache/execa-npm-4.0.3-b70e1b2212-65b237d178.zip/node_modules/execa/index.js
var execa = __webpack_require__(1115);
var execa_default = /*#__PURE__*/__webpack_require__.n(execa);

// EXTERNAL MODULE: ../buildpack-core/src/index.ts
var src = __webpack_require__(6774);

// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(5747);
var external_fs_default = /*#__PURE__*/__webpack_require__.n(external_fs_);

// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(5622);
var external_path_default = /*#__PURE__*/__webpack_require__.n(external_path_);

// CONCATENATED MODULE: ./src/yarn-workspace-start.detector.ts



class YarnWorkspaceStartDetector {
    async detect(ctx) {
        if (!process.env.WORKSPACE) {
            return null;
        }
        if (!external_fs_default().existsSync(external_path_default().join(ctx.workingDir, 'yarn.lock'))) {
            return null;
        }
        const { stdout } = await (0,execa_default())('yarn', ['workspaces', 'list', '--json']);
        const workspaces = stdout.split('\n').map((item) => JSON.parse(item));
        const workspace = workspaces.find(({ name }) => name === process.env.WORKSPACE);
        if (!workspace) {
            return null;
        }
        const entrypoint = `${workspace.location}/dist/index.js`;
        return {
            provides: [{
                    name: 'yarn-workspace-start'
                }],
            requires: [
                {
                    name: 'yarn-workspace-start',
                    metadata: {
                        entrypoint,
                    },
                },
            ],
        };
    }
}

// CONCATENATED MODULE: ./src/yarn-workspace-start.builder.ts
class YarnWorkspaceStartBuilder {
    async build(ctx) {
        const entry = ctx.plan.getEntry('yarn-workspace-start');
        const entrypoint = entry.metadata.entrypoint || 'dist/index.js';
        ctx.addWebProcess(['yarn', 'pnpify', 'node', entrypoint]);
    }
}

// CONCATENATED MODULE: ./src/index.ts



(0,src.run)(new YarnWorkspaceStartDetector(), new YarnWorkspaceStartBuilder());
const core = __webpack_require__(6774);

})();

/******/ })()
;