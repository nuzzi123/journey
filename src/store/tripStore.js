import { observable, action } from "mobx";
import axios from 'axios';
// let GoogleImages = require('google-images');

class TripStore {

    @observable trip = null;
    @observable trips = [];
    @observable tripstosearch = [];
    @observable showpopupaddtrip = false;
    @observable marker = {}
    @observable currCheckpoint = null
    @observable ifexists = false
    @observable initialCenter = null
    @observable userId = localStorage.getItem('userId')
    @observable tripId = localStorage.getItem('tripId')
    @observable logged = true;
    @observable img = ''

    @action setId = (id) => {
        localStorage.setItem('userId', id)
    }

    @action login = () => {
        this.logged = true
    }

    @action logout = () => {
        this.userId = '';
        localStorage.setItem('userId', '');
        this.trips = [];
        this.trip = null;
        this.tripstosearch = [];
        this.logged = false
    }

    @action setTripId = (id) => {
        localStorage.setItem('tripId', id)
    }

    @action setMarker = (marker) => {
        this.marker = marker
    }

    @action getTripsInLogin = async (id) => {
        let trips = await axios.get('http://localhost:1000/' + id + '/trips')
        this.setTripsValue(trips.data.trips)
        console.log(this.trips)
        this.tripstosearch = [...this.trips];
        this.logged = true
    }

    @action getTrips = async () => {
        // if (id === '') {
        let trips = await axios.get('http://localhost:1000/' + this.userId + '/trips')
        this.setTripsValue(trips.data.trips)
        this.tripstosearch = [...this.trips];
        // }
        // else {
        //     let trips = await axios.get('http://localhost:1000/' + id + '/trips')
        //     this.setTripsValue(trips.data.trips)
        //     this.tripstosearch = [...this.trips];
        // }
    }

    @action setTripsValue = (trips) => {
        this.trips = trips
    }

    @action setCheckPoint = async (id) => {
        let checkpoint = await axios.get('http://localhost:1000/checkpoints/' + id)
        this.currCheckpoint = checkpoint.data
    } //???? why doesnt it get an id in showcheckpoint????


    @action setTrip = async (id) => {
        let data = await axios.get('http://localhost:1000/trips/' + id);
        this.trip = data.data
    }

    @action changeshowpopupaddtrip = () => {
        this.showpopupaddtrip = !this.showpopupaddtrip
    }

    @action setLogin = async (username, password) => {
        let trips = await axios.get('http://localhost:1000/users/' + username + '/' + password)
        return trips
    }

    AddUser = async (newUser) => {
        await axios.post('http://localhost:1000/users', newUser)
    }

    Addtrip = async (title, description, startDate, endDate, imageurl) => {
        let trip = await axios.post('http://localhost:1000/' + this.userId + '/trips', { title: title, description: description, startDate: startDate, endDate: endDate, imageurl: imageurl })
        this.getTrips()
    }

    @action addCheckPoint = async (newCheckPoint) => {
        try {
            let data = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + newCheckPoint.data.adress + '&key=AIzaSyA-NDun_On5Bx3TerMVbAaC8jfU7jotv8M')
            let newcp = await axios.post('http://localhost:1000/checkpoints', { object: newCheckPoint, coo: data.data.results[0].geometry.location });
            console.log(newcp)
            let updatedTrip = await axios.get('http://localhost:1000/trips/' + this.trip._id)
            this.trip = updatedTrip.data
        }
        catch (err) {
            console.error(err)
        }
    }

    @action addInitialCenter = async (adress) => {
        let data = await axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + adress + '&key=AIzaSyA-NDun_On5Bx3TerMVbAaC8jfU7jotv8M')
        this.initialCenter = data.data.results[0].geometry.location
    }

    @action searchtrip = (searchword) => {
        if (this.searchword !== "") {
            let filterdarr = this.trips.filter((trip) => {
                return trip.title.toString().toLowerCase().includes(searchword.toLowerCase())
            })
            this.tripstosearch = filterdarr
        }
    }

    getIcon = async (searchIconName) => {
        return await axios.get(`https://www.googleapis.com/customsearch/v1?key=AIzaSyA-NDun_On5Bx3TerMVbAaC8jfU7jotv8M&cx=014991769965957097369:idopkmpkkbo&q=${searchIconName}&?searchType=Image&defaultToImageSearch=true&safe=active`)
        // this.img = imgJson.data.items[0].pagemap.imageobject[0].thumbnailurl;
        // console.log(this.img)
    }
}

const Store = new TripStore();

export default Store;