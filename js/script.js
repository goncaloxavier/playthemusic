var cloneMedia = $('.media').clone();

$('#btPesquisar').on('click', function(){
    $('.row').html('');
    var valorPesquisa = $('#pesquisa').val();

    $('.media-list').html('');
    $("#h1-error").text("");

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
        top10();
    }else if(body.is('.details')){
        $('.media-list').html('');
        var urlParams = new URLSearchParams(window.location.search);
        var value = urlParams.get('music');

        music = decodeURI(value);
        value = urlParams.get('artist');
        artist = decodeURI(value);

        detalhes(music, artist);
        loadVideo(music, artist);
    }
    else if(body.is('.index')){
        $('.media-list').html('');
        homepage();
    }else if(body.is('.favourites')){
        $('.media-list').html('');
        favourites();
    }
});

function top10(){
    var country = $('#country').val();

    $('.media-list').html('');

    $.ajax({
        method: "GET",
        url: "http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country="+country+"&api_key=db577d25137963e669181d8a9eedac9c&format=json"
    })
        .done(function(msg){
            console.log(msg);
            var i = 1;
            if(msg['error'] == null){
                msg.tracks.track.forEach(function(result){
                    var liMedia = cloneMedia.clone();
                    $("#h1-error").text("");
                    $('.posicao', liMedia).text("#" + i);
                    $('.title', liMedia).text(result.name);
                    $('.ano', liMedia).text(result.artist.name);
                    getAlbumImage(result.name, result.artist.name, liMedia);
                    $('#detalhes', liMedia).attr('href', "detalhes.html?music="+result.name+"&artist="+result.artist.name);
                    $('.tipo', liMedia).text(result.Type);
                    $('.media-list').append(liMedia);
                    i++;
                })
            }else{
                $("#h1-error").text("NO RESULTS FOUND");
            }
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
                $('#wiki').html(song.wiki.content);
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
        var myFav = [];
        if(favs != null && validation == true){
            var favourites = {
                music: music,
                artist: artist
            };

            myFav = JSON.parse(localStorage.getItem("favourites"));
            myFav.push(favourites);
            console.log(myFav);
            var myJSON = JSON.stringify(myFav); //JSON para texto
            console.log(myJSON);
            localStorage.setItem("favourites", myJSON); //textoJSON em memoria
            $('#image-fav').attr('src', 'images/star.png');
            $('#text-fav').text("Track on My Favourites (remove?)");
        }else if(favs == null){
            var favourites = {
                music: music,
                artist: artist
            };
            myFav.push(favourites)
            var myJSON = JSON.stringify(myFav); //JSON para texto
            localStorage.setItem("favourites", myJSON); //textoJSON em memoria
            $('#image-fav').attr('src', 'images/star.png');
            $('#text-fav').text("Track on My Favourites (remove?)");
        }else if(validation == false){
            removeFav(music, artist);
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
        try{
            var myFav = JSON.parse(textJSON);
            console.log(myFav);
            if(myFav.length > 0){
                for(var i = 0; i<myFav.length; i++){
                    favorito(myFav[i].music, myFav[i].artist);
                }
            }else{
                $("#h1-error").text("Add tracks to favourites...");
            }
        }catch (e) {
        }
    }
}

function setFavText(music, artist){
    var textJSON = localStorage.getItem("favourites");

    if(textJSON != null){
        var myFav = JSON.parse(textJSON);
        try{
            if(myFav.length > 0){
                for (var i = 0; i<myFav.length; i++){
                    if(myFav[i].music == music && myFav[i].artist == artist){
                        $('#image-fav').attr('src', 'images/star.png');
                        $('#text-fav').text("Track on My Favourites (remove?)");
                    }
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
        var myFav = JSON.parse(textJSON);
        try {
            if(myFav.length > 0){
                for (var i = 0; i<myFav.length; i++){
                    if(myFav[i].music == music && myFav[i].artist == artist){
                        validate = false;
                    }
                }
            }

        } catch (error) {
        }

    }

    return validate;
}

function removeFav(music, artist){
    var textJSON = localStorage.getItem("favourites");

    if(textJSON != null){
        var myFav = JSON.parse(textJSON);
        try{
            if(myFav.length > 0){
                for(var i = 0; i<myFav.length; i++){
                    if(myFav[i].music == music && myFav[i].artist == artist){
                        myFav.splice(i, 1);
                    }
                }
                var textJSON = JSON.stringify(myFav);
                localStorage.setItem("favourites", textJSON);
                $('#image-fav').attr('src', 'images/logo-star.png');
                $('#text-fav').text("Add Track to Favourites");
            }
        }catch (e){

        }
    }
}

function loadVideo(music, artist) {
    // make ajax call
    // populate divs with results

    // Here we are composing the endpoint with query parameters as defined from https://developers.google.com/youtube/v3/docs/search/list
    // part=snippet is like a required default
    // maxResults=10 set the number of results we want to retrieve
    // key is your custom key gotten from the previous step

    // we invoke an ajax request here setting the url, method GET
    // on success we want to populate the div .video-play with an iframe that will hold the first video result. The class embed-resopnsive-item is bootstrap made.suggest-list
    // then we call populateSuggestions and pass in the rest of the videos for the suggested videos section
    // on error, we want to show the error response text in place of the video


    $.ajax({
        method: "GET",
        url: "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&key=AIzaSyA5Dt0C8yNe1okG218Mr8LtgIWezk9hzHI&q=" + music + " " + artist,
    })
        .done(function(result){
            console.log(result);
            $('.video-play').append(`<iframe class="embed-responsive-item" src=https://www.youtube.com/embed/${result.items[0].id.videoId} allowFullScreen title='youtube player' />`);
        })
}
