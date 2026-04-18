import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { RecipeService } from 'src/app/services/recipe.service';
import { ICategory } from 'src/app/models/models';

import { getCategories } from 'src/app/layouts/main/generator';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.scss']
})
export class CreateRecipeComponent implements OnInit, OnDestroy {
  username: string = '';

  categoriesList: ICategory[] = [];

  selectedCategory: any;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  createRecipeForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl(null, Validators.required),
    steps: new FormControl('', [Validators.required]),
  });

  constructor(private recipeService: RecipeService, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<CreateRecipeComponent>) { }

  ngOnInit(): void {
    this.username = this.data.username;
    this.categoriesList = getCategories;
  }

  ngOnDestroy(): void {
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
      this.imagePreview = null;
    }
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.imagePreview = URL.createObjectURL(file);
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit(): void {
    if (!this.createRecipeForm.valid || !this.selectedFile) {
      return;
    }
    const formData = this.createRecipeForm.value;
    const categoryId = Number(formData.category);

    const fd = new FormData();
    fd.append('username', localStorage.getItem('username') || '');
    fd.append('name', formData.name!);
    fd.append('description', formData.description!);
    fd.append('steps', formData.steps!);
    fd.append('category_id', String(categoryId));
    fd.append('image', this.selectedFile, this.selectedFile.name);

    this.recipeService.createRecipe(fd).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (error) => {
        console.log('Error: ', error);
      },
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  isValidCategory(category: any): boolean {
    const validCategories = ['Salad', 'Italian', 'Meat', 'Burger', 'Soup'];
    return validCategories.includes(category);
  }
}
