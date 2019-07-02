anychart.onDocumentReady(function(){

    //load data from JSON
    anychart.data.loadJsonFile('../mobile.json', function (data) {

        var sankey_chart = anychart.sankey(data);
        sankey_chart.title('Mobile Landscape');

        sankey_chart.padding(30, 10, 30, 10);
        sankey_chart.node().labels().fontColor('White');

        sankey_chart.nodeWidth("50%");
        sankey_chart.nodePadding(42);
        sankey_chart.container("container");
        sankey_chart.draw();

    });

});