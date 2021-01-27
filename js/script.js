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
    }else if(body.is('.favourites')){
        $('.media-list').html('');
        favourites();
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

function favorito(music, artist){
    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=track.getinfo&track=" + music + "&artist=" + artist + "&api_key=db577d25137963e669181d8a9eedac9c&format=json"
    })
        .done(function(msg){
            var song =  msg.track;
            var liMedia = cloneMedia.clone();
            $('.title', liMedia).text(song.name);
            $('.ano', liMedia).text(song.artist.name);
            getAlbumImage(song.name, song.artist.name, liMedia);
            $('#detalhes', liMedia).attr('href', "detalhes.html?music="+song.name+"&artist="+song.artist.name);
            $('.media-list').append(liMedia);

            if(song.wiki != null){
                $('#wiki').text(song.wiki.content);
            }
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

            setFavText(music, artist);
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
                $('#image', liMedia).attr('src', 'images/no_image.png');
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

function actionFavourites(){
    var urlParams = new URLSearchParams(window.location.search);
    var value = urlParams.get('music');

    music = decodeURI(value);
    value = urlParams.get('artist');
    artist = decodeURI(value);

    if(typeof(Storage) !== "undefined"){

    } else{
        // Acção ou aviso para o não suporte de persistência de dados
        $('#error').text("Local Storage disabled/not supported!").show().fadeOut(2000);
    }

    if (typeof(Storage) !== "undefined") {
        // Código com implementação do JSON.

        var favs = localStorage.getItem("favourites"); //Ler textoJSON da memoria
        var validation = validateFav(music, artist);
        if(favs != null && validation == true){
            var favourites = {
                music: music,
                artist: artist
            };

            var myJSON = JSON.stringify(favourites); //JSON para texto
            favs += '\n' + myJSON;
            localStorage.setItem("favourites", favs); //textoJSON em memoria
        }else if(favs == null){
            var favourites = {
                music: music,
                artist: artist
            };
            var myJSON = JSON.stringify(favourites); //JSON para texto
            localStorage.setItem("favourites", myJSON); //textoJSON em memoria
        }else if(validation == false){
            removeFav();
        }

        return;
    } else {
        // Acção ou aviso para o não suporte de persistência de dados
        $( "#error" ).text( "Not valid!" ).show().fadeOut( 1000 );
        event.preventDefault();
    }
}

function favourites(){
    var textJSON = localStorage.getItem("favourites");

    if(textJSON != null){
        var strLines = textJSON.split("\n");

        try{
            for (var i = 0; i<10; i++){
                console.log(strLines[i]);
                var json = JSON.parse(strLines[i]);
                favorito(json.music, json.artist);
            }
        }catch (e) {
        }
    }
}

function setFavText(music, artist){
    var textJSON = localStorage.getItem("favourites");

    if(textJSON != null){
        var strLines = textJSON.split("\n");

        try{
            for (var i = 0; i<10; i++){
                var json = JSON.parse(strLines[i]);
                if(json.music == music && json.artist == artist){
                    $('#image-fav').attr('src', 'images/star.png');
                    $('#text-fav').text("Already in Fav");
                }
            }
        }catch (e){
        }
    }
}

function validateFav(music, artist){
    var validate = true;
    var textJSON = localStorage.getItem("favourites");

    if(textJSON != null){
        var strLines = textJSON.split("\n");

        try {
            for (var i = 0; i<10; i++){
                var json = JSON.parse(strLines[i]);
                if(json.music == music && json.artist == artist){
                    validate = false;
                }
            }
        } catch (error) {
        }

    }

    return validate;
}

function removeFav(){
    var textJSON = localStorage.getItem("favourites");


    if(textJSON != null){
        var strLines = textJSON.split("\n");
        console.log(strLines);

        try{
            for (var i = 0; i<10; i++){
                var json = JSON.parse(strLines[i]);
                if(json.music == music && json.artist == artist){
                    strLines.splice(i, 1);
                    $('#image-fav').attr('src', 'images/logo-star.png');
                    $('#text-fav').text("Add Music to Favourites");
                   //vamos += strLines[i].replace('},', '},\n');

                }
            }

        }catch (e){
            console.log(concat);
        }
    }

    //localStorage.setItem("favourites", strLines); //textoJSON em memoria
}