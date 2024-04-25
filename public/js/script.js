const teletitle = document.getElementById("teleTitle");
const teleLogo = document.getElementById("teleLogo");
const teleContent = document.getElementById("teleContent");
const television = document.getElementById("tvImg");
const channels = document.querySelectorAll("button.channel");
const channelPlus = document.querySelector(".channel-plus");
const channelMinus = document.querySelector(".channel-minus");
const newsBtns = document.querySelectorAll(".news")

//connect met een controller als deze gedetecteerd wordt
if (typeof window !== 'undefined') {
  window.addEventListener("gamepadconnected", (e) => {
    controllerConnect(e);


    function controllerConnect(e) {
      var gp = navigator.getGamepads()[e.gamepad.index];
      console.log("Een " + gp.id + " is gevonden met " + gp.buttons.length + " buttons.")
    }

    function checkStatus() {
      const gamepads = navigator.getGamepads();
      //Grote if/else statement om te detecteren welk knopje ingedrukt is en wat hij gaat doen
      if (gamepads[0].buttons[1].pressed) {
        console.log("mtv");
      } else if (gamepads[0].buttons[0].pressed) {
        console.log("nickelodeon");
      } else if (gamepads[0].buttons[2].pressed) {
        console.log("netflix");
      } else if (gamepads[0].buttons[3].pressed) {
        console.log("teletext");
        teleKnop();
      } else if (gamepads[0].buttons[4].pressed) {
        console.log("naarlinks");
        backChannel();

      } else if (gamepads[0].buttons[5].pressed) {
        console.log("naarrechts");
        frontChannel();
      }
    }
    //zorgen dat dit elke 0,6sec gechecked wordt
    setInterval(checkStatus, 600);
  });
}

//de eventlisteners zijn er zodat ik met de gamepad ook de functie kan aanroepen
channelPlus.addEventListener("click", () => {
  frontChannel();
});
function frontChannel() {
  //zoekt eerst de actieve channel, als er geen actieve channel is, is de default channel netflix
  let activeChannel = document.querySelector(".channel.active");
  let channelName;

  if (!activeChannel) {
    channelName = "netflix";
  } else {
    channelName = activeChannel.className.split(" ")[1];
  }
  fetch(`/change_show/next/${channelName}`).then((response) => response.json()).then((data) => {
    console.log(data);
    television.src = data.gifUrl;
  })
};

channelMinus.addEventListener("click", () => {
  backChannel();
});

function backChannel() {
  let activeChannel = document.querySelector(".channel.active");
  let channelName;

  if (!activeChannel) {
    channelName = "netflix";
  } else {
    channelName = activeChannel.className.split(" ")[1];
  }

  fetch(`/change_show/previous/${channelName}`).then((response) => response.json()).then((data) => {
    console.log(data);

    television.src = data.gifUrl;
  });
}

//oude code
// channelMinus.addEventListener("click", () => {
//   updateChannelValue(-1);
// });

// function updateChannelValue(value) {
//   // make sure the channelvalue is no more than 50 and no less than 0, if it drops below 0, go to 50

//   if (channelValue + value > 49) {
//     channelValue = 0;
//   } else if (channelValue + value < 0) {
//     channelValue = 49;
//   } else {
//     channelValue += value;
//   }

//   television.src = dataList[channelValue].images.fixed_height.url;
// }


//deze eventlistener zorgt ervoor dat als je op een channel klikt, de gif van die channel wordt geladen
channels.forEach((channel) => {
  channel.addEventListener("click", () => {

    const selectedChannel = channel.className.split(" ")[1];
    television.classList.remove("off");
    teletekst.classList.add("off");
    fetch(`/new_gif/${selectedChannel}`).then((response) => response.json()).then((data) => {
      console.log(data);
      television.src = data.gifUrl;
      document.getElementById("channelForm").classList.remove("active");

      channels.forEach((channel) => {
        channel.classList.remove("active");
      });

      channel.classList.add("active");
    }).catch((error) => {
      console.error(error);
    });

  });
});
//deze haalt met de nieuws API 3 nieuwsberichten op en zet ze in de teletekst div, op basis van de kleur krijg je een van de drie artikelen die opgehaald kunnen worden.
newsBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const buttonId = button.id;

    fetch(`/news/${buttonId}`).then((response) =>
      response.json()).then((data) => {
      console.log(data);

      teletitle.innerHTML = data.news.title;
      teleLogo.innerHTML = data.news.source;
      teleContent.innerHTML = data.news.description;

    })
  })
})

//deze functie heet nog power, maar activeert nu de teletekst en haalt dan de eerste artikel op
document.getElementById("power").addEventListener("click", () => {
  teleKnop();
});

function teleKnop() {
  const buttonId = 0;
  fetch(`/news/${buttonId}`).then((response) =>
    response.json()).then((data) => {
    console.log(data);
    television.classList.toggle("off");
    teletekst.classList.toggle("off");
    teletitle.innerHTML = data.news.title;
    teleLogo.innerHTML = data.news.source;
    teleContent.innerHTML = data.news.description;
  })
};


//deze eventlistener zorgt ervoor dat als je op de submit knop drukt, een gif wordt opgehaald op basis van wat je getypt hebt.
document.getElementById("channelForm").addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("submidwadawt");
  const selectedChannel = document.getElementById("customChannel").value;
  document.getElementById("channelForm").classList.add(selectedChannel);

  fetch(`/new_gif/${selectedChannel}`).then((response) => response.json()).then((data) => {
    console.log(data);
    television.src = data.gifUrl;

  });
  channels.forEach((channel) => {
    channel.classList.remove("active");
  });
  document.getElementById("channelForm").classList.add("active");

});