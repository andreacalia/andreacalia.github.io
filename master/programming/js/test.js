require([
	'js/model/remote-data-model',
	'js/app',
], function(Model, App){

	window.Model = Model;
	window.app = App;




	var arr = [
		{
			id: 'europe',
			name: 'Europe'
		},
		{
			id: 'europe',
			name: 'Europe'
		},
		{
			id: 'all',
			name: 'All'
		},
		{
			id: 'all',
			name: 'All'
		}
	];
	var arr2 = [
		{
			id: 'asd',
			name: 'Asd'
		},
		{
			id: 'europe',
			name: 'Europe'
		},
		{
			id: 'all',
			name: 'All'
		},
		{
			id: 'all',
			name: 'All'
		}
	];

	var uniqueArr = _
		.chain(arr)
		.union(arr2)
		.union([{id: "LOL", name: "lol"}])
		.uniq(function(item) {
			return item.id;
		})
		.value();

	console.log(uniqueArr);

});