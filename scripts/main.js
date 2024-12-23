let video = document.querySelector("video");

//////////////////Settings////////////////////
let settingsButton = document.querySelector("#settingsButton");
let settingsBox = document.querySelector(".settings-box");
let settingsContainer = document.querySelector(".icon-container");
let speedSlider = document.querySelector("#speedSlider");
let sliderValue = document.getElementById('sliderValue');
let flag = false;

settingsButton.addEventListener("click", () => {
    if (!flag) {
        settingsButton.classList.remove("rotate-back");
        settingsButton.classList.add("rotate");
        settingsContainer.classList.add("bright");
        settingsBox.style.display = "flex";
    } else {
        settingsButton.classList.remove("rotate");
        settingsButton.classList.add("rotate-back");
        settingsContainer.classList.remove("bright");
        settingsBox.style.display = "none";
    }
    flag = !flag;
});

function speedSliderBackground(slider) {
    let value = (slider.value / slider.max) * 100;
    slider.style.background = `linear-gradient(to top, orange ${value}%, #ccc ${value}%)`;
}

speedSlider.addEventListener("input", () => {
    let speed = Number(speedSlider.value);
    sliderValue.textContent = speed.toFixed(1);
    video.playbackRate = speed;
    speedSliderBackground(speedSlider);
});


////////////////////Rewind Video////////////////////////
const rewindButton = document.querySelector("#rewaindBack");
const forwardButton = document.querySelector("#rewaindForward");

rewindButton.addEventListener("click", () => {
    video.currentTime = Math.max(0, video.currentTime - 10);
});

forwardButton.addEventListener("click", () => {
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
});


///////////////////Play-Pause Button/////////////////////
let playButton = document.getElementById('playButton');
playButton.addEventListener("click", () => {
    if (video.paused) {
        video.play();
        playButton.src = "img/pause.svg";
    } else {
        video.pause();
        playButton.src = "img/play.svg";
    }
});


//////////////////Full Button////////////////////////  
let fullscreenButton = document.querySelector('#fullButton');
fullscreenButton.addEventListener("click", () => {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (videoPlayer.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    } else if (videoPlayer.msRequestFullscreen) {
        video.msRequestFullscreen();
    }
});


//////////////////Change Video////////////////////////  
let prevButton = document.querySelector("#previous");
let nextButton = document.querySelector("#next");
let currentVideoIndex = 0;

async function fetchData() {
    let response = await fetch('data.json');
    let data = await response.json();

    function changeVideo(index) {
        currentVideoIndex = index;
        const currentVideo = data[currentVideoIndex];
        video.src = currentVideo.src;
        video.poster = currentVideo.poster;
        setTimeout(() => {
            video.play();
        }, 100);
    }

    nextButton.addEventListener("click", () => {
        currentVideoIndex = (currentVideoIndex + 1) % data.length;
        changeVideo(currentVideoIndex);
        changeVideo(currentVideoIndex);
        playButton.src = 'img/pause.svg';

    });

    prevButton.addEventListener("click", () => {
        currentVideoIndex = (currentVideoIndex - 1 + data.length) % data.length;
        changeVideo(currentVideoIndex);
        changeVideo(currentVideoIndex);
        playButton.src = 'img/pause.svg';
    });

    video.addEventListener("ended", () => {
        currentVideoIndex = (currentVideoIndex + 1) % data.length;
        changeVideo(currentVideoIndex);
    });
}

window.addEventListener("load", fetchData());


/////////////////Sound Control////////////////////
const volumeControl = document.querySelector("#volume");
let volumeButton = document.querySelector("#soundButton");

let lastVolume = 0.5;
video.volume = lastVolume;
volumeControl.value = lastVolume * 100;

window.addEventListener("load", () => updateSliderBackground(volumeControl));

volumeControl.addEventListener("input", function () {
    video.volume = volumeControl.value / 100;
    lastVolume = video.volume;
    updateSliderBackground(volumeControl);
});

volumeButton.addEventListener("click", () => {
    if (video.volume > 0) {
        lastVolume = video.volume;
        video.volume = 0;
        volumeControl.value = 0;
        volumeButton.src = "img/silence.svg";
        updateSliderBackground(volumeControl);
    } else {
        video.volume = lastVolume;
        volumeControl.value = lastVolume * 100;
        volumeButton.src = "img/volume.svg";
        updateSliderBackground(volumeControl);
    }
});


/////////////////Time Slider////////////////////
const timeSlider = document.querySelector("#timeSlider");
const currentTimeDisplay = document.querySelector("#currentTime");
const durationDisplay = document.querySelector("#duration");

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
}

video.addEventListener("loadedmetadata", () => {
    timeSlider.max = video.duration;
    durationDisplay.textContent = formatTime(video.duration);
    updateSliderBackground(timeSlider);
});

video.addEventListener("timeupdate", () => {
    timeSlider.value = video.currentTime;
    currentTimeDisplay.textContent = formatTime(video.currentTime);
    updateSliderBackground(timeSlider);
});

timeSlider.addEventListener("input", () => {
    video.currentTime = timeSlider.value;
    updateSliderBackground(timeSlider);
});

function updateSliderBackground(slider) {
    let value = (slider.value / slider.max) * 100;
    slider.style.background = `linear-gradient(to right, orange ${value}%, #ccc ${value}%)`;
}
