// A lot just stolen from YTMND, lol.

// Create complex object wow, thanks YTMND.
(function()
{
    if (typeof THESTUFF == 'undefined') { THESTUFF = {}; }

    THESTUFF.debug = true;

    THESTUFF.loader = 
    {
        audio_context: null,
        audio_source: null,
        audio_xhr: null,
        audio_can_autoplay: false,
        
        fg_image_xhr: null,
        fg_image_handle: null,
        fg_image_blob: null,

        assets: {
            audio: { bytes_loaded: 0, bytes_total: 0, ready: false },
            fg_image: { bytes_loaded: 0, bytes_total: 0, ready: false }
        },

        codecs: {
            'ogg': 'audio/ogg; codecs="opus"',
            'mp3': 'audio/mpeg',
            'flac': 'audio/flac',
            'wav': 'audio/wav'
        },

        find_supported_audio: function()
        {
            try
            {
                var audio_tag = document.createElement('audio');
                var audio_obj = new Audio();
            }
            catch (error)
            {
                console.log('recieved error in find_supported_audio: ');
                console.log(error);

                var audio_tag = {};
                var audio_obj = {};
            }

            var supported = { 'tag': !!(audio_tag.canPlayType), 
                              'obj': !!(audio_obj.canPlayType) };
            
            for (var codec in THESTUFF.loader.codecs)
            {
                supported[codec] = false;
            }

            if (supported.obj == false)
            {
                return supported;
            }

            for (var codec in THESTUFF.loader.codecs)
            {
                supported[codec] = (audio_obj.canPlayType(THESTUFF.loader.codecs[codec]) != "");
                console.log('Testing audio codec for ' + codec + '[' + THESTUFF.loader.codecs[codec] + ']: ', audio_obj.canPlayType(THESTUFF.loader.codecs[codec]));
            }

            return supported;
        },

        loader_init: function()
        {
            console.log('inside html5 loader_init');

            this.audio_context = new (window.AudioContext || window.webkitAudioContext)();
            this.audio_source = this.audio_context.createBufferSource();
            this.audio_xhr = new XMLHttpRequest();
            this.audio_xhr.responseType = 'arraybuffer';

            if (this.audio_context.state == 'running')
            {
                this.audio_can_autoplay = true;
            }
            this.audio_context.suspend();

            this.audio_xhr.onprogress = (event) =>
            {
                if (this.assets.audio.bytes_total == 0)
                {
                    this.assets.audio.bytes_total = parseInt(event.total);
                }

                this.assets.audio.bytes_loaded = parseInt(event.loaded);
            };

            this.audio_xhr.onload = function(event)
            {
                if (THESTUFF.loader.assets.audio.bytes_loaded == THESTUFF.loader.assets.audio.bytes_total)
                {
                    console.log('audio fully loaded');
                }
                
                var audio_data = THESTUFF.loader.audio_xhr.response;

                THESTUFF.loader.audio_context.decodeAudioData(audio_data, (audio_buffer) =>
                {
                    console.log('Audio context decoded.');
                    THESTUFF.loader.audio_source.buffer = audio_buffer;
                    THESTUFF.loader.audio_source.connect(THESTUFF.loader.audio_context.destination);
                    THESTUFF.loader.audio_source.loop = true;
                    THESTUFF.loader.audio_context.suspend();
                    THESTUFF.loader.audio_source.start(0);
                    THESTUFF.loader.audio_context.suspend();
                    THESTUFF.loader.assets.audio.ready = true;
                    THESTUFF.player.audio_context = THESTUFF.loader.audio_context;
                    THESTUFF.player.audio_buffer = audio_buffer;
                });
            };

            this.fg_image_handle = new Image();
            this.fg_image_xhr = new XMLHttpRequest();
            this.fg_image_xhr.responseType = 'arraybuffer';

            this.fg_image_xhr.onprogress = function(event)
            {
                if (THESTUFF.loader.assets.fg_image.bytes_total == 0)
                {
                    THESTUFF.loader.assets.fg_image.bytes_total = parseInt(event.total);
                }

                THESTUFF.loader.assets.fg_image.bytes_loaded = parseInt(event.loaded);
            };

            this.fg_image_xhr.onload = (event) =>
            {
                this.fg_image_blob = new Blob([this.fg_image_xhr.response]);
                this.fg_image_handle.src = window.URL.createObjectURL(this.fg_image_blob);
                this.assets.fg_image.ready = true;
                console.log('fg_image fully loaded');
            };

            console.log('Begining asset GETs');

            this.audio_xhr.open('GET', THESTUFF.site.data.site.sound.url, true);
            this.audio_xhr.send();
            this.fg_image_xhr.open('GET', THESTUFF.site.data.site.foreground.url, true);
            this.fg_image_xhr.send();
        },

        are_assets_loaded: function()
        {
            if (THESTUFF.loader.assets.fg_image.ready == true && THESTUFF.loader.assets.audio.ready == true)
            {
                console.log('All assets are loaded and ready to use!');
                return true;
            }
            else
            {
                return false;
            }
        },

        get_loading_status: function()
        {
            var bytes_loaded = THESTUFF.loader.assets.fg_image.bytes_loaded + THESTUFF.loader.assets.audio.bytes_loaded;
            var bytes_total = THESTUFF.loader.assets.fg_image.bytes_total + THESTUFF.loader.assets.audio.bytes_total;
            var percent_loaded = Math.round(parseInt((bytes_loaded / bytes_total) * 100));

            return { bytes_loaded: isNaN(bytes_loaded) ? 0 : bytes_loaded, 
                     bytes_total: isNaN(bytes_total) ? 0 : bytes_total, 
                     percent_loaded: isNaN(percent_loaded) ? 0 : percent_loaded };
        }

    };

    THESTUFF.player = 
    {
        audio_context: null,
        audio_buffer: null,

        start_sound: function()
        {
            console.dir(this.audio_context);
            if (this.audio_context.state == 'running')
            {
                return false;
            }

            console.log('Starting sound via audio_context.resume()');
            this.audio_context.resume();
        },

        stop_sound : function()
        {
            if (this.audio_context.state == 'suspended')
            {
                return false;
            }

            console.log('Pausing audio via audio_context.suspend(), and creating a new audio_context at frame 0');

            this.audio_context.suspend();
            this.audio_context.close();

            this.audio_context = new (window.AudioContext || window.webkitAudioContext)();
            audio_source = this.audio_context.createBufferSource();
            audio_source.buffer = this.audio_buffer;
            audio_source.connect(this.audio_context.destination);
            audio_source.loop = true;
            audio_source.start(0);

            return true;
        }

    };

    THESTUFF.site_template = function()
    {
        this.ui = {};
        this.loader = {};
        this.player = {};
        this.data = {};
        this.layout = {};
        this.foreground =
        {
            handle:     $('<div id="foreground_image">'),
            img:        $('<img id="foreground_img" alt="">'),
            loader:     new Image(),
            loaded:     false
        };

        this.is_playing = false;

        this.ui.restart_button_rotation = 0;

        this.ui.hide_loader = function()
        {
            $('#player_div, #loader').remove();
        };

        this.ui.show_loader = function()
        {
            $('#loader').show();
        };

        this.ui.set_stars_to_percent = function(percent)
        {
            if (typeof this.star_animation_timing == 'undefined')
            {
                this.star_animation_timing =
                {
                    star_11_s         :  9, star_23_m         : 15, star_4_s          : 19, star_14_m         : 24,
                    star_17_m         : 27, star_22_m         : 33, star_15_m         : 35, star_5_s          : 39,
                    star_25_l         : 43, star_12_s         : 49, star_2_s          : 51, star_28_s_notrail : 52,
                    star_18_m         : 53, star_26_s_notrail : 54, star_6_s          : 55, star_13_s         : 57,
                    star_24_l         : 57, star_21_m         : 63, star_29_s_notrail : 64, star_7_s          : 64,
                    star_1_s          : 66, star_10_s         : 67, star_3_s          : 68, star_16_m         : 70,
                    star_19_m         : 75, star_27_s_notrail : 78, star_20_m         : 82, star_8_s          : 86,
                };
            }
            
            this.svg = document.getElementById('logo_svg').contentDocument;
            if (this.svg == null || typeof this.svg.getElementById != 'function')
            {
                return false;
            }

            if (this.all_stars_shown == 1)
            {
                return false;
            }

            for (var id in this.star_animation_timing)
            {
                if (this.star_animation_timing[id] <= percent)
                {
                    var star = this.svg.getElementById(id);
                    star.style.animationPlayState = 'running';
                    star.style.animationDelay = Math.floor(this.star_animation_timing[id]) + 'ms';

                    if (id == 'star_8_s' && star != null)
                    {
                        this.all_stars_shown = 1;

                        $(star).one('animationend', () => 
                        {
                            console.log('animation ended on the final star!');

                            this.svg.getElementById('flare_top').classList.add('activated');
                            this.svg.getElementById('flare_bottom').classList.add('activated');

                            this.svg.getElementById('flare_bottom').addEventListener('animationend', (event) => 
                            {
                                if (event.animationName != 'flare_scale') 
                                {
                                    return false;
                                }
            
                                this.svg.getElementById('full_logo').classList.add('activated');
                                this.svg.getElementById('full_logo').addEventListener('animationend', () => 
                                {
                                    this.svg.getElementById('play_button').classList.add('activated');
                                    $('#loading_status .numerical').html('');
                                });
                            });
                        });
                    }
                }
            }
        };

        this.ui.set_loader_percent = function(loading_data)
        {
            if (typeof this.current_percent == 'undefined')
            {
                this.current_percent = 0;
            }

            var svg = document.getElementById('logo_svg').contentDocument;

            if (typeof this.logo_animation_finished == 'undefined' && svg.getElementById('ytmnd_logo') != null && svg.getElementById('ytmnd_logo') != null)
            {
                this.logo_animation_finished = false;

                svg.getElementById('ytmnd_logo').addEventListener('animationend', () =>
                {
                    console.log('ANIMATION ENDED');
                    this.logo_animation_finished = true;
                    this.set_stars_to_percent(this.current_percent);
                });
            }

            this.set_stars_to_percent(loading_data.percent_loaded);
            this.current_percent = loading_data.percent_loaded;

            $('#loading_status .textual').html('Loading site junk...');
            $('#loading_status .numerical').html(this.current_percent + '% - ' + Math.trunc(loading_data.bytes_loaded/1000) + 'kB / ' + Math.trunc(loading_data.bytes_total/1000) + 'kb');
        };

        this.layout.placements =
        {
            't': 'top',
            'm': 'center',
            'b': 'bottom',
            'l': 'left',
            'c': 'center',
            'r': 'right'
        };

        this.layout.image_css = function(placement, url)
        {
            var css = 
            {
                'background-image': 'url("' + url + '")',
                'background-position': '',
                'background-repeat': 'no-repeat'
            };

            if (placement == 'tile') { css['background-repeat'] = 'repeat'; }
            else
            {
                css['background-position'] = this.placements[placement.substr(0, 1)] + ' ';
                css['background-position'] += this.placements[placement.substr(1, 1)];
            }

            return css;
        }

        this.parse_site_data = function(site_data)
        {
            console.log('Site data loaded');

            this.data = site_data;

            var html5_audio = false;
            var html5_support_matrix = THESTUFF.loader.find_supported_audio();
            if (typeof html5_support_matrix[this.data.site.sound.type] != 'undefined' && html5_support_matrix[this.data.site.sound.type] == true)
            {
                html5_audio = this.data.site.sound;
            }
            else if (typeof this.data.site.sound.alternatives != 'undefined')
            {
                for (var codec in this.data.site.sound.alternatives)
                {
                    if (typeof html5_support_matrix[codec] != 'undefined' && html5_support_matrix[codec] == true)
                    {
                        html5_audio = this.data.site.sound.alternatives[codec];
                        break;
                    }
                }
            }

            if (html5_audio == false)
            {
                alert("Audio can't play.");
                return false;
            }

            console.log('calling loader_init();');

            this.loader = THESTUFF.loader;
            this.player = THESTUFF.player;

            this.loader.loader_init();

            this.ui.show_loader();

            console.log('Starting asset wait...');

            this.wait_for_assets();

        };

        this.wait_for_assets = function()
        {
            if (this.loader.are_assets_loaded() == false)
            {
                this.ui.set_loader_percent(this.loader.get_loading_status());
                setTimeout(function() { THESTUFF.site.wait_for_assets(); }, 50);
                return false;
            }

            this.ui.set_loader_percent(this.loader.get_loading_status());
            console.log('wait_for_assets() ended in main');

            this.init_ytmnd();

        };

        this.init_ytmnd = function(callback)
        {
            var fg_image_css = THESTUFF.site.layout.image_css(THESTUFF.site.data.site.foreground.placement, this.loader.fg_image_handle.src);
            THESTUFF.site.foreground.handle.css(fg_image_css);

            console.log('Assets all loaded.');

            if (this.loader.audio_can_autoplay == true)
            {
                console.log("Try autoplay.");
                THESTUFF.site.ui.show_ytmnd();
                THESTUFF.site.player.start_sound();
            }
            else
            {
                console.log("Couldn't autoplay.");
                var play_link = function(event)
                {
                    console.log("Play link clicked!");
                    event.preventDefault();
                    THESTUFF.site.ui.show_ytmnd();
                    THESTUFF.site.player.start_sound();

                    THESTUFF.site.loader.audio_can_autoplay = true;
                    $('#loader').html('<h1><a href="#">Loading..</a></h1>');
                };

                $('#loading_status .textual').html('Waiting for your dumbass to hit play...');
                $('#loader, #play_link').click(play_link);
            }
        };

        this.ui.show_ytmnd = function(data)
        {
            $('body').append(THESTUFF.site.foreground.handle);

            if ($('#foreground_img').length > 0)
            {
                $('#foreground_img').remove();
            }

            if (THESTUFF.site.is_playing == false)
            {
                $('#restart_button').css('visibility', 'visible');

                console.log('HIDING LOADER');
                this.hide_loader();

                $('#restart_button').click(THESTUFF.site.restart);
            }

            if ($(document).height() > THESTUFF.site.foreground.handle.height())
            {
                console.log('SETTING HEIGHT TO:', $(document).height());
                THESTUFF.site.foreground.handle.css('min-height', $(document).height() + 'px');
                THESTUFF.site.foreground.handle.css('height', '100%');
            }

            THESTUFF.site.is_playing = true;
        };

        this.hide_loader = function()
        {
            this.ui.hide_loader();

            try 
            {
                this.player.js_hide_player();
            }
            catch (player_error)
            {
                alert(player_error);
            }
        };

        this.restart = function(event)
        {
            THESTUFF.site.ui.restart_button_rotation += 90;
            if (THESTUFF.site.ui.restart_button_rotation == 360)
            {
                THESTUFF.site.ui.restart_button_rotation = 0;
            }

            $(this).css('-webkit-transform', 'rotate(' + THESTUFF.site.ui.restart_button_rotation + 'deg)');
            $(this).css('-moz-transform', 'rotate(' + THESTUFF.site.ui.restart_button_rotation + 'deg)');

            THESTUFF.site.player.stop_sound();

            // Restart gif.
            window.URL.revokeObjectURL(THESTUFF.loader.fg_image_handle.src);
            THESTUFF.loader.fg_image_handle.src = window.URL.createObjectURL(THESTUFF.loader.fg_image_blob);

            setTimeout(() => { THESTUFF.site.init_ytmnd(); }, 20);
        };
    }

    THESTUFF.site = new THESTUFF.site_template();

})();

