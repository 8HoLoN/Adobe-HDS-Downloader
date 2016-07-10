// last source update 28 may 2016

const CLI = require('./cli.js');

;(function (_g) {
    function AdobeHDSDownloader(){
        this.AUDIO = 0x08;
        this.VIDEO = 0x09;
        this.AKAMAI_ENC_AUDIO = 0x0A;
        this.AKAMAI_ENC_VIDEO = 0x0B;
        this.SCRIPT_DATA = 0x12;
        this.FRAME_TYPE_INFO = 0x05;
        this.CODEC_ID_AVC = 0x07;
        this.CODEC_ID_AAC = 0x0A;
        this.AVC_SEQUENCE_HEADER = 0x00;
        this.AAC_SEQUENCE_HEADER = 0x00;
        this.AVC_NALU = 0x01;
        this.AVC_SEQUENCE_END = 0x02;
        this.FRAMEFIX_STEP = 40;
        this.INVALID_TIMESTAMP = -1;
        this.STOP_PROCESSING = 2;

        this.init();
    }

    AdobeHDSDownloader.prototype.init = function() {
        console.log('init');
        this.run();
    };

    AdobeHDSDownloader.prototype.run = function(){
        var $format       = " %-8s%-16s%-16s%-8s";
        var $baseFilename = "";
        var $debug        = false;
        var $duration     = 0;
        var $delete       = false;
        var $fileCount    = 1;
        var $fileExt      = ".f4f";
        var $filesize     = 0;
        var $fragCount    = 0;
        var $fragStart    = 0;
        var $manifest     = "";
        var $maxSpeed     = 0;
        var $metadata     = true;
        var $outDir       = "";
        var $outFile      = "";
        var $play         = false;
        var $quiet        = false;
        var $referrer     = "";
        var $rename       = false;
        var $showHeader   = true;
        var $start        = 0;
        var $update       = false;

        // Set large enough memory limit
        //ini_set("memory_limit", "1024M");

        // Initialize command line processing
        var $options = [
            {
                'help': 'displays this help',
                'debug': 'show debug output',
                'delete': 'delete fragments after processing',
                'fproxy': 'force proxy for downloading of fragments',
                'play': 'dump stream to stdout for piping to media player',
                'rename': 'rename fragments sequentially before processing',
                'update': 'update the script to current git version'
            },
            {
                'adkey': 'akamai session decryption key',
                'auth': 'authentication string for fragment requests',
                'duration': 'stop recording after specified number of seconds',
                'filesize': 'split output file in chunks of specified size (MB)',
                'fragments': 'base filename for fragments',
                'fixwindow': 'timestamp gap between frames to consider as timeshift',
                'manifest': 'manifest file for downloading of fragments',
                'maxspeed': 'maximum bandwidth consumption (KB) for fragment downloading',
                'outdir': 'destination folder for output file',
                'outfile': 'filename to use for output file',
                'parallel': 'number of fragments to download simultaneously',
                'proxy': 'proxy for downloading of manifest',
                'quality': 'selected quality level (low|medium|high) or exact bitrate',
                'referrer': 'Referer to use for emulation of browser requests',
                'start': 'start from specified fragment',
                'useragent': 'User-Agent to use for emulation of browser requests'
            }
        ];

        console.log('run');
        var $cli     = new CLI($options, true);
        $cli.parent  = this;

        // Check if STDOUT is available
        if( $cli.getParam('play') ){
            $play       = true;
            $quiet      = true;
            $showHeader = false;
        }

        // // Check for required extensions
        // $required_extensions = array(
        //     "bcmath",
        //     "curl",
        //     "SimpleXML"
        // );
        // $missing_extensions  = array_diff($required_extensions, get_loaded_extensions());
        // if ($missing_extensions)
        // {
        //     $msg = "You have to install and enable the following extension(s) to continue: '" . implode("', '", $missing_extensions) . "'";
        //     LogError($msg);
        // }

        // Display help
        if( $cli.getParam('help') ){
            $cli.displayHelp();
            process.exit(0);
        }

        // Initialize classes
        $cc  = new cURL();
        $ad  = new AkamaiDecryptor();
        $f4f = new F4F();

    };

    AdobeHDSDownloader.prototype.LogInfo = function($msg, $progress){
        $progress = typeof $progress!=="boolean"?false:$progress;
        if( this.$showHeader ){
            this.ShowHeader();
            this.$showHeader = false;
        }
        if( !this.$quiet ){
            this.PrintLine($msg, $progress);
        }
    };

    AdobeHDSDownloader.prototype.PrintLine = function($msg, $progress){
        $progress = typeof $progress!=="boolean"?false:$progress;
        if( $msg ){
            //console.log("\r%-79s\r", "");
            //printf("\r%-79s\r", "");
            if( $progress ){
                console.log("%s", $msg);
                //printf("%s\r", $msg);
            }else{
                console.log("%s", $msg);
                //printf("%s\n", $msg);
            }
        }else{
            console.log("\n");
            //printf("\n");
        }
    };

    _g.AdobeHDSDownloader = new AdobeHDSDownloader();

})(this);

