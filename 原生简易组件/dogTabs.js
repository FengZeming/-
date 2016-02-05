(function($, dog) {
	"use strict";
	var dog = window.dog = dog || {},
		oBody = $('body'),
		tabs = dog.tabs = function(option) {
			tabs.settings = $.extend(tabs.settings, option);
			var oTabs = this.fn.template();
			oBody.append(oTabs);
		};
	tabs.settings = {
		btns: [],
		panes: []
	};
	tabs.cache = {
		btns: null,
		panes: null
	};
	dog.fn = {
		template: function() {
			var oTabs = $('<div>');
			var oBtn = $('<ul>');
			var oPanes = $('<ul>');
			var oSets = tabs.settings;
			var sTemp1 = '',
				sTemp2 = '',
				sCurr = 'class="curr load"';
			for (var i = 0; i < oSets.btns.length; i++) {
				sTemp1 += '<li ><a ' + sCurr + ' index="' + i + '" href="javascript:;">' + oSets.btns[i] + '</a></li>';
				sTemp2 += '<li ' + sCurr + '></li>';
				i === 0 && (sCurr = '');
			}
			oBtn.attr('class', 'dog-tabs-btn').html(sTemp1);
			oBtn.bind('click', function(e) {
				var target = $(e.target);
				if (target[0].tagName.toLocaleLowerCase() === 'a') {
					if (target.hasClass('curr')) {
						return false;
					}
					var index = target.attr('index');
					var oPane = $(oPanes.children()[index]);
					if (!target.hasClass('load')) {
						target.addClass('load');
						oPane.html(oSets.panes[index]);
					}
					tabs.cache.btns.removeClass('curr');
					tabs.cache.panes.removeClass('curr');
					target.addClass('curr');
					oPane.addClass('curr');
					tabs.cache.btns = target;
					tabs.cache.panes = oPane;
				}
				return false;
			});
			//
			oPanes.attr('class', 'dog-tabs-panes').html(sTemp2);
			oPanes.children()[0].innerHTML = oSets.panes[0];
			//
			oTabs.attr('class', 'dog-tabs');
			oTabs.append(oBtn);
			oTabs.append(oPanes);
			tabs.cache.btns = $(oBtn.children()[0].children[0]);
			tabs.cache.panes = $(oPanes.children()[0]);
			return oTabs;
		}
	};
})(window.$, window.dog);