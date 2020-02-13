(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

window.dom = require('@clubajax/dom');
window.on = require('@clubajax/on');
window.nodash = require('@clubajax/no-dash');

var BaseComponent = require('@clubajax/base-component');

BaseComponent.destroyOnDisconnect = true;

require('../index');

},{"../index":2,"@clubajax/base-component":4,"@clubajax/dom":8,"@clubajax/no-dash":10,"@clubajax/on":11}],2:[function(require,module,exports){
"use strict";

require('./src/ui-input');

require('./src/ui-checkbox');

require('./src/ui-radio');

require('./src/ui-radio-buttons');

require('./src/ui-list');

require('./src/ui-popup');

require('./src/ui-dropdown');

require('./src/ui-search');

require('./src/ui-tooltip');

var iconMap = require('./src/lib/icon-map');

module.exports = {
  iconMap: iconMap
};

},{"./src/lib/icon-map":14,"./src/ui-checkbox":16,"./src/ui-dropdown":17,"./src/ui-input":19,"./src/ui-list":20,"./src/ui-popup":21,"./src/ui-radio":23,"./src/ui-radio-buttons":22,"./src/ui-search":24,"./src/ui-tooltip":25}],3:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var _on = require('@clubajax/on');

var BaseComponent =
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(BaseComponent, _HTMLElement);

  function BaseComponent() {
    var _this;

    _classCallCheck(this, BaseComponent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BaseComponent).call(this));
    _this._uid = uid(_this.localName);
    privates[_this._uid] = {
      DOMSTATE: 'created'
    };
    privates[_this._uid].handleList = [];
    plugin('init', _assertThisInitialized(_this));
    return _this;
  }

  _createClass(BaseComponent, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      privates[this._uid].DOMSTATE = privates[this._uid].domReadyFired ? 'domready' : 'connected';
      plugin('preConnected', this);
      nextTick(onCheckDomReady.bind(this));

      if (this.connected) {
        this.connected();
      }

      this.fire('connected');
      plugin('postConnected', this);
    }
  }, {
    key: "onConnected",
    value: function onConnected(callback) {
      var _this2 = this;

      if (this.DOMSTATE === 'connected' || this.DOMSTATE === 'domready') {
        callback(this);
        return;
      }

      this.once('connected', function () {
        callback(_this2);
      });
    }
  }, {
    key: "onDomReady",
    value: function onDomReady(callback) {
      var _this3 = this;

      if (this.DOMSTATE === 'domready') {
        callback(this);
        return;
      }

      this.once('domready', function () {
        callback(_this3);
      });
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      var _this4 = this;

      privates[this._uid].DOMSTATE = 'disconnected';
      plugin('preDisconnected', this);

      if (this.disconnected) {
        this.disconnected();
      }

      this.fire('disconnected');
      var time,
          dod = BaseComponent.destroyOnDisconnect;

      if (dod) {
        time = typeof dod === 'number' ? doc : 300;
        setTimeout(function () {
          if (_this4.DOMSTATE === 'disconnected') {
            _this4.destroy();
          }
        }, time);
      }
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(attrName, oldVal, newVal) {
      if (!this.isSettingAttribute) {
        newVal = BaseComponent.normalize(newVal);
        plugin('preAttributeChanged', this, attrName, newVal, oldVal);

        if (this.attributeChanged && BaseComponent.normalize(oldVal) !== newVal) {
          this.attributeChanged(attrName, newVal, oldVal);
        }
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.fire('destroy');

      privates[this._uid].handleList.forEach(function (handle) {
        handle.remove();
      });

      _destroy(this);
    }
  }, {
    key: "fire",
    value: function fire(eventName, eventDetail, bubbles) {
      return _on.fire(this, eventName, eventDetail, bubbles);
    }
  }, {
    key: "emit",
    value: function emit(eventName, value) {
      return _on.emit(this, eventName, value);
    }
  }, {
    key: "on",
    value: function on(node, eventName, selector, callback) {
      return this.registerHandle(typeof node !== 'string' ? // no node is supplied
      _on(node, eventName, selector, callback) : _on(this, node, eventName, selector));
    }
  }, {
    key: "once",
    value: function once(node, eventName, selector, callback) {
      return this.registerHandle(typeof node !== 'string' ? // no node is supplied
      _on.once(node, eventName, selector, callback) : _on.once(this, node, eventName, selector, callback));
    }
  }, {
    key: "attr",
    value: function attr(key, value, toggle) {
      this.isSettingAttribute = true;
      var add = toggle === undefined ? true : !!toggle;

      if (add) {
        this.setAttribute(key, value);
      } else {
        this.removeAttribute(key);
      }

      this.isSettingAttribute = false;
    }
  }, {
    key: "registerHandle",
    value: function registerHandle(handle) {
      privates[this._uid].handleList.push(handle);

      return handle;
    }
  }, {
    key: "DOMSTATE",
    get: function get() {
      return privates[this._uid].DOMSTATE;
    }
  }], [{
    key: "clone",
    value: function clone(template) {
      if (template.content && template.content.children) {
        return document.importNode(template.content, true);
      }

      var frag = document.createDocumentFragment();
      var cloneNode = document.createElement('div');
      cloneNode.innerHTML = template.innerHTML;

      while (cloneNode.children.length) {
        frag.appendChild(cloneNode.children[0]);
      }

      return frag;
    }
  }, {
    key: "addPlugin",
    value: function addPlugin(plug) {
      var i,
          order = plug.order || 100;

      if (!plugins.length) {
        plugins.push(plug);
      } else if (plugins.length === 1) {
        if (plugins[0].order <= order) {
          plugins.push(plug);
        } else {
          plugins.unshift(plug);
        }
      } else if (plugins[0].order > order) {
        plugins.unshift(plug);
      } else {
        for (i = 1; i < plugins.length; i++) {
          if (order === plugins[i - 1].order || order > plugins[i - 1].order && order < plugins[i].order) {
            plugins.splice(i, 0, plug);
            return;
          }
        } // was not inserted...


        plugins.push(plug);
      }
    }
  }, {
    key: "destroyOnDisconnect",
    set: function set(value) {
      privates['destroyOnDisconnect'] = value;
    },
    get: function get() {
      return privates['destroyOnDisconnect'];
    }
  }]);

  return BaseComponent;
}(_wrapNativeSuper(HTMLElement));

var privates = {},
    plugins = [];

function plugin(method, node, a, b, c) {
  plugins.forEach(function (plug) {
    if (plug[method]) {
      plug[method](node, a, b, c);
    }
  });
}

function onCheckDomReady() {
  if (this.DOMSTATE !== 'connected' || privates[this._uid].domReadyFired) {
    return;
  }

  var count = 0,
      children = getChildCustomNodes(this),
      ourDomReady = onSelfDomReady.bind(this);

  function addReady() {
    count++;

    if (count === children.length) {
      ourDomReady();
    }
  } // If no children, we're good - leaf node. Commence with onDomReady
  //


  if (!children.length) {
    ourDomReady();
  } else {
    // else, wait for all children to fire their `ready` events
    //
    children.forEach(function (child) {
      // check if child is already ready
      // also check for connected - this handles moving a node from another node
      // NOPE, that failed. removed for now child.DOMSTATE === 'connected'
      if (child.DOMSTATE === 'domready') {
        addReady();
      } // if not, wait for event


      child.on('domready', addReady);
    });
  }
}

function onSelfDomReady() {
  privates[this._uid].DOMSTATE = 'domready'; // domReady should only ever fire once

  privates[this._uid].domReadyFired = true;
  plugin('preDomReady', this); // call this.domReady first, so that the component
  // can finish initializing before firing any
  // subsequent events

  if (this.domReady) {
    this.domReady();

    this.domReady = function () {};
  } // allow component to fire this event
  // domReady() will still be called


  if (!this.fireOwnDomready) {
    this.fire('domready');
  }

  plugin('postDomReady', this);
}

function getChildCustomNodes(node) {
  // collect any children that are custom nodes
  // used to check if their dom is ready before
  // determining if this is ready
  var i,
      nodes = [];

  for (i = 0; i < node.children.length; i++) {
    if (node.children[i].nodeName.indexOf('-') > -1) {
      nodes.push(node.children[i]);
    }
  }

  return nodes;
}

function nextTick(cb) {
  requestAnimationFrame(cb);
}

var uids = {};

function uid() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'uid';

  if (uids[type] === undefined) {
    uids[type] = 0;
  }

  var id = type + '-' + (uids[type] + 1);
  uids[type]++;
  return id;
}

var destroyer = document.createElement('div');

function _destroy(node) {
  if (node) {
    destroyer.appendChild(node);
    destroyer.innerHTML = '';
  }
}

function makeGlobalListeners(name, eventName) {
  window[name] = function (nodeOrNodes, callback) {
    function handleDomReady(node, cb) {
      function onReady() {
        cb(node);
        node.removeEventListener(eventName, onReady);
      }

      if (node.DOMSTATE === eventName || node.DOMSTATE === 'domready') {
        cb(node);
      } else {
        node.addEventListener(eventName, onReady);
      }
    }

    if (!Array.isArray(nodeOrNodes)) {
      handleDomReady(nodeOrNodes, callback);
      return;
    }

    var count = 0;

    function onArrayNodeReady() {
      count++;

      if (count === nodeOrNodes.length) {
        callback(nodeOrNodes);
      }
    }

    for (var i = 0; i < nodeOrNodes.length; i++) {
      handleDomReady(nodeOrNodes[i], onArrayNodeReady);
    }
  };
}

makeGlobalListeners('onDomReady', 'domready');
makeGlobalListeners('onConnected', 'connected');

function testOptions(options) {
  var tests = {
    'prop': 'props',
    'bool': 'bools',
    'attr': 'attrs',
    'properties': 'props',
    'booleans': 'bools',
    'property': 'props',
    'boolean': 'bools'
  };
  Object.keys(tests).forEach(function (key) {
    if (options[key]) {
      console.error("BaseComponent.define found \"".concat(key, "\"; Did you mean: \"").concat(tests[key], "\"?"));
    }
  });
}

BaseComponent.injectProps = function (Constructor, _ref) {
  var _ref$props = _ref.props,
      props = _ref$props === void 0 ? [] : _ref$props,
      _ref$bools = _ref.bools,
      bools = _ref$bools === void 0 ? [] : _ref$bools,
      _ref$attrs = _ref.attrs,
      attrs = _ref$attrs === void 0 ? [] : _ref$attrs;
  Constructor.bools = [].concat(_toConsumableArray(Constructor.bools || []), _toConsumableArray(bools));
  Constructor.props = [].concat(_toConsumableArray(Constructor.props || []), _toConsumableArray(props));
  Constructor.attrs = [].concat(_toConsumableArray(Constructor.attrs || []), _toConsumableArray(attrs));
  Constructor.observedAttributes = [].concat(_toConsumableArray(Constructor.bools), _toConsumableArray(Constructor.props), _toConsumableArray(Constructor.attrs));
};

BaseComponent.define = function (tagName, Constructor) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  testOptions(options);
  BaseComponent.injectProps(Constructor, options);
  customElements.define(tagName, Constructor);
  return Constructor;
};

module.exports = BaseComponent;

},{"@clubajax/on":11}],4:[function(require,module,exports){
"use strict";

module.exports = require('@clubajax/base-component/src/BaseComponent');

require('@clubajax/base-component/src/template');

require('@clubajax/base-component/src/properties');

require('@clubajax/base-component/src/refs');

},{"@clubajax/base-component/src/BaseComponent":3,"@clubajax/base-component/src/properties":5,"@clubajax/base-component/src/refs":6,"@clubajax/base-component/src/template":7}],5:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var BaseComponent = require('./BaseComponent');

function setBoolean(node, prop) {
  var propValue;
  Object.defineProperty(node, prop, {
    enumerable: true,
    configurable: true,
    get: function get() {
      var att = this.getAttribute(prop);
      return att !== undefined && att !== null && att !== 'false' && att !== false;
    },
    set: function set(value) {
      var _this = this;

      this.isSettingAttribute = true;
      value = value !== false && value !== null && value !== undefined;

      if (value) {
        this.setAttribute(prop, '');
      } else {
        this.removeAttribute(prop);
      }

      if (this.attributeChanged) {
        this.attributeChanged(prop, value);
      }

      var fn = this[onify(prop)];

      if (fn) {
        var eventName = this.propsOnReady ? 'onDomReady' : 'onConnected';
        window[eventName](this, function () {
          if (value !== undefined && propValue !== value) {
            value = fn.call(_this, value) || value;
          }

          propValue = value;
        });
      }

      this.isSettingAttribute = false;
    }
  });
}

function setProperty(node, prop) {
  var propValue;
  Object.defineProperty(node, prop, {
    enumerable: true,
    configurable: true,
    get: function get() {
      return propValue !== undefined ? propValue : normalize(this.getAttribute(prop));
    },
    set: function set(value) {
      var _this2 = this;

      this.isSettingAttribute = true;

      if (_typeof(value) === 'object') {
        propValue = value;
      } else {
        this.setAttribute(prop, value);

        if (this.attributeChanged) {
          this.attributeChanged(prop, value);
        }
      }

      var fn = this[onify(prop)];

      if (fn) {
        var eventName = this.propsOnReady ? 'onDomReady' : 'onConnected';
        window[eventName](this, function () {
          if (value !== undefined) {
            propValue = value;
          }

          value = fn.call(_this2, value) || value;
        });
      }

      this.isSettingAttribute = false;
    }
  });
}

function setProperties(node) {
  var props = node.constructor.props || node.props;

  if (props) {
    props.forEach(function (prop) {
      if (prop === 'disabled') {
        setBoolean(node, prop);
      } else {
        setProperty(node, prop);
      }
    });
  }
}

function setBooleans(node) {
  var props = node.constructor.bools || node.bools;

  if (props) {
    props.forEach(function (prop) {
      setBoolean(node, prop);
    });
  }
}

function cap(name) {
  return name.substring(0, 1).toUpperCase() + name.substring(1);
}

function onify(name) {
  return 'on' + name.split('-').map(function (word) {
    return cap(word);
  }).join('');
}

function isBool(node, name) {
  return (node.bools || node.booleans || []).indexOf(name) > -1;
}

function boolNorm(value) {
  if (value === '') {
    return true;
  }

  return normalize(value);
}

function normalize(val) {
  if (typeof val === 'string') {
    val = val.trim();

    if (val === 'false') {
      return false;
    } else if (val === 'null') {
      return null;
    } else if (val === 'true') {
      return true;
    } // finds strings that start with numbers, but are not numbers:
    // '1team' '123 Street', '1-2-3', etc


    if (('' + val).replace(/-?\d*\.?\d*/, '').length) {
      return val;
    }
  }

  if (!isNaN(parseFloat(val))) {
    return parseFloat(val);
  }

  return val;
}

