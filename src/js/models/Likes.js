export default class Likes {
  constructor(){
    this.likes = [];
  }

  addLike(id, title, author, img){
    const like = { id, title, author, img};
    this.likes.push(like);
    this.persistData();
    return like;

    // Persist the data in localStorage

  }

  deleteLike(id){
    const index = this.likes.findIndex(el => el.id === id);
    //[2,4,8] splice(1,1) -> returns 4, origignal array is [2, 8]
    //[2,4,8] slice(1,1) -> returns 4, origignal array is [2,4, 8]

    this.likes.splice(index, 1); //deletes the item from the arary

    // Persist the data in localStorage
        this.persistData();

  }

  isLiked(id){
    return this.likes.findIndex(el =>el.id === id) !== -1;
  }

  getNumLikes(){
    return this.likes.length;
  }

  persistData(){
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  readStorage(){
    const storage = JSON.parse(localStorage.getItem('likes'));
    //restoring likes from localstorage
    if (storage) this.likes = storage;
  }
}
