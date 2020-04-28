const { RESTDataSource } = require('apollo-datasource-rest');

class QaukeAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://earthquake.usgs.gov/fdsnws/event/1';
  }

  async getAllQuakes() {
    const query = `query?format=geojson&starttime=2014-01-01&endtime=2014-01-02`;
    const response = await this.get(query);
    return Array.isArray(response.features)
      ? response.features.map((Quake) => this.QuakeReducer(Quake))
      : [];
  }

  QuakeReducer(quake) {
    const monthName = (idx) => {
      const monthLegend = {
        0: 'January',
        1: 'Feburary',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December',
      };
      return monthLegend[idx];
    };

    // const quake = quakeData.features[0];
    const date = new Date(quake.properties.time);
    const year = date.getFullYear();
    const month = monthName(date.getMonth());
    const day = date.getDate();
    const hour = date.getHours();
    const minute =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const seconds = date.getSeconds();
    const dateString = `${month} ${day} , ${year} at ${hour}:${minute} and ${seconds}
    seconds`;
    const timestamp = quake.properties.time;

    return {
      magnitude: quake.properties.mag,
      location: quake.properties.place,
      when: dateString,
      cursor: timestamp,
      id: quake.id,
    };
  }
}

module.exports = QaukeAPI;