BaseComponent.normalize = normalize;
BaseComponent.addPlugin({
  name: 'properties',
  order: 10,
  init: function init(node) {
    setProperties(node);
    setBooleans(node);
  },
  preAttributeChanged: function preAttributeChanged(node, name, value) {
    if (node.isSettingAttribute) {
      return false;
    }

    if (isBool(node, name)) {
      value = boolNorm(value);
      node[name] = !!value;

      if (!value) {
        node[name] = false;
        node.isSettingAttribute = true;
        node.removeAttribute(name);
        node.isSettingAttribute = false;
      } else {
        node[name] = true;
      }

      return;
    }

    var v = normalize(value);
    node[name] = v;
  }
});

},{"./BaseComponent":3}],6:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var BaseComponent = require('./BaseComponent');

function assignRefs(node) {
  _toConsumableArray(node.querySelectorAll('[ref]')).forEach(function (child) {
    var name = child.getAttribute('ref');
    child.removeAttribute('ref');
    node[name] = child;
  });
}

function assignEvents(node) {
  // <div on="click:onClick">
  _toConsumableArray(node.querySelectorAll('[on]')).forEach(function (child, i, children) {
    if (child === node) {
      return;
    }

    var keyValue = child.getAttribute('on'),
        event = keyValue.split(':')[0].trim(),
        method = keyValue.split(':')[1].trim(); // remove, so parent does not try to use it

    child.removeAttribute('on');
    node.on(child, event, function (e) {
      node[method](e);
    });
  });
}

