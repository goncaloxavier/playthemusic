var cloneMedia = $('.media').clone();

$('#btPesquisar').on('click', function(){
    $('.row').html('');
    var valorPesquisa = $('#pesquisa').val();

    $('.media-list').html('');


    var parameter = $("#parameter").val();

    if(parameter == 1){
        searchTrack(valorPesquisa);
    }else if(parameter == 2){
        searchArtist(valorPesquisa);
    }
    else{
        searchAlbum(valorPesquisa);
    }

});

$(document).ready(function() {
    var body = $('body');
    if(body.is('.top10')){
        $('.media-list').html('');
        top10(null);
    }else if(body.is('.details')){
        $('.media-list').html('');
        var urlParams = new URLSearchParams(window.location.search);
        var value = urlParams.get('music');

        music = decodeURI(value);
        value = urlParams.get('artist');
        artist = decodeURI(value);

        detalhes(music, artist);
    }
    else if(body.is('.index')){
        $('.media-list').html('');
        homepage();
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

            msg.tracks.track.forEach(function(result){
                var liMedia = cloneMedia.clone();
                $('.title', liMedia).text(result.name);
                $('.ano', liMedia).text(result.artist.name);
                getAlbumImage(result.name, result.artist.name, liMedia);
                $('#detalhes', liMedia).attr('href', "detalhes.html?music="+result.name+"&artist="+result.artist.name);
                $('.tipo', liMedia).text(result.Type);
                $('.media-list').append(liMedia);
            })
        })
}

function homepage(){
    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&limit=10&api_key=db577d25137963e669181d8a9eedac9c&format=json"
    })
        .done(function(msg){
            console.log(msg);

            msg.tracks.track.forEach(function(result){
                var liMedia = cloneMedia.clone();
                $('.title', liMedia).text(result.name);
                $('.ano', liMedia).text(result.artist.name);
                getAlbumImage(result.name, result.artist.name, liMedia);
                $('#detalhes', liMedia).attr('href', "detalhes.html?music="+result.name+"&artist="+result.artist.name);
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
            var song =  msg.track;
            console.log(msg);
            $('#music').text(song.name);
            $('#artist').text(song.artist.name);
            var image = $(".details").find('.image-album');
            if(song.album != null){
                image.attr('src', song.album.image[3]['#text']);
                $('#album-name').text("Album: " + song.album.title);
            }else{
                image.attr('src', 'images/no_image.png');
            }

            if(song.wiki != null){
                $('#wiki').text(song.wiki.content);
            }
        })
}

function getAlbumImage(music, artist, liMedia){
    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=track.getinfo&track=" + music + "&artist=" + artist + "&api_key=db577d25137963e669181d8a9eedac9c&format=json"
    })
        .done(function(msg){
            if(msg.error !== 6 && msg.track.album != null){
                $('#image', liMedia).attr('src', msg.track.album.image[3]['#text']);
            }else{
                $('#image', liMedia).attr('src', 'images/no_image.png');
            }
        });
}

$('#fav').click(function(){ addFav(); return false; });


function addFav(){
    if($('body').is('.top10')){

    }
}

function searchTrack(search){
    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + search + "&api_key=db577d25137963e669181d8a9eedac9c&format=json"
    })
        .done(function(msg){
            msg.results.trackmatches.track.forEach(function(result){
                var liMedia = cloneMedia.clone();
                $('.title', liMedia).text(result.name);
                $('.ano', liMedia).text(result.artist);
                $('#detalhes', liMedia).attr('href', "detalhes.html?music="+result.name+"&artist="+result.artist);
                getAlbumImage(result.name, result.artist, liMedia);
                $('.media-list').append(liMedia);
            })
        })
}

function searchArtist(search){
    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=" + search + "&api_key=db577d25137963e669181d8a9eedac9c&format=json"
    })
        .done(function(msg){
            msg.results.artistmatches.artist.forEach(function(result){
                var liMedia = cloneMedia.clone();
                $('.title', liMedia).text(result.name);
                $('.ano', liMedia).text(result.artist);
                //$('#detalhes', liMedia).attr('href', "detalhes.html?music="+result.name+"&artist="+result.artist);
                //getAlbumImage(result.name, result.artist, liMedia);
                $('.media-list').append(liMedia);
            })
        })
}

function searchAlbum(search){
    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=album.search&album="+ search +"&api_key=db577d25137963e669181d8a9eedac9c&format=json"
    })
        .done(function(msg){
            msg.results.albummatches.album.forEach(function(result){
                var liMedia = cloneMedia.clone();
                $('.title', liMedia).text(result.name);
                $('.ano', liMedia).text(result.artist);
                //$('#detalhes', liMedia).attr('href', "detalhes.html?music="+result.name+"&artist="+result.artist);
                getAlbumImage(result.name, result.artist, liMedia);
                $('.media-list').append(liMedia);
            })
        })
}