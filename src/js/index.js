//eac3065116f6124d527c88c7e6a54a2a
// http://food2fork.com/api/search
import Search from './models/Search';
import * as searchView from './views/SearchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';
import Recipe from './models/Recipe';
import List from './models/list';
import Likes from './models/likes';
/** Global state of the app
* Search object
* Current recipe object
* Shopping list object
* Liked Recipes
**/

const state = {};



//SEARCH CONTROLLER
const controlSearch = async () =>{
  //1 get query from view
const query = searchView.getInput();



  if (query) {
    //2 new search object and add to state
    state.search = new Search(query);

    //3 preparing UI for
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try{

    //4 search for recipes
    await state.search.getResults();

    //5 render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);
  } catch(err) {console.log("search error");
                clearLoader();}

  }

}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();

});


elements.searchResPages.addEventListener('click', e =>{
  const btn = e.target.closest('.btn-inline');

  if(btn){
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);

  }


});


// RECIPE CONTROLLER

const controlRecipe =async () =>{
  //get ID From URL
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if(id){
    // prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //Highlight selected search item
    if (state.search){searchView.highlightSelected(id);}


    // create new recipe object
    state.recipe = new Recipe(id);


    try{
      // get recipe dataset and parse ingredienst

      await state.recipe.getRecipe();
      console.log(state.recipe);
      state.recipe.parseIngredients();



      // calculate servings and setTimeout(function ()
      state.recipe.calcTime();
      state.recipe.calcServings();
      //render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));


    } catch(err){
      console.log(err);
      clearLoader();}


  }
};


window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);


//SHOPPING LIST CONTROLLER

const controlList = () => {

  // create a new list if there is none stylesheet
  if (!state.list) state.list = new List();

  //add each ingredient to the LIST and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);

  });

  //
}

elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  if(e.target.matches('.shopping__delete, .shopping__delete *')){
    //delete from state
    state.list.deleteItem(id);

    //delete from UI
    listView.deleteItem(id);
  }
  else if(e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});


//LIKE CONTROLLER



const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
// user has NOT yet likes current recipe
  if(!state.likes.isLiked(currentID)){
    // add like to the staste
    const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
    //togle the like button
  likesView.toggleLikeBtn(true);
    // add like to UI list
    likesView.renderLike(newLike);

// user has likes current recipe
  }else {

    // remove like from the staste
state.likes.deleteLike(currentID);
    // toggle the like button


    likesView.toggleLikeBtn(false);

    // remove like from the UI list
    likesView.deleteLike(currentID);

  }
likesView.toggleLikeMenu(state.likes.getNumLikes());
}


window.addEventListener('load', ()=> {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  //render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});



//['haschange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


//handling recipe button clicks -> this way because the dom doesn't exist when loading the page

elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')){
    // decrease button is clicked // or any child of btn-decrease
    if (state.recipe.servings > 1){
    state.recipe.updateServings('dec');
    recipeView.updateServingsIngredients(state.recipe);
  }
  }
  else if (e.target.matches('.btn-increase, .btn-increase *')){
    // increase button is clicked // or any child of btn-inccrease
      state.recipe.updateServings('inc');
      recipeView.updateServingsIngredients(state.recipe);
  }
  else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
    //add ingredients
    controlList();
    }
  else if (e.target.matches('.recipe__love, .recipe__love *')){
    //like CONTROLLER
    controlLike();
  }
  console.log(state.recipe);
});
//testing

const l = new List();
