const playlist = [
    "watch.mp3",
    "fighterselect.mp3",
    "maskeddedede.mp3",
    "guile.mp3",
    "vampirekiller.mp3",
    "bloodytears.mp3",
    "megamanx.mp3",
    "sanctuary.mp3",
    "mariopaint.mp3",
    "alliwant.mp3",
    "bonus.mp3",
    "wolverine.mp3",
    "characterselect.mp3",
    "gourmetrace.mp3",
    "snakeeater.mp3",
    "butterfly.mp3",
    "mutecity.mp3",
    "bigblue.mp3",
    "safeandsound.mp3",
    "theimpressionthatiget.mp3",
    "drwily.mp3",
    "feelgoodinc.mp3",
    "myownsummer.mp3",
    "betteroffalone.mp3",
    "freakonaleash.mp3",
    "scarymonstersandnicesprites.mp3",
    "rainingblood.mp3",
	"porcelain.mp3",
    "cityescape.mp3",
    "rainbowroad.mp3",
    "liveandlearn.mp3",
    "igotafeeling.mp3",
    "beach.mp3",
    "carelesswhisper.mp3",
    "monty.mp3",
    "schism.mp3",
    "onewingedangel.mp3",
    "throughthefireandtheflames.mp3"
];
let maxSongs = 38;
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
    let link = "/audio/music/" + playlist[playlistIndex];
    audio = new Audio(link);
    audio.autoplay = false;
    audio.muted = audioMuted;
    document.body.appendChild(audio);
    $(audio).on("ended", function() // Can't use nextSong() because it causes infinite recursion for some fucking reason?
    {
        document.body.removeChild(audio);
        audio.pause();
        playlistIndex += 1;
        if (playlistIndex > maxSongs-1)
            playlistIndex = 0;
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
    if (playlistIndex > maxSongs-1)
        playlistIndex = 0;
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
