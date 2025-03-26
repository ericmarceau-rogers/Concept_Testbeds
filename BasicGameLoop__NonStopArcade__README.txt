###
###	Eric Marceau, Ottawa, Canada
###	Mar 26, 2025
###

This is a "reconstruction" of the "Basic Game Loop" presented on SitePoint
as an incomplete version of a shoot-em-up "Asteroids" arcade game, 
presented at

	https://www.sitepoint.com/quick-tip-game-loop-in-javascript/

Note that working only from the code as supplied in the article, the 
behaviours outlined could not be reproduced.  So personal research was
required to "fill in the blanks" to make it operational.  As such, I
have attempted to document the various elements in the JavaScript,
along with references to sources of "enlightenment".

The original code worked using the keys A, W, S, D for motion and 
orientation control.  Those have been replaced by the correct "modern"
references the keyboard's arrow keys:

	ArrowLeft
	ArrowUp
	ArrowRight
	ArrowDown

FUTURES:

**IF** I feel ambitious some time in the future, I will add logic for

	* firing and displaying "missiles" to obliterate objects upon contact

	* random display of asteroids which could cause collisions and end of game.

	* scrolling, multi-layered background displaying a depth of field for
	  stars of random size/brilliance

###	EOT
