# VanillaMask

Plugin to make masks on form fields

## Usage

Without jQuery

```javascript
new VanillaMask(document.querySelector("#cellphone"), {
	masks: ["(99) 9999-9999", "(99) 99999-9999"],
	onComplete: function() {
		console.log('mask complete');
	}
});
```

With jQuery

```javascript
$("#cellphone").VanillaMask({
	masks: ['(99) 9999-9999', '(99) 99999-9999']
})
.on('complete.VanillaMask', function(){
	console.log('mask complete');
});
```
