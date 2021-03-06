function setTweet(tweet) {
  setTweetText(tweet.tweetText, tweet.tokens);
  setTweetHeader(
    tweet.profilePic,
    tweet.author,
    tweet.username,
    tweet.verified
  );
  setTweetFooter(tweet.likeCount, tweet.createdAt);
  if (tweet.media) setTweetImage(tweet.media);
  else {
    disableImageControl();
    setHideTweetImage(true);
  }
}

function processText(text, tokens) {
  let processedText = text.replace(/\n/g, "<br />");
  for (let token of tokens) {
    processedText = processedText.replace(
      token,
      `<span class="special-text">${token}</span>`
    );
  }

  return processedText;
}

function setTweetText(text, tokens) {
  const processedText = processText(text, tokens);
  tweetWrapper.querySelector(
    "#tweet-text"
  ).innerHTML = `<p>${processedText}</p>`;
}

function setTweetHeader(profilePicUrl, author, username, isVerified = false) {
  setImageFromURL(profilePicUrl, tweetWrapper.querySelector("#profile-pic"));
  tweetWrapper.querySelector("#author").innerHTML = author;
  tweetWrapper.querySelector("#username").innerHTML = `@${username}`;

  if (isVerified) {
    tweetWrapper.querySelector(
      "#verified-badge-container"
    ).innerHTML = `<img src="../public/img/verified.png" alt="verified badge" />`;
  } else {
    tweetWrapper.querySelector("#verified-badge-container").innerHTML = "";
  }
}

function setTweetImage(imageUrl) {
  if (imageUrl)
    setImageFromURL(imageUrl, tweetWrapper.querySelector("#tweet-image"));
}

function setHideTweetImage(show) {
  if (show)
    tweetWrapper.querySelector("#tweet-image-container").style.display = "none";
  else
    tweetWrapper.querySelector("#tweet-image-container").style.display =
      "block";
}

function disableImageControl() {
  imageControl.removeEventListener("click", hideImageHandler);
  imageControl.querySelector(`input[name="image"]`).disabled = true;
}

function setTweetLiked(isLiked) {
  let imgSrc;
  let textColor;

  if (isLiked) {
    imgSrc = "../public/img/liked.png";
    textColor = "#ff0000";
  } else {
    imgSrc = "../public/img/normal.png";
    textColor = "#8899a6";
  }

  tweetWrapper.querySelector("#heart-img").src = imgSrc;
  tweetWrapper.querySelector("#like-count").style.color = textColor;
}

function abbreviateNumber(n) {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
}

function setTweetFooter(likeCount, utcString) {
  tweetWrapper.querySelector("#like-count").textContent = abbreviateNumber(
    likeCount
  );
  tweetWrapper.querySelector("#tweet-time").textContent = getLocaleDateString(
    utcString
  );
}

function setTheme(theme) {
  if (theme === "light") {
    tweetWrapper.classList.remove("dark");
    tweetWrapper.classList.add("light");
  } else {
    tweetWrapper.classList.remove("light");
    tweetWrapper.classList.add("dark");
  }
}

function setImageFromURL(url, targetImgElement) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const reader = new FileReader();
      reader.onload = function () {
        targetImgElement.src = this.result;
      };
      reader.readAsDataURL(blob);
    });
}

function setEnableControls(enable) {
  themeControl.querySelector(`input[name="theme"]`).disabled = !enable;
  likeControl.querySelector(`input[name="like"]`).disabled = !enable;
  imageControl.querySelector(`input[name="image"]`).disabled = !enable;
  downloadBtn.disabled = !enable;
}
