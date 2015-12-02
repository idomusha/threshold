# threshold

### manages window width changes
- data-attribute **window** with the width range name as value
- callback when width range switches to another (which range doesn't matter)
- callback after switch to a specific range (several callbacks possible)

## Demo

[See threshold in action](http://idomusha.github.io/threshold/)

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
	threshold();
	```

4. Declare callbacks (whenever):

	```javascript
	$(window).data('threshold').after('mobile', function() {
		$('#console').append('<p>[mobile]</p>');
	});
	$(window).data('threshold').after('x-small', function() {
		$('#console').append('<p>[x-small] an awesome callback!</p>');
	});
	$(window).data('threshold').after('x-small', function() {
		$('#console').append('<p>[x-small] an another awesome callback!</p>');
	});
	$(window).data('threshold').after(['large', 'x-large'], function() {
		$('#console').append('<p>[large] OR [x-large] callback for window width >= 1360px</p>');
	});
	$(window).data('threshold').after('all', function() {
		$('#console').append('<p>[all] callback for all thresholds</p>');
	});
	```

5. Override default values [OPTIONAL]:

You can specify how many ranges you want.  
- **ranges** setting takes as key the width range name (string) and as values the media query begin and end (array). "-1" means no value (for min-width or max-width).  
- **name** setting allows you to change the default data attribute name by your own (or class prefix name if 'class' is defined as true).  
- **class** allows you to use a class instead of data attribute.

	```javascript
	threshold({
	
        // breakpoints (minimum: 2)
        ranges: {
          'x-large': ['1600px', -1],        // '1480px'
          large: ['1440px', '1599px'],      // '1360px'
          medium: ['1280px', '1439px'],     // '1220px'
          small: ['960px', '1279px'],       // '920px'
          'x-small': ['760px', '959px'],    // '740px',
          mobile: [-1,'759px'],             // '100%',
        },
    
        // data attribute name (or class name prefix) | default: 'window'
        name: 'width', 
    
        // data attribute (false) or class (true) | default: false
        class: true,
        
	});
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
