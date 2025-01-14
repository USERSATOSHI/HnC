let map;

const getLoc = new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(
        (e) => {
            res(e);
        },
        (e) => {
            rej("Location Access Denied With Error: " + e.message);
        },
    );
});

var script = document.createElement("script");
document.addEventListener("DOMContentLoaded", async () => {
    script.src = `https://maps.googleapis.com/maps/api/js?callback=initMap&libraries=places&v=weekly`;
    script.async = true;

    const login = document.getElementById("login");

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        login.innerHTML = `${user.username}
            <span class="material-symbols-outlined" id="loginicon">
              login
            </span>`;
    }

    window.initMap = async () => {
        //@ts-ignore
        const { Map } = await google.maps.importLibrary("maps");
        //const directionRenderer = new google.maps.directionsRenderer();
        //const directionService = new google.maps.directionsService();
        const id = new URLSearchParams(window.location.search).get("id");
        const [b, hospitalinfo] = id.split(":");

        const data = await fetch(
            "https://pancham1305-proxy.deno.dev/",
            {
                method: "POST",
                body: JSON.stringify({ hospitalinfo, b,endpoint:"/api/hospital" }),
                headers: {
                    "Content-Type": "application/json",
                },
            },
        ).then((r) => r.json());
        const arr = data.split(":");
        console.log(arr);
        const [lat, lng] = arr[1].split(",").map((x) => parseFloat(x));
        map = new Map(document.getElementById("map"), {
            center: { lat, lng },
            zoom: 20,
        });
        const infoWindow = new google.maps.InfoWindow({
            content: `
        Name: ${arr[0].split(",")[0]} <br>
        Address: ${arr[5]} <br>
        Rating: ${arr[3]} <br>
        Timings: ${arr[4].split(",").join(" to ")} <br>
        `,
            disableAutoPan: true,
        });

        const marker = new google.maps.Marker({
            position: { lat, lng },
            label: "H",
        });

        const points = await getLoc;
        let latt = points.coords.latitude;
        let long = points.coords.longitude;
        const marker2 = new google.maps.Marker({
            position: { lat: latt, lng: long },
            label: "You",
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
        marker.setMap(map);
        marker2.setMap(map);

        // calculateDistanceAndDisplay(directionService, directionRenderer, {lat,lng}, {lat:latt,lng:long})

        // directionRenderer.setMap( map );
    };

    document.head.appendChild(script);
});

function calculateDistanceAndDisplay(
    directionService,
    directionRenderer,
    origin,
    destination,
) {
    const mode = "drive";
    directionService.route(
        {
            origin: {
                latLng: {
                    lat: origin.lat,
                    lng: origin.lng,
                },
            },
            destination: {
                latLng: {
                    lat: destination.lat,
                    lng: destination.lng,
                },
            },
            travelMode: mode,
        },
        (response, status) => {
            if (status === "OK") {
                directionRenderer.setDirections(response);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        },
    );
}

const login = document.getElementById("login");

const user = JSON.parse(localStorage.getItem("user"));
if (user) {
    login.innerHTML = `${user.username}
            <span class="material-symbols-outlined" id="loginicon">
              login
            </span>`;
}
