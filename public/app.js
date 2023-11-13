new EventSource("http://localhost:5000/esbuild").addEventListener("change",()=>location.reload())

// node_modules/svelte/src/runtime/internal/utils.js
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}

// node_modules/svelte/src/runtime/internal/globals.js
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : (
  // @ts-ignore Node typings have this
  global
);

// node_modules/svelte/src/runtime/internal/ResizeObserverSingleton.js
var ResizeObserverSingleton = class _ResizeObserverSingleton {
  /**
   * @private
   * @readonly
   * @type {WeakMap<Element, import('./private.js').Listener>}
   */
  _listeners = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;
  /**
   * @private
   * @type {ResizeObserver}
   */
  _observer = void 0;
  /** @type {ResizeObserverOptions} */
  options;
  /** @param {ResizeObserverOptions} options */
  constructor(options) {
    this.options = options;
  }
  /**
   * @param {Element} element
   * @param {import('./private.js').Listener} listener
   * @returns {() => void}
   */
  observe(element2, listener) {
    this._listeners.set(element2, listener);
    this._getObserver().observe(element2, this.options);
    return () => {
      this._listeners.delete(element2);
      this._observer.unobserve(element2);
    };
  }
  /**
   * @private
   */
  _getObserver() {
    return this._observer ?? (this._observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        _ResizeObserverSingleton.entries.set(entry.target, entry);
        this._listeners.get(entry.target)?.(entry);
      }
    }));
  }
};
ResizeObserverSingleton.entries = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;

// node_modules/svelte/src/runtime/internal/dom.js
var is_hydrating = false;
function start_hydrating() {
  is_hydrating = true;
}
function end_hydrating() {
  is_hydrating = false;
}
function append(target, node) {
  target.appendChild(node);
}
function append_styles(target, style_sheet_id, styles) {
  const append_styles_to = get_root_for_style(target);
  if (!append_styles_to.getElementById(style_sheet_id)) {
    const style = element("style");
    style.id = style_sheet_id;
    style.textContent = styles;
    append_stylesheet(append_styles_to, style);
  }
}
function get_root_for_style(node) {
  if (!node)
    return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && /** @type {ShadowRoot} */
  root.host) {
    return (
      /** @type {ShadowRoot} */
      root
    );
  }
  return node.ownerDocument;
}
function append_stylesheet(node, style) {
  append(
    /** @type {Document} */
    node.head || node,
    style
  );
  return style.sheet;
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function svg_element(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data)
    return;
  text2.data = /** @type {string} */
  data;
}
function toggle_class(element2, name, toggle) {
  element2.classList.toggle(name, !!toggle);
}
function get_custom_elements_slots(element2) {
  const result = {};
  element2.childNodes.forEach(
    /** @param {Element} node */
    (node) => {
      result[node.slot || "default"] = true;
    }
  );
  return result;
}

// node_modules/svelte/src/runtime/internal/lifecycle.js
var current_component;
function set_current_component(component) {
  current_component = component;
}

// node_modules/svelte/src/runtime/internal/scheduler.js
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = /* @__PURE__ */ Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
var seen_callbacks = /* @__PURE__ */ new Set();
var flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}

// node_modules/svelte/src/runtime/internal/transitions.js
var outroing = /* @__PURE__ */ new Set();
var outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
    // parent group
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}

