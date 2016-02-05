(function($) {
	"use strict";
	var dog = window.dog = {},
		oBody = $('body'),
		dialog = function(option) {
			dialog.settings = $.extend(dialog.settings, option);
			var oDialog, offset;
			this.fn.mask();
			var oDialog = this.fn.template();
			offset = oDialog.offset(oDialog);
			oDialog.css('bottom', offset.top / 2 + 'px');
			oDialog.css('right', offset.left / 2 + 'px');
		};
	dog.cache = {
		zin: 9998,
		index: 0,
		aDl: {},
		oMask: null
	};
	dialog.settings = {
		title: '标题',
		content: '',
		height: 'auto',
		width: 'auto'
	};
	dog.dialog = dialog;
	dog.fn = {
		template: function() {
			var cache = dog.cache,
				ost = dialog.settings,
				oDiv = $('<div>'),
				html = '<div class="title-box">' +
				'<span class="title">' + ost.title + '</span><a class="btn-close title-close" href="javascript:;">x</a>' +
				'</div>' +
				'<div class="content-box" style="height: ' + (/\d+/.test(ost.height) ? ost.height + 'px' : ost.height) + ';width: ' + (/\d+/.test(ost.width) ? ost.width + 'px' : ost.width) + ';">' +
				ost.content + '</div>' +
				'<div class="btn-box">' +
				'<a class="btn-close" href="javascript:;">取消</a><a class="btn-sure" href="javascript:;">确定</a>' +
				'</div>';
			oDiv.attr({
				'id': 'dogDialog-' + ++cache.index,
				'class': 'dialog'
			}).css('z-index', (++cache.zin)).html(html).bind('click', function(e) {
				var target = e.target;
				if ($(target).hasClass('btn-close')) {
					dog.fn.event.close();
				}
				return false;
			});
			cache.aDl[oDiv.attr('id')] = oDiv;
			oBody.append(oDiv);
			return oDiv;
		},
		mask: function() {
			var oMask = dog.cache.oMask;
			if (!oMask) {
				oMask = $('<div>');
				console.log(oMask);
				oMask.attr('class', 'masks').css('z-index', ++dog.cache.zin);
				oMask.bind('click', function(e) {
					dog.fn.event.close();
					return false;
				});
				dog.cache.oMask = oMask;
				oBody.append(oMask);
				return;
			}
			oMask.css('z-index', ++dog.cache.zin);
		},
		event: {
			close: function() {
				var cache = dog.cache;
				oBody.remove(cache.aDl['dogDialog-' + cache.index]);
				cache.index--;
				if (cache.index === 0) {
					oBody.remove(cache.oMask);
					cache.oMask = null;
					cache.zin = 9998;
					return;
				}
				cache.oMask.css('z-index', cache.zin - 3);
			}
		}
	};
})(window.$);