$(document).ready(function() {

    var options = {
        chart: {
            renderTo: 'container',
            type: 'line'
        },
        title: {
            text:''
       },
        xAxis: {
            type: 'datetime', 
            min: Date.UTC(2015,0,1), 
            title: {text: 'Date'}, 
            tickInterval: 24 * 3600 * 1000 *30 * 4, 
            labels: { 
                formatter: function() { 
                    var d= new Date(this.value); 
                    console.log(d);
                    var month = d.getMonth(); 
                    console.log(month);
                    var monArr=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; 
                    console.log( monArr[month] + " - " + d.getFullYear());
                    return monArr[month] + " - " + d.getFullYear();

                }
            },

            // title: {
            //     text: 'Date'
            // },
            categories: []
        },
        yAxis: {
            min:0,
            max:100,
            title: {
                text: 'Number of Posts'
            },
            plotLines: [{
                value: 0,
                width: 10,
                color: '#808080'
             }]
        },
        series: []
    };


    $.get('sundayfolks_burpple_data.csv', function(data) {

        var lines = data.split('\n');
        var series = {
            data: []
        };


        $.each(lines, function(lineNo, line) {
            var items = line.split(',');
            
            // series.data.push([Date.UTC(2000+dates[2], dates[1], dates[0]),items[1]])


            if(lineNo>0){
                options.xAxis.categories.push(items[0]);
                series.data.push(parseFloat(items[1]));
            }

        });
        options.series.push(series);



        var chart = new Highcharts.Chart(options);
    });


});
