var c = document.createElement.bind(document)
var q = document.querySelector.bind(document)
var audio = new Audio()
audio.volume = 0.1

function percent(a, b) {
    return (100 * a) / b;
}
var percentof = (a,b) => {return a/100*b}
axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    .then(function (response) {
        console.log(response);
        response.data.items.forEach(function (list) {
            var div1 = c('div')
            var div2 = c('div')
            var div3 = c('div')
            var div4 = c('div')
            var img1 = c('img')
            var p1 = c('p')
            var br = c('br')
            img1.src = list.track.album.images[0].url
            div3.append(list.track.name)
            div3.append(br)
            div3.append(list.track.artists[0].name)
            var x
            if (dayjs(list.played_at).format('YYYYMMDD') == dayjs().format('YYYYMMDD')) {
                x = dayjs(list.played_at).format('HH:mm')
            } else {
                x = dayjs(list.played_at).format('ddd HH:mm')
            }
            p1.innerText = x
            div2.addEventListener("click", function () {
                location.href = list.track.uri
            })
            div3.addEventListener("click", function () {
                audio.src = list.track.preview_url
                q('#audio').style.backgroundImage = 'url(' + list.track.album.images[0]
                    .url + ')'
                audio.play()
            })
            div2.append(img1)
            div4.append(p1)
            div1.append(div2)
            div1.append(div3)
            div1.append(div4)
            document.body.append(div1)
        })
    })
    .catch(function (error) {
        console.log(error);
        if (error.response.status === 401) {
            location.replace(
                'https://accounts.spotify.com/authorize?client_id=a0150944943f4156a50f4ebd03b88466&response_type=token&redirect_uri=https%3A%2F%2Fhexadi.github.io%2Fspotifyrecentplay%2Fcallback&scope=user-read-recently-played'
            )
        }
    })
    .then(function () {
        var div = c('div')
        var div1 = c('div')
        var div2 = c('div')
        var a = c("a")
        var i = c("i")
        i.classList.add('fas')
        i.classList.add('fa-play')
        div1.style.width = "100%"
        div1.style.height = "5px"
        div1.style.bottom = 0
        div1.style.backgroundColor = "white"
        div1.style.position = "fixed"
        div1.style.margin = 0
        div1.style.border = 0
        div2.style.width = 0
        div2.style.height = "5px"
        div2.style.bottom = 0
        div2.style.backgroundColor = "red"
        div2.style.position = "fixed"
        div2.style.margin = 0
        div2.style.transition = "width 0.25s linear"
        div2.id = 'progress'
        div.id = 'audio'
        div.classList.add('none')
        div1.classList.add('none')
        div2.classList.remove('none')
        div.append(i)
        div.addEventListener("click", function () {
            if (audio.paused == true) {
                audio.play()
            } else {
                audio.pause()
            }
        })

        div1.addEventListener("click", function () {
            audio.currentTime = percentof(percent(event.clientX,window.innerWidth),audio.duration)
        })

        div1.append(div2)
        audio.addEventListener("play", function () {
            div.classList.remove('none')
            i.classList.add('fa-pause')
            div.classList.add('spin')
            i.classList.add('upspin')
            i.classList.remove('fa-play')
            div1.classList.remove('none')
            div2.classList.remove('none')
        })

        audio.addEventListener("timeupdate",function () {
            console.log(percent(audio.currentTime, audio.duration))
            div2.style.width = percent(audio.currentTime, audio.duration) + '%'
        })

        audio.addEventListener("pause", function () {
            i.classList.remove('fa-pause')
            div.classList.remove('spin')
            i.classList.remove('upspin')
            i.classList.add('fa-play')
        })
        audio.addEventListener("ended", function () {
            div.classList.add('none')
            div1.classList.add('none')
            div2.classList.add('none')
        })
        a.append('กลับไปที่หน้าแรก')
        a.classList.add('button')
        a.addEventListener("click", function () {
            location.replace('../')
        })
        document.body.append(a)
        document.body.append(div)
        document.body.append(div1)
    });
