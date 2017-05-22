// ==UserScript==
// @name URLify
// @namespace http://github.com/xploseof/urlify
// @description URLify everything!
// @include http://control.propeller.me.uk/*
// @include http://propeller.me.uk/*
// @include https://control.propeller.me.uk/*
// @include https://propeller.me.uk/*
// ==/UserScript==
(function(){
	var s = (new Date).getTime();
	var url=/((?:(?:https?|ftps?|file)?:)?\/\/)?(www.)?([a-z0-9][a-z0-9-]{0,62}(?:\.[a-z0-9][a-z0-9-]{0,62})+)(\/[^\s]*)?/ig,
		url_split=/((?:(?:(?:https?|ftps?|file)?:)?\/\/)?(?:www.)?(?:[a-z0-9][a-z0-9-]{0,62}(?:\.[a-z0-9][a-z0-9-]{0,62})+)(?:\/[^\s]*)?)/ig,
		treeWalker = document.createTreeWalker(
			document.body,
			NodeFilter.SHOW_TEXT,
			null,
			false
		),
		parser = new DOMParser(),
		nodesToRemove = [];

	while(treeWalker.nextNode()) {
		var node = treeWalker.currentNode;
		if(node.parentNode.tagName != 'A') {
			var replaced = false,
				text = node.textContent,
				x = text.split(url_split),
				newNodes = {};

			for(var i in x) {
				var match = url.exec(x[i]);
				if(match && (match[1] || match[2] || match[4])) {
					replaced = true;

					x[i] = document.createElement('a');
					x[i].setAttribute('href', (match[1] || '//') + (match[2] || '') + (match[3] || '') + (match[4] || ''));
					x[i].setAttribute('target', '_blank');
					x[i].appendChild(document.createTextNode(match[0]));
				} else {
					x[i] = document.createTextNode(x[i]);
				}
			}

			if(replaced) {
				for(var i in x) {
					node.parentNode.insertBefore(x[i], node);
				}

				// Can't remove the node whilst looping through the nodes
				nodesToRemove.push(node);
			}
		}
	}

	for(var i in nodesToRemove) {
		nodesToRemove[i].parentNode.removeChild(nodesToRemove[i]);
	}

	console.log(((new Date).getTime() - s) + 'ms');
})();