BaseComponent.addPlugin({
  name: 'refs',
  order: 30,
  preConnected: function preConnected(node) {
    assignRefs(node);
    assignEvents(node);
  }
});

},{"./BaseComponent":3}],7:[function(require,module,exports){
"use strict";

var BaseComponent = require('./BaseComponent');

var lightNodes = {};
var inserted = {};

function insert(node) {
  if (inserted[node._uid] || !hasTemplate(node)) {
    return;
  }

  collectLightNodes(node);
  insertTemplate(node);
  inserted[node._uid] = true;
}

function collectLightNodes(node) {
  lightNodes[node._uid] = lightNodes[node._uid] || [];

  while (node.childNodes.length) {
    lightNodes[node._uid].push(node.removeChild(node.childNodes[0]));
  }
}

function hasTemplate(node) {
  return node.templateString || node.templateId;
}

function insertTemplateChain(node) {
  var templates = node.getTemplateChain();
  templates.reverse().forEach(function (template) {
    getContainer(node).appendChild(BaseComponent.clone(template));
  });
  insertChildren(node);
}

function insertTemplate(node) {
  if (node.nestedTemplate) {
    insertTemplateChain(node);
    return;
  }

  var templateNode = node.getTemplateNode();

  if (templateNode) {
    node.appendChild(BaseComponent.clone(templateNode));
  }

  insertChildren(node);
}

function getContainer(node) {
  var containers = node.querySelectorAll('[ref="container"]');

  if (!containers || !containers.length) {
    return node;
  }

  return containers[containers.length - 1];
}

function insertChildren(node) {
  var i;
  var container = getContainer(node);
  var children = lightNodes[node._uid];

  if (container && children && children.length) {
    for (i = 0; i < children.length; i++) {
      container.appendChild(children[i]);
    }
  }
}

function toDom(html) {
  var node = document.createElement('div');
  node.innerHTML = html;
  return node.firstChild;
}

BaseComponent.prototype.getLightNodes = function () {
  return lightNodes[this._uid];
};

BaseComponent.prototype.getTemplateNode = function () {
  // caching causes different classes to pull the same template - wat?
  //if(!this.templateNode) {
  if (this.templateId) {
    this.templateNode = document.getElementById(this.templateId.replace('#', ''));
  } else if (this.templateString) {
    this.templateNode = toDom('<template>' + this.templateString + '</template>');
  } //}


  return this.templateNode;
};

BaseComponent.prototype.getTemplateChain = function () {
  var context = this,
      templates = [],
      template; // walk the prototype chain; Babel doesn't allow using
  // `super` since we are outside of the Class

  while (context) {
    context = Object.getPrototypeOf(context);

    if (!context) {
      break;
    } // skip prototypes without a template
    // (else it will pull an inherited template and cause duplicates)


    if (context.hasOwnProperty('templateString') || context.hasOwnProperty('templateId')) {
      template = context.getTemplateNode();

      if (template) {
        templates.push(template);
      }
    }
  }

  return templates;
};

BaseComponent.addPlugin({
  name: 'template',
  order: 20,
  preConnected: function preConnected(node) {
    insert(node);
  }
});

},{"./BaseComponent":3}],8:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* UMD.define */
(function (root, factory) {
  if (typeof customLoader === 'function') {
    customLoader(factory, 'dom');
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = factory();
  } else {
    root.returnExports = factory();
    window.dom = factory();
  }
})(void 0, function () {
  'use strict';

  var uids = {},
      destroyer = document.createElement('div');

  function isDimension(prop) {
    return !/opacity|index|flex|weight|^sdcsdcorder|tab|miter|group|zoom/i.test(prop);
  }

  function isNumber(value) {
    if (/\s/.test(value)) {
      return false;
    }

    return !isNaN(parseFloat(value));
  }

  function uid(type) {
    type = type || 'uid';

    if (uids[type] === undefined) {
      uids[type] = 0;
    }

    var id = type + '-' + (uids[type] + 1);
    uids[type]++;
    return id;
  }

  function isNode(item) {
    // safer test for custom elements in FF (with wc shim)
    // fragment is a special case
    return !!item && _typeof(item) === 'object' && (typeof item.innerHTML === 'string' || item.nodeName === '#document-fragment');
  }

  function byId(item) {
    if (typeof item === 'string') {
      return document.getElementById(item);
    }

    return item;
  }

  function style(node, prop, value) {
    var computed, result;

    if (_typeof(prop) === 'object') {
      // object setter
      Object.keys(prop).forEach(function (key) {
        style(node, key, prop[key]);
      });
      return null;
    } else if (value !== undefined) {
      // property setter
      if (typeof value === 'number' && isDimension(prop)) {
        value += 'px';
      }

      node.style[prop] = value;
    } // getter, if a simple style


    if (node.style[prop]) {
      result = node.style[prop];

      if (/px/.test(result)) {
        return parseFloat(result);
      }

      if (/%/.test(result)) {
        return parseFloat(result) * 0.01;
      }

      if (isNumber(result)) {
        return parseFloat(result);
      }

      return result;
    } // getter, computed


    computed = window.getComputedStyle(node);

    if (computed[prop]) {
      result = computed[prop];

      if (isNumber(result)) {
        return parseFloat(result);
      }

      return computed[prop];
    }

    return '';
  }

  function attr(node, prop, value) {
    if (_typeof(prop) === 'object') {
      var bools = {};
      var strings = {};
      var objects = {};
      var events = {};
      var functions = {};
      Object.keys(prop).forEach(function (key) {
        if (typeof prop[key] === 'boolean') {
          bools[key] = prop[key];
        } else if (_typeof(prop[key]) === 'object') {
          objects[key] = prop[key];
        } else if (typeof prop[key] === 'function') {
          if (/on[A-Z]/.test(key)) {
            events[key] = prop[key];
          } else {
            functions[key] = prop[key];
          }
        } else {
          strings[key] = prop[key];
        }
      }); // assigning properties in specific order of type, namely objects last

      Object.keys(bools).forEach(function (key) {
        attr(node, key, prop[key]);
      });
      Object.keys(strings).forEach(function (key) {
        attr(node, key, prop[key]);
      });
      Object.keys(events).forEach(function (key) {
        attr(node, key, prop[key]);
      });
      Object.keys(objects).forEach(function (key) {
        attr(node, key, prop[key]);
      });
      Object.keys(functions).forEach(function (key) {
        attr(node, key, prop[key]);
      });
      return null;
    } else if (value !== undefined) {
      if (prop === 'text' || prop === 'html' || prop === 'innerHTML') {
        // ignore, handled during creation
        return;
      } else if (prop === 'className' || prop === 'class') {
        dom.classList.add(node, value);
      } else if (prop === 'style') {
        style(node, value);
      } else if (prop === 'attr') {
        // back compat
        attr(node, value);
      } else if (typeof value === 'function') {
        if (/on[A-Z]/.test(prop)) {
          attachEvent(node, prop, value);
        } else {
          node[prop] = value;
        }
      } else if (_typeof(value) === 'object') {
        // object, like 'data'
        node[prop] = value;
      } else {
        if (value === false) {
          node.removeAttribute(prop);
        } else {
          node.setAttribute(prop, value);
        }
      }
    }

    return node.getAttribute(prop);
  }

  function attachEvent(node, prop, value) {
    var event = toEventName(prop);
    node.addEventListener(event, value);

    var callback = function callback(mutationsList) {
      mutationsList.forEach(function (mutation) {
        for (var i = 0; i < mutation.removedNodes.length; i++) {
          var n = mutation.removedNodes[i];

          if (n === node) {
            node.removeEventListener(event, value);
            observer.disconnect();
            break;
          }
        }
      });
    };

    var observer = new MutationObserver(callback);
    observer.observe(node.parentNode || document.body, {
      childList: true
    });
  }

  function box(node) {
    if (node === window) {
      node = document.documentElement;
    } // node dimensions
    // returned object is immutable
    // add scroll positioning and convenience abbreviations


    var dimensions = byId(node).getBoundingClientRect();
    return {
      top: dimensions.top,
      right: dimensions.right,
      bottom: dimensions.bottom,
      left: dimensions.left,
      height: dimensions.height,
      h: dimensions.height,
      width: dimensions.width,
      w: dimensions.width,
      scrollY: window.scrollY,
      scrollX: window.scrollX,
      x: dimensions.left + window.pageXOffset,
      y: dimensions.top + window.pageYOffset
    };
  }

  function relBox(node, parentNode) {
    var parent = parentNode || node.parentNode;
    var pBox = box(parent);
    var bx = box(node);
    return {
      w: bx.w,
      h: bx.h,
      x: bx.left - pBox.left,
      y: bx.top - pBox.top
    };
  }

  function size(node, type) {
    if (node === window) {
      node = document.documentElement;
    }

    if (type === 'scroll') {
      return {
        w: node.scrollWidth,
        h: node.scrollHeight
      };
    }

    if (type === 'client') {
      return {
        w: node.clientWidth,
        h: node.clientHeight
      };
    }

    return {
      w: node.offsetWidth,
      h: node.offsetHeight
    };
  }

  function query(node, selector) {
    if (!selector) {
      selector = node;
      node = document;
    }

    return node.querySelector(selector);
  }

  function queryAll(node, selector) {
    if (!selector) {
      selector = node;
      node = document;
    }

    var nodes = node.querySelectorAll(selector);

    if (!nodes.length) {
      return [];
    } // convert to Array and return it


    return Array.prototype.slice.call(nodes);
  }

  function toDom(html, options, parent) {
    var node = dom('div', {
      html: html
    });
    parent = byId(parent || options);

    if (parent) {
      while (node.firstChild) {
        parent.appendChild(node.firstChild);
      }

      return node.firstChild;
    }

    if (html.indexOf('<') !== 0) {
      return node;
    }

    return node.firstChild;
  }

  function fromDom(node) {
    function getAttrs(node) {
      var att,
          i,
          attrs = {};

      for (i = 0; i < node.attributes.length; i++) {
        att = node.attributes[i];
        attrs[att.localName] = normalize(att.value === '' ? true : att.value);
      }

      return attrs;
    }

    function getText(node) {
      var i,
          t,
          text = '';

      for (i = 0; i < node.childNodes.length; i++) {
        t = node.childNodes[i];

        if (t.nodeType === 3 && t.textContent.trim()) {
          text += t.textContent.trim();
        }
      }

      return text;
    }

    var i,
        object = getAttrs(node);
    object.text = getText(node);
    object.children = [];

    if (node.children.length) {
      for (i = 0; i < node.children.length; i++) {
        object.children.push(fromDom(node.children[i]));
      }
    }

    return object;
  }

  function addChildren(node, children) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        if (children[i]) {
          if (typeof children[i] === 'string') {
            node.appendChild(toDom(children[i]));
          } else {
            node.appendChild(children[i]);
          }
        }
      }
    } else if (children) {
      node.appendChild(children);
    }
  }

  function removeChildren(node) {
    var children = [];

    while (node.children.length) {
      var child = node.children[0];
      children.push(node.removeChild(child));
    }

    return children;
  }

  function addContent(node, options) {
    var html;

    if (options.html !== undefined || options.innerHTML !== undefined) {
      html = options.html || options.innerHTML || '';

      if (_typeof(html) === 'object') {
        addChildren(node, html);
      } else {
        // careful assuming textContent -
        // misses some HTML, such as entities (&npsp;)
        node.innerHTML = html;
      }
    }

    if (options.text) {
      node.appendChild(document.createTextNode(options.text));
    }

    if (options.children) {
      addChildren(node, options.children);
    }
  }

  function dom(nodeType, options, parent, prepend) {
    options = options || {}; // if first argument is a string and starts with <, pass to toDom()

    if (nodeType.indexOf('<') === 0) {
      return toDom(nodeType, options, parent);
    }

    var node = document.createElement(nodeType);
    parent = byId(parent);
    addContent(node, options);
    attr(node, options);

    if (parent && isNode(parent)) {
      if (prepend && parent.hasChildNodes()) {
        parent.insertBefore(node, parent.children[0]);
      } else {
        parent.appendChild(node);
      }
    }

    return node;
  }

  function insertAfter(refNode, node) {
    var sibling = refNode.nextElementSibling;

    if (!sibling) {
      refNode.parentNode.appendChild(node);
    } else {
      refNode.parentNode.insertBefore(node, sibling);
    }

    return sibling;
  }

  function place(parent, node, position) {
    if (!parent.children.length || position === null || position === undefined || position === -1 || position >= parent.children.length) {
      parent.appendChild(node);
      return;
    }

    parent.insertBefore(node, parent.children[position]);
  }

  function destroy(node) {
    // destroys a node completely
    //
    if (node) {
      node.destroyed = true;
      destroyer.appendChild(node);
      destroyer.innerHTML = '';
    }
  }

  function clean(node, dispose) {
    //	Removes all child nodes
    //		dispose: destroy child nodes
    if (dispose) {
      while (node.children.length) {
        destroy(node.children[0]);
      }

      return;
    }

    while (node.children.length) {
      node.removeChild(node.children[0]);
    }
  }

  dom.frag = function (nodes) {
    var frag = document.createDocumentFragment();

    if (arguments.length > 1) {
      for (var i = 0; i < arguments.length; i++) {
        frag.appendChild(arguments[i]);
      }
    } else {
      if (Array.isArray(nodes)) {
        nodes.forEach(function (n) {
          frag.appendChild(n);
        });
      } else {
        frag.appendChild(nodes);
      }
    }

    return frag;
  };

  dom.classList = {
    // in addition to fixing IE11-toggle,
    // these methods also handle arrays
    remove: function remove(node, names) {
      toArray(names).forEach(function (name) {
        node.classList.remove(name);
      });
    },
    add: function add(node, names) {
      toArray(names).forEach(function (name) {
        node.classList.add(name);
      });
    },
    contains: function contains(node, names) {
      return toArray(names).every(function (name) {
        return node.classList.contains(name);
      });
    },
    toggle: function toggle(node, names, value) {
      names = toArray(names);

      if (typeof value === 'undefined') {
        // use standard functionality, supported by IE
        names.forEach(function (name) {
          node.classList.toggle(name, value);
        });
      } // IE11 does not support the second parameter
      else if (value) {
          names.forEach(function (name) {
            node.classList.add(name);
          });
        } else {
          names.forEach(function (name) {
            node.classList.remove(name);
          });
        }
    }
  };

  function normalize(val) {
    if (typeof val === 'string') {
      val = val.trim();

      if (val === 'false') {
        return false;
      } else if (val === 'null') {
        return null;
      } else if (val === 'true') {
        return true;
      } // finds strings that start with numbers, but are not numbers:
      // '2team' '123 Street', '1-2-3', etc


      if (('' + val).replace(/-?\d*\.?\d*/, '').length) {
        return val;
      }
    }

    if (!isNaN(parseFloat(val))) {
      return parseFloat(val);
    }

    return val;
  }

  function toArray(names) {
    if (!names) {
      return [];
    }

    return names.split(' ').map(function (name) {
      return name.trim();
    }).filter(function (name) {
      return !!name;
    });
  }

  function toEventName(s) {
    s = s.replace('on', '');
    var str = '';

    for (var i = 0; i < s.length; i++) {
      if (i === 0 || s.charCodeAt(i) > 90) {
        str += s[i].toLowerCase();
      } else {
        str += '-' + s[i].toLowerCase();
      }
    }

    return str;
  }

  dom.normalize = normalize;
  dom.clean = clean;
  dom.query = query;
  dom.queryAll = queryAll;
  dom.byId = byId;
  dom.attr = attr;
  dom.box = box;
  dom.style = style;
  dom.destroy = destroy;
  dom.uid = uid;
  dom.isNode = isNode;
  dom.toDom = toDom;
  dom.fromDom = fromDom;
  dom.insertAfter = insertAfter;
  dom.size = size;
  dom.relBox = relBox;
  dom.place = place;
  dom.removeChildren = removeChildren;
  return dom;
});

},{}],9:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-disable max-lines-per-function, object-shorthand, sort-vars, no-nested-ternary, indent, indent-legacy, complexity, no-plusplus, prefer-reflect*/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['@clubajax/on'], factory);
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('@clubajax/on'));
  } else {
    // Browser globals (root is window)
    root.returnExports = factory();
    root.keys = factory(root.on);
  }
})(void 0, function (on) {
  function keys(listNode, options) {
    options = options || {};
    var controller = {
      log: false,
      setSelected: function setSelected(node) {
        select(node);
      },
      getSelected: function getSelected() {
        return selected;
      },
      remove: function remove() {
        this.destroy();
      },
      destroy: function destroy() {
        shift = false;
        meta = false;
        select();
        unhighlight();
        this.handles.forEach(function (h) {
          h.remove();
        });

        if (observer) {
          observer.disconnect();
        }
      }
    },
        tableMode = listNode.localName === 'table',
        canSelectNone = options.canSelectNone !== undefined ? options.canSelectNone : true,
        multiple = options.multiple,
        searchStringTime = options.searchTime || 1000,
        externalSearch = options.externalSearch,
        // children is a live NodeList, so the reference will update if nodes are added or removed
    children = tableMode ? listNode.querySelectorAll('td') : listNode.children,
        button = options.buttonId ? document.getElementById(options.buttonId) : null;
    var shift = false,
        meta = false,
        observer,
        searchString = '',
        searchStringTimer,
        pivotNode,
        selected,
        highlighted;
    var nodeType = (getNext(children, 0) || {}).localName || 'li';

    function unhighlight() {
      if (highlighted) {
        highlighted.removeAttribute('tab-index');
        highlighted.removeAttribute('aria-current');
        highlighted.blur();
      }
    }

    function highlight(node, defaultToFirst) {
      node = fromArray(node);
      unhighlight();

      if (!node) {
        if (!children[0] || !defaultToFirst) {
          return null;
        }

        node = children[0];
      }

      highlighted = node;
      highlighted.setAttribute('tab-index', "-1");
      highlighted.setAttribute('aria-current', "true");
      highlighted.focus();
      on.fire(listNode, 'key-highlight', {
        value: highlighted
      }, true);
      return highlighted;
    }

    function select(node) {
      var clearSelection = !shift && !meta;

      if (clearSelection && selected) {
        toArray(selected).forEach(function (sel) {
          sel.removeAttribute('aria-selected');
        });
        selected = multiple ? [] : null;
      }

      if (node && multiple) {
        selected = toArray(selected);

        if (shift && !Array.isArray(node)) {
          selected = findShiftNodes(children, node, pivotNode);
        } else if (meta || shift) {
          selected = [].concat(_toConsumableArray(selected), _toConsumableArray(toArray(node)));
          selected.forEach(function (sel) {
            sel.setAttribute('aria-selected', 'true');
          });
        } else if (Array.isArray(node)) {
          selected = [];
          node.forEach(function (n) {
            n.setAttribute('aria-selected', 'true');
          });
          selected = selected.concat(node);
        } else if (node) {
          node.setAttribute('aria-selected', 'true');
          selected.push(node);
        }
      } else if (node) {
        if (selected) {
          selected.removeAttribute('aria-selected');
        }

        if (node) {
          selected = node;
          selected.setAttribute('aria-selected', 'true');
        }
      }

      if (multiple && !selected) {
        selected = [];
      }

      on.fire(listNode, 'key-select', {
        value: selected || null
      }, true);
      return selected || null;
    }

    function scrollTo() {
      var node = highlighted || selected; // getting parent is expensive, so check node first

      if (!node) {
        return;
      }

      var parent = getListContainer(listNode);

      if (!parent) {
        return;
      }

      var top = node.offsetTop;
      var height = node.offsetHeight;
      var listHeight = parent.offsetHeight;

      if (top - height < parent.scrollTop) {
        parent.scrollTop = top - height;
      } else if (top + height * 2 > parent.scrollTop + listHeight) {
        parent.scrollTop = top - listHeight + height * 2;
      }
    }

    function onDocKeyDown(e) {
      if (e.defaultPrevented) {
        return;
      }

      switch (e.key) {
        case 'Meta':
        case 'Control':
        case 'Command':
          meta = true;
          break;

        case 'Shift':
          shift = true;
          break;
      }
    }

    function onKeyDown(e) {
      if (e.defaultPrevented) {
        return;
      }

      switch (e.key) {
        case 'Meta':
        case 'Control':
        case 'Command':
          meta = true;
          break;

        case 'Shift':
          shift = true;
          break;

        case 'Enter':
          select(highlighted);
          pivotNode = highlighted;
          break;

        case 'Escape':
          if (canSelectNone) {
            select(null);
          }

          break;

        case 'ArrowDown':
          if (tableMode) {
            highlight(getCell(children, highlighted || selected, 'down'));
            break;
          } else {
            var node = getNode(children, highlighted || selected, 'down');
            highlight(node);

            if (multiple && (shift || meta)) {
              pivotNode = pivotNode || node;
              select(node);
            }
          }

          scrollTo();
          e.preventDefault();
        // fallthrough

        case 'ArrowRight':
          if (tableMode) {
            highlight(getNode(children, highlighted || selected, 'down'));
          }

          break;

        case 'ArrowUp':
          if (tableMode) {
            highlight(getCell(children, highlighted || selected, 'up'));
            e.preventDefault();
            break;
          } else {
            var _node = getNode(children, highlighted || selected, 'up');

            highlight(_node);

            if (multiple && (shift || meta)) {
              pivotNode = pivotNode || _node;
              select(_node);
            }
          }

          scrollTo();
          e.preventDefault();
        // fallthrough

        case 'ArrowLeft':
          if (tableMode) {
            highlight(getNode(children, highlighted || selected, 'up'));
          }

          break;

        default:
          break;
      }
    }

    function onInputSearch(e) {
      // This is used if the "button" is an input, and does a search on the server
      if (on.isAlphaNumeric(e.key) || e.key === 'Backspace' || e.key === 'Delete') {
        if (meta) {
          return;
        }

        on.fire(button, 'key-search', {
          value: button.value
        });
      }
    }

    function onListSearch(e) {
      // This emulates a native select's capability to search the current list
      if (on.isAlphaNumeric(e.key)) {
        if (e.key === 'r' && meta) {
          return;
        }

        searchString += e.key;
        var searchNode = searchHtmlContent(children, searchString);

        if (searchNode) {
          highlight(searchNode);
          scrollTo();
        }

        clearTimeout(searchStringTimer);
        searchStringTimer = setTimeout(function () {
          searchString = '';
        }, searchStringTime);
      }
    }

    controller.handles = [on(listNode, 'mousedown', nodeType, function (e, node) {
      listNode.focus();
      highlight(node);
      select(node);
      e.preventDefault();
    }), on(listNode, 'mouseup', nodeType, function (e, node) {
      if (!shift && !meta) {
        pivotNode = node;
      }
    }), on(document, 'keyup', function (e) {
      if (e.defaultPrevented) {
        return;
      }

      shift = Boolean(e.shiftKey);
      meta = false;
    }), on(document, 'keydown', onDocKeyDown), on(listNode, 'keydown', onKeyDown), on(listNode, 'keydown', onListSearch), on(listNode, 'blur', unhighlight), {
      pause: function pause() {
        if (controller.log) {
          console.log('pause');
        }
      },
      resume: function resume() {
        if (controller.log) {
          console.log('resume');
        }
      },
      remove: function remove() {
        if (controller.log) {
          console.log('remove');
        }
      }
    }];

    if (button) {
      // timeout is needed so a parent button ENTER can override keys ENTER detection
      setTimeout(function () {
        controller.handles.push(on(button, 'keydown', onKeyDown));

        if (externalSearch) {
          controller.handles.push(on(button, 'keyup', onInputSearch));
        } else {
          controller.handles.push(on(button, 'keyup', onListSearch));
        }
      }, 30);
    }

    if (!options.noRoles) {
      addRoles(listNode);

      if (typeof MutationObserver !== 'undefined') {
        observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (event) {
            if (event.type === 'childList') {
              on.fire(listNode, 'key-dom-change', event, true);
            }

            if (event.addedNodes.length) {
              addRoles(listNode);
            }
          });
        });
        observer.observe(listNode, {
          childList: true
        });
      }
    }

    var multiHandle = on.makeMultiHandle(controller.handles);
    Object.keys(multiHandle).forEach(function (key) {
      controller[key] = multiHandle[key];
    });
    controller._resume = controller.resume;

    controller.resume = function () {
      scrollTo();

      controller._resume();
    };

    controller.scrollTo = scrollTo; // need to wait until the controller is returned before
    // selecting, or component cannot get initial value

    setTimeout(function () {
      selected = select(getSelected(children, options));
      highlighted = highlight(fromArray(selected), options.defaultToFirst);
      scrollTo();
    }, 1);
    return controller;
  } //
  // ---- helpers
  //


  function isSelected(node) {
    if (!node) {
      return false;
    }

    return node.hasAttribute('aria-selected');
  }

  function getSelected(children, options) {
    var mult = [];

    for (var i = 0; i < children.length; i++) {
      if (isSelected(children[i])) {
        if (options.multiple) {
          mult.push(children[i]);
        } else {
          return children[i];
        }
      }
    }

    return mult.length ? mult : options.defaultToFirst ? children[0] : null;
  }

  function getNext(children, index) {
    // why did I think I needed to do this?
    // if (index === -1) {
    //     index = 0;
    // }
    var norecurse = children.length + 2;
    var node = children[index];

    while (node) {
      index++;

      if (index > children.length - 1) {
        index = -1;
      } else if (isElligible(children[index])) {
        node = children[index];
        break;
      }

      if (norecurse-- < 0) {
        console.warn('recurse');
        return getFirstElligible(children);
      }
    }

    return node || children[0];
  }

  function getPrev(children, index) {
    var norecurse = children.length + 2;
    var node = children[index];

    while (node) {
      index--;

      if (index < 0) {
        index = children.length;
      } else if (isElligible(children[index])) {
        node = children[index];
        break;
      }

      if (norecurse-- < 0) {
        console.warn('recurse');
        return getLastElligible(children);
      }
    }

    return node || children[children.length - 1];
  }

  function getFirstElligible(children) {
    for (var i = 0; i < children.length; i++) {
      if (isElligible(children[i])) {
        return children[i];
      }
    }

    return null;
  }

  function getLastElligible(children) {
    for (var i = children.length - 1; i >= 0; i--) {
      if (isElligible(children[i])) {
        return children[i];
      }
    }

    return null;
  }

  function isVisible(node) {
    if (/divider|group|label/.test(node.className)) {
      return false;
    }

    return node.style.display !== 'none' && node.offsetHeight && node.offsetWidth;
  }

  function isDisabled(node) {
    return node.parentNode.disabled || node.disabled || node.hasAttribute('disabled');
  }

  function isElligible(child) {
    return child && !isDisabled(child) && isVisible(child);
  }

  function getNode(children, highlighted, dir) {
    var index = -1;

    for (var i = 0; i < children.length; i++) {
      if (children[i] === highlighted) {
        index = i;
        break;
      }
    }

    if (dir === 'up') {
      return getPrev(children, index);
    }

    return getNext(children, index);
  }

  function getCell(children, highlighted, dir) {
    var cellIndex = getIndex(highlighted),
        row = highlighted.parentNode,
        rowIndex = getIndex(row),
        rowAmount = row.parentNode.rows.length;

    if (dir === 'up') {
      if (rowIndex > 0) {
        return row.parentNode.rows[rowIndex - 1].cells[cellIndex];
      }

      return row.parentNode.rows[rowAmount - 1].cells[cellIndex];
    }

    if (rowIndex + 1 < rowAmount) {
      return row.parentNode.rows[rowIndex + 1].cells[cellIndex];
    }

    return row.parentNode.rows[0].cells[cellIndex];
  }

  function getIndex(el) {
    var i,
        p = el.parentNode;

    for (i = 0; i < p.children.length; i++) {
      if (p.children[i] === el) {
        return i;
      }
    }

    return null;
  }

  function getListContainer(listNode) {
    function notContainer(n) {
      var style = window.getComputedStyle(n);
      return style['overflow'] !== 'auto' || style['overflow-y'] !== 'auto';
    }

    if (listNode.__scroll_container !== undefined) {
      return listNode.__scroll_container;
    }

    var node = listNode;

    while (notContainer(node)) {
      node = node.parentNode;

      if (!node || node === document.body) {
        listNode.__scroll_container = null;
        return null;
      }
    }

    listNode.__scroll_container = node;
    return node;
  }

  function searchHtmlContent(children, str) {
    str = str.toLowerCase();

    for (var i = 0; i < children.length; i++) {
      if (isElligible(children[i]) && children[i].innerHTML.toLowerCase().indexOf(str) === 0) {
        return children[i];
      }
    }

    return null;
  }

  function findShiftNodes(children, node, pivotNode) {
    var selection = [];

    if (!pivotNode) {
      toArray(node).forEach(function (n) {
        n.setAttribute('aria-selected', 'true');
        selection.push(n);
      });
      return selection;
    }

    var pivotIndex = getIndex(pivotNode);
    var newIndex = getIndex(node);
    var beg, end;

    if (newIndex < pivotIndex) {
      beg = newIndex;
      end = pivotIndex;
    } else {
      beg = pivotIndex;
      end = newIndex;
    }

    toArray(children).forEach(function (child, i) {
      if (i >= beg && i <= end && isElligible(child)) {
        child.setAttribute('aria-selected', 'true');
        selection.push(child);
      } else {
        child.removeAttribute('aria-selected');
      }
    });
    return selection;
  }

  function addRoles(node) {
    // https://www.w3.org/TR/wai-aria/roles#listbox
    for (var i = 0; i < node.children.length; i++) {
      if (isElligible(node.children[i])) {
        node.children[i].setAttribute('role', 'listitem');
      }
    }

    node.setAttribute('role', 'listbox');
  }

  function fromArray(thing) {
    return Array.isArray(thing) ? thing[0] : thing;
  }

  function toArray(thing) {
    if (!thing) {
      return [];
    }

    if (thing instanceof NodeList || thing instanceof HTMLCollection) {
      return Array.prototype.slice.call(thing);
    }

    return Array.isArray(thing) ? thing : [thing];
  }

  return keys;
});

},{"@clubajax/on":11}],10:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (root, factory) {
  if (typeof customLoader === 'function') {
    customLoader(factory, 'nodash');
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = factory();
  } else {
    root.returnExports = factory();
    window.nodash = factory();
  }
})(void 0, function () {
  var global = (typeof window === "undefined" ? "undefined" : _typeof(window)) !== undefined ? window : global; // OBJECTS

  function copy(data) {
    if (!data) {
      return data;
    }

    var type = getType(data);

    if (type === 'array') {
      return data.map(function (item) {
        if (item && _typeof(item) === 'object') {
          return copy(item);
        }

        return item;
      });
    }

    if (type === 'html' || type === 'window') {
      throw new Error('HTMLElements and the window object cannot be copied');
    }

    if (type === 'date') {
      return new Date(data.getTime());
    }

    if (type === 'function') {
      return data;
    }

    if (type === 'map') {
      return new Map(data);
    }

    if (type === 'set') {
      return new Set(data);
    }

    if (type === 'object') {
      return Object.keys(data).reduce(function (obj, key) {
        var item = data[key];

        if (_typeof(item) === 'object') {
          obj[key] = copy(item);
        } else {
          obj[key] = data[key];
        }

        return obj;
      }, {});
    }

    return data;
  }

  function equal(a, b) {
    var typeA = getType(a);
    var typeB = getType(b);

    if (typeA !== typeB) {
      return false;
    }

    var type = typeA;

    if (/number|string|boolean/.test(type)) {
      return a === b;
    }

    if (type === 'date') {
      return a.getTime() === b.getTime();
    }

    if (type === 'nan') {
      return true;
    }

    if (type === 'array') {
      return a.length === b.length && a.every(function (item, i) {
        return equal(item, b[i]);
      });
    }

    if (type === 'object' || type === 'map' || type === 'set') {
      return Object.keys(a).every(function (key) {
        return equal(a[key], b[key]);
      });
    }

    return a === b;
  }

  function getObject(o, path) {
    var paths = path.split('.');
    var value = o;
    var key;

    for (var i = 0; i < paths.length; i++) {
      key = paths[i];

      if (value[key] !== undefined) {
        value = value[key];
      } else {
        return null;
      }
    }

    return value;
  }

  function setObject(o, path, value) {
    return path.split('.').reduce(function (obj, key, i, array) {
      if (i === array.length - 1) {
        obj[key] = value;
        return obj;
      }

      if (_typeof(obj[key]) !== 'object') {
        if (isNaN(parseInt(key))) {
          obj[key] = {};
        } else {
          obj[key] = [];
        }
      }

      return obj[key];
    }, o);
  } // ARRAYS


  function equalValues(a, b) {
    var aTest = a.every(function (aItem) {
      return !!b.find(function (bItem) {
        return bItem === aItem;
      });
    });
    var bTest = b.every(function (bItem) {
      return !!a.find(function (aItem) {
        return aItem === bItem;
      });
    });
    return aTest && bTest;
  }

  function loop(count, callback) {
    for (var i = 0; i < count; i++) {
      callback(i);
    }
  }

  function remove(array, value) {
    array = _toConsumableArray(array);

    for (var i = array.length - 1; i >= 0; i--) {
      if (value === array[i]) {
        array.splice(i, 1);
      }
    }

    return array;
  }

  function same(array, prop) {
    var getValue = function getValue(item) {
      return prop ? item[prop] : item;
    };

    var value = getValue(array[0]);

    for (var i = 0; i < array.length; i++) {
      if (!equal(getValue(array[i]), value)) {
        return false;
      }
    }

    return true;
  }

  function deDupe(array, prop) {
    var props = [];

    if (prop) {
      return array.filter(function (item) {
        if (props.find(function (p) {
          return item[prop] === p;
        })) {
          return false;
        }

        props.push(item[prop]);
        return true;
      });
    }

    return array.filter(function (item) {
      if (props.find(function (p) {
        return item === p;
      })) {
        return false;
      }

      props.push(item);
      return true;
    });
  }

  function sawLoop(collection, callback) {
    var result = [];
    collection[0].forEach(function (nada, valueIndex) {
      collection.forEach(function (values, collectionIndex) {
        var value = values[valueIndex];

        if (callback) {
          callback(value, valueIndex, collectionIndex);
        }

        result.push(value);
      });
    });
    return result;
  }

  function collectValues(arr, props) {}

  function collectProperties(item, props) {} // VALUES


  function getType(item) {
    if (item === null) {
      return 'null';
    }

    if (_typeof(item) === 'object') {
      if (Array.isArray(item)) {
        return 'array';
      }

      if (item instanceof Date) {
        return 'date';
      }

      if (item instanceof Promise) {
        return 'promise';
      }

      if (item instanceof Error) {
        return 'error';
      }

      if (item instanceof Map) {
        return 'map';
      }

      if (item instanceof WeakMap) {
        return 'weakmap';
      }

      if (item instanceof Set) {
        return 'set';
      }

      if (item instanceof WeakSet) {
        return 'weakset';
      }

      if (item === global) {
        if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== undefined) {
          return 'window';
        }

        return 'global';
      }

      if (item.documentElement || item.innerHTML !== undefined) {
        return 'html';
      }

      if (item.length !== undefined && item.callee) {
        return 'arguments';
      }
    }

    if (typeof item === 'number' && isNaN(item)) {
      return 'nan';
    }

    return _typeof(item);
  } // STRINGS


  function dashify(word) {
    return word.replace(/\s/g, '-').toLowerCase();
  }

  function cap(word) {
    return word.substring(0, 1).toUpperCase() + word.substring(1);
  }

  return {
    // objects
    copy: copy,
    equal: equal,
    getObject: getObject,
    setObject: setObject,
    // array
    equalValues: equalValues,
    loop: loop,
    deDupe: deDupe,
    sawLoop: sawLoop,
    remove: remove,
    same: same,
    // types
    getType: getType,
    // string
    dashify: dashify,
    cap: cap
  };
});

},{}],11:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (root, factory) {
  if (typeof customLoader === 'function') {
    customLoader(factory, 'on');
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    module.exports = factory();
  } else {
    root.returnExports = window.on = factory();
  }
})(void 0, function () {
  'use strict'; // main function

  function on(node, eventName, filter, handler) {
    // normalize parameters
    if (typeof node === 'string') {
      node = getNodeById(node);
    } // prepare a callback


    var callback = makeCallback(node, filter, handler); // functional event

    if (typeof eventName === 'function') {
      return eventName(node, callback);
    } // special case: keydown/keyup with a list of expected keys
    // TODO: consider replacing with an explicit event function:
    // var h = on(node, onKeyEvent('keyup', /Enter,Esc/), callback);


    var keyEvent = /^(keyup|keydown):(.+)$/.exec(eventName);

    if (keyEvent) {
      return onKeyEvent(keyEvent[1], new RegExp(keyEvent[2].split(',').join('|')))(node, callback);
    } // handle multiple event types, like: on(node, 'mouseup, mousedown', callback);


    if (/,/.test(eventName)) {
      return on.makeMultiHandle(eventName.split(',').map(function (name) {
        return name.trim();
      }).filter(function (name) {
        return name;
      }).map(function (name) {
        return on(node, name, callback);
      }));
    } // handle registered functional events


    if (Object.prototype.hasOwnProperty.call(on.events, eventName)) {
      return on.events[eventName](node, callback);
    } // special case: loading an image


    if (eventName === 'load' && node.tagName.toLowerCase() === 'img') {
      return onImageLoad(node, callback);
    } // special case: mousewheel


    if (eventName === 'wheel') {
      // pass through, but first curry callback to wheel events
      callback = normalizeWheelEvent(callback);

      if (!hasWheel) {
        // old Firefox, old IE, Chrome
        return on.makeMultiHandle([on(node, 'DOMMouseScroll', callback), on(node, 'mousewheel', callback)]);
      }
    } // special case: keyboard


    if (/^key/.test(eventName)) {
      callback = normalizeKeyEvent(callback);
    } // default case


    return on.onDomEvent(node, eventName, callback);
  } // registered functional events


  on.events = {
    // handle click and Enter
    button: function button(node, callback) {
      return on.makeMultiHandle([on(node, 'click', callback), on(node, 'keyup:Enter', callback)]);
    },
    // custom - used for popups 'n stuff
    clickoff: function clickoff(node, callback) {
      // important note!
      // starts paused
      //
      var nodeDoc = node.ownerDocument.documentElement;
      var bHandle = makeMultiHandle([on(nodeDoc, 'click', function (e) {
        var target = e.target;

        if (target.nodeType !== 1) {
          target = target.parentNode;
        }

        if (target && !node.contains(target)) {
          callback(e);
        }
      }), on(nodeDoc, 'keyup', function (e) {
        if (e.key === 'Escape') {
          callback(e);
        }
      })]);
      var handle = {
        state: 'resumed',
        resume: function resume() {
          setTimeout(function () {
            bHandle.resume();
          }, 100);
          this.state = 'resumed';
        },
        pause: function pause() {
          bHandle.pause();
          this.state = 'paused';
        },
        remove: function remove() {
          bHandle.remove();
          this.state = 'removed';
        }
      };
      handle.pause();
      return handle;
    }
  }; // internal event handlers

  function onDomEvent(node, eventName, callback) {
    node.addEventListener(eventName, callback, false);
    return {
      remove: function remove() {
        node.removeEventListener(eventName, callback, false);
        node = callback = null;

        this.remove = this.pause = this.resume = function () {};
      },
      pause: function pause() {
        node.removeEventListener(eventName, callback, false);
      },
      resume: function resume() {
        node.addEventListener(eventName, callback, false);
      }
    };
  }

  function onImageLoad(node, callback) {
    var handle = on.makeMultiHandle([on.onDomEvent(node, 'load', onImageLoad), on(node, 'error', callback)]);
    return handle;

    function onImageLoad(e) {
      var interval = setInterval(function () {
        if (node.naturalWidth || node.naturalHeight) {
          clearInterval(interval);
          e.width = e.naturalWidth = node.naturalWidth;
          e.height = e.naturalHeight = node.naturalHeight;
          callback(e);
        }
      }, 100);
      handle.remove();
    }
  }

  function onKeyEvent(keyEventName, re) {
    return function onKeyHandler(node, callback) {
      return on(node, keyEventName, function onKey(e) {
        if (re.test(e.key)) {
          callback(e);
        }
      });
    };
  } // internal utilities


  var hasWheel = function hasWheelTest() {
    var isIE = navigator.userAgent.indexOf('Trident') > -1,
        div = document.createElement('div');
    return "onwheel" in div || "wheel" in div || isIE && document.implementation.hasFeature("Events.wheel", "3.0"); // IE feature detection
  }();

  var matches;
  ['matches', 'matchesSelector', 'webkit', 'moz', 'ms', 'o'].some(function (name) {
    if (name.length < 7) {
      // prefix
      name += 'MatchesSelector';
    }

    if (Element.prototype[name]) {
      matches = name;
      return true;
    }

    return false;
  });

  function closest(element, selector, parent) {
    while (element) {
      if (element[on.matches] && element[on.matches](selector)) {
        return element;
      }

      if (element === parent) {
        break;
      }

      element = element.parentElement;
    }

    return null;
  }

  var INVALID_PROPS = {
    isTrusted: 1
  };

  function mix(object, value) {
    if (!value) {
      return object;
    }

    if (_typeof(value) === 'object') {
      for (var key in value) {
        if (!INVALID_PROPS[key]) {
          object[key] = value[key];
        }
      }
    } else {
      object.value = value;
    }

    return object;
  }

  var ieKeys = {
    //a: 'TEST',
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
    Esc: 'Escape',
    Spacebar: ' ',
    Win: 'Command'
  };

  function normalizeKeyEvent(callback) {
    // IE uses old spec
    return function normalizeKeys(e) {
      if (ieKeys[e.key]) {
        var fakeEvent = mix({}, e);
        fakeEvent.key = ieKeys[e.key];
        callback(fakeEvent);
      } else {
        callback(e);
      }
    };
  }

  var FACTOR = navigator.userAgent.indexOf('Windows') > -1 ? 10 : 0.1,
      XLR8 = 0,
      mouseWheelHandle;

  function normalizeWheelEvent(callback) {
    // normalizes all browsers' events to a standard:
    // delta, wheelY, wheelX
    // also adds acceleration and deceleration to make
    // Mac and Windows behave similarly
    return function normalizeWheel(e) {
      XLR8 += FACTOR;
      var deltaY = Math.max(-1, Math.min(1, e.wheelDeltaY || e.deltaY)),
          deltaX = Math.max(-10, Math.min(10, e.wheelDeltaX || e.deltaX));
      deltaY = deltaY <= 0 ? deltaY - XLR8 : deltaY + XLR8;
      e.delta = deltaY;
      e.wheelY = deltaY;
      e.wheelX = deltaX;
      clearTimeout(mouseWheelHandle);
      mouseWheelHandle = setTimeout(function () {
        XLR8 = 0;
      }, 300);
      callback(e);
    };
  }

  function closestFilter(element, selector) {
    return function (e) {
      return on.closest(e.target, selector, element);
    };
  }

  function makeMultiHandle(handles) {
    return {
      state: 'resumed',
      remove: function remove() {
        handles.forEach(function (h) {
          // allow for a simple function in the list
          if (h.remove) {
            h.remove();
          } else if (typeof h === 'function') {
            h();
          }
        });
        handles = [];

        this.remove = this.pause = this.resume = function () {};

        this.state = 'removed';
      },
      pause: function pause() {
        handles.forEach(function (h) {
          if (h.pause) {
            h.pause();
          }
        });
        this.state = 'paused';
      },
      resume: function resume() {
        handles.forEach(function (h) {
          if (h.resume) {
            h.resume();
          }
        });
        this.state = 'resumed';
      }
    };
  }

  function getNodeById(id) {
    var node = document.getElementById(id);

    if (!node) {
      console.error('`on` Could not find:', id);
    }

    return node;
  }

  function makeCallback(node, filter, handler) {
    if (filter && handler) {
      if (typeof filter === 'string') {
        filter = closestFilter(node, filter);
      }

      return function (e) {
        var result = filter(e);

        if (result) {
          e.filteredTarget = result;
          handler(e, result);
        }
      };
    }

    return filter || handler;
  }

  function getDoc(node) {
    return node === document || node === window ? document : node.ownerDocument;
  } // public functions


  on.once = function (node, eventName, filter, callback) {
    var h;

    if (filter && callback) {
      h = on(node, eventName, filter, function once() {
        callback.apply(window, arguments);
        h.remove();
      });
    } else {
      h = on(node, eventName, function once() {
        filter.apply(window, arguments);
        h.remove();
      });
    }

    return h;
  };

  on.emit = function (node, eventName, value) {
    node = typeof node === 'string' ? getNodeById(node) : node;
    var event = getDoc(node).createEvent('HTMLEvents');
    event.initEvent(eventName, true, true); // event type, bubbling, cancelable

    return node.dispatchEvent(mix(event, value));
  };

  on.fire = function (node, eventName, eventDetail, bubbles) {
    node = typeof node === 'string' ? getNodeById(node) : node;
    var event = getDoc(node).createEvent('CustomEvent');
    event.initCustomEvent(eventName, !!bubbles, true, eventDetail); // event type, bubbling, cancelable, value

    return node.dispatchEvent(event);
  }; // TODO: DEPRECATED


  on.isAlphaNumeric = function (str) {
    return /^[0-9a-z]$/i.test(str);
  };

  on.makeMultiHandle = makeMultiHandle;
  on.onDomEvent = onDomEvent; // use directly to prevent possible definition loops

  on.closest = closest;
  on.matches = matches;
  return on;
});

},{}],12:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BaseComponent = require('@clubajax/base-component');

