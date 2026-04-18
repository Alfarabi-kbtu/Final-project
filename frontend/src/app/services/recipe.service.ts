import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ICategoriesList, IRecipe } from '../models/models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  readonly BASE_URL = environment.apiUrl;

  constructor(private client: HttpClient) { }

  getRecipes(): Observable<IRecipe[]> {
    return this.client.get<IRecipe[]>(`${this.BASE_URL}/recipes/`);
  }

  getRecipesByCategory(id: number): Observable<IRecipe[]> {    
    return this.getRecipes().pipe(
      map((recipes: IRecipe[]) => {
        return recipes.filter((recipe: IRecipe) => recipe.category_id === id);
      })
    );
  }

  getCategoryByID(id: number): Observable<any> {
    return this.client.get<any>(`${this.BASE_URL}/categories/${id}`);
  }

  getCategories(): Observable<ICategoriesList[]> {
    return this.client.get<ICategoriesList[]>(`${this.BASE_URL}/categories`);
  }

  createRecipe(recipe: FormData): Observable<IRecipe> {
    return this.client.post<IRecipe>(`${this.BASE_URL}/recipes/create/`, recipe);
  }
}
