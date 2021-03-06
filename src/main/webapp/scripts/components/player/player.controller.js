/**
 * Created by xavipandis on 28/3/16.
 */
angular.module('soundxtreamappApp')
    .controller('playerPlaylistController', ['$scope','Principal','$rootScope','Song','Auth','$state',
        '$cookies', '$http', '$q', '$cookies', 'Track_count',
        function ($scope,Principal,$rootScope,Song,Auth,$state,$cookies, $http, $q, $cookies, Track_count) {

            var audioElemGlob = {};

            var volumeCookie = $cookies.get("volume");

            var myEl = $('.volume-button' );

            var opened = false;

            myEl.click(function (event) {

                if(opened){
                    $('#volume-slider').animate({
                        height: "0px"
                    })
                    opened = false;
                }else{
                    $('#volume-slider').animate({
                        height: "120px"
                    })
                    opened = true;
                }
                event.stopPropagation()
            });

            $('.ui-slider-handle').draggable();

            $(window).click(function(event){
                var target = $(event.target);
                if(target.not('.volume-button') && target.not('.volume-button') && target.not('#volume-slider')){
                    $('#volume-slider').animate({
                        height: "0px"
                    })
                    opened = false;
                }
            })

            $("#volume").slider({
                orientation: "vertical",
                min: 0,
                max: 100,
                value: 0,
                range: "min",
                create: function() {
                    if(volumeCookie == undefined){
                        $( this ).slider( "value", 100 );
                        mediaPlayer.volume = 1;
                    }
                    else{
                        $( this ).slider( "value", volumeCookie );
                        mediaPlayer.volume = volumeCookie / 100;
                    }
                },
                slide: function(event, ui) {
                    mediaPlayer.volume = ui.value / 100;
                    $cookies.put("volume",ui.value);
                }
            });

            this.audioPlaylist = [];

            var playlistCollection = [];

            this.numberPlaylist = 0;

            this.playlistCurrent = null;
            Principal.identity().then(function(account) {
                $rootScope.account = account;
                $scope.isAuthenticated = Principal.isAuthenticated;
            });

            $scope.logout = function () {
                this.audioPlaylist = [];
                mediaPlayer.currentTrack = null;
                mediaPlayer.playlistCurrent = null;
                mediaPlayer.pause();
                Auth.logout();
                $rootScope.account = {};
                $state.go('login');
            }

            this.showPlaylist = false;

            this.addSongAll = function (audioElements,mediaPlayer,indexSong,playingFrom) {
                var audioPlaylist = [];
                this.playlistCurrent = playingFrom;

                for(var k = 0; k < audioElements.length;k++){
                    var audioElement = audioElements[k].song;

                    var song = {
                        artist: audioElement.user.login,
                        displayName: audioElement.name,
                        image: audioElement.artwork,
                        src: audioElement.url,
                        title: audioElement.name,
                        type: 'audio/mpeg',
                        url: audioElement.url,
                        id: audioElement.id,
                        access_url: audioElement.access_url
                    };

                    audioPlaylist.push(angular.copy(song));

                }

                this.audioPlaylist = audioPlaylist;

                setTimeout(function () {
                    mediaPlayer.currentTrack = indexSong+1;
                    mediaPlayer.play(indexSong);
                    var song = {};
                }, 200);

            };

            $rootScope.$on("next-track", function(e, res){
                Track_count.countPlay({id: res});
            });

            $rootScope.$on("prev-track", function(e, res){
                Track_count.countPlay({id: res});
            });

            $rootScope.$on("play-track", function(e, res){
                Track_count.countPlay({id: res});
            });

            function countPlay(audioElements, index) {
                var id = audioElements[index].song.id;
                Track_count.countPlay({id: id});
            }

            this.addSong = function (audioElement,mediaPlayer) {
                this.audioPlaylist = [];
                var song = {
                    artist: audioElement.user.login,
                    displayName: audioElement.name,
                    image: audioElement.artwork,
                    src: audioElement.url,
                    title: audioElement.name,
                    type: 'audio/mpeg',
                    url: audioElement.url,
                    id: audioElement.id,
                    access_url: audioElement.access_url
                };

                this.audioPlaylist.push(angular.copy(song));

                setTimeout(function () {
                    mediaPlayer.play();
                    var song = {};
                }, 200);
            };

            this.addSongAndPlay = function(audioElement,mediaPlayer){
                var songWave = audioElement;
                var song = {
                    artist: audioElement.user.login,
                    displayName: audioElement.name,
                    image: audioElement.artwork,
                    src: audioElement.url,
                    title: audioElement.name,
                    type: 'audio/mpeg',
                    url: audioElement.url,
                    id: audioElement.id,
                    access_url: audioElement.access_url
                };

                this.audioPlaylist.push(angular.copy(song));

                setTimeout(function () {
                    settings.media = songWave.url;
                    initializeAudio();

                    var song = {};
                }, 200);
            };

            this.playPauseSong = function(mediaPlayer){
                mediaPlayer.playPause();
            };

            this.addSongs = function(playlist){
                var audioElement = {};
                var songs = {};

                for(var k = 0; k < playlist.songs.length; k++){
                    audioElement = playlist.songs[k];
                    var song = {
                        artist: audioElement.user.login,
                        displayName: audioElement.name,
                        image: audioElement.artwork,
                        src: audioElement.url,
                        title: audioElement.name,
                        type: 'audio/mpeg',
                        url: audioElement.url,
                        id: audioElement.id,
                        access_url: audioElement.access_url
                    };
                    songs.push(angular.copy(song));
                }

                this.audioPlaylist = songs;
            };

            this.addSongsAndPlay = function(playlist,mediaPlayer,playingFrom){
                var audioElement = {};
                var songs = [];
                this.playlistCurrent = playingFrom;

                for(var k = 0; k < playlist.songs.length; k++){
                    audioElement = playlist.songs[k];
                    var song = {
                        artist: audioElement.user.login,
                        displayName: audioElement.name,
                        image: audioElement.artwork,
                        src: audioElement.url,
                        title: audioElement.name,
                        type: 'audio/mpeg',
                        url: audioElement.url,
                        id: audioElement.id,
                        access_url: audioElement.access_url
                    };
                    songs.push(angular.copy(song));
                }

                this.audioPlaylist = songs;

                setTimeout(function () {
                    mediaPlayer.play();
                    var song = {};
                }, 200);
            };

            this.playTrackFromPlaylist = function(playlist,mediaPlayer,indexSong,playingFrom){
                var audioElement = {};
                var songs = [];
                this.playlistCurrent = playingFrom;
                for(var k = 0; k < playlist.songs.length; k++){
                    audioElement = playlist.songs[k];
                    var song = {
                        artist: audioElement.user.login,
                        displayName: audioElement.name,
                        image: audioElement.artwork,
                        src: audioElement.url,
                        title: audioElement.name,
                        type: 'audio/mpeg',
                        url: audioElement.url,
                        id: audioElement.id,
                        access_url: audioElement.access_url
                    };
                    songs.push(angular.copy(song));
                }

                this.audioPlaylist = songs;

                setTimeout(function () {
                    mediaPlayer.currentTrack = indexSong+1;
                    mediaPlayer.play(indexSong);
                    var song = {};
                }, 200);
            };

            /*this.playSetOfPlaylists = function(playlists, mediaPlayer, selectedPlaylist, playingFrom){
                console.log("PLAYLISTS : " + playlists);
                console.log("selectedPlaylist : " + selectedPlaylist);
                console.log("playingFrom : " + playingFrom);

                var playlistsCollection = [];
                this.playlistCurrent = playingFrom;
                this.numberPlaylist = selectedPlaylist;

                playlists.forEach(function(playlistDTO){
                    playlistsCollection.push(playlistDTO.playlist)
                });

                playlistCollection = playlistsCollection;

                console.log(playlistCollection);

                var songs = [];

                var playlistSelected = playlistsCollection[selectedPlaylist];

                playlistSelected.songs.forEach(function(track){
                    var song = {
                        artist: track.user.login,
                        displayName: track.name,
                        image: track.artwork,
                        src: track.url,
                        title: track.name,
                        type: 'audio/mpeg',
                        url: track.url,
                        id: track.id,
                        access_url: track.access_url
                    };
                    songs.push(angular.copy(song));
                });

                this.audioPlaylist = songs;

                setTimeout(function () {
                    mediaPlayer.play();
                    var song = {};
                }, 200);

            }*/

            /*$scope.$watch("mediaPlayer.currentTrack", function(value){
                if($scope.mediaPlayer.currentTrack == $scope.mediaPlayer.tracks || $scope.mediaPlayer.currentTrack > $scope.mediaPlayer.tracks){
                    if(playlistCollection.length > 1){
                        if(playlistCollection.length > this.numberPlaylist){
                            var playlistSelected = playlistCollection[this.numberPlaylist+1];

                            playlistSelected.songs.forEach(function(track){
                                var song = {
                                    artist: track.user.login,
                                    displayName: track.name,
                                    image: track.artwork,
                                    src: track.url,
                                    title: track.name,
                                    type: 'audio/mpeg',
                                    url: track.url,
                                    id: track.id,
                                    access_url: track.access_url
                                };
                                songs.push(angular.copy(song));
                            });

                            this.audioPlaylist = songs;

                            setTimeout(function () {
                                mediaPlayer.play();
                                var song = {};
                            }, 200);
                        }
                    }
                }
                if($scope.mediaPlayer.currentTrack < $scope.mediaPlayer.tracks){
                    console.log("HAS NEXT");
                }
                else{

                }
            });*/

            this.removeSong = function (index) {
                this.audioPlaylist.splice(index, 1);
            };

            this.dropSong = function (audioElement, index) {
                this.audioPlaylist.splice(index, 0, angular.copy(audioElement));
            };

            this.getSongImage = function (currentTrack) {
                if (typeof this.audioPlaylist[currentTrack - 1] != "undefined") {
                    return this.audioPlaylist[currentTrack - 1].image;
                }
            };

            this.getSongAccess = function(currentTrack){
                if (typeof this.audioPlaylist[currentTrack - 1] != "undefined") {
                    return this.audioPlaylist[currentTrack - 1].access_url;
                }
            };

            this.getSongArtist = function (currentTrack) {
                if (typeof this.audioPlaylist[currentTrack - 1] != "undefined") {
                    return this.audioPlaylist[currentTrack - 1].artist;
                }
            };

            this.getSongName = function (currentTrack) {
                if (typeof this.audioPlaylist[currentTrack - 1] != "undefined") {
                    return this.audioPlaylist[currentTrack - 1].title;
                }
            };

            /*this.getPlaylist = function(currentPlaylist){
                if (typeof playlistCollection[currentPlaylist - 1] != "undefined") {
                    console.log(playlistCollection[currentPlaylist - 1]);
                    return playlistCollection[currentPlaylist - 1].id;
                }
            }*/

            this.getSongId = function(currentTrack){
                if (typeof this.audioPlaylist[currentTrack - 1] != "undefined") {
                    return this.audioPlaylist[currentTrack - 1].id;
                }
            };

            this.seekPercentage = function ($event) {
                var percentage = ($event.offsetX / $event.target.offsetWidth);
                if (percentage <= 1) {
                    return percentage;
                } else {
                    return 0;
                }
            };

            this.seek = function(event){
                var percentage = (event.offsetX / event.currentTarget.offsetWidth);
                if (percentage <= 1) {
                    return percentage;
                } else {
                    return 0;
                }
            };

            var timeDrag = false; /* Drag status */
            $('.timeline').mousedown(function (e) {
                timeDrag = true;
            });

            $('.timeline').click(function(e){
                seekDrag(e);
            });

            $(document).mouseup(function (e) {
                if (timeDrag) {
                    timeDrag = false;
                    mediaPlayer.play();
                }
            });

            $(document).mousemove(function (e) {
                if (timeDrag) {
                    e.preventDefault();

                    var pointer = $('.timeline-pointer');

                    if(parseInt(pointer.css("left")) <= 0 ){
                        pointer.css("left","0px");
                        return false;
                    }

                    seekDrag(e);
                    mediaPlayer.pause();
                }
            });
            $('.timeline').mousemove(function (e) {
                if (timeDrag) {
                    e.preventDefault();
                    seekDrag(e);
                    mediaPlayer.pause();
                }
            });
            $(document).mouseleave(function(){
                if (timeDrag) {
                    timeDrag = false;
                    mediaPlayer.play();
                }
            });

            function seekDrag(e){
                var offsetTimeline = $('.timeline-current').offset().left;
                var width = $('.timeline-full').width();
                var pointer = $('.timeline-pointer');

                if(parseInt($('.timeline-current').width()) < parseInt(width)){
                    pointer.css("left", (e.pageX - offsetTimeline));
                    $('.timeline-current').css("width", (e.pageX - offsetTimeline));
                }
                else{
                    pointer.css("left", (width));
                    $('.timeline-current').css("width", width);
                }

                if(parseInt($('.timeline-current').width()) < 0 ){
                    $('.timeline-current').css("width","0px");
                }

                var percentage = ((e.pageX - offsetTimeline) / width);
                if(percentage > 1.0){
                    percentage = 0;
                }
                $scope.mediaPlayer.seek($scope.mediaPlayer.duration * percentage);
            }
    }]);
