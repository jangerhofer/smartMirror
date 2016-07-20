greetings = ["Nope. Fuck you.  I'm done.  I won't take any more orders.  Don't even try it.", "Yuck.  Couldn't you stand in front of a different mirror? Take that ugly mug elsewhere.", "Howdy do?", "Please don't break me -- put on a mask.", "Why, hello!", "How are you?"]

var recognition = new webkitSpeechRecognition()
recognition.continuous = true
recognition.interimResults = true;

var command;
recognition.onresult = function(event) {
  event = event.results[event.resultIndex]
  command = event[0].transcript.trim()
  console.log("Unsure of : ", command);
  confidence = event[0].confidence
  isFinal = event.isFinal
  var msg;
  if (isFinal && contains(command, "hello")) {
    console.log(command)
    selectedGreeting = greetings[Math.floor(Math.random() * greetings.length)]
    console.log(selectedGreeting);
    msg = new SpeechSynthesisUtterance(selectedGreeting)
    speakText(msg)
  }
  if (isFinal && contains(command, "goodbye")) {
    console.log(command)
    msg = new SpeechSynthesisUtterance("Fuck off.")
    speakText(msg)
  }
  /*if (command.trim() == "goodbye mirror") {
    msg = new SpeechSynthesisUtterance('Fuck off, louse!');
    speakText(msg)
  }
  if (command.trim() == "mirror mirror on the wall") {
    msg = new SpeechSynthesisUtterance('Certainly not you.');
    speakText(msg)
  }
  */
}

recognition.onerror = function(event) {
  console.log("Error in: ", event);
};

recognition.onend = function() {
    console.log("DONE LISTENING TO YOU");
  };
recognition.start();

function speakText(toSpeech) {
  window.speechSynthesis.speak(toSpeech);
}

function contains(reference, test) {
  result = reference.indexOf(test)
  if (result > -1) {
    return true
  } else {
    return false
  }
}