// node_modules/svelte/src/runtime/internal/each.js
function ensure_array_like(array_like_or_iterator) {
  return array_like_or_iterator?.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function outro_and_destroy_block(block, lookup) {
  transition_out(block, 1, 1, () => {
    lookup.delete(block.key);
  });
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block2, next, get_context) {
  let o = old_blocks.length;
  let n = list.length;
  let i = o;
  const old_indexes = {};
  while (i--)
    old_indexes[old_blocks[i].key] = i;
  const new_blocks = [];
  const new_lookup = /* @__PURE__ */ new Map();
  const deltas = /* @__PURE__ */ new Map();
  const updates = [];
  i = n;
  while (i--) {
    const child_ctx = get_context(ctx, list, i);
    const key = get_key(child_ctx);
    let block = lookup.get(key);
    if (!block) {
      block = create_each_block2(key, child_ctx);
      block.c();
    } else if (dynamic) {
      updates.push(() => block.p(child_ctx, dirty));
    }
    new_lookup.set(key, new_blocks[i] = block);
    if (key in old_indexes)
      deltas.set(key, Math.abs(i - old_indexes[key]));
  }
  const will_move = /* @__PURE__ */ new Set();
  const did_move = /* @__PURE__ */ new Set();
  function insert2(block) {
    transition_in(block, 1);
    block.m(node, next);
    lookup.set(block.key, block);
    next = block.first;
    n--;
  }
  while (o && n) {
    const new_block = new_blocks[n - 1];
    const old_block = old_blocks[o - 1];
    const new_key = new_block.key;
    const old_key = old_block.key;
    if (new_block === old_block) {
      next = new_block.first;
      o--;
      n--;
    } else if (!new_lookup.has(old_key)) {
      destroy(old_block, lookup);
      o--;
    } else if (!lookup.has(new_key) || will_move.has(new_key)) {
      insert2(new_block);
    } else if (did_move.has(old_key)) {
      o--;
    } else if (deltas.get(new_key) > deltas.get(old_key)) {
      did_move.add(new_key);
      insert2(new_block);
    } else {
      will_move.add(old_key);
      o--;
    }
  }
  while (o--) {
    const old_block = old_blocks[o];
    if (!new_lookup.has(old_block.key))
      destroy(old_block, lookup);
  }
  while (n)
    insert2(new_blocks[n - 1]);
  run_all(updates);
  return new_blocks;
}

// node_modules/svelte/src/shared/boolean_attributes.js
var _boolean_attributes = (
  /** @type {const} */
  [
    "allowfullscreen",
    "allowpaymentrequest",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
    "inert",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected"
  ]
);
var boolean_attributes = /* @__PURE__ */ new Set([..._boolean_attributes]);

// node_modules/svelte/src/runtime/internal/Component.js
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance3, create_fragment3, not_equal, props, append_styles2 = null, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles2 && append_styles2($$.root);
  let ready = false;
  $$.ctx = instance3 ? instance3(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment3 ? create_fragment3($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      start_hydrating();
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    end_hydrating();
    flush();
  }
  set_current_component(parent_component);
}
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    /** The Svelte component constructor */
    $$ctor;
    /** Slots */
    $$s;
    /** The Svelte component instance */
    $$c;
    /** Whether or not the custom element is connected */
    $$cn = false;
    /** Component props data */
    $$d = {};
    /** `true` if currently in the process of reflecting component props back to attributes */
    $$r = false;
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    $$p_d = {};
    /** @type {Record<string, Function[]>} Event listeners */
    $$l = {};
    /** @type {Map<Function, Function>} Event listener unsubscribe functions */
    $$l_u = /* @__PURE__ */ new Map();
    constructor($$componentCtor, $$slots, use_shadow_dom) {
      super();
      this.$$ctor = $$componentCtor;
      this.$$s = $$slots;
      if (use_shadow_dom) {
        this.attachShadow({ mode: "open" });
      }
    }
    addEventListener(type, listener, options) {
      this.$$l[type] = this.$$l[type] || [];
      this.$$l[type].push(listener);
      if (this.$$c) {
        const unsub = this.$$c.$on(type, listener);
        this.$$l_u.set(listener, unsub);
      }
      super.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
      super.removeEventListener(type, listener, options);
      if (this.$$c) {
        const unsub = this.$$l_u.get(listener);
        if (unsub) {
          unsub();
          this.$$l_u.delete(listener);
        }
      }
    }
    async connectedCallback() {
      this.$$cn = true;
      if (!this.$$c) {
        let create_slot = function(name) {
          return () => {
            let node;
            const obj = {
              c: function create() {
                node = element("slot");
                if (name !== "default") {
                  attr(node, "name", name);
                }
              },
              /**
               * @param {HTMLElement} target
               * @param {HTMLElement} [anchor]
               */
              m: function mount(target, anchor) {
                insert(target, node, anchor);
              },
              d: function destroy(detaching) {
                if (detaching) {
                  detach(node);
                }
              }
            };
            return obj;
          };
        };
        await Promise.resolve();
        if (!this.$$cn) {
          return;
        }
        const $$slots = {};
        const existing_slots = get_custom_elements_slots(this);
        for (const name of this.$$s) {
          if (name in existing_slots) {
            $$slots[name] = [create_slot(name)];
          }
        }
        for (const attribute of this.attributes) {
          const name = this.$$g_p(attribute.name);
          if (!(name in this.$$d)) {
            this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
          }
        }
        this.$$c = new this.$$ctor({
          target: this.shadowRoot || this,
          props: {
            ...this.$$d,
            $$slots,
            $$scope: {
              ctx: []
            }
          }
        });
        const reflect_attributes = () => {
          this.$$r = true;
          for (const key in this.$$p_d) {
            this.$$d[key] = this.$$c.$$.ctx[this.$$c.$$.props[key]];
            if (this.$$p_d[key].reflect) {
              const attribute_value = get_custom_element_value(
                key,
                this.$$d[key],
                this.$$p_d,
                "toAttribute"
              );
              if (attribute_value == null) {
                this.removeAttribute(this.$$p_d[key].attribute || key);
              } else {
                this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
              }
            }
          }
          this.$$r = false;
        };
        this.$$c.$$.after_update.push(reflect_attributes);
        reflect_attributes();
        for (const type in this.$$l) {
          for (const listener of this.$$l[type]) {
            const unsub = this.$$c.$on(type, listener);
            this.$$l_u.set(listener, unsub);
          }
        }
        this.$$l = {};
      }
    }
    // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
    // and setting attributes through setAttribute etc, this is helpful
    attributeChangedCallback(attr2, _oldValue, newValue) {
      if (this.$$r)
        return;
      attr2 = this.$$g_p(attr2);
      this.$$d[attr2] = get_custom_element_value(attr2, newValue, this.$$p_d, "toProp");
      this.$$c?.$set({ [attr2]: this.$$d[attr2] });
    }
    disconnectedCallback() {
      this.$$cn = false;
      Promise.resolve().then(() => {
        if (!this.$$cn) {
          this.$$c.$destroy();
          this.$$c = void 0;
        }
      });
    }
    $$g_p(attribute_name) {
      return Object.keys(this.$$p_d).find(
        (key) => this.$$p_d[key].attribute === attribute_name || !this.$$p_d[key].attribute && key.toLowerCase() === attribute_name
      ) || attribute_name;
    }
  };
}
function get_custom_element_value(prop, value, props_definition, transform) {
  const type = props_definition[prop]?.type;
  value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
  if (!transform || !props_definition[prop]) {
    return value;
  } else if (transform === "toAttribute") {
    switch (type) {
      case "Object":
      case "Array":
        return value == null ? null : JSON.stringify(value);
      case "Boolean":
        return value ? "" : null;
      case "Number":
        return value == null ? null : value;
      default:
        return value;
    }
  } else {
    switch (type) {
      case "Object":
      case "Array":
        return value && JSON.parse(value);
      case "Boolean":
        return value;
      case "Number":
        return value != null ? +value : value;
      default:
        return value;
    }
  }
}
function create_custom_element(Component, props_definition, slots, accessors, use_shadow_dom, extend) {
  let Class = class extends SvelteElement {
    constructor() {
      super(Component, slots, use_shadow_dom);
      this.$$p_d = props_definition;
    }
    static get observedAttributes() {
      return Object.keys(props_definition).map(
        (key) => (props_definition[key].attribute || key).toLowerCase()
      );
    }
  };
  Object.keys(props_definition).forEach((prop) => {
    Object.defineProperty(Class.prototype, prop, {
      get() {
        return this.$$c && prop in this.$$c ? this.$$c[prop] : this.$$d[prop];
      },
      set(value) {
        value = get_custom_element_value(prop, value, props_definition);
        this.$$d[prop] = value;
        this.$$c?.$set({ [prop]: value });
      }
    });
  });
  accessors.forEach((accessor) => {
    Object.defineProperty(Class.prototype, accessor, {
      get() {
        return this.$$c?.[accessor];
      }
    });
  });
  if (extend) {
    Class = extend(Class);
  }
  Component.element = /** @type {any} */
  Class;
  return Class;
}
var SvelteComponent = class {
  /**
   * ### PRIVATE API
   *
   * Do not use, may change at any time
   *
   * @type {any}
   */
  $$ = void 0;
  /**
   * ### PRIVATE API
   *
   * Do not use, may change at any time
   *
   * @type {any}
   */
  $$set = void 0;
  /** @returns {void} */
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(props) {
    if (this.$$set && !is_empty(props)) {
      this.$$.skip_bound = true;
      this.$$set(props);
      this.$$.skip_bound = false;
    }
  }
};

