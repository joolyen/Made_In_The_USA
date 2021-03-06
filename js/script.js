//set global variables for use later
var stockSearch = document.querySelector('#searchButton');
var fq = "business";
var nytApiKey = "0xtfC1lrtqDdKvSdw4AW74VGe87ACQAb";
var alphaAPIKey = "1R7O28U5BHPJZSE7";

//API call for alphavantage
function getStockInfo(ticker) {
  var queryURL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + ticker + "&apikey=" + alphaAPIKey
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (res) {
    //clearing out data fields
    $('#currentPrice').empty();
    $('#data').empty();
    $('#companyName').empty();
    $('#arrow').empty();
    
    //getting data from alpha advantage
    var dataPoint = $('<div>')
    var dataPointPrice = $('<div>')
    var symbol = $('<p>').html("Ticker: " + res['Global Quote']['01. symbol']);

    var openval = (res['Global Quote']['02. open']).slice(0, 6);
    var open = $('<p>').html("Open: $" + openval);

    var highval = (res['Global Quote']['03. high']).slice(0, 6);
    var high = $('<p>').html("High: $" + highval);

    var lowval = (res['Global Quote']['04. low']).slice(0, 6)
    var low = $('<p>').html("Low: $" + lowval);
 
    var priceval = (res['Global Quote']['05. price']).slice(0, 6);
    var price = $('<p>').text("$" + priceval);

    var lastTradingDay = $('<p>').html("Last Trading Day: " + res['Global Quote']['07. latest trading day']);

    //adding important data points for various divs
    dataPoint.append(symbol, open, high, low);
    dataPointPrice.append(price);
    $('#data').append(dataPoint);
    $('#currentPrice').append(dataPointPrice);


    // if/else to change price color and add arrow
    if (priceval > openval) {
      $("#currentPrice").addClass("up");
      $("#arrow").append('<img id="greenArrow" src="assets/upArrow.png" style="width:60px;height:80px;"/>');
    } else {
      $("#currentPrice").addClass("down");
      $("#arrow").append('<img id="redArrow" src="assets/downArrow.png"style="width:60px;height:80px;"/>');
    }

    //2nd AJAX call to populate the company name tile

    var queryCompanyNameURL = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + ticker + "&interval=5min&apikey=" + alphaAPIKey
    $.ajax({
      url: queryCompanyNameURL,
      method: "GET",
    }).then(function (res) {
      //console.log(res.Name);
      var companyName = (res.Name)
      var companyNameDiv = $('<p>').text(companyName)
      $('#companyName').append(companyNameDiv)
    });
  });
}
//nytimes API call
function getStockNews(ticker) {
  var query = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + ticker + "&fq=" + fq + "&api-key=" + nytApiKey;
  $.get(query, function (data, status) {
    $('#newsArticles').empty();

    var newsUrl = (data.response.docs[0].web_url)
    //getting 5 articles listed in the div

    for (let i = 0; i < 5; i++) {
      var newsResult = (data.response.docs[i].abstract)
      var headline = (data.response.docs[i].headline.main)
      var newsUrl = (data.response.docs[i].web_url)
      console.log(headline)
      var newsresultDiv = $('<h3>').text(headline)
      var newsResultP = $('<p>').text(newsResult).append('&nbsp;<a target="_blank" href="' + newsUrl + '">Read More...</a>')
      $('#newsArticles').append(newsresultDiv, newsResultP)
    }
  });
}
$(stockSearch).on('click', function (event) {
  // Preventing the button from trying to submit the form
  event.preventDefault();
  // Getting ticker symbol from search input field
  var ticker = $('#userInput').val().trim();
  if (ticker != null) {
    var tempData = JSON.parse(localStorage.getItem("ticker")) || [];
    tempData.push(ticker);
    localStorage.setItem("ticker", JSON.stringify(tempData));
    var recentsearches = $('#local');
   
    $("#local").empty();
  
    for (let i = 0; i < tempData.length; i++) {
      var dataRecent = $('<a href="#" class="recentSearch button is-rounded is-block">' + tempData[i] + '</a>')

      recentsearches.append(dataRecent);
    }
  }

  // Click function for historical search results
  $('.recentSearch').on('click', function () {
    var tickerClick = $(this).text().trim();
    getStockInfo(tickerClick);
    getStockNews(tickerClick);
  });

  getStockInfo(ticker);
  getStockNews(ticker);
});

//create a clear button
$('#clearBtn').click(function () {
  $('#clearBtn')
    .val('')
    .removeAttr('btn')
    .removeAttr('btn-light')
    .removeAttr('btn-block');
  localStorage.clear()
  $(".recentSearch").remove();

});
//enabling the enter key for search button
var input = document.getElementById("userInput");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("searchButton").click();
  }
});
