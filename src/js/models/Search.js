import axios from 'axios';

export default class Search{
  constructor(query){
    this.query = query;
  }


  async getResults(query){
    const proxy = 'https://cors-anywhere.herokuapp.com/';
      const key= 'eac3065116f6124d527c88c7e6a54a2a';
      try{
      const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = res.data.recipes;
      //console.log(this.result);
    }catch (error){
      console.log(error); 
    }

  }

}