// node_modules/svelte/src/shared/version.js
var PUBLIC_VERSION = "4";

// node_modules/svelte/src/runtime/internal/disclose-version/index.js
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);

// article.svelte
function add_css(target) {
  append_styles(target, "svelte-13fyrm7", ".flex-container.svelte-13fyrm7.svelte-13fyrm7{display:flex;align-items:stretch;background-color:#eee;border:1px solid #ccc;margin-bottom:1rem}a.svelte-13fyrm7.svelte-13fyrm7{padding:1rem 0.4rem;text-decoration:none;color:inherit}a.svelte-13fyrm7.svelte-13fyrm7:hover{background-color:azure}a.svelte-13fyrm7 .title.svelte-13fyrm7{font-weight:bold}a.main.svelte-13fyrm7.svelte-13fyrm7{flex-grow:2;min-width:0}a.comment.svelte-13fyrm7.svelte-13fyrm7{align-items:center;display:flex;flex-direction:column;max-width:5rem;font-size:0.6em}.url.svelte-13fyrm7.svelte-13fyrm7{font-style:italic;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}svg.svelte-13fyrm7.svelte-13fyrm7{width:3em}");
}
function create_fragment(ctx) {
  let div3;
  let a0;
  let div0;
  let t0_value = (
    /*article*/
    ctx[0].title + ""
  );
  let t0;
  let t1;
  let div1;
  let t2_value = (
    /*article*/
    ctx[0].time_ago + ""
  );
  let t2;
  let t3;
  let t4_value = (
    /*article*/
    ctx[0].points + ""
  );
  let t4;
  let t5;
  let t6;
  let div2;
  let t8;
  let a1;
  let svg;
  let path;
  let t9;
  let t10_value = (
    /*article*/
    ctx[0].comments_count + ""
  );
  let t10;
  return {
    c() {
      div3 = element("div");
      a0 = element("a");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      div1 = element("div");
      t2 = text(t2_value);
      t3 = text(" - ");
      t4 = text(t4_value);
      t5 = text(" points");
      t6 = space();
      div2 = element("div");
      div2.textContent = `${/*url*/
      ctx[2]}`;
      t8 = space();
      a1 = element("a");
      svg = svg_element("svg");
      path = svg_element("path");
      t9 = space();
      t10 = text(t10_value);
      attr(div0, "class", "title svelte-13fyrm7");
      attr(div1, "class", "metadata");
      attr(div2, "class", "url svelte-13fyrm7");
      attr(a0, "class", "main svelte-13fyrm7");
      attr(
        a0,
        "href",
        /*url*/
        ctx[2]
      );
      attr(a0, "target", "_blank");
      attr(path, "stroke-linecap", "round");
      attr(path, "stroke-linejoin", "round");
      attr(path, "d", "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg, "fill", "none");
      attr(svg, "viewBox", "0 0 24 24");
      attr(svg, "stroke-width", "1.5");
      attr(svg, "stroke", "currentColor");
      attr(svg, "class", "w-6 h-6 svelte-13fyrm7");
      attr(a1, "class", "comment svelte-13fyrm7");
      attr(
        a1,
        "href",
        /*urlcomment*/
        ctx[1]
      );
      attr(a1, "target", "_blank");
      attr(div3, "class", "flex-container svelte-13fyrm7");
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, a0);
      append(a0, div0);
      append(div0, t0);
      append(a0, t1);
      append(a0, div1);
      append(div1, t2);
      append(div1, t3);
      append(div1, t4);
      append(div1, t5);
      append(a0, t6);
      append(a0, div2);
      append(div3, t8);
      append(div3, a1);
      append(a1, svg);
      append(svg, path);
      append(a1, t9);
      append(a1, t10);
    },
    p(ctx2, [dirty]) {
      if (dirty & /*article*/
      1 && t0_value !== (t0_value = /*article*/
      ctx2[0].title + ""))
        set_data(t0, t0_value);
      if (dirty & /*article*/
      1 && t2_value !== (t2_value = /*article*/
      ctx2[0].time_ago + ""))
        set_data(t2, t2_value);
      if (dirty & /*article*/
      1 && t4_value !== (t4_value = /*article*/
      ctx2[0].points + ""))
        set_data(t4, t4_value);
      if (dirty & /*article*/
      1 && t10_value !== (t10_value = /*article*/
      ctx2[0].comments_count + ""))
        set_data(t10, t10_value);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div3);
      }
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let { article } = $$props;
  let urlcomment = `https://news.ycombinator.com/item?id=${article.id}`;
  let url = article.url.startsWith("http") ? article.url : urlcomment;
  $$self.$$set = ($$props2) => {
    if ("article" in $$props2)
      $$invalidate(0, article = $$props2.article);
  };
  return [article, urlcomment, url];
}
var Article = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { article: 0 }, add_css);
  }
  get article() {
    return this.$$.ctx[0];
  }
  set article(article) {
    this.$$set({ article });
    flush();
  }
};
create_custom_element(Article, { "article": {} }, [], [], true);
var article_default = Article;