var dom = require('@clubajax/dom');

var _emitEvent = require('./emitEvent');

var FormElement =
/*#__PURE__*/
function (_BaseComponent) {
  _inherits(FormElement, _BaseComponent);

  function FormElement() {
    _classCallCheck(this, FormElement);

    return _possibleConstructorReturn(this, _getPrototypeOf(FormElement).apply(this, arguments));
  }

  _createClass(FormElement, [{
    key: "onReadonly",
    value: function onReadonly(value) {
      if (this.input) {
        dom.attr(this.input, 'tabindex', '0', !value && !this.disabled);
      }
    }
  }, {
    key: "onDisabled",
    value: function onDisabled(value) {
      if (this.input) {
        dom.attr(this.input, 'tabindex', '0', !value && !this.readonly);
      }
    }
  }, {
    key: "onLabel",
    value: function onLabel(value) {
      if (this.labelNode) {
        this.labelNode.innerHTML = value;
      }
    }
  }, {
    key: "canEmit",
    value: function canEmit() {
      return !this['no-event'] && !this.readonly && !this.disabled;
    }
  }, {
    key: "emitEvent",
    value: function emitEvent() {
      var event = this.event || {
        value: this.value,
        name: this.name
      };

      _emitEvent(this, event);
    }
  }]);

  return FormElement;
}(BaseComponent);

