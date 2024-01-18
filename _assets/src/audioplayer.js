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
let maxSongs = 38; // Can probably get array length but whatever.
let playlistIndex = 0;

var audio; // The audio object.

// Some settings and flags.
let toggleAudio = false;
let audioMuted = true;

$(document).ready(function() 
{
    if (audioMuted == true) { $("#mute-button").attr("src", "/_assets/img/mutedbutton.png"); }
    else { $("#mute-button").attr("src", "/_assets/img/musicbutton.gif"); }

    initAudio(); // Load first song.

    if (audioMuted == true)
    {
        audio.addEventListener("canplaythrough", () => {
            document.getElementById("mute-button").addEventListener('click', () => {
                audio.play() // Play the audio on first click.
            }, { once: true });
        });
    }
    else
    {
        audio.autoplay = true; // Auto-play audio if muted is disabled by default.
    }
});

function initAudio()
{
    let link = "/_assets/audio/music/" + playlist[playlistIndex];

    audio = new Audio(); // Create new audio object.
    audio.autoplay = false;
    audio.muted = audioMuted;

    document.body.appendChild(audio); // Add reference to the document.
    
    // Load audio from link.
    audio.src = link;
    audio.load();

    $(audio).on("ended", function()
    {
        nextSong(); // Play next song when current audio ended.
    });
}

function nextSong()
{
    document.body.removeChild(audio); // Remove reference from document.

    audio.pause();

    // Delete audio object.
    audio.src = "";
    delete audio.srcObject;
    audio.srcObject = null;
    delete audio;
    audio = null;

    // Load next song.
    playlistIndex += 1;
    if (playlistIndex > maxSongs-1)
        playlistIndex = 0;
    initAudio();

    // Play it.
    audio.currentTime = 0;
    audio.play();
}

function prevSong()
{
    document.body.removeChild(audio); // Remove reference from document.

    audio.pause();

    // Delete audio object.
    audio.src = "";
    delete audio.srcObject;
    audio.srcObject = null;
    delete audio;
    audio = null;

    // Load previous song.
    playlistIndex -= 1;
    if (playlistIndex < 0)
        playlistIndex = maxSongs-1;
    initAudio();

    // Play it.
    audio.currentTime = 0;
    audio.play();
}

function muteAudio()
{
    toggleAudio = !toggleAudio;
    if (toggleAudio == false)
    {
        $("#mute-button").attr("src", "/_assets/img/mutedbutton.png");
        audioMuted = true;
    }
    else
    {
        $("#mute-button").attr("src", "/_assets/img/musicbutton.gif");
        audioMuted = false;
    }

    audio.muted = audioMuted;
}
