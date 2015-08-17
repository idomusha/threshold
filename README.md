#threshold

## manages page width change

## Demo

[See Threshold in action](http://idomusha.github.io/threshold/)

## Usage

1. Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	```

2. Include plugin's code:

	```html
	<script src="dist/threshold.min.js"></script>
	```

3. Call the plugin:

	```javascript
	Threshold();
	```

4. Declare callbacks (whenever):

	```javascript
	$(window).data('Threshold').after('mobile', function() {
		$('#console').append('<p>[mobile]</p>');
	});
	$(window).data('Threshold').after('x-small', function() {
		$('#console').append('<p>[x-small] an awesome callback!</p>');
	});
	$(window).data('Threshold').after('x-small', function() {
		$('#console').append('<p>[x-small] an another awesome callback!</p>');
	});
	$(window).data('Threshold').after(['large', 'x-large'], function() {
		$('#console').append('<p>[large] OR [x-large] callback for window width >= 1360px</p>');
	});
	```

5. Override default values [OPTIONAL]:

	```javascript
	Threshold({
		widths: {
			'mobile': '100%',
			'x-small': '740px',
			'small': '920px',
			'medium': '1220px',
			'large': '1360px',
			'x-large': '1440px',
		}
	});
	```

	```less
	/* ==========================================================================
	 * VARIABLES
	 * ========================================================================== */


	/* page
	 * ========================================================================== */
	@page-width-x-large: 1480px;
	@page-width-large: 1360px;
	@page-width-medium: 1220px;
	@page-width-small: 920px;
	@page-width-x-small: 740px;
	@page-width-mobile: 100%;


	/* steps
	 * ========================================================================== */
	@step-min-x-large: (@page-width-x-large + 2*60);        // 1600 --> 1480 (page) + 2*60 (min auto margin)
	@step-max-large: (@page-width-x-large + 2*60 - 1);
	@step-min-large: (@page-width-large + 2*40);            // 1440 --> 1360 (page) + 2*40 (min auto margin)
	@step-max-medium: (@page-width-large + 2*40 - 1);
	@step-min-medium: (@page-width-medium + 2*30);          // 1280 --> 1220 (page) + 2*30 (min auto margin)
	@step-max-small: (@page-width-medium + 2*30 - 1);
	@step-min-small: (@page-width-small + 2*20);            // 960 --> 920 (page) + 2*20 (min auto margin)
	@step-max-x-small: (@page-width-small + 2*20 - 1);
	@step-min-x-small: (@page-width-x-small);               // 740 (page) + 0 (min auto margin)
	@step-max-mobile: (@page-width-x-small - 1);


	/* screen
	 * ========================================================================== */
	@screen-min-x-large: ~"screen and (min-width:@{step-min-x-large})";   // min 1480
	@screen-min-large: ~"screen and (min-width:@{step-min-large})";       // min 1360
	@screen-min-medium: ~"screen and (min-width:@{step-min-medium})";     // min 1220
	@screen-min-small: ~"screen and (min-width:@{step-min-small})";       // min 940
	@screen-min-x-small: ~"screen and (min-width:@{step-min-x-small})";   // min 740

	@screen-max-large: ~"screen and (max-width:@{step-max-large})";       // max 1479
	@screen-max-medium: ~"screen and (max-width:@{step-max-medium})";     // max 1359
	@screen-max-small: ~"screen and (max-width:@{step-max-small})";       // max 1219
	@screen-max-x-small: ~"screen and (max-width:@{step-max-x-small})";   // max 939
	@screen-max-mobile: ~"screen and (max-width:@{step-max-mobile})";     // max 739

	@screen-x-large: ~"screen and (min-width:@{step-min-x-large})";                                       // min 1480
	@screen-large: ~"screen and (min-width:@{step-min-large}) and (max-width:@{step-max-large})";         // min 1360 & max 1479
	@screen-medium: ~"screen and (min-width:@{step-min-medium}) and (max-width:@{step-max-medium})";      // min 1220 & max 1359
	@screen-small: ~"screen and (min-width:@{step-min-small}) and (max-width:@{step-max-small})";         // min 940 & max 1219
	@screen-x-small: ~"screen and (min-width:@{step-min-x-small}) and (max-width:@{step-max-x-small})";   // min 740 & max 939
	@screen-mobile: ~"screen and (max-width:@{step-max-mobile})";                                         // max 739
	```

	```less
	/**
	 * ==========================================================================
	 * WIDTH
	 * ========================================================================== */


	.width-full {
	  width: 100%;
	  position: relative;
	}

	.width-fixed {
	  width: @page-width-x-large;
	  position: relative;
	  margin: 0 auto;
	}

	@media @screen-max-large {
	  .width-fixed {
		width: @page-width-large;
	  }
	}

	@media @screen-max-medium {
	  .width-fixed {
		width: @page-width-medium;
	  }
	}

	@media @screen-max-small {
	  .width-fixed {
		width: @page-width-small;
	  }
	}

	@media @screen-max-x-small {
	  .width-fixed {
		width: @page-width-x-small;
	  }
	}

	@media @screen-max-mobile {
	  .width-fixed {
		width: @page-width-mobile;
	  }
	}
	```

## You can also grab Both using bower:
```
	bower install threshold --save
```

#### Authors

[![idomusha](https://fr.gravatar.com/userimage/43584317/49cfb592a2054e9c39c5dc195e5ea419.png?size=70)](https://github.com/idomusha) |
--- |
[idomusha](https://github.com/idomusha) |

## License

MIT: [http://idomusha.mit-license.org/](http://idomusha.mit-license.org/)
