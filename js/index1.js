$(document).ready(function() {
			
			var options = {
				chart: {
					renderTo: 'container2',
					type: 'line'
				},
				xAxis: {
					categories: []
				},
				yAxis: {
					title: {
						text: 'Percentage'
					}
				},
				series: []
			};
			
			$.get('flavours_month_tr.csv', function(data) {
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
			
			
		});