<!-- // DO NOT REMOVE THIS LINE
/********************************************************************\

    Project: Movy Svetu
    File:    movysvetu.js
    Author:  Nikolai Krot <talpa@tut.by> <krot@mova.org>
    Last modified: April 17, 2003

    Content: a set of JavaScript functions for tree manipulation

\********************************************************************/

/**** EDIT TO FIT YOUR NEEDS ****************************************/

// determines the initial state of the language tree:
// can be either 'open' or 'closed'
treeStatus = 'closed';

// text that will be shown on the tree manipulation buttons
labelExpandTree = "Разгарнуць";
labelCloseTree  = " Згарнуць ";

// root (top-level) directory of the site
rootDir = "../../"

/**** KEEP YOUR HANDS OFF WHAT GOES BELOW THIS LINE *****************/

function show_props(obj) {
	for (var i in obj) {
		document.write(i + "=" + obj[i] + "<br>");
	}
}

// when the user tries to load the main page only (filename ends with
// 1.htm) instead of loading the parent page that holds both navigation
// frame and the main frame, override this by loading the parent page
// filenames must be like this:
// parent page     filename.htm
// main page       filename1.htm
// instead of filename1.htm there will be loaded filename.htm
function loadAsFrame() {
	if (self == top) {
		var oldURL = String(window.location);
		window.location = oldURL.replace(/(.*)1(\.html?)/i, "$1$2");
	}
}

function openNode(id) {
	var htmlElement = document.getElementById(id);

	htmlElement.style.display = 'block';

	if (document.images[id+"-i"])
		document.images[id+"-i"].src = rootDir + "minus.gif";
}

function closeNode(id) {
	var htmlElement = document.getElementById(id);

	htmlElement.style.display = 'none';

	if (document.images[id+"-i"])
		document.images[id+"-i"].src = rootDir + "plus.gif";
}

function changeStateSubtree(id, cmd) {
	// number of children nodes that will be tried for a parent
	// if a tree appears cut it may be because of this limit
	// being too small; just set it to a higher value. But be
	// reasonable, cuz the higher this value is the slower the
	// tree is expanded/collapsed
	var maxChildren = 30;

	for (var i=1; i<maxChildren; i++) {
		var new_id = id + "." + i;

		if (document.getElementById(new_id) != null) {

			if (cmd == 'open')
				openNode(new_id);

			if (cmd == 'close')
				closeNode(new_id);

			changeStateSubtree(new_id, cmd);
		}
	}
}

function toggleStateNode(id) {
	var htmlElement = document.getElementById(id);

	if (htmlElement.style.display == 'block')
		closeNode(id)
	else
		openNode(id)
}

// #1 -- ID of the topmost level (will be shown when the tree is closed)
// optional arguments (any number):
// #2 -- ID of the node that have to be shown when the tree is closed
function toggleStateTree(id) {

	if (treeStatus == 'open') {
		// To close the tree we first close the whole tree
		// and then open the topmost node so that the first level is shown.
		// additionally, nodes specified as other-than-first arguments to
		// this function are also opened

		// close the whole tree
		changeStateSubtree(id, 'close');

		// open levels that have to be shown (open) when the tree is closed
		openNode(id);
		for (var arg=1; arg < toggleStateTree.arguments.length; arg++) {
			openNode(toggleStateTree.arguments[arg])
		}

		// handle buttons
		document.tree_cntrl_top.button.value     = labelExpandTree;
		document.tree_cntrl_bottom.button.value  = labelExpandTree;
		document.tree_cntrl_bottom.style.display = 'none'; // shit! does not work in mozilla

		treeStatus = "closed";

	} else {

		changeStateSubtree(id, 'open');

		document.tree_cntrl_top.button.value     = labelCloseTree;
		document.tree_cntrl_bottom.button.value  = labelCloseTree;
		document.tree_cntrl_bottom.style.display = 'inline'; // shit! does not work in mozilla

		treeStatus = 'open';

	}
}

// inverse treeStatus value
if (treeStatus == 'open')
	treeStatus = 'closed'
else
	treeStatus = 'open'

// DO NOT REMOVE THIS LINE -->
