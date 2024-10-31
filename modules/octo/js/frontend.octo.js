var g_octEdit = false
,	g_octBlockFabric = null
,	g_octCanvas = null;
jQuery(document).ready(function(){
	_octInitFabric();
	_octInitCanvas( octOcto );
	if(octOcto && octOcto.blocks && octOcto.blocks.length) {
		for(var i = 0; i < octOcto.blocks.length; i++) {
			g_octBlockFabric.addFromHtml(octOcto.blocks[ i ], jQuery('#octCanvas .octBlock[data-id="'+ octOcto.blocks[ i ].id+ '"]'));
		}
	}

	var $ = jQuery;

	$('[data-imode="auto"]').each(function () {
		var $this = $(this)
		,	$img = $this.find('img');

		if (! $img.size()) return;

		var handle = function () {
			var h = $img.height()
			,	w = $img.width();

			if (h && w && h < w) 
				$img.css({ width: 'auto', height: '100%' });
			else
				$img.css({ width: '100%', height: 'auto' });
		};

		handle();

		$img.load(function () {
			handle();
		});
	});
});
function _octInitFabric() {
	g_octBlockFabric = new octBlockFabric();
}
function _octInitCanvas(octoData) {
	g_octCanvas = new octCanvas( octoData );
}
function _octGetCanvas() {
	return g_octCanvas;
}