module.exports = BaseComponent.define('ui-form-element', FormElement, {
  props: ['label', 'name', 'event-name', 'placeholder'],
  bools: ['no-event', 'disabled', 'readonly', 'autofocus', 'required'],
  attrs: ['value']
});

},{"./emitEvent":13,"@clubajax/base-component":4,"@clubajax/dom":8}],13:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var dom = require('@clubajax/dom');

var EVENT_NAME = 'change';

module.exports = function (instance, value) {
  if (instance.blockEvent) {
    return;
  }

  value = value === undefined ? instance.value : value;
  value = _typeof(value) === 'object' ? value : {
    value: value
  };

  if (value) {
    value.value = dom.normalize(value.value);
  }

  var eventName = instance['event-name'] || EVENT_NAME;
  var emitType = eventName === EVENT_NAME ? 'emit' : 'fire';
  instance[emitType](eventName, value, true);
  instance.__value = value !== null ? value.value : null;
};

},{"@clubajax/dom":8}],14:[function(require,module,exports){
"use strict";

// https://fontawesome.com/icons?d=gallery&c=interfaces&m=free
var map = {
  check: 'fas fa-check',
  minus: 'fas fa-minus',
  plus: 'fas fa-plus',
  books: 'fas fa-book-reader',
  chess: 'fas fa-chess-rook',
  error: 'fas fa-exclamation-circle',
  warning: 'fas fa-exclamation-triangle',
  caretDown: 'fas fa-caret-down',
  search: 'fas fa-search',
  spinner: 'fas fa-sync-alt',
  'folder': 'far fa-folder',
  'file': 'far fa-file-alt',
  'file-archive': 'far fa-file-archive',
  'file-audio': 'far far fa-file-audio',
  'file-code': 'far far fa-file-code',
  'file-image': 'far far fa-file-image',
  'file-pdf': 'far far fa-file-pdf',
  'file-video': 'far far fa-file-video',
  'file-excel': 'far far fa-file-excel',
  'file-powerpoint': 'far far fa-file-powerpoint',
  'file-word': 'far far fa-file-word'
};
module.exports = map;

},{}],15:[function(require,module,exports){
"use strict";

var uidMap = {};

function uid() {
  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'uid';
  uidMap[prefix] = uidMap[prefix] || 0;
  uidMap[prefix]++;
  return "".concat(prefix, "-").concat(uidMap[prefix]);
}

module.exports = uid;

},{}],16:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BaseComponent = require('@clubajax/base-component');

var dom = require('@clubajax/dom');

var FormElement = require('./lib/BaseField');

var uid = require('./lib/uid');

require('./ui-icon'); // CHECKED NOTE:!
// widget.checked *is* a getter/setter
// the visual keys off of the attribute
//
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox


var CheckBox =
/*#__PURE__*/
function (_FormElement) {
  _inherits(CheckBox, _FormElement);

  function CheckBox() {
    _classCallCheck(this, CheckBox);

    return _possibleConstructorReturn(this, _getPrototypeOf(CheckBox).apply(this, arguments));
  }

  _createClass(CheckBox, [{
    key: "onChecked",
    value: function onChecked(value) {
      if (this.indeterminate) {
        this.indeterminate = false;
        this.input.type = 'check';
      }

      dom.attr(this.input, 'aria-checked', "".concat(value));
    }
  }, {
    key: "onIndeterminate",
    value: function onIndeterminate(value) {
      if (value) {
        this.input.type = 'minus';
      }
    }
  }, {
    key: "setValue",
    value: function setValue(value, silent) {
      this.value = value;

      if (!silent && this.canEmit()) {
        this.emitEvent();
      }
    }
  }, {
    key: "toggle",
    value: function toggle() {
      this.checked = !this.checked;

      if (this.canEmit()) {
        this.emitEvent();
      } else {
        this.fire('toggle', {
          value: this.value
        });
      }
    }
  }, {
    key: "connected",
    value: function connected() {
      var _this = this;

      this.render();
      this.on('keyup', function (e) {
        if (!_this.canEmit()) {
          return;
        }

        if (e.key === 'Enter' || e.key === 'Spacebar' || e.key === ' ') {
          _this.toggle();
        }
      });
      this.on('click', function (e) {
        if (!_this.canEmit()) {
          return;
        }

        _this.toggle();
      });

      this.connected = function () {};
    }
  }, {
    key: "render",
    value: function render() {
      var type = this.indeterminate ? 'minus' : 'check';
      var html = this.label || '';
      var chkId = this.label ? this.id || uid('checkbox') : null;
      var lblId = this.label ? this.id || uid('label') : null;
      this.input = dom('ui-icon', {
        type: type,
        id: chkId,
        role: 'checkbox',
        'aria-labelledby': lblId,
        'aria-checked': false,
        tabindex: '0'
      });
      this.labelNode = dom('span', {
        html: html,
        "class": 'ui-label',
        'for': chkId,
        id: lblId
      });

      if (this['check-after']) {
        this.appendChild(this.input);
        this.appendChild(this.labelNode);
      } else {
        this.appendChild(this.labelNode);
        this.appendChild(this.input);
      }

      dom.attr(this, 'label', false);
    }
  }, {
    key: "value",
    get: function get() {
      return this.indeterminate ? null : Boolean(this.checked);
    },
    set: function set(value) {
      this.checked = value;
    }
  }, {
    key: "event",
    get: function get() {
      return {
        value: this.value,
        checked: this.checked,
        name: this.name
      };
    }
  }]);

  return CheckBox;
}(FormElement);

module.exports = BaseComponent.define('ui-checkbox', CheckBox, {
  bools: ['checked', 'check-after', 'indeterminate']
});

},{"./lib/BaseField":12,"./lib/uid":15,"./ui-icon":18,"@clubajax/base-component":4,"@clubajax/dom":8}],17:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BaseComponent = require('@clubajax/base-component');

var dom = require('@clubajax/dom');

var uid = require('./lib/uid');

var emitEvent = require('./lib/emitEvent');

require('./ui-popup');

require('./ui-list');

require('./ui-icon'); // https://blog.mobiscroll.com/how-to-do-multiple-selection-on-mobile/


var DEFAULT_PLACEHOLDER = 'Select One...';

var UiDropdown =
/*#__PURE__*/
function (_BaseComponent) {
  _inherits(UiDropdown, _BaseComponent);

  function UiDropdown() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UiDropdown);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UiDropdown)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "sortdesc", void 0);

    _defineProperty(_assertThisInitialized(_this), "sortasc", void 0);

    _defineProperty(_assertThisInitialized(_this), "label", void 0);

    _defineProperty(_assertThisInitialized(_this), "placeholder", void 0);

    return _this;
  }

  _createClass(UiDropdown, [{
    key: "setDisplay",
    value: function setDisplay() {
      var _this2 = this;

      this.button.innerHTML = '';
      var item = this.list ? this.list.getItem(this.value) : {};
      this.__value = item ? item.value : this.__value;
      dom('span', {
        html: isNull(this.value) ? this.placeholder || DEFAULT_PLACEHOLDER : item.alias || item.label
      }, this.button);
      dom('ui-icon', {
        type: 'caretDown'
      }, this.button);
      setTimeout(function () {
        // don't resize the popup right away - wait until it closes, or it jumps
        if (_this2.popup) {
          dom.style(_this2.popup, {
            'min-width': dom.box(_this2.button).w
          });
        }
      }, 500);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.list.reset();
    }
  }, {
    key: "connected",
    value: function connected() {
      this.render();
      this.connectEvents();

      this.connected = function () {};
    }
  }, {
    key: "connectEvents",
    value: function connectEvents() {
      var _this3 = this;

      this.list.on('list-change', function (e) {
        _this3.setDisplay();

        if (_this3.lastValue !== _this3.value) {
          emitEvent(_this3);
          _this3.lastValue = _this3.value;
        }

        setTimeout(function () {
          _this3.popup.hide();
        }, 300);
      });
      this.popup.on('popup-open', function () {
        _this3.list.controller.scrollTo();

        _this3.fire('open');
      });
      this.popup.on('popup-close', function () {
        _this3.list.controller.scrollTo();

        _this3.fire('close');
      });
    }
  }, {
    key: "renderButton",
    value: function renderButton(buttonid) {
      this.button = dom('button', {
        id: buttonid,
        "class": 'ui-button drop-input'
      }, this);
      this.setDisplay();
    }
  }, {
    key: "render",
    value: function render() {
      this.labelNode = dom('label', {
        html: this.label,
        "class": 'ui-label'
      }, this);
      var buttonid = uid('drop-button');
      this.renderButton(buttonid);
      this.list = dom('ui-list', {
        buttonid: buttonid,
        'event-name': 'list-change',
        sortdesc: this.sortdesc,
        sortasc: this.sortasc
      });
      this.popup = dom('ui-popup', {
        buttonid: buttonid,
        label: this.label,
        html: this.list,
        "class": 'dropdown'
      }, document.body);
      this.setDisplay();
    }
  }, {
    key: "value",
    set: function set(value) {
      var _this4 = this;

      this.onDomReady(function () {
        _this4.list.value = value;
      });
      this.__value = value;
    },
    get: function get() {
      if (!this.list) {
        return this.__value || this.getAttribute('value');
      }

      return this.list.value;
    }
  }, {
    key: "data",
    set: function set(data) {
      var _this5 = this;

      this.onDomReady(function () {
        var value = getValueFromList(data);

        if (value) {
          _this5.value = value;
        }

        _this5.lastValue = _this5.value;
        _this5.list.data = data;
      });
      this.__data = data;
    },
    get: function get() {
      return this.list ? this.list.items : this.__data;
    }
  }]);

  return UiDropdown;
}(BaseComponent);

function isNull(value) {
  return value === null || value === undefined;
}

function getValueFromList(data) {
  var item = data.find(function (m) {
    return m.selected;
  });
  return item ? item.value : null;
}

module.exports = BaseComponent.define('ui-dropdown', UiDropdown, {
  props: ['placeholder', 'label', 'limit', 'name', 'event-name', 'align', 'btn-class', 'sortdesc', 'sortasc'],
  bools: ['disabled', 'open-when-blank', 'allow-new', 'required', 'case-sensitive', 'autofocus', 'busy'],
  attrs: ['value']
});

},{"./lib/emitEvent":13,"./lib/uid":15,"./ui-icon":18,"./ui-list":20,"./ui-popup":21,"@clubajax/base-component":4,"@clubajax/dom":8}],18:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BaseComponent = require('@clubajax/base-component');

