$(document).ready(function() {

    var options = {
        chart: {
            renderTo: 'insta_month',
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
            max:550,
            title: {
                text: 'Number of Posts'
            },
            plotLines: [{
                value: 0,
                width: 10,
                color: '#808080'
            }],
        },
        series: []
    };


    $.get('data/insta_month.csv', function(data) {

        var lines = data.split('\n');
        var series = {
            data: []
        };


        $.each(lines, function(lineNo, line) {
            var items = line.split(',');


            if(lineNo>0){
                options.xAxis.categories.push(items[0]);
                series.data.push(parseFloat(items[1]));

            }

        });
        options.series.push(series);
        

        var chart = new Highcharts.Chart(options);
    });


});
