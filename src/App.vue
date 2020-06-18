<template>
  <v-app>
    <v-app-bar app>
      <div class="text-h5">Clima</div>
    </v-app-bar>
    <v-main class="mt-4">
      <v-container>
        <v-autocomplete
          v-model="select"
          :items="cities"
          :search-input.sync="search"
          label="Ciudades"
          placeholder="Buscar ciudad"
          prepend-icon="mdi-map-marker"
          item-text="name"
          hide-no-data
          return-object
          no-filter
          @change="handleChange"
        ></v-autocomplete>
        <v-card v-if="select" :loading="loading">
          <v-card-title v-if="weather">El clima en {{weather.name}}, {{weather.sys.country}}</v-card-title>
          <v-card-title v-if="!weather">Cargando...</v-card-title>
          <v-card-subtitle
            v-if="weather"
            class="pb-0"
          >{{getCityTime}}, {{weather.weather[0].description}}</v-card-subtitle>
          <v-card-text v-if="weather">
            <v-row align="center">
              <v-col cols="auto">
                <v-icon size="100">mdi-weather-{{$icons[weather.weather[0].icon]}}</v-icon>
              </v-col>
              <v-col class="display-4" cols="auto">{{parseInt(weather.main.temp)}}&deg;C</v-col>
              <v-col>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Viento</v-list-item-title>
                    <v-list-item-subtitle>
                      {{(weather.wind.speed * 3.6).toFixed(1)}} km/h
                      <v-icon
                        size="20"
                        :style="{ transform: 'rotate('+ weather.wind.deg + 'deg)'}"
                      >mdi-send</v-icon>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Humedad</v-list-item-title>
                    <v-list-item-subtitle>{{(weather.main.humidity)}}%</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Nubosidad</v-list-item-title>
                    <v-list-item-subtitle>{{(weather.clouds.all)}}%</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Presión atmosférica</v-list-item-title>
                    <v-list-item-subtitle>{{(weather.main.pressure)}} hPa</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => {
    return {
      city: "",
      allCities: [],
      cities: [],
      search: null,
      select: null,
      weather: null,
      loading: null,
      debounceTimeout: null
    };
  },

  mounted() {
    import('./city.list.min.json').then(({default: json}) => { 	
      this.allCities = json;
    });
    //   this.allCities = json.map(city => {
    //     const name = city.name + ", " + city.country;
    //     return name
    //   })
    //   console.log(JSON.stringify( [...new Set(this.allCities)]))
    // }); 
    if (navigator.geolocation)
      this.cities.unshift({ name: "Usar ubicación actual", id: -1 });
  },
  watch: {
    search(value) {
      if (value && value.length >= 1 && value !== this.select)
        this.filterCities(value);
      else { 
        this.cities = [];
        if (navigator.geolocation)
          this.cities.unshift({ name: "Usar ubicación actual", id: -1 });
      }
    }
  },
  methods: {
    handleChange() {
      this.loading = true;
      this.weather = null;
      if (typeof this.select === 'object' && this.select.id === -1) {
        navigator.geolocation.getCurrentPosition(pos => {
          this.getCurrentWeather(pos.coords.latitude, pos.coords.longitude);
        });
      } else
        this.getCurrentWeather(this.select);
    },
    filterCities(value) {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.cities = this.allCities
          .filter(
            city => city.toLowerCase().indexOf(value.toLowerCase()) == 0
          )
          .sort((a, b) =>
            a.localeCompare(b, undefined, { ignorePunctuation: true })
          )
          .slice(0, 8)
        if (navigator.geolocation)
          this.cities.unshift({ name: "Usar ubicación actual", id: -1 });
      }, 500);

    },
    getCurrentWeather(lat, lon) {
      fetch(
        lon && typeof lat === 'number' ? 
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=es&units=metric&appid=891832eb61fff63d300fe56e9a0f50c9`
        : `https://api.openweathermap.org/data/2.5/weather?q=${lat}&lang=es&units=metric&appid=891832eb61fff63d300fe56e9a0f50c9`
      )
        .then(res => {
          return res.json();
        })
        .then(res => {
          console.log(res);
          this.weather = res;
          this.loading = null;
        });
    }
  },
  computed: {
    getCityTime() {
      const date = new Date(Date.now() + this.weather.timezone * 1000);
      return (
        date
          .getUTCHours()
          .toString()
          .padStart(1, "0") +
        ":" +
        date
          .getUTCMinutes()
          .toString()
          .padStart(1, "0")
      );
    }
  }
};
</script>

<style>
.cities-list {
  list-style: none;
  text-align: left;
  margin: 5px 0 0 0;
  padding: 0;
  max-height: 150px;
  overflow: auto;
}

.cities-list__item {
  font-size: 1.1rem;
  padding: 1px;
}

.cities-list__item:hover {
  cursor: pointer;
}
</style>