var dom = require('@clubajax/dom');

var iconMap = require('./lib/icon-map');

var UiIcon =
/*#__PURE__*/
function (_BaseComponent) {
  _inherits(UiIcon, _BaseComponent);

  function UiIcon() {
    _classCallCheck(this, UiIcon);

    return _possibleConstructorReturn(this, _getPrototypeOf(UiIcon).apply(this, arguments));
  }

  _createClass(UiIcon, [{
    key: "onType",
    value: function onType(type) {
      // if (!iconMap[type]) console.warn('icon type missing:', type);
      if (!missingStylesheet()) {
        console.warn('Icon stylesheet missing');
      }

      this.className = iconMap[type] || type;
    }
  }, {
    key: "onColor",
    value: function onColor(value) {
      // why doesn't this work?
      console.log('COLOR', value);
    }
  }, {
    key: "connected",
    value: function connected() {
      if (this.color) {
        this.style.color = this.color;
      }
    }
  }]);

  return UiIcon;
}(BaseComponent);

var missing;

function missingStylesheet() {
  missing = missing !== undefined ? missing : Boolean(dom.queryAll('link').find(function (link) {
    return /fontawesome/.test(link.href);
  }));
  return missing;
}

module.exports = BaseComponent.define('ui-icon', UiIcon, {
  props: ['type', 'color']
});

},{"./lib/icon-map":14,"@clubajax/base-component":4,"@clubajax/dom":8}],19:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BaseComponent = require('@clubajax/base-component');

var dom = require('@clubajax/dom');

var emitEvent = require('./lib/emitEvent');

require('./ui-icon');

var DEFAULT_PLACEHOLDER = 'Enter text...';

var UiInput =
/*#__PURE__*/
function (_BaseComponent) {
  _inherits(UiInput, _BaseComponent);

  function UiInput() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UiInput);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UiInput)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "readonly", void 0);

    _defineProperty(_assertThisInitialized(_this), "disabled", void 0);

    _defineProperty(_assertThisInitialized(_this), "placeholder", void 0);

    _defineProperty(_assertThisInitialized(_this), "icon", void 0);

    _defineProperty(_assertThisInitialized(_this), "label", void 0);

    _defineProperty(_assertThisInitialized(_this), "emitEvent", function (e) {
      e.stopPropagation();
      _this._value = _this.input.value;
      emitEvent(_assertThisInitialized(_this), _this._value);
    });

    return _this;
  }

  _createClass(UiInput, [{
    key: "attributeChanged",
    value: function attributeChanged(prop, value) {
      if (prop === 'value') {
        this.value = value;
      }
    }
  }, {
    key: "setValue",
    value: function setValue(value) {
      if (this.input) {
        this.input.value = value;
        this.setPlaceholder();
      }
    }
  }, {
    key: "onIcon",
    value: function onIcon(type) {
      this.iconNode.type = type;
    }
  }, {
    key: "onLabel",
    value: function onLabel() {
      this.labelNode.innerHTML = this.label;
    }
  }, {
    key: "onDisabled",
    value: function onDisabled(value) {
      if (this.input) {
        this.input.disabled = value;
      }
    }
  }, {
    key: "onReadonly",
    value: function onReadonly(value) {
      if (this.input) {
        this.input.readonly = value;
      }
    }
  }, {
    key: "setPlaceholder",
    value: function setPlaceholder() {// dom.classList.toggle(this, 'has-placeholder')
    }
  }, {
    key: "connected",
    value: function connected() {
      this.render();

      this.connected = function () {};
    }
  }, {
    key: "connect",
    value: function connect() {
      var _this2 = this;

      this.on(this.input, 'blur', function () {
        _this2.focused = false;

        _this2.emit('blur');
      });
      this.on(this.input, 'focus', function () {
        _this2.focused = true;

        _this2.emit('focus');
      });
      this.on(this.input, 'change', this.emitEvent);
    }
  }, {
    key: "render",
    value: function render() {
      this.labelNode = dom('label', {}, this);
      this.input = dom('input', {
        value: this._value || '',
        readonly: this.readonly,
        disabled: this.disabled,
        placeholder: this.placeholder || DEFAULT_PLACEHOLDER
      }, this);

      if (this.icon) {
        this.iconNode = dom('ui-icon', {
          type: this.icon
        }, this);
        this.classList.add('has-icon');
      }

      this.setPlaceholder();
      this.connect();
    }
  }, {
    key: "value",
    set: function set(value) {
      this._value = value === undefined || value === null ? '' : value;
      this.setValue(this._value);
    },
    get: function get() {
      return this.input.value || null;
    }
  }]);

  return UiInput;
}(BaseComponent);

function isNull(value) {
  return value === null || value === undefined;
}

module.exports = BaseComponent.define('ui-input', UiInput, {
  props: ['placeholder', 'label', 'limit', 'name', 'event-name', 'align', 'icon'],
  bools: ['disabled', 'ready', 'required', 'autofocus'],
  attrs: ['value']
});

},{"./lib/emitEvent":13,"./ui-icon":18,"@clubajax/base-component":4,"@clubajax/dom":8}],20:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BaseComponent = require('@clubajax/base-component');

var dom = require('@clubajax/dom');

var on = require('@clubajax/on');

var keys = require('@clubajax/key-nav');

var _emitEvent = require('./lib/emitEvent');

var ATTR = {
  LABEL: 'aria-label',
  ALIAS: 'alias',
  DISPLAY: 'display',
  SELECTED: 'aria-selected',
  DISABLED: 'disabled',
  TABINDEX: 'tabindex',
  VALUE: 'value'
}; // TODO!!!!
// a11y

var UIList =
/*#__PURE__*/
function (_BaseComponent) {
  _inherits(UIList, _BaseComponent);

  function UIList() {
    _classCallCheck(this, UIList);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIList).apply(this, arguments));
  }

  _createClass(UIList, [{
    key: "attributeChanged",
    value: function attributeChanged(prop, value) {
      if (prop === 'value') {
        this.value = value;
      }
    }
  }, {
    key: "onDisabled",
    value: function onDisabled() {
      var _this = this;

      if (this.items || this.lazyDataFN) {
        this.connectEvents();
      }

      this.onDomReady(function () {
        _this.setTabIndicies();
      });
    }
  }, {
    key: "onReadonly",
    value: function onReadonly() {
      this.connectEvents();
    }
  }, {
    key: "setLazyValue",
    value: function setLazyValue(value) {
      // emits a value, in spite of the list not yet being rendered
      var data = this.lazyDataFN();
      var item = data.find(function (m) {
        return m.value === value;
      });

      if (!item) {
        return;
      }

      this.emitEvent();
    }
  }, {
    key: "setLazyData",
    value: function setLazyData() {
      // to be called externally, for example, by a dropdown
      this.setData(this.lazyDataFN());
      this.lazyDataFN = null; // I think this should be next:

      this.connectEvents();
      this.fire('dom-update');
    }
  }, {
    key: "setData",
    value: function setData(data) {
      var _this2 = this;

      if (isEqual(this.orgData, data)) {
        return;
      }

      data = toArray(data);

      if (data.length && _typeof(data[0]) !== 'object') {
        data = data.map(function (item) {
          return {
            label: item,
            data: item
          };
        });
      }

      if (!this.lazyDataFN) {
        this.__value = undefined;
      }

      this.selectedNode = null;
      this.orgData = data;
      this.items = sort(_toConsumableArray(data), this.sortdesc, this.sortasc);
      this.update();
      this.onConnected(function () {
        _this2.setItemsFromData();
      });
    }
  }, {
    key: "addData",
    value: function addData(data) {
      data = toArray(data);
      this.items = [].concat(_toConsumableArray(this.items || []), _toConsumableArray(data));
      this.setItemsFromData();
    }
  }, {
    key: "removeData",
    value: function removeData(values) {
      var _this3 = this;

      values = toArray(values);
      values.forEach(function (value) {
        var index = _this3.items.findIndex(function (item) {
          return item.value === value;
        });

        if (index === -1) {
          console.warn('remove value, not found', value);
        }

        _this3.items.splice(index, 1);
      });
      this.setItemsFromData();
    }
  }, {
    key: "setItemsFromData",
    value: function setItemsFromData() {
      // uses an array of objects as the list items
      this.render();
      this.list.innerHTML = '';

      if (this.lazyDataFN && !this.items) {
        this.items = [];
      }

      if (dom.isNode(this.items[0])) {
        this.setDomData();
        return;
      }

      var parentValue = this.value;
      var list = this.list;
      var node;
      this.items.forEach(function (item) {
        if (item.type === 'divider') {
          dom('li', {
            "class": 'divider'
          }, list);
          return;
        }

        if (item.type === 'label') {
          dom('li', {
            "class": 'label',
            html: item.label
          }, list);
          return;
        }

        var label = item.alias ? "".concat(item.alias, ": ").concat(item.label) : item.label;

        if (item.value === undefined && label === undefined) {
          throw new Error('[ERROR] each items must have a value or a label');
        }

        if (item.value === undefined) {
          node = dom('div', {
            "class": 'label',
            html: label
          }, list);
          node.unselectable = true;
          return;
        }

        var options = {
          html: label,
          value: item.value
        };
        var isSelected = item.selected || item.value === parentValue;

        if (isSelected) {
          options['aria-selected'] = true;
        }

        if (item["class"]) {
          options["class"] = item["class"];
        }

        if (item.disabled) {
          options.disabled = true;
        }

        node = dom('li', options, list);
      });
      this.appendChild(this.list);
      this.update();
      this.connect();
    }
  }, {
    key: "initDomData",
    value: function initDomData() {
      // used only for the children of ui-list as the items
      var postValue;
      var parentValue = this.value;
      this.render();
      this.items = [];

      while (this.children.length) {
        var child = this.children[0];

        if (child.localName !== 'li') {
          console.warn("ui-list children should use LI's");
        }

        this.items.push({
          label: child.textContent,
          value: child.getAttribute(ATTR.VALUE)
        });

        if (child.hasAttribute(ATTR.SELECTED) || child.getAttribute(ATTR.VALUE) === parentValue) {
          this.selectedNode = child;
          this.orgSelected = child;
          this.items[this.items.length - 1].selected = true;

          if (!parentValue) {
            postValue = child.getAttribute(ATTR.VALUE);
          }
        }

        this.list.appendChild(child);
      }

      this.update();
      this.appendChild(this.list);
      this.connect();
      this.disabled = this.hasAttribute(ATTR.DISABLED);

      if (postValue || parentValue) {
        this.select(postValue || parentValue);
      }
    }
  }, {
    key: "setDomData",
    value: function setDomData() {
      // uses array of dom nodes, or document fragment
      // TODO: Do nodes need to be cloned?
      var list = this.list;

      if (this.items[0] && this.items[0].nodeType === 11) {
        // document fragment
        list.appendChild(this.items[0]);
      } else {
        this.items.forEach(function (node) {
          if (node.localName !== 'li') {
            throw new Error('list children should be of type "li"');
          }

          if (!node.getAttribute('value')) {
            node.setAttribute('value', valueify(node.textContent));
          }

          list.appendChild(node);
        });
      }

      this.appendChild(list);
      this.setItemsFromDom();
      this.update();
      this.connect();
    }
  }, {
    key: "setItemsFromDom",
    value: function setItemsFromDom() {
      var _this4 = this;

      // derives items list from dom 
      this.items = [];

      _toConsumableArray(this.list.children).forEach(function (child) {
        if (child.localName !== 'li') {
          console.warn("ui-list children should use LI's");
        }

        _this4.items.push({
          label: child.getAttribute(ATTR.LABEL) || child.textContent,
          value: child.getAttribute(ATTR.VALUE),
          alias: child.getAttribute(ATTR.ALIAS),
          display: child.getAttribute(ATTR.DISPLAY)
        });
      });
    }
  }, {
    key: "setControllerValue",
    value: function setControllerValue(value) {
      if (this.controller) {
        if (Array.isArray(value)) {
          if (!this.multiple) {
            throw new Error('Trying to set multiple values without the `multiple` attribute');
          }

          var selector = value.map(getSelector).join(',');
          this.controller.setSelected(dom.queryAll(this, selector));
        } else {
          this.controller.setSelected(dom.query(this, getSelector(value)));
        }
      } else {
        console.warn('UIList.setControllerValue: No controller');
      }
    }
  }, {
    key: "getItem",
    value: function getItem(value) {
      return this.items ? this.items.find(function (item) {
        return item.value === value || "".concat(item.value) === "".concat(value);
      }) : null;
    }
  }, {
    key: "connected",
    value: function connected() {
      if (this.lazyDataFN) {
        this.update();
      }

      if (this.items) {
        this.initDomData = function () {};

        this.setItemsFromData();
      }
    }
  }, {
    key: "domReady",
    value: function domReady() {
      if (!this.disabled && !this.readonly) {
        this.onDisabled();
      }

      if (this.items || this.lazyDataFN) {
        return;
      }

      this.initDomData();
    }
  }, {
    key: "emitEvent",
    value: function emitEvent() {
      // emits a "change" event
      _emitEvent(this, this.value);
    }
  }, {
    key: "update",
    value: function update() {// override me
      // called after items insertion, before list insertion
    }
  }, {
    key: "setTabIndicies",
    value: function setTabIndicies() {
      if (!this.list) {
        return;
      }

      if (!this.disabled) {
        this.setAttribute(ATTR.TABINDEX, '-1');
        this.list.setAttribute(ATTR.TABINDEX, '0');
      } else {
        this.removeAttribute(ATTR.TABINDEX);
        this.list.removeAttribute(ATTR.TABINDEX);
      }
    }
  }, {
    key: "connect",
    value: function connect() {
      // called after data is set
      this.connectController();
      this.connectEvents();

      this.connect = function () {};
    }
  }, {
    key: "connectController",
    value: function connectController() {
      var _this5 = this;

      var options = {
        canSelectNone: this.getAttribute('can-select-none'),
        multiple: this.multiple,
        searchTime: this.getAttribute('search-time'),
        externalSearch: this['external-search'],
        buttonId: this.buttonid,
        value: this.value
      };
      this.connectHandles = on.makeMultiHandle([this.on('click', function () {
        _this5.list.focus();
      }), this.on('focus', function () {
        _this5.list.focus();
      }), this.on('key-select', function () {
        if (_this5.value === _this5.lastValue) {
          return;
        }

        _this5.lastValue = _this5.value;

        _this5.emitEvent();
      })]);
      this.controller = keys(this.list, options);
    }
  }, {
    key: "connectEvents",
    value: function connectEvents() {
      if (this.lazyDataFN) {
        return;
      }

      var enabled = !this.readonly && !this.disabled;
      this.setTabIndicies();

      if (!enabled && !this.controller) {
        return;
      }

      if (!enabled && this.controller) {
        this.controller.pause();
        this.connectHandles.pause();
      } else if (enabled && this.controller) {
        this.controller.resume();
        this.connectHandles.resume();
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this.value = this.__value;
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.labelNode && this.label) {
        // TODO: a11y?
        this.labelNode = dom('label', {
          html: this.label
        }, this);
      }

      if (!this.list) {
        this.list = dom('ul', {});
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(UIList.prototype), "destroy", this).call(this);
    }
  }, {
    key: "value",
    set: function set(value) {
      var _this6 = this;

      this.onDomReady(function () {
        _this6.setControllerValue(value);
      });
      this.__value = value;
    },
    get: function get() {
      if (!this.controller) {
        return this.__value || this.getAttribute('value');
      }

      if (this.multiple) {
        return this.controller.getSelected().map(function (node) {
          return node.getAttribute('value');
        });
      }

      var node = this.controller.getSelected();

      if (node) {
        return node.getAttribute('value');
      }

      return this.__value || null;
    }
  }, {
    key: "data",
    set: function set(data) {
      var _this7 = this;

      if (noValues(data)) {
        throw new Error('data does not contain any values');
      }

      if (typeof data === 'function') {
        this.lazyDataFN = data;
        this.onConnected(function () {
          _this7.render();

          _this7.connect();
        });
        return;
      }

      this.setData(data);
    },
    get: function get() {
      return this.items;
    }
  }]);

  return UIList;
}(BaseComponent);

