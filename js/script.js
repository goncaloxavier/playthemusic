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
                $('#btnfav', liMedia).attr('value', result.mbid);
                $('.ano', liMedia).text(result.artist);
                //$('.media-object', liMedia).attr('src','https://lastfm.freetls.fastly.net/i/u/34s/2a96cbd8b46e442fc41c2b86b821562f.png');
                $('.tipo', liMedia).text(result.Type);
                $('.media-list').append(liMedia);
            })
        })
});

$(document).ready(function() {
    var body = $('body');
    if(body.is('.top10')){
        top10(null);
    }else if(body.is('.details')){
        var urlParams = new URLSearchParams(window.location.search);
        var value = urlParams.get('music');

        music = decodeURI(value);
        value = urlParams.get('artist');
        artist = decodeURI(value);

        detalhes(music, artist);
    }
});

function top10(pesquisa){

    if(pesquisa == null){
        pesquisa = "portugal";
    }

    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country="+pesquisa+"&api_key=db577d25137963e669181d8a9eedac9c&format=json"
    })
        .done(function(msg){
            console.log(msg);

            //$.each(msg.Search, function(index, result){
            msg.tracks.track.forEach(function(result){
                var liMedia = cloneMedia.clone();
                $('.title', liMedia).text(result.name);
                $('.ano', liMedia).text(result.artist.name);
                $('.media-object', liMedia).attr('src','https://lastfm.freetls.fastly.net/i/u/34s/2a96cbd8b46e442fc41c2b86b821562f.png');
                $('#fav', liMedia).attr('href', "detalhes.html?music="+result.name+"&artist="+result.artist.name);
                $('.tipo', liMedia).text(result.Type);
                $('.media-list').append(liMedia);
            })
        })
}

function detalhes(music, artist){
    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=track.getinfo&track=" + music + "&artist=" + artist + "&api_key=db577d25137963e669181d8a9eedac9c&format=json"
    })
        .done(function(msg){
            this.artist = artist
            var song =  msg.track;
            $('#music').text(song.name);
            var image = $(".details").find('.image-album');
            image.attr('src', song.album.image[3]['#text']);
            $('#artist').text(artist);
            $('#album-name').text(song.album.title);
        })
}

$('#fav').click(function(){ addFav(); return false; });


function addFav(){
    if($('body').is('.top10')){

    }
}