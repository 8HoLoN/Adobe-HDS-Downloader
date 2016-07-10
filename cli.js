;(function () {
    'use strict';

    function CLI($options, $handleUnknown) {
        $options = Object.prototype.toString.call($options) !== '[object Array]'?[]:$options;
        $handleUnknown = typeof $handleUnknown!=="boolean"?false:$handleUnknown;

        this.parent = null;
        this.$ACCEPTED = [];
        this.$params = [];

        this.init($options, $handleUnknown);
    }

    CLI.prototype.init = function($options, $handleUnknown){
        var $argc = process.argv.length;
        var $argv = process.argv;

        if( $options.length ){
            this.$ACCEPTED = $options;
        }

        // Parse params
        if( $argc > 1 ){
            var $paramSwitch = false;
            for( var $i = 1; $i < $argc; $i++ ){
                var $arg      = $argv[$i];
                var $isSwitch = /^-+/.test($arg);

                if ($isSwitch){
                    $arg = $arg.replace(/^-+/, '');
                }

                if ($paramSwitch && $isSwitch){
                    this.error("[param] expected after '$paramSwitch' switch (" + this.$ACCEPTED[1][$paramSwitch] + ')');
                }else if (!$paramSwitch && !$isSwitch){
                    if ($handleUnknown){
                        if(typeof this.$params['unknown']==='undefined')this.$params['unknown'] = [];
                        this.$params['unknown'].push($arg);
                    }else{
                        this.error("'$arg' is an invalid option, use --help to display valid switches.");
                    }
                }else if (!$paramSwitch && $isSwitch){
                    if (this.$params[$arg]){
                        this.error("'$arg' switch can't occur more than once");
                    }
                    this.$params[$arg] = true;
                    if( this.$ACCEPTED[1][$arg] ){
                        $paramSwitch = $arg;
                    }else if (!this.$ACCEPTED[0][$arg]){
                        this.error("there's no '$arg' switch, use --help to display all switches.");
                    }
                }else if ($paramSwitch && !$isSwitch){
                    this.$params[$paramSwitch] = $arg;
                    $paramSwitch               = false;
                }
            }
        }

        // Final check
        this.$params.map(($v, $k)=>{
            if ( this.$ACCEPTED[1][$k] && $v === true){
                this.error("[param] expected after '$k' switch (" + this.$ACCEPTED[1][$k] + ')');
            }
        });

    };

    CLI.prototype.displayHelp = function(){
        this.parent.LogInfo("You can use the script with following options:\n");
        Object.keys(this.$ACCEPTED[0]).map(($value, $key)=>{
            this.parent.LogInfo('--'+($value+'   ').slice(-10) +'\t\t'+this.$ACCEPTED[0][$value]);
            //this.parent.LogInfo(sprintf(" --%-17s %s", $value,  this.$ACCEPTED[0][$value]));
        });

        Object.keys(this.$ACCEPTED[1]).map(($value, $key)=>{
            this.parent.LogInfo('--'+($value+'   ').slice(-12)+"\t[param] "+this.$ACCEPTED[1][$value]);
            //this.parent.LogInfo(sprintf(" --%-9s%-8s %s", $value, " [param]", this.$ACCEPTED[1][$value]));
        });
    };

    CLI.prototype.error = function($msg){
        this.parent.LogError($msg);
    };

    CLI.prototype.getParam = function($name){
        if( this.$params[$name] )
            return this.$params[$name];
        else
            return false;
    };

    module.exports = CLI;

})();