function toArray(data) {
  return Array.isArray(data) ? data : [data];
}

function getSelector(val) {
  return "[value=\"".concat(val, "\"]");
}

function valueify(text) {
  return text.replace(/\s/g, '-').toLowerCase();
}

function sort(items, desc, asc) {
  if (desc) {
    items.sort(function (a, b) {
      return a[desc] > b[desc] ? 1 : -1;
    });
  }

  if (asc) {
    items.sort(function (a, b) {
      return a[asc] < b[asc] ? 1 : -1;
    });
  }

  return items;
}

function isEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (!a || !b || !Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }

  return a.map(function (m) {
    return m.value;
  }).join(',') === b.map(function (m) {
    return m.value;
  }).join(',');
}

function noValues(data) {
  // no data is okay
  if (!data.length) {
    return false;
  } // custom app expects IDs


  return !data.find(function (d) {
    return !!d.value || !!d.id;
  });
}

module.exports = BaseComponent.define('ui-list', UIList, {
  props: ['label', 'limit', 'name', 'event-name', 'align', 'buttonid', 'external-search', 'sortdesc', 'sortasc'],
  bools: ['disabled', 'readonly', 'multiple'],
  attrs: ['value']
});

},{"./lib/emitEvent":13,"@clubajax/base-component":4,"@clubajax/dom":8,"@clubajax/key-nav":9,"@clubajax/on":11}],21:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BaseComponent = require('@clubajax/base-component');

var dom = require('@clubajax/dom');

var on = require('@clubajax/on');

var UiPopup =
/*#__PURE__*/
function (_BaseComponent) {
  _inherits(UiPopup, _BaseComponent);

  function UiPopup() {
    var _this;

    _classCallCheck(this, UiPopup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UiPopup).call(this));

    _defineProperty(_assertThisInitialized(_this), "align", void 0);

    _defineProperty(_assertThisInitialized(_this), "buttonid", void 0);

    _defineProperty(_assertThisInitialized(_this), "label", void 0);

    _this.showing = false;
    _this.handleMediaQuery = _this.handleMediaQuery.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(UiPopup, [{
    key: "onOpen",
    value: function onOpen(value) {
      var _this2 = this;

      this.onDomReady(function () {
        if (value) {
          _this2.show();
        } else {
          _this2.hide();
        }
      });
    }
  }, {
    key: "domReady",
    value: function domReady() {
      this.component = this.children[0] || {};
      this.button = dom.byId(this.buttonid);

      if (!this.button) {
        throw new Error('ui-tooltip must be associated with a parent via the parnetid');
      }

      this.connectEvents();

      if (!this.parentNode) {
        document.body.appendChild(this);
      }

      this.mq = window.matchMedia('(max-width: 415px)');
      this.mq.addListener(this.handleMediaQuery);
      this.handleMediaQuery(this.mq);
    }
  }, {
    key: "renderMobileButtons",
    value: function renderMobileButtons() {
      var _this3 = this;

      if (this['use-hover']) {
        // this is a tooltip, not a dropdown
        return;
      } // mobile label for dropdowns


      if (this.label) {
        this.labelNode = dom('label', {
          "class": 'ui-label',
          html: this.label
        });
        dom.place(this, this.labelNode, 0);
      } // mobile button for dropdowns


      dom('div', {
        "class": 'ui-button-row',
        html: [dom('button', {
          html: 'Close',
          "class": 'ui-button tertiary'
        }), dom('button', {
          html: 'Done',
          "class": 'ui-button tertiary'
        })]
      }, this);
      dom.queryAll(this, '.ui-button-row .ui-button').forEach(function (button, i) {
        _this3.mobileEvents = _this3.on(button, 'click', function () {
          if (i === 1) {
            if (_this3.component.emitEvent) {
              _this3.component.blockEvent = false;

              _this3.component.emitEvent();

              _this3.component.blockEvent = true;
            }
          } else if (_this3.component.reset) {
            _this3.component.reset();
          }

          _this3.hide();
        });
      });
    }
  }, {
    key: "removeMobileButtons",
    value: function removeMobileButtons() {
      dom.queryAll(this, '.ui-button-row .ui-button').forEach(function (button) {
        dom.destroy(button);
      });
      dom.destroy(this.labelNode);

      if (this.mobileEvents) {
        this.mobileEvents.remove();
      }
    }
  }, {
    key: "connectEvents",
    value: function connectEvents() {
      var _this4 = this;

      if (this.button) {
        if (this['use-hover']) {
          this.connectHoverEvents();
        } else {
          this.clickoff = on.makeMultiHandle([on(this, 'clickoff', function () {
            _this4.hide();
          }), onScroll(this.hide.bind(this))]);
          this.on(this.button, 'click', function (e) {
            _this4.show();
          });
          this.on(this.button, 'keydown', function (e) {
            if (e.key === 'Enter' && !_this4.showing) {
              // prevent key-nav from detecting Enter when not open
              e.preventDefault();

              _this4.show();
            }
          });
          this.on(this.button, 'blur', function () {
            _this4.hide();
          });
        }
      }
    }
  }, {
    key: "connectHoverEvents",
    value: function connectHoverEvents() {
      var _this5 = this;

      var HIDE_TIMEOUT = this['hide-timer'] || 500;
      var timer;

      var show = function show() {
        clearTimeout(timer);

        _this5.show();
      };

      var hide = function hide(immediate) {
        if (immediate === true) {
          _this5.hide();

          return;
        }

        timer = setTimeout(function () {
          _this5.hide();
        }, HIDE_TIMEOUT);
      };

      this.on(this.button, 'mouseenter', show);
      this.on(this.button, 'mouseleave', hide);
      this.on('mouseenter', show);
      this.on('mouseleave', hide);
      this.clickOff = onScroll(hide);
      this.clickOff.resume();
    }
  }, {
    key: "handleMediaQuery",
    value: function handleMediaQuery(event) {
      if (event.matches) {
        this.component.blockEvent = true;
        this.isMobile = true;
        clearPosition(this);
        this.classList.add('is-mobile');
        this.renderMobileButtons();
      } else {
        this.component.blockEvent = false;
        this.isMobile = false;
        this.classList.remove('is-mobile');
        position(this, this.button);
        this.removeMobileButtons();
      }
    }
  }, {
    key: "show",
    value: function show() {
      if (this.showing) {
        return;
      }

      this.showing = true;
      this.classList.add('open');

      if (this.clickoff) {
        this.clickoff.resume();
      }

      if (!this.isMobile) {
        position(this, this.button, this.align);
      }

      this.fire('popup-open');
    }
  }, {
    key: "hide",
    value: function hide() {
      if (!this.showing || window.keepPopupsOpen) {
        return;
      }

      this.showing = false;
      this.classList.remove('open');

      if (this.clickoff) {
        this.clickoff.pause();
      }

      this.fire('popup-close');
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.clickoff) {
        this.clickoff.remove();
      }

      if (this.mq) {
        this.mq.removeListener(this.handleMediaQuery);
      }

      _get(_getPrototypeOf(UiPopup.prototype), "destroy", this).call(this);
    }
  }]);

  return UiPopup;
}(BaseComponent);

function clearPosition(popup, tooltip) {
  if (tooltip) {
    dom.classList.remove(tooltip, 'T R B L');
  }

  dom.style(popup, {
    left: '',
    right: '',
    top: '',
    bottom: '',
    height: '',
    width: '',
    overflow: ''
  });
}

function positionTooltip(popup, button, align) {
  var LOG = window.debugPopups;
  var tooltip = dom.query(popup, '.ui-tooltip');
  clearPosition(popup, tooltip);
  var win = {
    w: window.innerWidth,
    h: window.innerHeight
  };
  var pop = dom.box(popup);
  var btn = dom.box(button);
  var GAP = 15;
  var style = {};
  LOG && console.log('align:', align, '\nbutton:', button, '\npopup:', popup, '\nwin', win, '\npop', pop, '\nbtn', btn);

  function addClass(cls) {
    if (tooltip) {
      tooltip.classList.add(cls);
    }
  }

  function midY() {
    if (btn.h > pop.h) {
      return btn.y + (btn.h - pop.h) / 2;
    }

    return btn.y - (pop.h - btn.h) / 2;
  }

  function midX() {
    if (btn.w > pop.w) {
      return btn.x + (btn.w - pop.w) / 2;
    }

    return btn.x - (pop.w - btn.w) / 2;
  }

  function right() {
    style.top = midY();
    style.left = btn.x + btn.w + GAP;
    addClass('R');
  }

  function left() {
    style.top = midY();
    style.right = win.w - btn.x + GAP;
    addClass('L');
  }

  function bottom() {
    style.left = midX();
    style.top = btn.y + btn.h + GAP;
    addClass('B');
  }

  function top() {
    style.left = midX();
    style.top = btn.y - pop.h - GAP;
    addClass('T');
  }

  var fitR = function fitR() {
    return btn.x + btn.w + pop.w + GAP < win.w;
  };

  var fitL = function fitL() {
    return btn.x - pop.w - GAP > 0;
  };

  var fitT = function fitT() {
    return btn.y - pop.h - GAP > 0;
  };

  var fitB = function fitB() {
    return btn.y + btn.h + pop.h + GAP < win.h;
  };

  switch (align) {
    case 'R':
      if (fitR()) {
        right();
      } else if (fitL()) {
        left();
      } else {
        console.warn('Button is too wide to fit a tooltip next to it');
      }

      break;

    case 'L':
      if (fitL()) {
        left();
      } else if (fitR()) {
        right();
      } else {
        console.warn('Button is too wide to fit a tooltip next to it');
      }

      break;

    case 'T':
      if (fitT()) {
        top();
      } else if (fitB()) {
        bottom();
      } else {
        console.warn('Button is too tall to fit a tooltip above or below it');
      }

      break;

    default:
      if (fitB()) {
        bottom();
      } else if (fitT()) {
        top();
      } else {
        console.warn('Button is too tall to fit a tooltip above or below it');
      }

  }

  dom.style(popup, style);
}

function position(popup, button, align) {
  if (align && align.length === 1) {
    // TODO: may want to use TRBL for dropdowns
    // consider checking for a tooltip node instead
    positionTooltip(popup, button, align);
    return;
  }

  clearPosition(popup);
  var LOG = window.debugPopups;
  var GAP = 5;
  var MIN_BOT_SPACE = 200;
  var style = {};
  var bodyPad = dom.style(document.body, 'padding-left');
  var win = {
    w: window.innerWidth,
    h: window.innerHeight
  };
  var btn = dom.box(button);
  var pop = dom.box(popup);
  var topSpace = btn.top;
  var botSpace = win.h - (btn.top + btn.h + GAP);
  var rightSpace = win.w - btn.x;
  var leftSpace = btn.x + btn.w;
  LOG && console.log('\nbutton:', button, '\npopup:', popup, '\nwin', win, '\npop', pop, '\nbtn', btn, '\ntopSpace', topSpace, '\nbotSpace', botSpace, '\nleftSpace', leftSpace, '\nrightSpace', rightSpace); // position left/right & width

  if (align === 'right' || leftSpace > pop.w && leftSpace > rightSpace) {
    // left-side
    style.top = btn.y + btn.h;
    style.right = win.w - (btn.x + btn.w);
  } else if (rightSpace > pop.w) {
    // right-side
    style.top = btn.y + btn.h;
    style.left = btn.x;
  } else if (rightSpace > leftSpace) {
    // right-side, resize popup
    style.top = btn.y + btn.h;
    style.left = btn.x;
    style.width = rightSpace - bodyPad;
  } else {
    // left-side, resize popup
    style.top = btn.y + btn.h;
    style.right = win.w - (btn.x + btn.w);
    style.width = leftSpace - bodyPad;
  } // position top/bottom & height


  if (pop.h > topSpace && pop.h > botSpace) {
    if (botSpace < MIN_BOT_SPACE || topSpace > botSpace * 1.5) {
      // force top
      style.height = topSpace - GAP * 2;
      style.bottom = win.h - btn.y;
      style.top = '';
      style.overflow = 'auto';
    } else {
      // force bottom
      style.height = botSpace - GAP * 2;
      style.overflow = 'auto';
    }
  } else if (botSpace < pop.h) {
    // top
    style.top = '';
    style.bottom = win.h - btn.y;
  }

  dom.style(popup, style);
}

function onScroll(hide) {
  return {
    resume: function resume() {
      window.addEventListener('scroll', function () {
        hide(true);
      }, true);
    },
    pause: function pause() {
      window.removeEventListener('scroll', hide);
    },
    remove: function remove() {
      window.removeEventListener('scroll', hide);
    }
  };
}

module.exports = BaseComponent.define('ui-popup', UiPopup, {
  props: ['buttonid', 'label', 'align', 'use-hover'],
  bools: ['open']
});

},{"@clubajax/base-component":4,"@clubajax/dom":8,"@clubajax/on":11}],22:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BaseComponent = require('@clubajax/base-component');

var dom = require('@clubajax/dom');

var nodash = require('@clubajax/no-dash');

var _emitEvent = require('./lib/emitEvent');

var FormElement = require('./lib/BaseField');

