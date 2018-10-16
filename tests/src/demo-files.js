const isIE = false;
window['no-native-shim'] = !isIE;
const files =
	'<link rel="stylesheet" href="../dist/form.css" />' +
	(isIE ? '<script src="./src/polyfills.js"></script>' : '') +
	'<script src="../dist/vendor.js"></script>' +
	'<script src="../dist/dev.js"></script>' +
	'<script src="//localhost:35701/livereload.js"></script>';
document.write(files);

function checkForUnLoadedNodes(){
	const
		docNodes = document.querySelectorAll('*');
	for(let i = 0; i < docNodes.length; ++i) {
		const node = docNodes[i];
		if (node.nodeName.indexOf('-') > -1 && !node.DOMSTATE) {
			console.error(node.nodeName.toLowerCase(), 'is not initialized. Did you forget to import it?');
		}
	}
}
setTimeout(checkForUnLoadedNodes, 2000);