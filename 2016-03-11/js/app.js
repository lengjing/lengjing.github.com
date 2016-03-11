var app = app || {};

app.init = function(){
    this.initConsole();
};

app.initConsole = function(){
    var commands = {
        help: 'help',
        clear: 'clear',
        exit: 'exit',
        man: 'man cookies',
        start: 'start game'
    };
    var helloMessage = "this is helloMessage";
    var helpMessage = "Type `" + commands.man + "' to learn more.\nUse `" + commands.exit + "' to close.";
    var errorMessage = "Command not found. Type `" + commands.help + "` to see all commands.";

    var $terminal = $('<div/>').addClass("hangman").appendTo("body");

    var controller = $terminal.console({
        autofocus: true,
        scrollArea: $terminal,
        promptHistory: true,
        promptLabel: '~ root$ ',
        welcomeMessage: helloMessage + "\n"+ helpMessage,

        onEsc: function () {
            bannerInstance.closeHandler.call(bannersRotator.instances[0]);
        },

        commandValidate: function (line) {
            return line != "";
        },

        commandHandle: function (line) {
            switch (line) {
                case (commands.man):
                    this.expandFrame();
                    return '\nA cookie is a small piece of data sent by a website to your browser. It helps the website to remember information about your visit, like your country and other settings. That can make your next visit easier and the site more useful to you.\n\nWe use cookies on some (but not all) pages to deliver personalized content or to tailor our information offerings or responses according to the way you use the site, and/or your current context on the site. We do not use cookies to gather or transmit any personally identifiable information about you.\n\nRead our <a href="/company/privacy.html" class="cookies-notify__link">privacy policy</a> for a detailed explanation on how we protect your privacy in our use of cookies and other information.\n \n';

                case (commands.help):
                    return helpMessage;

                case (commands.clear):
                    $terminal.css('height', '30%');
                    controller.reset();
                    return '';

                case (commands.exit):
                    this.onEsc();
                    return line;

                case commands.start:
                    this.startGame();
                    return line;
                default:
                    return errorMessage;
            }
        },

        charInsertTrigger: function (keycode, line) {
            return (keycode < 48 || keycode > 57);
        },

        completeHandle: function (prefix) {
            var complete = [];

            for (var command in commands) {
                if (commands.hasOwnProperty(command)) {

                    var item = commands[command];

                    if (item.lastIndexOf(prefix, 0) === 0) {
                        complete.push(item.substring(prefix.length));
                    }
                }
            }

            return complete;
        },

        expandFrame: function () {
            $terminal.css('height', '430px');
        },
        startGame: function(){

        }
    });

    return controller;
}

