var app = app || {};

app.init = function(){
    $.ajaxSetup({
      contentType: "application/json"
    })
    var consolerObj = this.initConsoler();
    this.initHangman(consolerObj);
};

app.initConsoler = function(){
    var $terminal = $('<div/>').addClass("hangman").appendTo("body");
    var config = {
      autofocus: true,
      scrollArea: $terminal,
      promptHistory: true,
      promptLabel: '~ root$ '
    };
    return {
      consoler: $terminal.console(config),
      config: config
    }
}
app.initHangman = function(consolerObj){
    var commands = {
        game: 'hangman',
        start: 'start',
        exit: 'exit',
        fetch: 'give me a word',
        result: 'get result',
        submit: 'submit result',
        help: 'help'
    };
    var messages = {
        hello: "Wellcome to the hangman game!",
        help: "Type `" + commands.game + "' to learn more.\n",
        error: "Command not found. Type `" + commands.help + "` to see all commands.",
        commands: "Type `" + commands.start + "` to start game.\n" +
                  "Type `" + commands.fetch + "` to ask for a word from the server.\n" +
                  "Type `" + commands.result + "` to get the result.\n" +
                  "Type `" + commands.submit + "` to get your result at anytime after starting the game.\n"
    };

    var consoler = consolerObj.consoler;
    var instance = {
      url: "https://strikingly-hangman.herokuapp.com/game/on",
      step: -1,
      _action: ["startGame", "nextWord", "guessWord", "getResult", "submitResult"],
      action: function(){
        return this._action[this.step];
      }
    };

    $.extend(consolerObj.config, {
      commandValidate: function (line) {
          return line != "";
      },
      commandHandle: function (line, report) {
          if(consoler.command === false){
            return this.handleInput(line, report);
          }
          switch (line) {
              case commands.game:
                  return messages.commands;
              case commands.help:
                  return messages.help;
              case commands.clear:
                  controller.reset();
                  return '';
              case commands.start:
                  return this.startGame();
              case commands.fetch:
                  return this.fetch(line, report);
              case commands.result:
                  return this.result(line, report);
              case commands.submit:
                  return this.submit(line, report);
              default:
                  return messages.error;
          }

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
      cancelHandle: function(){
        consoler.promptLabel = '~ root$ ';
        consoler.command = true;
        consoler.report('');
      },
      startGame: function(line){
          if(instance.step > -1){
              return "You are already in the game."
          }
          consoler.command = false;
          instance.step = 0;

          return "Please type your playerId (you can get it from your inviation email. here your can type js_shi@126.com)";
      },
      handleInput: function(line, report){
          switch (instance.step) {
            case 0:
              this.inputStep1(line, report);
              break;
            case 2:
              this.inputStep2(line, report);
          }
      },
      fetch: function(line, report){
          instance.step = 1;
          $.ajax({
            url: instance.url,
            data: JSON.stringify({"sessionId": instance.sessionId, "action": instance.action()}),
            type: "post"
          }).then(function(data){
            data = data.data;
            instance.step = 2;
            consoler.command = false;
            consoler.promptLabel = "> ";
            (instance.words || (instance.words = [])).push(data.data);

            var msg = "word: " + data.word + "\n" +
                   "you have tried " + data.totalWordCount + "\n" +
                   "the number of wrong guess you already made on this word is " + data. wrongGuessCountOfCurrentWord + "\n" +
                   "please type your word.(you can type ctrl + c to exit)"
            report(msg);
          }).fail(function(){
            report("Please try again")
          })
      },
      inputStep1: function(line, report){
        instance.playerId = line;
        $.ajax({
          url: instance.url,
          data: JSON.stringify({"playerId": instance.playerId, "action": instance.action()}),
          type: "post"
        }).then(function(data){
          consoler.command = true;
          instance.step = 1;
          instance.sessionId = data.sessionId;

          report(data.message + ",please type `" + commands.fetch + "` to ask for a word from the server.\n")
        }).fail(function(d,e,m){
          report(m + " please type your playerId again.")
        })
      },
      inputStep2: function(line, report){
        $.ajax({
          url: instance.url,
          data: JSON.stringify({"sessionId": instance.sessionId, "action": instance.action(), "guess": line}),
          type: "post"
        }).then(function(data){
          data = data.data;

          var msg = "word: " + data.word + "\n" +
                 "you have tried " + data.totalWordCount + "\n" +
                 "the number of wrong guess you already made on this word is " + data. wrongGuessCountOfCurrentWord + "\n";
          report(msg + (data.word.indexOf("*") === -1 ? "you guess the word correctly" : ""));
        }).fail(function(d){
          report(d.responseJSON.message || "Please try it again.")
        })
      },
      result: function(line, report){
        instance.step = 3;
        $.ajax({
          url: instance.url,
          data: JSON.stringify({"sessionId": instance.sessionId, "action": instance.action()}),
          type: "post"
        }).then(function(data){
          data = data.data;
          var msg = "the total number of words you tried is " + data.totalWordCount + "\n" +
                    "the total number of words you guess correctly is " + data.correctWordCount + "\n" +
                    "the total number of Wrong guess you have made is" + data.totalWrongGuessCount + "\n" +
                    "your score is " + data.score;
          report(msg);
        }).fail(function(){
          report("Please try it again.")
        })
      },
      submit: function(line, report){
        instance.step = 4;

        $.ajax({
          url: instance.url,
          data: JSON.stringify({"sessionId": instance.sessionId, "action": instance.action()}),
          type: "post"
        }).then(function(data){
          report("GAME OVER");
        }).fail(function(){
          report("Please try it again.")
        })
      }
    })
}
