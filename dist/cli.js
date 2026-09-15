#!/usr/bin/env node
import { createRequire } from "node:module";
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// engine/src/compiler/capabilities.ts
var SCENE_CAPABILITIES = {
  modes: ["photo", "anime", "edit", "video"],
  shared: ["subject", "action", "environment", "optics.*", "lighting.*", "style.*", "filters", "spatial.foreground", "spatial.midground", "spatial.background", "physics.materialProperties", "physics.invariance", "references", "referenceOptions", "aspectRatio", "noText", "negativePrompt", "candidShot", "showNewAnglePrompt"],
  videoOnly: ["motion.*", "kinematics.*", "anchoring.*", "actionChoreography.*", "spatial.trajectory", "spatial.rackFocus", "physics.forces", "physics.massAndInertia", "physics.causalChain", "timelineOptions"],
  parameters: { seed: "portable caller hint on every target; caller maps to its generation API", quality: "Midjourney only", rawStylize: "Midjourney only; defaults on for that target", tokenBudget: "advisory limit on estimated emitted tokens; default 2048" },
  unsupportedPolicy: "Warn with field path; do not silently discard supplied unsupported scene settings.",
  timelinePolicy: "Continuous timelineBeats do not create cuts. directorShots create cuts, inherit scene fields and allow nested overrides. Arrays replace inherited arrays.",
  catalogPolicy: "Exact ID, exact label, category alias, slug, then unique prefix. Ambiguous or unknown values remain custom text with a diagnostic.",
  outputContract: "Prompt text and portable metadata; not a ready-to-submit provider API request. No provider version or generation quality guarantee is implied."
};

// engine/src/cli.ts
import { readFileSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// node_modules/zod/v4/core/core.js
var NEVER = Object.freeze({
  status: "aborted"
});
function $constructor(name, initializer, params) {
  function init(inst, def) {
    var _a;
    Object.defineProperty(inst, "_zod", {
      value: inst._zod ?? {},
      enumerable: false
    });
    (_a = inst._zod).traits ?? (_a.traits = new Set);
    inst._zod.traits.add(name);
    initializer(inst, def);
    for (const k in _.prototype) {
      if (!(k in inst))
        Object.defineProperty(inst, k, { value: _.prototype[k].bind(inst) });
    }
    inst._zod.constr = _;
    inst._zod.def = def;
  }
  const Parent = params?.Parent ?? Object;

  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def) {
    var _a;
    const inst = params?.Parent ? new Definition : this;
    init(inst, def);
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    for (const fn of inst._zod.deferred) {
      fn();
    }
    return inst;
  }
  Object.defineProperty(_, "init", { value: init });
  Object.defineProperty(_, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return true;
      return inst?._zod?.traits?.has(name);
    }
  });
  Object.defineProperty(_, "name", { value: name });
  return _;
}
var $brand = Symbol("zod_brand");

class $ZodAsyncError extends Error {
  constructor() {
    super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
  }
}
var globalConfig = {};
function config(newConfig) {
  if (newConfig)
    Object.assign(globalConfig, newConfig);
  return globalConfig;
}
// node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
  const numericValues = Object.values(entries).filter((v) => typeof v === "number");
  const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
  return values;
}
function joinValues(array, separator = "|") {
  return array.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}
function cached(getter) {
  const set = false;
  return {
    get value() {
      if (!set) {
        const value = getter();
        Object.defineProperty(this, "value", { value });
        return value;
      }
      throw new Error("cached value already set");
    }
  };
}
function nullish(input) {
  return input === null || input === undefined;
}
function cleanRegex(source) {
  const start = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
function defineLazy(object, key, getter) {
  const set = false;
  Object.defineProperty(object, key, {
    get() {
      if (!set) {
        const value = getter();
        object[key] = value;
        return value;
      }
      throw new Error("cached value already set");
    },
    set(v) {
      Object.defineProperty(object, key, {
        value: v
      });
    },
    configurable: true
  });
}
function assignProp(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
function esc(str) {
  return JSON.stringify(str);
}
var captureStackTrace = Error.captureStackTrace ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval = cached(() => {
  if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
    return false;
  }
  try {
    const F = Function;
    new F("");
    return true;
  } catch (_) {
    return false;
  }
});
function isPlainObject(o) {
  if (isObject(o) === false)
    return false;
  const ctor = o.constructor;
  if (ctor === undefined)
    return true;
  const prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
var propertyKeyTypes = new Set(["string", "number", "symbol"]);
var primitiveTypes = new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"]);
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams(_params) {
  const params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== undefined) {
    if (params?.error !== undefined)
      throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function stringifyPrimitive(value) {
  if (typeof value === "bigint")
    return value.toString() + "n";
  if (typeof value === "string")
    return `"${value}"`;
  return `${value}`;
}
function optionalKeys(shape) {
  return Object.keys(shape).filter((k) => {
    return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
  });
}
var NUMBER_FORMAT_RANGES = {
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-340282346638528860000000000000000000000, 340282346638528860000000000000000000000],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function pick(schema, mask) {
  const newShape = {};
  const currDef = schema._zod.def;
  for (const key in mask) {
    if (!(key in currDef.shape)) {
      throw new Error(`Unrecognized key: "${key}"`);
    }
    if (!mask[key])
      continue;
    newShape[key] = currDef.shape[key];
  }
  return clone(schema, {
    ...schema._zod.def,
    shape: newShape,
    checks: []
  });
}
function omit(schema, mask) {
  const newShape = { ...schema._zod.def.shape };
  const currDef = schema._zod.def;
  for (const key in mask) {
    if (!(key in currDef.shape)) {
      throw new Error(`Unrecognized key: "${key}"`);
    }
    if (!mask[key])
      continue;
    delete newShape[key];
  }
  return clone(schema, {
    ...schema._zod.def,
    shape: newShape,
    checks: []
  });
}
function extend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to extend: expected a plain object");
  }
  const def = {
    ...schema._zod.def,
    get shape() {
      const _shape = { ...schema._zod.def.shape, ...shape };
      assignProp(this, "shape", _shape);
      return _shape;
    },
    checks: []
  };
  return clone(schema, def);
}
function merge(a, b) {
  return clone(a, {
    ...a._zod.def,
    get shape() {
      const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
      assignProp(this, "shape", _shape);
      return _shape;
    },
    catchall: b._zod.def.catchall,
    checks: []
  });
}
function partial(Class, schema, mask) {
  const oldShape = schema._zod.def.shape;
  const shape = { ...oldShape };
  if (mask) {
    for (const key in mask) {
      if (!(key in oldShape)) {
        throw new Error(`Unrecognized key: "${key}"`);
      }
      if (!mask[key])
        continue;
      shape[key] = Class ? new Class({
        type: "optional",
        innerType: oldShape[key]
      }) : oldShape[key];
    }
  } else {
    for (const key in oldShape) {
      shape[key] = Class ? new Class({
        type: "optional",
        innerType: oldShape[key]
      }) : oldShape[key];
    }
  }
  return clone(schema, {
    ...schema._zod.def,
    shape,
    checks: []
  });
}
function required(Class, schema, mask) {
  const oldShape = schema._zod.def.shape;
  const shape = { ...oldShape };
  if (mask) {
    for (const key in mask) {
      if (!(key in shape)) {
        throw new Error(`Unrecognized key: "${key}"`);
      }
      if (!mask[key])
        continue;
      shape[key] = new Class({
        type: "nonoptional",
        innerType: oldShape[key]
      });
    }
  } else {
    for (const key in oldShape) {
      shape[key] = new Class({
        type: "nonoptional",
        innerType: oldShape[key]
      });
    }
  }
  return clone(schema, {
    ...schema._zod.def,
    shape,
    checks: []
  });
}
function aborted(x, startIndex = 0) {
  for (let i = startIndex;i < x.issues.length; i++) {
    if (x.issues[i]?.continue !== true)
      return true;
  }
  return false;
}
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a;
    (_a = iss).path ?? (_a.path = []);
    iss.path.unshift(path);
    return iss;
  });
}
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config) {
  const full = { ...iss, path: iss.path ?? [] };
  if (!iss.message) {
    const message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
    full.message = message;
  }
  delete full.inst;
  delete full.continue;
  if (!ctx?.reportInput) {
    delete full.input;
  }
  return full;
}
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function issue(...args) {
  const [iss, input, inst] = args;
  if (typeof iss === "string") {
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  }
  return { ...iss };
}

// node_modules/zod/v4/core/errors.js
var initializer = (inst, def) => {
  inst.name = "$ZodError";
  Object.defineProperty(inst, "_zod", {
    value: inst._zod,
    enumerable: false
  });
  Object.defineProperty(inst, "issues", {
    value: def,
    enumerable: false
  });
  Object.defineProperty(inst, "message", {
    get() {
      return JSON.stringify(def, jsonStringifyReplacer, 2);
    },
    enumerable: true
  });
  Object.defineProperty(inst, "toString", {
    value: () => inst.message,
    enumerable: false
  });
};
var $ZodError = $constructor("$ZodError", initializer);
var $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
function flattenError(error, mapper = (issue) => issue.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error.issues) {
    if (sub.path.length > 0) {
      fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
      fieldErrors[sub.path[0]].push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}
function formatError(error, _mapper) {
  const mapper = _mapper || function(issue) {
    return issue.message;
  };
  const fieldErrors = { _errors: [] };
  const processError = (error) => {
    for (const issue of error.issues) {
      if (issue.code === "invalid_union" && issue.errors.length) {
        issue.errors.map((issues) => processError({ issues }));
      } else if (issue.code === "invalid_key") {
        processError({ issues: issue.issues });
      } else if (issue.code === "invalid_element") {
        processError({ issues: issue.issues });
      } else if (issue.path.length === 0) {
        fieldErrors._errors.push(mapper(issue));
      } else {
        let curr = fieldErrors;
        let i = 0;
        while (i < issue.path.length) {
          const el = issue.path[i];
          const terminal = i === issue.path.length - 1;
          if (!terminal) {
            curr[el] = curr[el] || { _errors: [] };
          } else {
            curr[el] = curr[el] || { _errors: [] };
            curr[el]._errors.push(mapper(issue));
          }
          curr = curr[el];
          i++;
        }
      }
    }
  };
  processError(error);
  return fieldErrors;
}

// node_modules/zod/v4/core/parse.js
var _parse = (_Err) => (schema, value, _ctx, _params) => {
  const ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError;
  }
  if (result.issues.length) {
    const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, _params?.callee);
    throw e;
  }
  return result.value;
};
var _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
  const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  if (result.issues.length) {
    const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
    captureStackTrace(e, params?.callee);
    throw e;
  }
  return result.value;
};
var _safeParse = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError;
  }
  return result.issues.length ? {
    success: false,
    error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
};
var safeParse = /* @__PURE__ */ _safeParse($ZodRealError);
var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? {
    success: false,
    error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  } : { success: true, data: result.value };
};
var safeParseAsync = /* @__PURE__ */ _safeParseAsync($ZodRealError);
// node_modules/zod/v4/core/regexes.js
var cuid = /^[cC][^\s-]{8,}$/;
var cuid2 = /^[0-9a-z]+$/;
var ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
var xid = /^[0-9a-vA-V]{20}$/;
var ksuid = /^[A-Za-z0-9]{27}$/;
var nanoid = /^[a-zA-Z0-9_-]{21}$/;
var duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
var uuid = (version) => {
  if (!version)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
var email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
  return new RegExp(_emoji, "u");
}
var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$/;
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
var base64url = /^[A-Za-z0-9_-]*$/;
var hostname = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$/;
var e164 = /^\+(?:[0-9]){6,14}[0-9]$/;
var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
var date = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
function timeSource(args) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  return regex;
}
function time(args) {
  return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
  const time = timeSource({ precision: args.precision });
  const opts = ["Z"];
  if (args.local)
    opts.push("");
  if (args.offset)
    opts.push(`([+-]\\d{2}:\\d{2})`);
  const timeRegex = `${time}(?:${opts.join("|")})`;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
var string = (params) => {
  const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
  return new RegExp(`^${regex}$`);
};
var integer = /^\d+$/;
var number = /^-?\d+(?:\.\d+)?/i;
var boolean = /true|false/i;
var lowercase = /^[^A-Z]*$/;
var uppercase = /^[^a-z]*$/;

// node_modules/zod/v4/core/checks.js
var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
  var _a;
  inst._zod ?? (inst._zod = {});
  inst._zod.def = def;
  (_a = inst._zod).onattach ?? (_a.onattach = []);
});
var numericOriginMap = {
  number: "number",
  bigint: "bigint",
  object: "date"
};
var $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
    if (def.value < curr) {
      if (def.inclusive)
        bag.maximum = def.value;
      else
        bag.exclusiveMaximum = def.value;
    }
  });
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
      return;
    }
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
    if (def.value > curr) {
      if (def.inclusive)
        bag.minimum = def.value;
      else
        bag.exclusiveMinimum = def.value;
    }
  });
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
      return;
    }
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.onattach.push((inst) => {
    var _a;
    (_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
  });
  inst._zod.check = (payload) => {
    if (typeof payload.value !== typeof def.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    const isMultiple = typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0;
    if (isMultiple)
      return;
    payload.issues.push({
      origin: typeof payload.value,
      code: "not_multiple_of",
      divisor: def.value,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
  $ZodCheck.init(inst, def);
  def.format = def.format || "float64";
  const isInt = def.format?.includes("int");
  const origin = isInt ? "int" : "number";
  const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.format = def.format;
    bag.minimum = minimum;
    bag.maximum = maximum;
    if (isInt)
      bag.pattern = integer;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    if (isInt) {
      if (!Number.isInteger(input)) {
        payload.issues.push({
          expected: origin,
          format: def.format,
          code: "invalid_type",
          input,
          inst
        });
        return;
      }
      if (!Number.isSafeInteger(input)) {
        if (input > 0) {
          payload.issues.push({
            input,
            code: "too_big",
            maximum: Number.MAX_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            continue: !def.abort
          });
        } else {
          payload.issues.push({
            input,
            code: "too_small",
            minimum: Number.MIN_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            continue: !def.abort
          });
        }
        return;
      }
    }
    if (input < minimum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_small",
        minimum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
    if (input > maximum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_big",
        maximum,
        inst
      });
    }
  };
});
var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== undefined;
  });
  inst._zod.onattach.push((inst) => {
    const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    if (def.maximum < curr)
      inst._zod.bag.maximum = def.maximum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length <= def.maximum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== undefined;
  });
  inst._zod.onattach.push((inst) => {
    const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    if (def.minimum > curr)
      inst._zod.bag.minimum = def.minimum;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length >= def.minimum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = (payload) => {
    const val = payload.value;
    return !nullish(val) && val.length !== undefined;
  });
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.minimum = def.length;
    bag.maximum = def.length;
    bag.length = def.length;
  });
  inst._zod.check = (payload) => {
    const input = payload.value;
    const length = input.length;
    if (length === def.length)
      return;
    const origin = getLengthableOrigin(input);
    const tooBig = length > def.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
  var _a, _b;
  $ZodCheck.init(inst, def);
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.format = def.format;
    if (def.pattern) {
      bag.patterns ?? (bag.patterns = new Set);
      bag.patterns.add(def.pattern);
    }
  });
  if (def.pattern)
    (_a = inst._zod).check ?? (_a.check = (payload) => {
      def.pattern.lastIndex = 0;
      if (def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        ...def.pattern ? { pattern: def.pattern.toString() } : {},
        inst,
        continue: !def.abort
      });
    });
  else
    (_b = inst._zod).check ?? (_b.check = () => {});
});
var $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    def.pattern.lastIndex = 0;
    if (def.pattern.test(payload.value))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: payload.value,
      pattern: def.pattern.toString(),
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
  def.pattern ?? (def.pattern = lowercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
  def.pattern ?? (def.pattern = uppercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
  $ZodCheck.init(inst, def);
  const escapedRegex = escapeRegex(def.includes);
  const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
  def.pattern = pattern;
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.patterns ?? (bag.patterns = new Set);
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.includes(def.includes, def.position))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def.includes,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.patterns ?? (bag.patterns = new Set);
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.startsWith(def.prefix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: def.prefix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.patterns ?? (bag.patterns = new Set);
    bag.patterns.add(pattern);
  });
  inst._zod.check = (payload) => {
    if (payload.value.endsWith(def.suffix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: def.suffix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});

// node_modules/zod/v4/core/doc.js
class Doc {
  constructor(args = []) {
    this.content = [];
    this.indent = 0;
    if (this)
      this.args = args;
  }
  indented(fn) {
    this.indent += 1;
    fn(this);
    this.indent -= 1;
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" });
      arg(this, { execution: "async" });
      return;
    }
    const content = arg;
    const lines = content.split(`
`).filter((x) => x);
    const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
    const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
    for (const line of dedented) {
      this.content.push(line);
    }
  }
  compile() {
    const F = Function;
    const args = this?.args;
    const content = this?.content ?? [``];
    const lines = [...content.map((x) => `  ${x}`)];
    return new F(...args, lines.join(`
`));
  }
}

// node_modules/zod/v4/core/versions.js
var version = {
  major: 4,
  minor: 0,
  patch: 0
};

// node_modules/zod/v4/core/schemas.js
var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
  var _a;
  inst ?? (inst = {});
  inst._zod.def = def;
  inst._zod.bag = inst._zod.bag || {};
  inst._zod.version = version;
  const checks = [...inst._zod.def.checks ?? []];
  if (inst._zod.traits.has("$ZodCheck")) {
    checks.unshift(inst);
  }
  for (const ch of checks) {
    for (const fn of ch._zod.onattach) {
      fn(inst);
    }
  }
  if (checks.length === 0) {
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  } else {
    const runChecks = (payload, checks, ctx) => {
      let isAborted = aborted(payload);
      let asyncResult;
      for (const ch of checks) {
        if (ch._zod.def.when) {
          const shouldRun = ch._zod.def.when(payload);
          if (!shouldRun)
            continue;
        } else if (isAborted) {
          continue;
        }
        const currLen = payload.issues.length;
        const _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === false) {
          throw new $ZodAsyncError;
        }
        if (asyncResult || _ instanceof Promise) {
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            await _;
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              return;
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          });
        } else {
          const nextLen = payload.issues.length;
          if (nextLen === currLen)
            continue;
          if (!isAborted)
            isAborted = aborted(payload, currLen);
        }
      }
      if (asyncResult) {
        return asyncResult.then(() => {
          return payload;
        });
      }
      return payload;
    };
    inst._zod.run = (payload, ctx) => {
      const result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError;
        return result.then((result) => runChecks(result, checks, ctx));
      }
      return runChecks(result, checks, ctx);
    };
  }
  inst["~standard"] = {
    validate: (value) => {
      try {
        const r = safeParse(inst, value);
        return r.success ? { value: r.data } : { issues: r.error?.issues };
      } catch (_) {
        return safeParseAsync(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
      }
    },
    vendor: "zod",
    version: 1
  };
});
var $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string(inst._zod.bag);
  inst._zod.parse = (payload, _) => {
    if (def.coerce)
      try {
        payload.value = String(payload.value);
      } catch (_) {}
    if (typeof payload.value === "string")
      return payload;
    payload.issues.push({
      expected: "string",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
var $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  $ZodString.init(inst, def);
});
var $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
  def.pattern ?? (def.pattern = guid);
  $ZodStringFormat.init(inst, def);
});
var $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
  if (def.version) {
    const versionMap = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    };
    const v = versionMap[def.version];
    if (v === undefined)
      throw new Error(`Invalid UUID version: "${def.version}"`);
    def.pattern ?? (def.pattern = uuid(v));
  } else
    def.pattern ?? (def.pattern = uuid());
  $ZodStringFormat.init(inst, def);
});
var $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
  def.pattern ?? (def.pattern = email);
  $ZodStringFormat.init(inst, def);
});
var $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    try {
      const orig = payload.value;
      const url = new URL(orig);
      const href = url.href;
      if (def.hostname) {
        def.hostname.lastIndex = 0;
        if (!def.hostname.test(url.hostname)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid hostname",
            pattern: hostname.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      }
      if (def.protocol) {
        def.protocol.lastIndex = 0;
        if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
          payload.issues.push({
            code: "invalid_format",
            format: "url",
            note: "Invalid protocol",
            pattern: def.protocol.source,
            input: payload.value,
            inst,
            continue: !def.abort
          });
        }
      }
      if (!orig.endsWith("/") && href.endsWith("/")) {
        payload.value = href.slice(0, -1);
      } else {
        payload.value = href;
      }
      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
  def.pattern ?? (def.pattern = emoji());
  $ZodStringFormat.init(inst, def);
});
var $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
  def.pattern ?? (def.pattern = nanoid);
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
  def.pattern ?? (def.pattern = cuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
  def.pattern ?? (def.pattern = cuid2);
  $ZodStringFormat.init(inst, def);
});
var $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
  def.pattern ?? (def.pattern = ulid);
  $ZodStringFormat.init(inst, def);
});
var $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
  def.pattern ?? (def.pattern = xid);
  $ZodStringFormat.init(inst, def);
});
var $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
  def.pattern ?? (def.pattern = ksuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
  def.pattern ?? (def.pattern = datetime(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
  def.pattern ?? (def.pattern = date);
  $ZodStringFormat.init(inst, def);
});
var $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
  def.pattern ?? (def.pattern = time(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
  def.pattern ?? (def.pattern = duration);
  $ZodStringFormat.init(inst, def);
});
var $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
  def.pattern ?? (def.pattern = ipv4);
  $ZodStringFormat.init(inst, def);
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.format = `ipv4`;
  });
});
var $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
  def.pattern ?? (def.pattern = ipv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag;
    bag.format = `ipv6`;
  });
  inst._zod.check = (payload) => {
    try {
      new URL(`http://[${payload.value}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv4);
  $ZodStringFormat.init(inst, def);
});
var $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    const [address, prefix] = payload.value.split("/");
    try {
      if (!prefix)
        throw new Error;
      const prefixNum = Number(prefix);
      if (`${prefixNum}` !== prefix)
        throw new Error;
      if (prefixNum < 0 || prefixNum > 128)
        throw new Error;
      new URL(`http://[${address}]`);
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
function isValidBase64(data) {
  if (data === "")
    return true;
  if (data.length % 4 !== 0)
    return false;
  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}
var $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
  def.pattern ?? (def.pattern = base64);
  $ZodStringFormat.init(inst, def);
  inst._zod.onattach.push((inst) => {
    inst._zod.bag.contentEncoding = "base64";
  });
  inst._zod.check = (payload) => {
    if (isValidBase64(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
function isValidBase64URL(data) {
  if (!base64url.test(data))
    return false;
  const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return isValidBase64(padded);
}
var $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
  def.pattern ?? (def.pattern = base64url);
  $ZodStringFormat.init(inst, def);
  inst._zod.onattach.push((inst) => {
    inst._zod.bag.contentEncoding = "base64url";
  });
  inst._zod.check = (payload) => {
    if (isValidBase64URL(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
  def.pattern ?? (def.pattern = e164);
  $ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
  try {
    const tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return false;
    const [header] = tokensParts;
    if (!header)
      return false;
    const parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return false;
    if (!parsedHeader.alg)
      return false;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return false;
    return true;
  } catch {
    return false;
  }
}
var $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidJWT(payload.value, def.alg))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = inst._zod.bag.pattern ?? number;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Number(payload.value);
      } catch (_) {}
    const input = payload.value;
    if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
      return payload;
    }
    const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : undefined : undefined;
    payload.issues.push({
      expected: "number",
      code: "invalid_type",
      input,
      inst,
      ...received ? { received } : {}
    });
    return payload;
  };
});
var $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
  $ZodCheckNumberFormat.init(inst, def);
  $ZodNumber.init(inst, def);
});
var $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = boolean;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Boolean(payload.value);
      } catch (_) {}
    const input = payload.value;
    if (typeof input === "boolean")
      return payload;
    payload.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload) => payload;
});
var $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    payload.issues.push({
      expected: "never",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
function handleArrayResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = Array(input.length);
    const proms = [];
    for (let i = 0;i < input.length; i++) {
      const item = input[i];
      const result = def.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result) => handleArrayResult(result, payload, i)));
      } else {
        handleArrayResult(result, payload, i);
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
function handleObjectResult(result, final, key) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(key, result.issues));
  }
  final.value[key] = result.value;
}
function handleOptionalObjectResult(result, final, key, input) {
  if (result.issues.length) {
    if (input[key] === undefined) {
      if (key in input) {
        final.value[key] = undefined;
      } else {
        final.value[key] = result.value;
      }
    } else {
      final.issues.push(...prefixIssues(key, result.issues));
    }
  } else if (result.value === undefined) {
    if (key in input)
      final.value[key] = undefined;
  } else {
    final.value[key] = result.value;
  }
}
var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
  $ZodType.init(inst, def);
  const _normalized = cached(() => {
    const keys = Object.keys(def.shape);
    for (const k of keys) {
      if (!(def.shape[k] instanceof $ZodType)) {
        throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
      }
    }
    const okeys = optionalKeys(def.shape);
    return {
      shape: def.shape,
      keys,
      keySet: new Set(keys),
      numKeys: keys.length,
      optionalKeys: new Set(okeys)
    };
  });
  defineLazy(inst._zod, "propValues", () => {
    const shape = def.shape;
    const propValues = {};
    for (const key in shape) {
      const field = shape[key]._zod;
      if (field.values) {
        propValues[key] ?? (propValues[key] = new Set);
        for (const v of field.values)
          propValues[key].add(v);
      }
    }
    return propValues;
  });
  const generateFastpass = (shape) => {
    const doc = new Doc(["shape", "payload", "ctx"]);
    const normalized = _normalized.value;
    const parseStr = (key) => {
      const k = esc(key);
      return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
    };
    doc.write(`const input = payload.value;`);
    const ids = Object.create(null);
    let counter = 0;
    for (const key of normalized.keys) {
      ids[key] = `key_${counter++}`;
    }
    doc.write(`const newResult = {}`);
    for (const key of normalized.keys) {
      if (normalized.optionalKeys.has(key)) {
        const id = ids[key];
        doc.write(`const ${id} = ${parseStr(key)};`);
        const k = esc(key);
        doc.write(`
        if (${id}.issues.length) {
          if (input[${k}] === undefined) {
            if (${k} in input) {
              newResult[${k}] = undefined;
            }
          } else {
            payload.issues = payload.issues.concat(
              ${id}.issues.map((iss) => ({
                ...iss,
                path: iss.path ? [${k}, ...iss.path] : [${k}],
              }))
            );
          }
        } else if (${id}.value === undefined) {
          if (${k} in input) newResult[${k}] = undefined;
        } else {
          newResult[${k}] = ${id}.value;
        }
        `);
      } else {
        const id = ids[key];
        doc.write(`const ${id} = ${parseStr(key)};`);
        doc.write(`
          if (${id}.issues.length) payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${esc(key)}, ...iss.path] : [${esc(key)}]
          })));`);
        doc.write(`newResult[${esc(key)}] = ${id}.value`);
      }
    }
    doc.write(`payload.value = newResult;`);
    doc.write(`return payload;`);
    const fn = doc.compile();
    return (payload, ctx) => fn(shape, payload, ctx);
  };
  let fastpass;
  const isObject2 = isObject;
  const jit = !globalConfig.jitless;
  const allowsEval2 = allowsEval;
  const fastEnabled = jit && allowsEval2.value;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    const proms = [];
    if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
      if (!fastpass)
        fastpass = generateFastpass(def.shape);
      payload = fastpass(payload, ctx);
    } else {
      payload.value = {};
      const shape = value.shape;
      for (const key of value.keys) {
        const el = shape[key];
        const r = el._zod.run({ value: input[key], issues: [] }, ctx);
        const isOptional = el._zod.optin === "optional" && el._zod.optout === "optional";
        if (r instanceof Promise) {
          proms.push(r.then((r) => isOptional ? handleOptionalObjectResult(r, payload, key, input) : handleObjectResult(r, payload, key)));
        } else if (isOptional) {
          handleOptionalObjectResult(r, payload, key, input);
        } else {
          handleObjectResult(r, payload, key);
        }
      }
    }
    if (!catchall) {
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    }
    const unrecognized = [];
    const keySet = value.keySet;
    const _catchall = catchall._zod;
    const t = _catchall.def.type;
    for (const key of Object.keys(input)) {
      if (keySet.has(key))
        continue;
      if (t === "never") {
        unrecognized.push(key);
        continue;
      }
      const r = _catchall.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(r.then((r) => handleObjectResult(r, payload, key)));
      } else {
        handleObjectResult(r, payload, key);
      }
    }
    if (unrecognized.length) {
      payload.issues.push({
        code: "unrecognized_keys",
        keys: unrecognized,
        input,
        inst
      });
    }
    if (!proms.length)
      return payload;
    return Promise.all(proms).then(() => {
      return payload;
    });
  };
});
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
var $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : undefined);
  defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : undefined);
  defineLazy(inst._zod, "values", () => {
    if (def.options.every((o) => o._zod.values)) {
      return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
    }
    return;
  });
  defineLazy(inst._zod, "pattern", () => {
    if (def.options.every((o) => o._zod.pattern)) {
      const patterns = def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
    }
    return;
  });
  inst._zod.parse = (payload, ctx) => {
    let async = false;
    const results = [];
    for (const option of def.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results) => {
      return handleUnionResults(results, payload, inst, ctx);
    });
  };
});
var $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    const left = def.left._zod.run({ value: input, issues: [] }, ctx);
    const right = def.right._zod.run({ value: input, issues: [] }, ctx);
    const async = left instanceof Promise || right instanceof Promise;
    if (async) {
      return Promise.all([left, right]).then(([left, right]) => {
        return handleIntersectionResults(payload, left, right);
      });
    }
    return handleIntersectionResults(payload, left, right);
  };
});
function mergeValues(a, b) {
  if (a === b) {
    return { valid: true, data: a };
  }
  if (a instanceof Date && b instanceof Date && +a === +b) {
    return { valid: true, data: a };
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const bKeys = Object.keys(b);
    const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return { valid: false, mergeErrorPath: [] };
    }
    const newArray = [];
    for (let index = 0;index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  }
  return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
  if (left.issues.length) {
    result.issues.push(...left.issues);
  }
  if (right.issues.length) {
    result.issues.push(...right.issues);
  }
  if (aborted(result))
    return result;
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    throw new Error(`Unmergable intersection. Error path: ` + `${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
  $ZodType.init(inst, def);
  const values = getEnumValues(def.entries);
  inst._zod.values = new Set(values);
  inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (inst._zod.values.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    const _out = def.transform(payload.value, payload);
    if (_ctx.async) {
      const output = _out instanceof Promise ? _out : Promise.resolve(_out);
      return output.then((output) => {
        payload.value = output;
        return payload;
      });
    }
    if (_out instanceof Promise) {
      throw new $ZodAsyncError;
    }
    payload.value = _out;
    return payload;
  };
});
var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  inst._zod.optout = "optional";
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? new Set([...def.innerType._zod.values, undefined]) : undefined;
  });
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    if (def.innerType._zod.optin === "optional") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === undefined) {
      return payload;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "pattern", () => {
    const pattern = def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : undefined;
  });
  defineLazy(inst._zod, "values", () => {
    return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === undefined) {
      payload.value = def.defaultValue;
      return payload;
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => handleDefaultResult(result, def));
    }
    return handleDefaultResult(result, def);
  };
});
function handleDefaultResult(payload, def) {
  if (payload.value === undefined) {
    payload.value = def.defaultValue;
  }
  return payload;
}
var $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === undefined) {
      payload.value = def.defaultValue;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => {
    const v = def.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== undefined)) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => handleNonOptionalResult(result, inst));
    }
    return handleNonOptionalResult(result, inst);
  };
});
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === undefined) {
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  }
  return payload;
}
var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => {
        payload.value = result.value;
        if (result.issues.length) {
          payload.value = def.catchValue({
            ...payload,
            error: {
              issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
            },
            input: payload.value
          });
          payload.issues = [];
        }
        return payload;
      });
    }
    payload.value = result.value;
    if (result.issues.length) {
      payload.value = def.catchValue({
        ...payload,
        error: {
          issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
        },
        input: payload.value
      });
      payload.issues = [];
    }
    return payload;
  };
});
var $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "values", () => def.in._zod.values);
  defineLazy(inst._zod, "optin", () => def.in._zod.optin);
  defineLazy(inst._zod, "optout", () => def.out._zod.optout);
  inst._zod.parse = (payload, ctx) => {
    const left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise) {
      return left.then((left) => handlePipeResult(left, def, ctx));
    }
    return handlePipeResult(left, def, ctx);
  };
});
function handlePipeResult(left, def, ctx) {
  if (aborted(left)) {
    return left;
  }
  return def.out._zod.run({ value: left.value, issues: left.issues }, ctx);
}
var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
  defineLazy(inst._zod, "values", () => def.innerType._zod.values);
  defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
  defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
  inst._zod.parse = (payload, ctx) => {
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then(handleReadonlyResult);
    }
    return handleReadonlyResult(result);
  };
});
function handleReadonlyResult(payload) {
  payload.value = Object.freeze(payload.value);
  return payload;
}
var $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
  $ZodCheck.init(inst, def);
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _) => {
    return payload;
  };
  inst._zod.check = (payload) => {
    const input = payload.value;
    const r = def.fn(input);
    if (r instanceof Promise) {
      return r.then((r) => handleRefineResult(r, payload, input, inst));
    }
    handleRefineResult(r, payload, input, inst);
    return;
  };
});
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      path: [...inst._zod.def.path ?? []],
      continue: !inst._zod.def.abort
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}
// node_modules/zod/v4/locales/en.js
var parsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "number": {
      return Number.isNaN(data) ? "NaN" : "number";
    }
    case "object": {
      if (Array.isArray(data)) {
        return "array";
      }
      if (data === null) {
        return "null";
      }
      if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
        return data.constructor.name;
      }
    }
  }
  return t;
};
var error = () => {
  const Sizable = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const Nouns = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    jwt: "JWT",
    template_literal: "input"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type":
        return `Invalid input: expected ${issue.expected}, received ${parsedType(issue.input)}`;
      case "invalid_value":
        if (issue.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
        return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `Invalid string: must start with "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Invalid string: must end with "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Invalid string: must include "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Invalid string: must match pattern ${_issue.pattern}`;
        return `Invalid ${Nouns[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${issue.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${issue.origin}`;
      case "invalid_union":
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${issue.origin}`;
      default:
        return `Invalid input`;
    }
  };
};
function en_default() {
  return {
    localeError: error()
  };
}
// node_modules/zod/v4/core/registries.js
var $output = Symbol("ZodOutput");
var $input = Symbol("ZodInput");

class $ZodRegistry {
  constructor() {
    this._map = new Map;
    this._idmap = new Map;
  }
  add(schema, ..._meta) {
    const meta = _meta[0];
    this._map.set(schema, meta);
    if (meta && typeof meta === "object" && "id" in meta) {
      if (this._idmap.has(meta.id)) {
        throw new Error(`ID ${meta.id} already exists in the registry`);
      }
      this._idmap.set(meta.id, schema);
    }
    return this;
  }
  clear() {
    this._map = new Map;
    this._idmap = new Map;
    return this;
  }
  remove(schema) {
    const meta = this._map.get(schema);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.delete(meta.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p = schema._zod.parent;
    if (p) {
      const pm = { ...this.get(p) ?? {} };
      delete pm.id;
      return { ...pm, ...this._map.get(schema) };
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
}
function registry() {
  return new $ZodRegistry;
}
var globalRegistry = /* @__PURE__ */ registry();
// node_modules/zod/v4/core/api.js
function _string(Class, params) {
  return new Class({
    type: "string",
    ...normalizeParams(params)
  });
}
function _email(Class, params) {
  return new Class({
    type: "string",
    format: "email",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _guid(Class, params) {
  return new Class({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _uuid(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _uuidv4(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v4",
    ...normalizeParams(params)
  });
}
function _uuidv6(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v6",
    ...normalizeParams(params)
  });
}
function _uuidv7(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v7",
    ...normalizeParams(params)
  });
}
function _url(Class, params) {
  return new Class({
    type: "string",
    format: "url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _emoji2(Class, params) {
  return new Class({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _nanoid(Class, params) {
  return new Class({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cuid(Class, params) {
  return new Class({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cuid2(Class, params) {
  return new Class({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ulid(Class, params) {
  return new Class({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _xid(Class, params) {
  return new Class({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ksuid(Class, params) {
  return new Class({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ipv4(Class, params) {
  return new Class({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ipv6(Class, params) {
  return new Class({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cidrv4(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cidrv6(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _base64(Class, params) {
  return new Class({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _base64url(Class, params) {
  return new Class({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _e164(Class, params) {
  return new Class({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _jwt(Class, params) {
  return new Class({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _isoDateTime(Class, params) {
  return new Class({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: false,
    local: false,
    precision: null,
    ...normalizeParams(params)
  });
}
function _isoDate(Class, params) {
  return new Class({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams(params)
  });
}
function _isoTime(Class, params) {
  return new Class({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams(params)
  });
}
function _isoDuration(Class, params) {
  return new Class({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams(params)
  });
}
function _number(Class, params) {
  return new Class({
    type: "number",
    checks: [],
    ...normalizeParams(params)
  });
}
function _int(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: false,
    format: "safeint",
    ...normalizeParams(params)
  });
}
function _boolean(Class, params) {
  return new Class({
    type: "boolean",
    ...normalizeParams(params)
  });
}
function _unknown(Class) {
  return new Class({
    type: "unknown"
  });
}
function _never(Class, params) {
  return new Class({
    type: "never",
    ...normalizeParams(params)
  });
}
function _lt(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
function _lte(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
function _gt(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
function _gte(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
function _multipleOf(value, params) {
  return new $ZodCheckMultipleOf({
    check: "multiple_of",
    ...normalizeParams(params),
    value
  });
}
function _maxLength(maximum, params) {
  const ch = new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
  return ch;
}
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
function _regex(pattern, params) {
  return new $ZodCheckRegex({
    check: "string_format",
    format: "regex",
    ...normalizeParams(params),
    pattern
  });
}
function _lowercase(params) {
  return new $ZodCheckLowerCase({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams(params)
  });
}
function _uppercase(params) {
  return new $ZodCheckUpperCase({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams(params)
  });
}
function _includes(includes, params) {
  return new $ZodCheckIncludes({
    check: "string_format",
    format: "includes",
    ...normalizeParams(params),
    includes
  });
}
function _startsWith(prefix, params) {
  return new $ZodCheckStartsWith({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams(params),
    prefix
  });
}
function _endsWith(suffix, params) {
  return new $ZodCheckEndsWith({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams(params),
    suffix
  });
}
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
function _normalize(form) {
  return _overwrite((input) => input.normalize(form));
}
function _trim() {
  return _overwrite((input) => input.trim());
}
function _toLowerCase() {
  return _overwrite((input) => input.toLowerCase());
}
function _toUpperCase() {
  return _overwrite((input) => input.toUpperCase());
}
function _array(Class, element, params) {
  return new Class({
    type: "array",
    element,
    ...normalizeParams(params)
  });
}
function _refine(Class, fn, _params) {
  const schema = new Class({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
  return schema;
}
// node_modules/zod/v4/core/to-json-schema.js
class JSONSchemaGenerator {
  constructor(params) {
    this.counter = 0;
    this.metadataRegistry = params?.metadata ?? globalRegistry;
    this.target = params?.target ?? "draft-2020-12";
    this.unrepresentable = params?.unrepresentable ?? "throw";
    this.override = params?.override ?? (() => {});
    this.io = params?.io ?? "output";
    this.seen = new Map;
  }
  process(schema, _params = { path: [], schemaPath: [] }) {
    var _a;
    const def = schema._zod.def;
    const formatMap = {
      guid: "uuid",
      url: "uri",
      datetime: "date-time",
      json_string: "json-string",
      regex: ""
    };
    const seen = this.seen.get(schema);
    if (seen) {
      seen.count++;
      const isCycle = _params.schemaPath.includes(schema);
      if (isCycle) {
        seen.cycle = _params.path;
      }
      return seen.schema;
    }
    const result = { schema: {}, count: 1, cycle: undefined, path: _params.path };
    this.seen.set(schema, result);
    const overrideSchema = schema._zod.toJSONSchema?.();
    if (overrideSchema) {
      result.schema = overrideSchema;
    } else {
      const params = {
        ..._params,
        schemaPath: [..._params.schemaPath, schema],
        path: _params.path
      };
      const parent = schema._zod.parent;
      if (parent) {
        result.ref = parent;
        this.process(parent, params);
        this.seen.get(parent).isParent = true;
      } else {
        const _json = result.schema;
        switch (def.type) {
          case "string": {
            const json = _json;
            json.type = "string";
            const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
            if (typeof minimum === "number")
              json.minLength = minimum;
            if (typeof maximum === "number")
              json.maxLength = maximum;
            if (format) {
              json.format = formatMap[format] ?? format;
              if (json.format === "")
                delete json.format;
            }
            if (contentEncoding)
              json.contentEncoding = contentEncoding;
            if (patterns && patterns.size > 0) {
              const regexes = [...patterns];
              if (regexes.length === 1)
                json.pattern = regexes[0].source;
              else if (regexes.length > 1) {
                result.schema.allOf = [
                  ...regexes.map((regex) => ({
                    ...this.target === "draft-7" ? { type: "string" } : {},
                    pattern: regex.source
                  }))
                ];
              }
            }
            break;
          }
          case "number": {
            const json = _json;
            const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
            if (typeof format === "string" && format.includes("int"))
              json.type = "integer";
            else
              json.type = "number";
            if (typeof exclusiveMinimum === "number")
              json.exclusiveMinimum = exclusiveMinimum;
            if (typeof minimum === "number") {
              json.minimum = minimum;
              if (typeof exclusiveMinimum === "number") {
                if (exclusiveMinimum >= minimum)
                  delete json.minimum;
                else
                  delete json.exclusiveMinimum;
              }
            }
            if (typeof exclusiveMaximum === "number")
              json.exclusiveMaximum = exclusiveMaximum;
            if (typeof maximum === "number") {
              json.maximum = maximum;
              if (typeof exclusiveMaximum === "number") {
                if (exclusiveMaximum <= maximum)
                  delete json.maximum;
                else
                  delete json.exclusiveMaximum;
              }
            }
            if (typeof multipleOf === "number")
              json.multipleOf = multipleOf;
            break;
          }
          case "boolean": {
            const json = _json;
            json.type = "boolean";
            break;
          }
          case "bigint": {
            if (this.unrepresentable === "throw") {
              throw new Error("BigInt cannot be represented in JSON Schema");
            }
            break;
          }
          case "symbol": {
            if (this.unrepresentable === "throw") {
              throw new Error("Symbols cannot be represented in JSON Schema");
            }
            break;
          }
          case "null": {
            _json.type = "null";
            break;
          }
          case "any": {
            break;
          }
          case "unknown": {
            break;
          }
          case "undefined": {
            if (this.unrepresentable === "throw") {
              throw new Error("Undefined cannot be represented in JSON Schema");
            }
            break;
          }
          case "void": {
            if (this.unrepresentable === "throw") {
              throw new Error("Void cannot be represented in JSON Schema");
            }
            break;
          }
          case "never": {
            _json.not = {};
            break;
          }
          case "date": {
            if (this.unrepresentable === "throw") {
              throw new Error("Date cannot be represented in JSON Schema");
            }
            break;
          }
          case "array": {
            const json = _json;
            const { minimum, maximum } = schema._zod.bag;
            if (typeof minimum === "number")
              json.minItems = minimum;
            if (typeof maximum === "number")
              json.maxItems = maximum;
            json.type = "array";
            json.items = this.process(def.element, { ...params, path: [...params.path, "items"] });
            break;
          }
          case "object": {
            const json = _json;
            json.type = "object";
            json.properties = {};
            const shape = def.shape;
            for (const key in shape) {
              json.properties[key] = this.process(shape[key], {
                ...params,
                path: [...params.path, "properties", key]
              });
            }
            const allKeys = new Set(Object.keys(shape));
            const requiredKeys = new Set([...allKeys].filter((key) => {
              const v = def.shape[key]._zod;
              if (this.io === "input") {
                return v.optin === undefined;
              } else {
                return v.optout === undefined;
              }
            }));
            if (requiredKeys.size > 0) {
              json.required = Array.from(requiredKeys);
            }
            if (def.catchall?._zod.def.type === "never") {
              json.additionalProperties = false;
            } else if (!def.catchall) {
              if (this.io === "output")
                json.additionalProperties = false;
            } else if (def.catchall) {
              json.additionalProperties = this.process(def.catchall, {
                ...params,
                path: [...params.path, "additionalProperties"]
              });
            }
            break;
          }
          case "union": {
            const json = _json;
            json.anyOf = def.options.map((x, i) => this.process(x, {
              ...params,
              path: [...params.path, "anyOf", i]
            }));
            break;
          }
          case "intersection": {
            const json = _json;
            const a = this.process(def.left, {
              ...params,
              path: [...params.path, "allOf", 0]
            });
            const b = this.process(def.right, {
              ...params,
              path: [...params.path, "allOf", 1]
            });
            const isSimpleIntersection = (val) => ("allOf" in val) && Object.keys(val).length === 1;
            const allOf = [
              ...isSimpleIntersection(a) ? a.allOf : [a],
              ...isSimpleIntersection(b) ? b.allOf : [b]
            ];
            json.allOf = allOf;
            break;
          }
          case "tuple": {
            const json = _json;
            json.type = "array";
            const prefixItems = def.items.map((x, i) => this.process(x, { ...params, path: [...params.path, "prefixItems", i] }));
            if (this.target === "draft-2020-12") {
              json.prefixItems = prefixItems;
            } else {
              json.items = prefixItems;
            }
            if (def.rest) {
              const rest = this.process(def.rest, {
                ...params,
                path: [...params.path, "items"]
              });
              if (this.target === "draft-2020-12") {
                json.items = rest;
              } else {
                json.additionalItems = rest;
              }
            }
            if (def.rest) {
              json.items = this.process(def.rest, {
                ...params,
                path: [...params.path, "items"]
              });
            }
            const { minimum, maximum } = schema._zod.bag;
            if (typeof minimum === "number")
              json.minItems = minimum;
            if (typeof maximum === "number")
              json.maxItems = maximum;
            break;
          }
          case "record": {
            const json = _json;
            json.type = "object";
            json.propertyNames = this.process(def.keyType, { ...params, path: [...params.path, "propertyNames"] });
            json.additionalProperties = this.process(def.valueType, {
              ...params,
              path: [...params.path, "additionalProperties"]
            });
            break;
          }
          case "map": {
            if (this.unrepresentable === "throw") {
              throw new Error("Map cannot be represented in JSON Schema");
            }
            break;
          }
          case "set": {
            if (this.unrepresentable === "throw") {
              throw new Error("Set cannot be represented in JSON Schema");
            }
            break;
          }
          case "enum": {
            const json = _json;
            const values = getEnumValues(def.entries);
            if (values.every((v) => typeof v === "number"))
              json.type = "number";
            if (values.every((v) => typeof v === "string"))
              json.type = "string";
            json.enum = values;
            break;
          }
          case "literal": {
            const json = _json;
            const vals = [];
            for (const val of def.values) {
              if (val === undefined) {
                if (this.unrepresentable === "throw") {
                  throw new Error("Literal `undefined` cannot be represented in JSON Schema");
                }
              } else if (typeof val === "bigint") {
                if (this.unrepresentable === "throw") {
                  throw new Error("BigInt literals cannot be represented in JSON Schema");
                } else {
                  vals.push(Number(val));
                }
              } else {
                vals.push(val);
              }
            }
            if (vals.length === 0) {} else if (vals.length === 1) {
              const val = vals[0];
              json.type = val === null ? "null" : typeof val;
              json.const = val;
            } else {
              if (vals.every((v) => typeof v === "number"))
                json.type = "number";
              if (vals.every((v) => typeof v === "string"))
                json.type = "string";
              if (vals.every((v) => typeof v === "boolean"))
                json.type = "string";
              if (vals.every((v) => v === null))
                json.type = "null";
              json.enum = vals;
            }
            break;
          }
          case "file": {
            const json = _json;
            const file = {
              type: "string",
              format: "binary",
              contentEncoding: "binary"
            };
            const { minimum, maximum, mime } = schema._zod.bag;
            if (minimum !== undefined)
              file.minLength = minimum;
            if (maximum !== undefined)
              file.maxLength = maximum;
            if (mime) {
              if (mime.length === 1) {
                file.contentMediaType = mime[0];
                Object.assign(json, file);
              } else {
                json.anyOf = mime.map((m) => {
                  const mFile = { ...file, contentMediaType: m };
                  return mFile;
                });
              }
            } else {
              Object.assign(json, file);
            }
            break;
          }
          case "transform": {
            if (this.unrepresentable === "throw") {
              throw new Error("Transforms cannot be represented in JSON Schema");
            }
            break;
          }
          case "nullable": {
            const inner = this.process(def.innerType, params);
            _json.anyOf = [inner, { type: "null" }];
            break;
          }
          case "nonoptional": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            break;
          }
          case "success": {
            const json = _json;
            json.type = "boolean";
            break;
          }
          case "default": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            _json.default = JSON.parse(JSON.stringify(def.defaultValue));
            break;
          }
          case "prefault": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            if (this.io === "input")
              _json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
            break;
          }
          case "catch": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            let catchValue;
            try {
              catchValue = def.catchValue(undefined);
            } catch {
              throw new Error("Dynamic catch values are not supported in JSON Schema");
            }
            _json.default = catchValue;
            break;
          }
          case "nan": {
            if (this.unrepresentable === "throw") {
              throw new Error("NaN cannot be represented in JSON Schema");
            }
            break;
          }
          case "template_literal": {
            const json = _json;
            const pattern = schema._zod.pattern;
            if (!pattern)
              throw new Error("Pattern not found in template literal");
            json.type = "string";
            json.pattern = pattern.source;
            break;
          }
          case "pipe": {
            const innerType = this.io === "input" ? def.in._zod.def.type === "transform" ? def.out : def.in : def.out;
            this.process(innerType, params);
            result.ref = innerType;
            break;
          }
          case "readonly": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            _json.readOnly = true;
            break;
          }
          case "promise": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            break;
          }
          case "optional": {
            this.process(def.innerType, params);
            result.ref = def.innerType;
            break;
          }
          case "lazy": {
            const innerType = schema._zod.innerType;
            this.process(innerType, params);
            result.ref = innerType;
            break;
          }
          case "custom": {
            if (this.unrepresentable === "throw") {
              throw new Error("Custom types cannot be represented in JSON Schema");
            }
            break;
          }
          default: {}
        }
      }
    }
    const meta = this.metadataRegistry.get(schema);
    if (meta)
      Object.assign(result.schema, meta);
    if (this.io === "input" && isTransforming(schema)) {
      delete result.schema.examples;
      delete result.schema.default;
    }
    if (this.io === "input" && result.schema._prefault)
      (_a = result.schema).default ?? (_a.default = result.schema._prefault);
    delete result.schema._prefault;
    const _result = this.seen.get(schema);
    return _result.schema;
  }
  emit(schema, _params) {
    const params = {
      cycles: _params?.cycles ?? "ref",
      reused: _params?.reused ?? "inline",
      external: _params?.external ?? undefined
    };
    const root = this.seen.get(schema);
    if (!root)
      throw new Error("Unprocessed schema. This is a bug in Zod.");
    const makeURI = (entry) => {
      const defsSegment = this.target === "draft-2020-12" ? "$defs" : "definitions";
      if (params.external) {
        const externalId = params.external.registry.get(entry[0])?.id;
        const uriGenerator = params.external.uri ?? ((id) => id);
        if (externalId) {
          return { ref: uriGenerator(externalId) };
        }
        const id = entry[1].defId ?? entry[1].schema.id ?? `schema${this.counter++}`;
        entry[1].defId = id;
        return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
      }
      if (entry[1] === root) {
        return { ref: "#" };
      }
      const uriPrefix = `#`;
      const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
      const defId = entry[1].schema.id ?? `__schema${this.counter++}`;
      return { defId, ref: defUriPrefix + defId };
    };
    const extractToDef = (entry) => {
      if (entry[1].schema.$ref) {
        return;
      }
      const seen = entry[1];
      const { ref, defId } = makeURI(entry);
      seen.def = { ...seen.schema };
      if (defId)
        seen.defId = defId;
      const schema = seen.schema;
      for (const key in schema) {
        delete schema[key];
      }
      schema.$ref = ref;
    };
    if (params.cycles === "throw") {
      for (const entry of this.seen.entries()) {
        const seen = entry[1];
        if (seen.cycle) {
          throw new Error("Cycle detected: " + `#/${seen.cycle?.join("/")}/<root>` + '\n\nSet the `cycles` parameter to `"ref"` to resolve cyclical schemas with defs.');
        }
      }
    }
    for (const entry of this.seen.entries()) {
      const seen = entry[1];
      if (schema === entry[0]) {
        extractToDef(entry);
        continue;
      }
      if (params.external) {
        const ext = params.external.registry.get(entry[0])?.id;
        if (schema !== entry[0] && ext) {
          extractToDef(entry);
          continue;
        }
      }
      const id = this.metadataRegistry.get(entry[0])?.id;
      if (id) {
        extractToDef(entry);
        continue;
      }
      if (seen.cycle) {
        extractToDef(entry);
        continue;
      }
      if (seen.count > 1) {
        if (params.reused === "ref") {
          extractToDef(entry);
          continue;
        }
      }
    }
    const flattenRef = (zodSchema, params) => {
      const seen = this.seen.get(zodSchema);
      const schema = seen.def ?? seen.schema;
      const _cached = { ...schema };
      if (seen.ref === null) {
        return;
      }
      const ref = seen.ref;
      seen.ref = null;
      if (ref) {
        flattenRef(ref, params);
        const refSchema = this.seen.get(ref).schema;
        if (refSchema.$ref && params.target === "draft-7") {
          schema.allOf = schema.allOf ?? [];
          schema.allOf.push(refSchema);
        } else {
          Object.assign(schema, refSchema);
          Object.assign(schema, _cached);
        }
      }
      if (!seen.isParent)
        this.override({
          zodSchema,
          jsonSchema: schema,
          path: seen.path ?? []
        });
    };
    for (const entry of [...this.seen.entries()].reverse()) {
      flattenRef(entry[0], { target: this.target });
    }
    const result = {};
    if (this.target === "draft-2020-12") {
      result.$schema = "https://json-schema.org/draft/2020-12/schema";
    } else if (this.target === "draft-7") {
      result.$schema = "http://json-schema.org/draft-07/schema#";
    } else {
      console.warn(`Invalid target: ${this.target}`);
    }
    if (params.external?.uri) {
      const id = params.external.registry.get(schema)?.id;
      if (!id)
        throw new Error("Schema is missing an `id` property");
      result.$id = params.external.uri(id);
    }
    Object.assign(result, root.def);
    const defs = params.external?.defs ?? {};
    for (const entry of this.seen.entries()) {
      const seen = entry[1];
      if (seen.def && seen.defId) {
        defs[seen.defId] = seen.def;
      }
    }
    if (params.external) {} else {
      if (Object.keys(defs).length > 0) {
        if (this.target === "draft-2020-12") {
          result.$defs = defs;
        } else {
          result.definitions = defs;
        }
      }
    }
    try {
      return JSON.parse(JSON.stringify(result));
    } catch (_err) {
      throw new Error("Error converting schema to JSON.");
    }
  }
}
function toJSONSchema(input, _params) {
  if (input instanceof $ZodRegistry) {
    const gen = new JSONSchemaGenerator(_params);
    const defs = {};
    for (const entry of input._idmap.entries()) {
      const [_, schema] = entry;
      gen.process(schema);
    }
    const schemas = {};
    const external = {
      registry: input,
      uri: _params?.uri,
      defs
    };
    for (const entry of input._idmap.entries()) {
      const [key, schema] = entry;
      schemas[key] = gen.emit(schema, {
        ..._params,
        external
      });
    }
    if (Object.keys(defs).length > 0) {
      const defsSegment = gen.target === "draft-2020-12" ? "$defs" : "definitions";
      schemas.__shared = {
        [defsSegment]: defs
      };
    }
    return { schemas };
  }
  const gen = new JSONSchemaGenerator(_params);
  gen.process(input);
  return gen.emit(input, _params);
}
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: new Set };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const schema = _schema;
  const def = schema._zod.def;
  switch (def.type) {
    case "string":
    case "number":
    case "bigint":
    case "boolean":
    case "date":
    case "symbol":
    case "undefined":
    case "null":
    case "any":
    case "unknown":
    case "never":
    case "void":
    case "literal":
    case "enum":
    case "nan":
    case "file":
    case "template_literal":
      return false;
    case "array": {
      return isTransforming(def.element, ctx);
    }
    case "object": {
      for (const key in def.shape) {
        if (isTransforming(def.shape[key], ctx))
          return true;
      }
      return false;
    }
    case "union": {
      for (const option of def.options) {
        if (isTransforming(option, ctx))
          return true;
      }
      return false;
    }
    case "intersection": {
      return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
    }
    case "tuple": {
      for (const item of def.items) {
        if (isTransforming(item, ctx))
          return true;
      }
      if (def.rest && isTransforming(def.rest, ctx))
        return true;
      return false;
    }
    case "record": {
      return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
    }
    case "map": {
      return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
    }
    case "set": {
      return isTransforming(def.valueType, ctx);
    }
    case "promise":
    case "optional":
    case "nonoptional":
    case "nullable":
    case "readonly":
      return isTransforming(def.innerType, ctx);
    case "lazy":
      return isTransforming(def.getter(), ctx);
    case "default": {
      return isTransforming(def.innerType, ctx);
    }
    case "prefault": {
      return isTransforming(def.innerType, ctx);
    }
    case "custom": {
      return false;
    }
    case "transform": {
      return true;
    }
    case "pipe": {
      return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
    }
    case "success": {
      return false;
    }
    case "catch": {
      return false;
    }
    default:
  }
  throw new Error(`Unknown schema type: ${def.type}`);
}
// node_modules/zod/v4/classic/iso.js
var ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
  $ZodISODateTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function datetime2(params) {
  return _isoDateTime(ZodISODateTime, params);
}
var ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
  $ZodISODate.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function date2(params) {
  return _isoDate(ZodISODate, params);
}
var ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
  $ZodISOTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function time2(params) {
  return _isoTime(ZodISOTime, params);
}
var ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
  $ZodISODuration.init(inst, def);
  ZodStringFormat.init(inst, def);
});
function duration2(params) {
  return _isoDuration(ZodISODuration, params);
}

// node_modules/zod/v4/classic/errors.js
var initializer2 = (inst, issues) => {
  $ZodError.init(inst, issues);
  inst.name = "ZodError";
  Object.defineProperties(inst, {
    format: {
      value: (mapper) => formatError(inst, mapper)
    },
    flatten: {
      value: (mapper) => flattenError(inst, mapper)
    },
    addIssue: {
      value: (issue) => inst.issues.push(issue)
    },
    addIssues: {
      value: (issues) => inst.issues.push(...issues)
    },
    isEmpty: {
      get() {
        return inst.issues.length === 0;
      }
    }
  });
};
var ZodError = $constructor("ZodError", initializer2);
var ZodRealError = $constructor("ZodError", initializer2, {
  Parent: Error
});

// node_modules/zod/v4/classic/parse.js
var parse2 = /* @__PURE__ */ _parse(ZodRealError);
var parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
var safeParse2 = /* @__PURE__ */ _safeParse(ZodRealError);
var safeParseAsync2 = /* @__PURE__ */ _safeParseAsync(ZodRealError);

// node_modules/zod/v4/classic/schemas.js
var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
  $ZodType.init(inst, def);
  inst.def = def;
  Object.defineProperty(inst, "_def", { value: def });
  inst.check = (...checks) => {
    return inst.clone({
      ...def,
      checks: [
        ...def.checks ?? [],
        ...checks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
      ]
    });
  };
  inst.clone = (def, params) => clone(inst, def, params);
  inst.brand = () => inst;
  inst.register = (reg, meta) => {
    reg.add(inst, meta);
    return inst;
  };
  inst.parse = (data, params) => parse2(inst, data, params, { callee: inst.parse });
  inst.safeParse = (data, params) => safeParse2(inst, data, params);
  inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
  inst.safeParseAsync = async (data, params) => safeParseAsync2(inst, data, params);
  inst.spa = inst.safeParseAsync;
  inst.refine = (check, params) => inst.check(refine(check, params));
  inst.superRefine = (refinement) => inst.check(superRefine(refinement));
  inst.overwrite = (fn) => inst.check(_overwrite(fn));
  inst.optional = () => optional(inst);
  inst.nullable = () => nullable(inst);
  inst.nullish = () => optional(nullable(inst));
  inst.nonoptional = (params) => nonoptional(inst, params);
  inst.array = () => array(inst);
  inst.or = (arg) => union([inst, arg]);
  inst.and = (arg) => intersection(inst, arg);
  inst.transform = (tx) => pipe(inst, transform(tx));
  inst.default = (def) => _default(inst, def);
  inst.prefault = (def) => prefault(inst, def);
  inst.catch = (params) => _catch(inst, params);
  inst.pipe = (target) => pipe(inst, target);
  inst.readonly = () => readonly(inst);
  inst.describe = (description) => {
    const cl = inst.clone();
    globalRegistry.add(cl, { description });
    return cl;
  };
  Object.defineProperty(inst, "description", {
    get() {
      return globalRegistry.get(inst)?.description;
    },
    configurable: true
  });
  inst.meta = (...args) => {
    if (args.length === 0) {
      return globalRegistry.get(inst);
    }
    const cl = inst.clone();
    globalRegistry.add(cl, args[0]);
    return cl;
  };
  inst.isOptional = () => inst.safeParse(undefined).success;
  inst.isNullable = () => inst.safeParse(null).success;
  return inst;
});
var _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  ZodType.init(inst, def);
  const bag = inst._zod.bag;
  inst.format = bag.format ?? null;
  inst.minLength = bag.minimum ?? null;
  inst.maxLength = bag.maximum ?? null;
  inst.regex = (...args) => inst.check(_regex(...args));
  inst.includes = (...args) => inst.check(_includes(...args));
  inst.startsWith = (...args) => inst.check(_startsWith(...args));
  inst.endsWith = (...args) => inst.check(_endsWith(...args));
  inst.min = (...args) => inst.check(_minLength(...args));
  inst.max = (...args) => inst.check(_maxLength(...args));
  inst.length = (...args) => inst.check(_length(...args));
  inst.nonempty = (...args) => inst.check(_minLength(1, ...args));
  inst.lowercase = (params) => inst.check(_lowercase(params));
  inst.uppercase = (params) => inst.check(_uppercase(params));
  inst.trim = () => inst.check(_trim());
  inst.normalize = (...args) => inst.check(_normalize(...args));
  inst.toLowerCase = () => inst.check(_toLowerCase());
  inst.toUpperCase = () => inst.check(_toUpperCase());
});
var ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  _ZodString.init(inst, def);
  inst.email = (params) => inst.check(_email(ZodEmail, params));
  inst.url = (params) => inst.check(_url(ZodURL, params));
  inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
  inst.emoji = (params) => inst.check(_emoji2(ZodEmoji, params));
  inst.guid = (params) => inst.check(_guid(ZodGUID, params));
  inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
  inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
  inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
  inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
  inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
  inst.guid = (params) => inst.check(_guid(ZodGUID, params));
  inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
  inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
  inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
  inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
  inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
  inst.xid = (params) => inst.check(_xid(ZodXID, params));
  inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
  inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
  inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
  inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
  inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
  inst.e164 = (params) => inst.check(_e164(ZodE164, params));
  inst.datetime = (params) => inst.check(datetime2(params));
  inst.date = (params) => inst.check(date2(params));
  inst.time = (params) => inst.check(time2(params));
  inst.duration = (params) => inst.check(duration2(params));
});
function string2(params) {
  return _string(ZodString, params);
}
var ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  _ZodString.init(inst, def);
});
var ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
  $ZodEmail.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
  $ZodGUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
  $ZodUUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
  $ZodURL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
  $ZodEmoji.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
  $ZodNanoID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
  $ZodCUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
  $ZodCUID2.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
  $ZodULID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
  $ZodXID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
  $ZodKSUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
  $ZodIPv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
  $ZodIPv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
  $ZodCIDRv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
  $ZodCIDRv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
  $ZodBase64.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
  $ZodBase64URL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
  $ZodE164.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
  $ZodJWT.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
  $ZodNumber.init(inst, def);
  ZodType.init(inst, def);
  inst.gt = (value, params) => inst.check(_gt(value, params));
  inst.gte = (value, params) => inst.check(_gte(value, params));
  inst.min = (value, params) => inst.check(_gte(value, params));
  inst.lt = (value, params) => inst.check(_lt(value, params));
  inst.lte = (value, params) => inst.check(_lte(value, params));
  inst.max = (value, params) => inst.check(_lte(value, params));
  inst.int = (params) => inst.check(int(params));
  inst.safe = (params) => inst.check(int(params));
  inst.positive = (params) => inst.check(_gt(0, params));
  inst.nonnegative = (params) => inst.check(_gte(0, params));
  inst.negative = (params) => inst.check(_lt(0, params));
  inst.nonpositive = (params) => inst.check(_lte(0, params));
  inst.multipleOf = (value, params) => inst.check(_multipleOf(value, params));
  inst.step = (value, params) => inst.check(_multipleOf(value, params));
  inst.finite = () => inst;
  const bag = inst._zod.bag;
  inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
  inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
  inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
  inst.isFinite = true;
  inst.format = bag.format ?? null;
});
function number2(params) {
  return _number(ZodNumber, params);
}
var ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
  $ZodNumberFormat.init(inst, def);
  ZodNumber.init(inst, def);
});
function int(params) {
  return _int(ZodNumberFormat, params);
}
var ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
  $ZodBoolean.init(inst, def);
  ZodType.init(inst, def);
});
function boolean2(params) {
  return _boolean(ZodBoolean, params);
}
var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
  $ZodUnknown.init(inst, def);
  ZodType.init(inst, def);
});
function unknown() {
  return _unknown(ZodUnknown);
}
var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
  $ZodNever.init(inst, def);
  ZodType.init(inst, def);
});
function never(params) {
  return _never(ZodNever, params);
}
var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
  $ZodArray.init(inst, def);
  ZodType.init(inst, def);
  inst.element = def.element;
  inst.min = (minLength, params) => inst.check(_minLength(minLength, params));
  inst.nonempty = (params) => inst.check(_minLength(1, params));
  inst.max = (maxLength, params) => inst.check(_maxLength(maxLength, params));
  inst.length = (len, params) => inst.check(_length(len, params));
  inst.unwrap = () => inst.element;
});
function array(element, params) {
  return _array(ZodArray, element, params);
}
var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
  $ZodObject.init(inst, def);
  ZodType.init(inst, def);
  defineLazy(inst, "shape", () => def.shape);
  inst.keyof = () => _enum(Object.keys(inst._zod.def.shape));
  inst.catchall = (catchall) => inst.clone({ ...inst._zod.def, catchall });
  inst.passthrough = () => inst.clone({ ...inst._zod.def, catchall: unknown() });
  inst.loose = () => inst.clone({ ...inst._zod.def, catchall: unknown() });
  inst.strict = () => inst.clone({ ...inst._zod.def, catchall: never() });
  inst.strip = () => inst.clone({ ...inst._zod.def, catchall: undefined });
  inst.extend = (incoming) => {
    return extend(inst, incoming);
  };
  inst.merge = (other) => merge(inst, other);
  inst.pick = (mask) => pick(inst, mask);
  inst.omit = (mask) => omit(inst, mask);
  inst.partial = (...args) => partial(ZodOptional, inst, args[0]);
  inst.required = (...args) => required(ZodNonOptional, inst, args[0]);
});
function object(shape, params) {
  const def = {
    type: "object",
    get shape() {
      assignProp(this, "shape", { ...shape });
      return this.shape;
    },
    ...normalizeParams(params)
  };
  return new ZodObject(def);
}
var ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
  $ZodUnion.init(inst, def);
  ZodType.init(inst, def);
  inst.options = def.options;
});
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...normalizeParams(params)
  });
}
var ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
  $ZodIntersection.init(inst, def);
  ZodType.init(inst, def);
});
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
  $ZodEnum.init(inst, def);
  ZodType.init(inst, def);
  inst.enum = def.entries;
  inst.options = Object.values(def.entries);
  const keys = new Set(Object.keys(def.entries));
  inst.extract = (values, params) => {
    const newEntries = {};
    for (const value of values) {
      if (keys.has(value)) {
        newEntries[value] = def.entries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...normalizeParams(params),
      entries: newEntries
    });
  };
  inst.exclude = (values, params) => {
    const newEntries = { ...def.entries };
    for (const value of values) {
      if (keys.has(value)) {
        delete newEntries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...normalizeParams(params),
      entries: newEntries
    });
  };
});
function _enum(values, params) {
  const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new ZodEnum({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
  $ZodTransform.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = inst);
        _issue.continue ?? (_issue.continue = true);
        payload.issues.push(issue(_issue));
      }
    };
    const output = def.transform(payload.value, payload);
    if (output instanceof Promise) {
      return output.then((output) => {
        payload.value = output;
        return payload;
      });
    }
    payload.value = output;
    return payload;
  };
});
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  ZodType.init(inst, def);
  inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
var ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
  $ZodNullable.init(inst, def);
  ZodType.init(inst, def);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
var ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
  $ZodDefault.init(inst, def);
  ZodType.init(inst, def);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : defaultValue;
    }
  });
}
var ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
  $ZodPrefault.init(inst, def);
  ZodType.init(inst, def);
  inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : defaultValue;
    }
  });
}
var ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
  $ZodNonOptional.init(inst, def);
  ZodType.init(inst, def);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...normalizeParams(params)
  });
}
var ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
  $ZodCatch.init(inst, def);
  ZodType.init(inst, def);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
  });
}
var ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
  $ZodPipe.init(inst, def);
  ZodType.init(inst, def);
  inst.in = def.in;
  inst.out = def.out;
});
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
  });
}
var ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
  $ZodReadonly.init(inst, def);
  ZodType.init(inst, def);
});
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
  $ZodCustom.init(inst, def);
  ZodType.init(inst, def);
});
function check(fn) {
  const ch = new $ZodCheck({
    check: "custom"
  });
  ch._zod.check = fn;
  return ch;
}
function refine(fn, _params = {}) {
  return _refine(ZodCustom, fn, _params);
}
function superRefine(fn) {
  const ch = check((payload) => {
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, ch._zod.def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  });
  return ch;
}
// node_modules/zod/v4/classic/external.js
config(en_default());
// engine/src/state.ts
function createDefaultState() {
  return {
    subject: "",
    subjectAction: "",
    environment: "",
    mood: "",
    lightingId: "",
    shotId: "",
    cameraId: "",
    lensId: "",
    fStop: null,
    filmId: "",
    filters: [],
    movieLookId: "",
    photographerId: "",
    animeGenreId: "",
    animeShowStyleId: "",
    westernAnimationStyleId: "",
    noText: false,
    showNewAnglePrompt: false,
    candidShot: false,
    aspectRatio: "16:9",
    mode: "photo",
    references: []
  };
}
var BasePresetSchema = object({
  id: string2().min(1),
  label: string2().min(1),
  promptValue: string2(),
  category: string2().min(1)
}).strict();
var AnimePresetSchema = BasePresetSchema.extend({
  pre: string2(),
  post: string2()
}).strict();
var PresetLibrarySchema = object({
  version: string2(),
  shots: array(BasePresetSchema),
  directions: array(BasePresetSchema),
  lighting: array(BasePresetSchema),
  cameras: array(BasePresetSchema),
  focalLengths: array(BasePresetSchema),
  lenses: array(BasePresetSchema),
  filmStocks: array(BasePresetSchema),
  genres: array(BasePresetSchema),
  photographers: array(BasePresetSchema),
  movieLooks: array(BasePresetSchema),
  filters: array(BasePresetSchema),
  aspectRatios: array(BasePresetSchema),
  animeGenres: array(AnimePresetSchema),
  animeShowStyles: array(AnimePresetSchema),
  westernAnimationStyles: array(AnimePresetSchema)
}).strict();
function validateLibrary(data) {
  const library = PresetLibrarySchema.parse(data);
  for (const [category, entries] of Object.entries(library)) {
    if (!Array.isArray(entries))
      continue;
    const seen = new Set;
    for (const entry of entries) {
      const key = entry.id.toLowerCase();
      if (seen.has(key))
        throw new Error(`Duplicate ${category} preset ID: ${entry.id}`);
      if (entry.category !== category)
        throw new Error(`Preset ${entry.id} category must be ${category}`);
      seen.add(key);
    }
  }
  return library;
}

// engine/library/cinematic-movements.ts
var CINEMATIC_CAMERA_MOVEMENTS = [
  {
    id: "static-shot",
    label: "Static shot",
    category: "Pan/Tilt",
    promptKeyword: "locked-off static shot",
    fullPromptRecipe: "locked-off static shot. Movement: hold one fixed camera position for the full clip. Speed: still and steady. Framing: keep the same angle, height, lens distance and composition. End: finish with the same framing and camera position.",
    movement: "hold one fixed camera position for the full clip",
    speed: "still and steady",
    framing: "keep the same angle, height, lens distance and composition",
    end: "finish with the same framing and camera position",
    aliases: ["Static Lock-Off", "lock-off", "tripod shot"]
  },
  {
    id: "pan-right",
    label: "Pan right",
    category: "Pan/Tilt",
    promptKeyword: "camera pans right",
    fullPromptRecipe: "pan right. Movement: rotate the camera horizontally from left to right from one fixed point. Speed: smooth constant rotation. Framing: keep the horizon level while new space enters from the right side of the frame. End: settle on a clear final composition.",
    movement: "rotate the camera horizontally from left to right from one fixed point",
    speed: "smooth constant rotation",
    framing: "keep the horizon level while new space enters from the right side of the frame",
    end: "settle on a clear final composition",
    aliases: ["Pan", "pan", "panning right"]
  },
  {
    id: "pan-left",
    label: "Pan left",
    category: "Pan/Tilt",
    promptKeyword: "camera pans left",
    fullPromptRecipe: "pan left. Movement: rotate the camera horizontally from right to left from one fixed point. Speed: smooth constant rotation. Framing: keep the horizon level while new space enters from the left side of the frame. End: settle on a clear final composition.",
    movement: "rotate the camera horizontally from right to left from one fixed point",
    speed: "smooth constant rotation",
    framing: "keep the horizon level while new space enters from the left side of the frame",
    end: "settle on a clear final composition",
    aliases: ["panning left"]
  },
  {
    id: "whip-pan-right",
    label: "Whip pan right",
    category: "Pan/Tilt",
    promptKeyword: "whip pan right transition",
    fullPromptRecipe: "whip pan right. Movement: rotate rapidly from the starting direction toward a new target on the right. Speed: fast snap with brief motion blur during the rotation. Framing: begin on one readable composition and land on a second readable target. End: settle into a sharp final frame.",
    movement: "rotate rapidly from the starting direction toward a new target on the right",
    speed: "fast snap with brief motion blur during the rotation",
    framing: "begin on one readable composition and land on a second readable target",
    end: "settle into a sharp final frame",
    aliases: ["Whip Pan", "whip pan", "swish pan right"]
  },
  {
    id: "whip-pan-left",
    label: "Whip pan left",
    category: "Pan/Tilt",
    promptKeyword: "whip pan left transition",
    fullPromptRecipe: "whip pan left. Movement: rotate rapidly from the starting direction toward a new target on the left. Speed: fast snap with brief motion blur during the rotation. Framing: begin on one readable composition and land on a second readable target. End: settle into a sharp final frame.",
    movement: "rotate rapidly from the starting direction toward a new target on the left",
    speed: "fast snap with brief motion blur during the rotation",
    framing: "begin on one readable composition and land on a second readable target",
    end: "settle into a sharp final frame",
    aliases: ["swish pan left"]
  },
  {
    id: "tilt-up",
    label: "Tilt up",
    category: "Pan/Tilt",
    promptKeyword: "camera tilts up",
    fullPromptRecipe: "tilt up. Movement: rotate the camera upward from one fixed point. Speed: smooth constant tilt. Framing: keep the vertical subject or architecture centered as the frame travels upward. End: land on the upper target.",
    movement: "rotate the camera upward from one fixed point",
    speed: "smooth constant tilt",
    framing: "keep the vertical subject or architecture centered as the frame travels upward",
    end: "land on the upper target",
    aliases: ["Tilt Up", "tilting up"]
  },
  {
    id: "tilt-down",
    label: "Tilt down",
    category: "Pan/Tilt",
    promptKeyword: "camera tilts down",
    fullPromptRecipe: "tilt down. Movement: rotate the camera downward from one fixed point. Speed: smooth constant tilt. Framing: keep the vertical subject or architecture centered as the frame travels downward. End: land on the lower target.",
    movement: "rotate the camera downward from one fixed point",
    speed: "smooth constant tilt",
    framing: "keep the vertical subject or architecture centered as the frame travels downward",
    end: "land on the lower target",
    aliases: ["Tilt Down", "tilting down"]
  },
  {
    id: "slow-zoom-in",
    label: "Slow zoom in",
    category: "Zoom/Lens",
    promptKeyword: "slow optical zoom in",
    fullPromptRecipe: "slow zoom in. Movement: slowly increase lens focal length toward a tighter frame. Speed: gradual and even. Framing: keep the main visual target readable as it becomes larger in frame. End: finish on a stable tighter composition.",
    movement: "slowly increase lens focal length toward a tighter frame",
    speed: "gradual and even",
    framing: "keep the main visual target readable as it becomes larger in frame",
    end: "finish on a stable tighter composition",
    aliases: ["Zoom", "zoom in", "slow zoom"]
  },
  {
    id: "slow-zoom-out",
    label: "Slow zoom out",
    category: "Zoom/Lens",
    promptKeyword: "slow optical zoom out",
    fullPromptRecipe: "slow zoom out. Movement: slowly decrease lens focal length toward a wider frame. Speed: gradual and even. Framing: keep the main visual target readable as more surrounding space appears. End: finish on a stable wider composition.",
    movement: "slowly decrease lens focal length toward a wider frame",
    speed: "gradual and even",
    framing: "keep the main visual target readable as more surrounding space appears",
    end: "finish on a stable wider composition",
    aliases: ["zoom out", "slow zoom out"]
  },
  {
    id: "fast-zoom-in",
    label: "Fast zoom in",
    category: "Zoom/Lens",
    promptKeyword: "fast rapid zoom in",
    fullPromptRecipe: "fast zoom in. Movement: quickly increase lens focal length toward the main visual target. Speed: quick decisive zoom. Framing: keep the target centered or clearly readable during the scale change. End: finish on a stable tighter composition.",
    movement: "quickly increase lens focal length toward the main visual target",
    speed: "quick decisive zoom",
    framing: "keep the target centered or clearly readable during the scale change",
    end: "finish on a stable tighter composition",
    aliases: ["rapid zoom in", "quick zoom"]
  },
  {
    id: "fast-zoom-out",
    label: "Fast zoom out",
    category: "Zoom/Lens",
    promptKeyword: "fast rapid zoom out",
    fullPromptRecipe: "fast zoom out. Movement: quickly decrease lens focal length away from the main visual target. Speed: quick decisive zoom. Framing: keep the target readable as the surrounding space appears. End: finish on a stable wider composition.",
    movement: "quickly decrease lens focal length away from the main visual target",
    speed: "quick decisive zoom",
    framing: "keep the target readable as the surrounding space appears",
    end: "finish on a stable wider composition",
    aliases: ["rapid zoom out"]
  },
  {
    id: "crash-zoom-in",
    label: "Crash zoom in",
    category: "Zoom/Lens",
    promptKeyword: "crash zoom in",
    fullPromptRecipe: "crash zoom in. Movement: snap the lens rapidly toward the main visual target. Speed: very fast and punchy. Framing: keep the target readable through the sudden scale change. End: land on a bold tighter composition.",
    movement: "snap the lens rapidly toward the main visual target",
    speed: "very fast and punchy",
    framing: "keep the target readable through the sudden scale change",
    end: "land on a bold tighter composition",
    aliases: ["Crash Zoom", "crash zoom", "snap zoom"]
  },
  {
    id: "crash-zoom-out",
    label: "Crash zoom out",
    category: "Zoom/Lens",
    promptKeyword: "crash zoom out",
    fullPromptRecipe: "crash zoom out. Movement: snap the lens rapidly away from the main visual target. Speed: very fast and punchy. Framing: keep the target readable as the surrounding space appears. End: land on a bold wider composition.",
    movement: "snap the lens rapidly away from the main visual target",
    speed: "very fast and punchy",
    framing: "keep the target readable as the surrounding space appears",
    end: "land on a bold wider composition",
    aliases: ["snap zoom out"]
  },
  {
    id: "dolly-zoom",
    label: "Dolly zoom",
    category: "Zoom/Lens",
    promptKeyword: "dolly zoom (Hitchcock style)",
    fullPromptRecipe: "dolly zoom (Hitchcock vertigo effect). Movement: dolly camera forward while zooming out simultaneously (or reverse) keeping subject same size while background perspective warps. Speed: smooth cinematic distortion. Framing: subject locked in place while background depth expands.",
    movement: "dolly camera while zooming in opposite direction",
    speed: "smooth cinematic distortion",
    framing: "subject locked in place while background depth expands",
    end: "finish with warped background depth",
    aliases: ["Dolly Zoom", "vertigo effect", "zolly", "hitchcock zoom"]
  },
  {
    id: "pull-focus",
    label: "Pull focus",
    category: "Zoom/Lens",
    promptKeyword: "pull focus",
    fullPromptRecipe: "pull focus rack focus. Movement: shift lens focus plane from foreground to background (or reverse). Speed: smooth optical shift. Framing: change attention between layers.",
    movement: "shift lens focus plane between foreground and background",
    speed: "smooth optical shift",
    framing: "change visual attention between distinct depth layers",
    end: "settle sharply on secondary focal target",
    aliases: ["Pull Focus", "rack focus", "focus pull"]
  },
  {
    id: "dolly-in",
    label: "Dolly in",
    category: "Dolly/Track",
    promptKeyword: "camera dolly in",
    fullPromptRecipe: "dolly in. Movement: move the camera physically forward in a straight line toward the main subject. Speed: smooth controlled push. Framing: keep camera height, lens direction and subject position consistent while distance closes. End: finish in a tighter composition.",
    movement: "move the camera physically forward in a straight line toward the main subject",
    speed: "smooth controlled push",
    framing: "keep camera height, lens direction and subject position consistent while distance closes",
    end: "finish in a tighter composition",
    aliases: ["Dolly in", "push in", "dolly forward"]
  },
  {
    id: "dolly-out",
    label: "Dolly out",
    category: "Dolly/Track",
    promptKeyword: "camera dolly out",
    fullPromptRecipe: "dolly out. Movement: move the camera physically backward in a straight line away from the main subject. Speed: smooth controlled retreat. Framing: keep lens direction and camera height consistent while more environment enters frame. End: finish in a wider composition.",
    movement: "move the camera physically backward in a straight line away from the main subject",
    speed: "smooth controlled retreat",
    framing: "keep lens direction and camera height consistent while more environment enters frame",
    end: "finish in a wider composition",
    aliases: ["Dolly out", "pull out", "dolly backward"]
  },
  {
    id: "truck-right",
    label: "Truck right",
    category: "Physical Moves",
    promptKeyword: "camera trucks right",
    fullPromptRecipe: "truck right. Movement: move the camera physically to the right on a straight horizontal path. Speed: smooth constant lateral travel. Framing: keep the lens facing the same direction while the scene slides across frame. End: finish on a clean lateral composition.",
    movement: "move the camera physically to the right on a straight horizontal path",
    speed: "smooth constant lateral travel",
    framing: "keep the lens facing the same direction while the scene slides across frame",
    end: "finish on a clean lateral composition",
    aliases: ["Truck", "trucking right", "lateral right"]
  },
  {
    id: "truck-left",
    label: "Truck left",
    category: "Physical Moves",
    promptKeyword: "camera trucks left",
    fullPromptRecipe: "truck left. Movement: move the camera physically to the left on a straight horizontal path. Speed: smooth constant lateral travel. Framing: keep the lens facing the same direction while the scene slides across frame. End: finish on a clean lateral composition.",
    movement: "move the camera physically to the left on a straight horizontal path",
    speed: "smooth constant lateral travel",
    framing: "keep the lens facing the same direction while the scene slides across frame",
    end: "finish on a clean lateral composition",
    aliases: ["trucking left", "lateral left"]
  },
  {
    id: "pedestal-up",
    label: "Pedestal up",
    category: "Physical Moves",
    promptKeyword: "camera pedestals up",
    fullPromptRecipe: "pedestal up. Movement: move the entire camera vertically upward in a straight line. Speed: smooth constant lift. Framing: keep the lens level and pointed in the same direction during the vertical move. End: finish with the higher framing clearly readable.",
    movement: "move the entire camera vertically upward in a straight line",
    speed: "smooth constant lift",
    framing: "keep the lens level and pointed in the same direction during the vertical move",
    end: "finish with the higher framing clearly readable",
    aliases: ["Pedestal Up", "pedestal up", "camera elevate"]
  },
  {
    id: "pedestal-down",
    label: "Pedestal down",
    category: "Physical Moves",
    promptKeyword: "camera pedestals down",
    fullPromptRecipe: "pedestal down. Movement: move the entire camera vertically downward in a straight line. Speed: smooth constant descent. Framing: keep the lens level and pointed in the same direction during the vertical move. End: finish with the lower framing clearly readable.",
    movement: "move the entire camera vertically downward in a straight line",
    speed: "smooth constant descent",
    framing: "keep the lens level and pointed in the same direction during the vertical move",
    end: "finish with the lower framing clearly readable",
    aliases: ["Pedestal Down", "pedestal down", "camera lower"]
  },
  {
    id: "slider-right",
    label: "Slider right",
    category: "Physical Moves",
    promptKeyword: "camera slider right subtle parallax",
    fullPromptRecipe: "slider right. Movement: slide the camera a small distance to the right. Speed: slow controlled constant motion. Framing: keep foreground, subject and background layers readable as parallax shifts. End: finish on a refined composition with the new right-side angle visible.",
    movement: "slide the camera a small distance to the right",
    speed: "slow controlled constant motion",
    framing: "keep foreground, subject and background layers readable as parallax shifts",
    end: "finish on a refined composition with the new right-side angle visible",
    aliases: ["slider right", "micro slider"]
  },
  {
    id: "slider-left",
    label: "Slider left",
    category: "Physical Moves",
    promptKeyword: "camera slider left subtle parallax",
    fullPromptRecipe: "slider left. Movement: slide the camera a small distance to the left. Speed: slow controlled constant motion. Framing: keep foreground, subject and background layers readable as parallax shifts. End: finish on a refined composition with the new left-side angle visible.",
    movement: "slide the camera a small distance to the left",
    speed: "slow controlled constant motion",
    framing: "keep foreground, subject and background layers readable as parallax shifts",
    end: "finish on a refined composition with the new left-side angle visible",
    aliases: ["slider left"]
  },
  {
    id: "push-past",
    label: "Push past / pass-by shot",
    category: "Physical Moves",
    promptKeyword: "push past foreground object into the scene",
    fullPromptRecipe: "push past. Movement: move forward past a visible foreground object, edge or opening. Speed: smooth forward glide. Framing: let the foreground pass close to the lens while the space beyond becomes clearer. End: arrive inside or beyond the foreground layer.",
    movement: "move forward past a visible foreground object, edge or opening",
    speed: "smooth forward glide",
    framing: "let the foreground pass close to the lens while the space beyond becomes clearer",
    end: "arrive inside or beyond the foreground layer",
    aliases: ["push past", "pass by shot", "foreground reveal glide"]
  },
  {
    id: "arc-right",
    label: "Arc right",
    category: "Physical Moves",
    promptKeyword: "arc shot around subject to the right",
    fullPromptRecipe: "arc right. Movement: move on a shallow curved path around the main subject toward the right side. Speed: smooth measured curve. Framing: keep distance, height and subject readability consistent while the angle changes. End: finish from a new right-side angle.",
    movement: "move on a shallow curved path around the main subject toward the right side",
    speed: "smooth measured curve",
    framing: "keep distance, height and subject readability consistent while the angle changes",
    end: "finish from a new right-side angle",
    aliases: ["Arc Shot", "arc shot right", "curved track right"]
  },
  {
    id: "arc-left",
    label: "Arc left",
    category: "Physical Moves",
    promptKeyword: "arc shot around subject to the left",
    fullPromptRecipe: "arc left. Movement: move on a shallow curved path around the main subject toward the left side. Speed: smooth measured curve. Framing: keep distance, height and subject readability consistent while the angle changes. End: finish from a new left-side angle.",
    movement: "move on a shallow curved path around the main subject toward the left side",
    speed: "smooth measured curve",
    framing: "keep distance, height and subject readability consistent while the angle changes",
    end: "finish from a new left-side angle",
    aliases: ["arc shot left", "curved track left"]
  },
  {
    id: "orbit-clockwise",
    label: "Orbit clockwise",
    category: "Physical Moves",
    promptKeyword: "clockwise 360 orbit around subject",
    fullPromptRecipe: "clockwise orbit. Movement: circle clockwise around the main subject at a consistent radius. Speed: smooth controlled orbit. Framing: keep the subject centered while the background rotates around them. End: complete the intended arc or full circle with stable framing.",
    movement: "circle clockwise around the main subject at a consistent radius",
    speed: "smooth controlled orbit",
    framing: "keep the subject centered while the background rotates around them",
    end: "complete the intended arc or full circle with stable framing",
    aliases: ["Orbit", "orbit", "360 orbit", "orbit right"]
  },
  {
    id: "orbit-counterclockwise",
    label: "Orbit counterclockwise",
    category: "Physical Moves",
    promptKeyword: "counterclockwise 360 orbit around subject",
    fullPromptRecipe: "counterclockwise orbit. Movement: circle counterclockwise around the main subject at a consistent radius. Speed: smooth controlled orbit. Framing: keep the subject centered while the background rotates around them. End: complete the intended arc or full circle with stable framing.",
    movement: "circle counterclockwise around the main subject at a consistent radius",
    speed: "smooth controlled orbit",
    framing: "keep the subject centered while the background rotates around them",
    end: "complete the intended arc or full circle with stable framing",
    aliases: ["orbit counterclockwise", "orbit left"]
  },
  {
    id: "tracking-shot",
    label: "Tracking shot",
    category: "Dolly/Track",
    promptKeyword: "camera tracking subject left right",
    fullPromptRecipe: "tracking shot. Movement: move through the scene with the main subject. Speed: match the subject's pace. Framing: keep the subject consistently readable while the environment moves around them. End: maintain a clear moving composition.",
    movement: "move through the scene with the main subject",
    speed: "match the subject's pace",
    framing: "keep the subject consistently readable while the environment moves around them",
    end: "maintain a clear moving composition",
    aliases: ["Tracking", "tracking", "side track"]
  },
  {
    id: "follow-shot",
    label: "Follow shot / over-the-shoulder",
    category: "Dolly/Track",
    promptKeyword: "tracking shot following the subject from behind over the shoulder",
    fullPromptRecipe: "follow shot from behind. Movement: move behind the subject along their route at shoulder height. Speed: match the subject's pace. Framing: keep the back, shoulder or head as the foreground guide while the route ahead stays readable. End: continue following with the subject leading the frame.",
    movement: "move behind the subject along their route at shoulder height",
    speed: "match the subject's pace",
    framing: "keep the back, shoulder or head as the foreground guide while the route ahead stays readable",
    end: "continue following with the subject leading the frame",
    aliases: ["Follow", "follow shot", "over the shoulder follow", "third person follow"]
  },
  {
    id: "reverse-tracking",
    label: "Reverse tracking / walk-and-talk",
    category: "Dolly/Track",
    promptKeyword: "reverse tracking shot walking backward in front of subject",
    fullPromptRecipe: "reverse tracking shot. Movement: move backward in front of the walking subject. Speed: match the subject's forward pace. Framing: keep front-facing face and body framing stable as the background moves behind them. End: hold a clear front-facing moving composition.",
    movement: "move backward in front of the walking subject",
    speed: "match the subject's forward pace",
    framing: "keep front-facing face and body framing stable as the background moves behind them",
    end: "hold a clear front-facing moving composition",
    aliases: ["Reverse Shot", "walk and talk", "lead tracking shot", "backward track"]
  },
  {
    id: "side-tracking",
    label: "Side tracking",
    category: "Dolly/Track",
    promptKeyword: "side profile tracking shot parallel with subject",
    fullPromptRecipe: "side tracking shot. Movement: move parallel beside the subject along their direction of travel. Speed: match the subject's motion. Framing: keep the subject in side profile or three-quarter profile at a stable distance. End: continue the parallel movement with clear horizontal motion.",
    movement: "move parallel beside the subject along their direction of travel",
    speed: "match the subject's motion",
    framing: "keep the subject in side profile or three-quarter profile at a stable distance",
    end: "continue the parallel movement with clear horizontal motion",
    aliases: ["parallel tracking", "profile track"]
  },
  {
    id: "low-tracking",
    label: "Low tracking",
    category: "Dolly/Track",
    promptKeyword: "low angle ground level tracking shot",
    fullPromptRecipe: "low tracking shot. Movement: move at ground or below-waist height alongside the subject's movement path. Speed: match the subject, footsteps or wheels. Framing: keep the low detail readable while the ground plane moves through frame. End: finish with the low perspective clearly maintained.",
    movement: "move at ground or below-waist height alongside the subject's movement path",
    speed: "match the subject, footsteps or wheels",
    framing: "keep the low detail readable while the ground plane moves through frame",
    end: "finish with the low perspective clearly maintained",
    aliases: ["ground tracking", "footstep track", "low angle track"]
  },
  {
    id: "vehicle-tracking",
    label: "Vehicle tracking",
    category: "Dolly/Track",
    promptKeyword: "high speed vehicle tracking shot matching pace",
    fullPromptRecipe: "vehicle tracking shot. Movement: move with the vehicle along its route. Speed: match the vehicle's pace. Framing: keep the vehicle stable in frame while the road or environment moves past. End: maintain a clear moving vehicle composition.",
    movement: "move with the vehicle along its route",
    speed: "match the vehicle's pace",
    framing: "keep the vehicle stable in frame while the road or environment moves past",
    end: "maintain a clear moving vehicle composition",
    aliases: ["car tracking", "wheel tracking", "speed tracking"]
  },
  {
    id: "chase-shot",
    label: "Chase shot",
    category: "Dolly/Track",
    promptKeyword: "fast dynamic chase camera tracking subject in action",
    fullPromptRecipe: "chase shot. Movement: follow a moving subject quickly along the action route. Speed: fast, reactive and physically close. Framing: keep the subject visible while allowing energetic reframing. End: stay connected to the subject in motion.",
    movement: "follow a moving subject quickly along the action route",
    speed: "fast, reactive and physically close",
    framing: "keep the subject visible while allowing energetic reframing",
    end: "stay connected to the subject in motion",
    aliases: ["action chase", "pursuit cam", "tailing shot"]
  },
  {
    id: "handheld-shot",
    label: "Handheld shot",
    category: "Human Camera",
    promptKeyword: "handheld natural camera shake",
    fullPromptRecipe: "handheld shot. Movement: hold the camera at human operator height with natural body movement. Speed: responsive and organic. Framing: keep the subject readable while the frame has subtle sway and micro-adjustments. End: finish with a natural handheld composition.",
    movement: "hold the camera at human operator height with natural body movement",
    speed: "responsive and organic",
    framing: "keep the subject readable while the frame has subtle sway and micro-adjustments",
    end: "finish with a natural handheld composition",
    aliases: ["Handheld", "shaky cam", "documentary camera", "cinema verite"]
  },
  {
    id: "snorricam",
    label: "Body-mounted camera / Snorricam",
    category: "Human Camera",
    promptKeyword: "body-mounted Snorricam locked to subject torso",
    fullPromptRecipe: "body-mounted Snorricam. Movement: keep the camera fixed relative to the subject's torso or face while the subject moves. Speed: match the subject's body motion. Framing: keep the subject close, centered and facing the camera as the background moves around them. End: finish with the subject still locked in frame.",
    movement: "keep the camera fixed relative to the subject's torso or face while the subject moves",
    speed: "match the subject's body motion",
    framing: "keep the subject close, centered and facing the camera as the background moves around them",
    end: "finish with the subject still locked in frame",
    aliases: ["Snorricam", "body mount camera", "chest mount camera", "face locked camera"]
  },
  {
    id: "crane-up",
    label: "Crane up",
    category: "Drone/Crane",
    promptKeyword: "camera crane jibs up",
    fullPromptRecipe: "crane up. Movement: travel smoothly upward through open space. Speed: slow controlled vertical lift. Framing: keep the subject or location readable as the camera rises. End: finish with the higher scale clearly visible.",
    movement: "travel smoothly upward through open space",
    speed: "slow controlled vertical lift",
    framing: "keep the subject or location readable as the camera rises",
    end: "finish with the higher scale clearly visible",
    aliases: ["Camera Jib up", "jib up", "boom up"]
  },
  {
    id: "crane-down",
    label: "Crane down",
    category: "Drone/Crane",
    promptKeyword: "camera crane jibs down",
    fullPromptRecipe: "crane down. Movement: travel smoothly downward through open space. Speed: slow controlled vertical descent. Framing: keep the subject or location readable as the camera descends. End: finish with the lower subject or destination clearly visible.",
    movement: "travel smoothly downward through open space",
    speed: "slow controlled vertical descent",
    framing: "keep the subject or location readable as the camera descends",
    end: "finish with the lower subject or destination clearly visible",
    aliases: ["Camera Jib down", "jib down", "boom down"]
  },
  {
    id: "drone-push-in",
    label: "Drone push in",
    category: "Drone/Crane",
    promptKeyword: "drone aerial push in forward glide",
    fullPromptRecipe: "drone push in. Movement: fly smoothly forward through open space toward the subject or destination. Speed: controlled aerial glide. Framing: keep the route and destination readable as the camera approaches. End: arrive at a closer aerial composition.",
    movement: "fly smoothly forward through open space toward the subject or destination",
    speed: "controlled aerial glide",
    framing: "keep the route and destination readable as the camera approaches",
    end: "arrive at a closer aerial composition",
    aliases: ["aerial push in", "drone forward"]
  },
  {
    id: "drone-pull-back",
    label: "Drone pull back",
    category: "Drone/Crane",
    promptKeyword: "drone aerial pull back wide reveal",
    fullPromptRecipe: "drone pull back. Movement: fly smoothly backward away from the subject or destination. Speed: controlled aerial retreat. Framing: keep the subject readable as more landscape appears. End: finish on a wider aerial composition.",
    movement: "fly smoothly backward away from the subject or destination",
    speed: "controlled aerial retreat",
    framing: "keep the subject readable as more landscape appears",
    end: "finish on a wider aerial composition",
    aliases: ["aerial pull back", "drone retreat", "drone wide reveal"]
  },
  {
    id: "helicopter-shot",
    label: "Helicopter shot",
    category: "Drone/Crane",
    promptKeyword: "aerial photography overhead birds eye view broad flight path",
    fullPromptRecipe: "helicopter-style aerial shot. Movement: move from high altitude along a broad gradual flight path. Speed: steady controlled aerial motion. Framing: keep the landscape or distant moving subject readable at wide scale. End: finish on a stable high-altitude composition.",
    movement: "move from high altitude along a broad gradual flight path",
    speed: "steady controlled aerial motion",
    framing: "keep the landscape or distant moving subject readable at wide scale",
    end: "finish on a stable high-altitude composition",
    aliases: ["Aerial Photography", "helicopter aerial", "high altitude drone"]
  },
  {
    id: "fpv",
    label: "First-person view",
    category: "Specials",
    promptKeyword: "first-person POV view with hands visible",
    fullPromptRecipe: "first-person view. Movement: move forward at human eye height from the character's perspective. Speed: natural walking or reaching pace. Framing: use visible hands, arms or body edges as the viewer's physical reference. End: arrive at the next point of action from the same point of view.",
    movement: "move forward at human eye height from the character's perspective",
    speed: "natural walking or reaching pace",
    framing: "use visible hands, arms or body edges as the viewer's physical reference",
    end: "arrive at the next point of action from the same point of view",
    aliases: ["POV", "first person view", "FPV drone view", "first person perspective"]
  },
  {
    id: "tilt-shift",
    label: "Tilt-shift",
    category: "Specials",
    promptKeyword: "tilt-shift miniature effect selective focus blur",
    fullPromptRecipe: "tilt-shift miniature view. Movement: hold or glide from a high angled view over the scene. Speed: small precise movement. Framing: keep a narrow band of sharp focus across the key subject area with soft blur above and below. End: finish with the miniature-scale view intact.",
    movement: "hold or glide from a high angled view over the scene",
    speed: "small precise movement",
    framing: "keep a narrow band of sharp focus across the key subject area with soft blur above and below",
    end: "finish with the miniature-scale view intact",
    aliases: ["miniature faking", "diorama effect", "tilt shift lens"]
  },
  {
    id: "infinite-zoom",
    label: "Infinite zoom",
    category: "Specials",
    promptKeyword: "seamless infinite zoom continuous scaling into center target",
    fullPromptRecipe: "infinite zoom. Movement: zoom continuously inward toward the exact center target. Speed: smooth accelerating zoom. Framing: keep the circular target centered as it expands. End: finish when the next visual world fills the frame.",
    movement: "zoom continuously inward toward the exact center target",
    speed: "smooth accelerating zoom",
    framing: "keep the circular target centered as it expands",
    end: "finish when the next visual world fills the frame",
    aliases: ["endless zoom", "fractal zoom", "portal zoom"]
  },
  {
    id: "earth-zoom-out",
    label: "Earth zoom out",
    category: "Specials",
    promptKeyword: "earth zoom out from ground level to planet satellite scale",
    fullPromptRecipe: "earth zoom out. Movement: pull upward from the starting point through street, city, landscape and planet scale. Speed: rapid expanding zoom out. Framing: keep the original location centered as scale grows. End: finish on a planet-scale view with the starting point still implied at center.",
    movement: "pull upward from the starting point through street, city, landscape and planet scale",
    speed: "rapid expanding zoom out",
    framing: "keep the original location centered as scale grows",
    end: "finish on a planet-scale view with the starting point still implied at center",
    aliases: ["satellite zoom out", "macro to micro zoom", "powers of ten zoom"]
  },
  {
    id: "time-lapse",
    label: "Time-lapse",
    category: "Specials",
    promptKeyword: "static camera time-lapse motion",
    fullPromptRecipe: "locked-camera time-lapse. Movement: hold one fixed camera position while time moves rapidly forward. Speed: fast time compression with a stable camera. Framing: keep the same composition and horizon as motion passes through the frame. End: finish from the same camera angle with visible passage of time.",
    movement: "hold one fixed camera position while time moves rapidly forward",
    speed: "fast time compression with a stable camera",
    framing: "keep the same composition and horizon as motion passes through the frame",
    end: "finish from the same camera angle with visible passage of time",
    aliases: ["Time-lapse", "hyperlapse", "time lapse shot"]
  },
  {
    id: "pass-through-objects",
    label: "Pass-through objects",
    category: "Specials",
    promptKeyword: "pass-through movement through object surface barrier into new space",
    fullPromptRecipe: "pass-through movement. Movement: move forward toward a visible object, surface or barrier and continue into the space beyond. Speed: smooth centered glide. Framing: keep the opening or surface centered as the transition point. End: arrive inside the revealed space beyond.",
    movement: "move forward toward a visible object, surface or barrier and continue into the space beyond",
    speed: "smooth centered glide",
    framing: "keep the opening or surface centered as the transition point",
    end: "arrive inside the revealed space beyond",
    aliases: ["keyhole camera", "portal pass through", "fly through barrier"]
  },
  {
    id: "shot-switch",
    label: "Shot Switch",
    category: "Specials",
    promptKeyword: "Shot switch cut to:",
    fullPromptRecipe: "Shot switch cut to new angle within clip.",
    movement: "internal hard cut to a complementary angle",
    speed: "instant cut",
    framing: "clean compositional transition",
    end: "land on new perspective",
    aliases: ["Shot Switch", "cut to", "angle switch"]
  },
  {
    id: "slow-motion",
    label: "Slow Motion",
    category: "Specials",
    promptKeyword: "slow motion moment",
    fullPromptRecipe: "slow motion moment. High frame rate deceleration of action.",
    movement: "high speed frame capture with decelerated playback",
    speed: "slow motion",
    framing: "critical action impact focus",
    end: "held slow motion frame",
    aliases: ["Slow Motion", "slow mo", "high speed camera", "bullet time"]
  }
];
var CINEMATIC_MOVEMENTS_COUNT = CINEMATIC_CAMERA_MOVEMENTS.length;
function getCinematicMovement(query) {
  if (!query)
    return;
  const q = query.trim().toLowerCase();
  return CINEMATIC_CAMERA_MOVEMENTS.find((m) => m.id.toLowerCase() === q || m.label.toLowerCase() === q || m.aliases.some((a) => a.toLowerCase() === q));
}

// engine/library/video-movements.ts
var RAW_MOVEMENTS = [
  { label: "Static Lock-Off", promptKeyword: "static lock-off shot" },
  { label: "Dolly in", promptKeyword: "camera dolly in" },
  { label: "Dolly out", promptKeyword: "camera dolly out" },
  { label: "Pan", promptKeyword: "camera pans left right" },
  { label: "Tilt Up", promptKeyword: "camera tilts up" },
  { label: "Tilt Down", promptKeyword: "camera tilts down" },
  { label: "Tracking", promptKeyword: "camera tracking subject left right" },
  { label: "Pedestal Up", promptKeyword: "camera pedestals up" },
  { label: "Pedestal Down", promptKeyword: "camera pedestals down" },
  { label: "Truck", promptKeyword: "camera trucks left right" },
  { label: "Orbit", promptKeyword: "orbit 360 rotation around subject" },
  { label: "Follow", promptKeyword: "tracking shot following the subject" },
  { label: "Camera Jib up", promptKeyword: "camera crane jibs up" },
  { label: "Camera Jib down", promptKeyword: "camera crane jibs down" },
  { label: "Zoom", promptKeyword: "camera zooms in out with focal length change" },
  { label: "Aerial Photography", promptKeyword: "aerial photography overhead birds eye view" },
  { label: "Handheld", promptKeyword: "handheld natural camera shake" },
  { label: "Shot Switch", promptKeyword: "Shot switch cut to:" },
  { label: "Time-lapse", promptKeyword: "static camera time-lapse motion" },
  { label: "Reverse Shot", promptKeyword: "Reverse shot cut to:" },
  { label: "Crash Zoom", promptKeyword: "crash zoom" },
  { label: "Pull Focus", promptKeyword: "pull focus" },
  { label: "Whip Pan", promptKeyword: "whip pan transition" },
  { label: "Arc Shot", promptKeyword: "arc shot around subject" },
  { label: "Dolly Zoom", promptKeyword: "dolly zoom (Hitchcock style)" },
  { label: "Slow Motion", promptKeyword: "slow motion moment" }
];
function toSlug(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/'/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
var VIDEO_MOVEMENTS = RAW_MOVEMENTS.map((item) => ({
  label: item.label,
  promptKeyword: item.promptKeyword,
  image: `/images/video-movements/${toSlug(item.label)}.gif`
}));
var MOVEMENT_COUNT = VIDEO_MOVEMENTS.length;
function getMovementByLabel(label) {
  return VIDEO_MOVEMENTS.find((movement) => movement.label === label);
}

// engine/src/compiler/ir.ts
var ModelTargetSchema = _enum(["midjourney", "flux", "sdxl", "imagen-3", "kling", "veo", "sora", "runway", "wan", "generic"]);
var PromptModeSchema = _enum(["photo", "anime", "edit", "video"]);
var AspectRatioSchema = _enum(["16:9", "9:16", "1:1", "4:3", "3:4", "21:9", "3:2"]);
var text = string2().trim().min(1);
var optionalText = text.optional();
var OpticsIRSchema = object({
  camera: optionalText,
  lens: optionalText,
  focalLength: optionalText,
  fStop: text.transform((v) => v.replace(/^f\s*\/?\s*/i, "")).refine((v) => Number.isFinite(Number(v)) && Number(v) > 0, "Aperture must be positive").optional(),
  filmStock: optionalText,
  shotType: optionalText,
  viewAngle: optionalText
}).strict();
var LightingIRSchema = object({ setup: optionalText, mood: optionalText, timeOfDay: optionalText, colorTemperature: optionalText }).strict();
var StyleIRSchema = object({
  mode: _enum(["photo", "anime", "western-animation", "illustration", "cinematic"]).optional(),
  movieLook: optionalText,
  photographer: optionalText,
  animeShow: optionalText,
  animeGenre: optionalText,
  westernStyle: optionalText,
  artStyle: optionalText,
  genre: optionalText
}).strict();
var VideoPhysicsIRSchema = object({ forces: array(text).optional(), massAndInertia: optionalText, causalChain: optionalText, materialProperties: optionalText, invariance: array(text).optional() }).strict();
var SpatialBlockingIRSchema = object({ foreground: optionalText, midground: optionalText, background: optionalText, rackFocus: optionalText, trajectory: optionalText }).strict();
var CameraKinematicsIRSchema = object({
  rig: _enum(["steadicam", "tripod", "technocrane", "handheld", "fpv-drone", "dolly-track"]).optional(),
  primaryVector: optionalText,
  secondaryDrift: optionalText,
  shutterAngle: _enum(["180-degree", "90-degree", "360-degree"]).optional(),
  speedRamp: optionalText
}).strict();
var AnchorFramesIRSchema = object({ frame0State: optionalText, transitionVector: optionalText, continuityLock: boolean2().optional() }).strict();
var ActionChoreographyIRSchema = object({ anticipation: optionalText, execution: optionalText, settle: optionalText, audioFoley: optionalText }).strict();
var ReferenceSlotSchema = object({
  type: _enum(["global", "face", "scene", "outfit", "object", "anonymous"]),
  characterIndex: number2().int().nonnegative().nullable(),
  image: string2(),
  sourcePrompt: string2().optional()
}).strict().superRefine((v, ctx) => {
  if (["face", "outfit", "object"].includes(v.type) && v.characterIndex === null)
    ctx.addIssue({ code: "custom", message: "Character references require characterIndex", path: ["characterIndex"] });
});
var ReferenceOptionsSchema = object({ maxReferenceImages: number2().int().nonnegative().optional(), referenceLabelMode: _enum(["image", "file"]).optional() }).strict();
var motionFields = { movement: optionalText, speed: _enum(["slow", "normal", "fast", "freeze"]).optional(), pacing: optionalText, timelineBeats: array(text).optional() };
var SceneFieldsSchema = object({
  subject: optionalText,
  action: optionalText,
  environment: optionalText,
  optics: OpticsIRSchema.optional(),
  lighting: LightingIRSchema.optional(),
  style: StyleIRSchema.optional(),
  physics: VideoPhysicsIRSchema.optional(),
  spatial: SpatialBlockingIRSchema.optional(),
  kinematics: CameraKinematicsIRSchema.optional(),
  anchoring: AnchorFramesIRSchema.optional(),
  actionChoreography: ActionChoreographyIRSchema.optional(),
  filters: array(text).optional(),
  references: array(ReferenceSlotSchema).optional(),
  noText: boolean2().optional(),
  candidShot: boolean2().optional(),
  showNewAnglePrompt: boolean2().optional(),
  negativePrompt: optionalText
}).strict();
var ShotOverridesSchema = SceneFieldsSchema.extend({ motion: object(motionFields).strict().optional() }).strict();
var DirectorShotIRSchema = object({
  shotId: optionalText,
  note: string2().trim(),
  duration: number2().finite().positive().default(5),
  overrides: ShotOverridesSchema.optional()
}).strict();
var MotionIRSchema = object({ ...motionFields, directorShots: array(DirectorShotIRSchema).optional() }).strict();
var TimelineOptionsSchema = object({
  maxShots: number2().int().positive().optional(),
  minTotalDuration: number2().nonnegative().optional(),
  maxTotalDuration: number2().positive().optional(),
  maxPromptChars: number2().int().positive().optional()
}).strict().refine((v) => v.minTotalDuration === undefined || v.maxTotalDuration === undefined || v.minTotalDuration <= v.maxTotalDuration, "Minimum duration exceeds maximum");
var PromptIRSchema = SceneFieldsSchema.extend({
  target: ModelTargetSchema.default("generic"),
  mode: PromptModeSchema.optional(),
  subject: text,
  motion: MotionIRSchema.optional(),
  aspectRatio: text.default("16:9"),
  seed: number2().int().nonnegative().optional(),
  quality: number2().min(0.25).max(2).optional(),
  rawStylize: boolean2().optional(),
  noText: boolean2().default(true),
  referenceOptions: ReferenceOptionsSchema.optional(),
  timelineOptions: TimelineOptionsSchema.optional(),
  tokenBudget: number2().int().positive().optional()
}).strict();

// engine/src/compiler/adapter.ts
var legacyText = string2();
var PromptStateInputSchema = object({
  subject: legacyText.optional(),
  subjectAction: legacyText.optional(),
  environment: legacyText.optional(),
  mood: legacyText.optional(),
  lightingId: legacyText.optional(),
  shotId: legacyText.optional(),
  cameraId: legacyText.optional(),
  lensId: legacyText.optional(),
  fStop: legacyText.nullable().optional(),
  filmId: legacyText.optional(),
  filters: array(legacyText).optional(),
  movieLookId: legacyText.optional(),
  photographerId: legacyText.optional(),
  animeGenreId: legacyText.optional(),
  animeShowStyleId: legacyText.optional(),
  westernAnimationStyleId: legacyText.optional(),
  noText: boolean2().optional(),
  showNewAnglePrompt: boolean2().optional(),
  candidShot: boolean2().optional(),
  aspectRatio: legacyText.optional(),
  mode: PromptModeSchema.optional(),
  references: array(ReferenceSlotSchema).optional(),
  focalLengthId: legacyText.optional(),
  directionId: legacyText.optional(),
  genreId: legacyText.optional(),
  styleMode: _enum(["photo", "anime", "western-animation", "illustration", "cinematic"]).optional(),
  artStyle: legacyText.optional(),
  target: ModelTargetSchema.optional(),
  spatial: SpatialBlockingIRSchema.optional(),
  physics: VideoPhysicsIRSchema.optional(),
  kinematics: CameraKinematicsIRSchema.optional(),
  anchoring: AnchorFramesIRSchema.optional(),
  actionChoreography: ActionChoreographyIRSchema.optional(),
  motion: MotionIRSchema.optional(),
  negativePrompt: legacyText.optional(),
  seed: number2().int().nonnegative().optional(),
  quality: number2().min(0.25).max(2).optional(),
  rawStylize: boolean2().optional(),
  referenceOptions: ReferenceOptionsSchema.optional(),
  tokenBudget: number2().int().positive().optional(),
  timelineOptions: TimelineOptionsSchema.optional(),
  timeOfDay: legacyText.optional(),
  colorTemperature: legacyText.optional(),
  videoPrompt: legacyText.optional(),
  movementLabel: legacyText.optional(),
  movementCursor: number2().int().nonnegative().optional(),
  directorMode: boolean2().optional(),
  directorShots: array(object({ shotId: legacyText.optional(), note: legacyText.optional(), durationHint: legacyText.optional(), overrides: ShotOverridesSchema.optional() }).strict()).optional()
}).strict();
function normalizeState(input) {
  return { ...createDefaultState(), videoPrompt: "", movementLabel: "", directorMode: false, directorShots: [], ...PromptStateInputSchema.parse(input) };
}
var nonempty = (s) => s?.trim() || undefined;
function stateToIR(input) {
  const s = normalizeState(input);
  const subject = nonempty(s.subjectAction) || nonempty(s.subject);
  let videoPrompt = s.mode === "video" ? nonempty(s.videoPrompt) : undefined;
  if (s.mode === "video" && s.movementCursor !== undefined && s.movementLabel) {
    const keyword = getMovementByLabel(s.movementLabel)?.promptKeyword || getCinematicMovement(s.movementLabel)?.promptKeyword || s.movementLabel;
    const prompt = videoPrompt || "";
    const at = Math.min(s.movementCursor, prompt.length);
    videoPrompt = [prompt.slice(0, at).trimEnd(), keyword, prompt.slice(at).trimStart()].filter(Boolean).join(" ");
  }
  const motion = { ...s.motion, movement: nonempty(s.movementLabel) || s.motion?.movement };
  if (s.directorMode && s.directorShots.length)
    motion.directorShots = s.directorShots.map((shot) => {
      const duration = shot.durationHint?.trim() ? Number(shot.durationHint) : 5;
      if (!Number.isFinite(duration) || duration <= 0)
        throw new Error("Director durationHint must be a positive number");
      return { shotId: nonempty(shot.shotId), note: shot.note || "", duration, overrides: shot.overrides };
    });
  return PromptIRSchema.parse({
    target: s.target || "generic",
    mode: s.mode,
    subject: subject || videoPrompt || "a subject",
    action: subject && videoPrompt && subject !== videoPrompt ? videoPrompt : undefined,
    environment: nonempty(s.environment),
    optics: { camera: nonempty(s.cameraId), lens: nonempty(s.lensId), focalLength: nonempty(s.focalLengthId), fStop: nonempty(s.fStop), filmStock: nonempty(s.filmId), shotType: nonempty(s.shotId), viewAngle: nonempty(s.directionId) },
    lighting: { setup: nonempty(s.lightingId), mood: nonempty(s.mood), timeOfDay: nonempty(s.timeOfDay), colorTemperature: nonempty(s.colorTemperature) },
    style: { mode: s.styleMode, genre: nonempty(s.genreId), photographer: nonempty(s.photographerId), movieLook: nonempty(s.movieLookId), animeGenre: nonempty(s.animeGenreId), animeShow: nonempty(s.animeShowStyleId), westernStyle: nonempty(s.westernAnimationStyleId), artStyle: nonempty(s.artStyle) },
    motion: Object.values(motion).some((v) => v !== undefined) ? motion : undefined,
    spatial: s.spatial,
    physics: s.physics,
    kinematics: s.kinematics,
    anchoring: s.anchoring,
    actionChoreography: s.actionChoreography,
    filters: s.filters.filter((v) => v.trim()),
    references: s.references,
    aspectRatio: nonempty(s.aspectRatio) || "16:9",
    noText: s.noText,
    candidShot: s.candidShot,
    showNewAnglePrompt: s.showNewAnglePrompt,
    negativePrompt: nonempty(s.negativePrompt),
    rawStylize: s.rawStylize,
    referenceOptions: s.referenceOptions,
    seed: s.seed,
    quality: s.quality,
    tokenBudget: s.tokenBudget,
    timelineOptions: s.timelineOptions
  });
}

// engine/src/references.ts
var CATEGORY_PRIORITY = {
  global: 1,
  face: 2,
  scene: 3,
  outfit: 4,
  object: 5,
  anonymous: 6
};
var CHARACTER_CATEGORIES = ["face", "outfit", "object"];
var CHARACTER_TOKEN = {
  face: "face reference",
  outfit: "clothing reference",
  object: "prop reference"
};
function displayToken(imageNumber, labelMode) {
  return labelMode === "file" ? `file ${imageNumber}` : `image_${imageNumber}`;
}
function loadedLabel(imageNumber, labelMode) {
  return labelMode === "file" ? `File ${imageNumber} - reference loaded` : `Image ${imageNumber} - reference loaded`;
}
function buildReferenceCandidates(references, order, labelMode) {
  const candidates = [];
  const filled = references.filter((slot) => slot.image.length > 0);
  const addCharacters = () => {
    const characterIndexes = [
      ...new Set(filled.filter((slot) => slot.characterIndex !== null).map((slot) => slot.characterIndex))
    ].sort((a, b) => a - b);
    for (const characterIndex of characterIndexes) {
      const charLabel = `Character${characterIndex + 1}`;
      for (const category of CHARACTER_CATEGORIES) {
        const token = CHARACTER_TOKEN[category];
        for (const slot of filled) {
          if (slot.characterIndex !== characterIndex || slot.type !== category)
            continue;
          candidates.push({
            category,
            characterIndex,
            buildDisplayText: (_n, tok) => `${tok} as ${charLabel} ${token}`,
            buildFullText: (_n, tok) => `${tok} as ${charLabel} ${token}`
          });
        }
      }
    }
  };
  const addScene = () => {
    for (const slot of filled) {
      if (slot.type !== "scene")
        continue;
      candidates.push({
        category: "scene",
        characterIndex: null,
        buildDisplayText: (_n, tok) => `${tok} as scene style reference`,
        buildFullText: (_n, tok) => `${tok} as scene style reference`
      });
    }
  };
  const addGlobal = () => {
    for (const slot of filled) {
      if (slot.type !== "global")
        continue;
      const promptCtx = slot.sourcePrompt ? ` (Source content: "${slot.sourcePrompt}")` : "";
      candidates.push({
        category: "global",
        characterIndex: null,
        buildDisplayText: (_n, tok) => `${tok} as global visual reference`,
        buildFullText: (_n, tok) => `${tok} as global visual reference${promptCtx}`
      });
    }
  };
  const addAnonymous = () => {
    for (const slot of filled) {
      if (slot.type !== "anonymous")
        continue;
      candidates.push({
        category: "anonymous",
        characterIndex: null,
        buildDisplayText: (n, tok) => `${tok} as ${labelMode === "file" ? `File${n}` : `Image${n}`} reference`,
        buildFullText: (n, tok) => `${tok} as ${labelMode === "file" ? `File${n}` : `Image${n}`} reference`,
        buildMentionTag: (n) => `@Image${n}`,
        buildMentionLabel: (n) => loadedLabel(n, labelMode)
      });
    }
  };
  if (order === "edit") {
    addGlobal();
    addCharacters();
    addScene();
    addAnonymous();
  } else {
    addCharacters();
    addScene();
    addGlobal();
    addAnonymous();
  }
  return candidates;
}
function selectReferenceCandidates(candidates, maxReferenceImages) {
  const safeLimit = maxReferenceImages > 0 ? maxReferenceImages : Number.MAX_SAFE_INTEGER;
  if (candidates.length <= safeLimit) {
    return { active: [...candidates], overflow: [] };
  }
  const ranked = candidates.map((candidate, originalIndex) => ({ candidate, originalIndex })).sort((a, b) => {
    const priorityA = CATEGORY_PRIORITY[a.candidate.category] ?? 99;
    const priorityB = CATEGORY_PRIORITY[b.candidate.category] ?? 99;
    if (priorityA !== priorityB)
      return priorityA - priorityB;
    return a.originalIndex - b.originalIndex;
  });
  const selectedIndexes = new Set(ranked.slice(0, safeLimit).map((item) => item.originalIndex));
  return {
    active: candidates.filter((_, index) => selectedIndexes.has(index)),
    overflow: candidates.filter((_, index) => !selectedIndexes.has(index))
  };
}
function materializeReferenceDescriptors(candidates, labelMode) {
  return candidates.map((candidate, index) => {
    const imageNumber = index + 1;
    const token = displayToken(imageNumber, labelMode);
    return {
      number: imageNumber,
      category: candidate.category,
      characterIndex: candidate.characterIndex,
      displayText: candidate.buildDisplayText(imageNumber, token),
      fullText: candidate.buildFullText(imageNumber, token),
      assetFileName: `image_${imageNumber}.jpg`,
      mentionTag: candidate.buildMentionTag?.(imageNumber),
      mentionLabel: candidate.buildMentionLabel?.(imageNumber)
    };
  });
}
function buildInstructionText(descriptors, order) {
  if (descriptors.length === 0) {
    return { display: "", full: "" };
  }
  const prefix = order === "edit" ? "Use the provided reference images to guide the edit:" : "Create a new image by combining the provided elements:";
  const hasCharacterRefs = descriptors.some((descriptor) => descriptor.category === "face" || descriptor.category === "outfit" || descriptor.category === "object");
  const suffix = hasCharacterRefs ? " Keep character appearances consistent with the references." : "";
  return {
    display: `${prefix} ${descriptors.map((descriptor) => descriptor.displayText).join("; ")}.${suffix}`,
    full: `${prefix} ${descriptors.map((descriptor) => descriptor.fullText).join("; ")}.${suffix}`
  };
}
function resolveReferences(references, options) {
  const labelMode = options.labelMode ?? "image";
  const candidates = buildReferenceCandidates(references, options.order, labelMode);
  const { active, overflow } = selectReferenceCandidates(candidates, options.maxReferenceImages ?? 0);
  const activeDescriptors = materializeReferenceDescriptors(active, labelMode);
  const overflowDescriptors = materializeReferenceDescriptors(overflow, labelMode);
  return {
    active: activeDescriptors,
    overflow: overflowDescriptors,
    instruction: buildInstructionText(activeDescriptors, options.order)
  };
}

// engine/src/compiler/catalog.ts
var aliases = {
  lighting: { neon: "neon-lighting", "neon-lit": "neon-lighting", neutral: "soft-lighting", "neutral-lighting": "soft-lighting" },
  shots: { wide: "wide-angle", "wide-shot": "wide-angle", closeup: "close-up" },
  lenses: { anamorphic: "anamorphic-cinema-lens", "anamorphic-prime": "anamorphic-cinema-lens", "swirly-bokeh": "helios-44-2-swirly-bokeh" },
  filmStocks: { imax: "kodak-vision3-imax", "70mm": "kodak-vision3-imax" },
  cameras: { "35mm": "35mm-film-camera" }
};
function resolvePreset(library, category, input) {
  const normalized = input.trim().toLowerCase();
  if (!normalized)
    return { value: "" };
  const items = library[category];
  const slug = normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const exact = items.find((p) => p.id.toLowerCase() === normalized) || items.find((p) => p.label.toLowerCase() === normalized);
  const alias = aliases[category]?.[normalized];
  const matches = exact ? [exact] : items.filter((p) => p.id.toLowerCase() === (alias || slug));
  const candidates = matches.length ? matches : items.filter((p) => p.id.toLowerCase().startsWith(slug) || p.label.toLowerCase().startsWith(normalized));
  if (candidates.length === 1)
    return { value: candidates[0].promptValue, preset: candidates[0] };
  return { value: input.trim(), diagnostic: {
    severity: "warning",
    code: candidates.length ? "AMBIGUOUS_PRESET" : "UNRESOLVED_PRESET",
    message: candidates.length ? `Ambiguous ${category} selection '${input}'; kept as text. Choose an exact ID: ${candidates.map((p) => p.id).join(", ")}.` : `No ${category} preset matches '${input}'; kept as custom text.`
  } };
}

// engine/src/compiler/scene.ts
var VIDEO_TARGETS = ["kling", "veo", "sora", "runway", "wan"];
var sentence = (value) => value.trim() ? `${value.trim().replace(/[.\s]+$/, "")}.` : "";
function resolveScene(input, library) {
  const ir = structuredClone(input);
  const diagnostics = [];
  ir.mode ??= VIDEO_TARGETS.includes(ir.target) ? "video" : ir.style?.mode === "anime" || ir.style?.animeGenre || ir.style?.animeShow || ir.style?.westernStyle ? "anime" : "photo";
  const video = ir.mode === "video";
  const resolve = (category, value, field) => {
    if (!value)
      return "";
    const result = resolvePreset(library, category, value);
    if (result.diagnostic)
      diagnostics.push({ ...result.diagnostic, field });
    return result.value;
  };
  const s = { subject: [], lighting: [], optics: [], style: [], spatial: [], motion: [], physics: [], anchoring: [], choreography: [], audio: [], constraints: [], references: [] };
  const shot = resolve("shots", ir.optics?.shotType, "optics.shotType");
  const styleMode = ir.style?.mode || (ir.style?.westernStyle ? "western-animation" : ir.style?.animeGenre || ir.style?.animeShow || ir.mode === "anime" ? "anime" : "photo");
  const medium = styleMode === "photo" ? video ? "cinematic video" : "photographic image" : styleMode === "cinematic" ? video ? "cinematic video" : "cinematic image" : `${styleMode.replace("-", " ")} ${video ? "video" : "image"}`;
  const subject = [ir.subject, ir.action].filter(Boolean).join(", ");
  s.subject.push(ir.mode === "edit" ? sentence(`Modify the source image to: ${subject}`) : sentence(`${/^[aeiou]/i.test(medium) ? "An" : "A"} ${medium} of ${subject}${ir.environment ? `, set in ${ir.environment}` : ""}`));
  if (ir.mode === "edit") {
    if (ir.environment)
      s.subject.push(sentence(`Environment: ${ir.environment}`));
    s.subject.push("Preserve source content outside the requested changes.");
  }
  if (shot)
    s.subject.push(sentence(`Framing: ${shot}`));
  if (ir.optics?.viewAngle)
    s.subject.push(sentence(`View direction: ${resolve("directions", ir.optics.viewAngle, "optics.viewAngle")}`));
  if (ir.candidShot)
    s.subject.push("The subject is unaware of the camera.");
  if (ir.showNewAnglePrompt)
    s.subject.push("Show the scene from the selected new viewpoint while preserving its identity.");
  const light = resolve("lighting", ir.lighting?.setup, "lighting.setup");
  if (light)
    s.lighting.push(sentence(`The scene is illuminated by ${light}${ir.lighting?.mood ? `, creating a ${ir.lighting.mood} atmosphere` : ""}`));
  else if (ir.lighting?.mood)
    s.lighting.push(sentence(`A ${ir.lighting.mood} atmosphere`));
  if (ir.lighting?.timeOfDay)
    s.lighting.push(sentence(`Time of day: ${ir.lighting.timeOfDay}`));
  if (ir.lighting?.colorTemperature)
    s.lighting.push(sentence(`Color temperature: ${ir.lighting.colorTemperature}`));
  if (ir.optics?.camera)
    s.optics.push(sentence(`Captured with the look of a ${resolve("cameras", ir.optics.camera, "optics.camera")}`));
  if (ir.optics?.lens)
    s.optics.push(sentence(`Lens: ${resolve("lenses", ir.optics.lens, "optics.lens")}`));
  if (ir.optics?.focalLength)
    s.optics.push(sentence(`Focal length: ${resolve("focalLengths", ir.optics.focalLength, "optics.focalLength")}`));
  if (ir.optics?.fStop)
    s.optics.push(sentence(`Aperture: f/${ir.optics.fStop}`));
  if (ir.optics?.filmStock)
    s.optics.push(sentence(`Film texture: ${resolve("filmStocks", ir.optics.filmStock, "optics.filmStock")}`));
  for (const [field, category] of [["photographer", "photographers"], ["movieLook", "movieLooks"], ["genre", "genres"]]) {
    if (ir.style?.[field])
      s.style.push(sentence(resolve(category, ir.style[field], `style.${field}`)));
  }
  for (const [field, category] of [["animeGenre", "animeGenres"], ["animeShow", "animeShowStyles"], ["westernStyle", "westernAnimationStyles"]]) {
    const value = ir.style?.[field];
    if (!value)
      continue;
    const result = resolvePreset(library, category, value);
    if (result.diagnostic)
      diagnostics.push({ ...result.diagnostic, field: `style.${field}` });
    const preset = result.preset;
    s.style.push(preset && "pre" in preset ? `${preset.pre} ${preset.post}` : sentence(`Style: ${result.value}`));
  }
  if (ir.style?.mode && ir.mode === "edit")
    s.style.push(sentence(`Rendering medium: ${ir.style.mode}`));
  if (ir.style?.artStyle)
    s.style.push(sentence(`Art direction: ${ir.style.artStyle}`));
  if (ir.filters?.length)
    s.style.push(sentence(`Applied effect(s): ${ir.filters.map((v, i) => resolve("filters", v, `filters.${i}`)).join(", ")}`));
  for (const field of ["foreground", "midground", "background"])
    if (ir.spatial?.[field])
      s.spatial.push(sentence(`${field[0].toUpperCase()}${field.slice(1)}: ${ir.spatial[field]}`));
  if (ir.physics?.materialProperties)
    s.physics.push(sentence(`Material properties: ${ir.physics.materialProperties}`));
  if (ir.physics?.invariance?.length)
    s.constraints.push(sentence(`Preserve: ${ir.physics.invariance.join("; ")}`));
  if (video) {
    if (ir.spatial?.trajectory)
      s.spatial.push(sentence(`Subject trajectory: ${ir.spatial.trajectory}`));
    if (ir.spatial?.rackFocus)
      s.spatial.push(sentence(`Focus transition: ${ir.spatial.rackFocus}`));
    if (ir.motion?.movement) {
      const movement = getCinematicMovement(ir.motion.movement);
      const keyword = getMovementByLabel(ir.motion.movement);
      s.motion.push(movement ? sentence(`${movement.label}: ${movement.movement}. ${ir.motion.speed ? "" : `Speed: ${movement.speed}. `}Framing: ${movement.framing}. End: ${movement.end}`) : sentence(keyword?.promptKeyword || ir.motion.movement));
      if (!movement && !keyword)
        diagnostics.push({ severity: "info", code: "CUSTOM_MOVEMENT", field: "motion.movement", message: `Movement '${ir.motion.movement}' is preserved as custom text.` });
    }
    if (ir.motion?.speed)
      s.motion.push(ir.motion.speed === "freeze" ? "Hold the subject and camera still throughout the shot." : sentence(`Motion speed: ${ir.motion.speed}`));
    if (ir.motion?.pacing)
      s.motion.push(sentence(`Pacing: ${ir.motion.pacing}`));
    if (ir.motion?.timelineBeats?.length)
      s.choreography.push(sentence(`Continuous action beats, in order without cuts: ${ir.motion.timelineBeats.map((v, i) => `${i + 1}) ${v}`).join("; ")}`));
    for (const [field, label] of [["rig", "Rig"], ["primaryVector", "Primary camera vector"], ["secondaryDrift", "Secondary camera drift"], ["shutterAngle", "Shutter angle"], ["speedRamp", "Speed ramp"]])
      if (ir.kinematics?.[field])
        s.motion.push(sentence(`${label}: ${ir.kinematics[field]}`));
    if (ir.physics?.massAndInertia)
      s.physics.push(sentence(`Mass and inertia: ${ir.physics.massAndInertia}`));
    if (ir.physics?.forces?.length)
      s.physics.push(sentence(`Forces: ${ir.physics.forces.join("; ")}`));
    if (ir.physics?.causalChain)
      s.physics.push(sentence(`Cause and effect: ${ir.physics.causalChain}`));
    if (ir.anchoring?.frame0State)
      s.anchoring.push(sentence(`Starting frame: ${ir.anchoring.frame0State}`));
    if (ir.anchoring?.transitionVector)
      s.anchoring.push(sentence(`Transition to the next frame: ${ir.anchoring.transitionVector}`));
    if (ir.anchoring?.continuityLock !== undefined)
      s.anchoring.push(ir.anchoring.continuityLock ? "Maintain subject identity, wardrobe, geometry, screen direction and lighting continuity between frames and shots." : "Continuity lock is off; allow the explicitly described changes between frames and shots.");
    for (const [field, label] of [["anticipation", "Anticipation"], ["execution", "Execution"], ["settle", "Follow-through"]])
      if (ir.actionChoreography?.[field])
        s.choreography.push(sentence(`${label}: ${ir.actionChoreography[field]}`));
    if (ir.actionChoreography?.audioFoley)
      s.audio.push(sentence(`AUDIO: ${ir.actionChoreography.audioFoley}`));
  } else {
    const temporal = [["motion", ir.motion], ["kinematics", ir.kinematics], ["anchoring", ir.anchoring], ["actionChoreography", ir.actionChoreography], ["spatial.trajectory", ir.spatial?.trajectory], ["spatial.rackFocus", ir.spatial?.rackFocus], ["physics.forces", ir.physics?.forces], ["physics.massAndInertia", ir.physics?.massAndInertia], ["physics.causalChain", ir.physics?.causalChain]];
    for (const [field, value] of temporal)
      if (value !== undefined)
        diagnostics.push({ severity: "warning", code: "UNSUPPORTED_FIELD", field, message: `${field} describes temporal behavior and is not rendered in ${ir.mode} mode. Use video mode to retain it.` });
  }
  if (!video)
    s.constraints.push("Don't blur faces randomly.");
  if (ir.noText)
    s.constraints.push(`Generate the ${video ? "video" : "image"} with no subtitles, captions, or text overlays.`);
  const references = resolveReferences(ir.references || [], { order: ir.mode === "edit" ? "edit" : "generate", maxReferenceImages: ir.referenceOptions?.maxReferenceImages, labelMode: ir.referenceOptions?.referenceLabelMode });
  if (references.instruction.full)
    s.references.push(video ? references.instruction.full.replace("Create a new image", "Create a video") : references.instruction.full);
  if (references.overflow.length)
    diagnostics.push({ severity: "warning", code: "REFERENCE_OVERFLOW", field: "references", message: `${references.overflow.length} references exceed the configured cap; see referenceResolution.overflow.` });
  const aspect = library.aspectRatios.find((p) => p.id === ir.aspectRatio || p.label === ir.aspectRatio || p.promptValue === ir.aspectRatio)?.promptValue || ir.aspectRatio;
  if (!/^\d+(?:\.\d+)?:\d+(?:\.\d+)?$/.test(aspect) || aspect.split(":").some((v) => Number(v) <= 0))
    diagnostics.push({ severity: "error", code: "INVALID_ASPECT_RATIO", field: "aspectRatio", message: `Invalid aspect ratio '${ir.aspectRatio}'. Use a catalog ID or positive width:height ratio.` });
  ir.aspectRatio = aspect;
  return { ir, sections: s, diagnostics, referenceResolution: references };
}

// engine/src/compiler/timeline.ts
var DEFAULT_TIMELINE_LIMITS = { maxShots: 6, minTotalDuration: 3, maxTotalDuration: 15, maxPromptChars: 512 };
function normalizeTimeline(input, options = {}) {
  const limits = { ...DEFAULT_TIMELINE_LIMITS, ...TimelineOptionsSchema.parse(options) };
  if (limits.minTotalDuration > limits.maxTotalDuration)
    throw new Error("Minimum duration exceeds maximum");
  if (!Array.isArray(input))
    throw new Error("Director shots must be an array");
  for (const s of input) {
    if (!s || typeof s.note !== "string")
      throw new Error("Shot note must be a string");
    if (!Number.isFinite(s.duration) || s.duration <= 0)
      throw new Error("Shot duration must be a positive finite number");
  }
  const diagnostics = [];
  const valid = input.map((s, sourceIndex) => ({ ...s, note: s.note.trim(), sourceIndex })).filter((s) => {
    if (!s.note)
      diagnostics.push({ severity: "warning", code: "EMPTY_SHOT", field: `motion.directorShots.${s.sourceIndex}.note`, message: "Empty shot omitted." });
    return !!s.note;
  });
  const droppedShots = valid.slice(limits.maxShots);
  if (droppedShots.length)
    diagnostics.push({ severity: "warning", code: "SHOT_LIMIT", field: "motion.directorShots", message: `${droppedShots.length} shots omitted by configured maxShots=${limits.maxShots}; see timeline.droppedShots.` });
  const selected = valid.slice(0, limits.maxShots);
  for (const s of selected)
    if (!Number.isFinite(s.duration) || s.duration <= 0)
      throw new Error(`Shot ${s.sourceIndex + 1} duration must be a positive finite number`);
  const requestedTotalDuration = selected.reduce((sum, s) => sum + s.duration, 0);
  if (!Number.isFinite(requestedTotalDuration))
    throw new Error("Timeline duration exceeds numeric range");
  const target = selected.length ? Math.max(limits.minTotalDuration, Math.min(limits.maxTotalDuration, requestedTotalDuration)) : 0;
  if (target !== requestedTotalDuration)
    diagnostics.push({ severity: "warning", code: "DURATION_ADJUSTED", field: "motion.directorShots", message: `Shot durations proportionally adjusted from ${requestedTotalDuration}s to ${target}s to fit configured timeline limits.` });
  let elapsed = 0;
  let cumulativeRequested = 0;
  const shots = selected.map((s, index) => {
    cumulativeRequested += s.duration;
    const end = Math.round(cumulativeRequested / requestedTotalDuration * target * 1e6) / 1e6;
    const duration = Math.round((end - elapsed) * 1e6) / 1e6;
    if (duration <= 0)
      throw new Error("Shot duration is too small for timeline precision");
    if (s.note.length > limits.maxPromptChars)
      diagnostics.push({ severity: "warning", code: "SHOT_PROMPT_BUDGET", field: `motion.directorShots.${s.sourceIndex}.note`, message: `Shot contains ${s.note.length} characters, above configured budget ${limits.maxPromptChars}; preserved in full to avoid losing intent.` });
    const result = { index: index + 1, sourceIndex: s.sourceIndex, shotId: s.shotId, prompt: s.note, duration, start: elapsed, end };
    elapsed = end;
    return result;
  });
  return { shots, totalDuration: elapsed, requestedTotalDuration, droppedShots, diagnostics };
}

// engine/src/compiler/render.ts
var TARGET_CAPABILITIES = {
  midjourney: { medium: "image", format: "prose with Midjourney flags", negativeChannel: true },
  flux: { medium: "image", format: "natural scene prose", negativeChannel: false },
  sdxl: { medium: "image", format: "positive and negative scene descriptions", negativeChannel: true },
  "imagen-3": { medium: "image", format: "natural scene prose", negativeChannel: false },
  generic: { medium: "any", format: "portable scene prose", negativeChannel: false },
  kling: { medium: "video", format: "scene prose or explicit shot timeline", negativeChannel: false },
  runway: { medium: "video", format: "camera, subject, scene, physics channels", negativeChannel: false },
  wan: { medium: "video", format: "causal scene prose with negative channel", negativeChannel: true },
  sora: { medium: "video", format: "causal scene prose", negativeChannel: false },
  veo: { medium: "video", format: "optical and environmental blocks", negativeChannel: false }
};
function renderScene(scene) {
  const { sections: s, ir } = scene;
  if (ir.target === "runway") {
    return [
      ["CAMERA", [...s.optics, ...s.motion]],
      ["SUBJECT", [...s.subject, ...s.choreography]],
      ["SCENE", [...s.lighting, ...s.style, ...s.spatial]],
      ["PHYSICS", s.physics],
      ["CONTINUITY", s.anchoring],
      ["CONSTRAINTS", s.constraints],
      ["REFERENCES", s.references]
    ].filter(([, values]) => values.length).map(([label, values]) => `${label}: ${values.join(" ")}`).concat(s.audio).join(`
`);
  }
  const chunks = [...s.subject, ...s.lighting, ...s.optics, ...s.style, ...s.spatial, ...s.anchoring, ...s.motion, ...s.choreography, ...s.physics, ...s.constraints, ...s.references, ...s.audio];
  return chunks.join(ir.target === "veo" ? `
` : " ");
}
function inheritShot(ir, overrides) {
  const { directorShots: _, ...baseMotion } = ir.motion || {};
  const base = { ...ir, motion: baseMotion };
  if (!overrides)
    return base;
  const merged = { ...base, ...overrides };
  for (const key of ["optics", "lighting", "style", "physics", "spatial", "kinematics", "anchoring", "actionChoreography", "motion"]) {
    if (base[key] || overrides[key])
      Object.assign(merged, { [key]: { ...base[key], ...overrides[key] } });
  }
  return merged;
}
function renderCompilation(input, library) {
  const scene = resolveScene(input, library);
  const { ir } = scene;
  const diagnostics = [...scene.diagnostics];
  const capability = TARGET_CAPABILITIES[ir.target];
  if (capability.medium !== "any" && ir.mode === "video" !== (capability.medium === "video"))
    diagnostics.push({ severity: "error", code: "TARGET_MISMATCH", field: "mode", message: `${ir.target} uses the ${capability.medium} dialect but mode is ${ir.mode}. Choose a compatible target or generic.` });
  const parameters = { aspectRatio: ir.aspectRatio };
  if (ir.seed !== undefined)
    parameters.seed = ir.seed;
  if (ir.quality !== undefined) {
    if (ir.target === "midjourney")
      parameters.quality = ir.quality;
    else
      diagnostics.push({ severity: "warning", code: "UNSUPPORTED_FIELD", field: "quality", message: `quality has no configured mapping for ${ir.target}.` });
  }
  if (ir.rawStylize !== undefined && ir.target !== "midjourney")
    diagnostics.push({ severity: "warning", code: "UNSUPPORTED_FIELD", field: "rawStylize", message: `rawStylize is a Midjourney-only setting.` });
  let positivePrompt = renderScene(scene);
  let timeline;
  const shotReferences = [];
  if (ir.mode === "video" && ir.motion?.directorShots?.length) {
    timeline = normalizeTimeline(ir.motion.directorShots, ir.timelineOptions);
    diagnostics.push(...timeline.diagnostics);
    timeline.shots = timeline.shots.map((shot) => {
      const original = ir.motion.directorShots[shot.sourceIndex];
      const shotScene = resolveScene(inheritShot(ir, original.overrides), library);
      diagnostics.push(...shotScene.diagnostics.map((d) => ({ ...d, field: `motion.directorShots.${shot.sourceIndex}.${d.field || "overrides"}` })));
      shotReferences.push({ index: shot.index, resolution: shotScene.referenceResolution });
      const note = sentence(`Shot action: ${shot.prompt}`);
      let prompt = `${renderScene(shotScene)} ${note}`;
      if (shotScene.ir.negativePrompt)
        prompt += ` ${sentence(`Avoid: ${shotScene.ir.negativePrompt}`)}`;
      const budget = ir.timelineOptions?.maxPromptChars || 512;
      if (prompt.length > budget)
        diagnostics.push({ severity: "warning", code: "SHOT_PROMPT_BUDGET", field: `motion.directorShots.${shot.sourceIndex}`, message: `Expanded shot contains ${prompt.length} characters, above the configured budget ${budget}; preserved in full.` });
      return { ...shot, prompt };
    });
    if (timeline.shots.length) {
      positivePrompt = timeline.shots.map((s) => `Shot ${s.index} [${s.start}–${s.end}s; ${s.duration}s]: ${s.prompt}`).join(`
`);
      parameters.duration = timeline.totalDuration;
    }
  }
  if (!timeline?.shots.length && ir.negativePrompt && !capability.negativeChannel)
    positivePrompt += ` ${sentence(`Avoid: ${ir.negativePrompt}`)}`;
  const negativePrompt = [ir.negativePrompt, ir.noText ? "text, subtitles, captions, watermark" : ""].filter(Boolean).join(", ") || undefined;
  if (ir.target === "midjourney") {
    const flags = [`--ar ${ir.aspectRatio}`];
    if (ir.rawStylize !== false) {
      flags.push("--style raw");
      parameters.style = "raw";
    }
    if (ir.seed !== undefined)
      flags.push(`--seed ${ir.seed}`);
    if (ir.quality !== undefined)
      flags.push(`--q ${ir.quality}`);
    if (negativePrompt)
      flags.push(`--no ${negativePrompt}`);
    positivePrompt += ` ${flags.join(" ")}`;
  } else {
    positivePrompt += ` ${sentence(`The ${ir.mode === "video" ? "video" : "image"} should be in a ${ir.aspectRatio} format`)}`;
  }
  if (ir.mode !== "video" && ir.timelineOptions)
    diagnostics.push({ severity: "warning", code: "UNSUPPORTED_FIELD", field: "timelineOptions", message: "Timeline limits apply only in video mode." });
  if (!ir.motion?.directorShots?.length && ir.timelineOptions)
    diagnostics.push({ severity: "info", code: "UNUSED_TIMELINE_OPTIONS", field: "timelineOptions", message: "Timeline limits apply only when Director shots are supplied." });
  return { target: ir.target, positivePrompt, negativePrompt: capability.negativeChannel && !timeline?.shots.length ? negativePrompt : undefined, parameters, diagnostics, warnings: diagnostics.map((d) => d.message), timeline, referenceResolution: scene.referenceResolution, shotReferences: shotReferences.length ? shotReferences : undefined };
}
// engine/library/presets.json
var presets_default = {
  version: "1.0.0",
  shots: [
    {
      id: "bird-s-eye-view",
      label: "Bird's-eye view",
      promptValue: "Bird's-eye view: The camera is positioned directly above the subject, looking down from a height,",
      category: "shots"
    },
    {
      id: "close-up",
      label: "Close up",
      promptValue: "Close up shot",
      category: "shots"
    },
    {
      id: "cutaway-shot",
      label: "Cutaway shot",
      promptValue: "Cutaway shot",
      category: "shots"
    },
    {
      id: "dutch-angle",
      label: "Dutch angle",
      promptValue: "Tilted dutch angle shot",
      category: "shots"
    },
    {
      id: "entire-body",
      label: "Entire body",
      promptValue: "Entire body shot",
      category: "shots"
    },
    {
      id: "establishing-shot",
      label: "Establishing shot",
      promptValue: "Establishing shot",
      category: "shots"
    },
    {
      id: "extreme-close-up",
      label: "Extreme close up",
      promptValue: "Extreme close up",
      category: "shots"
    },
    {
      id: "group-shot",
      label: "Group shot",
      promptValue: "Group shot",
      category: "shots"
    },
    {
      id: "headshot",
      label: "Headshot",
      promptValue: "Headshot",
      category: "shots"
    },
    {
      id: "high-angle-shot",
      label: "High angle shot",
      promptValue: "High angle shot: camera is physically higher than the subject looking down,",
      category: "shots"
    },
    {
      id: "insert-shot",
      label: "Insert shot",
      promptValue: "Insert shot",
      category: "shots"
    },
    {
      id: "low-angle-shot",
      label: "Low angle shot",
      promptValue: "Low angle shot: camera is physically lower than the subject looking up,",
      category: "shots"
    },
    {
      id: "medium-shot",
      label: "Medium shot",
      promptValue: "Medium shot",
      category: "shots"
    },
    {
      id: "over-the-shoulder-shot",
      label: "Over the shoulder shot",
      promptValue: "Over the shoulder shot looking at someone or something else in the scene from behind a shoulder or object",
      category: "shots"
    },
    {
      id: "overhead-shot",
      label: "Overhead shot",
      promptValue: "Overhead shot",
      category: "shots"
    },
    {
      id: "point-of-view-shot",
      label: "Point of view shot",
      promptValue: "strict first-person Point of View shot the camera is mounted at eye-level, the subject is not in frame, a Go-Pro Bodycam without text overlay from the perspective of",
      category: "shots"
    },
    {
      id: "reaction-shot",
      label: "Reaction shot",
      promptValue: "Reaction shot",
      category: "shots"
    },
    {
      id: "reverse-shot",
      label: "Reverse shot",
      promptValue: "Reverse shot",
      category: "shots"
    },
    {
      id: "three-quarter-body",
      label: "Three quarter body",
      promptValue: "Three quarter body shot",
      category: "shots"
    },
    {
      id: "tight-headshot",
      label: "Tight headshot",
      promptValue: "Tight headshot",
      category: "shots"
    },
    {
      id: "two-shot",
      label: "Two-shot",
      promptValue: "Two-shot",
      category: "shots"
    },
    {
      id: "upper-body",
      label: "Upper body",
      promptValue: "Upper body shot",
      category: "shots"
    },
    {
      id: "wide-shot",
      label: "Wide shot",
      promptValue: "Wide shot",
      category: "shots"
    },
    {
      id: "worm-s-eye-view",
      label: "Worm's-eye view",
      promptValue: "worm's-eye view - the camera is very low to the ground looking up and the ground could be included in frame",
      category: "shots"
    }
  ],
  directions: [
    {
      id: "from-the-front",
      label: "from the front",
      promptValue: "facing the camera:",
      category: "directions"
    },
    {
      id: "from-the-back",
      label: "from the back",
      promptValue: "facing away from the camera:",
      category: "directions"
    },
    {
      id: "from-the-left",
      label: "from the left",
      promptValue: "facing the left side of the camera:",
      category: "directions"
    },
    {
      id: "from-the-right",
      label: "from the right",
      promptValue: "facing the right side of the camera:",
      category: "directions"
    }
  ],
  lighting: [
    {
      id: "backlighting-rim-lighting",
      label: "Backlighting / Rim Lighting",
      promptValue: "Backlighting / Rim Lighting",
      category: "lighting"
    },
    {
      id: "blue-hour",
      label: "Blue hour",
      promptValue: "blue-hour ambient lighting",
      category: "lighting"
    },
    {
      id: "bounce-lighting",
      label: "Bounce Lighting",
      promptValue: "Bounce Lighting",
      category: "lighting"
    },
    {
      id: "candlelight-lighting",
      label: "Candlelight Lighting",
      promptValue: "Candlelight Lighting with warm flicker and deep surrounding shadows",
      category: "lighting"
    },
    {
      id: "chiaroscuro-lighting",
      label: "Chiaroscuro Lighting",
      promptValue: "Chiaroscuro Lighting with a single hard key and heavy shadow contrast",
      category: "lighting"
    },
    {
      id: "color-gels",
      label: "Color Gels",
      promptValue: "Color Gels gelled key light and a contrasting gelled rim light",
      category: "lighting"
    },
    {
      id: "direct-flash",
      label: "Direct flash",
      promptValue: "direct on-camera flash, creating harsh shadows and a flat, artificial look",
      category: "lighting"
    },
    {
      id: "fog-diffusion",
      label: "Fog diffusion",
      promptValue: "fog-diffused light",
      category: "lighting"
    },
    {
      id: "gobo-lighting",
      label: "Gobo Lighting",
      promptValue: "Gobo Lighting with patterned shadows and a soft ambient fill",
      category: "lighting"
    },
    {
      id: "golden-hour",
      label: "Golden hour",
      promptValue: "warm golden-hour lighting",
      category: "lighting"
    },
    {
      id: "hard-lighting",
      label: "Hard Lighting",
      promptValue: "Hard Lighting with a small punchy key and crisp shadow edges",
      category: "lighting"
    },
    {
      id: "high-key-lighting",
      label: "High Key Lighting",
      promptValue: "High Key Lighting",
      category: "lighting"
    },
    {
      id: "low-key-lighting",
      label: "Low Key Lighting",
      promptValue: "Low Key Lighting",
      category: "lighting"
    },
    {
      id: "midday-sun",
      label: "Midday sun",
      promptValue: "harsh midday sun lighting",
      category: "lighting"
    },
    {
      id: "moonlight",
      label: "Moonlight",
      promptValue: "moonlight",
      category: "lighting"
    },
    {
      id: "motivated-lighting",
      label: "Motivated Lighting",
      promptValue: "Motivated Lighting",
      category: "lighting"
    },
    {
      id: "natural-daylight",
      label: "Natural daylight",
      promptValue: "natural daylight",
      category: "lighting"
    },
    {
      id: "neon-lighting",
      label: "Neon Lighting",
      promptValue: "Neon Lighting",
      category: "lighting"
    },
    {
      id: "paramount-lighting",
      label: "Paramount Lighting",
      promptValue: "Paramount Lighting with a high centered key and a soft shadow under the nose",
      category: "lighting"
    },
    {
      id: "practical-lighting",
      label: "Practical Lighting",
      promptValue: "Practical Lighting from practical light sources visible in the scene",
      category: "lighting"
    },
    {
      id: "rim-soft-fill",
      label: "Rim & soft fill",
      promptValue: "subtle rim backlight with soft front fill lighting",
      category: "lighting"
    },
    {
      id: "ring-light",
      label: "Ring light",
      promptValue: "frontal ring light out of frame with catchlights but IMPORTANT don't show the ring light is in the shot",
      category: "lighting"
    },
    {
      id: "silhouette-shadows",
      label: "Silhouette Shadows",
      promptValue: "Silhouette Shadows with strong backlight and no front fill, face mostly in shadow",
      category: "lighting"
    },
    {
      id: "soft-lighting",
      label: "Soft Lighting",
      promptValue: "Soft Lighting",
      category: "lighting"
    },
    {
      id: "split-lighting",
      label: "Split Lighting",
      promptValue: "Split Lighting with a side key lighting half the face and minimal fill",
      category: "lighting"
    },
    {
      id: "teal-and-orange",
      label: "Teal and orange",
      promptValue: "teal-and-orange cinematic contrast lighting",
      category: "lighting"
    },
    {
      id: "top-lighting",
      label: "Top Lighting",
      promptValue: "Top Lighting with an overhead key and subtle fill to control eye shadows",
      category: "lighting"
    },
    {
      id: "underlighting",
      label: "Underlighting",
      promptValue: "Underlighting with a low key light and reduced fill for eerie upward shadows",
      category: "lighting"
    },
    {
      id: "volumetric-lighting",
      label: "Volumetric Lighting",
      promptValue: "Volumetric Lighting with visible light beams through haze",
      category: "lighting"
    }
  ],
  cameras: [
    {
      id: "8mm-film-camera",
      label: "8mm film camera",
      promptValue: "8mm film camera",
      category: "cameras"
    },
    {
      id: "35mm-film-camera",
      label: "35mm film camera",
      promptValue: "35mm film camera",
      category: "cameras"
    },
    {
      id: "aaton-xtr",
      label: "Aaton XTR",
      promptValue: "Aaton XTR",
      category: "cameras"
    },
    {
      id: "argus-c3",
      label: "Argus C3",
      promptValue: "Argus C3",
      category: "cameras"
    },
    {
      id: "arri-alexa-65",
      label: "ARRI ALEXA 65",
      promptValue: "ARRI ALEXA 65",
      category: "cameras"
    },
    {
      id: "bolex-h16",
      label: "Bolex H16",
      promptValue: "Bolex H16",
      category: "cameras"
    },
    {
      id: "canon-c500",
      label: "Canon C500",
      promptValue: "Canon C500",
      category: "cameras"
    },
    {
      id: "panavision-panaflex",
      label: "Panavision Panaflex",
      promptValue: "Panavision Panaflex",
      category: "cameras"
    },
    {
      id: "red-digital-cinema-camera",
      label: "RED digital cinema camera",
      promptValue: "RED digital cinema camera",
      category: "cameras"
    },
    {
      id: "s16mm-film-camera",
      label: "s16mm film camera",
      promptValue: "s16mm film camera",
      category: "cameras"
    },
    {
      id: "sony-fx6",
      label: "Sony FX6",
      promptValue: "Sony FX6",
      category: "cameras"
    },
    {
      id: "sony-venice",
      label: "Sony Venice",
      promptValue: "Sony Venice",
      category: "cameras"
    },
    {
      id: "vhs-camera",
      label: "VHS Camera",
      promptValue: "VHS Camera",
      category: "cameras"
    },
    {
      id: "canon-eos-5d",
      label: "Canon EOS 5D",
      promptValue: "Canon EOS 5D",
      category: "cameras"
    },
    {
      id: "fujifilm-x-t4",
      label: "Fujifilm X-T4",
      promptValue: "Fujifilm X-T4",
      category: "cameras"
    },
    {
      id: "gopro-hero",
      label: "GoPro Hero",
      promptValue: "GoPro Hero",
      category: "cameras"
    },
    {
      id: "hasselblad-x1d-ii",
      label: "Hasselblad X1D II",
      promptValue: "Hasselblad X1D II",
      category: "cameras"
    },
    {
      id: "insta360-x4",
      label: "Insta360 X4",
      promptValue: "Insta360 X4",
      category: "cameras"
    },
    {
      id: "leica-q2-monochrom",
      label: "Leica Q2 Monochrom",
      promptValue: "Leica Q2 Monochrom",
      category: "cameras"
    },
    {
      id: "lumix-gh5",
      label: "Lumix GH5",
      promptValue: "Lumix GH5",
      category: "cameras"
    },
    {
      id: "pentax-645z",
      label: "Pentax 645Z",
      promptValue: "Pentax 645Z",
      category: "cameras"
    },
    {
      id: "phase-one-xf-iq4",
      label: "Phase One XF IQ4",
      promptValue: "Phase One XF IQ4",
      category: "cameras"
    },
    {
      id: "sony-fx3",
      label: "Sony FX3",
      promptValue: "Sony FX3",
      category: "cameras"
    },
    {
      id: "canon-ae-1",
      label: "Canon AE-1",
      promptValue: "Canon AE-1",
      category: "cameras"
    },
    {
      id: "contax-t2",
      label: "Contax T2",
      promptValue: "Contax T2",
      category: "cameras"
    },
    {
      id: "diana-f",
      label: "Diana F+",
      promptValue: "Diana F+",
      category: "cameras"
    },
    {
      id: "hasselblad-500cm",
      label: "Hasselblad 500CM",
      promptValue: "Hasselblad 500CM",
      category: "cameras"
    },
    {
      id: "holga-120n",
      label: "Holga 120N",
      promptValue: "Holga 120N",
      category: "cameras"
    },
    {
      id: "kodak-brownie",
      label: "Kodak Brownie",
      promptValue: "Kodak Brownie",
      category: "cameras"
    },
    {
      id: "kodak-funsaver",
      label: "Kodak Funsaver",
      promptValue: "Kodak Funsaver",
      category: "cameras"
    },
    {
      id: "leica-m3",
      label: "Leica M3",
      promptValue: "Leica M3",
      category: "cameras"
    },
    {
      id: "lomo-lc-a",
      label: "Lomo LC-A",
      promptValue: "Lomo LC-A",
      category: "cameras"
    },
    {
      id: "mamiya-rb67",
      label: "Mamiya RB67",
      promptValue: "Mamiya RB67",
      category: "cameras"
    },
    {
      id: "minolta-srt-101",
      label: "Minolta SRT-101",
      promptValue: "Minolta SRT-101",
      category: "cameras"
    },
    {
      id: "nikon-f2",
      label: "Nikon F2",
      promptValue: "Nikon F2",
      category: "cameras"
    },
    {
      id: "nikon-fm2",
      label: "Nikon FM2",
      promptValue: "Nikon FM2",
      category: "cameras"
    },
    {
      id: "olympus-om-1",
      label: "Olympus OM-1",
      promptValue: "Olympus OM-1",
      category: "cameras"
    },
    {
      id: "pentax-k1000",
      label: "Pentax K1000",
      promptValue: "Pentax K1000",
      category: "cameras"
    },
    {
      id: "polaroid-600",
      label: "Polaroid 600",
      promptValue: "Polaroid 600",
      category: "cameras"
    },
    {
      id: "polaroid-sx-70",
      label: "Polaroid SX-70",
      promptValue: "Polaroid SX-70",
      category: "cameras"
    },
    {
      id: "rolleiflex",
      label: "Rolleiflex",
      promptValue: "Rolleiflex",
      category: "cameras"
    },
    {
      id: "yashica-t4",
      label: "Yashica T4",
      promptValue: "Yashica T4",
      category: "cameras"
    },
    {
      id: "zenit-e",
      label: "Zenit-E",
      promptValue: "Zenit-E",
      category: "cameras"
    },
    {
      id: "compact-camera",
      label: "Compact camera",
      promptValue: "early 2000s compact digital camera with deep depth of field, cool white balance, and plastic skin tones",
      category: "cameras"
    },
    {
      id: "doorbell-cam",
      label: "Doorbell cam",
      promptValue: "doorbell security camera",
      category: "cameras"
    },
    {
      id: "iphone-pro",
      label: "iPhone Pro",
      promptValue: "modern iPhone Pro camera",
      category: "cameras"
    },
    {
      id: "old-android-phone",
      label: "Old android phone",
      promptValue: "early Android smartphone camera with aggressive noise reduction, soft detail, flattened contrast, and dull colors",
      category: "cameras"
    },
    {
      id: "security-camera",
      label: "Security camera",
      promptValue: "low-resolution security camera",
      category: "cameras"
    },
    {
      id: "webcam",
      label: "Webcam",
      promptValue: "modern 1080p webcam",
      category: "cameras"
    }
  ],
  focalLengths: [
    {
      id: "8mm-fisheye",
      label: "8mm Fisheye",
      promptValue: "8mm Fisheye",
      category: "focalLengths"
    },
    {
      id: "14mm-ultra-wide",
      label: "14mm Ultra Wide",
      promptValue: "14mm Ultra Wide",
      category: "focalLengths"
    },
    {
      id: "24mm-wide-angle",
      label: "24mm Wide Angle",
      promptValue: "24mm Wide Angle",
      category: "focalLengths"
    },
    {
      id: "35mm-wide",
      label: "35mm Wide",
      promptValue: "35mm Wide",
      category: "focalLengths"
    },
    {
      id: "50mm-standard",
      label: "50mm Standard",
      promptValue: "50mm Standard",
      category: "focalLengths"
    },
    {
      id: "85mm-portrait",
      label: "85mm Portrait",
      promptValue: "85mm Portrait",
      category: "focalLengths"
    },
    {
      id: "100mm-macro",
      label: "100mm Macro",
      promptValue: "100mm Macro",
      category: "focalLengths"
    },
    {
      id: "200mm-super-telephoto",
      label: "200mm Super Telephoto",
      promptValue: "200mm Super Telephoto",
      category: "focalLengths"
    },
    {
      id: "300mm-extreme-telephoto",
      label: "300mm Extreme Telephoto",
      promptValue: "300mm Extreme Telephoto",
      category: "focalLengths"
    }
  ],
  lenses: [
    {
      id: "anamorphic-cinema-lens",
      label: "Anamorphic Cinema Lens",
      promptValue: "Anamorphic Cinema Lens",
      category: "lenses"
    },
    {
      id: "catadioptric-mirror-lens",
      label: "Catadioptric (Mirror) Lens",
      promptValue: "Catadioptric (Mirror) Lens",
      category: "lenses"
    },
    {
      id: "fisheye-lens",
      label: "Fisheye Lens",
      promptValue: "Fisheye Lens",
      category: "lenses"
    },
    {
      id: "helios-44-2-swirly-bokeh",
      label: "Helios 44-2 Swirly Bokeh",
      promptValue: "Helios 44-2 Swirly Bokeh",
      category: "lenses"
    },
    {
      id: "holga-style-lens",
      label: "Holga Style Lens",
      promptValue: "Holga Style Lens",
      category: "lenses"
    },
    {
      id: "lensbaby-selective-focus",
      label: "Lensbaby / Selective Focus",
      promptValue: "Lensbaby / Selective Focus",
      category: "lenses"
    },
    {
      id: "macro-lens",
      label: "Macro Lens",
      promptValue: "Macro Lens",
      category: "lenses"
    },
    {
      id: "petzval-portrait-lens",
      label: "Petzval Portrait Lens",
      promptValue: "Petzval Portrait Lens",
      category: "lenses"
    },
    {
      id: "soft-focus-portrait-lens",
      label: "Soft-Focus Portrait Lens",
      promptValue: "Soft-Focus Portrait Lens",
      category: "lenses"
    },
    {
      id: "tilt-shift-lens",
      label: "Tilt-Shift Lens",
      promptValue: "Tilt-Shift Lens",
      category: "lenses"
    },
    {
      id: "toy-plastic-lens",
      label: "Toy Plastic Lens",
      promptValue: "Toy Plastic Lens",
      category: "lenses"
    },
    {
      id: "voigtl-nder-nokton-50mm-f1",
      label: "Voigtländer Nokton 50mm f1",
      promptValue: "Voigtländer Nokton 50mm f1",
      category: "lenses"
    }
  ],
  filmStocks: [
    {
      id: "agfa-vista",
      label: "Agfa Vista",
      promptValue: "Agfa Vista",
      category: "filmStocks"
    },
    {
      id: "cinestill-50d",
      label: "Cinestill 50D",
      promptValue: "Cinestill 50D",
      category: "filmStocks"
    },
    {
      id: "cinestill-800t",
      label: "Cinestill 800T",
      promptValue: "Cinestill 800T",
      category: "filmStocks"
    },
    {
      id: "ektachrome-e100",
      label: "Ektachrome E100",
      promptValue: "Ektachrome E100",
      category: "filmStocks"
    },
    {
      id: "ektar-100",
      label: "Ektar 100",
      promptValue: "Ektar 100",
      category: "filmStocks"
    },
    {
      id: "fuji-acros-100",
      label: "Fuji Acros 100",
      promptValue: "Fuji Acros 100",
      category: "filmStocks"
    },
    {
      id: "fuji-pro-400h",
      label: "Fuji Pro 400H",
      promptValue: "Fuji Pro 400H",
      category: "filmStocks"
    },
    {
      id: "fuji-superia-400",
      label: "Fuji Superia 400",
      promptValue: "Fuji Superia 400",
      category: "filmStocks"
    },
    {
      id: "fujicolor-pro",
      label: "Fujicolor Pro",
      promptValue: "Fujicolor Pro",
      category: "filmStocks"
    },
    {
      id: "ilford-delta",
      label: "Ilford Delta",
      promptValue: "Ilford Delta",
      category: "filmStocks"
    },
    {
      id: "ilford-hp5-plus",
      label: "Ilford HP5 Plus",
      promptValue: "Ilford HP5 Plus",
      category: "filmStocks"
    },
    {
      id: "ilford-xp2-super",
      label: "Ilford XP2 Super",
      promptValue: "Ilford XP2 Super",
      category: "filmStocks"
    },
    {
      id: "kodachrome-64",
      label: "Kodachrome 64",
      promptValue: "Kodachrome 64",
      category: "filmStocks"
    },
    {
      id: "kodak-gold-200",
      label: "Kodak Gold 200",
      promptValue: "Kodak Gold 200",
      category: "filmStocks"
    },
    {
      id: "kodak-tri-x-400",
      label: "Kodak Tri-X 400",
      promptValue: "Kodak Tri-X 400",
      category: "filmStocks"
    },
    {
      id: "kodak-ultramax-400",
      label: "Kodak UltraMax 400",
      promptValue: "Kodak UltraMax 400",
      category: "filmStocks"
    },
    {
      id: "kodak-vision3-500t",
      label: "Kodak Vision3 500T",
      promptValue: "Kodak Vision3 500T",
      category: "filmStocks"
    },
    {
      id: "kodak-vision3-imax",
      label: "Kodak Vision3 IMAX",
      promptValue: "Kodak Vision3 IMAX",
      category: "filmStocks"
    },
    {
      id: "lomochrome-metropolis",
      label: "LomoChrome Metropolis",
      promptValue: "LomoChrome Metropolis",
      category: "filmStocks"
    },
    {
      id: "lomochrome-turquoise",
      label: "LomoChrome Turquoise",
      promptValue: "LomoChrome Turquoise",
      category: "filmStocks"
    },
    {
      id: "lomography-berlin-kino-b-w",
      label: "Lomography Berlin Kino B&W",
      promptValue: "Lomography Berlin Kino B&W",
      category: "filmStocks"
    },
    {
      id: "lomography-color-tiger",
      label: "Lomography Color Tiger",
      promptValue: "Lomography Color Tiger",
      category: "filmStocks"
    },
    {
      id: "lomography-lady-grey-400",
      label: "Lomography Lady Grey 400",
      promptValue: "Lomography Lady Grey 400",
      category: "filmStocks"
    },
    {
      id: "lomography-lobster-redscale",
      label: "Lomography Lobster Redscale",
      promptValue: "Lomography Lobster Redscale",
      category: "filmStocks"
    },
    {
      id: "lomography-purple",
      label: "Lomography Purple",
      promptValue: "Lomography Purple",
      category: "filmStocks"
    },
    {
      id: "portra-160",
      label: "Portra 160",
      promptValue: "Portra 160",
      category: "filmStocks"
    },
    {
      id: "portra-400",
      label: "Portra 400",
      promptValue: "Portra 400",
      category: "filmStocks"
    },
    {
      id: "portra-800",
      label: "Portra 800",
      promptValue: "Portra 800",
      category: "filmStocks"
    },
    {
      id: "provia-100f",
      label: "Provia 100F",
      promptValue: "Provia 100F",
      category: "filmStocks"
    },
    {
      id: "velvia-100",
      label: "Velvia 100",
      promptValue: "Velvia 100",
      category: "filmStocks"
    }
  ],
  genres: [
    {
      id: "abstract",
      label: "Abstract",
      promptValue: "Abstract",
      category: "genres"
    },
    {
      id: "action-photography",
      label: "Action Photography",
      promptValue: "Action Photography",
      category: "genres"
    },
    {
      id: "aerial-photography",
      label: "Aerial Photography",
      promptValue: "Aerial Photography",
      category: "genres"
    },
    {
      id: "analog",
      label: "Analog",
      promptValue: "Analog",
      category: "genres"
    },
    {
      id: "architecture",
      label: "Architecture",
      promptValue: "Architecture",
      category: "genres"
    },
    {
      id: "astrophotography",
      label: "Astrophotography",
      promptValue: "Astrophotography",
      category: "genres"
    },
    {
      id: "automotive",
      label: "Automotive",
      promptValue: "Automotive",
      category: "genres"
    },
    {
      id: "beauty",
      label: "Beauty",
      promptValue: "Beauty",
      category: "genres"
    },
    {
      id: "boudoir-photography",
      label: "Boudoir Photography",
      promptValue: "Boudoir Photography",
      category: "genres"
    },
    {
      id: "candid",
      label: "Candid",
      promptValue: "Candid",
      category: "genres"
    },
    {
      id: "cityscape-photography",
      label: "Cityscape Photography",
      promptValue: "Cityscape Photography",
      category: "genres"
    },
    {
      id: "conceptual-photography",
      label: "Conceptual Photography",
      promptValue: "Conceptual Photography",
      category: "genres"
    },
    {
      id: "documentary",
      label: "Documentary",
      promptValue: "Documentary",
      category: "genres"
    },
    {
      id: "double-exposure",
      label: "Double Exposure",
      promptValue: "Double Exposure",
      category: "genres"
    },
    {
      id: "drone-photography",
      label: "Drone Photography",
      promptValue: "Drone Photography",
      category: "genres"
    },
    {
      id: "editorial",
      label: "Editorial",
      promptValue: "Editorial",
      category: "genres"
    },
    {
      id: "environmental-portrait",
      label: "Environmental Portrait",
      promptValue: "Environmental Portrait",
      category: "genres"
    },
    {
      id: "event-photography",
      label: "Event Photography",
      promptValue: "Event Photography",
      category: "genres"
    },
    {
      id: "experimental",
      label: "Experimental",
      promptValue: "Experimental",
      category: "genres"
    },
    {
      id: "family-photography",
      label: "Family Photography",
      promptValue: "Family Photography",
      category: "genres"
    },
    {
      id: "fine-art",
      label: "Fine Art",
      promptValue: "Fine Art",
      category: "genres"
    },
    {
      id: "food",
      label: "Food",
      promptValue: "Food",
      category: "genres"
    },
    {
      id: "glamour",
      label: "Glamour",
      promptValue: "Glamour",
      category: "genres"
    },
    {
      id: "high-fashion",
      label: "High Fashion",
      promptValue: "High Fashion",
      category: "genres"
    },
    {
      id: "instant",
      label: "Instant",
      promptValue: "Instant",
      category: "genres"
    },
    {
      id: "landscape",
      label: "Landscape",
      promptValue: "Landscape",
      category: "genres"
    },
    {
      id: "large-format",
      label: "Large Format",
      promptValue: "Large Format",
      category: "genres"
    },
    {
      id: "lomo-style",
      label: "Lomo Style",
      promptValue: "Lomo Style",
      category: "genres"
    },
    {
      id: "macro",
      label: "Macro",
      promptValue: "Macro",
      category: "genres"
    },
    {
      id: "minimalist",
      label: "Minimalist",
      promptValue: "Minimalist",
      category: "genres"
    },
    {
      id: "modernist",
      label: "Modernist",
      promptValue: "Modernist",
      category: "genres"
    },
    {
      id: "nature-photography",
      label: "Nature Photography",
      promptValue: "Nature Photography",
      category: "genres"
    },
    {
      id: "newborn-photography",
      label: "Newborn Photography",
      promptValue: "Newborn Photography",
      category: "genres"
    },
    {
      id: "night-photography",
      label: "Night Photography",
      promptValue: "Night Photography",
      category: "genres"
    },
    {
      id: "paparazzi",
      label: "Paparazzi",
      promptValue: "Paparazzi",
      category: "genres"
    },
    {
      id: "photojournalism",
      label: "Photojournalism",
      promptValue: "Photojournalism",
      category: "genres"
    },
    {
      id: "pictorialist",
      label: "Pictorialist",
      promptValue: "Pictorialist",
      category: "genres"
    },
    {
      id: "pinhole",
      label: "Pinhole",
      promptValue: "Pinhole",
      category: "genres"
    },
    {
      id: "portrait",
      label: "Portrait",
      promptValue: "Portrait",
      category: "genres"
    },
    {
      id: "product",
      label: "Product",
      promptValue: "Product",
      category: "genres"
    },
    {
      id: "reportage",
      label: "Reportage",
      promptValue: "Reportage",
      category: "genres"
    },
    {
      id: "seascape-photography",
      label: "Seascape Photography",
      promptValue: "Seascape Photography",
      category: "genres"
    },
    {
      id: "sports",
      label: "Sports",
      promptValue: "Sports",
      category: "genres"
    },
    {
      id: "still-life",
      label: "Still Life",
      promptValue: "Still Life",
      category: "genres"
    },
    {
      id: "street-fashion",
      label: "Street Fashion",
      promptValue: "Street Fashion",
      category: "genres"
    },
    {
      id: "street-photography",
      label: "Street Photography",
      promptValue: "Street Photography",
      category: "genres"
    },
    {
      id: "surrealism",
      label: "Surrealism",
      promptValue: "Surrealism",
      category: "genres"
    },
    {
      id: "tintype",
      label: "Tintype",
      promptValue: "Tintype",
      category: "genres"
    },
    {
      id: "travel-photography",
      label: "Travel Photography",
      promptValue: "Travel Photography",
      category: "genres"
    },
    {
      id: "underwater-photography",
      label: "Underwater Photography",
      promptValue: "Underwater Photography",
      category: "genres"
    },
    {
      id: "urban-exploration",
      label: "Urban Exploration",
      promptValue: "Urban Exploration",
      category: "genres"
    },
    {
      id: "wedding-photography",
      label: "Wedding Photography",
      promptValue: "Wedding Photography",
      category: "genres"
    },
    {
      id: "wildlife",
      label: "Wildlife",
      promptValue: "Wildlife",
      category: "genres"
    }
  ],
  photographers: [
    {
      id: "7th-era",
      label: "7th Era",
      promptValue: "In the style of photographer 7th Era, cinematic street, long exposure light glow, high contrast, moody haze",
      category: "photographers"
    },
    {
      id: "alberto-seveso",
      label: "Alberto Seveso",
      promptValue: "In the style of photographer Alberto Seveso, ink in water textures, vibrant color clouds, surreal composites",
      category: "photographers"
    },
    {
      id: "alec-soth",
      label: "Alec Soth",
      promptValue: "In the style of photographer Alec Soth, quiet Americana, soft natural light, subdued color, large format calm",
      category: "photographers"
    },
    {
      id: "alen-palander",
      label: "Alen Palander",
      promptValue: "In the style of photographer Alen Palander, documentary feel, muted palette, natural light, teal and orange,candid moments",
      category: "photographers"
    },
    {
      id: "alex-strohl",
      label: "Alex Strohl",
      promptValue: "In the style of photographer Alex Strohl, outdoor portraits, pastel tones, soft light, shallow depth of field",
      category: "photographers"
    },
    {
      id: "alex-webb",
      label: "Alex Webb",
      promptValue: "In the style of photographer Alex Webb, layered street scenes, saturated color, strong shadows, complex framing",
      category: "photographers"
    },
    {
      id: "alfred-stieglitz",
      label: "Alfred Stieglitz",
      promptValue: "In the style of photographer Alfred Stieglitz, early modernist, soft tonal range, atmospheric light, classic composition",
      category: "photographers"
    },
    {
      id: "ando-fuchs",
      label: "Ando Fuchs",
      promptValue: "In the style of photographer Ando Fuchs, Black and White, shadow play, negative space, crushed blacks, overexposed whites, ominous framing, heavy image noise",
      category: "photographers"
    },
    {
      id: "andreas-gursky",
      label: "Andreas Gursky",
      promptValue: "In the style of photographer Andreas Gursky, large scale, elevated perspective, crisp detail, repeating patterns in environments",
      category: "photographers"
    },
    {
      id: "anne-brigman",
      label: "Anne Brigman",
      promptValue: "In the style of photographer Anne Brigman, pictorialist, soft focus, ethereal light, staged naturalism",
      category: "photographers"
    },
    {
      id: "annie-leibovitz",
      label: "Annie Leibovitz",
      promptValue: "In the style of photographer Annie Leibovitz, editorial portraits, dramatic lighting, rich color, styled staging",
      category: "photographers"
    },
    {
      id: "ansel-adams",
      label: "Ansel Adams",
      promptValue: "In the style of photographer Ansel Adams, Black and White, high contrast, crisp detail, grand landscapes",
      category: "photographers"
    },
    {
      id: "august-sander",
      label: "August Sander",
      promptValue: "In the style of photographer August Sander, Black and White, straight portraits, neutral light, formal composition, documentary tone",
      category: "photographers"
    },
    {
      id: "barbara-kruger",
      label: "Barbara Kruger",
      promptValue: "In the style of photographer Barbara Kruger, graphic typography overlays, bold contrast, conceptual framing",
      category: "photographers"
    },
    {
      id: "benjamin-hardman",
      label: "Benjamin Hardman",
      promptValue: "In the style of photographer Benjamin Hardman, muted arctic palette, soft light, minimalist landscapes, cold tones",
      category: "photographers"
    },
    {
      id: "bernd-and-hilla-becher",
      label: "Bernd and Hilla Becher",
      promptValue: "In the style of photographer Bernd and Hilla Becher, typologies, flat light, frontal framing, industrial grids",
      category: "photographers"
    },
    {
      id: "bill-brandt",
      label: "Bill Brandt",
      promptValue: "In the style of photographer Bill Brandt, Black and White, high contrast, sculptural light, dramatic shadows",
      category: "photographers"
    },
    {
      id: "brandon-woelfel",
      label: "Brandon Woelfel",
      promptValue: "In the style of photographer Brandon Woelfel, bokeh, dreamy glow, pastel color, light leaks",
      category: "photographers"
    },
    {
      id: "bryan-schutmaat",
      label: "Bryan Schutmaat",
      promptValue: "In the style of photographer Bryan Schutmaat, western Americana, natural light, faded color, quiet portraits",
      category: "photographers"
    },
    {
      id: "chris-burkard",
      label: "Chris Burkard",
      promptValue: "In the style of photographer Chris Burkard, adventure landscapes, golden light, crisp detail, cool tones",
      category: "photographers"
    },
    {
      id: "chris-friel",
      label: "Chris Friel",
      promptValue: "In the style of photographer Chris Friel, moody landscapes, fog and mist, muted color, soft contrast, motion blur",
      category: "photographers"
    },
    {
      id: "chris-hau",
      label: "Chris Hau",
      promptValue: "In the style of photographer Chris Hau, travel cityscapes, clean color, cinematic light, wide angles, long exposure light trails",
      category: "photographers"
    },
    {
      id: "cindy-sherman",
      label: "Cindy Sherman",
      promptValue: "In the style of photographer Cindy Sherman, staged self portrait, cinematic lighting, character transformation",
      category: "photographers"
    },
    {
      id: "daido-moriyama",
      label: "Daido Moriyama",
      promptValue: "In the style of photographer Daido Moriyama, Black and White, high grain, high contrast, raw street energy",
      category: "photographers"
    },
    {
      id: "daniel-schiffer",
      label: "Daniel Schiffer",
      promptValue: "In the style of photographer Daniel Schiffer, product detail, hard light, glossy highlights, shallow depth of field",
      category: "photographers"
    },
    {
      id: "david-lachapelle",
      label: "David LaChapelle",
      promptValue: "In the style of photographer David LaChapelle, hyper saturated color, glossy lighting, surreal staging",
      category: "photographers"
    },
    {
      id: "david-yarrow",
      label: "David Yarrow",
      promptValue: "In the style of photographer David Yarrow, Black and White, dramatic wildlife, sharp detail, high contrast",
      category: "photographers"
    },
    {
      id: "dorothea-lange",
      label: "Dorothea Lange",
      promptValue: "In the style of photographer Dorothea Lange, Black and White, documentary portrait, natural light, empathetic framing, soft grain",
      category: "photographers"
    },
    {
      id: "dylan-furst",
      label: "Dylan Furst",
      promptValue: "In the style of photographer Dylan Furst, cinematic, blue and green desaturated tones, shallow depth of field",
      category: "photographers"
    },
    {
      id: "elliott-erwitt",
      label: "Elliott Erwitt",
      promptValue: "In the style of photographer Elliott Erwitt, Black and White, candid humor, decisive moments, often contains a dog, simple framing",
      category: "photographers"
    },
    {
      id: "eug-ne-atget",
      label: "Eugène Atget",
      promptValue: "In the style of photographer Eugène Atget, Black and White, early street scenes, soft light, quiet architecture, nostalgic tone",
      category: "photographers"
    },
    {
      id: "fan-ho",
      label: "Fan Ho",
      promptValue: "In the style of photographer Fan Ho, Black and White, shafted light, silhouettes, strong geometry",
      category: "photographers"
    },
    {
      id: "garry-winogrand",
      label: "Garry Winogrand",
      promptValue: "In the style of photographer Garry Winogrand, Black and White, gritty street, wide angle, candid chaos",
      category: "photographers"
    },
    {
      id: "george-hurrell",
      label: "George Hurrell",
      promptValue: "In the style of photographer George Hurrell, Black and White, Hollywood glamour, hard light, glossy highlights, classic portrait",
      category: "photographers"
    },
    {
      id: "germaine-krull",
      label: "Germaine Krull",
      promptValue: "In the style of photographer Germaine Krull, Black and White, modernist angles, industrial subjects, stark contrast, dynamic framing",
      category: "photographers"
    },
    {
      id: "gregory-crewdson",
      label: "Gregory Crewdson",
      promptValue: "In the style of photographer Gregory Crewdson, cinematic tableau, controlled lighting, suburban surrealism",
      category: "photographers"
    },
    {
      id: "guy-bourdin",
      label: "Guy Bourdin",
      promptValue: "In the style of photographer Guy Bourdin, bold color, provocative fashion, strong shadows, saturated sets",
      category: "photographers"
    },
    {
      id: "hans-bellmer",
      label: "Hans Bellmer",
      promptValue: "In the style of photographer Hans Bellmer, surreal dolls, unsettling staging, muted tones, stark lighting",
      category: "photographers"
    },
    {
      id: "helmut-newton",
      label: "Helmut Newton",
      promptValue: "In the style of photographer Helmut Newton, Black and White, high fashion, hard light, provocative poses",
      category: "photographers"
    },
    {
      id: "henri-cartier-bresson",
      label: "Henri Cartier-Bresson",
      promptValue: "In the style of photographer Henri Cartier-Bresson, Black and White, decisive moment, candid street, balanced composition",
      category: "photographers"
    },
    {
      id: "herb-ritts",
      label: "Herb Ritts",
      promptValue: "In the style of photographer Herb Ritts, clean fashion portrait, hard light, sculptural bodies, high contrast",
      category: "photographers"
    },
    {
      id: "hiroshi-sugimoto",
      label: "Hiroshi Sugimoto",
      promptValue: "In the style of photographer Hiroshi Sugimoto, minimalist seascapes, long exposure, smooth tones, serene mood",
      category: "photographers"
    },
    {
      id: "irene-rudnyk",
      label: "Irene Rudnyk",
      promptValue: "In the style of photographer Irene Rudnyk, natural light portrait, warm tones, soft shadows, lifestyle feel",
      category: "photographers"
    },
    {
      id: "james-bidgood",
      label: "James Bidgood",
      promptValue: "In the style of photographer James Bidgood, saturated color, theatrical sets, soft focus, surreal fantasy",
      category: "photographers"
    },
    {
      id: "jeff-wall",
      label: "Jeff Wall",
      promptValue: "In the style of photographer Jeff Wall, large scale tableau, cinematic lighting, staged realism",
      category: "photographers"
    },
    {
      id: "jerry-uelsmann",
      label: "Jerry Uelsmann",
      promptValue: "In the style of photographer Jerry Uelsmann, darkroom composites, surreal landscapes, Black and White",
      category: "photographers"
    },
    {
      id: "jord-hammond",
      label: "Jord Hammond",
      promptValue: "In the style of photographer Jord Hammond, moody outdoor portrait, golden light, soft color, shallow depth",
      category: "photographers"
    },
    {
      id: "jordi-koalitic",
      label: "Jordi Koalitic",
      promptValue: "In the style of photographer Jordi Koalitic, mobile photo tricks, strong symmetry, bright color, clean lines",
      category: "photographers"
    },
    {
      id: "juergen-teller",
      label: "Juergen Teller",
      promptValue: "In the style of photographer Juergen Teller, flash snapshot, raw fashion, casual framing, harsh light",
      category: "photographers"
    },
    {
      id: "julia-trotti",
      label: "Julia Trotti",
      promptValue: "In the style of photographer Julia Trotti, soft pastel portraits, natural light, airy tones, shallow depth",
      category: "photographers"
    },
    {
      id: "kim-keever",
      label: "Kim Keever",
      promptValue: "In the style of photographer Kim Keever, abstract landscapes, pigment in water, soft focus, dreamy color",
      category: "photographers"
    },
    {
      id: "l-szl-moholy-nagy",
      label: "László Moholy-Nagy",
      promptValue: "In the style of photographer László Moholy-Nagy, modernist abstraction, experimental angles, high contrast",
      category: "photographers"
    },
    {
      id: "lee-friedlander",
      label: "Lee Friedlander",
      promptValue: "In the style of photographer Lee Friedlander, Black and White, busy frames, use of reflections, street layers",
      category: "photographers"
    },
    {
      id: "liam-wong",
      label: "Liam Wong",
      promptValue: "In the style of photographer Liam Wong, subtle neon city night, rain reflections, pink and purple colors, moody haze",
      category: "photographers"
    },
    {
      id: "lotte-reiniger",
      label: "Lotte Reiniger",
      promptValue: "In the style of photographer Lotte Reiniger, silhouette style, stark contrast, graphic shapes, theatrical framing",
      category: "photographers"
    },
    {
      id: "man-ray",
      label: "Man Ray",
      promptValue: "In the style of photographer Man Ray, surreal experiments, black and white solarized look, studio abstraction, high contrast",
      category: "photographers"
    },
    {
      id: "mango-street",
      label: "Mango Street",
      promptValue: "In the style of photographer Mango Street, clean fashion portrait, bright color, studio light, crisp detail",
      category: "photographers"
    },
    {
      id: "manny-ortiz",
      label: "Manny Ortiz",
      promptValue: "In the style of photographer Manny Ortiz, off camera flash, studio portraits, outdoor fashion, warm skin tones, soft bokeh",
      category: "photographers"
    },
    {
      id: "martin-schoeller",
      label: "Martin Schoeller",
      promptValue: "In the style of photographer Martin Schoeller, tight headshots, even light, high detail, neutral background",
      category: "photographers"
    },
    {
      id: "mary-ellen-mark",
      label: "Mary Ellen Mark",
      promptValue: "In the style of photographer Mary Ellen Mark, documentary portrait, natural light, compassionate realism",
      category: "photographers"
    },
    {
      id: "michael-kenna",
      label: "Michael Kenna",
      promptValue: "In the style of photographer Michael Kenna, Black and White, minimalist landscapes, long exposure, soft tones",
      category: "photographers"
    },
    {
      id: "mickalene-thomas",
      label: "Mickalene Thomas",
      promptValue: "In the style of photographer Mickalene Thomas, bold patterns, rich color, staged portrait, mixed media feel",
      category: "photographers"
    },
    {
      id: "miko-lagerstedt",
      label: "Miko Lagerstedt",
      promptValue: "In the style of photographer Miko Lagerstedt, moody landscapes, mist and fog, cool tones, soft contrast",
      category: "photographers"
    },
    {
      id: "miles-aldridge",
      label: "Miles Aldridge",
      promptValue: "In the style of photographer Miles Aldridge, hyper saturated color, glossy fashion, stylized sets",
      category: "photographers"
    },
    {
      id: "misha-gordin",
      label: "Misha Gordin",
      promptValue: "In the style of photographer Misha Gordin, surreal portrait, geometric framing, muted tones, staged minimalism",
      category: "photographers"
    },
    {
      id: "nadav-kander",
      label: "Nadav Kander",
      promptValue: "In the style of photographer Nadav Kander, atmospheric portraits, muted palette, soft haze, cinematic light",
      category: "photographers"
    },
    {
      id: "nan-goldin",
      label: "Nan Goldin",
      promptValue: "In the style of photographer Nan Goldin, intimate snapshot, low light, raw color, candid emotion",
      category: "photographers"
    },
    {
      id: "nathan-wirth",
      label: "Nathan Wirth",
      promptValue: "In the style of photographer Nathan Wirth, moody cinematic portrait, shallow depth, soft light, subdued color",
      category: "photographers"
    },
    {
      id: "nick-knight",
      label: "Nick Knight",
      promptValue: "In the style of photographer Nick Knight, experimental fashion, bold color, innovative lighting, bold styling",
      category: "photographers"
    },
    {
      id: "northborders",
      label: "Northborders",
      promptValue: "In the style of photographer Northborders, mobile travel, vibrant color, moody skies, clean composition",
      category: "photographers"
    },
    {
      id: "oleg-oprisco",
      label: "Oleg Oprisco",
      promptValue: "In the style of photographer Oleg Oprisco, fine art portrait, pastel tones, stylized props, surreal mood",
      category: "photographers"
    },
    {
      id: "paolo-roversi",
      label: "Paolo Roversi",
      promptValue: "In the style of photographer Paolo Roversi, soft focus, romantic portrait, muted color, gentle light",
      category: "photographers"
    },
    {
      id: "peter-lindbergh",
      label: "Peter Lindbergh",
      promptValue: "In the style of photographer Peter Lindbergh, Black and White, natural light, candid fashion, soft grain",
      category: "photographers"
    },
    {
      id: "peter-mckinnon",
      label: "Peter McKinnon",
      promptValue: "In the style of photographer Peter McKinnon, cinematic travel, teal and orange, crisp detail, moody contrast",
      category: "photographers"
    },
    {
      id: "philip-lorca-dicorcia",
      label: "Philip-Lorca diCorcia",
      promptValue: "In the style of photographer Philip-Lorca diCorcia, street with flash, staged candid, high contrast, cinematic color",
      category: "photographers"
    },
    {
      id: "platon",
      label: "Platon",
      promptValue: "In the style of photographer Platon, dramatic portrait, strong key light, textured skin, close framing",
      category: "photographers"
    },
    {
      id: "rankin",
      label: "Rankin",
      promptValue: "In the style of photographer Rankin, glossy fashion, bold color, punchy contrast, studio light",
      category: "photographers"
    },
    {
      id: "r-hahn",
      label: "Réhahn",
      promptValue: "In the style of photographer Réhahn, travel portrait, rich color, natural light, cultural storytelling",
      category: "photographers"
    },
    {
      id: "reuben-wu",
      label: "Reuben Wu",
      promptValue: "In the style of photographer Reuben Wu, light painted landscapes, night scenes, moody atmosphere",
      category: "photographers"
    },
    {
      id: "richard-avedon",
      label: "Richard Avedon",
      promptValue: "In the style of photographer Richard Avedon, high key portraits, clean background, crisp detail, direct gaze",
      category: "photographers"
    },
    {
      id: "rinko-kawauchi",
      label: "Rinko Kawauchi",
      promptValue: "In the style of photographer Rinko Kawauchi, soft light, pastel tones, poetic everyday, airy mood",
      category: "photographers"
    },
    {
      id: "robert-capa",
      label: "Robert Capa",
      promptValue: "In the style of photographer Robert Capa, conflict reportage, gritty grain, high contrast, candid action",
      category: "photographers"
    },
    {
      id: "robert-frank",
      label: "Robert Frank",
      promptValue: "In the style of photographer Robert Frank, Black and White, raw street, loose framing, grainy texture",
      category: "photographers"
    },
    {
      id: "saul-leiter",
      label: "Saul Leiter",
      promptValue: "In the style of photographer Saul Leiter, color street, view through glass, reflections, muted palette, soft focus",
      category: "photographers"
    },
    {
      id: "sebasti-o-salgado",
      label: "Sebastião Salgado",
      promptValue: "In the style of photographer Sebastião Salgado, Black and White, dramatic light, high contrast, epic documentary",
      category: "photographers"
    },
    {
      id: "sorelle-amore",
      label: "Sorelle Amore",
      promptValue: "In the style of photographer Sorelle Amore, adventure portrait, warm tones, golden light, candid feel",
      category: "photographers"
    },
    {
      id: "stephen-shore",
      label: "Stephen Shore",
      promptValue: "In the style of photographer Stephen Shore, color documentary, everyday scenes, balanced composition, neutral light",
      category: "photographers"
    },
    {
      id: "steve-mccurry",
      label: "Steve McCurry",
      promptValue: "In the style of photographer Steve McCurry, rich color, vivid portraits, strong eyes, natural light",
      category: "photographers"
    },
    {
      id: "thomas-struth",
      label: "Thomas Struth",
      promptValue: "In the style of photographer Thomas Struth, large format, groups of people, neutral light, architectural clarity, human scale",
      category: "photographers"
    },
    {
      id: "tim-walker",
      label: "Tim Walker",
      promptValue: "In the style of photographer Tim Walker, whimsical fashion, surreal sets, soft light, rich color",
      category: "photographers"
    },
    {
      id: "todd-hido",
      label: "Todd Hido",
      promptValue: "In the style of photographer Todd Hido, moody suburbs, night scenes, misty light, muted color",
      category: "photographers"
    },
    {
      id: "tyler-shields",
      label: "Tyler Shields",
      promptValue: "In the style of photographer Tyler Shields, high contrast, bold staging, cinematic portrait, edgy tone",
      category: "photographers"
    },
    {
      id: "vivian-maier",
      label: "Vivian Maier",
      promptValue: "In the style of photographer Vivian Maier, Black and White, street candid, sharp detail, reflective moments",
      category: "photographers"
    },
    {
      id: "w-eugene-smith",
      label: "W. Eugene Smith",
      promptValue: "In the style of photographer W. Eugene Smith, documentary essay, dramatic light, deep shadows, emotive portraits",
      category: "photographers"
    },
    {
      id: "walker-evans",
      label: "Walker Evans",
      promptValue: "In the style of photographer Walker Evans, straight documentary, neutral light, American vernacular, quiet tone",
      category: "photographers"
    },
    {
      id: "william-eggleston",
      label: "William Eggleston",
      promptValue: "In the style of photographer William Eggleston, color snapshot, everyday scenes, warm tones, simple framing",
      category: "photographers"
    },
    {
      id: "wolfgang-tillmans",
      label: "Wolfgang Tillmans",
      promptValue: "In the style of photographer Wolfgang Tillmans, casual documentary, soft light, experimental abstraction, muted color",
      category: "photographers"
    },
    {
      id: "yousuf-karsh",
      label: "Yousuf Karsh",
      promptValue: "In the style of photographer Yousuf Karsh, classic portrait, dramatic lighting, sculpted shadows, formal pose",
      category: "photographers"
    },
    {
      id: "zanele-muholi",
      label: "Zanele Muholi",
      promptValue: "In the style of photographer Zanele Muholi, Black and White, high contrast, direct gaze, activist portrait",
      category: "photographers"
    }
  ],
  movieLooks: [
    {
      id: "1917",
      label: "1917",
      promptValue: "With the visual aesthetic of the movie 1917 with muted khaki palette, smoky haze, soft contrast, subtle grain",
      category: "movieLooks"
    },
    {
      id: "2001-a-space-odyssey",
      label: "2001: A Space Odyssey",
      promptValue: "With the visual aesthetic of the movie 2001: A Space Odyssey with pristine retro-futurist design, minimalist symmetry and a clean 1960s large-format sci-fi look.",
      category: "movieLooks"
    },
    {
      id: "alien",
      label: "Alien",
      promptValue: "With the visual aesthetic of the movie Alien with cold industrial lighting, deep shadows, blue-green tint, heavy grain",
      category: "movieLooks"
    },
    {
      id: "am-lie",
      label: "Amélie",
      promptValue: "With the visual aesthetic of the movie Amélie with warm amber and green tones, whimsical glow, soft contrast",
      category: "movieLooks"
    },
    {
      id: "annihilation",
      label: "Annihilation",
      promptValue: "With the visual aesthetic of the movie Annihilation with prismatic color shifts, dreamy haze, ethereal glow, soft focus",
      category: "movieLooks"
    },
    {
      id: "apocalypse-now",
      label: "Apocalypse Now",
      promptValue: "With the visual aesthetic of the movie Apocalypse Now with gritty 1970s film texture, heavy atmosphere and surreal war-odyssey mood.",
      category: "movieLooks"
    },
    {
      id: "arrival",
      label: "Arrival",
      promptValue: "With the visual aesthetic of the movie Arrival with desaturated neutrals, foggy diffusion, low contrast, moody lighting",
      category: "movieLooks"
    },
    {
      id: "ash-vs-the-evil-dead",
      label: "Ash vs The Evil Dead",
      promptValue: "With the visual aesthetic of the movie Ash vs The Evil Dead with heavy film grain, warm color tones, dark environments, faint green in light highlights and a 1970s look",
      category: "movieLooks"
    },
    {
      id: "avatar",
      label: "Avatar",
      promptValue: "With the visual aesthetic of the movie Avatar with rich cyan and teal glow, high saturation, crisp detail",
      category: "movieLooks"
    },
    {
      id: "back-to-the-future",
      label: "Back to the Future",
      promptValue: "With the visual aesthetic of the movie Back to the Future with 1980s color pop, clean contrast, subtle film grain",
      category: "movieLooks"
    },
    {
      id: "beetlejuice",
      label: "Beetlejuice",
      promptValue: "With the visual aesthetic of the movie Beetlejuice with high contrast, gothic shadows, saturated blacks, quirky color accents",
      category: "movieLooks"
    },
    {
      id: "ben-hur-1959",
      label: "Ben-Hur (1959)",
      promptValue: "With the visual aesthetic of the movie Ben-Hur (1959) with grand historical spectacle, monumental sets and a rich 1950s Technicolor epic look.",
      category: "movieLooks"
    },
    {
      id: "black-hawk-down",
      label: "Black Hawk Down",
      promptValue: "With the visual aesthetic of the movie Black Hawk Down with dusty desaturation, harsh sunlight, handheld grit, high contrast",
      category: "movieLooks"
    },
    {
      id: "blade-runner",
      label: "Blade Runner",
      promptValue: "With the visual aesthetic of the movie Blade Runner with subtle incidental neon lights, reflections, deep shadows and a 1980s film neo noir look. ",
      category: "movieLooks"
    },
    {
      id: "blade-runner-2049",
      label: "Blade Runner 2049",
      promptValue: "With the visual aesthetic of the movie Blade Runner 2049 with amber desert tones, cyan shadows, clean contrast, minimal grain",
      category: "movieLooks"
    },
    {
      id: "casablanca",
      label: "Casablanca",
      promptValue: "With the visual aesthetic of the movie Casablanca with classic 1940s studio black-and-white glamour, soft facial key light and smoky atmosphere.",
      category: "movieLooks"
    },
    {
      id: "children-of-men",
      label: "Children of Men",
      promptValue: "With the visual aesthetic of the movie Children of Men with naturalistic light, muted palette, handheld realism, soft contrast",
      category: "movieLooks"
    },
    {
      id: "chinatown",
      label: "Chinatown",
      promptValue: "With the visual aesthetic of the movie Chinatown with warm golden tones, sun-bleached highlights, soft contrast, film grain",
      category: "movieLooks"
    },
    {
      id: "city-of-god",
      label: "City of God",
      promptValue: "With the visual aesthetic of the movie City of God with vibrant tropical colors, punchy contrast, sunlit warmth, lively saturation",
      category: "movieLooks"
    },
    {
      id: "cleopatra-1963",
      label: "Cleopatra (1963)",
      promptValue: "With the visual aesthetic of the movie Cleopatra (1963) with lavish set design, opulent costuming and a 1960s classic Technicolor look.",
      category: "movieLooks"
    },
    {
      id: "close-encounters-of-the-third-kind",
      label: "Close Encounters of the Third Kind",
      promptValue: "With the visual aesthetic of the movie Close Encounters of the Third Kind with grounded 1970s suburban realism and luminous, practical-effects sci-fi spectacle.",
      category: "movieLooks"
    },
    {
      id: "collateral",
      label: "Collateral",
      promptValue: "With the visual aesthetic of the movie Collateral with green blue interior light tones contrasted with tungsten street lighting, crisp digital sharpness, high contrast",
      category: "movieLooks"
    },
    {
      id: "conan-the-barbarian",
      label: "Conan the Barbarian",
      promptValue: "With the visual aesthetic of the movie Conan the Barbarian with warm earth tones, rugged grain, dramatic contrast, harsh light, with 1970s fantasy style",
      category: "movieLooks"
    },
    {
      id: "crouching-tiger-hidden-dragon",
      label: "Crouching Tiger, Hidden Dragon",
      promptValue: "With the visual aesthetic of the movie Crouching Tiger, Hidden Dragon with lush greens, misty diffusion, soft contrast, elegant color",
      category: "movieLooks"
    },
    {
      id: "dark-city",
      label: "Dark City",
      promptValue: "With the visual aesthetic of the movie Dark City with blue-gray highlights, heavy shadows, hard lighting, steam, smoke or mist",
      category: "movieLooks"
    },
    {
      id: "days-of-heaven",
      label: "Days of Heaven",
      promptValue: "With the visual aesthetic of the movie Days of Heaven with golden hour glow, soft highlights, warm film grain, pastel skies",
      category: "movieLooks"
    },
    {
      id: "district-9",
      label: "District 9",
      promptValue: "With the visual aesthetic of the movie District 9 with gritty handheld look, desaturated palette, documentary realism, dust haze",
      category: "movieLooks"
    },
    {
      id: "drive",
      label: "Drive",
      promptValue: "With the visual aesthetic of the movie Drive with neon pink and blue, glossy highlights, night glow, soft contrast",
      category: "movieLooks"
    },
    {
      id: "dune",
      label: "Dune",
      promptValue: "With the visual aesthetic of the movie Dune with sandy amber palette, high contrast, atmospheric haze, minimal grain",
      category: "movieLooks"
    },
    {
      id: "enter-the-void",
      label: "Enter the Void",
      promptValue: "With the visual aesthetic of the movie Enter the Void with psychedelic neon, intense saturation, glowing bloom, yellowish skin tones, high contrast",
      category: "movieLooks"
    },
    {
      id: "eraserhead",
      label: "Eraserhead",
      promptValue: "With the visual aesthetic of the movie Eraserhead with stark black and white, harsh lighting, heavy grain, deep shadows",
      category: "movieLooks"
    },
    {
      id: "fight-club",
      label: "Fight Club",
      promptValue: "With the visual aesthetic of the movie Fight Club with grimy greenish tint, low-key lighting, gritty grain, high contrast",
      category: "movieLooks"
    },
    {
      id: "full-metal-jacket",
      label: "Full Metal Jacket",
      promptValue: "With the visual aesthetic of the movie Full Metal Jacket with stark 1980s realism, cold institutional interiors and rigid, clinical framing.",
      category: "movieLooks"
    },
    {
      id: "game-of-thrones",
      label: "Game of Thrones",
      promptValue: "With the visual aesthetic of the movie Game of Thrones with muted medieval palette, moody shadows, natural light, soft grain",
      category: "movieLooks"
    },
    {
      id: "ghostbusters",
      label: "Ghostbusters",
      promptValue: "With the visual aesthetic of the movie Ghostbusters with 1980s color pop, crisp contrast, light haze, mild grain",
      category: "movieLooks"
    },
    {
      id: "gladiator",
      label: "Gladiator",
      promptValue: "With the visual aesthetic of the movie Gladiator with gritty historical realism, warm dusty tones and dramatic early-2000s cinematic contrast.",
      category: "movieLooks"
    },
    {
      id: "godzilla-minus-one",
      label: "Godzilla Minus One",
      promptValue: "With the visual aesthetic of the movie Godzilla Minus One with monochrome-leaning desaturation, smoky haze, high contrast, film grain",
      category: "movieLooks"
    },
    {
      id: "grease",
      label: "Grease",
      promptValue: "With the visual aesthetic of the movie Grease with bright pastel palette, glossy highlights, clean contrast, 1950s technicolor sheen",
      category: "movieLooks"
    },
    {
      id: "halloween",
      label: "Halloween",
      promptValue: "With the visual aesthetic of the movie Halloween with deep blacks, cool autumn tones, minimal light, suspenseful contrast",
      category: "movieLooks"
    },
    {
      id: "hereditary",
      label: "Hereditary",
      promptValue: "With the visual aesthetic of the movie Hereditary with dim interior lighting, brown-orange palette, heavy shadows, low contrast",
      category: "movieLooks"
    },
    {
      id: "hook",
      label: "Hook",
      promptValue: "With the visual aesthetic of the movie Hook with high saturation color, matte painted background plates, subtle film grain, gentle contrast.",
      category: "movieLooks"
    },
    {
      id: "in-the-mood-for-love",
      label: "In the Mood for Love",
      promptValue: "With the visual aesthetic of the movie In the Mood for Love with rich reds and greens, soft diffusion, romantic glow, fine grain",
      category: "movieLooks"
    },
    {
      id: "jaws",
      label: "Jaws",
      promptValue: "With the visual aesthetic of the movie Jaws with bright coastal realism and a tense 1970s thriller film look with natural daylight photography.",
      category: "movieLooks"
    },
    {
      id: "john-wick",
      label: "John Wick",
      promptValue: "With the visual aesthetic of the movie John Wick with neon-accented darkness, cool shadows, crisp contrast, sleek polish",
      category: "movieLooks"
    },
    {
      id: "joker",
      label: "Joker",
      promptValue: "With the visual aesthetic of the movie Joker with gritty texture, muted greens and yellows, heavy grain, harsh light",
      category: "movieLooks"
    },
    {
      id: "jurassic-park",
      label: "Jurassic Park",
      promptValue: "With the visual aesthetic of the movie Jurassic Park with naturalistic greens, humid haze, cinematic contrast, warm highlights",
      category: "movieLooks"
    },
    {
      id: "kill-bill-volume-1",
      label: "Kill Bill: Volume 1",
      promptValue: "With the visual aesthetic of the movie Kill Bill: Volume 1 with Technicolor palette with saturated primary colors, the lighting is high-contrast and hard, creating sharp, dramatic shadows. The image has a polished, glossy film look with fine grain, sharp focus, and a wide dynamic range.",
      category: "movieLooks"
    },
    {
      id: "king-kong-1933",
      label: "King Kong (1933)",
      promptValue: "With the visual aesthetic of the movie King Kong (1933) with vintage black-and-white adventure, classic studio lighting and old-Hollywood optical-effects texture.",
      category: "movieLooks"
    },
    {
      id: "la-la-land",
      label: "La La Land",
      promptValue: "With the visual aesthetic of the movie La La Land with technicolor palette, golden hour glow, clean contrast, dreamy polish",
      category: "movieLooks"
    },
    {
      id: "lawrence-of-arabia",
      label: "Lawrence of Arabia",
      promptValue: "With the visual aesthetic of the movie Lawrence of Arabia with sweeping widescreen desert vistas and a crisp 1960s large-format epic film look.",
      category: "movieLooks"
    },
    {
      id: "life-of-pi",
      label: "Life of Pi",
      promptValue: "With the visual aesthetic of the movie Life of Pi with vibrant jewel tones, luminous highlights, soft glow, clean contrast",
      category: "movieLooks"
    },
    {
      id: "lost-in-translation",
      label: "Lost in Translation",
      promptValue: "With the visual aesthetic of the movie Lost in Translation with muted neon nights, soft grain, cool shadows, gentle contrast",
      category: "movieLooks"
    },
    {
      id: "mad-max-fury-road",
      label: "Mad Max: Fury Road",
      promptValue: "With the visual aesthetic of the movie Mad Max: Fury Road with high-contrast desert palette, orange-teal split, dust haze, sharp detail",
      category: "movieLooks"
    },
    {
      id: "metropolis-1927",
      label: "Metropolis (1927)",
      promptValue: "With the visual aesthetic of the movie Metropolis (1927) with high-contrast monochrome, dramatic lighting, crisp geometry, film grain",
      category: "movieLooks"
    },
    {
      id: "midsommar",
      label: "Midsommar",
      promptValue: "With the visual aesthetic of the movie Midsommar with bright daylight, pastel warmth, soft shadows, airy diffusion",
      category: "movieLooks"
    },
    {
      id: "minority-report",
      label: "Minority Report",
      promptValue: "With the visual aesthetic of the movie Minority Report with cool blue-gray tint, high contrast, soft bloom, slick polish",
      category: "movieLooks"
    },
    {
      id: "monty-python-and-the-holy-grail",
      label: "Monty Python and the Holy Grail",
      promptValue: "With the visual aesthetic of the movie Monty Python and the Holy Grail with scrappy low-budget period comedy and a raw 1970s film look.",
      category: "movieLooks"
    },
    {
      id: "moonlight",
      label: "Moonlight",
      promptValue: "With the visual aesthetic of the movie Moonlight with deep blues and purples, soft glow, rich shadows, fine grain",
      category: "movieLooks"
    },
    {
      id: "no-country-for-old-men",
      label: "No Country for Old Men",
      promptValue: "With the visual aesthetic of the movie No Country for Old Men with sun-bleached neutrals, stark shadows, dry contrast, subdued palette",
      category: "movieLooks"
    },
    {
      id: "nope",
      label: "Nope",
      promptValue: "With the visual aesthetic of the movie Nope with natural dusk tones, deep sky blues, crisp contrast, subtle grain",
      category: "movieLooks"
    },
    {
      id: "nosferatu",
      label: "Nosferatu",
      promptValue: "With the visual aesthetic of the movie Nosferatu with silent-era monochrome, heavy vignetting, stark shadows, film grain",
      category: "movieLooks"
    },
    {
      id: "notting-hill",
      label: "Notting Hill",
      promptValue: "With the visual aesthetic of the movie Notting Hill with soft naturalism, cosy London street photography and clean late-1990s rom-com polish.",
      category: "movieLooks"
    },
    {
      id: "o-brother-where-art-thou",
      label: "O Brother, Where Art Thou?",
      promptValue: "With the visual aesthetic of the movie O Brother, Where Art Thou? with sepia and warm amber grade, dry contrast, dusty haze",
      category: "movieLooks"
    },
    {
      id: "oblivion",
      label: "Oblivion",
      promptValue: "With the visual aesthetic of the movie Oblivion with clean sci-fi gloss, cool blue palette, high clarity, soft bloom",
      category: "movieLooks"
    },
    {
      id: "pans-labyrinth",
      label: "Pans Labyrinth",
      promptValue: "With the visual aesthetic of the movie Pans Labyrinth by Guillermo Del Toro, with mossy greens, warm candlelight glow, soft contrast, fairy-tale haze",
      category: "movieLooks"
    },
    {
      id: "parasite",
      label: "Parasite",
      promptValue: "With the visual aesthetic of the movie Parasite with clean modern tones, neutral palette, crisp contrast, controlled lighting",
      category: "movieLooks"
    },
    {
      id: "psycho",
      label: "Psycho",
      promptValue: "With the visual aesthetic of the movie Psycho with sharp black and white, high contrast, hard light, film grain",
      category: "movieLooks"
    },
    {
      id: "raiders-of-the-lost-ark",
      label: "Raiders of the Lost Ark",
      promptValue: "With the visual aesthetic of the movie Raiders of the Lost Ark with punchy 1980s adventure cinematography, practical stunts energy and warm, dusty film texture.",
      category: "movieLooks"
    },
    {
      id: "roma",
      label: "Roma",
      promptValue: "With the visual aesthetic of the movie Roma with crisp black and white, soft natural light, fine grain, gentle contrast",
      category: "movieLooks"
    },
    {
      id: "saving-private-ryan",
      label: "Saving Private Ryan",
      promptValue: "With the visual aesthetic of the movie Saving Private Ryan with desaturated palette, high shutter sharpness, gritty, contrast",
      category: "movieLooks"
    },
    {
      id: "saw",
      label: "Saw",
      promptValue: "With the visual aesthetic of the movie Saw with cold greenish tint, gritty low-light realism and early-2000s horror-thriller film style.",
      category: "movieLooks"
    },
    {
      id: "sicario",
      label: "Sicario",
      promptValue: "With the visual aesthetic of the movie Sicario with dusty amber tones, harsh sunlight, high contrast, heat haze",
      category: "movieLooks"
    },
    {
      id: "sin-city",
      label: "Sin City",
      promptValue: "With the visual aesthetic of the movie Sin City with stark black and white, extreme contrast, selective color accents",
      category: "movieLooks"
    },
    {
      id: "skyfall",
      label: "Skyfall",
      promptValue: "With the visual aesthetic of the movie Skyfall with rich teal shadows, glossy highlights, moody contrast, refined grain",
      category: "movieLooks"
    },
    {
      id: "squid-game",
      label: "Squid Game",
      promptValue: "With the visual aesthetic of the movie Squid Game with bright candy colors, clean contrast, flat lighting, graphic clarity",
      category: "movieLooks"
    },
    {
      id: "stalker",
      label: "Stalker",
      promptValue: "With the visual aesthetic of the movie Stalker with muted earth tones, low saturation, soft focus, misty atmosphere",
      category: "movieLooks"
    },
    {
      id: "star-wars-a-new-hope",
      label: "Star Wars: A New Hope",
      promptValue: "With the visual aesthetic of the movie Star Wars: A New Hope with lived-in practical-effects texture and a classic late-1970s space-opera film look.",
      category: "movieLooks"
    },
    {
      id: "stranger-things",
      label: "Stranger Things",
      promptValue: "With the visual aesthetic of the movie Stranger Things with 1980s nostalgia grade, warm practical glow, soft grain, moody contrast, red tinted cloudyskies, particle effects",
      category: "movieLooks"
    },
    {
      id: "suspiria-1977",
      label: "Suspiria (1977)",
      promptValue: "With the visual aesthetic of the movie Suspiria (1977) with saturated primary colors, heavy gels, surreal glow, high contrast",
      category: "movieLooks"
    },
    {
      id: "terminator-2",
      label: "Terminator 2",
      promptValue: "With the visual aesthetic of the movie Terminator 2 with cool steel-blue palette, sharp contrast, cinematic shine, mild grain",
      category: "movieLooks"
    },
    {
      id: "the-assassination-of-jesse-james",
      label: "The Assassination of Jesse James",
      promptValue: "With the visual aesthetic of the movie The Assassination of Jesse James with sepia-leaning tones, soft vignetting, gentle contrast, film grain",
      category: "movieLooks"
    },
    {
      id: "the-bourne-ultimatum",
      label: "The Bourne Ultimatum",
      promptValue: "With the visual aesthetic of the movie The Bourne Ultimatum with handheld kinetic look, cool desaturation, sharp contrast, gritty grain",
      category: "movieLooks"
    },
    {
      id: "the-dark-crystal",
      label: "The Dark Crystal",
      promptValue: "With the visual aesthetic of the movie The Dark Crystal with a DVD screengrab quality without text overlay, lo-fi appearance, rich earthy palette, soft diffusion, dim glow, fantasy haze",
      category: "movieLooks"
    },
    {
      id: "the-dark-knight",
      label: "The Dark Knight",
      promptValue: "With the visual aesthetic of the movie The Dark Knight with cool urban tones, deep shadows, high contrast, crisp clarity",
      category: "movieLooks"
    },
    {
      id: "the-exorcist",
      label: "The Exorcist",
      promptValue: "With the visual aesthetic of the movie The Exorcist with cold greenish tint, low-key lighting, heavy grain, stark contrast",
      category: "movieLooks"
    },
    {
      id: "the-godfather",
      label: "The Godfather",
      promptValue: "With the visual aesthetic of the movie The Godfather with warm amber low-key lighting, deep shadows, soft film grain",
      category: "movieLooks"
    },
    {
      id: "the-good-the-bad-and-the-ugly",
      label: "The Good, the Bad and the Ugly",
      promptValue: "With the visual aesthetic of the movie The Good, the Bad and the Ugly with sun-bleached Western landscapes, gritty close-ups and a classic 1960s spaghetti-western film look with Technicolor 3-Strip film.",
      category: "movieLooks"
    },
    {
      id: "the-grand-budapest-hotel",
      label: "The Grand Budapest Hotel",
      promptValue: "With the visual aesthetic of the movie The Grand Budapest Hotel with pastel palette, symmetrical polish typical of Wes Anderson, soft contrast, playful tint",
      category: "movieLooks"
    },
    {
      id: "the-hurt-locker",
      label: "The Hurt Locker",
      promptValue: "With the visual aesthetic of the movie The Hurt Locker with desaturated palette, harsh sunlight, handheld grit, dusty haze",
      category: "movieLooks"
    },
    {
      id: "the-lighthouse",
      label: "The Lighthouse",
      promptValue: "With the visual aesthetic of the movie The Lighthouse with high-contrast black and white, harsh light, heavy grain, vignetting",
      category: "movieLooks"
    },
    {
      id: "the-lord-of-the-rings",
      label: "The Lord of the Rings",
      promptValue: "With the visual aesthetic of the movie The Lord of the Rings with natural greens and golds, warm light, soft contrast, epic grade",
      category: "movieLooks"
    },
    {
      id: "the-maltese-falcon",
      label: "The Maltese Falcon",
      promptValue: "With the visual aesthetic of the movie The Maltese Falcon with high-contrast 1940s black-and-white noir, hard shadows and smoky interiors.",
      category: "movieLooks"
    },
    {
      id: "the-matrix",
      label: "The Matrix",
      promptValue: "With the visual aesthetic of the movie The Matrix with green tint, high contrast, cool shadows, glossy highlights",
      category: "movieLooks"
    },
    {
      id: "the-neverending-story",
      label: "The NeverEnding Story",
      promptValue: "With the visual aesthetic of the movie The NeverEnding Story with a DVD screengrab quality without text overlay, lo-fi appearance, soft 1980s fantasy glow, warm palette, gentle contrast, film grain",
      category: "movieLooks"
    },
    {
      id: "the-revenant",
      label: "The Revenant",
      promptValue: "With the visual aesthetic of the movie The Revenant with cold natural light, desaturated palette, crisp detail, soft grain",
      category: "movieLooks"
    },
    {
      id: "the-ring",
      label: "The Ring",
      promptValue: "With the visual aesthetic of the movie The Ring with cold blue-gray palette, heavy shadows, damp haze, low saturation",
      category: "movieLooks"
    },
    {
      id: "the-shape-of-water",
      label: "The Shape of Water",
      promptValue: "With the visual aesthetic of the movie The Shape of Water with teal-green palette, soft glow, gentle contrast, dreamy haze",
      category: "movieLooks"
    },
    {
      id: "the-shining",
      label: "The Shining",
      promptValue: "With the visual aesthetic of the movie The Shining with a 1970's film style with symmetrical compositions, use of patterns, deep reds, sharp contrast, clean clarity",
      category: "movieLooks"
    },
    {
      id: "the-ten-commandments",
      label: "The Ten Commandments",
      promptValue: "With the visual aesthetic of the movie The Ten Commandments with grand biblical pageantry, saturated colours and a classic 1950s Technicolor studio-epic look.",
      category: "movieLooks"
    },
    {
      id: "the-texas-chain-saw-massacre",
      label: "The Texas Chain Saw Massacre",
      promptValue: "With the visual aesthetic of the movie The Texas Chain Saw Massacre with raw 1970s film grain, sun-bleached tones, harsh contrast",
      category: "movieLooks"
    },
    {
      id: "the-thing",
      label: "The Thing",
      promptValue: "With the visual aesthetic of the movie The Thing with cold blue lighting, deep shadows, gritty grain, high contrast and a 1980s film look",
      category: "movieLooks"
    },
    {
      id: "the-witch",
      label: "The Witch",
      promptValue: "With the visual aesthetic of the movie The Witch with muted earth tones, natural candlelight, low contrast, fine grain",
      category: "movieLooks"
    },
    {
      id: "there-will-be-blood",
      label: "There Will Be Blood",
      promptValue: "With the visual aesthetic of the movie There Will Be Blood with dusty sepia palette, high contrast, stark shadows, film grain",
      category: "movieLooks"
    },
    {
      id: "titanic",
      label: "Titanic",
      promptValue: "With the visual aesthetic of the movie Titanic with romantic period grandeur, warm luxurious interiors and polished 1990s cinematic realism.",
      category: "movieLooks"
    },
    {
      id: "trainspotting",
      label: "Trainspotting",
      promptValue: "With the visual aesthetic of the movie Trainspotting with gritty 1990s look, muted palette, harsh contrast, light grain",
      category: "movieLooks"
    },
    {
      id: "twilight",
      label: "Twilight",
      promptValue: "With the visual aesthetic of the movie Twilight with cool blue tint, soft diffusion, low contrast, dreamy haze",
      category: "movieLooks"
    },
    {
      id: "under-the-skin",
      label: "Under the Skin",
      promptValue: "With the visual aesthetic of the movie Under the Skin with minimal palette, high contrast, cold light, clean negative space, surrealist composition",
      category: "movieLooks"
    },
    {
      id: "utopia",
      label: "Utopia",
      promptValue: "With the visual aesthetic of the movie Utopia a British TV Series, with bold colors, high contrast, clean lines, slight vignette",
      category: "movieLooks"
    },
    {
      id: "who-framed-roger-rabbit",
      label: "Who Framed Roger Rabbit",
      promptValue: "With the visual aesthetic of the movie Who Framed Roger Rabbit with bright 1940s noir palette, 2D loony toons style cartoon elements mixed with live action, sharp contrast, glossy highlights",
      category: "movieLooks"
    },
    {
      id: "zero-dark-thirty",
      label: "Zero Dark Thirty",
      promptValue: "With the visual aesthetic of the movie Zero Dark Thirty with desaturated realism, cool tones, handheld grit, low saturation",
      category: "movieLooks"
    }
  ],
  filters: [
    {
      id: "black-and-white",
      label: "Black And White",
      promptValue: "Black And White",
      category: "filters"
    },
    {
      id: "black-mist-filter",
      label: "Black mist filter",
      promptValue: "Black mist filter",
      category: "filters"
    },
    {
      id: "bloom-glow",
      label: "Bloom Glow",
      promptValue: "Bloom Glow",
      category: "filters"
    },
    {
      id: "bokeh",
      label: "Bokeh",
      promptValue: "Bokeh",
      category: "filters"
    },
    {
      id: "chromatic-aberration",
      label: "Chromatic Aberration",
      promptValue: "Chromatic Aberration",
      category: "filters"
    },
    {
      id: "collage-cutout",
      label: "Collage Cutout",
      promptValue: "Collage Cutout",
      category: "filters"
    },
    {
      id: "color-filter",
      label: "Color Filter",
      promptValue: "Color Filter",
      category: "filters"
    },
    {
      id: "cross-processed",
      label: "Cross Processed",
      promptValue: "Cross Processed",
      category: "filters"
    },
    {
      id: "crt-scanlines",
      label: "CRT Scanlines",
      promptValue: "CRT Scanlines",
      category: "filters"
    },
    {
      id: "cyanotype",
      label: "Cyanotype",
      promptValue: "Cyanotype",
      category: "filters"
    },
    {
      id: "datamosh-glitch",
      label: "Datamosh Glitch",
      promptValue: "Datamosh Glitch",
      category: "filters"
    },
    {
      id: "desaturated-grunge",
      label: "Desaturated Grunge",
      promptValue: "Desaturated Grunge",
      category: "filters"
    },
    {
      id: "dreamy-haze",
      label: "Dreamy Haze",
      promptValue: "Dreamy Haze",
      category: "filters"
    },
    {
      id: "duotone",
      label: "Duotone",
      promptValue: "Duotone",
      category: "filters"
    },
    {
      id: "film-grain",
      label: "Film Grain",
      promptValue: "Film Grain",
      category: "filters"
    },
    {
      id: "glitch-style",
      label: "Glitch Style",
      promptValue: "Glitch Style",
      category: "filters"
    },
    {
      id: "halftone",
      label: "Halftone",
      promptValue: "Halftone",
      category: "filters"
    },
    {
      id: "hdr-tone-mapping",
      label: "HDR Tone Mapping",
      promptValue: "HDR Tone Mapping",
      category: "filters"
    },
    {
      id: "hologram-effect",
      label: "Hologram Effect",
      promptValue: "Hologram Effect",
      category: "filters"
    },
    {
      id: "infrared-filter",
      label: "Infrared Filter",
      promptValue: "Infrared Filter",
      category: "filters"
    },
    {
      id: "kaleidoscope",
      label: "Kaleidoscope",
      promptValue: "Kaleidoscope",
      category: "filters"
    },
    {
      id: "lens-flare",
      label: "Lens Flare",
      promptValue: "Lens Flare",
      category: "filters"
    },
    {
      id: "light-leaks",
      label: "Light Leaks",
      promptValue: "Light Leaks",
      category: "filters"
    },
    {
      id: "liquify-smear",
      label: "Liquify Smear",
      promptValue: "Liquify Smear",
      category: "filters"
    },
    {
      id: "long-exposure",
      label: "Long Exposure",
      promptValue: "Long Exposure",
      category: "filters"
    },
    {
      id: "mirror-split",
      label: "Mirror Split",
      promptValue: "Mirror Split",
      category: "filters"
    },
    {
      id: "motion-blur",
      label: "Motion Blur",
      promptValue: "Motion Blur",
      category: "filters"
    },
    {
      id: "nd-filter",
      label: "ND Filter",
      promptValue: "ND Filter",
      category: "filters"
    },
    {
      id: "newspaper-print",
      label: "Newspaper Print",
      promptValue: "Newspaper Print",
      category: "filters"
    },
    {
      id: "off-register-cmyk-print",
      label: "Off-Register CMYK Print",
      promptValue: "Off-Register CMYK Print",
      category: "filters"
    },
    {
      id: "orton-glow",
      label: "Orton Glow",
      promptValue: "Orton Glow",
      category: "filters"
    },
    {
      id: "overexposed",
      label: "Overexposed",
      promptValue: "Overexposed",
      category: "filters"
    },
    {
      id: "photocopy-xerox",
      label: "Photocopy / Xerox",
      promptValue: "Photocopy / Xerox",
      category: "filters"
    },
    {
      id: "pixel-sort",
      label: "Pixel Sort",
      promptValue: "Pixel Sort",
      category: "filters"
    },
    {
      id: "posterized",
      label: "Posterized",
      promptValue: "Posterized",
      category: "filters"
    },
    {
      id: "radial-blur",
      label: "Radial Blur",
      promptValue: "Radial Blur",
      category: "filters"
    },
    {
      id: "risograph-print",
      label: "Risograph Print",
      promptValue: "Risograph Print",
      category: "filters"
    },
    {
      id: "selective-color",
      label: "Selective Color",
      promptValue: "Selective Color",
      category: "filters"
    },
    {
      id: "sepia-tone",
      label: "Sepia Tone",
      promptValue: "Sepia Tone",
      category: "filters"
    },
    {
      id: "soft-focus",
      label: "Soft Focus",
      promptValue: "Soft Focus",
      category: "filters"
    },
    {
      id: "solarized",
      label: "Solarized",
      promptValue: "Solarized",
      category: "filters"
    },
    {
      id: "split-tone",
      label: "Split Tone",
      promptValue: "Split Tone",
      category: "filters"
    },
    {
      id: "underexposed",
      label: "Underexposed",
      promptValue: "Underexposed",
      category: "filters"
    },
    {
      id: "vignette",
      label: "Vignette",
      promptValue: "Vignette",
      category: "filters"
    }
  ],
  animeGenres: [
    {
      id: "3d-anime",
      label: "3D Anime",
      promptValue: "3D Anime",
      category: "animeGenres",
      pre: "A stylized anime 3D cinematic render.",
      post: "Featuring high-end CGI character model, subsurface skin shading, sculpted face, detailed hair strands with detailed-painted textures, rendered like a premium cinematic anime cutscene, global illumination, clean lighting, vibrant but controlled colors, clean background."
    },
    {
      id: "90s-ova-anime",
      label: "90s OVA Anime",
      promptValue: "90s OVA Anime",
      category: "animeGenres",
      pre: "1990s high-budget OVA anime style.",
      post: "Featuring no outlines on backgrounds with rich hand-painted textures, premium cel-era detail, and moody chromatic aberration. Refined character art, lush color depth, and a high-end vintage atmosphere. Captured on 35mm film animation look."
    },
    {
      id: "avant-garde-anime",
      label: "Avant-Garde Anime",
      promptValue: "Avant-Garde Anime",
      category: "animeGenres",
      pre: "Experimental avant-garde anime style.",
      post: "Featuring unconventional composition, abstract graphic shapes, and symbolic visual treatments. Art-house animation styling with unusual color relationships."
    },
    {
      id: "battle-shonen-anime",
      label: "Battle Shonen Anime",
      promptValue: "Battle Shonen Anime",
      category: "animeGenres",
      pre: "Modern battle-shonen action anime style.",
      post: "Featuring strong character shape design, and bold action-oriented line art. Dynamic cel shading, and high-impact visual effects."
    },
    {
      id: "bishoujo-anime",
      label: "Bishoujo Anime",
      promptValue: "Bishoujo Anime",
      category: "animeGenres",
      pre: "Idealized Bishoujo (beautiful girl) anime style.",
      post: "Featuring idealized character styling, large luminous eyes, and delicate facial features. Glossy polished rendering, clean elegant line art, and a premium commercial animation finish."
    },
    {
      id: "chibi-super-deformed",
      label: "Chibi/Super-Deformed",
      promptValue: "Chibi/Super-Deformed",
      category: "animeGenres",
      pre: "Chibi / super-deformed anime style.",
      post: "Featuring characters with oversized head, tiny simplified bodies, and cute comedic proportions. Soft clean linework, bright readable shapes, and playful mascot-like energy. Limited colors, flat shading, high-quality anime screenshot."
    },
    {
      id: "clamp-like-elegant-anime",
      label: "CLAMP-like Elegant Anime",
      promptValue: "CLAMP-like Elegant Anime",
      category: "animeGenres",
      pre: "Late 1990s CLAMP-inspired decorative anime style.",
      post: "Featuring elongated graceful proportions, intricate decorative filigree, and refined line art. Luminous fantasy-romance mood often with floating feathers and stylized floral patterns, high-quality animation aesthetic."
    },
    {
      id: "classic-80s-cel-anime",
      label: "Classic 80s Cel Anime",
      promptValue: "Classic 80s Cel Anime",
      category: "animeGenres",
      pre: "Classic 1980s hand-painted cel anime style.",
      post: "Featuring simple colors, simple line art, limited shading, and a vintage color palette. Painted background plates. 1980s Anime cartoon aesthetic."
    },
    {
      id: "dark-fantasy-anime",
      label: "Dark Fantasy Anime",
      promptValue: "Dark Fantasy Anime",
      category: "animeGenres",
      pre: "Grim dark fantasy anime style.",
      post: "Featuring a cold restrained and simple color palette, harsh jagged shadows, Cel shaded. Bleak supernatural atmosphere, severe dramatic styling, and heavy atmospheric fog, high-production animation look."
    },
    {
      id: "early-2000s-digital-anime",
      label: "Early 2000s Digital Anime",
      promptValue: "Early 2000s Digital Anime",
      category: "animeGenres",
      pre: "Early 2000s digital-era anime style.",
      post: "Featuring clean digital gradients, flat digital compositing, neat character line art, modest lighting effects, and a polished early-digital look with subtle bloom."
    },
    {
      id: "gacha-game-3d",
      label: "Gacha Game 3D",
      promptValue: "Gacha Game 3D",
      category: "animeGenres",
      pre: "Stylized anime 3D style.",
      post: "Featuring high-end cel-shaded game render, polished anime RPG model, soft warm interior lighting, smooth toon shading, detailed hair cards, crisp eyes, premium gacha game cutscene look"
    },
    {
      id: "ghibli-like-fantasy",
      label: "Ghibli-like Fantasy",
      promptValue: "Ghibli-like Fantasy",
      category: "animeGenres",
      pre: "Studio Ghibli anime style.",
      post: "Featuring simple black outlines for characters with gentle facial styling, no outlines on backgrounds painted with impressionistic soft watercolor-textures, fluffy layered clouds, and a serene storybook aesthetic."
    },
    {
      id: "gothic-horror-anime",
      label: "Gothic Horror Anime",
      promptValue: "Gothic Horror Anime",
      category: "animeGenres",
      pre: "Gothic horror anime style.",
      post: "Featuring no outlines on backgrounds with rich hand-painted textures, dramatic heavy shadows, premium cel shaded detail, and a deep crimson-and-black palette. Sinister old-world atmosphere."
    },
    {
      id: "idol-anime",
      label: "Idol Anime",
      promptValue: "Idol Anime",
      category: "animeGenres",
      pre: "Glitzy idol performance anime style.",
      post: "Featuring bright polished rendering, glossy highlights, and vivid clean colors. Sparkling particle effects, smooth skin treatment, and high-energy entertainment-anime line art."
    },
    {
      id: "josei-anime",
      label: "Josei Anime",
      promptValue: "Josei Anime",
      category: "animeGenres",
      pre: "Josei drama anime style.",
      post: "Featuring mature character styling, natural adult proportions, and a restrained dramatic mood. Polished line art, understated elegance, and grounded emotional styling. Cinematic lighting with city reflections in glass, clean digital animation finish."
    },
    {
      id: "key-visual-anime",
      label: "Key Visual Anime",
      promptValue: "Key Visual Anime",
      category: "animeGenres",
      pre: "Promotional Key Visual / Animation anime style.",
      post: "Featuring premium promotional rendering, polished compositing, and crisp silhouette emphasis. High-detail finish, balanced color design, and a cinematic studio-poster animation style."
    },
    {
      id: "kodomo-anime",
      label: "Kodomo Anime",
      promptValue: "Kodomo Anime",
      category: "animeGenres",
      pre: "Kodomo (children's) anime style.",
      post: "Featuring simple rounded shapes, friendly facial designs, and soft cheerful colors. Gentle linework, easy readability, and a warm child-friendly visual tone. Limited shading, clean TV-broadcast finish."
    },
    {
      id: "modern-glossy-anime",
      label: "Modern Glossy Anime",
      promptValue: "Modern Glossy Anime",
      category: "animeGenres",
      pre: "High-end anime style.",
      post: "Featuring crisp digital highlights, premium polished rendering, and smooth subsurface scattering on skin. High production finish, clean cinematic lighting, and contemporary character design. Ultra-high resolution digital animation aesthetic"
    },
    {
      id: "moe-anime",
      label: "Moe Anime",
      promptValue: "Moe Anime",
      category: "animeGenres",
      pre: 'Modern "Moe" soft-style anime style.',
      post: 'Featuring soft rounded facial features, massive glossy "liquid" eyes, and a delicate nose. Clean smooth line art, pastel-leaning palette, and polished soft shading. Cute, heart-warming animation tone.'
    },
    {
      id: "otome-game-anime",
      label: "Otome Game Anime",
      promptValue: "Otome Game Anime",
      category: "animeGenres",
      pre: "Romantic Otome game anime style.",
      post: "Featuring refined facial structures, luminous long-lashed eyes, and elegant decorative line art. Jewel-toned color accents, soft lens flares, and a glossy high-romance animation rendering."
    },
    {
      id: "sakuga-action-frame",
      label: "Sakuga Action Frame",
      promptValue: "Sakuga Action Frame",
      category: "animeGenres",
      pre: 'High-intensity "Sakuga" anime style.',
      post: "Featuring highly expressive draftsmanship, dynamic variable line art weights, and dense shading accents. Motion smears, heightened detail, and a fluid high-impact hand-drawn animation finish."
    },
    {
      id: "seinen-anime",
      label: "Seinen Anime",
      promptValue: "Seinen Anime",
      category: "animeGenres",
      pre: "Seinen psychological anime style.",
      post: "Featuring mature grounded facial design, a darker restrained palette, and serious dramatic tones. Sharper shadows, grounded mood, and weighty visual treatment. High-contrast lighting, gritty urban atmosphere, clean professional animation line art."
    },
    {
      id: "shoujo-manga-anime",
      label: "Shoujo Manga Anime",
      promptValue: "Shoujo Manga Anime",
      category: "animeGenres",
      pre: "Shoujo manga-inspired anime style.",
      post: "Featuring elegant facial styling, large expressive eyes, and delicate line art. Airy sparkle accents, soft romantic glow, and a dreamy feminine atmosphere. Limited colors, soft watercolor-style gradients, high-quality animation frame."
    },
    {
      id: "superflat-anime",
      label: "Superflat Anime",
      promptValue: "Superflat Anime",
      category: "animeGenres",
      pre: "Superflat anime style.",
      post: "Featuring perfectly flat graphic planes, bold color blocking, and zero shading. Sharp clean line art and a highly stylized pop-art commercial animation finish."
    },
    {
      id: "visual-novel-anime",
      label: "Visual Novel Anime",
      promptValue: "Visual Novel Anime",
      category: "animeGenres",
      pre: "Modern Visual Novel character sprite style.",
      post: "Featuring crisp character rendering with a distinct separation from the blurred background. Neat hair separation, smooth digital gradients, and a polished commercial finish typical of high-end animation-style games."
    }
  ],
  aspectRatios: [
    {
      id: "1-1",
      label: "1:1",
      promptValue: "1:1",
      category: "aspectRatios"
    },
    {
      id: "3-4",
      label: "3:4",
      promptValue: "3:4",
      category: "aspectRatios"
    },
    {
      id: "4-3",
      label: "4:3",
      promptValue: "4:3",
      category: "aspectRatios"
    },
    {
      id: "9-16",
      label: "9:16",
      promptValue: "9:16",
      category: "aspectRatios"
    },
    {
      id: "16-9",
      label: "16:9",
      promptValue: "16:9",
      category: "aspectRatios"
    },
    {
      id: "21-9",
      label: "21:9",
      promptValue: "21:9",
      category: "aspectRatios"
    }
  ],
  animeShowStyles: [
    {
      id: "attack-on-giants",
      label: "Attack on Giants",
      promptValue: "Attack on Giants",
      category: "animeShowStyles",
      pre: "Attack on Titan dark fantasy military style anime.",
      post: "Featuring thick simple outlines, desaturated earthy tones, cel-shaded cinematic lighting, light bloom and shallow depth of field. No line art on painted backgrounds. Gritty, serious atmosphere with a high-budget professional animation aesthetic."
    },
    {
      id: "beyond-the-journey",
      label: "Beyond the Journey",
      promptValue: "Beyond the Journey",
      category: "animeShowStyles",
      pre: "Frieren: Beyond Journey's End high-fantasy melancholic style anime.",
      post: "Featuring characters with elegant delicate simple line art and cel shaded colors. With soft painterly backgrounds with no outlines, natural diffused lighting, and. A peaceful, nostalgic color palette and a premium modern-feature animation finish."
    },
    {
      id: "charmcaptor",
      label: "Charmcaptor",
      promptValue: "Charmcaptor",
      category: "animeShowStyles",
      pre: "Cardcaptor Sakura whimsical magical girl style anime.",
      post: "Featuring bright pastel colors, delicate ornate line art, and a whimsical atmosphere. Soft lighting and a polished, magical-girl animation aesthetic."
    },
    {
      id: "cowboy-spaceman",
      label: "Cowboy Spaceman",
      promptValue: "Cowboy Spaceman",
      category: "animeShowStyles",
      pre: "Cowboy Bebop retro space-noir style anime.",
      post: "Featuring desaturated vintage colors, detailed mechanical designs, and sophisticated hand-drawn line art. Noir-inspired shadows, cinematic framing, and a classic 1990s cel-animation look."
    },
    {
      id: "dan-da-boom",
      label: "Dan Da Boom",
      promptValue: "Dan Da Boom",
      category: "animeShowStyles",
      pre: "Dan Da Dan hyper-kinetic supernatural style anime.",
      post: "Featuring cel-shaded characters, cinematic shading, simple backgrounds and high-energy composition. Premium Sakuga animation aesthetic."
    },
    {
      id: "edgerunners",
      label: "Edgerunners",
      promptValue: "Edgerunners",
      category: "animeShowStyles",
      pre: "Cyberpunk: Edgerunners style anime.",
      post: "Featuring mature character proportions, realistic lighting, jagged expressive line art, extreme color contrast, and chromatic aberration.  high-budget digital animation finish."
    },
    {
      id: "forest-princess",
      label: "Forest Princess",
      promptValue: "Forest Princess",
      category: "animeShowStyles",
      pre: "Princess Mononoke Studio Ghibli historical fantasy style anime.",
      post: "Featuring simple black outlines for cel-shaded characters with gentle facial styling, no outlines on backgrounds painted with impressionistic soft watercolor-textures, fluffy layered clouds, and a serene storybook aesthetic."
    },
    {
      id: "ghost-in-the-system",
      label: "Ghost in the System",
      promptValue: "Ghost in the System",
      category: "animeShowStyles",
      pre: "Ghost in the Shell: Stand Alone Complex Seinen cyberpunk tactical style anime.",
      post: "Featuring mature character proportions, muted tech-heavy colors, and sharp professional line art. Gritty urban atmosphere, realistic lighting, and a high-budget digital animation finish."
    },
    {
      id: "ghost-watch",
      label: "Ghost Watch",
      promptValue: "Ghost Watch",
      category: "animeShowStyles",
      pre: "Yo-kai Watch supernatural kodomo style anime.",
      post: "Featuring soft rounded shapes, friendly character designs, and vibrant saturated colors. Gentle line art, easy readability, playful supernatural atmosphere and a cheerful TV-broadcast animation finish."
    },
    {
      id: "greyblade",
      label: "Greyblade",
      promptValue: "Greyblade",
      category: "animeShowStyles",
      pre: "Claymore dark fantasy medieval style Seinen anime.",
      post: "Featuring a simple cel-shaded character with cold, desaturated palette, sharp line art, and a grim atmosphere and a classic mid-2000s animation aesthetic."
    },
    {
      id: "jujitsu-curse-domain",
      label: "Jujitsu Curse Domain",
      promptValue: "Jujitsu Curse Domain",
      category: "animeShowStyles",
      pre: "Jujutsu Kaisen modern supernatural action style anime.",
      post: "Featuring sharp aggressive thin line art, dynamic shadows, and high-contrast digital lighting. Fluid action composition and a polished contemporary animation finish."
    },
    {
      id: "lunar-sailor",
      label: "Lunar Sailor",
      promptValue: "Lunar Sailor",
      category: "animeShowStyles",
      pre: "Sailor Moon classic 1990s magical girl style anime.",
      post: "Featuring soft glowing auras, delicate line art, and hand-painted watercolor-texture backgrounds. Nostalgic 1990s cel-animation finish with retro film grain."
    },
    {
      id: "modern-mobile-suit",
      label: "Modern Mobile Suit",
      promptValue: "Modern Mobile Suit",
      category: "animeShowStyles",
      pre: "Mobile Suit Gundam high-detail modern mecha style anime.",
      post: "Featuring sharp digital line art, Cel-shaded characters, complex mechanical layering, and glowing LED accents. Cinematic lighting, smooth metal textures, Low detail 3D Computer generated backgrounds and a high-budget animation aesthetic."
    },
    {
      id: "neon-revelation",
      label: "Neon Revelation",
      promptValue: "Neon Revelation",
      category: "animeShowStyles",
      pre: "Neon Genesis Evangelion 1990s psychological mecha style anime.",
      post: "Featuring dramatic high-contrast lighting, simple colors, simple line art, limited shading, and a vintage color palette. Painted background plates. 1990s cel-animation finish with retro film grain."
    },
    {
      id: "ninja-bandana",
      label: "Ninja bandana",
      promptValue: "Ninja bandana",
      category: "animeShowStyles",
      pre: "Naruto ninja action Shonen style anime.",
      post: "Featuring bold character design, crisp digital line art, dynamic cel shading, painted backgrounds without outline line art. High-impact visual effects."
    },
    {
      id: "parasitic",
      label: "Parasitic",
      promptValue: "Parasitic",
      category: "animeShowStyles",
      pre: "Parasyte: The Maxim Seinen-action body-horror style anime.",
      post: "Featuring clean contemporary line art, grounded anatomical detail, and realistic urban lighting. Sharp contrast and a polished Seinen-action animation finish."
    },
    {
      id: "pok-collector",
      label: "Poké Collector",
      promptValue: "Poké Collector",
      category: "animeShowStyles",
      pre: "Pokémon Kodomo monster-collection style anime.",
      post: "Featuring soft rounded shapes, friendly character designs, and vibrant saturated colors. Gentle line art, easy readability, and a cheerful TV-broadcast animation finish."
    },
    {
      id: "proxy-error",
      label: "Proxy Error",
      promptValue: "Proxy Error",
      category: "animeShowStyles",
      pre: "Ergo Proxy dystopian psychological Seinen style anime.",
      post: "Featuring a desaturated earthy palette, heavy realistic shadows, and thin refined line art. Melancholy atmosphere, mature designs, and a gritty cinematic animation finish."
    },
    {
      id: "purple-evergarden",
      label: "Purple Evergarden",
      promptValue: "Purple Evergarden",
      category: "animeShowStyles",
      pre: "Violet Evergarden Victorian-inspired glossy style anime.",
      post: "Featuring extreme detail in textures, soft-focus backgrounds, and glowing god-rays. Refined line art, rich jewel-toned colors, and a breathtakingly polished theatrical animation finish."
    },
    {
      id: "retro-mobile-suit",
      label: "Retro Mobile Suit",
      promptValue: "Retro Mobile Suit",
      category: "animeShowStyles",
      pre: "Mobile Suit Gundam retro 1979 mecha style anime.",
      post: "Featuring thick 70s cel-animation line art, a primary color palette (Red, Blue, Yellow), and hand-painted space backgrounds. Vintage film grain and a classic hand-crafted animation aesthetic."
    },
    {
      id: "solo-level-ascension",
      label: "Solo Level Ascension",
      promptValue: "Solo Level Ascension",
      category: "animeShowStyles",
      pre: "Solo Leveling modern high-fantasy action style anime.",
      post: "Featuring clean digital line art, vibrant magical particle effects, and high-contrast shading. Dynamic perspective, slick commercial finish, and a high-budget animation look."
    },
    {
      id: "spiral-horror",
      label: "Spiral Horror",
      promptValue: "Spiral Horror",
      category: "animeShowStyles",
      pre: "Junji Ito grotesque monochromatic horror style anime.",
      post: "Featuring high-contrast blacks, intricate cross-hatching textures, and sharp anatomical line art. Eerie haunting atmosphere and a crisp horror-animation screenshot finish."
    },
    {
      id: "street-breaker",
      label: "Street Breaker",
      promptValue: "Street Breaker",
      category: "animeShowStyles",
      pre: "Wind Breaker modern delinquent action style anime.",
      post: "Featuring crisp digital line art, vibrant street-wear colors, and clean polished shading. High-energy atmosphere and a contemporary TV-anime aesthetic."
    },
    {
      id: "tokyo-demon-gloom",
      label: "Tokyo Demon Gloom",
      promptValue: "Tokyo Demon Gloom",
      category: "animeShowStyles",
      pre: "Tokyo Ghoul dark urban horror style anime.",
      post: "Featuring clean contemporary line art, simple cell-shading, realistic anatomical detail, shallow depth of field, painted background, and dramatic urban lighting. Sharp contrast and a polished Seinen-action animation aesthetic."
    },
    {
      id: "van-helsing-limited",
      label: "Van Helsing Limited",
      promptValue: "Van Helsing Limited",
      category: "animeShowStyles",
      pre: "Hellsing Ultimate gothic Seinen action style anime.",
      post: "Featuring high-contrast heavy blacks, sharp aggressive line art, and deep crimson accents. Sinister lighting, ornate architectural detail, and a premium OVA animation finish."
    },
    {
      id: "your-title",
      label: "Your Title",
      promptValue: "Your Title",
      category: "animeShowStyles",
      pre: "Your Name modern cinematic glossy style anime.",
      post: "Featuring high-end lighting effects, lens flares, and incredibly detailed painterly backgrounds. Crisp line art, lush color gradients, and a premium theatrical animation finish."
    }
  ],
  westernAnimationStyles: [
    {
      id: "2d-3d-hybrid-animation",
      label: "2D-3D Hybrid Animation",
      promptValue: "2D-3D Hybrid Animation",
      category: "westernAnimationStyles",
      pre: "Fortiche Production / Riot Games 3D Aesthetic animation.",
      post: "Featuring 3D models with hand-painted digital textures, visible brushstrokes, and dramatic theatrical lighting with deep teal and neon violet shadows. Backgrounds look like matte oil paintings but characters and props like 3D game models. Gritty, high-end steampunk-fantasy aesthetic."
    },
    {
      id: "3d-family-film",
      label: "3D Family Film",
      promptValue: "3D Family Film",
      category: "westernAnimationStyles",
      pre: "A modern Disney 3D-inspired animation.",
      post: "Featuring smooth 3D stylization, glossy lighting, soft skin rendering, and high-end family-film CG. Polished modern-feature aesthetic."
    },
    {
      id: "60-s-puppetshow",
      label: "60's Puppetshow",
      promptValue: "60's Puppetshow",
      category: "westernAnimationStyles",
      pre: "60s Thunderbirds Supermarionation style animation.",
      post: "Featuring sculpted doll-like facial features, glossy painted surfaces, and miniature-set textures. Handcrafted 1960s television-production aesthetic."
    },
    {
      id: "80s-action-hero",
      label: "80s Action Hero",
      promptValue: "80s Action Hero",
      category: "westernAnimationStyles",
      pre: "1980s Sunbow & Marvel G.I Joe style animation.",
      post: "Featuring military action styling, thick simple line art, simple colors, simple shading. Simple painted background plates. 1980s Saturday morning cartoon aesthetic, noise grain effect."
    },
    {
      id: "80s-feline-hero",
      label: "80s Feline Hero",
      promptValue: "80s Feline Hero",
      category: "westernAnimationStyles",
      pre: "1980s Rankin/Bass Topcraft Thundercats style animation.",
      post: "Featuring Simple colors, simple line art, no shading, and a bright dramatic palette. Painted background plates. 1980s Saturday morning cartoon aesthetic, noise grain effect."
    },
    {
      id: "90s-family-comedy",
      label: "90s Family Comedy",
      promptValue: "90s Family Comedy",
      category: "westernAnimationStyles",
      pre: "Early 90s Klasky Csupo style animation.",
      post: "Featuring rounded yellow skinned character designs, clean linework, and flat bright colors and simple backgrounds. TV animation aesthetic."
    },
    {
      id: "90s-renaissance-animation",
      label: "90s Renaissance Animation",
      promptValue: "90s Renaissance Animation",
      category: "westernAnimationStyles",
      pre: "90s Renaissance-inspired 2D animation.",
      post: "Featuring elegant character appeal, rich color treatments, and polished finishes. Romantic fantasy-feature aesthetic."
    },
    {
      id: "2000s-action-animation",
      label: "2000s Action Animation",
      promptValue: "2000s Action Animation",
      category: "westernAnimationStyles",
      pre: "Man of Action animation style.",
      post: "Featuring clean simple action line art, simple flat colors. 2000s sci-fi cartoon animation aesthetic."
    },
    {
      id: "bento-box-style",
      label: "Bento Box Style",
      promptValue: "Bento Box Style",
      category: "westernAnimationStyles",
      pre: "Bento Box Animated Sitcom style animation.",
      post: "Featuring simple rounded designs, flat color fields, and deadpan facial styling. Awkward 2D-sitcom aesthetic."
    },
    {
      id: "blue-sky-style",
      label: "Blue Sky style",
      promptValue: "Blue Sky style",
      category: "westernAnimationStyles",
      pre: "Blue Sky Studios 3D Animation style.",
      post: "Featuring rounded CG caricature, playful polished rendering, and bright family-film colors. Glossy animated-feature aesthetic."
    },
    {
      id: "burtonesque-stop-motion",
      label: "Burtonesque Stop Motion",
      promptValue: "Burtonesque Stop Motion",
      category: "westernAnimationStyles",
      pre: "Burtonesque Gothic Stop Motion animation style.",
      post: "Featuring spindly limbs, curled silhouettes, desaturated color palette, and striped decorative elegance. Whimsical dark-fantasy aesthetic."
    },
    {
      id: "classic-animated-movie",
      label: "Classic Animated Movie",
      promptValue: "Classic Animated Movie",
      category: "westernAnimationStyles",
      pre: "Disney Classic-inspired 2D animation.",
      post: "Featuring soft design appeal, rounded forms, and clean theatrical line art. Balanced theatrical-animation aesthetic."
    },
    {
      id: "classic-fantasy-hero",
      label: "Classic Fantasy Hero",
      promptValue: "Classic Fantasy Hero",
      category: "westernAnimationStyles",
      pre: "1980s Filmation Associates style animation.",
      post: "Featuring thick black outlines, Simple colors, simple line art, muscular anatomy. No line art on background. 1980s Saturday morning cartoon aesthetic, VHS capture, noise grain effect"
    },
    {
      id: "classic-mystery-hero",
      label: "Classic Mystery Hero",
      promptValue: "Classic Mystery Hero",
      category: "westernAnimationStyles",
      pre: "Hanna-Barbera mystery style animation.",
      post: "Featuring dry-brush backgrounds, flat color fields, and clean mid-century shapes. Classic 1980s Saturday-morning aesthetic."
    },
    {
      id: "claymation",
      label: "Claymation",
      promptValue: "Claymation",
      category: "westernAnimationStyles",
      pre: "Wallace & Gromit Claymation style animation.",
      post: "Featuring clay-like forms, visible thumbprint textures, and matte tactile materials. Quirky stop-motion aesthetic."
    },
    {
      id: "cn-gem-style-animation",
      label: "CN Gem Style Animation",
      promptValue: "CN Gem Style Animation",
      category: "westernAnimationStyles",
      pre: "Rebecca Sugar / Cartoon Network Aesthetic animation.",
      post: "Featuring thick, soft-colored outlines, a palette of pastel pinks, purples, and teals, and expressive, rounded character designs. Backgrounds feature painterly textures with gem-like geometric lens flares. Gentle coming-of-age fantasy aesthetic."
    },
    {
      id: "cn-mixed-media-animation",
      label: "CN Mixed Media Animation",
      promptValue: "CN Mixed Media Animation",
      category: "westernAnimationStyles",
      pre: "Ben Bocquelet / Mixed-Media Cartoon Network animation Aesthetic.",
      post: "Featuring 2D characters with simple clean bold outlines and round eyes. The characters and elements are composited with shadow casts against real-world 3D environments. Quirky, experimental character shapes, flat bright colors and shading. Mixed-media animation aesthetic."
    },
    {
      id: "cutout-style-comedy",
      label: "Cutout Style Comedy",
      promptValue: "Cutout Style Comedy",
      category: "westernAnimationStyles",
      pre: "Paper-cutout South Park Studios animation style.",
      post: "Featuring flat paper-like shapes, simple facial features, and bold color blocks. Crude iconic comedy aesthetic."
    },
    {
      id: "dark-knight-animation",
      label: "Dark Knight Animation",
      promptValue: "Dark Knight Animation",
      category: "westernAnimationStyles",
      pre: "Warner Bros Dark Deco style animation.",
      post: "Featuring angular shapes, noir lighting, and a limited moody cel palette. 90s gothic-superhero aesthetic."
    },
    {
      id: "don-bluth-style",
      label: "Don Bluth Style",
      promptValue: "Don Bluth Style",
      category: "westernAnimationStyles",
      pre: "Don Bluth Productions style animation.",
      post: "Featuring expressive facial designs, dark atmospheric tones, and elegant cel-animation. Theatrical release old school aesthetic."
    },
    {
      id: "dreamworks-style",
      label: "Dreamworks Style",
      promptValue: "Dreamworks Style",
      category: "westernAnimationStyles",
      pre: "DreamWorks PDI style animation.",
      post: "Featuring sharp caricature, broad facial styling, glossy rendering, and cinematic lighting. Commercial feature-film aesthetic."
    },
    {
      id: "flash-animation",
      label: "Flash Animation",
      promptValue: "Flash Animation",
      category: "westernAnimationStyles",
      pre: "Early 2000s Flash / Newgrounds animation style.",
      post: "Featuring hard vector lines, flat fills, and edgy digital shapes. Early internet-animation aesthetic."
    },
    {
      id: "fleischer-rubber-hose-style",
      label: "Fleischer Rubber-Hose style.",
      promptValue: "Fleischer Rubber-Hose style.",
      category: "westernAnimationStyles",
      pre: "Fleischer Rubber-Hose style animation.",
      post: "Featuring bouncy limbs, black-and-white 1930s styling, and surreal proportions. Vintage early-animation aesthetic."
    },
    {
      id: "gameplay-footage",
      label: "Gameplay Footage",
      promptValue: "Gameplay Footage",
      category: "westernAnimationStyles",
      pre: "Modern Third-Person Action Video Game animation.",
      post: 'Featuring a dynamic user interface. High-fidelity real-time rendering, motion blur, particle effects and "shaky-cam"  physics. Immersive AAA gaming aesthetic.'
    },
    {
      id: "illumination-entertainment",
      label: "Illumination Entertainment",
      promptValue: "Illumination Entertainment",
      category: "westernAnimationStyles",
      pre: "Illumination Entertainment style animation.",
      post: "Featuring simplified shapes, bright colors, and soft glossy rendering. Mass-market cartoon aesthetic."
    },
    {
      id: "klasky-csupo-90s-style",
      label: "Klasky Csupo 90s style.",
      promptValue: "Klasky Csupo 90s style.",
      category: "westernAnimationStyles",
      pre: "Klasky Csupo 90s style animation.",
      post: "Featuring exaggerated facial styling, jagged linework, and retro cable-cartoon saturation. 90s grunge-cartoon aesthetic."
    },
    {
      id: "laika-stop-motion",
      label: "Laika Stop Motion",
      promptValue: "Laika Stop Motion",
      category: "westernAnimationStyles",
      pre: "Laika Stop-Motion style animation.",
      post: "Featuring handmade textures, tactile fabrics, and miniature-world material realism. Eerie handcrafted aesthetic."
    },
    {
      id: "ligne-claire-style",
      label: "Ligne claire style",
      promptValue: "Ligne claire style",
      category: "westernAnimationStyles",
      pre: "A Tintin comic-inspired animation style.",
      post: "Featuring Ligne claire contours, flatter color blocks, crisp comic polish, clean readable design, restrained shading, French comic graphic aesthetic."
    },
    {
      id: "looney-animation",
      label: "Looney Animation",
      promptValue: "Looney Animation",
      category: "westernAnimationStyles",
      pre: "Looney Tunes-inspired theatrical animation.",
      post: "Featuring exaggerated cartoon design, elastic shapes, and bold inked outlines. Golden-age animated movie aesthetic."
    },
    {
      id: "manhwa-webtoon-style",
      label: "Manhwa Webtoon style.",
      promptValue: "Manhwa Webtoon style.",
      category: "westernAnimationStyles",
      pre: "Manhwa Webtoon style animation.",
      post: "Featuring clean digital linework, smooth gradient shading, and polished character rendering. Glossy web-illustration aesthetic."
    },
    {
      id: "minimalist-cinematic-cartoon",
      label: "Minimalist Cinematic Cartoon",
      promptValue: "Minimalist Cinematic Cartoon",
      category: "westernAnimationStyles",
      pre: "Genndy Tartakovsky style animation.",
      post: "Featuring minimalist compositions, graphic shapes, and bold negative space. Cinematic animation aesthetic."
    },
    {
      id: "modern-cn-animation",
      label: "Modern CN Animation",
      promptValue: "Modern CN Animation",
      category: "westernAnimationStyles",
      pre: "Cartoon Network Modern style animation.",
      post: "Featuring flattened graphic shapes, bold outlines, and minimal background detail. Modern television-cartoon aesthetic."
    },
    {
      id: "modern-mystery-cartoon",
      label: "Modern Mystery Cartoon",
      promptValue: "Modern Mystery Cartoon",
      category: "westernAnimationStyles",
      pre: "Disney XD Alex Hirsch Mystery-Cartoon style animation.",
      post: "Featuring quirky character shapes with large round or oval eyes, warm cel-like colors, and a playful supernatural atmosphere. Whimsical mystery-adventure aesthetic."
    },
    {
      id: "modern-sci-fi-comedy",
      label: "Modern Sci-Fi Comedy",
      promptValue: "Modern Sci-Fi Comedy",
      category: "westernAnimationStyles",
      pre: "Modern Adult Swim loose-line style animation.",
      post: "Featuring rounded facial styling, simple colors, shading, weird gadget design, and slick digital finishes. Irreverent cosmic-comedy aesthetic."
    },
    {
      id: "pixar-style",
      label: "Pixar Style",
      promptValue: "Pixar Style",
      category: "westernAnimationStyles",
      pre: "Pixar Animation Studios 3D style.",
      post: "Featuring expressive eyes, readable silhouettes, and gentle surface rendering. Premium family-film CG aesthetic."
    },
    {
      id: "pixel-art",
      label: "Pixel Art",
      promptValue: "Pixel Art",
      category: "westernAnimationStyles",
      pre: "16-bit SNES JRPG Aesthetic animation.",
      post: "Featuring hand-placed pixel clusters, a limited 32-color palette, dithering for shadows, and charmingly chunky character proportions. Fluid 2D sprite animation aesthetic, high-contrast pixel art."
    },
    {
      id: "rankin-bass-stop-motion",
      label: "Rankin/Bass Stop Motion",
      promptValue: "Rankin/Bass Stop Motion",
      category: "westernAnimationStyles",
      pre: "Rankin/Bass Holiday Stop Motion style animation.",
      post: "Featuring soft retro fantasy styling, painted charm, and a muted television palette. Vintage fantasy-cartoon aesthetic. Captured with the look of a Ektachrome E100 film"
    },
    {
      id: "retro-video-game-cinematic",
      label: "Retro Video Game Cinematic",
      promptValue: "Retro Video Game Cinematic",
      category: "westernAnimationStyles",
      pre: "Mid-2000s Playstation 2 Cinematic animation.",
      post: "Featuring low-polygon geometry with low-quality baked texture maps, slight jagged edges (aliasing), fixed-camera composition, and bloom-heavy lighting. Early cinematic 3D gaming aesthetic."
    },
    {
      id: "rubberhose-video-game-style",
      label: "Rubberhose video game style",
      promptValue: "Rubberhose video game style",
      category: "westernAnimationStyles",
      pre: "Studio MDHR style animation.",
      post: "Featuring inked outlines, aged cel colors, and a 1930s rubber-hose design language. Retro game-cartoon aesthetic."
    },
    {
      id: "soviet-animation-style",
      label: "Soviet Animation Style",
      promptValue: "Soviet Animation Style",
      category: "westernAnimationStyles",
      pre: "Soyuzmultfilm animation style.",
      post: "Featuring textured backgrounds, simple character design and unusual color palettes, and surreal illustrative styling. Vintage Eastern-European Soviet Era aesthetic."
    },
    {
      id: "stop-motion-paper-collage-style",
      label: "Stop-Motion Paper Collage style.",
      promptValue: "Stop-Motion Paper Collage style.",
      category: "westernAnimationStyles",
      pre: "Stop-Motion Paper Collage style animation.",
      post: "Featuring layered matte paper shapes, handcrafted graphic construction, and tactile depth. Collage-like silhouette aesthetic."
    },
    {
      id: "tmnt-classic",
      label: "TMNT Classic",
      promptValue: "TMNT Classic",
      category: "westernAnimationStyles",
      pre: "1980s Murakami-Wolf-Swenson style animation.",
      post: "Featuring thick black outlines, bright flat cel palettes, simple colors, simple lineart and expressive TV-cartoon faces. VHS Low Quality, 1980s Saturday morning cartoon aesthetic."
    },
    {
      id: "transforming-robots",
      label: "Transforming Robots",
      promptValue: "Transforming Robots",
      category: "westernAnimationStyles",
      pre: "Toei Animation / Sunbow aesthetic.",
      post: "Featuring thin black outlines, Simple colors, simple line art, sharp geometric cel-shading, 1984 Takara-inspired design, 1980s Saturday morning cartoon aesthetic, VHS capture, noise grain effect."
    },
    {
      id: "trnka-puppet-animation-style",
      label: "Trnka Puppet-Animation style.",
      promptValue: "Trnka Puppet-Animation style.",
      category: "westernAnimationStyles",
      pre: "Trnka Puppet-Animation style.",
      post: "Featuring folk-art textures, sculpted forms, and uncanny handcrafted surfaces. Surreal handmade-puppet aesthetic."
    },
    {
      id: "underwater-comedy-animation",
      label: "Underwater Comedy Animation",
      promptValue: "Underwater Comedy Animation",
      category: "westernAnimationStyles",
      pre: "United Plankton / Stephen Hillenburg Aesthetic animation.",
      post: 'Featuring thick, slightly wobbly ink outlines, characters are simple flat color with vibrant tropical saturated colors, and hand-painted "flower sky" backgrounds with watercolor textures. Distorted, rubbery facial expressions with a lo-fi charm.'
    },
    {
      id: "upa-hubley-style",
      label: "UPA Hubley Style",
      promptValue: "UPA Hubley Style",
      category: "westernAnimationStyles",
      pre: "UPA 1950s John Hubley style animation.",
      post: "Featuring flat design, thick simple outlines for characters, minimal mid-century geometry, and restrained color blocks. Modernist graphic aesthetic."
    }
  ]
};

// engine/src/library-data.ts
var embeddedPresetLibrary = validateLibrary(presets_default);

// engine/src/compiler/linter.ts
function lintPromptIR(ir, library = embeddedPresetLibrary, compiled) {
  const result = compiled || renderCompilation(ir, library);
  const diagnostics = [...result.diagnostics];
  if (result.timeline?.shots.length) {
    for (const shot of result.timeline.shots) {
      const original = ir.motion.directorShots[shot.sourceIndex];
      const effective = inheritShot(ir, original.overrides);
      effective.action = [effective.action, original.note].filter(Boolean).join(" ");
      diagnostics.push(...semanticDiagnostics(effective, library).map((d) => ({ ...d, field: `motion.directorShots.${shot.sourceIndex}.${d.field || ""}` })));
    }
  } else
    diagnostics.push(...semanticDiagnostics(ir, library));
  const text = [result.positivePrompt, result.negativePrompt].filter(Boolean).join(" ");
  const estimatedTokens = Math.ceil(text.length / 4);
  const tokenBudget = ir.tokenBudget || 2048;
  if (estimatedTokens > tokenBudget)
    diagnostics.push({ severity: "warning", code: "TOKEN_OVERFLOW", message: `Emitted prompt is approximately ${estimatedTokens} tokens against the configured advisory budget ${tokenBudget}. Text is preserved; this estimate is not a provider limit.` });
  return { valid: !diagnostics.some((d) => d.severity === "error"), estimatedTokens, tokenBudget, diagnostics };
}
function semanticDiagnostics(ir, library) {
  const diagnostics = [];
  const lens = ir.optics?.lens ? resolvePreset(library, "lenses", ir.optics.lens).value.toLowerCase() : "";
  const focal = ir.optics?.focalLength ? resolvePreset(library, "focalLengths", ir.optics.focalLength).value.toLowerCase() : "";
  if (lens.includes("fisheye") && /telephoto|85mm|200mm|300mm/.test(focal))
    diagnostics.push({ severity: "error", code: "OPTICAL_CONFLICT", field: "optics", message: `Fisheye lens conflicts with focal length ${focal}.` });
  const fStop = Number(ir.optics?.fStop?.replace(/^f\/?/i, ""));
  if (fStop > 22)
    diagnostics.push({ severity: "warning", code: "EXTREME_FSTOP", field: "optics.fStop", message: `Aperture f/${fStop} suggests pronounced diffraction; check the intended look.` });
  const video = ir.mode === "video" || !ir.mode && ["kling", "veo", "sora", "runway", "wan"].includes(ir.target);
  if (video) {
    const motion = [ir.motion?.movement, ir.kinematics?.primaryVector, ir.kinematics?.secondaryDrift].filter(Boolean).join(" ").toLowerCase();
    const axes = [/\b(pan|truck)\b/, /\b(tilt|pedestal|crane)\b/, /\b(dolly|zoom|push)\b/, /\b(orbit|roll|arc)\b/].filter((re) => re.test(motion)).length;
    if (axes >= 3)
      diagnostics.push({ severity: "warning", code: "MULTI_AXIS_CONFLICT", field: "kinematics", message: "Several camera axes are requested. Clarify which are simultaneous and which are sequential." });
    if (ir.motion?.speed === "freeze" && (ir.motion.movement || ir.action || ir.actionChoreography?.execution || ir.kinematics?.primaryVector))
      diagnostics.push({ severity: "warning", code: "MOTION_CONFLICT", field: "motion.speed", message: "Freeze conflicts with supplied movement/action; clarify which subject or camera remains still." });
    const action = [ir.action, ir.actionChoreography?.execution, ...ir.motion?.directorShots?.map((s) => s.note) || []].join(" ").toLowerCase();
    if (/fight|slash|crash|explod|slam|sprint|strike|punch|drift/.test(action) && !(ir.physics?.massAndInertia || ir.physics?.causalChain || ir.physics?.forces?.length))
      diagnostics.push({ severity: "warning", code: "MISSING_INERTIA", field: "physics", message: "Fast or forceful action has no mass, force or causal description; consider describing its physical follow-through." });
  }
  if (ir.style?.mode === "photo" && (ir.style.animeGenre || ir.style.animeShow || ir.style.westernStyle))
    diagnostics.push({ severity: "warning", code: "STYLE_CONFLICT", field: "style", message: "Photographic medium and animation presets are both selected; confirm this mixed-media intent." });
  return diagnostics;
}

// engine/src/compiler/compilers.ts
function compilePrompt(input, library) {
  const ir = PromptIRSchema.parse(input);
  const result = renderCompilation(ir, library);
  const lint = lintPromptIR(ir, library, result);
  return { ...result, valid: lint.valid, lint, diagnostics: lint.diagnostics, warnings: lint.diagnostics.map((d) => d.message) };
}
var targetCompiler = (target) => (ir, library) => compilePrompt({ ...ir, target }, library);
var compileMidjourney = targetCompiler("midjourney");
var compileFlux = targetCompiler("flux");
var compileKling = targetCompiler("kling");
var compileRunway = targetCompiler("runway");
var compileWan = targetCompiler("wan");
var compileSora = targetCompiler("sora");
var compileVeo = targetCompiler("veo");
var compileGeneric = targetCompiler("generic");
var compileSDXL = targetCompiler("sdxl");
var compileImagen = targetCompiler("imagen-3");

// engine/src/assemble.ts
function assembleDetailed(state, library) {
  return compilePrompt(stateToIR(state), library);
}

// engine/src/compiler/discovery.ts
var promptIRJsonSchema = toJSONSchema(PromptIRSchema, { io: "input", target: "draft-7" });
var promptStateJsonSchema = toJSONSchema(PromptStateInputSchema, { io: "input", target: "draft-7" });

// engine/src/video.ts
var DIRECTOR_SHOT_TYPE = "customize";
var DIRECTOR_PROMPT_MAX_CHARS = DEFAULT_TIMELINE_LIMITS.maxPromptChars;
var DIRECTOR_MAX_SHOTS = DEFAULT_TIMELINE_LIMITS.maxShots;
var DIRECTOR_MIN_TOTAL_DURATION = DEFAULT_TIMELINE_LIMITS.minTotalDuration;
var DIRECTOR_MAX_TOTAL_DURATION = DEFAULT_TIMELINE_LIMITS.maxTotalDuration;
function buildDirectorTimeline(shots, fallbackDuration, options = {}) {
  const inputs = (shots ?? []).map((shot) => ({
    shotId: shot.shotId,
    note: shot.note || "",
    overrides: shot.overrides,
    duration: shot.durationHint?.trim() ? Number(shot.durationHint) : fallbackDuration?.trim() ? Number(fallbackDuration) : 5
  }));
  const plain = normalizeTimeline(inputs, options.timelineOptions || options.scene?.timelineOptions);
  const compiled = options.scene || (shots ?? []).some((s) => s.overrides) ? compilePrompt(PromptIRSchema.parse({ subject: "a subject", noText: false, ...options.scene, target: options.scene?.target || "generic", mode: "video", timelineOptions: options.timelineOptions || options.scene?.timelineOptions, motion: { ...options.scene?.motion, directorShots: inputs } }), options.library || embeddedPresetLibrary) : undefined;
  const result = compiled?.timeline || plain;
  const normalized = result.shots.map((s) => ({ index: s.index, shotId: s.shotId, prompt: s.prompt, duration: String(s.duration) }));
  return {
    shots: normalized,
    shotType: DIRECTOR_SHOT_TYPE,
    totalDuration: result.totalDuration,
    clampedDuration: result.totalDuration,
    requestedTotalDuration: result.requestedTotalDuration,
    timelinePrompt: normalized.map((s) => `Shot ${s.index}: ${s.prompt} (${s.duration}s)`).join(" "),
    referenceResolution: compiled?.referenceResolution,
    shotReferences: compiled?.shotReferences,
    diagnostics: compiled?.diagnostics || result.diagnostics,
    droppedShots: result.droppedShots
  };
}

// engine/src/sync.ts
function sync(prevText, nextText) {
  return nextText.replace(/\s+/g, " ").trim();
}

// engine/src/search/hybrid.ts
function makeTrigrams(text) {
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  const set = new Set;
  for (let i = 0;i <= clean.length - 3; i++) {
    set.add(clean.slice(i, i + 3));
  }
  return set;
}
function trigramSimilarity(a, b) {
  if (a.size === 0 || b.size === 0)
    return 0;
  let matches = 0;
  for (const t of a) {
    if (b.has(t))
      matches++;
  }
  return 2 * matches / (a.size + b.size);
}

class HybridSearchEngine {
  docs = [];
  avgDocLength = 0;
  df = new Map;
  constructor(library) {
    this.indexLibrary(library);
  }
  indexLibrary(library) {
    let totalLength = 0;
    for (const [catName, catItems] of Object.entries(library)) {
      if (Array.isArray(catItems)) {
        for (const item of catItems) {
          const desc = item.pre ? `${item.pre} ${item.post}` : item.promptValue;
          const fullText = `${item.id} ${item.label} ${item.promptValue || ""} ${item.pre || ""} ${item.post || ""} ${catName}`;
          const tokens = fullText.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length >= 2);
          const trigrams = makeTrigrams(`${item.id} ${item.label} ${item.promptValue || ""}`);
          const doc = {
            category: catName,
            id: item.id,
            label: item.label,
            promptValue: item.promptValue || item.label,
            description: desc,
            tokens,
            trigrams,
            length: tokens.length
          };
          this.docs.push(doc);
          totalLength += tokens.length;
          const uniqueTokens = new Set(tokens);
          for (const t of uniqueTokens) {
            this.df.set(t, (this.df.get(t) || 0) + 1);
          }
        }
      }
    }
    for (const m of CINEMATIC_CAMERA_MOVEMENTS) {
      const fullText = `${m.id} ${m.label} ${m.category} ${m.promptKeyword} ${m.fullPromptRecipe} ${(m.aliases || []).join(" ")}`;
      const tokens = fullText.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length >= 2);
      const trigrams = makeTrigrams(`${m.id} ${m.label} ${(m.aliases || []).join(" ")}`);
      const doc = {
        category: `movements/${m.category}`,
        id: m.id,
        label: m.label,
        promptValue: m.promptKeyword,
        description: m.fullPromptRecipe,
        tokens,
        trigrams,
        length: tokens.length
      };
      this.docs.push(doc);
      totalLength += tokens.length;
      const uniqueTokens = new Set(tokens);
      for (const t of uniqueTokens) {
        this.df.set(t, (this.df.get(t) || 0) + 1);
      }
    }
    this.avgDocLength = totalLength / Math.max(1, this.docs.length);
  }
  search(query, options = {}) {
    const q = query.trim().toLowerCase();
    if (!q)
      return [];
    const queryTokens = q.replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length >= 2);
    const queryTrigrams = makeTrigrams(q);
    const k1 = 1.2;
    const b = 0.75;
    const N = this.docs.length;
    const results = [];
    for (const doc of this.docs) {
      if (options.category && !doc.category.startsWith(options.category))
        continue;
      let bm25 = 0;
      for (const term of queryTokens) {
        const tf = doc.tokens.filter((t) => t === term).length;
        if (tf > 0) {
          const docFreq = this.df.get(term) || 1;
          const idf = Math.log((N - docFreq + 0.5) / (docFreq + 0.5) + 1);
          const numerator = tf * (k1 + 1);
          const denominator = tf + k1 * (1 - b + b * doc.length / this.avgDocLength);
          bm25 += idf * (numerator / denominator);
        }
      }
      let exactBoost = 0;
      if (doc.id.toLowerCase() === q || doc.label.toLowerCase() === q)
        exactBoost += 50;
      else if (doc.id.toLowerCase().includes(q) || doc.label.toLowerCase().includes(q))
        exactBoost += 20;
      const fuzzy = trigramSimilarity(queryTrigrams, doc.trigrams) * 15;
      const totalScore = bm25 * 5 + exactBoost + fuzzy;
      if (totalScore > 1.5) {
        results.push({
          category: doc.category,
          id: doc.id,
          label: doc.label,
          promptValue: doc.promptValue,
          description: doc.description,
          score: Math.round(totalScore * 10) / 10
        });
      }
    }
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, options.limit || 20);
  }
}

// engine/src/mcp/server.ts
import { createInterface } from "node:readline";
var MCP_TOOLS = [
  {
    name: "compile_prompt",
    description: "Compile high-level scene semantics, optics, physics, and spatial blocking into target prompt dialects with automatic validation.",
    inputSchema: promptIRJsonSchema
  },
  {
    name: "assemble_prompt",
    description: "Assemble photo, anime, edit or video state with full preset, spatial and Director support. Returns diagnostics and normalized timeline.",
    inputSchema: promptStateJsonSchema
  },
  {
    name: "capabilities",
    description: "Describe target dialects and complete runtime schemas.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false }
  },
  {
    name: "lint_prompt",
    description: "Analyze prompt IR for optical contradictions, lens mismatches, and configured advisory text budgets.",
    inputSchema: {
      type: "object",
      properties: {
        promptIR: promptIRJsonSchema
      },
      required: ["promptIR"]
    }
  },
  {
    name: "search_catalog",
    description: "Hybrid semantic BM25 + n-gram search across 560+ cinematic presets and camera movements.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Natural language search query" },
        category: { type: "string", description: "Optional category filter" },
        limit: { type: "number", description: "Max results to return" }
      },
      required: ["query"]
    }
  }
];

class McpStdioServer {
  library;
  searchEngine;
  constructor(library) {
    this.library = library;
    this.searchEngine = new HybridSearchEngine(library);
  }
  handleCall(toolName, args) {
    switch (toolName) {
      case "assemble_prompt":
        return assembleDetailed(normalizeState(args), this.library);
      case "capabilities":
        return { targets: TARGET_CAPABILITIES, sceneCapabilities: SCENE_CAPABILITIES, promptIR: promptIRJsonSchema, state: promptStateJsonSchema };
      case "compile_prompt": {
        const ir = PromptIRSchema.parse(args);
        return compilePrompt(ir, this.library);
      }
      case "lint_prompt": {
        const ir = PromptIRSchema.parse(args.promptIR || args);
        return lintPromptIR(ir, this.library);
      }
      case "search_catalog": {
        const query = String(args.query || "");
        const category = args.category;
        const limit = typeof args.limit === "number" ? args.limit : 15;
        return this.searchEngine.search(query, { category, limit });
      }
      default:
        throw new Error(`Unknown MCP tool: ${toolName}`);
    }
  }
  async start() {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });
    for await (const line of rl) {
      if (!line.trim())
        continue;
      let id = null;
      let parsed = false;
      try {
        const request = JSON.parse(line);
        parsed = true;
        if (!request || typeof request !== "object" || Array.isArray(request) || request.jsonrpc !== "2.0" || typeof request.method !== "string") {
          process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32600, message: "Invalid JSON-RPC request" } }) + `
`);
          continue;
        }
        if (request.id === undefined)
          continue;
        if (typeof request.id !== "string" && typeof request.id !== "number")
          throw new Error("Request id must be a string or number");
        id = request.id;
        const { method, params } = request;
        let result;
        if (method === "initialize") {
          result = { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "promptcraft-mcp", version: "2.0.0" } };
        } else if (method === "ping")
          result = {};
        else if (method === "tools/list")
          result = { tools: MCP_TOOLS };
        else if (method === "tools/call") {
          try {
            const value = this.handleCall(params?.name, params?.arguments || {});
            const invalid = !!value && typeof value === "object" && "valid" in value && value.valid === false;
            result = { content: [{ type: "text", text: JSON.stringify(value, null, 2) }], isError: invalid };
          } catch (err) {
            result = { content: [{ type: "text", text: err instanceof Error ? err.message : String(err) }], isError: true };
          }
        } else {
          process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } }) + `
`);
          continue;
        }
        process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + `
`);
      } catch (err) {
        process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, error: { code: parsed ? -32600 : -32700, message: err instanceof Error ? err.message : String(err) } }) + `
`);
      }
    }
  }
}

// engine/src/cli.ts
var __dirname2 = dirname(fileURLToPath(import.meta.url));
function getPresetLibrary() {
  const localPath = join(__dirname2, "..", "library", "presets.json");
  if (existsSync(localPath)) {
    try {
      const data = JSON.parse(readFileSync(localPath, "utf-8"));
      return validateLibrary(data);
    } catch {
      return embeddedPresetLibrary;
    }
  }
  return embeddedPresetLibrary;
}
var library = getPresetLibrary();
function printHelp() {
  const helpText = `
Promptcraft CLI - Cinematic Prompt Assembly Engine for AI Agents

USAGE:
  promptcraft <command> [options]
  promptcraft --state '<json-state>'
  cat state.json | promptcraft

CORE COMMANDS:
  assemble [options]            Assemble prompt from flags or JSON input (mode: photo|anime|edit|video)
  photo [options]               Assemble photo prompt
  anime [options]               Assemble anime/western animation prompt
  edit [options]                Assemble edit/in-painting prompt
  video [options]               Assemble video prompt with camera movement & autofill
  director [options]            Build a validated Director multi-shot timeline
  compile [options]             Compile PromptIR JSON or flags to a target dialect
  lint [options]                Check emitted text, presets and scene contradictions
  mcp                           Serve tools over MCP stdio
  references [options]          Resolve reference slots with category priority pruning
  sync [options]                Re-sync modified prompt fragments in-place
  catalog [subcommand]          Explore available catalogs (shots, lighting, cameras, film, anime, movements...)
  capabilities                  Output machine-readable catalog & action schema for AI agents
  validate [options]            Validate a PromptState or VideoState JSON object
  help                          Show this help message

ASSEMBLE FLAGS:
  --target <name>               Target dialect (see capabilities)
  --focal-length <id>           Focal-length preset or custom value
  --direction <id>              Subject view direction preset
  --genre <id>                  Image genre preset
  --style-mode <name>           photo|anime|western-animation|illustration|cinematic
  --art-style <text>            Custom art direction
  --negative <text>             Elements to exclude
  --seed <integer>              Seed hint returned in parameters
  --quality <number>            Midjourney quality flag; diagnosed on other targets
  --mode <photo|anime|edit|video>
  --subject <text>              Subject description
  --action <text>               Subject action / primary action
  --env <text>                  Environment / background setting
  --mood <text>                 Mood / atmosphere description
  --shot <id>                   Shot ID (e.g. bird-s-eye-view, close-up, wide-shot...)
  --lighting <id>               Lighting ID (e.g. golden-hour, dramatic-cinematic, neon-lit...)
  --camera <id>                 Camera ID (e.g. arri-alexa-65, red-digital-cinema-camera...)
  --lens <id>                   Lens ID (e.g. anamorphic-cinema-lens, helios-44-2-swirly-bokeh...)
  --f-stop <value>              f-stop value (e.g. f/1.4, f/2.8)
  --film <id>                   Film stock ID (e.g. kodak-vision3-500t, fujifilm-eterna...)
  --filter <ids...>             Filter IDs (comma-separated or multiple --filter flags)
  --movie-look <id>             Movie look ID (e.g. blade-runner-2049, the-matrix, dune...)
  --photographer <id>           Photographer style ID (e.g. gregory-crewdson, annie-leibovitz...)
  --anime-genre <id>            Anime genre ID (e.g. 3d-anime, cyberpunk...)
  --anime-show <id>             Anime show style ID (e.g. neon-revelation, demon-hunter...)
  --western-style <id>          Western animation style ID (e.g. pixar-3d, spider-verse...)
  --aspect <ratio>              Aspect ratio (default: 16:9)
  --no-text                     Add no-text / textless guard
  --candid                      Add candid shot clause
  --new-angle                   Add new angle prompt clause
  --video-prompt <text>         Video specific prompt
  --movement <label>            Video camera movement label (e.g. 'Orbit', 'Dolly in', 'Pan')
  --director-mode               Enable multi-shot director mode
  --json                        Output structured JSON result (default in non-TTY or with json input)
  --raw                         Output plain prompt string only
  --state <json>                Pass full state as JSON string

CATALOG SUBCOMMANDS:
  catalog list [category]       List items in a catalog category (e.g. shots, lighting, cameras, movements)
  catalog search <query>        Search presets across all categories or in a specific category
  catalog categories            List all available catalog category names

EXAMPLES:
  # Assemble photo prompt:
  promptcraft photo --subject "cyberpunk detective in rain" --shot close-up --lighting neon-lit --movie-look blade-runner-2049

  # Assemble anime prompt:
  promptcraft anime --subject "sorcerer casting blue flame" --anime-genre cyberpunk --anime-show neon-revelation

  # Assemble video prompt:
  promptcraft video --subject "sports car drifting" --movement "Orbit" --env "neon city wet asphalt"

  # JSON payload over stdin (AI agent integration):
  echo '{"action":"assemble","mode":"photo","subject":"astronaut on Mars","shotId":"wide-shot"}' | promptcraft

  # Discover capabilities for AI agents:
  promptcraft capabilities
`;
  console.log(helpText);
}
function outputResult(result, raw = false) {
  if (raw && result.status === "ok") {
    if (typeof result.prompt === "string") {
      const diagnostics = result.data?.diagnostics;
      if (diagnostics?.length)
        process.stderr.write(JSON.stringify({ diagnostics }) + `
`);
      process.stdout.write(result.prompt + `
`);
      return;
    }
    if (typeof result.data === "string") {
      process.stdout.write(result.data + `
`);
      return;
    }
  }
  console.log(JSON.stringify(result, null, 2));
}
var VALID_COMMANDS = {
  assemble: true,
  assemble_prompt: true,
  photo: true,
  anime: true,
  edit: true,
  video: true,
  assemble_video: true,
  director: true,
  director_timeline: true,
  references: true,
  resolve_references: true,
  sync: true,
  catalog: true,
  capabilities: true,
  suggest: true,
  validate: true,
  help: true,
  "--help": true,
  "-h": true,
  compile: true,
  lint: true,
  mcp: true,
  hybrid_search: true
};
function parseCliArgs(args) {
  const flags = {};
  const positionals = [];
  let command = "assemble";
  let i = 0;
  if (args.length > 0 && args[0] in VALID_COMMANDS) {
    command = args[0];
    i = 1;
  }
  const booleanFlags = new Set(["raw", "no-text", "candid", "new-angle", "director-mode"]);
  const valueFlags = new Set(["mode", "subject", "action", "env", "mood", "shot", "lighting", "camera", "lens", "f-stop", "film", "filter", "movie-look", "photographer", "anime-genre", "anime-show", "western-style", "aspect", "video-prompt", "movement", "state", "target", "focal-length", "direction", "genre", "style-mode", "art-style", "negative", "seed", "quality", "note", "prompt", "duration", "prev", "prev-text", "next", "next-text", "category", "query", "intent"]);
  while (i < args.length) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (booleanFlags.has(key) || key === "json" && (!next || !next.trim().startsWith("{"))) {
        flags[key] = next === "false" ? false : true;
        i += next === "true" || next === "false" ? 2 : 1;
      } else {
        if (!valueFlags.has(key) && key !== "json")
          throw new Error(`Unknown option --${key}`);
        if (next === undefined || next.startsWith("--"))
          throw new Error(`Option --${key} requires a value`);
        if (flags[key] !== undefined) {
          if (key !== "filter")
            throw new Error(`Option --${key} may only be supplied once`);
          const current = flags[key];
          flags[key] = Array.isArray(current) ? [...current, next] : [String(current), next];
        } else
          flags[key] = next;
        i += 2;
      }
    } else if (arg.startsWith("-"))
      throw new Error(`Unknown option ${arg}`);
    else {
      positionals.push(arg);
      i += 1;
    }
  }
  return { command, flags, positionals };
}
function handleCapabilities() {
  const catalogSummary = {};
  for (const [key, value] of Object.entries(library)) {
    if (Array.isArray(value)) {
      const presets = value;
      catalogSummary[key] = {
        count: presets.length,
        sample: presets.slice(0, 5).map((item) => ({
          id: item.id,
          label: item.label
        }))
      };
    }
  }
  return {
    status: "ok",
    action: "capabilities",
    data: {
      version: "1.2.0",
      schemas: { promptIR: promptIRJsonSchema, state: promptStateJsonSchema },
      targets: TARGET_CAPABILITIES,
      sceneCapabilities: SCENE_CAPABILITIES,
      actions: [
        { name: "compile", description: "Compile PromptIR with automatic diagnostics", inputSchema: promptIRJsonSchema },
        { name: "lint", description: "Lint the emitted prompt after preset expansion", inputSchema: promptIRJsonSchema },
        {
          name: "assemble",
          description: "Assemble photographic, anime, edit, or video prompts deterministically",
          inputSchema: promptStateJsonSchema,
          parameters: {
            mode: "photo | anime | edit | video",
            subject: "string",
            subjectAction: "string",
            environment: "string",
            mood: "string",
            shotId: "shot catalog id",
            lightingId: "lighting catalog id",
            cameraId: "camera catalog id",
            lensId: "lens catalog id",
            fStop: "f-stop string",
            filmId: "film catalog id",
            filters: "array of filter ids",
            movieLookId: "movie look catalog id",
            photographerId: "photographer catalog id",
            animeGenreId: "anime genre catalog id",
            animeShowStyleId: "anime show style catalog id",
            westernAnimationStyleId: "western animation style catalog id",
            aspectRatio: "16:9 | 9:16 | 1:1 | 4:3 | 21:9 | 3:2",
            noText: "boolean",
            candidShot: "boolean",
            showNewAnglePrompt: "boolean",
            references: "array of ReferenceSlot objects"
          }
        },
        {
          name: "assemble_video",
          description: "Assemble video prompts with presets, spatial controls and Director inheritance",
          inputSchema: promptStateJsonSchema,
          parameters: {
            videoPrompt: "string",
            movementLabel: "movement label from VIDEO_MOVEMENTS (26 movements)",
            movementCursor: "number (offset where keyword is inserted)",
            directorMode: "boolean",
            directorShots: "array of DirectorShot { shotId?, note, durationHint? }",
            subjectAction: "string",
            environment: "string",
            mood: "string",
            aspectRatio: "string",
            references: "array of ReferenceSlot"
          }
        },
        {
          name: "director_timeline",
          description: "Construct a coherent timeline using configurable engine limits; accepts shared state or ir and per-shot overrides",
          parameters: {
            shots: "array of { shotId?, note: string, durationHint?: string }",
            fallbackDuration: "optional string duration"
          }
        },
        {
          name: "resolve_references",
          description: "Resolve and prune reference slots by category priority (global > face > scene > outfit > object > anonymous)",
          parameters: {
            slots: "array of ReferenceSlotInput",
            options: '{ order?: "generate" | "edit", maxReferenceImages?: number, labelMode?: "image" | "file" }'
          }
        },
        {
          name: "sync",
          description: "In-place synchronization and update of prompt fragments when settings change",
          parameters: {
            prevText: "string",
            nextText: "string"
          }
        },
        {
          name: "catalog",
          description: "Query preset catalog entries and options",
          parameters: {
            category: "shots | lighting | cameras | lenses | focalLengths | filmStocks | genres | photographers | movieLooks | filters | aspectRatios | animeGenres | animeShowStyles | westernAnimationStyles | movements",
            query: "optional search query"
          }
        }
      ],
      videoMovementsCount: CINEMATIC_CAMERA_MOVEMENTS.length,
      videoMovements: CINEMATIC_CAMERA_MOVEMENTS.map((m) => ({
        id: m.id,
        label: m.label,
        category: m.category,
        promptKeyword: m.promptKeyword,
        fullPromptRecipe: m.fullPromptRecipe
      })),
      catalogs: catalogSummary
    }
  };
}
var CATALOG_SYNONYMS = {
  evangelion: ["neon-revelation", "retro-mobile-suit", "modern-mobile-suit"],
  eva: ["neon-revelation"],
  ghibli: ["ghibli-like-fantasy", "forest-princess"],
  miyazaki: ["ghibli-like-fantasy", "forest-princess"],
  mononoke: ["forest-princess"],
  frieren: ["beyond-the-journey"],
  titan: ["attack-on-giants"],
  shingeki: ["attack-on-giants"],
  cyberpunk: ["edgerunners", "ghost-in-the-system", "blade-runner", "blade-runner-2049", "the-matrix", "neon-lit", "neon-lighting"],
  edgerunner: ["edgerunners"],
  "ghost in the shell": ["ghost-in-the-system"],
  naruto: ["ninja-bandana"],
  jujutsu: ["jujitsu-curse-domain"],
  "sailor moon": ["lunar-sailor"],
  cardcaptor: ["charmcaptor"],
  "cowboy bebop": ["cowboy-spaceman"],
  bebop: ["cowboy-spaceman"],
  claymore: ["greyblade"],
  "ergo proxy": ["proxy-error"],
  "violet evergarden": ["purple-evergarden"],
  gundam: ["retro-mobile-suit", "modern-mobile-suit"],
  "solo leveling": ["solo-level-ascension"],
  "junji ito": ["spiral-horror"],
  uzumaki: ["spiral-horror"],
  "tokyo ghoul": ["tokyo-demon-gloom"],
  hellsing: ["van-helsing-limited"],
  "your name": ["your-title"],
  pokemon: ["pok-collector"],
  disney: ["3d-family-film", "classic-animated-movie", "modern-mystery-cartoon"],
  pixar: ["pixar-style"],
  dreamworks: ["dreamworks-style"],
  "spider-verse": ["2d-3d-hybrid-animation"],
  arcane: ["2d-3d-hybrid-animation"],
  fortiche: ["2d-3d-hybrid-animation"],
  batman: ["dark-knight-animation"],
  tintin: ["ligne-claire-style"],
  "looney tunes": ["looney-animation"],
  spongebob: ["underwater-comedy-animation"],
  "rick and morty": ["modern-sci-fi-comedy"],
  "gravity falls": ["modern-mystery-cartoon"],
  cuphead: ["rubberhose-video-game-style"],
  "steven universe": ["cn-gem-style-animation"],
  gumball: ["cn-mixed-media-animation"],
  "samurai jack": ["minimalist-cinematic-cartoon"],
  tartakovsky: ["minimalist-cinematic-cartoon"],
  coraline: ["laika-stop-motion"],
  "tim burton": ["burtonesque-stop-motion"],
  hitchcock: ["dolly-zoom"],
  vertigo: ["dolly-zoom"],
  kubrick: ["2001-a-space-odyssey"],
  matrix: ["the-matrix"],
  "blade runner": ["blade-runner", "blade-runner-2049"],
  dune: ["dune"],
  interstellar: ["interstellar"],
  imax: ["kodak-vision3-imax", "arri-alexa-65", "red-v-raptor-8k"],
  "70mm": ["kodak-vision3-imax", "arri-alexa-65", "red-v-raptor-8k"],
  "35mm": ["35mm-film-camera", "kodak-portra-400", "cinestill-800t"],
  anamorphic: ["anamorphic-cinema-lens"],
  bokeh: ["helios-44-2-swirly-bokeh", "85mm-portrait"],
  "wide angle": ["14mm-ultra-wide", "24mm-wide-angle", "35mm-wide"],
  drone: ["drone-photography", "drone-push-in", "drone-pull-back", "helicopter-shot"],
  fpv: ["fpv", "drone-push-in"],
  "slow motion": ["slow-motion"],
  "time lapse": ["time-lapse"],
  "dutch angle": ["dutch-angle"],
  "golden hour": ["golden-hour"],
  neon: ["neon-lit", "neon-lighting", "blade-runner-2049", "the-matrix", "edgerunners"],
  noir: ["chiaroscuro-lighting", "black-and-white", "blade-runner", "the-maltese-falcon", "chinatown"]
};
function handleCatalog(positionals, flags) {
  const sub = positionals[0] || "categories";
  if (sub === "categories") {
    const categories = Object.keys(library).filter((k) => k !== "version");
    categories.push("movements");
    return {
      status: "ok",
      action: "catalog.categories",
      data: categories
    };
  }
  if (sub === "movements" || sub === "cinematicMovements") {
    return {
      status: "ok",
      action: "catalog.movements",
      data: CINEMATIC_CAMERA_MOVEMENTS
    };
  }
  if (sub === "list") {
    const category = positionals[1] || flags.category;
    if (!category) {
      return {
        status: "error",
        error: "Specify a category to list. Available: " + Object.keys(library).filter((k) => k !== "version").join(", ") + ", movements"
      };
    }
    if (category === "movements" || category === "videoMovements" || category === "cinematicMovements") {
      return {
        status: "ok",
        action: "catalog.list",
        data: CINEMATIC_CAMERA_MOVEMENTS
      };
    }
    if (!(category in library) || !Array.isArray(library[category])) {
      return {
        status: "error",
        error: `Category '${category}' not found in library.`
      };
    }
    const items = library[category];
    return {
      status: "ok",
      action: "catalog.list",
      data: items
    };
  }
  if (sub === "search") {
    const query = positionals.slice(1).join(" ") || flags.query || "";
    if (!query) {
      return {
        status: "error",
        error: "Specify search query with `catalog search <query>` or --query <query>"
      };
    }
    const categoryFilter = flags.category;
    const q = query.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    const results = [];
    const synonymTargetIds = new Set;
    for (const [key, targets] of Object.entries(CATALOG_SYNONYMS)) {
      if (q === key || q.includes(key) || key.includes(q)) {
        for (const id of targets)
          synonymTargetIds.add(id);
      }
    }
    for (const [catName, catItems] of Object.entries(library)) {
      if (categoryFilter && catName !== categoryFilter)
        continue;
      if (Array.isArray(catItems)) {
        for (const item of catItems) {
          const id = item.id.toLowerCase();
          const label = item.label.toLowerCase();
          const pv = (item.promptValue || "").toLowerCase();
          const pre = (item.pre || "").toLowerCase();
          const post = (item.post || "").toLowerCase();
          const fullBlob = `${id} ${label} ${pv} ${pre} ${post} ${catName.toLowerCase()}`;
          let score = 0;
          if (id === q)
            score += 100;
          else if (label === q)
            score += 90;
          else if (synonymTargetIds.has(item.id))
            score += 85;
          else if (id.includes(q))
            score += 60;
          else if (label.includes(q))
            score += 50;
          else if (pv.includes(q))
            score += 40;
          else if (pre.includes(q))
            score += 35;
          else if (post.includes(q))
            score += 25;
          else if (terms.length > 1 && terms.every((t) => fullBlob.includes(t)))
            score += 20;
          else if (terms.length > 1 && terms.some((t) => id.includes(t) || label.includes(t)))
            score += 10;
          if (score > 0) {
            results.push({
              category: catName,
              id: item.id,
              label: item.label,
              promptValue: item.promptValue || item.label,
              description: item.pre ? `${item.pre} ${item.post}` : item.promptValue !== item.label ? item.promptValue : undefined,
              score
            });
          }
        }
      }
    }
    if (!categoryFilter || categoryFilter === "movements" || categoryFilter.startsWith("movements/")) {
      for (const m of CINEMATIC_CAMERA_MOVEMENTS) {
        const id = m.id.toLowerCase();
        const label = m.label.toLowerCase();
        const cat = m.category.toLowerCase();
        const kw = m.promptKeyword.toLowerCase();
        const recipe = m.fullPromptRecipe.toLowerCase();
        const aliases = m.aliases.map((a) => a.toLowerCase());
        const fullBlob = `${id} ${label} ${cat} ${kw} ${recipe} ${aliases.join(" ")}`;
        let score = 0;
        if (id === q)
          score += 100;
        else if (label === q)
          score += 90;
        else if (synonymTargetIds.has(m.id))
          score += 85;
        else if (aliases.includes(q))
          score += 80;
        else if (id.includes(q))
          score += 60;
        else if (label.includes(q))
          score += 50;
        else if (kw.includes(q))
          score += 45;
        else if (aliases.some((a) => a.includes(q)))
          score += 40;
        else if (recipe.includes(q))
          score += 30;
        else if (terms.length > 1 && terms.every((t) => fullBlob.includes(t)))
          score += 20;
        else if (terms.length > 1 && terms.some((t) => id.includes(t) || label.includes(t)))
          score += 10;
        if (score > 0) {
          results.push({
            category: `movements/${m.category}`,
            id: m.id,
            label: m.label,
            promptValue: m.promptKeyword,
            description: m.fullPromptRecipe,
            score
          });
        }
      }
    }
    results.sort((a, b) => b.score - a.score);
    return {
      status: "ok",
      action: "catalog.search",
      data: { query, count: results.length, results }
    };
  }
  return {
    status: "error",
    error: `Unknown catalog subcommand '${sub}'. Use categories, list <cat>, search <query>, or movements.`
  };
}
function handleSuggest(intent) {
  const q = intent.trim().toLowerCase();
  if (!q) {
    return { status: "error", error: "Specify an intent or theme to suggest presets for." };
  }
  const words = q.replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length >= 3);
  const synonymTargetIds = new Set;
  for (const [key, targets] of Object.entries(CATALOG_SYNONYMS)) {
    if (q === key || q.includes(key) || key.includes(q)) {
      for (const id of targets)
        synonymTargetIds.add(id);
    }
  }
  const scoreItem = (item, cat) => {
    const id = item.id.toLowerCase();
    const label = item.label.toLowerCase();
    const pv = (item.promptValue || "").toLowerCase();
    const pre = (item.pre || "").toLowerCase();
    const post = (item.post || "").toLowerCase();
    const text = `${id} ${label} ${pv} ${pre} ${post}`;
    let score = 0;
    if (id === q || label === q)
      score += 100;
    if (synonymTargetIds.has(item.id))
      score += 80;
    for (const w of words) {
      if (id === w || label === w)
        score += 40;
      else if (id.includes(w))
        score += 20;
      else if (label.includes(w))
        score += 15;
      else if (pv.includes(w))
        score += 10;
      else if (pre.includes(w) || post.includes(w))
        score += 8;
    }
    return score;
  };
  const recipe = {};
  const targetCategories = Object.keys(library).filter((key) => key !== "version");
  for (const cat of targetCategories) {
    const items = library[cat] || [];
    let best = null;
    let maxScore = 0;
    for (const item of items) {
      const s = scoreItem(item, cat);
      if (s > maxScore) {
        maxScore = s;
        best = item;
      }
    }
    if (best && maxScore >= 15) {
      recipe[cat] = { id: best.id, label: best.label, score: maxScore };
    }
  }
  let bestMov = null;
  let maxMovScore = 0;
  for (const m of CINEMATIC_CAMERA_MOVEMENTS) {
    const aliases = m.aliases || [];
    const text = `${m.id} ${m.label} ${m.category} ${m.promptKeyword} ${m.fullPromptRecipe} ${aliases.join(" ")}`.toLowerCase();
    let score = 0;
    if (synonymTargetIds.has(m.id))
      score += 80;
    for (const w of words) {
      if (m.id.includes(w) || m.label.toLowerCase().includes(w))
        score += 25;
      else if (aliases.some((a) => a.toLowerCase().includes(w)))
        score += 20;
      else if (text.includes(w))
        score += 10;
    }
    if (score > maxMovScore) {
      maxMovScore = score;
      bestMov = m;
    }
  }
  if (bestMov && maxMovScore >= 15) {
    recipe.movement = { id: bestMov.id, label: bestMov.label, score: maxMovScore };
  }
  return {
    status: "ok",
    action: "suggest",
    data: { intent, recipe }
  };
}
function executeAction(action, payload) {
  try {
    return executeValidatedAction(action, payload);
  } catch (err) {
    return { status: "error", action, error: err instanceof Error ? err.message : String(err) };
  }
}
function executeValidatedAction(action, payload) {
  switch (action) {
    case "assemble":
    case "assemble_prompt":
    case "photo":
    case "anime":
    case "edit":
    case "video":
    case "assemble_video": {
      const { action: dispatchAction, raw, options, state, videoState, ...flat } = payload;
      const source = videoState || state || flat;
      const selectedMode = action === "video" || action === "assemble_video" ? "video" : ["photo", "anime", "edit"].includes(action) ? action : payload.mode || source.mode || "photo";
      const normalized = normalizeState({ ...source, mode: selectedMode });
      const compiled = options ? compilePrompt({ ...stateToIR(normalized), referenceOptions: { ...normalized.referenceOptions, ...ReferenceOptionsSchema.parse(options) } }, library) : assembleDetailed(normalized, library);
      return {
        status: compiled.valid ? "ok" : "error",
        action: selectedMode === "video" ? "assemble_video" : "assemble",
        prompt: compiled.positivePrompt,
        ...compiled.valid ? {} : { error: "Prompt contains validation errors; inspect data.diagnostics." },
        data: { ...compiled, prompt: compiled.positivePrompt, state: normalized, videoState: selectedMode === "video" ? normalized : undefined }
      };
    }
    case "director":
    case "director_timeline": {
      const shots = payload.shots || payload.directorShots || [];
      const fallbackDuration = payload.fallbackDuration;
      const scene = payload.ir ? PromptIRSchema.parse(payload.ir) : payload.state ? stateToIR(normalizeState({ ...payload.state, mode: "video" })) : undefined;
      const res = buildDirectorTimeline(shots, fallbackDuration, { scene, library, timelineOptions: payload.timelineOptions });
      return {
        status: res.diagnostics.some((d) => d.severity === "error") ? "error" : "ok",
        ...res.diagnostics.some((d) => d.severity === "error") ? { error: "Director scene contains validation errors; inspect data.diagnostics." } : {},
        action: "director_timeline",
        prompt: res.timelinePrompt,
        data: res
      };
    }
    case "references":
    case "resolve_references": {
      const slots = payload.slots || payload.references || [];
      const options = payload.options || {};
      const res = resolveReferences(slots, options);
      return {
        status: "ok",
        action: "resolve_references",
        prompt: res.instruction.display,
        data: res
      };
    }
    case "sync": {
      const prevText = String(payload.prevText || "");
      const nextText = String(payload.nextText || "");
      const synced = sync(prevText, nextText);
      return {
        status: "ok",
        action: "sync",
        prompt: synced,
        data: { synced }
      };
    }
    case "suggest": {
      const intent = String(payload.intent || payload.query || payload.prompt || "");
      return handleSuggest(intent);
    }
    case "catalog": {
      const subcommand = String(payload.subcommand || payload.sub || (payload.query ? "search" : payload.category ? "list" : "categories"));
      const positionals = [subcommand];
      if (subcommand === "list" && payload.category) {
        positionals.push(String(payload.category));
      } else if (subcommand === "search" && payload.query) {
        positionals.push(String(payload.query));
      }
      const flags = {};
      if (payload.category)
        flags.category = String(payload.category);
      if (payload.query)
        flags.query = String(payload.query);
      return handleCatalog(positionals, flags);
    }
    case "capabilities": {
      return handleCapabilities();
    }
    case "compile": {
      try {
        const { action: dispatcher, raw, ...flat } = payload;
        const ir = PromptIRSchema.parse(payload.ir || { ...flat, ...dispatcher && !["compile", "lint"].includes(String(dispatcher)) ? { action: dispatcher } : {} });
        const res = compilePrompt(ir, library);
        return { status: res.valid ? "ok" : "error", action: "compile", prompt: res.positivePrompt, data: res, ...res.valid ? {} : { error: "Prompt contains validation errors; inspect data.diagnostics." } };
      } catch (err) {
        return { status: "error", action: "compile", error: err instanceof Error ? err.message : String(err) };
      }
    }
    case "lint": {
      try {
        const { action: dispatcher, raw, ...flat } = payload;
        const ir = PromptIRSchema.parse(payload.ir || { ...flat, ...dispatcher && !["compile", "lint"].includes(String(dispatcher)) ? { action: dispatcher } : {} });
        const report = lintPromptIR(ir, library);
        return { status: "ok", action: "lint", data: report };
      } catch (err) {
        return { status: "error", action: "lint", error: err instanceof Error ? err.message : String(err) };
      }
    }
    case "hybrid_search": {
      const engine = new HybridSearchEngine(library);
      const query = String(payload.query || payload.q || "");
      const category = payload.category;
      const limit = typeof payload.limit === "number" ? payload.limit : 15;
      const results = engine.search(query, { category, limit });
      return { status: "ok", action: "hybrid_search", data: { query, count: results.length, results } };
    }
    case "validate": {
      try {
        const type = String(payload.type || "state");
        if (type === "library") {
          const validated = validateLibrary(payload.library || payload.data);
          return { status: "ok", action: "validate", data: { valid: true, version: validated.version } };
        }
        const { action: _, type: ignored, ...flat } = payload;
        if (type === "ir")
          PromptIRSchema.parse(payload.ir || payload.data || flat);
        else if (type === "state")
          PromptStateInputSchema.parse(payload.state || payload.data || flat);
        else
          throw new Error(`Unknown validation type: ${type}`);
        return { status: "ok", action: "validate", data: { valid: true } };
      } catch (err) {
        return {
          status: "error",
          action: "validate",
          error: err instanceof Error ? err.message : String(err)
        };
      }
    }
    default:
      return {
        status: "error",
        error: `Unknown action: ${action}`
      };
  }
}
async function main() {
  const rawArgs = process.argv.slice(2);
  if (rawArgs.includes("-h") || rawArgs.includes("--help") || rawArgs[0] === "help") {
    printHelp();
    return;
  }
  if (rawArgs[0] === "mcp") {
    const server = new McpStdioServer(library);
    await server.start();
    return;
  }
  let stdinPayload = "";
  if (!process.stdin.isTTY) {
    try {
      stdinPayload = readFileSync(0, "utf-8");
    } catch {
      stdinPayload = "";
    }
  }
  if (rawArgs.length === 0 && !stdinPayload.trim()) {
    printHelp();
    return;
  }
  if (rawArgs[0] === "capabilities") {
    outputResult(handleCapabilities());
    return;
  }
  const { command, flags, positionals } = parseCliArgs(rawArgs);
  if (command === "catalog") {
    const raw = Boolean(flags.raw);
    const res = handleCatalog(positionals, flags);
    outputResult(res, raw);
    if (res.status === "error")
      process.exit(1);
    return;
  }
  if (command === "suggest") {
    const raw = Boolean(flags.raw);
    const intent = positionals.join(" ") || flags.intent || flags.query || "";
    const res = handleSuggest(intent);
    outputResult(res, raw);
    if (res.status === "error")
      process.exit(1);
    return;
  }
  let payloadStr = stdinPayload;
  if (typeof flags.state === "string") {
    payloadStr = flags.state;
  } else if (typeof flags.json === "string") {
    payloadStr = flags.json;
  }
  if (payloadStr.trim()) {
    try {
      const input = JSON.parse(payloadStr);
      const action = command !== "assemble" ? command : input.action || "assemble";
      const raw = Boolean(flags.raw || input.raw);
      const res = executeAction(action, input);
      outputResult(res, raw);
      if (res.status === "error")
        process.exit(1);
      return;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      outputResult({ status: "error", error: message });
      process.exit(1);
    }
  }
  const raw = Boolean(flags.raw);
  const filters = [];
  if (flags.filter) {
    if (Array.isArray(flags.filter)) {
      for (const f of flags.filter)
        filters.push(...f.split(","));
    } else if (typeof flags.filter === "string") {
      filters.push(...flags.filter.split(","));
    }
  }
  const mode = flags.mode || (command === "photo" || command === "anime" || command === "edit" || command === "video" ? command : "photo");
  if (command === "sync") {
    const prevText = String(flags.prev || flags["prev-text"] || positionals[0] || "");
    const nextText = String(flags.next || flags["next-text"] || positionals[1] || "");
    const res = executeAction("sync", { prevText, nextText });
    outputResult(res, raw);
    if (res.status === "error")
      process.exitCode = 1;
    return;
  }
  const subjectVal = typeof flags.subject === "string" ? flags.subject : typeof flags.action === "string" ? flags.action : positionals.join(" ") || "";
  const promptState = {
    mode,
    target: typeof flags.target === "string" ? flags.target : undefined,
    styleMode: typeof flags["style-mode"] === "string" ? flags["style-mode"] : undefined,
    artStyle: typeof flags["art-style"] === "string" ? flags["art-style"] : "",
    negativePrompt: typeof flags.negative === "string" ? flags.negative : "",
    seed: typeof flags.seed === "string" ? Number(flags.seed) : undefined,
    quality: typeof flags.quality === "string" ? Number(flags.quality) : undefined,
    focalLengthId: typeof flags["focal-length"] === "string" ? flags["focal-length"] : "",
    directionId: typeof flags.direction === "string" ? flags.direction : "",
    genreId: typeof flags.genre === "string" ? flags.genre : "",
    subject: subjectVal,
    subjectAction: subjectVal,
    environment: typeof flags.env === "string" ? flags.env : "",
    mood: typeof flags.mood === "string" ? flags.mood : "",
    shotId: typeof flags.shot === "string" ? flags.shot : "",
    lightingId: typeof flags.lighting === "string" ? flags.lighting : "",
    cameraId: typeof flags.camera === "string" ? flags.camera : "",
    lensId: typeof flags.lens === "string" ? flags.lens : "",
    fStop: typeof flags["f-stop"] === "string" ? flags["f-stop"] : null,
    filmId: typeof flags.film === "string" ? flags.film : "",
    filters: filters.map((f) => f.trim()).filter(Boolean),
    movieLookId: typeof flags["movie-look"] === "string" ? flags["movie-look"] : "",
    photographerId: typeof flags.photographer === "string" ? flags.photographer : "",
    animeGenreId: typeof flags["anime-genre"] === "string" ? flags["anime-genre"] : "",
    animeShowStyleId: typeof flags["anime-show"] === "string" ? flags["anime-show"] : "",
    westernAnimationStyleId: typeof flags["western-style"] === "string" ? flags["western-style"] : "",
    aspectRatio: typeof flags.aspect === "string" ? flags.aspect : "16:9",
    noText: Boolean(flags["no-text"]),
    candidShot: Boolean(flags.candid),
    showNewAnglePrompt: Boolean(flags["new-angle"]),
    references: []
  };
  if (command === "director" || command === "director_timeline") {
    const shotNote = String(flags.note || flags.prompt || positionals.join(" ") || "");
    const durationHint = typeof flags.duration === "string" ? flags.duration : "5";
    const shots = shotNote ? [{ note: shotNote, durationHint }] : [];
    const res = executeAction("director_timeline", { shots, state: { ...promptState, mode: "video", subject: typeof flags.subject === "string" ? flags.subject : "", subjectAction: typeof flags.subject === "string" ? flags.subject : "" } });
    outputResult(res, raw);
    if (res.status === "error")
      process.exitCode = 1;
    return;
  }
  if (command === "compile" || command === "lint") {
    const ir = stateToIR(normalizeState({
      ...promptState,
      target: typeof flags.target === "string" ? flags.target : "generic",
      mode: flags.mode || (["kling", "veo", "sora", "runway", "wan"].includes(String(flags.target)) ? "video" : mode),
      movementLabel: typeof flags.movement === "string" ? flags.movement : ""
    }));
    if (typeof flags.action === "string" && flags.subject)
      ir.action = flags.action;
    const res = executeAction(command, { ir });
    outputResult(res, raw);
    if (res.status === "error")
      process.exitCode = 1;
    return;
  }
  if (mode === "video" || command === "video" || command === "assemble_video") {
    const videoState = {
      ...promptState,
      subject: subjectVal,
      subjectAction: subjectVal,
      environment: typeof flags.env === "string" ? flags.env : "",
      mood: typeof flags.mood === "string" ? flags.mood : "",
      videoPrompt: typeof flags["video-prompt"] === "string" ? flags["video-prompt"] : positionals.join(" ") || "",
      movementLabel: typeof flags.movement === "string" ? flags.movement : "",
      directorMode: Boolean(flags["director-mode"]),
      aspectRatio: typeof flags.aspect === "string" ? flags.aspect : "16:9",
      directorShots: [],
      references: []
    };
    const res = executeAction("assemble_video", { videoState });
    outputResult(res, raw);
    if (res.status === "error")
      process.exitCode = 1;
    return;
  }
  const res = executeAction(command === "assemble" ? "assemble" : command, { state: promptState, mode });
  outputResult(res, raw);
  if (res.status === "error")
    process.exitCode = 1;
}
if (__require.main == __require.module || process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    outputResult({ status: "error", error: err instanceof Error ? err.message : String(err) });
    process.exitCode = 1;
  });
}
export {
  CATALOG_SYNONYMS,
  executeAction,
  handleCapabilities,
  handleCatalog,
  handleSuggest,
  main,
  outputResult,
  printHelp
};