require('./ui-radio');

var RadioButtons =
/*#__PURE__*/
function (_FormElement) {
  _inherits(RadioButtons, _FormElement);

  function RadioButtons() {
    var _this;

    _classCallCheck(this, RadioButtons);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RadioButtons).call(this));
    _this.items = [];
    _this.radios = [];
    return _this;
  }

  _createClass(RadioButtons, [{
    key: "domReady",
    value: function domReady() {
      if (this.items) {
        this.render();
      }
    }
  }, {
    key: "setValue",
    value: function setValue(value, silent) {
      var _this2 = this;

      this.onDomReady(function () {
        var isChk = _this2.type === 'checks';
        value = unDef(value) ? [] : Array.isArray(value) ? value : value.split(',');

        _this2.radios.forEach(function (radio) {
          var radioValue = isChk ? radio.name : radio.value;

          if (radioValue === 0) {
            console.warn('values of `0` may not work as expected');
          }

          var checked = value.includes(radioValue);

          if (_this2.type === 'buttons') {
            dom.attr(radio, {
              checked: checked,
              'aria-selected': checked ? 'true' : 'false'
            });
          } else {
            radio.checked = checked;
          }
        });

        if (!silent) {
          _this2.emitEvent();
        }
      });
    }
  }, {
    key: "add",
    value: function add(item) {
      this.items.push(item);

      if (item.selected && this.type !== 'checks') {
        this.setValue(null, true);
        this.setAttribute('value', item.value);
      }

      this.addElement(item);
      this.connect();
    }
  }, {
    key: "addElement",
    value: function addElement(item) {
      var isChk = this.type === 'checks';
      var isBtn = this.type === 'buttons';
      var localName = isBtn ? 'button' : isChk ? 'ui-checkbox' : 'ui-radio';
      var cls = isBtn ? 'btn' : isChk ? 'small' : '';
      var html = isBtn ? item.label : '';
      var value = this.value;
      var name = isChk ? item.value : this.name;
      var checked = !!(item.selected || value && (!isChk ? value === item.value : value.includes(item.value)));
      this.radios.push(dom(localName, {
        name: name,
        html: html,
        checked: checked,
        value: item.value,
        label: item.label,
        "class": cls,
        'event-name': 'check-change'
      }, this));

      if (isBtn) {
        dom.attr(this.radios[this.radios.length - 1], 'aria-selected', checked ? 'true' : 'false');
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      this.innerHTML = '';
      this.radios = [];

      if (this.label) {
        this.labelNode = dom('label', {
          html: this.label,
          "class": 'radio-buttons-label'
        }, this);
      }

      this.items.forEach(function (item) {
        _this3.addElement(item);
      });
      this.connect();
    }
  }, {
    key: "emitEvent",
    value: function emitEvent() {
      _emitEvent(this, {
        value: this.value,
        index: this.index
      });
    }
  }, {
    key: "connect",
    value: function connect() {
      if (this.type === 'buttons') {
        this.connectButtons();
      } else if (this.type === 'checks') {
        this.connectChecks();
      } else {
        this.connectRadios();
      }

      this.connect = function () {};
    }
  }, {
    key: "onCheck",
    value: function onCheck(value, checked, silent) {
      var isBtn = this.type === 'buttons';
      var isChk = this.type === 'checks';
      var type = this.type || 'radios';
      var allowNone = this['allow-unchecked'];

      switch (type) {
        case 'checks':
          if (value) {
            if (checked) {
              this.value = nodash.deDupe([].concat(_toConsumableArray(this.value), [value]));
            } else {
              this.value = nodash.remove(this.value, value);
            }
          } else if (allowNone) {
            this.value = null;
          } else {
            this.value = this.items[0].value;
          }

          break;

        case 'radios':
        case 'buttons':
          if (checked) {
            this.value = value;
          } else if (!checked && allowNone) {
            this.value = null;
          } else {
            this.setValue(value, true);
          }

          if (type === 'buttons') {}

          break;
      }
    }
  }, {
    key: "connectChecks",
    value: function connectChecks() {
      var _this4 = this;

      this.on('check-change', function (e) {
        _this4.onCheck(e.target.getAttribute('name'), e.detail.value);
      });
    }
  }, {
    key: "connectRadios",
    value: function connectRadios() {
      var _this5 = this;

      this.on('check-change', function (e) {
        _this5.onCheck(e.detail.value, e.target.checked);
      });
    }
  }, {
    key: "connectButtons",
    value: function connectButtons() {
      var _this6 = this;

      var eventName = this.type === 'buttons' ? 'click' : 'check-change';
      this.on(eventName, function (e) {
        if (e.target.classList.contains('radio-buttons-label')) {
          return;
        }

        var value = e.target.value;
        var isChecked = e.target.getAttribute('checked');

        if (isChecked && _this6['allow-unchecked']) {
          value = null;
        }

        _this6.value = value;
      });
    }
  }, {
    key: "data",
    set: function set(items) {
      this.items = items;

      if (this.DOMSTATE === 'domready') {
        this.render();
      }
    },
    get: function get() {
      return this.items;
    }
  }, {
    key: "value",
    set: function set(value) {
      if (value === this.value) {
        return;
      }

      this.isSettingAttribute = true;
      this.setAttribute('value', sort(value));
      this.isSettingAttribute = false;
      this.setValue(value);
    },
    get: function get() {
      var value = dom.normalize(this.getAttribute('value'));

      if (this.type === 'checks') {
        return value.split(',');
      }

      return value;
    }
  }, {
    key: "index",
    set: function set(index) {
      var _this7 = this;

      this.onDomReady(function () {
        if (_this7.data) {
          _this7.value = _this7.data[index].value;
        }
      });
    },
    get: function get() {
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].value === this.value) {
          return i;
        }
      }

      return null;
    }
  }]);

  return RadioButtons;
}(FormElement);

function sort(value) {
  value = typeof value === 'string' ? value.split(',') : value;

  if (!Array.isArray(value)) {
    return value;
  }

  value.sort(function (a, b) {
    if (a < b) {
      return -1;
    } else if (b < a) {
      return 1;
    }

    return 0;
  });
  return nodash.remove(value, '').join(',');
}

function unDef(value) {
  return value === undefined || value === null;
}

module.exports = BaseComponent.define('ui-radio-buttons', RadioButtons, {
  props: ['type'],
  bools: ['allow-unchecked'],
  attrs: ['index']
});

},{"./lib/BaseField":12,"./lib/emitEvent":13,"./ui-radio":23,"@clubajax/base-component":4,"@clubajax/dom":8,"@clubajax/no-dash":10}],23:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BaseComponent = require('@clubajax/base-component');

var dom = require('@clubajax/dom');

var FormElement = require('./lib/BaseField');

var uid = require('./lib/uid');

var Radio =
/*#__PURE__*/
function (_FormElement) {
  _inherits(Radio, _FormElement);

  function Radio() {
    _classCallCheck(this, Radio);

    return _possibleConstructorReturn(this, _getPrototypeOf(Radio).apply(this, arguments));
  }

  _createClass(Radio, [{
    key: "onChecked",
    value: function onChecked(value) {
      dom.attr(this.input, 'aria-checked', "".concat(value));
    }
  }, {
    key: "setValue",
    value: function setValue(value, silent) {
      this.value = value;

      if (!silent && this.canEmit()) {
        this.emitEvent();
      }
    }
  }, {
    key: "toggle",
    value: function toggle() {
      this.checked = !this.checked;

      if (this.canEmit()) {
        this.emitEvent();
      } else {
        this.fire('toggle', {
          value: this.value
        });
      }
    }
  }, {
    key: "connected",
    value: function connected() {
      var _this = this;

      this.render();
      this.on('keyup', function (e) {
        if (!_this.canEmit()) {
          return;
        }

        if (e.key === 'Enter' || e.key === 'Spacebar' || e.key === ' ') {
          _this.toggle();
        }
      });
      this.on('click', function (e) {
        if (!_this.canEmit()) {
          return;
        }

        _this.toggle();
      });

      this.connected = function () {};
    }
  }, {
    key: "render",
    value: function render() {
      var html = this.label || '';
      var chkId = this.label ? this.id || uid('radio') : null;
      var lblId = this.label ? this.id || uid('label') : null;
      this.labelNode = dom('span', {
        html: html,
        "class": 'ui-label',
        'for': chkId,
        id: lblId
      });
      this.input = dom('div', {
        "class": 'radio-button',
        id: chkId,
        role: 'radio',
        'aria-labelledby': lblId,
        'aria-checked': false,
        tabindex: '0'
      });

      if (this['check-after']) {
        this.appendChild(this.labelNode);
        this.appendChild(this.input);
      } else {
        this.appendChild(this.input);
        this.appendChild(this.labelNode);
      }

      dom.attr(this, 'label', false);
    }
  }, {
    key: "event",
    get: function get() {
      return {
        value: this.value,
        checked: this.checked,
        name: this.name
      };
    }
  }]);

  return Radio;
}(FormElement);

module.exports = BaseComponent.define('ui-radio', Radio, {
  props: [],
  bools: ['checked', 'check-after'],
  attrs: []
});

},{"./lib/BaseField":12,"./lib/uid":15,"@clubajax/base-component":4,"@clubajax/dom":8}],24:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BaseComponent = require('@clubajax/base-component');

var dom = require('@clubajax/dom');

var uid = require('./lib/uid');

require('./ui-popup');

require('./ui-list');

require('./ui-icon');

require('./ui-input'); // https://blog.mobiscroll.com/how-to-do-multiple-selection-on-mobile/
// https://adamsilver.io/articles/building-an-accessible-autocomplete-control/
// data-alt


var DEFAULT_PLACEHOLDER = 'Begin typing...';

var UiSearch =
/*#__PURE__*/
function (_BaseComponent) {
  _inherits(UiSearch, _BaseComponent);

  function UiSearch() {
    _classCallCheck(this, UiSearch);

    return _possibleConstructorReturn(this, _getPrototypeOf(UiSearch).apply(this, arguments));
  }

  _createClass(UiSearch, [{
    key: "onBusy",
    value: function onBusy(value) {
      this.input.icon = value ? 'spinner' : 'search';
    }
  }, {
    key: "setDisplay",
    value: function setDisplay() {
      var item = this.list ? this.list.getItem(this.value) : {};
      this.__value = item ? item.value : this.__value;
      this.input.value = isNull(this.value) ? '' : item.display || item.alias || item.label;

      if (this.popup) {
        dom.style(this.popup, {
          'min-width': dom.box(this.input).w
        });
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this.list.reset();
    }
  }, {
    key: "connected",
    value: function connected() {
      this.render();
      this.connectEvents();

      this.connected = function () {};
    }
  }, {
    key: "connectEvents",
    value: function connectEvents() {
      var _this = this;

      this.list.on('list-change', function () {
        _this.setDisplay();

        _this.emit('change', {
          value: _this.value
        });

        setTimeout(function () {
          _this.popup.hide();
        }, 300);
      });
      this.input.on('key-search', function (e) {
        _this.fire('search', {
          value: e.detail.value
        });
      });
      this.input.on('focus', function () {
        _this.classList.add('is-focused');
      });
      this.input.on('focus', function () {
        _this.classList.remove('is-focused');
      });
    }
  }, {
    key: "renderButton",
    value: function renderButton(buttonid) {
      this.input = dom('ui-input', {
        id: buttonid,
        'event-name': 'input-change',
        "class": 'search-input',
        placeholder: this.placeholder || DEFAULT_PLACEHOLDER,
        icon: this.busy ? 'spinner' : 'search'
      }, this);
      this.setDisplay();
    }
  }, {
    key: "render",
    value: function render() {
      this.labelNode = dom('label', {
        html: this.label,
        "class": 'ui-label'
      }, this);
      var buttonid = uid('drop-button');
      this.renderButton(buttonid);
      this.list = dom('ui-list', {
        'event-name': 'list-change',
        'external-search': true,
        buttonid: buttonid
      });
      this.popup = dom('ui-popup', {
        buttonid: buttonid,
        label: this.label,
        html: this.list
      }, document.body);
      this.setDisplay();
    }
  }, {
    key: "value",
    set: function set(value) {
      var _this2 = this;

      this.onDomReady(function () {
        _this2.list.value = value;

        _this2.setDisplay();
      });
      this.__value = value;
    },
    get: function get() {
      if (!this.list) {
        return this.__value || this.getAttribute('value');
      }

      return this.list.value;
    }
  }, {
    key: "data",
    set: function set(data) {
      var _this3 = this;

      this.onDomReady(function () {
        _this3.list.data = data;

        if (_this3.input.focused) {
          _this3.popup.show();
        }
      });
      this.__data = data;
    },
    get: function get() {
      return this.list ? this.list.items : this.__data;
    }
  }]);

  return UiSearch;
}(BaseComponent);

function isNull(value) {
  return value === null || value === undefined;
}

module.exports = BaseComponent.define('ui-search', UiSearch, {
  props: ['placeholder', 'label', 'limit', 'name', 'event-name', 'align', 'btn-class'],
  bools: ['disabled', 'open-when-blank', 'allow-new', 'required', 'case-sensitive', 'autofocus', 'busy'],
  attrs: ['value']
});

},{"./lib/uid":15,"./ui-icon":18,"./ui-input":19,"./ui-list":20,"./ui-popup":21,"@clubajax/base-component":4,"@clubajax/dom":8}],25:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BaseComponent = require('@clubajax/base-component');

var dom = require('@clubajax/dom');

var popup = require('./ui-popup');

var UiTooltip =
/*#__PURE__*/
function (_BaseComponent) {
  _inherits(UiTooltip, _BaseComponent);

  function UiTooltip() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UiTooltip);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UiTooltip)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "open", void 0);

    return _this;
  }

  _createClass(UiTooltip, [{
    key: "domReady",
    value: function domReady() {
      if (!this.value && this.innerHTML.length) {
        this.value = this.innerHTML;
        this.innerHTML = '';
      }

      this.render();
    }
  }, {
    key: "render",
    value: function render() {
      var align = this.align || 'R';
      this.popup = dom('ui-popup', {
        html: dom('div', {
          "class": "ui-tooltip ".concat(this.className),
          html: this.value
        }),
        buttonid: this.parentNode,
        'use-hover': true,
        align: align,
        'hide-timer': this['hide-timer'],
        open: this.open
      }, document.body);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      _get(_getPrototypeOf(UiTooltip.prototype), "destroy", this).call(this);

      this.popup.destroy();
    }
  }]);

  return UiTooltip;
}(BaseComponent);

module.exports = BaseComponent.define('ui-tooltip', UiTooltip, {
  props: ['align', 'hide-timer'],
  attrs: ['value', 'open']
});

},{"./ui-popup":21,"@clubajax/base-component":4,"@clubajax/dom":8}]},{},[1]);
