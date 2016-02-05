/**
 * 自封装js工具库
 * 
 */
;
(function(window) {
	"use strict";
	var $ = window.$ = function(sel) {
		return new $.fn.init(sel);
	};

	$.fn = $.prototype = {
		reger: {
			ralpha: /alpha\([^)]*\)/i,
			ropacity: /opacity=([^)]*)/
		},
		append: function(elem) {
			this[0].appendChild(elem[0]);
			return this;
		},
		remove:function (elem) {
			this[0].removeChild(elem[0]);
			return this;
		},
		offset: function() {
			var elem = this[0];
			return $.offset(elem);
		},
		/**
		 * 读写样式<br />
		 * css(name) 访问第一个匹配元素的样式属性<br />
		 * css(properties) 把一个"名/值对"对象设置为所有匹配元素的样式属性<br />
		 * css(name, value) 在所有匹配的元素中，设置一个样式属性的值<br />
		 */
		css: function(name, value) {
			var i, elem = this[0],
				obj = arguments[0];
			if (typeof name === 'string') {
				if (value === undefined) {
					return $.css(elem, name);
				} else {
					name === 'opacity' ?
						$.opacity.set(elem, value) :
						elem.style[name] = value;
				};
			} else {
				for (i in obj) {
					i === 'opacity' ?
						$.opacity.set(elem, obj[i]) :
						elem.style[i] = obj[i];
				};
			};
			return this;
		},

		/** 显示元素 */
		show: function() {
			return this.css('display', 'block');
		},

		/** 隐藏元素 */
		hide: function() {
			return this.css('display', 'none');
		},
		/**
		 * 读写HTML - (不支持文本框)
		 * @param	{String}	内容
		 */
		html: function(content) {
			var elem = this[0];
			if (content === undefined) return elem.innerHTML;
			$.cleanData(elem.getElementsByTagName('*'));
			elem.innerHTML = content;
			return this;
		},
		/**
		 * 事件绑定
		 * @param	{String}	类型
		 * @param	{Function}	要绑定的函数
		 */
		bind: function(type, callback) {
			$.event.add(this[0], type, callback);
			return this;
		},
		/**
		 * 移除事件
		 * @param	{String}	类型
		 * @param	{Function}	要卸载的函数
		 */
		unbind: function(type, callback) {
			$.event.remove(this[0], type, callback);
			return this;
		},
		/**
		 * 搜索子元素
		 * 注意：只支持nodeName或.className的形式，并且只返回第一个元素
		 * @param	{String}
		 */
		find: function(expr) {
			var value, elem = this[0],
				className = expr.split('.')[1];
			if (className) {
				if (document.getElementsByClassName) {
					value = elem.getElementsByClassName(className);
				} else {
					value = getElementsByClassName(className, elem);
				};
			} else {
				value = elem.getElementsByTagName(expr);
			};

			return $(value[0]);
		},
		each: function(obj, callback) {
			var name, i = 0,
				length = obj.length,
				isObj = length === undefined;
			if (isObj) {
				for (name in obj) {
					if (callback.call(obj[name], name, obj[name]) === false) break;
				};
			} else {
				for (var value = obj[0]; i < length && callback.call(value, i, value) !== false; value = obj[++i]) {};
			};
			return obj;
		},
		ready: function(callback) {
			r.bindReady();
			if (r.isReady) {
				callback.call(document, $);
			} else if (r.readyList) {
				r.readyList.push(callback);
			};
			return this;
		},
		addClass: function(cls) {
			var elem = this[0];
			if (this.hasClass(cls)) {
				return;
			}
			elem.className = elem.className + ' ' + this.trim(cls);
		},
		hasClass: function(cls) {
			var elem = this[0];
			var cls = this.trim(cls),
				cls = cls.replace(/^[-]+|[-]+$/g, ''),
				reg = new RegExp('([-]+|\\b)' + cls + '([-]+|\\b)', 'g');
			return reg.test(elem.className);
		},
		removeClass: function(cls) {
			var elem = this[0];
			if (!this.hasClass(cls)) {
				return;
			}
			var cls = this.trim(cls);
			var reg = new RegExp(cls, 'g');
			elem.className = elem.className.replace(reg, '');
		},
		trim: function(str) {
			return str.replace(/^\s+|\s+$/g, '');
		},
		attr: function(attr, value) {
			var elem = this[0];
			if (arguments.length == 2) {
				elem.setAttribute(attr, value);
			} else if (arguments.length == 1) {
				if (typeof attr === 'string') {
					return elem.getAttribute(attr);
				}
				if (typeof attr === 'object') {
					for (var n in attr) {
						elem.setAttribute(n, attr[n]);
					}
				}
			}
			return this;
		}
	};

	$.fn.init = function(sel) {
		var sAt;
		if (typeof sel === 'function') {
			return this.ready(sel);
		}
		if (typeof sel === 'string') {
			if (!/^\S+$/.test(sel)) {
				return this;
			}
			if (sel === 'body') {
				this[0] = document.body;
				return this;
			}
			if (sel === 'head' || sel === 'html') {
				this[0] = document.getElementsByTagName(sel)[0];
				return this;
			}
			if (/^<[a-zA-Z]+>$/.test(sel)) {
				var elem = sel.replace(/^<|>$/g, '');
				this[0] = elem === 'img' ? new Image() : document.createElement(elem);
				return this;
			} else {
				sAt = sel.charAt(0);
				switch (sAt) {
					case '#':
						this[0] = document.getElementById(sel.substring(1));
						break;
					case '.':
						this[0] = document.getElementsByClassName ? document.getElementsByClassName(sel.substring(1))[0] : getElementsByClassName(sel.substring(1))[0];
						break;
					default:
						this[0] = document.getElementsByTagName(sel);
						break;
				}
				return this;
			}
		}
		if (typeof sel === 'object') {
			this[0] = sel;
		}
		return this;
	};
	$.fn.init.prototype = $.fn;

	function getElementsByClassName(className, node, tag) {
		node = node || document;
		tag = tag || '*';
		var i = 0,
			j = 0,
			classElements = [],
			els = node.getElementsByTagName(tag),
			elsLen = els.length,
			pattern = new RegExp("(^|\\s)" + className + "(\\s|$)");

		for (; i < elsLen; i++) {
			if (pattern.test(els[i].className)) {
				classElements[j] = els[i];
				j++;
			};
		};
		return classElements;
	};

	function getUUID(elem) {
		var expando = $.helper.expando,
			id = elem === window ? 0 : (elem[expando]);
		if (id === undefined) {
			elem[expando] = id = ++$.helper.uuid;
		}
		return id;
	}
	// DOM就绪事件
	var r = {
		readyBound: false,
		readyList: [],
		DOMContentLoaded: undefined,
		isReady: false,
		ready: function() {
			if (!r.isReady) {
				if (!document.body) {
					return setTimeout(r.ready, 13);
				}
				r.isReady = true;
				if (r.readyList) {
					var fn, i = 0;
					while ((fn = r.readyList[i++])) {
						fn.call(document, $);
					};
					r.readyList = null;
				};
			};
		},
		bindReady: function() {
			if (r.readyBound) return;
			r.readyBound = true;
			if (document.readyState === 'complete') {
				return r.ready();
			};
			if (document.addEventListener) {
				document.addEventListener('DOMContentLoaded', r.DOMContentLoaded, false);
				window.addEventListener('load', r.ready, false);
			} else if (document.attachEvent) {
				document.attachEvent('onreadystatechange', r.DOMContentLoaded);
				window.attachEvent('onload', r.ready);
				var toplevel = false;
				try {
					toplevel = window.frameElement == null;
				} catch (e) {};

				if (document.documentElement.doScroll && toplevel) {
					r.doScrollCheck();
				};
			};
		},
		domLoaded: function() {
			if (document.addEventListener) {
				r.DOMContentLoaded = function() {
					document.removeEventListener('DOMContentLoaded', r.DOMContentLoaded, false);
					r.ready();
				};
			} else if (document.attachEvent) {
				r.DOMContentLoaded = function() {
					if (document.readyState === 'complete') {
						document.detachEvent('onreadystatechange', r.DOMContentLoaded);
						r.ready();
					}
				};
			};
		},
		doScrollCheck: function() {
			if (r.isReady) {
				return;
			};
			try {
				document.documentElement.doScroll('left');
			} catch (e) {
				setTimeout(r.doScrollCheck, 1);
				return;
			};
			r.ready();
		}
	};
	$.cache = {};
	$.helper = {
		uuid: 0,
		expando: '@cache' + +new Date(),
		isOpacity: 'opacity' in document.documentElement.style
	};
	// 获取css
	$.css = 'defaultView' in document && 'getComputedStyle' in document.defaultView ?
		function(elem, name) {
			return document.defaultView.getComputedStyle(elem, false)[name];
		} :
		function(elem, name) {
			var ret = name === 'opacity' ? $.opacity.get(elem) : elem.currentStyle[name];
			return ret || '';
		};
	// 跨浏览器处理opacity
	$.opacity = {
		get: function(elem) {
			return $.helper.isOpacity ?
				document.defaultView.getComputedStyle(elem, false).opacity :
				$.reger.ropacity.test((elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || '') ? (parseFloat(RegExp.$1) / 100) + '' : 1;
		},
		set: function(elem, value) {
			if ($.helper.isOpacity) return elem.style.opacity = value;
			var style = elem.style;
			style.zoom = 1;
			var opacity = 'alpha(opacity=' + value * 100 + ')',
				filter = style.filter || '';
			style.filter = $.reger.ralpha.test(filter) ?
				filter.replace($.reger.ralpha, opacity) :
				style.filter + ' ' + opacity;
		}
	};
	$.extend = function() {
		var options, name, src, copy, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;
		if (typeof target === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			i = 2;
		}
		if (typeof target !== 'object' && typeof target !== 'function') {
			target = {};
		}
		if (length === i) {
			target = this;
			--i;
		}
		for (; i < length; i++) {
			if ((options = arguments[i]) != null) {
				for (name in options) {
					src = target[name];
					copy = options[name];
					if (target === copy) {
						continue;
					}
					if (deep && copy && typeof copy === 'object') {　　　　　　　　
						clone = src && src.constructor === Array ? [] : {};　　
						target[name] = this.extend(deep, clone, copy);　　　　　
					} else if (copy !== undefined) {　　　　　　　　　
						target[name] = copy;　　　
					}
				}
			}
		}
		return target;
	};
	$.offset = function(elem) {
		var left = elem.offsetLeft,
			top = elem.offsetTop,
			pt = elem.offsetParent;　　　　
		while (pt !== null) {　　　　　　
			left += pt.offsetLeft;　
			top += pt.offsetTop;　　　　　　
			pt = pt.offsetParent;　　　　
		}　　　
		var scLeft = document.compatMode == "BackCompat" ? document.body.scrollLeft : document.documentElement.scrollLeft;
		var scTop = document.compatMode == "BackCompat" ? document.body.scrollTop : document.documentElement.scrollTop;　　
		return {
			left: left - scLeft,
			top: top - scTop
		};　　
	};

	/**
	 * 事件机制
	 * @namespace
	 * @requires	[$.data, $.removeData]
	 */
	$.event = {
		/**
		 * 添加事件
		 * @param		{HTMLElement}	元素
		 * @param		{String}		事件类型
		 * @param		{Function}		要添加的函数
		 */
		add: function(elem, type, callback) {
			var cache, listeners,
				that = $.event,
				data = $.data(elem, '@events') || $.data(elem, '@events', {});
			cache = data[type] = data[type] || {};
			listeners = cache.listeners = cache.listeners || [];
			listeners.push(callback);
			if (!cache.handler) {
				cache.elem = elem;
				cache.handler = that.handler(cache);
				elem.addEventListener ? elem.addEventListener(type, cache.handler, false) : elem.attachEvent('on' + type, cache.handler);
			};
		},

		/**
		 * 卸载事件
		 * @param		{HTMLElement}	元素
		 * @param		{String}		事件类型
		 * @param		{Function}		要卸载的函数
		 */
		remove: function(elem, type, callback) {
			var i, cache, listeners,
				that = $.event,
				isCache = true,
				data = $.data(elem, '@events');
			if (!data) return;
			if (!type) {
				for (i in data) {
					that.remove(elem, i)
				};
				return;
			};
			cache = data[type];
			if (!cache) return;

			listeners = cache.listeners;
			if (callback) {
				for (i = 0; i < listeners.length; i++) {
					listeners[i] === callback && listeners.splice(i--, 1);
				};
			} else {
				cache.listeners = [];
			};
			if (cache.listeners.length === 0) {
				elem.removeEventListener ? elem.removeEventListener(type, cache.handler, false) : elem.detachEvent('on' + type, cache.handler);
				delete data[type];
				cache = data;
				for (var n in cache) {
					isCache = false;
					break;
				}
				if (isCache) {
					$.removeData(elem, '@events')
				};
			};
		},
		/** 事件句柄 */
		handler: function(cache) {
			return function(event) {
				event = $.event.fix(event || window.event);
				for (var i = 0, list = cache.listeners, fn; fn = list[i++];) {
					if (fn.call(cache.elem, event) === false) {
						event.preventDefault();
						event.stopPropagation();
					};
				};
			};
		},
		/**  Event对象兼容处理 */
		fix: function(event) {
			if (event.target) return event;
			var event2 = {
				target: event.srcElement || document,
				preventDefault: function() {
					event.returnValue = false;
				},
				stopPropagation: function() {
					event.cancelBubble = true;
				}
			};
			// IE6/7/8 在原生window.event对象写入数据会导致内存无法回收，应当采用拷贝
			for (var i in event) event2[i] = event[i];
			return event2;
		}
	};

	/**
	 * 读写缓存
	 * @param		{HTMLElement}	元素
	 * @param		{String}		缓存名称
	 * @param		{Any}			数据
	 * @return		{Any}			如果无参数data则返回缓存数据
	 */

	$.data = function(elem, name, data) {
		var cache = $.cache,
			id = getUUID(elem);
		if (name === undefined) {
			return cache[id];
		}!cache[id] && (console.log('kong'), cache[id] = {});
		data !== undefined && (cache[id][name] = data);
		return cache[id][name];
	};
	/**
	 * 删除缓存
	 * @param		{HTMLElement}	元素
	 * @param		{String}		缓存名称
	 */
	$.removeData = function(elem, name) {
		var isCache = true,
			expando = $.helper.expando,
			cache = $.cache,
			thisCache,
			id = getUUID(elem);
		if (!id && !cache[id]) {
			return;
		}
		thisCache = cache[id];
		if (name) {
			delete thisCache[name];
			for (var n in thisCache) {
				isCache = false;
				break;
			}
			if (isCache) {
				delete cache[id];
			}
			return;
		}
		delete cache[id];
		if (elem.removeAttribute) {
			elem.removeAttribute(expando);
		} else {
			elem[expando] = null;
		}
	};


	$.cleanData = function(elems) {
		var i = 0,
			elem,
			len = elems.length,
			removeEvent = $.event.remove,
			removeData = $.removeData;

		for (; i < len; i++) {
			elem = elems[i];
			removeEvent(elem);
			removeData(elem);
		}
	};

	r.domLoaded();
})(window);