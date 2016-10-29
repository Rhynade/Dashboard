var options = {
	chart: {
		renderTo: 'insta_flavours',
		type: 'line'
	},

	title: {
		text: ''
	},

	xAxis: {
		labels: {
						// enabled: false,
			formatter: function(){
				var date = this.value;
				year = date.split('/')[2].split(0)[1];
				month = date.split('/')[1];
				var monArr=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; 
				return monArr[month-1]+ " " + year;
			}
		},
		categories: []
	},
	yAxis: {
		title: {
			text: 'Percentage'
		}
	},
	plotOptions:{
		line: {
			marker: {
				enabled: false
			}
		}
	},
	series: []
};
			
	$.get('data/instagram_flavours.csv', function(data) {
		// Split the lines
		var lines = data.split('\n');
		$.each(lines, function(lineNo, line) {
			var items = line.split(',');
			
			// header line containes categories
			if (lineNo == 0) {
				$.each(items, function(itemNo, item) {
					if (itemNo > 0) options.xAxis.categories.push(item);
				});
			}
			
			// the rest of the lines contain data with their name in the first position
			else {
				var series = { 
					data: [],
					visible: false
				};
				$.each(items, function(itemNo, item) {
					if (itemNo == 0) {
						series.name = item;

					}else if (series.name == 'earl grey lavender' || series.name == 'dark chocolate' || series.name == 'seasalt gula melaka'){
						series.visible = true;
						series.data.push(parseFloat(item));
					}else{
						series.data.push(parseFloat(item));
					}
				});
				
				options.series.push(series);
			}
			
		});
		
		var chart = new Highcharts.Chart(options);
	});
