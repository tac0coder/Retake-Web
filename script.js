video = document.getElementById("vid");
select1 = document.getElementById("a")
select2 = document.getElementById("b")
devices = []
videonum = 1

blobs = []

function start() {
	if (window.stream) {
		window.stream.getTracks().forEach((i) => {
			i.stop()
		})
	} else {
		navigator.mediaDevices.enumerateDevices()
			.then((s) => {
				s.forEach((a) => {
					devices.push(a);
					if (a.kind == "audioinput") {
						select2.innerHTML += '<option value=' + a.deviceId + '>' + a.label + '</option>'
					} else if (a.kind == "videoinput") {
						select1.innerHTML += '<option value=' + a.deviceId + '>' + a.label + '</option>'
					}
				})
			})
	}


	navigator.mediaDevices.getUserMedia({
			video: {
				deviceId: select1.value
			},
			audio: {
				deviceId: select2.value
			}
		})
		.then((s) => {
			window.stream = s;
			video.srcObject = s;
			recorder = new MediaRecorder(s);

			video.play();
			recorder.start();
		})
}


function stopsave() {
	recorder.ondataavailable = function (e) {
		blobs.push(e.data);
		blobs[blobs.length - 1].type = 'video/mp4'
	};
	recorder.stop()
	start()
}

function stopdel() {
	recorder.stop()
	start()
}

function save() {
	for (i in blobs) {
		var url = URL.createObjectURL(blobs[i]);
		var a = document.createElement('a');
		document.body.appendChild(a);
		a.style = 'display: none';
		a.href = url;
		a.download = `vid${videonum}.mp4`;
		a.click();
		a.outerHTML = ''
		window.URL.revokeObjectURL(url);
		videonum += 1
	}
}

window.onload = start
select1.onchange = start
select2.onchange = start