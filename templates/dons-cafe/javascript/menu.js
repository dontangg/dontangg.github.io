window.addEvent('domready', function() {
	
	$$(".bottomMenu").set('morph', {
		duration: 'long',
		transition: Fx.Transitions.Quint.easeOut
	});
	
	$$(".bottomMenu").addEvent('mouseenter', openMenu);
	
	
	$$(".bottomMenu").set('scrollTop', 0);
});

function openMenu(e) {
	new Event(e).stop();
	
	this.removeEvent('mouseenter', openMenu);
	this.addEvent('mouseleave', closeMenu);
	
	var height = 0;
	$each(this.getChildren(), function(el) {
		height += el.offsetHeight;	
	});
	
	this.get('morph').pause();
	this.morph({'height': [18, height], 'top': [0, (18 - height)]});
}

function closeMenu(e) {
	new Event(e).stop();
	
	this.removeEvent('mouseleave', closeMenu);
	this.addEvent('mouseenter', openMenu);
	
	var height = 0;
	$each(this.getChildren(), function(el) {
		height += el.offsetHeight;	
	});
	
	this.get('morph').pause();
	this.morph({'height': 18, 'top': 0});
}