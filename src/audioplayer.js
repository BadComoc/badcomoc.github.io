const playlist = [
    "/audio/watch.mp3",
    "/audio/sanctuary.mp3",
    "/audio/bonus.mp3",
    "/audio/characterselect.mp3",
    "/audio/alliwant.mp3",
    "/audio/wolverine.mp3",
    "/audio/myownsummer.mp3",
    "/audio/fighterselect.mp3",
    "/audio/snakeeater.mp3"
];
let maxSongs = 8;
let playlistIndex = 0;

let toggleAudio = false;
let audioMuted = true;
var audio;

$(document).ready(function() 
{
    initAudio();

    audio.addEventListener("canplaythrough", () => {
        document.getElementById("mute-button").addEventListener('click', () => {
            audio.play()
        }, { once: true });
    });
});

function initAudio()
{
    audio = new Audio(playlist[playlistIndex]);
    audio.autoplay = false;
    audio.muted = audioMuted;
    document.body.appendChild(audio);
    //console.log("Init Audio " + playlist[playlistIndex]);
    $(audio).on("ended", function() // Can't use nextSong() because it causes infinite recursion for some fucking reason?
    {
        document.body.removeChild(audio);
        audio.pause();
        playlistIndex += 1;
        if (playlistIndex > maxSongs)
            playlistIndex = 0;
        //console.log("Next Song " + playlist[playlistIndex]);
        initAudio();
        audio.currentTime = 0;
        audio.play();
    });
}

function nextSong()
{
    document.body.removeChild(audio);
    audio.pause();
    playlistIndex += 1;
    if (playlistIndex > maxSongs)
        playlistIndex = 0;
    //console.log("Next Song " + playlist[playlistIndex]);
    initAudio();
    audio.currentTime = 0;
    audio.play();
}

function muteAudio()
{
    toggleAudio = !toggleAudio;
    if (toggleAudio == false)
    {
        $("#mute-button").attr("src", "/img/mutedbutton.png");
        audioMuted = true;
    }
    else
    {
        $("#mute-button").attr("src", "/img/musicbutton.gif");
        audioMuted = false;
    }
    audio.muted = audioMuted;
}
