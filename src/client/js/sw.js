let deferredPrompt;

window.addEventListener("beforeinstallprompt", function (e) {
  console.log("beforeinstallprompt Event fired");
  e.preventDefault();

  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  return false;
});

// 특정 버튼 클릭 시 설치 시작
btnSave.addEventListener("click", function () {
  if (deferredPrompt !== undefined) {
    // The user has had a postive interaction with our app and Chrome
    // has tried to prompt previously, so let's show the prompt.
    deferredPrompt.prompt();

    // Follow what the user has done with the prompt.
    deferredPrompt.userChoice.then(function (choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome == "dismissed") {
        console.log("User cancelled home screen install");
      } else {
        console.log("User added to home screen");
      }

      // We no longer need the prompt.  Clear it up.
      deferredPrompt = null;
    });
  }
});
