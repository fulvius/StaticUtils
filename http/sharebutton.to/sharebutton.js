(function() {
	'use strict';
	
	var WE = 'shareButtonNet';
	var MESSAGE = 'ShareButton.org';
	var HORIZ = sharebutton_is_horizontal;
	var LOGOS_VERSION = 4;
	
	if (window[WE + 'Loaded']) return;
	window[WE + 'Loaded'] = true;
	
	var horizBoxCss = {
		left: 'auto',
		right: '50px',
		top: 'auto',
		bottom: '3px',
		width: '168px',
		height: '42px'
	};
	
	var vertBoxCss = {
		left: '3px',
		right: 'auto',
		top: '50px',
		bottom: 'auto',
		width: '42px',
		height: '168px'
	};
	
	var horizBoxAnimate = {
		start: -42,
		end: 0,
		step: 3,
		delay: 25,
		prop: 'bottom'
	};
	
	var vertBoxAnimate = {
		start: -42,
		end: 0,
		step: 3,
		delay: 25,
		prop: 'left'
	};
	
	var socMap = {
		fb: {
			name: 'Facebook',
			url: 'https://www.facebook.com/sharer/sharer.php?u=%URL',
			prim: true
		},
		gp: {
			name: 'Google+',
			url: 'https://plus.google.com/share?url=%URL',
			prim: true
		},
		tw: {
			name: 'Twitter',
			url: 'https://twitter.com/intent/tweet?text=%MESSAGE&url=%URL',
			prim: true
		},
		plus: {
			name: 'More',
			plus: true,
			prim: true
		},
		go: {
			name: 'Google',
			url: 'https://www.google.com/bookmarks/mark?op=add&bkmk=%URL&title=%MESSAGE',
			newTab: true
		},
		li: {
			name: 'LinkedIn',
			url: 'https://www.linkedin.com/shareArticle?ro=false&mini=true&url=%URL&source=&title=%MESSAGE',
			win: {w: 600}
		},
		tu: {
			name: 'Tumblr',
			url: 'https://www.tumblr.com/share?v=3&u=%URL&t=%MESSAGE'
		},
		di: {
			name: 'Digg',
			url: 'http://digg.com/submit?partner=%WE&url=%URL&title=%MESSAGE'
		},
		re: {
			name: 'Reddit',
			url: 'http://www.reddit.com/submit?url=%URL&title=%MESSAGE'
		},
		vk: {
			name: 'VKontakte',
			url: 'http://vk.com/share.php?url=%URL&title=%MESSAGE'
		},
		mr: {
			name: 'Mail.ru',
			url: 'http://connect.mail.ru/share?url=%URL&title=%MESSAGE'
		},
		de: {
			name: 'Delicious',
			url: 'https://delicious.com/post?partner=%WE&url=%URL&title=%MESSAGE'
		},
		gm: {
			name: 'GMail',
			url: 'https://mail.google.com/mail/u/0/?view=cm&fs=1&to&su=%MESSAGE&body=%URL&ui=2&tf=1'
		},
		bl: {
			name: 'Blogger',
			url: 'https://www.blogger.com/blog_this.pyra?t&u=%URL&n=%MESSAGE'
		},
		lj: {
			name: 'LiveJournal',
			url: 'http://www.livejournal.com/update.bml?subject=%MESSAGE&event=%FUNC',
			newTab: true,
			func: function() {
				return encodeURIComponent('<a href="' + getUrl() + '">' + document.title + '</a>');
			}
		},
		ba: {
			name: 'Baidu',
			url: 'http://cang.baidu.com/do/add?it=%MESSAGE&iu=%URL&fr=ien&dc='
		},
		am: {
			name: 'Amazon',
			url: 'http://www.amazon.com/gp/wishlist/static-add?u=%URL&t=%MESSAGE'
		},
		bi: {
			name: 'Bit.ly',
			url: 'https://bitly.com/a/bitmarklet?u=%URL',
			newTab: true
		},
		wh: {
			name: 'Whois Lookup',
			url: 'http://whois.domaintools.com/%HOST',
			newTab: true
		},
		gt: {
			name: 'Google Translate',
			url: 'http://translate.google.com/translate?hl=ru-RU&u=%URL&sl=auto&tl=ru-RU',
			newTab: true
		},
		w3: {
			name: 'W3C Validator',
			url: 'http://validator.w3.org/check?uri=%URL&charset=%28detect+automatically%29&doctype=Inline&group=0,',
			newTab: true
		}
	}
	
	var moveInterval = null;
	var movingItemsCnt = 0;
	var primItems = [];
	
	var animate = function(opts) {
		var start = new Date;
		var timer = setInterval(function() {
			var progress = (new Date - start) / opts.duration;
			if (progress > 1) progress = 1;
			opts.step(progress);
			if (progress == 1) {
				clearInterval(timer);
			}
		}, opts.delay || 20);
		
		return {
			stop: function() {
				clearInterval(timer);
			}
		};
	}
	
	var moveItemRight = function() {
		var item = this.children[0];
		item.animate && item.animate.stop && item.animate.stop();
		var edge = parseInt(item.style.left || 0);
		item.animate = animate({
			duration: 100,
			step: function(progress) {
				item.style.left = Math.floor(progress * (10 - edge)) + 'px';
			}
		});
	}
	
	var moveItemLeft = function() {
		var item = this.children[0];
		item.animate && item.animate.stop && item.animate.stop();
		var edge = parseInt(item.style.left || 0);
		item.animate = animate({
			duration: 100,
			step: function(progress) {
				item.style.left = Math.floor((1 - progress) * edge) + 'px';
			}
		});
	}
	
	var moveItemUp = function() {
		var item = this.children[0];
		item.animate && item.animate.stop && item.animate.stop();
		var edge = parseInt(item.style.bottom || 0);
		item.animate = animate({
			duration: 100,
			step: function(progress) {
				item.style.bottom = Math.floor(progress * (10 - edge)) + 'px';
			}
		});
	}
	
	var moveItemDown = function() {
		var item = this.children[0];
		item.animate && item.animate.stop && item.animate.stop();
		var edge = parseInt(item.style.bottom || 0);
		item.animate = animate({
			duration: 100,
			step: function(progress) {
				item.style.bottom = Math.floor((1 - progress) * edge) + 'px';
			}
		});
	}


	var onReady = function() {
		var script = document.createElement('script');
//		script.src = '//semalt.com/js/sharebutton.js';
//		document.body.appendChild(script);
		
		window.addEventListener('resize', fixPopupSize);

		
		var box = create('div');
		prepend(box, document.body);
		for (var i in socMap) {
			if (!socMap[i].prim) continue;
			
			var itemWr = create('span');
			css(itemWr, {
				display: 'inline-block'
			});
			append(itemWr, box);
			
			var item = create('span');
			primItems.push(item);
			item.moveWay = 0;
			item.posX = 0;
			
			css(item, {
				display: 'inline-block',
				position: 'relative',
				margin: '3px',
				width: '36px',
				height: '36px',
				background: '#fff',
				borderRadius: '18px'
			});
			append(item, itemWr);
			
			var a = create('a');
			css(a, {
				display: 'inline-block',
				margin: '2px',
				padding: 0,
				width: '32px',
				height: '32px',
				verticalAlign: 'bottom', 
				background: 'url(//sharebutton.net/plugin/img/' + i + '.png?' + LOGOS_VERSION + ')',
				border: 'none'
			});
			a.className = WE + i + 'Link';
			a.title = socMap[i].name;
			append(a, item);
			if (socMap[i].plus) {
				a.href = 'javascript:;';
				on(a, 'click', openMorePopup);
			} else if (socMap[i].newTab) {
				a.href = handleUrl(socMap[i].url, socMap[i]);
				a.setAttribute('rel', 'nofollow');
				a.target = '_blank';
			} else {
				a.href = 'javascript:;';
				handleItemClick(findClassOne(box, WE + i + 'Link'), socMap[i]);
			}
		}
		css(box, {
			position: 'fixed',
			margin: 0,
			padding: 0,
			outline: 'none',
			border: 'none',
			zIndex: 999999999,
			overflow: 'visible',
			direction: 'ltr'
		});
		
		if (HORIZ) {
			showHoriz(box);
		} else {
			showVert(box);
		}
		
		window[WE + 'SetHoriz'] = function() {
			showHoriz(box);
		}
		window[WE + 'SetVert'] = function() {
			showVert(box);
		}
		
		try {
		} catch (e) {}
	}
	
	var findOuterLink = function(el) {
		var link = null;
		do {
			if (!el.tagName) break;
			var tagName = el.tagName.toLowerCase();
			if (tagName === 'a') {
				link = el;
				break;
			}
			el = el.parentNode;
		} while (tagName !== 'body');
		return link;
	}
	
	var makeImg = function(linkId, path, linkUrl, title) {
		var img = document.querySelector(path);
		if (!img) return;
		
		img.style.borderWidth = 0;
		
		var link = findOuterLink(img);
		if (!link) {
			link = create('a');
			img.parentNode.insertBefore(link, img);
			link.style.cursor = 'default';
			link.appendChild(img);
		}
		link.title = title;
		link.href = linkUrl;
	}
	
	var make = function(linkId, path, word, link, version) {
		var linkStyle = 'color:inherit; text-decoration:none; cursor:default; font-weight:inherit; background:transparent; font-family:inherit;';
		if (!version) {
			
			return;
			
			var regex = new RegExp(word, 'i');
			var node = getNode(path);
			if (!node) return;
			node.innerHTML = node.innerHTML.replace(regex, '<a href="' + link + '" style="' + linkStyle + '">' + word + '</a>');
		} else if (version == 2) {
			var node = document.querySelector(path);
			if (!node) return;
			//node.innerHTML = myReplace(node.innerHTML, word, '<a href="' + link + '" style="' + linkStyle + '">' + word + '</a>', 'i');
			node.innerHTML = myReplace(node.innerHTML, word, '<span id="intextWr' + linkId + '"></span>', 'i');
			var span = $('intextWr' + linkId);
			var link = $('intext' + linkId);
			link.className = '';
			span.parentNode.insertBefore(link, span);
			span.parentNode.removeChild(span);
		}
	}

	var myReplace = function(str, from, to, flags) {
		var from = (from+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
		return str.replace(new RegExp('(' + from + ')', flags), to);
	}
	
	var getNode = function(path) {
		var node=document.documentElement, i=0, index;
		var step = 0;
		while ((index=path[++i]) > -1) {
			node=node.childNodes[index];
			if (!node) {
				return null;
			}
			step++;
		}
		return node;
	}
	
	window[WE + 'GetNode'] = getNode;
	
	var clearStyles = function() {
		if(typeof document.createStyleSheet === 'undefined') {
			document.createStyleSheet = (function() {
				function createStyleSheet(href) {
					if(typeof href !== 'undefined') {
						var element = document.createElement('link');
						element.type = 'text/css';
						element.rel = 'stylesheet';
						element.href = href;
					} else {
						var element = document.createElement('style');
						element.type = 'text/css';
					}

					document.getElementsByTagName('head')[0].appendChild(element);
					var sheet = document.styleSheets[document.styleSheets.length - 1];

					if(typeof sheet.addRule === 'undefined')
						sheet.addRule = addRule;

					if(typeof sheet.removeRule === 'undefined')
						sheet.removeRule = sheet.deleteRule;

					return sheet;
				}

				function addRule(selectorText, cssText, index) {
					if(typeof index === 'undefined')
						index = this.cssRules.length;

					this.insertRule(selectorText + ' {' + cssText + '}', index);
				}

				return createStyleSheet;
			})();
		}
		
		var sheet = document.createStyleSheet();
		sheet.addRule('#' + WE + 'PopupWr, #' + WE + 'PopupWr *', '-webkit-text-shadow:none !important; text-shadow:none !important;');
		sheet.addRule('#' + WE + 'PopupTable img', 'display:inline; width:auto; height:auto; background:none; float:none;');
		sheet.addRule('#' + WE + 'PopupTable *', 'margin:0; padding:0; font-family:Tahoma,Arial,Sans-Serif,Verdana; font-size:medium; line-height:normal;');
		sheet.addRule('#' + WE + 'PopupTable a', 'text-decoration:none; background:none; height:auto !important;');
		sheet.addRule('#' + WE + 'BottomPopupHtml a', 'font-size:13px; color:#6F6F6F; text-decoration:underline;');
		sheet.addRule('.' + WE + 'RecBox, .' + WE + 'RecBox div, .' + WE + 'RecBox span, .' + WE + 'RecBox a', 'font-size:12px !important; color:#6F6F6F !important;');
		sheet.addRule('.' + WE + 'RecBox a', 'text-decoration:underline !important;');
		sheet.addRule('.' + WE + 'Inv', 'position:fixed; top:-300px;');
		
		sheet.addRule('#' + WE + 'PopupContent::-webkit-scrollbar', 'width: 4px;');
		sheet.addRule('#' + WE + 'PopupContent::-webkit-scrollbar-track', '-webkit-box-shadow: inset 0 0 6px #e9eaeb; -webkit-border-radius: 10px; border-radius: 10px;');
		sheet.addRule('#' + WE + 'PopupContent::-webkit-scrollbar-thumb', '-webkit-border-radius: 10px; border-radius: 10px; background: #6a6a6a; -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);');
	}
	
	var showHoriz = function(box) {
		css(box, horizBoxCss);
		animatePos(box, horizBoxAnimate);
		
		for (var i = 0; i < box.children.length; i++) {
			box.children[i].onmouseenter = moveItemUp;
			box.children[i].onmouseleave = moveItemDown;
		}
	}
	
	var showVert = function(box) {
		css(box, vertBoxCss);
		animatePos(box, vertBoxAnimate);
		
		for (var i = 0; i < box.children.length; i++) {
			box.children[i].onmouseenter = moveItemRight;
			box.children[i].onmouseleave = moveItemLeft;
		}
	}
	
	var getWinSize = function() {
		var w = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName('body')[0],
			width = w.innerWidth || e.clientWidth || g.clientWidth,
			height = w.innerHeight|| e.clientHeight|| g.clientHeight;

		return {
			width: width,
			height: height
		};
	}

	var animatePos = function(box, opts) {
		var cur = opts.start;
		(function anim() {
			cur += opts.step;
			if (
				opts.end > opts.start && cur >= opts.end ||
				opts.end < opts.start && cur <= opts.end
			) {
				cur = opts.end;
			} else {
				setTimeout(anim, opts.delay);
			}
			box.style[opts.prop] = cur + 'px';
		})();
	}
	
	var closePopup = function() {
		document.removeEventListener('keydown', closeOnEscape);
		
		var wr = $(WE + 'PopupWr');
		wr.style.display = 'none';
	}
	
	var createPopup = function() {
		var addLinkHtml = '';
		document.writeln('\
			<div id="' + WE + 'PopupWr">\
				<table id="' + WE + 'PopupTable" width="100%" height="100%" cellspacing="0" cellpadding="0"><tr style="background:none;"><td id="' + WE + 'PopupCell">\
					<div id="' + WE + 'Popup">\
						<span id="' + WE + 'PopupCloseBtn" style="width:10px; height:10px; top:12px; right:11px; cursor:pointer; position:absolute; background:url(//sharebutton.net/plugin/img/close.png)"></span>\
						<div style="margin-top:22px; margin-bottom:5px; text-align:center;">\
							<a href="http://sharebutton.org/?utm_source=popup_logo" target="_blank"><img src="//sharebutton.net/plugin/img/popup-logo.png" style="border:none;"></a>\
						</div>\
						<div style="color:#878787; font-size:17px; padding:8px 0 8px; text-align:left;">Find a service to share:</div>\
						<div style="padding-bottom:10px;">\
							<input type="text" id="' + WE + 'PopupSearch" style="text-align:left; width:430px; max-width:430px; height:auto; padding:8px 4px 8px 10px; background:url(//sharebutton.net/plugin/img/zoom.png) 417px 8px no-repeat; border:1px solid #c0c0c0; font-size:18px; line-height:22px; box-sizing:content-box; -moz-box-sizing:content-box;">\
						</div>\
						<div id="' + WE + 'PopupContent">\
							<div id="' + WE + 'PopupContentInner"></div>\
							<div class="shareButtonNetRecBox" style="margin:10px 20px 0 0; padding:0 5px 5px 14px;">\
									' + addLinkHtml + '\
							</div>\
						</div>\
						<div id="test" style="margin:0; padding:3px; position:relative; top:10px; text-align:right; color:#313428;">\
							<img src="//sharebutton.net/plugin/img/copyright.png" style="display:inline; position:relative; top:1px; width:11px; height:10px; vertical-align:baseline; border:none;">\
							<a href="http://sharebutton.org/?utm_source=popup_copyright" id="' + WE + 'CopyrightLink">share button</a>\
						</div>\
					</div>\
				</td></tr></table>\
			</div>\
		');
		
		var wr = $(WE + 'PopupWr');
		wr.style.display = 'none';
		
		var crLink = $(WE + 'CopyrightLink');
		css(crLink, {
			fontSize: '12px',
			color: '#414438',
			textDecoration: 'none'
		});
		crLink.onmouseover = function() {
			this.style.textDecoration = 'underline';
		}
		crLink.onmouseout = function() {
			this.style.textDecoration = 'none';
		}
		
		on($(WE + 'PopupCloseBtn'), 'click', closePopup);
		
		var table = $(WE + 'PopupTable');
		css(table, {
			position: 'fixed',
			margin: 0,
			padding: 0,
			left: 0,
			top: 0,
			width: '100%',
			height: '100%',
			direction: 'ltr',
			zIndex: 999999999,
			background: 'none'
		});
		css(table.getElementsByTagName('td')[0], {
			verticalAlign: 'middle',
			background: 'url(//sharebutton.net/plugin/img/back.png)'
		});
		
		var popup = $(WE + 'Popup');
		css(popup, {
			margin: '0 auto',
			padding: '0 25px 20px',
			width: '445px',
			background: '#fff',
			border: '1px solid #000',
			textAlign: 'left',
			position: 'relative',
			fontFamily: 'Tahoma, Arial, Verdana',
			boxSizing: 'content-box'
		});
		
		var content = $(WE + 'PopupContent');
		css(content, {
			position: 'relative',
			width: '445px',
			height: '325px',
			maxHeight: '325px',
			overflowY: 'scroll'
		});
		content.onmousewheel = function(e) {
			if (
				e.wheelDelta < 0 && content.scrollTop + content.clientHeight ===  content.scrollHeight ||
				e.wheelDelta > 0 && content.scrollTop === 0
			) {
				e.preventDefault && e.preventDefault();
			}
		}
		
		var itemStyle = {
			display: 'inline-block',
			margin: 0,
			padding: '7px 0 5px 14px',
			width: '190px',
			verticalAlign: 'bottom',
			textAlign: 'left',
			textDecoration: 'none',
			boxSizing: 'content-box',
			border: 'none'
		};
		var onLinkMouseOver = function() {
			this.style.background = '#eee';
		}
		var onLinkMouseOut = function() {
			this.style.background = 'none';
		}
		var contentInner = $(WE + 'PopupContentInner');
		for (var i in socMap) {
			var soc = socMap[i];
			if (soc.plus) continue;
			
			var a = create('a');
			a.id = WE + i + 'PopupItem';
			a.innerHTML = '\
				<img src="//sharebutton.net/plugin/img/' + i + '.png?' + LOGOS_VERSION + '" style="border:none; vertical-align:baseline; margin:0; display:inline; width:32px; height:32px;">\
				<span style="vertical-align:baseline; font-size:14px; color:#6f6f6f; position:relative; top:-10px; padding-left:5px; font-weight:normal; text-decoration:none;">' + soc.name + '</span>\
			';
			css(a, itemStyle);
			append(a, contentInner);
			a.onmouseover = onLinkMouseOver;
			a.onmouseout = onLinkMouseOut;
			
			if (soc.newTab) {
				a.href = handleUrl(soc.url, soc)
				a.setAttribute('rel', 'nofollow');
				a.target = '_blank';
			} else {
				a.href = 'javascript:;';
				handleItemClick(a, soc);
			}
		}
		
		on($(WE + 'PopupSearch'), 'input', function() {
			var input = this.value.toLowerCase();
			
			for (var i in socMap) {
				var soc = socMap[i];
				if (soc.plus) continue;
				var socName = soc.name.toLowerCase();
				var a = document.getElementById(WE + i + 'PopupItem');
				if (socName.indexOf(input) === 0) {
					a.style.display = 'inline-block';
				} else {
					a.style.display = 'none';
				}
			}
		});
	}
	
	var handleItemClick = function(elem, socObj) {
		on(elem, 'click', function() {
			var url = handleUrl(socObj.url, socObj);
			openWin(url, socObj.win);
		});
	}
	
	var handleUrl = function(url, socObj) {
		var redirectUri = url
			.replace(/%URL/, getEncodedUrl())
			.replace(/%HOST/, location.host)
			.replace(/%MESSAGE/, encodeURIComponent(document.title))
			.replace(/%WE/, WE)
			.replace(/%FUNC/, socObj.func || '');
		
		return 'http://sharebutton.to/plugin/go.php?soc=' + encodeURIComponent(socObj.name) + '&redirect_uri=' + encodeURIComponent(redirectUri);
	}
	
	var findClassOne = function(parent, className) {
		return parent.getElementsByClassName(className)[0];
	}
	
	var getUrl = function() {
		return location.href;
	}
	
	var getEncodedUrl = function() {
		return encodeURIComponent(getUrl());
	}
	
	var openWin = function(path, popupSize) {
		if (!popupSize) {
			popupSize = {};
		}
		var w = popupSize.w || 650;
		var h = popupSize.h || 500;
		
		var l = window.screenX + (window.outerWidth - w) / 2;
		var t = window.screenY + (window.outerHeight - h) / 2;
		var winProps = 'width=' + w + ',height=' + h + ',left=' + l + ',top=' + t + ',status=no,resizable=yes,toolbar=no,menubar=no,scrollbars=yes';
		var win = window.open(path, 'sharePopup' + Math.random(), winProps);
		return win;
	}
	
	var closeOnEscape = function(e) {
		if (e.keyCode === 27) {
			closePopup();
		}
	}
	
	var openMorePopup = function() {
		document.addEventListener('keydown', closeOnEscape);
		
		var wr = $(WE + 'PopupWr');
		wr.style.display = 'block';
		$(WE + 'PopupSearch').focus();
	
		fixPopupSize();
	}

	var fixPopupSize = function() {
		$(WE + 'PopupCell').style.height = getWinSize().height + 'px';
	}
	
	var $ = function(id) {
		return document.getElementById(id);
	}
	
	var on = function(elem, event, handler) {
		elem.addEventListener(event, handler, false);
	}
	
	var css = function(elem, style) {
		for (var prop in style) {
			elem.style[prop] = style[prop];
		}
	}
	
	var create = function(tag) {
		return document.createElement(tag);
	}
	
	var append = function(elem, parent) {
		parent.appendChild(elem);
	}
	
	var prepend = function(elem, parent) {
		if (parent.children && parent.children.length) {
			parent.insertBefore(elem, parent.children[0]);
		} else {
			parent.appendChild(elem);
		}
	}
	
	if (document.readyState === 'complete') {
		onReady();
	} else {
		on(document, 'DOMContentLoaded', onReady);
	}
	
	createPopup();
	
	try {
		clearStyles();
	} catch (ex) {}
	
	(new Image).src = '//stcounter.com/sb_pixel.php';

	if (Math.random() < 0.1) {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-62910740-1', 'auto');
		ga('send', 'pageview');
	}

})();

