var cloneMedia = $('.media').clone();

$('#btSearch').on('click', function(){

    var valorPesquisa = $('#pesquisa').val();
    $('.panel-title').text('Resultados da pesquisa de "' + valorPesquisa + '"');

    $('.media-list').html('');

    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + valorPesquisa + "&api_key=db577d25137963e669181d8a9eedac9c&format=json"
    })
        .done(function(msg){
            //console.log('msg');
            console.log(msg);

            //$.each(msg.Search, function(index, result){
            msg.results.trackmatches.track.forEach(function(result){
                var liMedia = cloneMedia.clone();
                //$('a', liMedia).attr('href', 'http://www.imdb.com/title/'+ result.imdbID);
                $('.title', liMedia).text(result.name);
                $('.ano', liMedia).text(result.artist);
               // $('.tipo', liMedia).text(result.Type);
                $('.media-list').append(liMedia);
            })
        })
});