// On SVG load.
window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('logo_svg').addEventListener('load', function() 
    {
        console.log('Logo SVG load()');
        document.getElementById('logo_svg').contentDocument.lastElementChild.style.offsetTop; // Apparently forces SVG to calculate css stuff.

        // Do site load.
        if (typeof THESTUFF == 'undefined')
        {
            THESTUFF = {};
            alert('ERROR: 1');
            return;
        }

        THESTUFF.site = new THESTUFF.site_template();

        THESTUFF.site.data = 
        {
            site: 
            {
                foreground:
                {
                    type: "image",
                    url: "/awesome/assets/img/awesome.gif",
                    placement: "tile"
                },
                sound:
                {
                    type: "mp3",
                    in_delay: 0,
                    out_delay: 0,
                    url: "/awesome/assets/audio/awesome.mp3"
                }
            }
        };

        document.getElementById('logo_svg').contentDocument.getElementById('ytmnd_logo').addEventListener('animationend', () =>
        {
            console.log('Logo SVG title animation ended. Starting data fetch..');
            THESTUFF.site.parse_site_data(THESTUFF.site.data);
        });
    });
});

// Do this when site loads.
$(document).ready(function() 
{
    console.log('Document loaded.');

    $("#corner").click(function(event)
    {
        // Open info bar.
        var window_width = $(window).width();

        if (window_width >= 610 && window_width < 1180) 
        {
            var max_width = (window_width - 150) + 'px';

            $('#site_info').css({'width': max_width, 'max-width': max_width, 'min-width': max_width});
            $('#site_info_right').hide();
        }
        else 
        {
            $('#site_info').css({'width': '1180px', 'max-width': '1180px', 'min-width': '1180px'});
            $('#site_info_right').show();
        }

        $('#info_bar').css('visibility', 'visible').show();
        $('#corner').hide();
        event.preventDefault();
    });

    $('#info_bar_closer').click(function(event)
    {
        // Close info bar.
        $('#info_bar').hide();
        $('#corner').show();
        event.preventDefault();
    });

});

// Change color on thing in info bar.
function MouseOverNSW(which)
{
    if (which !== false)
    {
        $('#sb_wsc_img_0').attr('src', '/awesome/assets/img/starbar/' + 'nsw_'+which+'.png');
    }
}
function MouseOutNSW()
{
    $('#sb_wsc_img_0').attr('src', '/awesome/assets/img/starbar/' + 'nsw_check.png');
}
