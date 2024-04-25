import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tutorial } from '../models/tutorial.model';

@Injectable({
  providedIn: 'root',
})
export class TutorialService {
  constructor(private http: HttpClient) {}
  
  tutorials: Tutorial[] = [
    {
      id: 1,
      title: "Beginners Node.js tutorial",
      description: "Level 1 Training "
    },
    {
      id: 2,
      title: "Beginners C# tutorial",
      description: "Level 1 Training "
    },
    {
      id: 3,
      title: "Beginners Java tutorial",
      description: "Level 1 Training "
    },
  ];
  tutorialsOb: Observable<Tutorial[]> = of(this.tutorials);

  getAll(): Observable<Tutorial[]> {
    return this.tutorialsOb
  }

  get(id: any): Observable<any> {
    return of(this.tutorials).pipe(
      // Use the map operator to transform the array into a single Tutorial object
      map((tutorialArray: Tutorial[]) => tutorialArray.find(tutorial => tutorial.id === id))
    );
  }

  create(data: any): Observable<any> {
    const newTutorial: Tutorial = { ...data, id: this.tutorials.length + 1 };
    this.tutorials.push(newTutorial);
    return of(newTutorial);
  }

  update(id: any, data: any): Observable<any> {
    const index = this.tutorials.findIndex(tutorial => tutorial.id === id);
    if (index !== -1) {
      const updatedTutorial: Tutorial = { ...this.tutorials[index], ...data };
      this.tutorials[index] = updatedTutorial;
      return of(updatedTutorial);
    } else {
      return of(null); // Return null if tutorial with given id is not found
    }
  }

  delete(id: any): Observable<any> {
    const index = this.tutorials.findIndex(tutorial => tutorial.id === id);
    if (index !== -1) {
      const deletedTutorial = this.tutorials.splice(index, 1)[0];
      return of(deletedTutorial); // Return the deleted tutorial as an observable
    } else {
      return of(null); // Return null if tutorial with given id is not found
    }
  }

  deleteAll(): Observable<any> {
    const deletedTutorials = this.tutorials.slice(); // Make a copy of the array
    this.tutorials = []; // Clear the tutorials array
    return of(deletedTutorials);
  }

  findByTitle(title: any): Observable<Tutorial[]> {
    return of(this.tutorials).pipe(
      map((tutorialArray: Tutorial[]) => tutorialArray.filter(tutorial => tutorial.title === title)));
  }
}
