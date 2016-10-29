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
            labels: {

                formatter: function(){
                    var date = this.value;
                    year = date.split('/')[2];
                    month = date.split('/')[1];
                    var monArr=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; 
                    return monArr[month-1]+ " " + year;
                }
            },
            categories: []
        },

        yAxis: {
            min:0,
            max:80,
            title: {
                text: 'Number of Posts'
            },
        },

        plotOptions:{
            line: {
                marker: {
                    enabled: false
                }
            }
        },

        series: [{
            id: 'dataseries',
            data: [],
            color: '#0074FF',
            name: 'Burpple'
        }, {
            type: 'flags',
            data: [{
                x: 7,
                title: 'CNY',
                text: 'Closed during Chinese New Year'
            }, {
                x: 19,
                title: 'CNY',
                text: 'Closed during Chinese New Year'
            }],

            onSeries: 'dataseries',
            shape: 'squarepin',
            width: 16,
            showInLegend: false
        }]
    };


    $.get('data/burpple_month.csv', function(data) {

        var lines = data.split('\n');
        // var series = {
        //     data: []
        // };


        $.each(lines, function(lineNo, line) {
            var items = line.split(',');

            // series.data.push([Date.UTC(2000+dates[2], dates[1], dates[0]),items[1]])


            if(lineNo>0){
                options.xAxis.categories.push(items[0]);
                options.series[0].data.push(parseFloat(items[1]));
            }

        });
        



        var chart = new Highcharts.Chart(options);
    });


});