// app.svelte
function add_css2(target) {
  append_styles(target, "svelte-unhro7", "main.svelte-unhro7.svelte-unhro7.svelte-unhro7{max-width:1024px;width:100%;margin:0 auto}header.svelte-unhro7.svelte-unhro7.svelte-unhro7,footer.svelte-unhro7.svelte-unhro7.svelte-unhro7{max-width:1024px;width:100%;position:sticky;background-color:#fff;z-index:9999}header.svelte-unhro7.svelte-unhro7.svelte-unhro7{top:0}footer.svelte-unhro7.svelte-unhro7.svelte-unhro7{bottom:0}header.svelte-unhro7 section.toolbar.svelte-unhro7.svelte-unhro7{display:flex;flex-direction:row;justify-content:space-between}header.svelte-unhro7 section.toolbar button.svelte-unhro7.svelte-unhro7{width:100%}header.svelte-unhro7 h1.svelte-unhro7.svelte-unhro7{font-size:1.2rem;padding:0;margin:0}header.svelte-unhro7 h1 span.svelte-unhro7.svelte-unhro7{font-weight:normal;font-size:0.8em}footer.svelte-unhro7>section.svelte-unhro7>.toolbar.svelte-unhro7{display:flex;justify-content:end;align-items:center}footer.svelte-unhro7>section.svelte-unhro7>.toolbar button.svelte-unhro7{font-size:1.5rem;padding:0.5rem 1.5rem}main.svelte-unhro7>section.svelte-unhro7.svelte-unhro7{padding:1.5rem 0}button.svelte-unhro7.svelte-unhro7.svelte-unhro7{border:0;background-color:#454d66;color:#fff;padding:16px 10px;cursor:pointer}button.svelte-unhro7.svelte-unhro7.svelte-unhro7:active,button.active.svelte-unhro7.svelte-unhro7.svelte-unhro7{background-color:var(--bg-color);color:var(--text-color)}svg.svelte-unhro7.svelte-unhro7.svelte-unhro7{width:1em;cursor:pointer}");
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[12] = list[i];
  return child_ctx;
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[15] = list[i];
  return child_ctx;
}
function create_if_block(ctx) {
  let main;
  let header;
  let section0;
  let h1;
  let svg0;
  let path0;
  let t0;
  let span0;
  let t1;
  let t2;
  let t3;
  let section1;
  let t4;
  let section2;
  let each_blocks = [];
  let each1_lookup = /* @__PURE__ */ new Map();
  let t5;
  let footer;
  let section3;
  let div;
  let span1;
  let t6;
  let t7;
  let t8;
  let button0;
  let t9;
  let button1;
  let t10;
  let button2;
  let current;
  let mounted;
  let dispose;
  let each_value_1 = ensure_array_like(
    /*tags*/
    ctx[4]
  );
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }
  let each_value = ensure_array_like(
    /*news*/
    ctx[1]
  );
  const get_key = (ctx2) => (
    /*article*/
    ctx2[12].id
  );
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context(ctx, each_value, i);
    let key = get_key(child_ctx);
    each1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
  }
  return {
    c() {
      main = element("main");
      header = element("header");
      section0 = element("section");
      h1 = element("h1");
      svg0 = svg_element("svg");
      path0 = svg_element("path");
      t0 = text("\n					HN Reader\n					");
      span0 = element("span");
      t1 = text("at ");
      t2 = text(
        /*lasttime*/
        ctx[3]
      );
      t3 = space();
      section1 = element("section");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t4 = space();
      section2 = element("section");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t5 = space();
      footer = element("footer");
      section3 = element("section");
      div = element("div");
      span1 = element("span");
      t6 = text("Page ");
      t7 = text(
        /*page*/
        ctx[0]
      );
      t8 = space();
      button0 = element("button");
      button0.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 svelte-unhro7"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"></path></svg>`;
      t9 = space();
      button1 = element("button");
      button1.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 svelte-unhro7"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path></svg>`;
      t10 = space();
      button2 = element("button");
      button2.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 svelte-unhro7"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path></svg>`;
      attr(path0, "stroke-linecap", "round");
      attr(path0, "stroke-linejoin", "round");
      attr(path0, "d", "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z");
      attr(svg0, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg0, "fill", "none");
      attr(svg0, "viewBox", "0 0 24 24");
      attr(svg0, "stroke-width", "1.5");
      attr(svg0, "stroke", "currentColor");
      attr(svg0, "class", "w-6 h-6 svelte-unhro7");
      attr(span0, "class", "svelte-unhro7");
      attr(h1, "class", "svelte-unhro7");
      attr(section1, "class", "toolbar svelte-unhro7");
      attr(header, "class", "svelte-unhro7");
      attr(section2, "class", "svelte-unhro7");
      attr(button0, "class", "svelte-unhro7");
      attr(button1, "class", "svelte-unhro7");
      attr(button2, "class", "svelte-unhro7");
      attr(div, "class", "toolbar svelte-unhro7");
      attr(section3, "class", "svelte-unhro7");
      attr(footer, "class", "svelte-unhro7");
      attr(main, "class", "svelte-unhro7");
    },
    m(target, anchor) {
      insert(target, main, anchor);
      append(main, header);
      append(header, section0);
      append(section0, h1);
      append(h1, svg0);
      append(svg0, path0);
      append(h1, t0);
      append(h1, span0);
      append(span0, t1);
      append(span0, t2);
      append(header, t3);
      append(header, section1);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(section1, null);
        }
      }
      append(main, t4);
      append(main, section2);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(section2, null);
        }
      }
      append(main, t5);
      append(main, footer);
      append(footer, section3);
      append(section3, div);
      append(div, span1);
      append(span1, t6);
      append(span1, t7);
      append(span1, t8);
      append(span1, button0);
      append(span1, t9);
      append(span1, button1);
      append(span1, t10);
      append(span1, button2);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*reload*/
            ctx[8]
          ),
          listen(
            button1,
            "click",
            /*prev*/
            ctx[7]
          ),
          listen(
            button2,
            "click",
            /*next*/
            ctx[6]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (!current || dirty & /*lasttime*/
      8)
        set_data(
          t2,
          /*lasttime*/
          ctx2[3]
        );
      if (dirty & /*tags, tag, changetag*/
      52) {
        each_value_1 = ensure_array_like(
          /*tags*/
          ctx2[4]
        );
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1(ctx2, each_value_1, i);
          if (each_blocks_1[i]) {
            each_blocks_1[i].p(child_ctx, dirty);
          } else {
            each_blocks_1[i] = create_each_block_1(child_ctx);
            each_blocks_1[i].c();
            each_blocks_1[i].m(section1, null);
          }
        }
        for (; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d(1);
        }
        each_blocks_1.length = each_value_1.length;
      }
      if (dirty & /*news*/
      2) {
        each_value = ensure_array_like(
          /*news*/
          ctx2[1]
        );
        group_outros();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each1_lookup, section2, outro_and_destroy_block, create_each_block, null, get_each_context);
        check_outros();
      }
      if (!current || dirty & /*page*/
      1)
        set_data(
          t7,
          /*page*/
          ctx2[0]
        );
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(main);
      }
      destroy_each(each_blocks_1, detaching);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block_1(ctx) {
  let button;
  let mounted;
  let dispose;
  function click_handler() {
    return (
      /*click_handler*/
      ctx[10](
        /*t*/
        ctx[15]
      )
    );
  }
  return {
    c() {
      button = element("button");
      button.textContent = `${/*t*/
      ctx[15]}`;
      attr(button, "class", "svelte-unhro7");
      toggle_class(
        button,
        "active",
        /*t*/
        ctx[15] == /*tag*/
        ctx[2]
      );
    },
    m(target, anchor) {
      insert(target, button, anchor);
      if (!mounted) {
        dispose = listen(button, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*tags, tag*/
      20) {
        toggle_class(
          button,
          "active",
          /*t*/
          ctx[15] == /*tag*/
          ctx[2]
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_each_block(key_1, ctx) {
  let first;
  let article_1;
  let current;
  article_1 = new article_default({ props: { article: (
    /*article*/
    ctx[12]
  ) } });
  return {
    key: key_1,
    first: null,
    c() {
      first = empty();
      create_component(article_1.$$.fragment);
      this.first = first;
    },
    m(target, anchor) {
      insert(target, first, anchor);
      mount_component(article_1, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const article_1_changes = {};
      if (dirty & /*news*/
      2)
        article_1_changes.article = /*article*/
        ctx[12];
      article_1.$set(article_1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(article_1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(article_1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(first);
      }
      destroy_component(article_1, detaching);
    }
  };
}
function create_fragment2(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*news*/
    ctx[1] && create_if_block(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (
        /*news*/
        ctx2[1]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*news*/
          2) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function instance2($$self, $$props, $$invalidate) {
  let lasttime;
  let news;
  let tag = "news";
  let tags = ["news", "ask", "newest", "best"];
  let page = 1;
  let last = /* @__PURE__ */ new Date();
  let getpage = (page2) => {
    $$invalidate(1, news = []);
    var url = `https://node-hnapi.herokuapp.com/` + tag + `?page=` + page2;
    fetch(url).then((r) => r.json()).then((data) => $$invalidate(1, news = data));
    $$invalidate(9, last = /* @__PURE__ */ new Date());
  };
  let changetag = (t) => {
    $$invalidate(2, tag = t);
    reload();
  };
  let next = () => $$invalidate(0, page++, page);
  let prev = () => {
    if (page > 1) {
      $$invalidate(0, page--, page);
    }
  };
  let reload = () => {
    $$invalidate(0, page = 1);
    getpage(page);
  };
  const click_handler = (t) => changetag(t);
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*last*/
    512) {
      $:
        $$invalidate(3, lasttime = last.toLocaleDateString() + " " + last.toLocaleTimeString());
    }
    if ($$self.$$.dirty & /*page*/
    1) {
      $:
        getpage(page);
    }
  };
  return [
    page,
    news,
    tag,
    lasttime,
    tags,
    changetag,
    next,
    prev,
    reload,
    last,
    click_handler
  ];
}
var App = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance2, create_fragment2, safe_not_equal, {}, add_css2);
  }
};
customElements.define("hacker-news", create_custom_element(App, {}, [], [], true));
var app_default = App;
export {
  app_default as default
};
