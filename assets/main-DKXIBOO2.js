const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/firebase-B3PEc0cE.js","assets/firebase-CsZMLTFJ.js","assets/index.esm-ZWLmylet.js","assets/index.esm-BXwIPdvF.js"])))=>i.map(i=>d[i]);
import { c as leaveRoom, d as subscribeRoom, f as updateGameState, l as roomExists, s as joinRoom, t as createRoom, u as subscribePlayers } from "./firebase-CsZMLTFJ.js";
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region node_modules/scheduler/cjs/scheduler.production.js
/**
* @license React
* scheduler.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_scheduler_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	function push(heap, node) {
		var index = heap.length;
		heap.push(node);
		a: for (; 0 < index;) {
			var parentIndex = index - 1 >>> 1, parent = heap[parentIndex];
			if (0 < compare(parent, node)) heap[parentIndex] = node, heap[index] = parent, index = parentIndex;
			else break a;
		}
	}
	function peek(heap) {
		return 0 === heap.length ? null : heap[0];
	}
	function pop(heap) {
		if (0 === heap.length) return null;
		var first = heap[0], last = heap.pop();
		if (last !== first) {
			heap[0] = last;
			a: for (var index = 0, length = heap.length, halfLength = length >>> 1; index < halfLength;) {
				var leftIndex = 2 * (index + 1) - 1, left = heap[leftIndex], rightIndex = leftIndex + 1, right = heap[rightIndex];
				if (0 > compare(left, last)) rightIndex < length && 0 > compare(right, left) ? (heap[index] = right, heap[rightIndex] = last, index = rightIndex) : (heap[index] = left, heap[leftIndex] = last, index = leftIndex);
				else if (rightIndex < length && 0 > compare(right, last)) heap[index] = right, heap[rightIndex] = last, index = rightIndex;
				else break a;
			}
		}
		return first;
	}
	function compare(a, b) {
		var diff = a.sortIndex - b.sortIndex;
		return 0 !== diff ? diff : a.id - b.id;
	}
	exports.unstable_now = void 0;
	if ("object" === typeof performance && "function" === typeof performance.now) {
		var localPerformance = performance;
		exports.unstable_now = function() {
			return localPerformance.now();
		};
	} else {
		var localDate = Date, initialTime = localDate.now();
		exports.unstable_now = function() {
			return localDate.now() - initialTime;
		};
	}
	var taskQueue = [], timerQueue = [], taskIdCounter = 1, currentTask = null, currentPriorityLevel = 3, isPerformingWork = !1, isHostCallbackScheduled = !1, isHostTimeoutScheduled = !1, needsPaint = !1, localSetTimeout = "function" === typeof setTimeout ? setTimeout : null, localClearTimeout = "function" === typeof clearTimeout ? clearTimeout : null, localSetImmediate = "undefined" !== typeof setImmediate ? setImmediate : null;
	function advanceTimers(currentTime) {
		for (var timer = peek(timerQueue); null !== timer;) {
			if (null === timer.callback) pop(timerQueue);
			else if (timer.startTime <= currentTime) pop(timerQueue), timer.sortIndex = timer.expirationTime, push(taskQueue, timer);
			else break;
			timer = peek(timerQueue);
		}
	}
	function handleTimeout(currentTime) {
		isHostTimeoutScheduled = !1;
		advanceTimers(currentTime);
		if (!isHostCallbackScheduled) if (null !== peek(taskQueue)) isHostCallbackScheduled = !0, isMessageLoopRunning || (isMessageLoopRunning = !0, schedulePerformWorkUntilDeadline());
		else {
			var firstTimer = peek(timerQueue);
			null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
		}
	}
	var isMessageLoopRunning = !1, taskTimeoutID = -1, frameInterval = 5, startTime = -1;
	function shouldYieldToHost() {
		return needsPaint ? !0 : exports.unstable_now() - startTime < frameInterval ? !1 : !0;
	}
	function performWorkUntilDeadline() {
		needsPaint = !1;
		if (isMessageLoopRunning) {
			var currentTime = exports.unstable_now();
			startTime = currentTime;
			var hasMoreWork = !0;
			try {
				a: {
					isHostCallbackScheduled = !1;
					isHostTimeoutScheduled && (isHostTimeoutScheduled = !1, localClearTimeout(taskTimeoutID), taskTimeoutID = -1);
					isPerformingWork = !0;
					var previousPriorityLevel = currentPriorityLevel;
					try {
						b: {
							advanceTimers(currentTime);
							for (currentTask = peek(taskQueue); null !== currentTask && !(currentTask.expirationTime > currentTime && shouldYieldToHost());) {
								var callback = currentTask.callback;
								if ("function" === typeof callback) {
									currentTask.callback = null;
									currentPriorityLevel = currentTask.priorityLevel;
									var continuationCallback = callback(currentTask.expirationTime <= currentTime);
									currentTime = exports.unstable_now();
									if ("function" === typeof continuationCallback) {
										currentTask.callback = continuationCallback;
										advanceTimers(currentTime);
										hasMoreWork = !0;
										break b;
									}
									currentTask === peek(taskQueue) && pop(taskQueue);
									advanceTimers(currentTime);
								} else pop(taskQueue);
								currentTask = peek(taskQueue);
							}
							if (null !== currentTask) hasMoreWork = !0;
							else {
								var firstTimer = peek(timerQueue);
								null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
								hasMoreWork = !1;
							}
						}
						break a;
					} finally {
						currentTask = null, currentPriorityLevel = previousPriorityLevel, isPerformingWork = !1;
					}
					hasMoreWork = void 0;
				}
			} finally {
				hasMoreWork ? schedulePerformWorkUntilDeadline() : isMessageLoopRunning = !1;
			}
		}
	}
	var schedulePerformWorkUntilDeadline;
	if ("function" === typeof localSetImmediate) schedulePerformWorkUntilDeadline = function() {
		localSetImmediate(performWorkUntilDeadline);
	};
	else if ("undefined" !== typeof MessageChannel) {
		var channel = new MessageChannel(), port = channel.port2;
		channel.port1.onmessage = performWorkUntilDeadline;
		schedulePerformWorkUntilDeadline = function() {
			port.postMessage(null);
		};
	} else schedulePerformWorkUntilDeadline = function() {
		localSetTimeout(performWorkUntilDeadline, 0);
	};
	function requestHostTimeout(callback, ms) {
		taskTimeoutID = localSetTimeout(function() {
			callback(exports.unstable_now());
		}, ms);
	}
	exports.unstable_IdlePriority = 5;
	exports.unstable_ImmediatePriority = 1;
	exports.unstable_LowPriority = 4;
	exports.unstable_NormalPriority = 3;
	exports.unstable_Profiling = null;
	exports.unstable_UserBlockingPriority = 2;
	exports.unstable_cancelCallback = function(task) {
		task.callback = null;
	};
	exports.unstable_forceFrameRate = function(fps) {
		0 > fps || 125 < fps ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : frameInterval = 0 < fps ? Math.floor(1e3 / fps) : 5;
	};
	exports.unstable_getCurrentPriorityLevel = function() {
		return currentPriorityLevel;
	};
	exports.unstable_next = function(eventHandler) {
		switch (currentPriorityLevel) {
			case 1:
			case 2:
			case 3:
				var priorityLevel = 3;
				break;
			default: priorityLevel = currentPriorityLevel;
		}
		var previousPriorityLevel = currentPriorityLevel;
		currentPriorityLevel = priorityLevel;
		try {
			return eventHandler();
		} finally {
			currentPriorityLevel = previousPriorityLevel;
		}
	};
	exports.unstable_requestPaint = function() {
		needsPaint = !0;
	};
	exports.unstable_runWithPriority = function(priorityLevel, eventHandler) {
		switch (priorityLevel) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: priorityLevel = 3;
		}
		var previousPriorityLevel = currentPriorityLevel;
		currentPriorityLevel = priorityLevel;
		try {
			return eventHandler();
		} finally {
			currentPriorityLevel = previousPriorityLevel;
		}
	};
	exports.unstable_scheduleCallback = function(priorityLevel, callback, options) {
		var currentTime = exports.unstable_now();
		"object" === typeof options && null !== options ? (options = options.delay, options = "number" === typeof options && 0 < options ? currentTime + options : currentTime) : options = currentTime;
		switch (priorityLevel) {
			case 1:
				var timeout = -1;
				break;
			case 2:
				timeout = 250;
				break;
			case 5:
				timeout = 1073741823;
				break;
			case 4:
				timeout = 1e4;
				break;
			default: timeout = 5e3;
		}
		timeout = options + timeout;
		priorityLevel = {
			id: taskIdCounter++,
			callback,
			priorityLevel,
			startTime: options,
			expirationTime: timeout,
			sortIndex: -1
		};
		options > currentTime ? (priorityLevel.sortIndex = options, push(timerQueue, priorityLevel), null === peek(taskQueue) && priorityLevel === peek(timerQueue) && (isHostTimeoutScheduled ? (localClearTimeout(taskTimeoutID), taskTimeoutID = -1) : isHostTimeoutScheduled = !0, requestHostTimeout(handleTimeout, options - currentTime))) : (priorityLevel.sortIndex = timeout, push(taskQueue, priorityLevel), isHostCallbackScheduled || isPerformingWork || (isHostCallbackScheduled = !0, isMessageLoopRunning || (isMessageLoopRunning = !0, schedulePerformWorkUntilDeadline())));
		return priorityLevel;
	};
	exports.unstable_shouldYield = shouldYieldToHost;
	exports.unstable_wrapCallback = function(callback) {
		var parentPriorityLevel = currentPriorityLevel;
		return function() {
			var previousPriorityLevel = currentPriorityLevel;
			currentPriorityLevel = parentPriorityLevel;
			try {
				return callback.apply(this, arguments);
			} finally {
				currentPriorityLevel = previousPriorityLevel;
			}
		};
	};
}));
//#endregion
//#region node_modules/scheduler/index.js
var require_scheduler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_scheduler_production();
}));
//#endregion
//#region node_modules/react/cjs/react.production.js
/**
* @license React
* react.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var ReactNoopUpdateQueue = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, assign = Object.assign, emptyObject = {};
	function Component(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	Component.prototype.isReactComponent = {};
	Component.prototype.setState = function(partialState, callback) {
		if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, partialState, callback, "setState");
	};
	Component.prototype.forceUpdate = function(callback) {
		this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
	};
	function ComponentDummy() {}
	ComponentDummy.prototype = Component.prototype;
	function PureComponent(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
	pureComponentPrototype.constructor = PureComponent;
	assign(pureComponentPrototype, Component.prototype);
	pureComponentPrototype.isPureReactComponent = !0;
	var isArrayImpl = Array.isArray;
	function noop() {}
	var ReactSharedInternals = {
		H: null,
		A: null,
		T: null,
		S: null
	}, hasOwnProperty = Object.prototype.hasOwnProperty;
	function ReactElement(type, key, props) {
		var refProp = props.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== refProp ? refProp : null,
			props
		};
	}
	function cloneAndReplaceKey(oldElement, newKey) {
		return ReactElement(oldElement.type, newKey, oldElement.props);
	}
	function isValidElement(object) {
		return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function escape(key) {
		var escaperLookup = {
			"=": "=0",
			":": "=2"
		};
		return "$" + key.replace(/[=:]/g, function(match) {
			return escaperLookup[match];
		});
	}
	var userProvidedKeyEscapeRegex = /\/+/g;
	function getElementKey(element, index) {
		return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
	}
	function resolveThenable(thenable) {
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenable.reason;
			default: switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
				"pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
			}, function(error) {
				"pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
			})), thenable.status) {
				case "fulfilled": return thenable.value;
				case "rejected": throw thenable.reason;
			}
		}
		throw thenable;
	}
	function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
		var type = typeof children;
		if ("undefined" === type || "boolean" === type) children = null;
		var invokeCallback = !1;
		if (null === children) invokeCallback = !0;
		else switch (type) {
			case "bigint":
			case "string":
			case "number":
				invokeCallback = !0;
				break;
			case "object": switch (children.$$typeof) {
				case REACT_ELEMENT_TYPE:
				case REACT_PORTAL_TYPE:
					invokeCallback = !0;
					break;
				case REACT_LAZY_TYPE: return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
			}
		}
		if (invokeCallback) return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
			return c;
		})) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(callback, escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + invokeCallback)), array.push(callback)), 1;
		invokeCallback = 0;
		var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
		if (isArrayImpl(children)) for (var i = 0; i < children.length; i++) nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if (i = getIteratorFn(children), "function" === typeof i) for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done;) nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if ("object" === type) {
			if ("function" === typeof children.then) return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
			array = String(children);
			throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
		}
		return invokeCallback;
	}
	function mapChildren(children, func, context) {
		if (null == children) return children;
		var result = [], count = 0;
		mapIntoArray(children, result, "", "", function(child) {
			return func.call(context, child, count++);
		});
		return result;
	}
	function lazyInitializer(payload) {
		if (-1 === payload._status) {
			var ctor = payload._result;
			ctor = ctor();
			ctor.then(function(moduleObject) {
				if (0 === payload._status || -1 === payload._status) payload._status = 1, payload._result = moduleObject;
			}, function(error) {
				if (0 === payload._status || -1 === payload._status) payload._status = 2, payload._result = error;
			});
			-1 === payload._status && (payload._status = 0, payload._result = ctor);
		}
		if (1 === payload._status) return payload._result.default;
		throw payload._result;
	}
	var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
		if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
			var event = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
				error
			});
			if (!window.dispatchEvent(event)) return;
		} else if ("object" === typeof process && "function" === typeof process.emit) {
			process.emit("uncaughtException", error);
			return;
		}
		console.error(error);
	}, Children = {
		map: mapChildren,
		forEach: function(children, forEachFunc, forEachContext) {
			mapChildren(children, function() {
				forEachFunc.apply(this, arguments);
			}, forEachContext);
		},
		count: function(children) {
			var n = 0;
			mapChildren(children, function() {
				n++;
			});
			return n;
		},
		toArray: function(children) {
			return mapChildren(children, function(child) {
				return child;
			}) || [];
		},
		only: function(children) {
			if (!isValidElement(children)) throw Error("React.Children.only expected to receive a single React element child.");
			return children;
		}
	};
	exports.Activity = REACT_ACTIVITY_TYPE;
	exports.Children = Children;
	exports.Component = Component;
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.Profiler = REACT_PROFILER_TYPE;
	exports.PureComponent = PureComponent;
	exports.StrictMode = REACT_STRICT_MODE_TYPE;
	exports.Suspense = REACT_SUSPENSE_TYPE;
	exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
	exports.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(size) {
			return ReactSharedInternals.H.useMemoCache(size);
		}
	};
	exports.cache = function(fn) {
		return function() {
			return fn.apply(null, arguments);
		};
	};
	exports.cacheSignal = function() {
		return null;
	};
	exports.cloneElement = function(element, config, children) {
		if (null === element || void 0 === element) throw Error("The argument must be a React element, but you passed " + element + ".");
		var props = assign({}, element.props), key = element.key;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
		var propName = arguments.length - 2;
		if (1 === propName) props.children = children;
		else if (1 < propName) {
			for (var childArray = Array(propName), i = 0; i < propName; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		return ReactElement(element.type, key, props);
	};
	exports.createContext = function(defaultValue) {
		defaultValue = {
			$$typeof: REACT_CONTEXT_TYPE,
			_currentValue: defaultValue,
			_currentValue2: defaultValue,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		};
		defaultValue.Provider = defaultValue;
		defaultValue.Consumer = {
			$$typeof: REACT_CONSUMER_TYPE,
			_context: defaultValue
		};
		return defaultValue;
	};
	exports.createElement = function(type, config, children) {
		var propName, props = {}, key = null;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
		var childrenLength = arguments.length - 2;
		if (1 === childrenLength) props.children = children;
		else if (1 < childrenLength) {
			for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		if (type && type.defaultProps) for (propName in childrenLength = type.defaultProps, childrenLength) void 0 === props[propName] && (props[propName] = childrenLength[propName]);
		return ReactElement(type, key, props);
	};
	exports.createRef = function() {
		return { current: null };
	};
	exports.forwardRef = function(render) {
		return {
			$$typeof: REACT_FORWARD_REF_TYPE,
			render
		};
	};
	exports.isValidElement = isValidElement;
	exports.lazy = function(ctor) {
		return {
			$$typeof: REACT_LAZY_TYPE,
			_payload: {
				_status: -1,
				_result: ctor
			},
			_init: lazyInitializer
		};
	};
	exports.memo = function(type, compare) {
		return {
			$$typeof: REACT_MEMO_TYPE,
			type,
			compare: void 0 === compare ? null : compare
		};
	};
	exports.startTransition = function(scope) {
		var prevTransition = ReactSharedInternals.T, currentTransition = {};
		ReactSharedInternals.T = currentTransition;
		try {
			var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
			null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
			"object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
		} catch (error) {
			reportGlobalError(error);
		} finally {
			null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
		}
	};
	exports.unstable_useCacheRefresh = function() {
		return ReactSharedInternals.H.useCacheRefresh();
	};
	exports.use = function(usable) {
		return ReactSharedInternals.H.use(usable);
	};
	exports.useActionState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useActionState(action, initialState, permalink);
	};
	exports.useCallback = function(callback, deps) {
		return ReactSharedInternals.H.useCallback(callback, deps);
	};
	exports.useContext = function(Context) {
		return ReactSharedInternals.H.useContext(Context);
	};
	exports.useDebugValue = function() {};
	exports.useDeferredValue = function(value, initialValue) {
		return ReactSharedInternals.H.useDeferredValue(value, initialValue);
	};
	exports.useEffect = function(create, deps) {
		return ReactSharedInternals.H.useEffect(create, deps);
	};
	exports.useEffectEvent = function(callback) {
		return ReactSharedInternals.H.useEffectEvent(callback);
	};
	exports.useId = function() {
		return ReactSharedInternals.H.useId();
	};
	exports.useImperativeHandle = function(ref, create, deps) {
		return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
	};
	exports.useInsertionEffect = function(create, deps) {
		return ReactSharedInternals.H.useInsertionEffect(create, deps);
	};
	exports.useLayoutEffect = function(create, deps) {
		return ReactSharedInternals.H.useLayoutEffect(create, deps);
	};
	exports.useMemo = function(create, deps) {
		return ReactSharedInternals.H.useMemo(create, deps);
	};
	exports.useOptimistic = function(passthrough, reducer) {
		return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
	};
	exports.useReducer = function(reducer, initialArg, init) {
		return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
	};
	exports.useRef = function(initialValue) {
		return ReactSharedInternals.H.useRef(initialValue);
	};
	exports.useState = function(initialState) {
		return ReactSharedInternals.H.useState(initialState);
	};
	exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
		return ReactSharedInternals.H.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	};
	exports.useTransition = function() {
		return ReactSharedInternals.H.useTransition();
	};
	exports.version = "19.2.5";
}));
//#endregion
//#region node_modules/react/index.js
var require_react = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_production();
}));
//#endregion
//#region node_modules/react-dom/cjs/react-dom.production.js
/**
* @license React
* react-dom.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_dom_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	function formatProdErrorMessage(code) {
		var url = "https://react.dev/errors/" + code;
		if (1 < arguments.length) {
			url += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var i = 2; i < arguments.length; i++) url += "&args[]=" + encodeURIComponent(arguments[i]);
		}
		return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function noop() {}
	var Internals = {
		d: {
			f: noop,
			r: function() {
				throw Error(formatProdErrorMessage(522));
			},
			D: noop,
			C: noop,
			L: noop,
			m: noop,
			X: noop,
			S: noop,
			M: noop
		},
		p: 0,
		findDOMNode: null
	}, REACT_PORTAL_TYPE = Symbol.for("react.portal");
	function createPortal$1(children, containerInfo, implementation) {
		var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
		return {
			$$typeof: REACT_PORTAL_TYPE,
			key: null == key ? null : "" + key,
			children,
			containerInfo,
			implementation
		};
	}
	var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function getCrossOriginStringAs(as, input) {
		if ("font" === as) return "";
		if ("string" === typeof input) return "use-credentials" === input ? input : "";
	}
	exports.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
	exports.createPortal = function(children, container) {
		var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
		if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType) throw Error(formatProdErrorMessage(299));
		return createPortal$1(children, container, null, key);
	};
	exports.flushSync = function(fn) {
		var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
		try {
			if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
		} finally {
			ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
		}
	};
	exports.preconnect = function(href, options) {
		"string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
	};
	exports.prefetchDNS = function(href) {
		"string" === typeof href && Internals.d.D(href);
	};
	exports.preinit = function(href, options) {
		if ("string" === typeof href && options && "string" === typeof options.as) {
			var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
			"style" === as ? Internals.d.S(href, "string" === typeof options.precedence ? options.precedence : void 0, {
				crossOrigin,
				integrity,
				fetchPriority
			}) : "script" === as && Internals.d.X(href, {
				crossOrigin,
				integrity,
				fetchPriority,
				nonce: "string" === typeof options.nonce ? options.nonce : void 0
			});
		}
	};
	exports.preinitModule = function(href, options) {
		if ("string" === typeof href) if ("object" === typeof options && null !== options) {
			if (null == options.as || "script" === options.as) {
				var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
				Internals.d.M(href, {
					crossOrigin,
					integrity: "string" === typeof options.integrity ? options.integrity : void 0,
					nonce: "string" === typeof options.nonce ? options.nonce : void 0
				});
			}
		} else options ?? Internals.d.M(href);
	};
	exports.preload = function(href, options) {
		if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
			var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
			Internals.d.L(href, as, {
				crossOrigin,
				integrity: "string" === typeof options.integrity ? options.integrity : void 0,
				nonce: "string" === typeof options.nonce ? options.nonce : void 0,
				type: "string" === typeof options.type ? options.type : void 0,
				fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
				referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
				imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
				imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
				media: "string" === typeof options.media ? options.media : void 0
			});
		}
	};
	exports.preloadModule = function(href, options) {
		if ("string" === typeof href) if (options) {
			var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
			Internals.d.m(href, {
				as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
				crossOrigin,
				integrity: "string" === typeof options.integrity ? options.integrity : void 0
			});
		} else Internals.d.m(href);
	};
	exports.requestFormReset = function(form) {
		Internals.d.r(form);
	};
	exports.unstable_batchedUpdates = function(fn, a) {
		return fn(a);
	};
	exports.useFormState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useFormState(action, initialState, permalink);
	};
	exports.useFormStatus = function() {
		return ReactSharedInternals.H.useHostTransitionStatus();
	};
	exports.version = "19.2.5";
}));
//#endregion
//#region node_modules/react-dom/index.js
var require_react_dom = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function checkDCE() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") return;
		try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
		} catch (err) {
			console.error(err);
		}
	}
	checkDCE();
	module.exports = require_react_dom_production();
}));
//#endregion
//#region node_modules/react-dom/cjs/react-dom-client.production.js
/**
* @license React
* react-dom-client.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_dom_client_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Scheduler = require_scheduler(), React = require_react(), ReactDOM = require_react_dom();
	function formatProdErrorMessage(code) {
		var url = "https://react.dev/errors/" + code;
		if (1 < arguments.length) {
			url += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var i = 2; i < arguments.length; i++) url += "&args[]=" + encodeURIComponent(arguments[i]);
		}
		return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function isValidContainer(node) {
		return !(!node || 1 !== node.nodeType && 9 !== node.nodeType && 11 !== node.nodeType);
	}
	function getNearestMountedFiber(fiber) {
		var node = fiber, nearestMounted = fiber;
		if (fiber.alternate) for (; node.return;) node = node.return;
		else {
			fiber = node;
			do
				node = fiber, 0 !== (node.flags & 4098) && (nearestMounted = node.return), fiber = node.return;
			while (fiber);
		}
		return 3 === node.tag ? nearestMounted : null;
	}
	function getSuspenseInstanceFromFiber(fiber) {
		if (13 === fiber.tag) {
			var suspenseState = fiber.memoizedState;
			null === suspenseState && (fiber = fiber.alternate, null !== fiber && (suspenseState = fiber.memoizedState));
			if (null !== suspenseState) return suspenseState.dehydrated;
		}
		return null;
	}
	function getActivityInstanceFromFiber(fiber) {
		if (31 === fiber.tag) {
			var activityState = fiber.memoizedState;
			null === activityState && (fiber = fiber.alternate, null !== fiber && (activityState = fiber.memoizedState));
			if (null !== activityState) return activityState.dehydrated;
		}
		return null;
	}
	function assertIsMounted(fiber) {
		if (getNearestMountedFiber(fiber) !== fiber) throw Error(formatProdErrorMessage(188));
	}
	function findCurrentFiberUsingSlowPath(fiber) {
		var alternate = fiber.alternate;
		if (!alternate) {
			alternate = getNearestMountedFiber(fiber);
			if (null === alternate) throw Error(formatProdErrorMessage(188));
			return alternate !== fiber ? null : fiber;
		}
		for (var a = fiber, b = alternate;;) {
			var parentA = a.return;
			if (null === parentA) break;
			var parentB = parentA.alternate;
			if (null === parentB) {
				b = parentA.return;
				if (null !== b) {
					a = b;
					continue;
				}
				break;
			}
			if (parentA.child === parentB.child) {
				for (parentB = parentA.child; parentB;) {
					if (parentB === a) return assertIsMounted(parentA), fiber;
					if (parentB === b) return assertIsMounted(parentA), alternate;
					parentB = parentB.sibling;
				}
				throw Error(formatProdErrorMessage(188));
			}
			if (a.return !== b.return) a = parentA, b = parentB;
			else {
				for (var didFindChild = !1, child$0 = parentA.child; child$0;) {
					if (child$0 === a) {
						didFindChild = !0;
						a = parentA;
						b = parentB;
						break;
					}
					if (child$0 === b) {
						didFindChild = !0;
						b = parentA;
						a = parentB;
						break;
					}
					child$0 = child$0.sibling;
				}
				if (!didFindChild) {
					for (child$0 = parentB.child; child$0;) {
						if (child$0 === a) {
							didFindChild = !0;
							a = parentB;
							b = parentA;
							break;
						}
						if (child$0 === b) {
							didFindChild = !0;
							b = parentB;
							a = parentA;
							break;
						}
						child$0 = child$0.sibling;
					}
					if (!didFindChild) throw Error(formatProdErrorMessage(189));
				}
			}
			if (a.alternate !== b) throw Error(formatProdErrorMessage(190));
		}
		if (3 !== a.tag) throw Error(formatProdErrorMessage(188));
		return a.stateNode.current === a ? fiber : alternate;
	}
	function findCurrentHostFiberImpl(node) {
		var tag = node.tag;
		if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return node;
		for (node = node.child; null !== node;) {
			tag = findCurrentHostFiberImpl(node);
			if (null !== tag) return tag;
			node = node.sibling;
		}
		return null;
	}
	var assign = Object.assign, REACT_LEGACY_ELEMENT_TYPE = Symbol.for("react.element"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy");
	var REACT_ACTIVITY_TYPE = Symbol.for("react.activity");
	var REACT_MEMO_CACHE_SENTINEL = Symbol.for("react.memo_cache_sentinel");
	var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
	function getComponentNameFromType(type) {
		if (null == type) return null;
		if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
		if ("string" === typeof type) return type;
		switch (type) {
			case REACT_FRAGMENT_TYPE: return "Fragment";
			case REACT_PROFILER_TYPE: return "Profiler";
			case REACT_STRICT_MODE_TYPE: return "StrictMode";
			case REACT_SUSPENSE_TYPE: return "Suspense";
			case REACT_SUSPENSE_LIST_TYPE: return "SuspenseList";
			case REACT_ACTIVITY_TYPE: return "Activity";
		}
		if ("object" === typeof type) switch (type.$$typeof) {
			case REACT_PORTAL_TYPE: return "Portal";
			case REACT_CONTEXT_TYPE: return type.displayName || "Context";
			case REACT_CONSUMER_TYPE: return (type._context.displayName || "Context") + ".Consumer";
			case REACT_FORWARD_REF_TYPE:
				var innerType = type.render;
				type = type.displayName;
				type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
				return type;
			case REACT_MEMO_TYPE: return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
			case REACT_LAZY_TYPE:
				innerType = type._payload;
				type = type._init;
				try {
					return getComponentNameFromType(type(innerType));
				} catch (x) {}
		}
		return null;
	}
	var isArrayImpl = Array.isArray, ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, sharedNotPendingObject = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, valueStack = [], index = -1;
	function createCursor(defaultValue) {
		return { current: defaultValue };
	}
	function pop(cursor) {
		0 > index || (cursor.current = valueStack[index], valueStack[index] = null, index--);
	}
	function push(cursor, value) {
		index++;
		valueStack[index] = cursor.current;
		cursor.current = value;
	}
	var contextStackCursor = createCursor(null), contextFiberStackCursor = createCursor(null), rootInstanceStackCursor = createCursor(null), hostTransitionProviderCursor = createCursor(null);
	function pushHostContainer(fiber, nextRootInstance) {
		push(rootInstanceStackCursor, nextRootInstance);
		push(contextFiberStackCursor, fiber);
		push(contextStackCursor, null);
		switch (nextRootInstance.nodeType) {
			case 9:
			case 11:
				fiber = (fiber = nextRootInstance.documentElement) ? (fiber = fiber.namespaceURI) ? getOwnHostContext(fiber) : 0 : 0;
				break;
			default: if (fiber = nextRootInstance.tagName, nextRootInstance = nextRootInstance.namespaceURI) nextRootInstance = getOwnHostContext(nextRootInstance), fiber = getChildHostContextProd(nextRootInstance, fiber);
			else switch (fiber) {
				case "svg":
					fiber = 1;
					break;
				case "math":
					fiber = 2;
					break;
				default: fiber = 0;
			}
		}
		pop(contextStackCursor);
		push(contextStackCursor, fiber);
	}
	function popHostContainer() {
		pop(contextStackCursor);
		pop(contextFiberStackCursor);
		pop(rootInstanceStackCursor);
	}
	function pushHostContext(fiber) {
		null !== fiber.memoizedState && push(hostTransitionProviderCursor, fiber);
		var context = contextStackCursor.current;
		var JSCompiler_inline_result = getChildHostContextProd(context, fiber.type);
		context !== JSCompiler_inline_result && (push(contextFiberStackCursor, fiber), push(contextStackCursor, JSCompiler_inline_result));
	}
	function popHostContext(fiber) {
		contextFiberStackCursor.current === fiber && (pop(contextStackCursor), pop(contextFiberStackCursor));
		hostTransitionProviderCursor.current === fiber && (pop(hostTransitionProviderCursor), HostTransitionContext._currentValue = sharedNotPendingObject);
	}
	var prefix, suffix;
	function describeBuiltInComponentFrame(name) {
		if (void 0 === prefix) try {
			throw Error();
		} catch (x) {
			var match = x.stack.trim().match(/\n( *(at )?)/);
			prefix = match && match[1] || "";
			suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + prefix + name + suffix;
	}
	var reentry = !1;
	function describeNativeComponentFrame(fn, construct) {
		if (!fn || reentry) return "";
		reentry = !0;
		var previousPrepareStackTrace = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var RunInRootFrame = { DetermineComponentFrameRoot: function() {
				try {
					if (construct) {
						var Fake = function() {
							throw Error();
						};
						Object.defineProperty(Fake.prototype, "props", { set: function() {
							throw Error();
						} });
						if ("object" === typeof Reflect && Reflect.construct) {
							try {
								Reflect.construct(Fake, []);
							} catch (x) {
								var control = x;
							}
							Reflect.construct(fn, [], Fake);
						} else {
							try {
								Fake.call();
							} catch (x$1) {
								control = x$1;
							}
							fn.call(Fake.prototype);
						}
					} else {
						try {
							throw Error();
						} catch (x$2) {
							control = x$2;
						}
						(Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {});
					}
				} catch (sample) {
					if (sample && control && "string" === typeof sample.stack) return [sample.stack, control.stack];
				}
				return [null, null];
			} };
			RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var namePropDescriptor = Object.getOwnPropertyDescriptor(RunInRootFrame.DetermineComponentFrameRoot, "name");
			namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(RunInRootFrame.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
			if (sampleStack && controlStack) {
				var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
				for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot");) RunInRootFrame++;
				for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes("DetermineComponentFrameRoot");) namePropDescriptor++;
				if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length) for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor];) namePropDescriptor--;
				for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--) if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
					if (1 !== RunInRootFrame || 1 !== namePropDescriptor) do
						if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
							var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
							fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
							return frame;
						}
					while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
					break;
				}
			}
		} finally {
			reentry = !1, Error.prepareStackTrace = previousPrepareStackTrace;
		}
		return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
	}
	function describeFiber(fiber, childFiber) {
		switch (fiber.tag) {
			case 26:
			case 27:
			case 5: return describeBuiltInComponentFrame(fiber.type);
			case 16: return describeBuiltInComponentFrame("Lazy");
			case 13: return fiber.child !== childFiber && null !== childFiber ? describeBuiltInComponentFrame("Suspense Fallback") : describeBuiltInComponentFrame("Suspense");
			case 19: return describeBuiltInComponentFrame("SuspenseList");
			case 0:
			case 15: return describeNativeComponentFrame(fiber.type, !1);
			case 11: return describeNativeComponentFrame(fiber.type.render, !1);
			case 1: return describeNativeComponentFrame(fiber.type, !0);
			case 31: return describeBuiltInComponentFrame("Activity");
			default: return "";
		}
	}
	function getStackByFiberInDevAndProd(workInProgress) {
		try {
			var info = "", previous = null;
			do
				info += describeFiber(workInProgress, previous), previous = workInProgress, workInProgress = workInProgress.return;
			while (workInProgress);
			return info;
		} catch (x) {
			return "\nError generating stack: " + x.message + "\n" + x.stack;
		}
	}
	var hasOwnProperty = Object.prototype.hasOwnProperty, scheduleCallback$3 = Scheduler.unstable_scheduleCallback, cancelCallback$1 = Scheduler.unstable_cancelCallback, shouldYield = Scheduler.unstable_shouldYield, requestPaint = Scheduler.unstable_requestPaint, now = Scheduler.unstable_now, getCurrentPriorityLevel = Scheduler.unstable_getCurrentPriorityLevel, ImmediatePriority = Scheduler.unstable_ImmediatePriority, UserBlockingPriority = Scheduler.unstable_UserBlockingPriority, NormalPriority$1 = Scheduler.unstable_NormalPriority, LowPriority = Scheduler.unstable_LowPriority, IdlePriority = Scheduler.unstable_IdlePriority, log$1 = Scheduler.log, unstable_setDisableYieldValue = Scheduler.unstable_setDisableYieldValue, rendererID = null, injectedHook = null;
	function setIsStrictModeForDevtools(newIsStrictMode) {
		"function" === typeof log$1 && unstable_setDisableYieldValue(newIsStrictMode);
		if (injectedHook && "function" === typeof injectedHook.setStrictMode) try {
			injectedHook.setStrictMode(rendererID, newIsStrictMode);
		} catch (err) {}
	}
	var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback, log = Math.log, LN2 = Math.LN2;
	function clz32Fallback(x) {
		x >>>= 0;
		return 0 === x ? 32 : 31 - (log(x) / LN2 | 0) | 0;
	}
	var nextTransitionUpdateLane = 256, nextTransitionDeferredLane = 262144, nextRetryLane = 4194304;
	function getHighestPriorityLanes(lanes) {
		var pendingSyncLanes = lanes & 42;
		if (0 !== pendingSyncLanes) return pendingSyncLanes;
		switch (lanes & -lanes) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return lanes & 261888;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return lanes & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return lanes & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return lanes;
		}
	}
	function getNextLanes(root, wipLanes, rootHasPendingCommit) {
		var pendingLanes = root.pendingLanes;
		if (0 === pendingLanes) return 0;
		var nextLanes = 0, suspendedLanes = root.suspendedLanes, pingedLanes = root.pingedLanes;
		root = root.warmLanes;
		var nonIdlePendingLanes = pendingLanes & 134217727;
		0 !== nonIdlePendingLanes ? (pendingLanes = nonIdlePendingLanes & ~suspendedLanes, 0 !== pendingLanes ? nextLanes = getHighestPriorityLanes(pendingLanes) : (pingedLanes &= nonIdlePendingLanes, 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = nonIdlePendingLanes & ~root, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))))) : (nonIdlePendingLanes = pendingLanes & ~suspendedLanes, 0 !== nonIdlePendingLanes ? nextLanes = getHighestPriorityLanes(nonIdlePendingLanes) : 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = pendingLanes & ~root, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))));
		return 0 === nextLanes ? 0 : 0 !== wipLanes && wipLanes !== nextLanes && 0 === (wipLanes & suspendedLanes) && (suspendedLanes = nextLanes & -nextLanes, rootHasPendingCommit = wipLanes & -wipLanes, suspendedLanes >= rootHasPendingCommit || 32 === suspendedLanes && 0 !== (rootHasPendingCommit & 4194048)) ? wipLanes : nextLanes;
	}
	function checkIfRootIsPrerendering(root, renderLanes) {
		return 0 === (root.pendingLanes & ~(root.suspendedLanes & ~root.pingedLanes) & renderLanes);
	}
	function computeExpirationTime(lane, currentTime) {
		switch (lane) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return currentTime + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return currentTime + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function claimNextRetryLane() {
		var lane = nextRetryLane;
		nextRetryLane <<= 1;
		0 === (nextRetryLane & 62914560) && (nextRetryLane = 4194304);
		return lane;
	}
	function createLaneMap(initial) {
		for (var laneMap = [], i = 0; 31 > i; i++) laneMap.push(initial);
		return laneMap;
	}
	function markRootUpdated$1(root, updateLane) {
		root.pendingLanes |= updateLane;
		268435456 !== updateLane && (root.suspendedLanes = 0, root.pingedLanes = 0, root.warmLanes = 0);
	}
	function markRootFinished(root, finishedLanes, remainingLanes, spawnedLane, updatedLanes, suspendedRetryLanes) {
		var previouslyPendingLanes = root.pendingLanes;
		root.pendingLanes = remainingLanes;
		root.suspendedLanes = 0;
		root.pingedLanes = 0;
		root.warmLanes = 0;
		root.expiredLanes &= remainingLanes;
		root.entangledLanes &= remainingLanes;
		root.errorRecoveryDisabledLanes &= remainingLanes;
		root.shellSuspendCounter = 0;
		var entanglements = root.entanglements, expirationTimes = root.expirationTimes, hiddenUpdates = root.hiddenUpdates;
		for (remainingLanes = previouslyPendingLanes & ~remainingLanes; 0 < remainingLanes;) {
			var index$7 = 31 - clz32(remainingLanes), lane = 1 << index$7;
			entanglements[index$7] = 0;
			expirationTimes[index$7] = -1;
			var hiddenUpdatesForLane = hiddenUpdates[index$7];
			if (null !== hiddenUpdatesForLane) for (hiddenUpdates[index$7] = null, index$7 = 0; index$7 < hiddenUpdatesForLane.length; index$7++) {
				var update = hiddenUpdatesForLane[index$7];
				null !== update && (update.lane &= -536870913);
			}
			remainingLanes &= ~lane;
		}
		0 !== spawnedLane && markSpawnedDeferredLane(root, spawnedLane, 0);
		0 !== suspendedRetryLanes && 0 === updatedLanes && 0 !== root.tag && (root.suspendedLanes |= suspendedRetryLanes & ~(previouslyPendingLanes & ~finishedLanes));
	}
	function markSpawnedDeferredLane(root, spawnedLane, entangledLanes) {
		root.pendingLanes |= spawnedLane;
		root.suspendedLanes &= ~spawnedLane;
		var spawnedLaneIndex = 31 - clz32(spawnedLane);
		root.entangledLanes |= spawnedLane;
		root.entanglements[spawnedLaneIndex] = root.entanglements[spawnedLaneIndex] | 1073741824 | entangledLanes & 261930;
	}
	function markRootEntangled(root, entangledLanes) {
		var rootEntangledLanes = root.entangledLanes |= entangledLanes;
		for (root = root.entanglements; rootEntangledLanes;) {
			var index$8 = 31 - clz32(rootEntangledLanes), lane = 1 << index$8;
			lane & entangledLanes | root[index$8] & entangledLanes && (root[index$8] |= entangledLanes);
			rootEntangledLanes &= ~lane;
		}
	}
	function getBumpedLaneForHydration(root, renderLanes) {
		var renderLane = renderLanes & -renderLanes;
		renderLane = 0 !== (renderLane & 42) ? 1 : getBumpedLaneForHydrationByLane(renderLane);
		return 0 !== (renderLane & (root.suspendedLanes | renderLanes)) ? 0 : renderLane;
	}
	function getBumpedLaneForHydrationByLane(lane) {
		switch (lane) {
			case 2:
				lane = 1;
				break;
			case 8:
				lane = 4;
				break;
			case 32:
				lane = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				lane = 128;
				break;
			case 268435456:
				lane = 134217728;
				break;
			default: lane = 0;
		}
		return lane;
	}
	function lanesToEventPriority(lanes) {
		lanes &= -lanes;
		return 2 < lanes ? 8 < lanes ? 0 !== (lanes & 134217727) ? 32 : 268435456 : 8 : 2;
	}
	function resolveUpdatePriority() {
		var updatePriority = ReactDOMSharedInternals.p;
		if (0 !== updatePriority) return updatePriority;
		updatePriority = window.event;
		return void 0 === updatePriority ? 32 : getEventPriority(updatePriority.type);
	}
	function runWithPriority(priority, fn) {
		var previousPriority = ReactDOMSharedInternals.p;
		try {
			return ReactDOMSharedInternals.p = priority, fn();
		} finally {
			ReactDOMSharedInternals.p = previousPriority;
		}
	}
	var randomKey = Math.random().toString(36).slice(2), internalInstanceKey = "__reactFiber$" + randomKey, internalPropsKey = "__reactProps$" + randomKey, internalContainerInstanceKey = "__reactContainer$" + randomKey, internalEventHandlersKey = "__reactEvents$" + randomKey, internalEventHandlerListenersKey = "__reactListeners$" + randomKey, internalEventHandlesSetKey = "__reactHandles$" + randomKey, internalRootNodeResourcesKey = "__reactResources$" + randomKey, internalHoistableMarker = "__reactMarker$" + randomKey;
	function detachDeletedInstance(node) {
		delete node[internalInstanceKey];
		delete node[internalPropsKey];
		delete node[internalEventHandlersKey];
		delete node[internalEventHandlerListenersKey];
		delete node[internalEventHandlesSetKey];
	}
	function getClosestInstanceFromNode(targetNode) {
		var targetInst = targetNode[internalInstanceKey];
		if (targetInst) return targetInst;
		for (var parentNode = targetNode.parentNode; parentNode;) {
			if (targetInst = parentNode[internalContainerInstanceKey] || parentNode[internalInstanceKey]) {
				parentNode = targetInst.alternate;
				if (null !== targetInst.child || null !== parentNode && null !== parentNode.child) for (targetNode = getParentHydrationBoundary(targetNode); null !== targetNode;) {
					if (parentNode = targetNode[internalInstanceKey]) return parentNode;
					targetNode = getParentHydrationBoundary(targetNode);
				}
				return targetInst;
			}
			targetNode = parentNode;
			parentNode = targetNode.parentNode;
		}
		return null;
	}
	function getInstanceFromNode(node) {
		if (node = node[internalInstanceKey] || node[internalContainerInstanceKey]) {
			var tag = node.tag;
			if (5 === tag || 6 === tag || 13 === tag || 31 === tag || 26 === tag || 27 === tag || 3 === tag) return node;
		}
		return null;
	}
	function getNodeFromInstance(inst) {
		var tag = inst.tag;
		if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return inst.stateNode;
		throw Error(formatProdErrorMessage(33));
	}
	function getResourcesFromRoot(root) {
		var resources = root[internalRootNodeResourcesKey];
		resources || (resources = root[internalRootNodeResourcesKey] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		});
		return resources;
	}
	function markNodeAsHoistable(node) {
		node[internalHoistableMarker] = !0;
	}
	var allNativeEvents = /* @__PURE__ */ new Set(), registrationNameDependencies = {};
	function registerTwoPhaseEvent(registrationName, dependencies) {
		registerDirectEvent(registrationName, dependencies);
		registerDirectEvent(registrationName + "Capture", dependencies);
	}
	function registerDirectEvent(registrationName, dependencies) {
		registrationNameDependencies[registrationName] = dependencies;
		for (registrationName = 0; registrationName < dependencies.length; registrationName++) allNativeEvents.add(dependencies[registrationName]);
	}
	var VALID_ATTRIBUTE_NAME_REGEX = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), illegalAttributeNameCache = {}, validatedAttributeNameCache = {};
	function isAttributeNameSafe(attributeName) {
		if (hasOwnProperty.call(validatedAttributeNameCache, attributeName)) return !0;
		if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return !1;
		if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) return validatedAttributeNameCache[attributeName] = !0;
		illegalAttributeNameCache[attributeName] = !0;
		return !1;
	}
	function setValueForAttribute(node, name, value) {
		if (isAttributeNameSafe(name)) if (null === value) node.removeAttribute(name);
		else {
			switch (typeof value) {
				case "undefined":
				case "function":
				case "symbol":
					node.removeAttribute(name);
					return;
				case "boolean":
					var prefix$10 = name.toLowerCase().slice(0, 5);
					if ("data-" !== prefix$10 && "aria-" !== prefix$10) {
						node.removeAttribute(name);
						return;
					}
			}
			node.setAttribute(name, "" + value);
		}
	}
	function setValueForKnownAttribute(node, name, value) {
		if (null === value) node.removeAttribute(name);
		else {
			switch (typeof value) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					node.removeAttribute(name);
					return;
			}
			node.setAttribute(name, "" + value);
		}
	}
	function setValueForNamespacedAttribute(node, namespace, name, value) {
		if (null === value) node.removeAttribute(name);
		else {
			switch (typeof value) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					node.removeAttribute(name);
					return;
			}
			node.setAttributeNS(namespace, name, "" + value);
		}
	}
	function getToStringValue(value) {
		switch (typeof value) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return value;
			case "object": return value;
			default: return "";
		}
	}
	function isCheckable(elem) {
		var type = elem.type;
		return (elem = elem.nodeName) && "input" === elem.toLowerCase() && ("checkbox" === type || "radio" === type);
	}
	function trackValueOnNode(node, valueField, currentValue) {
		var descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField);
		if (!node.hasOwnProperty(valueField) && "undefined" !== typeof descriptor && "function" === typeof descriptor.get && "function" === typeof descriptor.set) {
			var get = descriptor.get, set = descriptor.set;
			Object.defineProperty(node, valueField, {
				configurable: !0,
				get: function() {
					return get.call(this);
				},
				set: function(value) {
					currentValue = "" + value;
					set.call(this, value);
				}
			});
			Object.defineProperty(node, valueField, { enumerable: descriptor.enumerable });
			return {
				getValue: function() {
					return currentValue;
				},
				setValue: function(value) {
					currentValue = "" + value;
				},
				stopTracking: function() {
					node._valueTracker = null;
					delete node[valueField];
				}
			};
		}
	}
	function track(node) {
		if (!node._valueTracker) {
			var valueField = isCheckable(node) ? "checked" : "value";
			node._valueTracker = trackValueOnNode(node, valueField, "" + node[valueField]);
		}
	}
	function updateValueIfChanged(node) {
		if (!node) return !1;
		var tracker = node._valueTracker;
		if (!tracker) return !0;
		var lastValue = tracker.getValue();
		var value = "";
		node && (value = isCheckable(node) ? node.checked ? "true" : "false" : node.value);
		node = value;
		return node !== lastValue ? (tracker.setValue(node), !0) : !1;
	}
	function getActiveElement(doc) {
		doc = doc || ("undefined" !== typeof document ? document : void 0);
		if ("undefined" === typeof doc) return null;
		try {
			return doc.activeElement || doc.body;
		} catch (e) {
			return doc.body;
		}
	}
	var escapeSelectorAttributeValueInsideDoubleQuotesRegex = /[\n"\\]/g;
	function escapeSelectorAttributeValueInsideDoubleQuotes(value) {
		return value.replace(escapeSelectorAttributeValueInsideDoubleQuotesRegex, function(ch) {
			return "\\" + ch.charCodeAt(0).toString(16) + " ";
		});
	}
	function updateInput(element, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name) {
		element.name = "";
		null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type ? element.type = type : element.removeAttribute("type");
		if (null != value) if ("number" === type) {
			if (0 === value && "" === element.value || element.value != value) element.value = "" + getToStringValue(value);
		} else element.value !== "" + getToStringValue(value) && (element.value = "" + getToStringValue(value));
		else "submit" !== type && "reset" !== type || element.removeAttribute("value");
		null != value ? setDefaultValue(element, type, getToStringValue(value)) : null != defaultValue ? setDefaultValue(element, type, getToStringValue(defaultValue)) : null != lastDefaultValue && element.removeAttribute("value");
		null == checked && null != defaultChecked && (element.defaultChecked = !!defaultChecked);
		null != checked && (element.checked = checked && "function" !== typeof checked && "symbol" !== typeof checked);
		null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name ? element.name = "" + getToStringValue(name) : element.removeAttribute("name");
	}
	function initInput(element, value, defaultValue, checked, defaultChecked, type, name, isHydrating) {
		null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type && (element.type = type);
		if (null != value || null != defaultValue) {
			if (!("submit" !== type && "reset" !== type || void 0 !== value && null !== value)) {
				track(element);
				return;
			}
			defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
			value = null != value ? "" + getToStringValue(value) : defaultValue;
			isHydrating || value === element.value || (element.value = value);
			element.defaultValue = value;
		}
		checked = null != checked ? checked : defaultChecked;
		checked = "function" !== typeof checked && "symbol" !== typeof checked && !!checked;
		element.checked = isHydrating ? element.checked : !!checked;
		element.defaultChecked = !!checked;
		null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name && (element.name = name);
		track(element);
	}
	function setDefaultValue(node, type, value) {
		"number" === type && getActiveElement(node.ownerDocument) === node || node.defaultValue === "" + value || (node.defaultValue = "" + value);
	}
	function updateOptions(node, multiple, propValue, setDefaultSelected) {
		node = node.options;
		if (multiple) {
			multiple = {};
			for (var i = 0; i < propValue.length; i++) multiple["$" + propValue[i]] = !0;
			for (propValue = 0; propValue < node.length; propValue++) i = multiple.hasOwnProperty("$" + node[propValue].value), node[propValue].selected !== i && (node[propValue].selected = i), i && setDefaultSelected && (node[propValue].defaultSelected = !0);
		} else {
			propValue = "" + getToStringValue(propValue);
			multiple = null;
			for (i = 0; i < node.length; i++) {
				if (node[i].value === propValue) {
					node[i].selected = !0;
					setDefaultSelected && (node[i].defaultSelected = !0);
					return;
				}
				null !== multiple || node[i].disabled || (multiple = node[i]);
			}
			null !== multiple && (multiple.selected = !0);
		}
	}
	function updateTextarea(element, value, defaultValue) {
		if (null != value && (value = "" + getToStringValue(value), value !== element.value && (element.value = value), null == defaultValue)) {
			element.defaultValue !== value && (element.defaultValue = value);
			return;
		}
		element.defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
	}
	function initTextarea(element, value, defaultValue, children) {
		if (null == value) {
			if (null != children) {
				if (null != defaultValue) throw Error(formatProdErrorMessage(92));
				if (isArrayImpl(children)) {
					if (1 < children.length) throw Error(formatProdErrorMessage(93));
					children = children[0];
				}
				defaultValue = children;
			}
			defaultValue ??= "";
			value = defaultValue;
		}
		defaultValue = getToStringValue(value);
		element.defaultValue = defaultValue;
		children = element.textContent;
		children === defaultValue && "" !== children && null !== children && (element.value = children);
		track(element);
	}
	function setTextContent(node, text) {
		if (text) {
			var firstChild = node.firstChild;
			if (firstChild && firstChild === node.lastChild && 3 === firstChild.nodeType) {
				firstChild.nodeValue = text;
				return;
			}
		}
		node.textContent = text;
	}
	var unitlessNumbers = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function setValueForStyle(style, styleName, value) {
		var isCustomProperty = 0 === styleName.indexOf("--");
		null == value || "boolean" === typeof value || "" === value ? isCustomProperty ? style.setProperty(styleName, "") : "float" === styleName ? style.cssFloat = "" : style[styleName] = "" : isCustomProperty ? style.setProperty(styleName, value) : "number" !== typeof value || 0 === value || unitlessNumbers.has(styleName) ? "float" === styleName ? style.cssFloat = value : style[styleName] = ("" + value).trim() : style[styleName] = value + "px";
	}
	function setValueForStyles(node, styles, prevStyles) {
		if (null != styles && "object" !== typeof styles) throw Error(formatProdErrorMessage(62));
		node = node.style;
		if (null != prevStyles) {
			for (var styleName in prevStyles) !prevStyles.hasOwnProperty(styleName) || null != styles && styles.hasOwnProperty(styleName) || (0 === styleName.indexOf("--") ? node.setProperty(styleName, "") : "float" === styleName ? node.cssFloat = "" : node[styleName] = "");
			for (var styleName$16 in styles) styleName = styles[styleName$16], styles.hasOwnProperty(styleName$16) && prevStyles[styleName$16] !== styleName && setValueForStyle(node, styleName$16, styleName);
		} else for (var styleName$17 in styles) styles.hasOwnProperty(styleName$17) && setValueForStyle(node, styleName$17, styles[styleName$17]);
	}
	function isCustomElement(tagName) {
		if (-1 === tagName.indexOf("-")) return !1;
		switch (tagName) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var aliases = new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function sanitizeURL(url) {
		return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
	}
	function noop$1() {}
	var currentReplayingEvent = null;
	function getEventTarget(nativeEvent) {
		nativeEvent = nativeEvent.target || nativeEvent.srcElement || window;
		nativeEvent.correspondingUseElement && (nativeEvent = nativeEvent.correspondingUseElement);
		return 3 === nativeEvent.nodeType ? nativeEvent.parentNode : nativeEvent;
	}
	var restoreTarget = null, restoreQueue = null;
	function restoreStateOfTarget(target) {
		var internalInstance = getInstanceFromNode(target);
		if (internalInstance && (target = internalInstance.stateNode)) {
			var props = target[internalPropsKey] || null;
			a: switch (target = internalInstance.stateNode, internalInstance.type) {
				case "input":
					updateInput(target, props.value, props.defaultValue, props.defaultValue, props.checked, props.defaultChecked, props.type, props.name);
					internalInstance = props.name;
					if ("radio" === props.type && null != internalInstance) {
						for (props = target; props.parentNode;) props = props.parentNode;
						props = props.querySelectorAll("input[name=\"" + escapeSelectorAttributeValueInsideDoubleQuotes("" + internalInstance) + "\"][type=\"radio\"]");
						for (internalInstance = 0; internalInstance < props.length; internalInstance++) {
							var otherNode = props[internalInstance];
							if (otherNode !== target && otherNode.form === target.form) {
								var otherProps = otherNode[internalPropsKey] || null;
								if (!otherProps) throw Error(formatProdErrorMessage(90));
								updateInput(otherNode, otherProps.value, otherProps.defaultValue, otherProps.defaultValue, otherProps.checked, otherProps.defaultChecked, otherProps.type, otherProps.name);
							}
						}
						for (internalInstance = 0; internalInstance < props.length; internalInstance++) otherNode = props[internalInstance], otherNode.form === target.form && updateValueIfChanged(otherNode);
					}
					break a;
				case "textarea":
					updateTextarea(target, props.value, props.defaultValue);
					break a;
				case "select": internalInstance = props.value, null != internalInstance && updateOptions(target, !!props.multiple, internalInstance, !1);
			}
		}
	}
	var isInsideEventHandler = !1;
	function batchedUpdates$1(fn, a, b) {
		if (isInsideEventHandler) return fn(a, b);
		isInsideEventHandler = !0;
		try {
			return fn(a);
		} finally {
			if (isInsideEventHandler = !1, null !== restoreTarget || null !== restoreQueue) {
				if (flushSyncWork$1(), restoreTarget && (a = restoreTarget, fn = restoreQueue, restoreQueue = restoreTarget = null, restoreStateOfTarget(a), fn)) for (a = 0; a < fn.length; a++) restoreStateOfTarget(fn[a]);
			}
		}
	}
	function getListener(inst, registrationName) {
		var stateNode = inst.stateNode;
		if (null === stateNode) return null;
		var props = stateNode[internalPropsKey] || null;
		if (null === props) return null;
		stateNode = props[registrationName];
		a: switch (registrationName) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(props = !props.disabled) || (inst = inst.type, props = !("button" === inst || "input" === inst || "select" === inst || "textarea" === inst));
				inst = !props;
				break a;
			default: inst = !1;
		}
		if (inst) return null;
		if (stateNode && "function" !== typeof stateNode) throw Error(formatProdErrorMessage(231, registrationName, typeof stateNode));
		return stateNode;
	}
	var canUseDOM = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), passiveBrowserEventsSupported = !1;
	if (canUseDOM) try {
		var options = {};
		Object.defineProperty(options, "passive", { get: function() {
			passiveBrowserEventsSupported = !0;
		} });
		window.addEventListener("test", options, options);
		window.removeEventListener("test", options, options);
	} catch (e) {
		passiveBrowserEventsSupported = !1;
	}
	var root = null, startText = null, fallbackText = null;
	function getData() {
		if (fallbackText) return fallbackText;
		var start, startValue = startText, startLength = startValue.length, end, endValue = "value" in root ? root.value : root.textContent, endLength = endValue.length;
		for (start = 0; start < startLength && startValue[start] === endValue[start]; start++);
		var minEnd = startLength - start;
		for (end = 1; end <= minEnd && startValue[startLength - end] === endValue[endLength - end]; end++);
		return fallbackText = endValue.slice(start, 1 < end ? 1 - end : void 0);
	}
	function getEventCharCode(nativeEvent) {
		var keyCode = nativeEvent.keyCode;
		"charCode" in nativeEvent ? (nativeEvent = nativeEvent.charCode, 0 === nativeEvent && 13 === keyCode && (nativeEvent = 13)) : nativeEvent = keyCode;
		10 === nativeEvent && (nativeEvent = 13);
		return 32 <= nativeEvent || 13 === nativeEvent ? nativeEvent : 0;
	}
	function functionThatReturnsTrue() {
		return !0;
	}
	function functionThatReturnsFalse() {
		return !1;
	}
	function createSyntheticEvent(Interface) {
		function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
			this._reactName = reactName;
			this._targetInst = targetInst;
			this.type = reactEventType;
			this.nativeEvent = nativeEvent;
			this.target = nativeEventTarget;
			this.currentTarget = null;
			for (var propName in Interface) Interface.hasOwnProperty(propName) && (reactName = Interface[propName], this[propName] = reactName ? reactName(nativeEvent) : nativeEvent[propName]);
			this.isDefaultPrevented = (null != nativeEvent.defaultPrevented ? nativeEvent.defaultPrevented : !1 === nativeEvent.returnValue) ? functionThatReturnsTrue : functionThatReturnsFalse;
			this.isPropagationStopped = functionThatReturnsFalse;
			return this;
		}
		assign(SyntheticBaseEvent.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var event = this.nativeEvent;
				event && (event.preventDefault ? event.preventDefault() : "unknown" !== typeof event.returnValue && (event.returnValue = !1), this.isDefaultPrevented = functionThatReturnsTrue);
			},
			stopPropagation: function() {
				var event = this.nativeEvent;
				event && (event.stopPropagation ? event.stopPropagation() : "unknown" !== typeof event.cancelBubble && (event.cancelBubble = !0), this.isPropagationStopped = functionThatReturnsTrue);
			},
			persist: function() {},
			isPersistent: functionThatReturnsTrue
		});
		return SyntheticBaseEvent;
	}
	var EventInterface = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(event) {
			return event.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, SyntheticEvent = createSyntheticEvent(EventInterface), UIEventInterface = assign({}, EventInterface, {
		view: 0,
		detail: 0
	}), SyntheticUIEvent = createSyntheticEvent(UIEventInterface), lastMovementX, lastMovementY, lastMouseEvent, MouseEventInterface = assign({}, UIEventInterface, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: getEventModifierState,
		button: 0,
		buttons: 0,
		relatedTarget: function(event) {
			return void 0 === event.relatedTarget ? event.fromElement === event.srcElement ? event.toElement : event.fromElement : event.relatedTarget;
		},
		movementX: function(event) {
			if ("movementX" in event) return event.movementX;
			event !== lastMouseEvent && (lastMouseEvent && "mousemove" === event.type ? (lastMovementX = event.screenX - lastMouseEvent.screenX, lastMovementY = event.screenY - lastMouseEvent.screenY) : lastMovementY = lastMovementX = 0, lastMouseEvent = event);
			return lastMovementX;
		},
		movementY: function(event) {
			return "movementY" in event ? event.movementY : lastMovementY;
		}
	}), SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface), SyntheticDragEvent = createSyntheticEvent(assign({}, MouseEventInterface, { dataTransfer: 0 })), SyntheticFocusEvent = createSyntheticEvent(assign({}, UIEventInterface, { relatedTarget: 0 })), SyntheticAnimationEvent = createSyntheticEvent(assign({}, EventInterface, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), SyntheticClipboardEvent = createSyntheticEvent(assign({}, EventInterface, { clipboardData: function(event) {
		return "clipboardData" in event ? event.clipboardData : window.clipboardData;
	} })), SyntheticCompositionEvent = createSyntheticEvent(assign({}, EventInterface, { data: 0 })), normalizeKey = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, translateToKey = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, modifierKeyToProp = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function modifierStateGetter(keyArg) {
		var nativeEvent = this.nativeEvent;
		return nativeEvent.getModifierState ? nativeEvent.getModifierState(keyArg) : (keyArg = modifierKeyToProp[keyArg]) ? !!nativeEvent[keyArg] : !1;
	}
	function getEventModifierState() {
		return modifierStateGetter;
	}
	var SyntheticKeyboardEvent = createSyntheticEvent(assign({}, UIEventInterface, {
		key: function(nativeEvent) {
			if (nativeEvent.key) {
				var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
				if ("Unidentified" !== key) return key;
			}
			return "keypress" === nativeEvent.type ? (nativeEvent = getEventCharCode(nativeEvent), 13 === nativeEvent ? "Enter" : String.fromCharCode(nativeEvent)) : "keydown" === nativeEvent.type || "keyup" === nativeEvent.type ? translateToKey[nativeEvent.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: getEventModifierState,
		charCode: function(event) {
			return "keypress" === event.type ? getEventCharCode(event) : 0;
		},
		keyCode: function(event) {
			return "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
		},
		which: function(event) {
			return "keypress" === event.type ? getEventCharCode(event) : "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
		}
	})), SyntheticPointerEvent = createSyntheticEvent(assign({}, MouseEventInterface, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), SyntheticTouchEvent = createSyntheticEvent(assign({}, UIEventInterface, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: getEventModifierState
	})), SyntheticTransitionEvent = createSyntheticEvent(assign({}, EventInterface, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), SyntheticWheelEvent = createSyntheticEvent(assign({}, MouseEventInterface, {
		deltaX: function(event) {
			return "deltaX" in event ? event.deltaX : "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
		},
		deltaY: function(event) {
			return "deltaY" in event ? event.deltaY : "wheelDeltaY" in event ? -event.wheelDeltaY : "wheelDelta" in event ? -event.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), SyntheticToggleEvent = createSyntheticEvent(assign({}, EventInterface, {
		newState: 0,
		oldState: 0
	})), END_KEYCODES = [
		9,
		13,
		27,
		32
	], canUseCompositionEvent = canUseDOM && "CompositionEvent" in window, documentMode = null;
	canUseDOM && "documentMode" in document && (documentMode = document.documentMode);
	var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode, useFallbackCompositionData = canUseDOM && (!canUseCompositionEvent || documentMode && 8 < documentMode && 11 >= documentMode), SPACEBAR_CHAR = String.fromCharCode(32), hasSpaceKeypress = !1;
	function isFallbackCompositionEnd(domEventName, nativeEvent) {
		switch (domEventName) {
			case "keyup": return -1 !== END_KEYCODES.indexOf(nativeEvent.keyCode);
			case "keydown": return 229 !== nativeEvent.keyCode;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function getDataFromCustomEvent(nativeEvent) {
		nativeEvent = nativeEvent.detail;
		return "object" === typeof nativeEvent && "data" in nativeEvent ? nativeEvent.data : null;
	}
	var isComposing = !1;
	function getNativeBeforeInputChars(domEventName, nativeEvent) {
		switch (domEventName) {
			case "compositionend": return getDataFromCustomEvent(nativeEvent);
			case "keypress":
				if (32 !== nativeEvent.which) return null;
				hasSpaceKeypress = !0;
				return SPACEBAR_CHAR;
			case "textInput": return domEventName = nativeEvent.data, domEventName === SPACEBAR_CHAR && hasSpaceKeypress ? null : domEventName;
			default: return null;
		}
	}
	function getFallbackBeforeInputChars(domEventName, nativeEvent) {
		if (isComposing) return "compositionend" === domEventName || !canUseCompositionEvent && isFallbackCompositionEnd(domEventName, nativeEvent) ? (domEventName = getData(), fallbackText = startText = root = null, isComposing = !1, domEventName) : null;
		switch (domEventName) {
			case "paste": return null;
			case "keypress":
				if (!(nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) || nativeEvent.ctrlKey && nativeEvent.altKey) {
					if (nativeEvent.char && 1 < nativeEvent.char.length) return nativeEvent.char;
					if (nativeEvent.which) return String.fromCharCode(nativeEvent.which);
				}
				return null;
			case "compositionend": return useFallbackCompositionData && "ko" !== nativeEvent.locale ? null : nativeEvent.data;
			default: return null;
		}
	}
	var supportedInputTypes = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function isTextInputElement(elem) {
		var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
		return "input" === nodeName ? !!supportedInputTypes[elem.type] : "textarea" === nodeName ? !0 : !1;
	}
	function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
		restoreTarget ? restoreQueue ? restoreQueue.push(target) : restoreQueue = [target] : restoreTarget = target;
		inst = accumulateTwoPhaseListeners(inst, "onChange");
		0 < inst.length && (nativeEvent = new SyntheticEvent("onChange", "change", null, nativeEvent, target), dispatchQueue.push({
			event: nativeEvent,
			listeners: inst
		}));
	}
	var activeElement$1 = null, activeElementInst$1 = null;
	function runEventInBatch(dispatchQueue) {
		processDispatchQueue(dispatchQueue, 0);
	}
	function getInstIfValueChanged(targetInst) {
		if (updateValueIfChanged(getNodeFromInstance(targetInst))) return targetInst;
	}
	function getTargetInstForChangeEvent(domEventName, targetInst) {
		if ("change" === domEventName) return targetInst;
	}
	var isInputEventSupported = !1;
	if (canUseDOM) {
		var JSCompiler_inline_result$jscomp$286;
		if (canUseDOM) {
			var isSupported$jscomp$inline_427 = "oninput" in document;
			if (!isSupported$jscomp$inline_427) {
				var element$jscomp$inline_428 = document.createElement("div");
				element$jscomp$inline_428.setAttribute("oninput", "return;");
				isSupported$jscomp$inline_427 = "function" === typeof element$jscomp$inline_428.oninput;
			}
			JSCompiler_inline_result$jscomp$286 = isSupported$jscomp$inline_427;
		} else JSCompiler_inline_result$jscomp$286 = !1;
		isInputEventSupported = JSCompiler_inline_result$jscomp$286 && (!document.documentMode || 9 < document.documentMode);
	}
	function stopWatchingForValueChange() {
		activeElement$1 && (activeElement$1.detachEvent("onpropertychange", handlePropertyChange), activeElementInst$1 = activeElement$1 = null);
	}
	function handlePropertyChange(nativeEvent) {
		if ("value" === nativeEvent.propertyName && getInstIfValueChanged(activeElementInst$1)) {
			var dispatchQueue = [];
			createAndAccumulateChangeEvent(dispatchQueue, activeElementInst$1, nativeEvent, getEventTarget(nativeEvent));
			batchedUpdates$1(runEventInBatch, dispatchQueue);
		}
	}
	function handleEventsForInputEventPolyfill(domEventName, target, targetInst) {
		"focusin" === domEventName ? (stopWatchingForValueChange(), activeElement$1 = target, activeElementInst$1 = targetInst, activeElement$1.attachEvent("onpropertychange", handlePropertyChange)) : "focusout" === domEventName && stopWatchingForValueChange();
	}
	function getTargetInstForInputEventPolyfill(domEventName) {
		if ("selectionchange" === domEventName || "keyup" === domEventName || "keydown" === domEventName) return getInstIfValueChanged(activeElementInst$1);
	}
	function getTargetInstForClickEvent(domEventName, targetInst) {
		if ("click" === domEventName) return getInstIfValueChanged(targetInst);
	}
	function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
		if ("input" === domEventName || "change" === domEventName) return getInstIfValueChanged(targetInst);
	}
	function is(x, y) {
		return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
	}
	var objectIs = "function" === typeof Object.is ? Object.is : is;
	function shallowEqual(objA, objB) {
		if (objectIs(objA, objB)) return !0;
		if ("object" !== typeof objA || null === objA || "object" !== typeof objB || null === objB) return !1;
		var keysA = Object.keys(objA), keysB = Object.keys(objB);
		if (keysA.length !== keysB.length) return !1;
		for (keysB = 0; keysB < keysA.length; keysB++) {
			var currentKey = keysA[keysB];
			if (!hasOwnProperty.call(objB, currentKey) || !objectIs(objA[currentKey], objB[currentKey])) return !1;
		}
		return !0;
	}
	function getLeafNode(node) {
		for (; node && node.firstChild;) node = node.firstChild;
		return node;
	}
	function getNodeForCharacterOffset(root, offset) {
		var node = getLeafNode(root);
		root = 0;
		for (var nodeEnd; node;) {
			if (3 === node.nodeType) {
				nodeEnd = root + node.textContent.length;
				if (root <= offset && nodeEnd >= offset) return {
					node,
					offset: offset - root
				};
				root = nodeEnd;
			}
			a: {
				for (; node;) {
					if (node.nextSibling) {
						node = node.nextSibling;
						break a;
					}
					node = node.parentNode;
				}
				node = void 0;
			}
			node = getLeafNode(node);
		}
	}
	function containsNode(outerNode, innerNode) {
		return outerNode && innerNode ? outerNode === innerNode ? !0 : outerNode && 3 === outerNode.nodeType ? !1 : innerNode && 3 === innerNode.nodeType ? containsNode(outerNode, innerNode.parentNode) : "contains" in outerNode ? outerNode.contains(innerNode) : outerNode.compareDocumentPosition ? !!(outerNode.compareDocumentPosition(innerNode) & 16) : !1 : !1;
	}
	function getActiveElementDeep(containerInfo) {
		containerInfo = null != containerInfo && null != containerInfo.ownerDocument && null != containerInfo.ownerDocument.defaultView ? containerInfo.ownerDocument.defaultView : window;
		for (var element = getActiveElement(containerInfo.document); element instanceof containerInfo.HTMLIFrameElement;) {
			try {
				var JSCompiler_inline_result = "string" === typeof element.contentWindow.location.href;
			} catch (err) {
				JSCompiler_inline_result = !1;
			}
			if (JSCompiler_inline_result) containerInfo = element.contentWindow;
			else break;
			element = getActiveElement(containerInfo.document);
		}
		return element;
	}
	function hasSelectionCapabilities(elem) {
		var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
		return nodeName && ("input" === nodeName && ("text" === elem.type || "search" === elem.type || "tel" === elem.type || "url" === elem.type || "password" === elem.type) || "textarea" === nodeName || "true" === elem.contentEditable);
	}
	var skipSelectionChangeEvent = canUseDOM && "documentMode" in document && 11 >= document.documentMode, activeElement = null, activeElementInst = null, lastSelection = null, mouseDown = !1;
	function constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget) {
		var doc = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget.document : 9 === nativeEventTarget.nodeType ? nativeEventTarget : nativeEventTarget.ownerDocument;
		mouseDown || null == activeElement || activeElement !== getActiveElement(doc) || (doc = activeElement, "selectionStart" in doc && hasSelectionCapabilities(doc) ? doc = {
			start: doc.selectionStart,
			end: doc.selectionEnd
		} : (doc = (doc.ownerDocument && doc.ownerDocument.defaultView || window).getSelection(), doc = {
			anchorNode: doc.anchorNode,
			anchorOffset: doc.anchorOffset,
			focusNode: doc.focusNode,
			focusOffset: doc.focusOffset
		}), lastSelection && shallowEqual(lastSelection, doc) || (lastSelection = doc, doc = accumulateTwoPhaseListeners(activeElementInst, "onSelect"), 0 < doc.length && (nativeEvent = new SyntheticEvent("onSelect", "select", null, nativeEvent, nativeEventTarget), dispatchQueue.push({
			event: nativeEvent,
			listeners: doc
		}), nativeEvent.target = activeElement)));
	}
	function makePrefixMap(styleProp, eventName) {
		var prefixes = {};
		prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
		prefixes["Webkit" + styleProp] = "webkit" + eventName;
		prefixes["Moz" + styleProp] = "moz" + eventName;
		return prefixes;
	}
	var vendorPrefixes = {
		animationend: makePrefixMap("Animation", "AnimationEnd"),
		animationiteration: makePrefixMap("Animation", "AnimationIteration"),
		animationstart: makePrefixMap("Animation", "AnimationStart"),
		transitionrun: makePrefixMap("Transition", "TransitionRun"),
		transitionstart: makePrefixMap("Transition", "TransitionStart"),
		transitioncancel: makePrefixMap("Transition", "TransitionCancel"),
		transitionend: makePrefixMap("Transition", "TransitionEnd")
	}, prefixedEventNames = {}, style = {};
	canUseDOM && (style = document.createElement("div").style, "AnimationEvent" in window || (delete vendorPrefixes.animationend.animation, delete vendorPrefixes.animationiteration.animation, delete vendorPrefixes.animationstart.animation), "TransitionEvent" in window || delete vendorPrefixes.transitionend.transition);
	function getVendorPrefixedEventName(eventName) {
		if (prefixedEventNames[eventName]) return prefixedEventNames[eventName];
		if (!vendorPrefixes[eventName]) return eventName;
		var prefixMap = vendorPrefixes[eventName], styleProp;
		for (styleProp in prefixMap) if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) return prefixedEventNames[eventName] = prefixMap[styleProp];
		return eventName;
	}
	var ANIMATION_END = getVendorPrefixedEventName("animationend"), ANIMATION_ITERATION = getVendorPrefixedEventName("animationiteration"), ANIMATION_START = getVendorPrefixedEventName("animationstart"), TRANSITION_RUN = getVendorPrefixedEventName("transitionrun"), TRANSITION_START = getVendorPrefixedEventName("transitionstart"), TRANSITION_CANCEL = getVendorPrefixedEventName("transitioncancel"), TRANSITION_END = getVendorPrefixedEventName("transitionend"), topLevelEventsToReactNames = /* @__PURE__ */ new Map(), simpleEventPluginEvents = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	simpleEventPluginEvents.push("scrollEnd");
	function registerSimpleEvent(domEventName, reactName) {
		topLevelEventsToReactNames.set(domEventName, reactName);
		registerTwoPhaseEvent(reactName, [domEventName]);
	}
	var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
		if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
			var event = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
				error
			});
			if (!window.dispatchEvent(event)) return;
		} else if ("object" === typeof process && "function" === typeof process.emit) {
			process.emit("uncaughtException", error);
			return;
		}
		console.error(error);
	}, concurrentQueues = [], concurrentQueuesIndex = 0, concurrentlyUpdatedLanes = 0;
	function finishQueueingConcurrentUpdates() {
		for (var endIndex = concurrentQueuesIndex, i = concurrentlyUpdatedLanes = concurrentQueuesIndex = 0; i < endIndex;) {
			var fiber = concurrentQueues[i];
			concurrentQueues[i++] = null;
			var queue = concurrentQueues[i];
			concurrentQueues[i++] = null;
			var update = concurrentQueues[i];
			concurrentQueues[i++] = null;
			var lane = concurrentQueues[i];
			concurrentQueues[i++] = null;
			if (null !== queue && null !== update) {
				var pending = queue.pending;
				null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
				queue.pending = update;
			}
			0 !== lane && markUpdateLaneFromFiberToRoot(fiber, update, lane);
		}
	}
	function enqueueUpdate$1(fiber, queue, update, lane) {
		concurrentQueues[concurrentQueuesIndex++] = fiber;
		concurrentQueues[concurrentQueuesIndex++] = queue;
		concurrentQueues[concurrentQueuesIndex++] = update;
		concurrentQueues[concurrentQueuesIndex++] = lane;
		concurrentlyUpdatedLanes |= lane;
		fiber.lanes |= lane;
		fiber = fiber.alternate;
		null !== fiber && (fiber.lanes |= lane);
	}
	function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
		enqueueUpdate$1(fiber, queue, update, lane);
		return getRootForUpdatedFiber(fiber);
	}
	function enqueueConcurrentRenderForLane(fiber, lane) {
		enqueueUpdate$1(fiber, null, null, lane);
		return getRootForUpdatedFiber(fiber);
	}
	function markUpdateLaneFromFiberToRoot(sourceFiber, update, lane) {
		sourceFiber.lanes |= lane;
		var alternate = sourceFiber.alternate;
		null !== alternate && (alternate.lanes |= lane);
		for (var isHidden = !1, parent = sourceFiber.return; null !== parent;) parent.childLanes |= lane, alternate = parent.alternate, null !== alternate && (alternate.childLanes |= lane), 22 === parent.tag && (sourceFiber = parent.stateNode, null === sourceFiber || sourceFiber._visibility & 1 || (isHidden = !0)), sourceFiber = parent, parent = parent.return;
		return 3 === sourceFiber.tag ? (parent = sourceFiber.stateNode, isHidden && null !== update && (isHidden = 31 - clz32(lane), sourceFiber = parent.hiddenUpdates, alternate = sourceFiber[isHidden], null === alternate ? sourceFiber[isHidden] = [update] : alternate.push(update), update.lane = lane | 536870912), parent) : null;
	}
	function getRootForUpdatedFiber(sourceFiber) {
		if (50 < nestedUpdateCount) throw nestedUpdateCount = 0, rootWithNestedUpdates = null, Error(formatProdErrorMessage(185));
		for (var parent = sourceFiber.return; null !== parent;) sourceFiber = parent, parent = sourceFiber.return;
		return 3 === sourceFiber.tag ? sourceFiber.stateNode : null;
	}
	var emptyContextObject = {};
	function FiberNode(tag, pendingProps, key, mode) {
		this.tag = tag;
		this.key = key;
		this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
		this.index = 0;
		this.refCleanup = this.ref = null;
		this.pendingProps = pendingProps;
		this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
		this.mode = mode;
		this.subtreeFlags = this.flags = 0;
		this.deletions = null;
		this.childLanes = this.lanes = 0;
		this.alternate = null;
	}
	function createFiberImplClass(tag, pendingProps, key, mode) {
		return new FiberNode(tag, pendingProps, key, mode);
	}
	function shouldConstruct(Component) {
		Component = Component.prototype;
		return !(!Component || !Component.isReactComponent);
	}
	function createWorkInProgress(current, pendingProps) {
		var workInProgress = current.alternate;
		null === workInProgress ? (workInProgress = createFiberImplClass(current.tag, pendingProps, current.key, current.mode), workInProgress.elementType = current.elementType, workInProgress.type = current.type, workInProgress.stateNode = current.stateNode, workInProgress.alternate = current, current.alternate = workInProgress) : (workInProgress.pendingProps = pendingProps, workInProgress.type = current.type, workInProgress.flags = 0, workInProgress.subtreeFlags = 0, workInProgress.deletions = null);
		workInProgress.flags = current.flags & 65011712;
		workInProgress.childLanes = current.childLanes;
		workInProgress.lanes = current.lanes;
		workInProgress.child = current.child;
		workInProgress.memoizedProps = current.memoizedProps;
		workInProgress.memoizedState = current.memoizedState;
		workInProgress.updateQueue = current.updateQueue;
		pendingProps = current.dependencies;
		workInProgress.dependencies = null === pendingProps ? null : {
			lanes: pendingProps.lanes,
			firstContext: pendingProps.firstContext
		};
		workInProgress.sibling = current.sibling;
		workInProgress.index = current.index;
		workInProgress.ref = current.ref;
		workInProgress.refCleanup = current.refCleanup;
		return workInProgress;
	}
	function resetWorkInProgress(workInProgress, renderLanes) {
		workInProgress.flags &= 65011714;
		var current = workInProgress.alternate;
		null === current ? (workInProgress.childLanes = 0, workInProgress.lanes = renderLanes, workInProgress.child = null, workInProgress.subtreeFlags = 0, workInProgress.memoizedProps = null, workInProgress.memoizedState = null, workInProgress.updateQueue = null, workInProgress.dependencies = null, workInProgress.stateNode = null) : (workInProgress.childLanes = current.childLanes, workInProgress.lanes = current.lanes, workInProgress.child = current.child, workInProgress.subtreeFlags = 0, workInProgress.deletions = null, workInProgress.memoizedProps = current.memoizedProps, workInProgress.memoizedState = current.memoizedState, workInProgress.updateQueue = current.updateQueue, workInProgress.type = current.type, renderLanes = current.dependencies, workInProgress.dependencies = null === renderLanes ? null : {
			lanes: renderLanes.lanes,
			firstContext: renderLanes.firstContext
		});
		return workInProgress;
	}
	function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes) {
		var fiberTag = 0;
		owner = type;
		if ("function" === typeof type) shouldConstruct(type) && (fiberTag = 1);
		else if ("string" === typeof type) fiberTag = isHostHoistableType(type, pendingProps, contextStackCursor.current) ? 26 : "html" === type || "head" === type || "body" === type ? 27 : 5;
		else a: switch (type) {
			case REACT_ACTIVITY_TYPE: return type = createFiberImplClass(31, pendingProps, key, mode), type.elementType = REACT_ACTIVITY_TYPE, type.lanes = lanes, type;
			case REACT_FRAGMENT_TYPE: return createFiberFromFragment(pendingProps.children, mode, lanes, key);
			case REACT_STRICT_MODE_TYPE:
				fiberTag = 8;
				mode |= 24;
				break;
			case REACT_PROFILER_TYPE: return type = createFiberImplClass(12, pendingProps, key, mode | 2), type.elementType = REACT_PROFILER_TYPE, type.lanes = lanes, type;
			case REACT_SUSPENSE_TYPE: return type = createFiberImplClass(13, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_TYPE, type.lanes = lanes, type;
			case REACT_SUSPENSE_LIST_TYPE: return type = createFiberImplClass(19, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_LIST_TYPE, type.lanes = lanes, type;
			default:
				if ("object" === typeof type && null !== type) switch (type.$$typeof) {
					case REACT_CONTEXT_TYPE:
						fiberTag = 10;
						break a;
					case REACT_CONSUMER_TYPE:
						fiberTag = 9;
						break a;
					case REACT_FORWARD_REF_TYPE:
						fiberTag = 11;
						break a;
					case REACT_MEMO_TYPE:
						fiberTag = 14;
						break a;
					case REACT_LAZY_TYPE:
						fiberTag = 16;
						owner = null;
						break a;
				}
				fiberTag = 29;
				pendingProps = Error(formatProdErrorMessage(130, null === type ? "null" : typeof type, ""));
				owner = null;
		}
		key = createFiberImplClass(fiberTag, pendingProps, key, mode);
		key.elementType = type;
		key.type = owner;
		key.lanes = lanes;
		return key;
	}
	function createFiberFromFragment(elements, mode, lanes, key) {
		elements = createFiberImplClass(7, elements, key, mode);
		elements.lanes = lanes;
		return elements;
	}
	function createFiberFromText(content, mode, lanes) {
		content = createFiberImplClass(6, content, null, mode);
		content.lanes = lanes;
		return content;
	}
	function createFiberFromDehydratedFragment(dehydratedNode) {
		var fiber = createFiberImplClass(18, null, null, 0);
		fiber.stateNode = dehydratedNode;
		return fiber;
	}
	function createFiberFromPortal(portal, mode, lanes) {
		mode = createFiberImplClass(4, null !== portal.children ? portal.children : [], portal.key, mode);
		mode.lanes = lanes;
		mode.stateNode = {
			containerInfo: portal.containerInfo,
			pendingChildren: null,
			implementation: portal.implementation
		};
		return mode;
	}
	var CapturedStacks = /* @__PURE__ */ new WeakMap();
	function createCapturedValueAtFiber(value, source) {
		if ("object" === typeof value && null !== value) {
			var existing = CapturedStacks.get(value);
			if (void 0 !== existing) return existing;
			source = {
				value,
				source,
				stack: getStackByFiberInDevAndProd(source)
			};
			CapturedStacks.set(value, source);
			return source;
		}
		return {
			value,
			source,
			stack: getStackByFiberInDevAndProd(source)
		};
	}
	var forkStack = [], forkStackIndex = 0, treeForkProvider = null, treeForkCount = 0, idStack = [], idStackIndex = 0, treeContextProvider = null, treeContextId = 1, treeContextOverflow = "";
	function pushTreeFork(workInProgress, totalChildren) {
		forkStack[forkStackIndex++] = treeForkCount;
		forkStack[forkStackIndex++] = treeForkProvider;
		treeForkProvider = workInProgress;
		treeForkCount = totalChildren;
	}
	function pushTreeId(workInProgress, totalChildren, index) {
		idStack[idStackIndex++] = treeContextId;
		idStack[idStackIndex++] = treeContextOverflow;
		idStack[idStackIndex++] = treeContextProvider;
		treeContextProvider = workInProgress;
		var baseIdWithLeadingBit = treeContextId;
		workInProgress = treeContextOverflow;
		var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
		baseIdWithLeadingBit &= ~(1 << baseLength);
		index += 1;
		var length = 32 - clz32(totalChildren) + baseLength;
		if (30 < length) {
			var numberOfOverflowBits = baseLength - baseLength % 5;
			length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
			baseIdWithLeadingBit >>= numberOfOverflowBits;
			baseLength -= numberOfOverflowBits;
			treeContextId = 1 << 32 - clz32(totalChildren) + baseLength | index << baseLength | baseIdWithLeadingBit;
			treeContextOverflow = length + workInProgress;
		} else treeContextId = 1 << length | index << baseLength | baseIdWithLeadingBit, treeContextOverflow = workInProgress;
	}
	function pushMaterializedTreeId(workInProgress) {
		null !== workInProgress.return && (pushTreeFork(workInProgress, 1), pushTreeId(workInProgress, 1, 0));
	}
	function popTreeContext(workInProgress) {
		for (; workInProgress === treeForkProvider;) treeForkProvider = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null, treeForkCount = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null;
		for (; workInProgress === treeContextProvider;) treeContextProvider = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextOverflow = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextId = idStack[--idStackIndex], idStack[idStackIndex] = null;
	}
	function restoreSuspendedTreeContext(workInProgress, suspendedContext) {
		idStack[idStackIndex++] = treeContextId;
		idStack[idStackIndex++] = treeContextOverflow;
		idStack[idStackIndex++] = treeContextProvider;
		treeContextId = suspendedContext.id;
		treeContextOverflow = suspendedContext.overflow;
		treeContextProvider = workInProgress;
	}
	var hydrationParentFiber = null, nextHydratableInstance = null, isHydrating = !1, hydrationErrors = null, rootOrSingletonContext = !1, HydrationMismatchException = Error(formatProdErrorMessage(519));
	function throwOnHydrationMismatch(fiber) {
		queueHydrationError(createCapturedValueAtFiber(Error(formatProdErrorMessage(418, 1 < arguments.length && void 0 !== arguments[1] && arguments[1] ? "text" : "HTML", "")), fiber));
		throw HydrationMismatchException;
	}
	function prepareToHydrateHostInstance(fiber) {
		var instance = fiber.stateNode, type = fiber.type, props = fiber.memoizedProps;
		instance[internalInstanceKey] = fiber;
		instance[internalPropsKey] = props;
		switch (type) {
			case "dialog":
				listenToNonDelegatedEvent("cancel", instance);
				listenToNonDelegatedEvent("close", instance);
				break;
			case "iframe":
			case "object":
			case "embed":
				listenToNonDelegatedEvent("load", instance);
				break;
			case "video":
			case "audio":
				for (type = 0; type < mediaEventTypes.length; type++) listenToNonDelegatedEvent(mediaEventTypes[type], instance);
				break;
			case "source":
				listenToNonDelegatedEvent("error", instance);
				break;
			case "img":
			case "image":
			case "link":
				listenToNonDelegatedEvent("error", instance);
				listenToNonDelegatedEvent("load", instance);
				break;
			case "details":
				listenToNonDelegatedEvent("toggle", instance);
				break;
			case "input":
				listenToNonDelegatedEvent("invalid", instance);
				initInput(instance, props.value, props.defaultValue, props.checked, props.defaultChecked, props.type, props.name, !0);
				break;
			case "select":
				listenToNonDelegatedEvent("invalid", instance);
				break;
			case "textarea": listenToNonDelegatedEvent("invalid", instance), initTextarea(instance, props.value, props.defaultValue, props.children);
		}
		type = props.children;
		"string" !== typeof type && "number" !== typeof type && "bigint" !== typeof type || instance.textContent === "" + type || !0 === props.suppressHydrationWarning || checkForUnmatchedText(instance.textContent, type) ? (null != props.popover && (listenToNonDelegatedEvent("beforetoggle", instance), listenToNonDelegatedEvent("toggle", instance)), null != props.onScroll && listenToNonDelegatedEvent("scroll", instance), null != props.onScrollEnd && listenToNonDelegatedEvent("scrollend", instance), null != props.onClick && (instance.onclick = noop$1), instance = !0) : instance = !1;
		instance || throwOnHydrationMismatch(fiber, !0);
	}
	function popToNextHostParent(fiber) {
		for (hydrationParentFiber = fiber.return; hydrationParentFiber;) switch (hydrationParentFiber.tag) {
			case 5:
			case 31:
			case 13:
				rootOrSingletonContext = !1;
				return;
			case 27:
			case 3:
				rootOrSingletonContext = !0;
				return;
			default: hydrationParentFiber = hydrationParentFiber.return;
		}
	}
	function popHydrationState(fiber) {
		if (fiber !== hydrationParentFiber) return !1;
		if (!isHydrating) return popToNextHostParent(fiber), isHydrating = !0, !1;
		var tag = fiber.tag, JSCompiler_temp;
		if (JSCompiler_temp = 3 !== tag && 27 !== tag) {
			if (JSCompiler_temp = 5 === tag) JSCompiler_temp = fiber.type, JSCompiler_temp = !("form" !== JSCompiler_temp && "button" !== JSCompiler_temp) || shouldSetTextContent(fiber.type, fiber.memoizedProps);
			JSCompiler_temp = !JSCompiler_temp;
		}
		JSCompiler_temp && nextHydratableInstance && throwOnHydrationMismatch(fiber);
		popToNextHostParent(fiber);
		if (13 === tag) {
			fiber = fiber.memoizedState;
			fiber = null !== fiber ? fiber.dehydrated : null;
			if (!fiber) throw Error(formatProdErrorMessage(317));
			nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
		} else if (31 === tag) {
			fiber = fiber.memoizedState;
			fiber = null !== fiber ? fiber.dehydrated : null;
			if (!fiber) throw Error(formatProdErrorMessage(317));
			nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
		} else 27 === tag ? (tag = nextHydratableInstance, isSingletonScope(fiber.type) ? (fiber = previousHydratableOnEnteringScopedSingleton, previousHydratableOnEnteringScopedSingleton = null, nextHydratableInstance = fiber) : nextHydratableInstance = tag) : nextHydratableInstance = hydrationParentFiber ? getNextHydratable(fiber.stateNode.nextSibling) : null;
		return !0;
	}
	function resetHydrationState() {
		nextHydratableInstance = hydrationParentFiber = null;
		isHydrating = !1;
	}
	function upgradeHydrationErrorsToRecoverable() {
		var queuedErrors = hydrationErrors;
		null !== queuedErrors && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = queuedErrors : workInProgressRootRecoverableErrors.push.apply(workInProgressRootRecoverableErrors, queuedErrors), hydrationErrors = null);
		return queuedErrors;
	}
	function queueHydrationError(error) {
		null === hydrationErrors ? hydrationErrors = [error] : hydrationErrors.push(error);
	}
	var valueCursor = createCursor(null), currentlyRenderingFiber$1 = null, lastContextDependency = null;
	function pushProvider(providerFiber, context, nextValue) {
		push(valueCursor, context._currentValue);
		context._currentValue = nextValue;
	}
	function popProvider(context) {
		context._currentValue = valueCursor.current;
		pop(valueCursor);
	}
	function scheduleContextWorkOnParentPath(parent, renderLanes, propagationRoot) {
		for (; null !== parent;) {
			var alternate = parent.alternate;
			(parent.childLanes & renderLanes) !== renderLanes ? (parent.childLanes |= renderLanes, null !== alternate && (alternate.childLanes |= renderLanes)) : null !== alternate && (alternate.childLanes & renderLanes) !== renderLanes && (alternate.childLanes |= renderLanes);
			if (parent === propagationRoot) break;
			parent = parent.return;
		}
	}
	function propagateContextChanges(workInProgress, contexts, renderLanes, forcePropagateEntireTree) {
		var fiber = workInProgress.child;
		null !== fiber && (fiber.return = workInProgress);
		for (; null !== fiber;) {
			var list = fiber.dependencies;
			if (null !== list) {
				var nextFiber = fiber.child;
				list = list.firstContext;
				a: for (; null !== list;) {
					var dependency = list;
					list = fiber;
					for (var i = 0; i < contexts.length; i++) if (dependency.context === contexts[i]) {
						list.lanes |= renderLanes;
						dependency = list.alternate;
						null !== dependency && (dependency.lanes |= renderLanes);
						scheduleContextWorkOnParentPath(list.return, renderLanes, workInProgress);
						forcePropagateEntireTree || (nextFiber = null);
						break a;
					}
					list = dependency.next;
				}
			} else if (18 === fiber.tag) {
				nextFiber = fiber.return;
				if (null === nextFiber) throw Error(formatProdErrorMessage(341));
				nextFiber.lanes |= renderLanes;
				list = nextFiber.alternate;
				null !== list && (list.lanes |= renderLanes);
				scheduleContextWorkOnParentPath(nextFiber, renderLanes, workInProgress);
				nextFiber = null;
			} else nextFiber = fiber.child;
			if (null !== nextFiber) nextFiber.return = fiber;
			else for (nextFiber = fiber; null !== nextFiber;) {
				if (nextFiber === workInProgress) {
					nextFiber = null;
					break;
				}
				fiber = nextFiber.sibling;
				if (null !== fiber) {
					fiber.return = nextFiber.return;
					nextFiber = fiber;
					break;
				}
				nextFiber = nextFiber.return;
			}
			fiber = nextFiber;
		}
	}
	function propagateParentContextChanges(current, workInProgress, renderLanes, forcePropagateEntireTree) {
		current = null;
		for (var parent = workInProgress, isInsidePropagationBailout = !1; null !== parent;) {
			if (!isInsidePropagationBailout) {
				if (0 !== (parent.flags & 524288)) isInsidePropagationBailout = !0;
				else if (0 !== (parent.flags & 262144)) break;
			}
			if (10 === parent.tag) {
				var currentParent = parent.alternate;
				if (null === currentParent) throw Error(formatProdErrorMessage(387));
				currentParent = currentParent.memoizedProps;
				if (null !== currentParent) {
					var context = parent.type;
					objectIs(parent.pendingProps.value, currentParent.value) || (null !== current ? current.push(context) : current = [context]);
				}
			} else if (parent === hostTransitionProviderCursor.current) {
				currentParent = parent.alternate;
				if (null === currentParent) throw Error(formatProdErrorMessage(387));
				currentParent.memoizedState.memoizedState !== parent.memoizedState.memoizedState && (null !== current ? current.push(HostTransitionContext) : current = [HostTransitionContext]);
			}
			parent = parent.return;
		}
		null !== current && propagateContextChanges(workInProgress, current, renderLanes, forcePropagateEntireTree);
		workInProgress.flags |= 262144;
	}
	function checkIfContextChanged(currentDependencies) {
		for (currentDependencies = currentDependencies.firstContext; null !== currentDependencies;) {
			if (!objectIs(currentDependencies.context._currentValue, currentDependencies.memoizedValue)) return !0;
			currentDependencies = currentDependencies.next;
		}
		return !1;
	}
	function prepareToReadContext(workInProgress) {
		currentlyRenderingFiber$1 = workInProgress;
		lastContextDependency = null;
		workInProgress = workInProgress.dependencies;
		null !== workInProgress && (workInProgress.firstContext = null);
	}
	function readContext(context) {
		return readContextForConsumer(currentlyRenderingFiber$1, context);
	}
	function readContextDuringReconciliation(consumer, context) {
		null === currentlyRenderingFiber$1 && prepareToReadContext(consumer);
		return readContextForConsumer(consumer, context);
	}
	function readContextForConsumer(consumer, context) {
		var value = context._currentValue;
		context = {
			context,
			memoizedValue: value,
			next: null
		};
		if (null === lastContextDependency) {
			if (null === consumer) throw Error(formatProdErrorMessage(308));
			lastContextDependency = context;
			consumer.dependencies = {
				lanes: 0,
				firstContext: context
			};
			consumer.flags |= 524288;
		} else lastContextDependency = lastContextDependency.next = context;
		return value;
	}
	var AbortControllerLocal = "undefined" !== typeof AbortController ? AbortController : function() {
		var listeners = [], signal = this.signal = {
			aborted: !1,
			addEventListener: function(type, listener) {
				listeners.push(listener);
			}
		};
		this.abort = function() {
			signal.aborted = !0;
			listeners.forEach(function(listener) {
				return listener();
			});
		};
	}, scheduleCallback$2 = Scheduler.unstable_scheduleCallback, NormalPriority = Scheduler.unstable_NormalPriority, CacheContext = {
		$$typeof: REACT_CONTEXT_TYPE,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function createCache() {
		return {
			controller: new AbortControllerLocal(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function releaseCache(cache) {
		cache.refCount--;
		0 === cache.refCount && scheduleCallback$2(NormalPriority, function() {
			cache.controller.abort();
		});
	}
	var currentEntangledListeners = null, currentEntangledPendingCount = 0, currentEntangledLane = 0, currentEntangledActionThenable = null;
	function entangleAsyncAction(transition, thenable) {
		if (null === currentEntangledListeners) {
			var entangledListeners = currentEntangledListeners = [];
			currentEntangledPendingCount = 0;
			currentEntangledLane = requestTransitionLane();
			currentEntangledActionThenable = {
				status: "pending",
				value: void 0,
				then: function(resolve) {
					entangledListeners.push(resolve);
				}
			};
		}
		currentEntangledPendingCount++;
		thenable.then(pingEngtangledActionScope, pingEngtangledActionScope);
		return thenable;
	}
	function pingEngtangledActionScope() {
		if (0 === --currentEntangledPendingCount && null !== currentEntangledListeners) {
			null !== currentEntangledActionThenable && (currentEntangledActionThenable.status = "fulfilled");
			var listeners = currentEntangledListeners;
			currentEntangledListeners = null;
			currentEntangledLane = 0;
			currentEntangledActionThenable = null;
			for (var i = 0; i < listeners.length; i++) (0, listeners[i])();
		}
	}
	function chainThenableValue(thenable, result) {
		var listeners = [], thenableWithOverride = {
			status: "pending",
			value: null,
			reason: null,
			then: function(resolve) {
				listeners.push(resolve);
			}
		};
		thenable.then(function() {
			thenableWithOverride.status = "fulfilled";
			thenableWithOverride.value = result;
			for (var i = 0; i < listeners.length; i++) (0, listeners[i])(result);
		}, function(error) {
			thenableWithOverride.status = "rejected";
			thenableWithOverride.reason = error;
			for (error = 0; error < listeners.length; error++) (0, listeners[error])(void 0);
		});
		return thenableWithOverride;
	}
	var prevOnStartTransitionFinish = ReactSharedInternals.S;
	ReactSharedInternals.S = function(transition, returnValue) {
		globalMostRecentTransitionTime = now();
		"object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && entangleAsyncAction(transition, returnValue);
		null !== prevOnStartTransitionFinish && prevOnStartTransitionFinish(transition, returnValue);
	};
	var resumedCache = createCursor(null);
	function peekCacheFromPool() {
		var cacheResumedFromPreviousRender = resumedCache.current;
		return null !== cacheResumedFromPreviousRender ? cacheResumedFromPreviousRender : workInProgressRoot.pooledCache;
	}
	function pushTransition(offscreenWorkInProgress, prevCachePool) {
		null === prevCachePool ? push(resumedCache, resumedCache.current) : push(resumedCache, prevCachePool.pool);
	}
	function getSuspendedCache() {
		var cacheFromPool = peekCacheFromPool();
		return null === cacheFromPool ? null : {
			parent: CacheContext._currentValue,
			pool: cacheFromPool
		};
	}
	var SuspenseException = Error(formatProdErrorMessage(460)), SuspenseyCommitException = Error(formatProdErrorMessage(474)), SuspenseActionException = Error(formatProdErrorMessage(542)), noopSuspenseyCommitThenable = { then: function() {} };
	function isThenableResolved(thenable) {
		thenable = thenable.status;
		return "fulfilled" === thenable || "rejected" === thenable;
	}
	function trackUsedThenable(thenableState, thenable, index) {
		index = thenableState[index];
		void 0 === index ? thenableState.push(thenable) : index !== thenable && (thenable.then(noop$1, noop$1), thenable = index);
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenableState = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState), thenableState;
			default:
				if ("string" === typeof thenable.status) thenable.then(noop$1, noop$1);
				else {
					thenableState = workInProgressRoot;
					if (null !== thenableState && 100 < thenableState.shellSuspendCounter) throw Error(formatProdErrorMessage(482));
					thenableState = thenable;
					thenableState.status = "pending";
					thenableState.then(function(fulfilledValue) {
						if ("pending" === thenable.status) {
							var fulfilledThenable = thenable;
							fulfilledThenable.status = "fulfilled";
							fulfilledThenable.value = fulfilledValue;
						}
					}, function(error) {
						if ("pending" === thenable.status) {
							var rejectedThenable = thenable;
							rejectedThenable.status = "rejected";
							rejectedThenable.reason = error;
						}
					});
				}
				switch (thenable.status) {
					case "fulfilled": return thenable.value;
					case "rejected": throw thenableState = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState), thenableState;
				}
				suspendedThenable = thenable;
				throw SuspenseException;
		}
	}
	function resolveLazy(lazyType) {
		try {
			var init = lazyType._init;
			return init(lazyType._payload);
		} catch (x) {
			if (null !== x && "object" === typeof x && "function" === typeof x.then) throw suspendedThenable = x, SuspenseException;
			throw x;
		}
	}
	var suspendedThenable = null;
	function getSuspendedThenable() {
		if (null === suspendedThenable) throw Error(formatProdErrorMessage(459));
		var thenable = suspendedThenable;
		suspendedThenable = null;
		return thenable;
	}
	function checkIfUseWrappedInAsyncCatch(rejectedReason) {
		if (rejectedReason === SuspenseException || rejectedReason === SuspenseActionException) throw Error(formatProdErrorMessage(483));
	}
	var thenableState$1 = null, thenableIndexCounter$1 = 0;
	function unwrapThenable(thenable) {
		var index = thenableIndexCounter$1;
		thenableIndexCounter$1 += 1;
		null === thenableState$1 && (thenableState$1 = []);
		return trackUsedThenable(thenableState$1, thenable, index);
	}
	function coerceRef(workInProgress, element) {
		element = element.props.ref;
		workInProgress.ref = void 0 !== element ? element : null;
	}
	function throwOnInvalidObjectTypeImpl(returnFiber, newChild) {
		if (newChild.$$typeof === REACT_LEGACY_ELEMENT_TYPE) throw Error(formatProdErrorMessage(525));
		returnFiber = Object.prototype.toString.call(newChild);
		throw Error(formatProdErrorMessage(31, "[object Object]" === returnFiber ? "object with keys {" + Object.keys(newChild).join(", ") + "}" : returnFiber));
	}
	function createChildReconciler(shouldTrackSideEffects) {
		function deleteChild(returnFiber, childToDelete) {
			if (shouldTrackSideEffects) {
				var deletions = returnFiber.deletions;
				null === deletions ? (returnFiber.deletions = [childToDelete], returnFiber.flags |= 16) : deletions.push(childToDelete);
			}
		}
		function deleteRemainingChildren(returnFiber, currentFirstChild) {
			if (!shouldTrackSideEffects) return null;
			for (; null !== currentFirstChild;) deleteChild(returnFiber, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
			return null;
		}
		function mapRemainingChildren(currentFirstChild) {
			for (var existingChildren = /* @__PURE__ */ new Map(); null !== currentFirstChild;) null !== currentFirstChild.key ? existingChildren.set(currentFirstChild.key, currentFirstChild) : existingChildren.set(currentFirstChild.index, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
			return existingChildren;
		}
		function useFiber(fiber, pendingProps) {
			fiber = createWorkInProgress(fiber, pendingProps);
			fiber.index = 0;
			fiber.sibling = null;
			return fiber;
		}
		function placeChild(newFiber, lastPlacedIndex, newIndex) {
			newFiber.index = newIndex;
			if (!shouldTrackSideEffects) return newFiber.flags |= 1048576, lastPlacedIndex;
			newIndex = newFiber.alternate;
			if (null !== newIndex) return newIndex = newIndex.index, newIndex < lastPlacedIndex ? (newFiber.flags |= 67108866, lastPlacedIndex) : newIndex;
			newFiber.flags |= 67108866;
			return lastPlacedIndex;
		}
		function placeSingleChild(newFiber) {
			shouldTrackSideEffects && null === newFiber.alternate && (newFiber.flags |= 67108866);
			return newFiber;
		}
		function updateTextNode(returnFiber, current, textContent, lanes) {
			if (null === current || 6 !== current.tag) return current = createFiberFromText(textContent, returnFiber.mode, lanes), current.return = returnFiber, current;
			current = useFiber(current, textContent);
			current.return = returnFiber;
			return current;
		}
		function updateElement(returnFiber, current, element, lanes) {
			var elementType = element.type;
			if (elementType === REACT_FRAGMENT_TYPE) return updateFragment(returnFiber, current, element.props.children, lanes, element.key);
			if (null !== current && (current.elementType === elementType || "object" === typeof elementType && null !== elementType && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === current.type)) return current = useFiber(current, element.props), coerceRef(current, element), current.return = returnFiber, current;
			current = createFiberFromTypeAndProps(element.type, element.key, element.props, null, returnFiber.mode, lanes);
			coerceRef(current, element);
			current.return = returnFiber;
			return current;
		}
		function updatePortal(returnFiber, current, portal, lanes) {
			if (null === current || 4 !== current.tag || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation) return current = createFiberFromPortal(portal, returnFiber.mode, lanes), current.return = returnFiber, current;
			current = useFiber(current, portal.children || []);
			current.return = returnFiber;
			return current;
		}
		function updateFragment(returnFiber, current, fragment, lanes, key) {
			if (null === current || 7 !== current.tag) return current = createFiberFromFragment(fragment, returnFiber.mode, lanes, key), current.return = returnFiber, current;
			current = useFiber(current, fragment);
			current.return = returnFiber;
			return current;
		}
		function createChild(returnFiber, newChild, lanes) {
			if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild) return newChild = createFiberFromText("" + newChild, returnFiber.mode, lanes), newChild.return = returnFiber, newChild;
			if ("object" === typeof newChild && null !== newChild) {
				switch (newChild.$$typeof) {
					case REACT_ELEMENT_TYPE: return lanes = createFiberFromTypeAndProps(newChild.type, newChild.key, newChild.props, null, returnFiber.mode, lanes), coerceRef(lanes, newChild), lanes.return = returnFiber, lanes;
					case REACT_PORTAL_TYPE: return newChild = createFiberFromPortal(newChild, returnFiber.mode, lanes), newChild.return = returnFiber, newChild;
					case REACT_LAZY_TYPE: return newChild = resolveLazy(newChild), createChild(returnFiber, newChild, lanes);
				}
				if (isArrayImpl(newChild) || getIteratorFn(newChild)) return newChild = createFiberFromFragment(newChild, returnFiber.mode, lanes, null), newChild.return = returnFiber, newChild;
				if ("function" === typeof newChild.then) return createChild(returnFiber, unwrapThenable(newChild), lanes);
				if (newChild.$$typeof === REACT_CONTEXT_TYPE) return createChild(returnFiber, readContextDuringReconciliation(returnFiber, newChild), lanes);
				throwOnInvalidObjectTypeImpl(returnFiber, newChild);
			}
			return null;
		}
		function updateSlot(returnFiber, oldFiber, newChild, lanes) {
			var key = null !== oldFiber ? oldFiber.key : null;
			if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild) return null !== key ? null : updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
			if ("object" === typeof newChild && null !== newChild) {
				switch (newChild.$$typeof) {
					case REACT_ELEMENT_TYPE: return newChild.key === key ? updateElement(returnFiber, oldFiber, newChild, lanes) : null;
					case REACT_PORTAL_TYPE: return newChild.key === key ? updatePortal(returnFiber, oldFiber, newChild, lanes) : null;
					case REACT_LAZY_TYPE: return newChild = resolveLazy(newChild), updateSlot(returnFiber, oldFiber, newChild, lanes);
				}
				if (isArrayImpl(newChild) || getIteratorFn(newChild)) return null !== key ? null : updateFragment(returnFiber, oldFiber, newChild, lanes, null);
				if ("function" === typeof newChild.then) return updateSlot(returnFiber, oldFiber, unwrapThenable(newChild), lanes);
				if (newChild.$$typeof === REACT_CONTEXT_TYPE) return updateSlot(returnFiber, oldFiber, readContextDuringReconciliation(returnFiber, newChild), lanes);
				throwOnInvalidObjectTypeImpl(returnFiber, newChild);
			}
			return null;
		}
		function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
			if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild) return existingChildren = existingChildren.get(newIdx) || null, updateTextNode(returnFiber, existingChildren, "" + newChild, lanes);
			if ("object" === typeof newChild && null !== newChild) {
				switch (newChild.$$typeof) {
					case REACT_ELEMENT_TYPE: return existingChildren = existingChildren.get(null === newChild.key ? newIdx : newChild.key) || null, updateElement(returnFiber, existingChildren, newChild, lanes);
					case REACT_PORTAL_TYPE: return existingChildren = existingChildren.get(null === newChild.key ? newIdx : newChild.key) || null, updatePortal(returnFiber, existingChildren, newChild, lanes);
					case REACT_LAZY_TYPE: return newChild = resolveLazy(newChild), updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes);
				}
				if (isArrayImpl(newChild) || getIteratorFn(newChild)) return existingChildren = existingChildren.get(newIdx) || null, updateFragment(returnFiber, existingChildren, newChild, lanes, null);
				if ("function" === typeof newChild.then) return updateFromMap(existingChildren, returnFiber, newIdx, unwrapThenable(newChild), lanes);
				if (newChild.$$typeof === REACT_CONTEXT_TYPE) return updateFromMap(existingChildren, returnFiber, newIdx, readContextDuringReconciliation(returnFiber, newChild), lanes);
				throwOnInvalidObjectTypeImpl(returnFiber, newChild);
			}
			return null;
		}
		function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
			for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null; null !== oldFiber && newIdx < newChildren.length; newIdx++) {
				oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
				var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], lanes);
				if (null === newFiber) {
					null === oldFiber && (oldFiber = nextOldFiber);
					break;
				}
				shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
				currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
				null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
				previousNewFiber = newFiber;
				oldFiber = nextOldFiber;
			}
			if (newIdx === newChildren.length) return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
			if (null === oldFiber) {
				for (; newIdx < newChildren.length; newIdx++) oldFiber = createChild(returnFiber, newChildren[newIdx], lanes), null !== oldFiber && (currentFirstChild = placeChild(oldFiber, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = oldFiber : previousNewFiber.sibling = oldFiber, previousNewFiber = oldFiber);
				isHydrating && pushTreeFork(returnFiber, newIdx);
				return resultingFirstChild;
			}
			for (oldFiber = mapRemainingChildren(oldFiber); newIdx < newChildren.length; newIdx++) nextOldFiber = updateFromMap(oldFiber, returnFiber, newIdx, newChildren[newIdx], lanes), null !== nextOldFiber && (shouldTrackSideEffects && null !== nextOldFiber.alternate && oldFiber.delete(null === nextOldFiber.key ? newIdx : nextOldFiber.key), currentFirstChild = placeChild(nextOldFiber, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = nextOldFiber : previousNewFiber.sibling = nextOldFiber, previousNewFiber = nextOldFiber);
			shouldTrackSideEffects && oldFiber.forEach(function(child) {
				return deleteChild(returnFiber, child);
			});
			isHydrating && pushTreeFork(returnFiber, newIdx);
			return resultingFirstChild;
		}
		function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildren, lanes) {
			if (null == newChildren) throw Error(formatProdErrorMessage(151));
			for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null, step = newChildren.next(); null !== oldFiber && !step.done; newIdx++, step = newChildren.next()) {
				oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
				var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
				if (null === newFiber) {
					null === oldFiber && (oldFiber = nextOldFiber);
					break;
				}
				shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
				currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
				null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
				previousNewFiber = newFiber;
				oldFiber = nextOldFiber;
			}
			if (step.done) return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
			if (null === oldFiber) {
				for (; !step.done; newIdx++, step = newChildren.next()) step = createChild(returnFiber, step.value, lanes), null !== step && (currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
				isHydrating && pushTreeFork(returnFiber, newIdx);
				return resultingFirstChild;
			}
			for (oldFiber = mapRemainingChildren(oldFiber); !step.done; newIdx++, step = newChildren.next()) step = updateFromMap(oldFiber, returnFiber, newIdx, step.value, lanes), null !== step && (shouldTrackSideEffects && null !== step.alternate && oldFiber.delete(null === step.key ? newIdx : step.key), currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
			shouldTrackSideEffects && oldFiber.forEach(function(child) {
				return deleteChild(returnFiber, child);
			});
			isHydrating && pushTreeFork(returnFiber, newIdx);
			return resultingFirstChild;
		}
		function reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes) {
			"object" === typeof newChild && null !== newChild && newChild.type === REACT_FRAGMENT_TYPE && null === newChild.key && (newChild = newChild.props.children);
			if ("object" === typeof newChild && null !== newChild) {
				switch (newChild.$$typeof) {
					case REACT_ELEMENT_TYPE:
						a: {
							for (var key = newChild.key; null !== currentFirstChild;) {
								if (currentFirstChild.key === key) {
									key = newChild.type;
									if (key === REACT_FRAGMENT_TYPE) {
										if (7 === currentFirstChild.tag) {
											deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
											lanes = useFiber(currentFirstChild, newChild.props.children);
											lanes.return = returnFiber;
											returnFiber = lanes;
											break a;
										}
									} else if (currentFirstChild.elementType === key || "object" === typeof key && null !== key && key.$$typeof === REACT_LAZY_TYPE && resolveLazy(key) === currentFirstChild.type) {
										deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
										lanes = useFiber(currentFirstChild, newChild.props);
										coerceRef(lanes, newChild);
										lanes.return = returnFiber;
										returnFiber = lanes;
										break a;
									}
									deleteRemainingChildren(returnFiber, currentFirstChild);
									break;
								} else deleteChild(returnFiber, currentFirstChild);
								currentFirstChild = currentFirstChild.sibling;
							}
							newChild.type === REACT_FRAGMENT_TYPE ? (lanes = createFiberFromFragment(newChild.props.children, returnFiber.mode, lanes, newChild.key), lanes.return = returnFiber, returnFiber = lanes) : (lanes = createFiberFromTypeAndProps(newChild.type, newChild.key, newChild.props, null, returnFiber.mode, lanes), coerceRef(lanes, newChild), lanes.return = returnFiber, returnFiber = lanes);
						}
						return placeSingleChild(returnFiber);
					case REACT_PORTAL_TYPE:
						a: {
							for (key = newChild.key; null !== currentFirstChild;) {
								if (currentFirstChild.key === key) if (4 === currentFirstChild.tag && currentFirstChild.stateNode.containerInfo === newChild.containerInfo && currentFirstChild.stateNode.implementation === newChild.implementation) {
									deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
									lanes = useFiber(currentFirstChild, newChild.children || []);
									lanes.return = returnFiber;
									returnFiber = lanes;
									break a;
								} else {
									deleteRemainingChildren(returnFiber, currentFirstChild);
									break;
								}
								else deleteChild(returnFiber, currentFirstChild);
								currentFirstChild = currentFirstChild.sibling;
							}
							lanes = createFiberFromPortal(newChild, returnFiber.mode, lanes);
							lanes.return = returnFiber;
							returnFiber = lanes;
						}
						return placeSingleChild(returnFiber);
					case REACT_LAZY_TYPE: return newChild = resolveLazy(newChild), reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes);
				}
				if (isArrayImpl(newChild)) return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
				if (getIteratorFn(newChild)) {
					key = getIteratorFn(newChild);
					if ("function" !== typeof key) throw Error(formatProdErrorMessage(150));
					newChild = key.call(newChild);
					return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, lanes);
				}
				if ("function" === typeof newChild.then) return reconcileChildFibersImpl(returnFiber, currentFirstChild, unwrapThenable(newChild), lanes);
				if (newChild.$$typeof === REACT_CONTEXT_TYPE) return reconcileChildFibersImpl(returnFiber, currentFirstChild, readContextDuringReconciliation(returnFiber, newChild), lanes);
				throwOnInvalidObjectTypeImpl(returnFiber, newChild);
			}
			return "string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild ? (newChild = "" + newChild, null !== currentFirstChild && 6 === currentFirstChild.tag ? (deleteRemainingChildren(returnFiber, currentFirstChild.sibling), lanes = useFiber(currentFirstChild, newChild), lanes.return = returnFiber, returnFiber = lanes) : (deleteRemainingChildren(returnFiber, currentFirstChild), lanes = createFiberFromText(newChild, returnFiber.mode, lanes), lanes.return = returnFiber, returnFiber = lanes), placeSingleChild(returnFiber)) : deleteRemainingChildren(returnFiber, currentFirstChild);
		}
		return function(returnFiber, currentFirstChild, newChild, lanes) {
			try {
				thenableIndexCounter$1 = 0;
				var firstChildFiber = reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes);
				thenableState$1 = null;
				return firstChildFiber;
			} catch (x) {
				if (x === SuspenseException || x === SuspenseActionException) throw x;
				var fiber = createFiberImplClass(29, x, null, returnFiber.mode);
				fiber.lanes = lanes;
				fiber.return = returnFiber;
				return fiber;
			}
		};
	}
	var reconcileChildFibers = createChildReconciler(!0), mountChildFibers = createChildReconciler(!1), hasForceUpdate = !1;
	function initializeUpdateQueue(fiber) {
		fiber.updateQueue = {
			baseState: fiber.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function cloneUpdateQueue(current, workInProgress) {
		current = current.updateQueue;
		workInProgress.updateQueue === current && (workInProgress.updateQueue = {
			baseState: current.baseState,
			firstBaseUpdate: current.firstBaseUpdate,
			lastBaseUpdate: current.lastBaseUpdate,
			shared: current.shared,
			callbacks: null
		});
	}
	function createUpdate(lane) {
		return {
			lane,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function enqueueUpdate(fiber, update, lane) {
		var updateQueue = fiber.updateQueue;
		if (null === updateQueue) return null;
		updateQueue = updateQueue.shared;
		if (0 !== (executionContext & 2)) {
			var pending = updateQueue.pending;
			null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
			updateQueue.pending = update;
			update = getRootForUpdatedFiber(fiber);
			markUpdateLaneFromFiberToRoot(fiber, null, lane);
			return update;
		}
		enqueueUpdate$1(fiber, updateQueue, update, lane);
		return getRootForUpdatedFiber(fiber);
	}
	function entangleTransitions(root, fiber, lane) {
		fiber = fiber.updateQueue;
		if (null !== fiber && (fiber = fiber.shared, 0 !== (lane & 4194048))) {
			var queueLanes = fiber.lanes;
			queueLanes &= root.pendingLanes;
			lane |= queueLanes;
			fiber.lanes = lane;
			markRootEntangled(root, lane);
		}
	}
	function enqueueCapturedUpdate(workInProgress, capturedUpdate) {
		var queue = workInProgress.updateQueue, current = workInProgress.alternate;
		if (null !== current && (current = current.updateQueue, queue === current)) {
			var newFirst = null, newLast = null;
			queue = queue.firstBaseUpdate;
			if (null !== queue) {
				do {
					var clone = {
						lane: queue.lane,
						tag: queue.tag,
						payload: queue.payload,
						callback: null,
						next: null
					};
					null === newLast ? newFirst = newLast = clone : newLast = newLast.next = clone;
					queue = queue.next;
				} while (null !== queue);
				null === newLast ? newFirst = newLast = capturedUpdate : newLast = newLast.next = capturedUpdate;
			} else newFirst = newLast = capturedUpdate;
			queue = {
				baseState: current.baseState,
				firstBaseUpdate: newFirst,
				lastBaseUpdate: newLast,
				shared: current.shared,
				callbacks: current.callbacks
			};
			workInProgress.updateQueue = queue;
			return;
		}
		workInProgress = queue.lastBaseUpdate;
		null === workInProgress ? queue.firstBaseUpdate = capturedUpdate : workInProgress.next = capturedUpdate;
		queue.lastBaseUpdate = capturedUpdate;
	}
	var didReadFromEntangledAsyncAction = !1;
	function suspendIfUpdateReadFromEntangledAsyncAction() {
		if (didReadFromEntangledAsyncAction) {
			var entangledActionThenable = currentEntangledActionThenable;
			if (null !== entangledActionThenable) throw entangledActionThenable;
		}
	}
	function processUpdateQueue(workInProgress$jscomp$0, props, instance$jscomp$0, renderLanes) {
		didReadFromEntangledAsyncAction = !1;
		var queue = workInProgress$jscomp$0.updateQueue;
		hasForceUpdate = !1;
		var firstBaseUpdate = queue.firstBaseUpdate, lastBaseUpdate = queue.lastBaseUpdate, pendingQueue = queue.shared.pending;
		if (null !== pendingQueue) {
			queue.shared.pending = null;
			var lastPendingUpdate = pendingQueue, firstPendingUpdate = lastPendingUpdate.next;
			lastPendingUpdate.next = null;
			null === lastBaseUpdate ? firstBaseUpdate = firstPendingUpdate : lastBaseUpdate.next = firstPendingUpdate;
			lastBaseUpdate = lastPendingUpdate;
			var current = workInProgress$jscomp$0.alternate;
			null !== current && (current = current.updateQueue, pendingQueue = current.lastBaseUpdate, pendingQueue !== lastBaseUpdate && (null === pendingQueue ? current.firstBaseUpdate = firstPendingUpdate : pendingQueue.next = firstPendingUpdate, current.lastBaseUpdate = lastPendingUpdate));
		}
		if (null !== firstBaseUpdate) {
			var newState = queue.baseState;
			lastBaseUpdate = 0;
			current = firstPendingUpdate = lastPendingUpdate = null;
			pendingQueue = firstBaseUpdate;
			do {
				var updateLane = pendingQueue.lane & -536870913, isHiddenUpdate = updateLane !== pendingQueue.lane;
				if (isHiddenUpdate ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes & updateLane) === updateLane) {
					0 !== updateLane && updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction = !0);
					null !== current && (current = current.next = {
						lane: 0,
						tag: pendingQueue.tag,
						payload: pendingQueue.payload,
						callback: null,
						next: null
					});
					a: {
						var workInProgress = workInProgress$jscomp$0, update = pendingQueue;
						updateLane = props;
						var instance = instance$jscomp$0;
						switch (update.tag) {
							case 1:
								workInProgress = update.payload;
								if ("function" === typeof workInProgress) {
									newState = workInProgress.call(instance, newState, updateLane);
									break a;
								}
								newState = workInProgress;
								break a;
							case 3: workInProgress.flags = workInProgress.flags & -65537 | 128;
							case 0:
								workInProgress = update.payload;
								updateLane = "function" === typeof workInProgress ? workInProgress.call(instance, newState, updateLane) : workInProgress;
								if (null === updateLane || void 0 === updateLane) break a;
								newState = assign({}, newState, updateLane);
								break a;
							case 2: hasForceUpdate = !0;
						}
					}
					updateLane = pendingQueue.callback;
					null !== updateLane && (workInProgress$jscomp$0.flags |= 64, isHiddenUpdate && (workInProgress$jscomp$0.flags |= 8192), isHiddenUpdate = queue.callbacks, null === isHiddenUpdate ? queue.callbacks = [updateLane] : isHiddenUpdate.push(updateLane));
				} else isHiddenUpdate = {
					lane: updateLane,
					tag: pendingQueue.tag,
					payload: pendingQueue.payload,
					callback: pendingQueue.callback,
					next: null
				}, null === current ? (firstPendingUpdate = current = isHiddenUpdate, lastPendingUpdate = newState) : current = current.next = isHiddenUpdate, lastBaseUpdate |= updateLane;
				pendingQueue = pendingQueue.next;
				if (null === pendingQueue) if (pendingQueue = queue.shared.pending, null === pendingQueue) break;
				else isHiddenUpdate = pendingQueue, pendingQueue = isHiddenUpdate.next, isHiddenUpdate.next = null, queue.lastBaseUpdate = isHiddenUpdate, queue.shared.pending = null;
			} while (1);
			null === current && (lastPendingUpdate = newState);
			queue.baseState = lastPendingUpdate;
			queue.firstBaseUpdate = firstPendingUpdate;
			queue.lastBaseUpdate = current;
			null === firstBaseUpdate && (queue.shared.lanes = 0);
			workInProgressRootSkippedLanes |= lastBaseUpdate;
			workInProgress$jscomp$0.lanes = lastBaseUpdate;
			workInProgress$jscomp$0.memoizedState = newState;
		}
	}
	function callCallback(callback, context) {
		if ("function" !== typeof callback) throw Error(formatProdErrorMessage(191, callback));
		callback.call(context);
	}
	function commitCallbacks(updateQueue, context) {
		var callbacks = updateQueue.callbacks;
		if (null !== callbacks) for (updateQueue.callbacks = null, updateQueue = 0; updateQueue < callbacks.length; updateQueue++) callCallback(callbacks[updateQueue], context);
	}
	var currentTreeHiddenStackCursor = createCursor(null), prevEntangledRenderLanesCursor = createCursor(0);
	function pushHiddenContext(fiber, context) {
		fiber = entangledRenderLanes;
		push(prevEntangledRenderLanesCursor, fiber);
		push(currentTreeHiddenStackCursor, context);
		entangledRenderLanes = fiber | context.baseLanes;
	}
	function reuseHiddenContextOnStack() {
		push(prevEntangledRenderLanesCursor, entangledRenderLanes);
		push(currentTreeHiddenStackCursor, currentTreeHiddenStackCursor.current);
	}
	function popHiddenContext() {
		entangledRenderLanes = prevEntangledRenderLanesCursor.current;
		pop(currentTreeHiddenStackCursor);
		pop(prevEntangledRenderLanesCursor);
	}
	var suspenseHandlerStackCursor = createCursor(null), shellBoundary = null;
	function pushPrimaryTreeSuspenseHandler(handler) {
		var current = handler.alternate;
		push(suspenseStackCursor, suspenseStackCursor.current & 1);
		push(suspenseHandlerStackCursor, handler);
		null === shellBoundary && (null === current || null !== currentTreeHiddenStackCursor.current ? shellBoundary = handler : null !== current.memoizedState && (shellBoundary = handler));
	}
	function pushDehydratedActivitySuspenseHandler(fiber) {
		push(suspenseStackCursor, suspenseStackCursor.current);
		push(suspenseHandlerStackCursor, fiber);
		null === shellBoundary && (shellBoundary = fiber);
	}
	function pushOffscreenSuspenseHandler(fiber) {
		22 === fiber.tag ? (push(suspenseStackCursor, suspenseStackCursor.current), push(suspenseHandlerStackCursor, fiber), null === shellBoundary && (shellBoundary = fiber)) : reuseSuspenseHandlerOnStack(fiber);
	}
	function reuseSuspenseHandlerOnStack() {
		push(suspenseStackCursor, suspenseStackCursor.current);
		push(suspenseHandlerStackCursor, suspenseHandlerStackCursor.current);
	}
	function popSuspenseHandler(fiber) {
		pop(suspenseHandlerStackCursor);
		shellBoundary === fiber && (shellBoundary = null);
		pop(suspenseStackCursor);
	}
	var suspenseStackCursor = createCursor(0);
	function findFirstSuspended(row) {
		for (var node = row; null !== node;) {
			if (13 === node.tag) {
				var state = node.memoizedState;
				if (null !== state && (state = state.dehydrated, null === state || isSuspenseInstancePending(state) || isSuspenseInstanceFallback(state))) return node;
			} else if (19 === node.tag && ("forwards" === node.memoizedProps.revealOrder || "backwards" === node.memoizedProps.revealOrder || "unstable_legacy-backwards" === node.memoizedProps.revealOrder || "together" === node.memoizedProps.revealOrder)) {
				if (0 !== (node.flags & 128)) return node;
			} else if (null !== node.child) {
				node.child.return = node;
				node = node.child;
				continue;
			}
			if (node === row) break;
			for (; null === node.sibling;) {
				if (null === node.return || node.return === row) return null;
				node = node.return;
			}
			node.sibling.return = node.return;
			node = node.sibling;
		}
		return null;
	}
	var renderLanes = 0, currentlyRenderingFiber = null, currentHook = null, workInProgressHook = null, didScheduleRenderPhaseUpdate = !1, didScheduleRenderPhaseUpdateDuringThisPass = !1, shouldDoubleInvokeUserFnsInHooksDEV = !1, localIdCounter = 0, thenableIndexCounter = 0, thenableState = null, globalClientIdCounter = 0;
	function throwInvalidHookError() {
		throw Error(formatProdErrorMessage(321));
	}
	function areHookInputsEqual(nextDeps, prevDeps) {
		if (null === prevDeps) return !1;
		for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) if (!objectIs(nextDeps[i], prevDeps[i])) return !1;
		return !0;
	}
	function renderWithHooks(current, workInProgress, Component, props, secondArg, nextRenderLanes) {
		renderLanes = nextRenderLanes;
		currentlyRenderingFiber = workInProgress;
		workInProgress.memoizedState = null;
		workInProgress.updateQueue = null;
		workInProgress.lanes = 0;
		ReactSharedInternals.H = null === current || null === current.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;
		shouldDoubleInvokeUserFnsInHooksDEV = !1;
		nextRenderLanes = Component(props, secondArg);
		shouldDoubleInvokeUserFnsInHooksDEV = !1;
		didScheduleRenderPhaseUpdateDuringThisPass && (nextRenderLanes = renderWithHooksAgain(workInProgress, Component, props, secondArg));
		finishRenderingHooks(current);
		return nextRenderLanes;
	}
	function finishRenderingHooks(current) {
		ReactSharedInternals.H = ContextOnlyDispatcher;
		var didRenderTooFewHooks = null !== currentHook && null !== currentHook.next;
		renderLanes = 0;
		workInProgressHook = currentHook = currentlyRenderingFiber = null;
		didScheduleRenderPhaseUpdate = !1;
		thenableIndexCounter = 0;
		thenableState = null;
		if (didRenderTooFewHooks) throw Error(formatProdErrorMessage(300));
		null === current || didReceiveUpdate || (current = current.dependencies, null !== current && checkIfContextChanged(current) && (didReceiveUpdate = !0));
	}
	function renderWithHooksAgain(workInProgress, Component, props, secondArg) {
		currentlyRenderingFiber = workInProgress;
		var numberOfReRenders = 0;
		do {
			didScheduleRenderPhaseUpdateDuringThisPass && (thenableState = null);
			thenableIndexCounter = 0;
			didScheduleRenderPhaseUpdateDuringThisPass = !1;
			if (25 <= numberOfReRenders) throw Error(formatProdErrorMessage(301));
			numberOfReRenders += 1;
			workInProgressHook = currentHook = null;
			if (null != workInProgress.updateQueue) {
				var children = workInProgress.updateQueue;
				children.lastEffect = null;
				children.events = null;
				children.stores = null;
				null != children.memoCache && (children.memoCache.index = 0);
			}
			ReactSharedInternals.H = HooksDispatcherOnRerender;
			children = Component(props, secondArg);
		} while (didScheduleRenderPhaseUpdateDuringThisPass);
		return children;
	}
	function TransitionAwareHostComponent() {
		var dispatcher = ReactSharedInternals.H, maybeThenable = dispatcher.useState()[0];
		maybeThenable = "function" === typeof maybeThenable.then ? useThenable(maybeThenable) : maybeThenable;
		dispatcher = dispatcher.useState()[0];
		(null !== currentHook ? currentHook.memoizedState : null) !== dispatcher && (currentlyRenderingFiber.flags |= 1024);
		return maybeThenable;
	}
	function checkDidRenderIdHook() {
		var didRenderIdHook = 0 !== localIdCounter;
		localIdCounter = 0;
		return didRenderIdHook;
	}
	function bailoutHooks(current, workInProgress, lanes) {
		workInProgress.updateQueue = current.updateQueue;
		workInProgress.flags &= -2053;
		current.lanes &= ~lanes;
	}
	function resetHooksOnUnwind(workInProgress) {
		if (didScheduleRenderPhaseUpdate) {
			for (workInProgress = workInProgress.memoizedState; null !== workInProgress;) {
				var queue = workInProgress.queue;
				null !== queue && (queue.pending = null);
				workInProgress = workInProgress.next;
			}
			didScheduleRenderPhaseUpdate = !1;
		}
		renderLanes = 0;
		workInProgressHook = currentHook = currentlyRenderingFiber = null;
		didScheduleRenderPhaseUpdateDuringThisPass = !1;
		thenableIndexCounter = localIdCounter = 0;
		thenableState = null;
	}
	function mountWorkInProgressHook() {
		var hook = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = hook : workInProgressHook = workInProgressHook.next = hook;
		return workInProgressHook;
	}
	function updateWorkInProgressHook() {
		if (null === currentHook) {
			var nextCurrentHook = currentlyRenderingFiber.alternate;
			nextCurrentHook = null !== nextCurrentHook ? nextCurrentHook.memoizedState : null;
		} else nextCurrentHook = currentHook.next;
		var nextWorkInProgressHook = null === workInProgressHook ? currentlyRenderingFiber.memoizedState : workInProgressHook.next;
		if (null !== nextWorkInProgressHook) workInProgressHook = nextWorkInProgressHook, currentHook = nextCurrentHook;
		else {
			if (null === nextCurrentHook) {
				if (null === currentlyRenderingFiber.alternate) throw Error(formatProdErrorMessage(467));
				throw Error(formatProdErrorMessage(310));
			}
			currentHook = nextCurrentHook;
			nextCurrentHook = {
				memoizedState: currentHook.memoizedState,
				baseState: currentHook.baseState,
				baseQueue: currentHook.baseQueue,
				queue: currentHook.queue,
				next: null
			};
			null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = nextCurrentHook : workInProgressHook = workInProgressHook.next = nextCurrentHook;
		}
		return workInProgressHook;
	}
	function createFunctionComponentUpdateQueue() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function useThenable(thenable) {
		var index = thenableIndexCounter;
		thenableIndexCounter += 1;
		null === thenableState && (thenableState = []);
		thenable = trackUsedThenable(thenableState, thenable, index);
		index = currentlyRenderingFiber;
		null === (null === workInProgressHook ? index.memoizedState : workInProgressHook.next) && (index = index.alternate, ReactSharedInternals.H = null === index || null === index.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate);
		return thenable;
	}
	function use(usable) {
		if (null !== usable && "object" === typeof usable) {
			if ("function" === typeof usable.then) return useThenable(usable);
			if (usable.$$typeof === REACT_CONTEXT_TYPE) return readContext(usable);
		}
		throw Error(formatProdErrorMessage(438, String(usable)));
	}
	function useMemoCache(size) {
		var memoCache = null, updateQueue = currentlyRenderingFiber.updateQueue;
		null !== updateQueue && (memoCache = updateQueue.memoCache);
		if (null == memoCache) {
			var current = currentlyRenderingFiber.alternate;
			null !== current && (current = current.updateQueue, null !== current && (current = current.memoCache, null != current && (memoCache = {
				data: current.data.map(function(array) {
					return array.slice();
				}),
				index: 0
			})));
		}
		memoCache ??= {
			data: [],
			index: 0
		};
		null === updateQueue && (updateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = updateQueue);
		updateQueue.memoCache = memoCache;
		updateQueue = memoCache.data[memoCache.index];
		if (void 0 === updateQueue) for (updateQueue = memoCache.data[memoCache.index] = Array(size), current = 0; current < size; current++) updateQueue[current] = REACT_MEMO_CACHE_SENTINEL;
		memoCache.index++;
		return updateQueue;
	}
	function basicStateReducer(state, action) {
		return "function" === typeof action ? action(state) : action;
	}
	function updateReducer(reducer) {
		return updateReducerImpl(updateWorkInProgressHook(), currentHook, reducer);
	}
	function updateReducerImpl(hook, current, reducer) {
		var queue = hook.queue;
		if (null === queue) throw Error(formatProdErrorMessage(311));
		queue.lastRenderedReducer = reducer;
		var baseQueue = hook.baseQueue, pendingQueue = queue.pending;
		if (null !== pendingQueue) {
			if (null !== baseQueue) {
				var baseFirst = baseQueue.next;
				baseQueue.next = pendingQueue.next;
				pendingQueue.next = baseFirst;
			}
			current.baseQueue = baseQueue = pendingQueue;
			queue.pending = null;
		}
		pendingQueue = hook.baseState;
		if (null === baseQueue) hook.memoizedState = pendingQueue;
		else {
			current = baseQueue.next;
			var newBaseQueueFirst = baseFirst = null, newBaseQueueLast = null, update = current, didReadFromEntangledAsyncAction$60 = !1;
			do {
				var updateLane = update.lane & -536870913;
				if (updateLane !== update.lane ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes & updateLane) === updateLane) {
					var revertLane = update.revertLane;
					if (0 === revertLane) null !== newBaseQueueLast && (newBaseQueueLast = newBaseQueueLast.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: update.action,
						hasEagerState: update.hasEagerState,
						eagerState: update.eagerState,
						next: null
					}), updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction$60 = !0);
					else if ((renderLanes & revertLane) === revertLane) {
						update = update.next;
						revertLane === currentEntangledLane && (didReadFromEntangledAsyncAction$60 = !0);
						continue;
					} else updateLane = {
						lane: 0,
						revertLane: update.revertLane,
						gesture: null,
						action: update.action,
						hasEagerState: update.hasEagerState,
						eagerState: update.eagerState,
						next: null
					}, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = updateLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = updateLane, currentlyRenderingFiber.lanes |= revertLane, workInProgressRootSkippedLanes |= revertLane;
					updateLane = update.action;
					shouldDoubleInvokeUserFnsInHooksDEV && reducer(pendingQueue, updateLane);
					pendingQueue = update.hasEagerState ? update.eagerState : reducer(pendingQueue, updateLane);
				} else revertLane = {
					lane: updateLane,
					revertLane: update.revertLane,
					gesture: update.gesture,
					action: update.action,
					hasEagerState: update.hasEagerState,
					eagerState: update.eagerState,
					next: null
				}, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = revertLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = revertLane, currentlyRenderingFiber.lanes |= updateLane, workInProgressRootSkippedLanes |= updateLane;
				update = update.next;
			} while (null !== update && update !== current);
			null === newBaseQueueLast ? baseFirst = pendingQueue : newBaseQueueLast.next = newBaseQueueFirst;
			if (!objectIs(pendingQueue, hook.memoizedState) && (didReceiveUpdate = !0, didReadFromEntangledAsyncAction$60 && (reducer = currentEntangledActionThenable, null !== reducer))) throw reducer;
			hook.memoizedState = pendingQueue;
			hook.baseState = baseFirst;
			hook.baseQueue = newBaseQueueLast;
			queue.lastRenderedState = pendingQueue;
		}
		null === baseQueue && (queue.lanes = 0);
		return [hook.memoizedState, queue.dispatch];
	}
	function rerenderReducer(reducer) {
		var hook = updateWorkInProgressHook(), queue = hook.queue;
		if (null === queue) throw Error(formatProdErrorMessage(311));
		queue.lastRenderedReducer = reducer;
		var dispatch = queue.dispatch, lastRenderPhaseUpdate = queue.pending, newState = hook.memoizedState;
		if (null !== lastRenderPhaseUpdate) {
			queue.pending = null;
			var update = lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
			do
				newState = reducer(newState, update.action), update = update.next;
			while (update !== lastRenderPhaseUpdate);
			objectIs(newState, hook.memoizedState) || (didReceiveUpdate = !0);
			hook.memoizedState = newState;
			null === hook.baseQueue && (hook.baseState = newState);
			queue.lastRenderedState = newState;
		}
		return [newState, dispatch];
	}
	function updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
		var fiber = currentlyRenderingFiber, hook = updateWorkInProgressHook(), isHydrating$jscomp$0 = isHydrating;
		if (isHydrating$jscomp$0) {
			if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
			getServerSnapshot = getServerSnapshot();
		} else getServerSnapshot = getSnapshot();
		var snapshotChanged = !objectIs((currentHook || hook).memoizedState, getServerSnapshot);
		snapshotChanged && (hook.memoizedState = getServerSnapshot, didReceiveUpdate = !0);
		hook = hook.queue;
		updateEffect(subscribeToStore.bind(null, fiber, hook, subscribe), [subscribe]);
		if (hook.getSnapshot !== getSnapshot || snapshotChanged || null !== workInProgressHook && workInProgressHook.memoizedState.tag & 1) {
			fiber.flags |= 2048;
			pushSimpleEffect(9, { destroy: void 0 }, updateStoreInstance.bind(null, fiber, hook, getServerSnapshot, getSnapshot), null);
			if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
			isHydrating$jscomp$0 || 0 !== (renderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
		}
		return getServerSnapshot;
	}
	function pushStoreConsistencyCheck(fiber, getSnapshot, renderedSnapshot) {
		fiber.flags |= 16384;
		fiber = {
			getSnapshot,
			value: renderedSnapshot
		};
		getSnapshot = currentlyRenderingFiber.updateQueue;
		null === getSnapshot ? (getSnapshot = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = getSnapshot, getSnapshot.stores = [fiber]) : (renderedSnapshot = getSnapshot.stores, null === renderedSnapshot ? getSnapshot.stores = [fiber] : renderedSnapshot.push(fiber));
	}
	function updateStoreInstance(fiber, inst, nextSnapshot, getSnapshot) {
		inst.value = nextSnapshot;
		inst.getSnapshot = getSnapshot;
		checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
	}
	function subscribeToStore(fiber, inst, subscribe) {
		return subscribe(function() {
			checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
		});
	}
	function checkIfSnapshotChanged(inst) {
		var latestGetSnapshot = inst.getSnapshot;
		inst = inst.value;
		try {
			var nextValue = latestGetSnapshot();
			return !objectIs(inst, nextValue);
		} catch (error) {
			return !0;
		}
	}
	function forceStoreRerender(fiber) {
		var root = enqueueConcurrentRenderForLane(fiber, 2);
		null !== root && scheduleUpdateOnFiber(root, fiber, 2);
	}
	function mountStateImpl(initialState) {
		var hook = mountWorkInProgressHook();
		if ("function" === typeof initialState) {
			var initialStateInitializer = initialState;
			initialState = initialStateInitializer();
			if (shouldDoubleInvokeUserFnsInHooksDEV) {
				setIsStrictModeForDevtools(!0);
				try {
					initialStateInitializer();
				} finally {
					setIsStrictModeForDevtools(!1);
				}
			}
		}
		hook.memoizedState = hook.baseState = initialState;
		hook.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: basicStateReducer,
			lastRenderedState: initialState
		};
		return hook;
	}
	function updateOptimisticImpl(hook, current, passthrough, reducer) {
		hook.baseState = passthrough;
		return updateReducerImpl(hook, currentHook, "function" === typeof reducer ? reducer : basicStateReducer);
	}
	function dispatchActionState(fiber, actionQueue, setPendingState, setState, payload) {
		if (isRenderPhaseUpdate(fiber)) throw Error(formatProdErrorMessage(485));
		fiber = actionQueue.action;
		if (null !== fiber) {
			var actionNode = {
				payload,
				action: fiber,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(listener) {
					actionNode.listeners.push(listener);
				}
			};
			null !== ReactSharedInternals.T ? setPendingState(!0) : actionNode.isTransition = !1;
			setState(actionNode);
			setPendingState = actionQueue.pending;
			null === setPendingState ? (actionNode.next = actionQueue.pending = actionNode, runActionStateAction(actionQueue, actionNode)) : (actionNode.next = setPendingState.next, actionQueue.pending = setPendingState.next = actionNode);
		}
	}
	function runActionStateAction(actionQueue, node) {
		var action = node.action, payload = node.payload, prevState = actionQueue.state;
		if (node.isTransition) {
			var prevTransition = ReactSharedInternals.T, currentTransition = {};
			ReactSharedInternals.T = currentTransition;
			try {
				var returnValue = action(prevState, payload), onStartTransitionFinish = ReactSharedInternals.S;
				null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
				handleActionReturnValue(actionQueue, node, returnValue);
			} catch (error) {
				onActionError(actionQueue, node, error);
			} finally {
				null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
			}
		} else try {
			prevTransition = action(prevState, payload), handleActionReturnValue(actionQueue, node, prevTransition);
		} catch (error$66) {
			onActionError(actionQueue, node, error$66);
		}
	}
	function handleActionReturnValue(actionQueue, node, returnValue) {
		null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then ? returnValue.then(function(nextState) {
			onActionSuccess(actionQueue, node, nextState);
		}, function(error) {
			return onActionError(actionQueue, node, error);
		}) : onActionSuccess(actionQueue, node, returnValue);
	}
	function onActionSuccess(actionQueue, actionNode, nextState) {
		actionNode.status = "fulfilled";
		actionNode.value = nextState;
		notifyActionListeners(actionNode);
		actionQueue.state = nextState;
		actionNode = actionQueue.pending;
		null !== actionNode && (nextState = actionNode.next, nextState === actionNode ? actionQueue.pending = null : (nextState = nextState.next, actionNode.next = nextState, runActionStateAction(actionQueue, nextState)));
	}
	function onActionError(actionQueue, actionNode, error) {
		var last = actionQueue.pending;
		actionQueue.pending = null;
		if (null !== last) {
			last = last.next;
			do
				actionNode.status = "rejected", actionNode.reason = error, notifyActionListeners(actionNode), actionNode = actionNode.next;
			while (actionNode !== last);
		}
		actionQueue.action = null;
	}
	function notifyActionListeners(actionNode) {
		actionNode = actionNode.listeners;
		for (var i = 0; i < actionNode.length; i++) (0, actionNode[i])();
	}
	function actionStateReducer(oldState, newState) {
		return newState;
	}
	function mountActionState(action, initialStateProp) {
		if (isHydrating) {
			var ssrFormState = workInProgressRoot.formState;
			if (null !== ssrFormState) {
				a: {
					var JSCompiler_inline_result = currentlyRenderingFiber;
					if (isHydrating) {
						if (nextHydratableInstance) {
							b: {
								var JSCompiler_inline_result$jscomp$0 = nextHydratableInstance;
								for (var inRootOrSingleton = rootOrSingletonContext; 8 !== JSCompiler_inline_result$jscomp$0.nodeType;) {
									if (!inRootOrSingleton) {
										JSCompiler_inline_result$jscomp$0 = null;
										break b;
									}
									JSCompiler_inline_result$jscomp$0 = getNextHydratable(JSCompiler_inline_result$jscomp$0.nextSibling);
									if (null === JSCompiler_inline_result$jscomp$0) {
										JSCompiler_inline_result$jscomp$0 = null;
										break b;
									}
								}
								inRootOrSingleton = JSCompiler_inline_result$jscomp$0.data;
								JSCompiler_inline_result$jscomp$0 = "F!" === inRootOrSingleton || "F" === inRootOrSingleton ? JSCompiler_inline_result$jscomp$0 : null;
							}
							if (JSCompiler_inline_result$jscomp$0) {
								nextHydratableInstance = getNextHydratable(JSCompiler_inline_result$jscomp$0.nextSibling);
								JSCompiler_inline_result = "F!" === JSCompiler_inline_result$jscomp$0.data;
								break a;
							}
						}
						throwOnHydrationMismatch(JSCompiler_inline_result);
					}
					JSCompiler_inline_result = !1;
				}
				JSCompiler_inline_result && (initialStateProp = ssrFormState[0]);
			}
		}
		ssrFormState = mountWorkInProgressHook();
		ssrFormState.memoizedState = ssrFormState.baseState = initialStateProp;
		JSCompiler_inline_result = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: actionStateReducer,
			lastRenderedState: initialStateProp
		};
		ssrFormState.queue = JSCompiler_inline_result;
		ssrFormState = dispatchSetState.bind(null, currentlyRenderingFiber, JSCompiler_inline_result);
		JSCompiler_inline_result.dispatch = ssrFormState;
		JSCompiler_inline_result = mountStateImpl(!1);
		inRootOrSingleton = dispatchOptimisticSetState.bind(null, currentlyRenderingFiber, !1, JSCompiler_inline_result.queue);
		JSCompiler_inline_result = mountWorkInProgressHook();
		JSCompiler_inline_result$jscomp$0 = {
			state: initialStateProp,
			dispatch: null,
			action,
			pending: null
		};
		JSCompiler_inline_result.queue = JSCompiler_inline_result$jscomp$0;
		ssrFormState = dispatchActionState.bind(null, currentlyRenderingFiber, JSCompiler_inline_result$jscomp$0, inRootOrSingleton, ssrFormState);
		JSCompiler_inline_result$jscomp$0.dispatch = ssrFormState;
		JSCompiler_inline_result.memoizedState = action;
		return [
			initialStateProp,
			ssrFormState,
			!1
		];
	}
	function updateActionState(action) {
		return updateActionStateImpl(updateWorkInProgressHook(), currentHook, action);
	}
	function updateActionStateImpl(stateHook, currentStateHook, action) {
		currentStateHook = updateReducerImpl(stateHook, currentStateHook, actionStateReducer)[0];
		stateHook = updateReducer(basicStateReducer)[0];
		if ("object" === typeof currentStateHook && null !== currentStateHook && "function" === typeof currentStateHook.then) try {
			var state = useThenable(currentStateHook);
		} catch (x) {
			if (x === SuspenseException) throw SuspenseActionException;
			throw x;
		}
		else state = currentStateHook;
		currentStateHook = updateWorkInProgressHook();
		var actionQueue = currentStateHook.queue, dispatch = actionQueue.dispatch;
		action !== currentStateHook.memoizedState && (currentlyRenderingFiber.flags |= 2048, pushSimpleEffect(9, { destroy: void 0 }, actionStateActionEffect.bind(null, actionQueue, action), null));
		return [
			state,
			dispatch,
			stateHook
		];
	}
	function actionStateActionEffect(actionQueue, action) {
		actionQueue.action = action;
	}
	function rerenderActionState(action) {
		var stateHook = updateWorkInProgressHook(), currentStateHook = currentHook;
		if (null !== currentStateHook) return updateActionStateImpl(stateHook, currentStateHook, action);
		updateWorkInProgressHook();
		stateHook = stateHook.memoizedState;
		currentStateHook = updateWorkInProgressHook();
		var dispatch = currentStateHook.queue.dispatch;
		currentStateHook.memoizedState = action;
		return [
			stateHook,
			dispatch,
			!1
		];
	}
	function pushSimpleEffect(tag, inst, create, deps) {
		tag = {
			tag,
			create,
			deps,
			inst,
			next: null
		};
		inst = currentlyRenderingFiber.updateQueue;
		null === inst && (inst = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = inst);
		create = inst.lastEffect;
		null === create ? inst.lastEffect = tag.next = tag : (deps = create.next, create.next = tag, tag.next = deps, inst.lastEffect = tag);
		return tag;
	}
	function updateRef() {
		return updateWorkInProgressHook().memoizedState;
	}
	function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
		var hook = mountWorkInProgressHook();
		currentlyRenderingFiber.flags |= fiberFlags;
		hook.memoizedState = pushSimpleEffect(1 | hookFlags, { destroy: void 0 }, create, void 0 === deps ? null : deps);
	}
	function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
		var hook = updateWorkInProgressHook();
		deps = void 0 === deps ? null : deps;
		var inst = hook.memoizedState.inst;
		null !== currentHook && null !== deps && areHookInputsEqual(deps, currentHook.memoizedState.deps) ? hook.memoizedState = pushSimpleEffect(hookFlags, inst, create, deps) : (currentlyRenderingFiber.flags |= fiberFlags, hook.memoizedState = pushSimpleEffect(1 | hookFlags, inst, create, deps));
	}
	function mountEffect(create, deps) {
		mountEffectImpl(8390656, 8, create, deps);
	}
	function updateEffect(create, deps) {
		updateEffectImpl(2048, 8, create, deps);
	}
	function useEffectEventImpl(payload) {
		currentlyRenderingFiber.flags |= 4;
		var componentUpdateQueue = currentlyRenderingFiber.updateQueue;
		if (null === componentUpdateQueue) componentUpdateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = componentUpdateQueue, componentUpdateQueue.events = [payload];
		else {
			var events = componentUpdateQueue.events;
			null === events ? componentUpdateQueue.events = [payload] : events.push(payload);
		}
	}
	function updateEvent(callback) {
		var ref = updateWorkInProgressHook().memoizedState;
		useEffectEventImpl({
			ref,
			nextImpl: callback
		});
		return function() {
			if (0 !== (executionContext & 2)) throw Error(formatProdErrorMessage(440));
			return ref.impl.apply(void 0, arguments);
		};
	}
	function updateInsertionEffect(create, deps) {
		return updateEffectImpl(4, 2, create, deps);
	}
	function updateLayoutEffect(create, deps) {
		return updateEffectImpl(4, 4, create, deps);
	}
	function imperativeHandleEffect(create, ref) {
		if ("function" === typeof ref) {
			create = create();
			var refCleanup = ref(create);
			return function() {
				"function" === typeof refCleanup ? refCleanup() : ref(null);
			};
		}
		if (null !== ref && void 0 !== ref) return create = create(), ref.current = create, function() {
			ref.current = null;
		};
	}
	function updateImperativeHandle(ref, create, deps) {
		deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
		updateEffectImpl(4, 4, imperativeHandleEffect.bind(null, create, ref), deps);
	}
	function mountDebugValue() {}
	function updateCallback(callback, deps) {
		var hook = updateWorkInProgressHook();
		deps = void 0 === deps ? null : deps;
		var prevState = hook.memoizedState;
		if (null !== deps && areHookInputsEqual(deps, prevState[1])) return prevState[0];
		hook.memoizedState = [callback, deps];
		return callback;
	}
	function updateMemo(nextCreate, deps) {
		var hook = updateWorkInProgressHook();
		deps = void 0 === deps ? null : deps;
		var prevState = hook.memoizedState;
		if (null !== deps && areHookInputsEqual(deps, prevState[1])) return prevState[0];
		prevState = nextCreate();
		if (shouldDoubleInvokeUserFnsInHooksDEV) {
			setIsStrictModeForDevtools(!0);
			try {
				nextCreate();
			} finally {
				setIsStrictModeForDevtools(!1);
			}
		}
		hook.memoizedState = [prevState, deps];
		return prevState;
	}
	function mountDeferredValueImpl(hook, value, initialValue) {
		if (void 0 === initialValue || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930)) return hook.memoizedState = value;
		hook.memoizedState = initialValue;
		hook = requestDeferredLane();
		currentlyRenderingFiber.lanes |= hook;
		workInProgressRootSkippedLanes |= hook;
		return initialValue;
	}
	function updateDeferredValueImpl(hook, prevValue, value, initialValue) {
		if (objectIs(value, prevValue)) return value;
		if (null !== currentTreeHiddenStackCursor.current) return hook = mountDeferredValueImpl(hook, value, initialValue), objectIs(hook, prevValue) || (didReceiveUpdate = !0), hook;
		if (0 === (renderLanes & 42) || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930)) return didReceiveUpdate = !0, hook.memoizedState = value;
		hook = requestDeferredLane();
		currentlyRenderingFiber.lanes |= hook;
		workInProgressRootSkippedLanes |= hook;
		return prevValue;
	}
	function startTransition(fiber, queue, pendingState, finishedState, callback) {
		var previousPriority = ReactDOMSharedInternals.p;
		ReactDOMSharedInternals.p = 0 !== previousPriority && 8 > previousPriority ? previousPriority : 8;
		var prevTransition = ReactSharedInternals.T, currentTransition = {};
		ReactSharedInternals.T = currentTransition;
		dispatchOptimisticSetState(fiber, !1, queue, pendingState);
		try {
			var returnValue = callback(), onStartTransitionFinish = ReactSharedInternals.S;
			null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
			if (null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then) dispatchSetStateInternal(fiber, queue, chainThenableValue(returnValue, finishedState), requestUpdateLane(fiber));
			else dispatchSetStateInternal(fiber, queue, finishedState, requestUpdateLane(fiber));
		} catch (error) {
			dispatchSetStateInternal(fiber, queue, {
				then: function() {},
				status: "rejected",
				reason: error
			}, requestUpdateLane());
		} finally {
			ReactDOMSharedInternals.p = previousPriority, null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
		}
	}
	function noop() {}
	function startHostTransition(formFiber, pendingState, action, formData) {
		if (5 !== formFiber.tag) throw Error(formatProdErrorMessage(476));
		var queue = ensureFormComponentIsStateful(formFiber).queue;
		startTransition(formFiber, queue, pendingState, sharedNotPendingObject, null === action ? noop : function() {
			requestFormReset$1(formFiber);
			return action(formData);
		});
	}
	function ensureFormComponentIsStateful(formFiber) {
		var existingStateHook = formFiber.memoizedState;
		if (null !== existingStateHook) return existingStateHook;
		existingStateHook = {
			memoizedState: sharedNotPendingObject,
			baseState: sharedNotPendingObject,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: basicStateReducer,
				lastRenderedState: sharedNotPendingObject
			},
			next: null
		};
		var initialResetState = {};
		existingStateHook.next = {
			memoizedState: initialResetState,
			baseState: initialResetState,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: basicStateReducer,
				lastRenderedState: initialResetState
			},
			next: null
		};
		formFiber.memoizedState = existingStateHook;
		formFiber = formFiber.alternate;
		null !== formFiber && (formFiber.memoizedState = existingStateHook);
		return existingStateHook;
	}
	function requestFormReset$1(formFiber) {
		var stateHook = ensureFormComponentIsStateful(formFiber);
		null === stateHook.next && (stateHook = formFiber.alternate.memoizedState);
		dispatchSetStateInternal(formFiber, stateHook.next.queue, {}, requestUpdateLane());
	}
	function useHostTransitionStatus() {
		return readContext(HostTransitionContext);
	}
	function updateId() {
		return updateWorkInProgressHook().memoizedState;
	}
	function updateRefresh() {
		return updateWorkInProgressHook().memoizedState;
	}
	function refreshCache(fiber) {
		for (var provider = fiber.return; null !== provider;) {
			switch (provider.tag) {
				case 24:
				case 3:
					var lane = requestUpdateLane();
					fiber = createUpdate(lane);
					var root$69 = enqueueUpdate(provider, fiber, lane);
					null !== root$69 && (scheduleUpdateOnFiber(root$69, provider, lane), entangleTransitions(root$69, provider, lane));
					provider = { cache: createCache() };
					fiber.payload = provider;
					return;
			}
			provider = provider.return;
		}
	}
	function dispatchReducerAction(fiber, queue, action) {
		var lane = requestUpdateLane();
		action = {
			lane,
			revertLane: 0,
			gesture: null,
			action,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		isRenderPhaseUpdate(fiber) ? enqueueRenderPhaseUpdate(queue, action) : (action = enqueueConcurrentHookUpdate(fiber, queue, action, lane), null !== action && (scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane)));
	}
	function dispatchSetState(fiber, queue, action) {
		dispatchSetStateInternal(fiber, queue, action, requestUpdateLane());
	}
	function dispatchSetStateInternal(fiber, queue, action, lane) {
		var update = {
			lane,
			revertLane: 0,
			gesture: null,
			action,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (isRenderPhaseUpdate(fiber)) enqueueRenderPhaseUpdate(queue, update);
		else {
			var alternate = fiber.alternate;
			if (0 === fiber.lanes && (null === alternate || 0 === alternate.lanes) && (alternate = queue.lastRenderedReducer, null !== alternate)) try {
				var currentState = queue.lastRenderedState, eagerState = alternate(currentState, action);
				update.hasEagerState = !0;
				update.eagerState = eagerState;
				if (objectIs(eagerState, currentState)) return enqueueUpdate$1(fiber, queue, update, 0), null === workInProgressRoot && finishQueueingConcurrentUpdates(), !1;
			} catch (error) {}
			action = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
			if (null !== action) return scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane), !0;
		}
		return !1;
	}
	function dispatchOptimisticSetState(fiber, throwIfDuringRender, queue, action) {
		action = {
			lane: 2,
			revertLane: requestTransitionLane(),
			gesture: null,
			action,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (isRenderPhaseUpdate(fiber)) {
			if (throwIfDuringRender) throw Error(formatProdErrorMessage(479));
		} else throwIfDuringRender = enqueueConcurrentHookUpdate(fiber, queue, action, 2), null !== throwIfDuringRender && scheduleUpdateOnFiber(throwIfDuringRender, fiber, 2);
	}
	function isRenderPhaseUpdate(fiber) {
		var alternate = fiber.alternate;
		return fiber === currentlyRenderingFiber || null !== alternate && alternate === currentlyRenderingFiber;
	}
	function enqueueRenderPhaseUpdate(queue, update) {
		didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = !0;
		var pending = queue.pending;
		null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
		queue.pending = update;
	}
	function entangleTransitionUpdate(root, queue, lane) {
		if (0 !== (lane & 4194048)) {
			var queueLanes = queue.lanes;
			queueLanes &= root.pendingLanes;
			lane |= queueLanes;
			queue.lanes = lane;
			markRootEntangled(root, lane);
		}
	}
	var ContextOnlyDispatcher = {
		readContext,
		use,
		useCallback: throwInvalidHookError,
		useContext: throwInvalidHookError,
		useEffect: throwInvalidHookError,
		useImperativeHandle: throwInvalidHookError,
		useLayoutEffect: throwInvalidHookError,
		useInsertionEffect: throwInvalidHookError,
		useMemo: throwInvalidHookError,
		useReducer: throwInvalidHookError,
		useRef: throwInvalidHookError,
		useState: throwInvalidHookError,
		useDebugValue: throwInvalidHookError,
		useDeferredValue: throwInvalidHookError,
		useTransition: throwInvalidHookError,
		useSyncExternalStore: throwInvalidHookError,
		useId: throwInvalidHookError,
		useHostTransitionStatus: throwInvalidHookError,
		useFormState: throwInvalidHookError,
		useActionState: throwInvalidHookError,
		useOptimistic: throwInvalidHookError,
		useMemoCache: throwInvalidHookError,
		useCacheRefresh: throwInvalidHookError
	};
	ContextOnlyDispatcher.useEffectEvent = throwInvalidHookError;
	var HooksDispatcherOnMount = {
		readContext,
		use,
		useCallback: function(callback, deps) {
			mountWorkInProgressHook().memoizedState = [callback, void 0 === deps ? null : deps];
			return callback;
		},
		useContext: readContext,
		useEffect: mountEffect,
		useImperativeHandle: function(ref, create, deps) {
			deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
			mountEffectImpl(4194308, 4, imperativeHandleEffect.bind(null, create, ref), deps);
		},
		useLayoutEffect: function(create, deps) {
			return mountEffectImpl(4194308, 4, create, deps);
		},
		useInsertionEffect: function(create, deps) {
			mountEffectImpl(4, 2, create, deps);
		},
		useMemo: function(nextCreate, deps) {
			var hook = mountWorkInProgressHook();
			deps = void 0 === deps ? null : deps;
			var nextValue = nextCreate();
			if (shouldDoubleInvokeUserFnsInHooksDEV) {
				setIsStrictModeForDevtools(!0);
				try {
					nextCreate();
				} finally {
					setIsStrictModeForDevtools(!1);
				}
			}
			hook.memoizedState = [nextValue, deps];
			return nextValue;
		},
		useReducer: function(reducer, initialArg, init) {
			var hook = mountWorkInProgressHook();
			if (void 0 !== init) {
				var initialState = init(initialArg);
				if (shouldDoubleInvokeUserFnsInHooksDEV) {
					setIsStrictModeForDevtools(!0);
					try {
						init(initialArg);
					} finally {
						setIsStrictModeForDevtools(!1);
					}
				}
			} else initialState = initialArg;
			hook.memoizedState = hook.baseState = initialState;
			reducer = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: reducer,
				lastRenderedState: initialState
			};
			hook.queue = reducer;
			reducer = reducer.dispatch = dispatchReducerAction.bind(null, currentlyRenderingFiber, reducer);
			return [hook.memoizedState, reducer];
		},
		useRef: function(initialValue) {
			var hook = mountWorkInProgressHook();
			initialValue = { current: initialValue };
			return hook.memoizedState = initialValue;
		},
		useState: function(initialState) {
			initialState = mountStateImpl(initialState);
			var queue = initialState.queue, dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
			queue.dispatch = dispatch;
			return [initialState.memoizedState, dispatch];
		},
		useDebugValue: mountDebugValue,
		useDeferredValue: function(value, initialValue) {
			return mountDeferredValueImpl(mountWorkInProgressHook(), value, initialValue);
		},
		useTransition: function() {
			var stateHook = mountStateImpl(!1);
			stateHook = startTransition.bind(null, currentlyRenderingFiber, stateHook.queue, !0, !1);
			mountWorkInProgressHook().memoizedState = stateHook;
			return [!1, stateHook];
		},
		useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
			var fiber = currentlyRenderingFiber, hook = mountWorkInProgressHook();
			if (isHydrating) {
				if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
				getServerSnapshot = getServerSnapshot();
			} else {
				getServerSnapshot = getSnapshot();
				if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
				0 !== (workInProgressRootRenderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
			}
			hook.memoizedState = getServerSnapshot;
			var inst = {
				value: getServerSnapshot,
				getSnapshot
			};
			hook.queue = inst;
			mountEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [subscribe]);
			fiber.flags |= 2048;
			pushSimpleEffect(9, { destroy: void 0 }, updateStoreInstance.bind(null, fiber, inst, getServerSnapshot, getSnapshot), null);
			return getServerSnapshot;
		},
		useId: function() {
			var hook = mountWorkInProgressHook(), identifierPrefix = workInProgressRoot.identifierPrefix;
			if (isHydrating) {
				var JSCompiler_inline_result = treeContextOverflow;
				var idWithLeadingBit = treeContextId;
				JSCompiler_inline_result = (idWithLeadingBit & ~(1 << 32 - clz32(idWithLeadingBit) - 1)).toString(32) + JSCompiler_inline_result;
				identifierPrefix = "_" + identifierPrefix + "R_" + JSCompiler_inline_result;
				JSCompiler_inline_result = localIdCounter++;
				0 < JSCompiler_inline_result && (identifierPrefix += "H" + JSCompiler_inline_result.toString(32));
				identifierPrefix += "_";
			} else JSCompiler_inline_result = globalClientIdCounter++, identifierPrefix = "_" + identifierPrefix + "r_" + JSCompiler_inline_result.toString(32) + "_";
			return hook.memoizedState = identifierPrefix;
		},
		useHostTransitionStatus,
		useFormState: mountActionState,
		useActionState: mountActionState,
		useOptimistic: function(passthrough) {
			var hook = mountWorkInProgressHook();
			hook.memoizedState = hook.baseState = passthrough;
			var queue = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			hook.queue = queue;
			hook = dispatchOptimisticSetState.bind(null, currentlyRenderingFiber, !0, queue);
			queue.dispatch = hook;
			return [passthrough, hook];
		},
		useMemoCache,
		useCacheRefresh: function() {
			return mountWorkInProgressHook().memoizedState = refreshCache.bind(null, currentlyRenderingFiber);
		},
		useEffectEvent: function(callback) {
			var hook = mountWorkInProgressHook(), ref = { impl: callback };
			hook.memoizedState = ref;
			return function() {
				if (0 !== (executionContext & 2)) throw Error(formatProdErrorMessage(440));
				return ref.impl.apply(void 0, arguments);
			};
		}
	}, HooksDispatcherOnUpdate = {
		readContext,
		use,
		useCallback: updateCallback,
		useContext: readContext,
		useEffect: updateEffect,
		useImperativeHandle: updateImperativeHandle,
		useInsertionEffect: updateInsertionEffect,
		useLayoutEffect: updateLayoutEffect,
		useMemo: updateMemo,
		useReducer: updateReducer,
		useRef: updateRef,
		useState: function() {
			return updateReducer(basicStateReducer);
		},
		useDebugValue: mountDebugValue,
		useDeferredValue: function(value, initialValue) {
			return updateDeferredValueImpl(updateWorkInProgressHook(), currentHook.memoizedState, value, initialValue);
		},
		useTransition: function() {
			var booleanOrThenable = updateReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
			return ["boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable), start];
		},
		useSyncExternalStore: updateSyncExternalStore,
		useId: updateId,
		useHostTransitionStatus,
		useFormState: updateActionState,
		useActionState: updateActionState,
		useOptimistic: function(passthrough, reducer) {
			return updateOptimisticImpl(updateWorkInProgressHook(), currentHook, passthrough, reducer);
		},
		useMemoCache,
		useCacheRefresh: updateRefresh
	};
	HooksDispatcherOnUpdate.useEffectEvent = updateEvent;
	var HooksDispatcherOnRerender = {
		readContext,
		use,
		useCallback: updateCallback,
		useContext: readContext,
		useEffect: updateEffect,
		useImperativeHandle: updateImperativeHandle,
		useInsertionEffect: updateInsertionEffect,
		useLayoutEffect: updateLayoutEffect,
		useMemo: updateMemo,
		useReducer: rerenderReducer,
		useRef: updateRef,
		useState: function() {
			return rerenderReducer(basicStateReducer);
		},
		useDebugValue: mountDebugValue,
		useDeferredValue: function(value, initialValue) {
			var hook = updateWorkInProgressHook();
			return null === currentHook ? mountDeferredValueImpl(hook, value, initialValue) : updateDeferredValueImpl(hook, currentHook.memoizedState, value, initialValue);
		},
		useTransition: function() {
			var booleanOrThenable = rerenderReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
			return ["boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable), start];
		},
		useSyncExternalStore: updateSyncExternalStore,
		useId: updateId,
		useHostTransitionStatus,
		useFormState: rerenderActionState,
		useActionState: rerenderActionState,
		useOptimistic: function(passthrough, reducer) {
			var hook = updateWorkInProgressHook();
			if (null !== currentHook) return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
			hook.baseState = passthrough;
			return [passthrough, hook.queue.dispatch];
		},
		useMemoCache,
		useCacheRefresh: updateRefresh
	};
	HooksDispatcherOnRerender.useEffectEvent = updateEvent;
	function applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, nextProps) {
		ctor = workInProgress.memoizedState;
		getDerivedStateFromProps = getDerivedStateFromProps(nextProps, ctor);
		getDerivedStateFromProps = null === getDerivedStateFromProps || void 0 === getDerivedStateFromProps ? ctor : assign({}, ctor, getDerivedStateFromProps);
		workInProgress.memoizedState = getDerivedStateFromProps;
		0 === workInProgress.lanes && (workInProgress.updateQueue.baseState = getDerivedStateFromProps);
	}
	var classComponentUpdater = {
		enqueueSetState: function(inst, payload, callback) {
			inst = inst._reactInternals;
			var lane = requestUpdateLane(), update = createUpdate(lane);
			update.payload = payload;
			void 0 !== callback && null !== callback && (update.callback = callback);
			payload = enqueueUpdate(inst, update, lane);
			null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
		},
		enqueueReplaceState: function(inst, payload, callback) {
			inst = inst._reactInternals;
			var lane = requestUpdateLane(), update = createUpdate(lane);
			update.tag = 1;
			update.payload = payload;
			void 0 !== callback && null !== callback && (update.callback = callback);
			payload = enqueueUpdate(inst, update, lane);
			null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
		},
		enqueueForceUpdate: function(inst, callback) {
			inst = inst._reactInternals;
			var lane = requestUpdateLane(), update = createUpdate(lane);
			update.tag = 2;
			void 0 !== callback && null !== callback && (update.callback = callback);
			callback = enqueueUpdate(inst, update, lane);
			null !== callback && (scheduleUpdateOnFiber(callback, inst, lane), entangleTransitions(callback, inst, lane));
		}
	};
	function checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext) {
		workInProgress = workInProgress.stateNode;
		return "function" === typeof workInProgress.shouldComponentUpdate ? workInProgress.shouldComponentUpdate(newProps, newState, nextContext) : ctor.prototype && ctor.prototype.isPureReactComponent ? !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState) : !0;
	}
	function callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext) {
		workInProgress = instance.state;
		"function" === typeof instance.componentWillReceiveProps && instance.componentWillReceiveProps(newProps, nextContext);
		"function" === typeof instance.UNSAFE_componentWillReceiveProps && instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
		instance.state !== workInProgress && classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
	}
	function resolveClassComponentProps(Component, baseProps) {
		var newProps = baseProps;
		if ("ref" in baseProps) {
			newProps = {};
			for (var propName in baseProps) "ref" !== propName && (newProps[propName] = baseProps[propName]);
		}
		if (Component = Component.defaultProps) {
			newProps === baseProps && (newProps = assign({}, newProps));
			for (var propName$73 in Component) void 0 === newProps[propName$73] && (newProps[propName$73] = Component[propName$73]);
		}
		return newProps;
	}
	function defaultOnUncaughtError(error) {
		reportGlobalError(error);
	}
	function defaultOnCaughtError(error) {
		console.error(error);
	}
	function defaultOnRecoverableError(error) {
		reportGlobalError(error);
	}
	function logUncaughtError(root, errorInfo) {
		try {
			var onUncaughtError = root.onUncaughtError;
			onUncaughtError(errorInfo.value, { componentStack: errorInfo.stack });
		} catch (e$74) {
			setTimeout(function() {
				throw e$74;
			});
		}
	}
	function logCaughtError(root, boundary, errorInfo) {
		try {
			var onCaughtError = root.onCaughtError;
			onCaughtError(errorInfo.value, {
				componentStack: errorInfo.stack,
				errorBoundary: 1 === boundary.tag ? boundary.stateNode : null
			});
		} catch (e$75) {
			setTimeout(function() {
				throw e$75;
			});
		}
	}
	function createRootErrorUpdate(root, errorInfo, lane) {
		lane = createUpdate(lane);
		lane.tag = 3;
		lane.payload = { element: null };
		lane.callback = function() {
			logUncaughtError(root, errorInfo);
		};
		return lane;
	}
	function createClassErrorUpdate(lane) {
		lane = createUpdate(lane);
		lane.tag = 3;
		return lane;
	}
	function initializeClassErrorUpdate(update, root, fiber, errorInfo) {
		var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
		if ("function" === typeof getDerivedStateFromError) {
			var error = errorInfo.value;
			update.payload = function() {
				return getDerivedStateFromError(error);
			};
			update.callback = function() {
				logCaughtError(root, fiber, errorInfo);
			};
		}
		var inst = fiber.stateNode;
		null !== inst && "function" === typeof inst.componentDidCatch && (update.callback = function() {
			logCaughtError(root, fiber, errorInfo);
			"function" !== typeof getDerivedStateFromError && (null === legacyErrorBoundariesThatAlreadyFailed ? legacyErrorBoundariesThatAlreadyFailed = new Set([this]) : legacyErrorBoundariesThatAlreadyFailed.add(this));
			var stack = errorInfo.stack;
			this.componentDidCatch(errorInfo.value, { componentStack: null !== stack ? stack : "" });
		});
	}
	function throwException(root, returnFiber, sourceFiber, value, rootRenderLanes) {
		sourceFiber.flags |= 32768;
		if (null !== value && "object" === typeof value && "function" === typeof value.then) {
			returnFiber = sourceFiber.alternate;
			null !== returnFiber && propagateParentContextChanges(returnFiber, sourceFiber, rootRenderLanes, !0);
			sourceFiber = suspenseHandlerStackCursor.current;
			if (null !== sourceFiber) {
				switch (sourceFiber.tag) {
					case 31:
					case 13: return null === shellBoundary ? renderDidSuspendDelayIfPossible() : null === sourceFiber.alternate && 0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 3), sourceFiber.flags &= -257, sourceFiber.flags |= 65536, sourceFiber.lanes = rootRenderLanes, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? sourceFiber.updateQueue = new Set([value]) : returnFiber.add(value), attachPingListener(root, value, rootRenderLanes)), !1;
					case 22: return sourceFiber.flags |= 65536, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? (returnFiber = {
						transitions: null,
						markerInstances: null,
						retryQueue: new Set([value])
					}, sourceFiber.updateQueue = returnFiber) : (sourceFiber = returnFiber.retryQueue, null === sourceFiber ? returnFiber.retryQueue = new Set([value]) : sourceFiber.add(value)), attachPingListener(root, value, rootRenderLanes)), !1;
				}
				throw Error(formatProdErrorMessage(435, sourceFiber.tag));
			}
			attachPingListener(root, value, rootRenderLanes);
			renderDidSuspendDelayIfPossible();
			return !1;
		}
		if (isHydrating) return returnFiber = suspenseHandlerStackCursor.current, null !== returnFiber ? (0 === (returnFiber.flags & 65536) && (returnFiber.flags |= 256), returnFiber.flags |= 65536, returnFiber.lanes = rootRenderLanes, value !== HydrationMismatchException && (root = Error(formatProdErrorMessage(422), { cause: value }), queueHydrationError(createCapturedValueAtFiber(root, sourceFiber)))) : (value !== HydrationMismatchException && (returnFiber = Error(formatProdErrorMessage(423), { cause: value }), queueHydrationError(createCapturedValueAtFiber(returnFiber, sourceFiber))), root = root.current.alternate, root.flags |= 65536, rootRenderLanes &= -rootRenderLanes, root.lanes |= rootRenderLanes, value = createCapturedValueAtFiber(value, sourceFiber), rootRenderLanes = createRootErrorUpdate(root.stateNode, value, rootRenderLanes), enqueueCapturedUpdate(root, rootRenderLanes), 4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2)), !1;
		var wrapperError = Error(formatProdErrorMessage(520), { cause: value });
		wrapperError = createCapturedValueAtFiber(wrapperError, sourceFiber);
		null === workInProgressRootConcurrentErrors ? workInProgressRootConcurrentErrors = [wrapperError] : workInProgressRootConcurrentErrors.push(wrapperError);
		4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2);
		if (null === returnFiber) return !0;
		value = createCapturedValueAtFiber(value, sourceFiber);
		sourceFiber = returnFiber;
		do {
			switch (sourceFiber.tag) {
				case 3: return sourceFiber.flags |= 65536, root = rootRenderLanes & -rootRenderLanes, sourceFiber.lanes |= root, root = createRootErrorUpdate(sourceFiber.stateNode, value, root), enqueueCapturedUpdate(sourceFiber, root), !1;
				case 1: if (returnFiber = sourceFiber.type, wrapperError = sourceFiber.stateNode, 0 === (sourceFiber.flags & 128) && ("function" === typeof returnFiber.getDerivedStateFromError || null !== wrapperError && "function" === typeof wrapperError.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(wrapperError)))) return sourceFiber.flags |= 65536, rootRenderLanes &= -rootRenderLanes, sourceFiber.lanes |= rootRenderLanes, rootRenderLanes = createClassErrorUpdate(rootRenderLanes), initializeClassErrorUpdate(rootRenderLanes, root, sourceFiber, value), enqueueCapturedUpdate(sourceFiber, rootRenderLanes), !1;
			}
			sourceFiber = sourceFiber.return;
		} while (null !== sourceFiber);
		return !1;
	}
	var SelectiveHydrationException = Error(formatProdErrorMessage(461)), didReceiveUpdate = !1;
	function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
		workInProgress.child = null === current ? mountChildFibers(workInProgress, null, nextChildren, renderLanes) : reconcileChildFibers(workInProgress, current.child, nextChildren, renderLanes);
	}
	function updateForwardRef(current, workInProgress, Component, nextProps, renderLanes) {
		Component = Component.render;
		var ref = workInProgress.ref;
		if ("ref" in nextProps) {
			var propsWithoutRef = {};
			for (var key in nextProps) "ref" !== key && (propsWithoutRef[key] = nextProps[key]);
		} else propsWithoutRef = nextProps;
		prepareToReadContext(workInProgress);
		nextProps = renderWithHooks(current, workInProgress, Component, propsWithoutRef, ref, renderLanes);
		key = checkDidRenderIdHook();
		if (null !== current && !didReceiveUpdate) return bailoutHooks(current, workInProgress, renderLanes), bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		isHydrating && key && pushMaterializedTreeId(workInProgress);
		workInProgress.flags |= 1;
		reconcileChildren(current, workInProgress, nextProps, renderLanes);
		return workInProgress.child;
	}
	function updateMemoComponent(current, workInProgress, Component, nextProps, renderLanes) {
		if (null === current) {
			var type = Component.type;
			if ("function" === typeof type && !shouldConstruct(type) && void 0 === type.defaultProps && null === Component.compare) return workInProgress.tag = 15, workInProgress.type = type, updateSimpleMemoComponent(current, workInProgress, type, nextProps, renderLanes);
			current = createFiberFromTypeAndProps(Component.type, null, nextProps, workInProgress, workInProgress.mode, renderLanes);
			current.ref = workInProgress.ref;
			current.return = workInProgress;
			return workInProgress.child = current;
		}
		type = current.child;
		if (!checkScheduledUpdateOrContext(current, renderLanes)) {
			var prevProps = type.memoizedProps;
			Component = Component.compare;
			Component = null !== Component ? Component : shallowEqual;
			if (Component(prevProps, nextProps) && current.ref === workInProgress.ref) return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		}
		workInProgress.flags |= 1;
		current = createWorkInProgress(type, nextProps);
		current.ref = workInProgress.ref;
		current.return = workInProgress;
		return workInProgress.child = current;
	}
	function updateSimpleMemoComponent(current, workInProgress, Component, nextProps, renderLanes) {
		if (null !== current) {
			var prevProps = current.memoizedProps;
			if (shallowEqual(prevProps, nextProps) && current.ref === workInProgress.ref) if (didReceiveUpdate = !1, workInProgress.pendingProps = nextProps = prevProps, checkScheduledUpdateOrContext(current, renderLanes)) 0 !== (current.flags & 131072) && (didReceiveUpdate = !0);
			else return workInProgress.lanes = current.lanes, bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		}
		return updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes);
	}
	function updateOffscreenComponent(current, workInProgress, renderLanes, nextProps) {
		var nextChildren = nextProps.children, prevState = null !== current ? current.memoizedState : null;
		null === current && null === workInProgress.stateNode && (workInProgress.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		});
		if ("hidden" === nextProps.mode) {
			if (0 !== (workInProgress.flags & 128)) {
				prevState = null !== prevState ? prevState.baseLanes | renderLanes : renderLanes;
				if (null !== current) {
					nextProps = workInProgress.child = current.child;
					for (nextChildren = 0; null !== nextProps;) nextChildren = nextChildren | nextProps.lanes | nextProps.childLanes, nextProps = nextProps.sibling;
					nextProps = nextChildren & ~prevState;
				} else nextProps = 0, workInProgress.child = null;
				return deferHiddenOffscreenComponent(current, workInProgress, prevState, renderLanes, nextProps);
			}
			if (0 !== (renderLanes & 536870912)) workInProgress.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, null !== current && pushTransition(workInProgress, null !== prevState ? prevState.cachePool : null), null !== prevState ? pushHiddenContext(workInProgress, prevState) : reuseHiddenContextOnStack(), pushOffscreenSuspenseHandler(workInProgress);
			else return nextProps = workInProgress.lanes = 536870912, deferHiddenOffscreenComponent(current, workInProgress, null !== prevState ? prevState.baseLanes | renderLanes : renderLanes, renderLanes, nextProps);
		} else null !== prevState ? (pushTransition(workInProgress, prevState.cachePool), pushHiddenContext(workInProgress, prevState), reuseSuspenseHandlerOnStack(workInProgress), workInProgress.memoizedState = null) : (null !== current && pushTransition(workInProgress, null), reuseHiddenContextOnStack(), reuseSuspenseHandlerOnStack(workInProgress));
		reconcileChildren(current, workInProgress, nextChildren, renderLanes);
		return workInProgress.child;
	}
	function bailoutOffscreenComponent(current, workInProgress) {
		null !== current && 22 === current.tag || null !== workInProgress.stateNode || (workInProgress.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		});
		return workInProgress.sibling;
	}
	function deferHiddenOffscreenComponent(current, workInProgress, nextBaseLanes, renderLanes, remainingChildLanes) {
		var JSCompiler_inline_result = peekCacheFromPool();
		JSCompiler_inline_result = null === JSCompiler_inline_result ? null : {
			parent: CacheContext._currentValue,
			pool: JSCompiler_inline_result
		};
		workInProgress.memoizedState = {
			baseLanes: nextBaseLanes,
			cachePool: JSCompiler_inline_result
		};
		null !== current && pushTransition(workInProgress, null);
		reuseHiddenContextOnStack();
		pushOffscreenSuspenseHandler(workInProgress);
		null !== current && propagateParentContextChanges(current, workInProgress, renderLanes, !0);
		workInProgress.childLanes = remainingChildLanes;
		return null;
	}
	function mountActivityChildren(workInProgress, nextProps) {
		nextProps = mountWorkInProgressOffscreenFiber({
			mode: nextProps.mode,
			children: nextProps.children
		}, workInProgress.mode);
		nextProps.ref = workInProgress.ref;
		workInProgress.child = nextProps;
		nextProps.return = workInProgress;
		return nextProps;
	}
	function retryActivityComponentWithoutHydrating(current, workInProgress, renderLanes) {
		reconcileChildFibers(workInProgress, current.child, null, renderLanes);
		current = mountActivityChildren(workInProgress, workInProgress.pendingProps);
		current.flags |= 2;
		popSuspenseHandler(workInProgress);
		workInProgress.memoizedState = null;
		return current;
	}
	function updateActivityComponent(current, workInProgress, renderLanes) {
		var nextProps = workInProgress.pendingProps, didSuspend = 0 !== (workInProgress.flags & 128);
		workInProgress.flags &= -129;
		if (null === current) {
			if (isHydrating) {
				if ("hidden" === nextProps.mode) return current = mountActivityChildren(workInProgress, nextProps), workInProgress.lanes = 536870912, bailoutOffscreenComponent(null, current);
				pushDehydratedActivitySuspenseHandler(workInProgress);
				(current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(current, rootOrSingletonContext), current = null !== current && "&" === current.data ? current : null, null !== current && (workInProgress.memoizedState = {
					dehydrated: current,
					treeContext: null !== treeContextProvider ? {
						id: treeContextId,
						overflow: treeContextOverflow
					} : null,
					retryLane: 536870912,
					hydrationErrors: null
				}, renderLanes = createFiberFromDehydratedFragment(current), renderLanes.return = workInProgress, workInProgress.child = renderLanes, hydrationParentFiber = workInProgress, nextHydratableInstance = null)) : current = null;
				if (null === current) throw throwOnHydrationMismatch(workInProgress);
				workInProgress.lanes = 536870912;
				return null;
			}
			return mountActivityChildren(workInProgress, nextProps);
		}
		var prevState = current.memoizedState;
		if (null !== prevState) {
			var dehydrated = prevState.dehydrated;
			pushDehydratedActivitySuspenseHandler(workInProgress);
			if (didSuspend) if (workInProgress.flags & 256) workInProgress.flags &= -257, workInProgress = retryActivityComponentWithoutHydrating(current, workInProgress, renderLanes);
			else if (null !== workInProgress.memoizedState) workInProgress.child = current.child, workInProgress.flags |= 128, workInProgress = null;
			else throw Error(formatProdErrorMessage(558));
			else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress, renderLanes, !1), didSuspend = 0 !== (renderLanes & current.childLanes), didReceiveUpdate || didSuspend) {
				nextProps = workInProgressRoot;
				if (null !== nextProps && (dehydrated = getBumpedLaneForHydration(nextProps, renderLanes), 0 !== dehydrated && dehydrated !== prevState.retryLane)) throw prevState.retryLane = dehydrated, enqueueConcurrentRenderForLane(current, dehydrated), scheduleUpdateOnFiber(nextProps, current, dehydrated), SelectiveHydrationException;
				renderDidSuspendDelayIfPossible();
				workInProgress = retryActivityComponentWithoutHydrating(current, workInProgress, renderLanes);
			} else current = prevState.treeContext, nextHydratableInstance = getNextHydratable(dehydrated.nextSibling), hydrationParentFiber = workInProgress, isHydrating = !0, hydrationErrors = null, rootOrSingletonContext = !1, null !== current && restoreSuspendedTreeContext(workInProgress, current), workInProgress = mountActivityChildren(workInProgress, nextProps), workInProgress.flags |= 4096;
			return workInProgress;
		}
		current = createWorkInProgress(current.child, {
			mode: nextProps.mode,
			children: nextProps.children
		});
		current.ref = workInProgress.ref;
		workInProgress.child = current;
		current.return = workInProgress;
		return current;
	}
	function markRef(current, workInProgress) {
		var ref = workInProgress.ref;
		if (null === ref) null !== current && null !== current.ref && (workInProgress.flags |= 4194816);
		else {
			if ("function" !== typeof ref && "object" !== typeof ref) throw Error(formatProdErrorMessage(284));
			if (null === current || current.ref !== ref) workInProgress.flags |= 4194816;
		}
	}
	function updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes) {
		prepareToReadContext(workInProgress);
		Component = renderWithHooks(current, workInProgress, Component, nextProps, void 0, renderLanes);
		nextProps = checkDidRenderIdHook();
		if (null !== current && !didReceiveUpdate) return bailoutHooks(current, workInProgress, renderLanes), bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		isHydrating && nextProps && pushMaterializedTreeId(workInProgress);
		workInProgress.flags |= 1;
		reconcileChildren(current, workInProgress, Component, renderLanes);
		return workInProgress.child;
	}
	function replayFunctionComponent(current, workInProgress, nextProps, Component, secondArg, renderLanes) {
		prepareToReadContext(workInProgress);
		workInProgress.updateQueue = null;
		nextProps = renderWithHooksAgain(workInProgress, Component, nextProps, secondArg);
		finishRenderingHooks(current);
		Component = checkDidRenderIdHook();
		if (null !== current && !didReceiveUpdate) return bailoutHooks(current, workInProgress, renderLanes), bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		isHydrating && Component && pushMaterializedTreeId(workInProgress);
		workInProgress.flags |= 1;
		reconcileChildren(current, workInProgress, nextProps, renderLanes);
		return workInProgress.child;
	}
	function updateClassComponent(current, workInProgress, Component, nextProps, renderLanes) {
		prepareToReadContext(workInProgress);
		if (null === workInProgress.stateNode) {
			var context = emptyContextObject, contextType = Component.contextType;
			"object" === typeof contextType && null !== contextType && (context = readContext(contextType));
			context = new Component(nextProps, context);
			workInProgress.memoizedState = null !== context.state && void 0 !== context.state ? context.state : null;
			context.updater = classComponentUpdater;
			workInProgress.stateNode = context;
			context._reactInternals = workInProgress;
			context = workInProgress.stateNode;
			context.props = nextProps;
			context.state = workInProgress.memoizedState;
			context.refs = {};
			initializeUpdateQueue(workInProgress);
			contextType = Component.contextType;
			context.context = "object" === typeof contextType && null !== contextType ? readContext(contextType) : emptyContextObject;
			context.state = workInProgress.memoizedState;
			contextType = Component.getDerivedStateFromProps;
			"function" === typeof contextType && (applyDerivedStateFromProps(workInProgress, Component, contextType, nextProps), context.state = workInProgress.memoizedState);
			"function" === typeof Component.getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || (contextType = context.state, "function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount(), contextType !== context.state && classComponentUpdater.enqueueReplaceState(context, context.state, null), processUpdateQueue(workInProgress, nextProps, context, renderLanes), suspendIfUpdateReadFromEntangledAsyncAction(), context.state = workInProgress.memoizedState);
			"function" === typeof context.componentDidMount && (workInProgress.flags |= 4194308);
			nextProps = !0;
		} else if (null === current) {
			context = workInProgress.stateNode;
			var unresolvedOldProps = workInProgress.memoizedProps, oldProps = resolveClassComponentProps(Component, unresolvedOldProps);
			context.props = oldProps;
			var oldContext = context.context, contextType$jscomp$0 = Component.contextType;
			contextType = emptyContextObject;
			"object" === typeof contextType$jscomp$0 && null !== contextType$jscomp$0 && (contextType = readContext(contextType$jscomp$0));
			var getDerivedStateFromProps = Component.getDerivedStateFromProps;
			contextType$jscomp$0 = "function" === typeof getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate;
			unresolvedOldProps = workInProgress.pendingProps !== unresolvedOldProps;
			contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (unresolvedOldProps || oldContext !== contextType) && callComponentWillReceiveProps(workInProgress, context, nextProps, contextType);
			hasForceUpdate = !1;
			var oldState = workInProgress.memoizedState;
			context.state = oldState;
			processUpdateQueue(workInProgress, nextProps, context, renderLanes);
			suspendIfUpdateReadFromEntangledAsyncAction();
			oldContext = workInProgress.memoizedState;
			unresolvedOldProps || oldState !== oldContext || hasForceUpdate ? ("function" === typeof getDerivedStateFromProps && (applyDerivedStateFromProps(workInProgress, Component, getDerivedStateFromProps, nextProps), oldContext = workInProgress.memoizedState), (oldProps = hasForceUpdate || checkShouldComponentUpdate(workInProgress, Component, oldProps, nextProps, oldState, oldContext, contextType)) ? (contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || ("function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount()), "function" === typeof context.componentDidMount && (workInProgress.flags |= 4194308)) : ("function" === typeof context.componentDidMount && (workInProgress.flags |= 4194308), workInProgress.memoizedProps = nextProps, workInProgress.memoizedState = oldContext), context.props = nextProps, context.state = oldContext, context.context = contextType, nextProps = oldProps) : ("function" === typeof context.componentDidMount && (workInProgress.flags |= 4194308), nextProps = !1);
		} else {
			context = workInProgress.stateNode;
			cloneUpdateQueue(current, workInProgress);
			contextType = workInProgress.memoizedProps;
			contextType$jscomp$0 = resolveClassComponentProps(Component, contextType);
			context.props = contextType$jscomp$0;
			getDerivedStateFromProps = workInProgress.pendingProps;
			oldState = context.context;
			oldContext = Component.contextType;
			oldProps = emptyContextObject;
			"object" === typeof oldContext && null !== oldContext && (oldProps = readContext(oldContext));
			unresolvedOldProps = Component.getDerivedStateFromProps;
			(oldContext = "function" === typeof unresolvedOldProps || "function" === typeof context.getSnapshotBeforeUpdate) || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (contextType !== getDerivedStateFromProps || oldState !== oldProps) && callComponentWillReceiveProps(workInProgress, context, nextProps, oldProps);
			hasForceUpdate = !1;
			oldState = workInProgress.memoizedState;
			context.state = oldState;
			processUpdateQueue(workInProgress, nextProps, context, renderLanes);
			suspendIfUpdateReadFromEntangledAsyncAction();
			var newState = workInProgress.memoizedState;
			contextType !== getDerivedStateFromProps || oldState !== newState || hasForceUpdate || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies) ? ("function" === typeof unresolvedOldProps && (applyDerivedStateFromProps(workInProgress, Component, unresolvedOldProps, nextProps), newState = workInProgress.memoizedState), (contextType$jscomp$0 = hasForceUpdate || checkShouldComponentUpdate(workInProgress, Component, contextType$jscomp$0, nextProps, oldState, newState, oldProps) || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies)) ? (oldContext || "function" !== typeof context.UNSAFE_componentWillUpdate && "function" !== typeof context.componentWillUpdate || ("function" === typeof context.componentWillUpdate && context.componentWillUpdate(nextProps, newState, oldProps), "function" === typeof context.UNSAFE_componentWillUpdate && context.UNSAFE_componentWillUpdate(nextProps, newState, oldProps)), "function" === typeof context.componentDidUpdate && (workInProgress.flags |= 4), "function" === typeof context.getSnapshotBeforeUpdate && (workInProgress.flags |= 1024)) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress.flags |= 1024), workInProgress.memoizedProps = nextProps, workInProgress.memoizedState = newState), context.props = nextProps, context.state = newState, context.context = oldProps, nextProps = contextType$jscomp$0) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress.flags |= 1024), nextProps = !1);
		}
		context = nextProps;
		markRef(current, workInProgress);
		nextProps = 0 !== (workInProgress.flags & 128);
		context || nextProps ? (context = workInProgress.stateNode, Component = nextProps && "function" !== typeof Component.getDerivedStateFromError ? null : context.render(), workInProgress.flags |= 1, null !== current && nextProps ? (workInProgress.child = reconcileChildFibers(workInProgress, current.child, null, renderLanes), workInProgress.child = reconcileChildFibers(workInProgress, null, Component, renderLanes)) : reconcileChildren(current, workInProgress, Component, renderLanes), workInProgress.memoizedState = context.state, current = workInProgress.child) : current = bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
		return current;
	}
	function mountHostRootWithoutHydrating(current, workInProgress, nextChildren, renderLanes) {
		resetHydrationState();
		workInProgress.flags |= 256;
		reconcileChildren(current, workInProgress, nextChildren, renderLanes);
		return workInProgress.child;
	}
	var SUSPENDED_MARKER = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function mountSuspenseOffscreenState(renderLanes) {
		return {
			baseLanes: renderLanes,
			cachePool: getSuspendedCache()
		};
	}
	function getRemainingWorkInPrimaryTree(current, primaryTreeDidDefer, renderLanes) {
		current = null !== current ? current.childLanes & ~renderLanes : 0;
		primaryTreeDidDefer && (current |= workInProgressDeferredLane);
		return current;
	}
	function updateSuspenseComponent(current, workInProgress, renderLanes) {
		var nextProps = workInProgress.pendingProps, showFallback = !1, didSuspend = 0 !== (workInProgress.flags & 128), JSCompiler_temp;
		(JSCompiler_temp = didSuspend) || (JSCompiler_temp = null !== current && null === current.memoizedState ? !1 : 0 !== (suspenseStackCursor.current & 2));
		JSCompiler_temp && (showFallback = !0, workInProgress.flags &= -129);
		JSCompiler_temp = 0 !== (workInProgress.flags & 32);
		workInProgress.flags &= -33;
		if (null === current) {
			if (isHydrating) {
				showFallback ? pushPrimaryTreeSuspenseHandler(workInProgress) : reuseSuspenseHandlerOnStack(workInProgress);
				(current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(current, rootOrSingletonContext), current = null !== current && "&" !== current.data ? current : null, null !== current && (workInProgress.memoizedState = {
					dehydrated: current,
					treeContext: null !== treeContextProvider ? {
						id: treeContextId,
						overflow: treeContextOverflow
					} : null,
					retryLane: 536870912,
					hydrationErrors: null
				}, renderLanes = createFiberFromDehydratedFragment(current), renderLanes.return = workInProgress, workInProgress.child = renderLanes, hydrationParentFiber = workInProgress, nextHydratableInstance = null)) : current = null;
				if (null === current) throw throwOnHydrationMismatch(workInProgress);
				isSuspenseInstanceFallback(current) ? workInProgress.lanes = 32 : workInProgress.lanes = 536870912;
				return null;
			}
			var nextPrimaryChildren = nextProps.children;
			nextProps = nextProps.fallback;
			if (showFallback) return reuseSuspenseHandlerOnStack(workInProgress), showFallback = workInProgress.mode, nextPrimaryChildren = mountWorkInProgressOffscreenFiber({
				mode: "hidden",
				children: nextPrimaryChildren
			}, showFallback), nextProps = createFiberFromFragment(nextProps, showFallback, renderLanes, null), nextPrimaryChildren.return = workInProgress, nextProps.return = workInProgress, nextPrimaryChildren.sibling = nextProps, workInProgress.child = nextPrimaryChildren, nextProps = workInProgress.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes), nextProps.childLanes = getRemainingWorkInPrimaryTree(current, JSCompiler_temp, renderLanes), workInProgress.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(null, nextProps);
			pushPrimaryTreeSuspenseHandler(workInProgress);
			return mountSuspensePrimaryChildren(workInProgress, nextPrimaryChildren);
		}
		var prevState = current.memoizedState;
		if (null !== prevState && (nextPrimaryChildren = prevState.dehydrated, null !== nextPrimaryChildren)) {
			if (didSuspend) workInProgress.flags & 256 ? (pushPrimaryTreeSuspenseHandler(workInProgress), workInProgress.flags &= -257, workInProgress = retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes)) : null !== workInProgress.memoizedState ? (reuseSuspenseHandlerOnStack(workInProgress), workInProgress.child = current.child, workInProgress.flags |= 128, workInProgress = null) : (reuseSuspenseHandlerOnStack(workInProgress), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress.mode, nextProps = mountWorkInProgressOffscreenFiber({
				mode: "visible",
				children: nextProps.children
			}, showFallback), nextPrimaryChildren = createFiberFromFragment(nextPrimaryChildren, showFallback, renderLanes, null), nextPrimaryChildren.flags |= 2, nextProps.return = workInProgress, nextPrimaryChildren.return = workInProgress, nextProps.sibling = nextPrimaryChildren, workInProgress.child = nextProps, reconcileChildFibers(workInProgress, current.child, null, renderLanes), nextProps = workInProgress.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes), nextProps.childLanes = getRemainingWorkInPrimaryTree(current, JSCompiler_temp, renderLanes), workInProgress.memoizedState = SUSPENDED_MARKER, workInProgress = bailoutOffscreenComponent(null, nextProps));
			else if (pushPrimaryTreeSuspenseHandler(workInProgress), isSuspenseInstanceFallback(nextPrimaryChildren)) {
				JSCompiler_temp = nextPrimaryChildren.nextSibling && nextPrimaryChildren.nextSibling.dataset;
				if (JSCompiler_temp) var digest = JSCompiler_temp.dgst;
				JSCompiler_temp = digest;
				nextProps = Error(formatProdErrorMessage(419));
				nextProps.stack = "";
				nextProps.digest = JSCompiler_temp;
				queueHydrationError({
					value: nextProps,
					source: null,
					stack: null
				});
				workInProgress = retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
			} else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress, renderLanes, !1), JSCompiler_temp = 0 !== (renderLanes & current.childLanes), didReceiveUpdate || JSCompiler_temp) {
				JSCompiler_temp = workInProgressRoot;
				if (null !== JSCompiler_temp && (nextProps = getBumpedLaneForHydration(JSCompiler_temp, renderLanes), 0 !== nextProps && nextProps !== prevState.retryLane)) throw prevState.retryLane = nextProps, enqueueConcurrentRenderForLane(current, nextProps), scheduleUpdateOnFiber(JSCompiler_temp, current, nextProps), SelectiveHydrationException;
				isSuspenseInstancePending(nextPrimaryChildren) || renderDidSuspendDelayIfPossible();
				workInProgress = retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes);
			} else isSuspenseInstancePending(nextPrimaryChildren) ? (workInProgress.flags |= 192, workInProgress.child = current.child, workInProgress = null) : (current = prevState.treeContext, nextHydratableInstance = getNextHydratable(nextPrimaryChildren.nextSibling), hydrationParentFiber = workInProgress, isHydrating = !0, hydrationErrors = null, rootOrSingletonContext = !1, null !== current && restoreSuspendedTreeContext(workInProgress, current), workInProgress = mountSuspensePrimaryChildren(workInProgress, nextProps.children), workInProgress.flags |= 4096);
			return workInProgress;
		}
		if (showFallback) return reuseSuspenseHandlerOnStack(workInProgress), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress.mode, prevState = current.child, digest = prevState.sibling, nextProps = createWorkInProgress(prevState, {
			mode: "hidden",
			children: nextProps.children
		}), nextProps.subtreeFlags = prevState.subtreeFlags & 65011712, null !== digest ? nextPrimaryChildren = createWorkInProgress(digest, nextPrimaryChildren) : (nextPrimaryChildren = createFiberFromFragment(nextPrimaryChildren, showFallback, renderLanes, null), nextPrimaryChildren.flags |= 2), nextPrimaryChildren.return = workInProgress, nextProps.return = workInProgress, nextProps.sibling = nextPrimaryChildren, workInProgress.child = nextProps, bailoutOffscreenComponent(null, nextProps), nextProps = workInProgress.child, nextPrimaryChildren = current.child.memoizedState, null === nextPrimaryChildren ? nextPrimaryChildren = mountSuspenseOffscreenState(renderLanes) : (showFallback = nextPrimaryChildren.cachePool, null !== showFallback ? (prevState = CacheContext._currentValue, showFallback = showFallback.parent !== prevState ? {
			parent: prevState,
			pool: prevState
		} : showFallback) : showFallback = getSuspendedCache(), nextPrimaryChildren = {
			baseLanes: nextPrimaryChildren.baseLanes | renderLanes,
			cachePool: showFallback
		}), nextProps.memoizedState = nextPrimaryChildren, nextProps.childLanes = getRemainingWorkInPrimaryTree(current, JSCompiler_temp, renderLanes), workInProgress.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(current.child, nextProps);
		pushPrimaryTreeSuspenseHandler(workInProgress);
		renderLanes = current.child;
		current = renderLanes.sibling;
		renderLanes = createWorkInProgress(renderLanes, {
			mode: "visible",
			children: nextProps.children
		});
		renderLanes.return = workInProgress;
		renderLanes.sibling = null;
		null !== current && (JSCompiler_temp = workInProgress.deletions, null === JSCompiler_temp ? (workInProgress.deletions = [current], workInProgress.flags |= 16) : JSCompiler_temp.push(current));
		workInProgress.child = renderLanes;
		workInProgress.memoizedState = null;
		return renderLanes;
	}
	function mountSuspensePrimaryChildren(workInProgress, primaryChildren) {
		primaryChildren = mountWorkInProgressOffscreenFiber({
			mode: "visible",
			children: primaryChildren
		}, workInProgress.mode);
		primaryChildren.return = workInProgress;
		return workInProgress.child = primaryChildren;
	}
	function mountWorkInProgressOffscreenFiber(offscreenProps, mode) {
		offscreenProps = createFiberImplClass(22, offscreenProps, null, mode);
		offscreenProps.lanes = 0;
		return offscreenProps;
	}
	function retrySuspenseComponentWithoutHydrating(current, workInProgress, renderLanes) {
		reconcileChildFibers(workInProgress, current.child, null, renderLanes);
		current = mountSuspensePrimaryChildren(workInProgress, workInProgress.pendingProps.children);
		current.flags |= 2;
		workInProgress.memoizedState = null;
		return current;
	}
	function scheduleSuspenseWorkOnFiber(fiber, renderLanes, propagationRoot) {
		fiber.lanes |= renderLanes;
		var alternate = fiber.alternate;
		null !== alternate && (alternate.lanes |= renderLanes);
		scheduleContextWorkOnParentPath(fiber.return, renderLanes, propagationRoot);
	}
	function initSuspenseListRenderState(workInProgress, isBackwards, tail, lastContentRow, tailMode, treeForkCount) {
		var renderState = workInProgress.memoizedState;
		null === renderState ? workInProgress.memoizedState = {
			isBackwards,
			rendering: null,
			renderingStartTime: 0,
			last: lastContentRow,
			tail,
			tailMode,
			treeForkCount
		} : (renderState.isBackwards = isBackwards, renderState.rendering = null, renderState.renderingStartTime = 0, renderState.last = lastContentRow, renderState.tail = tail, renderState.tailMode = tailMode, renderState.treeForkCount = treeForkCount);
	}
	function updateSuspenseListComponent(current, workInProgress, renderLanes) {
		var nextProps = workInProgress.pendingProps, revealOrder = nextProps.revealOrder, tailMode = nextProps.tail;
		nextProps = nextProps.children;
		var suspenseContext = suspenseStackCursor.current, shouldForceFallback = 0 !== (suspenseContext & 2);
		shouldForceFallback ? (suspenseContext = suspenseContext & 1 | 2, workInProgress.flags |= 128) : suspenseContext &= 1;
		push(suspenseStackCursor, suspenseContext);
		reconcileChildren(current, workInProgress, nextProps, renderLanes);
		nextProps = isHydrating ? treeForkCount : 0;
		if (!shouldForceFallback && null !== current && 0 !== (current.flags & 128)) a: for (current = workInProgress.child; null !== current;) {
			if (13 === current.tag) null !== current.memoizedState && scheduleSuspenseWorkOnFiber(current, renderLanes, workInProgress);
			else if (19 === current.tag) scheduleSuspenseWorkOnFiber(current, renderLanes, workInProgress);
			else if (null !== current.child) {
				current.child.return = current;
				current = current.child;
				continue;
			}
			if (current === workInProgress) break a;
			for (; null === current.sibling;) {
				if (null === current.return || current.return === workInProgress) break a;
				current = current.return;
			}
			current.sibling.return = current.return;
			current = current.sibling;
		}
		switch (revealOrder) {
			case "forwards":
				renderLanes = workInProgress.child;
				for (revealOrder = null; null !== renderLanes;) current = renderLanes.alternate, null !== current && null === findFirstSuspended(current) && (revealOrder = renderLanes), renderLanes = renderLanes.sibling;
				renderLanes = revealOrder;
				null === renderLanes ? (revealOrder = workInProgress.child, workInProgress.child = null) : (revealOrder = renderLanes.sibling, renderLanes.sibling = null);
				initSuspenseListRenderState(workInProgress, !1, revealOrder, renderLanes, tailMode, nextProps);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				renderLanes = null;
				revealOrder = workInProgress.child;
				for (workInProgress.child = null; null !== revealOrder;) {
					current = revealOrder.alternate;
					if (null !== current && null === findFirstSuspended(current)) {
						workInProgress.child = revealOrder;
						break;
					}
					current = revealOrder.sibling;
					revealOrder.sibling = renderLanes;
					renderLanes = revealOrder;
					revealOrder = current;
				}
				initSuspenseListRenderState(workInProgress, !0, renderLanes, null, tailMode, nextProps);
				break;
			case "together":
				initSuspenseListRenderState(workInProgress, !1, null, null, void 0, nextProps);
				break;
			default: workInProgress.memoizedState = null;
		}
		return workInProgress.child;
	}
	function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
		null !== current && (workInProgress.dependencies = current.dependencies);
		workInProgressRootSkippedLanes |= workInProgress.lanes;
		if (0 === (renderLanes & workInProgress.childLanes)) if (null !== current) {
			if (propagateParentContextChanges(current, workInProgress, renderLanes, !1), 0 === (renderLanes & workInProgress.childLanes)) return null;
		} else return null;
		if (null !== current && workInProgress.child !== current.child) throw Error(formatProdErrorMessage(153));
		if (null !== workInProgress.child) {
			current = workInProgress.child;
			renderLanes = createWorkInProgress(current, current.pendingProps);
			workInProgress.child = renderLanes;
			for (renderLanes.return = workInProgress; null !== current.sibling;) current = current.sibling, renderLanes = renderLanes.sibling = createWorkInProgress(current, current.pendingProps), renderLanes.return = workInProgress;
			renderLanes.sibling = null;
		}
		return workInProgress.child;
	}
	function checkScheduledUpdateOrContext(current, renderLanes) {
		if (0 !== (current.lanes & renderLanes)) return !0;
		current = current.dependencies;
		return null !== current && checkIfContextChanged(current) ? !0 : !1;
	}
	function attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress, renderLanes) {
		switch (workInProgress.tag) {
			case 3:
				pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
				pushProvider(workInProgress, CacheContext, current.memoizedState.cache);
				resetHydrationState();
				break;
			case 27:
			case 5:
				pushHostContext(workInProgress);
				break;
			case 4:
				pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
				break;
			case 10:
				pushProvider(workInProgress, workInProgress.type, workInProgress.memoizedProps.value);
				break;
			case 31:
				if (null !== workInProgress.memoizedState) return workInProgress.flags |= 128, pushDehydratedActivitySuspenseHandler(workInProgress), null;
				break;
			case 13:
				var state$102 = workInProgress.memoizedState;
				if (null !== state$102) {
					if (null !== state$102.dehydrated) return pushPrimaryTreeSuspenseHandler(workInProgress), workInProgress.flags |= 128, null;
					if (0 !== (renderLanes & workInProgress.child.childLanes)) return updateSuspenseComponent(current, workInProgress, renderLanes);
					pushPrimaryTreeSuspenseHandler(workInProgress);
					current = bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
					return null !== current ? current.sibling : null;
				}
				pushPrimaryTreeSuspenseHandler(workInProgress);
				break;
			case 19:
				var didSuspendBefore = 0 !== (current.flags & 128);
				state$102 = 0 !== (renderLanes & workInProgress.childLanes);
				state$102 || (propagateParentContextChanges(current, workInProgress, renderLanes, !1), state$102 = 0 !== (renderLanes & workInProgress.childLanes));
				if (didSuspendBefore) {
					if (state$102) return updateSuspenseListComponent(current, workInProgress, renderLanes);
					workInProgress.flags |= 128;
				}
				didSuspendBefore = workInProgress.memoizedState;
				null !== didSuspendBefore && (didSuspendBefore.rendering = null, didSuspendBefore.tail = null, didSuspendBefore.lastEffect = null);
				push(suspenseStackCursor, suspenseStackCursor.current);
				if (state$102) break;
				else return null;
			case 22: return workInProgress.lanes = 0, updateOffscreenComponent(current, workInProgress, renderLanes, workInProgress.pendingProps);
			case 24: pushProvider(workInProgress, CacheContext, current.memoizedState.cache);
		}
		return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
	}
	function beginWork(current, workInProgress, renderLanes) {
		if (null !== current) if (current.memoizedProps !== workInProgress.pendingProps) didReceiveUpdate = !0;
		else {
			if (!checkScheduledUpdateOrContext(current, renderLanes) && 0 === (workInProgress.flags & 128)) return didReceiveUpdate = !1, attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress, renderLanes);
			didReceiveUpdate = 0 !== (current.flags & 131072) ? !0 : !1;
		}
		else didReceiveUpdate = !1, isHydrating && 0 !== (workInProgress.flags & 1048576) && pushTreeId(workInProgress, treeForkCount, workInProgress.index);
		workInProgress.lanes = 0;
		switch (workInProgress.tag) {
			case 16:
				a: {
					var props = workInProgress.pendingProps;
					current = resolveLazy(workInProgress.elementType);
					workInProgress.type = current;
					if ("function" === typeof current) shouldConstruct(current) ? (props = resolveClassComponentProps(current, props), workInProgress.tag = 1, workInProgress = updateClassComponent(null, workInProgress, current, props, renderLanes)) : (workInProgress.tag = 0, workInProgress = updateFunctionComponent(null, workInProgress, current, props, renderLanes));
					else {
						if (void 0 !== current && null !== current) {
							var $$typeof = current.$$typeof;
							if ($$typeof === REACT_FORWARD_REF_TYPE) {
								workInProgress.tag = 11;
								workInProgress = updateForwardRef(null, workInProgress, current, props, renderLanes);
								break a;
							} else if ($$typeof === REACT_MEMO_TYPE) {
								workInProgress.tag = 14;
								workInProgress = updateMemoComponent(null, workInProgress, current, props, renderLanes);
								break a;
							}
						}
						workInProgress = getComponentNameFromType(current) || current;
						throw Error(formatProdErrorMessage(306, workInProgress, ""));
					}
				}
				return workInProgress;
			case 0: return updateFunctionComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
			case 1: return props = workInProgress.type, $$typeof = resolveClassComponentProps(props, workInProgress.pendingProps), updateClassComponent(current, workInProgress, props, $$typeof, renderLanes);
			case 3:
				a: {
					pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
					if (null === current) throw Error(formatProdErrorMessage(387));
					props = workInProgress.pendingProps;
					var prevState = workInProgress.memoizedState;
					$$typeof = prevState.element;
					cloneUpdateQueue(current, workInProgress);
					processUpdateQueue(workInProgress, props, null, renderLanes);
					var nextState = workInProgress.memoizedState;
					props = nextState.cache;
					pushProvider(workInProgress, CacheContext, props);
					props !== prevState.cache && propagateContextChanges(workInProgress, [CacheContext], renderLanes, !0);
					suspendIfUpdateReadFromEntangledAsyncAction();
					props = nextState.element;
					if (prevState.isDehydrated) if (prevState = {
						element: props,
						isDehydrated: !1,
						cache: nextState.cache
					}, workInProgress.updateQueue.baseState = prevState, workInProgress.memoizedState = prevState, workInProgress.flags & 256) {
						workInProgress = mountHostRootWithoutHydrating(current, workInProgress, props, renderLanes);
						break a;
					} else if (props !== $$typeof) {
						$$typeof = createCapturedValueAtFiber(Error(formatProdErrorMessage(424)), workInProgress);
						queueHydrationError($$typeof);
						workInProgress = mountHostRootWithoutHydrating(current, workInProgress, props, renderLanes);
						break a;
					} else {
						current = workInProgress.stateNode.containerInfo;
						switch (current.nodeType) {
							case 9:
								current = current.body;
								break;
							default: current = "HTML" === current.nodeName ? current.ownerDocument.body : current;
						}
						nextHydratableInstance = getNextHydratable(current.firstChild);
						hydrationParentFiber = workInProgress;
						isHydrating = !0;
						hydrationErrors = null;
						rootOrSingletonContext = !0;
						renderLanes = mountChildFibers(workInProgress, null, props, renderLanes);
						for (workInProgress.child = renderLanes; renderLanes;) renderLanes.flags = renderLanes.flags & -3 | 4096, renderLanes = renderLanes.sibling;
					}
					else {
						resetHydrationState();
						if (props === $$typeof) {
							workInProgress = bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
							break a;
						}
						reconcileChildren(current, workInProgress, props, renderLanes);
					}
					workInProgress = workInProgress.child;
				}
				return workInProgress;
			case 26: return markRef(current, workInProgress), null === current ? (renderLanes = getResource(workInProgress.type, null, workInProgress.pendingProps, null)) ? workInProgress.memoizedState = renderLanes : isHydrating || (renderLanes = workInProgress.type, current = workInProgress.pendingProps, props = getOwnerDocumentFromRootContainer(rootInstanceStackCursor.current).createElement(renderLanes), props[internalInstanceKey] = workInProgress, props[internalPropsKey] = current, setInitialProperties(props, renderLanes, current), markNodeAsHoistable(props), workInProgress.stateNode = props) : workInProgress.memoizedState = getResource(workInProgress.type, current.memoizedProps, workInProgress.pendingProps, current.memoizedState), null;
			case 27: return pushHostContext(workInProgress), null === current && isHydrating && (props = workInProgress.stateNode = resolveSingletonInstance(workInProgress.type, workInProgress.pendingProps, rootInstanceStackCursor.current), hydrationParentFiber = workInProgress, rootOrSingletonContext = !0, $$typeof = nextHydratableInstance, isSingletonScope(workInProgress.type) ? (previousHydratableOnEnteringScopedSingleton = $$typeof, nextHydratableInstance = getNextHydratable(props.firstChild)) : nextHydratableInstance = $$typeof), reconcileChildren(current, workInProgress, workInProgress.pendingProps.children, renderLanes), markRef(current, workInProgress), null === current && (workInProgress.flags |= 4194304), workInProgress.child;
			case 5:
				if (null === current && isHydrating) {
					if ($$typeof = props = nextHydratableInstance) props = canHydrateInstance(props, workInProgress.type, workInProgress.pendingProps, rootOrSingletonContext), null !== props ? (workInProgress.stateNode = props, hydrationParentFiber = workInProgress, nextHydratableInstance = getNextHydratable(props.firstChild), rootOrSingletonContext = !1, $$typeof = !0) : $$typeof = !1;
					$$typeof || throwOnHydrationMismatch(workInProgress);
				}
				pushHostContext(workInProgress);
				$$typeof = workInProgress.type;
				prevState = workInProgress.pendingProps;
				nextState = null !== current ? current.memoizedProps : null;
				props = prevState.children;
				shouldSetTextContent($$typeof, prevState) ? props = null : null !== nextState && shouldSetTextContent($$typeof, nextState) && (workInProgress.flags |= 32);
				null !== workInProgress.memoizedState && ($$typeof = renderWithHooks(current, workInProgress, TransitionAwareHostComponent, null, null, renderLanes), HostTransitionContext._currentValue = $$typeof);
				markRef(current, workInProgress);
				reconcileChildren(current, workInProgress, props, renderLanes);
				return workInProgress.child;
			case 6:
				if (null === current && isHydrating) {
					if (current = renderLanes = nextHydratableInstance) renderLanes = canHydrateTextInstance(renderLanes, workInProgress.pendingProps, rootOrSingletonContext), null !== renderLanes ? (workInProgress.stateNode = renderLanes, hydrationParentFiber = workInProgress, nextHydratableInstance = null, current = !0) : current = !1;
					current || throwOnHydrationMismatch(workInProgress);
				}
				return null;
			case 13: return updateSuspenseComponent(current, workInProgress, renderLanes);
			case 4: return pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo), props = workInProgress.pendingProps, null === current ? workInProgress.child = reconcileChildFibers(workInProgress, null, props, renderLanes) : reconcileChildren(current, workInProgress, props, renderLanes), workInProgress.child;
			case 11: return updateForwardRef(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
			case 7: return reconcileChildren(current, workInProgress, workInProgress.pendingProps, renderLanes), workInProgress.child;
			case 8: return reconcileChildren(current, workInProgress, workInProgress.pendingProps.children, renderLanes), workInProgress.child;
			case 12: return reconcileChildren(current, workInProgress, workInProgress.pendingProps.children, renderLanes), workInProgress.child;
			case 10: return props = workInProgress.pendingProps, pushProvider(workInProgress, workInProgress.type, props.value), reconcileChildren(current, workInProgress, props.children, renderLanes), workInProgress.child;
			case 9: return $$typeof = workInProgress.type._context, props = workInProgress.pendingProps.children, prepareToReadContext(workInProgress), $$typeof = readContext($$typeof), props = props($$typeof), workInProgress.flags |= 1, reconcileChildren(current, workInProgress, props, renderLanes), workInProgress.child;
			case 14: return updateMemoComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
			case 15: return updateSimpleMemoComponent(current, workInProgress, workInProgress.type, workInProgress.pendingProps, renderLanes);
			case 19: return updateSuspenseListComponent(current, workInProgress, renderLanes);
			case 31: return updateActivityComponent(current, workInProgress, renderLanes);
			case 22: return updateOffscreenComponent(current, workInProgress, renderLanes, workInProgress.pendingProps);
			case 24: return prepareToReadContext(workInProgress), props = readContext(CacheContext), null === current ? ($$typeof = peekCacheFromPool(), null === $$typeof && ($$typeof = workInProgressRoot, prevState = createCache(), $$typeof.pooledCache = prevState, prevState.refCount++, null !== prevState && ($$typeof.pooledCacheLanes |= renderLanes), $$typeof = prevState), workInProgress.memoizedState = {
				parent: props,
				cache: $$typeof
			}, initializeUpdateQueue(workInProgress), pushProvider(workInProgress, CacheContext, $$typeof)) : (0 !== (current.lanes & renderLanes) && (cloneUpdateQueue(current, workInProgress), processUpdateQueue(workInProgress, null, null, renderLanes), suspendIfUpdateReadFromEntangledAsyncAction()), $$typeof = current.memoizedState, prevState = workInProgress.memoizedState, $$typeof.parent !== props ? ($$typeof = {
				parent: props,
				cache: props
			}, workInProgress.memoizedState = $$typeof, 0 === workInProgress.lanes && (workInProgress.memoizedState = workInProgress.updateQueue.baseState = $$typeof), pushProvider(workInProgress, CacheContext, props)) : (props = prevState.cache, pushProvider(workInProgress, CacheContext, props), props !== $$typeof.cache && propagateContextChanges(workInProgress, [CacheContext], renderLanes, !0))), reconcileChildren(current, workInProgress, workInProgress.pendingProps.children, renderLanes), workInProgress.child;
			case 29: throw workInProgress.pendingProps;
		}
		throw Error(formatProdErrorMessage(156, workInProgress.tag));
	}
	function markUpdate(workInProgress) {
		workInProgress.flags |= 4;
	}
	function preloadInstanceAndSuspendIfNeeded(workInProgress, type, oldProps, newProps, renderLanes) {
		if (type = 0 !== (workInProgress.mode & 32)) type = !1;
		if (type) {
			if (workInProgress.flags |= 16777216, (renderLanes & 335544128) === renderLanes) if (workInProgress.stateNode.complete) workInProgress.flags |= 8192;
			else if (shouldRemainOnPreviousScreen()) workInProgress.flags |= 8192;
			else throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
		} else workInProgress.flags &= -16777217;
	}
	function preloadResourceAndSuspendIfNeeded(workInProgress, resource) {
		if ("stylesheet" !== resource.type || 0 !== (resource.state.loading & 4)) workInProgress.flags &= -16777217;
		else if (workInProgress.flags |= 16777216, !preloadResource(resource)) if (shouldRemainOnPreviousScreen()) workInProgress.flags |= 8192;
		else throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
	}
	function scheduleRetryEffect(workInProgress, retryQueue) {
		null !== retryQueue && (workInProgress.flags |= 4);
		workInProgress.flags & 16384 && (retryQueue = 22 !== workInProgress.tag ? claimNextRetryLane() : 536870912, workInProgress.lanes |= retryQueue, workInProgressSuspendedRetryLanes |= retryQueue);
	}
	function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
		if (!isHydrating) switch (renderState.tailMode) {
			case "hidden":
				hasRenderedATailFallback = renderState.tail;
				for (var lastTailNode = null; null !== hasRenderedATailFallback;) null !== hasRenderedATailFallback.alternate && (lastTailNode = hasRenderedATailFallback), hasRenderedATailFallback = hasRenderedATailFallback.sibling;
				null === lastTailNode ? renderState.tail = null : lastTailNode.sibling = null;
				break;
			case "collapsed":
				lastTailNode = renderState.tail;
				for (var lastTailNode$106 = null; null !== lastTailNode;) null !== lastTailNode.alternate && (lastTailNode$106 = lastTailNode), lastTailNode = lastTailNode.sibling;
				null === lastTailNode$106 ? hasRenderedATailFallback || null === renderState.tail ? renderState.tail = null : renderState.tail.sibling = null : lastTailNode$106.sibling = null;
		}
	}
	function bubbleProperties(completedWork) {
		var didBailout = null !== completedWork.alternate && completedWork.alternate.child === completedWork.child, newChildLanes = 0, subtreeFlags = 0;
		if (didBailout) for (var child$107 = completedWork.child; null !== child$107;) newChildLanes |= child$107.lanes | child$107.childLanes, subtreeFlags |= child$107.subtreeFlags & 65011712, subtreeFlags |= child$107.flags & 65011712, child$107.return = completedWork, child$107 = child$107.sibling;
		else for (child$107 = completedWork.child; null !== child$107;) newChildLanes |= child$107.lanes | child$107.childLanes, subtreeFlags |= child$107.subtreeFlags, subtreeFlags |= child$107.flags, child$107.return = completedWork, child$107 = child$107.sibling;
		completedWork.subtreeFlags |= subtreeFlags;
		completedWork.childLanes = newChildLanes;
		return didBailout;
	}
	function completeWork(current, workInProgress, renderLanes) {
		var newProps = workInProgress.pendingProps;
		popTreeContext(workInProgress);
		switch (workInProgress.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return bubbleProperties(workInProgress), null;
			case 1: return bubbleProperties(workInProgress), null;
			case 3:
				renderLanes = workInProgress.stateNode;
				newProps = null;
				null !== current && (newProps = current.memoizedState.cache);
				workInProgress.memoizedState.cache !== newProps && (workInProgress.flags |= 2048);
				popProvider(CacheContext);
				popHostContainer();
				renderLanes.pendingContext && (renderLanes.context = renderLanes.pendingContext, renderLanes.pendingContext = null);
				if (null === current || null === current.child) popHydrationState(workInProgress) ? markUpdate(workInProgress) : null === current || current.memoizedState.isDehydrated && 0 === (workInProgress.flags & 256) || (workInProgress.flags |= 1024, upgradeHydrationErrorsToRecoverable());
				bubbleProperties(workInProgress);
				return null;
			case 26:
				var type = workInProgress.type, nextResource = workInProgress.memoizedState;
				null === current ? (markUpdate(workInProgress), null !== nextResource ? (bubbleProperties(workInProgress), preloadResourceAndSuspendIfNeeded(workInProgress, nextResource)) : (bubbleProperties(workInProgress), preloadInstanceAndSuspendIfNeeded(workInProgress, type, null, newProps, renderLanes))) : nextResource ? nextResource !== current.memoizedState ? (markUpdate(workInProgress), bubbleProperties(workInProgress), preloadResourceAndSuspendIfNeeded(workInProgress, nextResource)) : (bubbleProperties(workInProgress), workInProgress.flags &= -16777217) : (current = current.memoizedProps, current !== newProps && markUpdate(workInProgress), bubbleProperties(workInProgress), preloadInstanceAndSuspendIfNeeded(workInProgress, type, current, newProps, renderLanes));
				return null;
			case 27:
				popHostContext(workInProgress);
				renderLanes = rootInstanceStackCursor.current;
				type = workInProgress.type;
				if (null !== current && null != workInProgress.stateNode) current.memoizedProps !== newProps && markUpdate(workInProgress);
				else {
					if (!newProps) {
						if (null === workInProgress.stateNode) throw Error(formatProdErrorMessage(166));
						bubbleProperties(workInProgress);
						return null;
					}
					current = contextStackCursor.current;
					popHydrationState(workInProgress) ? prepareToHydrateHostInstance(workInProgress, current) : (current = resolveSingletonInstance(type, newProps, renderLanes), workInProgress.stateNode = current, markUpdate(workInProgress));
				}
				bubbleProperties(workInProgress);
				return null;
			case 5:
				popHostContext(workInProgress);
				type = workInProgress.type;
				if (null !== current && null != workInProgress.stateNode) current.memoizedProps !== newProps && markUpdate(workInProgress);
				else {
					if (!newProps) {
						if (null === workInProgress.stateNode) throw Error(formatProdErrorMessage(166));
						bubbleProperties(workInProgress);
						return null;
					}
					nextResource = contextStackCursor.current;
					if (popHydrationState(workInProgress)) prepareToHydrateHostInstance(workInProgress, nextResource);
					else {
						var ownerDocument = getOwnerDocumentFromRootContainer(rootInstanceStackCursor.current);
						switch (nextResource) {
							case 1:
								nextResource = ownerDocument.createElementNS("http://www.w3.org/2000/svg", type);
								break;
							case 2:
								nextResource = ownerDocument.createElementNS("http://www.w3.org/1998/Math/MathML", type);
								break;
							default: switch (type) {
								case "svg":
									nextResource = ownerDocument.createElementNS("http://www.w3.org/2000/svg", type);
									break;
								case "math":
									nextResource = ownerDocument.createElementNS("http://www.w3.org/1998/Math/MathML", type);
									break;
								case "script":
									nextResource = ownerDocument.createElement("div");
									nextResource.innerHTML = "<script><\/script>";
									nextResource = nextResource.removeChild(nextResource.firstChild);
									break;
								case "select":
									nextResource = "string" === typeof newProps.is ? ownerDocument.createElement("select", { is: newProps.is }) : ownerDocument.createElement("select");
									newProps.multiple ? nextResource.multiple = !0 : newProps.size && (nextResource.size = newProps.size);
									break;
								default: nextResource = "string" === typeof newProps.is ? ownerDocument.createElement(type, { is: newProps.is }) : ownerDocument.createElement(type);
							}
						}
						nextResource[internalInstanceKey] = workInProgress;
						nextResource[internalPropsKey] = newProps;
						a: for (ownerDocument = workInProgress.child; null !== ownerDocument;) {
							if (5 === ownerDocument.tag || 6 === ownerDocument.tag) nextResource.appendChild(ownerDocument.stateNode);
							else if (4 !== ownerDocument.tag && 27 !== ownerDocument.tag && null !== ownerDocument.child) {
								ownerDocument.child.return = ownerDocument;
								ownerDocument = ownerDocument.child;
								continue;
							}
							if (ownerDocument === workInProgress) break a;
							for (; null === ownerDocument.sibling;) {
								if (null === ownerDocument.return || ownerDocument.return === workInProgress) break a;
								ownerDocument = ownerDocument.return;
							}
							ownerDocument.sibling.return = ownerDocument.return;
							ownerDocument = ownerDocument.sibling;
						}
						workInProgress.stateNode = nextResource;
						a: switch (setInitialProperties(nextResource, type, newProps), type) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								newProps = !!newProps.autoFocus;
								break a;
							case "img":
								newProps = !0;
								break a;
							default: newProps = !1;
						}
						newProps && markUpdate(workInProgress);
					}
				}
				bubbleProperties(workInProgress);
				preloadInstanceAndSuspendIfNeeded(workInProgress, workInProgress.type, null === current ? null : current.memoizedProps, workInProgress.pendingProps, renderLanes);
				return null;
			case 6:
				if (current && null != workInProgress.stateNode) current.memoizedProps !== newProps && markUpdate(workInProgress);
				else {
					if ("string" !== typeof newProps && null === workInProgress.stateNode) throw Error(formatProdErrorMessage(166));
					current = rootInstanceStackCursor.current;
					if (popHydrationState(workInProgress)) {
						current = workInProgress.stateNode;
						renderLanes = workInProgress.memoizedProps;
						newProps = null;
						type = hydrationParentFiber;
						if (null !== type) switch (type.tag) {
							case 27:
							case 5: newProps = type.memoizedProps;
						}
						current[internalInstanceKey] = workInProgress;
						current = current.nodeValue === renderLanes || null !== newProps && !0 === newProps.suppressHydrationWarning || checkForUnmatchedText(current.nodeValue, renderLanes) ? !0 : !1;
						current || throwOnHydrationMismatch(workInProgress, !0);
					} else current = getOwnerDocumentFromRootContainer(current).createTextNode(newProps), current[internalInstanceKey] = workInProgress, workInProgress.stateNode = current;
				}
				bubbleProperties(workInProgress);
				return null;
			case 31:
				renderLanes = workInProgress.memoizedState;
				if (null === current || null !== current.memoizedState) {
					newProps = popHydrationState(workInProgress);
					if (null !== renderLanes) {
						if (null === current) {
							if (!newProps) throw Error(formatProdErrorMessage(318));
							current = workInProgress.memoizedState;
							current = null !== current ? current.dehydrated : null;
							if (!current) throw Error(formatProdErrorMessage(557));
							current[internalInstanceKey] = workInProgress;
						} else resetHydrationState(), 0 === (workInProgress.flags & 128) && (workInProgress.memoizedState = null), workInProgress.flags |= 4;
						bubbleProperties(workInProgress);
						current = !1;
					} else renderLanes = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = renderLanes), current = !0;
					if (!current) {
						if (workInProgress.flags & 256) return popSuspenseHandler(workInProgress), workInProgress;
						popSuspenseHandler(workInProgress);
						return null;
					}
					if (0 !== (workInProgress.flags & 128)) throw Error(formatProdErrorMessage(558));
				}
				bubbleProperties(workInProgress);
				return null;
			case 13:
				newProps = workInProgress.memoizedState;
				if (null === current || null !== current.memoizedState && null !== current.memoizedState.dehydrated) {
					type = popHydrationState(workInProgress);
					if (null !== newProps && null !== newProps.dehydrated) {
						if (null === current) {
							if (!type) throw Error(formatProdErrorMessage(318));
							type = workInProgress.memoizedState;
							type = null !== type ? type.dehydrated : null;
							if (!type) throw Error(formatProdErrorMessage(317));
							type[internalInstanceKey] = workInProgress;
						} else resetHydrationState(), 0 === (workInProgress.flags & 128) && (workInProgress.memoizedState = null), workInProgress.flags |= 4;
						bubbleProperties(workInProgress);
						type = !1;
					} else type = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = type), type = !0;
					if (!type) {
						if (workInProgress.flags & 256) return popSuspenseHandler(workInProgress), workInProgress;
						popSuspenseHandler(workInProgress);
						return null;
					}
				}
				popSuspenseHandler(workInProgress);
				if (0 !== (workInProgress.flags & 128)) return workInProgress.lanes = renderLanes, workInProgress;
				renderLanes = null !== newProps;
				current = null !== current && null !== current.memoizedState;
				renderLanes && (newProps = workInProgress.child, type = null, null !== newProps.alternate && null !== newProps.alternate.memoizedState && null !== newProps.alternate.memoizedState.cachePool && (type = newProps.alternate.memoizedState.cachePool.pool), nextResource = null, null !== newProps.memoizedState && null !== newProps.memoizedState.cachePool && (nextResource = newProps.memoizedState.cachePool.pool), nextResource !== type && (newProps.flags |= 2048));
				renderLanes !== current && renderLanes && (workInProgress.child.flags |= 8192);
				scheduleRetryEffect(workInProgress, workInProgress.updateQueue);
				bubbleProperties(workInProgress);
				return null;
			case 4: return popHostContainer(), null === current && listenToAllSupportedEvents(workInProgress.stateNode.containerInfo), bubbleProperties(workInProgress), null;
			case 10: return popProvider(workInProgress.type), bubbleProperties(workInProgress), null;
			case 19:
				pop(suspenseStackCursor);
				newProps = workInProgress.memoizedState;
				if (null === newProps) return bubbleProperties(workInProgress), null;
				type = 0 !== (workInProgress.flags & 128);
				nextResource = newProps.rendering;
				if (null === nextResource) if (type) cutOffTailIfNeeded(newProps, !1);
				else {
					if (0 !== workInProgressRootExitStatus || null !== current && 0 !== (current.flags & 128)) for (current = workInProgress.child; null !== current;) {
						nextResource = findFirstSuspended(current);
						if (null !== nextResource) {
							workInProgress.flags |= 128;
							cutOffTailIfNeeded(newProps, !1);
							current = nextResource.updateQueue;
							workInProgress.updateQueue = current;
							scheduleRetryEffect(workInProgress, current);
							workInProgress.subtreeFlags = 0;
							current = renderLanes;
							for (renderLanes = workInProgress.child; null !== renderLanes;) resetWorkInProgress(renderLanes, current), renderLanes = renderLanes.sibling;
							push(suspenseStackCursor, suspenseStackCursor.current & 1 | 2);
							isHydrating && pushTreeFork(workInProgress, newProps.treeForkCount);
							return workInProgress.child;
						}
						current = current.sibling;
					}
					null !== newProps.tail && now() > workInProgressRootRenderTargetTime && (workInProgress.flags |= 128, type = !0, cutOffTailIfNeeded(newProps, !1), workInProgress.lanes = 4194304);
				}
				else {
					if (!type) if (current = findFirstSuspended(nextResource), null !== current) {
						if (workInProgress.flags |= 128, type = !0, current = current.updateQueue, workInProgress.updateQueue = current, scheduleRetryEffect(workInProgress, current), cutOffTailIfNeeded(newProps, !0), null === newProps.tail && "hidden" === newProps.tailMode && !nextResource.alternate && !isHydrating) return bubbleProperties(workInProgress), null;
					} else 2 * now() - newProps.renderingStartTime > workInProgressRootRenderTargetTime && 536870912 !== renderLanes && (workInProgress.flags |= 128, type = !0, cutOffTailIfNeeded(newProps, !1), workInProgress.lanes = 4194304);
					newProps.isBackwards ? (nextResource.sibling = workInProgress.child, workInProgress.child = nextResource) : (current = newProps.last, null !== current ? current.sibling = nextResource : workInProgress.child = nextResource, newProps.last = nextResource);
				}
				if (null !== newProps.tail) return current = newProps.tail, newProps.rendering = current, newProps.tail = current.sibling, newProps.renderingStartTime = now(), current.sibling = null, renderLanes = suspenseStackCursor.current, push(suspenseStackCursor, type ? renderLanes & 1 | 2 : renderLanes & 1), isHydrating && pushTreeFork(workInProgress, newProps.treeForkCount), current;
				bubbleProperties(workInProgress);
				return null;
			case 22:
			case 23: return popSuspenseHandler(workInProgress), popHiddenContext(), newProps = null !== workInProgress.memoizedState, null !== current ? null !== current.memoizedState !== newProps && (workInProgress.flags |= 8192) : newProps && (workInProgress.flags |= 8192), newProps ? 0 !== (renderLanes & 536870912) && 0 === (workInProgress.flags & 128) && (bubbleProperties(workInProgress), workInProgress.subtreeFlags & 6 && (workInProgress.flags |= 8192)) : bubbleProperties(workInProgress), renderLanes = workInProgress.updateQueue, null !== renderLanes && scheduleRetryEffect(workInProgress, renderLanes.retryQueue), renderLanes = null, null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (renderLanes = current.memoizedState.cachePool.pool), newProps = null, null !== workInProgress.memoizedState && null !== workInProgress.memoizedState.cachePool && (newProps = workInProgress.memoizedState.cachePool.pool), newProps !== renderLanes && (workInProgress.flags |= 2048), null !== current && pop(resumedCache), null;
			case 24: return renderLanes = null, null !== current && (renderLanes = current.memoizedState.cache), workInProgress.memoizedState.cache !== renderLanes && (workInProgress.flags |= 2048), popProvider(CacheContext), bubbleProperties(workInProgress), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(formatProdErrorMessage(156, workInProgress.tag));
	}
	function unwindWork(current, workInProgress) {
		popTreeContext(workInProgress);
		switch (workInProgress.tag) {
			case 1: return current = workInProgress.flags, current & 65536 ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
			case 3: return popProvider(CacheContext), popHostContainer(), current = workInProgress.flags, 0 !== (current & 65536) && 0 === (current & 128) ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
			case 26:
			case 27:
			case 5: return popHostContext(workInProgress), null;
			case 31:
				if (null !== workInProgress.memoizedState) {
					popSuspenseHandler(workInProgress);
					if (null === workInProgress.alternate) throw Error(formatProdErrorMessage(340));
					resetHydrationState();
				}
				current = workInProgress.flags;
				return current & 65536 ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
			case 13:
				popSuspenseHandler(workInProgress);
				current = workInProgress.memoizedState;
				if (null !== current && null !== current.dehydrated) {
					if (null === workInProgress.alternate) throw Error(formatProdErrorMessage(340));
					resetHydrationState();
				}
				current = workInProgress.flags;
				return current & 65536 ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
			case 19: return pop(suspenseStackCursor), null;
			case 4: return popHostContainer(), null;
			case 10: return popProvider(workInProgress.type), null;
			case 22:
			case 23: return popSuspenseHandler(workInProgress), popHiddenContext(), null !== current && pop(resumedCache), current = workInProgress.flags, current & 65536 ? (workInProgress.flags = current & -65537 | 128, workInProgress) : null;
			case 24: return popProvider(CacheContext), null;
			case 25: return null;
			default: return null;
		}
	}
	function unwindInterruptedWork(current, interruptedWork) {
		popTreeContext(interruptedWork);
		switch (interruptedWork.tag) {
			case 3:
				popProvider(CacheContext);
				popHostContainer();
				break;
			case 26:
			case 27:
			case 5:
				popHostContext(interruptedWork);
				break;
			case 4:
				popHostContainer();
				break;
			case 31:
				null !== interruptedWork.memoizedState && popSuspenseHandler(interruptedWork);
				break;
			case 13:
				popSuspenseHandler(interruptedWork);
				break;
			case 19:
				pop(suspenseStackCursor);
				break;
			case 10:
				popProvider(interruptedWork.type);
				break;
			case 22:
			case 23:
				popSuspenseHandler(interruptedWork);
				popHiddenContext();
				null !== current && pop(resumedCache);
				break;
			case 24: popProvider(CacheContext);
		}
	}
	function commitHookEffectListMount(flags, finishedWork) {
		try {
			var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
			if (null !== lastEffect) {
				var firstEffect = lastEffect.next;
				updateQueue = firstEffect;
				do {
					if ((updateQueue.tag & flags) === flags) {
						lastEffect = void 0;
						var create = updateQueue.create, inst = updateQueue.inst;
						lastEffect = create();
						inst.destroy = lastEffect;
					}
					updateQueue = updateQueue.next;
				} while (updateQueue !== firstEffect);
			}
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	function commitHookEffectListUnmount(flags, finishedWork, nearestMountedAncestor$jscomp$0) {
		try {
			var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
			if (null !== lastEffect) {
				var firstEffect = lastEffect.next;
				updateQueue = firstEffect;
				do {
					if ((updateQueue.tag & flags) === flags) {
						var inst = updateQueue.inst, destroy = inst.destroy;
						if (void 0 !== destroy) {
							inst.destroy = void 0;
							lastEffect = finishedWork;
							var nearestMountedAncestor = nearestMountedAncestor$jscomp$0, destroy_ = destroy;
							try {
								destroy_();
							} catch (error) {
								captureCommitPhaseError(lastEffect, nearestMountedAncestor, error);
							}
						}
					}
					updateQueue = updateQueue.next;
				} while (updateQueue !== firstEffect);
			}
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	function commitClassCallbacks(finishedWork) {
		var updateQueue = finishedWork.updateQueue;
		if (null !== updateQueue) {
			var instance = finishedWork.stateNode;
			try {
				commitCallbacks(updateQueue, instance);
			} catch (error) {
				captureCommitPhaseError(finishedWork, finishedWork.return, error);
			}
		}
	}
	function safelyCallComponentWillUnmount(current, nearestMountedAncestor, instance) {
		instance.props = resolveClassComponentProps(current.type, current.memoizedProps);
		instance.state = current.memoizedState;
		try {
			instance.componentWillUnmount();
		} catch (error) {
			captureCommitPhaseError(current, nearestMountedAncestor, error);
		}
	}
	function safelyAttachRef(current, nearestMountedAncestor) {
		try {
			var ref = current.ref;
			if (null !== ref) {
				switch (current.tag) {
					case 26:
					case 27:
					case 5:
						var instanceToUse = current.stateNode;
						break;
					case 30:
						instanceToUse = current.stateNode;
						break;
					default: instanceToUse = current.stateNode;
				}
				"function" === typeof ref ? current.refCleanup = ref(instanceToUse) : ref.current = instanceToUse;
			}
		} catch (error) {
			captureCommitPhaseError(current, nearestMountedAncestor, error);
		}
	}
	function safelyDetachRef(current, nearestMountedAncestor) {
		var ref = current.ref, refCleanup = current.refCleanup;
		if (null !== ref) if ("function" === typeof refCleanup) try {
			refCleanup();
		} catch (error) {
			captureCommitPhaseError(current, nearestMountedAncestor, error);
		} finally {
			current.refCleanup = null, current = current.alternate, null != current && (current.refCleanup = null);
		}
		else if ("function" === typeof ref) try {
			ref(null);
		} catch (error$140) {
			captureCommitPhaseError(current, nearestMountedAncestor, error$140);
		}
		else ref.current = null;
	}
	function commitHostMount(finishedWork) {
		var type = finishedWork.type, props = finishedWork.memoizedProps, instance = finishedWork.stateNode;
		try {
			a: switch (type) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					props.autoFocus && instance.focus();
					break a;
				case "img": props.src ? instance.src = props.src : props.srcSet && (instance.srcset = props.srcSet);
			}
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	function commitHostUpdate(finishedWork, newProps, oldProps) {
		try {
			var domElement = finishedWork.stateNode;
			updateProperties(domElement, finishedWork.type, oldProps, newProps);
			domElement[internalPropsKey] = newProps;
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	function isHostParent(fiber) {
		return 5 === fiber.tag || 3 === fiber.tag || 26 === fiber.tag || 27 === fiber.tag && isSingletonScope(fiber.type) || 4 === fiber.tag;
	}
	function getHostSibling(fiber) {
		a: for (;;) {
			for (; null === fiber.sibling;) {
				if (null === fiber.return || isHostParent(fiber.return)) return null;
				fiber = fiber.return;
			}
			fiber.sibling.return = fiber.return;
			for (fiber = fiber.sibling; 5 !== fiber.tag && 6 !== fiber.tag && 18 !== fiber.tag;) {
				if (27 === fiber.tag && isSingletonScope(fiber.type)) continue a;
				if (fiber.flags & 2) continue a;
				if (null === fiber.child || 4 === fiber.tag) continue a;
				else fiber.child.return = fiber, fiber = fiber.child;
			}
			if (!(fiber.flags & 2)) return fiber.stateNode;
		}
	}
	function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
		var tag = node.tag;
		if (5 === tag || 6 === tag) node = node.stateNode, before ? (9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent).insertBefore(node, before) : (before = 9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent, before.appendChild(node), parent = parent._reactRootContainer, null !== parent && void 0 !== parent || null !== before.onclick || (before.onclick = noop$1));
		else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode, before = null), node = node.child, null !== node)) for (insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling; null !== node;) insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling;
	}
	function insertOrAppendPlacementNode(node, before, parent) {
		var tag = node.tag;
		if (5 === tag || 6 === tag) node = node.stateNode, before ? parent.insertBefore(node, before) : parent.appendChild(node);
		else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode), node = node.child, null !== node)) for (insertOrAppendPlacementNode(node, before, parent), node = node.sibling; null !== node;) insertOrAppendPlacementNode(node, before, parent), node = node.sibling;
	}
	function commitHostSingletonAcquisition(finishedWork) {
		var singleton = finishedWork.stateNode, props = finishedWork.memoizedProps;
		try {
			for (var type = finishedWork.type, attributes = singleton.attributes; attributes.length;) singleton.removeAttributeNode(attributes[0]);
			setInitialProperties(singleton, type, props);
			singleton[internalInstanceKey] = finishedWork;
			singleton[internalPropsKey] = props;
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	var offscreenSubtreeIsHidden = !1, offscreenSubtreeWasHidden = !1, needsFormReset = !1, PossiblyWeakSet = "function" === typeof WeakSet ? WeakSet : Set, nextEffect = null;
	function commitBeforeMutationEffects(root, firstChild) {
		root = root.containerInfo;
		eventsEnabled = _enabled;
		root = getActiveElementDeep(root);
		if (hasSelectionCapabilities(root)) {
			if ("selectionStart" in root) var JSCompiler_temp = {
				start: root.selectionStart,
				end: root.selectionEnd
			};
			else a: {
				JSCompiler_temp = (JSCompiler_temp = root.ownerDocument) && JSCompiler_temp.defaultView || window;
				var selection = JSCompiler_temp.getSelection && JSCompiler_temp.getSelection();
				if (selection && 0 !== selection.rangeCount) {
					JSCompiler_temp = selection.anchorNode;
					var anchorOffset = selection.anchorOffset, focusNode = selection.focusNode;
					selection = selection.focusOffset;
					try {
						JSCompiler_temp.nodeType, focusNode.nodeType;
					} catch (e$20) {
						JSCompiler_temp = null;
						break a;
					}
					var length = 0, start = -1, end = -1, indexWithinAnchor = 0, indexWithinFocus = 0, node = root, parentNode = null;
					b: for (;;) {
						for (var next;;) {
							node !== JSCompiler_temp || 0 !== anchorOffset && 3 !== node.nodeType || (start = length + anchorOffset);
							node !== focusNode || 0 !== selection && 3 !== node.nodeType || (end = length + selection);
							3 === node.nodeType && (length += node.nodeValue.length);
							if (null === (next = node.firstChild)) break;
							parentNode = node;
							node = next;
						}
						for (;;) {
							if (node === root) break b;
							parentNode === JSCompiler_temp && ++indexWithinAnchor === anchorOffset && (start = length);
							parentNode === focusNode && ++indexWithinFocus === selection && (end = length);
							if (null !== (next = node.nextSibling)) break;
							node = parentNode;
							parentNode = node.parentNode;
						}
						node = next;
					}
					JSCompiler_temp = -1 === start || -1 === end ? null : {
						start,
						end
					};
				} else JSCompiler_temp = null;
			}
			JSCompiler_temp = JSCompiler_temp || {
				start: 0,
				end: 0
			};
		} else JSCompiler_temp = null;
		selectionInformation = {
			focusedElem: root,
			selectionRange: JSCompiler_temp
		};
		_enabled = !1;
		for (nextEffect = firstChild; null !== nextEffect;) if (firstChild = nextEffect, root = firstChild.child, 0 !== (firstChild.subtreeFlags & 1028) && null !== root) root.return = firstChild, nextEffect = root;
		else for (; null !== nextEffect;) {
			firstChild = nextEffect;
			focusNode = firstChild.alternate;
			root = firstChild.flags;
			switch (firstChild.tag) {
				case 0:
					if (0 !== (root & 4) && (root = firstChild.updateQueue, root = null !== root ? root.events : null, null !== root)) for (JSCompiler_temp = 0; JSCompiler_temp < root.length; JSCompiler_temp++) anchorOffset = root[JSCompiler_temp], anchorOffset.ref.impl = anchorOffset.nextImpl;
					break;
				case 11:
				case 15: break;
				case 1:
					if (0 !== (root & 1024) && null !== focusNode) {
						root = void 0;
						JSCompiler_temp = firstChild;
						anchorOffset = focusNode.memoizedProps;
						focusNode = focusNode.memoizedState;
						selection = JSCompiler_temp.stateNode;
						try {
							var resolvedPrevProps = resolveClassComponentProps(JSCompiler_temp.type, anchorOffset);
							root = selection.getSnapshotBeforeUpdate(resolvedPrevProps, focusNode);
							selection.__reactInternalSnapshotBeforeUpdate = root;
						} catch (error) {
							captureCommitPhaseError(JSCompiler_temp, JSCompiler_temp.return, error);
						}
					}
					break;
				case 3:
					if (0 !== (root & 1024)) {
						if (root = firstChild.stateNode.containerInfo, JSCompiler_temp = root.nodeType, 9 === JSCompiler_temp) clearContainerSparingly(root);
						else if (1 === JSCompiler_temp) switch (root.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								clearContainerSparingly(root);
								break;
							default: root.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				default: if (0 !== (root & 1024)) throw Error(formatProdErrorMessage(163));
			}
			root = firstChild.sibling;
			if (null !== root) {
				root.return = firstChild.return;
				nextEffect = root;
				break;
			}
			nextEffect = firstChild.return;
		}
	}
	function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork) {
		var flags = finishedWork.flags;
		switch (finishedWork.tag) {
			case 0:
			case 11:
			case 15:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				flags & 4 && commitHookEffectListMount(5, finishedWork);
				break;
			case 1:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				if (flags & 4) if (finishedRoot = finishedWork.stateNode, null === current) try {
					finishedRoot.componentDidMount();
				} catch (error) {
					captureCommitPhaseError(finishedWork, finishedWork.return, error);
				}
				else {
					var prevProps = resolveClassComponentProps(finishedWork.type, current.memoizedProps);
					current = current.memoizedState;
					try {
						finishedRoot.componentDidUpdate(prevProps, current, finishedRoot.__reactInternalSnapshotBeforeUpdate);
					} catch (error$139) {
						captureCommitPhaseError(finishedWork, finishedWork.return, error$139);
					}
				}
				flags & 64 && commitClassCallbacks(finishedWork);
				flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
				break;
			case 3:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				if (flags & 64 && (finishedRoot = finishedWork.updateQueue, null !== finishedRoot)) {
					current = null;
					if (null !== finishedWork.child) switch (finishedWork.child.tag) {
						case 27:
						case 5:
							current = finishedWork.child.stateNode;
							break;
						case 1: current = finishedWork.child.stateNode;
					}
					try {
						commitCallbacks(finishedRoot, current);
					} catch (error) {
						captureCommitPhaseError(finishedWork, finishedWork.return, error);
					}
				}
				break;
			case 27: null === current && flags & 4 && commitHostSingletonAcquisition(finishedWork);
			case 26:
			case 5:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				null === current && flags & 4 && commitHostMount(finishedWork);
				flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
				break;
			case 12:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				break;
			case 31:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
				break;
			case 13:
				recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
				flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
				flags & 64 && (finishedRoot = finishedWork.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot && (finishedWork = retryDehydratedSuspenseBoundary.bind(null, finishedWork), registerSuspenseInstanceRetry(finishedRoot, finishedWork))));
				break;
			case 22:
				flags = null !== finishedWork.memoizedState || offscreenSubtreeIsHidden;
				if (!flags) {
					current = null !== current && null !== current.memoizedState || offscreenSubtreeWasHidden;
					prevProps = offscreenSubtreeIsHidden;
					var prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
					offscreenSubtreeIsHidden = flags;
					(offscreenSubtreeWasHidden = current) && !prevOffscreenSubtreeWasHidden ? recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, 0 !== (finishedWork.subtreeFlags & 8772)) : recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
					offscreenSubtreeIsHidden = prevProps;
					offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
				}
				break;
			case 30: break;
			default: recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
		}
	}
	function detachFiberAfterEffects(fiber) {
		var alternate = fiber.alternate;
		null !== alternate && (fiber.alternate = null, detachFiberAfterEffects(alternate));
		fiber.child = null;
		fiber.deletions = null;
		fiber.sibling = null;
		5 === fiber.tag && (alternate = fiber.stateNode, null !== alternate && detachDeletedInstance(alternate));
		fiber.stateNode = null;
		fiber.return = null;
		fiber.dependencies = null;
		fiber.memoizedProps = null;
		fiber.memoizedState = null;
		fiber.pendingProps = null;
		fiber.stateNode = null;
		fiber.updateQueue = null;
	}
	var hostParent = null, hostParentIsContainer = !1;
	function recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, parent) {
		for (parent = parent.child; null !== parent;) commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, parent), parent = parent.sibling;
	}
	function commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, deletedFiber) {
		if (injectedHook && "function" === typeof injectedHook.onCommitFiberUnmount) try {
			injectedHook.onCommitFiberUnmount(rendererID, deletedFiber);
		} catch (err) {}
		switch (deletedFiber.tag) {
			case 26:
				offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				deletedFiber.memoizedState ? deletedFiber.memoizedState.count-- : deletedFiber.stateNode && (deletedFiber = deletedFiber.stateNode, deletedFiber.parentNode.removeChild(deletedFiber));
				break;
			case 27:
				offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
				var prevHostParent = hostParent, prevHostParentIsContainer = hostParentIsContainer;
				isSingletonScope(deletedFiber.type) && (hostParent = deletedFiber.stateNode, hostParentIsContainer = !1);
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				releaseSingletonInstance(deletedFiber.stateNode);
				hostParent = prevHostParent;
				hostParentIsContainer = prevHostParentIsContainer;
				break;
			case 5: offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
			case 6:
				prevHostParent = hostParent;
				prevHostParentIsContainer = hostParentIsContainer;
				hostParent = null;
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				hostParent = prevHostParent;
				hostParentIsContainer = prevHostParentIsContainer;
				if (null !== hostParent) if (hostParentIsContainer) try {
					(9 === hostParent.nodeType ? hostParent.body : "HTML" === hostParent.nodeName ? hostParent.ownerDocument.body : hostParent).removeChild(deletedFiber.stateNode);
				} catch (error) {
					captureCommitPhaseError(deletedFiber, nearestMountedAncestor, error);
				}
				else try {
					hostParent.removeChild(deletedFiber.stateNode);
				} catch (error) {
					captureCommitPhaseError(deletedFiber, nearestMountedAncestor, error);
				}
				break;
			case 18:
				null !== hostParent && (hostParentIsContainer ? (finishedRoot = hostParent, clearHydrationBoundary(9 === finishedRoot.nodeType ? finishedRoot.body : "HTML" === finishedRoot.nodeName ? finishedRoot.ownerDocument.body : finishedRoot, deletedFiber.stateNode), retryIfBlockedOn(finishedRoot)) : clearHydrationBoundary(hostParent, deletedFiber.stateNode));
				break;
			case 4:
				prevHostParent = hostParent;
				prevHostParentIsContainer = hostParentIsContainer;
				hostParent = deletedFiber.stateNode.containerInfo;
				hostParentIsContainer = !0;
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				hostParent = prevHostParent;
				hostParentIsContainer = prevHostParentIsContainer;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				commitHookEffectListUnmount(2, deletedFiber, nearestMountedAncestor);
				offscreenSubtreeWasHidden || commitHookEffectListUnmount(4, deletedFiber, nearestMountedAncestor);
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				break;
			case 1:
				offscreenSubtreeWasHidden || (safelyDetachRef(deletedFiber, nearestMountedAncestor), prevHostParent = deletedFiber.stateNode, "function" === typeof prevHostParent.componentWillUnmount && safelyCallComponentWillUnmount(deletedFiber, nearestMountedAncestor, prevHostParent));
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				break;
			case 21:
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				break;
			case 22:
				offscreenSubtreeWasHidden = (prevHostParent = offscreenSubtreeWasHidden) || null !== deletedFiber.memoizedState;
				recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
				offscreenSubtreeWasHidden = prevHostParent;
				break;
			default: recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber);
		}
	}
	function commitActivityHydrationCallbacks(finishedRoot, finishedWork) {
		if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot))) {
			finishedRoot = finishedRoot.dehydrated;
			try {
				retryIfBlockedOn(finishedRoot);
			} catch (error) {
				captureCommitPhaseError(finishedWork, finishedWork.return, error);
			}
		}
	}
	function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
		if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot)))) try {
			retryIfBlockedOn(finishedRoot);
		} catch (error) {
			captureCommitPhaseError(finishedWork, finishedWork.return, error);
		}
	}
	function getRetryCache(finishedWork) {
		switch (finishedWork.tag) {
			case 31:
			case 13:
			case 19:
				var retryCache = finishedWork.stateNode;
				null === retryCache && (retryCache = finishedWork.stateNode = new PossiblyWeakSet());
				return retryCache;
			case 22: return finishedWork = finishedWork.stateNode, retryCache = finishedWork._retryCache, null === retryCache && (retryCache = finishedWork._retryCache = new PossiblyWeakSet()), retryCache;
			default: throw Error(formatProdErrorMessage(435, finishedWork.tag));
		}
	}
	function attachSuspenseRetryListeners(finishedWork, wakeables) {
		var retryCache = getRetryCache(finishedWork);
		wakeables.forEach(function(wakeable) {
			if (!retryCache.has(wakeable)) {
				retryCache.add(wakeable);
				var retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);
				wakeable.then(retry, retry);
			}
		});
	}
	function recursivelyTraverseMutationEffects(root$jscomp$0, parentFiber) {
		var deletions = parentFiber.deletions;
		if (null !== deletions) for (var i = 0; i < deletions.length; i++) {
			var childToDelete = deletions[i], root = root$jscomp$0, returnFiber = parentFiber, parent = returnFiber;
			a: for (; null !== parent;) {
				switch (parent.tag) {
					case 27:
						if (isSingletonScope(parent.type)) {
							hostParent = parent.stateNode;
							hostParentIsContainer = !1;
							break a;
						}
						break;
					case 5:
						hostParent = parent.stateNode;
						hostParentIsContainer = !1;
						break a;
					case 3:
					case 4:
						hostParent = parent.stateNode.containerInfo;
						hostParentIsContainer = !0;
						break a;
				}
				parent = parent.return;
			}
			if (null === hostParent) throw Error(formatProdErrorMessage(160));
			commitDeletionEffectsOnFiber(root, returnFiber, childToDelete);
			hostParent = null;
			hostParentIsContainer = !1;
			root = childToDelete.alternate;
			null !== root && (root.return = null);
			childToDelete.return = null;
		}
		if (parentFiber.subtreeFlags & 13886) for (parentFiber = parentFiber.child; null !== parentFiber;) commitMutationEffectsOnFiber(parentFiber, root$jscomp$0), parentFiber = parentFiber.sibling;
	}
	var currentHoistableRoot = null;
	function commitMutationEffectsOnFiber(finishedWork, root) {
		var current = finishedWork.alternate, flags = finishedWork.flags;
		switch (finishedWork.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 4 && (commitHookEffectListUnmount(3, finishedWork, finishedWork.return), commitHookEffectListMount(3, finishedWork), commitHookEffectListUnmount(5, finishedWork, finishedWork.return));
				break;
			case 1:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
				flags & 64 && offscreenSubtreeIsHidden && (finishedWork = finishedWork.updateQueue, null !== finishedWork && (flags = finishedWork.callbacks, null !== flags && (current = finishedWork.shared.hiddenCallbacks, finishedWork.shared.hiddenCallbacks = null === current ? flags : current.concat(flags))));
				break;
			case 26:
				var hoistableRoot = currentHoistableRoot;
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
				if (flags & 4) {
					var currentResource = null !== current ? current.memoizedState : null;
					flags = finishedWork.memoizedState;
					if (null === current) if (null === flags) if (null === finishedWork.stateNode) {
						a: {
							flags = finishedWork.type;
							current = finishedWork.memoizedProps;
							hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
							b: switch (flags) {
								case "title":
									currentResource = hoistableRoot.getElementsByTagName("title")[0];
									if (!currentResource || currentResource[internalHoistableMarker] || currentResource[internalInstanceKey] || "http://www.w3.org/2000/svg" === currentResource.namespaceURI || currentResource.hasAttribute("itemprop")) currentResource = hoistableRoot.createElement(flags), hoistableRoot.head.insertBefore(currentResource, hoistableRoot.querySelector("head > title"));
									setInitialProperties(currentResource, flags, current);
									currentResource[internalInstanceKey] = finishedWork;
									markNodeAsHoistable(currentResource);
									flags = currentResource;
									break a;
								case "link":
									var maybeNodes = getHydratableHoistableCache("link", "href", hoistableRoot).get(flags + (current.href || ""));
									if (maybeNodes) {
										for (var i = 0; i < maybeNodes.length; i++) if (currentResource = maybeNodes[i], currentResource.getAttribute("href") === (null == current.href || "" === current.href ? null : current.href) && currentResource.getAttribute("rel") === (null == current.rel ? null : current.rel) && currentResource.getAttribute("title") === (null == current.title ? null : current.title) && currentResource.getAttribute("crossorigin") === (null == current.crossOrigin ? null : current.crossOrigin)) {
											maybeNodes.splice(i, 1);
											break b;
										}
									}
									currentResource = hoistableRoot.createElement(flags);
									setInitialProperties(currentResource, flags, current);
									hoistableRoot.head.appendChild(currentResource);
									break;
								case "meta":
									if (maybeNodes = getHydratableHoistableCache("meta", "content", hoistableRoot).get(flags + (current.content || ""))) {
										for (i = 0; i < maybeNodes.length; i++) if (currentResource = maybeNodes[i], currentResource.getAttribute("content") === (null == current.content ? null : "" + current.content) && currentResource.getAttribute("name") === (null == current.name ? null : current.name) && currentResource.getAttribute("property") === (null == current.property ? null : current.property) && currentResource.getAttribute("http-equiv") === (null == current.httpEquiv ? null : current.httpEquiv) && currentResource.getAttribute("charset") === (null == current.charSet ? null : current.charSet)) {
											maybeNodes.splice(i, 1);
											break b;
										}
									}
									currentResource = hoistableRoot.createElement(flags);
									setInitialProperties(currentResource, flags, current);
									hoistableRoot.head.appendChild(currentResource);
									break;
								default: throw Error(formatProdErrorMessage(468, flags));
							}
							currentResource[internalInstanceKey] = finishedWork;
							markNodeAsHoistable(currentResource);
							flags = currentResource;
						}
						finishedWork.stateNode = flags;
					} else mountHoistable(hoistableRoot, finishedWork.type, finishedWork.stateNode);
					else finishedWork.stateNode = acquireResource(hoistableRoot, flags, finishedWork.memoizedProps);
					else currentResource !== flags ? (null === currentResource ? null !== current.stateNode && (current = current.stateNode, current.parentNode.removeChild(current)) : currentResource.count--, null === flags ? mountHoistable(hoistableRoot, finishedWork.type, finishedWork.stateNode) : acquireResource(hoistableRoot, flags, finishedWork.memoizedProps)) : null === flags && null !== finishedWork.stateNode && commitHostUpdate(finishedWork, finishedWork.memoizedProps, current.memoizedProps);
				}
				break;
			case 27:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
				null !== current && flags & 4 && commitHostUpdate(finishedWork, finishedWork.memoizedProps, current.memoizedProps);
				break;
			case 5:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
				if (finishedWork.flags & 32) {
					hoistableRoot = finishedWork.stateNode;
					try {
						setTextContent(hoistableRoot, "");
					} catch (error) {
						captureCommitPhaseError(finishedWork, finishedWork.return, error);
					}
				}
				flags & 4 && null != finishedWork.stateNode && (hoistableRoot = finishedWork.memoizedProps, commitHostUpdate(finishedWork, hoistableRoot, null !== current ? current.memoizedProps : hoistableRoot));
				flags & 1024 && (needsFormReset = !0);
				break;
			case 6:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				if (flags & 4) {
					if (null === finishedWork.stateNode) throw Error(formatProdErrorMessage(162));
					flags = finishedWork.memoizedProps;
					current = finishedWork.stateNode;
					try {
						current.nodeValue = flags;
					} catch (error) {
						captureCommitPhaseError(finishedWork, finishedWork.return, error);
					}
				}
				break;
			case 3:
				tagCaches = null;
				hoistableRoot = currentHoistableRoot;
				currentHoistableRoot = getHoistableRoot(root.containerInfo);
				recursivelyTraverseMutationEffects(root, finishedWork);
				currentHoistableRoot = hoistableRoot;
				commitReconciliationEffects(finishedWork);
				if (flags & 4 && null !== current && current.memoizedState.isDehydrated) try {
					retryIfBlockedOn(root.containerInfo);
				} catch (error) {
					captureCommitPhaseError(finishedWork, finishedWork.return, error);
				}
				needsFormReset && (needsFormReset = !1, recursivelyResetForms(finishedWork));
				break;
			case 4:
				flags = currentHoistableRoot;
				currentHoistableRoot = getHoistableRoot(finishedWork.stateNode.containerInfo);
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				currentHoistableRoot = flags;
				break;
			case 12:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				break;
			case 31:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
				break;
			case 13:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				finishedWork.child.flags & 8192 && null !== finishedWork.memoizedState !== (null !== current && null !== current.memoizedState) && (globalMostRecentFallbackTime = now());
				flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
				break;
			case 22:
				hoistableRoot = null !== finishedWork.memoizedState;
				var wasHidden = null !== current && null !== current.memoizedState, prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden, prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
				offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden || hoistableRoot;
				offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || wasHidden;
				recursivelyTraverseMutationEffects(root, finishedWork);
				offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
				offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
				commitReconciliationEffects(finishedWork);
				if (flags & 8192) a: for (root = finishedWork.stateNode, root._visibility = hoistableRoot ? root._visibility & -2 : root._visibility | 1, hoistableRoot && (null === current || wasHidden || offscreenSubtreeIsHidden || offscreenSubtreeWasHidden || recursivelyTraverseDisappearLayoutEffects(finishedWork)), current = null, root = finishedWork;;) {
					if (5 === root.tag || 26 === root.tag) {
						if (null === current) {
							wasHidden = current = root;
							try {
								if (currentResource = wasHidden.stateNode, hoistableRoot) maybeNodes = currentResource.style, "function" === typeof maybeNodes.setProperty ? maybeNodes.setProperty("display", "none", "important") : maybeNodes.display = "none";
								else {
									i = wasHidden.stateNode;
									var styleProp = wasHidden.memoizedProps.style, display = void 0 !== styleProp && null !== styleProp && styleProp.hasOwnProperty("display") ? styleProp.display : null;
									i.style.display = null == display || "boolean" === typeof display ? "" : ("" + display).trim();
								}
							} catch (error) {
								captureCommitPhaseError(wasHidden, wasHidden.return, error);
							}
						}
					} else if (6 === root.tag) {
						if (null === current) {
							wasHidden = root;
							try {
								wasHidden.stateNode.nodeValue = hoistableRoot ? "" : wasHidden.memoizedProps;
							} catch (error) {
								captureCommitPhaseError(wasHidden, wasHidden.return, error);
							}
						}
					} else if (18 === root.tag) {
						if (null === current) {
							wasHidden = root;
							try {
								var instance = wasHidden.stateNode;
								hoistableRoot ? hideOrUnhideDehydratedBoundary(instance, !0) : hideOrUnhideDehydratedBoundary(wasHidden.stateNode, !1);
							} catch (error) {
								captureCommitPhaseError(wasHidden, wasHidden.return, error);
							}
						}
					} else if ((22 !== root.tag && 23 !== root.tag || null === root.memoizedState || root === finishedWork) && null !== root.child) {
						root.child.return = root;
						root = root.child;
						continue;
					}
					if (root === finishedWork) break a;
					for (; null === root.sibling;) {
						if (null === root.return || root.return === finishedWork) break a;
						current === root && (current = null);
						root = root.return;
					}
					current === root && (current = null);
					root.sibling.return = root.return;
					root = root.sibling;
				}
				flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (current = flags.retryQueue, null !== current && (flags.retryQueue = null, attachSuspenseRetryListeners(finishedWork, current))));
				break;
			case 19:
				recursivelyTraverseMutationEffects(root, finishedWork);
				commitReconciliationEffects(finishedWork);
				flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
				break;
			case 30: break;
			case 21: break;
			default: recursivelyTraverseMutationEffects(root, finishedWork), commitReconciliationEffects(finishedWork);
		}
	}
	function commitReconciliationEffects(finishedWork) {
		var flags = finishedWork.flags;
		if (flags & 2) {
			try {
				for (var hostParentFiber, parentFiber = finishedWork.return; null !== parentFiber;) {
					if (isHostParent(parentFiber)) {
						hostParentFiber = parentFiber;
						break;
					}
					parentFiber = parentFiber.return;
				}
				if (null == hostParentFiber) throw Error(formatProdErrorMessage(160));
				switch (hostParentFiber.tag) {
					case 27:
						var parent = hostParentFiber.stateNode;
						insertOrAppendPlacementNode(finishedWork, getHostSibling(finishedWork), parent);
						break;
					case 5:
						var parent$141 = hostParentFiber.stateNode;
						hostParentFiber.flags & 32 && (setTextContent(parent$141, ""), hostParentFiber.flags &= -33);
						insertOrAppendPlacementNode(finishedWork, getHostSibling(finishedWork), parent$141);
						break;
					case 3:
					case 4:
						var parent$143 = hostParentFiber.stateNode.containerInfo;
						insertOrAppendPlacementNodeIntoContainer(finishedWork, getHostSibling(finishedWork), parent$143);
						break;
					default: throw Error(formatProdErrorMessage(161));
				}
			} catch (error) {
				captureCommitPhaseError(finishedWork, finishedWork.return, error);
			}
			finishedWork.flags &= -3;
		}
		flags & 4096 && (finishedWork.flags &= -4097);
	}
	function recursivelyResetForms(parentFiber) {
		if (parentFiber.subtreeFlags & 1024) for (parentFiber = parentFiber.child; null !== parentFiber;) {
			var fiber = parentFiber;
			recursivelyResetForms(fiber);
			5 === fiber.tag && fiber.flags & 1024 && fiber.stateNode.reset();
			parentFiber = parentFiber.sibling;
		}
	}
	function recursivelyTraverseLayoutEffects(root, parentFiber) {
		if (parentFiber.subtreeFlags & 8772) for (parentFiber = parentFiber.child; null !== parentFiber;) commitLayoutEffectOnFiber(root, parentFiber.alternate, parentFiber), parentFiber = parentFiber.sibling;
	}
	function recursivelyTraverseDisappearLayoutEffects(parentFiber) {
		for (parentFiber = parentFiber.child; null !== parentFiber;) {
			var finishedWork = parentFiber;
			switch (finishedWork.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					commitHookEffectListUnmount(4, finishedWork, finishedWork.return);
					recursivelyTraverseDisappearLayoutEffects(finishedWork);
					break;
				case 1:
					safelyDetachRef(finishedWork, finishedWork.return);
					var instance = finishedWork.stateNode;
					"function" === typeof instance.componentWillUnmount && safelyCallComponentWillUnmount(finishedWork, finishedWork.return, instance);
					recursivelyTraverseDisappearLayoutEffects(finishedWork);
					break;
				case 27: releaseSingletonInstance(finishedWork.stateNode);
				case 26:
				case 5:
					safelyDetachRef(finishedWork, finishedWork.return);
					recursivelyTraverseDisappearLayoutEffects(finishedWork);
					break;
				case 22:
					null === finishedWork.memoizedState && recursivelyTraverseDisappearLayoutEffects(finishedWork);
					break;
				case 30:
					recursivelyTraverseDisappearLayoutEffects(finishedWork);
					break;
				default: recursivelyTraverseDisappearLayoutEffects(finishedWork);
			}
			parentFiber = parentFiber.sibling;
		}
	}
	function recursivelyTraverseReappearLayoutEffects(finishedRoot$jscomp$0, parentFiber, includeWorkInProgressEffects) {
		includeWorkInProgressEffects = includeWorkInProgressEffects && 0 !== (parentFiber.subtreeFlags & 8772);
		for (parentFiber = parentFiber.child; null !== parentFiber;) {
			var current = parentFiber.alternate, finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
			switch (finishedWork.tag) {
				case 0:
				case 11:
				case 15:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					commitHookEffectListMount(4, finishedWork);
					break;
				case 1:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					current = finishedWork;
					finishedRoot = current.stateNode;
					if ("function" === typeof finishedRoot.componentDidMount) try {
						finishedRoot.componentDidMount();
					} catch (error) {
						captureCommitPhaseError(current, current.return, error);
					}
					current = finishedWork;
					finishedRoot = current.updateQueue;
					if (null !== finishedRoot) {
						var instance = current.stateNode;
						try {
							var hiddenCallbacks = finishedRoot.shared.hiddenCallbacks;
							if (null !== hiddenCallbacks) for (finishedRoot.shared.hiddenCallbacks = null, finishedRoot = 0; finishedRoot < hiddenCallbacks.length; finishedRoot++) callCallback(hiddenCallbacks[finishedRoot], instance);
						} catch (error) {
							captureCommitPhaseError(current, current.return, error);
						}
					}
					includeWorkInProgressEffects && flags & 64 && commitClassCallbacks(finishedWork);
					safelyAttachRef(finishedWork, finishedWork.return);
					break;
				case 27: commitHostSingletonAcquisition(finishedWork);
				case 26:
				case 5:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					includeWorkInProgressEffects && null === current && flags & 4 && commitHostMount(finishedWork);
					safelyAttachRef(finishedWork, finishedWork.return);
					break;
				case 12:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					break;
				case 31:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					includeWorkInProgressEffects && flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
					break;
				case 13:
					recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					includeWorkInProgressEffects && flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
					break;
				case 22:
					null === finishedWork.memoizedState && recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
					safelyAttachRef(finishedWork, finishedWork.return);
					break;
				case 30: break;
				default: recursivelyTraverseReappearLayoutEffects(finishedRoot, finishedWork, includeWorkInProgressEffects);
			}
			parentFiber = parentFiber.sibling;
		}
	}
	function commitOffscreenPassiveMountEffects(current, finishedWork) {
		var previousCache = null;
		null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (previousCache = current.memoizedState.cachePool.pool);
		current = null;
		null !== finishedWork.memoizedState && null !== finishedWork.memoizedState.cachePool && (current = finishedWork.memoizedState.cachePool.pool);
		current !== previousCache && (null != current && current.refCount++, null != previousCache && releaseCache(previousCache));
	}
	function commitCachePassiveMountEffect(current, finishedWork) {
		current = null;
		null !== finishedWork.alternate && (current = finishedWork.alternate.memoizedState.cache);
		finishedWork = finishedWork.memoizedState.cache;
		finishedWork !== current && (finishedWork.refCount++, null != current && releaseCache(current));
	}
	function recursivelyTraversePassiveMountEffects(root, parentFiber, committedLanes, committedTransitions) {
		if (parentFiber.subtreeFlags & 10256) for (parentFiber = parentFiber.child; null !== parentFiber;) commitPassiveMountOnFiber(root, parentFiber, committedLanes, committedTransitions), parentFiber = parentFiber.sibling;
	}
	function commitPassiveMountOnFiber(finishedRoot, finishedWork, committedLanes, committedTransitions) {
		var flags = finishedWork.flags;
		switch (finishedWork.tag) {
			case 0:
			case 11:
			case 15:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
				flags & 2048 && commitHookEffectListMount(9, finishedWork);
				break;
			case 1:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
				break;
			case 3:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
				flags & 2048 && (finishedRoot = null, null !== finishedWork.alternate && (finishedRoot = finishedWork.alternate.memoizedState.cache), finishedWork = finishedWork.memoizedState.cache, finishedWork !== finishedRoot && (finishedWork.refCount++, null != finishedRoot && releaseCache(finishedRoot)));
				break;
			case 12:
				if (flags & 2048) {
					recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
					finishedRoot = finishedWork.stateNode;
					try {
						var _finishedWork$memoize2 = finishedWork.memoizedProps, id = _finishedWork$memoize2.id, onPostCommit = _finishedWork$memoize2.onPostCommit;
						"function" === typeof onPostCommit && onPostCommit(id, null === finishedWork.alternate ? "mount" : "update", finishedRoot.passiveEffectDuration, -0);
					} catch (error) {
						captureCommitPhaseError(finishedWork, finishedWork.return, error);
					}
				} else recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
				break;
			case 31:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
				break;
			case 13:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
				break;
			case 23: break;
			case 22:
				_finishedWork$memoize2 = finishedWork.stateNode;
				id = finishedWork.alternate;
				null !== finishedWork.memoizedState ? _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions) : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork) : _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions) : (_finishedWork$memoize2._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, 0 !== (finishedWork.subtreeFlags & 10256) || !1));
				flags & 2048 && commitOffscreenPassiveMountEffects(id, finishedWork);
				break;
			case 24:
				recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
				flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
				break;
			default: recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork, committedLanes, committedTransitions);
		}
	}
	function recursivelyTraverseReconnectPassiveEffects(finishedRoot$jscomp$0, parentFiber, committedLanes$jscomp$0, committedTransitions$jscomp$0, includeWorkInProgressEffects) {
		includeWorkInProgressEffects = includeWorkInProgressEffects && (0 !== (parentFiber.subtreeFlags & 10256) || !1);
		for (parentFiber = parentFiber.child; null !== parentFiber;) {
			var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, committedLanes = committedLanes$jscomp$0, committedTransitions = committedTransitions$jscomp$0, flags = finishedWork.flags;
			switch (finishedWork.tag) {
				case 0:
				case 11:
				case 15:
					recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
					commitHookEffectListMount(8, finishedWork);
					break;
				case 23: break;
				case 22:
					var instance = finishedWork.stateNode;
					null !== finishedWork.memoizedState ? instance._visibility & 2 ? recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects) : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork) : (instance._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects));
					includeWorkInProgressEffects && flags & 2048 && commitOffscreenPassiveMountEffects(finishedWork.alternate, finishedWork);
					break;
				case 24:
					recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
					includeWorkInProgressEffects && flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
					break;
				default: recursivelyTraverseReconnectPassiveEffects(finishedRoot, finishedWork, committedLanes, committedTransitions, includeWorkInProgressEffects);
			}
			parentFiber = parentFiber.sibling;
		}
	}
	function recursivelyTraverseAtomicPassiveEffects(finishedRoot$jscomp$0, parentFiber) {
		if (parentFiber.subtreeFlags & 10256) for (parentFiber = parentFiber.child; null !== parentFiber;) {
			var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
			switch (finishedWork.tag) {
				case 22:
					recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
					flags & 2048 && commitOffscreenPassiveMountEffects(finishedWork.alternate, finishedWork);
					break;
				case 24:
					recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
					flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
					break;
				default: recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
			}
			parentFiber = parentFiber.sibling;
		}
	}
	var suspenseyCommitFlag = 8192;
	function recursivelyAccumulateSuspenseyCommit(parentFiber, committedLanes, suspendedState) {
		if (parentFiber.subtreeFlags & suspenseyCommitFlag) for (parentFiber = parentFiber.child; null !== parentFiber;) accumulateSuspenseyCommitOnFiber(parentFiber, committedLanes, suspendedState), parentFiber = parentFiber.sibling;
	}
	function accumulateSuspenseyCommitOnFiber(fiber, committedLanes, suspendedState) {
		switch (fiber.tag) {
			case 26:
				recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState);
				fiber.flags & suspenseyCommitFlag && null !== fiber.memoizedState && suspendResource(suspendedState, currentHoistableRoot, fiber.memoizedState, fiber.memoizedProps);
				break;
			case 5:
				recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState);
				break;
			case 3:
			case 4:
				var previousHoistableRoot = currentHoistableRoot;
				currentHoistableRoot = getHoistableRoot(fiber.stateNode.containerInfo);
				recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState);
				currentHoistableRoot = previousHoistableRoot;
				break;
			case 22:
				null === fiber.memoizedState && (previousHoistableRoot = fiber.alternate, null !== previousHoistableRoot && null !== previousHoistableRoot.memoizedState ? (previousHoistableRoot = suspenseyCommitFlag, suspenseyCommitFlag = 16777216, recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState), suspenseyCommitFlag = previousHoistableRoot) : recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState));
				break;
			default: recursivelyAccumulateSuspenseyCommit(fiber, committedLanes, suspendedState);
		}
	}
	function detachAlternateSiblings(parentFiber) {
		var previousFiber = parentFiber.alternate;
		if (null !== previousFiber && (parentFiber = previousFiber.child, null !== parentFiber)) {
			previousFiber.child = null;
			do
				previousFiber = parentFiber.sibling, parentFiber.sibling = null, parentFiber = previousFiber;
			while (null !== parentFiber);
		}
	}
	function recursivelyTraversePassiveUnmountEffects(parentFiber) {
		var deletions = parentFiber.deletions;
		if (0 !== (parentFiber.flags & 16)) {
			if (null !== deletions) for (var i = 0; i < deletions.length; i++) {
				var childToDelete = deletions[i];
				nextEffect = childToDelete;
				commitPassiveUnmountEffectsInsideOfDeletedTree_begin(childToDelete, parentFiber);
			}
			detachAlternateSiblings(parentFiber);
		}
		if (parentFiber.subtreeFlags & 10256) for (parentFiber = parentFiber.child; null !== parentFiber;) commitPassiveUnmountOnFiber(parentFiber), parentFiber = parentFiber.sibling;
	}
	function commitPassiveUnmountOnFiber(finishedWork) {
		switch (finishedWork.tag) {
			case 0:
			case 11:
			case 15:
				recursivelyTraversePassiveUnmountEffects(finishedWork);
				finishedWork.flags & 2048 && commitHookEffectListUnmount(9, finishedWork, finishedWork.return);
				break;
			case 3:
				recursivelyTraversePassiveUnmountEffects(finishedWork);
				break;
			case 12:
				recursivelyTraversePassiveUnmountEffects(finishedWork);
				break;
			case 22:
				var instance = finishedWork.stateNode;
				null !== finishedWork.memoizedState && instance._visibility & 2 && (null === finishedWork.return || 13 !== finishedWork.return.tag) ? (instance._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(finishedWork)) : recursivelyTraversePassiveUnmountEffects(finishedWork);
				break;
			default: recursivelyTraversePassiveUnmountEffects(finishedWork);
		}
	}
	function recursivelyTraverseDisconnectPassiveEffects(parentFiber) {
		var deletions = parentFiber.deletions;
		if (0 !== (parentFiber.flags & 16)) {
			if (null !== deletions) for (var i = 0; i < deletions.length; i++) {
				var childToDelete = deletions[i];
				nextEffect = childToDelete;
				commitPassiveUnmountEffectsInsideOfDeletedTree_begin(childToDelete, parentFiber);
			}
			detachAlternateSiblings(parentFiber);
		}
		for (parentFiber = parentFiber.child; null !== parentFiber;) {
			deletions = parentFiber;
			switch (deletions.tag) {
				case 0:
				case 11:
				case 15:
					commitHookEffectListUnmount(8, deletions, deletions.return);
					recursivelyTraverseDisconnectPassiveEffects(deletions);
					break;
				case 22:
					i = deletions.stateNode;
					i._visibility & 2 && (i._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(deletions));
					break;
				default: recursivelyTraverseDisconnectPassiveEffects(deletions);
			}
			parentFiber = parentFiber.sibling;
		}
	}
	function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(deletedSubtreeRoot, nearestMountedAncestor) {
		for (; null !== nextEffect;) {
			var fiber = nextEffect;
			switch (fiber.tag) {
				case 0:
				case 11:
				case 15:
					commitHookEffectListUnmount(8, fiber, nearestMountedAncestor);
					break;
				case 23:
				case 22:
					if (null !== fiber.memoizedState && null !== fiber.memoizedState.cachePool) {
						var cache = fiber.memoizedState.cachePool.pool;
						null != cache && cache.refCount++;
					}
					break;
				case 24: releaseCache(fiber.memoizedState.cache);
			}
			cache = fiber.child;
			if (null !== cache) cache.return = fiber, nextEffect = cache;
			else a: for (fiber = deletedSubtreeRoot; null !== nextEffect;) {
				cache = nextEffect;
				var sibling = cache.sibling, returnFiber = cache.return;
				detachFiberAfterEffects(cache);
				if (cache === fiber) {
					nextEffect = null;
					break a;
				}
				if (null !== sibling) {
					sibling.return = returnFiber;
					nextEffect = sibling;
					break a;
				}
				nextEffect = returnFiber;
			}
		}
	}
	var DefaultAsyncDispatcher = {
		getCacheForType: function(resourceType) {
			var cache = readContext(CacheContext), cacheForType = cache.data.get(resourceType);
			void 0 === cacheForType && (cacheForType = resourceType(), cache.data.set(resourceType, cacheForType));
			return cacheForType;
		},
		cacheSignal: function() {
			return readContext(CacheContext).controller.signal;
		}
	}, PossiblyWeakMap = "function" === typeof WeakMap ? WeakMap : Map, executionContext = 0, workInProgressRoot = null, workInProgress = null, workInProgressRootRenderLanes = 0, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, workInProgressRootDidSkipSuspendedSiblings = !1, workInProgressRootIsPrerendering = !1, workInProgressRootDidAttachPingListener = !1, entangledRenderLanes = 0, workInProgressRootExitStatus = 0, workInProgressRootSkippedLanes = 0, workInProgressRootInterleavedUpdatedLanes = 0, workInProgressRootPingedLanes = 0, workInProgressDeferredLane = 0, workInProgressSuspendedRetryLanes = 0, workInProgressRootConcurrentErrors = null, workInProgressRootRecoverableErrors = null, workInProgressRootDidIncludeRecursiveRenderUpdate = !1, globalMostRecentFallbackTime = 0, globalMostRecentTransitionTime = 0, workInProgressRootRenderTargetTime = Infinity, workInProgressTransitions = null, legacyErrorBoundariesThatAlreadyFailed = null, pendingEffectsStatus = 0, pendingEffectsRoot = null, pendingFinishedWork = null, pendingEffectsLanes = 0, pendingEffectsRemainingLanes = 0, pendingPassiveTransitions = null, pendingRecoverableErrors = null, nestedUpdateCount = 0, rootWithNestedUpdates = null;
	function requestUpdateLane() {
		return 0 !== (executionContext & 2) && 0 !== workInProgressRootRenderLanes ? workInProgressRootRenderLanes & -workInProgressRootRenderLanes : null !== ReactSharedInternals.T ? requestTransitionLane() : resolveUpdatePriority();
	}
	function requestDeferredLane() {
		if (0 === workInProgressDeferredLane) if (0 === (workInProgressRootRenderLanes & 536870912) || isHydrating) {
			var lane = nextTransitionDeferredLane;
			nextTransitionDeferredLane <<= 1;
			0 === (nextTransitionDeferredLane & 3932160) && (nextTransitionDeferredLane = 262144);
			workInProgressDeferredLane = lane;
		} else workInProgressDeferredLane = 536870912;
		lane = suspenseHandlerStackCursor.current;
		null !== lane && (lane.flags |= 32);
		return workInProgressDeferredLane;
	}
	function scheduleUpdateOnFiber(root, fiber, lane) {
		if (root === workInProgressRoot && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root.cancelPendingCommit) prepareFreshStack(root, 0), markRootSuspended(root, workInProgressRootRenderLanes, workInProgressDeferredLane, !1);
		markRootUpdated$1(root, lane);
		if (0 === (executionContext & 2) || root !== workInProgressRoot) root === workInProgressRoot && (0 === (executionContext & 2) && (workInProgressRootInterleavedUpdatedLanes |= lane), 4 === workInProgressRootExitStatus && markRootSuspended(root, workInProgressRootRenderLanes, workInProgressDeferredLane, !1)), ensureRootIsScheduled(root);
	}
	function performWorkOnRoot(root$jscomp$0, lanes, forceSync) {
		if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
		var shouldTimeSlice = !forceSync && 0 === (lanes & 127) && 0 === (lanes & root$jscomp$0.expiredLanes) || checkIfRootIsPrerendering(root$jscomp$0, lanes), exitStatus = shouldTimeSlice ? renderRootConcurrent(root$jscomp$0, lanes) : renderRootSync(root$jscomp$0, lanes, !0), renderWasConcurrent = shouldTimeSlice;
		do {
			if (0 === exitStatus) {
				workInProgressRootIsPrerendering && !shouldTimeSlice && markRootSuspended(root$jscomp$0, lanes, 0, !1);
				break;
			} else {
				forceSync = root$jscomp$0.current.alternate;
				if (renderWasConcurrent && !isRenderConsistentWithExternalStores(forceSync)) {
					exitStatus = renderRootSync(root$jscomp$0, lanes, !1);
					renderWasConcurrent = !1;
					continue;
				}
				if (2 === exitStatus) {
					renderWasConcurrent = lanes;
					if (root$jscomp$0.errorRecoveryDisabledLanes & renderWasConcurrent) var JSCompiler_inline_result = 0;
					else JSCompiler_inline_result = root$jscomp$0.pendingLanes & -536870913, JSCompiler_inline_result = 0 !== JSCompiler_inline_result ? JSCompiler_inline_result : JSCompiler_inline_result & 536870912 ? 536870912 : 0;
					if (0 !== JSCompiler_inline_result) {
						lanes = JSCompiler_inline_result;
						a: {
							var root = root$jscomp$0;
							exitStatus = workInProgressRootConcurrentErrors;
							var wasRootDehydrated = root.current.memoizedState.isDehydrated;
							wasRootDehydrated && (prepareFreshStack(root, JSCompiler_inline_result).flags |= 256);
							JSCompiler_inline_result = renderRootSync(root, JSCompiler_inline_result, !1);
							if (2 !== JSCompiler_inline_result) {
								if (workInProgressRootDidAttachPingListener && !wasRootDehydrated) {
									root.errorRecoveryDisabledLanes |= renderWasConcurrent;
									workInProgressRootInterleavedUpdatedLanes |= renderWasConcurrent;
									exitStatus = 4;
									break a;
								}
								renderWasConcurrent = workInProgressRootRecoverableErrors;
								workInProgressRootRecoverableErrors = exitStatus;
								null !== renderWasConcurrent && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = renderWasConcurrent : workInProgressRootRecoverableErrors.push.apply(workInProgressRootRecoverableErrors, renderWasConcurrent));
							}
							exitStatus = JSCompiler_inline_result;
						}
						renderWasConcurrent = !1;
						if (2 !== exitStatus) continue;
					}
				}
				if (1 === exitStatus) {
					prepareFreshStack(root$jscomp$0, 0);
					markRootSuspended(root$jscomp$0, lanes, 0, !0);
					break;
				}
				a: {
					shouldTimeSlice = root$jscomp$0;
					renderWasConcurrent = exitStatus;
					switch (renderWasConcurrent) {
						case 0:
						case 1: throw Error(formatProdErrorMessage(345));
						case 4: if ((lanes & 4194048) !== lanes) break;
						case 6:
							markRootSuspended(shouldTimeSlice, lanes, workInProgressDeferredLane, !workInProgressRootDidSkipSuspendedSiblings);
							break a;
						case 2:
							workInProgressRootRecoverableErrors = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(formatProdErrorMessage(329));
					}
					if ((lanes & 62914560) === lanes && (exitStatus = globalMostRecentFallbackTime + 300 - now(), 10 < exitStatus)) {
						markRootSuspended(shouldTimeSlice, lanes, workInProgressDeferredLane, !workInProgressRootDidSkipSuspendedSiblings);
						if (0 !== getNextLanes(shouldTimeSlice, 0, !0)) break a;
						pendingEffectsLanes = lanes;
						shouldTimeSlice.timeoutHandle = scheduleTimeout(commitRootWhenReady.bind(null, shouldTimeSlice, forceSync, workInProgressRootRecoverableErrors, workInProgressTransitions, workInProgressRootDidIncludeRecursiveRenderUpdate, lanes, workInProgressDeferredLane, workInProgressRootInterleavedUpdatedLanes, workInProgressSuspendedRetryLanes, workInProgressRootDidSkipSuspendedSiblings, renderWasConcurrent, "Throttled", -0, 0), exitStatus);
						break a;
					}
					commitRootWhenReady(shouldTimeSlice, forceSync, workInProgressRootRecoverableErrors, workInProgressTransitions, workInProgressRootDidIncludeRecursiveRenderUpdate, lanes, workInProgressDeferredLane, workInProgressRootInterleavedUpdatedLanes, workInProgressSuspendedRetryLanes, workInProgressRootDidSkipSuspendedSiblings, renderWasConcurrent, null, -0, 0);
				}
			}
			break;
		} while (1);
		ensureRootIsScheduled(root$jscomp$0);
	}
	function commitRootWhenReady(root, finishedWork, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime) {
		root.timeoutHandle = -1;
		suspendedCommitReason = finishedWork.subtreeFlags;
		if (suspendedCommitReason & 8192 || 16785408 === (suspendedCommitReason & 16785408)) {
			suspendedCommitReason = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: noop$1
			};
			accumulateSuspenseyCommitOnFiber(finishedWork, lanes, suspendedCommitReason);
			var timeoutOffset = (lanes & 62914560) === lanes ? globalMostRecentFallbackTime - now() : (lanes & 4194048) === lanes ? globalMostRecentTransitionTime - now() : 0;
			timeoutOffset = waitForCommitToBeReady(suspendedCommitReason, timeoutOffset);
			if (null !== timeoutOffset) {
				pendingEffectsLanes = lanes;
				root.cancelPendingCommit = timeoutOffset(commitRoot.bind(null, root, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes, exitStatus, suspendedCommitReason, null, completedRenderStartTime, completedRenderEndTime));
				markRootSuspended(root, lanes, spawnedLane, !didSkipSuspendedSiblings);
				return;
			}
		}
		commitRoot(root, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes);
	}
	function isRenderConsistentWithExternalStores(finishedWork) {
		for (var node = finishedWork;;) {
			var tag = node.tag;
			if ((0 === tag || 11 === tag || 15 === tag) && node.flags & 16384 && (tag = node.updateQueue, null !== tag && (tag = tag.stores, null !== tag))) for (var i = 0; i < tag.length; i++) {
				var check = tag[i], getSnapshot = check.getSnapshot;
				check = check.value;
				try {
					if (!objectIs(getSnapshot(), check)) return !1;
				} catch (error) {
					return !1;
				}
			}
			tag = node.child;
			if (node.subtreeFlags & 16384 && null !== tag) tag.return = node, node = tag;
			else {
				if (node === finishedWork) break;
				for (; null === node.sibling;) {
					if (null === node.return || node.return === finishedWork) return !0;
					node = node.return;
				}
				node.sibling.return = node.return;
				node = node.sibling;
			}
		}
		return !0;
	}
	function markRootSuspended(root, suspendedLanes, spawnedLane, didAttemptEntireTree) {
		suspendedLanes &= ~workInProgressRootPingedLanes;
		suspendedLanes &= ~workInProgressRootInterleavedUpdatedLanes;
		root.suspendedLanes |= suspendedLanes;
		root.pingedLanes &= ~suspendedLanes;
		didAttemptEntireTree && (root.warmLanes |= suspendedLanes);
		didAttemptEntireTree = root.expirationTimes;
		for (var lanes = suspendedLanes; 0 < lanes;) {
			var index$6 = 31 - clz32(lanes), lane = 1 << index$6;
			didAttemptEntireTree[index$6] = -1;
			lanes &= ~lane;
		}
		0 !== spawnedLane && markSpawnedDeferredLane(root, spawnedLane, suspendedLanes);
	}
	function flushSyncWork$1() {
		return 0 === (executionContext & 6) ? (flushSyncWorkAcrossRoots_impl(0, !1), !1) : !0;
	}
	function resetWorkInProgressStack() {
		if (null !== workInProgress) {
			if (0 === workInProgressSuspendedReason) var interruptedWork = workInProgress.return;
			else interruptedWork = workInProgress, lastContextDependency = currentlyRenderingFiber$1 = null, resetHooksOnUnwind(interruptedWork), thenableState$1 = null, thenableIndexCounter$1 = 0, interruptedWork = workInProgress;
			for (; null !== interruptedWork;) unwindInterruptedWork(interruptedWork.alternate, interruptedWork), interruptedWork = interruptedWork.return;
			workInProgress = null;
		}
	}
	function prepareFreshStack(root, lanes) {
		var timeoutHandle = root.timeoutHandle;
		-1 !== timeoutHandle && (root.timeoutHandle = -1, cancelTimeout(timeoutHandle));
		timeoutHandle = root.cancelPendingCommit;
		null !== timeoutHandle && (root.cancelPendingCommit = null, timeoutHandle());
		pendingEffectsLanes = 0;
		resetWorkInProgressStack();
		workInProgressRoot = root;
		workInProgress = timeoutHandle = createWorkInProgress(root.current, null);
		workInProgressRootRenderLanes = lanes;
		workInProgressSuspendedReason = 0;
		workInProgressThrownValue = null;
		workInProgressRootDidSkipSuspendedSiblings = !1;
		workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root, lanes);
		workInProgressRootDidAttachPingListener = !1;
		workInProgressSuspendedRetryLanes = workInProgressDeferredLane = workInProgressRootPingedLanes = workInProgressRootInterleavedUpdatedLanes = workInProgressRootSkippedLanes = workInProgressRootExitStatus = 0;
		workInProgressRootRecoverableErrors = workInProgressRootConcurrentErrors = null;
		workInProgressRootDidIncludeRecursiveRenderUpdate = !1;
		0 !== (lanes & 8) && (lanes |= lanes & 32);
		var allEntangledLanes = root.entangledLanes;
		if (0 !== allEntangledLanes) for (root = root.entanglements, allEntangledLanes &= lanes; 0 < allEntangledLanes;) {
			var index$4 = 31 - clz32(allEntangledLanes), lane = 1 << index$4;
			lanes |= root[index$4];
			allEntangledLanes &= ~lane;
		}
		entangledRenderLanes = lanes;
		finishQueueingConcurrentUpdates();
		return timeoutHandle;
	}
	function handleThrow(root, thrownValue) {
		currentlyRenderingFiber = null;
		ReactSharedInternals.H = ContextOnlyDispatcher;
		thrownValue === SuspenseException || thrownValue === SuspenseActionException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 3) : thrownValue === SuspenseyCommitException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 4) : workInProgressSuspendedReason = thrownValue === SelectiveHydrationException ? 8 : null !== thrownValue && "object" === typeof thrownValue && "function" === typeof thrownValue.then ? 6 : 1;
		workInProgressThrownValue = thrownValue;
		null === workInProgress && (workInProgressRootExitStatus = 1, logUncaughtError(root, createCapturedValueAtFiber(thrownValue, root.current)));
	}
	function shouldRemainOnPreviousScreen() {
		var handler = suspenseHandlerStackCursor.current;
		return null === handler ? !0 : (workInProgressRootRenderLanes & 4194048) === workInProgressRootRenderLanes ? null === shellBoundary ? !0 : !1 : (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes || 0 !== (workInProgressRootRenderLanes & 536870912) ? handler === shellBoundary : !1;
	}
	function pushDispatcher() {
		var prevDispatcher = ReactSharedInternals.H;
		ReactSharedInternals.H = ContextOnlyDispatcher;
		return null === prevDispatcher ? ContextOnlyDispatcher : prevDispatcher;
	}
	function pushAsyncDispatcher() {
		var prevAsyncDispatcher = ReactSharedInternals.A;
		ReactSharedInternals.A = DefaultAsyncDispatcher;
		return prevAsyncDispatcher;
	}
	function renderDidSuspendDelayIfPossible() {
		workInProgressRootExitStatus = 4;
		workInProgressRootDidSkipSuspendedSiblings || (workInProgressRootRenderLanes & 4194048) !== workInProgressRootRenderLanes && null !== suspenseHandlerStackCursor.current || (workInProgressRootIsPrerendering = !0);
		0 === (workInProgressRootSkippedLanes & 134217727) && 0 === (workInProgressRootInterleavedUpdatedLanes & 134217727) || null === workInProgressRoot || markRootSuspended(workInProgressRoot, workInProgressRootRenderLanes, workInProgressDeferredLane, !1);
	}
	function renderRootSync(root, lanes, shouldYieldForPrerendering) {
		var prevExecutionContext = executionContext;
		executionContext |= 2;
		var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
		if (workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes) workInProgressTransitions = null, prepareFreshStack(root, lanes);
		lanes = !1;
		var exitStatus = workInProgressRootExitStatus;
		a: do
			try {
				if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
					var unitOfWork = workInProgress, thrownValue = workInProgressThrownValue;
					switch (workInProgressSuspendedReason) {
						case 8:
							resetWorkInProgressStack();
							exitStatus = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							null === suspenseHandlerStackCursor.current && (lanes = !0);
							var reason = workInProgressSuspendedReason;
							workInProgressSuspendedReason = 0;
							workInProgressThrownValue = null;
							throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, reason);
							if (shouldYieldForPrerendering && workInProgressRootIsPrerendering) {
								exitStatus = 0;
								break a;
							}
							break;
						default: reason = workInProgressSuspendedReason, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, reason);
					}
				}
				workLoopSync();
				exitStatus = workInProgressRootExitStatus;
				break;
			} catch (thrownValue$165) {
				handleThrow(root, thrownValue$165);
			}
		while (1);
		lanes && root.shellSuspendCounter++;
		lastContextDependency = currentlyRenderingFiber$1 = null;
		executionContext = prevExecutionContext;
		ReactSharedInternals.H = prevDispatcher;
		ReactSharedInternals.A = prevAsyncDispatcher;
		null === workInProgress && (workInProgressRoot = null, workInProgressRootRenderLanes = 0, finishQueueingConcurrentUpdates());
		return exitStatus;
	}
	function workLoopSync() {
		for (; null !== workInProgress;) performUnitOfWork(workInProgress);
	}
	function renderRootConcurrent(root, lanes) {
		var prevExecutionContext = executionContext;
		executionContext |= 2;
		var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
		workInProgressRoot !== root || workInProgressRootRenderLanes !== lanes ? (workInProgressTransitions = null, workInProgressRootRenderTargetTime = now() + 500, prepareFreshStack(root, lanes)) : workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root, lanes);
		a: do
			try {
				if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
					lanes = workInProgress;
					var thrownValue = workInProgressThrownValue;
					b: switch (workInProgressSuspendedReason) {
						case 1:
							workInProgressSuspendedReason = 0;
							workInProgressThrownValue = null;
							throwAndUnwindWorkLoop(root, lanes, thrownValue, 1);
							break;
						case 2:
						case 9:
							if (isThenableResolved(thrownValue)) {
								workInProgressSuspendedReason = 0;
								workInProgressThrownValue = null;
								replaySuspendedUnitOfWork(lanes);
								break;
							}
							lanes = function() {
								2 !== workInProgressSuspendedReason && 9 !== workInProgressSuspendedReason || workInProgressRoot !== root || (workInProgressSuspendedReason = 7);
								ensureRootIsScheduled(root);
							};
							thrownValue.then(lanes, lanes);
							break a;
						case 3:
							workInProgressSuspendedReason = 7;
							break a;
						case 4:
							workInProgressSuspendedReason = 5;
							break a;
						case 7:
							isThenableResolved(thrownValue) ? (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, replaySuspendedUnitOfWork(lanes)) : (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root, lanes, thrownValue, 7));
							break;
						case 5:
							var resource = null;
							switch (workInProgress.tag) {
								case 26: resource = workInProgress.memoizedState;
								case 5:
								case 27:
									var hostFiber = workInProgress;
									if (resource ? preloadResource(resource) : hostFiber.stateNode.complete) {
										workInProgressSuspendedReason = 0;
										workInProgressThrownValue = null;
										var sibling = hostFiber.sibling;
										if (null !== sibling) workInProgress = sibling;
										else {
											var returnFiber = hostFiber.return;
											null !== returnFiber ? (workInProgress = returnFiber, completeUnitOfWork(returnFiber)) : workInProgress = null;
										}
										break b;
									}
							}
							workInProgressSuspendedReason = 0;
							workInProgressThrownValue = null;
							throwAndUnwindWorkLoop(root, lanes, thrownValue, 5);
							break;
						case 6:
							workInProgressSuspendedReason = 0;
							workInProgressThrownValue = null;
							throwAndUnwindWorkLoop(root, lanes, thrownValue, 6);
							break;
						case 8:
							resetWorkInProgressStack();
							workInProgressRootExitStatus = 6;
							break a;
						default: throw Error(formatProdErrorMessage(462));
					}
				}
				workLoopConcurrentByScheduler();
				break;
			} catch (thrownValue$167) {
				handleThrow(root, thrownValue$167);
			}
		while (1);
		lastContextDependency = currentlyRenderingFiber$1 = null;
		ReactSharedInternals.H = prevDispatcher;
		ReactSharedInternals.A = prevAsyncDispatcher;
		executionContext = prevExecutionContext;
		if (null !== workInProgress) return 0;
		workInProgressRoot = null;
		workInProgressRootRenderLanes = 0;
		finishQueueingConcurrentUpdates();
		return workInProgressRootExitStatus;
	}
	function workLoopConcurrentByScheduler() {
		for (; null !== workInProgress && !shouldYield();) performUnitOfWork(workInProgress);
	}
	function performUnitOfWork(unitOfWork) {
		var next = beginWork(unitOfWork.alternate, unitOfWork, entangledRenderLanes);
		unitOfWork.memoizedProps = unitOfWork.pendingProps;
		null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
	}
	function replaySuspendedUnitOfWork(unitOfWork) {
		var next = unitOfWork;
		var current = next.alternate;
		switch (next.tag) {
			case 15:
			case 0:
				next = replayFunctionComponent(current, next, next.pendingProps, next.type, void 0, workInProgressRootRenderLanes);
				break;
			case 11:
				next = replayFunctionComponent(current, next, next.pendingProps, next.type.render, next.ref, workInProgressRootRenderLanes);
				break;
			case 5: resetHooksOnUnwind(next);
			default: unwindInterruptedWork(current, next), next = workInProgress = resetWorkInProgress(next, entangledRenderLanes), next = beginWork(current, next, entangledRenderLanes);
		}
		unitOfWork.memoizedProps = unitOfWork.pendingProps;
		null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
	}
	function throwAndUnwindWorkLoop(root, unitOfWork, thrownValue, suspendedReason) {
		lastContextDependency = currentlyRenderingFiber$1 = null;
		resetHooksOnUnwind(unitOfWork);
		thenableState$1 = null;
		thenableIndexCounter$1 = 0;
		var returnFiber = unitOfWork.return;
		try {
			if (throwException(root, returnFiber, unitOfWork, thrownValue, workInProgressRootRenderLanes)) {
				workInProgressRootExitStatus = 1;
				logUncaughtError(root, createCapturedValueAtFiber(thrownValue, root.current));
				workInProgress = null;
				return;
			}
		} catch (error) {
			if (null !== returnFiber) throw workInProgress = returnFiber, error;
			workInProgressRootExitStatus = 1;
			logUncaughtError(root, createCapturedValueAtFiber(thrownValue, root.current));
			workInProgress = null;
			return;
		}
		if (unitOfWork.flags & 32768) {
			if (isHydrating || 1 === suspendedReason) root = !0;
			else if (workInProgressRootIsPrerendering || 0 !== (workInProgressRootRenderLanes & 536870912)) root = !1;
			else if (workInProgressRootDidSkipSuspendedSiblings = root = !0, 2 === suspendedReason || 9 === suspendedReason || 3 === suspendedReason || 6 === suspendedReason) suspendedReason = suspenseHandlerStackCursor.current, null !== suspendedReason && 13 === suspendedReason.tag && (suspendedReason.flags |= 16384);
			unwindUnitOfWork(unitOfWork, root);
		} else completeUnitOfWork(unitOfWork);
	}
	function completeUnitOfWork(unitOfWork) {
		var completedWork = unitOfWork;
		do {
			if (0 !== (completedWork.flags & 32768)) {
				unwindUnitOfWork(completedWork, workInProgressRootDidSkipSuspendedSiblings);
				return;
			}
			unitOfWork = completedWork.return;
			var next = completeWork(completedWork.alternate, completedWork, entangledRenderLanes);
			if (null !== next) {
				workInProgress = next;
				return;
			}
			completedWork = completedWork.sibling;
			if (null !== completedWork) {
				workInProgress = completedWork;
				return;
			}
			workInProgress = completedWork = unitOfWork;
		} while (null !== completedWork);
		0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 5);
	}
	function unwindUnitOfWork(unitOfWork, skipSiblings) {
		do {
			var next = unwindWork(unitOfWork.alternate, unitOfWork);
			if (null !== next) {
				next.flags &= 32767;
				workInProgress = next;
				return;
			}
			next = unitOfWork.return;
			null !== next && (next.flags |= 32768, next.subtreeFlags = 0, next.deletions = null);
			if (!skipSiblings && (unitOfWork = unitOfWork.sibling, null !== unitOfWork)) {
				workInProgress = unitOfWork;
				return;
			}
			workInProgress = unitOfWork = next;
		} while (null !== unitOfWork);
		workInProgressRootExitStatus = 6;
		workInProgress = null;
	}
	function commitRoot(root, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes) {
		root.cancelPendingCommit = null;
		do
			flushPendingEffects();
		while (0 !== pendingEffectsStatus);
		if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
		if (null !== finishedWork) {
			if (finishedWork === root.current) throw Error(formatProdErrorMessage(177));
			didIncludeRenderPhaseUpdate = finishedWork.lanes | finishedWork.childLanes;
			didIncludeRenderPhaseUpdate |= concurrentlyUpdatedLanes;
			markRootFinished(root, lanes, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes);
			root === workInProgressRoot && (workInProgress = workInProgressRoot = null, workInProgressRootRenderLanes = 0);
			pendingFinishedWork = finishedWork;
			pendingEffectsRoot = root;
			pendingEffectsLanes = lanes;
			pendingEffectsRemainingLanes = didIncludeRenderPhaseUpdate;
			pendingPassiveTransitions = transitions;
			pendingRecoverableErrors = recoverableErrors;
			0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? (root.callbackNode = null, root.callbackPriority = 0, scheduleCallback$1(NormalPriority$1, function() {
				flushPassiveEffects();
				return null;
			})) : (root.callbackNode = null, root.callbackPriority = 0);
			recoverableErrors = 0 !== (finishedWork.flags & 13878);
			if (0 !== (finishedWork.subtreeFlags & 13878) || recoverableErrors) {
				recoverableErrors = ReactSharedInternals.T;
				ReactSharedInternals.T = null;
				transitions = ReactDOMSharedInternals.p;
				ReactDOMSharedInternals.p = 2;
				spawnedLane = executionContext;
				executionContext |= 4;
				try {
					commitBeforeMutationEffects(root, finishedWork, lanes);
				} finally {
					executionContext = spawnedLane, ReactDOMSharedInternals.p = transitions, ReactSharedInternals.T = recoverableErrors;
				}
			}
			pendingEffectsStatus = 1;
			flushMutationEffects();
			flushLayoutEffects();
			flushSpawnedWork();
		}
	}
	function flushMutationEffects() {
		if (1 === pendingEffectsStatus) {
			pendingEffectsStatus = 0;
			var root = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootMutationHasEffect = 0 !== (finishedWork.flags & 13878);
			if (0 !== (finishedWork.subtreeFlags & 13878) || rootMutationHasEffect) {
				rootMutationHasEffect = ReactSharedInternals.T;
				ReactSharedInternals.T = null;
				var previousPriority = ReactDOMSharedInternals.p;
				ReactDOMSharedInternals.p = 2;
				var prevExecutionContext = executionContext;
				executionContext |= 4;
				try {
					commitMutationEffectsOnFiber(finishedWork, root);
					var priorSelectionInformation = selectionInformation, curFocusedElem = getActiveElementDeep(root.containerInfo), priorFocusedElem = priorSelectionInformation.focusedElem, priorSelectionRange = priorSelectionInformation.selectionRange;
					if (curFocusedElem !== priorFocusedElem && priorFocusedElem && priorFocusedElem.ownerDocument && containsNode(priorFocusedElem.ownerDocument.documentElement, priorFocusedElem)) {
						if (null !== priorSelectionRange && hasSelectionCapabilities(priorFocusedElem)) {
							var start = priorSelectionRange.start, end = priorSelectionRange.end;
							void 0 === end && (end = start);
							if ("selectionStart" in priorFocusedElem) priorFocusedElem.selectionStart = start, priorFocusedElem.selectionEnd = Math.min(end, priorFocusedElem.value.length);
							else {
								var doc = priorFocusedElem.ownerDocument || document, win = doc && doc.defaultView || window;
								if (win.getSelection) {
									var selection = win.getSelection(), length = priorFocusedElem.textContent.length, start$jscomp$0 = Math.min(priorSelectionRange.start, length), end$jscomp$0 = void 0 === priorSelectionRange.end ? start$jscomp$0 : Math.min(priorSelectionRange.end, length);
									!selection.extend && start$jscomp$0 > end$jscomp$0 && (curFocusedElem = end$jscomp$0, end$jscomp$0 = start$jscomp$0, start$jscomp$0 = curFocusedElem);
									var startMarker = getNodeForCharacterOffset(priorFocusedElem, start$jscomp$0), endMarker = getNodeForCharacterOffset(priorFocusedElem, end$jscomp$0);
									if (startMarker && endMarker && (1 !== selection.rangeCount || selection.anchorNode !== startMarker.node || selection.anchorOffset !== startMarker.offset || selection.focusNode !== endMarker.node || selection.focusOffset !== endMarker.offset)) {
										var range = doc.createRange();
										range.setStart(startMarker.node, startMarker.offset);
										selection.removeAllRanges();
										start$jscomp$0 > end$jscomp$0 ? (selection.addRange(range), selection.extend(endMarker.node, endMarker.offset)) : (range.setEnd(endMarker.node, endMarker.offset), selection.addRange(range));
									}
								}
							}
						}
						doc = [];
						for (selection = priorFocusedElem; selection = selection.parentNode;) 1 === selection.nodeType && doc.push({
							element: selection,
							left: selection.scrollLeft,
							top: selection.scrollTop
						});
						"function" === typeof priorFocusedElem.focus && priorFocusedElem.focus();
						for (priorFocusedElem = 0; priorFocusedElem < doc.length; priorFocusedElem++) {
							var info = doc[priorFocusedElem];
							info.element.scrollLeft = info.left;
							info.element.scrollTop = info.top;
						}
					}
					_enabled = !!eventsEnabled;
					selectionInformation = eventsEnabled = null;
				} finally {
					executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootMutationHasEffect;
				}
			}
			root.current = finishedWork;
			pendingEffectsStatus = 2;
		}
	}
	function flushLayoutEffects() {
		if (2 === pendingEffectsStatus) {
			pendingEffectsStatus = 0;
			var root = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootHasLayoutEffect = 0 !== (finishedWork.flags & 8772);
			if (0 !== (finishedWork.subtreeFlags & 8772) || rootHasLayoutEffect) {
				rootHasLayoutEffect = ReactSharedInternals.T;
				ReactSharedInternals.T = null;
				var previousPriority = ReactDOMSharedInternals.p;
				ReactDOMSharedInternals.p = 2;
				var prevExecutionContext = executionContext;
				executionContext |= 4;
				try {
					commitLayoutEffectOnFiber(root, finishedWork.alternate, finishedWork);
				} finally {
					executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootHasLayoutEffect;
				}
			}
			pendingEffectsStatus = 3;
		}
	}
	function flushSpawnedWork() {
		if (4 === pendingEffectsStatus || 3 === pendingEffectsStatus) {
			pendingEffectsStatus = 0;
			requestPaint();
			var root = pendingEffectsRoot, finishedWork = pendingFinishedWork, lanes = pendingEffectsLanes, recoverableErrors = pendingRecoverableErrors;
			0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? pendingEffectsStatus = 5 : (pendingEffectsStatus = 0, pendingFinishedWork = pendingEffectsRoot = null, releaseRootPooledCache(root, root.pendingLanes));
			var remainingLanes = root.pendingLanes;
			0 === remainingLanes && (legacyErrorBoundariesThatAlreadyFailed = null);
			lanesToEventPriority(lanes);
			finishedWork = finishedWork.stateNode;
			if (injectedHook && "function" === typeof injectedHook.onCommitFiberRoot) try {
				injectedHook.onCommitFiberRoot(rendererID, finishedWork, void 0, 128 === (finishedWork.current.flags & 128));
			} catch (err) {}
			if (null !== recoverableErrors) {
				finishedWork = ReactSharedInternals.T;
				remainingLanes = ReactDOMSharedInternals.p;
				ReactDOMSharedInternals.p = 2;
				ReactSharedInternals.T = null;
				try {
					for (var onRecoverableError = root.onRecoverableError, i = 0; i < recoverableErrors.length; i++) {
						var recoverableError = recoverableErrors[i];
						onRecoverableError(recoverableError.value, { componentStack: recoverableError.stack });
					}
				} finally {
					ReactSharedInternals.T = finishedWork, ReactDOMSharedInternals.p = remainingLanes;
				}
			}
			0 !== (pendingEffectsLanes & 3) && flushPendingEffects();
			ensureRootIsScheduled(root);
			remainingLanes = root.pendingLanes;
			0 !== (lanes & 261930) && 0 !== (remainingLanes & 42) ? root === rootWithNestedUpdates ? nestedUpdateCount++ : (nestedUpdateCount = 0, rootWithNestedUpdates = root) : nestedUpdateCount = 0;
			flushSyncWorkAcrossRoots_impl(0, !1);
		}
	}
	function releaseRootPooledCache(root, remainingLanes) {
		0 === (root.pooledCacheLanes &= remainingLanes) && (remainingLanes = root.pooledCache, null != remainingLanes && (root.pooledCache = null, releaseCache(remainingLanes)));
	}
	function flushPendingEffects() {
		flushMutationEffects();
		flushLayoutEffects();
		flushSpawnedWork();
		return flushPassiveEffects();
	}
	function flushPassiveEffects() {
		if (5 !== pendingEffectsStatus) return !1;
		var root = pendingEffectsRoot, remainingLanes = pendingEffectsRemainingLanes;
		pendingEffectsRemainingLanes = 0;
		var renderPriority = lanesToEventPriority(pendingEffectsLanes), prevTransition = ReactSharedInternals.T, previousPriority = ReactDOMSharedInternals.p;
		try {
			ReactDOMSharedInternals.p = 32 > renderPriority ? 32 : renderPriority;
			ReactSharedInternals.T = null;
			renderPriority = pendingPassiveTransitions;
			pendingPassiveTransitions = null;
			var root$jscomp$0 = pendingEffectsRoot, lanes = pendingEffectsLanes;
			pendingEffectsStatus = 0;
			pendingFinishedWork = pendingEffectsRoot = null;
			pendingEffectsLanes = 0;
			if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(331));
			var prevExecutionContext = executionContext;
			executionContext |= 4;
			commitPassiveUnmountOnFiber(root$jscomp$0.current);
			commitPassiveMountOnFiber(root$jscomp$0, root$jscomp$0.current, lanes, renderPriority);
			executionContext = prevExecutionContext;
			flushSyncWorkAcrossRoots_impl(0, !1);
			if (injectedHook && "function" === typeof injectedHook.onPostCommitFiberRoot) try {
				injectedHook.onPostCommitFiberRoot(rendererID, root$jscomp$0);
			} catch (err) {}
			return !0;
		} finally {
			ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition, releaseRootPooledCache(root, remainingLanes);
		}
	}
	function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
		sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
		sourceFiber = createRootErrorUpdate(rootFiber.stateNode, sourceFiber, 2);
		rootFiber = enqueueUpdate(rootFiber, sourceFiber, 2);
		null !== rootFiber && (markRootUpdated$1(rootFiber, 2), ensureRootIsScheduled(rootFiber));
	}
	function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error) {
		if (3 === sourceFiber.tag) captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
		else for (; null !== nearestMountedAncestor;) {
			if (3 === nearestMountedAncestor.tag) {
				captureCommitPhaseErrorOnRoot(nearestMountedAncestor, sourceFiber, error);
				break;
			} else if (1 === nearestMountedAncestor.tag) {
				var instance = nearestMountedAncestor.stateNode;
				if ("function" === typeof nearestMountedAncestor.type.getDerivedStateFromError || "function" === typeof instance.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(instance))) {
					sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
					error = createClassErrorUpdate(2);
					instance = enqueueUpdate(nearestMountedAncestor, error, 2);
					null !== instance && (initializeClassErrorUpdate(error, instance, nearestMountedAncestor, sourceFiber), markRootUpdated$1(instance, 2), ensureRootIsScheduled(instance));
					break;
				}
			}
			nearestMountedAncestor = nearestMountedAncestor.return;
		}
	}
	function attachPingListener(root, wakeable, lanes) {
		var pingCache = root.pingCache;
		if (null === pingCache) {
			pingCache = root.pingCache = new PossiblyWeakMap();
			var threadIDs = /* @__PURE__ */ new Set();
			pingCache.set(wakeable, threadIDs);
		} else threadIDs = pingCache.get(wakeable), void 0 === threadIDs && (threadIDs = /* @__PURE__ */ new Set(), pingCache.set(wakeable, threadIDs));
		threadIDs.has(lanes) || (workInProgressRootDidAttachPingListener = !0, threadIDs.add(lanes), root = pingSuspendedRoot.bind(null, root, wakeable, lanes), wakeable.then(root, root));
	}
	function pingSuspendedRoot(root, wakeable, pingedLanes) {
		var pingCache = root.pingCache;
		null !== pingCache && pingCache.delete(wakeable);
		root.pingedLanes |= root.suspendedLanes & pingedLanes;
		root.warmLanes &= ~pingedLanes;
		workInProgressRoot === root && (workInProgressRootRenderLanes & pingedLanes) === pingedLanes && (4 === workInProgressRootExitStatus || 3 === workInProgressRootExitStatus && (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes && 300 > now() - globalMostRecentFallbackTime ? 0 === (executionContext & 2) && prepareFreshStack(root, 0) : workInProgressRootPingedLanes |= pingedLanes, workInProgressSuspendedRetryLanes === workInProgressRootRenderLanes && (workInProgressSuspendedRetryLanes = 0));
		ensureRootIsScheduled(root);
	}
	function retryTimedOutBoundary(boundaryFiber, retryLane) {
		0 === retryLane && (retryLane = claimNextRetryLane());
		boundaryFiber = enqueueConcurrentRenderForLane(boundaryFiber, retryLane);
		null !== boundaryFiber && (markRootUpdated$1(boundaryFiber, retryLane), ensureRootIsScheduled(boundaryFiber));
	}
	function retryDehydratedSuspenseBoundary(boundaryFiber) {
		var suspenseState = boundaryFiber.memoizedState, retryLane = 0;
		null !== suspenseState && (retryLane = suspenseState.retryLane);
		retryTimedOutBoundary(boundaryFiber, retryLane);
	}
	function resolveRetryWakeable(boundaryFiber, wakeable) {
		var retryLane = 0;
		switch (boundaryFiber.tag) {
			case 31:
			case 13:
				var retryCache = boundaryFiber.stateNode;
				var suspenseState = boundaryFiber.memoizedState;
				null !== suspenseState && (retryLane = suspenseState.retryLane);
				break;
			case 19:
				retryCache = boundaryFiber.stateNode;
				break;
			case 22:
				retryCache = boundaryFiber.stateNode._retryCache;
				break;
			default: throw Error(formatProdErrorMessage(314));
		}
		null !== retryCache && retryCache.delete(wakeable);
		retryTimedOutBoundary(boundaryFiber, retryLane);
	}
	function scheduleCallback$1(priorityLevel, callback) {
		return scheduleCallback$3(priorityLevel, callback);
	}
	var firstScheduledRoot = null, lastScheduledRoot = null, didScheduleMicrotask = !1, mightHavePendingSyncWork = !1, isFlushingWork = !1, currentEventTransitionLane = 0;
	function ensureRootIsScheduled(root) {
		root !== lastScheduledRoot && null === root.next && (null === lastScheduledRoot ? firstScheduledRoot = lastScheduledRoot = root : lastScheduledRoot = lastScheduledRoot.next = root);
		mightHavePendingSyncWork = !0;
		didScheduleMicrotask || (didScheduleMicrotask = !0, scheduleImmediateRootScheduleTask());
	}
	function flushSyncWorkAcrossRoots_impl(syncTransitionLanes, onlyLegacy) {
		if (!isFlushingWork && mightHavePendingSyncWork) {
			isFlushingWork = !0;
			do {
				var didPerformSomeWork = !1;
				for (var root$170 = firstScheduledRoot; null !== root$170;) {
					if (!onlyLegacy) if (0 !== syncTransitionLanes) {
						var pendingLanes = root$170.pendingLanes;
						if (0 === pendingLanes) var JSCompiler_inline_result = 0;
						else {
							var suspendedLanes = root$170.suspendedLanes, pingedLanes = root$170.pingedLanes;
							JSCompiler_inline_result = (1 << 31 - clz32(42 | syncTransitionLanes) + 1) - 1;
							JSCompiler_inline_result &= pendingLanes & ~(suspendedLanes & ~pingedLanes);
							JSCompiler_inline_result = JSCompiler_inline_result & 201326741 ? JSCompiler_inline_result & 201326741 | 1 : JSCompiler_inline_result ? JSCompiler_inline_result | 2 : 0;
						}
						0 !== JSCompiler_inline_result && (didPerformSomeWork = !0, performSyncWorkOnRoot(root$170, JSCompiler_inline_result));
					} else JSCompiler_inline_result = workInProgressRootRenderLanes, JSCompiler_inline_result = getNextLanes(root$170, root$170 === workInProgressRoot ? JSCompiler_inline_result : 0, null !== root$170.cancelPendingCommit || -1 !== root$170.timeoutHandle), 0 === (JSCompiler_inline_result & 3) || checkIfRootIsPrerendering(root$170, JSCompiler_inline_result) || (didPerformSomeWork = !0, performSyncWorkOnRoot(root$170, JSCompiler_inline_result));
					root$170 = root$170.next;
				}
			} while (didPerformSomeWork);
			isFlushingWork = !1;
		}
	}
	function processRootScheduleInImmediateTask() {
		processRootScheduleInMicrotask();
	}
	function processRootScheduleInMicrotask() {
		mightHavePendingSyncWork = didScheduleMicrotask = !1;
		var syncTransitionLanes = 0;
		0 !== currentEventTransitionLane && shouldAttemptEagerTransition() && (syncTransitionLanes = currentEventTransitionLane);
		for (var currentTime = now(), prev = null, root = firstScheduledRoot; null !== root;) {
			var next = root.next, nextLanes = scheduleTaskForRootDuringMicrotask(root, currentTime);
			if (0 === nextLanes) root.next = null, null === prev ? firstScheduledRoot = next : prev.next = next, null === next && (lastScheduledRoot = prev);
			else if (prev = root, 0 !== syncTransitionLanes || 0 !== (nextLanes & 3)) mightHavePendingSyncWork = !0;
			root = next;
		}
		0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus || flushSyncWorkAcrossRoots_impl(syncTransitionLanes, !1);
		0 !== currentEventTransitionLane && (currentEventTransitionLane = 0);
	}
	function scheduleTaskForRootDuringMicrotask(root, currentTime) {
		for (var suspendedLanes = root.suspendedLanes, pingedLanes = root.pingedLanes, expirationTimes = root.expirationTimes, lanes = root.pendingLanes & -62914561; 0 < lanes;) {
			var index$5 = 31 - clz32(lanes), lane = 1 << index$5, expirationTime = expirationTimes[index$5];
			if (-1 === expirationTime) {
				if (0 === (lane & suspendedLanes) || 0 !== (lane & pingedLanes)) expirationTimes[index$5] = computeExpirationTime(lane, currentTime);
			} else expirationTime <= currentTime && (root.expiredLanes |= lane);
			lanes &= ~lane;
		}
		currentTime = workInProgressRoot;
		suspendedLanes = workInProgressRootRenderLanes;
		suspendedLanes = getNextLanes(root, root === currentTime ? suspendedLanes : 0, null !== root.cancelPendingCommit || -1 !== root.timeoutHandle);
		pingedLanes = root.callbackNode;
		if (0 === suspendedLanes || root === currentTime && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root.cancelPendingCommit) return null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes), root.callbackNode = null, root.callbackPriority = 0;
		if (0 === (suspendedLanes & 3) || checkIfRootIsPrerendering(root, suspendedLanes)) {
			currentTime = suspendedLanes & -suspendedLanes;
			if (currentTime === root.callbackPriority) return currentTime;
			null !== pingedLanes && cancelCallback$1(pingedLanes);
			switch (lanesToEventPriority(suspendedLanes)) {
				case 2:
				case 8:
					suspendedLanes = UserBlockingPriority;
					break;
				case 32:
					suspendedLanes = NormalPriority$1;
					break;
				case 268435456:
					suspendedLanes = IdlePriority;
					break;
				default: suspendedLanes = NormalPriority$1;
			}
			pingedLanes = performWorkOnRootViaSchedulerTask.bind(null, root);
			suspendedLanes = scheduleCallback$3(suspendedLanes, pingedLanes);
			root.callbackPriority = currentTime;
			root.callbackNode = suspendedLanes;
			return currentTime;
		}
		null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes);
		root.callbackPriority = 2;
		root.callbackNode = null;
		return 2;
	}
	function performWorkOnRootViaSchedulerTask(root, didTimeout) {
		if (0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus) return root.callbackNode = null, root.callbackPriority = 0, null;
		var originalCallbackNode = root.callbackNode;
		if (flushPendingEffects() && root.callbackNode !== originalCallbackNode) return null;
		var workInProgressRootRenderLanes$jscomp$0 = workInProgressRootRenderLanes;
		workInProgressRootRenderLanes$jscomp$0 = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes$jscomp$0 : 0, null !== root.cancelPendingCommit || -1 !== root.timeoutHandle);
		if (0 === workInProgressRootRenderLanes$jscomp$0) return null;
		performWorkOnRoot(root, workInProgressRootRenderLanes$jscomp$0, didTimeout);
		scheduleTaskForRootDuringMicrotask(root, now());
		return null != root.callbackNode && root.callbackNode === originalCallbackNode ? performWorkOnRootViaSchedulerTask.bind(null, root) : null;
	}
	function performSyncWorkOnRoot(root, lanes) {
		if (flushPendingEffects()) return null;
		performWorkOnRoot(root, lanes, !0);
	}
	function scheduleImmediateRootScheduleTask() {
		scheduleMicrotask(function() {
			0 !== (executionContext & 6) ? scheduleCallback$3(ImmediatePriority, processRootScheduleInImmediateTask) : processRootScheduleInMicrotask();
		});
	}
	function requestTransitionLane() {
		if (0 === currentEventTransitionLane) {
			var actionScopeLane = currentEntangledLane;
			0 === actionScopeLane && (actionScopeLane = nextTransitionUpdateLane, nextTransitionUpdateLane <<= 1, 0 === (nextTransitionUpdateLane & 261888) && (nextTransitionUpdateLane = 256));
			currentEventTransitionLane = actionScopeLane;
		}
		return currentEventTransitionLane;
	}
	function coerceFormActionProp(actionProp) {
		return null == actionProp || "symbol" === typeof actionProp || "boolean" === typeof actionProp ? null : "function" === typeof actionProp ? actionProp : sanitizeURL("" + actionProp);
	}
	function createFormDataWithSubmitter(form, submitter) {
		var temp = submitter.ownerDocument.createElement("input");
		temp.name = submitter.name;
		temp.value = submitter.value;
		form.id && temp.setAttribute("form", form.id);
		submitter.parentNode.insertBefore(temp, submitter);
		form = new FormData(form);
		temp.parentNode.removeChild(temp);
		return form;
	}
	function extractEvents$1(dispatchQueue, domEventName, maybeTargetInst, nativeEvent, nativeEventTarget) {
		if ("submit" === domEventName && maybeTargetInst && maybeTargetInst.stateNode === nativeEventTarget) {
			var action = coerceFormActionProp((nativeEventTarget[internalPropsKey] || null).action), submitter = nativeEvent.submitter;
			submitter && (domEventName = (domEventName = submitter[internalPropsKey] || null) ? coerceFormActionProp(domEventName.formAction) : submitter.getAttribute("formAction"), null !== domEventName && (action = domEventName, submitter = null));
			var event = new SyntheticEvent("action", "action", null, nativeEvent, nativeEventTarget);
			dispatchQueue.push({
				event,
				listeners: [{
					instance: null,
					listener: function() {
						if (nativeEvent.defaultPrevented) {
							if (0 !== currentEventTransitionLane) {
								var formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget);
								startHostTransition(maybeTargetInst, {
									pending: !0,
									data: formData,
									method: nativeEventTarget.method,
									action
								}, null, formData);
							}
						} else "function" === typeof action && (event.preventDefault(), formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget), startHostTransition(maybeTargetInst, {
							pending: !0,
							data: formData,
							method: nativeEventTarget.method,
							action
						}, action, formData));
					},
					currentTarget: nativeEventTarget
				}]
			});
		}
	}
	for (var i$jscomp$inline_1577 = 0; i$jscomp$inline_1577 < simpleEventPluginEvents.length; i$jscomp$inline_1577++) {
		var eventName$jscomp$inline_1578 = simpleEventPluginEvents[i$jscomp$inline_1577];
		registerSimpleEvent(eventName$jscomp$inline_1578.toLowerCase(), "on" + (eventName$jscomp$inline_1578[0].toUpperCase() + eventName$jscomp$inline_1578.slice(1)));
	}
	registerSimpleEvent(ANIMATION_END, "onAnimationEnd");
	registerSimpleEvent(ANIMATION_ITERATION, "onAnimationIteration");
	registerSimpleEvent(ANIMATION_START, "onAnimationStart");
	registerSimpleEvent("dblclick", "onDoubleClick");
	registerSimpleEvent("focusin", "onFocus");
	registerSimpleEvent("focusout", "onBlur");
	registerSimpleEvent(TRANSITION_RUN, "onTransitionRun");
	registerSimpleEvent(TRANSITION_START, "onTransitionStart");
	registerSimpleEvent(TRANSITION_CANCEL, "onTransitionCancel");
	registerSimpleEvent(TRANSITION_END, "onTransitionEnd");
	registerDirectEvent("onMouseEnter", ["mouseout", "mouseover"]);
	registerDirectEvent("onMouseLeave", ["mouseout", "mouseover"]);
	registerDirectEvent("onPointerEnter", ["pointerout", "pointerover"]);
	registerDirectEvent("onPointerLeave", ["pointerout", "pointerover"]);
	registerTwoPhaseEvent("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
	registerTwoPhaseEvent("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
	registerTwoPhaseEvent("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]);
	registerTwoPhaseEvent("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
	registerTwoPhaseEvent("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
	registerTwoPhaseEvent("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var mediaEventTypes = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), nonDelegatedEvents = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(mediaEventTypes));
	function processDispatchQueue(dispatchQueue, eventSystemFlags) {
		eventSystemFlags = 0 !== (eventSystemFlags & 4);
		for (var i = 0; i < dispatchQueue.length; i++) {
			var _dispatchQueue$i = dispatchQueue[i], event = _dispatchQueue$i.event;
			_dispatchQueue$i = _dispatchQueue$i.listeners;
			a: {
				var previousInstance = void 0;
				if (eventSystemFlags) for (var i$jscomp$0 = _dispatchQueue$i.length - 1; 0 <= i$jscomp$0; i$jscomp$0--) {
					var _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0], instance = _dispatchListeners$i.instance, currentTarget = _dispatchListeners$i.currentTarget;
					_dispatchListeners$i = _dispatchListeners$i.listener;
					if (instance !== previousInstance && event.isPropagationStopped()) break a;
					previousInstance = _dispatchListeners$i;
					event.currentTarget = currentTarget;
					try {
						previousInstance(event);
					} catch (error) {
						reportGlobalError(error);
					}
					event.currentTarget = null;
					previousInstance = instance;
				}
				else for (i$jscomp$0 = 0; i$jscomp$0 < _dispatchQueue$i.length; i$jscomp$0++) {
					_dispatchListeners$i = _dispatchQueue$i[i$jscomp$0];
					instance = _dispatchListeners$i.instance;
					currentTarget = _dispatchListeners$i.currentTarget;
					_dispatchListeners$i = _dispatchListeners$i.listener;
					if (instance !== previousInstance && event.isPropagationStopped()) break a;
					previousInstance = _dispatchListeners$i;
					event.currentTarget = currentTarget;
					try {
						previousInstance(event);
					} catch (error) {
						reportGlobalError(error);
					}
					event.currentTarget = null;
					previousInstance = instance;
				}
			}
		}
	}
	function listenToNonDelegatedEvent(domEventName, targetElement) {
		var JSCompiler_inline_result = targetElement[internalEventHandlersKey];
		void 0 === JSCompiler_inline_result && (JSCompiler_inline_result = targetElement[internalEventHandlersKey] = /* @__PURE__ */ new Set());
		var listenerSetKey = domEventName + "__bubble";
		JSCompiler_inline_result.has(listenerSetKey) || (addTrappedEventListener(targetElement, domEventName, 2, !1), JSCompiler_inline_result.add(listenerSetKey));
	}
	function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
		var eventSystemFlags = 0;
		isCapturePhaseListener && (eventSystemFlags |= 4);
		addTrappedEventListener(target, domEventName, eventSystemFlags, isCapturePhaseListener);
	}
	var listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);
	function listenToAllSupportedEvents(rootContainerElement) {
		if (!rootContainerElement[listeningMarker]) {
			rootContainerElement[listeningMarker] = !0;
			allNativeEvents.forEach(function(domEventName) {
				"selectionchange" !== domEventName && (nonDelegatedEvents.has(domEventName) || listenToNativeEvent(domEventName, !1, rootContainerElement), listenToNativeEvent(domEventName, !0, rootContainerElement));
			});
			var ownerDocument = 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
			null === ownerDocument || ownerDocument[listeningMarker] || (ownerDocument[listeningMarker] = !0, listenToNativeEvent("selectionchange", !1, ownerDocument));
		}
	}
	function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener) {
		switch (getEventPriority(domEventName)) {
			case 2:
				var listenerWrapper = dispatchDiscreteEvent;
				break;
			case 8:
				listenerWrapper = dispatchContinuousEvent;
				break;
			default: listenerWrapper = dispatchEvent;
		}
		eventSystemFlags = listenerWrapper.bind(null, domEventName, eventSystemFlags, targetContainer);
		listenerWrapper = void 0;
		!passiveBrowserEventsSupported || "touchstart" !== domEventName && "touchmove" !== domEventName && "wheel" !== domEventName || (listenerWrapper = !0);
		isCapturePhaseListener ? void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
			capture: !0,
			passive: listenerWrapper
		}) : targetContainer.addEventListener(domEventName, eventSystemFlags, !0) : void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, { passive: listenerWrapper }) : targetContainer.addEventListener(domEventName, eventSystemFlags, !1);
	}
	function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst$jscomp$0, targetContainer) {
		var ancestorInst = targetInst$jscomp$0;
		if (0 === (eventSystemFlags & 1) && 0 === (eventSystemFlags & 2) && null !== targetInst$jscomp$0) a: for (;;) {
			if (null === targetInst$jscomp$0) return;
			var nodeTag = targetInst$jscomp$0.tag;
			if (3 === nodeTag || 4 === nodeTag) {
				var container = targetInst$jscomp$0.stateNode.containerInfo;
				if (container === targetContainer) break;
				if (4 === nodeTag) for (nodeTag = targetInst$jscomp$0.return; null !== nodeTag;) {
					var grandTag = nodeTag.tag;
					if ((3 === grandTag || 4 === grandTag) && nodeTag.stateNode.containerInfo === targetContainer) return;
					nodeTag = nodeTag.return;
				}
				for (; null !== container;) {
					nodeTag = getClosestInstanceFromNode(container);
					if (null === nodeTag) return;
					grandTag = nodeTag.tag;
					if (5 === grandTag || 6 === grandTag || 26 === grandTag || 27 === grandTag) {
						targetInst$jscomp$0 = ancestorInst = nodeTag;
						continue a;
					}
					container = container.parentNode;
				}
			}
			targetInst$jscomp$0 = targetInst$jscomp$0.return;
		}
		batchedUpdates$1(function() {
			var targetInst = ancestorInst, nativeEventTarget = getEventTarget(nativeEvent), dispatchQueue = [];
			a: {
				var reactName = topLevelEventsToReactNames.get(domEventName);
				if (void 0 !== reactName) {
					var SyntheticEventCtor = SyntheticEvent, reactEventType = domEventName;
					switch (domEventName) {
						case "keypress": if (0 === getEventCharCode(nativeEvent)) break a;
						case "keydown":
						case "keyup":
							SyntheticEventCtor = SyntheticKeyboardEvent;
							break;
						case "focusin":
							reactEventType = "focus";
							SyntheticEventCtor = SyntheticFocusEvent;
							break;
						case "focusout":
							reactEventType = "blur";
							SyntheticEventCtor = SyntheticFocusEvent;
							break;
						case "beforeblur":
						case "afterblur":
							SyntheticEventCtor = SyntheticFocusEvent;
							break;
						case "click": if (2 === nativeEvent.button) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							SyntheticEventCtor = SyntheticMouseEvent;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							SyntheticEventCtor = SyntheticDragEvent;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							SyntheticEventCtor = SyntheticTouchEvent;
							break;
						case ANIMATION_END:
						case ANIMATION_ITERATION:
						case ANIMATION_START:
							SyntheticEventCtor = SyntheticAnimationEvent;
							break;
						case TRANSITION_END:
							SyntheticEventCtor = SyntheticTransitionEvent;
							break;
						case "scroll":
						case "scrollend":
							SyntheticEventCtor = SyntheticUIEvent;
							break;
						case "wheel":
							SyntheticEventCtor = SyntheticWheelEvent;
							break;
						case "copy":
						case "cut":
						case "paste":
							SyntheticEventCtor = SyntheticClipboardEvent;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							SyntheticEventCtor = SyntheticPointerEvent;
							break;
						case "toggle":
						case "beforetoggle": SyntheticEventCtor = SyntheticToggleEvent;
					}
					var inCapturePhase = 0 !== (eventSystemFlags & 4), accumulateTargetOnly = !inCapturePhase && ("scroll" === domEventName || "scrollend" === domEventName), reactEventName = inCapturePhase ? null !== reactName ? reactName + "Capture" : null : reactName;
					inCapturePhase = [];
					for (var instance = targetInst, lastHostComponent; null !== instance;) {
						var _instance = instance;
						lastHostComponent = _instance.stateNode;
						_instance = _instance.tag;
						5 !== _instance && 26 !== _instance && 27 !== _instance || null === lastHostComponent || null === reactEventName || (_instance = getListener(instance, reactEventName), null != _instance && inCapturePhase.push(createDispatchListener(instance, _instance, lastHostComponent)));
						if (accumulateTargetOnly) break;
						instance = instance.return;
					}
					0 < inCapturePhase.length && (reactName = new SyntheticEventCtor(reactName, reactEventType, null, nativeEvent, nativeEventTarget), dispatchQueue.push({
						event: reactName,
						listeners: inCapturePhase
					}));
				}
			}
			if (0 === (eventSystemFlags & 7)) {
				a: {
					reactName = "mouseover" === domEventName || "pointerover" === domEventName;
					SyntheticEventCtor = "mouseout" === domEventName || "pointerout" === domEventName;
					if (reactName && nativeEvent !== currentReplayingEvent && (reactEventType = nativeEvent.relatedTarget || nativeEvent.fromElement) && (getClosestInstanceFromNode(reactEventType) || reactEventType[internalContainerInstanceKey])) break a;
					if (SyntheticEventCtor || reactName) {
						reactName = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget : (reactName = nativeEventTarget.ownerDocument) ? reactName.defaultView || reactName.parentWindow : window;
						if (SyntheticEventCtor) {
							if (reactEventType = nativeEvent.relatedTarget || nativeEvent.toElement, SyntheticEventCtor = targetInst, reactEventType = reactEventType ? getClosestInstanceFromNode(reactEventType) : null, null !== reactEventType && (accumulateTargetOnly = getNearestMountedFiber(reactEventType), inCapturePhase = reactEventType.tag, reactEventType !== accumulateTargetOnly || 5 !== inCapturePhase && 27 !== inCapturePhase && 6 !== inCapturePhase)) reactEventType = null;
						} else SyntheticEventCtor = null, reactEventType = targetInst;
						if (SyntheticEventCtor !== reactEventType) {
							inCapturePhase = SyntheticMouseEvent;
							_instance = "onMouseLeave";
							reactEventName = "onMouseEnter";
							instance = "mouse";
							if ("pointerout" === domEventName || "pointerover" === domEventName) inCapturePhase = SyntheticPointerEvent, _instance = "onPointerLeave", reactEventName = "onPointerEnter", instance = "pointer";
							accumulateTargetOnly = null == SyntheticEventCtor ? reactName : getNodeFromInstance(SyntheticEventCtor);
							lastHostComponent = null == reactEventType ? reactName : getNodeFromInstance(reactEventType);
							reactName = new inCapturePhase(_instance, instance + "leave", SyntheticEventCtor, nativeEvent, nativeEventTarget);
							reactName.target = accumulateTargetOnly;
							reactName.relatedTarget = lastHostComponent;
							_instance = null;
							getClosestInstanceFromNode(nativeEventTarget) === targetInst && (inCapturePhase = new inCapturePhase(reactEventName, instance + "enter", reactEventType, nativeEvent, nativeEventTarget), inCapturePhase.target = lastHostComponent, inCapturePhase.relatedTarget = accumulateTargetOnly, _instance = inCapturePhase);
							accumulateTargetOnly = _instance;
							if (SyntheticEventCtor && reactEventType) b: {
								inCapturePhase = getParent;
								reactEventName = SyntheticEventCtor;
								instance = reactEventType;
								lastHostComponent = 0;
								for (_instance = reactEventName; _instance; _instance = inCapturePhase(_instance)) lastHostComponent++;
								_instance = 0;
								for (var tempB = instance; tempB; tempB = inCapturePhase(tempB)) _instance++;
								for (; 0 < lastHostComponent - _instance;) reactEventName = inCapturePhase(reactEventName), lastHostComponent--;
								for (; 0 < _instance - lastHostComponent;) instance = inCapturePhase(instance), _instance--;
								for (; lastHostComponent--;) {
									if (reactEventName === instance || null !== instance && reactEventName === instance.alternate) {
										inCapturePhase = reactEventName;
										break b;
									}
									reactEventName = inCapturePhase(reactEventName);
									instance = inCapturePhase(instance);
								}
								inCapturePhase = null;
							}
							else inCapturePhase = null;
							null !== SyntheticEventCtor && accumulateEnterLeaveListenersForEvent(dispatchQueue, reactName, SyntheticEventCtor, inCapturePhase, !1);
							null !== reactEventType && null !== accumulateTargetOnly && accumulateEnterLeaveListenersForEvent(dispatchQueue, accumulateTargetOnly, reactEventType, inCapturePhase, !0);
						}
					}
				}
				a: {
					reactName = targetInst ? getNodeFromInstance(targetInst) : window;
					SyntheticEventCtor = reactName.nodeName && reactName.nodeName.toLowerCase();
					if ("select" === SyntheticEventCtor || "input" === SyntheticEventCtor && "file" === reactName.type) var getTargetInstFunc = getTargetInstForChangeEvent;
					else if (isTextInputElement(reactName)) if (isInputEventSupported) getTargetInstFunc = getTargetInstForInputOrChangeEvent;
					else {
						getTargetInstFunc = getTargetInstForInputEventPolyfill;
						var handleEventFunc = handleEventsForInputEventPolyfill;
					}
					else SyntheticEventCtor = reactName.nodeName, !SyntheticEventCtor || "input" !== SyntheticEventCtor.toLowerCase() || "checkbox" !== reactName.type && "radio" !== reactName.type ? targetInst && isCustomElement(targetInst.elementType) && (getTargetInstFunc = getTargetInstForChangeEvent) : getTargetInstFunc = getTargetInstForClickEvent;
					if (getTargetInstFunc && (getTargetInstFunc = getTargetInstFunc(domEventName, targetInst))) {
						createAndAccumulateChangeEvent(dispatchQueue, getTargetInstFunc, nativeEvent, nativeEventTarget);
						break a;
					}
					handleEventFunc && handleEventFunc(domEventName, reactName, targetInst);
					"focusout" === domEventName && targetInst && "number" === reactName.type && null != targetInst.memoizedProps.value && setDefaultValue(reactName, "number", reactName.value);
				}
				handleEventFunc = targetInst ? getNodeFromInstance(targetInst) : window;
				switch (domEventName) {
					case "focusin":
						if (isTextInputElement(handleEventFunc) || "true" === handleEventFunc.contentEditable) activeElement = handleEventFunc, activeElementInst = targetInst, lastSelection = null;
						break;
					case "focusout":
						lastSelection = activeElementInst = activeElement = null;
						break;
					case "mousedown":
						mouseDown = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						mouseDown = !1;
						constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
						break;
					case "selectionchange": if (skipSelectionChangeEvent) break;
					case "keydown":
					case "keyup": constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
				}
				var fallbackData;
				if (canUseCompositionEvent) b: {
					switch (domEventName) {
						case "compositionstart":
							var eventType = "onCompositionStart";
							break b;
						case "compositionend":
							eventType = "onCompositionEnd";
							break b;
						case "compositionupdate":
							eventType = "onCompositionUpdate";
							break b;
					}
					eventType = void 0;
				}
				else isComposing ? isFallbackCompositionEnd(domEventName, nativeEvent) && (eventType = "onCompositionEnd") : "keydown" === domEventName && 229 === nativeEvent.keyCode && (eventType = "onCompositionStart");
				eventType && (useFallbackCompositionData && "ko" !== nativeEvent.locale && (isComposing || "onCompositionStart" !== eventType ? "onCompositionEnd" === eventType && isComposing && (fallbackData = getData()) : (root = nativeEventTarget, startText = "value" in root ? root.value : root.textContent, isComposing = !0)), handleEventFunc = accumulateTwoPhaseListeners(targetInst, eventType), 0 < handleEventFunc.length && (eventType = new SyntheticCompositionEvent(eventType, domEventName, null, nativeEvent, nativeEventTarget), dispatchQueue.push({
					event: eventType,
					listeners: handleEventFunc
				}), fallbackData ? eventType.data = fallbackData : (fallbackData = getDataFromCustomEvent(nativeEvent), null !== fallbackData && (eventType.data = fallbackData))));
				if (fallbackData = canUseTextInputEvent ? getNativeBeforeInputChars(domEventName, nativeEvent) : getFallbackBeforeInputChars(domEventName, nativeEvent)) eventType = accumulateTwoPhaseListeners(targetInst, "onBeforeInput"), 0 < eventType.length && (handleEventFunc = new SyntheticCompositionEvent("onBeforeInput", "beforeinput", null, nativeEvent, nativeEventTarget), dispatchQueue.push({
					event: handleEventFunc,
					listeners: eventType
				}), handleEventFunc.data = fallbackData);
				extractEvents$1(dispatchQueue, domEventName, targetInst, nativeEvent, nativeEventTarget);
			}
			processDispatchQueue(dispatchQueue, eventSystemFlags);
		});
	}
	function createDispatchListener(instance, listener, currentTarget) {
		return {
			instance,
			listener,
			currentTarget
		};
	}
	function accumulateTwoPhaseListeners(targetFiber, reactName) {
		for (var captureName = reactName + "Capture", listeners = []; null !== targetFiber;) {
			var _instance2 = targetFiber, stateNode = _instance2.stateNode;
			_instance2 = _instance2.tag;
			5 !== _instance2 && 26 !== _instance2 && 27 !== _instance2 || null === stateNode || (_instance2 = getListener(targetFiber, captureName), null != _instance2 && listeners.unshift(createDispatchListener(targetFiber, _instance2, stateNode)), _instance2 = getListener(targetFiber, reactName), null != _instance2 && listeners.push(createDispatchListener(targetFiber, _instance2, stateNode)));
			if (3 === targetFiber.tag) return listeners;
			targetFiber = targetFiber.return;
		}
		return [];
	}
	function getParent(inst) {
		if (null === inst) return null;
		do
			inst = inst.return;
		while (inst && 5 !== inst.tag && 27 !== inst.tag);
		return inst ? inst : null;
	}
	function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
		for (var registrationName = event._reactName, listeners = []; null !== target && target !== common;) {
			var _instance3 = target, alternate = _instance3.alternate, stateNode = _instance3.stateNode;
			_instance3 = _instance3.tag;
			if (null !== alternate && alternate === common) break;
			5 !== _instance3 && 26 !== _instance3 && 27 !== _instance3 || null === stateNode || (alternate = stateNode, inCapturePhase ? (stateNode = getListener(target, registrationName), null != stateNode && listeners.unshift(createDispatchListener(target, stateNode, alternate))) : inCapturePhase || (stateNode = getListener(target, registrationName), null != stateNode && listeners.push(createDispatchListener(target, stateNode, alternate))));
			target = target.return;
		}
		0 !== listeners.length && dispatchQueue.push({
			event,
			listeners
		});
	}
	var NORMALIZE_NEWLINES_REGEX = /\r\n?/g, NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;
	function normalizeMarkupForTextOrAttribute(markup) {
		return ("string" === typeof markup ? markup : "" + markup).replace(NORMALIZE_NEWLINES_REGEX, "\n").replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, "");
	}
	function checkForUnmatchedText(serverText, clientText) {
		clientText = normalizeMarkupForTextOrAttribute(clientText);
		return normalizeMarkupForTextOrAttribute(serverText) === clientText ? !0 : !1;
	}
	function setProp(domElement, tag, key, value, props, prevValue) {
		switch (key) {
			case "children":
				"string" === typeof value ? "body" === tag || "textarea" === tag && "" === value || setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && "body" !== tag && setTextContent(domElement, "" + value);
				break;
			case "className":
				setValueForKnownAttribute(domElement, "class", value);
				break;
			case "tabIndex":
				setValueForKnownAttribute(domElement, "tabindex", value);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				setValueForKnownAttribute(domElement, key, value);
				break;
			case "style":
				setValueForStyles(domElement, value, prevValue);
				break;
			case "data": if ("object" !== tag) {
				setValueForKnownAttribute(domElement, "data", value);
				break;
			}
			case "src":
			case "href":
				if ("" === value && ("a" !== tag || "href" !== key)) {
					domElement.removeAttribute(key);
					break;
				}
				if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) {
					domElement.removeAttribute(key);
					break;
				}
				value = sanitizeURL("" + value);
				domElement.setAttribute(key, value);
				break;
			case "action":
			case "formAction":
				if ("function" === typeof value) {
					domElement.setAttribute(key, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				} else "function" === typeof prevValue && ("formAction" === key ? ("input" !== tag && setProp(domElement, tag, "name", props.name, props, null), setProp(domElement, tag, "formEncType", props.formEncType, props, null), setProp(domElement, tag, "formMethod", props.formMethod, props, null), setProp(domElement, tag, "formTarget", props.formTarget, props, null)) : (setProp(domElement, tag, "encType", props.encType, props, null), setProp(domElement, tag, "method", props.method, props, null), setProp(domElement, tag, "target", props.target, props, null)));
				if (null == value || "symbol" === typeof value || "boolean" === typeof value) {
					domElement.removeAttribute(key);
					break;
				}
				value = sanitizeURL("" + value);
				domElement.setAttribute(key, value);
				break;
			case "onClick":
				null != value && (domElement.onclick = noop$1);
				break;
			case "onScroll":
				null != value && listenToNonDelegatedEvent("scroll", domElement);
				break;
			case "onScrollEnd":
				null != value && listenToNonDelegatedEvent("scrollend", domElement);
				break;
			case "dangerouslySetInnerHTML":
				if (null != value) {
					if ("object" !== typeof value || !("__html" in value)) throw Error(formatProdErrorMessage(61));
					key = value.__html;
					if (null != key) {
						if (null != props.children) throw Error(formatProdErrorMessage(60));
						domElement.innerHTML = key;
					}
				}
				break;
			case "multiple":
				domElement.multiple = value && "function" !== typeof value && "symbol" !== typeof value;
				break;
			case "muted":
				domElement.muted = value && "function" !== typeof value && "symbol" !== typeof value;
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (null == value || "function" === typeof value || "boolean" === typeof value || "symbol" === typeof value) {
					domElement.removeAttribute("xlink:href");
					break;
				}
				key = sanitizeURL("" + value);
				domElement.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", key);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "" + value) : domElement.removeAttribute(key);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "") : domElement.removeAttribute(key);
				break;
			case "capture":
			case "download":
				!0 === value ? domElement.setAttribute(key, "") : !1 !== value && null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				null != value && "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
				break;
			case "rowSpan":
			case "start":
				null == value || "function" === typeof value || "symbol" === typeof value || isNaN(value) ? domElement.removeAttribute(key) : domElement.setAttribute(key, value);
				break;
			case "popover":
				listenToNonDelegatedEvent("beforetoggle", domElement);
				listenToNonDelegatedEvent("toggle", domElement);
				setValueForAttribute(domElement, "popover", value);
				break;
			case "xlinkActuate":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:actuate", value);
				break;
			case "xlinkArcrole":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:arcrole", value);
				break;
			case "xlinkRole":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:role", value);
				break;
			case "xlinkShow":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:show", value);
				break;
			case "xlinkTitle":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:title", value);
				break;
			case "xlinkType":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/1999/xlink", "xlink:type", value);
				break;
			case "xmlBase":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/XML/1998/namespace", "xml:base", value);
				break;
			case "xmlLang":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/XML/1998/namespace", "xml:lang", value);
				break;
			case "xmlSpace":
				setValueForNamespacedAttribute(domElement, "http://www.w3.org/XML/1998/namespace", "xml:space", value);
				break;
			case "is":
				setValueForAttribute(domElement, "is", value);
				break;
			case "innerText":
			case "textContent": break;
			default: if (!(2 < key.length) || "o" !== key[0] && "O" !== key[0] || "n" !== key[1] && "N" !== key[1]) key = aliases.get(key) || key, setValueForAttribute(domElement, key, value);
		}
	}
	function setPropOnCustomElement(domElement, tag, key, value, props, prevValue) {
		switch (key) {
			case "style":
				setValueForStyles(domElement, value, prevValue);
				break;
			case "dangerouslySetInnerHTML":
				if (null != value) {
					if ("object" !== typeof value || !("__html" in value)) throw Error(formatProdErrorMessage(61));
					key = value.__html;
					if (null != key) {
						if (null != props.children) throw Error(formatProdErrorMessage(60));
						domElement.innerHTML = key;
					}
				}
				break;
			case "children":
				"string" === typeof value ? setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && setTextContent(domElement, "" + value);
				break;
			case "onScroll":
				null != value && listenToNonDelegatedEvent("scroll", domElement);
				break;
			case "onScrollEnd":
				null != value && listenToNonDelegatedEvent("scrollend", domElement);
				break;
			case "onClick":
				null != value && (domElement.onclick = noop$1);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": break;
			case "innerText":
			case "textContent": break;
			default: if (!registrationNameDependencies.hasOwnProperty(key)) a: {
				if ("o" === key[0] && "n" === key[1] && (props = key.endsWith("Capture"), tag = key.slice(2, props ? key.length - 7 : void 0), prevValue = domElement[internalPropsKey] || null, prevValue = null != prevValue ? prevValue[key] : null, "function" === typeof prevValue && domElement.removeEventListener(tag, prevValue, props), "function" === typeof value)) {
					"function" !== typeof prevValue && null !== prevValue && (key in domElement ? domElement[key] = null : domElement.hasAttribute(key) && domElement.removeAttribute(key));
					domElement.addEventListener(tag, value, props);
					break a;
				}
				key in domElement ? domElement[key] = value : !0 === value ? domElement.setAttribute(key, "") : setValueForAttribute(domElement, key, value);
			}
		}
	}
	function setInitialProperties(domElement, tag, props) {
		switch (tag) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				listenToNonDelegatedEvent("error", domElement);
				listenToNonDelegatedEvent("load", domElement);
				var hasSrc = !1, hasSrcSet = !1, propKey;
				for (propKey in props) if (props.hasOwnProperty(propKey)) {
					var propValue = props[propKey];
					if (null != propValue) switch (propKey) {
						case "src":
							hasSrc = !0;
							break;
						case "srcSet":
							hasSrcSet = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(137, tag));
						default: setProp(domElement, tag, propKey, propValue, props, null);
					}
				}
				hasSrcSet && setProp(domElement, tag, "srcSet", props.srcSet, props, null);
				hasSrc && setProp(domElement, tag, "src", props.src, props, null);
				return;
			case "input":
				listenToNonDelegatedEvent("invalid", domElement);
				var defaultValue = propKey = propValue = hasSrcSet = null, checked = null, defaultChecked = null;
				for (hasSrc in props) if (props.hasOwnProperty(hasSrc)) {
					var propValue$184 = props[hasSrc];
					if (null != propValue$184) switch (hasSrc) {
						case "name":
							hasSrcSet = propValue$184;
							break;
						case "type":
							propValue = propValue$184;
							break;
						case "checked":
							checked = propValue$184;
							break;
						case "defaultChecked":
							defaultChecked = propValue$184;
							break;
						case "value":
							propKey = propValue$184;
							break;
						case "defaultValue":
							defaultValue = propValue$184;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (null != propValue$184) throw Error(formatProdErrorMessage(137, tag));
							break;
						default: setProp(domElement, tag, hasSrc, propValue$184, props, null);
					}
				}
				initInput(domElement, propKey, defaultValue, checked, defaultChecked, propValue, hasSrcSet, !1);
				return;
			case "select":
				listenToNonDelegatedEvent("invalid", domElement);
				hasSrc = propValue = propKey = null;
				for (hasSrcSet in props) if (props.hasOwnProperty(hasSrcSet) && (defaultValue = props[hasSrcSet], null != defaultValue)) switch (hasSrcSet) {
					case "value":
						propKey = defaultValue;
						break;
					case "defaultValue":
						propValue = defaultValue;
						break;
					case "multiple": hasSrc = defaultValue;
					default: setProp(domElement, tag, hasSrcSet, defaultValue, props, null);
				}
				tag = propKey;
				props = propValue;
				domElement.multiple = !!hasSrc;
				null != tag ? updateOptions(domElement, !!hasSrc, tag, !1) : null != props && updateOptions(domElement, !!hasSrc, props, !0);
				return;
			case "textarea":
				listenToNonDelegatedEvent("invalid", domElement);
				propKey = hasSrcSet = hasSrc = null;
				for (propValue in props) if (props.hasOwnProperty(propValue) && (defaultValue = props[propValue], null != defaultValue)) switch (propValue) {
					case "value":
						hasSrc = defaultValue;
						break;
					case "defaultValue":
						hasSrcSet = defaultValue;
						break;
					case "children":
						propKey = defaultValue;
						break;
					case "dangerouslySetInnerHTML":
						if (null != defaultValue) throw Error(formatProdErrorMessage(91));
						break;
					default: setProp(domElement, tag, propValue, defaultValue, props, null);
				}
				initTextarea(domElement, hasSrc, hasSrcSet, propKey);
				return;
			case "option":
				for (checked in props) if (props.hasOwnProperty(checked) && (hasSrc = props[checked], null != hasSrc)) switch (checked) {
					case "selected":
						domElement.selected = hasSrc && "function" !== typeof hasSrc && "symbol" !== typeof hasSrc;
						break;
					default: setProp(domElement, tag, checked, hasSrc, props, null);
				}
				return;
			case "dialog":
				listenToNonDelegatedEvent("beforetoggle", domElement);
				listenToNonDelegatedEvent("toggle", domElement);
				listenToNonDelegatedEvent("cancel", domElement);
				listenToNonDelegatedEvent("close", domElement);
				break;
			case "iframe":
			case "object":
				listenToNonDelegatedEvent("load", domElement);
				break;
			case "video":
			case "audio":
				for (hasSrc = 0; hasSrc < mediaEventTypes.length; hasSrc++) listenToNonDelegatedEvent(mediaEventTypes[hasSrc], domElement);
				break;
			case "image":
				listenToNonDelegatedEvent("error", domElement);
				listenToNonDelegatedEvent("load", domElement);
				break;
			case "details":
				listenToNonDelegatedEvent("toggle", domElement);
				break;
			case "embed":
			case "source":
			case "link": listenToNonDelegatedEvent("error", domElement), listenToNonDelegatedEvent("load", domElement);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (defaultChecked in props) if (props.hasOwnProperty(defaultChecked) && (hasSrc = props[defaultChecked], null != hasSrc)) switch (defaultChecked) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(formatProdErrorMessage(137, tag));
					default: setProp(domElement, tag, defaultChecked, hasSrc, props, null);
				}
				return;
			default: if (isCustomElement(tag)) {
				for (propValue$184 in props) props.hasOwnProperty(propValue$184) && (hasSrc = props[propValue$184], void 0 !== hasSrc && setPropOnCustomElement(domElement, tag, propValue$184, hasSrc, props, void 0));
				return;
			}
		}
		for (defaultValue in props) props.hasOwnProperty(defaultValue) && (hasSrc = props[defaultValue], null != hasSrc && setProp(domElement, tag, defaultValue, hasSrc, props, null));
	}
	function updateProperties(domElement, tag, lastProps, nextProps) {
		switch (tag) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var name = null, type = null, value = null, defaultValue = null, lastDefaultValue = null, checked = null, defaultChecked = null;
				for (propKey in lastProps) {
					var lastProp = lastProps[propKey];
					if (lastProps.hasOwnProperty(propKey) && null != lastProp) switch (propKey) {
						case "checked": break;
						case "value": break;
						case "defaultValue": lastDefaultValue = lastProp;
						default: nextProps.hasOwnProperty(propKey) || setProp(domElement, tag, propKey, null, nextProps, lastProp);
					}
				}
				for (var propKey$201 in nextProps) {
					var propKey = nextProps[propKey$201];
					lastProp = lastProps[propKey$201];
					if (nextProps.hasOwnProperty(propKey$201) && (null != propKey || null != lastProp)) switch (propKey$201) {
						case "type":
							type = propKey;
							break;
						case "name":
							name = propKey;
							break;
						case "checked":
							checked = propKey;
							break;
						case "defaultChecked":
							defaultChecked = propKey;
							break;
						case "value":
							value = propKey;
							break;
						case "defaultValue":
							defaultValue = propKey;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (null != propKey) throw Error(formatProdErrorMessage(137, tag));
							break;
						default: propKey !== lastProp && setProp(domElement, tag, propKey$201, propKey, nextProps, lastProp);
					}
				}
				updateInput(domElement, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name);
				return;
			case "select":
				propKey = value = defaultValue = propKey$201 = null;
				for (type in lastProps) if (lastDefaultValue = lastProps[type], lastProps.hasOwnProperty(type) && null != lastDefaultValue) switch (type) {
					case "value": break;
					case "multiple": propKey = lastDefaultValue;
					default: nextProps.hasOwnProperty(type) || setProp(domElement, tag, type, null, nextProps, lastDefaultValue);
				}
				for (name in nextProps) if (type = nextProps[name], lastDefaultValue = lastProps[name], nextProps.hasOwnProperty(name) && (null != type || null != lastDefaultValue)) switch (name) {
					case "value":
						propKey$201 = type;
						break;
					case "defaultValue":
						defaultValue = type;
						break;
					case "multiple": value = type;
					default: type !== lastDefaultValue && setProp(domElement, tag, name, type, nextProps, lastDefaultValue);
				}
				tag = defaultValue;
				lastProps = value;
				nextProps = propKey;
				null != propKey$201 ? updateOptions(domElement, !!lastProps, propKey$201, !1) : !!nextProps !== !!lastProps && (null != tag ? updateOptions(domElement, !!lastProps, tag, !0) : updateOptions(domElement, !!lastProps, lastProps ? [] : "", !1));
				return;
			case "textarea":
				propKey = propKey$201 = null;
				for (defaultValue in lastProps) if (name = lastProps[defaultValue], lastProps.hasOwnProperty(defaultValue) && null != name && !nextProps.hasOwnProperty(defaultValue)) switch (defaultValue) {
					case "value": break;
					case "children": break;
					default: setProp(domElement, tag, defaultValue, null, nextProps, name);
				}
				for (value in nextProps) if (name = nextProps[value], type = lastProps[value], nextProps.hasOwnProperty(value) && (null != name || null != type)) switch (value) {
					case "value":
						propKey$201 = name;
						break;
					case "defaultValue":
						propKey = name;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (null != name) throw Error(formatProdErrorMessage(91));
						break;
					default: name !== type && setProp(domElement, tag, value, name, nextProps, type);
				}
				updateTextarea(domElement, propKey$201, propKey);
				return;
			case "option":
				for (var propKey$217 in lastProps) if (propKey$201 = lastProps[propKey$217], lastProps.hasOwnProperty(propKey$217) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$217)) switch (propKey$217) {
					case "selected":
						domElement.selected = !1;
						break;
					default: setProp(domElement, tag, propKey$217, null, nextProps, propKey$201);
				}
				for (lastDefaultValue in nextProps) if (propKey$201 = nextProps[lastDefaultValue], propKey = lastProps[lastDefaultValue], nextProps.hasOwnProperty(lastDefaultValue) && propKey$201 !== propKey && (null != propKey$201 || null != propKey)) switch (lastDefaultValue) {
					case "selected":
						domElement.selected = propKey$201 && "function" !== typeof propKey$201 && "symbol" !== typeof propKey$201;
						break;
					default: setProp(domElement, tag, lastDefaultValue, propKey$201, nextProps, propKey);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var propKey$222 in lastProps) propKey$201 = lastProps[propKey$222], lastProps.hasOwnProperty(propKey$222) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$222) && setProp(domElement, tag, propKey$222, null, nextProps, propKey$201);
				for (checked in nextProps) if (propKey$201 = nextProps[checked], propKey = lastProps[checked], nextProps.hasOwnProperty(checked) && propKey$201 !== propKey && (null != propKey$201 || null != propKey)) switch (checked) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (null != propKey$201) throw Error(formatProdErrorMessage(137, tag));
						break;
					default: setProp(domElement, tag, checked, propKey$201, nextProps, propKey);
				}
				return;
			default: if (isCustomElement(tag)) {
				for (var propKey$227 in lastProps) propKey$201 = lastProps[propKey$227], lastProps.hasOwnProperty(propKey$227) && void 0 !== propKey$201 && !nextProps.hasOwnProperty(propKey$227) && setPropOnCustomElement(domElement, tag, propKey$227, void 0, nextProps, propKey$201);
				for (defaultChecked in nextProps) propKey$201 = nextProps[defaultChecked], propKey = lastProps[defaultChecked], !nextProps.hasOwnProperty(defaultChecked) || propKey$201 === propKey || void 0 === propKey$201 && void 0 === propKey || setPropOnCustomElement(domElement, tag, defaultChecked, propKey$201, nextProps, propKey);
				return;
			}
		}
		for (var propKey$232 in lastProps) propKey$201 = lastProps[propKey$232], lastProps.hasOwnProperty(propKey$232) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$232) && setProp(domElement, tag, propKey$232, null, nextProps, propKey$201);
		for (lastProp in nextProps) propKey$201 = nextProps[lastProp], propKey = lastProps[lastProp], !nextProps.hasOwnProperty(lastProp) || propKey$201 === propKey || null == propKey$201 && null == propKey || setProp(domElement, tag, lastProp, propKey$201, nextProps, propKey);
	}
	function isLikelyStaticResource(initiatorType) {
		switch (initiatorType) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function estimateBandwidth() {
		if ("function" === typeof performance.getEntriesByType) {
			for (var count = 0, bits = 0, resourceEntries = performance.getEntriesByType("resource"), i = 0; i < resourceEntries.length; i++) {
				var entry = resourceEntries[i], transferSize = entry.transferSize, initiatorType = entry.initiatorType, duration = entry.duration;
				if (transferSize && duration && isLikelyStaticResource(initiatorType)) {
					initiatorType = 0;
					duration = entry.responseEnd;
					for (i += 1; i < resourceEntries.length; i++) {
						var overlapEntry = resourceEntries[i], overlapStartTime = overlapEntry.startTime;
						if (overlapStartTime > duration) break;
						var overlapTransferSize = overlapEntry.transferSize, overlapInitiatorType = overlapEntry.initiatorType;
						overlapTransferSize && isLikelyStaticResource(overlapInitiatorType) && (overlapEntry = overlapEntry.responseEnd, initiatorType += overlapTransferSize * (overlapEntry < duration ? 1 : (duration - overlapStartTime) / (overlapEntry - overlapStartTime)));
					}
					--i;
					bits += 8 * (transferSize + initiatorType) / (entry.duration / 1e3);
					count++;
					if (10 < count) break;
				}
			}
			if (0 < count) return bits / count / 1e6;
		}
		return navigator.connection && (count = navigator.connection.downlink, "number" === typeof count) ? count : 5;
	}
	var eventsEnabled = null, selectionInformation = null;
	function getOwnerDocumentFromRootContainer(rootContainerElement) {
		return 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
	}
	function getOwnHostContext(namespaceURI) {
		switch (namespaceURI) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function getChildHostContextProd(parentNamespace, type) {
		if (0 === parentNamespace) switch (type) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return 1 === parentNamespace && "foreignObject" === type ? 0 : parentNamespace;
	}
	function shouldSetTextContent(type, props) {
		return "textarea" === type || "noscript" === type || "string" === typeof props.children || "number" === typeof props.children || "bigint" === typeof props.children || "object" === typeof props.dangerouslySetInnerHTML && null !== props.dangerouslySetInnerHTML && null != props.dangerouslySetInnerHTML.__html;
	}
	var currentPopstateTransitionEvent = null;
	function shouldAttemptEagerTransition() {
		var event = window.event;
		if (event && "popstate" === event.type) {
			if (event === currentPopstateTransitionEvent) return !1;
			currentPopstateTransitionEvent = event;
			return !0;
		}
		currentPopstateTransitionEvent = null;
		return !1;
	}
	var scheduleTimeout = "function" === typeof setTimeout ? setTimeout : void 0, cancelTimeout = "function" === typeof clearTimeout ? clearTimeout : void 0, localPromise = "function" === typeof Promise ? Promise : void 0, scheduleMicrotask = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof localPromise ? function(callback) {
		return localPromise.resolve(null).then(callback).catch(handleErrorInNextTick);
	} : scheduleTimeout;
	function handleErrorInNextTick(error) {
		setTimeout(function() {
			throw error;
		});
	}
	function isSingletonScope(type) {
		return "head" === type;
	}
	function clearHydrationBoundary(parentInstance, hydrationInstance) {
		var node = hydrationInstance, depth = 0;
		do {
			var nextNode = node.nextSibling;
			parentInstance.removeChild(node);
			if (nextNode && 8 === nextNode.nodeType) if (node = nextNode.data, "/$" === node || "/&" === node) {
				if (0 === depth) {
					parentInstance.removeChild(nextNode);
					retryIfBlockedOn(hydrationInstance);
					return;
				}
				depth--;
			} else if ("$" === node || "$?" === node || "$~" === node || "$!" === node || "&" === node) depth++;
			else if ("html" === node) releaseSingletonInstance(parentInstance.ownerDocument.documentElement);
			else if ("head" === node) {
				node = parentInstance.ownerDocument.head;
				releaseSingletonInstance(node);
				for (var node$jscomp$0 = node.firstChild; node$jscomp$0;) {
					var nextNode$jscomp$0 = node$jscomp$0.nextSibling, nodeName = node$jscomp$0.nodeName;
					node$jscomp$0[internalHoistableMarker] || "SCRIPT" === nodeName || "STYLE" === nodeName || "LINK" === nodeName && "stylesheet" === node$jscomp$0.rel.toLowerCase() || node.removeChild(node$jscomp$0);
					node$jscomp$0 = nextNode$jscomp$0;
				}
			} else "body" === node && releaseSingletonInstance(parentInstance.ownerDocument.body);
			node = nextNode;
		} while (node);
		retryIfBlockedOn(hydrationInstance);
	}
	function hideOrUnhideDehydratedBoundary(suspenseInstance, isHidden) {
		var node = suspenseInstance;
		suspenseInstance = 0;
		do {
			var nextNode = node.nextSibling;
			1 === node.nodeType ? isHidden ? (node._stashedDisplay = node.style.display, node.style.display = "none") : (node.style.display = node._stashedDisplay || "", "" === node.getAttribute("style") && node.removeAttribute("style")) : 3 === node.nodeType && (isHidden ? (node._stashedText = node.nodeValue, node.nodeValue = "") : node.nodeValue = node._stashedText || "");
			if (nextNode && 8 === nextNode.nodeType) if (node = nextNode.data, "/$" === node) if (0 === suspenseInstance) break;
			else suspenseInstance--;
			else "$" !== node && "$?" !== node && "$~" !== node && "$!" !== node || suspenseInstance++;
			node = nextNode;
		} while (node);
	}
	function clearContainerSparingly(container) {
		var nextNode = container.firstChild;
		nextNode && 10 === nextNode.nodeType && (nextNode = nextNode.nextSibling);
		for (; nextNode;) {
			var node = nextNode;
			nextNode = nextNode.nextSibling;
			switch (node.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					clearContainerSparingly(node);
					detachDeletedInstance(node);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if ("stylesheet" === node.rel.toLowerCase()) continue;
			}
			container.removeChild(node);
		}
	}
	function canHydrateInstance(instance, type, props, inRootOrSingleton) {
		for (; 1 === instance.nodeType;) {
			var anyProps = props;
			if (instance.nodeName.toLowerCase() !== type.toLowerCase()) {
				if (!inRootOrSingleton && ("INPUT" !== instance.nodeName || "hidden" !== instance.type)) break;
			} else if (!inRootOrSingleton) if ("input" === type && "hidden" === instance.type) {
				var name = null == anyProps.name ? null : "" + anyProps.name;
				if ("hidden" === anyProps.type && instance.getAttribute("name") === name) return instance;
			} else return instance;
			else if (!instance[internalHoistableMarker]) switch (type) {
				case "meta":
					if (!instance.hasAttribute("itemprop")) break;
					return instance;
				case "link":
					name = instance.getAttribute("rel");
					if ("stylesheet" === name && instance.hasAttribute("data-precedence")) break;
					else if (name !== anyProps.rel || instance.getAttribute("href") !== (null == anyProps.href || "" === anyProps.href ? null : anyProps.href) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin) || instance.getAttribute("title") !== (null == anyProps.title ? null : anyProps.title)) break;
					return instance;
				case "style":
					if (instance.hasAttribute("data-precedence")) break;
					return instance;
				case "script":
					name = instance.getAttribute("src");
					if ((name !== (null == anyProps.src ? null : anyProps.src) || instance.getAttribute("type") !== (null == anyProps.type ? null : anyProps.type) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin)) && name && instance.hasAttribute("async") && !instance.hasAttribute("itemprop")) break;
					return instance;
				default: return instance;
			}
			instance = getNextHydratable(instance.nextSibling);
			if (null === instance) break;
		}
		return null;
	}
	function canHydrateTextInstance(instance, text, inRootOrSingleton) {
		if ("" === text) return null;
		for (; 3 !== instance.nodeType;) {
			if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton) return null;
			instance = getNextHydratable(instance.nextSibling);
			if (null === instance) return null;
		}
		return instance;
	}
	function canHydrateHydrationBoundary(instance, inRootOrSingleton) {
		for (; 8 !== instance.nodeType;) {
			if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton) return null;
			instance = getNextHydratable(instance.nextSibling);
			if (null === instance) return null;
		}
		return instance;
	}
	function isSuspenseInstancePending(instance) {
		return "$?" === instance.data || "$~" === instance.data;
	}
	function isSuspenseInstanceFallback(instance) {
		return "$!" === instance.data || "$?" === instance.data && "loading" !== instance.ownerDocument.readyState;
	}
	function registerSuspenseInstanceRetry(instance, callback) {
		var ownerDocument = instance.ownerDocument;
		if ("$~" === instance.data) instance._reactRetry = callback;
		else if ("$?" !== instance.data || "loading" !== ownerDocument.readyState) callback();
		else {
			var listener = function() {
				callback();
				ownerDocument.removeEventListener("DOMContentLoaded", listener);
			};
			ownerDocument.addEventListener("DOMContentLoaded", listener);
			instance._reactRetry = listener;
		}
	}
	function getNextHydratable(node) {
		for (; null != node; node = node.nextSibling) {
			var nodeType = node.nodeType;
			if (1 === nodeType || 3 === nodeType) break;
			if (8 === nodeType) {
				nodeType = node.data;
				if ("$" === nodeType || "$!" === nodeType || "$?" === nodeType || "$~" === nodeType || "&" === nodeType || "F!" === nodeType || "F" === nodeType) break;
				if ("/$" === nodeType || "/&" === nodeType) return null;
			}
		}
		return node;
	}
	var previousHydratableOnEnteringScopedSingleton = null;
	function getNextHydratableInstanceAfterHydrationBoundary(hydrationInstance) {
		hydrationInstance = hydrationInstance.nextSibling;
		for (var depth = 0; hydrationInstance;) {
			if (8 === hydrationInstance.nodeType) {
				var data = hydrationInstance.data;
				if ("/$" === data || "/&" === data) {
					if (0 === depth) return getNextHydratable(hydrationInstance.nextSibling);
					depth--;
				} else "$" !== data && "$!" !== data && "$?" !== data && "$~" !== data && "&" !== data || depth++;
			}
			hydrationInstance = hydrationInstance.nextSibling;
		}
		return null;
	}
	function getParentHydrationBoundary(targetInstance) {
		targetInstance = targetInstance.previousSibling;
		for (var depth = 0; targetInstance;) {
			if (8 === targetInstance.nodeType) {
				var data = targetInstance.data;
				if ("$" === data || "$!" === data || "$?" === data || "$~" === data || "&" === data) {
					if (0 === depth) return targetInstance;
					depth--;
				} else "/$" !== data && "/&" !== data || depth++;
			}
			targetInstance = targetInstance.previousSibling;
		}
		return null;
	}
	function resolveSingletonInstance(type, props, rootContainerInstance) {
		props = getOwnerDocumentFromRootContainer(rootContainerInstance);
		switch (type) {
			case "html":
				type = props.documentElement;
				if (!type) throw Error(formatProdErrorMessage(452));
				return type;
			case "head":
				type = props.head;
				if (!type) throw Error(formatProdErrorMessage(453));
				return type;
			case "body":
				type = props.body;
				if (!type) throw Error(formatProdErrorMessage(454));
				return type;
			default: throw Error(formatProdErrorMessage(451));
		}
	}
	function releaseSingletonInstance(instance) {
		for (var attributes = instance.attributes; attributes.length;) instance.removeAttributeNode(attributes[0]);
		detachDeletedInstance(instance);
	}
	var preloadPropsMap = /* @__PURE__ */ new Map(), preconnectsSet = /* @__PURE__ */ new Set();
	function getHoistableRoot(container) {
		return "function" === typeof container.getRootNode ? container.getRootNode() : 9 === container.nodeType ? container : container.ownerDocument;
	}
	var previousDispatcher = ReactDOMSharedInternals.d;
	ReactDOMSharedInternals.d = {
		f: flushSyncWork,
		r: requestFormReset,
		D: prefetchDNS,
		C: preconnect,
		L: preload,
		m: preloadModule,
		X: preinitScript,
		S: preinitStyle,
		M: preinitModuleScript
	};
	function flushSyncWork() {
		var previousWasRendering = previousDispatcher.f(), wasRendering = flushSyncWork$1();
		return previousWasRendering || wasRendering;
	}
	function requestFormReset(form) {
		var formInst = getInstanceFromNode(form);
		null !== formInst && 5 === formInst.tag && "form" === formInst.type ? requestFormReset$1(formInst) : previousDispatcher.r(form);
	}
	var globalDocument = "undefined" === typeof document ? null : document;
	function preconnectAs(rel, href, crossOrigin) {
		var ownerDocument = globalDocument;
		if (ownerDocument && "string" === typeof href && href) {
			var limitedEscapedHref = escapeSelectorAttributeValueInsideDoubleQuotes(href);
			limitedEscapedHref = "link[rel=\"" + rel + "\"][href=\"" + limitedEscapedHref + "\"]";
			"string" === typeof crossOrigin && (limitedEscapedHref += "[crossorigin=\"" + crossOrigin + "\"]");
			preconnectsSet.has(limitedEscapedHref) || (preconnectsSet.add(limitedEscapedHref), rel = {
				rel,
				crossOrigin,
				href
			}, null === ownerDocument.querySelector(limitedEscapedHref) && (href = ownerDocument.createElement("link"), setInitialProperties(href, "link", rel), markNodeAsHoistable(href), ownerDocument.head.appendChild(href)));
		}
	}
	function prefetchDNS(href) {
		previousDispatcher.D(href);
		preconnectAs("dns-prefetch", href, null);
	}
	function preconnect(href, crossOrigin) {
		previousDispatcher.C(href, crossOrigin);
		preconnectAs("preconnect", href, crossOrigin);
	}
	function preload(href, as, options) {
		previousDispatcher.L(href, as, options);
		var ownerDocument = globalDocument;
		if (ownerDocument && href && as) {
			var preloadSelector = "link[rel=\"preload\"][as=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(as) + "\"]";
			"image" === as ? options && options.imageSrcSet ? (preloadSelector += "[imagesrcset=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(options.imageSrcSet) + "\"]", "string" === typeof options.imageSizes && (preloadSelector += "[imagesizes=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(options.imageSizes) + "\"]")) : preloadSelector += "[href=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(href) + "\"]" : preloadSelector += "[href=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(href) + "\"]";
			var key = preloadSelector;
			switch (as) {
				case "style":
					key = getStyleKey(href);
					break;
				case "script": key = getScriptKey(href);
			}
			preloadPropsMap.has(key) || (href = assign({
				rel: "preload",
				href: "image" === as && options && options.imageSrcSet ? void 0 : href,
				as
			}, options), preloadPropsMap.set(key, href), null !== ownerDocument.querySelector(preloadSelector) || "style" === as && ownerDocument.querySelector(getStylesheetSelectorFromKey(key)) || "script" === as && ownerDocument.querySelector(getScriptSelectorFromKey(key)) || (as = ownerDocument.createElement("link"), setInitialProperties(as, "link", href), markNodeAsHoistable(as), ownerDocument.head.appendChild(as)));
		}
	}
	function preloadModule(href, options) {
		previousDispatcher.m(href, options);
		var ownerDocument = globalDocument;
		if (ownerDocument && href) {
			var as = options && "string" === typeof options.as ? options.as : "script", preloadSelector = "link[rel=\"modulepreload\"][as=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(as) + "\"][href=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(href) + "\"]", key = preloadSelector;
			switch (as) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": key = getScriptKey(href);
			}
			if (!preloadPropsMap.has(key) && (href = assign({
				rel: "modulepreload",
				href
			}, options), preloadPropsMap.set(key, href), null === ownerDocument.querySelector(preloadSelector))) {
				switch (as) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (ownerDocument.querySelector(getScriptSelectorFromKey(key))) return;
				}
				as = ownerDocument.createElement("link");
				setInitialProperties(as, "link", href);
				markNodeAsHoistable(as);
				ownerDocument.head.appendChild(as);
			}
		}
	}
	function preinitStyle(href, precedence, options) {
		previousDispatcher.S(href, precedence, options);
		var ownerDocument = globalDocument;
		if (ownerDocument && href) {
			var styles = getResourcesFromRoot(ownerDocument).hoistableStyles, key = getStyleKey(href);
			precedence = precedence || "default";
			var resource = styles.get(key);
			if (!resource) {
				var state = {
					loading: 0,
					preload: null
				};
				if (resource = ownerDocument.querySelector(getStylesheetSelectorFromKey(key))) state.loading = 5;
				else {
					href = assign({
						rel: "stylesheet",
						href,
						"data-precedence": precedence
					}, options);
					(options = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(href, options);
					var link = resource = ownerDocument.createElement("link");
					markNodeAsHoistable(link);
					setInitialProperties(link, "link", href);
					link._p = new Promise(function(resolve, reject) {
						link.onload = resolve;
						link.onerror = reject;
					});
					link.addEventListener("load", function() {
						state.loading |= 1;
					});
					link.addEventListener("error", function() {
						state.loading |= 2;
					});
					state.loading |= 4;
					insertStylesheet(resource, precedence, ownerDocument);
				}
				resource = {
					type: "stylesheet",
					instance: resource,
					count: 1,
					state
				};
				styles.set(key, resource);
			}
		}
	}
	function preinitScript(src, options) {
		previousDispatcher.X(src, options);
		var ownerDocument = globalDocument;
		if (ownerDocument && src) {
			var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
			resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({
				src,
				async: !0
			}, options), (options = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
				type: "script",
				instance: resource,
				count: 1,
				state: null
			}, scripts.set(key, resource));
		}
	}
	function preinitModuleScript(src, options) {
		previousDispatcher.M(src, options);
		var ownerDocument = globalDocument;
		if (ownerDocument && src) {
			var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
			resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({
				src,
				async: !0,
				type: "module"
			}, options), (options = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
				type: "script",
				instance: resource,
				count: 1,
				state: null
			}, scripts.set(key, resource));
		}
	}
	function getResource(type, currentProps, pendingProps, currentResource) {
		var JSCompiler_inline_result = (JSCompiler_inline_result = rootInstanceStackCursor.current) ? getHoistableRoot(JSCompiler_inline_result) : null;
		if (!JSCompiler_inline_result) throw Error(formatProdErrorMessage(446));
		switch (type) {
			case "meta":
			case "title": return null;
			case "style": return "string" === typeof pendingProps.precedence && "string" === typeof pendingProps.href ? (currentProps = getStyleKey(pendingProps.href), pendingProps = getResourcesFromRoot(JSCompiler_inline_result).hoistableStyles, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, pendingProps.set(currentProps, currentResource)), currentResource) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if ("stylesheet" === pendingProps.rel && "string" === typeof pendingProps.href && "string" === typeof pendingProps.precedence) {
					type = getStyleKey(pendingProps.href);
					var styles$243 = getResourcesFromRoot(JSCompiler_inline_result).hoistableStyles, resource$244 = styles$243.get(type);
					resource$244 || (JSCompiler_inline_result = JSCompiler_inline_result.ownerDocument || JSCompiler_inline_result, resource$244 = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, styles$243.set(type, resource$244), (styles$243 = JSCompiler_inline_result.querySelector(getStylesheetSelectorFromKey(type))) && !styles$243._p && (resource$244.instance = styles$243, resource$244.state.loading = 5), preloadPropsMap.has(type) || (pendingProps = {
						rel: "preload",
						as: "style",
						href: pendingProps.href,
						crossOrigin: pendingProps.crossOrigin,
						integrity: pendingProps.integrity,
						media: pendingProps.media,
						hrefLang: pendingProps.hrefLang,
						referrerPolicy: pendingProps.referrerPolicy
					}, preloadPropsMap.set(type, pendingProps), styles$243 || preloadStylesheet(JSCompiler_inline_result, type, pendingProps, resource$244.state)));
					if (currentProps && null === currentResource) throw Error(formatProdErrorMessage(528, ""));
					return resource$244;
				}
				if (currentProps && null !== currentResource) throw Error(formatProdErrorMessage(529, ""));
				return null;
			case "script": return currentProps = pendingProps.async, pendingProps = pendingProps.src, "string" === typeof pendingProps && currentProps && "function" !== typeof currentProps && "symbol" !== typeof currentProps ? (currentProps = getScriptKey(pendingProps), pendingProps = getResourcesFromRoot(JSCompiler_inline_result).hoistableScripts, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, pendingProps.set(currentProps, currentResource)), currentResource) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(formatProdErrorMessage(444, type));
		}
	}
	function getStyleKey(href) {
		return "href=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(href) + "\"";
	}
	function getStylesheetSelectorFromKey(key) {
		return "link[rel=\"stylesheet\"][" + key + "]";
	}
	function stylesheetPropsFromRawProps(rawProps) {
		return assign({}, rawProps, {
			"data-precedence": rawProps.precedence,
			precedence: null
		});
	}
	function preloadStylesheet(ownerDocument, key, preloadProps, state) {
		ownerDocument.querySelector("link[rel=\"preload\"][as=\"style\"][" + key + "]") ? state.loading = 1 : (key = ownerDocument.createElement("link"), state.preload = key, key.addEventListener("load", function() {
			return state.loading |= 1;
		}), key.addEventListener("error", function() {
			return state.loading |= 2;
		}), setInitialProperties(key, "link", preloadProps), markNodeAsHoistable(key), ownerDocument.head.appendChild(key));
	}
	function getScriptKey(src) {
		return "[src=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(src) + "\"]";
	}
	function getScriptSelectorFromKey(key) {
		return "script[async]" + key;
	}
	function acquireResource(hoistableRoot, resource, props) {
		resource.count++;
		if (null === resource.instance) switch (resource.type) {
			case "style":
				var instance = hoistableRoot.querySelector("style[data-href~=\"" + escapeSelectorAttributeValueInsideDoubleQuotes(props.href) + "\"]");
				if (instance) return resource.instance = instance, markNodeAsHoistable(instance), instance;
				var styleProps = assign({}, props, {
					"data-href": props.href,
					"data-precedence": props.precedence,
					href: null,
					precedence: null
				});
				instance = (hoistableRoot.ownerDocument || hoistableRoot).createElement("style");
				markNodeAsHoistable(instance);
				setInitialProperties(instance, "style", styleProps);
				insertStylesheet(instance, props.precedence, hoistableRoot);
				return resource.instance = instance;
			case "stylesheet":
				styleProps = getStyleKey(props.href);
				var instance$249 = hoistableRoot.querySelector(getStylesheetSelectorFromKey(styleProps));
				if (instance$249) return resource.state.loading |= 4, resource.instance = instance$249, markNodeAsHoistable(instance$249), instance$249;
				instance = stylesheetPropsFromRawProps(props);
				(styleProps = preloadPropsMap.get(styleProps)) && adoptPreloadPropsForStylesheet(instance, styleProps);
				instance$249 = (hoistableRoot.ownerDocument || hoistableRoot).createElement("link");
				markNodeAsHoistable(instance$249);
				var linkInstance = instance$249;
				linkInstance._p = new Promise(function(resolve, reject) {
					linkInstance.onload = resolve;
					linkInstance.onerror = reject;
				});
				setInitialProperties(instance$249, "link", instance);
				resource.state.loading |= 4;
				insertStylesheet(instance$249, props.precedence, hoistableRoot);
				return resource.instance = instance$249;
			case "script":
				instance$249 = getScriptKey(props.src);
				if (styleProps = hoistableRoot.querySelector(getScriptSelectorFromKey(instance$249))) return resource.instance = styleProps, markNodeAsHoistable(styleProps), styleProps;
				instance = props;
				if (styleProps = preloadPropsMap.get(instance$249)) instance = assign({}, props), adoptPreloadPropsForScript(instance, styleProps);
				hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
				styleProps = hoistableRoot.createElement("script");
				markNodeAsHoistable(styleProps);
				setInitialProperties(styleProps, "link", instance);
				hoistableRoot.head.appendChild(styleProps);
				return resource.instance = styleProps;
			case "void": return null;
			default: throw Error(formatProdErrorMessage(443, resource.type));
		}
		else "stylesheet" === resource.type && 0 === (resource.state.loading & 4) && (instance = resource.instance, resource.state.loading |= 4, insertStylesheet(instance, props.precedence, hoistableRoot));
		return resource.instance;
	}
	function insertStylesheet(instance, precedence, root) {
		for (var nodes = root.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), last = nodes.length ? nodes[nodes.length - 1] : null, prior = last, i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (node.dataset.precedence === precedence) prior = node;
			else if (prior !== last) break;
		}
		prior ? prior.parentNode.insertBefore(instance, prior.nextSibling) : (precedence = 9 === root.nodeType ? root.head : root, precedence.insertBefore(instance, precedence.firstChild));
	}
	function adoptPreloadPropsForStylesheet(stylesheetProps, preloadProps) {
		stylesheetProps.crossOrigin ??= preloadProps.crossOrigin;
		stylesheetProps.referrerPolicy ??= preloadProps.referrerPolicy;
		stylesheetProps.title ??= preloadProps.title;
	}
	function adoptPreloadPropsForScript(scriptProps, preloadProps) {
		scriptProps.crossOrigin ??= preloadProps.crossOrigin;
		scriptProps.referrerPolicy ??= preloadProps.referrerPolicy;
		scriptProps.integrity ??= preloadProps.integrity;
	}
	var tagCaches = null;
	function getHydratableHoistableCache(type, keyAttribute, ownerDocument) {
		if (null === tagCaches) {
			var cache = /* @__PURE__ */ new Map();
			var caches = tagCaches = /* @__PURE__ */ new Map();
			caches.set(ownerDocument, cache);
		} else caches = tagCaches, cache = caches.get(ownerDocument), cache || (cache = /* @__PURE__ */ new Map(), caches.set(ownerDocument, cache));
		if (cache.has(type)) return cache;
		cache.set(type, null);
		ownerDocument = ownerDocument.getElementsByTagName(type);
		for (caches = 0; caches < ownerDocument.length; caches++) {
			var node = ownerDocument[caches];
			if (!(node[internalHoistableMarker] || node[internalInstanceKey] || "link" === type && "stylesheet" === node.getAttribute("rel")) && "http://www.w3.org/2000/svg" !== node.namespaceURI) {
				var nodeKey = node.getAttribute(keyAttribute) || "";
				nodeKey = type + nodeKey;
				var existing = cache.get(nodeKey);
				existing ? existing.push(node) : cache.set(nodeKey, [node]);
			}
		}
		return cache;
	}
	function mountHoistable(hoistableRoot, type, instance) {
		hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
		hoistableRoot.head.insertBefore(instance, "title" === type ? hoistableRoot.querySelector("head > title") : null);
	}
	function isHostHoistableType(type, props, hostContext) {
		if (1 === hostContext || null != props.itemProp) return !1;
		switch (type) {
			case "meta":
			case "title": return !0;
			case "style":
				if ("string" !== typeof props.precedence || "string" !== typeof props.href || "" === props.href) break;
				return !0;
			case "link":
				if ("string" !== typeof props.rel || "string" !== typeof props.href || "" === props.href || props.onLoad || props.onError) break;
				switch (props.rel) {
					case "stylesheet": return type = props.disabled, "string" === typeof props.precedence && null == type;
					default: return !0;
				}
			case "script": if (props.async && "function" !== typeof props.async && "symbol" !== typeof props.async && !props.onLoad && !props.onError && props.src && "string" === typeof props.src) return !0;
		}
		return !1;
	}
	function preloadResource(resource) {
		return "stylesheet" === resource.type && 0 === (resource.state.loading & 3) ? !1 : !0;
	}
	function suspendResource(state, hoistableRoot, resource, props) {
		if ("stylesheet" === resource.type && ("string" !== typeof props.media || !1 !== matchMedia(props.media).matches) && 0 === (resource.state.loading & 4)) {
			if (null === resource.instance) {
				var key = getStyleKey(props.href), instance = hoistableRoot.querySelector(getStylesheetSelectorFromKey(key));
				if (instance) {
					hoistableRoot = instance._p;
					null !== hoistableRoot && "object" === typeof hoistableRoot && "function" === typeof hoistableRoot.then && (state.count++, state = onUnsuspend.bind(state), hoistableRoot.then(state, state));
					resource.state.loading |= 4;
					resource.instance = instance;
					markNodeAsHoistable(instance);
					return;
				}
				instance = hoistableRoot.ownerDocument || hoistableRoot;
				props = stylesheetPropsFromRawProps(props);
				(key = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(props, key);
				instance = instance.createElement("link");
				markNodeAsHoistable(instance);
				var linkInstance = instance;
				linkInstance._p = new Promise(function(resolve, reject) {
					linkInstance.onload = resolve;
					linkInstance.onerror = reject;
				});
				setInitialProperties(instance, "link", props);
				resource.instance = instance;
			}
			null === state.stylesheets && (state.stylesheets = /* @__PURE__ */ new Map());
			state.stylesheets.set(resource, hoistableRoot);
			(hoistableRoot = resource.state.preload) && 0 === (resource.state.loading & 3) && (state.count++, resource = onUnsuspend.bind(state), hoistableRoot.addEventListener("load", resource), hoistableRoot.addEventListener("error", resource));
		}
	}
	var estimatedBytesWithinLimit = 0;
	function waitForCommitToBeReady(state, timeoutOffset) {
		state.stylesheets && 0 === state.count && insertSuspendedStylesheets(state, state.stylesheets);
		return 0 < state.count || 0 < state.imgCount ? function(commit) {
			var stylesheetTimer = setTimeout(function() {
				state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets);
				if (state.unsuspend) {
					var unsuspend = state.unsuspend;
					state.unsuspend = null;
					unsuspend();
				}
			}, 6e4 + timeoutOffset);
			0 < state.imgBytes && 0 === estimatedBytesWithinLimit && (estimatedBytesWithinLimit = 62500 * estimateBandwidth());
			var imgTimer = setTimeout(function() {
				state.waitingForImages = !1;
				if (0 === state.count && (state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets), state.unsuspend)) {
					var unsuspend = state.unsuspend;
					state.unsuspend = null;
					unsuspend();
				}
			}, (state.imgBytes > estimatedBytesWithinLimit ? 50 : 800) + timeoutOffset);
			state.unsuspend = commit;
			return function() {
				state.unsuspend = null;
				clearTimeout(stylesheetTimer);
				clearTimeout(imgTimer);
			};
		} : null;
	}
	function onUnsuspend() {
		this.count--;
		if (0 === this.count && (0 === this.imgCount || !this.waitingForImages)) {
			if (this.stylesheets) insertSuspendedStylesheets(this, this.stylesheets);
			else if (this.unsuspend) {
				var unsuspend = this.unsuspend;
				this.unsuspend = null;
				unsuspend();
			}
		}
	}
	var precedencesByRoot = null;
	function insertSuspendedStylesheets(state, resources) {
		state.stylesheets = null;
		null !== state.unsuspend && (state.count++, precedencesByRoot = /* @__PURE__ */ new Map(), resources.forEach(insertStylesheetIntoRoot, state), precedencesByRoot = null, onUnsuspend.call(state));
	}
	function insertStylesheetIntoRoot(root, resource) {
		if (!(resource.state.loading & 4)) {
			var precedences = precedencesByRoot.get(root);
			if (precedences) var last = precedences.get(null);
			else {
				precedences = /* @__PURE__ */ new Map();
				precedencesByRoot.set(root, precedences);
				for (var nodes = root.querySelectorAll("link[data-precedence],style[data-precedence]"), i = 0; i < nodes.length; i++) {
					var node = nodes[i];
					if ("LINK" === node.nodeName || "not all" !== node.getAttribute("media")) precedences.set(node.dataset.precedence, node), last = node;
				}
				last && precedences.set(null, last);
			}
			nodes = resource.instance;
			node = nodes.getAttribute("data-precedence");
			i = precedences.get(node) || last;
			i === last && precedences.set(null, nodes);
			precedences.set(node, nodes);
			this.count++;
			last = onUnsuspend.bind(this);
			nodes.addEventListener("load", last);
			nodes.addEventListener("error", last);
			i ? i.parentNode.insertBefore(nodes, i.nextSibling) : (root = 9 === root.nodeType ? root.head : root, root.insertBefore(nodes, root.firstChild));
			resource.state.loading |= 4;
		}
	}
	var HostTransitionContext = {
		$$typeof: REACT_CONTEXT_TYPE,
		Provider: null,
		Consumer: null,
		_currentValue: sharedNotPendingObject,
		_currentValue2: sharedNotPendingObject,
		_threadCount: 0
	};
	function FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator, formState) {
		this.tag = 1;
		this.containerInfo = containerInfo;
		this.pingCache = this.current = this.pendingChildren = null;
		this.timeoutHandle = -1;
		this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null;
		this.callbackPriority = 0;
		this.expirationTimes = createLaneMap(-1);
		this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
		this.entanglements = createLaneMap(0);
		this.hiddenUpdates = createLaneMap(null);
		this.identifierPrefix = identifierPrefix;
		this.onUncaughtError = onUncaughtError;
		this.onCaughtError = onCaughtError;
		this.onRecoverableError = onRecoverableError;
		this.pooledCache = null;
		this.pooledCacheLanes = 0;
		this.formState = formState;
		this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function createFiberRoot(containerInfo, tag, hydrate, initialChildren, hydrationCallbacks, isStrictMode, identifierPrefix, formState, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator) {
		containerInfo = new FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator, formState);
		tag = 1;
		!0 === isStrictMode && (tag |= 24);
		isStrictMode = createFiberImplClass(3, null, null, tag);
		containerInfo.current = isStrictMode;
		isStrictMode.stateNode = containerInfo;
		tag = createCache();
		tag.refCount++;
		containerInfo.pooledCache = tag;
		tag.refCount++;
		isStrictMode.memoizedState = {
			element: initialChildren,
			isDehydrated: hydrate,
			cache: tag
		};
		initializeUpdateQueue(isStrictMode);
		return containerInfo;
	}
	function getContextForSubtree(parentComponent) {
		if (!parentComponent) return emptyContextObject;
		parentComponent = emptyContextObject;
		return parentComponent;
	}
	function updateContainerImpl(rootFiber, lane, element, container, parentComponent, callback) {
		parentComponent = getContextForSubtree(parentComponent);
		null === container.context ? container.context = parentComponent : container.pendingContext = parentComponent;
		container = createUpdate(lane);
		container.payload = { element };
		callback = void 0 === callback ? null : callback;
		null !== callback && (container.callback = callback);
		element = enqueueUpdate(rootFiber, container, lane);
		null !== element && (scheduleUpdateOnFiber(element, rootFiber, lane), entangleTransitions(element, rootFiber, lane));
	}
	function markRetryLaneImpl(fiber, retryLane) {
		fiber = fiber.memoizedState;
		if (null !== fiber && null !== fiber.dehydrated) {
			var a = fiber.retryLane;
			fiber.retryLane = 0 !== a && a < retryLane ? a : retryLane;
		}
	}
	function markRetryLaneIfNotHydrated(fiber, retryLane) {
		markRetryLaneImpl(fiber, retryLane);
		(fiber = fiber.alternate) && markRetryLaneImpl(fiber, retryLane);
	}
	function attemptContinuousHydration(fiber) {
		if (13 === fiber.tag || 31 === fiber.tag) {
			var root = enqueueConcurrentRenderForLane(fiber, 67108864);
			null !== root && scheduleUpdateOnFiber(root, fiber, 67108864);
			markRetryLaneIfNotHydrated(fiber, 67108864);
		}
	}
	function attemptHydrationAtCurrentPriority(fiber) {
		if (13 === fiber.tag || 31 === fiber.tag) {
			var lane = requestUpdateLane();
			lane = getBumpedLaneForHydrationByLane(lane);
			var root = enqueueConcurrentRenderForLane(fiber, lane);
			null !== root && scheduleUpdateOnFiber(root, fiber, lane);
			markRetryLaneIfNotHydrated(fiber, lane);
		}
	}
	var _enabled = !0;
	function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
		var prevTransition = ReactSharedInternals.T;
		ReactSharedInternals.T = null;
		var previousPriority = ReactDOMSharedInternals.p;
		try {
			ReactDOMSharedInternals.p = 2, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
		} finally {
			ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
		}
	}
	function dispatchContinuousEvent(domEventName, eventSystemFlags, container, nativeEvent) {
		var prevTransition = ReactSharedInternals.T;
		ReactSharedInternals.T = null;
		var previousPriority = ReactDOMSharedInternals.p;
		try {
			ReactDOMSharedInternals.p = 8, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
		} finally {
			ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
		}
	}
	function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
		if (_enabled) {
			var blockedOn = findInstanceBlockingEvent(nativeEvent);
			if (null === blockedOn) dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, return_targetInst, targetContainer), clearIfContinuousEvent(domEventName, nativeEvent);
			else if (queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent)) nativeEvent.stopPropagation();
			else if (clearIfContinuousEvent(domEventName, nativeEvent), eventSystemFlags & 4 && -1 < discreteReplayableEvents.indexOf(domEventName)) {
				for (; null !== blockedOn;) {
					var fiber = getInstanceFromNode(blockedOn);
					if (null !== fiber) switch (fiber.tag) {
						case 3:
							fiber = fiber.stateNode;
							if (fiber.current.memoizedState.isDehydrated) {
								var lanes = getHighestPriorityLanes(fiber.pendingLanes);
								if (0 !== lanes) {
									var root = fiber;
									root.pendingLanes |= 2;
									for (root.entangledLanes |= 2; lanes;) {
										var lane = 1 << 31 - clz32(lanes);
										root.entanglements[1] |= lane;
										lanes &= ~lane;
									}
									ensureRootIsScheduled(fiber);
									0 === (executionContext & 6) && (workInProgressRootRenderTargetTime = now() + 500, flushSyncWorkAcrossRoots_impl(0, !1));
								}
							}
							break;
						case 31:
						case 13: root = enqueueConcurrentRenderForLane(fiber, 2), null !== root && scheduleUpdateOnFiber(root, fiber, 2), flushSyncWork$1(), markRetryLaneIfNotHydrated(fiber, 2);
					}
					fiber = findInstanceBlockingEvent(nativeEvent);
					null === fiber && dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, return_targetInst, targetContainer);
					if (fiber === blockedOn) break;
					blockedOn = fiber;
				}
				null !== blockedOn && nativeEvent.stopPropagation();
			} else dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, null, targetContainer);
		}
	}
	function findInstanceBlockingEvent(nativeEvent) {
		nativeEvent = getEventTarget(nativeEvent);
		return findInstanceBlockingTarget(nativeEvent);
	}
	var return_targetInst = null;
	function findInstanceBlockingTarget(targetNode) {
		return_targetInst = null;
		targetNode = getClosestInstanceFromNode(targetNode);
		if (null !== targetNode) {
			var nearestMounted = getNearestMountedFiber(targetNode);
			if (null === nearestMounted) targetNode = null;
			else {
				var tag = nearestMounted.tag;
				if (13 === tag) {
					targetNode = getSuspenseInstanceFromFiber(nearestMounted);
					if (null !== targetNode) return targetNode;
					targetNode = null;
				} else if (31 === tag) {
					targetNode = getActivityInstanceFromFiber(nearestMounted);
					if (null !== targetNode) return targetNode;
					targetNode = null;
				} else if (3 === tag) {
					if (nearestMounted.stateNode.current.memoizedState.isDehydrated) return 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
					targetNode = null;
				} else nearestMounted !== targetNode && (targetNode = null);
			}
		}
		return_targetInst = targetNode;
		return null;
	}
	function getEventPriority(domEventName) {
		switch (domEventName) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "resize":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (getCurrentPriorityLevel()) {
				case ImmediatePriority: return 2;
				case UserBlockingPriority: return 8;
				case NormalPriority$1:
				case LowPriority: return 32;
				case IdlePriority: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var hasScheduledReplayAttempt = !1, queuedFocus = null, queuedDrag = null, queuedMouse = null, queuedPointers = /* @__PURE__ */ new Map(), queuedPointerCaptures = /* @__PURE__ */ new Map(), queuedExplicitHydrationTargets = [], discreteReplayableEvents = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function clearIfContinuousEvent(domEventName, nativeEvent) {
		switch (domEventName) {
			case "focusin":
			case "focusout":
				queuedFocus = null;
				break;
			case "dragenter":
			case "dragleave":
				queuedDrag = null;
				break;
			case "mouseover":
			case "mouseout":
				queuedMouse = null;
				break;
			case "pointerover":
			case "pointerout":
				queuedPointers.delete(nativeEvent.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": queuedPointerCaptures.delete(nativeEvent.pointerId);
		}
	}
	function accumulateOrCreateContinuousQueuedReplayableEvent(existingQueuedEvent, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
		if (null === existingQueuedEvent || existingQueuedEvent.nativeEvent !== nativeEvent) return existingQueuedEvent = {
			blockedOn,
			domEventName,
			eventSystemFlags,
			nativeEvent,
			targetContainers: [targetContainer]
		}, null !== blockedOn && (blockedOn = getInstanceFromNode(blockedOn), null !== blockedOn && attemptContinuousHydration(blockedOn)), existingQueuedEvent;
		existingQueuedEvent.eventSystemFlags |= eventSystemFlags;
		blockedOn = existingQueuedEvent.targetContainers;
		null !== targetContainer && -1 === blockedOn.indexOf(targetContainer) && blockedOn.push(targetContainer);
		return existingQueuedEvent;
	}
	function queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
		switch (domEventName) {
			case "focusin": return queuedFocus = accumulateOrCreateContinuousQueuedReplayableEvent(queuedFocus, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), !0;
			case "dragenter": return queuedDrag = accumulateOrCreateContinuousQueuedReplayableEvent(queuedDrag, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), !0;
			case "mouseover": return queuedMouse = accumulateOrCreateContinuousQueuedReplayableEvent(queuedMouse, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent), !0;
			case "pointerover":
				var pointerId = nativeEvent.pointerId;
				queuedPointers.set(pointerId, accumulateOrCreateContinuousQueuedReplayableEvent(queuedPointers.get(pointerId) || null, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent));
				return !0;
			case "gotpointercapture": return pointerId = nativeEvent.pointerId, queuedPointerCaptures.set(pointerId, accumulateOrCreateContinuousQueuedReplayableEvent(queuedPointerCaptures.get(pointerId) || null, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent)), !0;
		}
		return !1;
	}
	function attemptExplicitHydrationTarget(queuedTarget) {
		var targetInst = getClosestInstanceFromNode(queuedTarget.target);
		if (null !== targetInst) {
			var nearestMounted = getNearestMountedFiber(targetInst);
			if (null !== nearestMounted) {
				if (targetInst = nearestMounted.tag, 13 === targetInst) {
					if (targetInst = getSuspenseInstanceFromFiber(nearestMounted), null !== targetInst) {
						queuedTarget.blockedOn = targetInst;
						runWithPriority(queuedTarget.priority, function() {
							attemptHydrationAtCurrentPriority(nearestMounted);
						});
						return;
					}
				} else if (31 === targetInst) {
					if (targetInst = getActivityInstanceFromFiber(nearestMounted), null !== targetInst) {
						queuedTarget.blockedOn = targetInst;
						runWithPriority(queuedTarget.priority, function() {
							attemptHydrationAtCurrentPriority(nearestMounted);
						});
						return;
					}
				} else if (3 === targetInst && nearestMounted.stateNode.current.memoizedState.isDehydrated) {
					queuedTarget.blockedOn = 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
					return;
				}
			}
		}
		queuedTarget.blockedOn = null;
	}
	function attemptReplayContinuousQueuedEvent(queuedEvent) {
		if (null !== queuedEvent.blockedOn) return !1;
		for (var targetContainers = queuedEvent.targetContainers; 0 < targetContainers.length;) {
			var nextBlockedOn = findInstanceBlockingEvent(queuedEvent.nativeEvent);
			if (null === nextBlockedOn) {
				nextBlockedOn = queuedEvent.nativeEvent;
				var nativeEventClone = new nextBlockedOn.constructor(nextBlockedOn.type, nextBlockedOn);
				currentReplayingEvent = nativeEventClone;
				nextBlockedOn.target.dispatchEvent(nativeEventClone);
				currentReplayingEvent = null;
			} else return targetContainers = getInstanceFromNode(nextBlockedOn), null !== targetContainers && attemptContinuousHydration(targetContainers), queuedEvent.blockedOn = nextBlockedOn, !1;
			targetContainers.shift();
		}
		return !0;
	}
	function attemptReplayContinuousQueuedEventInMap(queuedEvent, key, map) {
		attemptReplayContinuousQueuedEvent(queuedEvent) && map.delete(key);
	}
	function replayUnblockedEvents() {
		hasScheduledReplayAttempt = !1;
		null !== queuedFocus && attemptReplayContinuousQueuedEvent(queuedFocus) && (queuedFocus = null);
		null !== queuedDrag && attemptReplayContinuousQueuedEvent(queuedDrag) && (queuedDrag = null);
		null !== queuedMouse && attemptReplayContinuousQueuedEvent(queuedMouse) && (queuedMouse = null);
		queuedPointers.forEach(attemptReplayContinuousQueuedEventInMap);
		queuedPointerCaptures.forEach(attemptReplayContinuousQueuedEventInMap);
	}
	function scheduleCallbackIfUnblocked(queuedEvent, unblocked) {
		queuedEvent.blockedOn === unblocked && (queuedEvent.blockedOn = null, hasScheduledReplayAttempt || (hasScheduledReplayAttempt = !0, Scheduler.unstable_scheduleCallback(Scheduler.unstable_NormalPriority, replayUnblockedEvents)));
	}
	var lastScheduledReplayQueue = null;
	function scheduleReplayQueueIfNeeded(formReplayingQueue) {
		lastScheduledReplayQueue !== formReplayingQueue && (lastScheduledReplayQueue = formReplayingQueue, Scheduler.unstable_scheduleCallback(Scheduler.unstable_NormalPriority, function() {
			lastScheduledReplayQueue === formReplayingQueue && (lastScheduledReplayQueue = null);
			for (var i = 0; i < formReplayingQueue.length; i += 3) {
				var form = formReplayingQueue[i], submitterOrAction = formReplayingQueue[i + 1], formData = formReplayingQueue[i + 2];
				if ("function" !== typeof submitterOrAction) if (null === findInstanceBlockingTarget(submitterOrAction || form)) continue;
				else break;
				var formInst = getInstanceFromNode(form);
				null !== formInst && (formReplayingQueue.splice(i, 3), i -= 3, startHostTransition(formInst, {
					pending: !0,
					data: formData,
					method: form.method,
					action: submitterOrAction
				}, submitterOrAction, formData));
			}
		}));
	}
	function retryIfBlockedOn(unblocked) {
		function unblock(queuedEvent) {
			return scheduleCallbackIfUnblocked(queuedEvent, unblocked);
		}
		null !== queuedFocus && scheduleCallbackIfUnblocked(queuedFocus, unblocked);
		null !== queuedDrag && scheduleCallbackIfUnblocked(queuedDrag, unblocked);
		null !== queuedMouse && scheduleCallbackIfUnblocked(queuedMouse, unblocked);
		queuedPointers.forEach(unblock);
		queuedPointerCaptures.forEach(unblock);
		for (var i = 0; i < queuedExplicitHydrationTargets.length; i++) {
			var queuedTarget = queuedExplicitHydrationTargets[i];
			queuedTarget.blockedOn === unblocked && (queuedTarget.blockedOn = null);
		}
		for (; 0 < queuedExplicitHydrationTargets.length && (i = queuedExplicitHydrationTargets[0], null === i.blockedOn);) attemptExplicitHydrationTarget(i), null === i.blockedOn && queuedExplicitHydrationTargets.shift();
		i = (unblocked.ownerDocument || unblocked).$$reactFormReplay;
		if (null != i) for (queuedTarget = 0; queuedTarget < i.length; queuedTarget += 3) {
			var form = i[queuedTarget], submitterOrAction = i[queuedTarget + 1], formProps = form[internalPropsKey] || null;
			if ("function" === typeof submitterOrAction) formProps || scheduleReplayQueueIfNeeded(i);
			else if (formProps) {
				var action = null;
				if (submitterOrAction && submitterOrAction.hasAttribute("formAction")) {
					if (form = submitterOrAction, formProps = submitterOrAction[internalPropsKey] || null) action = formProps.formAction;
					else if (null !== findInstanceBlockingTarget(form)) continue;
				} else action = formProps.action;
				"function" === typeof action ? i[queuedTarget + 1] = action : (i.splice(queuedTarget, 3), queuedTarget -= 3);
				scheduleReplayQueueIfNeeded(i);
			}
		}
	}
	function defaultOnDefaultTransitionIndicator() {
		function handleNavigate(event) {
			event.canIntercept && "react-transition" === event.info && event.intercept({
				handler: function() {
					return new Promise(function(resolve) {
						return pendingResolve = resolve;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function handleNavigateComplete() {
			null !== pendingResolve && (pendingResolve(), pendingResolve = null);
			isCancelled || setTimeout(startFakeNavigation, 20);
		}
		function startFakeNavigation() {
			if (!isCancelled && !navigation.transition) {
				var currentEntry = navigation.currentEntry;
				currentEntry && null != currentEntry.url && navigation.navigate(currentEntry.url, {
					state: currentEntry.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if ("object" === typeof navigation) {
			var isCancelled = !1, pendingResolve = null;
			navigation.addEventListener("navigate", handleNavigate);
			navigation.addEventListener("navigatesuccess", handleNavigateComplete);
			navigation.addEventListener("navigateerror", handleNavigateComplete);
			setTimeout(startFakeNavigation, 100);
			return function() {
				isCancelled = !0;
				navigation.removeEventListener("navigate", handleNavigate);
				navigation.removeEventListener("navigatesuccess", handleNavigateComplete);
				navigation.removeEventListener("navigateerror", handleNavigateComplete);
				null !== pendingResolve && (pendingResolve(), pendingResolve = null);
			};
		}
	}
	function ReactDOMRoot(internalRoot) {
		this._internalRoot = internalRoot;
	}
	ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = function(children) {
		var root = this._internalRoot;
		if (null === root) throw Error(formatProdErrorMessage(409));
		var current = root.current;
		updateContainerImpl(current, requestUpdateLane(), children, root, null, null);
	};
	ReactDOMHydrationRoot.prototype.unmount = ReactDOMRoot.prototype.unmount = function() {
		var root = this._internalRoot;
		if (null !== root) {
			this._internalRoot = null;
			var container = root.containerInfo;
			updateContainerImpl(root.current, 2, null, root, null, null);
			flushSyncWork$1();
			container[internalContainerInstanceKey] = null;
		}
	};
	function ReactDOMHydrationRoot(internalRoot) {
		this._internalRoot = internalRoot;
	}
	ReactDOMHydrationRoot.prototype.unstable_scheduleHydration = function(target) {
		if (target) {
			var updatePriority = resolveUpdatePriority();
			target = {
				blockedOn: null,
				target,
				priority: updatePriority
			};
			for (var i = 0; i < queuedExplicitHydrationTargets.length && 0 !== updatePriority && updatePriority < queuedExplicitHydrationTargets[i].priority; i++);
			queuedExplicitHydrationTargets.splice(i, 0, target);
			0 === i && attemptExplicitHydrationTarget(target);
		}
	};
	var isomorphicReactPackageVersion$jscomp$inline_1840 = React.version;
	if ("19.2.5" !== isomorphicReactPackageVersion$jscomp$inline_1840) throw Error(formatProdErrorMessage(527, isomorphicReactPackageVersion$jscomp$inline_1840, "19.2.5"));
	ReactDOMSharedInternals.findDOMNode = function(componentOrElement) {
		var fiber = componentOrElement._reactInternals;
		if (void 0 === fiber) {
			if ("function" === typeof componentOrElement.render) throw Error(formatProdErrorMessage(188));
			componentOrElement = Object.keys(componentOrElement).join(",");
			throw Error(formatProdErrorMessage(268, componentOrElement));
		}
		componentOrElement = findCurrentFiberUsingSlowPath(fiber);
		componentOrElement = null !== componentOrElement ? findCurrentHostFiberImpl(componentOrElement) : null;
		componentOrElement = null === componentOrElement ? null : componentOrElement.stateNode;
		return componentOrElement;
	};
	var internals$jscomp$inline_2347 = {
		bundleType: 0,
		version: "19.2.5",
		rendererPackageName: "react-dom",
		currentDispatcherRef: ReactSharedInternals,
		reconcilerVersion: "19.2.5"
	};
	if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
		var hook$jscomp$inline_2348 = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!hook$jscomp$inline_2348.isDisabled && hook$jscomp$inline_2348.supportsFiber) try {
			rendererID = hook$jscomp$inline_2348.inject(internals$jscomp$inline_2347), injectedHook = hook$jscomp$inline_2348;
		} catch (err) {}
	}
	exports.createRoot = function(container, options) {
		if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
		var isStrictMode = !1, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError;
		null !== options && void 0 !== options && (!0 === options.unstable_strictMode && (isStrictMode = !0), void 0 !== options.identifierPrefix && (identifierPrefix = options.identifierPrefix), void 0 !== options.onUncaughtError && (onUncaughtError = options.onUncaughtError), void 0 !== options.onCaughtError && (onCaughtError = options.onCaughtError), void 0 !== options.onRecoverableError && (onRecoverableError = options.onRecoverableError));
		options = createFiberRoot(container, 1, !1, null, null, isStrictMode, identifierPrefix, null, onUncaughtError, onCaughtError, onRecoverableError, defaultOnDefaultTransitionIndicator);
		container[internalContainerInstanceKey] = options.current;
		listenToAllSupportedEvents(container);
		return new ReactDOMRoot(options);
	};
}));
//#endregion
//#region node_modules/react-dom/client.js
var require_client = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function checkDCE() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") return;
		try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
		} catch (err) {
			console.error(err);
		}
	}
	checkDCE();
	module.exports = require_react_dom_client_production();
}));
//#endregion
//#region src/index.css
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_client = require_client();
//#endregion
//#region node_modules/zustand/esm/vanilla.mjs
var createStoreImpl = (createState) => {
	let state;
	const listeners = /* @__PURE__ */ new Set();
	const setState = (partial, replace) => {
		const nextState = typeof partial === "function" ? partial(state) : partial;
		if (!Object.is(nextState, state)) {
			const previousState = state;
			state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
			listeners.forEach((listener) => listener(state, previousState));
		}
	};
	const getState = () => state;
	const getInitialState = () => initialState;
	const subscribe = (listener) => {
		listeners.add(listener);
		return () => listeners.delete(listener);
	};
	const api = {
		setState,
		getState,
		getInitialState,
		subscribe
	};
	const initialState = state = createState(setState, getState, api);
	return api;
};
var createStore = ((createState) => createState ? createStoreImpl(createState) : createStoreImpl);
//#endregion
//#region node_modules/zustand/esm/react.mjs
var identity = (arg) => arg;
function useStore(api, selector = identity) {
	const slice = import_react.useSyncExternalStore(api.subscribe, import_react.useCallback(() => selector(api.getState()), [api, selector]), import_react.useCallback(() => selector(api.getInitialState()), [api, selector]));
	import_react.useDebugValue(slice);
	return slice;
}
var createImpl = (createState) => {
	const api = createStore(createState);
	const useBoundStore = (selector) => useStore(api, selector);
	Object.assign(useBoundStore, api);
	return useBoundStore;
};
var create = ((createState) => createState ? createImpl(createState) : createImpl);
//#endregion
//#region src/engine/cards.ts
var SUITS = [
	"hearts",
	"diamonds",
	"clubs",
	"spades"
];
var RANKS = [
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14
];
var SUIT_SYMBOLS = {
	hearts: "♥",
	diamonds: "♦",
	clubs: "♣",
	spades: "♠"
};
var SUIT_NAMES = {
	hearts: "Черви",
	diamonds: "Бубны",
	clubs: "Трефы",
	spades: "Пики"
};
var RANK_NAMES = {
	6: "6",
	7: "7",
	8: "8",
	9: "9",
	10: "10",
	11: "В",
	12: "Д",
	13: "К",
	14: "Т"
};
var SUIT_COLORS = {
	hearts: "red",
	diamonds: "red",
	clubs: "black",
	spades: "black"
};
/** Создать полную колоду из 36 карт */
function createDeck() {
	const deck = [];
	for (const suit of SUITS) for (const rank of RANKS) deck.push({
		suit,
		rank,
		id: `${suit}-${rank}`
	});
	return deck;
}
/** Перемешать колоду (Fisher-Yates) */
function shuffle(array) {
	const arr = [...array];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}
/** Может ли карта побить другую */
function canBeat(attackCard, defendCard, trumpSuit) {
	if (defendCard.suit === attackCard.suit) return defendCard.rank > attackCard.rank;
	if (defendCard.suit === trumpSuit) return true;
	return false;
}
/** Отсортировать руку: по масти, потом по рангу. Козыри в конце */
function sortHand(hand, trumpSuit) {
	const suitOrder = {
		hearts: 0,
		diamonds: 1,
		clubs: 2,
		spades: 3
	};
	return [...hand].sort((a, b) => {
		const aTrump = a.suit === trumpSuit ? 1 : 0;
		const bTrump = b.suit === trumpSuit ? 1 : 0;
		if (aTrump !== bTrump) return aTrump - bTrump;
		if (a.suit !== b.suit) return suitOrder[a.suit] - suitOrder[b.suit];
		return a.rank - b.rank;
	});
}
/** Сколько карт нужно раздать (до 6 в руке) */
function cardsNeeded(hand) {
	return Math.max(0, 6 - hand.length);
}
/** Получить индекс следующего игрока по кругу.
*  Если skipDefender = true, пропускается игрок с индексом defenderIndex
*/
function getNextPlayerIndex(current, count, skipIndex) {
	let next = (current + 1) % count;
	if (skipIndex !== void 0 && next === skipIndex) next = (next + 1) % count;
	return next;
}
//#endregion
//#region src/engine/ai.ts
/** Количество козырей в руке */
function trumpCount(hand, trumpSuit) {
	return hand.filter((c) => c.suit === trumpSuit).length;
}
/** Самый младший козырь в руке */
/** Карты, которыми можно отбить атакующую карту */
function beatableCards(attackCard, hand, trumpSuit) {
	return hand.filter((c) => canBeat(attackCard, c, trumpSuit));
}
/** Ранги на столе (для подкидывания) */
function ranksOnTable(table) {
	const ranks = /* @__PURE__ */ new Set();
	for (const ac of table) {
		ranks.add(ac.attackCard.rank);
		if (ac.defendCard) ranks.add(ac.defendCard.rank);
	}
	return ranks;
}
/** «Сила» карты: ниже = лучше для сброса */
function cardPower(card, trumpSuit) {
	return card.rank + (card.suit === trumpSuit ? 100 : 0);
}
/** Выбрать карту для атаки (первый ход) */
function aiFirstAttack(hand, trumpSuit) {
	if (hand.length === 0) return null;
	const nonTrump = hand.filter((c) => c.suit !== trumpSuit);
	if (nonTrump.length > 0) {
		const byRank = /* @__PURE__ */ new Map();
		for (const c of nonTrump) {
			const arr = byRank.get(c.rank) || [];
			arr.push(c);
			byRank.set(c.rank, arr);
		}
		const pairs = [...byRank.entries()].filter(([_, cards]) => cards.length >= 2).sort(([a], [b]) => a - b);
		if (pairs.length > 0) return pairs[0][1][0];
		return nonTrump.reduce((min, c) => c.rank < min.rank ? c : min, nonTrump[0]);
	}
	return hand.reduce((min, c) => c.rank < min.rank ? c : min, hand[0]);
}
/** Выбрать карту для подкидывания */
function aiThrowIn(hand, table, trumpSuit) {
	const ranks = ranksOnTable(table);
	const undefended = table.filter((ac) => !ac.defendCard).length;
	const myTrumps = trumpCount(hand, trumpSuit);
	return hand.filter((c) => ranks.has(c.rank)).filter((c) => {
		if (c.suit === trumpSuit && c.rank >= 11 && myTrumps <= 2) return false;
		if (undefended >= 2) return false;
		return true;
	}).sort((a, b) => cardPower(a, trumpSuit) - cardPower(b, trumpSuit))[0] || null;
}
/** Общая функция атаки */
function aiChooseAttack(hand, table, trumpSuit) {
	if (hand.length === 0) return null;
	if (table.length === 0) return aiFirstAttack(hand, trumpSuit);
	return aiThrowIn(hand, table, trumpSuit);
}
/** Выбрать карту для защиты */
function aiChooseDefend(attackCard, hand, trumpSuit) {
	const options = beatableCards(attackCard, hand, trumpSuit);
	if (options.length === 0) return null;
	options.sort((a, b) => cardPower(a, trumpSuit) - cardPower(b, trumpSuit));
	const myTrumps = trumpCount(hand, trumpSuit);
	const handSize = hand.length;
	const nonTrumpOptions = options.filter((c) => c.suit !== trumpSuit);
	if (nonTrumpOptions.length > 0) return nonTrumpOptions[0];
	const trumpOptions = options.filter((c) => c.suit === trumpSuit);
	if (trumpOptions.length > 0) {
		if (attackCard.suit === trumpSuit && myTrumps <= 1 && handSize > 3) return null;
		return trumpOptions[0];
	}
	return null;
}
/** Решение: брать или отбиваться? */
function aiDecideTake(table, hand, trumpSuit) {
	const undefended = table.filter((ac) => !ac.defendCard);
	if (undefended.length === 0) return false;
	let canDefendCount = 0;
	let totalCost = 0;
	for (const ac of undefended) {
		const options = beatableCards(ac.attackCard, hand, trumpSuit);
		if (options.length > 0) {
			canDefendCount++;
			const best = options.sort((a, b) => cardPower(a, trumpSuit) - cardPower(b, trumpSuit))[0];
			totalCost += cardPower(best, trumpSuit);
		}
	}
	const myTrumps = trumpCount(hand, trumpSuit);
	if (canDefendCount < Math.ceil(undefended.length / 2)) return true;
	const needTrumps = undefended.filter((ac) => hand.some((c) => canBeat(ac.attackCard, c, trumpSuit) && c.suit === trumpSuit)).length;
	if (needTrumps > 0 && myTrumps <= needTrumps + 1 && hand.length <= 4) return true;
	if (canDefendCount > 0 && totalCost / canDefendCount > 50 && hand.length <= 3) return true;
	return false;
}
//#endregion
//#region src/engine/store.ts
/**
* Игровой движок «Дурак» — Zustand store для N игроков (2-6)
*/
var INITIAL_STATE = {
	deck: [],
	trumpSuit: "hearts",
	trumpCard: null,
	players: [{
		id: "player1",
		name: "Игрок 1",
		hand: [],
		isWinner: false,
		takenCount: 0
	}, {
		id: "player2",
		name: "Игрок 2",
		hand: [],
		isWinner: false,
		takenCount: 0
	}],
	attackerIndex: 0,
	defenderIndex: 1,
	activePlayerIndex: 0,
	table: [],
	phase: "waiting",
	discardPile: [],
	consecutivePasses: 0,
	winner: null,
	lastAction: "",
	gameMode: "hotseat",
	aiThinking: false,
	roundCount: 0,
	playerCount: 2,
	thrownInPasses: 0
};
function removeFromHand(hand, card) {
	return hand.filter((c) => c.id !== card.id);
}
function canThrowInCard(card, table) {
	if (table.length === 0) return true;
	const ranks = /* @__PURE__ */ new Set();
	for (const ac of table) {
		ranks.add(ac.attackCard.rank);
		if (ac.defendCard) ranks.add(ac.defendCard.rank);
	}
	return ranks.has(card.rank);
}
/** Все ли карты на столе отбиты? */
function allDefended(table) {
	return table.length > 0 && table.every((ac) => ac.defendCard !== void 0);
}
/** Сколько подкидывающих ещё могут подкинуть? */
function getThrowerIndices(attackerIndex, defenderIndex, playerCount) {
	if (playerCount <= 2) return [];
	const throwers = [];
	for (let i = 0; i < playerCount; i++) if (i !== attackerIndex && i !== defenderIndex) throwers.push(i);
	return throwers;
}
/** Все ли кто может подкинуть — спасовали? */
/** AI делает ход */
function scheduleAiMoves(get, set) {
	const state = get();
	if (state.gameMode !== "ai" || state.phase === "game_over" || state.phase === "waiting") return;
	const humanIndex = 0;
	if (state.activePlayerIndex === humanIndex) return;
	set({ aiThinking: true });
	setTimeout(() => {
		const s = get();
		if (s.phase === "game_over" || s.phase === "waiting" || s.activePlayerIndex === humanIndex) {
			set({ aiThinking: false });
			return;
		}
		const aiIndex = s.activePlayerIndex;
		const aiHand = s.players[aiIndex].hand;
		if (s.phase === "attacking") if (aiIndex === s.attackerIndex) if (s.table.length === 0) {
			const card = aiChooseAttack(aiHand, s.table, s.trumpSuit);
			if (card) s.attack(card);
			else s.pass();
		} else {
			const card = aiChooseAttack(aiHand, s.table, s.trumpSuit);
			if (card && canThrowInCard(card, s.table)) s.attack(card);
			else s.pass();
		}
		else {
			const card = aiChooseAttack(aiHand, s.table, s.trumpSuit);
			if (card && canThrowInCard(card, s.table)) s.attack(card);
			else s.pass();
		}
		else if (s.phase === "defending") if (aiIndex === s.defenderIndex) {
			const undefended = s.table.filter((ac) => !ac.defendCard);
			if (undefended.length > 0) if (aiDecideTake(s.table, aiHand, s.trumpSuit)) s.take();
			else {
				const target = undefended[0];
				const defendCard = aiChooseDefend(target.attackCard, aiHand, s.trumpSuit);
				if (defendCard) s.defend(target.attackCard.id, defendCard);
				else s.take();
			}
		} else {
			const card = aiChooseAttack(aiHand, s.table, s.trumpSuit);
			if (card && canThrowInCard(card, s.table) && s.table.length < s.players[s.defenderIndex].hand.length) s.attack(card);
			else s.pass();
		}
		set({ aiThinking: false });
		const after = get();
		if (after.gameMode === "ai" && after.activePlayerIndex !== humanIndex && after.phase !== "game_over" && after.phase !== "waiting") scheduleAiMoves(get, set);
	}, 500 + Math.random() * 500);
}
/** Перейти к следующему активному игроку */
function advanceActivePlayer(state) {
	const { attackerIndex, defenderIndex, playerCount, table, phase } = state;
	const throwers = getThrowerIndices(attackerIndex, defenderIndex, playerCount);
	if (phase === "attacking") {
		const allPlayers = [
			attackerIndex,
			...throwers,
			defenderIndex
		];
		const nextActive = allPlayers[(allPlayers.indexOf(state.activePlayerIndex) + 1) % allPlayers.length];
		if (nextActive === defenderIndex) return {
			activePlayerIndex: defenderIndex,
			phase: "defending"
		};
		return { activePlayerIndex: nextActive };
	}
	if (phase === "defending") {
		const allPlayers = [...throwers, attackerIndex];
		if (allPlayers.length === 0) {
			if (allDefended(table)) return {
				phase: "attacking",
				activePlayerIndex: attackerIndex,
				thrownInPasses: 0
			};
			return { activePlayerIndex: defenderIndex };
		}
		return {
			activePlayerIndex: allPlayers[(allPlayers.indexOf(state.activePlayerIndex) + 1) % allPlayers.length],
			phase: "attacking",
			thrownInPasses: 0
		};
	}
	return {};
}
var useGameStore = create((set, get) => ({
	...INITIAL_STATE,
	validDefends: (attackCardId) => {
		const { players, defenderIndex, trumpSuit, table } = get();
		const defender = players[defenderIndex];
		const attackPair = table.find((ac) => ac.attackCard.id === attackCardId && !ac.defendCard);
		if (!attackPair) return [];
		return defender.hand.filter((c) => canBeat(attackPair.attackCard, c, trumpSuit));
	},
	canThrowIn: (card, playerIndex) => {
		const { phase, attackerIndex, defenderIndex, table, players, playerCount } = get();
		if (phase !== "attacking" && phase !== "defending") return false;
		if (playerIndex === defenderIndex) return false;
		if (playerCount <= 2 && playerIndex !== attackerIndex) return false;
		const defenderHandSize = players[defenderIndex].hand.length;
		if (table.length >= defenderHandSize) return false;
		return canThrowInCard(card, table);
	},
	startGame: (mode = "hotseat", playerCount = 2) => {
		playerCount = Math.max(2, Math.min(6, playerCount));
		const shuffled = shuffle(createDeck());
		const trumpCard = shuffled[shuffled.length - 1];
		const trumpSuit = trumpCard.suit;
		const players = [];
		let deckPos = 0;
		for (let i = 0; i < playerCount; i++) {
			const handCards = shuffled.slice(deckPos, deckPos + 6);
			deckPos += 6;
			let name;
			if (mode === "ai") name = i === 0 ? "Вы" : `Компьютер ${i + 1}`;
			else name = `Игрок ${i + 1}`;
			players.push({
				id: `player${i + 1}`,
				name,
				hand: sortHand(handCards, trumpSuit),
				isWinner: false,
				takenCount: 0
			});
		}
		const remainingDeck = shuffled.slice(deckPos);
		let attackerIndex = 0;
		let minTrumpRank = 15;
		for (let i = 0; i < playerCount; i++) {
			const trumpCards = players[i].hand.filter((c) => c.suit === trumpSuit);
			if (trumpCards.length > 0) {
				const minRank = Math.min(...trumpCards.map((c) => c.rank));
				if (minRank < minTrumpRank) {
					minTrumpRank = minRank;
					attackerIndex = i;
				}
			}
		}
		const defenderIndex = getNextPlayerIndex(attackerIndex, playerCount);
		set({
			deck: remainingDeck,
			trumpSuit,
			trumpCard,
			players,
			attackerIndex,
			defenderIndex,
			activePlayerIndex: attackerIndex,
			table: [],
			phase: mode === "hotseat" ? "handoff" : "attacking",
			discardPile: [],
			consecutivePasses: 0,
			winner: null,
			gameMode: mode,
			aiThinking: false,
			roundCount: 1,
			playerCount,
			thrownInPasses: 0,
			lastAction: `${RANK_NAMES[trumpCard.rank]}${SUIT_SYMBOLS[trumpSuit]} — козырь`
		});
		if (mode === "ai" && attackerIndex !== 0) scheduleAiMoves(get, set);
	},
	resetGame: () => {
		set({ ...INITIAL_STATE });
	},
	confirmHandoff: () => {
		const { phase } = get();
		if (phase !== "handoff") return;
		set({ phase: "attacking" });
	},
	attack: (card) => {
		const { phase, activePlayerIndex, defenderIndex, attackerIndex, players, table, playerCount, gameMode } = get();
		if (phase !== "attacking" && phase !== "defending") return;
		if (activePlayerIndex === defenderIndex) return;
		if (table.length > 0 && !canThrowInCard(card, table)) return;
		const defenderHandSize = players[defenderIndex].hand.length;
		if (table.length >= defenderHandSize) return;
		const attacker = players[activePlayerIndex];
		if (!attacker.hand.find((c) => c.id === card.id)) return;
		const newHand = removeFromHand(attacker.hand, card);
		const newPlayers = [...players];
		newPlayers[activePlayerIndex] = {
			...attacker,
			hand: newHand
		};
		const newTable = [...table, {
			attackCard: card,
			attackPlayerIndex: activePlayerIndex
		}];
		const updates = {
			players: newPlayers,
			table: newTable,
			thrownInPasses: 0,
			lastAction: `${RANK_NAMES[card.rank]}${SUIT_SYMBOLS[card.suit]}`
		};
		if (table.length === 0) {
			const throwers = getThrowerIndices(attackerIndex, defenderIndex, playerCount);
			if (throwers.length > 0) {
				updates.activePlayerIndex = throwers[0];
				updates.phase = "attacking";
			} else {
				updates.activePlayerIndex = defenderIndex;
				updates.phase = "defending";
			}
		} else {
			const next = advanceActivePlayer({
				...get(),
				...updates,
				table: newTable
			});
			Object.assign(updates, next);
		}
		set(updates);
		if (gameMode === "ai") scheduleAiMoves(get, set);
	},
	defend: (attackCardId, defendCard) => {
		const { players, defenderIndex, activePlayerIndex, trumpSuit, table, playerCount, gameMode, attackerIndex } = get();
		if (activePlayerIndex !== defenderIndex) return;
		const attackPair = table.find((ac) => ac.attackCard.id === attackCardId && !ac.defendCard);
		if (!attackPair) return;
		if (!canBeat(attackPair.attackCard, defendCard, trumpSuit)) return;
		const defender = players[defenderIndex];
		if (!defender.hand.find((c) => c.id === defendCard.id)) return;
		const newHand = removeFromHand(defender.hand, defendCard);
		const newPlayers = [...players];
		newPlayers[defenderIndex] = {
			...defender,
			hand: newHand
		};
		const newTable = table.map((ac) => ac.attackCard.id === attackCardId ? {
			...ac,
			defendCard,
			defendPlayerIndex: defenderIndex
		} : ac);
		const actionText = `Отбой: ${RANK_NAMES[defendCard.rank]}${SUIT_SYMBOLS[defendCard.suit]}`;
		const allDone = newTable.every((ac) => ac.defendCard !== void 0);
		let updates = {
			players: newPlayers,
			table: newTable,
			lastAction: actionText
		};
		if (allDone) {
			const throwers = getThrowerIndices(attackerIndex, defenderIndex, playerCount);
			if (throwers.length > 0) {
				updates.activePlayerIndex = throwers[0];
				updates.phase = "attacking";
				updates.thrownInPasses = 0;
			} else updates = {
				...updates,
				...handleBito(get, set, newPlayers, newTable)
			};
		} else {
			updates.activePlayerIndex = defenderIndex;
			updates.phase = "defending";
		}
		set(updates);
		if (gameMode === "ai") scheduleAiMoves(get, set);
	},
	take: () => {
		const { players, attackerIndex, defenderIndex, trumpSuit, table, deck, playerCount, gameMode, roundCount } = get();
		const { activePlayerIndex } = get();
		if (activePlayerIndex !== defenderIndex) return;
		const defender = players[defenderIndex];
		const tableCards = table.flatMap((ac) => {
			const cards = [ac.attackCard];
			if (ac.defendCard) cards.push(ac.defendCard);
			return cards;
		});
		const newDefenderHand = sortHand([...defender.hand, ...tableCards], trumpSuit);
		const newPlayers = [...players];
		newPlayers[defenderIndex] = {
			...defender,
			hand: newDefenderHand,
			takenCount: defender.takenCount + 1
		};
		let currentDeck = [...deck];
		const defNeeds = cardsNeeded(newPlayers[defenderIndex].hand);
		if (defNeeds > 0 && currentDeck.length > 0) {
			const cards = currentDeck.slice(0, defNeeds);
			currentDeck = currentDeck.slice(defNeeds);
			newPlayers[defenderIndex] = {
				...newPlayers[defenderIndex],
				hand: sortHand([...newPlayers[defenderIndex].hand, ...cards], trumpSuit)
			};
		}
		for (let i = 0; i < playerCount; i++) {
			const idx = (attackerIndex + i) % playerCount;
			if (idx === defenderIndex) continue;
			const needs = cardsNeeded(newPlayers[idx].hand);
			if (needs > 0 && currentDeck.length > 0) {
				const cards = currentDeck.slice(0, needs);
				currentDeck = currentDeck.slice(needs);
				newPlayers[idx] = {
					...newPlayers[idx],
					hand: sortHand([...newPlayers[idx].hand, ...cards], trumpSuit)
				};
			}
		}
		const gameOver = checkGameOver(newPlayers, currentDeck);
		if (gameOver.winner !== null) {
			set({
				players: newPlayers,
				deck: currentDeck,
				table: [],
				phase: "game_over",
				winner: gameOver.winner,
				lastAction: gameOver.message,
				roundCount: roundCount + 1
			});
			return;
		}
		const newDefenderIndex = getNextPlayerIndex(defenderIndex, playerCount, defenderIndex);
		set({
			players: newPlayers,
			deck: currentDeck,
			table: [],
			phase: gameMode === "hotseat" ? "handoff" : "attacking",
			consecutivePasses: 0,
			thrownInPasses: 0,
			attackerIndex,
			defenderIndex: newDefenderIndex,
			activePlayerIndex: attackerIndex,
			lastAction: `${defender.name} берёт!`,
			roundCount: roundCount + 1
		});
		if (gameMode === "ai") scheduleAiMoves(get, set);
	},
	pass: () => {
		const { activePlayerIndex, defenderIndex, attackerIndex, players, trumpSuit, deck, discardPile, gameMode, playerCount, thrownInPasses, roundCount, table } = get();
		if (activePlayerIndex === defenderIndex) return;
		const newPasses = thrownInPasses + 1;
		const allPlayersCanPass = 1 + getThrowerIndices(attackerIndex, defenderIndex, playerCount).length;
		if (allDefended(table) && newPasses >= allPlayersCanPass) {
			const allTableCards = table.flatMap((ac) => [ac.attackCard, ac.defendCard]);
			const newPlayers = [...players];
			let currentDeck = [...deck];
			const defNeeds = cardsNeeded(newPlayers[defenderIndex].hand);
			if (defNeeds > 0 && currentDeck.length > 0) {
				const cards = currentDeck.slice(0, defNeeds);
				currentDeck = currentDeck.slice(defNeeds);
				newPlayers[defenderIndex] = {
					...newPlayers[defenderIndex],
					hand: sortHand([...newPlayers[defenderIndex].hand, ...cards], trumpSuit)
				};
			}
			for (let i = 0; i < playerCount; i++) {
				const idx = (attackerIndex + i) % playerCount;
				if (idx === defenderIndex) continue;
				const needs = cardsNeeded(newPlayers[idx].hand);
				if (needs > 0 && currentDeck.length > 0) {
					const cards = currentDeck.slice(0, needs);
					currentDeck = currentDeck.slice(needs);
					newPlayers[idx] = {
						...newPlayers[idx],
						hand: sortHand([...newPlayers[idx].hand, ...cards], trumpSuit)
					};
				}
			}
			const gameOver = checkGameOver(newPlayers, currentDeck);
			if (gameOver.winner !== null) {
				set({
					players: newPlayers,
					deck: currentDeck,
					table: [],
					discardPile: [...discardPile, ...allTableCards],
					phase: "game_over",
					winner: gameOver.winner,
					lastAction: gameOver.message,
					roundCount: roundCount + 1
				});
				return;
			}
			const newAttacker = defenderIndex;
			const newDefender = getNextPlayerIndex(defenderIndex, playerCount);
			const nextPhase = gameMode === "hotseat" ? "handoff" : "attacking";
			set({
				players: newPlayers,
				deck: currentDeck,
				table: [],
				discardPile: [...discardPile, ...allTableCards],
				attackerIndex: newAttacker,
				defenderIndex: newDefender,
				activePlayerIndex: newAttacker,
				phase: nextPhase,
				consecutivePasses: 0,
				thrownInPasses: 0,
				lastAction: "Бито!",
				roundCount: roundCount + 1
			});
			if (gameMode === "ai") scheduleAiMoves(get, set);
			return;
		}
		const allActive = [attackerIndex, ...getThrowerIndices(attackerIndex, defenderIndex, playerCount)];
		const nextPos = (allActive.indexOf(activePlayerIndex) + 1) % allActive.length;
		if (nextPos === 0 && allDefended(table)) {
			set({ thrownInPasses: allPlayersCanPass });
			get().pass();
			return;
		}
		const nextActive = allActive[nextPos];
		set({
			activePlayerIndex: nextActive,
			thrownInPasses: newPasses,
			lastAction: "Пас"
		});
		if (gameMode === "ai") scheduleAiMoves(get, set);
	}
}));
/** Обработка «Бито!» */
function handleBito(get, _set, newPlayers, newTable) {
	const { defenderIndex, attackerIndex, trumpSuit, deck, discardPile, playerCount, gameMode, roundCount } = get();
	const allTableCards = newTable.flatMap((ac) => [ac.attackCard, ac.defendCard]);
	let currentDeck = [...deck];
	const updatedPlayers = [...newPlayers];
	const defNeeds = cardsNeeded(updatedPlayers[defenderIndex].hand);
	if (defNeeds > 0 && currentDeck.length > 0) {
		const cards = currentDeck.slice(0, defNeeds);
		currentDeck = currentDeck.slice(defNeeds);
		updatedPlayers[defenderIndex] = {
			...updatedPlayers[defenderIndex],
			hand: sortHand([...updatedPlayers[defenderIndex].hand, ...cards], trumpSuit)
		};
	}
	for (let i = 0; i < playerCount; i++) {
		const idx = (attackerIndex + i) % playerCount;
		if (idx === defenderIndex) continue;
		const needs = cardsNeeded(updatedPlayers[idx].hand);
		if (needs > 0 && currentDeck.length > 0) {
			const cards = currentDeck.slice(0, needs);
			currentDeck = currentDeck.slice(needs);
			updatedPlayers[idx] = {
				...updatedPlayers[idx],
				hand: sortHand([...updatedPlayers[idx].hand, ...cards], trumpSuit)
			};
		}
	}
	const gameOver = checkGameOver(updatedPlayers, currentDeck);
	if (gameOver.winner !== null) return {
		players: updatedPlayers,
		deck: currentDeck,
		table: [],
		discardPile: [...discardPile, ...allTableCards],
		phase: "game_over",
		winner: gameOver.winner,
		lastAction: gameOver.message
	};
	const newAttacker = defenderIndex;
	const newDefender = getNextPlayerIndex(defenderIndex, playerCount);
	const nextPhase = gameMode === "hotseat" ? "handoff" : "attacking";
	return {
		players: updatedPlayers,
		deck: currentDeck,
		table: [],
		discardPile: [...discardPile, ...allTableCards],
		attackerIndex: newAttacker,
		defenderIndex: newDefender,
		activePlayerIndex: newAttacker,
		phase: nextPhase,
		thrownInPasses: 0,
		lastAction: "Бито!",
		roundCount: roundCount + 1
	};
}
function checkGameOver(players, deck) {
	if (!(deck.length === 0)) return {
		winner: null,
		message: ""
	};
	const playersWithCards = players.filter((p) => p.hand.length > 0);
	if (playersWithCards.length === 0) return {
		winner: -1,
		message: "Ничья!"
	};
	if (playersWithCards.length === 1) {
		const loser = playersWithCards[0];
		return {
			winner: players.indexOf(loser) === 0 ? 1 : 0,
			message: `${loser.name} — дурак! 🃏`
		};
	}
	return {
		winner: null,
		message: ""
	};
}
//#endregion
//#region node_modules/peerjs-js-binarypack/dist/binarypack.mjs
var $e8379818650e2442$export$93654d4f2d6cd524 = class {
	constructor() {
		this.encoder = new TextEncoder();
		this._pieces = [];
		this._parts = [];
	}
	append_buffer(data) {
		this.flush();
		this._parts.push(data);
	}
	append(data) {
		this._pieces.push(data);
	}
	flush() {
		if (this._pieces.length > 0) {
			const buf = new Uint8Array(this._pieces);
			this._parts.push(buf);
			this._pieces = [];
		}
	}
	toArrayBuffer() {
		const buffer = [];
		for (const part of this._parts) buffer.push(part);
		return $e8379818650e2442$var$concatArrayBuffers(buffer).buffer;
	}
};
function $e8379818650e2442$var$concatArrayBuffers(bufs) {
	let size = 0;
	for (const buf of bufs) size += buf.byteLength;
	const result = new Uint8Array(size);
	let offset = 0;
	for (const buf of bufs) {
		const view = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
		result.set(view, offset);
		offset += buf.byteLength;
	}
	return result;
}
function $0cfd7828ad59115f$export$417857010dc9287f(data) {
	return new $0cfd7828ad59115f$var$Unpacker(data).unpack();
}
function $0cfd7828ad59115f$export$2a703dbb0cb35339(data) {
	const packer = new $0cfd7828ad59115f$export$b9ec4b114aa40074();
	const res = packer.pack(data);
	if (res instanceof Promise) return res.then(() => packer.getBuffer());
	return packer.getBuffer();
}
var $0cfd7828ad59115f$var$Unpacker = class {
	constructor(data) {
		this.index = 0;
		this.dataBuffer = data;
		this.dataView = new Uint8Array(this.dataBuffer);
		this.length = this.dataBuffer.byteLength;
	}
	unpack() {
		const type = this.unpack_uint8();
		if (type < 128) return type;
		else if ((type ^ 224) < 32) return (type ^ 224) - 32;
		let size;
		if ((size = type ^ 160) <= 15) return this.unpack_raw(size);
		else if ((size = type ^ 176) <= 15) return this.unpack_string(size);
		else if ((size = type ^ 144) <= 15) return this.unpack_array(size);
		else if ((size = type ^ 128) <= 15) return this.unpack_map(size);
		switch (type) {
			case 192: return null;
			case 193: return;
			case 194: return false;
			case 195: return true;
			case 202: return this.unpack_float();
			case 203: return this.unpack_double();
			case 204: return this.unpack_uint8();
			case 205: return this.unpack_uint16();
			case 206: return this.unpack_uint32();
			case 207: return this.unpack_uint64();
			case 208: return this.unpack_int8();
			case 209: return this.unpack_int16();
			case 210: return this.unpack_int32();
			case 211: return this.unpack_int64();
			case 212: return;
			case 213: return;
			case 214: return;
			case 215: return;
			case 216:
				size = this.unpack_uint16();
				return this.unpack_string(size);
			case 217:
				size = this.unpack_uint32();
				return this.unpack_string(size);
			case 218:
				size = this.unpack_uint16();
				return this.unpack_raw(size);
			case 219:
				size = this.unpack_uint32();
				return this.unpack_raw(size);
			case 220:
				size = this.unpack_uint16();
				return this.unpack_array(size);
			case 221:
				size = this.unpack_uint32();
				return this.unpack_array(size);
			case 222:
				size = this.unpack_uint16();
				return this.unpack_map(size);
			case 223:
				size = this.unpack_uint32();
				return this.unpack_map(size);
		}
	}
	unpack_uint8() {
		const byte = this.dataView[this.index] & 255;
		this.index++;
		return byte;
	}
	unpack_uint16() {
		const bytes = this.read(2);
		const uint16 = (bytes[0] & 255) * 256 + (bytes[1] & 255);
		this.index += 2;
		return uint16;
	}
	unpack_uint32() {
		const bytes = this.read(4);
		const uint32 = ((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3];
		this.index += 4;
		return uint32;
	}
	unpack_uint64() {
		const bytes = this.read(8);
		const uint64 = ((((((bytes[0] * 256 + bytes[1]) * 256 + bytes[2]) * 256 + bytes[3]) * 256 + bytes[4]) * 256 + bytes[5]) * 256 + bytes[6]) * 256 + bytes[7];
		this.index += 8;
		return uint64;
	}
	unpack_int8() {
		const uint8 = this.unpack_uint8();
		return uint8 < 128 ? uint8 : uint8 - 256;
	}
	unpack_int16() {
		const uint16 = this.unpack_uint16();
		return uint16 < 32768 ? uint16 : uint16 - 65536;
	}
	unpack_int32() {
		const uint32 = this.unpack_uint32();
		return uint32 < 2 ** 31 ? uint32 : uint32 - 2 ** 32;
	}
	unpack_int64() {
		const uint64 = this.unpack_uint64();
		return uint64 < 2 ** 63 ? uint64 : uint64 - 2 ** 64;
	}
	unpack_raw(size) {
		if (this.length < this.index + size) throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${size} ${this.length}`);
		const buf = this.dataBuffer.slice(this.index, this.index + size);
		this.index += size;
		return buf;
	}
	unpack_string(size) {
		const bytes = this.read(size);
		let i = 0;
		let str = "";
		let c;
		let code;
		while (i < size) {
			c = bytes[i];
			if (c < 160) {
				code = c;
				i++;
			} else if ((c ^ 192) < 32) {
				code = (c & 31) << 6 | bytes[i + 1] & 63;
				i += 2;
			} else if ((c ^ 224) < 16) {
				code = (c & 15) << 12 | (bytes[i + 1] & 63) << 6 | bytes[i + 2] & 63;
				i += 3;
			} else {
				code = (c & 7) << 18 | (bytes[i + 1] & 63) << 12 | (bytes[i + 2] & 63) << 6 | bytes[i + 3] & 63;
				i += 4;
			}
			str += String.fromCodePoint(code);
		}
		this.index += size;
		return str;
	}
	unpack_array(size) {
		const objects = new Array(size);
		for (let i = 0; i < size; i++) objects[i] = this.unpack();
		return objects;
	}
	unpack_map(size) {
		const map = {};
		for (let i = 0; i < size; i++) {
			const key = this.unpack();
			map[key] = this.unpack();
		}
		return map;
	}
	unpack_float() {
		const uint32 = this.unpack_uint32();
		const sign = uint32 >> 31;
		const exp = (uint32 >> 23 & 255) - 127;
		const fraction = uint32 & 8388607 | 8388608;
		return (sign === 0 ? 1 : -1) * fraction * 2 ** (exp - 23);
	}
	unpack_double() {
		const h32 = this.unpack_uint32();
		const l32 = this.unpack_uint32();
		const sign = h32 >> 31;
		const exp = (h32 >> 20 & 2047) - 1023;
		const frac = (h32 & 1048575 | 1048576) * 2 ** (exp - 20) + l32 * 2 ** (exp - 52);
		return (sign === 0 ? 1 : -1) * frac;
	}
	read(length) {
		const j = this.index;
		if (j + length <= this.length) return this.dataView.subarray(j, j + length);
		else throw new Error("BinaryPackFailure: read index out of range");
	}
};
var $0cfd7828ad59115f$export$b9ec4b114aa40074 = class {
	getBuffer() {
		return this._bufferBuilder.toArrayBuffer();
	}
	pack(value) {
		if (typeof value === "string") this.pack_string(value);
		else if (typeof value === "number") if (Math.floor(value) === value) this.pack_integer(value);
		else this.pack_double(value);
		else if (typeof value === "boolean") {
			if (value === true) this._bufferBuilder.append(195);
			else if (value === false) this._bufferBuilder.append(194);
		} else if (value === void 0) this._bufferBuilder.append(192);
		else if (typeof value === "object") if (value === null) this._bufferBuilder.append(192);
		else {
			const constructor = value.constructor;
			if (value instanceof Array) {
				const res = this.pack_array(value);
				if (res instanceof Promise) return res.then(() => this._bufferBuilder.flush());
			} else if (value instanceof ArrayBuffer) this.pack_bin(new Uint8Array(value));
			else if ("BYTES_PER_ELEMENT" in value) {
				const v = value;
				this.pack_bin(new Uint8Array(v.buffer, v.byteOffset, v.byteLength));
			} else if (value instanceof Date) this.pack_string(value.toString());
			else if (value instanceof Blob) return value.arrayBuffer().then((buffer) => {
				this.pack_bin(new Uint8Array(buffer));
				this._bufferBuilder.flush();
			});
			else if (constructor == Object || constructor.toString().startsWith("class")) {
				const res = this.pack_object(value);
				if (res instanceof Promise) return res.then(() => this._bufferBuilder.flush());
			} else throw new Error(`Type "${constructor.toString()}" not yet supported`);
		}
		else throw new Error(`Type "${typeof value}" not yet supported`);
		this._bufferBuilder.flush();
	}
	pack_bin(blob) {
		const length = blob.length;
		if (length <= 15) this.pack_uint8(160 + length);
		else if (length <= 65535) {
			this._bufferBuilder.append(218);
			this.pack_uint16(length);
		} else if (length <= 4294967295) {
			this._bufferBuilder.append(219);
			this.pack_uint32(length);
		} else throw new Error("Invalid length");
		this._bufferBuilder.append_buffer(blob);
	}
	pack_string(str) {
		const encoded = this._textEncoder.encode(str);
		const length = encoded.length;
		if (length <= 15) this.pack_uint8(176 + length);
		else if (length <= 65535) {
			this._bufferBuilder.append(216);
			this.pack_uint16(length);
		} else if (length <= 4294967295) {
			this._bufferBuilder.append(217);
			this.pack_uint32(length);
		} else throw new Error("Invalid length");
		this._bufferBuilder.append_buffer(encoded);
	}
	pack_array(ary) {
		const length = ary.length;
		if (length <= 15) this.pack_uint8(144 + length);
		else if (length <= 65535) {
			this._bufferBuilder.append(220);
			this.pack_uint16(length);
		} else if (length <= 4294967295) {
			this._bufferBuilder.append(221);
			this.pack_uint32(length);
		} else throw new Error("Invalid length");
		const packNext = (index) => {
			if (index < length) {
				const res = this.pack(ary[index]);
				if (res instanceof Promise) return res.then(() => packNext(index + 1));
				return packNext(index + 1);
			}
		};
		return packNext(0);
	}
	pack_integer(num) {
		if (num >= -32 && num <= 127) this._bufferBuilder.append(num & 255);
		else if (num >= 0 && num <= 255) {
			this._bufferBuilder.append(204);
			this.pack_uint8(num);
		} else if (num >= -128 && num <= 127) {
			this._bufferBuilder.append(208);
			this.pack_int8(num);
		} else if (num >= 0 && num <= 65535) {
			this._bufferBuilder.append(205);
			this.pack_uint16(num);
		} else if (num >= -32768 && num <= 32767) {
			this._bufferBuilder.append(209);
			this.pack_int16(num);
		} else if (num >= 0 && num <= 4294967295) {
			this._bufferBuilder.append(206);
			this.pack_uint32(num);
		} else if (num >= -2147483648 && num <= 2147483647) {
			this._bufferBuilder.append(210);
			this.pack_int32(num);
		} else if (num >= -0x8000000000000000 && num <= 0x8000000000000000) {
			this._bufferBuilder.append(211);
			this.pack_int64(num);
		} else if (num >= 0 && num <= 0x10000000000000000) {
			this._bufferBuilder.append(207);
			this.pack_uint64(num);
		} else throw new Error("Invalid integer");
	}
	pack_double(num) {
		let sign = 0;
		if (num < 0) {
			sign = 1;
			num = -num;
		}
		const exp = Math.floor(Math.log(num) / Math.LN2);
		const frac0 = num / 2 ** exp - 1;
		const frac1 = Math.floor(frac0 * 2 ** 52);
		const b32 = 2 ** 32;
		const h32 = sign << 31 | exp + 1023 << 20 | frac1 / b32 & 1048575;
		const l32 = frac1 % b32;
		this._bufferBuilder.append(203);
		this.pack_int32(h32);
		this.pack_int32(l32);
	}
	pack_object(obj) {
		const keys = Object.keys(obj);
		const length = keys.length;
		if (length <= 15) this.pack_uint8(128 + length);
		else if (length <= 65535) {
			this._bufferBuilder.append(222);
			this.pack_uint16(length);
		} else if (length <= 4294967295) {
			this._bufferBuilder.append(223);
			this.pack_uint32(length);
		} else throw new Error("Invalid length");
		const packNext = (index) => {
			if (index < keys.length) {
				const prop = keys[index];
				if (obj.hasOwnProperty(prop)) {
					this.pack(prop);
					const res = this.pack(obj[prop]);
					if (res instanceof Promise) return res.then(() => packNext(index + 1));
				}
				return packNext(index + 1);
			}
		};
		return packNext(0);
	}
	pack_uint8(num) {
		this._bufferBuilder.append(num);
	}
	pack_uint16(num) {
		this._bufferBuilder.append(num >> 8);
		this._bufferBuilder.append(num & 255);
	}
	pack_uint32(num) {
		const n = num & 4294967295;
		this._bufferBuilder.append((n & 4278190080) >>> 24);
		this._bufferBuilder.append((n & 16711680) >>> 16);
		this._bufferBuilder.append((n & 65280) >>> 8);
		this._bufferBuilder.append(n & 255);
	}
	pack_uint64(num) {
		const high = num / 2 ** 32;
		const low = num % 2 ** 32;
		this._bufferBuilder.append((high & 4278190080) >>> 24);
		this._bufferBuilder.append((high & 16711680) >>> 16);
		this._bufferBuilder.append((high & 65280) >>> 8);
		this._bufferBuilder.append(high & 255);
		this._bufferBuilder.append((low & 4278190080) >>> 24);
		this._bufferBuilder.append((low & 16711680) >>> 16);
		this._bufferBuilder.append((low & 65280) >>> 8);
		this._bufferBuilder.append(low & 255);
	}
	pack_int8(num) {
		this._bufferBuilder.append(num & 255);
	}
	pack_int16(num) {
		this._bufferBuilder.append((num & 65280) >> 8);
		this._bufferBuilder.append(num & 255);
	}
	pack_int32(num) {
		this._bufferBuilder.append(num >>> 24 & 255);
		this._bufferBuilder.append((num & 16711680) >>> 16);
		this._bufferBuilder.append((num & 65280) >>> 8);
		this._bufferBuilder.append(num & 255);
	}
	pack_int64(num) {
		const high = Math.floor(num / 2 ** 32);
		const low = num % 2 ** 32;
		this._bufferBuilder.append((high & 4278190080) >>> 24);
		this._bufferBuilder.append((high & 16711680) >>> 16);
		this._bufferBuilder.append((high & 65280) >>> 8);
		this._bufferBuilder.append(high & 255);
		this._bufferBuilder.append((low & 4278190080) >>> 24);
		this._bufferBuilder.append((low & 16711680) >>> 16);
		this._bufferBuilder.append((low & 65280) >>> 8);
		this._bufferBuilder.append(low & 255);
	}
	constructor() {
		this._bufferBuilder = new $e8379818650e2442$export$93654d4f2d6cd524();
		this._textEncoder = new TextEncoder();
	}
};
//#endregion
//#region node_modules/webrtc-adapter/src/js/utils.js
var logDisabled_ = true;
var deprecationWarnings_ = true;
/**
* Extract browser version out of the provided user agent string.
*
* @param {!string} uastring userAgent string.
* @param {!string} expr Regular expression used as match criteria.
* @param {!number} pos position in the version string to be returned.
* @return {!number} browser version.
*/
function extractVersion(uastring, expr, pos) {
	const match = uastring.match(expr);
	return match && match.length >= pos && parseFloat(match[pos], 10);
}
function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
	if (!window.RTCPeerConnection) return;
	if (!Object.getOwnPropertyDescriptor(EventTarget.prototype, "addEventListener").writable) {
		log("Unable to polyfill events");
		return;
	}
	const proto = window.RTCPeerConnection.prototype;
	const nativeAddEventListener = proto.addEventListener;
	proto.addEventListener = function(nativeEventName, cb) {
		if (nativeEventName !== eventNameToWrap) return nativeAddEventListener.apply(this, arguments);
		const wrappedCallback = (e) => {
			const modifiedEvent = wrapper(e);
			if (modifiedEvent) if (cb.handleEvent) cb.handleEvent(modifiedEvent);
			else cb(modifiedEvent);
		};
		this._eventMap = this._eventMap || {};
		if (!this._eventMap[eventNameToWrap]) this._eventMap[eventNameToWrap] = /* @__PURE__ */ new Map();
		this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
		return nativeAddEventListener.apply(this, [nativeEventName, wrappedCallback]);
	};
	const nativeRemoveEventListener = proto.removeEventListener;
	proto.removeEventListener = function(nativeEventName, cb) {
		if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[eventNameToWrap]) return nativeRemoveEventListener.apply(this, arguments);
		if (!this._eventMap[eventNameToWrap].has(cb)) return nativeRemoveEventListener.apply(this, arguments);
		const unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
		this._eventMap[eventNameToWrap].delete(cb);
		if (this._eventMap[eventNameToWrap].size === 0) delete this._eventMap[eventNameToWrap];
		if (Object.keys(this._eventMap).length === 0) delete this._eventMap;
		return nativeRemoveEventListener.apply(this, [nativeEventName, unwrappedCb]);
	};
	Object.defineProperty(proto, "on" + eventNameToWrap, {
		get() {
			return this["_on" + eventNameToWrap];
		},
		set(cb) {
			if (this["_on" + eventNameToWrap]) {
				this.removeEventListener(eventNameToWrap, this["_on" + eventNameToWrap]);
				delete this["_on" + eventNameToWrap];
			}
			if (cb) this.addEventListener(eventNameToWrap, this["_on" + eventNameToWrap] = cb);
		},
		enumerable: true,
		configurable: true
	});
}
function disableLog(bool) {
	if (typeof bool !== "boolean") return /* @__PURE__ */ new Error("Argument type: " + typeof bool + ". Please use a boolean.");
	logDisabled_ = bool;
	return bool ? "adapter.js logging disabled" : "adapter.js logging enabled";
}
/**
* Disable or enable deprecation warnings
* @param {!boolean} bool set to true to disable warnings.
*/
function disableWarnings(bool) {
	if (typeof bool !== "boolean") return /* @__PURE__ */ new Error("Argument type: " + typeof bool + ". Please use a boolean.");
	deprecationWarnings_ = !bool;
	return "adapter.js deprecation warnings " + (bool ? "disabled" : "enabled");
}
function log() {
	if (typeof window === "object") {
		if (logDisabled_) return;
		if (typeof console !== "undefined" && typeof console.log === "function") console.log.apply(console, arguments);
	}
}
/**
* Shows a deprecation warning suggesting the modern and spec-compatible API.
*/
function deprecated(oldMethod, newMethod) {
	if (!deprecationWarnings_) return;
	console.warn(oldMethod + " is deprecated, please use " + newMethod + " instead.");
}
/**
* Browser detector.
*
* @return {object} result containing browser and version
*     properties.
*/
function detectBrowser(window) {
	const result = {
		browser: null,
		version: null
	};
	if (typeof window === "undefined" || !window.navigator || !window.navigator.userAgent) {
		result.browser = "Not a browser.";
		return result;
	}
	const { navigator } = window;
	if (navigator.userAgentData && navigator.userAgentData.brands) {
		const chromium = navigator.userAgentData.brands.find((brand) => {
			return brand.brand === "Chromium";
		});
		if (chromium) return {
			browser: "chrome",
			version: parseInt(chromium.version, 10)
		};
	}
	if (navigator.mozGetUserMedia) {
		result.browser = "firefox";
		result.version = parseInt(extractVersion(navigator.userAgent, /Firefox\/(\d+)\./, 1));
	} else if (navigator.webkitGetUserMedia || window.isSecureContext === false && window.webkitRTCPeerConnection) {
		result.browser = "chrome";
		result.version = parseInt(extractVersion(navigator.userAgent, /Chrom(e|ium)\/(\d+)\./, 2)) || null;
	} else if (window.RTCPeerConnection && navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
		result.browser = "safari";
		result.version = parseInt(extractVersion(navigator.userAgent, /AppleWebKit\/(\d+)\./, 1));
		result.supportsUnifiedPlan = window.RTCRtpTransceiver && "currentDirection" in window.RTCRtpTransceiver.prototype;
		result._safariVersion = extractVersion(navigator.userAgent, /Version\/(\d+(\.?\d+))/, 1);
	} else {
		result.browser = "Not a supported browser.";
		return result;
	}
	return result;
}
/**
* Checks if something is an object.
*
* @param {*} val The something you want to check.
* @return true if val is an object, false otherwise.
*/
function isObject(val) {
	return Object.prototype.toString.call(val) === "[object Object]";
}
/**
* Remove all empty objects and undefined values
* from a nested object -- an enhanced and vanilla version
* of Lodash's `compact`.
*/
function compactObject(data) {
	if (!isObject(data)) return data;
	return Object.keys(data).reduce(function(accumulator, key) {
		const isObj = isObject(data[key]);
		const value = isObj ? compactObject(data[key]) : data[key];
		const isEmptyObject = isObj && !Object.keys(value).length;
		if (value === void 0 || isEmptyObject) return accumulator;
		return Object.assign(accumulator, { [key]: value });
	}, {});
}
function walkStats(stats, base, resultSet) {
	if (!base || resultSet.has(base.id)) return;
	resultSet.set(base.id, base);
	Object.keys(base).forEach((name) => {
		if (name.endsWith("Id")) walkStats(stats, stats.get(base[name]), resultSet);
		else if (name.endsWith("Ids")) base[name].forEach((id) => {
			walkStats(stats, stats.get(id), resultSet);
		});
	});
}
function filterStats(result, track, outbound) {
	const streamStatsType = outbound ? "outbound-rtp" : "inbound-rtp";
	const filteredResult = /* @__PURE__ */ new Map();
	if (track === null) return filteredResult;
	const trackStats = [];
	result.forEach((value) => {
		if (value.type === "track" && value.trackIdentifier === track.id) trackStats.push(value);
	});
	trackStats.forEach((trackStat) => {
		result.forEach((stats) => {
			if (stats.type === streamStatsType && stats.trackId === trackStat.id) walkStats(result, stats, filteredResult);
		});
	});
	return filteredResult;
}
//#endregion
//#region node_modules/webrtc-adapter/src/js/chrome/getusermedia.js
var logging = log;
function shimGetUserMedia$2(window, browserDetails) {
	const navigator = window && window.navigator;
	if (!navigator.mediaDevices) return;
	const constraintsToChrome_ = function(c) {
		if (typeof c !== "object" || c.mandatory || c.optional) return c;
		const cc = {};
		Object.keys(c).forEach((key) => {
			if (key === "require" || key === "advanced" || key === "mediaSource") return;
			const r = typeof c[key] === "object" ? c[key] : { ideal: c[key] };
			if (r.exact !== void 0 && typeof r.exact === "number") r.min = r.max = r.exact;
			const oldname_ = function(prefix, name) {
				if (prefix) return prefix + name.charAt(0).toUpperCase() + name.slice(1);
				return name === "deviceId" ? "sourceId" : name;
			};
			if (r.ideal !== void 0) {
				cc.optional = cc.optional || [];
				let oc = {};
				if (typeof r.ideal === "number") {
					oc[oldname_("min", key)] = r.ideal;
					cc.optional.push(oc);
					oc = {};
					oc[oldname_("max", key)] = r.ideal;
					cc.optional.push(oc);
				} else {
					oc[oldname_("", key)] = r.ideal;
					cc.optional.push(oc);
				}
			}
			if (r.exact !== void 0 && typeof r.exact !== "number") {
				cc.mandatory = cc.mandatory || {};
				cc.mandatory[oldname_("", key)] = r.exact;
			} else ["min", "max"].forEach((mix) => {
				if (r[mix] !== void 0) {
					cc.mandatory = cc.mandatory || {};
					cc.mandatory[oldname_(mix, key)] = r[mix];
				}
			});
		});
		if (c.advanced) cc.optional = (cc.optional || []).concat(c.advanced);
		return cc;
	};
	const shimConstraints_ = function(constraints, func) {
		if (browserDetails.version >= 61) return func(constraints);
		constraints = JSON.parse(JSON.stringify(constraints));
		if (constraints && typeof constraints.audio === "object") {
			const remap = function(obj, a, b) {
				if (a in obj && !(b in obj)) {
					obj[b] = obj[a];
					delete obj[a];
				}
			};
			constraints = JSON.parse(JSON.stringify(constraints));
			remap(constraints.audio, "autoGainControl", "googAutoGainControl");
			remap(constraints.audio, "noiseSuppression", "googNoiseSuppression");
			constraints.audio = constraintsToChrome_(constraints.audio);
		}
		if (constraints && typeof constraints.video === "object") {
			let face = constraints.video.facingMode;
			face = face && (typeof face === "object" ? face : { ideal: face });
			const getSupportedFacingModeLies = browserDetails.version < 66;
			if (face && (face.exact === "user" || face.exact === "environment" || face.ideal === "user" || face.ideal === "environment") && !(navigator.mediaDevices.getSupportedConstraints && navigator.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
				delete constraints.video.facingMode;
				let matches;
				if (face.exact === "environment" || face.ideal === "environment") matches = ["back", "rear"];
				else if (face.exact === "user" || face.ideal === "user") matches = ["front"];
				if (matches) return navigator.mediaDevices.enumerateDevices().then((devices) => {
					devices = devices.filter((d) => d.kind === "videoinput");
					let dev = devices.find((d) => matches.some((match) => d.label.toLowerCase().includes(match)));
					if (!dev && devices.length && matches.includes("back")) dev = devices[devices.length - 1];
					if (dev) constraints.video.deviceId = face.exact ? { exact: dev.deviceId } : { ideal: dev.deviceId };
					constraints.video = constraintsToChrome_(constraints.video);
					logging("chrome: " + JSON.stringify(constraints));
					return func(constraints);
				});
			}
			constraints.video = constraintsToChrome_(constraints.video);
		}
		logging("chrome: " + JSON.stringify(constraints));
		return func(constraints);
	};
	const shimError_ = function(e) {
		if (browserDetails.version >= 64) return e;
		return {
			name: {
				PermissionDeniedError: "NotAllowedError",
				PermissionDismissedError: "NotAllowedError",
				InvalidStateError: "NotAllowedError",
				DevicesNotFoundError: "NotFoundError",
				ConstraintNotSatisfiedError: "OverconstrainedError",
				TrackStartError: "NotReadableError",
				MediaDeviceFailedDueToShutdown: "NotAllowedError",
				MediaDeviceKillSwitchOn: "NotAllowedError",
				TabCaptureError: "AbortError",
				ScreenCaptureError: "AbortError",
				DeviceCaptureError: "AbortError"
			}[e.name] || e.name,
			message: e.message,
			constraint: e.constraint || e.constraintName,
			toString() {
				return this.name + (this.message && ": ") + this.message;
			}
		};
	};
	const getUserMedia_ = function(constraints, onSuccess, onError) {
		shimConstraints_(constraints, (c) => {
			navigator.webkitGetUserMedia(c, onSuccess, (e) => {
				if (onError) onError(shimError_(e));
			});
		});
	};
	navigator.getUserMedia = getUserMedia_.bind(navigator);
	if (navigator.mediaDevices.getUserMedia) {
		const origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
		navigator.mediaDevices.getUserMedia = function(cs) {
			return shimConstraints_(cs, (c) => origGetUserMedia(c).then((stream) => {
				if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
					stream.getTracks().forEach((track) => {
						track.stop();
					});
					throw new DOMException("", "NotFoundError");
				}
				return stream;
			}, (e) => Promise.reject(shimError_(e))));
		};
	}
}
//#endregion
//#region node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js
var chrome_shim_exports = /* @__PURE__ */ __exportAll({
	fixNegotiationNeeded: () => fixNegotiationNeeded,
	shimAddTrackRemoveTrack: () => shimAddTrackRemoveTrack,
	shimAddTrackRemoveTrackWithNative: () => shimAddTrackRemoveTrackWithNative,
	shimGetSendersWithDtmf: () => shimGetSendersWithDtmf,
	shimGetUserMedia: () => shimGetUserMedia$2,
	shimMediaStream: () => shimMediaStream,
	shimOnTrack: () => shimOnTrack$1,
	shimPeerConnection: () => shimPeerConnection$1,
	shimSenderReceiverGetStats: () => shimSenderReceiverGetStats
});
function shimMediaStream(window) {
	window.MediaStream = window.MediaStream || window.webkitMediaStream;
}
function shimOnTrack$1(window, browserDetails) {
	if (browserDetails.version > 102) return;
	if (typeof window === "object" && window.RTCPeerConnection && !("ontrack" in window.RTCPeerConnection.prototype)) {
		Object.defineProperty(window.RTCPeerConnection.prototype, "ontrack", {
			get() {
				return this._ontrack;
			},
			set(f) {
				if (this._ontrack) this.removeEventListener("track", this._ontrack);
				this.addEventListener("track", this._ontrack = f);
			},
			enumerable: true,
			configurable: true
		});
		const origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
		window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
			if (!this._ontrackpoly) {
				this._ontrackpoly = (e) => {
					e.stream.addEventListener("addtrack", (te) => {
						let receiver;
						if (window.RTCPeerConnection.prototype.getReceivers) receiver = this.getReceivers().find((r) => r.track && r.track.id === te.track.id);
						else receiver = { track: te.track };
						const event = new Event("track");
						event.track = te.track;
						event.receiver = receiver;
						event.transceiver = { receiver };
						event.streams = [e.stream];
						this.dispatchEvent(event);
					});
					e.stream.getTracks().forEach((track) => {
						let receiver;
						if (window.RTCPeerConnection.prototype.getReceivers) receiver = this.getReceivers().find((r) => r.track && r.track.id === track.id);
						else receiver = { track };
						const event = new Event("track");
						event.track = track;
						event.receiver = receiver;
						event.transceiver = { receiver };
						event.streams = [e.stream];
						this.dispatchEvent(event);
					});
				};
				this.addEventListener("addstream", this._ontrackpoly);
			}
			return origSetRemoteDescription.apply(this, arguments);
		};
	} else wrapPeerConnectionEvent(window, "track", (e) => {
		if (!e.transceiver) Object.defineProperty(e, "transceiver", { value: { receiver: e.receiver } });
		return e;
	});
}
function shimGetSendersWithDtmf(window) {
	if (typeof window === "object" && window.RTCPeerConnection && !("getSenders" in window.RTCPeerConnection.prototype) && "createDTMFSender" in window.RTCPeerConnection.prototype) {
		const shimSenderWithDtmf = function(pc, track) {
			return {
				track,
				get dtmf() {
					if (this._dtmf === void 0) if (track.kind === "audio") this._dtmf = pc.createDTMFSender(track);
					else this._dtmf = null;
					return this._dtmf;
				},
				_pc: pc
			};
		};
		if (!window.RTCPeerConnection.prototype.getSenders) {
			window.RTCPeerConnection.prototype.getSenders = function getSenders() {
				this._senders = this._senders || [];
				return this._senders.slice();
			};
			const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
			window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
				let sender = origAddTrack.apply(this, arguments);
				if (!sender) {
					sender = shimSenderWithDtmf(this, track);
					this._senders.push(sender);
				}
				return sender;
			};
			const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
			window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
				origRemoveTrack.apply(this, arguments);
				const idx = this._senders.indexOf(sender);
				if (idx !== -1) this._senders.splice(idx, 1);
			};
		}
		const origAddStream = window.RTCPeerConnection.prototype.addStream;
		window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
			this._senders = this._senders || [];
			origAddStream.apply(this, [stream]);
			stream.getTracks().forEach((track) => {
				this._senders.push(shimSenderWithDtmf(this, track));
			});
		};
		const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
		window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
			this._senders = this._senders || [];
			origRemoveStream.apply(this, [stream]);
			stream.getTracks().forEach((track) => {
				const sender = this._senders.find((s) => s.track === track);
				if (sender) this._senders.splice(this._senders.indexOf(sender), 1);
			});
		};
	} else if (typeof window === "object" && window.RTCPeerConnection && "getSenders" in window.RTCPeerConnection.prototype && "createDTMFSender" in window.RTCPeerConnection.prototype && window.RTCRtpSender && !("dtmf" in window.RTCRtpSender.prototype)) {
		const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
		window.RTCPeerConnection.prototype.getSenders = function getSenders() {
			const senders = origGetSenders.apply(this, []);
			senders.forEach((sender) => sender._pc = this);
			return senders;
		};
		Object.defineProperty(window.RTCRtpSender.prototype, "dtmf", { get() {
			if (this._dtmf === void 0) if (this.track.kind === "audio") this._dtmf = this._pc.createDTMFSender(this.track);
			else this._dtmf = null;
			return this._dtmf;
		} });
	}
}
function shimSenderReceiverGetStats(window, browserDetails) {
	if (browserDetails.version >= 67) return;
	if (!(typeof window === "object" && window.RTCPeerConnection && window.RTCRtpSender && window.RTCRtpReceiver)) return;
	if (!("getStats" in window.RTCRtpSender.prototype)) {
		const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
		if (origGetSenders) window.RTCPeerConnection.prototype.getSenders = function getSenders() {
			const senders = origGetSenders.apply(this, []);
			senders.forEach((sender) => sender._pc = this);
			return senders;
		};
		const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
		if (origAddTrack) window.RTCPeerConnection.prototype.addTrack = function addTrack() {
			const sender = origAddTrack.apply(this, arguments);
			sender._pc = this;
			return sender;
		};
		window.RTCRtpSender.prototype.getStats = function getStats() {
			const sender = this;
			return this._pc.getStats().then((result) => filterStats(result, sender.track, true));
		};
	}
	if (!("getStats" in window.RTCRtpReceiver.prototype)) {
		const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
		if (origGetReceivers) window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
			const receivers = origGetReceivers.apply(this, []);
			receivers.forEach((receiver) => receiver._pc = this);
			return receivers;
		};
		wrapPeerConnectionEvent(window, "track", (e) => {
			e.receiver._pc = e.srcElement;
			return e;
		});
		window.RTCRtpReceiver.prototype.getStats = function getStats() {
			const receiver = this;
			return this._pc.getStats().then((result) => filterStats(result, receiver.track, false));
		};
	}
	if (!("getStats" in window.RTCRtpSender.prototype && "getStats" in window.RTCRtpReceiver.prototype)) return;
	const origGetStats = window.RTCPeerConnection.prototype.getStats;
	window.RTCPeerConnection.prototype.getStats = function getStats() {
		if (arguments.length > 0 && arguments[0] instanceof window.MediaStreamTrack) {
			const track = arguments[0];
			let sender;
			let receiver;
			let err;
			this.getSenders().forEach((s) => {
				if (s.track === track) if (sender) err = true;
				else sender = s;
			});
			this.getReceivers().forEach((r) => {
				if (r.track === track) if (receiver) err = true;
				else receiver = r;
				return r.track === track;
			});
			if (err || sender && receiver) return Promise.reject(new DOMException("There are more than one sender or receiver for the track.", "InvalidAccessError"));
			else if (sender) return sender.getStats();
			else if (receiver) return receiver.getStats();
			return Promise.reject(new DOMException("There is no sender or receiver for the track.", "InvalidAccessError"));
		}
		return origGetStats.apply(this, arguments);
	};
}
function shimAddTrackRemoveTrackWithNative(window) {
	window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
		this._shimmedLocalStreams = this._shimmedLocalStreams || {};
		return Object.keys(this._shimmedLocalStreams).map((streamId) => this._shimmedLocalStreams[streamId][0]);
	};
	const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
	window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
		if (!stream) return origAddTrack.apply(this, arguments);
		this._shimmedLocalStreams = this._shimmedLocalStreams || {};
		const sender = origAddTrack.apply(this, arguments);
		if (!this._shimmedLocalStreams[stream.id]) this._shimmedLocalStreams[stream.id] = [stream, sender];
		else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) this._shimmedLocalStreams[stream.id].push(sender);
		return sender;
	};
	const origAddStream = window.RTCPeerConnection.prototype.addStream;
	window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
		this._shimmedLocalStreams = this._shimmedLocalStreams || {};
		stream.getTracks().forEach((track) => {
			if (this.getSenders().find((s) => s.track === track)) throw new DOMException("Track already exists.", "InvalidAccessError");
		});
		const existingSenders = this.getSenders();
		origAddStream.apply(this, arguments);
		const newSenders = this.getSenders().filter((newSender) => existingSenders.indexOf(newSender) === -1);
		this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
	};
	const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
	window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
		this._shimmedLocalStreams = this._shimmedLocalStreams || {};
		delete this._shimmedLocalStreams[stream.id];
		return origRemoveStream.apply(this, arguments);
	};
	const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
	window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
		this._shimmedLocalStreams = this._shimmedLocalStreams || {};
		if (sender) Object.keys(this._shimmedLocalStreams).forEach((streamId) => {
			const idx = this._shimmedLocalStreams[streamId].indexOf(sender);
			if (idx !== -1) this._shimmedLocalStreams[streamId].splice(idx, 1);
			if (this._shimmedLocalStreams[streamId].length === 1) delete this._shimmedLocalStreams[streamId];
		});
		return origRemoveTrack.apply(this, arguments);
	};
}
function shimAddTrackRemoveTrack(window, browserDetails) {
	if (!window.RTCPeerConnection) return;
	if (window.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) return shimAddTrackRemoveTrackWithNative(window);
	const origGetLocalStreams = window.RTCPeerConnection.prototype.getLocalStreams;
	window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
		const nativeStreams = origGetLocalStreams.apply(this);
		this._reverseStreams = this._reverseStreams || {};
		return nativeStreams.map((stream) => this._reverseStreams[stream.id]);
	};
	const origAddStream = window.RTCPeerConnection.prototype.addStream;
	window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
		this._streams = this._streams || {};
		this._reverseStreams = this._reverseStreams || {};
		stream.getTracks().forEach((track) => {
			if (this.getSenders().find((s) => s.track === track)) throw new DOMException("Track already exists.", "InvalidAccessError");
		});
		if (!this._reverseStreams[stream.id]) {
			const newStream = new window.MediaStream(stream.getTracks());
			this._streams[stream.id] = newStream;
			this._reverseStreams[newStream.id] = stream;
			stream = newStream;
		}
		origAddStream.apply(this, [stream]);
	};
	const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
	window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
		this._streams = this._streams || {};
		this._reverseStreams = this._reverseStreams || {};
		origRemoveStream.apply(this, [this._streams[stream.id] || stream]);
		delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
		delete this._streams[stream.id];
	};
	window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
		if (this.signalingState === "closed") throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
		const streams = [].slice.call(arguments, 1);
		if (streams.length !== 1 || !streams[0].getTracks().find((t) => t === track)) throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.", "NotSupportedError");
		if (this.getSenders().find((s) => s.track === track)) throw new DOMException("Track already exists.", "InvalidAccessError");
		this._streams = this._streams || {};
		this._reverseStreams = this._reverseStreams || {};
		const oldStream = this._streams[stream.id];
		if (oldStream) {
			oldStream.addTrack(track);
			Promise.resolve().then(() => {
				this.dispatchEvent(new Event("negotiationneeded"));
			});
		} else {
			const newStream = new window.MediaStream([track]);
			this._streams[stream.id] = newStream;
			this._reverseStreams[newStream.id] = stream;
			this.addStream(newStream);
		}
		return this.getSenders().find((s) => s.track === track);
	};
	function replaceInternalStreamId(pc, description) {
		let sdp = description.sdp;
		Object.keys(pc._reverseStreams || []).forEach((internalId) => {
			const externalStream = pc._reverseStreams[internalId];
			const internalStream = pc._streams[externalStream.id];
			sdp = sdp.replace(new RegExp(internalStream.id, "g"), externalStream.id);
		});
		return new RTCSessionDescription({
			type: description.type,
			sdp
		});
	}
	function replaceExternalStreamId(pc, description) {
		let sdp = description.sdp;
		Object.keys(pc._reverseStreams || []).forEach((internalId) => {
			const externalStream = pc._reverseStreams[internalId];
			const internalStream = pc._streams[externalStream.id];
			sdp = sdp.replace(new RegExp(externalStream.id, "g"), internalStream.id);
		});
		return new RTCSessionDescription({
			type: description.type,
			sdp
		});
	}
	["createOffer", "createAnswer"].forEach(function(method) {
		const nativeMethod = window.RTCPeerConnection.prototype[method];
		const methodObj = { [method]() {
			const args = arguments;
			if (arguments.length && typeof arguments[0] === "function") return nativeMethod.apply(this, [
				(description) => {
					const desc = replaceInternalStreamId(this, description);
					args[0].apply(null, [desc]);
				},
				(err) => {
					if (args[1]) args[1].apply(null, err);
				},
				arguments[2]
			]);
			return nativeMethod.apply(this, arguments).then((description) => replaceInternalStreamId(this, description));
		} };
		window.RTCPeerConnection.prototype[method] = methodObj[method];
	});
	const origSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;
	window.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
		if (!arguments.length || !arguments[0].type) return origSetLocalDescription.apply(this, arguments);
		arguments[0] = replaceExternalStreamId(this, arguments[0]);
		return origSetLocalDescription.apply(this, arguments);
	};
	const origLocalDescription = Object.getOwnPropertyDescriptor(window.RTCPeerConnection.prototype, "localDescription");
	Object.defineProperty(window.RTCPeerConnection.prototype, "localDescription", { get() {
		const description = origLocalDescription.get.apply(this);
		if (description.type === "") return description;
		return replaceInternalStreamId(this, description);
	} });
	window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
		if (this.signalingState === "closed") throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
		if (!sender._pc) throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
		if (!(sender._pc === this)) throw new DOMException("Sender was not created by this connection.", "InvalidAccessError");
		this._streams = this._streams || {};
		let stream;
		Object.keys(this._streams).forEach((streamid) => {
			if (this._streams[streamid].getTracks().find((track) => sender.track === track)) stream = this._streams[streamid];
		});
		if (stream) {
			if (stream.getTracks().length === 1) this.removeStream(this._reverseStreams[stream.id]);
			else stream.removeTrack(sender.track);
			this.dispatchEvent(new Event("negotiationneeded"));
		}
	};
}
function shimPeerConnection$1(window, browserDetails) {
	if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) window.RTCPeerConnection = window.webkitRTCPeerConnection;
	if (!window.RTCPeerConnection) return;
	if (browserDetails.version < 53) [
		"setLocalDescription",
		"setRemoteDescription",
		"addIceCandidate"
	].forEach(function(method) {
		const nativeMethod = window.RTCPeerConnection.prototype[method];
		const methodObj = { [method]() {
			arguments[0] = new (method === "addIceCandidate" ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
			return nativeMethod.apply(this, arguments);
		} };
		window.RTCPeerConnection.prototype[method] = methodObj[method];
	});
}
function fixNegotiationNeeded(window, browserDetails) {
	if (browserDetails.version > 102) return;
	wrapPeerConnectionEvent(window, "negotiationneeded", (e) => {
		const pc = e.target;
		if (browserDetails.version < 72 || pc.getConfiguration && pc.getConfiguration().sdpSemantics === "plan-b") {
			if (pc.signalingState !== "stable") return;
		}
		return e;
	});
}
//#endregion
//#region node_modules/webrtc-adapter/src/js/firefox/getusermedia.js
function shimGetUserMedia$1(window, browserDetails) {
	const navigator = window && window.navigator;
	const MediaStreamTrack = window && window.MediaStreamTrack;
	navigator.getUserMedia = function(constraints, onSuccess, onError) {
		deprecated("navigator.getUserMedia", "navigator.mediaDevices.getUserMedia");
		navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
	};
	if (!(browserDetails.version > 55 && "autoGainControl" in navigator.mediaDevices.getSupportedConstraints())) {
		const remap = function(obj, a, b) {
			if (a in obj && !(b in obj)) {
				obj[b] = obj[a];
				delete obj[a];
			}
		};
		const nativeGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
		navigator.mediaDevices.getUserMedia = function(c) {
			if (typeof c === "object" && typeof c.audio === "object") {
				c = JSON.parse(JSON.stringify(c));
				remap(c.audio, "autoGainControl", "mozAutoGainControl");
				remap(c.audio, "noiseSuppression", "mozNoiseSuppression");
			}
			return nativeGetUserMedia(c);
		};
		if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
			const nativeGetSettings = MediaStreamTrack.prototype.getSettings;
			MediaStreamTrack.prototype.getSettings = function() {
				const obj = nativeGetSettings.apply(this, arguments);
				remap(obj, "mozAutoGainControl", "autoGainControl");
				remap(obj, "mozNoiseSuppression", "noiseSuppression");
				return obj;
			};
		}
		if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
			const nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
			MediaStreamTrack.prototype.applyConstraints = function(c) {
				if (this.kind === "audio" && typeof c === "object") {
					c = JSON.parse(JSON.stringify(c));
					remap(c, "autoGainControl", "mozAutoGainControl");
					remap(c, "noiseSuppression", "mozNoiseSuppression");
				}
				return nativeApplyConstraints.apply(this, [c]);
			};
		}
	}
}
//#endregion
//#region node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js
function shimGetDisplayMedia(window, preferredMediaSource) {
	if (window.navigator.mediaDevices && "getDisplayMedia" in window.navigator.mediaDevices) return;
	if (!window.navigator.mediaDevices) return;
	window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
		if (!(constraints && constraints.video)) {
			const err = new DOMException("getDisplayMedia without video constraints is undefined");
			err.name = "NotFoundError";
			err.code = 8;
			return Promise.reject(err);
		}
		if (constraints.video === true) constraints.video = { mediaSource: preferredMediaSource };
		else constraints.video.mediaSource = preferredMediaSource;
		return window.navigator.mediaDevices.getUserMedia(constraints);
	};
}
//#endregion
//#region node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js
var firefox_shim_exports = /* @__PURE__ */ __exportAll({
	shimAddTransceiver: () => shimAddTransceiver,
	shimCreateAnswer: () => shimCreateAnswer,
	shimCreateOffer: () => shimCreateOffer,
	shimGetDisplayMedia: () => shimGetDisplayMedia,
	shimGetParameters: () => shimGetParameters,
	shimGetStats: () => shimGetStats,
	shimGetUserMedia: () => shimGetUserMedia$1,
	shimOnTrack: () => shimOnTrack,
	shimPeerConnection: () => shimPeerConnection,
	shimRTCDataChannel: () => shimRTCDataChannel,
	shimReceiverGetStats: () => shimReceiverGetStats,
	shimRemoveStream: () => shimRemoveStream,
	shimSenderGetStats: () => shimSenderGetStats
});
function shimOnTrack(window) {
	if (typeof window === "object" && window.RTCTrackEvent && "receiver" in window.RTCTrackEvent.prototype && !("transceiver" in window.RTCTrackEvent.prototype)) Object.defineProperty(window.RTCTrackEvent.prototype, "transceiver", { get() {
		return { receiver: this.receiver };
	} });
}
function shimPeerConnection(window, browserDetails) {
	if (typeof window !== "object" || !(window.RTCPeerConnection || window.mozRTCPeerConnection)) return;
	if (!window.RTCPeerConnection && window.mozRTCPeerConnection) window.RTCPeerConnection = window.mozRTCPeerConnection;
	if (browserDetails.version < 53) [
		"setLocalDescription",
		"setRemoteDescription",
		"addIceCandidate"
	].forEach(function(method) {
		const nativeMethod = window.RTCPeerConnection.prototype[method];
		const methodObj = { [method]() {
			arguments[0] = new (method === "addIceCandidate" ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
			return nativeMethod.apply(this, arguments);
		} };
		window.RTCPeerConnection.prototype[method] = methodObj[method];
	});
}
function shimGetStats(window, browserDetails) {
	if (typeof window !== "object" || !(window.RTCPeerConnection || window.mozRTCPeerConnection)) return;
	if (browserDetails.version >= 151) return;
	const modernStatsTypes = {
		inboundrtp: "inbound-rtp",
		outboundrtp: "outbound-rtp",
		candidatepair: "candidate-pair",
		localcandidate: "local-candidate",
		remotecandidate: "remote-candidate"
	};
	const nativeGetStats = window.RTCPeerConnection.prototype.getStats;
	window.RTCPeerConnection.prototype.getStats = function getStats() {
		const [selector, onSucc, onErr] = arguments;
		if (this.signalingState === "closed") return Promise.resolve(/* @__PURE__ */ new Map());
		return nativeGetStats.apply(this, [selector || null]).then((stats) => {
			if (browserDetails.version < 53 && !onSucc) try {
				stats.forEach((stat) => {
					stat.type = modernStatsTypes[stat.type] || stat.type;
				});
			} catch (e) {
				if (e.name !== "TypeError") throw e;
				stats.forEach((stat, i) => {
					stats.set(i, Object.assign({}, stat, { type: modernStatsTypes[stat.type] || stat.type }));
				});
			}
			return stats;
		}).then(onSucc, onErr);
	};
}
function shimSenderGetStats(window) {
	if (!(typeof window === "object" && window.RTCPeerConnection && window.RTCRtpSender)) return;
	if (window.RTCRtpSender && "getStats" in window.RTCRtpSender.prototype) return;
	const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
	if (origGetSenders) window.RTCPeerConnection.prototype.getSenders = function getSenders() {
		const senders = origGetSenders.apply(this, []);
		senders.forEach((sender) => sender._pc = this);
		return senders;
	};
	const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
	if (origAddTrack) window.RTCPeerConnection.prototype.addTrack = function addTrack() {
		const sender = origAddTrack.apply(this, arguments);
		sender._pc = this;
		return sender;
	};
	window.RTCRtpSender.prototype.getStats = function getStats() {
		return this.track ? this._pc.getStats(this.track) : Promise.resolve(/* @__PURE__ */ new Map());
	};
}
function shimReceiverGetStats(window) {
	if (!(typeof window === "object" && window.RTCPeerConnection && window.RTCRtpSender)) return;
	if (window.RTCRtpSender && "getStats" in window.RTCRtpReceiver.prototype) return;
	const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
	if (origGetReceivers) window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
		const receivers = origGetReceivers.apply(this, []);
		receivers.forEach((receiver) => receiver._pc = this);
		return receivers;
	};
	wrapPeerConnectionEvent(window, "track", (e) => {
		e.receiver._pc = e.srcElement;
		return e;
	});
	window.RTCRtpReceiver.prototype.getStats = function getStats() {
		return this._pc.getStats(this.track);
	};
}
function shimRemoveStream(window) {
	if (!window.RTCPeerConnection || "removeStream" in window.RTCPeerConnection.prototype) return;
	window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
		deprecated("removeStream", "removeTrack");
		this.getSenders().forEach((sender) => {
			if (sender.track && stream.getTracks().includes(sender.track)) this.removeTrack(sender);
		});
	};
}
function shimRTCDataChannel(window) {
	if (window.DataChannel && !window.RTCDataChannel) window.RTCDataChannel = window.DataChannel;
}
function shimAddTransceiver(window) {
	if (!(typeof window === "object" && window.RTCPeerConnection)) return;
	const origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
	if (origAddTransceiver) window.RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
		this.setParametersPromises = [];
		let sendEncodings = arguments[1] && arguments[1].sendEncodings;
		if (sendEncodings === void 0) sendEncodings = [];
		sendEncodings = [...sendEncodings];
		const shouldPerformCheck = sendEncodings.length > 0;
		if (shouldPerformCheck) sendEncodings.forEach((encodingParam) => {
			if ("rid" in encodingParam) {
				if (!/^[a-z0-9]{0,16}$/i.test(encodingParam.rid)) throw new TypeError("Invalid RID value provided.");
			}
			if ("scaleResolutionDownBy" in encodingParam) {
				if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1)) throw new RangeError("scale_resolution_down_by must be >= 1.0");
			}
			if ("maxFramerate" in encodingParam) {
				if (!(parseFloat(encodingParam.maxFramerate) >= 0)) throw new RangeError("max_framerate must be >= 0.0");
			}
		});
		const transceiver = origAddTransceiver.apply(this, arguments);
		if (shouldPerformCheck) {
			const { sender } = transceiver;
			const params = sender.getParameters();
			if (!("encodings" in params) || params.encodings.length === 1 && Object.keys(params.encodings[0]).length === 0) {
				params.encodings = sendEncodings;
				sender.sendEncodings = sendEncodings;
				this.setParametersPromises.push(sender.setParameters(params).then(() => {
					delete sender.sendEncodings;
				}).catch(() => {
					delete sender.sendEncodings;
				}));
			}
		}
		return transceiver;
	};
}
function shimGetParameters(window) {
	if (!(typeof window === "object" && window.RTCRtpSender)) return;
	const origGetParameters = window.RTCRtpSender.prototype.getParameters;
	if (origGetParameters) window.RTCRtpSender.prototype.getParameters = function getParameters() {
		const params = origGetParameters.apply(this, arguments);
		if (!("encodings" in params)) params.encodings = [].concat(this.sendEncodings || [{}]);
		return params;
	};
}
function shimCreateOffer(window) {
	if (!(typeof window === "object" && window.RTCPeerConnection)) return;
	const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
	window.RTCPeerConnection.prototype.createOffer = function createOffer() {
		if (this.setParametersPromises && this.setParametersPromises.length) return Promise.all(this.setParametersPromises).then(() => {
			return origCreateOffer.apply(this, arguments);
		}).finally(() => {
			this.setParametersPromises = [];
		});
		return origCreateOffer.apply(this, arguments);
	};
}
function shimCreateAnswer(window) {
	if (!(typeof window === "object" && window.RTCPeerConnection)) return;
	const origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
	window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
		if (this.setParametersPromises && this.setParametersPromises.length) return Promise.all(this.setParametersPromises).then(() => {
			return origCreateAnswer.apply(this, arguments);
		}).finally(() => {
			this.setParametersPromises = [];
		});
		return origCreateAnswer.apply(this, arguments);
	};
}
//#endregion
//#region node_modules/webrtc-adapter/src/js/safari/safari_shim.js
var safari_shim_exports = /* @__PURE__ */ __exportAll({
	shimAudioContext: () => shimAudioContext,
	shimCallbacksAPI: () => shimCallbacksAPI,
	shimConstraints: () => shimConstraints,
	shimCreateOfferLegacy: () => shimCreateOfferLegacy,
	shimGetUserMedia: () => shimGetUserMedia,
	shimLocalStreamsAPI: () => shimLocalStreamsAPI,
	shimRTCIceServerUrls: () => shimRTCIceServerUrls,
	shimRemoteStreamsAPI: () => shimRemoteStreamsAPI,
	shimTrackEventTransceiver: () => shimTrackEventTransceiver
});
function shimLocalStreamsAPI(window) {
	if (typeof window !== "object" || !window.RTCPeerConnection) return;
	if (!("getLocalStreams" in window.RTCPeerConnection.prototype)) window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
		if (!this._localStreams) this._localStreams = [];
		return this._localStreams;
	};
	if (!("addStream" in window.RTCPeerConnection.prototype)) {
		const _addTrack = window.RTCPeerConnection.prototype.addTrack;
		window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
			if (!this._localStreams) this._localStreams = [];
			if (!this._localStreams.includes(stream)) this._localStreams.push(stream);
			stream.getAudioTracks().forEach((track) => _addTrack.call(this, track, stream));
			stream.getVideoTracks().forEach((track) => _addTrack.call(this, track, stream));
		};
		window.RTCPeerConnection.prototype.addTrack = function addTrack(track, ...streams) {
			if (streams) streams.forEach((stream) => {
				if (!this._localStreams) this._localStreams = [stream];
				else if (!this._localStreams.includes(stream)) this._localStreams.push(stream);
			});
			return _addTrack.apply(this, arguments);
		};
	}
	if (!("removeStream" in window.RTCPeerConnection.prototype)) window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
		if (!this._localStreams) this._localStreams = [];
		const index = this._localStreams.indexOf(stream);
		if (index === -1) return;
		this._localStreams.splice(index, 1);
		const tracks = stream.getTracks();
		this.getSenders().forEach((sender) => {
			if (tracks.includes(sender.track)) this.removeTrack(sender);
		});
	};
}
function shimRemoteStreamsAPI(window) {
	if (typeof window !== "object" || !window.RTCPeerConnection) return;
	if (!("getRemoteStreams" in window.RTCPeerConnection.prototype)) window.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
		return this._remoteStreams ? this._remoteStreams : [];
	};
	if (!("onaddstream" in window.RTCPeerConnection.prototype)) {
		Object.defineProperty(window.RTCPeerConnection.prototype, "onaddstream", {
			get() {
				return this._onaddstream;
			},
			set(f) {
				if (this._onaddstream) {
					this.removeEventListener("addstream", this._onaddstream);
					this.removeEventListener("track", this._onaddstreampoly);
				}
				this.addEventListener("addstream", this._onaddstream = f);
				this.addEventListener("track", this._onaddstreampoly = (e) => {
					e.streams.forEach((stream) => {
						if (!this._remoteStreams) this._remoteStreams = [];
						if (this._remoteStreams.includes(stream)) return;
						this._remoteStreams.push(stream);
						const event = new Event("addstream");
						event.stream = stream;
						this.dispatchEvent(event);
					});
				});
			}
		});
		const origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
		window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
			const pc = this;
			if (!this._onaddstreampoly) this.addEventListener("track", this._onaddstreampoly = function(e) {
				e.streams.forEach((stream) => {
					if (!pc._remoteStreams) pc._remoteStreams = [];
					if (pc._remoteStreams.indexOf(stream) >= 0) return;
					pc._remoteStreams.push(stream);
					const event = new Event("addstream");
					event.stream = stream;
					pc.dispatchEvent(event);
				});
			});
			return origSetRemoteDescription.apply(pc, arguments);
		};
	}
}
function shimCallbacksAPI(window) {
	if (typeof window !== "object" || !window.RTCPeerConnection) return;
	const prototype = window.RTCPeerConnection.prototype;
	const origCreateOffer = prototype.createOffer;
	const origCreateAnswer = prototype.createAnswer;
	const setLocalDescription = prototype.setLocalDescription;
	const setRemoteDescription = prototype.setRemoteDescription;
	const addIceCandidate = prototype.addIceCandidate;
	prototype.createOffer = function createOffer(successCallback, failureCallback) {
		const options = arguments.length >= 2 ? arguments[2] : arguments[0];
		const promise = origCreateOffer.apply(this, [options]);
		if (!failureCallback) return promise;
		promise.then(successCallback, failureCallback);
		return Promise.resolve();
	};
	prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
		const options = arguments.length >= 2 ? arguments[2] : arguments[0];
		const promise = origCreateAnswer.apply(this, [options]);
		if (!failureCallback) return promise;
		promise.then(successCallback, failureCallback);
		return Promise.resolve();
	};
	let withCallback = function(description, successCallback, failureCallback) {
		const promise = setLocalDescription.apply(this, [description]);
		if (!failureCallback) return promise;
		promise.then(successCallback, failureCallback);
		return Promise.resolve();
	};
	prototype.setLocalDescription = withCallback;
	withCallback = function(description, successCallback, failureCallback) {
		const promise = setRemoteDescription.apply(this, [description]);
		if (!failureCallback) return promise;
		promise.then(successCallback, failureCallback);
		return Promise.resolve();
	};
	prototype.setRemoteDescription = withCallback;
	withCallback = function(candidate, successCallback, failureCallback) {
		const promise = addIceCandidate.apply(this, [candidate]);
		if (!failureCallback) return promise;
		promise.then(successCallback, failureCallback);
		return Promise.resolve();
	};
	prototype.addIceCandidate = withCallback;
}
function shimGetUserMedia(window) {
	const navigator = window && window.navigator;
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		const mediaDevices = navigator.mediaDevices;
		const _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
		navigator.mediaDevices.getUserMedia = (constraints) => {
			return _getUserMedia(shimConstraints(constraints));
		};
	}
	if (!navigator.getUserMedia && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) navigator.getUserMedia = function getUserMedia(constraints, cb, errcb) {
		navigator.mediaDevices.getUserMedia(constraints).then(cb, errcb);
	}.bind(navigator);
}
function shimConstraints(constraints) {
	if (constraints && constraints.video !== void 0) return Object.assign({}, constraints, { video: compactObject(constraints.video) });
	return constraints;
}
function shimRTCIceServerUrls(window) {
	if (!window.RTCPeerConnection) return;
	const OrigPeerConnection = window.RTCPeerConnection;
	window.RTCPeerConnection = function RTCPeerConnection(pcConfig, pcConstraints) {
		if (pcConfig && pcConfig.iceServers) {
			const newIceServers = [];
			for (let i = 0; i < pcConfig.iceServers.length; i++) {
				let server = pcConfig.iceServers[i];
				if (server.urls === void 0 && server.url) {
					deprecated("RTCIceServer.url", "RTCIceServer.urls");
					server = JSON.parse(JSON.stringify(server));
					server.urls = server.url;
					delete server.url;
					newIceServers.push(server);
				} else newIceServers.push(pcConfig.iceServers[i]);
			}
			pcConfig.iceServers = newIceServers;
		}
		return new OrigPeerConnection(pcConfig, pcConstraints);
	};
	window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
	if ("generateCertificate" in OrigPeerConnection) Object.defineProperty(window.RTCPeerConnection, "generateCertificate", { get() {
		return OrigPeerConnection.generateCertificate;
	} });
}
function shimTrackEventTransceiver(window) {
	if (typeof window === "object" && window.RTCTrackEvent && "receiver" in window.RTCTrackEvent.prototype && !("transceiver" in window.RTCTrackEvent.prototype)) Object.defineProperty(window.RTCTrackEvent.prototype, "transceiver", { get() {
		return { receiver: this.receiver };
	} });
}
function shimCreateOfferLegacy(window) {
	const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
	window.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
		if (offerOptions) {
			if (typeof offerOptions.offerToReceiveAudio !== "undefined") offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
			const audioTransceiver = this.getTransceivers().find((transceiver) => transceiver.receiver.track.kind === "audio");
			if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
				if (audioTransceiver.direction === "sendrecv") if (audioTransceiver.setDirection) audioTransceiver.setDirection("sendonly");
				else audioTransceiver.direction = "sendonly";
				else if (audioTransceiver.direction === "recvonly") if (audioTransceiver.setDirection) audioTransceiver.setDirection("inactive");
				else audioTransceiver.direction = "inactive";
			} else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) this.addTransceiver("audio", { direction: "recvonly" });
			if (typeof offerOptions.offerToReceiveVideo !== "undefined") offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
			const videoTransceiver = this.getTransceivers().find((transceiver) => transceiver.receiver.track.kind === "video");
			if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
				if (videoTransceiver.direction === "sendrecv") if (videoTransceiver.setDirection) videoTransceiver.setDirection("sendonly");
				else videoTransceiver.direction = "sendonly";
				else if (videoTransceiver.direction === "recvonly") if (videoTransceiver.setDirection) videoTransceiver.setDirection("inactive");
				else videoTransceiver.direction = "inactive";
			} else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) this.addTransceiver("video", { direction: "recvonly" });
		}
		return origCreateOffer.apply(this, arguments);
	};
}
function shimAudioContext(window) {
	if (typeof window !== "object" || window.AudioContext) return;
	window.AudioContext = window.webkitAudioContext;
}
//#endregion
//#region node_modules/sdp/sdp.js
var require_sdp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SDPUtils = {};
	SDPUtils.generateIdentifier = function() {
		return Math.random().toString(36).substring(2, 12);
	};
	SDPUtils.localCName = SDPUtils.generateIdentifier();
	SDPUtils.splitLines = function(blob) {
		return blob.trim().split("\n").map((line) => line.trim());
	};
	SDPUtils.splitSections = function(blob) {
		return blob.split("\nm=").map((part, index) => (index > 0 ? "m=" + part : part).trim() + "\r\n");
	};
	SDPUtils.getDescription = function(blob) {
		const sections = SDPUtils.splitSections(blob);
		return sections && sections[0];
	};
	SDPUtils.getMediaSections = function(blob) {
		const sections = SDPUtils.splitSections(blob);
		sections.shift();
		return sections;
	};
	SDPUtils.matchPrefix = function(blob, prefix) {
		return SDPUtils.splitLines(blob).filter((line) => line.indexOf(prefix) === 0);
	};
	SDPUtils.parseCandidate = function(line) {
		let parts;
		if (line.indexOf("a=candidate:") === 0) parts = line.substring(12).split(" ");
		else parts = line.substring(10).split(" ");
		const candidate = {
			foundation: parts[0],
			component: {
				1: "rtp",
				2: "rtcp"
			}[parts[1]] || parts[1],
			protocol: parts[2].toLowerCase(),
			priority: parseInt(parts[3], 10),
			ip: parts[4],
			address: parts[4],
			port: parseInt(parts[5], 10),
			type: parts[7]
		};
		for (let i = 8; i < parts.length; i += 2) switch (parts[i]) {
			case "raddr":
				candidate.relatedAddress = parts[i + 1];
				break;
			case "rport":
				candidate.relatedPort = parseInt(parts[i + 1], 10);
				break;
			case "tcptype":
				candidate.tcpType = parts[i + 1];
				break;
			case "ufrag":
				candidate.ufrag = parts[i + 1];
				candidate.usernameFragment = parts[i + 1];
				break;
			default:
				if (candidate[parts[i]] === void 0) candidate[parts[i]] = parts[i + 1];
				break;
		}
		return candidate;
	};
	SDPUtils.writeCandidate = function(candidate) {
		const sdp = [];
		sdp.push(candidate.foundation);
		const component = candidate.component;
		if (component === "rtp") sdp.push(1);
		else if (component === "rtcp") sdp.push(2);
		else sdp.push(component);
		sdp.push(candidate.protocol.toUpperCase());
		sdp.push(candidate.priority);
		sdp.push(candidate.address || candidate.ip);
		sdp.push(candidate.port);
		const type = candidate.type;
		sdp.push("typ");
		sdp.push(type);
		if (type !== "host" && candidate.relatedAddress && candidate.relatedPort !== void 0) {
			sdp.push("raddr");
			sdp.push(candidate.relatedAddress);
			sdp.push("rport");
			sdp.push(candidate.relatedPort);
		}
		if (candidate.tcpType && candidate.protocol.toLowerCase() === "tcp") {
			sdp.push("tcptype");
			sdp.push(candidate.tcpType);
		}
		if (candidate.usernameFragment || candidate.ufrag) {
			sdp.push("ufrag");
			sdp.push(candidate.usernameFragment || candidate.ufrag);
		}
		return "candidate:" + sdp.join(" ");
	};
	SDPUtils.parseIceOptions = function(line) {
		return line.substring(14).split(" ");
	};
	SDPUtils.parseRtpMap = function(line) {
		let parts = line.substring(9).split(" ");
		const parsed = { payloadType: parseInt(parts.shift(), 10) };
		parts = parts[0].split("/");
		parsed.name = parts[0];
		parsed.clockRate = parseInt(parts[1], 10);
		parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
		parsed.numChannels = parsed.channels;
		return parsed;
	};
	SDPUtils.writeRtpMap = function(codec) {
		let pt = codec.payloadType;
		if (codec.preferredPayloadType !== void 0) pt = codec.preferredPayloadType;
		const channels = codec.channels || codec.numChannels || 1;
		return "a=rtpmap:" + pt + " " + codec.name + "/" + codec.clockRate + (channels !== 1 ? "/" + channels : "") + "\r\n";
	};
	SDPUtils.parseExtmap = function(line) {
		const parts = line.substring(9).split(" ");
		return {
			id: parseInt(parts[0], 10),
			direction: parts[0].indexOf("/") > 0 ? parts[0].split("/")[1] : "sendrecv",
			uri: parts[1],
			attributes: parts.slice(2).join(" ")
		};
	};
	SDPUtils.writeExtmap = function(headerExtension) {
		return "a=extmap:" + (headerExtension.id || headerExtension.preferredId) + (headerExtension.direction && headerExtension.direction !== "sendrecv" ? "/" + headerExtension.direction : "") + " " + headerExtension.uri + (headerExtension.attributes ? " " + headerExtension.attributes : "") + "\r\n";
	};
	SDPUtils.parseFmtp = function(line) {
		const parsed = {};
		let kv;
		const parts = line.substring(line.indexOf(" ") + 1).split(";");
		for (let j = 0; j < parts.length; j++) {
			kv = parts[j].trim().split("=");
			parsed[kv[0].trim()] = kv[1];
		}
		return parsed;
	};
	SDPUtils.writeFmtp = function(codec) {
		let line = "";
		let pt = codec.payloadType;
		if (codec.preferredPayloadType !== void 0) pt = codec.preferredPayloadType;
		if (codec.parameters && Object.keys(codec.parameters).length) {
			const params = [];
			Object.keys(codec.parameters).forEach((param) => {
				if (codec.parameters[param] !== void 0) params.push(param + "=" + codec.parameters[param]);
				else params.push(param);
			});
			line += "a=fmtp:" + pt + " " + params.join(";") + "\r\n";
		}
		return line;
	};
	SDPUtils.parseRtcpFb = function(line) {
		const parts = line.substring(line.indexOf(" ") + 1).split(" ");
		return {
			type: parts.shift(),
			parameter: parts.join(" ")
		};
	};
	SDPUtils.writeRtcpFb = function(codec) {
		let lines = "";
		let pt = codec.payloadType;
		if (codec.preferredPayloadType !== void 0) pt = codec.preferredPayloadType;
		if (codec.rtcpFeedback && codec.rtcpFeedback.length) codec.rtcpFeedback.forEach((fb) => {
			lines += "a=rtcp-fb:" + pt + " " + fb.type + (fb.parameter && fb.parameter.length ? " " + fb.parameter : "") + "\r\n";
		});
		return lines;
	};
	SDPUtils.parseSsrcMedia = function(line) {
		const sp = line.indexOf(" ");
		const parts = { ssrc: parseInt(line.substring(7, sp), 10) };
		const colon = line.indexOf(":", sp);
		if (colon > -1) {
			parts.attribute = line.substring(sp + 1, colon);
			parts.value = line.substring(colon + 1);
		} else parts.attribute = line.substring(sp + 1);
		return parts;
	};
	SDPUtils.parseSsrcGroup = function(line) {
		const parts = line.substring(13).split(" ");
		return {
			semantics: parts.shift(),
			ssrcs: parts.map((ssrc) => parseInt(ssrc, 10))
		};
	};
	SDPUtils.getMid = function(mediaSection) {
		const mid = SDPUtils.matchPrefix(mediaSection, "a=mid:")[0];
		if (mid) return mid.substring(6);
	};
	SDPUtils.parseFingerprint = function(line) {
		const parts = line.substring(14).split(" ");
		return {
			algorithm: parts[0].toLowerCase(),
			value: parts[1].toUpperCase()
		};
	};
	SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
		return {
			role: "auto",
			fingerprints: SDPUtils.matchPrefix(mediaSection + sessionpart, "a=fingerprint:").map(SDPUtils.parseFingerprint)
		};
	};
	SDPUtils.writeDtlsParameters = function(params, setupType) {
		let sdp = "a=setup:" + setupType + "\r\n";
		params.fingerprints.forEach((fp) => {
			sdp += "a=fingerprint:" + fp.algorithm + " " + fp.value + "\r\n";
		});
		return sdp;
	};
	SDPUtils.parseCryptoLine = function(line) {
		const parts = line.substring(9).split(" ");
		return {
			tag: parseInt(parts[0], 10),
			cryptoSuite: parts[1],
			keyParams: parts[2],
			sessionParams: parts.slice(3)
		};
	};
	SDPUtils.writeCryptoLine = function(parameters) {
		return "a=crypto:" + parameters.tag + " " + parameters.cryptoSuite + " " + (typeof parameters.keyParams === "object" ? SDPUtils.writeCryptoKeyParams(parameters.keyParams) : parameters.keyParams) + (parameters.sessionParams ? " " + parameters.sessionParams.join(" ") : "") + "\r\n";
	};
	SDPUtils.parseCryptoKeyParams = function(keyParams) {
		if (keyParams.indexOf("inline:") !== 0) return null;
		const parts = keyParams.substring(7).split("|");
		return {
			keyMethod: "inline",
			keySalt: parts[0],
			lifeTime: parts[1],
			mkiValue: parts[2] ? parts[2].split(":")[0] : void 0,
			mkiLength: parts[2] ? parts[2].split(":")[1] : void 0
		};
	};
	SDPUtils.writeCryptoKeyParams = function(keyParams) {
		return keyParams.keyMethod + ":" + keyParams.keySalt + (keyParams.lifeTime ? "|" + keyParams.lifeTime : "") + (keyParams.mkiValue && keyParams.mkiLength ? "|" + keyParams.mkiValue + ":" + keyParams.mkiLength : "");
	};
	SDPUtils.getCryptoParameters = function(mediaSection, sessionpart) {
		return SDPUtils.matchPrefix(mediaSection + sessionpart, "a=crypto:").map(SDPUtils.parseCryptoLine);
	};
	SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
		const ufrag = SDPUtils.matchPrefix(mediaSection + sessionpart, "a=ice-ufrag:")[0];
		const pwd = SDPUtils.matchPrefix(mediaSection + sessionpart, "a=ice-pwd:")[0];
		if (!(ufrag && pwd)) return null;
		return {
			usernameFragment: ufrag.substring(12),
			password: pwd.substring(10)
		};
	};
	SDPUtils.writeIceParameters = function(params) {
		let sdp = "a=ice-ufrag:" + params.usernameFragment + "\r\na=ice-pwd:" + params.password + "\r\n";
		if (params.iceLite) sdp += "a=ice-lite\r\n";
		return sdp;
	};
	SDPUtils.parseRtpParameters = function(mediaSection) {
		const description = {
			codecs: [],
			headerExtensions: [],
			fecMechanisms: [],
			rtcp: []
		};
		const mline = SDPUtils.splitLines(mediaSection)[0].split(" ");
		description.profile = mline[2];
		for (let i = 3; i < mline.length; i++) {
			const pt = mline[i];
			const rtpmapline = SDPUtils.matchPrefix(mediaSection, "a=rtpmap:" + pt + " ")[0];
			if (rtpmapline) {
				const codec = SDPUtils.parseRtpMap(rtpmapline);
				const fmtps = SDPUtils.matchPrefix(mediaSection, "a=fmtp:" + pt + " ");
				codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
				codec.rtcpFeedback = SDPUtils.matchPrefix(mediaSection, "a=rtcp-fb:" + pt + " ").map(SDPUtils.parseRtcpFb);
				description.codecs.push(codec);
				switch (codec.name.toUpperCase()) {
					case "RED":
					case "ULPFEC":
						description.fecMechanisms.push(codec.name.toUpperCase());
						break;
					default: break;
				}
			}
		}
		SDPUtils.matchPrefix(mediaSection, "a=extmap:").forEach((line) => {
			description.headerExtensions.push(SDPUtils.parseExtmap(line));
		});
		const wildcardRtcpFb = SDPUtils.matchPrefix(mediaSection, "a=rtcp-fb:* ").map(SDPUtils.parseRtcpFb);
		description.codecs.forEach((codec) => {
			wildcardRtcpFb.forEach((fb) => {
				if (!codec.rtcpFeedback.find((existingFeedback) => {
					return existingFeedback.type === fb.type && existingFeedback.parameter === fb.parameter;
				})) codec.rtcpFeedback.push(fb);
			});
		});
		return description;
	};
	SDPUtils.writeRtpDescription = function(kind, caps) {
		let sdp = "";
		sdp += "m=" + kind + " ";
		sdp += caps.codecs.length > 0 ? "9" : "0";
		sdp += " " + (caps.profile || "UDP/TLS/RTP/SAVPF") + " ";
		sdp += caps.codecs.map((codec) => {
			if (codec.preferredPayloadType !== void 0) return codec.preferredPayloadType;
			return codec.payloadType;
		}).join(" ") + "\r\n";
		sdp += "c=IN IP4 0.0.0.0\r\n";
		sdp += "a=rtcp:9 IN IP4 0.0.0.0\r\n";
		caps.codecs.forEach((codec) => {
			sdp += SDPUtils.writeRtpMap(codec);
			sdp += SDPUtils.writeFmtp(codec);
			sdp += SDPUtils.writeRtcpFb(codec);
		});
		let maxptime = 0;
		caps.codecs.forEach((codec) => {
			if (codec.maxptime > maxptime) maxptime = codec.maxptime;
		});
		if (maxptime > 0) sdp += "a=maxptime:" + maxptime + "\r\n";
		if (caps.headerExtensions) caps.headerExtensions.forEach((extension) => {
			sdp += SDPUtils.writeExtmap(extension);
		});
		return sdp;
	};
	SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
		const encodingParameters = [];
		const description = SDPUtils.parseRtpParameters(mediaSection);
		const hasRed = description.fecMechanisms.indexOf("RED") !== -1;
		const hasUlpfec = description.fecMechanisms.indexOf("ULPFEC") !== -1;
		const ssrcs = SDPUtils.matchPrefix(mediaSection, "a=ssrc:").map((line) => SDPUtils.parseSsrcMedia(line)).filter((parts) => parts.attribute === "cname");
		const primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
		let secondarySsrc;
		const flows = SDPUtils.matchPrefix(mediaSection, "a=ssrc-group:FID").map((line) => {
			return line.substring(17).split(" ").map((part) => parseInt(part, 10));
		});
		if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) secondarySsrc = flows[0][1];
		description.codecs.forEach((codec) => {
			if (codec.name.toUpperCase() === "RTX" && codec.parameters.apt) {
				let encParam = {
					ssrc: primarySsrc,
					codecPayloadType: parseInt(codec.parameters.apt, 10)
				};
				if (primarySsrc && secondarySsrc) encParam.rtx = { ssrc: secondarySsrc };
				encodingParameters.push(encParam);
				if (hasRed) {
					encParam = JSON.parse(JSON.stringify(encParam));
					encParam.fec = {
						ssrc: primarySsrc,
						mechanism: hasUlpfec ? "red+ulpfec" : "red"
					};
					encodingParameters.push(encParam);
				}
			}
		});
		if (encodingParameters.length === 0 && primarySsrc) encodingParameters.push({ ssrc: primarySsrc });
		let bandwidth = SDPUtils.matchPrefix(mediaSection, "b=");
		if (bandwidth.length) {
			if (bandwidth[0].indexOf("b=TIAS:") === 0) bandwidth = parseInt(bandwidth[0].substring(7), 10);
			else if (bandwidth[0].indexOf("b=AS:") === 0) bandwidth = parseInt(bandwidth[0].substring(5), 10) * 1e3 * .95 - 2e3 * 8;
			else bandwidth = void 0;
			encodingParameters.forEach((params) => {
				params.maxBitrate = bandwidth;
			});
		}
		return encodingParameters;
	};
	SDPUtils.parseRtcpParameters = function(mediaSection) {
		const rtcpParameters = {};
		const remoteSsrc = SDPUtils.matchPrefix(mediaSection, "a=ssrc:").map((line) => SDPUtils.parseSsrcMedia(line)).filter((obj) => obj.attribute === "cname")[0];
		if (remoteSsrc) {
			rtcpParameters.cname = remoteSsrc.value;
			rtcpParameters.ssrc = remoteSsrc.ssrc;
		}
		const rsize = SDPUtils.matchPrefix(mediaSection, "a=rtcp-rsize");
		rtcpParameters.reducedSize = rsize.length > 0;
		rtcpParameters.compound = rsize.length === 0;
		rtcpParameters.mux = SDPUtils.matchPrefix(mediaSection, "a=rtcp-mux").length > 0;
		return rtcpParameters;
	};
	SDPUtils.writeRtcpParameters = function(rtcpParameters) {
		let sdp = "";
		if (rtcpParameters.reducedSize) sdp += "a=rtcp-rsize\r\n";
		if (rtcpParameters.mux) sdp += "a=rtcp-mux\r\n";
		if (rtcpParameters.ssrc !== void 0 && rtcpParameters.cname) sdp += "a=ssrc:" + rtcpParameters.ssrc + " cname:" + rtcpParameters.cname + "\r\n";
		return sdp;
	};
	SDPUtils.parseMsid = function(mediaSection) {
		let parts;
		const spec = SDPUtils.matchPrefix(mediaSection, "a=msid:");
		if (spec.length === 1) {
			parts = spec[0].substring(7).split(" ");
			return {
				stream: parts[0],
				track: parts[1]
			};
		}
		const planB = SDPUtils.matchPrefix(mediaSection, "a=ssrc:").map((line) => SDPUtils.parseSsrcMedia(line)).filter((msidParts) => msidParts.attribute === "msid");
		if (planB.length > 0) {
			parts = planB[0].value.split(" ");
			return {
				stream: parts[0],
				track: parts[1]
			};
		}
	};
	SDPUtils.parseSctpDescription = function(mediaSection) {
		const mline = SDPUtils.parseMLine(mediaSection);
		const maxSizeLine = SDPUtils.matchPrefix(mediaSection, "a=max-message-size:");
		let maxMessageSize;
		if (maxSizeLine.length > 0) maxMessageSize = parseInt(maxSizeLine[0].substring(19), 10);
		if (isNaN(maxMessageSize)) maxMessageSize = 65536;
		const sctpPort = SDPUtils.matchPrefix(mediaSection, "a=sctp-port:");
		if (sctpPort.length > 0) return {
			port: parseInt(sctpPort[0].substring(12), 10),
			protocol: mline.fmt,
			maxMessageSize
		};
		const sctpMapLines = SDPUtils.matchPrefix(mediaSection, "a=sctpmap:");
		if (sctpMapLines.length > 0) {
			const parts = sctpMapLines[0].substring(10).split(" ");
			return {
				port: parseInt(parts[0], 10),
				protocol: parts[1],
				maxMessageSize
			};
		}
	};
	SDPUtils.writeSctpDescription = function(media, sctp) {
		let output = [];
		if (media.protocol !== "DTLS/SCTP") output = [
			"m=" + media.kind + " 9 " + media.protocol + " " + sctp.protocol + "\r\n",
			"c=IN IP4 0.0.0.0\r\n",
			"a=sctp-port:" + sctp.port + "\r\n"
		];
		else output = [
			"m=" + media.kind + " 9 " + media.protocol + " " + sctp.port + "\r\n",
			"c=IN IP4 0.0.0.0\r\n",
			"a=sctpmap:" + sctp.port + " " + sctp.protocol + " 65535\r\n"
		];
		if (sctp.maxMessageSize !== void 0) output.push("a=max-message-size:" + sctp.maxMessageSize + "\r\n");
		return output.join("");
	};
	SDPUtils.generateSessionId = function() {
		return Math.random().toString().substr(2, 22);
	};
	SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
		let sessionId;
		const version = sessVer !== void 0 ? sessVer : 2;
		if (sessId) sessionId = sessId;
		else sessionId = SDPUtils.generateSessionId();
		return "v=0\r\no=" + (sessUser || "thisisadapterortc") + " " + sessionId + " " + version + " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n";
	};
	SDPUtils.getDirection = function(mediaSection, sessionpart) {
		const lines = SDPUtils.splitLines(mediaSection);
		for (let i = 0; i < lines.length; i++) switch (lines[i]) {
			case "a=sendrecv":
			case "a=sendonly":
			case "a=recvonly":
			case "a=inactive": return lines[i].substring(2);
			default:
		}
		if (sessionpart) return SDPUtils.getDirection(sessionpart);
		return "sendrecv";
	};
	SDPUtils.getKind = function(mediaSection) {
		return SDPUtils.splitLines(mediaSection)[0].split(" ")[0].substring(2);
	};
	SDPUtils.isRejected = function(mediaSection) {
		return mediaSection.split(" ", 2)[1] === "0";
	};
	SDPUtils.parseMLine = function(mediaSection) {
		const parts = SDPUtils.splitLines(mediaSection)[0].substring(2).split(" ");
		return {
			kind: parts[0],
			port: parseInt(parts[1], 10),
			protocol: parts[2],
			fmt: parts.slice(3).join(" ")
		};
	};
	SDPUtils.parseOLine = function(mediaSection) {
		const parts = SDPUtils.matchPrefix(mediaSection, "o=")[0].substring(2).split(" ");
		return {
			username: parts[0],
			sessionId: parts[1],
			sessionVersion: parseInt(parts[2], 10),
			netType: parts[3],
			addressType: parts[4],
			address: parts[5]
		};
	};
	SDPUtils.isValidSDP = function(blob) {
		if (typeof blob !== "string" || blob.length === 0) return false;
		const lines = SDPUtils.splitLines(blob);
		for (let i = 0; i < lines.length; i++) if (lines[i].length < 2 || lines[i].charAt(1) !== "=") return false;
		return true;
	};
	if (typeof module === "object") module.exports = SDPUtils;
}));
//#endregion
//#region node_modules/webrtc-adapter/src/js/common_shim.js
var common_shim_exports = /* @__PURE__ */ __exportAll({
	removeExtmapAllowMixed: () => removeExtmapAllowMixed,
	shimAddIceCandidateNullOrEmpty: () => shimAddIceCandidateNullOrEmpty,
	shimConnectionState: () => shimConnectionState,
	shimMaxMessageSize: () => shimMaxMessageSize,
	shimParameterlessSetLocalDescription: () => shimParameterlessSetLocalDescription,
	shimRTCIceCandidate: () => shimRTCIceCandidate,
	shimRTCIceCandidateRelayProtocol: () => shimRTCIceCandidateRelayProtocol,
	shimSendThrowTypeError: () => shimSendThrowTypeError
});
var import_sdp = /* @__PURE__ */ __toESM(require_sdp());
function shimRTCIceCandidate(window) {
	if (!window.RTCIceCandidate || window.RTCIceCandidate && "foundation" in window.RTCIceCandidate.prototype) return;
	const NativeRTCIceCandidate = window.RTCIceCandidate;
	window.RTCIceCandidate = function RTCIceCandidate(args) {
		if (typeof args === "object" && args.candidate && args.candidate.indexOf("a=") === 0) {
			args = JSON.parse(JSON.stringify(args));
			args.candidate = args.candidate.substring(2);
		}
		if (args.candidate && args.candidate.length) {
			const nativeCandidate = new NativeRTCIceCandidate(args);
			const parsedCandidate = import_sdp.default.parseCandidate(args.candidate);
			for (const key in parsedCandidate) if (!(key in nativeCandidate)) Object.defineProperty(nativeCandidate, key, { value: parsedCandidate[key] });
			nativeCandidate.toJSON = function toJSON() {
				return {
					candidate: nativeCandidate.candidate,
					sdpMid: nativeCandidate.sdpMid,
					sdpMLineIndex: nativeCandidate.sdpMLineIndex,
					usernameFragment: nativeCandidate.usernameFragment
				};
			};
			return nativeCandidate;
		}
		return new NativeRTCIceCandidate(args);
	};
	window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;
	wrapPeerConnectionEvent(window, "icecandidate", (e) => {
		if (e.candidate) Object.defineProperty(e, "candidate", {
			value: new window.RTCIceCandidate(e.candidate),
			writable: "false"
		});
		return e;
	});
}
function shimRTCIceCandidateRelayProtocol(window) {
	if (!window.RTCIceCandidate || window.RTCIceCandidate && "relayProtocol" in window.RTCIceCandidate.prototype) return;
	wrapPeerConnectionEvent(window, "icecandidate", (e) => {
		if (e.candidate) {
			const parsedCandidate = import_sdp.default.parseCandidate(e.candidate.candidate);
			if (parsedCandidate.type === "relay") e.candidate.relayProtocol = {
				0: "tls",
				1: "tcp",
				2: "udp"
			}[parsedCandidate.priority >> 24];
		}
		return e;
	});
}
function shimMaxMessageSize(window, browserDetails) {
	if (!window.RTCPeerConnection) return;
	if (!("sctp" in window.RTCPeerConnection.prototype)) Object.defineProperty(window.RTCPeerConnection.prototype, "sctp", { get() {
		return typeof this._sctp === "undefined" ? null : this._sctp;
	} });
	const sctpInDescription = function(description) {
		if (!description || !description.sdp) return false;
		const sections = import_sdp.default.splitSections(description.sdp);
		sections.shift();
		return sections.some((mediaSection) => {
			const mLine = import_sdp.default.parseMLine(mediaSection);
			return mLine && mLine.kind === "application" && mLine.protocol.indexOf("SCTP") !== -1;
		});
	};
	const getRemoteFirefoxVersion = function(description) {
		const match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
		if (match === null || match.length < 2) return -1;
		const version = parseInt(match[1], 10);
		return version !== version ? -1 : version;
	};
	const getCanSendMaxMessageSize = function(remoteIsFirefox) {
		let canSendMaxMessageSize = 65536;
		if (browserDetails.browser === "firefox") if (browserDetails.version < 57) if (remoteIsFirefox === -1) canSendMaxMessageSize = 16384;
		else canSendMaxMessageSize = 2147483637;
		else if (browserDetails.version < 60) canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
		else canSendMaxMessageSize = 2147483637;
		return canSendMaxMessageSize;
	};
	const getMaxMessageSize = function(description, remoteIsFirefox) {
		let maxMessageSize = 65536;
		if (browserDetails.browser === "firefox" && browserDetails.version === 57) maxMessageSize = 65535;
		const match = import_sdp.default.matchPrefix(description.sdp, "a=max-message-size:");
		if (match.length > 0) maxMessageSize = parseInt(match[0].substring(19), 10);
		else if (browserDetails.browser === "firefox" && remoteIsFirefox !== -1) maxMessageSize = 2147483637;
		return maxMessageSize;
	};
	const origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
	window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
		this._sctp = null;
		if (browserDetails.browser === "chrome" && browserDetails.version >= 76) {
			const { sdpSemantics } = this.getConfiguration();
			if (sdpSemantics === "plan-b") Object.defineProperty(this, "sctp", {
				get() {
					return typeof this._sctp === "undefined" ? null : this._sctp;
				},
				enumerable: true,
				configurable: true
			});
		}
		if (sctpInDescription(arguments[0])) {
			const isFirefox = getRemoteFirefoxVersion(arguments[0]);
			const canSendMMS = getCanSendMaxMessageSize(isFirefox);
			const remoteMMS = getMaxMessageSize(arguments[0], isFirefox);
			let maxMessageSize;
			if (canSendMMS === 0 && remoteMMS === 0) maxMessageSize = Number.POSITIVE_INFINITY;
			else if (canSendMMS === 0 || remoteMMS === 0) maxMessageSize = Math.max(canSendMMS, remoteMMS);
			else maxMessageSize = Math.min(canSendMMS, remoteMMS);
			const sctp = {};
			Object.defineProperty(sctp, "maxMessageSize", { get() {
				return maxMessageSize;
			} });
			this._sctp = sctp;
		}
		return origSetRemoteDescription.apply(this, arguments);
	};
}
function shimSendThrowTypeError(window, browserDetails) {
	if (!(window.RTCPeerConnection && "createDataChannel" in window.RTCPeerConnection.prototype)) return;
	if (browserDetails.browser === "chrome" && browserDetails.version > 149) return;
	if (browserDetails.browser === "firefox" && browserDetails.version > 60) return;
	function wrapDcSend(dc, pc) {
		const origDataChannelSend = dc.send;
		dc.send = function send() {
			const data = arguments[0];
			const length = data.length || data.size || data.byteLength;
			if (dc.readyState === "open" && pc.sctp && length > pc.sctp.maxMessageSize) throw new TypeError("Message too large (can send a maximum of " + pc.sctp.maxMessageSize + " bytes)");
			return origDataChannelSend.apply(dc, arguments);
		};
	}
	const origCreateDataChannel = window.RTCPeerConnection.prototype.createDataChannel;
	window.RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
		const dataChannel = origCreateDataChannel.apply(this, arguments);
		wrapDcSend(dataChannel, this);
		return dataChannel;
	};
	wrapPeerConnectionEvent(window, "datachannel", (e) => {
		wrapDcSend(e.channel, e.target);
		return e;
	});
}
function shimConnectionState(window) {
	if (!window.RTCPeerConnection || "connectionState" in window.RTCPeerConnection.prototype) return;
	const proto = window.RTCPeerConnection.prototype;
	Object.defineProperty(proto, "connectionState", {
		get() {
			return {
				completed: "connected",
				checking: "connecting"
			}[this.iceConnectionState] || this.iceConnectionState;
		},
		enumerable: true,
		configurable: true
	});
	Object.defineProperty(proto, "onconnectionstatechange", {
		get() {
			return this._onconnectionstatechange || null;
		},
		set(cb) {
			if (this._onconnectionstatechange) {
				this.removeEventListener("connectionstatechange", this._onconnectionstatechange);
				delete this._onconnectionstatechange;
			}
			if (cb) this.addEventListener("connectionstatechange", this._onconnectionstatechange = cb);
		},
		enumerable: true,
		configurable: true
	});
	["setLocalDescription", "setRemoteDescription"].forEach((method) => {
		const origMethod = proto[method];
		proto[method] = function() {
			if (!this._connectionstatechangepoly) {
				this._connectionstatechangepoly = (e) => {
					const pc = e.target;
					if (pc._lastConnectionState !== pc.connectionState) {
						pc._lastConnectionState = pc.connectionState;
						const newEvent = new Event("connectionstatechange", e);
						pc.dispatchEvent(newEvent);
					}
					return e;
				};
				this.addEventListener("iceconnectionstatechange", this._connectionstatechangepoly);
			}
			return origMethod.apply(this, arguments);
		};
	});
}
function removeExtmapAllowMixed(window, browserDetails) {
	if (!window.RTCPeerConnection) return;
	if (browserDetails.browser === "chrome" && browserDetails.version >= 71) return;
	if (browserDetails.browser === "safari" && browserDetails._safariVersion >= 13.1) return;
	const nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
	window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(desc) {
		if (desc && desc.sdp && desc.sdp.indexOf("\na=extmap-allow-mixed") !== -1) {
			const sdp = desc.sdp.split("\n").filter((line) => {
				return line.trim() !== "a=extmap-allow-mixed";
			}).join("\n");
			if (window.RTCSessionDescription && desc instanceof window.RTCSessionDescription) arguments[0] = new window.RTCSessionDescription({
				type: desc.type,
				sdp
			});
			else desc.sdp = sdp;
		}
		return nativeSRD.apply(this, arguments);
	};
}
function shimAddIceCandidateNullOrEmpty(window, browserDetails) {
	if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) return;
	const nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;
	if (!nativeAddIceCandidate || nativeAddIceCandidate.length === 0) return;
	window.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
		if (!arguments[0]) {
			if (arguments[1]) arguments[1].apply(null);
			return Promise.resolve();
		}
		if ((browserDetails.browser === "chrome" && browserDetails.version < 78 || browserDetails.browser === "firefox" && browserDetails.version < 68 || browserDetails.browser === "safari") && arguments[0] && arguments[0].candidate === "") return Promise.resolve();
		return nativeAddIceCandidate.apply(this, arguments);
	};
}
function shimParameterlessSetLocalDescription(window, browserDetails) {
	if (!(window.RTCPeerConnection && window.RTCPeerConnection.prototype)) return;
	const nativeSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;
	if (!nativeSetLocalDescription || nativeSetLocalDescription.length === 0) return;
	window.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
		let desc = arguments[0] || {};
		if (typeof desc !== "object" || desc.type && desc.sdp) return nativeSetLocalDescription.apply(this, arguments);
		desc = {
			type: desc.type,
			sdp: desc.sdp
		};
		if (!desc.type) switch (this.signalingState) {
			case "stable":
			case "have-local-offer":
			case "have-remote-pranswer":
				desc.type = "offer";
				break;
			default:
				desc.type = "answer";
				break;
		}
		if (desc.sdp || desc.type !== "offer" && desc.type !== "answer") return nativeSetLocalDescription.apply(this, [desc]);
		return (desc.type === "offer" ? this.createOffer : this.createAnswer).apply(this).then((d) => nativeSetLocalDescription.apply(this, [d]));
	};
}
//#endregion
//#region node_modules/webrtc-adapter/src/js/adapter_factory.js
function adapterFactory({ window } = {}, options = {
	shimChrome: true,
	shimFirefox: true,
	shimSafari: true
}) {
	const logging = log;
	const browserDetails = detectBrowser(window);
	const adapter = {
		browserDetails,
		commonShim: common_shim_exports,
		extractVersion,
		disableLog,
		disableWarnings,
		sdp: import_sdp
	};
	switch (browserDetails.browser) {
		case "chrome":
			if (!chrome_shim_exports || !shimPeerConnection$1 || !options.shimChrome) {
				logging("Chrome shim is not included in this adapter release.");
				return adapter;
			}
			if (browserDetails.version === null) {
				logging("Chrome shim can not determine version, not shimming.");
				return adapter;
			}
			logging("adapter.js shimming chrome.");
			adapter.browserShim = chrome_shim_exports;
			shimAddIceCandidateNullOrEmpty(window, browserDetails);
			shimParameterlessSetLocalDescription(window, browserDetails);
			shimGetUserMedia$2(window, browserDetails);
			shimMediaStream(window, browserDetails);
			shimPeerConnection$1(window, browserDetails);
			shimOnTrack$1(window, browserDetails);
			shimAddTrackRemoveTrack(window, browserDetails);
			shimGetSendersWithDtmf(window, browserDetails);
			shimSenderReceiverGetStats(window, browserDetails);
			fixNegotiationNeeded(window, browserDetails);
			shimRTCIceCandidate(window, browserDetails);
			shimRTCIceCandidateRelayProtocol(window, browserDetails);
			shimConnectionState(window, browserDetails);
			shimMaxMessageSize(window, browserDetails);
			shimSendThrowTypeError(window, browserDetails);
			removeExtmapAllowMixed(window, browserDetails);
			break;
		case "firefox":
			if (!firefox_shim_exports || !shimPeerConnection || !options.shimFirefox) {
				logging("Firefox shim is not included in this adapter release.");
				return adapter;
			}
			logging("adapter.js shimming firefox.");
			adapter.browserShim = firefox_shim_exports;
			shimAddIceCandidateNullOrEmpty(window, browserDetails);
			shimParameterlessSetLocalDescription(window, browserDetails);
			shimGetUserMedia$1(window, browserDetails);
			shimPeerConnection(window, browserDetails);
			shimGetStats(window, browserDetails);
			shimOnTrack(window, browserDetails);
			shimRemoveStream(window, browserDetails);
			shimSenderGetStats(window, browserDetails);
			shimReceiverGetStats(window, browserDetails);
			shimRTCDataChannel(window, browserDetails);
			shimAddTransceiver(window, browserDetails);
			shimGetParameters(window, browserDetails);
			shimCreateOffer(window, browserDetails);
			shimCreateAnswer(window, browserDetails);
			shimRTCIceCandidate(window, browserDetails);
			shimConnectionState(window, browserDetails);
			shimMaxMessageSize(window, browserDetails);
			shimSendThrowTypeError(window, browserDetails);
			break;
		case "safari":
			if (!safari_shim_exports || !options.shimSafari) {
				logging("Safari shim is not included in this adapter release.");
				return adapter;
			}
			logging("adapter.js shimming safari.");
			adapter.browserShim = safari_shim_exports;
			shimAddIceCandidateNullOrEmpty(window, browserDetails);
			shimParameterlessSetLocalDescription(window, browserDetails);
			shimRTCIceServerUrls(window, browserDetails);
			shimCreateOfferLegacy(window, browserDetails);
			shimCallbacksAPI(window, browserDetails);
			shimLocalStreamsAPI(window, browserDetails);
			shimRemoteStreamsAPI(window, browserDetails);
			shimTrackEventTransceiver(window, browserDetails);
			shimGetUserMedia(window, browserDetails);
			shimAudioContext(window, browserDetails);
			shimRTCIceCandidate(window, browserDetails);
			shimRTCIceCandidateRelayProtocol(window, browserDetails);
			shimMaxMessageSize(window, browserDetails);
			shimSendThrowTypeError(window, browserDetails);
			removeExtmapAllowMixed(window, browserDetails);
			break;
		default:
			logging("Unsupported browser!");
			break;
	}
	return adapter;
}
//#endregion
//#region node_modules/webrtc-adapter/src/js/adapter_core.js
var adapter = adapterFactory({ window: typeof window === "undefined" ? void 0 : window });
//#endregion
//#region node_modules/peerjs/dist/bundler.mjs
function $parcel$export(e, n, v, s) {
	Object.defineProperty(e, n, {
		get: v,
		set: s,
		enumerable: true,
		configurable: true
	});
}
var $fcbcc7538a6776d5$export$f1c5f4c9cb95390b = class {
	constructor() {
		this.chunkedMTU = 16300;
		this._dataCount = 1;
		this.chunk = (blob) => {
			const chunks = [];
			const size = blob.byteLength;
			const total = Math.ceil(size / this.chunkedMTU);
			let index = 0;
			let start = 0;
			while (start < size) {
				const end = Math.min(size, start + this.chunkedMTU);
				const b = blob.slice(start, end);
				const chunk = {
					__peerData: this._dataCount,
					n: index,
					data: b,
					total
				};
				chunks.push(chunk);
				start = end;
				index++;
			}
			this._dataCount++;
			return chunks;
		};
	}
};
function $fcbcc7538a6776d5$export$52c89ebcdc4f53f2(bufs) {
	let size = 0;
	for (const buf of bufs) size += buf.byteLength;
	const result = new Uint8Array(size);
	let offset = 0;
	for (const buf of bufs) {
		result.set(buf, offset);
		offset += buf.byteLength;
	}
	return result;
}
var $fb63e766cfafaab9$var$webRTCAdapter = adapter.default || adapter;
var $fb63e766cfafaab9$export$25be9502477c137d = new class {
	isWebRTCSupported() {
		return typeof RTCPeerConnection !== "undefined";
	}
	isBrowserSupported() {
		const browser = this.getBrowser();
		const version = this.getVersion();
		if (!this.supportedBrowsers.includes(browser)) return false;
		if (browser === "chrome") return version >= this.minChromeVersion;
		if (browser === "firefox") return version >= this.minFirefoxVersion;
		if (browser === "safari") return !this.isIOS && version >= this.minSafariVersion;
		return false;
	}
	getBrowser() {
		return $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.browser;
	}
	getVersion() {
		return $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.version || 0;
	}
	isUnifiedPlanSupported() {
		const browser = this.getBrowser();
		const version = $fb63e766cfafaab9$var$webRTCAdapter.browserDetails.version || 0;
		if (browser === "chrome" && version < this.minChromeVersion) return false;
		if (browser === "firefox" && version >= this.minFirefoxVersion) return true;
		if (!window.RTCRtpTransceiver || !("currentDirection" in RTCRtpTransceiver.prototype)) return false;
		let tempPc;
		let supported = false;
		try {
			tempPc = new RTCPeerConnection();
			tempPc.addTransceiver("audio");
			supported = true;
		} catch (e) {} finally {
			if (tempPc) tempPc.close();
		}
		return supported;
	}
	toString() {
		return `Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`;
	}
	constructor() {
		this.isIOS = typeof navigator !== "undefined" ? [
			"iPad",
			"iPhone",
			"iPod"
		].includes(navigator.platform) : false;
		this.supportedBrowsers = [
			"firefox",
			"chrome",
			"safari"
		];
		this.minFirefoxVersion = 59;
		this.minChromeVersion = 72;
		this.minSafariVersion = 605;
	}
}();
var $9a84a32bf0bf36bb$export$f35f128fd59ea256 = (id) => {
	return !id || /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(id);
};
var $0e5fd1585784c252$export$4e61f672936bec77 = () => Math.random().toString(36).slice(2);
var $4f4134156c446392$var$DEFAULT_CONFIG = {
	iceServers: [{ urls: "stun:stun.l.google.com:19302" }, {
		urls: ["turn:eu-0.turn.peerjs.com:3478", "turn:us-0.turn.peerjs.com:3478"],
		username: "peerjs",
		credential: "peerjsp"
	}],
	sdpSemantics: "unified-plan"
};
var $4f4134156c446392$export$f8f26dd395d7e1bd = class extends $fcbcc7538a6776d5$export$f1c5f4c9cb95390b {
	noop() {}
	blobToArrayBuffer(blob, cb) {
		const fr = new FileReader();
		fr.onload = function(evt) {
			if (evt.target) cb(evt.target.result);
		};
		fr.readAsArrayBuffer(blob);
		return fr;
	}
	binaryStringToArrayBuffer(binary) {
		const byteArray = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) byteArray[i] = binary.charCodeAt(i) & 255;
		return byteArray.buffer;
	}
	isSecure() {
		return location.protocol === "https:";
	}
	constructor(...args) {
		super(...args), this.CLOUD_HOST = "0.peerjs.com", this.CLOUD_PORT = 443, this.chunkedBrowsers = {
			Chrome: 1,
			chrome: 1
		}, this.defaultConfig = $4f4134156c446392$var$DEFAULT_CONFIG, this.browser = $fb63e766cfafaab9$export$25be9502477c137d.getBrowser(), this.browserVersion = $fb63e766cfafaab9$export$25be9502477c137d.getVersion(), this.pack = $0cfd7828ad59115f$export$2a703dbb0cb35339, this.unpack = $0cfd7828ad59115f$export$417857010dc9287f, this.supports = function() {
			const supported = {
				browser: $fb63e766cfafaab9$export$25be9502477c137d.isBrowserSupported(),
				webRTC: $fb63e766cfafaab9$export$25be9502477c137d.isWebRTCSupported(),
				audioVideo: false,
				data: false,
				binaryBlob: false,
				reliable: false
			};
			if (!supported.webRTC) return supported;
			let pc;
			try {
				pc = new RTCPeerConnection($4f4134156c446392$var$DEFAULT_CONFIG);
				supported.audioVideo = true;
				let dc;
				try {
					dc = pc.createDataChannel("_PEERJSTEST", { ordered: true });
					supported.data = true;
					supported.reliable = !!dc.ordered;
					try {
						dc.binaryType = "blob";
						supported.binaryBlob = !$fb63e766cfafaab9$export$25be9502477c137d.isIOS;
					} catch (e) {}
				} catch (e) {} finally {
					if (dc) dc.close();
				}
			} catch (e) {} finally {
				if (pc) pc.close();
			}
			return supported;
		}(), this.validateId = $9a84a32bf0bf36bb$export$f35f128fd59ea256, this.randomToken = $0e5fd1585784c252$export$4e61f672936bec77;
	}
};
var $4f4134156c446392$export$7debb50ef11d5e0b = new $4f4134156c446392$export$f8f26dd395d7e1bd();
var $257947e92926277a$var$LOG_PREFIX = "PeerJS: ";
var $257947e92926277a$var$Logger = class {
	get logLevel() {
		return this._logLevel;
	}
	set logLevel(logLevel) {
		this._logLevel = logLevel;
	}
	log(...args) {
		if (this._logLevel >= 3) this._print(3, ...args);
	}
	warn(...args) {
		if (this._logLevel >= 2) this._print(2, ...args);
	}
	error(...args) {
		if (this._logLevel >= 1) this._print(1, ...args);
	}
	setLogFunction(fn) {
		this._print = fn;
	}
	_print(logLevel, ...rest) {
		const copy = [$257947e92926277a$var$LOG_PREFIX, ...rest];
		for (const i in copy) if (copy[i] instanceof Error) copy[i] = "(" + copy[i].name + ") " + copy[i].message;
		if (logLevel >= 3) console.log(...copy);
		else if (logLevel >= 2) console.warn("WARNING", ...copy);
		else if (logLevel >= 1) console.error("ERROR", ...copy);
	}
	constructor() {
		this._logLevel = 0;
	}
};
var $257947e92926277a$export$2e2bcd8739ae039 = new $257947e92926277a$var$Logger();
var $c4dcfd1d1ea86647$exports = {};
var $c4dcfd1d1ea86647$var$has = Object.prototype.hasOwnProperty, $c4dcfd1d1ea86647$var$prefix = "~";
/**
* Constructor to create a storage for our `EE` objects.
* An `Events` instance is a plain object whose properties are event names.
*
* @constructor
* @private
*/ function $c4dcfd1d1ea86647$var$Events() {}
if (Object.create) {
	$c4dcfd1d1ea86647$var$Events.prototype = Object.create(null);
	if (!new $c4dcfd1d1ea86647$var$Events().__proto__) $c4dcfd1d1ea86647$var$prefix = false;
}
/**
* Representation of a single event listener.
*
* @param {Function} fn The listener function.
* @param {*} context The context to invoke the listener with.
* @param {Boolean} [once=false] Specify if the listener is a one-time listener.
* @constructor
* @private
*/ function $c4dcfd1d1ea86647$var$EE(fn, context, once) {
	this.fn = fn;
	this.context = context;
	this.once = once || false;
}
/**
* Add a listener for a given event.
*
* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
* @param {(String|Symbol)} event The event name.
* @param {Function} fn The listener function.
* @param {*} context The context to invoke the listener with.
* @param {Boolean} once Specify if the listener is a one-time listener.
* @returns {EventEmitter}
* @private
*/ function $c4dcfd1d1ea86647$var$addListener(emitter, event, fn, context, once) {
	if (typeof fn !== "function") throw new TypeError("The listener must be a function");
	var listener = new $c4dcfd1d1ea86647$var$EE(fn, context || emitter, once), evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
	if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
	else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
	else emitter._events[evt] = [emitter._events[evt], listener];
	return emitter;
}
/**
* Clear event by name.
*
* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
* @param {(String|Symbol)} evt The Event name.
* @private
*/ function $c4dcfd1d1ea86647$var$clearEvent(emitter, evt) {
	if (--emitter._eventsCount === 0) emitter._events = new $c4dcfd1d1ea86647$var$Events();
	else delete emitter._events[evt];
}
/**
* Minimal `EventEmitter` interface that is molded against the Node.js
* `EventEmitter` interface.
*
* @constructor
* @public
*/ function $c4dcfd1d1ea86647$var$EventEmitter() {
	this._events = new $c4dcfd1d1ea86647$var$Events();
	this._eventsCount = 0;
}
/**
* Return an array listing the events for which the emitter has registered
* listeners.
*
* @returns {Array}
* @public
*/ $c4dcfd1d1ea86647$var$EventEmitter.prototype.eventNames = function eventNames() {
	var names = [], events, name;
	if (this._eventsCount === 0) return names;
	for (name in events = this._events) if ($c4dcfd1d1ea86647$var$has.call(events, name)) names.push($c4dcfd1d1ea86647$var$prefix ? name.slice(1) : name);
	if (Object.getOwnPropertySymbols) return names.concat(Object.getOwnPropertySymbols(events));
	return names;
};
/**
* Return the listeners registered for a given event.
*
* @param {(String|Symbol)} event The event name.
* @returns {Array} The registered listeners.
* @public
*/ $c4dcfd1d1ea86647$var$EventEmitter.prototype.listeners = function listeners(event) {
	var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event, handlers = this._events[evt];
	if (!handlers) return [];
	if (handlers.fn) return [handlers.fn];
	for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) ee[i] = handlers[i].fn;
	return ee;
};
/**
* Return the number of listeners listening to a given event.
*
* @param {(String|Symbol)} event The event name.
* @returns {Number} The number of listeners.
* @public
*/ $c4dcfd1d1ea86647$var$EventEmitter.prototype.listenerCount = function listenerCount(event) {
	var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event, listeners = this._events[evt];
	if (!listeners) return 0;
	if (listeners.fn) return 1;
	return listeners.length;
};
/**
* Calls each of the listeners registered for a given event.
*
* @param {(String|Symbol)} event The event name.
* @returns {Boolean} `true` if the event had listeners, else `false`.
* @public
*/ $c4dcfd1d1ea86647$var$EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
	if (!this._events[evt]) return false;
	var listeners = this._events[evt], len = arguments.length, args, i;
	if (listeners.fn) {
		if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
		switch (len) {
			case 1: return listeners.fn.call(listeners.context), true;
			case 2: return listeners.fn.call(listeners.context, a1), true;
			case 3: return listeners.fn.call(listeners.context, a1, a2), true;
			case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
			case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
			case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
		}
		for (i = 1, args = new Array(len - 1); i < len; i++) args[i - 1] = arguments[i];
		listeners.fn.apply(listeners.context, args);
	} else {
		var length = listeners.length, j;
		for (i = 0; i < length; i++) {
			if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
			switch (len) {
				case 1:
					listeners[i].fn.call(listeners[i].context);
					break;
				case 2:
					listeners[i].fn.call(listeners[i].context, a1);
					break;
				case 3:
					listeners[i].fn.call(listeners[i].context, a1, a2);
					break;
				case 4:
					listeners[i].fn.call(listeners[i].context, a1, a2, a3);
					break;
				default:
					if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) args[j - 1] = arguments[j];
					listeners[i].fn.apply(listeners[i].context, args);
			}
		}
	}
	return true;
};
/**
* Add a listener for a given event.
*
* @param {(String|Symbol)} event The event name.
* @param {Function} fn The listener function.
* @param {*} [context=this] The context to invoke the listener with.
* @returns {EventEmitter} `this`.
* @public
*/ $c4dcfd1d1ea86647$var$EventEmitter.prototype.on = function on(event, fn, context) {
	return $c4dcfd1d1ea86647$var$addListener(this, event, fn, context, false);
};
/**
* Add a one-time listener for a given event.
*
* @param {(String|Symbol)} event The event name.
* @param {Function} fn The listener function.
* @param {*} [context=this] The context to invoke the listener with.
* @returns {EventEmitter} `this`.
* @public
*/ $c4dcfd1d1ea86647$var$EventEmitter.prototype.once = function once(event, fn, context) {
	return $c4dcfd1d1ea86647$var$addListener(this, event, fn, context, true);
};
/**
* Remove the listeners of a given event.
*
* @param {(String|Symbol)} event The event name.
* @param {Function} fn Only remove the listeners that match this function.
* @param {*} context Only remove the listeners that have this context.
* @param {Boolean} once Only remove one-time listeners.
* @returns {EventEmitter} `this`.
* @public
*/ $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	var evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
	if (!this._events[evt]) return this;
	if (!fn) {
		$c4dcfd1d1ea86647$var$clearEvent(this, evt);
		return this;
	}
	var listeners = this._events[evt];
	if (listeners.fn) {
		if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) $c4dcfd1d1ea86647$var$clearEvent(this, evt);
	} else {
		for (var i = 0, events = [], length = listeners.length; i < length; i++) if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) events.push(listeners[i]);
		if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
		else $c4dcfd1d1ea86647$var$clearEvent(this, evt);
	}
	return this;
};
/**
* Remove all listeners, or those of the specified event.
*
* @param {(String|Symbol)} [event] The event name.
* @returns {EventEmitter} `this`.
* @public
*/ $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	var evt;
	if (event) {
		evt = $c4dcfd1d1ea86647$var$prefix ? $c4dcfd1d1ea86647$var$prefix + event : event;
		if (this._events[evt]) $c4dcfd1d1ea86647$var$clearEvent(this, evt);
	} else {
		this._events = new $c4dcfd1d1ea86647$var$Events();
		this._eventsCount = 0;
	}
	return this;
};
$c4dcfd1d1ea86647$var$EventEmitter.prototype.off = $c4dcfd1d1ea86647$var$EventEmitter.prototype.removeListener;
$c4dcfd1d1ea86647$var$EventEmitter.prototype.addListener = $c4dcfd1d1ea86647$var$EventEmitter.prototype.on;
$c4dcfd1d1ea86647$var$EventEmitter.prefixed = $c4dcfd1d1ea86647$var$prefix;
$c4dcfd1d1ea86647$var$EventEmitter.EventEmitter = $c4dcfd1d1ea86647$var$EventEmitter;
$c4dcfd1d1ea86647$exports = $c4dcfd1d1ea86647$var$EventEmitter;
var $78455e22dea96b8c$exports = {};
$parcel$export($78455e22dea96b8c$exports, "ConnectionType", () => $78455e22dea96b8c$export$3157d57b4135e3bc);
$parcel$export($78455e22dea96b8c$exports, "PeerErrorType", () => $78455e22dea96b8c$export$9547aaa2e39030ff);
$parcel$export($78455e22dea96b8c$exports, "BaseConnectionErrorType", () => $78455e22dea96b8c$export$7974935686149686);
$parcel$export($78455e22dea96b8c$exports, "DataConnectionErrorType", () => $78455e22dea96b8c$export$49ae800c114df41d);
$parcel$export($78455e22dea96b8c$exports, "SerializationType", () => $78455e22dea96b8c$export$89f507cf986a947);
$parcel$export($78455e22dea96b8c$exports, "SocketEventType", () => $78455e22dea96b8c$export$3b5c4a4b6354f023);
$parcel$export($78455e22dea96b8c$exports, "ServerMessageType", () => $78455e22dea96b8c$export$adb4a1754da6f10d);
var $78455e22dea96b8c$export$3157d57b4135e3bc = /* @__PURE__ */ function(ConnectionType) {
	ConnectionType["Data"] = "data";
	ConnectionType["Media"] = "media";
	return ConnectionType;
}({});
var $78455e22dea96b8c$export$9547aaa2e39030ff = /* @__PURE__ */ function(PeerErrorType) {
	/**
	* The client's browser does not support some or all WebRTC features that you are trying to use.
	*/ PeerErrorType["BrowserIncompatible"] = "browser-incompatible";
	/**
	* You've already disconnected this peer from the server and can no longer make any new connections on it.
	*/ PeerErrorType["Disconnected"] = "disconnected";
	/**
	* The ID passed into the Peer constructor contains illegal characters.
	*/ PeerErrorType["InvalidID"] = "invalid-id";
	/**
	* The API key passed into the Peer constructor contains illegal characters or is not in the system (cloud server only).
	*/ PeerErrorType["InvalidKey"] = "invalid-key";
	/**
	* Lost or cannot establish a connection to the signalling server.
	*/ PeerErrorType["Network"] = "network";
	/**
	* The peer you're trying to connect to does not exist.
	*/ PeerErrorType["PeerUnavailable"] = "peer-unavailable";
	/**
	* PeerJS is being used securely, but the cloud server does not support SSL. Use a custom PeerServer.
	*/ PeerErrorType["SslUnavailable"] = "ssl-unavailable";
	/**
	* Unable to reach the server.
	*/ PeerErrorType["ServerError"] = "server-error";
	/**
	* An error from the underlying socket.
	*/ PeerErrorType["SocketError"] = "socket-error";
	/**
	* The underlying socket closed unexpectedly.
	*/ PeerErrorType["SocketClosed"] = "socket-closed";
	/**
	* The ID passed into the Peer constructor is already taken.
	*
	* :::caution
	* This error is not fatal if your peer has open peer-to-peer connections.
	* This can happen if you attempt to {@apilink Peer.reconnect} a peer that has been disconnected from the server,
	* but its old ID has now been taken.
	* :::
	*/ PeerErrorType["UnavailableID"] = "unavailable-id";
	/**
	* Native WebRTC errors.
	*/ PeerErrorType["WebRTC"] = "webrtc";
	return PeerErrorType;
}({});
var $78455e22dea96b8c$export$7974935686149686 = /* @__PURE__ */ function(BaseConnectionErrorType) {
	BaseConnectionErrorType["NegotiationFailed"] = "negotiation-failed";
	BaseConnectionErrorType["ConnectionClosed"] = "connection-closed";
	return BaseConnectionErrorType;
}({});
var $78455e22dea96b8c$export$49ae800c114df41d = /* @__PURE__ */ function(DataConnectionErrorType) {
	DataConnectionErrorType["NotOpenYet"] = "not-open-yet";
	DataConnectionErrorType["MessageToBig"] = "message-too-big";
	return DataConnectionErrorType;
}({});
var $78455e22dea96b8c$export$89f507cf986a947 = /* @__PURE__ */ function(SerializationType) {
	SerializationType["Binary"] = "binary";
	SerializationType["BinaryUTF8"] = "binary-utf8";
	SerializationType["JSON"] = "json";
	SerializationType["None"] = "raw";
	return SerializationType;
}({});
var $78455e22dea96b8c$export$3b5c4a4b6354f023 = /* @__PURE__ */ function(SocketEventType) {
	SocketEventType["Message"] = "message";
	SocketEventType["Disconnected"] = "disconnected";
	SocketEventType["Error"] = "error";
	SocketEventType["Close"] = "close";
	return SocketEventType;
}({});
var $78455e22dea96b8c$export$adb4a1754da6f10d = /* @__PURE__ */ function(ServerMessageType) {
	ServerMessageType["Heartbeat"] = "HEARTBEAT";
	ServerMessageType["Candidate"] = "CANDIDATE";
	ServerMessageType["Offer"] = "OFFER";
	ServerMessageType["Answer"] = "ANSWER";
	ServerMessageType["Open"] = "OPEN";
	ServerMessageType["Error"] = "ERROR";
	ServerMessageType["IdTaken"] = "ID-TAKEN";
	ServerMessageType["InvalidKey"] = "INVALID-KEY";
	ServerMessageType["Leave"] = "LEAVE";
	ServerMessageType["Expire"] = "EXPIRE";
	return ServerMessageType;
}({});
var $520832d44ba058c8$export$83d89fbfd8236492 = "1.5.5";
var $8f5bfa60836d261d$export$4798917dbf149b79 = class extends $c4dcfd1d1ea86647$exports.EventEmitter {
	constructor(secure, host, port, path, key, pingInterval = 5e3) {
		super(), this.pingInterval = pingInterval, this._disconnected = true, this._messagesQueue = [];
		const wsProtocol = secure ? "wss://" : "ws://";
		this._baseUrl = wsProtocol + host + ":" + port + path + "peerjs?key=" + key;
	}
	start(id, token) {
		this._id = id;
		const wsUrl = `${this._baseUrl}&id=${id}&token=${token}`;
		if (!!this._socket || !this._disconnected) return;
		this._socket = new WebSocket(wsUrl + "&version=1.5.5");
		this._disconnected = false;
		this._socket.onmessage = (event) => {
			let data;
			try {
				data = JSON.parse(event.data);
				$257947e92926277a$export$2e2bcd8739ae039.log("Server message received:", data);
			} catch (e) {
				$257947e92926277a$export$2e2bcd8739ae039.log("Invalid server message", event.data);
				return;
			}
			this.emit($78455e22dea96b8c$export$3b5c4a4b6354f023.Message, data);
		};
		this._socket.onclose = (event) => {
			if (this._disconnected) return;
			$257947e92926277a$export$2e2bcd8739ae039.log("Socket closed.", event);
			this._cleanup();
			this._disconnected = true;
			this.emit($78455e22dea96b8c$export$3b5c4a4b6354f023.Disconnected);
		};
		this._socket.onopen = () => {
			if (this._disconnected) return;
			this._sendQueuedMessages();
			$257947e92926277a$export$2e2bcd8739ae039.log("Socket open");
			this._scheduleHeartbeat();
		};
	}
	_scheduleHeartbeat() {
		this._wsPingTimer = setTimeout(() => {
			this._sendHeartbeat();
		}, this.pingInterval);
	}
	_sendHeartbeat() {
		if (!this._wsOpen()) {
			$257947e92926277a$export$2e2bcd8739ae039.log(`Cannot send heartbeat, because socket closed`);
			return;
		}
		const message = JSON.stringify({ type: $78455e22dea96b8c$export$adb4a1754da6f10d.Heartbeat });
		this._socket.send(message);
		this._scheduleHeartbeat();
	}
	/** Is the websocket currently open? */ _wsOpen() {
		return !!this._socket && this._socket.readyState === 1;
	}
	/** Send queued messages. */ _sendQueuedMessages() {
		const copiedQueue = [...this._messagesQueue];
		this._messagesQueue = [];
		for (const message of copiedQueue) this.send(message);
	}
	/** Exposed send for DC & Peer. */ send(data) {
		if (this._disconnected) return;
		if (!this._id) {
			this._messagesQueue.push(data);
			return;
		}
		if (!data.type) {
			this.emit($78455e22dea96b8c$export$3b5c4a4b6354f023.Error, "Invalid message");
			return;
		}
		if (!this._wsOpen()) return;
		const message = JSON.stringify(data);
		this._socket.send(message);
	}
	close() {
		if (this._disconnected) return;
		this._cleanup();
		this._disconnected = true;
	}
	_cleanup() {
		if (this._socket) {
			this._socket.onopen = this._socket.onmessage = this._socket.onclose = null;
			this._socket.close();
			this._socket = void 0;
		}
		clearTimeout(this._wsPingTimer);
	}
};
var $b82fb8fc0514bfc1$export$89e6bb5ad64bf4a = class {
	constructor(connection) {
		this.connection = connection;
	}
	/** Returns a PeerConnection object set up correctly (for data, media). */ startConnection(options) {
		const peerConnection = this._startPeerConnection();
		this.connection.peerConnection = peerConnection;
		if (this.connection.type === $78455e22dea96b8c$export$3157d57b4135e3bc.Media && options._stream) this._addTracksToConnection(options._stream, peerConnection);
		if (options.originator) {
			const dataConnection = this.connection;
			const config = { ordered: !!options.reliable };
			const dataChannel = peerConnection.createDataChannel(dataConnection.label, config);
			dataConnection._initializeDataChannel(dataChannel);
			this._makeOffer();
		} else this.handleSDP("OFFER", options.sdp);
	}
	/** Start a PC. */ _startPeerConnection() {
		$257947e92926277a$export$2e2bcd8739ae039.log("Creating RTCPeerConnection.");
		const peerConnection = new RTCPeerConnection(this.connection.provider.options.config);
		this._setupListeners(peerConnection);
		return peerConnection;
	}
	/** Set up various WebRTC listeners. */ _setupListeners(peerConnection) {
		const peerId = this.connection.peer;
		const connectionId = this.connection.connectionId;
		const connectionType = this.connection.type;
		const provider = this.connection.provider;
		$257947e92926277a$export$2e2bcd8739ae039.log("Listening for ICE candidates.");
		peerConnection.onicecandidate = (evt) => {
			if (!evt.candidate || !evt.candidate.candidate) return;
			$257947e92926277a$export$2e2bcd8739ae039.log(`Received ICE candidates for ${peerId}:`, evt.candidate);
			provider.socket.send({
				type: $78455e22dea96b8c$export$adb4a1754da6f10d.Candidate,
				payload: {
					candidate: evt.candidate,
					type: connectionType,
					connectionId
				},
				dst: peerId
			});
		};
		peerConnection.oniceconnectionstatechange = () => {
			switch (peerConnection.iceConnectionState) {
				case "failed":
					$257947e92926277a$export$2e2bcd8739ae039.log("iceConnectionState is failed, closing connections to " + peerId);
					this.connection.emitError($78455e22dea96b8c$export$7974935686149686.NegotiationFailed, "Negotiation of connection to " + peerId + " failed.");
					this.connection.close();
					break;
				case "closed":
					$257947e92926277a$export$2e2bcd8739ae039.log("iceConnectionState is closed, closing connections to " + peerId);
					this.connection.emitError($78455e22dea96b8c$export$7974935686149686.ConnectionClosed, "Connection to " + peerId + " closed.");
					this.connection.close();
					break;
				case "disconnected":
					$257947e92926277a$export$2e2bcd8739ae039.log("iceConnectionState changed to disconnected on the connection with " + peerId);
					break;
				case "completed":
					peerConnection.onicecandidate = () => {};
					break;
			}
			this.connection.emit("iceStateChanged", peerConnection.iceConnectionState);
		};
		$257947e92926277a$export$2e2bcd8739ae039.log("Listening for data channel");
		peerConnection.ondatachannel = (evt) => {
			$257947e92926277a$export$2e2bcd8739ae039.log("Received data channel");
			const dataChannel = evt.channel;
			provider.getConnection(peerId, connectionId)._initializeDataChannel(dataChannel);
		};
		$257947e92926277a$export$2e2bcd8739ae039.log("Listening for remote stream");
		peerConnection.ontrack = (evt) => {
			$257947e92926277a$export$2e2bcd8739ae039.log("Received remote stream");
			const stream = evt.streams[0];
			const connection = provider.getConnection(peerId, connectionId);
			if (connection.type === $78455e22dea96b8c$export$3157d57b4135e3bc.Media) {
				const mediaConnection = connection;
				this._addStreamToMediaConnection(stream, mediaConnection);
			}
		};
	}
	cleanup() {
		$257947e92926277a$export$2e2bcd8739ae039.log("Cleaning up PeerConnection to " + this.connection.peer);
		const peerConnection = this.connection.peerConnection;
		if (!peerConnection) return;
		this.connection.peerConnection = null;
		peerConnection.onicecandidate = peerConnection.oniceconnectionstatechange = peerConnection.ondatachannel = peerConnection.ontrack = () => {};
		const peerConnectionNotClosed = peerConnection.signalingState !== "closed";
		let dataChannelNotClosed = false;
		const dataChannel = this.connection.dataChannel;
		if (dataChannel) dataChannelNotClosed = !!dataChannel.readyState && dataChannel.readyState !== "closed";
		if (peerConnectionNotClosed || dataChannelNotClosed) peerConnection.close();
	}
	async _makeOffer() {
		const peerConnection = this.connection.peerConnection;
		const provider = this.connection.provider;
		try {
			const offer = await peerConnection.createOffer(this.connection.options.constraints);
			$257947e92926277a$export$2e2bcd8739ae039.log("Created offer.");
			if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === "function") offer.sdp = this.connection.options.sdpTransform(offer.sdp) || offer.sdp;
			try {
				await peerConnection.setLocalDescription(offer);
				$257947e92926277a$export$2e2bcd8739ae039.log("Set localDescription:", offer, `for:${this.connection.peer}`);
				let payload = {
					sdp: offer,
					type: this.connection.type,
					connectionId: this.connection.connectionId,
					metadata: this.connection.metadata
				};
				if (this.connection.type === $78455e22dea96b8c$export$3157d57b4135e3bc.Data) {
					const dataConnection = this.connection;
					payload = {
						...payload,
						label: dataConnection.label,
						reliable: dataConnection.reliable,
						serialization: dataConnection.serialization
					};
				}
				provider.socket.send({
					type: $78455e22dea96b8c$export$adb4a1754da6f10d.Offer,
					payload,
					dst: this.connection.peer
				});
			} catch (err) {
				if (err != "OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer") {
					provider.emitError($78455e22dea96b8c$export$9547aaa2e39030ff.WebRTC, err);
					$257947e92926277a$export$2e2bcd8739ae039.log("Failed to setLocalDescription, ", err);
				}
			}
		} catch (err_1) {
			provider.emitError($78455e22dea96b8c$export$9547aaa2e39030ff.WebRTC, err_1);
			$257947e92926277a$export$2e2bcd8739ae039.log("Failed to createOffer, ", err_1);
		}
	}
	async _makeAnswer() {
		const peerConnection = this.connection.peerConnection;
		const provider = this.connection.provider;
		try {
			const answer = await peerConnection.createAnswer();
			$257947e92926277a$export$2e2bcd8739ae039.log("Created answer.");
			if (this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform === "function") answer.sdp = this.connection.options.sdpTransform(answer.sdp) || answer.sdp;
			try {
				await peerConnection.setLocalDescription(answer);
				$257947e92926277a$export$2e2bcd8739ae039.log(`Set localDescription:`, answer, `for:${this.connection.peer}`);
				provider.socket.send({
					type: $78455e22dea96b8c$export$adb4a1754da6f10d.Answer,
					payload: {
						sdp: answer,
						type: this.connection.type,
						connectionId: this.connection.connectionId
					},
					dst: this.connection.peer
				});
			} catch (err) {
				provider.emitError($78455e22dea96b8c$export$9547aaa2e39030ff.WebRTC, err);
				$257947e92926277a$export$2e2bcd8739ae039.log("Failed to setLocalDescription, ", err);
			}
		} catch (err_1) {
			provider.emitError($78455e22dea96b8c$export$9547aaa2e39030ff.WebRTC, err_1);
			$257947e92926277a$export$2e2bcd8739ae039.log("Failed to create answer, ", err_1);
		}
	}
	/** Handle an SDP. */ async handleSDP(type, sdp) {
		sdp = new RTCSessionDescription(sdp);
		const peerConnection = this.connection.peerConnection;
		const provider = this.connection.provider;
		$257947e92926277a$export$2e2bcd8739ae039.log("Setting remote description", sdp);
		const self = this;
		try {
			await peerConnection.setRemoteDescription(sdp);
			$257947e92926277a$export$2e2bcd8739ae039.log(`Set remoteDescription:${type} for:${this.connection.peer}`);
			if (type === "OFFER") await self._makeAnswer();
		} catch (err) {
			provider.emitError($78455e22dea96b8c$export$9547aaa2e39030ff.WebRTC, err);
			$257947e92926277a$export$2e2bcd8739ae039.log("Failed to setRemoteDescription, ", err);
		}
	}
	/** Handle a candidate. */ async handleCandidate(ice) {
		$257947e92926277a$export$2e2bcd8739ae039.log(`handleCandidate:`, ice);
		try {
			await this.connection.peerConnection.addIceCandidate(ice);
			$257947e92926277a$export$2e2bcd8739ae039.log(`Added ICE candidate for:${this.connection.peer}`);
		} catch (err) {
			this.connection.provider.emitError($78455e22dea96b8c$export$9547aaa2e39030ff.WebRTC, err);
			$257947e92926277a$export$2e2bcd8739ae039.log("Failed to handleCandidate, ", err);
		}
	}
	_addTracksToConnection(stream, peerConnection) {
		$257947e92926277a$export$2e2bcd8739ae039.log(`add tracks from stream ${stream.id} to peer connection`);
		if (!peerConnection.addTrack) return $257947e92926277a$export$2e2bcd8739ae039.error(`Your browser does't support RTCPeerConnection#addTrack. Ignored.`);
		stream.getTracks().forEach((track) => {
			peerConnection.addTrack(track, stream);
		});
	}
	_addStreamToMediaConnection(stream, mediaConnection) {
		$257947e92926277a$export$2e2bcd8739ae039.log(`add stream ${stream.id} to media connection ${mediaConnection.connectionId}`);
		mediaConnection.addStream(stream);
	}
};
var $23779d1881157a18$export$6a678e589c8a4542 = class extends $c4dcfd1d1ea86647$exports.EventEmitter {
	/**
	* Emits a typed error message.
	*
	* @internal
	*/ emitError(type, err) {
		$257947e92926277a$export$2e2bcd8739ae039.error("Error:", err);
		this.emit("error", new $23779d1881157a18$export$98871882f492de82(`${type}`, err));
	}
};
var $23779d1881157a18$export$98871882f492de82 = class extends Error {
	/**
	* @internal
	*/ constructor(type, err) {
		if (typeof err === "string") super(err);
		else {
			super();
			Object.assign(this, err);
		}
		this.type = type;
	}
};
var $5045192fc6d387ba$export$23a2a68283c24d80 = class extends $23779d1881157a18$export$6a678e589c8a4542 {
	/**
	* Whether the media connection is active (e.g. your call has been answered).
	* You can check this if you want to set a maximum wait time for a one-sided call.
	*/ get open() {
		return this._open;
	}
	constructor(peer, provider, options) {
		super(), this.peer = peer, this.provider = provider, this.options = options, this._open = false;
		this.metadata = options.metadata;
	}
};
var $5c1d08c7c57da9a3$export$4a84e95a2324ac29 = class $5c1d08c7c57da9a3$export$4a84e95a2324ac29 extends $5045192fc6d387ba$export$23a2a68283c24d80 {
	static #_ = this.ID_PREFIX = "mc_";
	/**
	* For media connections, this is always 'media'.
	*/ get type() {
		return $78455e22dea96b8c$export$3157d57b4135e3bc.Media;
	}
	get localStream() {
		return this._localStream;
	}
	get remoteStream() {
		return this._remoteStream;
	}
	constructor(peerId, provider, options) {
		super(peerId, provider, options);
		this._localStream = this.options._stream;
		this.connectionId = this.options.connectionId || $5c1d08c7c57da9a3$export$4a84e95a2324ac29.ID_PREFIX + $4f4134156c446392$export$7debb50ef11d5e0b.randomToken();
		this._negotiator = new $b82fb8fc0514bfc1$export$89e6bb5ad64bf4a(this);
		if (this._localStream) this._negotiator.startConnection({
			_stream: this._localStream,
			originator: true
		});
	}
	/** Called by the Negotiator when the DataChannel is ready. */ _initializeDataChannel(dc) {
		this.dataChannel = dc;
		this.dataChannel.onopen = () => {
			$257947e92926277a$export$2e2bcd8739ae039.log(`DC#${this.connectionId} dc connection success`);
			this.emit("willCloseOnRemote");
		};
		this.dataChannel.onclose = () => {
			$257947e92926277a$export$2e2bcd8739ae039.log(`DC#${this.connectionId} dc closed for:`, this.peer);
			this.close();
		};
	}
	addStream(remoteStream) {
		$257947e92926277a$export$2e2bcd8739ae039.log("Receiving stream", remoteStream);
		this._remoteStream = remoteStream;
		super.emit("stream", remoteStream);
	}
	/**
	* @internal
	*/ handleMessage(message) {
		const type = message.type;
		const payload = message.payload;
		switch (message.type) {
			case $78455e22dea96b8c$export$adb4a1754da6f10d.Answer:
				this._negotiator.handleSDP(type, payload.sdp);
				this._open = true;
				break;
			case $78455e22dea96b8c$export$adb4a1754da6f10d.Candidate:
				this._negotiator.handleCandidate(payload.candidate);
				break;
			default:
				$257947e92926277a$export$2e2bcd8739ae039.warn(`Unrecognized message type:${type} from peer:${this.peer}`);
				break;
		}
	}
	/**
	* When receiving a {@apilink PeerEvents | `call`} event on a peer, you can call
	* `answer` on the media connection provided by the callback to accept the call
	* and optionally send your own media stream.
	
	*
	* @param stream A WebRTC media stream.
	* @param options
	* @returns
	*/ answer(stream, options = {}) {
		if (this._localStream) {
			$257947e92926277a$export$2e2bcd8739ae039.warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");
			return;
		}
		this._localStream = stream;
		if (options && options.sdpTransform) this.options.sdpTransform = options.sdpTransform;
		this._negotiator.startConnection({
			...this.options._payload,
			_stream: stream
		});
		const messages = this.provider._getMessages(this.connectionId);
		for (const message of messages) this.handleMessage(message);
		this._open = true;
	}
	/**
	* Exposed functionality for users.
	*/ /**
	* Closes the media connection.
	*/ close() {
		if (this._negotiator) {
			this._negotiator.cleanup();
			this._negotiator = null;
		}
		this._localStream = null;
		this._remoteStream = null;
		if (this.provider) {
			this.provider._removeConnection(this);
			this.provider = null;
		}
		if (this.options && this.options._stream) this.options._stream = null;
		if (!this.open) return;
		this._open = false;
		super.emit("close");
	}
};
var $abf266641927cd89$export$2c4e825dc9120f87 = class {
	constructor(_options) {
		this._options = _options;
	}
	_buildRequest(method) {
		const protocol = this._options.secure ? "https" : "http";
		const { host, port, path, key } = this._options;
		const url = new URL(`${protocol}://${host}:${port}${path}${key}/${method}`);
		url.searchParams.set("ts", `${Date.now()}${Math.random()}`);
		url.searchParams.set("version", $520832d44ba058c8$export$83d89fbfd8236492);
		return fetch(url.href, { referrerPolicy: this._options.referrerPolicy });
	}
	/** Get a unique ID from the server via XHR and initialize with it. */ async retrieveId() {
		try {
			const response = await this._buildRequest("id");
			if (response.status !== 200) throw new Error(`Error. Status:${response.status}`);
			return response.text();
		} catch (error) {
			$257947e92926277a$export$2e2bcd8739ae039.error("Error retrieving ID", error);
			let pathError = "";
			if (this._options.path === "/" && this._options.host !== $4f4134156c446392$export$7debb50ef11d5e0b.CLOUD_HOST) pathError = " If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer.";
			throw new Error("Could not get an ID from the server." + pathError);
		}
	}
	/** @deprecated */ async listAllPeers() {
		try {
			const response = await this._buildRequest("peers");
			if (response.status !== 200) {
				if (response.status === 401) {
					let helpfulError = "";
					if (this._options.host === $4f4134156c446392$export$7debb50ef11d5e0b.CLOUD_HOST) helpfulError = "It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.";
					else helpfulError = "You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.";
					throw new Error("It doesn't look like you have permission to list peers IDs. " + helpfulError);
				}
				throw new Error(`Error. Status:${response.status}`);
			}
			return response.json();
		} catch (error) {
			$257947e92926277a$export$2e2bcd8739ae039.error("Error retrieving list peers", error);
			throw new Error("Could not get list peers from the server." + error);
		}
	}
};
var $6366c4ca161bc297$export$d365f7ad9d7df9c9 = class $6366c4ca161bc297$export$d365f7ad9d7df9c9 extends $5045192fc6d387ba$export$23a2a68283c24d80 {
	static #_ = this.ID_PREFIX = "dc_";
	static #_2 = this.MAX_BUFFERED_AMOUNT = 8388608;
	get type() {
		return $78455e22dea96b8c$export$3157d57b4135e3bc.Data;
	}
	constructor(peerId, provider, options) {
		super(peerId, provider, options);
		this.connectionId = this.options.connectionId || $6366c4ca161bc297$export$d365f7ad9d7df9c9.ID_PREFIX + $0e5fd1585784c252$export$4e61f672936bec77();
		this.label = this.options.label || this.connectionId;
		this.reliable = !!this.options.reliable;
		this._negotiator = new $b82fb8fc0514bfc1$export$89e6bb5ad64bf4a(this);
		this._negotiator.startConnection(this.options._payload || {
			originator: true,
			reliable: this.reliable
		});
	}
	/** Called by the Negotiator when the DataChannel is ready. */ _initializeDataChannel(dc) {
		this.dataChannel = dc;
		this.dataChannel.onopen = () => {
			$257947e92926277a$export$2e2bcd8739ae039.log(`DC#${this.connectionId} dc connection success`);
			this._open = true;
			this.emit("open");
		};
		this.dataChannel.onmessage = (e) => {
			$257947e92926277a$export$2e2bcd8739ae039.log(`DC#${this.connectionId} dc onmessage:`, e.data);
		};
		this.dataChannel.onclose = () => {
			$257947e92926277a$export$2e2bcd8739ae039.log(`DC#${this.connectionId} dc closed for:`, this.peer);
			this.close();
		};
	}
	/**
	* Exposed functionality for users.
	*/ /** Allows user to close connection. */ close(options) {
		if (options?.flush) {
			this.send({ __peerData: { type: "close" } });
			return;
		}
		if (this._negotiator) {
			this._negotiator.cleanup();
			this._negotiator = null;
		}
		if (this.provider) {
			this.provider._removeConnection(this);
			this.provider = null;
		}
		if (this.dataChannel) {
			this.dataChannel.onopen = null;
			this.dataChannel.onmessage = null;
			this.dataChannel.onclose = null;
			this.dataChannel = null;
		}
		if (!this.open) return;
		this._open = false;
		super.emit("close");
	}
	/** Allows user to send data. */ send(data, chunked = false) {
		if (!this.open) {
			this.emitError($78455e22dea96b8c$export$49ae800c114df41d.NotOpenYet, "Connection is not open. You should listen for the `open` event before sending messages.");
			return;
		}
		return this._send(data, chunked);
	}
	async handleMessage(message) {
		const payload = message.payload;
		switch (message.type) {
			case $78455e22dea96b8c$export$adb4a1754da6f10d.Answer:
				await this._negotiator.handleSDP(message.type, payload.sdp);
				break;
			case $78455e22dea96b8c$export$adb4a1754da6f10d.Candidate:
				await this._negotiator.handleCandidate(payload.candidate);
				break;
			default:
				$257947e92926277a$export$2e2bcd8739ae039.warn("Unrecognized message type:", message.type, "from peer:", this.peer);
				break;
		}
	}
};
var $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b = class extends $6366c4ca161bc297$export$d365f7ad9d7df9c9 {
	get bufferSize() {
		return this._bufferSize;
	}
	_initializeDataChannel(dc) {
		super._initializeDataChannel(dc);
		this.dataChannel.binaryType = "arraybuffer";
		this.dataChannel.addEventListener("message", (e) => this._handleDataMessage(e));
	}
	_bufferedSend(msg) {
		if (this._buffering || !this._trySend(msg)) {
			this._buffer.push(msg);
			this._bufferSize = this._buffer.length;
		}
	}
	_trySend(msg) {
		if (!this.open) return false;
		if (this.dataChannel.bufferedAmount > $6366c4ca161bc297$export$d365f7ad9d7df9c9.MAX_BUFFERED_AMOUNT) {
			this._buffering = true;
			setTimeout(() => {
				this._buffering = false;
				this._tryBuffer();
			}, 50);
			return false;
		}
		try {
			this.dataChannel.send(msg);
		} catch (e) {
			$257947e92926277a$export$2e2bcd8739ae039.error(`DC#:${this.connectionId} Error when sending:`, e);
			this._buffering = true;
			this.close();
			return false;
		}
		return true;
	}
	_tryBuffer() {
		if (!this.open) return;
		if (this._buffer.length === 0) return;
		const msg = this._buffer[0];
		if (this._trySend(msg)) {
			this._buffer.shift();
			this._bufferSize = this._buffer.length;
			this._tryBuffer();
		}
	}
	close(options) {
		if (options?.flush) {
			this.send({ __peerData: { type: "close" } });
			return;
		}
		this._buffer = [];
		this._bufferSize = 0;
		super.close();
	}
	constructor(...args) {
		super(...args), this._buffer = [], this._bufferSize = 0, this._buffering = false;
	}
};
var $9fcfddb3ae148f88$export$f0a5a64d5bb37108 = class extends $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b {
	close(options) {
		super.close(options);
		this._chunkedData = {};
	}
	constructor(peerId, provider, options) {
		super(peerId, provider, options), this.chunker = new $fcbcc7538a6776d5$export$f1c5f4c9cb95390b(), this.serialization = $78455e22dea96b8c$export$89f507cf986a947.Binary, this._chunkedData = {};
	}
	_handleDataMessage({ data }) {
		const deserializedData = $0cfd7828ad59115f$export$417857010dc9287f(data);
		const peerData = deserializedData["__peerData"];
		if (peerData) {
			if (peerData.type === "close") {
				this.close();
				return;
			}
			this._handleChunk(deserializedData);
			return;
		}
		this.emit("data", deserializedData);
	}
	_handleChunk(data) {
		const id = data.__peerData;
		const chunkInfo = this._chunkedData[id] || {
			data: [],
			count: 0,
			total: data.total
		};
		chunkInfo.data[data.n] = new Uint8Array(data.data);
		chunkInfo.count++;
		this._chunkedData[id] = chunkInfo;
		if (chunkInfo.total === chunkInfo.count) {
			delete this._chunkedData[id];
			const data = $fcbcc7538a6776d5$export$52c89ebcdc4f53f2(chunkInfo.data);
			this._handleDataMessage({ data });
		}
	}
	_send(data, chunked) {
		const blob = $0cfd7828ad59115f$export$2a703dbb0cb35339(data);
		if (blob instanceof Promise) return this._send_blob(blob);
		if (!chunked && blob.byteLength > this.chunker.chunkedMTU) {
			this._sendChunks(blob);
			return;
		}
		this._bufferedSend(blob);
	}
	async _send_blob(blobPromise) {
		const blob = await blobPromise;
		if (blob.byteLength > this.chunker.chunkedMTU) {
			this._sendChunks(blob);
			return;
		}
		this._bufferedSend(blob);
	}
	_sendChunks(blob) {
		const blobs = this.chunker.chunk(blob);
		$257947e92926277a$export$2e2bcd8739ae039.log(`DC#${this.connectionId} Try to send ${blobs.length} chunks...`);
		for (const blob of blobs) this.send(blob, true);
	}
};
var $bbaee3f15f714663$export$6f88fe47d32c9c94 = class extends $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b {
	_handleDataMessage({ data }) {
		super.emit("data", data);
	}
	_send(data, _chunked) {
		this._bufferedSend(data);
	}
	constructor(...args) {
		super(...args), this.serialization = $78455e22dea96b8c$export$89f507cf986a947.None;
	}
};
var $817f931e3f9096cf$export$48880ac635f47186 = class extends $a229bedbcaa6ca23$export$ff7c9d4c11d94e8b {
	_handleDataMessage({ data }) {
		const deserializedData = this.parse(this.decoder.decode(data));
		const peerData = deserializedData["__peerData"];
		if (peerData && peerData.type === "close") {
			this.close();
			return;
		}
		this.emit("data", deserializedData);
	}
	_send(data, _chunked) {
		const encodedData = this.encoder.encode(this.stringify(data));
		if (encodedData.byteLength >= $4f4134156c446392$export$7debb50ef11d5e0b.chunkedMTU) {
			this.emitError($78455e22dea96b8c$export$49ae800c114df41d.MessageToBig, "Message too big for JSON channel");
			return;
		}
		this._bufferedSend(encodedData);
	}
	constructor(...args) {
		super(...args), this.serialization = $78455e22dea96b8c$export$89f507cf986a947.JSON, this.encoder = new TextEncoder(), this.decoder = new TextDecoder(), this.stringify = JSON.stringify, this.parse = JSON.parse;
	}
};
var $dd0187d7f28e386f$export$2e2bcd8739ae039 = class $416260bce337df90$export$ecd1fc136c422448 extends $23779d1881157a18$export$6a678e589c8a4542 {
	static #_ = this.DEFAULT_KEY = "peerjs";
	/**
	* The brokering ID of this peer
	*
	* If no ID was specified in {@apilink Peer | the constructor},
	* this will be `undefined` until the {@apilink PeerEvents | `open`} event is emitted.
	*/ get id() {
		return this._id;
	}
	get options() {
		return this._options;
	}
	get open() {
		return this._open;
	}
	/**
	* @internal
	*/ get socket() {
		return this._socket;
	}
	/**
	* A hash of all connections associated with this peer, keyed by the remote peer's ID.
	* @deprecated
	* Return type will change from Object to Map<string,[]>
	*/ get connections() {
		const plainConnections = Object.create(null);
		for (const [k, v] of this._connections) plainConnections[k] = v;
		return plainConnections;
	}
	/**
	* true if this peer and all of its connections can no longer be used.
	*/ get destroyed() {
		return this._destroyed;
	}
	/**
	* false if there is an active connection to the PeerServer.
	*/ get disconnected() {
		return this._disconnected;
	}
	constructor(id, options) {
		super(), this._serializers = {
			raw: $bbaee3f15f714663$export$6f88fe47d32c9c94,
			json: $817f931e3f9096cf$export$48880ac635f47186,
			binary: $9fcfddb3ae148f88$export$f0a5a64d5bb37108,
			"binary-utf8": $9fcfddb3ae148f88$export$f0a5a64d5bb37108,
			default: $9fcfddb3ae148f88$export$f0a5a64d5bb37108
		}, this._id = null, this._lastServerId = null, this._destroyed = false, this._disconnected = false, this._open = false, this._connections = /* @__PURE__ */ new Map(), this._lostMessages = /* @__PURE__ */ new Map();
		let userId;
		if (id && id.constructor == Object) options = id;
		else if (id) userId = id.toString();
		options = {
			debug: 0,
			host: $4f4134156c446392$export$7debb50ef11d5e0b.CLOUD_HOST,
			port: $4f4134156c446392$export$7debb50ef11d5e0b.CLOUD_PORT,
			path: "/",
			key: $416260bce337df90$export$ecd1fc136c422448.DEFAULT_KEY,
			token: $4f4134156c446392$export$7debb50ef11d5e0b.randomToken(),
			config: $4f4134156c446392$export$7debb50ef11d5e0b.defaultConfig,
			referrerPolicy: "strict-origin-when-cross-origin",
			serializers: {},
			...options
		};
		this._options = options;
		this._serializers = {
			...this._serializers,
			...this.options.serializers
		};
		if (this._options.host === "/") this._options.host = window.location.hostname;
		if (this._options.path) {
			if (this._options.path[0] !== "/") this._options.path = "/" + this._options.path;
			if (this._options.path[this._options.path.length - 1] !== "/") this._options.path += "/";
		}
		if (this._options.secure === void 0 && this._options.host !== $4f4134156c446392$export$7debb50ef11d5e0b.CLOUD_HOST) this._options.secure = $4f4134156c446392$export$7debb50ef11d5e0b.isSecure();
		else if (this._options.host == $4f4134156c446392$export$7debb50ef11d5e0b.CLOUD_HOST) this._options.secure = true;
		if (this._options.logFunction) $257947e92926277a$export$2e2bcd8739ae039.setLogFunction(this._options.logFunction);
		$257947e92926277a$export$2e2bcd8739ae039.logLevel = this._options.debug || 0;
		this._api = new $abf266641927cd89$export$2c4e825dc9120f87(options);
		this._socket = this._createServerConnection();
		if (!$4f4134156c446392$export$7debb50ef11d5e0b.supports.audioVideo && !$4f4134156c446392$export$7debb50ef11d5e0b.supports.data) {
			this._delayedAbort($78455e22dea96b8c$export$9547aaa2e39030ff.BrowserIncompatible, "The current browser does not support WebRTC");
			return;
		}
		if (!!userId && !$4f4134156c446392$export$7debb50ef11d5e0b.validateId(userId)) {
			this._delayedAbort($78455e22dea96b8c$export$9547aaa2e39030ff.InvalidID, `ID "${userId}" is invalid`);
			return;
		}
		if (userId) this._initialize(userId);
		else this._api.retrieveId().then((id) => this._initialize(id)).catch((error) => this._abort($78455e22dea96b8c$export$9547aaa2e39030ff.ServerError, error));
	}
	_createServerConnection() {
		const socket = new $8f5bfa60836d261d$export$4798917dbf149b79(this._options.secure, this._options.host, this._options.port, this._options.path, this._options.key, this._options.pingInterval);
		socket.on($78455e22dea96b8c$export$3b5c4a4b6354f023.Message, (data) => {
			this._handleMessage(data);
		});
		socket.on($78455e22dea96b8c$export$3b5c4a4b6354f023.Error, (error) => {
			this._abort($78455e22dea96b8c$export$9547aaa2e39030ff.SocketError, error);
		});
		socket.on($78455e22dea96b8c$export$3b5c4a4b6354f023.Disconnected, () => {
			if (this.disconnected) return;
			this.emitError($78455e22dea96b8c$export$9547aaa2e39030ff.Network, "Lost connection to server.");
			this.disconnect();
		});
		socket.on($78455e22dea96b8c$export$3b5c4a4b6354f023.Close, () => {
			if (this.disconnected) return;
			this._abort($78455e22dea96b8c$export$9547aaa2e39030ff.SocketClosed, "Underlying socket is already closed.");
		});
		return socket;
	}
	/** Initialize a connection with the server. */ _initialize(id) {
		this._id = id;
		this.socket.start(id, this._options.token);
	}
	/** Handles messages from the server. */ _handleMessage(message) {
		const type = message.type;
		const payload = message.payload;
		const peerId = message.src;
		switch (type) {
			case $78455e22dea96b8c$export$adb4a1754da6f10d.Open:
				this._lastServerId = this.id;
				this._open = true;
				this.emit("open", this.id);
				break;
			case $78455e22dea96b8c$export$adb4a1754da6f10d.Error:
				this._abort($78455e22dea96b8c$export$9547aaa2e39030ff.ServerError, payload.msg);
				break;
			case $78455e22dea96b8c$export$adb4a1754da6f10d.IdTaken:
				this._abort($78455e22dea96b8c$export$9547aaa2e39030ff.UnavailableID, `ID "${this.id}" is taken`);
				break;
			case $78455e22dea96b8c$export$adb4a1754da6f10d.InvalidKey:
				this._abort($78455e22dea96b8c$export$9547aaa2e39030ff.InvalidKey, `API KEY "${this._options.key}" is invalid`);
				break;
			case $78455e22dea96b8c$export$adb4a1754da6f10d.Leave:
				$257947e92926277a$export$2e2bcd8739ae039.log(`Received leave message from ${peerId}`);
				this._cleanupPeer(peerId);
				this._connections.delete(peerId);
				break;
			case $78455e22dea96b8c$export$adb4a1754da6f10d.Expire:
				this.emitError($78455e22dea96b8c$export$9547aaa2e39030ff.PeerUnavailable, `Could not connect to peer ${peerId}`);
				break;
			case $78455e22dea96b8c$export$adb4a1754da6f10d.Offer: {
				const connectionId = payload.connectionId;
				let connection = this.getConnection(peerId, connectionId);
				if (connection) {
					connection.close();
					$257947e92926277a$export$2e2bcd8739ae039.warn(`Offer received for existing Connection ID:${connectionId}`);
				}
				if (payload.type === $78455e22dea96b8c$export$3157d57b4135e3bc.Media) {
					const mediaConnection = new $5c1d08c7c57da9a3$export$4a84e95a2324ac29(peerId, this, {
						connectionId,
						_payload: payload,
						metadata: payload.metadata
					});
					connection = mediaConnection;
					this._addConnection(peerId, connection);
					this.emit("call", mediaConnection);
				} else if (payload.type === $78455e22dea96b8c$export$3157d57b4135e3bc.Data) {
					const dataConnection = new this._serializers[payload.serialization](peerId, this, {
						connectionId,
						_payload: payload,
						metadata: payload.metadata,
						label: payload.label,
						serialization: payload.serialization,
						reliable: payload.reliable
					});
					connection = dataConnection;
					this._addConnection(peerId, connection);
					this.emit("connection", dataConnection);
				} else {
					$257947e92926277a$export$2e2bcd8739ae039.warn(`Received malformed connection type:${payload.type}`);
					return;
				}
				const messages = this._getMessages(connectionId);
				for (const message of messages) connection.handleMessage(message);
				break;
			}
			default: {
				if (!payload) {
					$257947e92926277a$export$2e2bcd8739ae039.warn(`You received a malformed message from ${peerId} of type ${type}`);
					return;
				}
				const connectionId = payload.connectionId;
				const connection = this.getConnection(peerId, connectionId);
				if (connection && connection.peerConnection) connection.handleMessage(message);
				else if (connectionId) this._storeMessage(connectionId, message);
				else $257947e92926277a$export$2e2bcd8739ae039.warn("You received an unrecognized message:", message);
				break;
			}
		}
	}
	/** Stores messages without a set up connection, to be claimed later. */ _storeMessage(connectionId, message) {
		if (!this._lostMessages.has(connectionId)) this._lostMessages.set(connectionId, []);
		this._lostMessages.get(connectionId).push(message);
	}
	/**
	* Retrieve messages from lost message store
	* @internal
	*/ _getMessages(connectionId) {
		const messages = this._lostMessages.get(connectionId);
		if (messages) {
			this._lostMessages.delete(connectionId);
			return messages;
		}
		return [];
	}
	/**
	* Connects to the remote peer specified by id and returns a data connection.
	* @param peer The brokering ID of the remote peer (their {@apilink Peer.id}).
	* @param options for specifying details about Peer Connection
	*/ connect(peer, options = {}) {
		options = {
			serialization: "default",
			...options
		};
		if (this.disconnected) {
			$257947e92926277a$export$2e2bcd8739ae039.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available.");
			this.emitError($78455e22dea96b8c$export$9547aaa2e39030ff.Disconnected, "Cannot connect to new Peer after disconnecting from server.");
			return;
		}
		const dataConnection = new this._serializers[options.serialization](peer, this, options);
		this._addConnection(peer, dataConnection);
		return dataConnection;
	}
	/**
	* Calls the remote peer specified by id and returns a media connection.
	* @param peer The brokering ID of the remote peer (their peer.id).
	* @param stream The caller's media stream
	* @param options Metadata associated with the connection, passed in by whoever initiated the connection.
	*/ call(peer, stream, options = {}) {
		if (this.disconnected) {
			$257947e92926277a$export$2e2bcd8739ae039.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect.");
			this.emitError($78455e22dea96b8c$export$9547aaa2e39030ff.Disconnected, "Cannot connect to new Peer after disconnecting from server.");
			return;
		}
		if (!stream) {
			$257947e92926277a$export$2e2bcd8739ae039.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");
			return;
		}
		const mediaConnection = new $5c1d08c7c57da9a3$export$4a84e95a2324ac29(peer, this, {
			...options,
			_stream: stream
		});
		this._addConnection(peer, mediaConnection);
		return mediaConnection;
	}
	/** Add a data/media connection to this peer. */ _addConnection(peerId, connection) {
		$257947e92926277a$export$2e2bcd8739ae039.log(`add connection ${connection.type}:${connection.connectionId} to peerId:${peerId}`);
		if (!this._connections.has(peerId)) this._connections.set(peerId, []);
		this._connections.get(peerId).push(connection);
	}
	_removeConnection(connection) {
		const connections = this._connections.get(connection.peer);
		if (connections) {
			const index = connections.indexOf(connection);
			if (index !== -1) connections.splice(index, 1);
		}
		this._lostMessages.delete(connection.connectionId);
	}
	/** Retrieve a data/media connection for this peer. */ getConnection(peerId, connectionId) {
		const connections = this._connections.get(peerId);
		if (!connections) return null;
		for (const connection of connections) if (connection.connectionId === connectionId) return connection;
		return null;
	}
	_delayedAbort(type, message) {
		setTimeout(() => {
			this._abort(type, message);
		}, 0);
	}
	/**
	* Emits an error message and destroys the Peer.
	* The Peer is not destroyed if it's in a disconnected state, in which case
	* it retains its disconnected state and its existing connections.
	*/ _abort(type, message) {
		$257947e92926277a$export$2e2bcd8739ae039.error("Aborting!");
		this.emitError(type, message);
		if (!this._lastServerId) this.destroy();
		else this.disconnect();
	}
	/**
	* Destroys the Peer: closes all active connections as well as the connection
	* to the server.
	*
	* :::caution
	* This cannot be undone; the respective peer object will no longer be able
	* to create or receive any connections, its ID will be forfeited on the server,
	* and all of its data and media connections will be closed.
	* :::
	*/ destroy() {
		if (this.destroyed) return;
		$257947e92926277a$export$2e2bcd8739ae039.log(`Destroy peer with ID:${this.id}`);
		this.disconnect();
		this._cleanup();
		this._destroyed = true;
		this.emit("close");
	}
	/** Disconnects every connection on this peer. */ _cleanup() {
		for (const peerId of this._connections.keys()) {
			this._cleanupPeer(peerId);
			this._connections.delete(peerId);
		}
		this.socket.removeAllListeners();
	}
	/** Closes all connections to this peer. */ _cleanupPeer(peerId) {
		const connections = this._connections.get(peerId);
		if (!connections) return;
		for (const connection of connections) connection.close();
	}
	/**
	* Disconnects the Peer's connection to the PeerServer. Does not close any
	*  active connections.
	* Warning: The peer can no longer create or accept connections after being
	*  disconnected. It also cannot reconnect to the server.
	*/ disconnect() {
		if (this.disconnected) return;
		const currentId = this.id;
		$257947e92926277a$export$2e2bcd8739ae039.log(`Disconnect peer with ID:${currentId}`);
		this._disconnected = true;
		this._open = false;
		this.socket.close();
		this._lastServerId = currentId;
		this._id = null;
		this.emit("disconnected", currentId);
	}
	/** Attempts to reconnect with the same ID.
	*
	* Only {@apilink Peer.disconnect | disconnected peers} can be reconnected.
	* Destroyed peers cannot be reconnected.
	* If the connection fails (as an example, if the peer's old ID is now taken),
	* the peer's existing connections will not close, but any associated errors events will fire.
	*/ reconnect() {
		if (this.disconnected && !this.destroyed) {
			$257947e92926277a$export$2e2bcd8739ae039.log(`Attempting reconnection to server with ID ${this._lastServerId}`);
			this._disconnected = false;
			this._initialize(this._lastServerId);
		} else if (this.destroyed) throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");
		else if (!this.disconnected && !this.open) $257947e92926277a$export$2e2bcd8739ae039.error("In a hurry? We're still trying to make the initial connection!");
		else throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`);
	}
	/**
	* Get a list of available peer IDs. If you're running your own server, you'll
	* want to set allow_discovery: true in the PeerServer options. If you're using
	* the cloud server, email team@peerjs.com to get the functionality enabled for
	* your key.
	*/ listAllPeers(cb = (_) => {}) {
		this._api.listAllPeers().then((peers) => cb(peers)).catch((error) => this._abort($78455e22dea96b8c$export$9547aaa2e39030ff.ServerError, error));
	}
};
//#endregion
//#region src/engine/network.ts
/**
* PeerJS сетевой модуль для игры «Дурак»
* P2P через WebRTC с сигнальным сервером PeerJS
*
* API: EventEmitter-стиль — подписка через on()/onData(), отправка через send()
*/
function getPeerConfig() {
	const localPeerHost = "192.168.0.78";
	const localPeerPort = 9e3;
	const localPeerPath = "/myapp";
	const currentHost = typeof window !== "undefined" ? window.location.hostname : "";
	const isLocalNetwork = currentHost === localPeerHost || currentHost === "localhost" || currentHost === "127.0.0.1";
	return {
		host: isLocalNetwork ? currentHost : localPeerHost,
		port: localPeerPort,
		path: localPeerPath,
		secure: isLocalNetwork ? false : false,
		config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }] }
	};
}
var NetworkManager = class {
	peer = null;
	connection = null;
	myId = "";
	myRole = null;
	isHost = false;
	listeners = [];
	/** Подписаться на все события */
	on(listener) {
		this.listeners.push(listener);
		return () => {
			this.listeners = this.listeners.filter((l) => l !== listener);
		};
	}
	/** Подписка только на data-события (входящие сообщения) */
	onData(callback) {
		return this.on((event) => {
			if (event.type === "data") callback(event.payload);
		});
	}
	emit(event) {
		for (const listener of this.listeners) try {
			listener(event);
		} catch (e) {
			console.error("[Network] Listener error:", e);
		}
	}
	/** Создать комнату (хост). Resolves с room ID. */
	async host() {
		return new Promise((resolve, reject) => {
			this.peer = new $dd0187d7f28e386f$export$2e2bcd8739ae039(getPeerConfig());
			this.isHost = true;
			this.myRole = "host";
			this.peer.on("open", (id) => {
				this.myId = id;
				console.log("[Network] Host created, room ID:", id);
				this.peer.on("connection", (conn) => {
					console.log("[Network] Guest connected:", conn.peer);
					this.connection = conn;
					this.setupConnection(conn);
					this.emit({
						type: "connected",
						payload: { role: "host" }
					});
				});
				resolve(id);
			});
			this.peer.on("error", (err) => {
				console.error("[Network] Host error:", err);
				this.emit({
					type: "error",
					payload: err
				});
				reject(err);
			});
			this.peer.on("disconnected", () => {
				this.emit({ type: "disconnected" });
			});
		});
	}
	/** Присоединиться к комнате (гость) */
	async join(roomId) {
		return new Promise((resolve, reject) => {
			this.peer = new $dd0187d7f28e386f$export$2e2bcd8739ae039(getPeerConfig());
			this.isHost = false;
			this.myRole = "guest";
			this.peer.on("open", (id) => {
				this.myId = id;
				console.log("[Network] Joining room:", roomId);
				const conn = this.peer.connect(roomId, { reliable: true });
				this.connection = conn;
				conn.on("open", () => {
					console.log("[Network] Connected to host");
					this.setupConnection(conn);
					this.emit({
						type: "connected",
						payload: { role: "guest" }
					});
					resolve();
				});
				conn.on("error", (err) => {
					console.error("[Network] Connection error:", err);
					this.emit({
						type: "error",
						payload: err
					});
					reject(err);
				});
			});
			this.peer.on("error", (err) => {
				console.error("[Network] Guest error:", err);
				this.emit({
					type: "error",
					payload: err
				});
				reject(err);
			});
		});
	}
	setupConnection(conn) {
		conn.on("data", (data) => {
			this.emit({
				type: "data",
				payload: data
			});
		});
		conn.on("close", () => {
			console.log("[Network] Connection closed");
			this.connection = null;
			this.emit({ type: "disconnected" });
		});
	}
	/** Отправить данные по сети */
	send(data) {
		if (!this.connection) {
			console.warn("[Network] No connection, cannot send");
			return false;
		}
		if (this.connection.open === false) {
			console.warn("[Network] Connection not open, cannot send");
			return false;
		}
		this.connection.send(data);
		return true;
	}
	/** Отключиться и уничтожить соединение */
	disconnect() {
		if (this.connection) {
			this.connection.close();
			this.connection = null;
		}
		if (this.peer) {
			this.peer.destroy();
			this.peer = null;
		}
		this.myRole = null;
		this.listeners = [];
	}
	get role() {
		return this.myRole;
	}
	get connected() {
		return this.connection !== null && this.connection.open;
	}
	get roomId() {
		return this.isHost ? this.myId : this.connection?.peer || "";
	}
};
//#endregion
//#region \0vite/preload-helper.js
var scriptRel = "modulepreload";
var assetsURL = function(dep) {
	return "/game-card-durak/" + dep;
};
var seen = {};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		const links = document.getElementsByTagName("link");
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		promise = allSettled(deps.map((dep) => {
			dep = assetsURL(dep, importerUrl);
			if (dep in seen) return;
			seen[dep] = true;
			const isCss = dep.endsWith(".css");
			const cssSelector = isCss ? "[rel=\"stylesheet\"]" : "";
			if (!!importerUrl) for (let i = links.length - 1; i >= 0; i--) {
				const link = links[i];
				if (link.href === dep && (!isCss || link.rel === "stylesheet")) return;
			}
			else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
			const link = document.createElement("link");
			link.rel = isCss ? "stylesheet" : scriptRel;
			if (!isCss) link.as = "script";
			link.crossOrigin = "";
			link.href = dep;
			if (cspNonce) link.setAttribute("nonce", cspNonce);
			document.head.appendChild(link);
			if (isCss) return new Promise((res, rej) => {
				link.addEventListener("load", res);
				link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
			});
		}));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
//#endregion
//#region src/engine/firebaseNetwork.ts
var FirebaseNetworkManager = class {
	_roomId = "";
	myId = "";
	myRole = null;
	myPlayerIndex = -1;
	_isHost = false;
	listeners = [];
	unsubscribeRoom = null;
	unsubscribePlayers = null;
	_connected = false;
	_players = [];
	heartbeatInterval = null;
	on(listener) {
		this.listeners.push(listener);
		return () => {
			this.listeners = this.listeners.filter((l) => l !== listener);
		};
	}
	onData(callback) {
		return this.on((event) => {
			if (event.type === "data") callback(event.payload);
		});
	}
	emit(event) {
		for (const listener of this.listeners) try {
			listener(event);
		} catch (e) {
			console.error("[FirebaseNetwork] Listener error:", e);
		}
	}
	/** Создать комнату (хост) */
	async host(maxPlayers = 2) {
		const roomId = this.generateRoomId();
		const hostId = this.generatePlayerId();
		this._roomId = roomId;
		this.myId = hostId;
		this._isHost = true;
		this.myRole = "host";
		this.myPlayerIndex = 0;
		await createRoom(roomId, hostId, "Игрок 1", maxPlayers);
		await this.registerAsPlayer(roomId, hostId, "Игрок 1", 0);
		this.startHeartbeat();
		this.startSubscriptions();
		this._connected = true;
		this.emit({
			type: "connected",
			payload: {
				role: "host",
				roomId
			}
		});
		return roomId;
	}
	/** Присоединиться к комнате (гость) */
	async join(roomId, playerName = "Игрок") {
		const playerId = this.generatePlayerId();
		if (!await roomExists(roomId)) throw new Error("Комната не найдена");
		const playerIndex = (await this.getRoomWithPlayers(roomId))?.playerCount ?? 0;
		if (!await joinRoom(roomId, playerId, `${playerName} ${playerIndex + 1}`, playerIndex)) throw new Error("Не удалось присоединиться к комнате (возможно, она заполнена или игра уже началась)");
		this._roomId = roomId;
		this.myId = playerId;
		this._isHost = false;
		this.myRole = "guest";
		this.myPlayerIndex = playerIndex;
		this.startHeartbeat();
		this.startSubscriptions();
		this._connected = true;
	}
	/** Отключиться */
	disconnect() {
		this.stopHeartbeat();
		this.stopSubscriptions();
		if (this._roomId && this.myId) leaveRoom(this._roomId, this.myId).catch(console.error);
		this._roomId = "";
		this.myId = "";
		this._isHost = false;
		this.myRole = null;
		this.myPlayerIndex = -1;
		this._connected = false;
		this._players = [];
		this.listeners = [];
	}
	/** Отправить данные */
	send(data) {
		if (!this._connected || !this._roomId) {
			console.warn("[FirebaseNetwork] Not connected, cannot send");
			return false;
		}
		if (this._isHost && data.type === "full_state") {
			updateGameState(this._roomId, data.state).catch(console.error);
			return true;
		}
		if (!this._isHost) {
			this.sendAction(data).catch(console.error);
			return true;
		}
		return false;
	}
	/** Отправить action (для гостей) */
	async sendAction(data) {
		const { getDb } = await __vitePreload(async () => {
			const { getDb } = await import("./firebase-B3PEc0cE.js");
			return { getDb };
		}, __vite__mapDeps([0,1,2]));
		const { doc, setDoc, serverTimestamp } = await __vitePreload(async () => {
			const { doc, setDoc, serverTimestamp } = await import("./index.esm-BXwIPdvF.js");
			return {
				doc,
				setDoc,
				serverTimestamp
			};
		}, __vite__mapDeps([3,2]));
		await setDoc(doc(getDb(), "durak_rooms", this._roomId, "actions", `${Date.now()}_${this.myId}`), {
			...data,
			playerId: this.myId,
			playerIndex: this.myPlayerIndex,
			timestamp: serverTimestamp()
		});
	}
	startSubscriptions() {
		this.unsubscribeRoom = subscribeRoom(this._roomId, (room) => {
			if (!room) {
				this.emit({ type: "disconnected" });
				return;
			}
			if (!this._isHost && room.gameState) this.emit({
				type: "data",
				payload: {
					type: "full_state",
					state: room.gameState,
					myPlayerIndex: this.myPlayerIndex
				}
			});
			if (room.status === "playing" && !this._connected) this._connected = true;
		});
		this.unsubscribePlayers = subscribePlayers(this._roomId, (players) => {
			this._players = players;
			if (this._isHost) this.pollActions().catch(console.error);
		});
	}
	stopSubscriptions() {
		if (this.unsubscribeRoom) {
			this.unsubscribeRoom();
			this.unsubscribeRoom = null;
		}
		if (this.unsubscribePlayers) {
			this.unsubscribePlayers();
			this.unsubscribePlayers = null;
		}
	}
	async pollActions() {
		const { getDb } = await __vitePreload(async () => {
			const { getDb } = await import("./firebase-B3PEc0cE.js");
			return { getDb };
		}, __vite__mapDeps([0,1,2]));
		const { collection, getDocs, query, orderBy, deleteDoc, doc } = await __vitePreload(async () => {
			const { collection, getDocs, query, orderBy, deleteDoc, doc } = await import("./index.esm-BXwIPdvF.js");
			return {
				collection,
				getDocs,
				query,
				orderBy,
				deleteDoc,
				doc
			};
		}, __vite__mapDeps([3,2]));
		(await getDocs(query(collection(getDb(), "durak_rooms", this._roomId, "actions"), orderBy("timestamp")))).forEach((docSnap) => {
			const action = docSnap.data();
			this.emit({
				type: "data",
				payload: {
					type: "action",
					action
				}
			});
			deleteDoc(doc(getDb(), "durak_rooms", this._roomId, "actions", docSnap.id)).catch(console.error);
		});
	}
	startHeartbeat() {
		this.heartbeatInterval = setInterval(() => {
			if (!this._roomId || !this.myId) return;
			__vitePreload(async () => {
				const { getPlayerRef } = await import("./firebase-B3PEc0cE.js");
				return { getPlayerRef };
			}, __vite__mapDeps([0,1,2])).then(({ getPlayerRef }) => {
				__vitePreload(async () => {
					const { updateDoc, serverTimestamp } = await import("./index.esm-BXwIPdvF.js");
					return {
						updateDoc,
						serverTimestamp
					};
				}, __vite__mapDeps([3,2])).then(({ updateDoc, serverTimestamp }) => {
					updateDoc(getPlayerRef(this._roomId, this.myId), {
						lastSeen: serverTimestamp(),
						connected: true
					}).catch(() => {});
				});
			});
		}, 1e4);
	}
	stopHeartbeat() {
		if (this.heartbeatInterval) {
			clearInterval(this.heartbeatInterval);
			this.heartbeatInterval = null;
		}
	}
	async registerAsPlayer(roomId, playerId, name, index) {
		const { getPlayerRef } = await __vitePreload(async () => {
			const { getPlayerRef } = await import("./firebase-B3PEc0cE.js");
			return { getPlayerRef };
		}, __vite__mapDeps([0,1,2]));
		const { setDoc, serverTimestamp } = await __vitePreload(async () => {
			const { setDoc, serverTimestamp } = await import("./index.esm-BXwIPdvF.js");
			return {
				setDoc,
				serverTimestamp
			};
		}, __vite__mapDeps([3,2]));
		await setDoc(getPlayerRef(roomId, playerId), {
			id: playerId,
			name,
			roomId,
			index,
			connected: true,
			lastSeen: serverTimestamp()
		});
	}
	async getRoomWithPlayers(roomId) {
		const { getRoom } = await __vitePreload(async () => {
			const { getRoom } = await import("./firebase-B3PEc0cE.js");
			return { getRoom };
		}, __vite__mapDeps([0,1,2]));
		return getRoom(roomId);
	}
	generateRoomId() {
		return Math.random().toString(36).substring(2, 8).toUpperCase();
	}
	generatePlayerId() {
		return `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
	}
	get role() {
		return this.myRole;
	}
	get roomId() {
		return this._roomId;
	}
	get id() {
		return this.myId;
	}
	get playerIndex() {
		return this.myPlayerIndex;
	}
	get isConnected() {
		return this._connected;
	}
	get playerList() {
		return this._players;
	}
};
//#endregion
//#region src/engine/netStore.ts
/**
* Zustand store для сетевой игры «Дурак»
* Универсальный — поддержка PeerJS и Firebase
* Хост авторитетен, гости отправляют actions
* Поддержка 2-6 игроков
*/
var unsubscribeGameStore = null;
var useNetStore = create((set, get) => ({
	network: null,
	backend: "peerjs",
	role: null,
	myPlayerIndex: -1,
	gameState: null,
	connected: false,
	error: null,
	roomId: null,
	players: [],
	initHost: (network, backend) => {
		const myPlayerIndex = 0;
		network.onData((data) => {
			const msg = data;
			if (msg.type === "action" && msg.action) executeAction(msg.action);
		});
		network.on((event) => {
			if (event.type === "disconnected") set({ connected: false });
			if (event.type === "error") set({ error: String(event.payload?.message || event.payload || "Network error") });
		});
		unsubscribeGameStore = useGameStore.subscribe((state) => {
			broadcastState(network, state);
		});
		set({
			network,
			backend,
			role: "host",
			myPlayerIndex,
			connected: true,
			error: null,
			roomId: "roomId" in network ? network.roomId : null
		});
	},
	initGuest: (network, backend) => {
		network.onData((data) => {
			const msg = data;
			if (msg.type === "full_state" && msg.state) set({
				gameState: msg.state,
				myPlayerIndex: msg.myPlayerIndex ?? 1
			});
		});
		network.on((event) => {
			if (event.type === "disconnected") set({ connected: false });
			if (event.type === "error") set({ error: String(event.payload?.message || event.payload || "Network error") });
		});
		set({
			network,
			backend,
			role: "guest",
			myPlayerIndex: 1,
			connected: true,
			error: null,
			roomId: "roomId" in network ? network.roomId : null
		});
	},
	sendAction: (action) => {
		const { network, backend } = get();
		if (!network) return;
		if (backend === "firebase") network.send({
			type: "action",
			action
		});
		else network.send({
			type: "action",
			action
		});
	},
	disconnect: () => {
		if (unsubscribeGameStore) {
			unsubscribeGameStore();
			unsubscribeGameStore = null;
		}
		const { network } = get();
		if (network) network.disconnect();
		set({
			network: null,
			backend: "peerjs",
			role: null,
			myPlayerIndex: -1,
			gameState: null,
			connected: false,
			error: null,
			roomId: null,
			players: []
		});
	}
}));
/** Хост выполняет действие гостя через gameStore */
function executeAction(action) {
	const store = useGameStore.getState();
	switch (action.type) {
		case "attack": {
			const activeIndex = store.activePlayerIndex ?? 0;
			const card = store.players[activeIndex]?.hand.find((c) => c.id === action.cardId);
			if (card) store.attack(card);
			break;
		}
		case "defend": {
			const defenderIndex = store.defenderIndex ?? 1;
			const defendCard = store.players[defenderIndex]?.hand.find((c) => c.id === action.defendCardId);
			if (defendCard) store.defend(action.attackCardId, defendCard);
			break;
		}
		case "take":
			store.take();
			break;
		case "pass":
			store.pass();
			break;
	}
}
/** Рассылка состояния гостям. Карты других игроков скрываются. */
function broadcastState(network, state) {
	const s = state ?? useGameStore.getState();
	if (network instanceof FirebaseNetworkManager) network.send({
		type: "full_state",
		state: s
	});
	else {
		const guestState = {
			...s,
			players: s.players.map((p, i) => i === 0 ? {
				...p,
				hand: []
			} : p)
		};
		network.send({
			type: "full_state",
			state: guestState,
			myPlayerIndex: 1
		});
	}
}
//#endregion
//#region node_modules/react/cjs/react-jsx-runtime.production.js
/**
* @license React
* react-jsx-runtime.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_jsx_runtime_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	function jsxProd(type, config, maybeKey) {
		var key = null;
		void 0 !== maybeKey && (key = "" + maybeKey);
		void 0 !== config.key && (key = "" + config.key);
		if ("key" in config) {
			maybeKey = {};
			for (var propName in config) "key" !== propName && (maybeKey[propName] = config[propName]);
		} else maybeKey = config;
		config = maybeKey.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== config ? config : null,
			props: maybeKey
		};
	}
	exports.jsx = jsxProd;
	exports.jsxs = jsxProd;
}));
//#endregion
//#region src/components/CardComponent.tsx
var import_jsx_runtime = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_jsx_runtime_production();
})))();
/** Ранг: краткое имя для углов и полное для центра */
function rankDisplay(rank) {
	switch (rank) {
		case 11: return {
			short: "В",
			full: "Valet"
		};
		case 12: return {
			short: "Д",
			full: "Queen"
		};
		case 13: return {
			short: "К",
			full: "King"
		};
		case 14: return {
			short: "Т",
			full: "Ace"
		};
		default: return {
			short: String(rank),
			full: String(rank)
		};
	}
}
function CardComponent({ card, trumpSuit, onClick, selected, disabled, faceDown, className = "", animating }) {
	if (faceDown) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `card-back ${className}` });
	const color = SUIT_COLORS[card.suit];
	const isTrump = trumpSuit && card.suit === trumpSuit;
	const symbol = SUIT_SYMBOLS[card.suit];
	const { short, full } = rankDisplay(card.rank);
	const isFaceCard = card.rank >= 11;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `playing-card ${color === "red" ? "card-red" : "card-black"} ${selected ? "selected" : ""} ${isTrump ? "trump-card" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${animating === "play" ? "card-play-anim" : animating === "take" ? "card-take-anim" : animating === "discard" ? "card-discard-anim" : ""} ${className}`,
		onClick: disabled ? void 0 : onClick,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `card-corner top-left ${color === "red" ? "text-red-600" : "text-gray-800"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "card-rank",
					children: short
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "card-suit-small",
					children: symbol
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `card-center ${color === "red" ? "text-red-600" : "text-gray-800"}`,
				children: isFaceCard ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-face",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "card-face-symbol",
						children: symbol
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "card-face-label",
						children: full
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "card-big-suit",
					children: symbol
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `card-corner bottom-right ${color === "red" ? "text-red-600" : "text-gray-800"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "card-rank",
					children: short
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "card-suit-small",
					children: symbol
				})]
			})
		]
	});
}
//#endregion
//#region node_modules/@vkontakte/vk-bridge/dist/index.js
function createCounter() {
	return {
		current: 0,
		next() {
			return ++this.current;
		}
	};
}
function createRequestResolver(instanceId) {
	const counter = createCounter();
	const promiseControllers = {};
	return {
		add(controller, customId) {
			const id = null != customId ? customId : `${counter.next()}_${instanceId}`;
			promiseControllers[id] = controller;
			return id;
		},
		resolve(requestId, data, isSuccess) {
			const requestPromise = promiseControllers[requestId];
			if (requestPromise) {
				if (isSuccess(data)) requestPromise.resolve(data);
				else requestPromise.reject(data);
				promiseControllers[requestId] = null;
			}
		}
	};
}
function promisifySend(sendEvent, subscribe, instanceId) {
	const requestResolver = createRequestResolver(instanceId);
	subscribe((event) => {
		if (!event.detail?.data || "object" != typeof event.detail.data) return;
		if ("request_id" in event.detail.data) {
			const { request_id: requestId, ...data } = event.detail.data;
			if (requestId) requestResolver.resolve(requestId, data, (data) => !("error_type" in data));
		}
	});
	return function(method, props = {}) {
		return new Promise((resolve, reject) => {
			const requestId = requestResolver.add({
				resolve,
				reject
			}, props.request_id);
			sendEvent(method, {
				...props,
				request_id: requestId
			});
		});
	};
}
function createInstanceId() {
	const allNumbersAndLetters = 36;
	const positionAfterZeroAnDot = 2;
	return Math.random().toString(allNumbersAndLetters).substring(positionAfterZeroAnDot, positionAfterZeroAnDot + 3);
}
var IS_CLIENT_SIDE = "u" > typeof window;
var IS_ANDROID_WEBVIEW = Boolean(IS_CLIENT_SIDE && window.AndroidBridge);
var IS_IOS_WEBVIEW = Boolean(IS_CLIENT_SIDE && window.webkit?.messageHandlers?.VKWebAppClose);
var IS_REACT_NATIVE_WEBVIEW = Boolean(IS_CLIENT_SIDE && window.ReactNativeWebView && "function" == typeof window.ReactNativeWebView.postMessage);
var IS_WEB = IS_CLIENT_SIDE && !IS_ANDROID_WEBVIEW && !IS_IOS_WEBVIEW;
var IS_MVK = IS_WEB && /(^\?|&)vk_platform=mobile_web(&|$)/.test(location.search);
var IS_DESKTOP_VK = IS_WEB && !IS_MVK;
var EVENT_TYPE = IS_WEB ? "message" : "VKWebAppEvent";
var DESKTOP_METHODS = [
	"VKWebAppInit",
	"VKWebAppGetCommunityAuthToken",
	"VKWebAppAddToCommunity",
	"VKWebAppAddToHomeScreenInfo",
	"VKWebAppClose",
	"VKWebAppCopyText",
	"VKWebAppCreateHash",
	"VKWebAppGetUserInfo",
	"VKWebAppSetLocation",
	"VKWebAppSendToClient",
	"VKWebAppGetClientVersion",
	"VKWebAppGetPhoneNumber",
	"VKWebAppGetEmail",
	"VKWebAppGetGroupInfo",
	"VKWebAppGetGeodata",
	"VKWebAppGetCommunityToken",
	"VKWebAppGetConfig",
	"VKWebAppGetLaunchParams",
	"VKWebAppSetTitle",
	"VKWebAppGetAuthToken",
	"VKWebAppCallAPIMethod",
	"VKWebAppJoinGroup",
	"VKWebAppLeaveGroup",
	"VKWebAppAllowMessagesFromGroup",
	"VKWebAppDenyNotifications",
	"VKWebAppAllowNotifications",
	"VKWebAppOpenPayForm",
	"VKWebAppOpenApp",
	"VKWebAppShare",
	"VKWebAppShowWallPostBox",
	"VKWebAppScroll",
	"VKWebAppShowOrderBox",
	"VKWebAppShowLeaderBoardBox",
	"VKWebAppShowInviteBox",
	"VKWebAppShowRequestBox",
	"VKWebAppAddToFavorites",
	"VKWebAppShowStoryBox",
	"VKWebAppStorageGet",
	"VKWebAppStorageGetKeys",
	"VKWebAppStorageSet",
	"VKWebAppFlashGetInfo",
	"VKWebAppSubscribeStoryApp",
	"VKWebAppOpenWallPost",
	"VKWebAppCheckAllowedScopes",
	"VKWebAppCheckBannerAd",
	"VKWebAppHideBannerAd",
	"VKWebAppShowBannerAd",
	"VKWebAppCheckNativeAds",
	"VKWebAppShowNativeAds",
	"VKWebAppRetargetingPixel",
	"VKWebAppConversionHit",
	"VKWebAppShowSubscriptionBox",
	"VKWebAppCheckSurvey",
	"VKWebAppShowSurvey",
	"VKWebAppScrollTop",
	"VKWebAppScrollTopStart",
	"VKWebAppScrollTopStop",
	"VKWebAppShowSlidesSheet",
	"VKWebAppTranslate",
	"VKWebAppRecommend",
	"VKWebAppAddToProfile",
	"VKWebAppGetFriends",
	...IS_DESKTOP_VK ? [
		"VKWebAppResizeWindow",
		"VKWebAppAddToMenu",
		"VKWebAppShowInstallPushBox",
		"VKWebAppShowCommunityWidgetPreviewBox",
		"VKWebAppCallStart",
		"VKWebAppCallJoin",
		"VKWebAppCallGetStatus"
	] : ["VKWebAppShowImages"]
];
var supportedHandlers;
var androidBridge = IS_CLIENT_SIDE ? window.AndroidBridge : void 0;
var iosBridge = IS_IOS_WEBVIEW ? window.webkit.messageHandlers : void 0;
var webBridge = IS_WEB ? parent : void 0;
function createVKBridge(version) {
	let webFrameId;
	const subscribers = [];
	const instanceId = createInstanceId();
	function send(method, props) {
		if (androidBridge?.[method]) androidBridge[method](JSON.stringify(props));
		else if (iosBridge?.[method] && "function" == typeof iosBridge[method].postMessage) iosBridge[method].postMessage?.(props);
		else if (IS_REACT_NATIVE_WEBVIEW) window.ReactNativeWebView.postMessage(JSON.stringify({
			handler: method,
			params: props
		}));
		else if (webBridge && "function" == typeof webBridge.postMessage) webBridge.postMessage({
			handler: method,
			params: props,
			type: "vk-connect",
			webFrameId,
			connectVersion: version
		}, "*");
	}
	function subscribe(listener) {
		subscribers.push(listener);
	}
	function unsubscribe(listener) {
		const index = subscribers.indexOf(listener);
		if (index > -1) subscribers.splice(index, 1);
	}
	function supportsInner(method) {
		if (IS_ANDROID_WEBVIEW) return !!(androidBridge && "function" == typeof androidBridge[method]);
		if (IS_IOS_WEBVIEW) return !!(iosBridge?.[method] && "function" == typeof iosBridge[method].postMessage);
		if (IS_WEB) return DESKTOP_METHODS.includes(method);
		return false;
	}
	function supports(method) {
		console.warn("bridge.supports method is deprecated. Use bridge.supportsAsync instead.");
		return supportsInner(method);
	}
	function isWebView() {
		return IS_IOS_WEBVIEW || IS_ANDROID_WEBVIEW;
	}
	function isIframe() {
		return IS_WEB && window.parent !== window;
	}
	function isEmbedded() {
		return isWebView() || isIframe();
	}
	function isStandalone() {
		return !isEmbedded();
	}
	function handleEvent(event) {
		if (IS_IOS_WEBVIEW || IS_ANDROID_WEBVIEW) return [...subscribers].map((fn) => fn.call(null, event));
		let bridgeEventData = event?.data;
		if (!IS_WEB || !bridgeEventData) return;
		if (IS_REACT_NATIVE_WEBVIEW && "string" == typeof bridgeEventData) try {
			bridgeEventData = JSON.parse(bridgeEventData);
		} catch {}
		const { type, data, frameId } = bridgeEventData;
		if (!type) return;
		if ("VKWebAppSettings" === type) {
			webFrameId = frameId;
			return;
		}
		[...subscribers].map((fn) => fn({ detail: {
			type,
			data
		} }));
	}
	if (IS_REACT_NATIVE_WEBVIEW && /(android)/i.test(navigator.userAgent)) document.addEventListener(EVENT_TYPE, handleEvent);
	else if ("u" > typeof window && "addEventListener" in window) window.addEventListener(EVENT_TYPE, handleEvent);
	const sendPromise = promisifySend(send, subscribe, instanceId);
	async function supportsAsync(method) {
		if (IS_ANDROID_WEBVIEW || IS_IOS_WEBVIEW) return supportsInner(method);
		if (supportedHandlers) return supportedHandlers.has(method);
		try {
			const response = await sendPromise("SetSupportedHandlers");
			supportedHandlers = new Set(response.supportedHandlers);
		} catch (_error) {
			supportedHandlers = new Set(["VKWebAppInit"]);
		}
		return supportedHandlers.has(method);
	}
	subscribe((event) => {
		if (!event.detail) return;
		switch (event.detail.type) {
			case "SetSupportedHandlers": supportedHandlers = new Set(event.detail.data.supportedHandlers);
		}
	});
	return {
		send: sendPromise,
		sendPromise,
		subscribe,
		unsubscribe,
		supports,
		supportsAsync,
		isWebView,
		isIframe,
		isEmbedded,
		isStandalone
	};
}
var src_bridge = createVKBridge({ rE: "3.0.1" }.rE);
var vkTheme = { theme: "light" };
var vkInitialized = false;
/**
* Проверка: запущено ли приложение внутри VK (Mini App)
*/
function isVKEnvironment() {
	if (typeof window === "undefined") return false;
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.has("vk_access_token_settings") || urlParams.has("vk_user_id") || urlParams.has("vk_app_id") || urlParams.has("vk_platform");
}
/**
* Инициализация VK Bridge
* Вызывается при старте приложения (из vk.html)
*/
async function initVK() {
	if (vkInitialized) return;
	try {
		await src_bridge.send("VKWebAppInit");
		vkInitialized = true;
		src_bridge.subscribe((event) => {
			if (event.type === "VKWebAppUpdateConfig") {
				const scheme = event.detail?.data?.scheme;
				if (scheme === "vkui_dark" || scheme === "space_gray") vkTheme = { theme: "dark" };
				else vkTheme = { theme: "light" };
				applyVKTheme(vkTheme.theme);
			}
		});
		try {
			const scheme = (await src_bridge.send("VKWebAppGetConfig"))?.scheme;
			if (scheme === "vkui_dark" || scheme === "space_gray") vkTheme = { theme: "dark" };
			else vkTheme = { theme: "light" };
			applyVKTheme(vkTheme.theme);
		} catch {}
		try {
			const userInfo = await src_bridge.send("VKWebAppGetUserInfo");
			if (userInfo) userInfo.id, userInfo.first_name, userInfo.last_name, userInfo.photo_100, userInfo.photo_200;
		} catch {}
	} catch (error) {
		console.error("[VK] Init failed:", error);
		vkInitialized = false;
	}
}
/**
* Применить VK тему к документу
*/
function applyVKTheme(theme) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	if (theme === "dark") {
		root.classList.add("vk-dark");
		root.classList.remove("vk-light");
	} else {
		root.classList.add("vk-light");
		root.classList.remove("vk-dark");
	}
}
//#endregion
//#region src/engine/vkNetwork.ts
/**
* VK Mini Apps Network Manager для игры «Дурак»
* Fallback вариант — игра внутри VK с друзьями
* Использует Firebase как бэкенд, но с VK-интеграцией:
* - VK Share для приглашений
* - VK Friends API для списка друзей
* - VK Bridge для уведомлений
*/
var VKNetworkManager = class extends FirebaseNetworkManager {
	/** Создать комнату с VK-приглашением */
	async hostWithVKInvite(maxPlayers = 2) {
		const roomId = await this.host(maxPlayers);
		if (isVKEnvironment()) try {
			await src_bridge.send("VKWebAppShare", { link: `https://vk.com/app{APP_ID}#room=${roomId}` });
		} catch (e) {
			console.warn("[VKNetwork] Share failed:", e);
		}
		return roomId;
	}
	/** Присоединиться через VK (по параметрам URL) */
	async joinFromVK(playerName = "Игрок") {
		if (typeof window === "undefined") throw new Error("VK join requires browser environment");
		const urlParams = new URLSearchParams(window.location.search);
		const roomId = urlParams.get("room") || urlParams.get("vk_room");
		if (!roomId) throw new Error("Не найден код комнаты в параметрах VK");
		await this.join(roomId, playerName);
	}
	/** Получить список друзей VK (если разрешено) */
	async getVKFriends() {
		if (!isVKEnvironment()) return [];
		try {
			const result = await src_bridge.send("VKWebAppGetFriends", { multi: false });
			if (result.users) return result.users.map((u) => ({
				id: u.id,
				name: `${u.first_name} ${u.last_name}`,
				photo: u.photo_100
			}));
		} catch (e) {
			console.warn("[VKNetwork] GetFriends failed:", e);
		}
		return [];
	}
	/** Отправить уведомление в VK (заготовка) */
	async sendVKNotification(message) {
		if (!isVKEnvironment()) return;
		try {
			await src_bridge.send("VKWebAppShowWallPostBox", { message });
		} catch (e) {
			console.warn("[VKNetwork] Notification failed:", e);
		}
	}
};
//#endregion
//#region src/components/NetworkScreen.tsx
/**
* Экран сетевой игры — создание/подключение к комнате
* Поддержка PeerJS (локальная сеть) и Firebase (интернет)
*/
function NetworkScreen({ onConnected, onBack }) {
	const [mode, setMode] = (0, import_react.useState)("choose");
	const [provider, setProvider] = (0, import_react.useState)("firebase");
	const [roomId, setRoomId] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [generatedRoomId, setGeneratedRoomId] = (0, import_react.useState)("");
	const [playerCount, setPlayerCount] = (0, import_react.useState)(2);
	const networkRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		return () => {
			if (networkRef.current && mode !== "choose") {}
		};
	}, []);
	const handleHost = async () => {
		setStatus("Создание комнаты...");
		setError("");
		try {
			if (provider === "firebase") {
				const network = new FirebaseNetworkManager();
				networkRef.current = network;
				network.on((event) => {
					if (event.type === "connected" && network.role === "host") {
						setStatus("Комната создана! Ожидание игроков...");
						setGeneratedRoomId(network.roomId);
					}
					if (event.type === "disconnected") setError("Соединение разорвано");
					if (event.type === "error") {
						setError(String(event.payload?.message || event.payload || "Ошибка"));
						setStatus("");
					}
				});
				const id = await network.host(playerCount);
				setGeneratedRoomId(id);
				setStatus(`Комната ${id} создана! Ожидание игроков...`);
				const checkInterval = setInterval(() => {
					if (network.playerList.length >= 2) {
						clearInterval(checkInterval);
						setStatus("Игроки подключены! Начинаем...");
						setTimeout(() => onConnected(network, "host", "firebase"), 300);
					}
				}, 1e3);
			} else if (provider === "vk") {
				const network = new VKNetworkManager();
				networkRef.current = network;
				network.on((event) => {
					if (event.type === "connected" && network.role === "host") {
						setStatus("Комната создана! Приглашение отправлено в VK...");
						setGeneratedRoomId(network.roomId);
					}
					if (event.type === "disconnected") setError("Соединение разорвано");
					if (event.type === "error") {
						setError(String(event.payload?.message || event.payload || "Ошибка"));
						setStatus("");
					}
				});
				const id = await network.hostWithVKInvite(playerCount);
				setGeneratedRoomId(id);
				setStatus(`Комната ${id} создана! Ожидание друзей из VK...`);
				const checkInterval = setInterval(() => {
					if (network.playerList.length >= 2) {
						clearInterval(checkInterval);
						setStatus("Друг подключился! Начинаем...");
						setTimeout(() => onConnected(network, "host", "firebase"), 300);
					}
				}, 1e3);
			} else {
				const network = new NetworkManager();
				networkRef.current = network;
				network.on((event) => {
					if (event.type === "connected" && network.role === "host") {
						setStatus("Игрок подключён! Начинаем...");
						setTimeout(() => onConnected(network, "host", "peerjs"), 300);
					}
					if (event.type === "disconnected") setError("Соединение разорвано");
					if (event.type === "error") {
						setError(String(event.payload?.message || event.payload || "Ошибка"));
						setStatus("");
					}
				});
				setGeneratedRoomId(await network.host());
				setStatus(`Комната создана! Ожидание второго игрока...`);
			}
		} catch (err) {
			setError(err.message || "Ошибка создания комнаты");
			setStatus("");
		}
	};
	const handleJoin = async () => {
		if (!roomId.trim()) {
			setError("Введите код комнаты");
			return;
		}
		setStatus("Подключение...");
		setError("");
		try {
			if (provider === "firebase" || provider === "vk") {
				const network = provider === "vk" ? new VKNetworkManager() : new FirebaseNetworkManager();
				networkRef.current = network;
				network.on((event) => {
					if (event.type === "error") {
						setError(String(event.payload?.message || event.payload || "Ошибка подключения"));
						setStatus("");
					}
				});
				await network.join(roomId.trim());
				setStatus("Подключено! Начинаем...");
				onConnected(network, "guest", "firebase");
			} else {
				const network = new NetworkManager();
				networkRef.current = network;
				network.on((event) => {
					if (event.type === "error") {
						setError(String(event.payload?.message || event.payload || "Ошибка подключения"));
						setStatus("");
					}
				});
				await network.join(roomId.trim());
				setStatus("Подключено! Начинаем...");
				onConnected(network, "guest", "peerjs");
			}
		} catch (err) {
			setError(err.message || "Ошибка подключения");
			setStatus("");
		}
	};
	const copyRoomId = () => {
		navigator.clipboard.writeText(generatedRoomId);
		setStatus("Код скопирован!");
	};
	const cancelHost = () => {
		if (networkRef.current) {
			networkRef.current.disconnect();
			networkRef.current = null;
		}
		setMode("choose");
		setGeneratedRoomId("");
		setStatus("");
		setError("");
	};
	if (mode === "choose") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "table-bg min-h-screen flex flex-col items-center justify-center gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-7xl mb-4",
				children: "🌐"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-bold text-yellow-300 drop-shadow-lg",
				children: "Сетевая игра"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-green-200 text-center max-w-sm",
				children: "Играйте с друзьями через интернет или локальную сеть."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMode("host_or_join"),
					className: "btn btn-primary text-xl px-8 py-3",
					children: "🎮 Играть онлайн"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onBack,
					className: "btn bg-gray-700 hover:bg-gray-600 text-white px-6 py-2",
					children: "← Назад"
				})]
			})
		]
	});
	if (mode === "host_or_join") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "table-bg min-h-screen flex flex-col items-center justify-center gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-6xl",
				children: "🎮"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-3xl font-bold text-yellow-300",
				children: "Сетевая игра"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 w-full max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("backend"),
						className: "btn btn-primary text-xl px-8 py-4",
						children: "🏠 Создать комнату"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("join"),
						className: "btn bg-green-700 hover:bg-green-600 text-white text-xl px-8 py-4",
						children: "🔗 Подключиться по коду"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("choose"),
						className: "btn bg-gray-700 hover:bg-gray-600 text-white px-6 py-2",
						children: "← Назад"
					})
				]
			})
		]
	});
	if (mode === "backend") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "table-bg min-h-screen flex flex-col items-center justify-center gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-6xl",
				children: "🔧"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-3xl font-bold text-yellow-300",
				children: "Выберите тип подключения"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 w-full max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setProvider("firebase");
							setMode("host");
							handleHost();
						},
						className: "btn btn-primary text-lg px-6 py-4 text-left",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl",
								children: "☁️"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold",
								children: "Firebase (Интернет)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm opacity-80",
								children: "Играйте из любой точки мира"
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setProvider("peerjs");
							setMode("host");
							handleHost();
						},
						className: "btn bg-blue-700 hover:bg-blue-600 text-white text-lg px-6 py-4 text-left",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl",
								children: "🏠"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold",
								children: "PeerJS (Локальная сеть)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm opacity-80",
								children: "Играйте по Wi-Fi дома"
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("host_or_join"),
						className: "btn bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 mt-2",
						children: "← Назад"
					})
				]
			})
		]
	});
	if (mode === "host") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "table-bg min-h-screen flex flex-col items-center justify-center gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-6xl",
				children: "🏠"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-3xl font-bold text-yellow-300",
				children: provider === "firebase" ? "Создание комнаты (Firebase)" : provider === "vk" ? "Создание комнаты (VK)" : "Создание комнаты (PeerJS)"
			}),
			provider === "firebase" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-green-200 text-sm",
					children: "Игроков:"
				}), [
					2,
					3,
					4,
					5,
					6
				].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setPlayerCount(n),
					className: `w-10 h-10 rounded-lg font-bold text-lg ${playerCount === n ? "bg-yellow-500 text-black" : "bg-frost-800 text-green-200 hover:bg-frost-700"}`,
					children: n
				}, n))]
			}),
			generatedRoomId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-black/40 rounded-xl p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-green-300 text-sm mb-2",
						children: "Код комнаты:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-3xl font-mono font-bold text-yellow-300 tracking-widest mb-3 select-all",
						children: generatedRoomId
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: copyRoomId,
						className: "btn btn-primary px-4 py-2 text-sm",
						children: "📋 Скопировать код"
					})
				]
			}),
			status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-green-200 text-sm whitespace-pre-line text-center",
				children: status
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-red-400 text-sm",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-green-300/60 text-sm text-center max-w-xs",
				children: provider === "firebase" ? "Отправьте код друзьям. Когда все подключатся, игра начнётся." : provider === "vk" ? "Приглашение отправлено в VK. Дождитесь друзей." : "Отправьте код другу. Когда он подключится, игра начнётся автоматически."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: cancelHost,
				className: "btn btn-danger px-6 py-2 mt-4",
				children: "Отмена"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "table-bg min-h-screen flex flex-col items-center justify-center gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-6xl",
				children: "🔗"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-3xl font-bold text-yellow-300",
				children: "Подключение"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setProvider("firebase"),
					className: `px-3 py-1 rounded text-sm ${provider === "firebase" ? "bg-yellow-500 text-black" : "bg-frost-800 text-green-200"}`,
					children: "☁️ Firebase"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setProvider("peerjs"),
					className: `px-3 py-1 rounded text-sm ${provider === "peerjs" ? "bg-yellow-500 text-black" : "bg-frost-800 text-green-200"}`,
					children: "🏠 PeerJS"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-black/40 rounded-xl p-6 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-green-300 text-sm mb-3",
					children: "Введите код комнаты:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: roomId,
					onChange: (e) => setRoomId(e.target.value.toUpperCase()),
					placeholder: "Код комнаты",
					className: "w-full text-center text-xl font-mono bg-frost-900 border border-frost-700 rounded-lg px-4 py-3 text-yellow-300 focus:outline-none focus:border-yellow-400",
					autoFocus: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: handleJoin,
				disabled: !roomId.trim(),
				className: "btn btn-primary text-xl px-8 py-3",
				children: "🎴 Подключиться"
			}),
			status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-green-200 text-sm",
				children: status
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-red-400 text-sm",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					setMode("host_or_join");
					setStatus("");
					setError("");
				},
				className: "btn bg-gray-700 hover:bg-gray-600 text-white px-6 py-2",
				children: "← Назад"
			})
		]
	});
}
//#endregion
//#region src/components/GameScreen.tsx
/**
* Главный экран игры «Дурак» — AI, hot-seat, сеть
*/
function GameScreen() {
	const store = useGameStore();
	const netStore = useNetStore();
	const [selectedCard, setSelectedCard] = (0, import_react.useState)(null);
	const [showNetwork, setShowNetwork] = (0, import_react.useState)(false);
	const prevTableRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const [newCardIds, setNewCardIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [clearing, setClearing] = (0, import_react.useState)(false);
	const isNetworkMode = netStore.role !== null;
	const myPlayerIndex = netStore.myPlayerIndex;
	const netGameState = netStore.gameState;
	const gameState = isNetworkMode ? netStore.role === "guest" ? netGameState : store : store;
	(0, import_react.useEffect)(() => {
		const table = gameState?.table || [];
		const lastAction = gameState?.lastAction || "";
		const currentIds = new Set(table.map((ac) => ac.attackCard.id));
		const prevIds = prevTableRef.current;
		const addedIds = /* @__PURE__ */ new Set();
		for (const id of currentIds) if (!prevIds.has(id)) addedIds.add(id);
		for (const ac of table) if (ac.defendCard) {
			const key = `defend-${ac.attackCard.id}`;
			if (!prevIds.has(key)) addedIds.add(key);
		}
		if (addedIds.size > 0) {
			setNewCardIds(addedIds);
			setTimeout(() => setNewCardIds(/* @__PURE__ */ new Set()), 350);
		}
		if (table.length === 0 && prevIds.size > 0 && lastAction === "Бито!") {
			setClearing(true);
			setTimeout(() => setClearing(false), 500);
		}
		const nextIds = new Set(table.map((ac) => ac.attackCard.id));
		table.forEach((ac) => {
			if (ac.defendCard) nextIds.add(`defend-${ac.attackCard.id}`);
		});
		prevTableRef.current = nextIds;
	}, [gameState?.table, gameState?.lastAction]);
	if (!gameState) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "table-bg min-h-screen flex flex-col items-center justify-center gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-6xl animate-pulse",
			children: "🃏"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-green-200",
			children: "Загрузка..."
		})]
	});
	const { deck, trumpSuit, trumpCard, players, table, phase, lastAction, winner, gameMode } = gameState;
	const { aiThinking } = store;
	const [playerCount, setPlayerCount] = (0, import_react.useState)(2);
	const isVK = isVKEnvironment();
	if (showNetwork && !isNetworkMode) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetworkScreen, {
		onConnected: (network, role, backend) => {
			setTimeout(() => {
				setShowNetwork(false);
				if (role === "host") {
					store.startGame("network");
					netStore.initHost(network, backend);
				} else netStore.initGuest(network, backend);
			}, 0);
		},
		onBack: () => setShowNetwork(false)
	});
	if (phase === "waiting" && !isNetworkMode) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "table-bg min-h-screen flex flex-col items-center justify-center gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-7xl mb-4",
				children: "🃏"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-5xl font-bold text-yellow-300 drop-shadow-lg",
				children: "Дурак"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xl text-green-200",
				children: "Классическая карточная игра"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => store.startGame("ai", playerCount),
						className: "btn btn-primary text-xl px-8 py-3",
						children: "🤖 Против компьютера"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-2 mt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-green-200 text-sm",
							children: "Игроков:"
						}), [
							2,
							3,
							4,
							5,
							6
						].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPlayerCount(n),
							className: `w-10 h-10 rounded-lg font-bold text-lg ${playerCount === n ? "bg-yellow-500 text-black" : "bg-frost-800 text-green-200 hover:bg-frost-700"}`,
							children: n
						}, n))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => store.startGame("hotseat"),
						className: "btn bg-green-700 hover:bg-green-600 text-white text-xl px-8 py-3",
						children: "👥 Hot-seat (на одном устройстве)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowNetwork(true),
						className: "btn bg-purple-700 hover:bg-purple-600 text-white text-xl px-8 py-3",
						children: "🌐 По сети"
					}),
					isVK && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setShowNetwork(true);
						},
						className: "btn bg-blue-600 hover:bg-blue-500 text-white text-xl px-8 py-3",
						children: "📱 VK Друзья"
					}),
					!isVK && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center text-sm text-blue-300/60 mt-2",
						children: "VK Mini App доступен внутри VK"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-green-300/50 text-sm mt-4",
				children: "36 карт • Козырь • Классические правила"
			})
		]
	});
	if (phase === "handoff" && !isNetworkMode) {
		const currentPlayerIndex = gameState.activePlayerIndex ?? gameState.defenderIndex ?? 1;
		const nextPlayer = players[currentPlayerIndex];
		const isAttacker = currentPlayerIndex === (gameState.attackerIndex ?? 0);
		const isDefender = currentPlayerIndex === (gameState.defenderIndex ?? 1);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "table-bg min-h-screen flex flex-col items-center justify-center gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-6xl mb-4",
					children: "🔄"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl font-bold text-yellow-300",
					children: "Передайте устройство"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-2xl text-green-200 font-semibold",
					children: [
						isAttacker ? "⚔️" : isDefender ? "🛡️" : "🔄",
						" ",
						nextPlayer.name
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-green-300/80",
					children: isAttacker ? "Ваш ход — атакуйте!" : isDefender ? "Вы защищаетесь!" : "Вы подкидываете!"
				}),
				trumpCard && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-green-300/60 text-sm mt-2",
					children: [
						"Козырь: ",
						SUIT_SYMBOLS[trumpSuit],
						" ",
						SUIT_NAMES[trumpSuit]
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => store.confirmHandoff(),
					className: "btn btn-primary text-xl px-8 py-3 mt-4",
					children: "👁️ Готов, вижу свои карты"
				})
			]
		});
	}
	if (phase === "game_over") {
		const isAiMode = gameMode === "ai";
		const playerWon = isNetworkMode ? winner === myPlayerIndex : isAiMode ? winner === 0 : winner !== null;
		const roundCount = gameState.roundCount || 1;
		const pc = gameState.playerCount ?? 2;
		const loserPlayer = players.find((p) => p.hand.length > 0);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "table-bg min-h-screen flex flex-col items-center justify-center gap-4 game-over-appear",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-8xl mb-2 game-over-emoji",
					children: winner === -1 ? "🤝" : playerWon ? "🎉" : "😅"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl sm:text-5xl font-bold text-yellow-300 drop-shadow-lg",
					children: winner === -1 ? "Ничья!" : isAiMode ? playerWon ? "Вы выиграли!" : "Вы — дурак! 🃏" : loserPlayer ? `${loserPlayer.name} — дурак!` : "Игра окончена!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-black/30 rounded-xl p-4 sm:p-6 mt-2 min-w-[300px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-ice-300 text-sm font-bold mb-3 text-center",
							children: "📊 Игроки"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1",
							children: players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex justify-between items-center px-3 py-1 rounded ${p.hand.length === 0 ? "bg-yellow-900/30" : loserPlayer?.id === p.id ? "bg-red-900/30" : "bg-black/20"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: p.hand.length === 0 ? "text-yellow-300 font-bold" : loserPlayer?.id === p.id ? "text-red-400" : "text-green-200",
									children: [
										p.hand.length === 0 ? "👑" : loserPlayer?.id === p.id ? "🃏" : "✅",
										" ",
										p.name
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-green-300/60 text-xs",
									children: [
										p.hand.length,
										" карт • ",
										p.takenCount,
										" взятий"
									]
								})]
							}, p.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2 mt-3 text-center text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-yellow-300 text-xl font-bold",
									children: roundCount
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-green-300/70",
									children: "Раундов"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-green-300 text-xl font-bold",
									children: gameState.discardPile?.length || 0
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-green-300/70",
									children: "В отборе"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-ice-200 text-xl font-bold",
									children: SUIT_SYMBOLS[trumpSuit]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-green-300/70",
									children: "Козырь"
								})] })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (isNetworkMode) netStore.disconnect();
							store.startGame(gameMode, pc);
						},
						className: "btn btn-primary text-lg px-6 py-3",
						children: "🔄 Ещё раз"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (isNetworkMode) netStore.disconnect();
							store.resetGame();
						},
						className: "btn btn-danger px-6 py-2",
						children: "В меню"
					})]
				})
			]
		});
	}
	const myIndex = isNetworkMode ? myPlayerIndex : 0;
	const defenderIdx = gameState.defenderIndex ?? 1;
	const attackerIdx = gameState.attackerIndex ?? 0;
	const activeIdx = gameState.activePlayerIndex ?? 0;
	const pc = gameState.playerCount ?? 2;
	const myHand = isNetworkMode ? players[myPlayerIndex]?.hand || [] : players[myIndex]?.hand || [];
	const amIAttacker = myIndex === attackerIdx;
	const amIDefender = myIndex === defenderIdx;
	const amIThrower = !amIAttacker && !amIDefender && myIndex !== defenderIdx;
	const amIActive = myIndex === activeIdx;
	const myRole = amIAttacker ? "⚔️ Атака" : amIDefender ? "🛡️ Защита" : amIThrower ? "🔄 Подкидывает" : "⏳ Ожидание";
	const doAttack = (card) => {
		if (isNetworkMode && netStore.role === "guest") netStore.sendAction({
			type: "attack",
			cardId: card.id
		});
		store.attack(card);
		setSelectedCard(null);
	};
	const doDefend = (attackCardId, defendCard) => {
		if (isNetworkMode && netStore.role === "guest") netStore.sendAction({
			type: "defend",
			attackCardId,
			defendCardId: defendCard.id
		});
		store.defend(attackCardId, defendCard);
		setSelectedCard(null);
	};
	const doTake = () => {
		if (isNetworkMode && netStore.role === "guest") netStore.sendAction({ type: "take" });
		store.take();
	};
	const doPass = () => {
		if (isNetworkMode && netStore.role === "guest") netStore.sendAction({ type: "pass" });
		store.pass();
	};
	const otherPlayers = players.map((p, i) => ({
		...p,
		index: i
	})).filter((p) => p.index !== myIndex);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "table-bg min-h-screen flex flex-col h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "top-panel flex justify-between items-center px-3 py-2 bg-black/30 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-green-200",
						children: ["Козырь: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-yellow-300 font-bold",
							children: [
								SUIT_SYMBOLS[trumpSuit],
								" ",
								SUIT_NAMES[trumpSuit]
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-green-200",
						children: [
							"📦 ",
							deck.length,
							" | ♻️ ",
							gameState.discardPile?.length || 0,
							" | 👥 ",
							pc
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [isNetworkMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: netStore.connected ? "text-green-400" : "text-red-400",
							children: netStore.connected ? "🟢" : "🔴"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-yellow-300 font-semibold",
							children: aiThinking ? "🤔 Думает..." : myRole
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-2 px-3 py-2",
				children: otherPlayers.map((p) => {
					const isDefender = p.index === defenderIdx;
					const isAttacker = p.index === attackerIdx;
					const isActive = p.index === activeIdx;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg ${isActive ? "bg-yellow-900/30 ring-1 ring-yellow-500" : "bg-black/20"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `text-xs font-medium ${isActive ? "text-yellow-300" : "text-green-200/60"}`,
							children: [
								isAttacker ? "⚔️" : isDefender ? "🛡️" : "🔄",
								" ",
								p.name,
								" (",
								p.hand?.length || 0,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-0.5",
							children: [Array.from({ length: Math.min(p.hand?.length || 0, 10) }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "card-back mini-card",
								style: {
									width: "18px",
									height: "26px"
								}
							}, i)), (p.hand?.length || 0) > 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-green-300",
								children: ["+", p.hand.length - 10]
							})]
						})]
					}, p.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col items-center justify-center gap-3 px-4",
				children: [deck.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 mb-2",
					children: [trumpCard && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardComponent, {
						card: trumpCard,
						trumpSuit,
						className: "rotate-90 scale-75"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [deck.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card-back absolute -top-1 -left-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "card-back" })]
					})]
				}), table.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-3 justify-center",
					children: table.map((ac) => {
						const isNewAttack = newCardIds.has(ac.attackCard.id);
						const isNewDefend = ac.defendCard && newCardIds.has(`defend-${ac.attackCard.id}`);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `relative ${!ac.defendCard && amIDefender && amIActive ? "ring-2 ring-yellow-400 rounded-lg cursor-pointer hover:ring-yellow-300" : ""}`,
								onClick: () => !ac.defendCard && amIDefender && amIActive && handleDefend(ac.attackCard.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardComponent, {
									card: ac.attackCard,
									trumpSuit,
									animating: isNewAttack ? "play" : void 0
								}), !ac.defendCard && amIDefender && amIActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute -top-2 -right-2 text-xs bg-yellow-400 text-black rounded-full w-5 h-5 flex items-center justify-center font-bold",
									children: "?"
								})]
							}), ac.defendCard && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardComponent, {
								card: ac.defendCard,
								trumpSuit,
								className: "-mt-3",
								animating: isNewDefend ? "play" : void 0
							})]
						}, ac.attackCard.id);
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-green-200/40 text-lg",
					children: clearing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cards-clear text-2xl font-bold text-green-300",
						children: "✅ Бито!"
					}) : amIActive ? amIAttacker ? "Ваш ход — атакуйте!" : amIDefender ? "Отбивайтесь или возьмите!" : amIThrower ? "Подкиньте карту или пас" : "Ожидайте..." : "Ожидайте свой ход..."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-center gap-3 py-2 px-4 flex-wrap",
				children: [
					amIDefender && amIActive && table.some((ac) => !ac.defendCard) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: doTake,
						className: "btn btn-danger",
						disabled: aiThinking,
						children: [
							"📥 Взять (",
							table.reduce((n, ac) => n + (ac.defendCard ? 0 : 1), 0),
							" карт)"
						]
					}),
					(amIAttacker || amIThrower) && amIActive && table.length > 0 && table.every((ac) => ac.defendCard) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: doPass,
						className: "btn btn-success",
						disabled: aiThinking,
						children: "✅ Бито!"
					}),
					amIThrower && amIActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: doPass,
						className: "btn bg-gray-700 hover:bg-gray-600 text-white",
						disabled: aiThinking,
						children: "Пас"
					}),
					isNetworkMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							netStore.disconnect();
							store.resetGame();
						},
						className: "btn bg-red-900 hover:bg-red-800 text-white text-xs px-3 py-1",
						children: "✕ Выйти"
					})
				]
			}),
			amIDefender && selectedCard && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center text-yellow-300 text-sm py-1",
				children: [
					"Нажмите на карту атаки, чтобы отбить ",
					RANK_NAMES[selectedCard.rank],
					SUIT_SYMBOLS[selectedCard.suit]
				]
			}),
			netStore.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center text-red-400 text-sm py-1 bg-red-900/30",
				children: ["⚠️ ", netStore.error]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "player-hand flex justify-start gap-1 px-4 py-3 bg-black/30 min-h-[100px] flex-wrap items-end",
				children: myHand.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardComponent, {
					card,
					trumpSuit,
					selected: selectedCard?.id === card.id,
					onClick: () => {
						if (aiThinking || !amIActive) return;
						if (amIDefender) setSelectedCard(card);
						else if (amIAttacker || amIThrower) doAttack(card);
					},
					disabled: aiThinking || !amIActive
				}, card.id))
			}),
			lastAction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center text-green-200/70 text-xs py-1 bg-black/20",
				children: lastAction
			})
		]
	});
	function handleDefend(attackCardId) {
		if (selectedCard) doDefend(attackCardId, selectedCard);
	}
}
//#endregion
//#region src/main.tsx
(0, import_client.createRoot)(document.getElementById("root")).render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameScreen, {}));
if (isVKEnvironment() || !!window.__VK_ENV__) initVK().catch(console.error);
//#endregion
