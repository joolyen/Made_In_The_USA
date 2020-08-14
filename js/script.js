var stockSearch = document.querySelector('#searchButton');
var fq = "business";
var apiKey = "0xtfC1lrtqDdKvSdw4AW74VGe87ACQAb";

function getStockInfo(ticker) {
    var queryURL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + ticker + "&apikey=1R7O28U5BHPJZSE7"

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (res) {
      $('#currentPrice').empty();
      $('#data').empty();
      console.log(res);
        var dataPoint = $('<div>')
        var dataPointPrice = $('<div>')
        var symbol = $('<p>').text("Ticker: " + res['Global Quote']['01. symbol']);
        console.log(res['Global Quote']['01. symbol']);
        var open = $('<p>').text("Open: " + res['Global Quote']['02. open']);
        console.log("open: " + res['Global Quote']['02. open']);
        var high = dataPoint.text(("High: " + res['Global Quote']['03. high']));
        console.log("high: " + res['Global Quote']['03. high']);
        var low = $('<p>').text("Low: " + res['Global Quote']['04. low']);
        console.log("price: " + res['Global Quote']['03. high']);
        var price = $('<p>').text(res['Global Quote']['04. low']);
        console.log("current price: " + res['Global Quote']['05. price']);
        var lastTradingDay = $('<p>').text("Last Trading Day: " + res['Global Quote']['07. latest trading day']);
        console.log("last trading day: " + res['Global Quote']['07. latest trading day']);
        dataPoint.append(symbol,open,high,low,lastTradingDay)
        dataPointPrice.append(price)
        $('#data').append(dataPoint)
        $('#currentPrice').append(dataPointPrice)

      });
}

function getStockNews(ticker){
  var query = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + ticker + "&fq=" + fq + "&api-key=" + apiKey;
  $.get(query, function (data, status) {
      $('#newsArticles').empty();
      var newsUrl = (data.response.docs[0].web_url)
      console.log(data);
      console.log(data.response.docs.length);
      console.log(data.response.docs[0].web_url);
      for (let i = 0; i < data.response.docs.length; i++){
          console.log("Read This Article: " + data.response.docs[i])
          var newsResult = ("Read This: " + data.response.docs[i].abstract)
          var newsResultDiv = $('<div>').text(newsResult).append('<a href="' + newsUrl + '">Read More...</a>')
          $('#newsArticles').append(newsResultDiv)
      }
  });
}

$(stockSearch).on('click', function (event) {
    // Preventing the button from trying to submit the form
    console.log('Search Button Clicked');
    event.preventDefault();
    // Getting ticker symbol from search input field
    var ticker = $('#userInput').val().trim();
    console.log(ticker);

    getStockInfo(ticker);
    getStockNews(ticker);
});